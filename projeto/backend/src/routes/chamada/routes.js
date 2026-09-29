import express from 'express';
import { autenticarProfessor } from '../../auth.js';
import { dadosChamada, salvarChamada, listar } from '../../controllers/chamadaController.js';
const routes = express.Router();
routes.get('/chamada/dados', autenticarProfessor, dadosChamada);
routes.post('/chamada', autenticarProfessor, salvarChamada);
routes.get('/chamada/registros', autenticarProfessor, listar);
export default routes;
