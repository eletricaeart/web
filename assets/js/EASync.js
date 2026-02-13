/**
 * EASync.js - Motor de Sincronização Proativa Elétrica & Art
 */
const EASync = {
  // Configuração: 1 hora de validade para o cache automático
  CACHE_EXPIRATION: 60 * 60 * 1000,

  config: {
    orcamentos: {
      cacheKey: "ea_orcamentos_cache",
      endpoint: env.endpoints.budgets,
    },
    clients: { cacheKey: "ea_clients_cache", endpoint: env.endpoints.clients },
    notes: { cacheKey: "ea_notes_cache", endpoint: env.endpoints.notes },
  },

  async init() {
    console.log("🚀 EASync: Iniciando motor de sincronização...");
    for (const entity in this.config) {
      this.smartPull(entity);
    }
  },

  // pull()
  async pull(entity) {
    const { cacheKey, endpoint } = this.config[entity];
    const lastSyncKey = `${cacheKey}_last_sync`;

    try {
      const response = await fetch(endpoint);
      const remoteData = await response.json();

      if (Array.isArray(remoteData)) {
        const localDataString = localStorage.getItem(cacheKey) || "[]";
        const remoteDataString = JSON.stringify(remoteData);

        if (remoteDataString !== localDataString) {
          localStorage.setItem(cacheKey, remoteDataString);
          console.log(`✅ EASync: ${entity} atualizado no cache.`);
        }

        // Atualiza o timestamp da última sincronização bem-sucedida
        localStorage.setItem(lastSyncKey, Date.now());

        window.dispatchEvent(
          new CustomEvent(`sync_ready_${entity}`, { detail: remoteData }),
        );
        console.log(`📡 EASync: Sincronização de ${entity} finalizada.`);
      }
    } catch (error) {
      console.warn(`📡 EASync: Modo Offline para ${entity}.`);
      window.dispatchEvent(
        new CustomEvent(`sync_ready_${entity}`, {
          detail: JSON.parse(localStorage.getItem(cacheKey) || "[]"),
        }),
      );
    }
  },
  // --- end pull() ---

  // smartPull()
  async smartPull(entity) {
    const { cacheKey } = this.config[entity];
    const lastSyncKey = `${cacheKey}_last_sync`;
    const lastSync = localStorage.getItem(lastSyncKey);
    const now = Date.now();

    // Lógica: Se não houver sincronização anterior ou o tempo expirou
    if (!lastSync || now - lastSync > this.CACHE_EXPIRATION) {
      console.log(`📡 EASync: Cache de ${entity} expirado. Buscando nuvem...`);
      await this.pull(entity);
    } else {
      console.log(`✅ EASync: Usando cache recente para ${entity}.`);
      window.dispatchEvent(
        new CustomEvent(`sync_ready_${entity}`, {
          detail: JSON.parse(localStorage.getItem(cacheKey) || "[]"),
        }),
      );
    }
  },
  // --- end smartPull() ---

  /**
   * EASync.js - Função Save Corrigida
   */
  async save(entity, data, action = "create") {
    const { cacheKey, endpoint } = this.config[entity];

    try {
      let response;

      // 🔥 DELETE usa GET (mais confiável no GAS)
      if (action === "delete") {
        const url = `${endpoint}?action=delete&id=${encodeURIComponent(data.id)}`;
        response = await fetch(url);
      } else {
        const payload = {
          action,
          ...data,
        };

        /*
        response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        */ // uncomment aqui <-- :here

        // delete aqui V :here
        const formData = new URLSearchParams();
        formData.append("data", JSON.stringify(payload));

        response = await fetch(endpoint, {
          method: "POST",
          body: formData,
        });
        // --- end ---
      }

      // const result = await response.json();
      const text = await response.text();
      console.log("Resposta bruta do servidor:", text);

      let result;
      try {
        result = JSON.parse(text);
      } catch (e) {
        console.error("Resposta não é JSON válido!");
        throw e;
      }

      if (action === "create" && result.status === "created") {
        data.id = result.id; // substitui TEMP pelo ID real do Google Sheets
      }

      // 🔥 AQUI ENTRA O AJUSTE
      if (action === "create" && result.status === "created") {
        data.id = result.id; // substitui TEMP pelo ID real do Google Sheets
      }

      if (
        (action === "delete" && result.status !== "deleted") ||
        (action === "create" && result.status !== "created") ||
        (action === "update" && result.status !== "updated")
      ) {
        throw new Error("Operação não confirmada pelo servidor.");
      }

      // 🔁 Atualiza cache SOMENTE se deu certo
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
        new CustomEvent(`sync_ready_${entity}`, { detail: localData }),
      );

      return { success: true };
    } catch (error) {
      console.error(`❌ EASync: Erro na operação de ${entity}.`, error);

      window.dispatchEvent(
        new CustomEvent(`sync_ready_${entity}`, {
          detail: JSON.parse(localStorage.getItem(cacheKey) || "[]"),
        }),
      );

      return { success: false, error };
    }
  },
  // --- end save ---
};

EASync.init();
