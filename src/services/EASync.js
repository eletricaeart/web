/**
 * EASync.js - Motor de Sincronização Proativa (VERSÃO REACT)
 */
import { env } from "./env.js";

const EASync = {
  CACHE_EXPIRATION: 60 * 60 * 1000,

  config: {
    orcamentos: {
      cacheKey: "ea_orcamentos_cache",
      endpoint: env.endpoints.budgets,
    },
    clients: {
      cacheKey: "ea_clients_cache",
      endpoint: env.endpoints.clients,
    },
    notes: {
      cacheKey: "ea_notes_cache",
      endpoint: env.endpoints.notes,
    },
  },

  async init() {
    console.log("🚀 EASync: Iniciando motor...");
    for (const entity in this.config) {
      this.smartPull(entity);
    }
  },

  async pull(entity) {
    const { cacheKey, endpoint } = this.config[entity];
    const lastSyncKey = `${cacheKey}_last_sync`;

    try {
      const response = await fetch(endpoint);
      const remoteData = await response.json();

      if (Array.isArray(remoteData)) {
        const remoteDataString = JSON.stringify(remoteData);
        const localDataString = localStorage.getItem(cacheKey) || "[]";

        if (remoteDataString !== localDataString) {
          localStorage.setItem(cacheKey, remoteDataString);
        }

        localStorage.setItem(lastSyncKey, Date.now());

        window.dispatchEvent(
          new CustomEvent(`sync_ready_${entity}`, {
            detail: remoteData,
          }),
        );
      }
    } catch (error) {
      console.warn(`Modo Offline para ${entity}`);

      window.dispatchEvent(
        new CustomEvent(`sync_ready_${entity}`, {
          detail: JSON.parse(localStorage.getItem(cacheKey) || "[]"),
        }),
      );
    }
  },

  async smartPull(entity) {
    const { cacheKey } = this.config[entity];
    const lastSyncKey = `${cacheKey}_last_sync`;

    const lastSync = localStorage.getItem(lastSyncKey);
    const now = Date.now();

    if (!lastSync || now - lastSync > this.CACHE_EXPIRATION) {
      await this.pull(entity);
    } else {
      window.dispatchEvent(
        new CustomEvent(`sync_ready_${entity}`, {
          detail: JSON.parse(localStorage.getItem(cacheKey) || "[]"),
        }),
      );
    }
  },

  async save(entity, data, action = "create") {
    const { cacheKey, endpoint } = this.config[entity];

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

      if (
        (action === "delete" && result.status !== "deleted") ||
        (action === "create" && result.status !== "created") ||
        (action === "update" && result.status !== "updated")
      ) {
        throw new Error("Operação não confirmada.");
      }

      let localData = JSON.parse(localStorage.getItem(cacheKey) || "[]");

      if (action === "delete") {
        localData = localData.filter(
          (item) => String(item.id).trim() !== String(data.id).trim(),
        );
      } else {
        const index = localData.findIndex(
          (item) => String(item.id).trim() === String(data.id).trim(),
        );

        if (index > -1) localData[index] = data;
        else localData.push(data);
      }

      localStorage.setItem(cacheKey, JSON.stringify(localData));
      localStorage.setItem(`${cacheKey}_last_sync`, Date.now());

      window.dispatchEvent(
        new CustomEvent(`sync_ready_${entity}`, {
          detail: localData,
        }),
      );

      return { success: true };
    } catch (err) {
      console.error("Erro:", err);
      return { success: false };
    }
  },
};

export default EASync;
