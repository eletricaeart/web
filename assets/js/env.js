const env = {
  endpoints: {
    budgets:
      "https://script.google.com/macros/s/AKfycbzW9HtDfsRJaUsskw-NA_X1rA7eGqvYplwYmSRnomKIr0ASoEOfz_e5ilDpbubC8-GEcQ/exec",
    notes:
      "https://script.google.com/macros/s/AKfycbwdybW4WnNxZECGECIMoPwCoPV00sTKdr6ClzPRLps4ME1efFdItAceMvQiSCGeCKUJ/exec",
    clients:
      "https://script.google.com/macros/s/AKfycbwR7URGk8avAjTG0u4hBT0XeuDtQOVlN6VXExmemPAE-ptN9eU_gz7krGx866sHC3R1gA/exec",
  },
};

const planilhas = {
  budgets:
    "https://docs.google.com/spreadsheets/d/1UMJ5nMMxwhbnJkqSwYYGvu3YXHVVU4fL6oYlsKL5KNo/edit?gid=0#gid=0",
  notes:
    "https://docs.google.com/spreadsheets/d/1MT0lqM8qdjVN26zt48ksyq-IarcsRmEP2kud1GoDH8Y/edit?gid=0#gid=0",
  clientes:
    "https://docs.google.com/spreadsheets/d/15FejDKI015WuToTomoH27SpnAtcOPxhk0jODIg3XwUU/edit?gid=0#gid=0",
};

const envtags = {
  endingTag: `<div id="footer-content">
  <article class="avoid" id="footer-content_top">
    <style>
      #footer-content {
        break-inside: avoid !important;
      }
      #footer-content_top, #footer-content_bottom {
        break-inside: avoid !important;
      }
    </style>
    <content>
      <t6>Compromisso Elétrica&Art:</t6>
      <p>Unir técnica, estética, precisão e responsabilidade para entregar um resultado impecável, durável e superior.</p>
      <tagb>
        <p>Agradecemos a oportunidade de apresentar esta proposta e estamos à disposição para quaisquer esclarecimentos adicionais.</p>
      </tagb>
  </article>
  <article label="Assinatura e Aprovação" id="footer-content_bottom">
    <ui>
      <header>
        <ui>
          <t style="font-weight: 700; text-transform: uppercase;">Assinatura e Aprovação</t>
        </ui>
      </header>
      <content>
        <signatures signer cliente>
          <signature section>
            <content>
              <sig-name>Rafael - Elétrica&Art</sig-name>
            </content>
          </signature>
          <signature section>
            <content>
              <sig-name>Assinatura do Cliente</sig-name> 
            </content>
          </signature>
        </signatures>
      </content>
    </ui>
  </article>
</div>`,
};
