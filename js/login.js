document.getElementById('form-login').addEventListener('submit', (e) => {
  e.preventDefault();
  const user = document.getElementById('usuario').value;
  const pass = document.getElementById('senha').value;

  // Login provisório (depois trocar pelo banco)
  if (user === 'admin' && pass === '1234') {
    localStorage.setItem('logado', 'true');
    window.location.href = 'home.html';
  } else {
    document.getElementById('msg-erro').textContent = 'Usuário ou senha inválidos';
  }
});

// Se já estiver logado, vai direto
if (localStorage.getItem('logado') === 'true') {
  window.location.href = 'home.html';
}