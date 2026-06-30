const STORAGE_KEY = "orai-pedidos";

const form = document.getElementById("request-form");
const nameInput = document.getElementById("nome");
const requestInput = document.getElementById("pedido");
const dateInput = document.getElementById("data");
const listElement = document.getElementById("request-list");
const emptyStateElement = document.getElementById("empty-state");
const messageElement = document.getElementById("form-message");
const totalElement = document.getElementById("total-count");
const openElement = document.getElementById("open-count");
const respondedElement = document.getElementById("responded-count");

const today = new Date().toISOString().split("T")[0];
dateInput.value = today;

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

function listarPedidos() {
  const pedidos = carregarPedidos();
  atualizarResumo(pedidos);
  listElement.innerHTML = "";

  if (pedidos.length === 0) {
    emptyStateElement.hidden = false;
    return;
  }

  emptyStateElement.hidden = true;

  pedidos
    .sort((a, b) => new Date(b.data) - new Date(a.data))
    .forEach((pedido) => {
      const item = document.createElement("li");
      item.className = `request-item${pedido.respondido ? " responded" : ""}`;

      item.innerHTML = `
        <div class="request-header">
          <div>
            <h3>${pedido.nome}</h3>
            <span class="request-date">${formatarData(pedido.data)}</span>
          </div>
          <span class="badge ${pedido.respondido ? "badge-responded" : "badge-open"}">
            ${pedido.respondido ? "Respondido" : "Em oração"}
          </span>
        </div>
        <p class="request-body">${pedido.pedido}</p>
        <div class="request-actions">
          <button type="button" class="button-success" data-action="toggle" data-id="${pedido.id}">
            ${pedido.respondido ? "Reabrir pedido" : "Marcar como respondido"}
          </button>
          <button type="button" class="button-danger" data-action="remove" data-id="${pedido.id}">
            Remover
          </button>
        </div>
      `;

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

listarPedidos();
