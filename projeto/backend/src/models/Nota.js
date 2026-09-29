import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Nota extends Model {}

Nota.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  aluno_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  disciplina: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  bimestre: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  nota: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: false,
    validate: {
      min: 0,
      max: 10,
    },
  },
}, {
  sequelize,
  modelName: 'nota',
  tableName: 'notas',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['aluno_id', 'disciplina', 'bimestre'],
    },
  ],
});

export default Nota;
