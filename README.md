# Sistema Escolar — Missão 002 pronta

Este projeto já está integrado com o módulo de Controle de Frequência.

## O que foi adicionado
- Registro de presença e falta
- Data da aula
- Tabela de registros
- Filtros por aluno e data
- Contagem de presenças e faltas
- Percentual de frequência
- Classificação: Frequência Boa / Atenção / Risco de Reprovação
- Alerta para alunos abaixo de 75%
- Ranking de melhores frequências
- Bloqueio de duplicação aluno + data
- Modelo Sequelize + tabela MySQL
- Checklist QA e roteiro de apresentação

## Como executar

### 1. Banco
Confira o `backend/.env` e garanta que ele aponta para seu banco `cadastro_alunos`.

Se preferir criar a tabela manualmente, execute `database/frequencias.sql` no MySQL.

O servidor também usa `sequelize.sync()` para sincronizar os modelos.

### 2. Backend
```bash
cd backend
npm install
npm run dev
```
Servidor padrão: http://localhost:3000

### 3. Frontend
Em outro terminal:
```bash
cd frontend
npm install
npm run dev
```
Frontend padrão: http://localhost:5173

O Vite já encaminha `/api` para `http://localhost:3000`.

## Como usar
1. Entre no sistema com qualquer usuário e senha preenchidos (o login ainda é provisório).
2. Clique em `Frequência`.
3. Selecione um aluno.
4. Escolha a data.
5. Selecione Sim ou Não em Presente.
6. Clique em Registrar.
7. Consulte os registros e o ranking.

## Importante
O módulo usa os alunos existentes em `GET /api/alunos`. Não é necessário cadastrar alunos novamente.

## Documentação da entrega
Veja `MISSÃO 002 - CONTROLE DE FREQUÊNCIA.txt`.
