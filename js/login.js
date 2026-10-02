// ========================
// TROCA DE ABAS
// ========================
const tabLogin = document.getElementById('tab-login');
const tabCadastro = document.getElementById('tab-cadastro');
const formLogin = document.getElementById('form-login');
const formCadastro = document.getElementById('form-cadastro');
const msgErro = document.getElementById('msg-erro');

tabLogin.addEventListener('click', () => {
  tabLogin.classList.add('ativo');
  tabCadastro.classList.remove('ativo');
  formLogin.classList.add('form-ativo');
  formLogin.classList.remove('form-escondido');
  formCadastro.classList.add('form-escondido');
  formCadastro.classList.remove('form-ativo');
  msgErro.textContent = '';
});

tabCadastro.addEventListener('click', () => {
  tabCadastro.classList.add('ativo');
  tabLogin.classList.remove('ativo');
  formCadastro.classList.add('form-ativo');
  formCadastro.classList.remove('form-escondido');
  formLogin.classList.add('form-escondido');
  formLogin.classList.remove('form-ativo');
  msgErro.textContent = '';
});

function mostrarErro(msg) {
  msgErro.textContent = msg;
}

// ========================
// LOGIN
// ========================
formLogin.addEventListener('submit', async (e) => {
  e.preventDefault();
  mostrarErro('');

  const email = document.getElementById('login-email').value.trim();
  const senha = document.getElementById('login-senha').value;

  const { error } = await supabaseClient.auth.signInWithPassword({
    email,
    password: senha
  });

  if (error) {
    mostrarErro('Erro ao entrar: ' + traduzErro(error.message));
    return;
  }

  window.location.href = 'home.html';
});

// ========================
// CADASTRO
// ========================
formCadastro.addEventListener('submit', async (e) => {
  e.preventDefault();
  mostrarErro('');

  const email = document.getElementById('cad-email').value.trim();
  const senha = document.getElementById('cad-senha').value;
  const senha2 = document.getElementById('cad-senha2').value;

  if (senha !== senha2) {
    mostrarErro('As senhas não coincidem');
    return;
  }

  const { error } = await supabaseClient.auth.signUp({
    email,
    password: senha
  });

  if (error) {
    mostrarErro('Erro ao cadastrar: ' + traduzErro(error.message));
    return;
  }

  alert('Cadastro realizado! Você já pode fazer login.');
  tabLogin.click();
  document.getElementById('login-email').value = email;
});

// ========================
// SE JÁ ESTIVER LOGADO, VAI DIRETO
// ========================
(async () => {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (session) {
    window.location.href = 'home.html';
  }
})();

// ========================
// TRADUZ ERROS
// ========================
function traduzErro(msg) {
  if (msg.includes('Invalid login credentials')) return 'Email ou senha incorretos';
  if (msg.includes('User already registered')) return 'Este email já está cadastrado';
  if (msg.includes('Password should be at least')) return 'Senha muito curta (mínimo 6 caracteres)';
  if (msg.includes('Unable to validate email')) return 'Email inválido';
  return msg;
}