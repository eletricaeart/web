### bugs

[] - orçamentos não deletam

```mensagem do console:
Access to fetch at 'https://script.google.com/macros/s/AKfycbx6iEkTXe_yVFrKu5QjnfED1pb73e8LpRR5f-JK7JOXB5vG_jYbDiq_Fazt-Al66yOVqw/exec' from origin 'http://localhost:8080' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.

useEASync.js:56
 POST https://script.google.com/macros/s/AKfycbx6iEkTXe_yVFrKu5QjnfED1pb73e8LpRR5f-JK7JOXB5vG_jYbDiq_Fazt-Al66yOVqw/exec net::ERR_FAILED 200 (OK)
useEASync.js:85 Erro ao salvar: TypeError: Failed to fetch
    at save (useEASync.js:56:30)
    at handleDelete (Budgets.jsx:65:13)
    at onClick (Budgets.jsx:188:31)

```

```aba network:
exec, CORS error, fetch, useEASync.js:56
```

[] - ao editar um orçamento a data vem como undefined
