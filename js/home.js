// Menu toggle
document.getElementById('btn-menu').addEventListener('click', () => {
  document.getElementById('menu').classList.toggle('menu-escondido');
});

// Sair
document.getElementById('sair').addEventListener('click', (e) => {
  e.preventDefault();
  localStorage.removeItem('logado');
  window.location.href = 'index.html';
});

// Atualiza saldos na home (via Supabase)
async function atualizarSaldos() {
  const { data: servicos, error: erroServ } = await supabaseClient
    .from('servicos')
    .select('valor');

  const { data: gastos, error: erroGast } = await supabaseClient
    .from('gastos')
    .select('valor');

  if (erroServ || erroGast) {
    console.error('Erro ao carregar saldos:', erroServ || erroGast);
    return;
  }

  const totalServ = servicos.reduce((s, i) => s + Number(i.valor), 0);
  const totalGast = gastos.reduce((s, i) => s + Number(i.valor), 0);

  document.getElementById('saldo-atual').textContent =
    `R$ ${totalServ.toFixed(2)}`;
  document.getElementById('saldo-desconto').textContent =
    `R$ ${(totalServ - totalGast).toFixed(2)}`;
}

atualizarSaldos();