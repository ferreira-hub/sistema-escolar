import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class TurmaAluno extends Model {}

TurmaAluno.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  turma_id: { type: DataTypes.INTEGER, allowNull: false },
  aluno_id: { type: DataTypes.INTEGER, allowNull: false },
}, {
  sequelize,
  modelName: 'turma_aluno',
  tableName: 'turma_alunos',
  timestamps: false,
  indexes: [{ unique: true, fields: ['turma_id', 'aluno_id'] }],
});

export default TurmaAluno;
