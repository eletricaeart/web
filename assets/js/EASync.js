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

  async save(entity, data, action = "save") {
    const { cacheKey, endpoint } = this.config[entity];
    let localData = JSON.parse(localStorage.getItem(cacheKey) || "[]");

    const index = localData.findIndex((item) => item.id === data.id);
    if (index > -1) localData[index] = data;
    else localData.push(data);

    localStorage.setItem(cacheKey, JSON.stringify(localData));
    window.dispatchEvent(
      new CustomEvent(`sync_ready_${entity}`, { detail: localData }),
    );

    try {
      await fetch(endpoint, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({
          action: action === "save" ? `save_${entity.slice(0, -1)}` : action,
          ...data,
        }),
      });
      // Forçamos a atualização do timestamp após um save bem sucedido
      // para garantir que o cache local reflita o estado do servidor
      localStorage.setItem(`${cacheKey}_last_sync`, Date.now());
      return { success: true };
    } catch (error) {
      console.error(`❌ EASync: Erro ao enviar ${entity}.`, error);
      return { success: false, error };
    }
  },
};

EASync.init();
