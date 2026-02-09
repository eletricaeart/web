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
        const localDataString = localStorage.getItem(cacheKey) || "[]";
        const remoteDataString = JSON.stringify(remoteData);

        // 1. Só grava no disco se houver mudança real
        if (remoteDataString !== localDataString) {
          localStorage.setItem(cacheKey, remoteDataString);
          console.log(`✅ EASync: ${entity} atualizado no cache.`);
        }

        // 2. SEMPRE dispara o evento ao finalizar o fetch
        // Isso garante que o hideLoading() das páginas seja chamado
        window.dispatchEvent(
          new CustomEvent(`sync_ready_${entity}`, {
            detail: remoteData,
          }),
        );

        console.log(`📡 EASync: Sincronização de ${entity} finalizada.`);
      }
    } catch (error) {
      console.warn(`📡 EASync: Erro ou Offline para ${entity}.`);

      // 3. Em caso de erro, também avisamos a página para fechar o loading
      // e passamos o que temos no cache local para não quebrar a tela
      window.dispatchEvent(
        new CustomEvent(`sync_ready_${entity}`, {
          detail: JSON.parse(localStorage.getItem(cacheKey) || "[]"),
        }),
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
