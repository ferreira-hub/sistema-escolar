import crypto from 'crypto';
import Professor from './models/Professor.js';
import Disciplina from './models/Disciplina.js';

const sessoes = new Map();

export function criarToken() {
  return crypto.randomBytes(32).toString('hex');
}

export async function autenticarProfessor(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  const professorId = sessoes.get(token);
  if (!professorId) return res.status(401).json({ erro: 'Acesso negado. Faça login.' });
  const professor = await Professor.findByPk(professorId, {
    include: [{ model: Disciplina, as: 'disciplinas', attributes: ['id', 'nome'] }],
  });
  if (!professor) return res.status(401).json({ erro: 'Sessão inválida.' });
  req.professor = professor;
  req.token = token;
  next();
}

export function salvarSessao(token, professorId) { sessoes.set(token, professorId); }
export function removerSessao(token) { sessoes.delete(token); }
