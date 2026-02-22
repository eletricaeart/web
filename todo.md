### bugs

[] --- <budgets> card de orçamento:

- mostrar data simplificada
- mostrar nome simplificado em uma unica linha e cortar parte do nome para visualização se o nome for mito grande
- mostrar titulo simplificado como as regras para o nome no card.

[] --- <orçamento>

- substituir a para o modelo animação skeleton do shadcn
- css do pdf
- css da visualização
- em budgets, ao entrar em editar e sair de alguma forma sem salvar, os dados temporarios (edit_budget_data) ficam salvos quando eram para serem destruidos
- em orçamento, ao editar um orçamento não está carregando os dados do orçamento

[] --- <Clientes>

- em perfil, clicando em novo orçamento, em ls salva ea_selected_client e vai para tela 404

[] --- <FAB>

<!-- - mudar a localização do botão para ficar mais abaixo se a BottomNavBar não estiver na pagina -->

[] --- <AppBar>

<!-- - adicionar o backbutton para telas onde não tem a BottomNavBar -->

[] --- <sistema de carregamento das paginas: budgets, clientes, notas>

- se existir dados para a pagina salvos em ls e a pagina precisar verificar por atualizações, ela não deve mostrar a pagina em branco e sim mostrar os cards prontos para cada item existente em ls, e após ter realizado a tarefa de sincronizar os dados do gs e trazelos para ls e após ter tido sucesso então os dados da pagina devem ser atualizados com os novos dados salvos em ls
