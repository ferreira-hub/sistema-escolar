import { Op } from 'sequelize';
import Frequencia from '../models/Frequencia.js';
import Aluno from '../models/Aluno.js';

async function registrar(req, res) {
  try {
    const { aluno_id, data_aula, presente } = req.body;

    if (!aluno_id || !data_aula || typeof presente !== 'boolean') {
      return res.status(400).json({ erro: 'Aluno, data e presença são obrigatórios.' });
    }

    const aluno = await Aluno.findByPk(aluno_id);
    if (!aluno) return res.status(404).json({ erro: 'Aluno não encontrado.' });

    const existe = await Frequencia.findOne({ where: { aluno_id, data_aula } });
    if (existe) {
      return res.status(409).json({
        erro: 'Já existe um registro de frequência para este aluno nesta data.'
      });
    }

    const registro = await Frequencia.create({ aluno_id, data_aula, presente });
    return res.status(201).json(registro);
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: 'Erro ao registrar frequência: ' + erro.message });
  }
}

async function listar(req, res) {
  try {
    const registros = await Frequencia.findAll({
      include: [{ model: Aluno, as: 'aluno', attributes: ['id', 'nome'] }],
      order: [['data_aula', 'DESC'], ['id', 'DESC']]
    });

    res.json(registros.map((r) => ({
      id: r.id,
      aluno_id: r.aluno_id,
      aluno: r.aluno?.nome || '',
      data_aula: r.data_aula,
      presente: r.presente
    })));
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao consultar frequências: ' + erro.message });
  }
}

async function resumoAluno(req, res) {
  try {
    const alunoId = Number(req.params.id);
    const registros = await Frequencia.findAll({ where: { aluno_id: alunoId } });

    const total_aulas = registros.length;
    const presencas = registros.filter((r) => r.presente).length;
    const faltas = total_aulas - presencas;
    const percentual = total_aulas ? Number(((presencas / total_aulas) * 100).toFixed(2)) : 0;

    res.json({ total_aulas, presencas, faltas, percentual });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao calcular frequência: ' + erro.message });
  }
}

export default { registrar, listar, resumoAluno };
