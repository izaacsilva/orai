# Orai

Aplicação web simples para cadastrar, listar e gerenciar pedidos de oração.

## Objetivo

O projeto foi pensado como um exemplo pequeno para praticar desenvolvimento com IA no modo agente, usando apenas HTML, CSS e JavaScript puro.

## Funcionalidades

- Listar pedidos de oração
- Adicionar novos pedidos
- Marcar pedidos como respondidos
- Remover pedidos cadastrados
- Salvar os dados localmente com `localStorage`

## Estrutura

```text
orai/
├── index.html
├── style.css
├── app.js
└── README.md
```

## Modelo de dados

Cada pedido é salvo no navegador com a seguinte estrutura:

```json
{
  "id": "uuid-gerado",
  "nome": "Maria",
  "pedido": "Oração pela saúde do meu pai",
  "data": "2026-06-30",
  "respondido": false
}
```

## Como executar

Como este projeto não possui backend nem dependências externas, basta abrir o arquivo `/home/runner/work/orai/orai/index.html` em um navegador.

## Fluxo de uso

1. Preencha o nome do solicitante
2. Escreva o pedido de oração
3. Informe a data
4. Clique em **Salvar pedido**
5. Use os botões da lista para marcar como respondido ou remover

## Próximos passos sugeridos

- Adicionar filtros por status
- Permitir edição de pedidos
- Criar backend com banco de dados
- Adicionar autenticação para múltiplos usuários
