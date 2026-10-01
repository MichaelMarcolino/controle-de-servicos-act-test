document.getElementById('data-filtro').addEventListener('change', async (e) => {
  const data = e.target.value;

  const { data: servicos, error: errServ } = await supabaseClient
    .from('servicos')
    .select('*')
    .eq('data', data);

  const { data: gastos, error: errGast } = await supabaseClient
    .from('gastos')
    .select('*')
    .eq('data', data);

  if (errServ || errGast) {
    console.error('Erro:', errServ || errGast);
    return;
  }

  const totServ = servicos.reduce((s, i) => s + Number(i.valor), 0);
  const totGast = gastos.reduce((s, i) => s + Number(i.valor), 0);

  document.getElementById('resultado').innerHTML = `
    <h2>Resumo de ${data.split('-').reverse().join('/')}</h2>

    <h3>Serviços (R$ ${totServ.toFixed(2)})</h3>
    <ul>${servicos.map(s => `<li>${s.descricao} — R$ ${Number(s.valor).toFixed(2)}</li>`).join('') || '<li>Nenhum</li>'}</ul>

    <h3>Gastos (R$ ${totGast.toFixed(2)})</h3>
    <ul>${gastos.map(g => `<li>${g.descricao} — R$ ${Number(g.valor).toFixed(2)}</li>`).join('') || '<li>Nenhum</li>'}</ul>

    <p><strong>Saldo do dia: R$ ${(totServ - totGast).toFixed(2)}</strong></p>
  `;
});