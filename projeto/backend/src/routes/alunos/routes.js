// backend/src/routes/alunos/routes.js
import express from 'express';
import alunoController from '../../controllers/alunoController.js';

const routes = express.Router();

// Quando o React enviar um POST para /alunos, o controlador será ativado [18, 19]
routes.get('/alunos', alunoController.listarAlunos);
routes.post('/alunos', alunoController.cadastrarAluno);

export default routes;

