/**
 * EASync.js - Motor de Sincronização Proativa Elétrica & Art
 */
const EASync = {
  // Configuração das entidades e suas chaves de cache
  config: {
    orcamentos: {
      cacheKey: "ea_orcamentos_cache",
      endpoint: env.endpoints.budgets,
    },
    clients: { cacheKey: "ea_clients_cache", endpoint: env.endpoints.clients },
    notes: { cacheKey: "ea_notes_cache", endpoint: env.endpoints.notes },
  },

  // 1. Inicializa a sincronização proativa
  async init() {
    console.log("🚀 EASync: Iniciando sincronização em segundo plano...");
    for (const entity in this.config) {
      this.pull(entity);
    }
  },

  // 2. "Puxa" dados do GS para o LocalStorage silenciosamente
  async pull(entity) {
    const { cacheKey, endpoint } = this.config[entity];

    try {
      const response = await fetch(endpoint);
      const remoteData = await response.json();

      if (Array.isArray(remoteData)) {
        const localData = JSON.parse(localStorage.getItem(cacheKey) || "[]");

        // Só atualiza se houver mudança real (evita re-renderizações desnecessárias)
        if (JSON.stringify(remoteData) !== JSON.stringify(localData)) {
          localStorage.setItem(cacheKey, JSON.stringify(remoteData));

          // Dispara evento global para avisar as páginas abertas
          window.dispatchEvent(
            new CustomEvent(`sync_ready_${entity}`, {
              detail: remoteData,
            }),
          );
          console.log(`✅ EASync: ${entity} sincronizado.`);
        }
      }
    } catch (error) {
      console.warn(
        `📡 EASync: Modo offline para ${entity}. Usando cache local.`,
      );
    }
  },

  // 3. Salva um item (Local primeiro, GS depois)
  async save(entity, data, action = "save") {
    const { cacheKey, endpoint } = this.config[entity];
    let localData = JSON.parse(localStorage.getItem(cacheKey) || "[]");

    // Atualização Otimista no LocalStorage
    const index = localData.findIndex((item) => item.id === data.id);
    if (index > -1) localData[index] = data;
    else localData.push(data);

    localStorage.setItem(cacheKey, JSON.stringify(localData));

    // Dispara atualização imediata na UI
    window.dispatchEvent(
      new CustomEvent(`sync_ready_${entity}`, { detail: localData }),
    );

    // Envio para o GS em segundo plano (sem travar o usuário)
    try {
      await fetch(endpoint, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({
          action: action === "save" ? `save_${entity.slice(0, -1)}` : action,
          ...data,
        }),
      });
      return { success: true };
    } catch (error) {
      console.error(
        `❌ EASync: Erro ao enviar ${entity} para o servidor.`,
        error,
      );
      return { success: false, error };
    }
  },
};

// Auto-inicialização ao carregar o script
EASync.init();
