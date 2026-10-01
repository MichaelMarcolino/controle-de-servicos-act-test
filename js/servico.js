// ========================
// CARREGAR SERVIÇOS
// ========================
async function carregarServicos() {
  const { data: servicos, error } = await supabaseClient
    .from('servicos')
    .select('*')
    .order('data', { ascending: false });

  const lista = document.getElementById('lista-servicos');
  lista.innerHTML = '';

  if (error) {
    console.error('Erro ao carregar serviços:', error);
    return;
  }

  servicos.forEach((s) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${s.data} — ${s.descricao} — R$ ${Number(s.valor).toFixed(2)}</span>
      <button data-id="${s.id}" class="btn-apagar">🗑️</button>
    `;
    lista.appendChild(li);
  });
}

// ========================
// DELETAR (delegação de evento — 1 listener só)
// ========================
document.getElementById('lista-servicos').addEventListener('click', async (e) => {
  const btn = e.target.closest('.btn-apagar');
  if (!btn) return; // clicou fora de um botão

  const id = btn.dataset.id;
  if (!id) {
    alert('ID inválido — não foi possível apagar');
    return;
  }

  const { error } = await supabaseClient
    .from('servicos')
    .delete()
    .eq('id', id);

  if (error) {
    alert('Erro ao apagar: ' + error.message);
  } else {
    carregarServicos();
  }
});

// ========================
// ADICIONAR (1 listener só, fora da função)
// ========================
document.getElementById('form-servico').addEventListener('submit', async (e) => {
  e.preventDefault();

  // Desabilita o botão temporariamente pra evitar clique duplo
  const botao = e.target.querySelector('button[type="submit"]');
  if (botao) botao.disabled = true;

  const novo = {
    descricao: document.getElementById('desc-servico').value,
    valor: parseFloat(document.getElementById('valor-servico').value),
    data: document.getElementById('data-servico').value
  };

  const { error } = await supabaseClient
    .from('servicos')
    .insert(novo);

  if (botao) botao.disabled = false;

  if (error) {
    alert('Erro ao salvar: ' + error.message);
  } else {
    e.target.reset();
    carregarServicos();
  }
});

// ========================
// INICIALIZA
// ========================
carregarServicos();