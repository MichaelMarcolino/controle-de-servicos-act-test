(async () => {
  const session = await protegerPagina();
  if (!session) return;

  // ========================
  // CARREGAR GASTOS
  // ========================
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

    if (gastos.length === 0) {
      lista.innerHTML = '<li class="vazio">Nenhum gasto lançado.</li>';
      return;
    }

    const grupos = {};
    gastos.forEach((g) => {
      if (!grupos[g.data]) grupos[g.data] = [];
      grupos[g.data].push(g);
    });

    const datas = Object.keys(grupos).sort((a, b) => b.localeCompare(a));
    const hoje = new Date().toISOString().split('T')[0];

    datas.forEach((data) => {
      const itens = grupos[data];
      const total = itens.reduce((s, i) => s + Number(i.valor), 0);
      const dataBR = data.split('-').reverse().join('/');

      const grupo = document.createElement('li');
      grupo.className = 'grupo-data';

      grupo.innerHTML = `
        <details ${data === hoje ? 'open' : ''}>
          <summary>
            <span class="grupo-titulo">📅 ${dataBR}</span>
            <span class="grupo-info">${itens.length} lançamento${itens.length > 1 ? 's' : ''} — R$ ${total.toFixed(2)}</span>
          </summary>
          <ul class="grupo-itens">
            ${itens.map(g => `
              <li>
                <span>${g.descricao} — R$ ${Number(g.valor).toFixed(2)}</span>
                <button data-id="${g.id}" class="btn-apagar">🗑️</button>
              </li>
            `).join('')}
          </ul>
        </details>
      `;

      lista.appendChild(grupo);
    });
  }

  // ========================
  // DELETAR
  // ========================
  document.getElementById('lista-gastos').addEventListener('click', async (e) => {
    const btn = e.target.closest('.btn-apagar');
    if (!btn) return;

    const id = btn.dataset.id;
    if (!id) return;

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

  // ========================
  // ADICIONAR
  // ========================
  let salvando = false;

  document.getElementById('form-gasto').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (salvando) return;
    salvando = true;

    const botao = e.target.querySelector('button[type="submit"]');
    if (botao) botao.disabled = true;

    const novo = {
      descricao: document.getElementById('desc-gasto').value,
      valor: parseFloat(document.getElementById('valor-gasto').value),
      data: document.getElementById('data-gasto').value,
      user_id: session.user.id
    };

    const { error } = await supabaseClient
      .from('gastos')
      .insert(novo);

    salvando = false;
    if (botao) botao.disabled = false;

    if (error) {
      alert('Erro ao salvar: ' + error.message);
    } else {
      e.target.reset();
      preencherDataHoje();
      carregarGastos();
    }
  });

  // ========================
  // PREENCHE DATA COM HOJE
  // ========================
  function preencherDataHoje() {
    const campo = document.getElementById('data-gasto');
    if (!campo || campo.value) return;

    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');
    campo.value = `${ano}-${mes}-${dia}`;
  }

  preencherDataHoje();
  carregarGastos();
})();