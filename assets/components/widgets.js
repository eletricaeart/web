

"use strict";
/* == [ properties ]
== == == == == == == == == */
const 
  _ = ( ...v ) => console.log( ...v )
  ,
  table = v => console.table( v )
  ,
  toBrl = v => v.toLocaleString( "pt-br", { "style": "currency", "currency": "BRL" } )
  ,
  brlToInt = v => {
    return(
      parseInt( v.replace( "R$", "" ).replaceAll( ".", "" ).replace( ",00", "" ) )
    );
  } 
  ,
  brlToFloat = v => {
    return(
      parseFloat( v.replace( "R$", "" ).replaceAll( ".", "" ).replace( ",", "." ) )
    );
  } 
  ,
  fix = v => v.toFixed( 2 )
  ,
  add0 = v => {
    if( v < 10 ) {
      return( `0${ v }` );
    } else {
      return( v );
    }
  }
;

function FormatNumber( link ) {
  let data = link;
  data = data.replaceAll( /\(/gi, "" );
  data = data.replaceAll( /\)/gi, "" );
  data = data.replaceAll( /\-/gi, "" );
  data = data.replaceAll( /\ /gi, "" );
  return data;
}

String.prototype.data = function( v ) {
  return(
    JSON.parse( this )
  );
};

/* -------------------------------- */



