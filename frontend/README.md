# Smart Clinic – Frontend

Interface web da aplicação Smart Clinic, desenvolvida em Vue 3 com TypeScript.

Este frontend consome a API REST publicada em produção e implementa os fluxos completos de autenticação, agendamento e gerenciamento administrativo.

---

## Objetivo

Fornecer uma interface moderna, responsiva e segura para:

- Cadastro e login de usuários
- Agendamento de consultas
- Cancelamento pelo próprio paciente
- Visualização de agendamentos
- Painel administrativo (SECRETARY)
- Integração com CEP e alerta de chuva

---

## Tecnologias Utilizadas

- Vue 3
- Vite
- TypeScript
- Vue Router
- Pinia (gerenciamento de estado)
- Axios (requisições HTTP)

---

## Estrutura do Projeto

frontend/
├── public/
└── src/
├── assets/
├── components/
├── layouts/
├── pages/
├── router/
├── services/
├── stores/
└── types/

---

## Autenticação

- Login com armazenamento de JWT
- Interceptor Axios para envio automático do token
- Proteção de rotas via navigation guards
- Controle de acesso por papel (PATIENT / SECRETARY)

Fluxo:

1. Usuário faz login
2. Token JWT é armazenado
3. Rotas protegidas exigem autenticação
4. Interface é ajustada conforme o papel do usuário

---

## Funcionalidades – PATIENT

- Cadastro com validação de campos
- Autopreenchimento de endereço via CEP
- Visualização de horários disponíveis
- Criação de agendamento
- Exibição de alerta de chuva (rainAlert)
- Cancelamento do próprio agendamento

### Cancelamento

Botão disponível apenas para agendamentos do próprio usuário.

Regras:

- Não permite cancelar agendamento de outro usuário
- Interface atualiza status após confirmação

---

## Funcionalidades – SECRETARY

- Listagem completa de agendamentos
- Filtro por data
- Filtro por status
- Confirmação e cancelamento de consultas
- Atualização dinâmica da interface após alteração

---

## Integrações Externas

### CEP

O frontend consome o endpoint:

GET /integrations/cep/:cep

Preenche automaticamente:

- Logradouro
- Bairro
- Cidade
- Estado

### Clima

Ao exibir agendamentos:

- Se rainAlert = true → exibe badge de alerta
- Mostra resumo da previsão (weatherSummary)

---

## Experiência do Usuário (UX)

- Validação imediata de campos
- Botões com estado de loading
- Feedback visual em erros da API
- Desabilitação de ações durante requisições
- Interface clara e objetiva

---

## Comunicação com Backend

Arquivo principal de configuração: src/services/api.ts

---

## Deploy

Frontend publicado em ambiente de produção.

🔗 URL do Frontend:
https://smart-clinic-xi.vercel.app/

Backend:
https://smart-clinic-pv7c.onrender.com

---

## Executar Localmente

```bash
npm install
npm run dev
```

Aplicação disponível em: http://localhost:5173

## Segurança no Frontend

- Token nunca exposto na interface
- Proteção de rotas baseada em autenticação
- Validação antes de envio de requisições
- Tratamento consistente de erros HTTP

## Status do Projeto

- Fluxo completo implementado
- Integrações funcionais
- Backend integrado em produção
- Interface validada manualmente

Desenvolvido por Adriano Medeiros
Universidade Veiga de Almeida – 2026
