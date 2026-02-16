import { env } from "../config/env"; // Converteremos o env.js para um objeto simples

const CACHE_EXPIRATION = 60 * 60 * 1000; // 1 hora

const config = {
  orcamentos: {
    cacheKey: "ea_orcamentos_cache",
    endpoint: env.endpoints.budgets,
  },
  clients: { cacheKey: "ea_clients_cache", endpoint: env.endpoints.clients },
  notes: { cacheKey: "ea_notes_cache", endpoint: env.endpoints.notes },
};

const EASyncService = {
  async pull(entity) {
    const { cacheKey, endpoint } = config[entity];
    const lastSyncKey = `${cacheKey}_last_sync`;

    try {
      const response = await fetch(endpoint);
      const remoteData = await response.json();

      if (Array.isArray(remoteData)) {
        localStorage.setItem(cacheKey, JSON.stringify(remoteData));
        localStorage.setItem(lastSyncKey, Date.now().toString());
        return remoteData;
      }
    } catch (error) {
      console.warn(`📡 EASync: Modo Offline para ${entity}.`);
      return JSON.parse(localStorage.getItem(cacheKey) || "[]");
    }
  },

  async getCachedData(entity) {
    const { cacheKey } = config[entity];
    const lastSyncKey = `${cacheKey}_last_sync`;
    const lastSync = localStorage.getItem(lastSyncKey);
    const now = Date.now();

    if (!lastSync || now - parseInt(lastSync) > CACHE_EXPIRATION) {
      return await this.pull(entity);
    }
    return JSON.parse(localStorage.getItem(cacheKey) || "[]");
  },

  async save(entity, data, action = "create") {
    const { cacheKey, endpoint } = config[entity];

    try {
      let response;
      if (action === "delete") {
        const url = `${endpoint}?action=delete&id=${encodeURIComponent(data.id)}`;
        response = await fetch(url);
      } else {
        const payload = { action, ...data };
        const formData = new URLSearchParams();
        formData.append("data", JSON.stringify(payload));

        response = await fetch(endpoint, {
          method: "POST",
          body: formData,
        });
      }

      const text = await response.text();
      const result = JSON.parse(text);

      // Validação de status conforme original
      const validStatus = {
        create: "created",
        update: "updated",
        delete: "deleted",
      };
      if (result.status !== validStatus[action]) {
        throw new Error("Operação não confirmada pelo servidor.");
      }

      if (action === "create") data.id = result.id;

      // Atualização do Cache Local
      let localData = JSON.parse(localStorage.getItem(cacheKey) || "[]");
      if (action === "delete") {
        localData = localData.filter(
          (item) => String(item.id) !== String(data.id),
        );
      } else {
        const index = localData.findIndex(
          (item) => String(item.id) === String(data.id),
        );
        if (index > -1) localData[index] = data;
        else localData.push(data);
      }

      localStorage.setItem(cacheKey, JSON.stringify(localData));
      return { success: true, data };
    } catch (error) {
      console.error(`❌ EASync Service Error:`, error);
      return { success: false, error };
    }
  },
};

export default EASyncService;
