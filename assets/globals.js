
addEventListener( "load", () => {
      // const data = {
      //   title: "Elétrica & Art-Orçamento",
      //   cliente: {
      //     name: "",
      //     address: "",
      //   },
      //   docTitle: {
      //     subtitle: "",
      //     emissao: "",
      //     validade: "",
      //     text: "",
      //   },
      // };

      dom.title = `${ data.title }_${ data.cliente.name }-${ data.docTitle.emissao.replace( /\//g, "-" ) }`;

      docTitle.text( `${ data.docTitle.text || "SERVIÇOS DE PINTURA E ELÉTRICA" }` );
      docTitle.setAttributes( [
        [ "subtitle", `${ data.docTitle.subtitle || "PROPOSTA DE ORÇAMENTO" }` ],
        [ "emissao", `${ data.docTitle.emissao || new Date().toLocaleDateString( "pt-br" ) }` ],
        [ "validade", `${ data.docTitle.validade || "15 dias" }` ],
      ] );

      cliente.setAttributes( [
        [ "nome", `${ data.cliente.name || "Nome não fornecido" }` ],
        [ "endereço", `${ data.cliente.address || "Endereço não fornecido" }` ],
      ] );

      pageFooter.html( `Elétrica & Art &copy; ${ new Date().getFullYear() } - Todos os direitos reservados` );
    } );

