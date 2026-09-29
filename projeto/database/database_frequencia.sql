-- MISSÃO 002 - CONTROLE DE FREQUÊNCIA
CREATE DATABASE IF NOT EXISTS sistema_escolar;
USE sistema_escolar;

CREATE TABLE IF NOT EXISTS frequencias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    aluno_id INT NOT NULL,
    data_aula DATE NOT NULL,
    presente BOOLEAN NOT NULL,
    CONSTRAINT fk_frequencias_aluno
      FOREIGN KEY (aluno_id) REFERENCES alunos(id),
    CONSTRAINT uq_frequencia_aluno_data
      UNIQUE (aluno_id, data_aula)
);

-- Relacionamento: ALUNO 1:N FREQUENCIAS.
