"use strict";

/*
 * Quarto Rogue do Eternal Rift.
 * A referência enviada não é carregada nem empacotada. O interior é um mapa
 * jogável composto por tiles e móveis independentes. PixiJS apresenta a cena
 * viva através de PIXI.Texture/PIXI.Sprite e adiciona somente luz de velas.
 * Nenhum PIXI.Graphics é usado como arte final.
 */
(function installPixiRogueBedroom() {
  if (window.ETERNAL_RIFT_DUAL_PLAYER_HOMES) return;
  const PATCH_ID = "pixi-rogue-bedroom-v2-forced-20260717";
  if (window.ETERNAL_RIFT_PIXI_ROGUE_BEDROOM === PATCH_ID) return;
  window.ETERNAL_RIFT_PIXI_ROGUE_BEDROOM = PATCH_ID;

  const ROOM = Object.freeze({ cols: 30, rows: 18, exitX1: 14, exitX2: 16 });
  const preserveKinds = new Set(["visibleBedroomSwordChest", "mergedBedroomSwordChest"]);
  const state = { ready: false, app: null, overlay: null, texture: null, scene: null, layers: null, flames: [], lastW: 0, lastH: 0 };

  function px(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  }

  function outline(x, y, w, h, fill, edge = "#160f14") {
    px(x, y, w, h, edge);
    px(x + 2, y + 2, w - 4, h - 4, fill);
  }

  function tileObject(id, kind, tx, ty, tw, th, solid, action, message, layer = "furniture") {
    return {
      type: "furniture", id, kind, x: tx * TILE, y: ty * TILE,
      width: tw * TILE, height: th * TILE, solid: Boolean(solid),
      message: message || "", heroRoomAction: action || "look",
      exactHeroRoomInteractive: Boolean(action || message), homeHeroRoomInteractive: true,
      rogueBedroomObject: true, pixiRoomLayer: layer
    };
  }

  function wallBlock(id, tx, ty, tw, th) {
    return { type: "block", id, x: tx * TILE, y: ty * TILE, width: tw * TILE, height: th * TILE, solid: true, message: "", rogueBedroomObject: true };
  }

  function rug(id, tx, ty, tw, th, variant = "crest") {
    return tileObject(id, "rogueRug", tx, ty, tw, th, false, "look", "Tapete escuro bordado com o símbolo dos assassinos.", "decorationBack");
  }

  function rebuildRoom() {
    if (!Array.isArray(homeMap) || !Array.isArray(homeObjects)) return;
    for (let y = 0; y < HOME_ROWS; y += 1) {
      for (let x = 0; x < HOME_COLS; x += 1) homeMap[y][x] = "I";
    }

    const preserved = homeObjects.filter((obj) =>
      obj && (preserveKinds.has(obj.type) || obj.bedroomElementalSwordChest || obj.mergedBedroomSwordChest)
    );
    homeObjects.length = 0;
    homeObjects.push(
      wallBlock("rogue-wall-top", 0, 0, 30, 1),
      wallBlock("rogue-wall-left", 0, 0, 1, 18),
      wallBlock("rogue-wall-right", 29, 0, 1, 18),
      wallBlock("rogue-wall-bottom-left", 0, 17, 14, 1),
      wallBlock("rogue-wall-bottom-right", 16, 17, 14, 1),

      rug("rogue-bed-rug", 1, 5, 7, 5),
      rug("rogue-center-rug", 10, 7, 7, 5),
      rug("rogue-training-rug", 20, 11, 8, 5),

      tileObject("rogue-bed", "rogueBed", 2, 2, 4, 4, true, "sleep", "Cama do assassino: pressione E para dormir, recuperar tudo e salvar."),
      tileObject("rogue-nightstand", "rogueNightstand", 6, 3, 1, 2, true, "lamp", "Mesa de cabeceira com vela e diário de contratos."),
      tileObject("rogue-left-shelf", "rogueAlchemyShelf", 1, 10, 3, 3, true, "read", "Prateleira de venenos, antídotos e frascos alquímicos."),
      tileObject("rogue-left-weapons", "rogueWeaponRack", 4, 11, 4, 2, true, "weaponRack", "Suporte com adagas, espadas curtas e lâminas de treino."),
      tileObject("rogue-left-barrels", "rogueStorage", 1, 14, 3, 2, true, "storage", "Barris, caixas e materiais organizados."),

      tileObject("rogue-divider", "rogueScreen", 8, 4, 2, 4, true, "look", "Biombo de madeira e tecido separando a área de descanso."),
      tileObject("rogue-wardrobe", "rogueWardrobe", 10, 1, 3, 4, true, "wardrobe", "Guarda-roupa com mantos, armaduras leves e equipamentos."),
      tileObject("rogue-clothes", "rogueClothesRack", 13, 1, 3, 4, true, "wardrobe", "Suporte de roupas escuras e capas de infiltração."),
      tileObject("rogue-wall-blades", "rogueWallBlades", 16, 1, 3, 3, true, "weaponRack", "Lâminas expostas e mantidas sempre afiadas."),
      tileObject("rogue-books", "rogueBookshelf", 19, 1, 3, 4, true, "read", "Livros sobre reinos, venenos, criaturas e rotas secretas."),
      tileObject("rogue-map-board", "rogueMapBoard", 22, 1, 6, 3, true, "map", "Mapa de contratos, rotas, alvos e pontos de interesse."),
      tileObject("rogue-planning-desk", "roguePlanningDesk", 22, 5, 6, 3, true, "study", "Mesa de planejamento com mapas, pergaminhos e anotações."),

      tileObject("rogue-strategy-table", "rogueStrategyTable", 11, 8, 5, 3, true, "study", "Mesa central de estratégia: pressione E para estudar e ganhar XP."),
      tileObject("rogue-chair-a", "rogueStool", 10, 9, 1, 1, false, "sit", "Banco da mesa de estratégia."),
      tileObject("rogue-chair-b", "rogueStool", 16, 9, 1, 1, false, "sit", "Banco da mesa de estratégia."),
      tileObject("rogue-center-chest", "rogueChest", 13, 5, 3, 2, true, "personalChest", "Baú do esconderijo com suprimentos do herói."),

      tileObject("rogue-training-dummy", "rogueTrainingDummy", 23, 12, 2, 3, true, "look", "Boneco de treinamento marcado por golpes de adaga."),
      tileObject("rogue-training-blades", "rogueFloorBlades", 20, 12, 3, 1, false, "weaponRack", "Lâminas de treino apoiadas no tapete."),
      tileObject("rogue-right-storage", "rogueStorage", 26, 11, 2, 4, true, "storage", "Caixas e barris de suprimentos."),
      tileObject("rogue-right-shelf", "rogueAlchemyShelf", 26, 6, 2, 4, true, "read", "Prateleira com poções e pequenos artefatos."),
      tileObject("rogue-plant-left", "roguePlant", 1, 7, 1, 2, true, "look", "Planta resistente cultivada dentro do esconderijo."),
      tileObject("rogue-plant-right", "roguePlant", 28, 2, 1, 2, true, "look", "Planta ornamental de folhas escuras."),
      tileObject("rogue-banner-left", "rogueBanner", 5, 1, 2, 3, false, "look", "Estandarte do esconderijo.", "decorationBack"),
      tileObject("rogue-banner-right", "rogueBanner", 27, 1, 2, 3, false, "look", "Estandarte da irmandade.", "decorationBack"),
      tileObject("rogue-candle-a", "rogueCandle", 7, 5, 1, 1, false, "lamp", "Vela de luz quente.", "decorationFront"),
      tileObject("rogue-candle-b", "rogueCandle", 19, 6, 1, 1, false, "lamp", "Vela de luz quente.", "decorationFront"),
      tileObject("rogue-candle-c", "rogueCandle", 27, 9, 1, 1, false, "lamp", "Vela de luz quente.", "decorationFront"),
      tileObject("rogue-exit", "rogueExit", 14, 16, 2, 1, false, "exitHint", "Saída do quarto: caminhe pela abertura inferior.", "ground")
    );

    // Mantém recompensas/sistemas de baú já existentes, apenas reposicionando
    // objetos preservados para a área livre, sem duplicá-los.
    preserved.slice(0, 3).forEach((obj, index) => {
      obj.x = (9 + index * 2) * TILE;
      obj.y = 13 * TILE;
      homeObjects.push(obj);
    });

    if (currentScene === "home") {
      objects = homeObjects;
      colliders = homeObjects.filter((obj) => obj.solid);
      interactables = homeObjects.filter((obj) => obj.message);
    }
  }

  function roomState() {
    if (!questBook.pixiRogueBedroom || typeof questBook.pixiRogueBedroom !== "object") {
      questBook.pixiRogueBedroom = { rests: 0, chestOpened: false, lightsOn: true, cooldowns: {} };
    }
    if (!questBook.pixiRogueBedroom.cooldowns) questBook.pixiRogueBedroom.cooldowns = {};
    return questBook.pixiRogueBedroom;
  }

  function cooldownReady(key, delay) {
    const data = roomState();
    const now = Date.now();
    if (now - Number(data.cooldowns[key] || 0) < delay) return false;
    data.cooldowns[key] = now;
    return true;
  }

  function openRoomInventory(tab = "all") {
    try { inventoryTab = tab; toggleInventory?.(true); renderInventory?.(); } catch (error) {}
  }

  const previousQuestMessage = getQuestMessage;
  getQuestMessage = function getPixiRogueRoomMessage(obj) {
    if (!obj?.rogueBedroomObject || currentScene !== "home") return previousQuestMessage(obj);
    const data = roomState();
    const action = obj.heroRoomAction || "look";
    if (action === "sleep") {
      data.rests += 1;
      player.health = player.maxHealth;
      player.mana = player.maxMana;
      if (player.maxOxygen !== undefined) player.oxygen = player.maxOxygen;
      updateHud?.(true); playSound?.("heal"); saveGame?.();
      return `Você descansou no novo quarto rogue. Vida e mana recuperadas, jogo salvo. Descansos: ${data.rests}.`;
    }
    if (action === "wardrobe") {
      openRoomInventory("armas");
      return "Você abriu o guarda-roupa rogue. O inventário de equipamentos foi aberto.";
    }
    if (action === "weaponRack") {
      openRoomInventory("armas");
      return "Você conferiu as adagas e lâminas expostas. O inventário de armas foi aberto.";
    }
    if (action === "study") {
      if (cooldownReady("study", 45000)) {
        awardXp?.(45, "Planejamento no quarto rogue");
        return "Você estudou contratos, rotas e monstros. Ganhou 45 XP.";
      }
      return "Os planos já foram revisados há pouco. Espere um pouco para estudar novamente.";
    }
    if (action === "read") {
      if (cooldownReady("read", 45000)) awardXp?.(30, "Leitura no quarto rogue");
      return "Livros e frascos registram venenos, criaturas, ruínas e rotas secretas.";
    }
    if (action === "sit") {
      player.mana = Math.min(player.maxMana || player.mana, Number(player.mana || 0) + 1);
      updateHud?.(true);
      return "Você descansou junto à mesa de estratégia. Mana +1.";
    }
    if (action === "lamp") {
      data.lightsOn = !data.lightsOn;
      playSound?.("selectItem");
      return data.lightsOn ? "As velas iluminaram o esconderijo com luz quente." : "A luz foi reduzida e o quarto ficou mais misterioso.";
    }
    if (action === "personalChest") {
      if (!data.chestOpened) {
        data.chestOpened = true;
        inventory.moedas = Number(inventory.moedas || 0) + 25;
        inventory.pocoes = Number(inventory.pocoes || 0) + 1;
        updateHud?.(true); renderInventory?.(); playSound?.("chest");
      }
      openRoomInventory("all");
      return data.chestOpened ? "Baú do esconderijo aberto. Seus itens estão organizados no inventário." : "Baú aberto.";
    }
    if (action === "map") {
      showInfo?.("Mapa de Contratos", "Rotas da vila, biomas, ruínas, fendas e possíveis alvos estão marcados no mapa.");
      return "Você analisou o mapa de contratos do esconderijo.";
    }
    if (action === "exitHint") return "Saída do novo quarto: caminhe pela abertura inferior.";
    return obj.message || "Você observou um detalhe do novo quarto rogue.";
  };

  function drawFloorTile(tx, ty) {
    const x = tx * TILE, y = ty * TILE;
    const alt = (tx * 7 + ty * 13) % 4;
    const base = ["#2c2020", "#302322", "#281d1e", "#342523"][alt];
    px(x, y, TILE, TILE, base);
    px(x, y + 15, TILE, 2, "#160f14");
    px(x, y + 17, TILE, 1, "rgba(115,73,57,.34)");
    px(x + ((ty % 2) ? 5 : 19), y + 4, 1, 8, "rgba(108,70,55,.30)");
    px(x + 3, y + 3, 20, 1, "rgba(201,135,88,.08)");
    px(x + 2, y + 14, 2, 2, "#0f0b10");
    px(x + 27, y + 29, 2, 2, "#0f0b10");
  }

  function drawRoomBackdrop(scene) {
    if (scene !== "home") return false;
    px(camera.x, camera.y, canvas.width, canvas.height, "#08070b");
    for (let y = 1; y < ROOM.rows - 1; y += 1) for (let x = 1; x < ROOM.cols - 1; x += 1) drawFloorTile(x, y);

    // Parede medieval: pedra baixa, madeira alta e vigas estruturais.
    for (let x = 0; x < ROOM.cols; x += 1) {
      const pxX = x * TILE;
      px(pxX, 0, TILE, TILE, x % 2 ? "#21191b" : "#261c1e");
      px(pxX, 4, TILE, 3, "#4b342d");
      px(pxX, 22, TILE, 4, "#100c11");
      px(pxX + 4, 10, 23, 2, "rgba(126,82,62,.27)");
      px(pxX, 17 * TILE, TILE, TILE, x % 2 ? "#18151a" : "#201a1d");
      px(pxX, 17 * TILE, TILE, 5, "#4b342d");
    }
    for (let y = 0; y < ROOM.rows; y += 1) {
      px(0, y * TILE, TILE, TILE, y % 2 ? "#21191c" : "#2a1e20");
      px(29 * TILE, y * TILE, TILE, TILE, y % 2 ? "#21191c" : "#2a1e20");
      px(25, y * TILE, 7, TILE, "#100c11");
      px(29 * TILE, y * TILE, 7, TILE, "#100c11");
    }
    for (let x = 1; x < 29; x += 4) {
      px(x * TILE - 3, 0, 7, 64, "#120e12");
      px(x * TILE - 1, 0, 3, 64, "#4b322a");
    }
    px(14 * TILE, 17 * TILE, 2 * TILE, TILE, "#21191c");
    px(14 * TILE, 17 * TILE, 2 * TILE, 5, "#77513b");
    return true;
  }

  function drawRogueRug(obj) {
    const { x, y, width: w, height: h } = obj;
    outline(x + 3, y + 4, w - 6, h - 8, "#241927", "#0e0a10");
    px(x + 7, y + 8, w - 14, h - 16, "#321b2b");
    px(x + 10, y + 11, w - 20, 3, "#6f233c");
    px(x + 10, y + h - 14, w - 20, 3, "#6f233c");
    px(x + 10, y + 11, 3, h - 22, "#6f233c");
    px(x + w - 13, y + 11, 3, h - 22, "#6f233c");
    const cx = x + w / 2, cy = y + h / 2;
    px(cx - 2, cy - 19, 4, 38, "#7c2945");
    px(cx - 16, cy - 5, 32, 4, "#7c2945");
    px(cx - 10, cy - 13, 4, 4, "#a44561");
    px(cx + 6, cy + 9, 4, 4, "#a44561");
  }

  function furnitureFrame(obj, base = "#51352c") {
    px(obj.x + 4, obj.y + obj.height - 5, obj.width - 8, 6, "rgba(0,0,0,.36)");
    outline(obj.x + 2, obj.y + 2, obj.width - 4, obj.height - 6, base, "#110c11");
  }

  function drawRogueFurniture(obj) {
    const { x, y, width: w, height: h, kind } = obj;
    if (kind === "rogueRug") return drawRogueRug(obj);
    if (kind === "rogueBed") {
      furnitureFrame(obj, "#39242a");
      px(x + 9, y + 9, w - 18, 18, "#d4b8aa");
      px(x + 9, y + 28, w - 18, h - 39, "#17141c");
      px(x + 14, y + 34, w - 28, h - 50, "#25172b");
      px(x + 14, y + h - 18, w - 28, 4, "#72273f");
      px(x + 15, y + 12, 30, 11, "#ead8c7");
      return;
    }
    if (kind === "rogueBanner") {
      px(x + 8, y + 3, w - 16, h - 13, "#301329");
      px(x + 12, y + 6, w - 24, h - 21, "#4b1737");
      px(x + w / 2 - 2, y + 18, 4, 36, "#9a3350");
      px(x + w / 2 - 13, y + 33, 26, 4, "#9a3350");
      px(x + 8, y + h - 14, 9, 9, "#301329"); px(x + w - 17, y + h - 14, 9, 9, "#301329");
      return;
    }
    if (kind === "rogueScreen") {
      px(x + 3, y + 4, w - 6, h - 8, "#302a28");
      for (let panel = 0; panel < 2; panel += 1) {
        outline(x + panel * 32 + 4, y + 5, 28, h - 12, "#756052", "#251b1c");
        px(x + panel * 32 + 8, y + 10, 20, h - 24, "#9c8a73");
        px(x + panel * 32 + 12, y + 15, 2, h - 34, "rgba(57,32,33,.35)");
      }
      return;
    }
    if (kind === "rogueCandle" || kind === "rogueNightstand") {
      if (kind === "rogueNightstand") furnitureFrame(obj, "#5a392c");
      const t = performance.now() / 130;
      const cx = x + w / 2;
      px(cx - 3, y + h - 18, 6, 15, "#dfc58b");
      px(cx - 5, y + h - 25 + Math.sin(t) * 2, 10, 9, "rgba(255,153,58,.45)");
      px(cx - 2, y + h - 23 + Math.sin(t) * 2, 4, 7, "#ffd46a");
      return;
    }
    if (kind === "rogueTrainingDummy") {
      px(x + w / 2 - 5, y + 10, 10, h - 18, "#7b5036");
      outline(x + w / 2 - 14, y + 18, 28, 31, "#79533b", "#25171a");
      px(x + w / 2 - 25, y + 31, 50, 6, "#5c392c");
      px(x + w / 2 - 10, y + 24, 20, 3, "#b86b45");
      px(x + w / 2 - 11, y + 41, 22, 3, "#331920");
      return;
    }
    if (kind === "rogueFloorBlades") {
      for (let i = 0; i < 2; i += 1) {
        const bx = x + 14 + i * 34;
        px(bx, y + 13 + i * 4, 34, 4, "#b9c4cc");
        px(bx + 4, y + 14 + i * 4, 27, 1, "#eef6f7");
        px(bx - 5, y + 11 + i * 4, 8, 8, "#8d663c");
      }
      return;
    }

    furnitureFrame(obj, ["rogueMapBoard", "roguePlanningDesk"].includes(kind) ? "#4a3028" : "#51352c");
    if (["rogueWardrobe", "rogueClothesRack"].includes(kind)) {
      px(x + 7, y + 8, w - 14, 8, "#6e4937");
      px(x + w / 2 - 2, y + 16, 4, h - 25, "#20161a");
      for (let i = 0; i < 3; i += 1) {
        px(x + 10 + i * 23, y + 22, 17, h - 34, i % 2 ? "#241b2c" : "#35203b");
        px(x + 13 + i * 23, y + 19, 11, 4, "#95734e");
      }
    } else if (["rogueWeaponRack", "rogueWallBlades"].includes(kind)) {
      px(x + 8, y + 9, w - 16, 6, "#76503a");
      px(x + 8, y + h - 17, w - 16, 6, "#76503a");
      const count = Math.max(2, Math.floor(w / 26));
      for (let i = 0; i < count; i += 1) {
        const bx = x + 14 + i * ((w - 28) / Math.max(1, count - 1));
        px(bx, y + 15, 4, h - 35, "#aebac1");
        px(bx + 1, y + 16, 1, h - 38, "#eef4f1");
        px(bx - 4, y + h - 23, 12, 4, "#a16e42");
      }
    } else if (kind === "rogueBookshelf" || kind === "rogueAlchemyShelf") {
      for (let row = 0; row < 3; row += 1) {
        const sy = y + 10 + row * Math.max(15, (h - 22) / 3);
        px(x + 7, sy + 11, w - 14, 4, "#24171a");
        for (let i = 0; i < Math.floor((w - 18) / 8); i += 1) {
          const colors = kind === "rogueAlchemyShelf" ? ["#6f2b56", "#3f7558", "#927640", "#445f87"] : ["#71384a", "#344f71", "#806044", "#544075"];
          px(x + 10 + i * 8, sy, 5, 10, colors[(i + row) % colors.length]);
          if (kind === "rogueAlchemyShelf") px(x + 11 + i * 8, sy + 2, 3, 2, "rgba(235,244,183,.55)");
        }
      }
    } else if (kind === "rogueMapBoard") {
      px(x + 9, y + 9, w - 18, h - 18, "#8a7256");
      px(x + 16, y + 15, w - 32, h - 30, "#b59a70");
      for (let i = 0; i < 8; i += 1) px(x + 19 + (i * 37) % (w - 42), y + 18 + (i * 19) % Math.max(8, h - 38), 5, 5, i % 2 ? "#7b2940" : "#263e51");
    } else if (["roguePlanningDesk", "rogueStrategyTable"].includes(kind)) {
      px(x + 8, y + 8, w - 16, h - 20, "#76503a");
      px(x + 14, y + 13, w * .46, h - 32, "#b39769");
      px(x + 18, y + 18, w * .32, 3, "#755642");
      px(x + w * .63, y + 14, 12, 10, "#3e5360");
      px(x + w * .76, y + 18, 9, 9, "#7d3248");
      px(x + 12, y + h - 12, 8, 11, "#39231e"); px(x + w - 20, y + h - 12, 8, 11, "#39231e");
    } else if (kind === "rogueChest") {
      px(x + 7, y + 13, w - 14, h - 22, "#583047");
      px(x + 7, y + 8, w - 14, 13, "#713d5c");
      px(x + w / 2 - 6, y + 18, 12, 10, "#c3924f");
      px(x + 12, y + 14, w - 24, 3, "#a25a78");
    } else if (kind === "rogueStorage") {
      for (let yy = y + 8; yy < y + h - 12; yy += 25) for (let xx = x + 8; xx < x + w - 12; xx += 28) {
        outline(xx, yy, 24, 21, "#65412e", "#24171a"); px(xx + 5, yy + 9, 14, 3, "#91603d");
      }
    } else if (kind === "roguePlant") {
      px(x + w / 2 - 9, y + h - 23, 18, 19, "#684332");
      for (let i = 0; i < 5; i += 1) px(x + w / 2 - 2 + (i - 2) * 4, y + 9 + Math.abs(i - 2) * 5, 5, h - 34, i % 2 ? "#365339" : "#496b43");
    } else if (kind === "rogueStool") {
      px(x + 5, y + 9, w - 10, 11, "#704735"); px(x + 8, y + 20, 4, h - 22, "#34221d"); px(x + w - 12, y + 20, 4, h - 22, "#34221d");
    } else if (kind === "rogueExit") {
      px(x + 4, y + 5, w - 8, h - 10, "#261820"); px(x + 9, y + 8, w - 18, 3, "#7c2945");
    }
  }

  const previousBackdrop = drawInteriorRoomBackdropV2;
  drawInteriorRoomBackdropV2 = function drawRogueBedroomBackdrop(scene) {
    if (drawRoomBackdrop(scene)) return;
    return previousBackdrop(scene);
  };

  const previousFurniture = drawFurniture;
  drawFurniture = function drawRogueBedroomFurniture(obj) {
    if (currentScene === "home" && obj?.rogueBedroomObject) return drawRogueFurniture(obj);
    return previousFurniture(obj);
  };

  const previousSetScene = setActiveScene;
  setActiveScene = function setSceneWithRogueBedroom(scene) {
    const result = previousSetScene(scene);
    if (currentScene === "home") rebuildRoom();
    return result;
  };

  const previousEnterHome = enterHome;
  enterHome = function enterRogueBedroom() {
    const result = previousEnterHome();
    rebuildRoom();
    player.x = 15 * TILE - player.width / 2;
    player.y = 15 * TILE;
    player.direction = "up";
    camera.x = 0;
    camera.y = 0;
    return result;
  };

  const previousTransitions = handleMapTransitions;
  handleMapTransitions = function rogueBedroomTransitions() {
    if (currentScene === "home") {
      const cx = player.x + player.width / 2;
      const cy = player.y + player.height / 2;
      if (cx >= 14 * TILE && cx <= 16 * TILE && cy >= 17 * TILE - 8) exitHome();
      return;
    }
    return previousTransitions();
  };

  function makeEffectTexture(color) {
    const c = document.createElement("canvas"); c.width = 9; c.height = 13;
    const g = c.getContext("2d"); g.imageSmoothingEnabled = false;
    g.fillStyle = color; g.fillRect(3, 1, 3, 9); g.fillRect(1, 5, 7, 5);
    g.fillStyle = "rgba(255,238,159,.72)"; g.fillRect(4, 3, 1, 5);
    const texture = PIXI.Texture.from(c); texture.source.scaleMode = "nearest"; return texture;
  }

  function createPixiLayers(stage) {
    const names = ["groundLayer", "wallLayer", "decorationBackLayer", "furnitureLayer", "entityLayer", "decorationFrontLayer", "effectLayer", "lightingLayer"];
    const result = {};
    names.forEach((name) => { const layer = new PIXI.Container(); layer.label = name; result[name] = layer; stage.addChild(layer); });
    return result;
  }

  async function initPixiRoom() {
    try {
      if (!window.PIXI || !canvas) return;
      const overlay = document.createElement("canvas");
      overlay.id = "pixiHeroBedroomCanvas"; overlay.className = "er-pixi-bedroom-canvas"; overlay.setAttribute("aria-hidden", "true");
      canvas.insertAdjacentElement("afterend", overlay);
      const app = new PIXI.Application();
      await app.init({ canvas: overlay, width: canvas.width, height: canvas.height, backgroundAlpha: 0, antialias: false, resolution: 1, autoDensity: false, preference: "webgl" });
      app.ticker.stop();
      state.app = app; state.overlay = overlay; state.layers = createPixiLayers(app.stage);
      state.texture = PIXI.Texture.from(canvas); state.texture.source.scaleMode = "nearest";
      state.scene = new PIXI.Sprite(state.texture); state.scene.label = "liveRogueBedroomTileMap"; state.scene.eventMode = "none";
      state.layers.furnitureLayer.addChild(state.scene);
      const glow = makeEffectTexture("rgba(255,126,42,.34)");
      const flamePoints = [[7.5,5.2],[19.5,6.2],[27.5,9.2],[6.5,3.2]];
      flamePoints.forEach((point, index) => {
        const sprite = new PIXI.Sprite(glow); sprite.anchor.set(.5); sprite._roomPoint = point; sprite._seed = index * 1.7; sprite.eventMode = "none";
        state.layers.effectLayer.addChild(sprite); state.flames.push(sprite);
      });
      state.ready = true;

      const previousDraw = draw;
      draw = function drawWithPixiRogueBedroom() {
        const result = previousDraw.apply(this, arguments);
        presentRoom();
        return result;
      };
      window.ETERNAL_RIFT_PIXI_HERO_ROOM_RENDERER = { id: PATCH_ID, version: PIXI.VERSION, layers: state.layers, state, usesGraphicsForRoomArt: false, usesStaticRoomBackground: false };
    } catch (error) {
      if (state.overlay) state.overlay.remove();
      console.warn("[Eternal Rift] fallback seguro do quarto PixiJS:", error);
    }
  }

  function presentRoom() {
    if (!state.ready) return;
    const active = currentScene === "home";
    state.overlay.classList.toggle("is-active", active);
    if (!active) return;
    if (state.lastW !== canvas.width || state.lastH !== canvas.height) {
      state.lastW = canvas.width; state.lastH = canvas.height;
      state.app.renderer.resize(canvas.width, canvas.height); state.scene.width = canvas.width; state.scene.height = canvas.height;
    }
    state.texture.source.update();
    const now = performance.now() / 1000;
    state.flames.forEach((sprite) => {
      sprite.x = sprite._roomPoint[0] * TILE - camera.x;
      sprite.y = sprite._roomPoint[1] * TILE - camera.y + Math.sin(now * 5 + sprite._seed) * 2;
      sprite.alpha = .24 + (Math.sin(now * 7 + sprite._seed) + 1) * .08;
      sprite.scale.set(1 + Math.sin(now * 4 + sprite._seed) * .08);
    });
    state.app.renderer.render(state.app.stage);
  }

  rebuildRoom();
  initPixiRoom();
})();
