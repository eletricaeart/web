

'use strict';
/* [ properties ]
=================================== */
const 
   ea = {
      // logoURI: "https://raw.githubusercontent.com/Ceo-js/ea/2e6fdd74866a50968095c8c6942156d1e93e1c34/ea.jpg"
      logoURI: "https://rawcdn.githack.com/eletricaeart/app/6e75f2fa11d56872a7e284e03c20bd865925ff2c/src/images/EA/globo-de-plasma-300.png?raw=true"
   }
;
/* -------------------------------- */


/* [ events ] 
=================================== */
window.addEventListener( "load", () => {


   btn_createPDF.addEventListener( "click", () => {

         const invoice = this.document.querySelector( "#invoice_html" );
         console.log( $( "#invoice_html" ) );
         console.log( window );
         var data = {
            // margin: [ 10, 10, 10, 0 ],
            margin: [  0,  0,  0, 0 ],
            filename: `${ document.title }.pdf`,
            // image: { type: "jpg", quality: 101 },
            image: { type: "jpeg", quality: .90 },
            enableLinks: true,
            autoPaging: 'text',
            // autoPaging: 'css',

            DisablePdfCompression: 1,
            // DisablePdfCompression: 0,
            x: 0,
            y: 0,
            html2canvas: { 
               width: 792,
               // height: 1120,
               windowWidth: 792,
               windowHeight: 1120,

               dpi: 192,
               letterRendering: true,
               
               // useCORS: false,
               // useCORS: true,
               // allowTaint: true,
               // allowTaint: false,
               imageTimeout: 1500,
               scale: 2
            },
            jsPDF: { 
               // unit: "in", "pt", "mm", "cm", "m", "in" or "px".
               unit: "pt", 
               // format: "letter", a0 - a10, b0 - b10, c0 - c10, dl, letter, government-letter, 
               // legal, junior-legal, ledger, tabloid, [595.28, 841.89]
               format: "a4", 
               orientation: "portrait",
               precision: 1,
               compress: true,
               encryption: {
                  userPassword: "787900",
                  ownerPassword: "7879",
                  userPermissions: [
                     "print"
                  ]
               },
            }
         };
         html2pdf().set( {
            // pagebreak: { mode: "avoid-all", before: "#break-page" }
            pagebreak: { mode: "avoid-all", after: "#break-page" }
         } ); 
         html2pdf().from( invoice ).set( data ).save();

   } );
} );
