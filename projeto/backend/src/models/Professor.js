import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Professor extends Model {}
Professor.init({
  nome: { type: DataTypes.STRING, allowNull: false },
  usuario: { type: DataTypes.STRING, allowNull: false, unique: true },
  senha: { type: DataTypes.STRING, allowNull: false },
}, { sequelize, modelName: 'professor', tableName: 'professores', timestamps: false });
export default Professor;
