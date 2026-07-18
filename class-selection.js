/* ================================================================
   Eternal Rift - Mecanica isolada de classes do menu inicial
   Classe escolhida -> personagem animado -> arma inicial -> save.
   Nao altera biomas, poderes, inventario, HUD, mapas ou combate geral.
   ================================================================ */
(function eternalRiftInitialClassMechanic() {
  "use strict";

  const PATCH_ID = "class-specific-runtime-spritesheets-pc-mobile-20260716";
  if (window.ETERNAL_RIFT_INITIAL_CLASS_MECHANIC === PATCH_ID) return;
  window.ETERNAL_RIFT_INITIAL_CLASS_MECHANIC = PATCH_ID;

  const DEFAULT_CLASS_ID = "assassin";
  const CLASS_STORAGE_KEY = "eternalRiftClassSelectionV1";
  const CLASS_DEFS = {
    warrior: {
      id: "warrior",
      name: "Guerreiro",
      initialWeapon: "sword",
      summary: "Guerreiro: resistência equilibrada e espada como arma inicial.",
      idleSheet: "assets/player_classes/warrior_idle_walk_sheet.png",
      combatSheet: "assets/player_classes/warrior_combat_sheet.png",
      cellSize: 96
    },
    archer: {
      id: "archer",
      name: "Arqueiro",
      initialWeapon: "bow",
      summary: "Arqueiro: combatente ágil que começa com o arco equipado.",
      idleSheet: "assets/player_classes/archer_idle_walk_sheet.png",
      combatSheet: "assets/player_classes/archer_combat_sheet.png",
      cellSize: 96
    },
    assassin: {
      id: "assassin",
      name: "Assassino",
      initialWeapon: "ironDagger",
      fallbackWeapon: "sword",
      summary: "Assassino: visual Rogue animado e uma arma rápida como equipamento inicial.",
      idleSheet: "rogue_idle_walk_sheet.png",
      combatSheet: "rogue_combat_sheet.png",
      cellSize: 96
    },
    mage: {
      id: "mage",
      name: "Mago",
      initialWeapon: "staff",
      summary: "Mago: conjurador que começa com o cajado equipado.",
      idleSheet: "assets/player_classes/mage_idle_walk_sheet.png",
      combatSheet: "assets/player_classes/mage_combat_sheet.png",
      cellSize: 96
    }
  };

  const spriteStates = new Map();
  let pendingClassId = DEFAULT_CLASS_ID;
  let classDashVisualUntil = 0;

  function normalizeClassId(value) {
    const id = String(value || "").trim().toLowerCase();
    if (CLASS_DEFS[id]) return id;
    if (id === "guerreiro") return "warrior";
    if (id === "arqueiro") return "archer";
    if (id === "assassino" || id === "rogue") return "assassin";
    if (id === "mago") return "mage";
    return "";
  }

  function safeJsonParse(raw) {
    try { return raw ? JSON.parse(raw) : null; }
    catch (error) { return null; }
  }

  function readRawSaveObject() {
    try {
      const raw = typeof readSaveRaw === "function" ? readSaveRaw() : "";
      return safeJsonParse(raw);
    } catch (error) {
      return null;
    }
  }

  function classIdFromSave(save) {
    return normalizeClassId(
      save?.questBook?.playerClass?.selected ||
      save?.questBook?.playerClass?.id ||
      save?.futureState?.questBook?.playerClass?.selected ||
      save?.futureState?.questBook?.playerClass?.id ||
      save?.futureState?.player?.classId ||
      save?.player?.classId
    );
  }

  function savedWeaponFromSave(save) {
    return String(
      save?.futureState?.player?.equippedWeaponKey ||
      save?.futureState?.currentWeaponKey ||
      save?.player?.equippedWeaponKey ||
      ""
    );
  }

  function selectedClassFromMenu() {
    const selected = document.querySelector("#classSelectPanel [data-class-choice].is-selected");
    return normalizeClassId(selected?.dataset?.classChoice) || pendingClassId || DEFAULT_CLASS_ID;
  }

  function persistClassIdentity(def) {
    if (!def) return;
    const payload = JSON.stringify({ selected: def.id, id: def.id, name: def.name, version: 1 });
    try { localStorage.setItem(CLASS_STORAGE_KEY, payload); } catch (error) {}
    try { localStorage.setItem("playerClass", payload); } catch (error) {}
    try { localStorage.setItem("eternalRiftPreferredClass", JSON.stringify({ selected: def.id })); } catch (error) {}
  }

  function syncClassIdentity(classId, persist = true) {
    const id = normalizeClassId(classId) || DEFAULT_CLASS_ID;
    const def = CLASS_DEFS[id];
    questBook.playerClass = {
      selected: id,
      id,
      name: def.name,
      version: 1
    };
    player.classId = id;
    player.className = def.name;
    window.playerClass = questBook.playerClass;
    pendingClassId = id;
    if (persist) persistClassIdentity(def);
    return def;
  }

  function setMenuSelection(classId, persist = false) {
    const id = normalizeClassId(classId) || DEFAULT_CLASS_ID;
    const def = CLASS_DEFS[id];
    pendingClassId = id;
    document.querySelectorAll("#classSelectPanel [data-class-choice]").forEach((button) => {
      const active = normalizeClassId(button.dataset.classChoice) === id;
      button.classList.toggle("is-selected", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
    const summary = document.getElementById("classSelectSummary");
    if (summary) summary.textContent = def.summary;
    if (persist) persistClassIdentity(def);
    return def;
  }

  function resolveInitialWeapon(def) {
    if (!def) return "sword";
    if (def.id === "assassin") {
      try { window.ETERNAL_RIFT_DAGGERS?.register?.(); } catch (error) {}
    }
    if (weapons[def.initialWeapon]) return def.initialWeapon;
    if (def.fallbackWeapon && weapons[def.fallbackWeapon]) return def.fallbackWeapon;
    return "sword";
  }

  function equipInitialClassWeapon(def) {
    const weaponKey = resolveInitialWeapon(def);
    if (!Array.isArray(player.unlockedWeapons)) player.unlockedWeapons = [];
    if (!player.unlockedWeapons.includes(weaponKey)) player.unlockedWeapons.push(weaponKey);
    player.equippedWeaponKey = weaponKey;
    const unlockedIndex = player.unlockedWeapons.indexOf(weaponKey);
    currentWeaponIndex = Math.max(0, unlockedIndex);
    if (typeof weaponVisualState === "object" && weaponVisualState) weaponVisualState.weaponKey = weaponKey;
    weaponCooldownTimer = 0;
    attackWindupTimer = 0;
    attackRecoveryTimer = 0;
    attackTimer = 0;
    currentMeleeAttack = null;
    return weaponKey;
  }

  function applyMinimalNewGameStats(def) {
    // Mantém o balanceamento padrão. O Guerreiro recebe apenas +1 de vida.
    const warriorHealth = def.id === "warrior" ? 6 : 5;
    player.maxHealth = warriorHealth;
    player.health = warriorHealth;
    player.defense = 0;
    player.maxMana = 6;
    player.mana = 6;
    player.baseSpeed = 150;
    player.speed = 150;
    player.damageBonus = 0;
    player.critChance = 0.12;
    player.classAttackSpeed = 1;
    player.manaRegen = 0.45;
    inventory.flechas = 12;
    // Restaura apenas o poder inicial padrão; slots e poderes permanecem intactos.
    equippedPower = "fireball";
  }

  function applyNewGameClass(classId) {
    const def = syncClassIdentity(classId, true);
    applyMinimalNewGameStats(def);
    const weaponKey = equipInitialClassWeapon(def);
    setMenuSelection(def.id, false);
    try { updateHud?.(true); } catch (error) {}
    try { renderInventory?.(); } catch (error) {}
    return weaponKey;
  }

  function restoreSavedWeapon(weaponKey) {
    if (!weaponKey || !weapons[weaponKey]) return false;
    if (!Array.isArray(player.unlockedWeapons)) player.unlockedWeapons = [];
    if (!player.unlockedWeapons.includes(weaponKey)) player.unlockedWeapons.push(weaponKey);
    player.equippedWeaponKey = weaponKey;
    currentWeaponIndex = Math.max(0, player.unlockedWeapons.indexOf(weaponKey));
    if (typeof weaponVisualState === "object" && weaponVisualState) weaponVisualState.weaponKey = weaponKey;
    return true;
  }

  function loadImage(src, state) {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => { state.ready = true; state.missing = false; };
    image.onerror = () => { state.ready = false; state.missing = true; };
    image.src = `${src}?v=${PATCH_ID}`;
    state.image = image;
    return state;
  }

  function registerClassSprites(classId, config = {}) {
    const id = normalizeClassId(classId);
    if (!id) return null;
    const def = CLASS_DEFS[id];
    if (config.idleSheet) def.idleSheet = config.idleSheet;
    if (config.combatSheet) def.combatSheet = config.combatSheet;
    if (Number.isFinite(Number(config.cellSize))) def.cellSize = Math.max(16, Number(config.cellSize));
    const state = {
      idle: loadImage(def.idleSheet, { ready: false, missing: false, image: null }),
      combat: loadImage(def.combatSheet, { ready: false, missing: false, image: null })
    };
    spriteStates.set(id, state);
    return state;
  }

  for (const classId of Object.keys(CLASS_DEFS)) registerClassSprites(classId);

  const fallbackFrames = {};
  for (const direction of ["down", "left", "right", "up"]) {
    fallbackFrames[direction] = {
      idle: loadImage(`assets/player/hero-${direction}-idle.png`, { ready: false, missing: false, image: null }),
      walk: [
        loadImage(`assets/player/hero-${direction}-walk-1.png`, { ready: false, missing: false, image: null }),
        loadImage(`assets/player/hero-${direction}-walk-2.png`, { ready: false, missing: false, image: null })
      ],
      attack: loadImage(`assets/player/hero-${direction}-attack.png`, { ready: false, missing: false, image: null })
    };
  }

  const RUNTIME_SHEET_CLASSES = ["warrior", "archer", "mage"];
  const RUNTIME_SHEET_DIRECTIONS = ["down", "up", "left", "right"];

  function imageStateReady(state) {
    const image = state?.image;
    return Boolean(state?.ready && image && (image.naturalWidth || image.width));
  }

  function fallbackFramesReady() {
    return RUNTIME_SHEET_DIRECTIONS.every((direction) => {
      const set = fallbackFrames[direction];
      return imageStateReady(set?.idle) && set?.walk?.every(imageStateReady) && imageStateReady(set?.attack);
    });
  }

  function drawRuntimeGearBehind(g, classId, cellX, cellY, centerX, bottomY) {
    g.save();
    g.imageSmoothingEnabled = false;
    if (classId === "warrior") {
      g.fillStyle = "#243f72";
      g.fillRect(centerX - 31, bottomY - 45, 12, 25);
      g.fillStyle = "#d2a44b";
      g.fillRect(centerX - 33, bottomY - 42, 15, 3);
      g.fillRect(centerX - 31, bottomY - 31, 12, 3);
    } else if (classId === "archer") {
      g.fillStyle = "#513b27";
      g.fillRect(centerX + 18, bottomY - 56, 8, 38);
      g.fillStyle = "#d9b36b";
      g.fillRect(centerX + 20, bottomY - 62, 2, 39);
      g.fillRect(centerX + 24, bottomY - 59, 2, 36);
      g.fillStyle = "#2e5530";
      g.beginPath();
      g.moveTo(centerX - 24, bottomY - 47);
      g.lineTo(centerX + 23, bottomY - 47);
      g.lineTo(centerX + 27, bottomY - 5);
      g.lineTo(centerX - 28, bottomY - 5);
      g.closePath();
      g.fill();
    } else if (classId === "mage") {
      g.fillStyle = "rgba(76, 162, 255, 0.24)";
      g.beginPath();
      g.arc(centerX, bottomY - 34, 30, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = "#232d72";
      g.beginPath();
      g.moveTo(centerX - 27, bottomY - 42);
      g.lineTo(centerX + 27, bottomY - 42);
      g.lineTo(centerX + 32, bottomY - 4);
      g.lineTo(centerX - 32, bottomY - 4);
      g.closePath();
      g.fill();
    }
    g.restore();
  }

  function tintRuntimeClassFrame(g, classId, drawX, drawY, drawW, drawH) {
    if (classId === "warrior") return;
    g.save();
    g.globalCompositeOperation = "source-atop";
    g.globalAlpha = classId === "archer" ? 0.28 : 0.24;
    g.fillStyle = classId === "archer" ? "#5d913d" : "#6045ae";
    g.fillRect(drawX, drawY, drawW, drawH);
    g.restore();
  }

  function drawRuntimeGearFront(g, classId, centerX, bottomY, direction) {
    g.save();
    g.imageSmoothingEnabled = false;
    if (classId === "warrior") {
      g.fillStyle = "#cfd6e2";
      g.fillRect(centerX - 21, bottomY - 47, 8, 6);
      g.fillRect(centerX + 13, bottomY - 47, 8, 6);
      g.fillStyle = "#e1b85d";
      g.fillRect(centerX - 19, bottomY - 45, 4, 2);
      g.fillRect(centerX + 15, bottomY - 45, 4, 2);
      g.fillRect(centerX - 2, bottomY - 35, 4, 20);
    } else if (classId === "archer") {
      g.fillStyle = "#406c39";
      g.fillRect(centerX - 18, bottomY - 59, 36, 5);
      g.fillStyle = "#78a956";
      g.fillRect(centerX - 13, bottomY - 55, 26, 3);
      g.fillStyle = "#b48a50";
      if (direction === "left" || direction === "right") {
        const side = direction === "left" ? -1 : 1;
        g.fillRect(centerX + side * 21 - 1, bottomY - 48, 3, 34);
        g.fillRect(centerX + side * 18 - 1, bottomY - 48, 8, 2);
        g.fillRect(centerX + side * 18 - 1, bottomY - 16, 8, 2);
      }
    } else if (classId === "mage") {
      g.fillStyle = "#17265e";
      g.fillRect(centerX - 21, bottomY - 54, 42, 5);
      g.fillStyle = "#916bd0";
      g.fillRect(centerX - 15, bottomY - 50, 30, 3);
      g.fillStyle = "#65d4ff";
      g.fillRect(centerX - 3, bottomY - 63, 6, 6);
      g.fillStyle = "#fff2a6";
      g.fillRect(centerX - 1, bottomY - 61, 2, 2);
      g.fillStyle = "#d2a9ff";
      g.fillRect(centerX - 2, bottomY - 31, 4, 17);
    }
    g.restore();
  }

  function paintRuntimeClassCell(g, classId, image, column, row, direction, poseIndex = 0) {
    if (!image) return;
    const cell = 96;
    const cellX = column * cell;
    const cellY = row * cell;
    const sourceW = image.naturalWidth || image.width || 40;
    const sourceH = image.naturalHeight || image.height || 58;
    const scale = Math.min(78 / Math.max(1, sourceH), 90 / Math.max(1, sourceW));
    const drawW = Math.max(1, Math.round(sourceW * scale));
    const drawH = Math.max(1, Math.round(sourceH * scale));
    const lunge = poseIndex === 1 ? 2 : poseIndex === 2 ? 4 : poseIndex === 3 ? 1 : 0;
    const directionX = direction === "left" ? -lunge : direction === "right" ? lunge : 0;
    const directionY = direction === "up" ? -lunge : direction === "down" ? lunge : 0;
    const centerX = cellX + cell / 2 + directionX;
    const bottomY = cellY + cell - 4 + directionY;
    const drawX = Math.round(centerX - drawW / 2);
    const drawY = Math.round(bottomY - drawH);

    drawRuntimeGearBehind(g, classId, cellX, cellY, centerX, bottomY);
    g.save();
    g.imageSmoothingEnabled = false;
    g.drawImage(image, drawX, drawY, drawW, drawH);
    g.restore();
    tintRuntimeClassFrame(g, classId, drawX, drawY, drawW, drawH);
    drawRuntimeGearFront(g, classId, centerX, bottomY, direction);
  }

  function createRuntimeClassSheets(classId) {
    const cell = 96;
    const idleCanvas = document.createElement("canvas");
    const combatCanvas = document.createElement("canvas");
    idleCanvas.width = combatCanvas.width = cell * 8;
    idleCanvas.height = combatCanvas.height = cell * 4;
    idleCanvas.dataset.classSprite = classId;
    combatCanvas.dataset.classSprite = classId;
    const idleContext = idleCanvas.getContext("2d");
    const combatContext = combatCanvas.getContext("2d");
    if (!idleContext || !combatContext) return null;
    idleContext.imageSmoothingEnabled = false;
    combatContext.imageSmoothingEnabled = false;

    for (let row = 0; row < RUNTIME_SHEET_DIRECTIONS.length; row += 1) {
      const direction = RUNTIME_SHEET_DIRECTIONS[row];
      const frames = fallbackFrames[direction];
      const idleSequence = [frames.idle.image, frames.idle.image, frames.walk[0].image, frames.idle.image];
      const walkSequence = [frames.walk[0].image, frames.idle.image, frames.walk[1].image, frames.idle.image];
      const attackSequence = classId === "warrior"
        ? [frames.idle.image, frames.attack.image, frames.attack.image, frames.idle.image]
        : [frames.idle.image, frames.walk[0].image, frames.walk[1].image, frames.idle.image];
      const dashSequence = [frames.walk[0].image, frames.walk[1].image, frames.walk[0].image, frames.walk[1].image];

      idleSequence.forEach((image, index) => paintRuntimeClassCell(idleContext, classId, image, index, row, direction, 0));
      walkSequence.forEach((image, index) => paintRuntimeClassCell(idleContext, classId, image, 4 + index, row, direction, index));
      attackSequence.forEach((image, index) => paintRuntimeClassCell(combatContext, classId, image, index, row, direction, index));
      dashSequence.forEach((image, index) => paintRuntimeClassCell(combatContext, classId, image, 4 + index, row, direction, index));
    }

    return {
      runtime: true,
      source: `runtime-${classId}`,
      idle: { ready: true, missing: false, image: idleCanvas, runtime: true },
      combat: { ready: true, missing: false, image: combatCanvas, runtime: true }
    };
  }

  function buildRuntimeClassSprites() {
    if (!fallbackFramesReady()) return false;
    let builtAny = false;
    for (const classId of RUNTIME_SHEET_CLASSES) {
      const current = spriteStates.get(classId);
      if (imageStateReady(current?.idle) && imageStateReady(current?.combat)) continue;
      if (!current?.idle?.missing && !current?.combat?.missing) continue;
      const runtimeState = createRuntimeClassSheets(classId);
      if (!runtimeState) continue;
      spriteStates.set(classId, runtimeState);
      builtAny = true;
    }
    return builtAny;
  }

  [100, 260, 700, 1400].forEach((delay) => window.setTimeout(buildRuntimeClassSprites, delay));

  function currentClassId() {
    return normalizeClassId(questBook.playerClass?.selected || player.classId) || DEFAULT_CLASS_ID;
  }

  function currentClassAction() {
    if (performance.now() < classDashVisualUntil) return "dash";
    if (currentMeleeAttack || Number(attackWindupTimer || 0) > 0.01 || Number(attackTimer || 0) > 0.01 || Number(attackRecoveryTimer || 0) > 0.01) return "attack";
    return player.moving ? "walk" : "idle";
  }

  function frameIndex(action) {
    if (action === "idle") return Math.floor(performance.now() / 220) % 4;
    if (action === "walk") return Number.isFinite(player.frame) ? Math.floor(player.frame) % 4 : Math.floor(performance.now() / 110) % 4;
    if (action === "dash") return Math.min(3, Math.floor((240 - Math.max(0, classDashVisualUntil - performance.now())) / 60));
    const windup = Math.max(0, Number(attackWindupTimer || 0));
    const active = Math.max(0, Number(attackTimer || 0));
    if (windup > 0.01) return windup > 0.06 ? 0 : 1;
    if (active > 0.01) return 2;
    return 3;
  }

  function drawCommonClassEffects(drawX, drawY, drawW, drawH) {
    const blink = playerInvulnerableTimer > 0 && Math.floor(performance.now() / 75) % 2 === 0;
    if (blink) ctx.globalAlpha = 0.45;
    if (player.isSwimming) {
      ctx.strokeStyle = "rgba(155, 244, 255, 0.72)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(player.x + player.width / 2, player.y + 27, 18, 6, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    if (player.levelGlowTimer > 0 || activePowerUps?.shield > 0) {
      const pulse = 0.20 + Math.sin(performance.now() / 110) * 0.06;
      ctx.fillStyle = `rgba(88,223,255,${pulse})`;
      ctx.fillRect(drawX - 4, drawY - 4, drawW + 8, drawH + 8);
    }
    ctx.fillStyle = "rgba(7, 9, 18, 0.32)";
    ctx.beginPath();
    ctx.ellipse(player.x + player.width / 2, player.y + player.height - 1, 14, 5, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawSheetClass(classId) {
    const state = spriteStates.get(classId);
    const def = CLASS_DEFS[classId];
    const action = currentClassAction();
    const useCombat = action === "attack" || action === "dash";
    const imageState = useCombat ? state?.combat : state?.idle;
    const sheetWidth = imageState?.image?.naturalWidth || imageState?.image?.width || 0;
    if (!imageState?.ready || !sheetWidth) return false;
    const row = ({ down: 0, up: 1, left: 2, right: 3 })[player.direction] ?? 0;
    const frame = frameIndex(action);
    const column = action === "idle" ? frame : action === "walk" ? 4 + frame : action === "dash" ? 4 + frame : frame;
    const cell = def.cellSize || 96;
    const drawW = 64;
    const drawH = 64;
    const bob = player.moving && action === "walk" ? Math.sin(performance.now() / 85) * 1.2 : 0;
    const drawX = Math.round(player.x + player.width / 2 - drawW / 2);
    const drawY = Math.round(player.y + player.height - drawH + 9 + bob);
    ctx.save();
    drawCommonClassEffects(drawX, drawY, drawW, drawH);
    const smoothing = ctx.imageSmoothingEnabled;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(imageState.image, column * cell, row * cell, cell, cell, drawX, drawY, drawW, drawH);
    ctx.imageSmoothingEnabled = smoothing;
    ctx.restore();
    return true;
  }

  function fallbackFrameState(direction, action) {
    const set = fallbackFrames[direction] || fallbackFrames.down;
    if (action === "attack") return set.attack;
    if (action === "walk" || action === "dash") return set.walk[Math.floor(performance.now() / 130) % set.walk.length];
    return set.idle;
  }

  function drawAnimatedFallback() {
    const direction = fallbackFrames[player.direction] ? player.direction : "down";
    const state = fallbackFrameState(direction, currentClassAction());
    if (!state?.ready || !state.image?.naturalWidth) return false;
    const image = state.image;
    const drawW = image.naturalWidth || image.width || 40;
    const drawH = image.naturalHeight || image.height || 58;
    const bob = player.moving ? Math.sin(performance.now() / 88) * 0.7 : 0;
    const drawX = Math.round(player.x + player.width / 2 - drawW / 2);
    const drawY = Math.round(player.y + player.height + 5 - drawH + bob);
    ctx.save();
    drawCommonClassEffects(drawX, drawY, drawW, drawH);
    const smoothing = ctx.imageSmoothingEnabled;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(image, drawX, drawY, drawW, drawH);
    ctx.imageSmoothingEnabled = smoothing;
    ctx.restore();
    return true;
  }

  function drawClassFallbackOverlay(classId) {
    if (classId === "assassin") return;
    const x = player.x;
    const y = player.y;
    const t = performance.now() / 1000;
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    if (classId === "warrior") {
      ctx.fillStyle = "rgba(39, 73, 130, 0.72)";
      ctx.fillRect(x - 5, y + 7, 6, 19);
      ctx.fillStyle = "#d8ad58";
      ctx.fillRect(x - 6, y + 10, 8, 2);
      ctx.fillRect(x - 4, y + 15, 4, 2);
    } else if (classId === "archer") {
      ctx.strokeStyle = "#8f6c3e";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x + player.width + 5, y + 16, 7, -1.2, 1.2);
      ctx.stroke();
      ctx.fillStyle = "#6f9d55";
      ctx.fillRect(x + 2, y + 5, player.width - 4, 3);
    } else if (classId === "mage") {
      const alpha = 0.25 + Math.sin(t * 4) * 0.07;
      ctx.strokeStyle = `rgba(98, 191, 255, ${alpha + 0.32})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x + player.width / 2, y + player.height / 2, 18, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "#7fcfff";
      ctx.fillRect(x + player.width / 2 - 2, y - 4, 4, 4);
      ctx.fillStyle = "#2c3d85";
      ctx.fillRect(x + 2, y + 5, player.width - 4, 3);
    }
    ctx.restore();
  }

  const drawPlayerBeforeClassMechanic = typeof drawPlayer === "function" ? drawPlayer : null;
  drawPlayer = function drawPlayerInitialClassMechanic() {
    const classId = currentClassId();
    let rendered = drawSheetClass(classId);
    let usedFallback = false;
    if (!rendered && classId !== "assassin") {
      rendered = drawAnimatedFallback();
      usedFallback = rendered;
    }
    if (!rendered && drawPlayerBeforeClassMechanic) drawPlayerBeforeClassMechanic();
    if (usedFallback) drawClassFallbackOverlay(classId);
  };

  const dodgeDashBeforeClassMechanic = typeof dodgeDash === "function" ? dodgeDash : null;
  if (dodgeDashBeforeClassMechanic) {
    dodgeDash = function dodgeDashInitialClassMechanic() {
      const beforeX = player.x;
      const beforeY = player.y;
      const result = dodgeDashBeforeClassMechanic.apply(this, arguments);
      if (currentClassId() === "assassin" && Math.hypot(player.x - beforeX, player.y - beforeY) > 1) {
        classDashVisualUntil = performance.now() + 240;
      }
      return result;
    };
  }

  const resetProgressBeforeClassMechanic = typeof resetProgressForNewGame === "function" ? resetProgressForNewGame : null;
  resetProgressForNewGame = function resetProgressForNewGameInitialClass() {
    const selectedClassId = selectedClassFromMenu();
    const result = resetProgressBeforeClassMechanic ? resetProgressBeforeClassMechanic.apply(this, arguments) : undefined;
    applyNewGameClass(selectedClassId);
    return result;
  };

  const loadGameBeforeClassMechanic = typeof loadGame === "function" ? loadGame : null;
  loadGame = function loadGameInitialClass() {
    const save = readRawSaveObject();
    const savedClassId = classIdFromSave(save) || DEFAULT_CLASS_ID;
    const savedWeaponKey = savedWeaponFromSave(save);
    const result = loadGameBeforeClassMechanic ? loadGameBeforeClassMechanic.apply(this, arguments) : false;
    if (!result) return result;
    syncClassIdentity(savedClassId, true);
    if (!restoreSavedWeapon(savedWeaponKey) && !classIdFromSave(save)) {
      equipInitialClassWeapon(CLASS_DEFS[DEFAULT_CLASS_ID]);
    }
    setMenuSelection(savedClassId, false);
    try { updateHud?.(true); } catch (error) {}
    return result;
  };

  const saveGameBeforeClassMechanic = typeof saveGame === "function" ? saveGame : null;
  saveGame = function saveGameInitialClass() {
    const def = syncClassIdentity(currentClassId(), true);
    player.classId = def.id;
    player.className = def.name;
    return saveGameBeforeClassMechanic ? saveGameBeforeClassMechanic.apply(this, arguments) : undefined;
  };

  const startNewGameBeforeClassMechanic = typeof startNewGame === "function" ? startNewGame : null;
  startNewGame = function startNewGameInitialClass() {
    pendingClassId = selectedClassFromMenu();
    return startNewGameBeforeClassMechanic ? startNewGameBeforeClassMechanic.apply(this, arguments) : undefined;
  };

  function bindMenuClassSelection() {
    const panel = document.getElementById("classSelectPanel");
    if (!panel || panel.dataset.erClassMechanicBound === "true") return;
    panel.dataset.erClassMechanicBound = "true";
    panel.addEventListener("click", (event) => {
      const button = event.target.closest("[data-class-choice]");
      if (!button) return;
      setMenuSelection(button.dataset.classChoice, true);
    }, true);
  }

  const savedAtBoot = classIdFromSave(readRawSaveObject());
  pendingClassId = savedAtBoot || DEFAULT_CLASS_ID;
  bindMenuClassSelection();
  setMenuSelection(pendingClassId, false);
  window.setTimeout(() => { bindMenuClassSelection(); setMenuSelection(pendingClassId, false); }, 120);

  window.ETERNAL_RIFT_CLASSES = {
    version: PATCH_ID,
    defaultClassId: DEFAULT_CLASS_ID,
    definitions: CLASS_DEFS,
    getSelectedClassId: currentClassId,
    getPendingClassId: () => pendingClassId,
    selectMenuClass: (classId) => setMenuSelection(classId, true),
    applyNewGameClass,
    registerClassSprites,
    rebuildRuntimeSprites: buildRuntimeClassSprites,
    getSpriteState: (classId) => spriteStates.get(normalizeClassId(classId)) || null,
    getActiveSpriteSource: (classId) => {
      const id = normalizeClassId(classId) || currentClassId();
      const state = spriteStates.get(id);
      return state?.source || CLASS_DEFS[id]?.idleSheet || "fallback";
    }
  };
})();