/* == [ events ]
== == == == == == == == == */
window.addEventListener( "load", ev => {
	
  /* == [ navlink ] 
  == == == == == == == == == */
  $$( "navlink" ).forEach( nl => {  
    _( "oi" );
    nl.outerHTML = `
      <p>
        <a href="${ nl.getAttribute( "to" ) }"
          target="_blank" >
            ${ nl.innerText }
        </a>
      </p>
    `;
  } );

  $$( "[link]" ).forEach( link => {
    link.addEventListener( "click", () => {
      window.open( link.getAttribute( "link" ), "_blank" );
    } );
  } );
   
  /* == [ bg ] 
  == == == == == == == == == */
  $$( "[bg]" ).forEach( p => {
    p.style.background = p.getAttribute( "bg" );
  } );
   
  /* == [ color ] 
  == == == == == == == == == */
  $$( "[color]" ).forEach( p => {
    p.style.color = p.getAttribute( "color" );
  } );
   
  /* == [ margin ] 
  == == == == == == == == == */
  $$( "[m]" ).forEach( p => {
    p.style.margin = p.getAttribute( "m" );
  } );
   
  /* == [ padding ] 
  == == == == == == == == == */
  $$( "[pd]" ).forEach( p => {
    p.style.padding = p.getAttribute( "pd" );
  } );
   
  /* == [ gap ] 
  == == == == == == == == == */
  $$( "[gap]" ).forEach( g => {
    g.style.gap = g.getAttribute( "gap" );
  } );
   
  /* == [ aspect ratio ] 
  == == == == == == == == == */
  $$( "[ratio]" ).forEach( ratio => {
    ratio.style.aspectRatio = ratio.getAttribute( "ratio" );
  } );

  if( $$( "body" ) instanceof NodeList ) {
    _(
      "body instanceOf NodeList"
    );
  }



  /**
   * doc-title 
   * */
  $$( "doc-title" ).forEach( ( title, i ) => {
    let data = title.getAttribute( "subtitle" ) ? `
      <t style='font-weight: 700; color: var( --sv-azul-bebe )'>
        ${ title.getAttribute( "subtitle" ) }
      </t>
    ` : null;

    return( title.innerHTML = `
      ${ data && data }
        <t style='font-weight: 700; color: #003b6b\'>
          ${ title.innerHTML }
        </t>
        <t 
          id="doc_id" 
          style="background: #fff; width: 100%; padding: .2em;     margin: .2em 0 0; display: flex
; align-items: center; justify-content: end; gap: 1em; font-size: .8em;"
        >
          <b>Data de Emissão: </b>
          <t>${ title.getAttribute( "emissao" ) }</t>
          <t style="font-weight: 700; padding: 0 .5em;"> | </t>
          <b>Validade da Proposta: </b>
          <t>${title.getAttribute( "validade" ) }</t>
        </t>
      ` );
      
   } );



   /**
    * laudo 
    * */
   $$( "titulo" ).forEach( ( title, i ) => {
      let 
         data = title.getAttribute( "subtitle" ) ? `
            <t2 style='font-weight: 700; color: var( --sv-azul-bebe )'>
               ${ title.getAttribute( "subtitle" ) }
            </t2>
         ` : null
      ;

      return( title.innerHTML = `
         ${ data && data }
         <t3 style='font-weight: 700; color: #003b6b\'>
            ${ title.innerHTML }
         </t3>
      ` );
      
   } );

   /**
    * article 
    * */
   $$( "article" ).forEach( ( article, i ) => {
      let 
         children = article.innerHTML 
      ;
      if( article.getAttribute( "label" ) ) {
         article.innerHTML = `
            <ui>
               <header>
                  <ui>
                     <t style="font-weight: 700; text-transform: uppercase;">
                        ${ article.getAttribute( "label" ) }
                     </t>
                  </ui>
               </header>
               <content>
                  ${ children }
               </content>
            </ui>
         `;
      }
   } );

   /**
    * section 
    * */
   $$( "section" ).forEach( ( section, i ) => {
      let 
         children = section.innerHTML 
      ;
      if( section.getAttribute( "label" ) ) {
         section.innerHTML = `
            <ui>
               <header>
                  <t6>
                     ${ section.getAttribute( "label" ) }
                  </t6>
               </header>
               <content>
                  ${ children }
               </content>
            </ui>
         `;
      }
   } );

   /**
    * article laudo
    * */
   $$( "article[laudo]" ).forEach( ( article, i ) => {
      let 
         children = article.innerHTML 
      ;
      if( article.getAttribute( "label" ) ) {
         article.innerHTML = `
            <ui>
               <header>
                  <ui>
                     <t style="font-weight: 700; text-transform: uppercase;">
                        ${ article.getAttribute( "label" ) }
                     </t>
                  </ui>
               </header>
               <content>
                  ${ children }
               </content>
            </ui>
         `;
      }
   } );

   /**
    * section laudo
    * */
   $$( "section[laudo]" ).forEach( ( section, i ) => {
      let 
         children = section.innerHTML 
      ;
      if( section.getAttribute( "label" ) ) {
         section.innerHTML = `
            <ui>
               <header>
                  <t6>
                     ${ section.getAttribute( "label" ) }
                  </t6>
               </header>
               <content>
                  ${ children }
               </content>
            </ui>
         `;
      }
   } );


   /**
    * cliente 
    * */
   $$( "cliente" ).forEach( ( cliente, i ) => {
      let 
         children = cliente.innerHTML 
         ,
         nome = `
            <t>
               <b>Nome </b> ${ cliente.getAttribute( "nome" ) }
            </t>` || null
         ,
         endereço = `
            <t>
               <b>Endereço </b>
               ${ cliente.getAttribute( "endereço" )  }
            </t>` || null
      ;
      cliente.innerHTML = `
        <ui>
          <header>
            <ui>
              <t style="font-weight: 700; text-transform: uppercase;">
                Cliente
              </t>
            </ui>
          </header>
          <content>
            <card>
              <ui>
                ${ nome && nome }
                ${ endereço && endereço }
                ${ children && children }
              </ui>
            </card>
          </content>
        </ui>
      `;
/* // --- old style ---
      cliente.innerHTML = `
         <ui>
            <header>
               <ui>
                  Cliente 
               </ui>
            </header>
            <content>
               <card>
                  <ui>
                     ${ nome && nome }
                     ${ endereço && endereço }
                     ${ children && children }
                  </ui>
               </card>
            </content>
         </ui>
      `;
      */
   } );


   /**
    * condominio 
    * */
   $$( "condominio" ).forEach( ( condominio, i ) => {
      let 
         children = condominio.innerHTML 
         ,
         nome = `
            <t>
               <b>Condomínio </b> 
               <ul>
                  <b>Nome: </b> ${ condominio.getAttribute( "nome" ) } <br>
                  <b>CNPJ: </b> ${ condominio.getAttribute( "cnpj" ) } <br>
                  <b>Endereço </b> ${ condominio.getAttribute( "endereço" )  }
               </ul>
            </t>` || null
         ,
         endereço = `
            <t>
               <b>Endereço </b>
               ${ condominio.getAttribute( "endereço" )  }
            </t>` || null
         ,
         responsavel = `
            <t>
               <b>Responsável </b> ${ condominio.getAttribute( "responsavel" ) }
            </t>` || null
      ;
      condominio.innerHTML = `
         <ui>
            <header>
               <ui>
               </ui>
            </header>
            <content>
               <card>
                  <ui>
                     ${ nome && nome }
                     ${ responsavel && responsavel }
                     ${ children && children }
                  </ui>
               </card>
            </content>
         </ui>
      `;
   } );


   /**
    * assinaturas 
    * */
   $$( "signatures" ).forEach( ( signatures, i ) => {
      let 
         children = signatures.innerHTML
      ;
      signatures.innerHTML = `
         <!-- <section>
            <p pdh>
               Declaro estar ciente e de acordo com o presente orçamento:
            </p>
         </section> -->
         <signature section>
            <content>

               <!-- <sig-name>Assinatura do Responsável Técnico</sig-name> -->
               <sig-name>Rafael - Elétrica&Art</sig-name>
               
               <!-- Elétrica&Art  -->
               <!--Rafael - Elétrica&Art-->
            </content>
         </signature>
         <signature section>
            <content>
               <sig-name>Assinatura do Cliente</sig-name> 

            </content>
         </signature>
      `;
   } );

} );


/**
 * arg 
 * */ 
$$( "arg" ).forEach( ( arg, i ) => {
  let children = arg.innerHTML;
  if( arg.getAttribute( "label" ) ) {
    arg.innerHTML = `
      <ui>
        <content>
          <header>
            ${ arg.getAttribute( "label" ) }
          </header>
          ${ children }
        </content>
      </ui>
    `;
  } else {
    arg.innerHTML = `
      <ui>
        <content>
          ${ children }
        </content>
      </ui>
    `;
  }
} );

