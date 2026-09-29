import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

const API = '/api';

const hoje = new Date();
const dataHoje = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;

function Frequencia() {
  const [alunos, setAlunos] = useState([]);
  const [registros, setRegistros] = useState([]);
  const [alunoId, setAlunoId] = useState('');
  const [dataAula, setDataAula] = useState(dataHoje);
  const [presente, setPresente] = useState('true');
  const [filtroAluno, setFiltroAluno] = useState('');
  const [filtroData, setFiltroData] = useState('');
  const [message, setMessage] = useState('');

  const carregarAlunos = async () => {
    const response = await fetch(`${API}/alunos`);
    if (!response.ok) throw new Error('Erro ao carregar alunos.');
    setAlunos(await response.json());
  };

  const carregarFrequencias = async () => {
    const response = await fetch(`${API}/frequencias`);
    if (!response.ok) throw new Error('Erro ao carregar frequências.');
    setRegistros(await response.json());
  };

  useEffect(() => {
    Promise.all([carregarAlunos(), carregarFrequencias()]).catch((error) => {
      setMessage(error.message);
    });
  }, []);

  const registrar = async (event) => {
    event.preventDefault();
    setMessage('');

    if (!alunoId || !dataAula) {
      setMessage('Selecione o aluno e preencha a data.');
      return;
    }

    try {
      const response = await fetch(`${API}/frequencias`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          aluno_id: Number(alunoId),
          data_aula: dataAula,
          presente: presente === 'true',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.erro || 'Não foi possível registrar.');
        return;
      }

      setMessage('Frequência registrada com sucesso!');
      setAlunoId('');
      await carregarFrequencias();
    } catch {
      setMessage('Não foi possível conectar ao servidor.');
    }
  };

  const registrosFiltrados = useMemo(() => {
    return registros.filter((registro) => {
      const porAluno = !filtroAluno || String(registro.aluno_id) === String(filtroAluno);
      const porData = !filtroData || registro.data_aula === filtroData;
      return porAluno && porData;
    });
  }, [registros, filtroAluno, filtroData]);

  const resumo = useMemo(() => {
    const presencas = registros.filter((r) => r.presente === true || Number(r.presente) === 1).length;
    const faltas = registros.length - presencas;
    return { total: registros.length, presencas, faltas };
  }, [registros]);

  const ranking = useMemo(() => {
    return alunos.map((aluno) => {
      const dados = registros.filter((r) => Number(r.aluno_id) === Number(aluno.id));
      const presencas = dados.filter((r) => r.presente === true || Number(r.presente) === 1).length;
      const faltas = dados.length - presencas;
      const percentual = dados.length ? (presencas / dados.length) * 100 : 0;

      let classificacao = 'Sem registros';
      if (dados.length) {
        if (percentual >= 90) classificacao = 'Frequência Boa';
        else if (percentual >= 75) classificacao = 'Atenção';
        else classificacao = 'Risco de Reprovação';
      }

      return { ...aluno, total: dados.length, presencas, faltas, percentual, classificacao };
    }).filter((aluno) => aluno.total > 0).sort((a, b) => b.percentual - a.percentual);
  }, [alunos, registros]);

  const formatarData = (data) => {
    if (!data) return '';
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h5" fontWeight={700}>📋 Registro de Frequência</Typography>
        <Typography color="text.secondary">
          Registre presença ou ausência e acompanhe os alunos com baixa frequência.
        </Typography>
      </Box>

      {message && (
        <Alert severity={message.includes('sucesso') ? 'success' : 'warning'}>
          {message}
        </Alert>
      )}

      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
        <form onSubmit={registrar}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={5}>
              <TextField
                select fullWidth required label="Aluno"
                value={alunoId}
                onChange={(e) => setAlunoId(e.target.value)}
              >
                <MenuItem value="">Selecione um aluno</MenuItem>
                {alunos.map((aluno) => (
                  <MenuItem key={aluno.id} value={aluno.id}>{aluno.nome}</MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth required type="date" label="Data da aula"
                value={dataAula}
                onChange={(e) => setDataAula(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <TextField
                select fullWidth label="Presente?"
                value={presente}
                onChange={(e) => setPresente(e.target.value)}
              >
                <MenuItem value="true">Sim</MenuItem>
                <MenuItem value="false">Não</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={2}>
              <Button fullWidth type="submit" variant="contained" size="large">
                Registrar
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card><CardContent>
            <Typography color="text.secondary">Total de registros</Typography>
            <Typography variant="h4" fontWeight={700}>{resumo.total}</Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card><CardContent>
            <Typography color="text.secondary">Presenças</Typography>
            <Typography variant="h4" fontWeight={700}>{resumo.presencas}</Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card><CardContent>
            <Typography color="text.secondary">Faltas</Typography>
            <Typography variant="h4" fontWeight={700}>{resumo.faltas}</Typography>
          </CardContent></Card>
        </Grid>
      </Grid>

      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>🔎 Consultar registros</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField select fullWidth label="Filtrar por aluno"
              value={filtroAluno} onChange={(e) => setFiltroAluno(e.target.value)}>
              <MenuItem value="">Todos</MenuItem>
              {alunos.map((aluno) => <MenuItem key={aluno.id} value={aluno.id}>{aluno.nome}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth type="date" label="Filtrar por data"
              value={filtroData} onChange={(e) => setFiltroData(e.target.value)}
              InputLabelProps={{ shrink: true }} />
          </Grid>
        </Grid>

        <Box sx={{ overflowX: 'auto', mt: 3 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: 12 }}>Aluno</th>
                <th style={{ textAlign: 'left', padding: 12 }}>Data</th>
                <th style={{ textAlign: 'left', padding: 12 }}>Situação</th>
              </tr>
            </thead>
            <tbody>
              {registrosFiltrados.map((registro) => {
                const isPresent = registro.presente === true || Number(registro.presente) === 1;
                return (
                  <tr key={registro.id}>
                    <td style={{ padding: 12 }}>{registro.aluno}</td>
                    <td style={{ padding: 12 }}>{formatarData(registro.data_aula)}</td>
                    <td style={{ padding: 12 }}>
                      <Chip
                        label={isPresent ? '🟢 Presente' : '🔴 Falta'}
                        color={isPresent ? 'success' : 'error'}
                        variant="outlined"
                      />
                    </td>
                  </tr>
                );
              })}
              {!registrosFiltrados.length && (
                <tr><td colSpan="3" style={{ padding: 20, textAlign: 'center' }}>Nenhum registro encontrado.</td></tr>
              )}
            </tbody>
          </table>
        </Box>
      </Paper>

      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={700}>🏆 Ranking de frequência</Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          O ranking considera todos os registros cadastrados para cada aluno.
        </Typography>

        <Stack spacing={1.5}>
          {ranking.map((aluno, index) => {
            const risco = aluno.percentual < 75;
            return (
              <Box key={aluno.id} sx={{
                p: 2, border: '1px solid #e0e0e0', borderRadius: 2,
                display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap'
              }}>
                <Box>
                  <Typography fontWeight={700}>{index + 1}º — {aluno.nome}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {aluno.presencas} presença(s) • {aluno.faltas} falta(s) • {aluno.total} aula(s)
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography fontWeight={700}>{aluno.percentual.toFixed(1)}%</Typography>
                  <Chip
                    label={risco ? '🔴 Risco de Reprovação' : aluno.percentual >= 90 ? '🟢 Frequência Boa' : '🟡 Atenção'}
                    color={risco ? 'error' : aluno.percentual >= 90 ? 'success' : 'warning'}
                  />
                </Stack>
              </Box>
            );
          })}
        </Stack>

        {ranking.some((aluno) => aluno.percentual < 75) && (
          <Alert severity="error" sx={{ mt: 2 }}>
            ⚠️ Atenção: existe(m) aluno(s) abaixo de 75% de frequência.
          </Alert>
        )}
      </Paper>
    </Stack>
  );
}

export default Frequencia;
