const STORAGE_KEY = "orai-pedidos";
const FILTERS_STORAGE_KEY = "orai-filtros";
const DEFAULT_FILTERS = {
  search: "",
  status: "todos",
  startDate: "",
  endDate: "",
};

const form = document.getElementById("request-form");
const nameInput = document.getElementById("nome");
const requestInput = document.getElementById("pedido");
const dateInput = document.getElementById("data");
const searchFilterInput = document.getElementById("search-filter");
const statusFilterInput = document.getElementById("status-filter");
const startDateFilterInput = document.getElementById("start-date-filter");
const endDateFilterInput = document.getElementById("end-date-filter");
const clearFiltersButton = document.getElementById("clear-filters");
const listElement = document.getElementById("request-list");
const emptyStateElement = document.getElementById("empty-state");
const messageElement = document.getElementById("form-message");
const totalElement = document.getElementById("total-count");
const openElement = document.getElementById("open-count");
const respondedElement = document.getElementById("responded-count");

const today = new Date().toISOString().split("T")[0];
let activeFilters = carregarFiltros();

dateInput.value = today;

function normalizarTexto(texto) {
  return texto.trim().toLocaleLowerCase("pt-BR");
}

function normalizarFiltros(filtros = {}) {
  const startDate = filtros.startDate || "";
  const endDate = filtros.endDate || "";

  return {
    search: typeof filtros.search === "string" ? filtros.search.trim() : "",
    status:
      filtros.status === "em-oracao" || filtros.status === "respondidos"
        ? filtros.status
        : "todos",
    startDate,
    endDate,
  };
}

function carregarPedidos() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    return [];
  }

  try {
    const pedidos = JSON.parse(data);
    return Array.isArray(pedidos) ? pedidos : [];
  } catch {
    return [];
  }
}

function salvarPedidos(pedidos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pedidos));
}

function carregarFiltros() {
  const data = localStorage.getItem(FILTERS_STORAGE_KEY);
  if (!data) {
    return { ...DEFAULT_FILTERS };
  }

  try {
    return normalizarFiltros(JSON.parse(data));
  } catch {
    return { ...DEFAULT_FILTERS };
  }
}

function salvarFiltros(filtros) {
  localStorage.setItem(
    FILTERS_STORAGE_KEY,
    JSON.stringify(normalizarFiltros(filtros))
  );
}

function gerarId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatarData(data) {
  if (!data) {
    return "Data não informada";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(`${data}T00:00:00`));
}

function exibirMensagem(texto) {
  messageElement.textContent = texto;
  window.setTimeout(() => {
    if (messageElement.textContent === texto) {
      messageElement.textContent = "";
    }
  }, 3000);
}

function atualizarResumo(pedidos) {
  const respondidos = pedidos.filter((pedido) => pedido.respondido).length;
  totalElement.textContent = pedidos.length;
  respondedElement.textContent = respondidos;
  openElement.textContent = pedidos.length - respondidos;
}

function obterPeriodoNormalizado({ startDate, endDate }) {
  if (startDate && endDate && startDate > endDate) {
    return { startDate: endDate, endDate: startDate };
  }

  return { startDate, endDate };
}

function aplicarFiltros(pedidos, filtros) {
  const { search, status } = normalizarFiltros(filtros);
  const { startDate, endDate } = obterPeriodoNormalizado(filtros);
  const normalizedSearch = normalizarTexto(search);

  return pedidos.filter((pedido) => {
    const matchesSearch =
      !normalizedSearch ||
      normalizarTexto(`${pedido.nome} ${pedido.pedido}`).includes(normalizedSearch);

    const matchesStatus =
      status === "todos" ||
      (status === "respondidos" && pedido.respondido) ||
      (status === "em-oracao" && !pedido.respondido);

    const matchesStartDate = !startDate || pedido.data >= startDate;
    const matchesEndDate = !endDate || pedido.data <= endDate;

    return matchesSearch && matchesStatus && matchesStartDate && matchesEndDate;
  });
}

function atualizarCamposDeFiltro() {
  searchFilterInput.value = activeFilters.search;
  statusFilterInput.value = activeFilters.status;
  startDateFilterInput.value = activeFilters.startDate;
  endDateFilterInput.value = activeFilters.endDate;
}

function atualizarFiltros(novosFiltros) {
  activeFilters = normalizarFiltros({ ...activeFilters, ...novosFiltros });
  salvarFiltros(activeFilters);
  atualizarCamposDeFiltro();
  listarPedidos();
}

