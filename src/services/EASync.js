// src/services/EASync.js
import { env } from "../config/env";

const endpoint = env.endpoint; // Crie esta variável no seu env.js com a URL do novo script

const EASync = {
  CACHE_EXPIRATION: 60 * 60 * 1000,

  config: {
    // Mapeamento Unificado (Chave: Configuração)
    orcamentos: { cacheKey: "ea_orcamentos_cache" },
    clientes: { cacheKey: "ea_clients_cache" },
    notas: { cacheKey: "ea_notes_cache" },
    usuarios: { cacheKey: "ea_users_cache" },

    // Apelidos para compatibilidade com o código antigo
    clients: { cacheKey: "ea_clients_cache" }, // Aponta para o mesmo cache
    notes: { cacheKey: "ea_notes_cache" },
    budgets: { cacheKey: "ea_orcamentos_cache" },
  },

  async pull(entity) {
    const { cacheKey } = this.config[entity];
    try {
      // Passamos a entidade via URL para o Google saber qual aba ler
      const response = await fetch(`${endpoint}?entity=${entity}`);
      const remoteData = await response.json();

      if (Array.isArray(remoteData)) {
        localStorage.setItem(cacheKey, JSON.stringify(remoteData));
        localStorage.setItem(`${cacheKey}_last_sync`, Date.now());

        window.dispatchEvent(
          new CustomEvent(`sync_ready_${entity}`, { detail: remoteData }),
        );
        return remoteData;
      }
      return []; // retorna vazio se não for array;
    } catch (error) {
      const local = JSON.parse(localStorage.getItem(cacheKey) || "[]");
      window.dispatchEvent(
        new CustomEvent(`sync_ready_${entity}`, { detail: local }),
      );
      return local;
    }
  },

  async save(entity, data, action = "create") {
    const { cacheKey } = this.config[entity];
    try {
      let response;
      if (action === "delete") {
        response = await fetch(
          `${endpoint}?entity=${entity}&action=delete&id=${encodeURIComponent(data.id)}`,
        );
      } else {
        const payload = { entity, action, ...data }; // Injetamos a 'entity' no corpo
        const formData = new URLSearchParams();
        formData.append("data", JSON.stringify(payload));

        response = await fetch(endpoint, {
          method: "POST",
          body: formData,
        });
      }

      const result = await response.json();
      if (result.status === "error") throw new Error(result.message);

      await this.pull(entity); // Atualiza cache local após salvar
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // Mantemos o smartPull para evitar furos de performance
  async smartPull(entity) {
    const lastSync = localStorage.getItem(
      `${this.config[entity].cacheKey}_last_sync`,
    );
    if (!lastSync || Date.now() - lastSync > this.CACHE_EXPIRATION) {
      await this.pull(entity);
    } else {
      const local = JSON.parse(
        localStorage.getItem(this.config[entity].cacheKey) || "[]",
      );
      window.dispatchEvent(
        new CustomEvent(`sync_ready_${entity}`, { detail: local }),
      );
    }
  },
};

export default EASync;
