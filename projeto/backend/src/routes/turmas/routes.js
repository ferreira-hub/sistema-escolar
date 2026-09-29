import express from 'express';
import turmaController from '../../controllers/turmaController.js';

const routes = express.Router();

routes.get('/turmas', turmaController.listar);
routes.post('/turmas', turmaController.cadastrar);

export default routes;
