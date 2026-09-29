import { Op } from 'sequelize';
import Frequencia from '../models/Frequencia.js';
import Aluno from '../models/Aluno.js';
import Turma from '../models/Turmas.js';
import Disciplina from '../models/Disciplina.js';

async function validarVinculo(req, turmaId, disciplinaId) {
  const disciplinaPermitida = req.professor.disciplinas.some(d => Number(d.id) === Number(disciplinaId));
  if (!disciplinaPermitida) return { ok: false, erro: 'Esta disciplina não pertence ao professor logado.' };
  const turma = await Turma.findByPk(turmaId, { include: [{ model: Aluno, as: 'alunos', attributes: ['id', 'nome'] }] });
  if (!turma) return { ok: false, erro: 'Turma não encontrada.' };
  if (turma.disciplina_id && Number(turma.disciplina_id) !== Number(disciplinaId)) return { ok: false, erro: 'Esta turma não está vinculada à disciplina selecionada.' };
  return { ok: true, turma };
}

export async function dadosChamada(req, res) {
  try {
    const disciplinaIds = req.professor.disciplinas.map(d => d.id);
    const turmas = await Turma.findAll({
      where: { disciplina_id: { [Op.in]: disciplinaIds } },
      include: [{ model: Aluno, as: 'alunos', attributes: ['id', 'nome', 'serie'] }],
      order: [['nome', 'ASC']],
    });
    res.json({ disciplinas: req.professor.disciplinas, turmas });
  } catch (e) { res.status(500).json({ erro: 'Erro ao carregar chamada: ' + e.message }); }
}

export async function salvarChamada(req, res) {
  try {
    const { turma_id, disciplina_id, data_aula, quantidade_aulas, plano_aula, faltas = [] } = req.body;
    const qtd = Number(quantidade_aulas);
    if (!turma_id || !disciplina_id || !data_aula || !Number.isInteger(qtd) || qtd < 1 || qtd > 20) return res.status(400).json({ erro: 'Turma, disciplina, data e quantidade de aulas válida são obrigatórios.' });
    if (!plano_aula?.trim()) return res.status(400).json({ erro: 'Título do plano de aula é obrigatório.' });

    const vinculo = await validarVinculo(req, turma_id, disciplina_id);
    if (!vinculo.ok) return res.status(403).json({ erro: vinculo.erro });
    const alunosIds = new Set(vinculo.turma.alunos.map(a => Number(a.id)));
    const mapaFaltas = new Map();
    for (const item of Array.isArray(faltas) ? faltas : []) {
      const alunoId = Number(item.aluno_id), aula = Number(item.aula_numero);
      if (!alunosIds.has(alunoId) || !Number.isInteger(aula) || aula < 1 || aula > qtd) continue;
      if (!mapaFaltas.has(alunoId)) mapaFaltas.set(alunoId, new Set());
      mapaFaltas.get(alunoId).add(aula);
    }

    const registros = [];
    for (const aluno of vinculo.turma.alunos) {
      for (let aula = 1; aula <= qtd; aula++) {
        registros.push({
          aluno_id: aluno.id, professor_id: req.professor.id, turma_id, disciplina_id,
          data_aula, aula_numero: aula, quantidade_aulas: qtd, plano_aula: plano_aula.trim(),
          presente: !(mapaFaltas.get(Number(aluno.id))?.has(aula)),
        });
      }
    }

    await Frequencia.bulkCreate(registros, { updateOnDuplicate: ['presente', 'quantidade_aulas', 'plano_aula', 'professor_id'] });
    res.status(201).json({ mensagem: 'Chamada salva com sucesso.', registros: registros.length, faltas: registros.filter(r => !r.presente).length });
  } catch (e) { res.status(500).json({ erro: 'Erro ao salvar chamada: ' + e.message }); }
}

export async function listar(req, res) {
  try {
    const ids = req.professor.disciplinas.map(d => d.id);
    const registros = await Frequencia.findAll({
      where: { professor_id: req.professor.id, disciplina_id: { [Op.in]: ids } },
      include: [
        { model: Aluno, as: 'aluno', attributes: ['id', 'nome'] },
        { model: Turma, as: 'turma', attributes: ['id', 'nome'] },
        { model: Disciplina, as: 'disciplina', attributes: ['id', 'nome'] },
      ], order: [['data_aula', 'DESC'], ['aula_numero', 'ASC']]
    });
    res.json(registros);
  } catch (e) { res.status(500).json({ erro: 'Erro ao listar chamadas: ' + e.message }); }
}
