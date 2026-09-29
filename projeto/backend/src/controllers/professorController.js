import Professor from '../models/Professor.js';
import Disciplina from '../models/Disciplina.js';

export async function listar(req, res) {
  try {
    const professores = await Professor.findAll({ include: [{ model: Disciplina, as: 'disciplinas', attributes: ['id','nome'] }] });
    res.json(professores.map(p => ({ id:p.id, nome:p.nome, usuario:p.usuario, disciplinas:p.disciplinas })));
  } catch(e) { res.status(500).json({ erro:'Erro ao listar professores: '+e.message }); }
}

export async function cadastrar(req,res) {
  try {
    const { nome, usuario, senha, disciplinasIds=[] } = req.body;
    if (!nome?.trim() || !usuario?.trim() || !senha) return res.status(400).json({ erro:'Nome, usuário e senha são obrigatórios.' });
    const ids=[...new Set((Array.isArray(disciplinasIds)?disciplinasIds:[]).map(Number).filter(Number.isInteger))];
    const disciplinas=ids.length?await Disciplina.findAll({where:{id:ids}}):[];
    if(disciplinas.length!==ids.length) return res.status(400).json({erro:'Disciplina inválida.'});
    const p=await Professor.create({nome:nome.trim(),usuario:usuario.trim(),senha});
    await p.setDisciplinas(ids);
    const criado=await Professor.findByPk(p.id,{include:[{model:Disciplina,as:'disciplinas',attributes:['id','nome']}]});
    res.status(201).json({id:criado.id,nome:criado.nome,usuario:criado.usuario,disciplinas:criado.disciplinas});
  } catch(e) { if(e.name==='SequelizeUniqueConstraintError') return res.status(409).json({erro:'Usuário já cadastrado.'}); res.status(500).json({erro:'Erro ao cadastrar professor: '+e.message}); }
}
