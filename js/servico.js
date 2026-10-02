(async () => {
  const session = await protegerPagina();
  if (!session) return;

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

    if (servicos.length === 0) {
      lista.innerHTML = '<li class="vazio">Nenhum serviço lançado.</li>';
      return;
    }

    const grupos = {};
    servicos.forEach((s) => {
      if (!grupos[s.data]) grupos[s.data] = [];
      grupos[s.data].push(s);
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
            ${itens.map(s => `
              <li>
                <span>${s.descricao} — R$ ${Number(s.valor).toFixed(2)}</span>
                <button data-id="${s.id}" class="btn-apagar">🗑️</button>
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
  document.getElementById('lista-servicos').addEventListener('click', async (e) => {
    const btn = e.target.closest('.btn-apagar');
    if (!btn) return;

    const id = btn.dataset.id;
    if (!id) return;

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
  // ADICIONAR
  // ========================
  let salvando = false;

  document.getElementById('form-servico').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (salvando) return;
    salvando = true;

    const botao = e.target.querySelector('button[type="submit"]');
    if (botao) botao.disabled = true;

    const novo = {
      descricao: document.getElementById('desc-servico').value,
      valor: parseFloat(document.getElementById('valor-servico').value),
      data: document.getElementById('data-servico').value,
      user_id: session.user.id
    };

    const { error } = await supabaseClient
      .from('servicos')
      .insert(novo);

    salvando = false;
    if (botao) botao.disabled = false;

    if (error) {
      alert('Erro ao salvar: ' + error.message);
    } else {
      e.target.reset();
      preencherDataHoje();
      carregarServicos();
    }
  });

  // ========================
  // PREENCHE DATA COM HOJE
  // ========================
  function preencherDataHoje() {
    const campo = document.getElementById('data-servico');
    if (!campo || campo.value) return;

    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');
    campo.value = `${ano}-${mes}-${dia}`;
  }

  preencherDataHoje();
  carregarServicos();
})();