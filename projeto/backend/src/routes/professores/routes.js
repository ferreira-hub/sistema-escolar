import express from 'express';
import { listar, cadastrar } from '../../controllers/professorController.js';
const routes=express.Router();
routes.get('/professores',listar);
routes.post('/professores',cadastrar);
export default routes;
