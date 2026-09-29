import express from 'express';
import frequenciaController from '../../controllers/frequenciaController.js';
import { autenticarProfessor } from '../../auth.js';

const routes = express.Router();

routes.post('/frequencias', autenticarProfessor, frequenciaController.registrar);
routes.get('/frequencias', autenticarProfessor, frequenciaController.listar);
routes.get('/frequencias/aluno/:id', autenticarProfessor, frequenciaController.resumoAluno);

export default routes;
