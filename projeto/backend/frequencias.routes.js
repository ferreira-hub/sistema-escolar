// ROTAS DE FREQUÊNCIA
// Cole este conteúdo no seu server.js, depois das rotas de alunos.
// Ele usa a variável "db" (sua conexão mysql2).

// Registrar presença/falta
app.post("/frequencias", (req, res) => {
    const { aluno_id, data_aula, presente } = req.body;

    if (!aluno_id || !data_aula || typeof presente !== "boolean") {
        return res.status(400).json({
            erro: "Aluno, data e presença são obrigatórios."
        });
    }

    const sql = `
        INSERT INTO frequencias (aluno_id, data_aula, presente)
        VALUES (?, ?, ?)
    `;

    db.query(sql, [aluno_id, data_aula, presente], (erro, resultado) => {
        if (erro) {
            if (erro.code === "ER_DUP_ENTRY") {
                return res.status(409).json({
                    erro: "Já existe uma frequência registrada para este aluno nesta data."
                });
            }

            console.error(erro);
            return res.status(500).json({
                erro: "Erro ao registrar frequência."
            });
        }

        res.status(201).json({
            mensagem: "Frequência registrada com sucesso!",
            id: resultado.insertId
        });
    });
});

// Listar todos os registros
app.get("/frequencias", (req, res) => {
    const sql = `
        SELECT
            f.id,
            f.aluno_id,
            a.nome AS aluno,
            DATE_FORMAT(f.data_aula, '%Y-%m-%d') AS data_aula,
            f.presente
        FROM frequencias f
        INNER JOIN alunos a ON a.id = f.aluno_id
        ORDER BY f.data_aula DESC, a.nome ASC
    `;

    db.query(sql, (erro, resultados) => {
        if (erro) {
            console.error(erro);
            return res.status(500).json({
                erro: "Erro ao consultar frequências."
            });
        }

        res.json(resultados);
    });
});

// Consultar frequência de um aluno
app.get("/frequencias/aluno/:id", (req, res) => {
    const alunoId = req.params.id;

    const sql = `
        SELECT
            COUNT(*) AS total_aulas,
            SUM(CASE WHEN presente = 1 THEN 1 ELSE 0 END) AS presencas,
            SUM(CASE WHEN presente = 0 THEN 1 ELSE 0 END) AS faltas,
            ROUND(
                (SUM(CASE WHEN presente = 1 THEN 1 ELSE 0 END) / COUNT(*)) * 100,
                2
            ) AS percentual
        FROM frequencias
        WHERE aluno_id = ?
    `;

    db.query(sql, [alunoId], (erro, resultados) => {
        if (erro) {
            console.error(erro);
            return res.status(500).json({
                erro: "Erro ao calcular frequência."
            });
        }

        const dados = resultados[0];

        res.json({
            total_aulas: Number(dados.total_aulas || 0),
            presencas: Number(dados.presencas || 0),
            faltas: Number(dados.faltas || 0),
            percentual: Number(dados.percentual || 0)
        });
    });
});
