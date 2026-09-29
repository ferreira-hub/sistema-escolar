import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
class TurmaDisciplina extends Model {}
TurmaDisciplina.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  turma_id: { type: DataTypes.INTEGER, allowNull: false },
  disciplina_id: { type: DataTypes.INTEGER, allowNull: false },
}, { sequelize, modelName: 'turma_disciplina', tableName: 'turma_disciplinas', timestamps: false,
  indexes: [{ unique: true, fields: ['turma_id', 'disciplina_id'] }] });
export default TurmaDisciplina;
