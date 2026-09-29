import Professor from '../models/Professor.js';
import Disciplina from '../models/Disciplina.js';
import { criarToken, salvarSessao, removerSessao } from '../auth.js';

export async function login(req, res) {
  try {
    const { usuario, senha } = req.body;
    if (!usuario || !senha) return res.status(400).json({ erro: 'Usuário e senha são obrigatórios.' });
    const professor = await Professor.findOne({
      where: { usuario },
      include: [{ model: Disciplina, as: 'disciplinas', attributes: ['id', 'nome'] }],
    });
    if (!professor || professor.senha !== senha) return res.status(401).json({ erro: 'Usuário ou senha inválidos.' });
    const token = criarToken();
    salvarSessao(token, professor.id);
    res.json({ token, professor: { id: professor.id, nome: professor.nome, usuario: professor.usuario, disciplinas: professor.disciplinas } });
  } catch (e) { res.status(500).json({ erro: 'Erro ao autenticar: ' + e.message }); }
}

export async function logout(req, res) {
  removerSessao(req.token);
  res.json({ mensagem: 'Logout realizado.' });
}

export async function me(req, res) {
  res.json({ id: req.professor.id, nome: req.professor.nome, usuario: req.professor.usuario, disciplinas: req.professor.disciplinas });
}
