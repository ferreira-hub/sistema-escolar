-- Estrutura da Missão 003. O Sequelize cria/atualiza estas tabelas automaticamente.
CREATE TABLE IF NOT EXISTS disciplinas (id INT AUTO_INCREMENT PRIMARY KEY, nome VARCHAR(255) NOT NULL UNIQUE);
CREATE TABLE IF NOT EXISTS professores (id INT AUTO_INCREMENT PRIMARY KEY, nome VARCHAR(255) NOT NULL, usuario VARCHAR(255) NOT NULL UNIQUE, senha VARCHAR(255) NOT NULL);
CREATE TABLE IF NOT EXISTS professor_disciplinas (id INT AUTO_INCREMENT PRIMARY KEY, professor_id INT NOT NULL, disciplina_id INT NOT NULL, UNIQUE KEY uq_prof_disc (professor_id, disciplina_id));
-- Cada linha de frequencias representa uma aula específica de um aluno.
-- aula_numero permite registrar 2, 3, etc. faltas no mesmo dia sem duplicar o registro da mesma aula.
