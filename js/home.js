(async () => {
  const session = await protegerPagina();
  if (!session) return;

  // Menu toggle
  document.getElementById('btn-menu').addEventListener('click', () => {
    document.getElementById('menu').classList.toggle('menu-escondido');
  });

  // Sair
  document.getElementById('sair').addEventListener('click', async (e) => {
    e.preventDefault();
    await supabaseClient.auth.signOut();
    window.location.href = 'index.html';
  });

  // Atualiza saldos do dia
  async function atualizarSaldos() {
    const hoje = new Date().toISOString().split('T')[0];

    const { data: servicos, error: erroServ } = await supabaseClient
      .from('servicos')
      .select('valor')
      .eq('data', hoje);

    const { data: gastos, error: erroGast } = await supabaseClient
      .from('gastos')
      .select('valor')
      .eq('data', hoje);

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
})();