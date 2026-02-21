# Smart Clinic Backend

Backend API para Smart Clinic — um sistema de agendamento de consultas médicas construído com Node.js, Express e TypeScript.

Este backend fornece autenticação, gerenciamento de consultas, preenchimento de endereço via CEP (apenas Brasil), integração com previsão do tempo e controle de acesso baseado em papéis.

---

## 1. Visão Geral

O Smart Clinic permite que pequenas clínicas:

- Cadastrem e autentiquem usuários de forma segura (JWT)
- Suportem controle de acesso baseado em papéis (PATIENT, SECRETARY, ADMIN)
- Agendem consultas com validação de conflitos de horários
- Populem automaticamente o endereço a partir do CEP (API ViaCEP)
- Gerem alertas de chuva com base na previsão do tempo (API Open-Meteo)
- Forneçam um painel administrativo para gerenciamento de consultas

---

## 2. Stack Tecnológica

- Node.js
- Express
- TypeScript
- MongoDB Atlas
- Mongoose
- JWT (JSON Web Tokens)
- Zod (validação)
- Axios (chamadas a APIs externas)
- Jest + Supertest (testes de integração)
- Render (deploy)

---

## 3. Papéis de Usuário

### PATIENT

- Registrar e fazer login
- Criar consultas
- Visualizar suas próprias consultas
- Cancelar suas próprias consultas

### SECRETARY

- Visualizar todas as consultas
- Filtrar por data ou status
- Confirmar ou cancelar consultas

### ADMIN (opcional / extensível)

- Mesmas permissões que SECRETARY
- Reservado para controles de nível de sistema no futuro

---

## 4. Estrutura do Projeto

```
backend/
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── tests/
│   └── utils/
│
├── docs/
│   ├── API.md
│   └── DEPLOY.md
│
├── package.json
├── tsconfig.json
├── .env
└── .env.test
```

---

## 5. Configuração Local

### 5.1. Instalar dependências

```bash
cd backend
npm install
```

---

### 5.2. Variáveis de Ambiente

Crie um arquivo `.env` dentro de `backend/`:

```env
PORT=3000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<database>?retryWrites=true&w=majority
JWT_SECRET=your_secret_here
JWT_EXPIRES_IN=1d
```

ATENÇÃO: Não comite arquivos `.env`.

---

### 5.3. Executar em modo de desenvolvimento

```bash
npm run dev
```

O servidor será executado em:

```
http://localhost:3000
```

---

## 6. Executando Testes (Base de Dados Isolada)

Este projeto usa um banco de dados MongoDB separado para testes.

Crie `.env.test`:

```env
MONGODB_URI_TEST=mongodb+srv://<user>:<password>@<cluster>/<test-database>?retryWrites=true&w=majority
JWT_SECRET=test_secret
JWT_EXPIRES_IN=1d
```

Executar testes:

```bash
npm test
```

O banco de dados de teste é automaticamente limpo entre as execuções dos testes.

---

## 7. Build para Produção

```bash
npm run build
npm start
```

Isto compila o TypeScript em JavaScript (pasta `dist/`) e executa o servidor compilado.

---

## 8. Considerações de Segurança

- Senhas são hasheadas com bcrypt.
- JWT é requerido para rotas protegidas.
- Controle de acesso baseado em papéis é aplicado via middleware.
- O registro força o papel padrão para PATIENT (previne escalonamento de privilégios).
- Banco de testes isolado do desenvolvimento e produção.

---

## 9. Deploy Ao Vivo

Backend em produção:

```
https://smart-clinic-pv7c.onrender.com
```

Health check:

```
GET /health
```

---

## 10. Documentação da API

Veja:

```
docs/API.md
```

---

## 11. Licença

Projeto educacional. Destinado a uso acadêmico e portfólio.
