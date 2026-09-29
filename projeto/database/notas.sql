-- Módulo de Lançamento de Notas
-- Execute depois de criar/selecionar o banco usado pelo sistema.

CREATE TABLE IF NOT EXISTS notas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  aluno_id INT NOT NULL,
  disciplina VARCHAR(100) NOT NULL,
  bimestre VARCHAR(30) NOT NULL,
  nota DECIMAL(4,2) NOT NULL,
  CONSTRAINT fk_notas_aluno
    FOREIGN KEY (aluno_id) REFERENCES alunos(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT uq_nota_aluno_disciplina_bimestre
    UNIQUE (aluno_id, disciplina, bimestre),
  CONSTRAINT chk_nota_valida
    CHECK (nota >= 0 AND nota <= 10)
);

-- Relacionamento:
--
-- ALUNOS (1) -------------------- (N) NOTAS
--   id (PK)                         id (PK)
--                                   aluno_id (FK)
--                                   disciplina
--                                   bimestre
--                                   nota
