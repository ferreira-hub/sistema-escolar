import Turma from '../models/Turmas.js';
import Aluno from '../models/Aluno.js';
import Disciplina from '../models/Disciplina.js';

async function listar(req, res) {
  try {
    const turmas = await Turma.findAll({
      include: [{ model: Aluno, as: 'alunos', attributes: ['id', 'nome', 'email', 'serie'] }, { model: Disciplina, as: 'disciplina', attributes: ['id', 'nome'] }],
      order: [['id', 'DESC']],
    });

    res.json(turmas.map((turma) => ({
      id: turma.id,
      nome: turma.nome,
      serie: turma.serie,
      ano: turma.ano_letivo,
      disciplina_id: turma.disciplina_id,
      disciplina: turma.disciplina || null,
      alunos: turma.alunos || [],
    })));
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao listar turmas: ' + erro.message });
  }
}

async function cadastrar(req, res) {
  try {
    const { nome, serie, ano, disciplina_id, alunosIds = [] } = req.body;
    const anoLetivo = Number(ano);
    let disciplinaId = Number(disciplina_id);
    if (!Number.isInteger(disciplinaId)) {
      const primeira = await Disciplina.findOne({ order: [['id', 'ASC']] });
      disciplinaId = primeira?.id;
    }

    if (!nome?.trim() || !serie?.trim() || !Number.isInteger(anoLetivo) || !Number.isInteger(disciplinaId)) {
      return res.status(400).json({ erro: 'Nome, série e ano letivo são obrigatórios.' });
    }

    const ids = [...new Set((Array.isArray(alunosIds) ? alunosIds : []).map(Number).filter(Number.isInteger))];
    const alunos = ids.length ? await Aluno.findAll({ where: { id: ids } }) : [];

    if (alunos.length !== ids.length) {
      return res.status(400).json({ erro: 'Um ou mais alunos selecionados não existem.' });
    }

    const turma = await Turma.create({ nome: nome.trim(), serie: serie.trim(), ano_letivo: anoLetivo, disciplina_id: disciplinaId });
    await turma.setAlunos(ids);

    const criada = await Turma.findByPk(turma.id, {
      include: [{ model: Aluno, as: 'alunos', attributes: ['id', 'nome', 'email', 'serie'] }, { model: Disciplina, as: 'disciplina', attributes: ['id', 'nome'] }],
    });

    res.status(201).json({
      id: criada.id,
      nome: criada.nome,
      serie: criada.serie,
      ano: criada.ano_letivo,
      disciplina_id: criada.disciplina_id,
      disciplina: criada.disciplina || null,
      alunos: criada.alunos || [],
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao cadastrar turma: ' + erro.message });
  }
}

export default { listar, cadastrar };
