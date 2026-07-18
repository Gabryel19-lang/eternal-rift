/* ================================================================
   Eternal Rift - Colecao de Adagas
   Seis armas completas com imagens, inventario, combate e efeitos.
   PC + mobile. Nao remove nem substitui armas existentes.
   ================================================================ */
(function eternalRiftDaggerWeaponsCollection() {
  "use strict";

  const PATCH_ID = "dagger-collection-six-pc-mobile-20260716";
  if (window.ETERNAL_RIFT_DAGGER_COLLECTION === PATCH_ID) return;
  window.ETERNAL_RIFT_DAGGER_COLLECTION = PATCH_ID;

  const DAGGERS = {
    riftAmethystDagger: {
      key: "riftAmethystDagger",
      name: "Adaga da Fenda Ametista",
      image: "assets/weapons/daggers/rift-amethyst-dagger.png",
      rarity: "epico",
      damage: 6,
      range: 48,
      cooldown: 0.22,
      arc: Math.PI * 0.78,
      damageType: "dimensional",
      accent: "#bd6cff",
      glow: "#6e45ff",
      description: "Lâmina ornamentada que concentra energia das Fendas em cortes rápidos.",
      effect: "A cada 3 acertos, libera uma ruptura dimensional que causa +2 de dano.",
      sourceAngle: 2.28,
      pivotX: 0.72,
      pivotY: 0.29,
      drawSize: 54
    },
    serpentVenomDagger: {
      key: "serpentVenomDagger",
      name: "Adaga da Serpente Venenosa",
      image: "assets/weapons/daggers/serpent-venom-dagger.png",
      rarity: "epico",
      damage: 5,
      range: 46,
      cooldown: 0.20,
      arc: Math.PI * 0.76,
      damageType: "veneno",
      accent: "#9dff40",
      glow: "#4dbd22",
      description: "Adaga moldada como uma serpente e coberta por veneno alquímico.",
      effect: "Envenena o inimigo, causando dano contínuo e reduzindo sua velocidade.",
      sourceAngle: 2.23,
      pivotX: 0.68,
      pivotY: 0.31,
      drawSize: 53
    },
    frostShardDagger: {
      key: "frostShardDagger",
      name: "Adaga do Fragmento Glacial",
      image: "assets/weapons/daggers/frost-shard-dagger.png",
      rarity: "epico",
      damage: 6,
      range: 49,
      cooldown: 0.24,
      arc: Math.PI * 0.76,
      damageType: "gelo",
      accent: "#bff5ff",
      glow: "#45bfff",
      description: "Uma lâmina de gelo eterno que nunca perde o fio.",
      effect: "Resfria todos os alvos e possui 28% de chance de congelar por um curto período.",
      sourceAngle: -0.98,
      pivotX: 0.35,
      pivotY: 0.76,
      drawSize: 52
    },
    celestialLightDagger: {
      key: "celestialLightDagger",
      name: "Adaga da Luz Celestial",
      image: "assets/weapons/daggers/celestial-light-dagger.png",
      rarity: "lendario",
      damage: 7,
      range: 50,
      cooldown: 0.25,
      arc: Math.PI * 0.80,
      damageType: "sagrado",
      accent: "#fff1a6",
      glow: "#72ddff",
      description: "Relíquia dourada cuja lâmina branca foi abençoada pela aurora.",
      effect: "Marca inimigos com luz e recupera 1 de vida a cada 4 acertos.",
      sourceAngle: 1.57,
      pivotX: 0.50,
      pivotY: 0.22,
      drawSize: 55
    },
    verdantLeafDagger: {
      key: "verdantLeafDagger",
      name: "Adaga da Folha Ancestral",
      image: "assets/weapons/daggers/verdant-leaf-dagger.png",
      rarity: "raro",
      damage: 5,
      range: 47,
      cooldown: 0.19,
      arc: Math.PI * 0.78,
      damageType: "natureza",
      accent: "#b9f15b",
      glow: "#4cb52e",
      description: "Arma viva criada com uma folha resistente e vinhas encantadas.",
      effect: "Pode prender inimigos com raízes e restaura 1 de vida a cada 5 acertos.",
      sourceAngle: -0.92,
      pivotX: 0.27,
      pivotY: 0.82,
      drawSize: 53
    },
    ironDagger: {
      key: "ironDagger",
      name: "Adaga de Ferro",
      image: "assets/weapons/daggers/iron-dagger.png",
      rarity: "comum",
      damage: 3,
      range: 43,
      cooldown: 0.16,
      arc: Math.PI * 0.72,
      damageType: "fisico",
      accent: "#e7ecf2",
      glow: "#a9b1bd",
      description: "Adaga simples, equilibrada e extremamente rápida.",
      effect: "Possui 15% de chance de causar um acerto crítico de +1 de dano.",
      sourceAngle: -1.57,
      pivotX: 0.50,
      pivotY: 0.82,
      drawSize: 48
    }
  };

  const DAGGER_KEYS = Object.keys(DAGGERS);
  const textureCache = new Map();
  let textureRefreshQueued = false;

  function safeCall(callback, fallback) {
    try { return callback(); }
    catch (error) { return fallback; }
  }

  function normalizeName(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  const DAGGER_BY_NAME = Object.fromEntries(
    Object.values(DAGGERS).map((dagger) => [normalizeName(dagger.name), dagger])
  );

  function daggerDefinition(keyOrName) {
    return DAGGERS[String(keyOrName || "")] || DAGGER_BY_NAME[normalizeName(keyOrName)] || null;
  }

  function daggerFromItem(item) {
    return daggerDefinition(item?.weaponKey) || daggerDefinition(item?.name) || null;
  }

  function ensureDaggerState() {
    if (!questBook.daggerCollection || typeof questBook.daggerCollection !== "object" || Array.isArray(questBook.daggerCollection)) {
      questBook.daggerCollection = {};
    }
    const state = questBook.daggerCollection;
    state.version = 1;
    if (!state.unlocked || typeof state.unlocked !== "object" || Array.isArray(state.unlocked)) state.unlocked = {};
    if (!state.hitCounts || typeof state.hitCounts !== "object" || Array.isArray(state.hitCounts)) state.hitCounts = {};
    if (!Array.isArray(state.order)) state.order = [];
    return state;
  }

  function registerDaggerWeapons() {
    const state = ensureDaggerState();
    if (!Array.isArray(player.unlockedWeapons)) player.unlockedWeapons = ["sword"];

    for (const dagger of Object.values(DAGGERS)) {
      const current = weapons[dagger.key] || {};
      weapons[dagger.key] = {
        ...current,
        name: dagger.name,
        damage: dagger.damage,
        range: dagger.range,
        cooldown: dagger.cooldown,
        arc: dagger.arc,
        kind: "melee",
        family: "dagger",
        damageType: dagger.damageType,
        daggerWeapon: true,
        customWeapon: true,
        image: dagger.image,
        rarity: dagger.rarity
      };
      if (Array.isArray(weaponOrder) && !weaponOrder.includes(dagger.key)) weaponOrder.push(dagger.key);
      if (!player.unlockedWeapons.includes(dagger.key)) player.unlockedWeapons.push(dagger.key);
      state.unlocked[dagger.key] = true;
      if (!state.order.includes(dagger.key)) state.order.push(dagger.key);
    }
  }

  function isBackgroundCandidate(data, pixelIndex) {
    const offset = pixelIndex * 4;
    const r = data[offset];
    const g = data[offset + 1];
    const b = data[offset + 2];
    const a = data[offset + 3];
    if (a <= 8) return true;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const saturation = max - min;
    const light = (r + g + b) / 3;
    return saturation <= Math.max(9, max * 0.045) && light >= 23 && light <= 185;
  }

  function removeConnectedBackground(canvas, context) {
    const width = canvas.width;
    const height = canvas.height;
    const imageData = context.getImageData(0, 0, width, height);
    const data = imageData.data;
    const visited = new Uint8Array(width * height);
    const queue = new Int32Array(width * height);
    let head = 0;
    let tail = 0;

    const enqueue = (index) => {
      if (index < 0 || index >= visited.length || visited[index] || !isBackgroundCandidate(data, index)) return;
      visited[index] = 1;
      queue[tail++] = index;
    };

    for (let x = 0; x < width; x += 1) {
      enqueue(x);
      enqueue((height - 1) * width + x);
    }
    for (let y = 0; y < height; y += 1) {
      enqueue(y * width);
      enqueue(y * width + width - 1);
    }

    while (head < tail) {
      const index = queue[head++];
      const x = index % width;
      const y = Math.floor(index / width);
      if (x > 0) enqueue(index - 1);
      if (x + 1 < width) enqueue(index + 1);
      if (y > 0) enqueue(index - width);
      if (y + 1 < height) enqueue(index + width);
    }

    for (let index = 0; index < visited.length; index += 1) {
      if (visited[index]) data[index * 4 + 3] = 0;
    }
    context.putImageData(imageData, 0, 0);
  }

  function queueTextureUiRefresh() {
    if (textureRefreshQueued) return;
    textureRefreshQueued = true;
    window.setTimeout(() => {
      textureRefreshQueued = false;
      safeCall(() => renderInventory?.());
      safeCall(() => updateHud?.(true));
    }, 40);
  }

  function loadDaggerTexture(dagger) {
    if (!dagger) return null;
    if (textureCache.has(dagger.key)) return textureCache.get(dagger.key);
    const texture = { ready: false, failed: false, canvas: null, dataUrl: "", image: null };
    textureCache.set(dagger.key, texture);

    const image = new Image();
    texture.image = image;
    image.decoding = "async";
    image.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 192;
        canvas.height = 192;
        const context = canvas.getContext("2d", { willReadFrequently: true });
        context.imageSmoothingEnabled = false;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        removeConnectedBackground(canvas, context);
        texture.canvas = canvas;
        texture.dataUrl = safeCall(() => canvas.toDataURL("image/png"), "");
        texture.ready = true;
        texture.image = null;
        queueTextureUiRefresh();
      } catch (error) {
        texture.failed = true;
        texture.image = null;
      }
    };
    image.onerror = () => {
      texture.failed = true;
      texture.image = null;
    };
    image.src = `${dagger.image}?v=${PATCH_ID}`;
    return texture;
  }

  function preloadDaggerTextures() {
    for (const dagger of Object.values(DAGGERS)) loadDaggerTexture(dagger);
  }

  const getCustomItemDefBeforeDaggers = typeof window.getCustomItemDef === "function" ? window.getCustomItemDef : null;
  window.getCustomItemDef = function getCustomItemDefWithDaggers(name) {
    const dagger = daggerDefinition(name);
    if (dagger) {
      return {
        name: dagger.name,
        icon: "🗡",
        typeLabel: "Adaga",
        category: "armas",
        rarity: dagger.rarity,
        actionLabel: "Equipar adaga",
        actionType: "weapon",
        weaponKey: dagger.key,
        description: dagger.description,
        effect: `Dano ${dagger.damage} | Alcance ${dagger.range} | Velocidade ${dagger.cooldown.toFixed(2)}s. ${dagger.effect}`
      };
    }
    return getCustomItemDefBeforeDaggers ? getCustomItemDefBeforeDaggers(name) : null;
  };

  const getWeaponDescriptionBeforeDaggers = typeof getWeaponDescription === "function" ? getWeaponDescription : null;
  getWeaponDescription = function getWeaponDescriptionDaggers(weaponKey) {
    const dagger = daggerDefinition(weaponKey);
    if (dagger) return `${dagger.description} ${dagger.effect}`;
    return getWeaponDescriptionBeforeDaggers ? getWeaponDescriptionBeforeDaggers.apply(this, arguments) : "Arma do Eternal Rift.";
  };

  const getInventoryItemsBeforeDaggers = typeof getInventoryItems === "function" ? getInventoryItems : null;
  getInventoryItems = function getInventoryItemsDaggers() {
    registerDaggerWeapons();
    const items = getInventoryItemsBeforeDaggers ? (getInventoryItemsBeforeDaggers.apply(this, arguments) || []) : [];
    for (const item of items) {
      const dagger = daggerFromItem(item);
      if (!dagger) continue;
      item.name = dagger.name;
      item.image = dagger.image;
      item.icon = "🗡";
      item.category = "armas";
      item.typeLabel = "Adaga";
      item.rarity = dagger.rarity;
      item.description = dagger.description;
      item.effect = `Dano ${weapons[dagger.key].damage} | Alcance ${dagger.range} | Ataque a cada ${dagger.cooldown.toFixed(2)}s. ${dagger.effect}`;
      item.action = "equipWeapon";
      item.weaponKey = dagger.key;
      item.locked = false;
    }
    return items;
  };

  function daggerInventoryIcon(dagger) {
    const texture = loadDaggerTexture(dagger);
    const source = texture?.ready && texture.dataUrl ? texture.dataUrl : dagger.image;
    return `
      <span class="er-inv-icon er-item-icon-shell er-item-image-icon er-dagger-inventory-icon rarity-${dagger.rarity}">
        <img src="${source}" alt="" loading="eager">
      </span>
    `;
  }

  const getInventoryItemIconBeforeDaggers = typeof window.getInventoryItemIcon === "function" ? window.getInventoryItemIcon : null;
  window.getInventoryItemIcon = function getInventoryItemIconDaggers(item) {
    const dagger = daggerFromItem(item);
    if (dagger) return daggerInventoryIcon(dagger);
    return getInventoryItemIconBeforeDaggers ? getInventoryItemIconBeforeDaggers(item) : "";
  };

  if (typeof getInventoryIconHtml === "function") {
    const getInventoryIconHtmlBeforeDaggers = getInventoryIconHtml;
    getInventoryIconHtml = function getInventoryIconHtmlDaggers(item) {
      const dagger = daggerFromItem(item);
      if (dagger) return daggerInventoryIcon(dagger);
      return getInventoryIconHtmlBeforeDaggers.apply(this, arguments);
    };
  }

  function fallbackDaggerInHand(dagger) {
    ctx.save();
    ctx.shadowColor = dagger.glow;
    ctx.shadowBlur = 7;
    ctx.fillStyle = dagger.accent;
    ctx.beginPath();
    ctx.moveTo(4, -3);
    ctx.lineTo(36, 0);
    ctx.lineTo(4, 4);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#3a261d";
    ctx.fillRect(-8, -3, 14, 6);
    ctx.fillStyle = "#e7be63";
    ctx.fillRect(2, -7, 4, 14);
    ctx.restore();
  }

  function drawDaggerInHand(dagger) {
    const texture = loadDaggerTexture(dagger);
    if (!texture?.ready || !texture.canvas) {
      fallbackDaggerInHand(dagger);
      return;
    }
    const size = dagger.drawSize;
    ctx.save();
    ctx.rotate(-dagger.sourceAngle);
    ctx.shadowColor = dagger.glow;
    ctx.shadowBlur = dagger.rarity === "lendario" ? 9 : 6;
    const smoothing = ctx.imageSmoothingEnabled;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(
      texture.canvas,
      -dagger.pivotX * size,
      -dagger.pivotY * size,
      size,
      size
    );
    ctx.imageSmoothingEnabled = smoothing;
    ctx.restore();
  }

  const drawEquippedWeaponBeforeDaggers = typeof drawEquippedWeapon === "function" ? drawEquippedWeapon : null;
  drawEquippedWeapon = function drawEquippedWeaponDaggers() {
    const weaponKey = safeCall(() => safeCurrentWeaponKeyForVisual(), safeCall(() => getCurrentWeaponKey(), "sword"));
    const dagger = daggerDefinition(weaponKey);
    if (!dagger) return drawEquippedWeaponBeforeDaggers ? drawEquippedWeaponBeforeDaggers.apply(this, arguments) : undefined;
    if (!player || gameOver) return;

    try {
      const aim = safeCall(() => safeAimForWeaponVisual(), safeCall(() => getAimVector(), { angle: 0, x: 1, y: 0 }));
      const angle = safeCall(() => getWeaponVisualAngle(aim, weaponKey), Number(aim?.angle || 0));
      const centerX = player.x + player.width / 2;
      const centerY = player.y + player.height / 2;
      const handX = centerX + Math.cos(angle) * 7;
      const handY = centerY + Math.sin(angle) * 6 + 3;
      ctx.save();
      ctx.translate(handX, handY);
      ctx.rotate(angle);
      if (Math.cos(angle) < -0.05) ctx.scale(1, -1);
      drawDaggerInHand(dagger);
      ctx.restore();
    } catch (error) {
      safeCall(() => drawWeaponPatchError?.(`Erro adaga: ${error?.message || error}`));
    }
  };

  function drawDaggerAttackTrail(attack, dagger) {
    if (!attack || !dagger) return;
    const centerX = player.x + player.width / 2;
    const centerY = player.y + player.height / 2;
    const maxTimer = Math.max(0.001, Number(attack.maxTimer || attackTimer || dagger.cooldown));
    const progress = 1 - Math.max(0, Math.min(1, Number(attack.timer || 0) / maxTimer));
    const alpha = Math.sin(Math.min(1, progress) * Math.PI) * 0.82;
    const radius = Math.max(32, Number(attack.range || dagger.range));
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(Number(attack.angle || 0));
    ctx.globalAlpha = alpha;
    ctx.lineCap = "round";
    ctx.shadowColor = dagger.glow;
    ctx.shadowBlur = dagger.rarity === "lendario" ? 13 : 9;
    ctx.strokeStyle = dagger.accent;
    ctx.lineWidth = dagger.key === "ironDagger" ? 3 : 5;
    ctx.beginPath();
    ctx.arc(0, 0, radius, -0.52 + progress * 0.28, 0.52 + progress * 0.28);
    ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,.78)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, radius - 4, -0.46 + progress * 0.28, 0.46 + progress * 0.28);
    ctx.stroke();
    ctx.restore();
  }

  const drawAttackBeforeDaggers = typeof drawAttack === "function" ? drawAttack : null;
  drawAttack = function drawAttackDaggers() {
    const result = drawAttackBeforeDaggers ? drawAttackBeforeDaggers.apply(this, arguments) : undefined;
    const dagger = daggerDefinition(currentMeleeAttack?.weaponKey);
    if (dagger) drawDaggerAttackTrail(currentMeleeAttack, dagger);
    return result;
  };

  function activeDaggerAttack() {
    return daggerDefinition(currentMeleeAttack?.weaponKey);
  }

  function registerDaggerHit(dagger) {
    const state = ensureDaggerState();
    state.hitCounts[dagger.key] = Math.max(0, Number(state.hitCounts[dagger.key] || 0)) + 1;
    return state.hitCounts[dagger.key];
  }

  const damageEnemyBeforeDaggers = typeof damageEnemy === "function" ? damageEnemy : null;
  damageEnemy = function damageEnemyDaggers(obj, amount, sourceX, sourceY, knockbackPower = 170, damageType = "fisico") {
    const dagger = activeDaggerAttack();
    const finalDamageType = dagger ? dagger.damageType : damageType;
    const hit = damageEnemyBeforeDaggers
      ? damageEnemyBeforeDaggers.call(this, obj, amount, sourceX, sourceY, knockbackPower, finalDamageType)
      : false;
    if (!hit || !dagger || !obj) return hit;

    const hitCount = registerDaggerHit(dagger);
    const targetX = obj.x + obj.width / 2;
    const targetY = obj.y + obj.height / 2;

    if (dagger.key === "riftAmethystDagger") {
      obj.weaponShadowCurseTimer = Math.max(Number(obj.weaponShadowCurseTimer || 0), 1.4);
      if (hitCount % 3 === 0 && obj.alive) {
        damageEnemyBeforeDaggers.call(this, obj, 2, sourceX, sourceY, 120, "dimensional");
        safeCall(() => spawnFloatingText?.("RUPTURA +2", targetX, targetY - 18, dagger.accent));
      }
    } else if (dagger.key === "serpentVenomDagger") {
      obj.weaponPoisonTimer = Math.max(Number(obj.weaponPoisonTimer || 0), 4.2);
      obj.weaponPoisonTick = Math.min(Number(obj.weaponPoisonTick || 0), 0.08);
    } else if (dagger.key === "frostShardDagger") {
      obj.weaponChillTimer = Math.max(Number(obj.weaponChillTimer || 0), 2.2);
      if (Math.random() < 0.28) {
        obj.weaponFreezeTimer = Math.max(Number(obj.weaponFreezeTimer || 0), 0.85);
        safeCall(() => spawnFloatingText?.("CONGELADO", targetX, targetY - 18, dagger.accent));
      }
    } else if (dagger.key === "celestialLightDagger") {
      obj.weaponHolyMarkTimer = Math.max(Number(obj.weaponHolyMarkTimer || 0), 2.4);
      if (hitCount % 4 === 0 && player.health < player.maxHealth) {
        player.health = Math.min(player.maxHealth, Number(player.health || 0) + 1);
        safeCall(() => spawnFloatingText?.("+1 VIDA", player.x + player.width / 2, player.y - 16, dagger.accent));
        safeCall(() => updateHud?.(true));
      }
    } else if (dagger.key === "verdantLeafDagger") {
      obj.weaponPoisonTimer = Math.max(Number(obj.weaponPoisonTimer || 0), 1.8);
      if (Math.random() < 0.24) {
        obj.rootedTimer = Math.max(Number(obj.rootedTimer || 0), 0.8);
        obj.rootedX = obj.x;
        obj.rootedY = obj.y;
        safeCall(() => spawnFloatingText?.("ENRAIZADO", targetX, targetY - 18, dagger.accent));
      }
      if (hitCount % 5 === 0 && player.health < player.maxHealth) {
        player.health = Math.min(player.maxHealth, Number(player.health || 0) + 1);
        safeCall(() => spawnFloatingText?.("NATUREZA +1", player.x + player.width / 2, player.y - 16, dagger.accent));
        safeCall(() => updateHud?.(true));
      }
    } else if (dagger.key === "ironDagger" && Math.random() < 0.15 && obj.alive) {
      damageEnemyBeforeDaggers.call(this, obj, 1, sourceX, sourceY, 100, "fisico");
      safeCall(() => spawnFloatingText?.("CRÍTICO +1", targetX, targetY - 18, "#ffffff"));
    }

    return hit;
  };

  const loadGameBeforeDaggers = typeof loadGame === "function" ? loadGame : null;
  loadGame = function loadGameDaggers() {
    const result = loadGameBeforeDaggers ? loadGameBeforeDaggers.apply(this, arguments) : false;
    registerDaggerWeapons();
    return result;
  };

  const saveGameBeforeDaggers = typeof saveGame === "function" ? saveGame : null;
  saveGame = function saveGameDaggers() {
    registerDaggerWeapons();
    return saveGameBeforeDaggers ? saveGameBeforeDaggers.apply(this, arguments) : undefined;
  };

  const resetProgressBeforeDaggers = typeof resetProgressForNewGame === "function" ? resetProgressForNewGame : null;
  resetProgressForNewGame = function resetProgressForNewGameDaggers() {
    const result = resetProgressBeforeDaggers ? resetProgressBeforeDaggers.apply(this, arguments) : undefined;
    questBook.daggerCollection = { version: 1, unlocked: {}, hitCounts: {}, order: [] };
    registerDaggerWeapons();
    return result;
  };

  registerDaggerWeapons();
  preloadDaggerTextures();

  window.ETERNAL_RIFT_DAGGERS = {
    version: PATCH_ID,
    definitions: DAGGERS,
    keys: [...DAGGER_KEYS],
    register: registerDaggerWeapons,
    getState: ensureDaggerState,
    getTexture: (key) => loadDaggerTexture(daggerDefinition(key)),
    isDagger: (key) => Boolean(daggerDefinition(key))
  };

  window.setTimeout(() => {
    registerDaggerWeapons();
    safeCall(() => renderInventory?.());
    safeCall(() => updateHud?.(true));
    safeCall(() => showHudToast?.("Coleção com 6 adagas adicionada ao inventário.", 3.2));
  }, 500);

  safeCall(() => console.log("Eternal Rift patch carregado:", PATCH_ID));
})();
