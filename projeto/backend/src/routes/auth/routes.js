import express from 'express';
import { login, logout, me } from '../../controllers/authController.js';
import { autenticarProfessor } from '../../auth.js';
const routes = express.Router();
routes.post('/auth/login', login);
routes.post('/auth/logout', autenticarProfessor, logout);
routes.get('/auth/me', autenticarProfessor, me);
export default routes;