function listarPedidos() {
  const pedidos = carregarPedidos();
  const pedidosFiltrados = aplicarFiltros(pedidos, activeFilters);

  atualizarResumo(pedidosFiltrados);
  listElement.innerHTML = "";

  if (pedidos.length === 0) {
    emptyStateElement.textContent = "Nenhum pedido cadastrado até o momento.";
    emptyStateElement.hidden = false;
    return;
  }

  if (pedidosFiltrados.length === 0) {
    emptyStateElement.textContent =
      "Nenhum pedido encontrado com os filtros atuais.";
    emptyStateElement.hidden = false;
    return;
  }

  emptyStateElement.hidden = true;

  pedidosFiltrados
    .sort((a, b) => new Date(b.data) - new Date(a.data))
    .forEach((pedido) => {
      const item = document.createElement("li");
      item.className = `request-item${pedido.respondido ? " responded" : ""}`;

      const header = document.createElement("div");
      header.className = "request-header";

      const titleGroup = document.createElement("div");
      const title = document.createElement("h3");
      title.textContent = pedido.nome;
      const date = document.createElement("span");
      date.className = "request-date";
      date.textContent = formatarData(pedido.data);
      titleGroup.append(title, date);

      const badge = document.createElement("span");
      badge.className = `badge ${pedido.respondido ? "badge-responded" : "badge-open"}`;
      badge.textContent = pedido.respondido ? "Respondido" : "Em oração";
      header.append(titleGroup, badge);

      const body = document.createElement("p");
      body.className = "request-body";
      body.textContent = pedido.pedido;

      const actions = document.createElement("div");
      actions.className = "request-actions";

      const toggleButton = document.createElement("button");
      toggleButton.type = "button";
      toggleButton.className = "button-success";
      toggleButton.dataset.action = "toggle";
      toggleButton.dataset.id = pedido.id;
      toggleButton.textContent = pedido.respondido
        ? "Reabrir pedido"
        : "Marcar como respondido";

      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.className = "button-danger";
      removeButton.dataset.action = "remove";
      removeButton.dataset.id = pedido.id;
      removeButton.textContent = "Remover";

      actions.append(toggleButton, removeButton);
      item.append(header, body, actions);

      listElement.appendChild(item);
    });
}

function adicionarPedido(event) {
  event.preventDefault();

  const nome = nameInput.value.trim();
  const pedido = requestInput.value.trim();
  const data = dateInput.value;

  if (!nome || !pedido || !data) {
    exibirMensagem("Preencha todos os campos antes de salvar.");
    return;
  }

  const pedidos = carregarPedidos();
  pedidos.unshift({
    id: gerarId(),
    nome,
    pedido,
    data,
    respondido: false,
  });

  salvarPedidos(pedidos);
  form.reset();
  dateInput.value = today;
  listarPedidos();
  exibirMensagem("Pedido cadastrado com sucesso.");
}

function marcarRespondido(id) {
  const pedidos = carregarPedidos().map((pedido) =>
    pedido.id === id ? { ...pedido, respondido: !pedido.respondido } : pedido
  );

  salvarPedidos(pedidos);
  listarPedidos();
}

function removerPedido(id) {
  const pedidos = carregarPedidos().filter((pedido) => pedido.id !== id);
  salvarPedidos(pedidos);
  listarPedidos();
}

form.addEventListener("submit", adicionarPedido);
form.addEventListener("reset", () => {
  window.setTimeout(() => {
    dateInput.value = today;
    messageElement.textContent = "";
  }, 0);
});

searchFilterInput.addEventListener("input", (event) => {
  atualizarFiltros({ search: event.target.value });
});

statusFilterInput.addEventListener("change", (event) => {
  atualizarFiltros({ status: event.target.value });
});

startDateFilterInput.addEventListener("change", (event) => {
  atualizarFiltros({ startDate: event.target.value });
});

endDateFilterInput.addEventListener("change", (event) => {
  atualizarFiltros({ endDate: event.target.value });
});

clearFiltersButton.addEventListener("click", () => {
  activeFilters = { ...DEFAULT_FILTERS };
  salvarFiltros(activeFilters);
  atualizarCamposDeFiltro();
  listarPedidos();
});

listElement.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) {
    return;
  }

  const { action, id } = button.dataset;

  if (action === "toggle") {
    marcarRespondido(id);
  }

  if (action === "remove") {
    removerPedido(id);
  }
});

atualizarCamposDeFiltro();
listarPedidos();
