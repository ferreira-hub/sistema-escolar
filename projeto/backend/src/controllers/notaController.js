import Nota from '../models/Nota.js';
import Aluno from '../models/Aluno.js';

const normalizarTexto = (valor) => String(valor ?? '').trim();

async function cadastrar(req, res) {
  try {
    const aluno_id = Number(req.body.aluno_id);
    const disciplina = normalizarTexto(req.body.disciplina);
    const bimestre = normalizarTexto(req.body.bimestre);
    const nota = Number(req.body.nota);

    if (!aluno_id || !disciplina || !bimestre || Number.isNaN(nota)) {
      return res.status(400).json({
        erro: 'Aluno, disciplina, bimestre e nota são obrigatórios.',
      });
    }

    if (nota < 0 || nota > 10) {
      return res.status(400).json({
        erro: 'A nota deve estar entre 0 e 10.',
      });
    }

    const aluno = await Aluno.findByPk(aluno_id);
    if (!aluno) {
      return res.status(404).json({ erro: 'Aluno não encontrado.' });
    }

    // Evita duas notas para o mesmo aluno/disciplina/bimestre.
    const duplicada = await Nota.findOne({
      where: { aluno_id, disciplina, bimestre },
    });

    if (duplicada) {
      return res.status(409).json({
        erro: 'Já existe uma nota para este aluno, disciplina e bimestre.',
      });
    }

    const registro = await Nota.create({
      aluno_id,
      disciplina,
      bimestre,
      nota: Number(nota.toFixed(2)),
    });

    return res.status(201).json({
      id: registro.id,
      aluno_id: registro.aluno_id,
      aluno: aluno.nome,
      disciplina: registro.disciplina,
      bimestre: registro.bimestre,
      nota: Number(registro.nota),
    });
  } catch (erro) {
    console.error('Erro ao cadastrar nota:', erro);

    if (erro.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        erro: 'Já existe uma nota para este aluno, disciplina e bimestre.',
      });
    }

    return res.status(500).json({
      erro: 'Erro ao salvar nota: ' + erro.message,
    });
  }
}

async function listar(req, res) {
  try {
    const registros = await Nota.findAll({
      include: [{ model: Aluno, as: 'aluno', attributes: ['id', 'nome'] }],
      order: [['id', 'DESC']],
    });

    // Array de objetos para a resposta do módulo.
    const notas = registros.map((registro) => ({
      id: registro.id,
      aluno_id: registro.aluno_id,
      aluno: registro.aluno?.nome || '',
      disciplina: registro.disciplina,
      bimestre: registro.bimestre,
      nota: Number(registro.nota),
    }));

    return res.json(notas);
  } catch (erro) {
    console.error('Erro ao listar notas:', erro);
    return res.status(500).json({
      erro: 'Erro ao consultar notas: ' + erro.message,
    });
  }
}

async function desempenhoAluno(req, res) {
  try {
    const alunoId = Number(req.params.id);

    const aluno = await Aluno.findByPk(alunoId, {
      attributes: ['id', 'nome'],
    });

    if (!aluno) {
      return res.status(404).json({ erro: 'Aluno não encontrado.' });
    }

    const registros = await Nota.findAll({
      where: { aluno_id: alunoId },
      order: [['disciplina', 'ASC'], ['bimestre', 'ASC']],
    });

    // Arrays + funções para calcular o desempenho.
    const notas = registros.map((registro) => Number(registro.nota));
    const totalNotas = notas.length;
    const soma = notas.reduce((total, valor) => total + valor, 0);
    const mediaGeral = totalNotas ? Number((soma / totalNotas).toFixed(2)) : 0;

    const desempenho = registros.map((registro) => ({
      disciplina: registro.disciplina,
      bimestre: registro.bimestre,
      nota: Number(registro.nota),
    }));

    return res.json({
      aluno: {
        id: aluno.id,
        nome: aluno.nome,
      },
      total_notas: totalNotas,
      media_geral: mediaGeral,
      desempenho,
    });
  } catch (erro) {
    console.error('Erro ao consultar desempenho:', erro);
    return res.status(500).json({
      erro: 'Erro ao consultar desempenho: ' + erro.message,
    });
  }
}

export default { cadastrar, listar, desempenhoAluno };
