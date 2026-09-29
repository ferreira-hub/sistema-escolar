import Aluno from '../models/Aluno.js'


async function listarAlunos(req, res) {
    try {
        const alunos = await Aluno.findAll();
        res.status(200).json(alunos);
    } catch (erro) {
        res.status(500).send("Erro ao listar alunos: " + erro.message);
    }
}


async function cadastrarAluno(req, res) {
    try {
        const dados = { ...req.body };
        for (const campo of ['cpf', 'telefone', 'endereco', 'data_nascimento', 'serie']) {
            if (dados[campo] === '') dados[campo] = null;
        }
        const novoAluno = await Aluno.create(dados);
        res.status(201).json(novoAluno);
        console.log("Aluno salvo no banco:", novoAluno.nome);
    } catch (erro) {
        if (erro.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ erro: 'E-mail ou CPF já cadastrado.' });
        }
        res.status(400).json({ erro: 'Erro ao salvar: ' + erro.message });
    }
}

export default { cadastrarAluno, listarAlunos };