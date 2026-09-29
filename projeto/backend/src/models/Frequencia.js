import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Frequencia extends Model {}
Frequencia.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  aluno_id: { type: DataTypes.INTEGER, allowNull: false },
  professor_id: { type: DataTypes.INTEGER, allowNull: true },
  turma_id: { type: DataTypes.INTEGER, allowNull: true },
  disciplina_id: { type: DataTypes.INTEGER, allowNull: true },
  data_aula: { type: DataTypes.DATEONLY, allowNull: false },
  aula_numero: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  quantidade_aulas: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  plano_aula: { type: DataTypes.STRING, allowNull: true },
  presente: { type: DataTypes.BOOLEAN, allowNull: false },
}, {
  sequelize, modelName: 'frequencia', tableName: 'frequencias', timestamps: false,
  indexes: [{ unique: true, fields: ['aluno_id', 'turma_id', 'disciplina_id', 'data_aula', 'aula_numero'] }],
});
export default Frequencia;
