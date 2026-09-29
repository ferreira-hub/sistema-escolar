import express from 'express';
import notaController from '../../controllers/notaController.js';

const routes = express.Router();

routes.post('/notas', notaController.cadastrar);
routes.get('/notas', notaController.listar);
routes.get('/notas/aluno/:id', notaController.desempenhoAluno);

export default routes;
