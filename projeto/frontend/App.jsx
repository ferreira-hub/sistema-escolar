import { useEffect, useState } from 'react';
import Frequencia from './Frequencia';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Container,
  FormControl,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

const initialAlunoForm = {
  nome: '',
  email: '',
  data_nascimento: '',
  serie: '',
  cpf: '',
  telefone: '',
  endereco: '',
};

const initialTurmaForm = {
  nome: '',
  serie: '',
  ano: new Date().getFullYear().toString(),
  alunosIds: [],
};

const menuItems = [
  { key: 'dashboard', label: 'Início', description: 'Visão geral do sistema' },
  { key: 'alunos', label: 'Alunos', description: 'Cadastro e consulta de estudantes' },
  { key: 'professores', label: 'Professores', description: 'Gestão da equipe' },
  { key: 'turmas', label: 'Turmas', description: 'Organização escolar e vínculo' },
  { key: 'financeiro', label: 'Financeiro', description: 'Mensalidades e contas' },
  { key: 'relatorios', label: 'Relatórios', description: 'Indicadores da escola' },
  { key: 'frequencia', label: 'Frequência', description: 'Presenças, faltas e alunos em risco' },
];

function App() {
  // Estados gerais
  const [view, setView] = useState('dashboard');
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ usuario: '', senha: '' });
  const [message, setMessage] = useState('');

  // Estados de Alunos
  const [alunoForm, setAlunoForm] = useState(initialAlunoForm);
  const [alunos, setAlunos] = useState([]);

  // Estados de Turmas
  const [turmaForm, setTurmaForm] = useState(initialTurmaForm);
  const [turmas, setTurmas] = useState([]);

  // Carga de dados
  const carregarAlunos = async () => {
    try {
      const response = await fetch('/api/alunos');
      if (!response.ok) throw new Error('Erro ao carregar alunos');
      const data = await response.json();
      setAlunos(data);
    } catch (error) {
      console.error(error);
    }
  };

  const carregarTurmas = async () => {
    try {
      const response = await fetch('/api/turmas');
      if (!response.ok) throw new Error('Erro ao carregar turmas');
      const data = await response.json();
      setTurmas(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    carregarAlunos();
    carregarTurmas();
  }, []);

  // Handlers do Login
  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    setLoginForm({ ...loginForm, [name]: value });
  };

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    if (loginForm.usuario && loginForm.senha) {
      setLoggedIn(true);
    }
  };

  // Handlers do Cadastro de Alunos
  const handleAlunoChange = (event) => {
    const { name, value } = event.target;
    setAlunoForm({ ...alunoForm, [name]: value });
  };

  const handleAlunoSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/alunos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alunoForm),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Erro ao cadastrar aluno');
      }

      setMessage('Aluno cadastrado com sucesso!');
      setAlunoForm(initialAlunoForm);
      carregarAlunos();
    } catch (error) {
      setMessage(error.message);
    }
  };

  // Handlers do Cadastro de Turmas
  const handleTurmaChange = (event) => {
    const { name, value } = event.target;
    setTurmaForm({ ...turmaForm, [name]: value });
  };

  const handleSelectAlunosTurma = (event) => {
    const {
      target: { value },
    } = event;
    setTurmaForm({
      ...turmaForm,
      alunosIds: typeof value === 'string' ? value.split(',') : value,
    });
  };

  const handleTurmaSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/turmas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(turmaForm),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Erro ao cadastrar turma');
      }

      setMessage('Turma cadastrada com sucesso!');
      setTurmaForm(initialTurmaForm);
      carregarTurmas();
    } catch (error) {
      setMessage(error.message);
    }
  };

  // Tela de Login
  if (!loggedIn) {
    return (
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Paper elevation={6} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4 }}>
          <Stack spacing={3} alignItems="center">
            <Box textAlign="center">
              <Typography variant="h4" fontWeight={700}>
                Sistema Escolar
              </Typography>
              <Typography color="text.secondary">
                Acesso provisório ao painel administrativo.
              </Typography>
            </Box>

            <form onSubmit={handleLoginSubmit} style={{ width: '100%' }}>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Usuário"
                  name="usuario"
                  value={loginForm.usuario}
                  onChange={handleLoginChange}
                />
                <TextField
                  fullWidth
                  label="Senha"
                  name="senha"
                  type="password"
                  value={loginForm.senha}
                  onChange={handleLoginChange}
                />
                <Button type="submit" variant="contained" size="large">
                  Entrar
                </Button>
              </Stack>
            </form>

            <Typography variant="body2" color="text.secondary" textAlign="center">
              Login ainda será implementado com autenticação real no próximo passo.
            </Typography>
          </Stack>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 3, md: 4 }, borderRadius: 4 }}>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h4" fontWeight={700}>
                Painel Escolar
              </Typography>
              <Typography color="text.secondary">
                Gestão administrativa, turmas e cadastro de estudantes.
              </Typography>
            </Box>
            <Button variant="outlined" onClick={() => setLoggedIn(false)}>
              Sair
            </Button>
          </Box>

          <Grid container spacing={2}>
            {menuItems.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.key}>
                <Button
                  fullWidth
                  variant={view === item.key ? 'contained' : 'outlined'}
                  sx={{ justifyContent: 'flex-start', py: 2, px: 2, minHeight: 88 }}
                  onClick={() => {
                    setView(item.key);
                    setMessage('');
                  }}
                >
                  <Box textAlign="left">
                    <Typography fontWeight={600}>{item.label}</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      {item.description}
                    </Typography>
                  </Box>
                </Button>
              </Grid>
            ))}
          </Grid>

          {/* MÓDULO DE ALUNOS */}
          {view === 'alunos' && (
            <Box>
              <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
                Cadastro de Alunos
              </Typography>

              {message && (
                <Alert severity={message.includes('sucesso') ? 'success' : 'error'} sx={{ mb: 2 }}>
                  {message}
                </Alert>
              )}

              <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                <form onSubmit={handleAlunoSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField fullWidth label="Nome" name="nome" value={alunoForm.nome} onChange={handleAlunoChange} required />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField fullWidth label="E-mail" name="email" type="email" value={alunoForm.email} onChange={handleAlunoChange} required />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField fullWidth label="Data de nascimento" name="data_nascimento" type="date" value={alunoForm.data_nascimento} onChange={handleAlunoChange} InputLabelProps={{ shrink: true }} required />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField select fullWidth label="Série" name="serie" value={alunoForm.serie} onChange={handleAlunoChange} required>
                        <MenuItem value="1º Ano">1º Ano</MenuItem>
                        <MenuItem value="2º Ano">2º Ano</MenuItem>
                        <MenuItem value="3º Ano">3º Ano</MenuItem>
                        <MenuItem value="4º Ano">4º Ano</MenuItem>
                        <MenuItem value="5º Ano">5º Ano</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField fullWidth label="CPF" name="cpf" value={alunoForm.cpf} onChange={handleAlunoChange} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField fullWidth label="Telefone" name="telefone" value={alunoForm.telefone} onChange={handleAlunoChange} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField fullWidth label="Endereço" name="endereco" value={alunoForm.endereco} onChange={handleAlunoChange} />
                    </Grid>
                  </Grid>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3 }}>
                    <Button type="submit" variant="contained" size="large">
                      Salvar aluno
                    </Button>
                    <Button variant="outlined" size="large" onClick={() => setAlunoForm(initialAlunoForm)}>
                      Limpar
                    </Button>
                  </Stack>
                </form>
              </Paper>

              <Card sx={{ mt: 4 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Alunos cadastrados
                  </Typography>
                  {alunos.length === 0 ? (
                    <Typography color="text.secondary">Nenhum aluno cadastrado ainda.</Typography>
                  ) : (
                    <Stack spacing={1}>
                      {alunos.map((aluno) => (
                        <Box key={aluno.id} sx={{ p: 1.5, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                          <Typography fontWeight={600}>{aluno.nome}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {aluno.email} • {aluno.serie}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  )}
                </CardContent>
              </Card>
            </Box>
          )}

          {/* MÓDULO DE TURMAS (REQUISITOS ATENDIDOS) */}
          {view === 'turmas' && (
            <Box>
              <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
                Cadastro e Gestão de Turmas
              </Typography>

              {message && (
                <Alert severity={message.includes('sucesso') ? 'success' : 'error'} sx={{ mb: 2 }}>
                  {message}
                </Alert>
              )}

              <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                <form onSubmit={handleTurmaSubmit}>
                  <Grid container spacing={2}>
                    {/* ✅ REQUISITO: Nome preenchido */}
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Nome da Turma"
                        name="nome"
                        value={turmaForm.nome}
                        onChange={handleTurmaChange}
                        placeholder="Ex: Turma 101-A"
                        required
                      />
                    </Grid>

                    {/* ✅ REQUISITO: Série preenchida */}
                    <Grid item xs={12} md={4}>
                      <TextField
                        select
                        fullWidth
                        label="Série"
                        name="serie"
                        value={turmaForm.serie}
                        onChange={handleTurmaChange}
                        required
                      >
                        <MenuItem value="1º Ano">1º Ano</MenuItem>
                        <MenuItem value="2º Ano">2º Ano</MenuItem>
                        <MenuItem value="3º Ano">3º Ano</MenuItem>
                        <MenuItem value="4º Ano">4º Ano</MenuItem>
                        <MenuItem value="5º Ano">5º Ano</MenuItem>
                      </TextField>
                    </Grid>

                    {/* ✅ REQUISITO: Ano preenchido */}
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Ano Letivo"
                        name="ano"
                        type="number"
                        value={turmaForm.ano}
                        onChange={handleTurmaChange}
                        required
                      />
                    </Grid>

                    {/* ✅ REQUISITO: Relacionamento / Alunos vinculados */}
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel id="select-alunos-turma-label">Vincular Alunos</InputLabel>
                        <Select
                          labelId="select-alunos-turma-label"
                          multiple
                          value={turmaForm.alunosIds}
                          onChange={handleSelectAlunosTurma}
                          input={<OutlinedInput label="Vincular Alunos" />}
                          renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {selected.map((id) => {
                                const aluno = alunos.find((a) => a.id === id);
                                return <Chip key={id} label={aluno ? aluno.nome : id} size="small" />;
                              })}
                            </Box>
                          )}
                        >
                          {alunos.length === 0 ? (
                            <MenuItem disabled value="">
                              <em>Nenhum aluno cadastrado no sistema</em>
                            </MenuItem>
                          ) : (
                            alunos.map((aluno) => (
                              <MenuItem key={aluno.id} value={aluno.id}>
                                <Checkbox checked={turmaForm.alunosIds.indexOf(aluno.id) > -1} />
                                <ListItemText primary={aluno.nome} secondary={`${aluno.serie} • ${aluno.email}`} />
                              </MenuItem>
                            ))
                          )}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3 }}>
                    <Button type="submit" variant="contained" size="large">
                      Salvar turma
                    </Button>
                    <Button variant="outlined" size="large" onClick={() => setTurmaForm(initialTurmaForm)}>
                      Limpar
                    </Button>
                  </Stack>
                </form>
              </Paper>

              {/* ✅ REQUISITO: Dados corretos na listagem */}
              <Card sx={{ mt: 4 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Turmas cadastradas
                  </Typography>
                  {turmas.length === 0 ? (
                    <Typography color="text.secondary">Nenhuma turma cadastrada ainda.</Typography>
                  ) : (
                    <Stack spacing={2}>
                      {turmas.map((turma) => (
                        <Box key={turma.id} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                            <Typography fontWeight={700} variant="subtitle1">
                              {turma.nome}
                            </Typography>
                            <Chip label={`Ano: ${turma.ano}`} color="primary" variant="outlined" size="small" />
                          </Stack>

                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            <strong>Série:</strong> {turma.serie}
                          </Typography>

                          <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 0.5 }}>
                            Alunos Vinculados ({turma.alunos ? turma.alunos.length : 0}):
                          </Typography>

                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {turma.alunos && turma.alunos.length > 0 ? (
                              turma.alunos.map((aluno) => (
                                <Chip key={aluno.id || aluno.nome} label={aluno.nome} size="small" variant="filled" />
                              ))
                            ) : (
                              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                Nenhum aluno vinculado nesta turma.
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  )}
                </CardContent>
              </Card>
            </Box>
          )}

          {/* OUTROS MÓDULOS (PLACEHOLDER) */}
          {view !== 'alunos' && view !== 'turmas' && (
            <Paper variant="outlined" sx={{ p: 4, borderRadius: 3 }}>
              <Typography variant="h6" gutterBottom>
                {menuItems.find((item) => item.key === view)?.label}
              </Typography>
              <Typography color="text.secondary">
                Esta área ficará disponível para a próxima etapa do sistema escolar.
              </Typography>
            </Paper>
          )}
        </Stack>
      </Paper>
    </Container>
  );
}

export default App;