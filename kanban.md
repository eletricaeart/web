### implementar

- Validação de Dados: Garantir que o sistema não tente salvar um orçamento sem nome de cliente ou com campos vazios (o que chamamos de fail-fast).
- Segurança de Cache: O localStorage é ótimo, mas se o Rafael trocar de celular, ele perde as notas que não foram sincronizadas. A sua lógica de "Sincronizar" no FAB resolve isso, mas eu tornaria a sincronização mais automática (em segundo plano).

### modificar

- dependência de IDs gerados por Date.now() + Math.random() em vez de um UUID real
