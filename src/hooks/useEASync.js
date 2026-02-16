// src/hooks/useEASync.js
import { useState, useEffect } from "react";
import { env } from "../services/env"; // Mantenha seus endpoints

const CONFIG = {
  orcamentos: {
    cacheKey: "ea_orcamentos_cache",
    endpoint: env.endpoints.budgets,
  },
  clients: { cacheKey: "ea_clients_cache", endpoint: env.endpoints.clients },
  notes: { cacheKey: "ea_notes_cache", endpoint: env.endpoints.notes },
};

export function useEASync(entity) {
  const { cacheKey, endpoint } = CONFIG[entity];
  const [data, setData] = useState(() => {
    // Inicializa com o que já existe no celular do Rafael
    const saved = localStorage.getItem(cacheKey);
    return saved ? JSON.parse(saved) : [];
  });

  // Sincronização automática (SmartPull)
  useEffect(() => {
    const lastSync = localStorage.getItem(`${cacheKey}_last_sync`);
    const oneHour = 60 * 60 * 1000;

    if (!lastSync || Date.now() - lastSync > oneHour) {
      pull();
    }
  }, [entity]);

  const pull = async () => {
    try {
      const response = await fetch(endpoint);
      const remoteData = await response.json();
      if (Array.isArray(remoteData)) {
        updateLocal(remoteData);
      }
    } catch (error) {
      console.warn(`EASync Offline: ${entity}`);
    }
  };

  const updateLocal = (newData) => {
    setData(newData);
    localStorage.setItem(cacheKey, JSON.stringify(newData));
    localStorage.setItem(`${cacheKey}_last_sync`, Date.now());
  };

  const save = async (payload, action = "create") => {
    try {
      // Prepara o envio como URLSearchParams para o GAS
      const formData = new URLSearchParams();
      formData.append("data", JSON.stringify({ action, ...payload }));

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      // Atualização Otimista do Estado Local
      let updatedList = [...data];
      if (action === "delete") {
        updatedList = updatedList.filter(
          (item) => String(item.id).trim() !== String(payload.id).trim(),
        );
      } else {
        const index = updatedList.findIndex(
          (item) => String(item.id).trim() === String(payload.id).trim(),
        );
        const finalItem = {
          ...payload,
          id: action === "create" ? result.id : payload.id,
        };

        if (index > -1) updatedList[index] = finalItem;
        else updatedList.push(finalItem);
      }

      updateLocal(updatedList);
      return { success: true };
    } catch (error) {
      console.error("Erro ao salvar:", error);
      return { success: false };
    }
  };

  return { data, save, pull };
}
