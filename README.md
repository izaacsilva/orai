# Orai

Aplicação web simples para cadastrar, listar e gerenciar pedidos de oração.

## Objetivo

O projeto foi pensado como um exemplo pequeno para praticar desenvolvimento com IA no modo agente, usando apenas HTML, CSS e JavaScript puro.

## Funcionalidades

- Listar pedidos de oração
- Adicionar novos pedidos
- Marcar pedidos como respondidos
- Remover pedidos cadastrados
- Filtrar pedidos por status, texto e intervalo de datas
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
5. Use os filtros para localizar pedidos por status, nome, conteúdo ou período
6. Use os botões da lista para marcar como respondido ou remover

## Filtragem

Os pedidos cadastrados podem ser filtrados com combinações dos seguintes critérios:

- **Status**: todos, em oração ou respondidos
- **Busca por texto**: pesquisa por nome do solicitante e conteúdo do pedido
- **Intervalo de datas**: data inicial e data final

Comportamento esperado:

- Ao abrir a aplicação, todos os pedidos são exibidos
- Os filtros ativos são salvos no `localStorage` e reaplicados ao recarregar a página
- O resumo mostra a quantidade de itens visíveis com os filtros atuais
- Quando existem pedidos cadastrados, mas nenhum corresponde aos filtros, a interface exibe uma mensagem específica para esse caso

## Próximos passos sugeridos

- Adicionar filtros por status
- Permitir edição de pedidos
- Criar backend com banco de dados
- Adicionar autenticação para múltiplos usuários
