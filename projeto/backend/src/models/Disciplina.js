import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Disciplina extends Model {}
Disciplina.init({
  nome: { type: DataTypes.STRING, allowNull: false, unique: true },
}, { sequelize, modelName: 'disciplina', tableName: 'disciplinas', timestamps: false });
export default Disciplina;
