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
- Deploy funcional em ambiente de produção

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

## Deploy

Backend publicado em:

https://smart-clinic-pv7c.onrender.com

Frontend publicado em:

Banco de dados hospedado no MongoDB Atlas.

---

## Como executar localmente

### Backend

- no terminal:
  cd backend
  npm install
  npm run dev

Criar arquivo .env com:
PORT=
MONGO_URI=
JWT_SECRET=

### Frontend

- no terminal:
  cd frontend
  npm install
  npm run dev

## Testes

- Executar no backend:
  npm run test

Testes automatizados cobrem:

- Autenticação
- Controle de acesso
- Conflito de horário
- Atualização de status

## Referências Acadêmicas

- ALVES, W. P. Projetos de sistemas web...
- FREITAS, P. H. C. et al. Programação back end III...
- OLIVEIRA, C. L. V.; ZANETTI, H. A. P. Javascript descomplicado...

Desenvolvido por Adriano Medeiros
Universidade Veiga de Almeida – 2026
