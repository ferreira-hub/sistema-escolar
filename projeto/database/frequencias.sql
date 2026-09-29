USE cadastro_alunos;

CREATE TABLE IF NOT EXISTS frequencias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  aluno_id INT NOT NULL,
  data_aula DATE NOT NULL,
  presente BOOLEAN NOT NULL,
  UNIQUE KEY aluno_data_unica (aluno_id, data_aula),
  CONSTRAINT fk_frequencia_aluno
    FOREIGN KEY (aluno_id) REFERENCES alunos(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

SELECT * FROM frequencias;
