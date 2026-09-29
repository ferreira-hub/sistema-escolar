import express from 'express';
import cors from 'cors';
import sequelize from './config/database.js';
import routes from './routes/index.js';
import Aluno from './models/Aluno.js';
import Frequencia from './models/Frequencia.js';
import Turma from './models/Turmas.js';
import TurmaAluno from './models/TurmaAluno.js';
import Disciplina from './models/Disciplina.js';
import Professor from './models/Professor.js';
import ProfessorDisciplina from './models/ProfessorDisciplina.js';

Aluno.hasMany(Frequencia, { foreignKey: 'aluno_id' });
Frequencia.belongsTo(Aluno, { foreignKey: 'aluno_id', as: 'aluno' });
Turma.belongsToMany(Aluno, { through: TurmaAluno, foreignKey: 'turma_id', otherKey: 'aluno_id', as: 'alunos' });
Aluno.belongsToMany(Turma, { through: TurmaAluno, foreignKey: 'aluno_id', otherKey: 'turma_id', as: 'turmas' });
Professor.belongsToMany(Disciplina, { through: ProfessorDisciplina, foreignKey: 'professor_id', otherKey: 'disciplina_id', as: 'disciplinas' });
Disciplina.belongsToMany(Professor, { through: ProfessorDisciplina, foreignKey: 'disciplina_id', otherKey: 'professor_id', as: 'professores' });
Turma.belongsTo(Disciplina, { foreignKey: 'disciplina_id', as: 'disciplina' });
Disciplina.hasMany(Turma, { foreignKey: 'disciplina_id', as: 'turmas' });
Frequencia.belongsTo(Professor, { foreignKey: 'professor_id', as: 'professor' });
Frequencia.belongsTo(Turma, { foreignKey: 'turma_id', as: 'turma' });
Frequencia.belongsTo(Disciplina, { foreignKey: 'disciplina_id', as: 'disciplina' });

const app = express();
const PORT = Number(process.env.PORT || 3000);
const DB_RETRY_DELAY_MS = Number(process.env.DB_RETRY_DELAY_MS || 5000);
const DB_SYNC_FORCE = String(process.env.DB_SYNC_FORCE || 'false').toLowerCase() === 'true';
app.use(cors());
app.use(express.json());
app.use(routes);
app.get('/health', (req,res)=>res.json({ok:true,servico:'sistema-escolar'}));
const delay=ms=>new Promise(r=>setTimeout(r,ms));

async function seedBase() {
  const [disciplina] = await Disciplina.findOrCreate({ where:{nome:'Matemática'}, defaults:{nome:'Matemática'} });
  const [professor] = await Professor.findOrCreate({ where:{usuario:'professor'}, defaults:{nome:'Professor Demonstração', usuario:'professor', senha:'1234'} });
  await professor.addDisciplina(disciplina);
  const turmas = await Turma.findAll({ where:{ disciplina_id:null } });
  if (turmas.length) await Promise.all(turmas.map(t=>t.update({disciplina_id:disciplina.id})));
  console.log('Usuário de demonstração: professor / 1234');
}
async function connectDatabaseWithRetry(){
  while(true){try{await sequelize.authenticate(); console.log('Conexao com o banco de dados estabelecida com sucesso!'); await sequelize.sync({force:DB_SYNC_FORCE, alter:!DB_SYNC_FORCE}); await seedBase(); console.log('Banco de dados sincronizado com sucesso!'); return;}catch(e){console.error('Falha ao conectar no banco. Nova tentativa em alguns segundos.'); console.error(e.message); await delay(DB_RETRY_DELAY_MS);}}
}
async function startServer(){app.listen(PORT,()=>console.log(`Servidor rodando em http://localhost:${PORT}`)); await connectDatabaseWithRetry();}
startServer().catch(e=>console.error('Erro inesperado ao iniciar o servidor:',e));
