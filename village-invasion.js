/* ================================================================
   ETERNAL RIFT — Evento de Invasão da Vila
   Sistema isolado: ondas, fendas por Canvas, defesa e recompensa.
   A imagem de referência não é carregada nem incluída no jogo.
   ================================================================ */
(function eternalRiftVillageInvasionSystem() {
  "use strict";

  const VERSION = "village-invasion-v1-pc-mobile-20260717";
  if (typeof window !== "undefined" && window.ETERNAL_RIFT_VILLAGE_INVASION_VERSION) return;
  if (typeof window !== "undefined") window.ETERNAL_RIFT_VILLAGE_INVASION_VERSION = VERSION;

  const REWARD_NAME = "Núcleo da Fenda Eterna";
  const TOTAL_WAVES = 3;
  const RANDOM_FIRST_CHECK_SECONDS = 85;
  const RANDOM_CHECK_SECONDS = 45;
  const RANDOM_CHANCE = 0.055;
  const EVENT_TIMEOUT_SECONDS = 210;
  const EVENT_COOLDOWN_MS = 10 * 60 * 1000;
  const FAILURE_COOLDOWN_MS = 2 * 60 * 1000;
  const CORE_SHIELD_COOLDOWN_MS = 90 * 1000;
  const CORE_SHIELD_DURATION = 2.6;
  const CORE_DIMENSIONAL_DAMAGE_BONUS = 1.12;
  const CORE_COOLDOWN_MULTIPLIER = 0.92;

  const WAVE_DEFINITIONS = [
    [
      { type: "small", count: 4 }
    ],
    [
      { type: "small", count: 3 },
      { type: "medium", count: 2 }
    ],
    [
      { type: "medium", count: 2 },
      { type: "boss", count: 1 }
    ]
  ];

  const FALLBACK_RIFT_TILES = [
    [27, 23], [39, 24], [31, 17], [45, 22], [22, 25],
    [32, 29], [49, 25], [20, 20], [43, 34], [29, 36]
  ];

  const SHADOW_POWER_KEYS = new Set([
    "rasgoDimensional", "shadowOrb", "lifeSteal", "shadowClone",
    "shadowExplosion", "deathMark", "darkRay", "voidBurst"
  ]);

  const runtime = {
    status: "idle",
    source: "",
    waveIndex: -1,
    queue: [],
    defense: 100,
    elapsed: 0,
    spawnTimer: 0,
    intermissionTimer: 0,
    randomTimer: 0,
    nextRandomCheck: RANDOM_FIRST_CHECK_SECONDS,
    rifts: [],
    particles: [],
    riftCursor: 0,
    defeated: 0,
    spawned: 0,
    visualTimer: 0,
    pruneTimer: 0,
    defenseScanTimer: 0,
    cachedThreatDrain: 0,
    hudHideTimer: 0,
    endingTimer: 0,
    cleanupInProgress: false,
    lastFailureReason: "",
    seed: 1
  };

  let hudRoot = null;
  let hudTitle = null;
  let hudStatus = null;
  let hudDefenseText = null;
  let hudDefenseFill = null;

  function safeNow() {
    return Date.now();
  }

  function safeDelta(value) {
    return Number.isFinite(value) ? Math.max(0, Math.min(0.1, value)) : 1 / 60;
  }

  function mobileMode() {
    try {
      return Boolean(isMobile || window.matchMedia("(max-width: 880px), (pointer: coarse)").matches);
    } catch (error) {
      return window.innerWidth <= 880;
    }
  }

  function liveEnemyCap() {
    return mobileMode() ? 5 : 8;
  }

  function particleCap() {
    return mobileMode() ? 54 : 120;
  }

  function normalizeText(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  function ensurePersistentState() {
    if (!questBook.villageInvasion || typeof questBook.villageInvasion !== "object" || Array.isArray(questBook.villageInvasion)) {
      questBook.villageInvasion = {};
    }

    const state = questBook.villageInvasion;
    state.version = 1;
    state.completedEver = Boolean(state.completedEver);
    state.completions = Math.max(0, Number(state.completions || 0));
    state.rewardGranted = Boolean(state.rewardGranted);
    state.lastResult = String(state.lastResult || "none");
    state.lastSource = String(state.lastSource || "");
    state.lastStartedAt = Math.max(0, Number(state.lastStartedAt || 0));
    state.lastCompletedAt = Math.max(0, Number(state.lastCompletedAt || 0));
    state.nextEligibleAt = Math.max(0, Number(state.nextEligibleAt || 0));
    state.coreShieldReadyAt = Math.max(0, Number(state.coreShieldReadyAt || 0));
    state.status = state.completedEver ? "completed" : "idle";
    return state;
  }

  function ensureRewardInventoryState() {
    if (!inventory.customItems || typeof inventory.customItems !== "object" || Array.isArray(inventory.customItems)) {
      inventory.customItems = {};
    }
  }

  function hasRiftCore() {
    ensureRewardInventoryState();
    return Number(inventory.customItems[REWARD_NAME] || 0) > 0;
  }

  function isRunning() {
    return runtime.status === "wave" || runtime.status === "intermission";
  }

  function installHud() {
    if (hudRoot && document.body.contains(hudRoot)) return hudRoot;

    if (!document.getElementById("erVillageInvasionStyles")) {
      const style = document.createElement("style");
      style.id = "erVillageInvasionStyles";
      style.textContent = `
        #erVillageInvasionHud {
          position: fixed;
          z-index: 1700;
          top: max(10px, env(safe-area-inset-top));
          left: 50%;
          width: min(570px, calc(100vw - 28px));
          transform: translate(-50%, -18px) scale(.97);
          opacity: 0;
          pointer-events: none;
          transition: opacity .22s ease, transform .22s ease;
          color: #fff4d0;
          font-family: inherit;
          filter: drop-shadow(0 10px 18px rgba(7, 0, 14, .58));
        }
        #erVillageInvasionHud[hidden] { display: none !important; }
        #erVillageInvasionHud.is-visible { opacity: 1; transform: translate(-50%, 0) scale(1); }
        #erVillageInvasionHud .er-invasion-frame {
          position: relative;
          overflow: hidden;
          border: 3px solid #a36bcb;
          border-radius: 9px;
          padding: 10px 16px 12px;
          background:
            linear-gradient(90deg, rgba(83, 15, 111, .95), rgba(38, 7, 55, .96) 43%, rgba(104, 18, 50, .95)),
            #25062f;
          box-shadow: inset 0 0 0 2px #31103e, inset 0 0 22px rgba(255, 46, 110, .22), 0 0 22px rgba(169, 52, 255, .28);
        }
        #erVillageInvasionHud .er-invasion-frame::before,
        #erVillageInvasionHud .er-invasion-frame::after {
          content: "";
          position: absolute;
          top: -22px;
          width: 90px;
          height: 90px;
          border: 3px solid rgba(255, 76, 133, .42);
          transform: rotate(45deg);
          box-shadow: 0 0 18px rgba(194, 68, 255, .48);
        }
        #erVillageInvasionHud .er-invasion-frame::before { left: -64px; }
        #erVillageInvasionHud .er-invasion-frame::after { right: -64px; }
        #erVillageInvasionHud .er-invasion-title {
          position: relative;
          display: block;
          text-align: center;
          color: #ffe4a1;
          font-size: clamp(17px, 2.6vw, 25px);
          line-height: 1;
          letter-spacing: .075em;
          text-transform: uppercase;
          text-shadow: 0 2px 0 #3a071d, 0 0 12px rgba(255, 78, 164, .68);
        }
        #erVillageInvasionHud .er-invasion-status-row {
          position: relative;
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-top: 8px;
          color: #eadcff;
          font-size: 12px;
        }
        #erVillageInvasionHud .er-invasion-defense-track {
          position: relative;
          height: 10px;
          margin-top: 6px;
          overflow: hidden;
          border: 2px solid #13051c;
          border-radius: 3px;
          background: #16091d;
          box-shadow: inset 0 1px 4px #000;
        }
        #erVillageInvasionHud .er-invasion-defense-fill {
          display: block;
          width: 100%;
          height: 100%;
          transform-origin: left center;
          background: linear-gradient(90deg, #ff3e63, #ffbd52 42%, #75ee91 78%);
          box-shadow: 0 0 10px rgba(126, 255, 181, .48);
          transition: transform .18s linear;
        }
        #erVillageInvasionHud.is-victory .er-invasion-frame {
          border-color: #ffd96e;
          background: linear-gradient(90deg, rgba(72, 37, 10, .96), rgba(79, 32, 91, .96), rgba(72, 37, 10, .96));
          box-shadow: inset 0 0 18px rgba(255, 226, 112, .24), 0 0 28px rgba(255, 218, 92, .38);
        }
        #erVillageInvasionHud.is-failure .er-invasion-frame { border-color: #ff4665; }
        @media (max-width: 880px), (pointer: coarse) {
          #erVillageInvasionHud { top: max(6px, env(safe-area-inset-top)); width: min(430px, calc(100vw - 16px)); }
          #erVillageInvasionHud .er-invasion-frame { border-width: 2px; padding: 7px 11px 9px; }
          #erVillageInvasionHud .er-invasion-status-row { margin-top: 5px; font-size: 10px; }
          #erVillageInvasionHud .er-invasion-defense-track { height: 8px; margin-top: 4px; }
        }
      `;
      document.head.appendChild(style);
    }

    hudRoot = document.createElement("section");
    hudRoot.id = "erVillageInvasionHud";
    hudRoot.hidden = true;
    hudRoot.setAttribute("aria-live", "assertive");
    hudRoot.setAttribute("aria-label", "Estado do Evento de Invasão");
    hudRoot.innerHTML = `
      <div class="er-invasion-frame">
        <strong class="er-invasion-title">Evento de Invasão</strong>
        <div class="er-invasion-status-row">
          <span class="er-invasion-status">Prepare-se</span>
          <span class="er-invasion-defense-text">Defesa da Vila: 100%</span>
        </div>
        <div class="er-invasion-defense-track"><span class="er-invasion-defense-fill"></span></div>
      </div>
    `;
    document.body.appendChild(hudRoot);
    hudTitle = hudRoot.querySelector(".er-invasion-title");
    hudStatus = hudRoot.querySelector(".er-invasion-status");
    hudDefenseText = hudRoot.querySelector(".er-invasion-defense-text");
    hudDefenseFill = hudRoot.querySelector(".er-invasion-defense-fill");
    return hudRoot;
  }

  function showHud(mode, title, statusText, duration = 0) {
    installHud();
    hudRoot.hidden = false;
    hudRoot.classList.remove("is-victory", "is-failure");
    if (mode === "victory") hudRoot.classList.add("is-victory");
    if (mode === "failure") hudRoot.classList.add("is-failure");
    hudTitle.textContent = title || "Evento de Invasão";
    hudStatus.textContent = statusText || "Defenda a vila";
    runtime.hudHideTimer = Math.max(0, Number(duration || 0));
    requestAnimationFrame(() => hudRoot?.classList.add("is-visible"));
    updateHudValues();
  }

  function hideHud() {
    if (!hudRoot) return;
    hudRoot.classList.remove("is-visible");
    window.setTimeout(() => {
      if (hudRoot && !hudRoot.classList.contains("is-visible")) hudRoot.hidden = true;
    }, 260);
  }

  function updateHudValues() {
    if (!hudRoot) return;
    const defense = Math.max(0, Math.min(100, runtime.defense));
    if (hudDefenseText) hudDefenseText.textContent = `Defesa da Vila: ${Math.ceil(defense)}%`;
    if (hudDefenseFill) hudDefenseFill.style.transform = `scaleX(${defense / 100})`;
    if (isRunning() && hudStatus) {
      const alive = activeInvasionEnemies().length;
      const waiting = runtime.queue.length;
      if (runtime.status === "intermission") {
        hudStatus.textContent = runtime.waveIndex + 1 >= TOTAL_WAVES ? "A fenda principal está colapsando" : `Próxima onda em ${Math.max(1, Math.ceil(runtime.intermissionTimer))}s`;
      } else {
        hudStatus.textContent = `Onda ${runtime.waveIndex + 1}/${TOTAL_WAVES} • Ameaças ${alive + waiting}`;
      }
    }
  }

  function pointRectDistance(px, py, rect) {
    const nearestX = Math.max(rect.x, Math.min(px, rect.x + rect.width));
    const nearestY = Math.max(rect.y, Math.min(py, rect.y + rect.height));
    return Math.hypot(px - nearestX, py - nearestY);
  }

  function tileAtWorldPoint(x, y) {
    const tx = Math.floor(x / TILE);
    const ty = Math.floor(y / TILE);
    return worldMap?.[ty]?.[tx] || "";
  }

  function safeEntityPosition(x, y, width = 30, height = 30) {
    const probe = { type: "enemy", kind: "invasionProbe", width, height, canFly: false, canSwim: false };
    const tile = tileAtWorldPoint(x + width / 2, y + height / 2);
    if (!tile || ["W", "M", "V", "B"].includes(tile)) return false;
    try {
      if (typeof canEntityMoveTo === "function" && !canEntityMoveTo(probe, x, y)) return false;
    } catch (error) {
      return false;
    }
    return true;
  }

  function safeRiftPoint(x, y, chosen) {
    if (x < 18 * TILE || x > 55 * TILE || y < 8 * TILE || y > 39 * TILE) return false;
    if (!safeEntityPosition(x - 20, y - 20, 40, 40)) return false;
    if (Math.hypot(x - (player.x + player.width / 2), y - (player.y + player.height / 2)) < 115) return false;
    if (chosen.some((point) => Math.hypot(x - point.x, y - point.y) < 175)) return false;

    for (const obj of villageObjects) {
      if (!obj || obj.isVillageInvasionEnemy || obj.type === "flower") continue;
      const distance = pointRectDistance(x, y, obj);
      const structure = ["house", "playerHouse", "shop", "villageBarrier", "villageGate", "blacksmithShop"].includes(obj.type);
      const protectedNpc = obj.type === "npc";
      const solid = Boolean(obj.solid);
      const clearance = structure ? 72 : protectedNpc ? 62 : solid ? 44 : 30;
      if (distance < clearance) return false;
    }
    return true;
  }

  function makeRifts() {
    const desired = mobileMode() ? 2 : 3;
    const points = [];

    for (let attempt = 0; attempt < 260 && points.length < desired; attempt += 1) {
      const tx = 18 + Math.floor(Math.random() * 37);
      const ty = 8 + Math.floor(Math.random() * 31);
      const x = tx * TILE + TILE / 2;
      const y = ty * TILE + TILE / 2;
      if (safeRiftPoint(x, y, points)) points.push({ x, y });
    }

    for (const [tx, ty] of FALLBACK_RIFT_TILES) {
      if (points.length >= desired) break;
      const x = tx * TILE + TILE / 2;
      const y = ty * TILE + TILE / 2;
      if (safeRiftPoint(x, y, points)) points.push({ x, y });
    }

    return points.map((point, index) => ({
      id: `village-rift-${safeNow()}-${index}`,
      x: point.x,
      y: point.y,
      phase: Math.random() * Math.PI * 2,
      pulse: 0,
      opening: 0,
      closing: false,
      seed: runtime.seed++
    }));
  }

  function waveQueue(index) {
    const queue = [];
    for (const entry of WAVE_DEFINITIONS[index] || []) {
      for (let amount = 0; amount < entry.count; amount += 1) queue.push(entry.type);
    }
    return queue;
  }

  function beginWave(index) {
    runtime.waveIndex = index;
    runtime.queue = waveQueue(index);
    runtime.spawnTimer = 0.35;
    runtime.intermissionTimer = 0;
    runtime.status = "wave";
    showHud("active", "Evento de Invasão", `Onda ${index + 1}/${TOTAL_WAVES}`);
    try { showHudToast?.(`Invasão: onda ${index + 1} de ${TOTAL_WAVES}.`, 2.6); } catch (error) {}
  }

  function findSpawnNearRift(rift, type) {
    const size = type === "boss" ? 38 : type === "medium" ? 31 : 24;
    for (let attempt = 0; attempt < 18; attempt += 1) {
      const angle = (attempt / 18) * Math.PI * 2 + rift.phase;
      const radius = 18 + (attempt % 4) * 10;
      const x = rift.x + Math.cos(angle) * radius - size / 2;
      const y = rift.y + Math.sin(angle) * radius - size / 2;
      if (safeEntityPosition(x, y, size, size)) return { x, y };
    }
    return { x: rift.x - size / 2, y: rift.y - size / 2 };
  }

  function invasionEnemyDefinition(type) {
    if (type === "boss") {
      return { baseKind: "bruxoSombrio", name: "Arauto da Fenda", width: 38, height: 42, hp: 26, damage: 2, speed: 54, attackRange: 210, attackDelay: 1.25, projectileType: "shadow", bossLike: true };
    }
    if (type === "medium") {
      return { baseKind: "goblin", name: "Devorador Violeta", width: 31, height: 34, hp: 9, damage: 1, speed: 78, attackRange: 31, attackDelay: 1.0, projectileType: null, bossLike: false };
    }
    return { baseKind: "fantasma", name: "Sombra Veloz", width: 23, height: 24, hp: 4, damage: 1, speed: 126, attackRange: 25, attackDelay: 0.72, projectileType: null, bossLike: false };
  }

  function spawnInvasionEnemy(type) {
    if (!runtime.rifts.length || activeInvasionEnemies().length >= liveEnemyCap()) return false;
    const definition = invasionEnemyDefinition(type);
    const rift = runtime.rifts[runtime.riftCursor % runtime.rifts.length];
    runtime.riftCursor += 1;
    const position = findSpawnNearRift(rift, type);
    const obj = enemy(Math.max(0, Math.floor(position.x / TILE)), Math.max(0, Math.floor(position.y / TILE)), definition.baseKind);

    Object.assign(obj, {
      x: position.x,
      y: position.y,
      spawnX: position.x,
      spawnY: position.y,
      width: definition.width,
      height: definition.height,
      hp: definition.hp,
      maxHp: definition.hp,
      damage: definition.damage,
      speed: definition.speed,
      aggroRange: 620,
      attackRange: definition.attackRange,
      attackDelay: definition.attackDelay,
      projectileType: definition.projectileType,
      defense: 0,
      resistances: {},
      boss: false,
      bossItem: null,
      coinReward: 0,
      coinsReward: 0,
      xpReward: 0,
      dropTable: { coin: 0, potion: 0, powerUp: 0, loot: 0 },
      state: "chase",
      alive: true,
      isVillageInvasionEnemy: true,
      dimensionalCreature: true,
      invasionEnemyType: type,
      invasionDisplayName: definition.name,
      invasionBoss: definition.bossLike,
      invasionBornAt: runtime.elapsed,
      invasionLastMovedAt: runtime.elapsed,
      invasionLastX: position.x,
      invasionLastY: position.y,
      invasionRescues: 0,
      invasionDeathAt: 0,
      invasionSeed: runtime.seed++
    });

    villageObjects.push(obj);
    runtime.spawned += 1;
    rift.pulse = 1;
    burstParticles(rift.x, rift.y, type === "boss" ? 24 : 12, type === "boss" ? "#ff315d" : "#ad4dff", 110);
    try { playSound?.(type === "boss" ? "shockwave" : "enemyMagic"); } catch (error) {}
    return true;
  }

  function activeInvasionEnemies() {
    return villageObjects.filter((obj) => obj?.type === "enemy" && obj.isVillageInvasionEnemy && obj.alive);
  }

  function removeInvasionProjectiles() {
    for (let index = enemyProjectiles.length - 1; index >= 0; index -= 1) {
      if (enemyProjectiles[index]?.isVillageInvasionProjectile) enemyProjectiles.splice(index, 1);
    }
  }

  function removeInvasionEnemies(includeAlive = true) {
    for (let index = villageObjects.length - 1; index >= 0; index -= 1) {
      const obj = villageObjects[index];
      if (!obj?.isVillageInvasionEnemy) continue;
      if (!includeAlive && obj.alive) continue;
      villageObjects.splice(index, 1);
    }
  }

  function clearEventObjects(options = {}) {
    runtime.cleanupInProgress = true;
    removeInvasionEnemies(true);
    removeInvasionProjectiles();
    runtime.queue.length = 0;
    if (!options.keepRifts) runtime.rifts.length = 0;
    if (!options.keepParticles) runtime.particles.length = 0;
    runtime.cleanupInProgress = false;
  }

  function resetRuntimeToIdle() {
    runtime.status = "idle";
    runtime.source = "";
    runtime.waveIndex = -1;
    runtime.queue.length = 0;
    runtime.defense = 100;
    runtime.elapsed = 0;
    runtime.spawnTimer = 0;
    runtime.intermissionTimer = 0;
    runtime.rifts.length = 0;
    runtime.particles.length = 0;
    runtime.endingTimer = 0;
    runtime.hudHideTimer = 0;
    hideHud();
  }

  function startInvasion(source = "manual") {
    const state = ensurePersistentState();
    if (isRunning() || runtime.status === "victory" || runtime.status === "failure") return false;
    if (!gameStarted || gameOver || currentScene !== "village") return false;
    if (source === "random" && safeNow() < state.nextEligibleAt) return false;

    clearEventObjects();
    runtime.status = "opening";
    runtime.source = String(source || "manual");
    runtime.waveIndex = -1;
    runtime.queue.length = 0;
    runtime.defense = 100;
    runtime.elapsed = 0;
    runtime.spawned = 0;
    runtime.defeated = 0;
    runtime.riftCursor = 0;
    runtime.particles.length = 0;
    runtime.rifts = makeRifts();

    if (!runtime.rifts.length) {
      resetRuntimeToIdle();
      try { showHudToast?.("A invasão não encontrou um ponto seguro para surgir.", 3); } catch (error) {}
      return false;
    }

    state.lastSource = runtime.source;
    state.lastStartedAt = safeNow();
    state.lastResult = "active";
    state.nextEligibleAt = safeNow() + EVENT_COOLDOWN_MS;
    state.status = "active";
    showHud("active", "Evento de Invasão", "Fendas dimensionais detectadas");
    try {
      showHudToast?.("Evento de Invasão: defenda os moradores e a vila!", 4);
      playSound?.("shockwave");
      vibrate?.([35, 45, 55]);
    } catch (error) {}

    window.setTimeout(() => {
      if (runtime.status === "opening") beginWave(0);
    }, 850);
    return true;
  }

  function grantRiftCore() {
    const state = ensurePersistentState();
    ensureRewardInventoryState();
    const alreadyOwned = hasRiftCore() || state.rewardGranted;
    inventory.customItems[REWARD_NAME] = alreadyOwned ? Math.min(1, Number(inventory.customItems[REWARD_NAME] || 0)) : 1;
    state.rewardGranted = true;
    try { renderInventory?.(); } catch (error) {}
    return !alreadyOwned;
  }

  function finishVictory() {
    if (!isRunning()) return;
    const state = ensurePersistentState();
    const receivedCore = grantRiftCore();
    state.completedEver = true;
    state.completions += 1;
    state.lastCompletedAt = safeNow();
    state.lastResult = "victory";
    state.status = "completed";
    state.nextEligibleAt = safeNow() + EVENT_COOLDOWN_MS;

    runtime.status = "victory";
    runtime.endingTimer = 4.8;
    runtime.queue.length = 0;
    for (const rift of runtime.rifts) rift.closing = true;
    removeInvasionEnemies(true);
    removeInvasionProjectiles();
    burstParticles(player.x + player.width / 2, player.y + player.height / 2, mobileMode() ? 28 : 48, "#ffd967", 170);
    showHud("victory", "Vila Protegida!", receivedCore ? "Relíquia obtida: Núcleo da Fenda Eterna" : "Invasão derrotada • Relíquia já registrada", 4.6);
    try {
      showHudToast?.(receivedCore ? "Núcleo da Fenda Eterna adicionado ao inventário!" : "Invasão vencida. O Núcleo não foi duplicado.", 5);
      playSound?.("bossDown");
      vibrate?.([45, 55, 80, 55, 110]);
      updateHud?.(true);
      renderInventory?.();
    } catch (error) {}

    window.setTimeout(() => {
      try { if (gameStarted && !gameOver) saveGame?.(); } catch (error) {}
    }, 700);
  }

  function failInvasion(reason = "defense") {
    if (!isRunning() && runtime.status !== "opening") return;
    const state = ensurePersistentState();
    state.lastResult = String(reason || "failure");
    state.status = state.completedEver ? "completed" : "idle";
    state.nextEligibleAt = safeNow() + FAILURE_COOLDOWN_MS;
    runtime.lastFailureReason = String(reason || "failure");
    runtime.status = "failure";
    runtime.endingTimer = reason === "leave" ? 0.1 : 3.6;
    clearEventObjects({ keepParticles: reason !== "leave" });
    if (reason !== "leave" && reason !== "reset" && reason !== "load") {
      const message = reason === "death" ? "O defensor caiu. A invasão foi encerrada." : reason === "timeout" ? "A invasão durou demais e a vila recuou." : "A Defesa da Vila chegou a 0.";
      showHud("failure", "Defesa Rompida", message, 3.4);
      try { showHudToast?.(message, 4); playSound?.("playerHit"); } catch (error) {}
    } else {
      hideHud();
    }
  }

  function abortInvasion(reason = "manual") {
    if (!isRunning() && runtime.status !== "opening") {
      clearEventObjects();
      return false;
    }
    failInvasion(reason);
    return true;
  }

  function addParticle(x, y, vx, vy, life, color, size = 3) {
    runtime.particles.push({ x, y, vx, vy, life, maxLife: life, color, size, seed: runtime.seed++ });
    const overflow = runtime.particles.length - particleCap();
    if (overflow > 0) runtime.particles.splice(0, overflow);
  }

  function burstParticles(x, y, count, color, speed) {
    const adjusted = mobileMode() ? Math.ceil(count * 0.58) : count;
    for (let index = 0; index < adjusted; index += 1) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = speed * (0.28 + Math.random() * 0.72);
      addParticle(x, y, Math.cos(angle) * velocity, Math.sin(angle) * velocity - 24, 0.35 + Math.random() * 0.7, index % 3 === 0 ? "#ff4168" : color, 2 + Math.random() * 3);
    }
  }

  function updateParticles(delta) {
    for (let index = runtime.particles.length - 1; index >= 0; index -= 1) {
      const particle = runtime.particles[index];
      particle.life -= delta;
      if (particle.life <= 0) {
        runtime.particles.splice(index, 1);
        continue;
      }
      particle.x += particle.vx * delta;
      particle.y += particle.vy * delta;
      particle.vx *= 0.985;
      particle.vy = particle.vy * 0.985 - 4 * delta;
    }
  }

  function updateRifts(delta) {
    for (let index = runtime.rifts.length - 1; index >= 0; index -= 1) {
      const rift = runtime.rifts[index];
      rift.phase += delta * 2.2;
      rift.pulse = Math.max(0, rift.pulse - delta * 1.8);
      rift.opening = Math.min(1, rift.opening + delta * 2.3);
      if (rift.closing) {
        rift.opening = Math.max(0, rift.opening - delta * 0.72);
        if (rift.opening <= 0) {
          runtime.rifts.splice(index, 1);
          continue;
        }
      }
      if (!mobileMode() && Math.random() < delta * 5.5) {
        addParticle(rift.x + (Math.random() - 0.5) * 28, rift.y + 9, (Math.random() - 0.5) * 15, -30 - Math.random() * 34, 0.55 + Math.random() * 0.45, Math.random() > 0.34 ? "#c55bff" : "#ff4168", 2 + Math.random() * 2);
      }
    }
  }

  function protectedVillageObjects() {
    return villageObjects.filter((obj) => obj && (obj.type === "npc" || ["house", "playerHouse", "shop", "blacksmithShop"].includes(obj.type)));
  }

  function calculateThreatDrain() {
    const protectedObjects = protectedVillageObjects();
    let drain = 0;
    for (const obj of activeInvasionEnemies()) {
      drain += obj.invasionBoss ? 0.28 : obj.invasionEnemyType === "medium" ? 0.18 : 0.14;
      const centerX = obj.x + obj.width / 2;
      const centerY = obj.y + obj.height / 2;
      let nearProtected = false;
      for (const target of protectedObjects) {
        if (pointRectDistance(centerX, centerY, target) < 72) {
          nearProtected = true;
          break;
        }
      }
      if (nearProtected) drain += obj.invasionBoss ? 0.55 : 0.28;
    }
    return drain;
  }

  function rescueStuckEnemy(obj) {
    const rift = runtime.rifts[obj.invasionSeed % Math.max(1, runtime.rifts.length)];
    if (!rift) {
      defeatEnemy(obj);
      return;
    }
    const position = findSpawnNearRift(rift, obj.invasionEnemyType);
    obj.x = position.x;
    obj.y = position.y;
    obj.spawnX = position.x;
    obj.spawnY = position.y;
    obj.knockbackX = 0;
    obj.knockbackY = 0;
    obj.invasionLastMovedAt = runtime.elapsed;
    obj.invasionLastX = obj.x;
    obj.invasionLastY = obj.y;
    obj.invasionRescues = Number(obj.invasionRescues || 0) + 1;
    if (obj.invasionRescues > 3 || runtime.elapsed - obj.invasionBornAt > 88) defeatEnemy(obj);
  }

  function updateEnemyWatchdog() {
    for (const obj of activeInvasionEnemies()) {
      if (!Number.isFinite(obj.x) || !Number.isFinite(obj.y) || !Number.isFinite(obj.hp)) {
        rescueStuckEnemy(obj);
        continue;
      }
      const moved = Math.hypot(obj.x - Number(obj.invasionLastX || obj.x), obj.y - Number(obj.invasionLastY || obj.y));
      if (moved > 3) {
        obj.invasionLastX = obj.x;
        obj.invasionLastY = obj.y;
        obj.invasionLastMovedAt = runtime.elapsed;
      }
      const distanceToPlayer = Math.hypot((obj.x + obj.width / 2) - (player.x + player.width / 2), (obj.y + obj.height / 2) - (player.y + player.height / 2));
      if (runtime.elapsed - Number(obj.invasionLastMovedAt || runtime.elapsed) > 5.5 && distanceToPlayer > 95) rescueStuckEnemy(obj);
      if (runtime.elapsed - Number(obj.invasionBornAt || runtime.elapsed) > 92) defeatEnemy(obj);
    }
  }

  function pruneDeadInvasionEnemies() {
    for (let index = villageObjects.length - 1; index >= 0; index -= 1) {
      const obj = villageObjects[index];
      if (!obj?.isVillageInvasionEnemy || obj.alive) continue;
      if (runtime.elapsed - Number(obj.invasionDeathAt || runtime.elapsed) >= 0.7) villageObjects.splice(index, 1);
    }
  }

  function updateWave(delta) {
    if (runtime.status === "wave") {
      runtime.spawnTimer -= delta;
      if (runtime.queue.length && runtime.spawnTimer <= 0 && activeInvasionEnemies().length < liveEnemyCap()) {
        const nextType = runtime.queue.shift();
        if (!spawnInvasionEnemy(nextType)) runtime.queue.unshift(nextType);
        runtime.spawnTimer = mobileMode() ? 0.62 : 0.44;
      }

      if (!runtime.queue.length && activeInvasionEnemies().length === 0) {
        runtime.status = "intermission";
        runtime.intermissionTimer = runtime.waveIndex + 1 >= TOTAL_WAVES ? 1.5 : 2.4;
      }
    } else if (runtime.status === "intermission") {
      runtime.intermissionTimer -= delta;
      if (runtime.intermissionTimer <= 0) {
        if (runtime.waveIndex + 1 >= TOTAL_WAVES) finishVictory();
        else beginWave(runtime.waveIndex + 1);
      }
    }
  }

  function updateRandomTrigger(delta) {
    if (runtime.status !== "idle" || !gameStarted || gameOver || currentScene !== "village") return;
    if (pauseOpen || inventoryOpen || shopOpen || dialogOpen) return;
    const state = ensurePersistentState();
    if (safeNow() < state.nextEligibleAt) return;
    runtime.randomTimer += delta;
    if (runtime.randomTimer < runtime.nextRandomCheck) return;
    runtime.randomTimer = 0;
    runtime.nextRandomCheck = RANDOM_CHECK_SECONDS;
    if (Math.random() < RANDOM_CHANCE) startInvasion("random");
  }

  function updateInvasion(deltaValue) {
    const delta = safeDelta(deltaValue);
    updateParticles(delta);
    updateRifts(delta);

    if (runtime.hudHideTimer > 0) {
      runtime.hudHideTimer = Math.max(0, runtime.hudHideTimer - delta);
      if (runtime.hudHideTimer <= 0) hideHud();
    }

    if (runtime.status === "victory" || runtime.status === "failure") {
      runtime.endingTimer = Math.max(0, runtime.endingTimer - delta);
      if (runtime.endingTimer <= 0) {
        clearEventObjects();
        runtime.status = "idle";
        runtime.waveIndex = -1;
        runtime.elapsed = 0;
      }
      return;
    }

    if (runtime.status === "opening") {
      if (!gameStarted || gameOver || currentScene !== "village") failInvasion(gameOver ? "death" : "leave");
      return;
    }

    if (!isRunning()) {
      updateRandomTrigger(delta);
      return;
    }

    if (!gameStarted || gameOver) {
      failInvasion("death");
      return;
    }
    if (currentScene !== "village") {
      failInvasion("leave");
      return;
    }
    if (pauseOpen || inventoryOpen || shopOpen || dialogOpen) {
      updateHudValues();
      return;
    }

    runtime.elapsed += delta;
    runtime.visualTimer += delta;
    runtime.pruneTimer += delta;
    runtime.defenseScanTimer -= delta;

    if (runtime.defenseScanTimer <= 0) {
      runtime.cachedThreatDrain = calculateThreatDrain();
      runtime.defenseScanTimer = mobileMode() ? 0.65 : 0.42;
      updateEnemyWatchdog();
    }
    runtime.defense = Math.max(0, runtime.defense - runtime.cachedThreatDrain * delta);

    if (runtime.pruneTimer >= 0.7) {
      runtime.pruneTimer = 0;
      pruneDeadInvasionEnemies();
    }

    updateWave(delta);
    updateHudValues();
    if (runtime.defense <= 0) failInvasion("defense");
    else if (runtime.elapsed >= EVENT_TIMEOUT_SECONDS) failInvasion("timeout");
  }

  function drawRift(rift) {
    const time = performance.now() / 1000;
    const open = Math.max(0, Math.min(1, rift.opening));
    const pulse = 1 + Math.sin(time * 4.2 + rift.phase) * 0.08 + rift.pulse * 0.16;
    const radius = 32 * open * pulse;
    if (radius <= 0.5) return;

    ctx.save();
    ctx.translate(Math.round(rift.x), Math.round(rift.y));
    ctx.globalCompositeOperation = "source-over";

    const groundGlow = ctx.createRadialGradient(0, 6, 2, 0, 6, radius * 1.75);
    groundGlow.addColorStop(0, "rgba(255,55,105,.42)");
    groundGlow.addColorStop(.42, "rgba(158,48,255,.28)");
    groundGlow.addColorStop(1, "rgba(28,0,46,0)");
    ctx.fillStyle = groundGlow;
    ctx.beginPath();
    ctx.ellipse(0, 8, radius * 1.65, radius * .72, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.lineCap = "square";
    for (let index = 0; index < 9; index += 1) {
      const angle = (index / 9) * Math.PI * 2 + rift.seed * 0.37;
      const inner = radius * .34;
      const outer = radius * (1.15 + (index % 3) * .14);
      const bend = Math.sin(rift.seed + index * 1.7) * 7;
      ctx.strokeStyle = index % 3 === 0 ? "rgba(255,61,101,.88)" : "rgba(177,75,255,.82)";
      ctx.lineWidth = index % 2 ? 2 : 3;
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * inner, 7 + Math.sin(angle) * inner * .42);
      ctx.lineTo(Math.cos(angle) * (inner + outer) * .52 + bend, 7 + Math.sin(angle) * outer * .31);
      ctx.lineTo(Math.cos(angle) * outer, 7 + Math.sin(angle) * outer * .50);
      ctx.stroke();
    }

    ctx.shadowColor = "#b84dff";
    ctx.shadowBlur = mobileMode() ? 8 : 15;
    ctx.fillStyle = "rgba(15,0,27,.96)";
    ctx.beginPath();
    ctx.ellipse(0, -4, radius * .70, radius * 1.30, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#b64dff";
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.strokeStyle = "rgba(255,63,111,.92)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(Math.sin(time * 3 + rift.phase) * 2, -4, radius * .48, radius * 1.12, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.shadowBlur = 0;
    for (let index = 0; index < (mobileMode() ? 5 : 9); index += 1) {
      const phase = time * (22 + index * 2) + index * 17 + rift.seed * 11;
      const px = Math.sin(index * 2.4 + rift.phase) * radius * .56;
      const py = 12 - (phase % Math.max(22, radius * 2.7));
      ctx.fillStyle = index % 3 === 0 ? "#ff557c" : index % 2 ? "#d783ff" : "#8c36ff";
      const size = 2 + (index % 3);
      ctx.fillRect(Math.round(px), Math.round(py), size, size);
    }
    ctx.restore();
  }

  function drawInvasionEnemy(obj) {
    const time = performance.now() / 1000;
    const x = Math.round(obj.x);
    const y = Math.round(obj.y);
    const w = obj.width;
    const h = obj.height;
    const bob = Math.sin(time * (obj.invasionEnemyType === "small" ? 8 : 4.5) + obj.invasionSeed) * 2;
    const hpRatio = Math.max(0, obj.hp / Math.max(1, obj.maxHp));

    ctx.save();
    ctx.translate(x, y + bob);
    ctx.globalAlpha = obj.invulnerableTimer > 0 && Math.floor(time * 24) % 2 ? .52 : 1;

    const aura = ctx.createRadialGradient(w / 2, h * .62, 2, w / 2, h * .62, w * .85);
    aura.addColorStop(0, obj.invasionBoss ? "rgba(255,43,91,.36)" : "rgba(173,67,255,.30)");
    aura.addColorStop(1, "rgba(47,0,74,0)");
    ctx.fillStyle = aura;
    ctx.fillRect(-w * .35, 0, w * 1.7, h * 1.25);

    ctx.fillStyle = "rgba(7,0,14,.48)";
    ctx.beginPath();
    ctx.ellipse(w / 2, h - 1, w * .48, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    if (obj.invasionEnemyType === "small") {
      ctx.fillStyle = "#160b25";
      ctx.fillRect(4, 7, w - 8, h - 9);
      ctx.fillRect(2, 12, w - 4, h - 15);
      ctx.fillRect(5, h - 5, 4, 5);
      ctx.fillRect(w - 9, h - 6, 4, 6);
      ctx.fillStyle = "#3c185e";
      ctx.fillRect(5, 9, w - 10, 5);
      ctx.fillStyle = "#ff4f8a";
      ctx.fillRect(6, 13, 4, 3);
      ctx.fillRect(w - 10, 13, 4, 3);
      ctx.fillStyle = "#f2b7ff";
      ctx.fillRect(7, 13, 2, 1);
      ctx.fillRect(w - 9, 13, 2, 1);
    } else if (obj.invasionEnemyType === "medium") {
      ctx.fillStyle = "#140920";
      ctx.fillRect(5, 10, w - 10, h - 12);
      ctx.fillRect(2, 17, w - 4, h - 22);
      ctx.fillStyle = "#512270";
      ctx.fillRect(7, 8, w - 14, 8);
      ctx.fillRect(4, 18, w - 8, 7);
      ctx.fillStyle = "#9c41df";
      ctx.fillRect(1, 9, 7, 5);
      ctx.fillRect(w - 8, 9, 7, 5);
      ctx.fillStyle = "#ff547f";
      ctx.fillRect(8, 15, 4, 3);
      ctx.fillRect(w - 12, 15, 4, 3);
      ctx.fillStyle = "#241030";
      ctx.fillRect(6, h - 8, 7, 8);
      ctx.fillRect(w - 13, h - 8, 7, 8);
    } else {
      ctx.fillStyle = "#0d0715";
      ctx.fillRect(7, 8, w - 14, h - 8);
      ctx.fillRect(3, 17, w - 6, h - 20);
      ctx.fillStyle = "#50163e";
      ctx.fillRect(8, 11, w - 16, 9);
      ctx.fillRect(5, 24, w - 10, 7);
      ctx.fillStyle = "#a92969";
      ctx.fillRect(0, 6, 10, 5);
      ctx.fillRect(w - 10, 6, 10, 5);
      ctx.fillRect(3, 3, 5, 5);
      ctx.fillRect(w - 8, 3, 5, 5);
      ctx.fillStyle = "#ff355d";
      ctx.fillRect(10, 16, 5, 3);
      ctx.fillRect(w - 15, 16, 5, 3);
      ctx.fillStyle = "#d866ff";
      ctx.fillRect(w / 2 - 3, 24, 6, 10);
      ctx.fillStyle = "#24102f";
      ctx.fillRect(7, h - 8, 8, 8);
      ctx.fillRect(w - 15, h - 8, 8, 8);
    }

    if (obj.invasionBoss || hpRatio < 1) {
      const barW = Math.max(24, w + (obj.invasionBoss ? 12 : 0));
      const barX = w / 2 - barW / 2;
      ctx.fillStyle = "#100815";
      ctx.fillRect(barX - 1, -7, barW + 2, 5);
      ctx.fillStyle = obj.invasionBoss ? "#ff315d" : "#a34dff";
      ctx.fillRect(barX, -6, Math.round(barW * hpRatio), 3);
    }
    ctx.restore();
  }

  function drawParticles() {
    for (const particle of runtime.particles) {
      const alpha = Math.max(0, particle.life / Math.max(.001, particle.maxLife));
      ctx.globalAlpha = alpha;
      ctx.fillStyle = particle.color;
      const size = Math.max(1, Math.round(particle.size * (.65 + alpha * .35)));
      ctx.fillRect(Math.round(particle.x), Math.round(particle.y), size, size);
    }
    ctx.globalAlpha = 1;
  }

  function drawWorldEffects() {
    if (currentScene !== "village" || (!runtime.rifts.length && !runtime.particles.length)) return;
    ctx.save();
    try { applyGameCameraTransform(ctx); } catch (error) { ctx.translate(-camera.x, -camera.y); }
    for (const rift of runtime.rifts) drawRift(rift);
    drawParticles();
    ctx.restore();
  }

  function isDimensionalPowerKey(key) {
    const normalized = normalizeText(key).replace(/[^a-z0-9]+/g, "");
    if (SHADOW_POWER_KEYS.has(key)) return true;
    return normalized.includes("shadow") || normalized.includes("sombra") || normalized.includes("dark") || normalized.includes("dimensional") || normalized.includes("rasgo") || normalized.includes("void");
  }

  const getCustomItemDefBeforeInvasion = typeof window.getCustomItemDef === "function" ? window.getCustomItemDef : null;
  window.getCustomItemDef = function getCustomItemDefVillageInvasion(name) {
    if (normalizeText(name) === normalizeText(REWARD_NAME)) {
      return {
        name: REWARD_NAME,
        icon: "◈",
        typeLabel: "Relíquia SUPER RARA",
        category: "raros",
        rarity: "lendario",
        description: "Núcleo estabilizado de uma invasão dimensional. Pulsa em roxo e vermelho quando criaturas da Fenda estão próximas.",
        effect: "+12% de dano contra criaturas dimensionais; -8% de cooldown em poderes dimensionais e sombrios; ao entrar em vida baixa, cria um escudo de 2,6s (90s de recarga). Efeito passivo e não acumulável."
      };
    }
    return getCustomItemDefBeforeInvasion ? getCustomItemDefBeforeInvasion(name) : null;
  };
  try { getCustomItemDef = window.getCustomItemDef; } catch (error) {}

  const useCustomInventoryItemBeforeInvasion = typeof window.useCustomInventoryItem === "function" ? window.useCustomInventoryItem : null;
  window.useCustomInventoryItem = function useCustomInventoryItemVillageInvasion(name) {
    if (normalizeText(name) === normalizeText(REWARD_NAME)) {
      try { showHudToast?.("Relíquia passiva: o Núcleo já protege o portador.", 3); playSound?.("magic"); } catch (error) {}
      return true;
    }
    return useCustomInventoryItemBeforeInvasion ? useCustomInventoryItemBeforeInvasion(name) : false;
  };
  try { useCustomInventoryItem = window.useCustomInventoryItem; } catch (error) {}

  const getInventoryItemsBeforeInvasion = typeof getInventoryItems === "function" ? getInventoryItems : null;
  if (getInventoryItemsBeforeInvasion) {
    getInventoryItems = function getInventoryItemsVillageInvasion() {
      const items = getInventoryItemsBeforeInvasion.apply(this, arguments) || [];
      for (const item of items) {
        if (normalizeText(item?.name) !== normalizeText(REWARD_NAME)) continue;
        item.name = REWARD_NAME;
        item.icon = "◈";
        item.typeLabel = "Relíquia SUPER RARA";
        item.category = "raros";
        item.rarity = "lendario";
        item.description = "Núcleo estabilizado de uma invasão dimensional. Pulsa em roxo e vermelho quando criaturas da Fenda estão próximas.";
        item.effect = "+12% dano dimensional • -8% cooldown sombrio/dimensional • escudo de emergência por 2,6s a cada 90s.";
        item.action = "";
        item.customUsable = false;
        item.locked = true;
      }
      return items;
    };
  }

  const defeatEnemyBeforeInvasion = typeof defeatEnemy === "function" ? defeatEnemy : null;
  if (defeatEnemyBeforeInvasion) {
    defeatEnemy = function defeatEnemyVillageInvasion(obj) {
      if (!obj?.isVillageInvasionEnemy) return defeatEnemyBeforeInvasion.apply(this, arguments);
      if (!obj.alive) return false;
      obj.alive = false;
      obj.hp = 0;
      obj.invasionDeathAt = runtime.elapsed;
      runtime.defeated += 1;
      burstParticles(obj.x + obj.width / 2, obj.y + obj.height / 2, obj.invasionBoss ? 26 : 11, obj.invasionBoss ? "#ff355d" : "#b75cff", obj.invasionBoss ? 160 : 95);
      try {
        spawnFloatingText?.(obj.invasionBoss ? "MINI-CHEFE DERROTADO" : "Fenda dissipada", obj.x, obj.y - 12, obj.invasionBoss ? "#ff718c" : "#d7a0ff");
        playSound?.(obj.invasionBoss ? "bossDown" : "enemyDown");
        if (obj.invasionBoss) vibrate?.([35, 45, 70]);
      } catch (error) {}
      return true;
    };
  }

  const damageEnemyBeforeInvasion = typeof damageEnemy === "function" ? damageEnemy : null;
  if (damageEnemyBeforeInvasion) {
    damageEnemy = function damageEnemyVillageInvasion(obj, amount, sourceX, sourceY, knockbackPower, damageType) {
      let adjusted = Number(amount || 0);
      if (hasRiftCore() && (obj?.dimensionalCreature || obj?.isVillageInvasionEnemy)) adjusted *= CORE_DIMENSIONAL_DAMAGE_BONUS;
      return damageEnemyBeforeInvasion.call(this, obj, adjusted, sourceX, sourceY, knockbackPower, damageType);
    };
  }

  const takeDamageBeforeInvasion = typeof takeDamage === "function" ? takeDamage : null;
  if (takeDamageBeforeInvasion) {
    takeDamage = function takeDamageVillageInvasion(amount, sourceX, sourceY) {
      const state = ensurePersistentState();
      const incoming = Math.max(0, Number(amount || 0) - Number(player.defense || 0));
      const projected = Number(player.health || 0) - incoming;
      const lowThreshold = Math.max(1, Number(player.maxHealth || 1) * .35);
      const canTrigger = hasRiftCore() && !gameOver && playerInvulnerableTimer <= 0 && incoming > 0 && projected <= lowThreshold && safeNow() >= state.coreShieldReadyAt;
      if (canTrigger) {
        state.coreShieldReadyAt = safeNow() + CORE_SHIELD_COOLDOWN_MS;
        activePowerUps.shield = Math.max(Number(activePowerUps.shield || 0), CORE_SHIELD_DURATION);
        burstParticles(player.x + player.width / 2, player.y + player.height / 2, 18, "#ba66ff", 105);
        try { showHudToast?.("Núcleo da Fenda: escudo dimensional ativado!", 3); playSound?.("magic"); } catch (error) {}
      }
      const result = takeDamageBeforeInvasion.apply(this, arguments);
      if (gameOver && (isRunning() || runtime.status === "opening")) failInvasion("death");
      return result;
    };
  }

  const useEquippedPowerBeforeInvasion = typeof useEquippedPower === "function" ? useEquippedPower : null;
  if (useEquippedPowerBeforeInvasion) {
    useEquippedPower = function useEquippedPowerVillageInvasion() {
      const key = equippedPower;
      const before = Number(player.spellCooldowns?.[key] || 0);
      const result = useEquippedPowerBeforeInvasion.apply(this, arguments);
      const after = Number(player.spellCooldowns?.[key] || 0);
      if (hasRiftCore() && isDimensionalPowerKey(key) && after > before && after > 0) {
        player.spellCooldowns[key] = after * CORE_COOLDOWN_MULTIPLIER;
      }
      return result;
    };
  }

  const fireEnemyProjectileBeforeInvasion = typeof fireEnemyProjectile === "function" ? fireEnemyProjectile : null;
  if (fireEnemyProjectileBeforeInvasion) {
    fireEnemyProjectile = function fireEnemyProjectileVillageInvasion(obj) {
      const startIndex = enemyProjectiles.length;
      const result = fireEnemyProjectileBeforeInvasion.apply(this, arguments);
      if (obj?.isVillageInvasionEnemy) {
        for (let index = startIndex; index < enemyProjectiles.length; index += 1) enemyProjectiles[index].isVillageInvasionProjectile = true;
      }
      return result;
    };
  }

  const drawEnemyBeforeInvasion = typeof drawEnemy === "function" ? drawEnemy : null;
  if (drawEnemyBeforeInvasion) {
    drawEnemy = function drawEnemyVillageInvasion(obj) {
      if (obj?.isVillageInvasionEnemy) return drawInvasionEnemy(obj);
      return drawEnemyBeforeInvasion.apply(this, arguments);
    };
  }

  const updateBeforeInvasion = typeof update === "function" ? update : null;
  if (updateBeforeInvasion) {
    update = function updateVillageInvasion(delta) {
      const result = updateBeforeInvasion.apply(this, arguments);
      updateInvasion(delta);
      return result;
    };
  }

  const drawBeforeInvasion = typeof draw === "function" ? draw : null;
  if (drawBeforeInvasion) {
    draw = function drawVillageInvasion() {
      const result = drawBeforeInvasion.apply(this, arguments);
      drawWorldEffects();
      return result;
    };
  }

  const setActiveSceneBeforeInvasion = typeof setActiveScene === "function" ? setActiveScene : null;
  if (setActiveSceneBeforeInvasion) {
    setActiveScene = function setActiveSceneVillageInvasion(scene) {
      if ((isRunning() || runtime.status === "opening") && scene !== "village") failInvasion("leave");
      return setActiveSceneBeforeInvasion.apply(this, arguments);
    };
  }

  const saveGameBeforeInvasion = typeof saveGame === "function" ? saveGame : null;
  if (saveGameBeforeInvasion) {
    saveGame = function saveGameVillageInvasion() {
      ensurePersistentState();
      ensureRewardInventoryState();
      if (hasRiftCore()) inventory.customItems[REWARD_NAME] = 1;
      return saveGameBeforeInvasion.apply(this, arguments);
    };
  }

  const loadGameBeforeInvasion = typeof loadGame === "function" ? loadGame : null;
  if (loadGameBeforeInvasion) {
    loadGame = function loadGameVillageInvasion() {
      if (isRunning() || runtime.status === "opening") failInvasion("load");
      clearEventObjects();
      const result = loadGameBeforeInvasion.apply(this, arguments);
      ensurePersistentState();
      ensureRewardInventoryState();
      if (ensurePersistentState().rewardGranted && hasRiftCore()) inventory.customItems[REWARD_NAME] = 1;
      runtime.status = "idle";
      runtime.waveIndex = -1;
      runtime.rifts.length = 0;
      runtime.particles.length = 0;
      hideHud();
      return result;
    };
  }

  const resetProgressBeforeInvasion = typeof resetProgressForNewGame === "function" ? resetProgressForNewGame : null;
  if (resetProgressBeforeInvasion) {
    resetProgressForNewGame = function resetProgressForNewGameVillageInvasion() {
      if (isRunning() || runtime.status === "opening") failInvasion("reset");
      clearEventObjects();
      const result = resetProgressBeforeInvasion.apply(this, arguments);
      questBook.villageInvasion = {
        version: 1,
        completedEver: false,
        completions: 0,
        rewardGranted: false,
        lastResult: "none",
        lastSource: "",
        lastStartedAt: 0,
        lastCompletedAt: 0,
        nextEligibleAt: 0,
        coreShieldReadyAt: 0,
        status: "idle"
      };
      ensureRewardInventoryState();
      delete inventory.customItems[REWARD_NAME];
      resetRuntimeToIdle();
      runtime.nextRandomCheck = RANDOM_FIRST_CHECK_SECONDS;
      runtime.randomTimer = 0;
      return result;
    };
  }

  function publicSnapshot() {
    const state = ensurePersistentState();
    return {
      version: VERSION,
      status: runtime.status,
      source: runtime.source,
      wave: runtime.waveIndex + 1,
      totalWaves: TOTAL_WAVES,
      defense: Math.round(runtime.defense * 10) / 10,
      aliveEnemies: activeInvasionEnemies().length,
      queuedEnemies: runtime.queue.length,
      liveEnemyCap: liveEnemyCap(),
      rifts: runtime.rifts.map((rift) => ({ x: Math.round(rift.x), y: Math.round(rift.y), closing: rift.closing })),
      completedEver: state.completedEver,
      completions: state.completions,
      rewardGranted: state.rewardGranted,
      hasReward: hasRiftCore(),
      lastResult: state.lastResult,
      nextEligibleAt: state.nextEligibleAt
    };
  }

  ensurePersistentState();
  ensureRewardInventoryState();
  installHud();

  window.ETERNAL_RIFT_INVASION = Object.freeze({
    version: VERSION,
    rewardName: REWARD_NAME,
    start: (source = "manual") => startInvasion(source),
    trigger: (source = "mission") => startInvasion(source),
    abort: (reason = "manual") => abortInvasion(reason),
    getState: publicSnapshot,
    hasReward: hasRiftCore,
    tick: (delta = 1 / 60) => updateInvasion(delta),
    debugDefeatActive: () => {
      if (!debugEnabled && !new URLSearchParams(location.search).has("invasionTest")) return false;
      for (const obj of activeInvasionEnemies()) defeatEnemy(obj);
      return true;
    }
  });

  try { console.log("Eternal Rift sistema carregado:", VERSION); } catch (error) {}
})();
