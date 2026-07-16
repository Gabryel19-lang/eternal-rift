# Branching Dialogue — Eternal Rift

O sistema carrega as árvores de `assets/dialogues/branching-dialogues.json` e é controlado por `branching-dialogue.js`. Ele usa os spritesheets existentes dos NPCs como retrato e salva missões, itens, recompensas recebidas e melhorias de arma dentro do save do jogo.

## Controles

- PC: `E` ou `Enter` confirma, setas/`W`/`S` mudam a seleção, números `1–9` escolhem uma resposta e `Esc` fecha.
- Mobile: toque em uma resposta e depois em **Continuar**, ou toque diretamente na opção desejada.

## Estrutura mínima

```json
{
  "npc": {
    "name": "Nome do NPC",
    "title": "Função",
    "portrait": {
      "src": "assets/npcs/villager_sheet.png",
      "columns": 4,
      "rows": 4,
      "column": 0,
      "row": 0
    }
  },
  "startNode": "intro",
  "nodes": {
    "intro": {
      "text": "Fala do NPC.",
      "options": [
        {
          "text": "Resposta do jogador.",
          "target": "proximo_no",
          "conditions": [
            { "type": "coinsAtLeast", "amount": 10 }
          ],
          "actions": [
            { "type": "buyItem", "itemId": "item_teste", "itemName": "Item Teste", "amount": 1, "price": 10 }
          ]
        }
      ]
    },
    "proximo_no": {
      "text": "A compra foi concluída.",
      "next": "intro"
    }
  }
}
```

## Ações aceitas

| Ação | Campos principais | Resultado |
|---|---|---|
| `closeDialogue` | — | Fecha a conversa. |
| `openShop` | — | Fecha a conversa e abre a loja existente. |
| `startMission` | `missionId`, `name` | Aceita uma missão e salva seu estado. |
| `completeMission` | `missionId` | Marca uma missão como concluída. |
| `giveItem` | `itemId`, `itemName`, `amount`, `once` opcional | Entrega um item ao jogador. |
| `takeItem` | `itemId`, `itemName`, `amount` | Retira/entrega um item do jogador ao NPC. |
| `buyItem` | `itemId`, `itemName`, `amount`, `price` | Cobra moedas e entrega o item. |
| `upgradeWeapon` | `weapon`, `cost`, `amount` | Melhora permanentemente a arma. Use `"weapon": "equipped"`. |

## Condições aceitas

| Condição | Exemplo |
|---|---|
| `hasItem` | `{ "type": "hasItem", "itemId": "cristais", "amount": 1 }` |
| `coinsAtLeast` | `{ "type": "coinsAtLeast", "amount": 20 }` |
| `missionAccepted` | `{ "type": "missionAccepted", "missionId": "missao_id" }` |
| `missionCompleted` | `{ "type": "missionCompleted", "missionId": "missao_id" }` |
| `missionNotAccepted` | Mostra conteúdo antes de a missão ser aceita. |
| `missionNotCompleted` | Mostra conteúdo enquanto a missão estiver em andamento. |
| `all`, `any`, `not` | Combinam outras condições. |

Uma opção bloqueada continua visível e exibe `lockedText`. Para ocultá-la completamente, use `"hideWhenLocked": true`.

## Recompensas de nó

Um nó pode possuir `rewards` com tipos `coins`, `item`, `xp`, `health` ou `mana`. Defina um `rewardId` único para garantir que a recompensa seja recebida apenas uma vez.

```json
{
  "text": "Missão concluída!",
  "rewards": [
    { "type": "coins", "amount": 20 },
    { "type": "item", "itemId": "pocoes", "itemName": "Poção", "amount": 1 },
    { "type": "xp", "amount": 30 }
  ],
  "rewardId": "recompensa_unica_da_missao",
  "next": "intro"
}
```

## Textos dinâmicos

As falas e opções podem usar: `{playerName}`, `{coins}`, `{weaponName}`, `{weaponDamage}`, `{farmSeeds}` e `{farmProduce}`.

## API JavaScript

O controlador expõe `window.ETERNAL_RIFT_BRANCHING_DIALOGUE` para testes ou integrações:

```js
ETERNAL_RIFT_BRANCHING_DIALOGUE.open("blacksmith_branor");
ETERNAL_RIFT_BRANCHING_DIALOGUE.close();
ETERNAL_RIFT_BRANCHING_DIALOGUE.getState();
ETERNAL_RIFT_BRANCHING_DIALOGUE.getItemCount("runa_guardia");
```

Os exemplos prontos no JSON são Branor, Téo, Astrid, Lia, Mina, Bran e Ari.
