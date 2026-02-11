### implementar

- Validação de Dados: Garantir que o sistema não tente salvar um orçamento sem nome de cliente ou com campos vazios (o que chamamos de fail-fast).
- Segurança de Cache: O localStorage é ótimo, mas se o Rafael trocar de celular, ele perde as notas que não foram sincronizadas. A sua lógica de "Sincronizar" no FAB resolve isso, mas eu tornaria a sincronização mais automática (em segundo plano).

- botão voltar não deve voltar para certas telas
- em novo orçamento, clicando em criar novo cliente, salvando esse cliente eu sou levado para a tela de clientes ao inves de voltar para a tela de novo orçamento com os dados preenchidos
-

### modificar

- dependência de IDs gerados por Date.now() + Math.random() em vez de um UUID real
