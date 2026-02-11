### implementar

- Validação de Dados: Garantir que o sistema não tente salvar um orçamento sem nome de cliente ou com campos vazios (o que chamamos de fail-fast).
- Segurança de Cache: O localStorage é ótimo, mas se o Rafael trocar de celular, ele perde as notas que não foram sincronizadas. A sua lógica de "Sincronizar" no FAB resolve isso, mas eu tornaria a sincronização mais automática (em segundo plano).

- botão voltar não deve voltar para certas telas
- deletar card de orcamento nao deleta o orcamento e mostra a tela de dashboard em branco, e se eu clicar em symcronizar os cards de orcamentos retornam intactos
- cards de orcamentos devem mostrar a imagem de perfil do cliente, remover tambem a borda colorida do card
- alterar o modo de visualizacao dos cards de notas para o modo grid por padrao e manter o botao com as opcoes de alternar o modo de visualizacao dos cards
- diminuir ao ponto de quase remover o tempo de animacao de quando clico no botao de opcoes da AppBar para fechar o menu
- adicionar na visualizacao do cliente a opcao de criar ou adicionar um orcamento e nova nota, as opcoes devem ser inseridas no menu de 3 pontinhos verticais
- na tela de novo orcamento, a primeira clausula deve vir por padrao adicionada para esperar o rafael digitar suas informaçoes, e quando clicar em adicionar nova clausula, a primeira subclausula deve vir por padrao ativada para esperar pelas informacoes serem inseridas
- na tela de novo orcamento quando clico em nova clausula o cursor deve ir altomaticamente para dentro do input da clausula, ao clicar em adicionar nova subclausula o cursor deve ir automaticamente para dentro do input de subtitulo da aubclausula
- 

### modificar

- dependência de IDs gerados por Date.now() + Math.random() em vez de um UUID real
