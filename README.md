# Conectando Talentos: Plataforma Web de Empregos

Plataforma desenvolvida como projeto de extensão para conectar empresas e candidatos da cidade de Muriaé e região. Criada utilizando **PHP (AtomPHP)** no back-end e **React** no front-end.

## 📌 Objetivo do Projeto

Desenvolver uma aplicação web para:

- Candidatos se cadastrarem e enviarem seus currículos
- Empresas divulgarem vagas e filtrarem candidatos
- Facilitar a conexão entre profissionais e empregadores locais

## 🛠️ Tecnologias Utilizadas

### 🔙 Back-End (API)
- PHP puro com estrutura MVC
- Mini-framework AtomPHP (desenvolvido em aula)
- MySQL (banco de dados)
- PSR-4 / Composer
- Retorno em JSON (API REST)

### 🔜 Front-End
- ReactJS
- Componentes organizados por tipo de usuário
- Consumo da API com `fetch()`

## 💻 Estrutura de Pastas

```
/backend
  ├── app/
  ├── core/
  ├── public/
  └── .env

/frontend
  └── src/
      └── views/
          ├── Usuario/
          ├── Empresa/
          └── Comum/
```

## 🔃 Integração Front ↔ Back

O React consome os dados da API PHP por meio de requisições para `http://localhost/seu_projeto/public/api/...`.

Garanta que:
- O back-end esteja rodando localmente com WAMP/XAMPP
- O front-end esteja com CORS liberado no PHP (usar: `header("Access-Control-Allow-Origin: *");`)

## 📂 Como Rodar Localmente

### 🔧 Backend (AtomPHP)
1. Coloque a pasta do projeto no diretório do WAMP/XAMPP (geralmente `www/`)
2. Execute o MySQL e crie o banco de dados
3. Importe o arquivo `.sql` com as tabelas
4. Configure o arquivo `.env` com as credenciais do banco
5. Acesse via navegador: `http://localhost/nome_do_projeto/public`

### 🌐 Frontend (React)
1. Abra a pasta `/frontend`
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o projeto:
   ```bash
   npm start
   ```
4. Acesse: `http://localhost:3000`

## 👥 Equipe de Desenvolvimento

- Nome 1 – Back-end
- Nome 2 – Front-end
- Nome 3 – Banco de dados
- Nome 4 – UI/UX
- Nome 5 – Documentação/Testes

## 📄 Documentação

> O manual de uso e estrutura do projeto se encontra na pasta `/documentacao` (em PDF).