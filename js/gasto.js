async function carregarGastos() {
  const { data: gastos, error } = await supabaseClient
    .from('gastos')
    .select('*')
    .order('data', { ascending: false });

  const lista = document.getElementById('lista-gastos');
  lista.innerHTML = '';

  if (error) {
    console.error('Erro ao carregar gastos:', error);
    return;
  }

  gastos.forEach((g) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${g.data} — ${g.descricao} — R$ ${Number(g.valor).toFixed(2)}</span>
      <button data-id="${g.id}" class="btn-apagar">🗑️</button>
    `;
    lista.appendChild(li);
  });

  document.querySelectorAll('.btn-apagar').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.target.dataset.id;
      const { error } = await supabaseClient
        .from('gastos')
        .delete()
        .eq('id', id);

      if (error) {
        alert('Erro ao apagar: ' + error.message);
      } else {
        carregarGastos();
      }
    });
  });
}

document.getElementById('form-gasto').addEventListener('submit', async (e) => {
  e.preventDefault();

  const novo = {
    descricao: document.getElementById('desc-gasto').value,
    valor: parseFloat(document.getElementById('valor-gasto').value),
    data: document.getElementById('data-gasto').value
  };

  const { error } = await supabaseClient
    .from('gastos')
    .insert(novo);

  if (error) {
    alert('Erro ao salvar: ' + error.message);
  } else {
    e.target.reset();
    carregarGastos();
  }
});

carregarGastos();