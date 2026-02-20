import { useState, useEffect, useCallback } from "react";
import EASync from "../services/EASync";

export function useEASync(entity) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const handleSync = (e) => {
      setData(e.detail || []);
    };

    window.addEventListener(`sync_ready_${entity}`, handleSync);

    // 🔥 Aqui agora o EASync existe
    EASync.smartPull(entity);

    return () => {
      window.removeEventListener(`sync_ready_${entity}`, handleSync);
    };
  }, [entity]);

  const save = useCallback(
    async (payload, action = "create") => {
      const result = await EASync.save(entity, payload, action);

      // força atualização após salvar/deletar
      await EASync.pull(entity);

      return result;
    },
    [entity],
  );

  const pull = useCallback(async () => {
    await EASync.pull(entity);
  }, [entity]);

  return {
    data,
    save,
    pull,
  };
}
