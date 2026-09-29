# Módulo de Lançamento de Notas

Implementado no sistema escolar existente.

## Funcionalidades

- Escolher aluno
- Informar disciplina
- Informar bimestre
- Informar nota de 0 a 10
- Salvar nota
- Listar notas cadastradas
- Consultar desempenho de um aluno
- Calcular média geral
- Impedir duplicidade de aluno + disciplina + bimestre

## API

- `POST /api/notas`
- `GET /api/notas`
- `GET /api/notas/aluno/:id`

## Banco

Tabela `notas`:

- `id`
- `aluno_id`
- `disciplina`
- `bimestre`
- `nota`

Relacionamento:

`alunos 1:N notas`

## Como executar

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

Abra o endereço exibido pelo Vite, normalmente `http://localhost:5173`.

O backend usa a configuração do arquivo `.env` já existente no projeto.

## Banco

O Sequelize cria/sincroniza a tabela `notas` ao iniciar o backend. O arquivo `database/notas.sql` também contém a modelagem SQL para apresentação ou criação manual.
