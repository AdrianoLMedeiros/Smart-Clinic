# Smart Clinic – Sistema de Atendimento Inteligente

Aplicação web desenvolvida para informatização do processo de agendamento de consultas em clínicas médicas de pequeno porte.

Projeto desenvolvido como requisito da Avaliação 2 (AVA 2) da disciplina Desenvolvimento BackEnd I – Universidade Veiga de Almeida.

---

## Objetivo

Implementar um sistema web completo com:

- Autenticação segura (JWT + hash de senha)
- Controle de acesso por perfil (PATIENT / SECRETARY)
- Agendamento com verificação de conflito de horário
- Integração com API de CEP (ViaCEP)
- Integração com API de clima (Open-Meteo)
- Painel administrativo para gerenciamento de consultas
- Estrutura de implantação de frontend e backend; disponibilidade atual descrita abaixo

---

## Arquitetura do Projeto

Este repositório está dividido em:
backend → API REST (Node.js + Express + TypeScript)
frontend → Interface Web (Vue.js 3 + Vite + TypeScript)

Arquitetura backend em camadas:
routes → controllers → services → repositories → models

---

## Tecnologias Utilizadas

### Backend

- Node.js
- Express
- TypeScript
- MongoDB Atlas
- Mongoose
- JWT (jsonwebtoken)
- bcrypt
- Zod
- Axios
- Jest + Supertest
- Render (deploy)

### Frontend

- Vue 3
- Vite
- TypeScript
- Vue Router
- Pinia
- Axios

---

## Perfis de Usuário

### PATIENT

- Cadastro e login
- Criação de agendamento
- Visualização de seus agendamentos

### SECRETARY

- Visualização de todos os agendamentos
- Filtro por data e status
- Confirmação e cancelamento de consultas

---

## Integrações Externas

- ViaCEP → Consulta automática de endereço via CEP
- Open-Meteo → Verificação de previsão de chuva no dia da consulta

---

## Segurança

- Senhas armazenadas com hash bcrypt
- Autenticação baseada em JWT
- Middleware de proteção de rotas
- Validação de payloads com Zod
- Controle de acesso por papel

---

## Implantação e disponibilidade

- [Frontend](https://smart-clinic-xi.vercel.app): respondeu HTTP 200 em 30/08/2026.
- API informada anteriormente: `https://smart-clinic-pv7c.onrender.com`. A consulta a `/health` retornou HTTP 404 em 30/08/2026.

A resposta do frontend não comprova funcionamento integrado de autenticação, banco e agendamento. O endereço/serviço da API precisa ser revisado antes de anunciar uma demonstração completa. Não insira dados de pacientes reais.

## Como executar localmente

Requisitos: Node.js 22, npm e MongoDB local ou instância de desenvolvimento autorizada.

Na pasta `backend`, crie `.env` (não versionar):

```dotenv
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/smart_clinic_dev
JWT_SECRET=SUBSTITUA_POR_UM_SEGREDO_ALEATORIO_FORTE
JWT_EXPIRES_IN=1d
```

O nome utilizado pelo código é **MONGODB_URI**, não `MONGO_URI`. Use um segredo próprio antes de iniciar.

```sh
cd backend
npm ci
npm run dev
```

Na pasta `frontend`, crie `.env.local`:

```dotenv
VITE_API_BASE_URL=http://localhost:3000
```

Em outro terminal:

```sh
cd frontend
npm ci
npm run dev
```

Abra `http://localhost:5173`, origem local prevista na configuração CORS. A URL da API é pública por definição; nunca coloque segredos em variáveis `VITE_`.

## Testes

Crie `backend/.env.test` com `MONGODB_URI_TEST` apontando para **um banco exclusivo de testes**, por exemplo `mongodb://127.0.0.1:27017/smart_clinic_test`, e um `JWT_SECRET` próprio de teste.

**A suíte apaga documentos das coleções do banco informado. Nunca use banco de produção ou dados a preservar.**

Na pasta `backend`, execute `npm test`. Os testes existentes incluem autenticação, controle de acesso, conflito de horário e atualização de status. Não foram reexecutados nesta revisão documental.

## Leitura de gestão e validação proposta

Projeto acadêmico individual: evidencia tradução de requisitos em fluxos e integração técnica, não liderança de uma equipe de engenharia ou implantação clínica comprovada.

| Necessidade | Entrega | Critério de aceite proposto |
|---|---|---|
| Organizar agenda | Cadastro de consultas | Usuário consegue concluir o agendamento válido. |
| Evitar sobreposição | Verificação de conflito | Horários conflitantes são recusados no cenário definido. |
| Delimitar responsabilidades | Perfis paciente e secretaria | Cada perfil acessa apenas operações e registros autorizados. |
| Acompanhar atendimento | Alteração de status | Transições permitidas são verificadas com o usuário responsável. |

Próximos passos: restabelecer/verificar a API, validar o fluxo ponta a ponta, registrar aceite e rever segurança e proteção de dados antes de qualquer uso real. Não há redução de faltas, economia ou ganho de produtividade medido publicado.

---

## Referências Acadêmicas

- ALVES, W. P. Projetos de sistemas web...
- FREITAS, P. H. C. et al. Programação back end III...
- OLIVEIRA, C. L. V.; ZANETTI, H. A. P. Javascript descomplicado...

Desenvolvido por Adriano Medeiros
Universidade Veiga de Almeida – 2026
