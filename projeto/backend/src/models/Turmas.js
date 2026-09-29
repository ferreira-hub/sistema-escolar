import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Turma extends Model {}

Turma.init({
  nome: { type: DataTypes.STRING, allowNull: false },
  serie: { type: DataTypes.STRING, allowNull: false },
  ano_letivo: { type: DataTypes.INTEGER, allowNull: false },
  disciplina_id: { type: DataTypes.INTEGER, allowNull: true },
}, {
  sequelize,
  modelName: 'turma',
  tableName: 'turmas',
  timestamps: true,
});

export default Turma;
