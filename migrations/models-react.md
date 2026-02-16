## Modelos de prompt:

> **Modelo para Componentes Visuais:\***"Converta o componente [NOME] (anexo código HTML/CSS) para um Functional Component em React utilizando Vite. Mantenha as variáveis de cores do `globals.css`. O componente deve ser puro e aceitar propriedades (props) para [AÇÕES/TEXTOS]."\*

> **Modelo para Lógica de Dados (Hooks):\***"Transforme a lógica da entidade [ORÇAMENTOS/NOTAS] do `EASync.js` em um Custom Hook chamado `useEASync`. O Hook deve gerenciar o estado local com `useState`, persistir no `LocalStorage` e disparar os `fetch` para o Google Sheets como efeitos colaterais (`useEffect`)."\*

## passo a passo:

npm create vite@latest ea-app-react -- --template react
cd ea-app-react
npm install
npm install react-router-dom lucide-react
npm run dev

## Guia de conversão e testes:

#### **Elemento Atual** - Destino no React { Regra de Integridade }

**EASync.js** - src/hooks/useEASync.js { Deve manter a mesma cacheKey para não perder os dados já salvos no celular do Rafael. }

**AppBar/NavBar** - src/components/Layout/ { O vmenu deve ser controlado pelo estado do componente pai. }

**captura.html** - src/pages/Captura/ { "Cada input deve ser um componente controlado, e o addItem deve manipular um array de objetos no estado." }

**BackButton.js** - useNavigate (React Router) { "A lógica de ""stack"" será substituída pelo histórico nativo do Router, mas com guardas de navegação." }

## Estrutura de pastas

src/
├── assets/ # Imagens (avatar, logos) e CSS global
├── components/ # Componentes reutilizáveis (Button, AppBar, etc.)
│ ├── layout/ # BottomNavBar, AppBar
│ └── common/ # Inputs, Modais
├── hooks/ # Custom Hooks (useEASync, useForm)
├── pages/ # Telas do App (Dashboard, Cliente, Captura)
├── routes/ # Configuração das rotas (react-router-dom)
├── services/ # Configurações de API e Env
└── utils/ # Funções de ajuda (formatação de data)
