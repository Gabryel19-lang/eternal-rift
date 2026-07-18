/* ================================================================
   ETERNAL RIFT - NOVA VILA PRINCIPAL + FLORESTA INICIAL
   Mapa jogavel em Canvas/tiles. Nenhuma imagem de referencia e usada.
   Escopo deliberado: somente os 82x60 tiles iniciais do mundo.
   ================================================================ */
(function eternalRiftVillageForestRefactor20260717() {
  "use strict";

  const PATCH_ID = "village-forest-organic-refactor-pc-mobile-20260717";
  if (typeof window === "undefined" || window.ETERNAL_RIFT_VILLAGE_FOREST_REFACTOR === PATCH_ID) return;
  if (typeof worldMap === "undefined" || !Array.isArray(worldMap) || typeof villageObjects === "undefined") return;
  window.ETERNAL_RIFT_VILLAGE_FOREST_REFACTOR = PATCH_ID;

  const REGION_COLS = 82;
  const REGION_ROWS = 60;
  const CHUNK_TILES = 12;
  const BRIDGE = { x1: 5, y1: 31, x2: 14, y2: 33 };
  const PLAZA = { cx: 38, cy: 26, rx: 12, ry: 9 };
  const SAFE_SPAWN = { x: 37 * TILE + 5, y: 31 * TILE + 3 };
  const oldSaveKey = typeof getSaveObjectKey === "function" ? getSaveObjectKey : null;
  const terrainChunks = new Map();

  function inInitialRegionTile(tx, ty) {
    return tx >= 0 && ty >= 0 && tx < REGION_COLS && ty < REGION_ROWS;
  }

  function objectInInitialRegion(obj) {
    if (!obj || !Number.isFinite(obj.x) || !Number.isFinite(obj.y)) return false;
    return obj.x < REGION_COLS * TILE && obj.y < REGION_ROWS * TILE && obj.x + (obj.width || 1) > 0 && obj.y + (obj.height || 1) > 0;
  }

  function tileAt(tx, ty) {
    if (!inInitialRegionTile(tx, ty)) return worldMap?.[ty]?.[tx] || "F";
    return worldMap[ty]?.[tx] || "F";
  }

  function setTile(tx, ty, value) {
    if (!inInitialRegionTile(tx, ty) || !worldMap[ty]) return;
    worldMap[ty][tx] = value;
  }

  function hash01(x, y, seed = 0) {
    let n = Math.imul((x + 37 + seed * 17) | 0, 374761393) ^ Math.imul((y + 91 - seed * 13) | 0, 668265263);
    n = Math.imul(n ^ (n >>> 13), 1274126177);
    return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
  }

  function fillInitial(value) {
    for (let y = 0; y < REGION_ROWS; y += 1) {
      for (let x = 0; x < REGION_COLS; x += 1) setTile(x, y, value);
    }
  }

  function paintOrganicBlob(cx, cy, rx, ry, value, seed = 1, roughness = 0.14) {
    for (let y = Math.floor(cy - ry - 2); y <= Math.ceil(cy + ry + 2); y += 1) {
      for (let x = Math.floor(cx - rx - 2); x <= Math.ceil(cx + rx + 2); x += 1) {
        if (!inInitialRegionTile(x, y)) continue;
        const dx = (x - cx) / Math.max(1, rx);
        const dy = (y - cy) / Math.max(1, ry);
        const wobble = (hash01(x, y, seed) - 0.5) * roughness;
        if (dx * dx + dy * dy <= 1 + wobble) setTile(x, y, value);
      }
    }
  }

  function stampRoad(cx, cy, width, value, seed) {
    const radius = width / 2 + (hash01(cx, cy, seed) - 0.5) * 0.8;
    const reach = Math.ceil(radius + 1);
    for (let y = cy - reach; y <= cy + reach; y += 1) {
      for (let x = cx - reach; x <= cx + reach; x += 1) {
        const jitter = (hash01(x, y, seed + 7) - 0.5) * 0.3;
        if (Math.hypot(x - cx, y - cy) <= radius + jitter) setTile(x, y, value);
      }
    }
  }

  function carveRoad(points, width = 3, value = "D", seed = 1) {
    for (let p = 0; p < points.length - 1; p += 1) {
      const [x1, y1] = points[p];
      const [x2, y2] = points[p + 1];
      const steps = Math.max(1, Math.ceil(Math.hypot(x2 - x1, y2 - y1) * 2));
      for (let step = 0; step <= steps; step += 1) {
        const t = step / steps;
        const wobble = Math.sin(t * Math.PI * 2 + seed + p) * 0.32;
        const x = Math.round(x1 + (x2 - x1) * t + wobble);
        const y = Math.round(y1 + (y2 - y1) * t + wobble * 0.45);
        stampRoad(x, y, width, value, seed + p * 11 + step);
      }
    }
  }

  function rebuildTerrain() {
    fillInitial("F");

    // Clareira principal e áreas de exploração/combat.
    paintOrganicBlob(39, 27, 25, 21, "G", 11, 0.20);
    paintOrganicBlob(60, 28, 13, 18, "G", 13, 0.20);
    paintOrganicBlob(69, 43, 10, 9, "G", 17, 0.22);
    paintOrganicBlob(70, 11, 10, 8, "G", 19, 0.20);
    paintOrganicBlob(19, 52, 11, 7, "G", 23, 0.22);
    paintOrganicBlob(4, 46, 5, 13, "G", 29, 0.20);
    paintOrganicBlob(4, 12, 5, 8, "G", 31, 0.20);

    // Praça central de pedra com contorno orgânico.
    paintOrganicBlob(PLAZA.cx, PLAZA.cy, PLAZA.rx, PLAZA.ry, "P", 41, 0.10);
    paintOrganicBlob(PLAZA.cx, PLAZA.cy, 8, 6, "P", 43, 0.04);

    // Caminhos principais e ramificações entre casas, saídas e floresta.
    carveRoad([[38, 26], [36, 19], [39, 10], [39, 0]], 3.4, "D", 51);
    carveRoad([[38, 28], [39, 37], [35, 46], [33, 59]], 3.5, "D", 53);
    carveRoad([[42, 26], [51, 27], [63, 24], [81, 24]], 3.7, "D", 59);
    carveRoad([[34, 28], [26, 29], [18, 32], [10, 32], [0, 40]], 3.1, "D", 61);
    carveRoad([[31, 23], [26, 18], [22, 12]], 2.5, "D", 67);
    carveRoad([[44, 22], [51, 18], [58, 15]], 2.4, "D", 71);
    carveRoad([[45, 31], [51, 37], [60, 40], [69, 43]], 2.6, "D", 73);
    carveRoad([[34, 35], [29, 41], [20, 50], [8, 53]], 2.5, "D", 79);
    carveRoad([[62, 24], [67, 17], [70, 10]], 2.4, "D", 83);

    // Rio lateral sinuoso. As travessias só ficam abertas na ponte.
    for (let y = 0; y < REGION_ROWS; y += 1) {
      const center = 9 + Math.round(Math.sin(y * 0.23) * 1.5 + Math.sin(y * 0.071) * 0.8);
      const riverWidth = hash01(center, y, 91) > 0.68 ? 6 : 5;
      for (let x = center - Math.floor(riverWidth / 2); x <= center + Math.ceil(riverWidth / 2); x += 1) setTile(x, y, "W");
    }

    for (let y = BRIDGE.y1; y <= BRIDGE.y2; y += 1) {
      for (let x = BRIDGE.x1; x <= BRIDGE.x2; x += 1) setTile(x, y, "D");
    }

    // Conexões exatas com os biomas já existentes fora da área refeita.
    for (let y = 22; y <= 25; y += 1) for (let x = 78; x < REGION_COLS; x += 1) setTile(x, y, "D");
    for (let y = 57; y < REGION_ROWS; y += 1) for (let x = 31; x <= 35; x += 1) setTile(x, y, "D");
  }

  rebuildTerrain();

  function rememberOldSaveKey(obj) {
    if (!obj || obj.erVillageForestOldSaveKey || !oldSaveKey) return;
    const trackedType = ["enemy", "collectible", "crystal", "powerUp"].includes(obj.type);
    const hasCollectionState = Object.prototype.hasOwnProperty.call(obj, "collected");
    if (!trackedType && !hasCollectionState) return;
    try { obj.erVillageForestOldSaveKey = oldSaveKey(obj); } catch (error) {}
  }

  const removableOldScenery = new Set([
    "tree", "fence", "villageBarrier", "villageGate", "villageWard", "well", "bench",
    "flower", "rock", "sign", "outdoorDecor"
  ]);

  for (let index = villageObjects.length - 1; index >= 0; index -= 1) {
    const obj = villageObjects[index];
    if (objectInInitialRegion(obj) && removableOldScenery.has(obj.type)) villageObjects.splice(index, 1);
  }

  function moveObjectToTile(obj, tx, ty, offsetX = 4, offsetY = 4) {
    if (!obj) return;
    rememberOldSaveKey(obj);
    obj.x = tx * TILE + offsetX;
    obj.y = ty * TILE + offsetY;
    if (obj.type === "enemy" || Number.isFinite(obj.spawnX) || Number.isFinite(obj.spawnY)) {
      obj.spawnX = obj.x;
      obj.spawnY = obj.y;
      obj.moveTimer = 0;
    }
  }

  const buildingPlans = [
    { test: (obj) => obj.type === "playerHouse", x: 27, y: 38, w: 5, h: 4, roof: "blue" },
    { test: (obj) => obj.type === "shop", x: 48, y: 20, w: 5, h: 3, roof: "teal" },
    { test: (obj) => /Dona Mina/i.test(obj.title || ""), x: 20, y: 10, w: 4, h: 3, roof: "green" },
    { test: (obj) => /Prefeito/i.test(obj.title || ""), x: 35, y: 7, w: 4, h: 3, roof: "red" },
    { test: (obj) => /Pousada/i.test(obj.title || ""), x: 19, y: 23, w: 4, h: 3, roof: "blue" },
    { test: (obj) => /Armazem/i.test(obj.title || ""), x: 49, y: 32, w: 4, h: 3, roof: "amber" },
    { test: (obj) => /Cabana da Floresta/i.test(obj.title || ""), x: 2, y: 42, w: 4, h: 3, roof: "green" },
    { test: (obj) => /Pescador/i.test(obj.title || ""), x: 14, y: 16, w: 4, h: 3, roof: "teal" },
    { test: (obj) => /Padaria/i.test(obj.title || ""), x: 27, y: 14, w: 4, h: 3, roof: "red" },
    { test: (obj) => /Atelie/i.test(obj.title || ""), x: 49, y: 8, w: 4, h: 3, roof: "blue" },
    { test: (obj) => /Casa do Campo/i.test(obj.title || ""), x: 58, y: 34, w: 4, h: 3, roof: "green" },
    { test: (obj) => /Treinador/i.test(obj.title || ""), x: 68, y: 39, w: 4, h: 3, roof: "amber" },
    { test: (obj) => /Esquecida/i.test(obj.title || ""), x: 14, y: 51, w: 4, h: 3, roof: "brown" }
  ];
  const fallbackBuildingSlots = [[54, 6], [58, 29], [64, 17], [65, 32]];
  let fallbackBuildingIndex = 0;

  for (const obj of villageObjects) {
    if (!objectInInitialRegion(obj)) continue;
    if (!["house", "playerHouse", "shop"].includes(obj.type)) continue;
    const plan = buildingPlans.find((entry) => entry.test(obj)) || (() => {
      const slot = fallbackBuildingSlots[Math.min(fallbackBuildingIndex++, fallbackBuildingSlots.length - 1)];
      return { x: slot[0], y: slot[1], w: 4, h: 3, roof: "brown" };
    })();
    obj.x = plan.x * TILE;
    obj.y = plan.y * TILE;
    obj.width = plan.w * TILE;
    obj.height = plan.h * TILE;
    obj.solid = true;
    obj.erVillageRebuilt = true;
    obj.erRoofVariant = plan.roof;
  }

  const blacksmithShop = villageObjects.find((obj) => obj?.type === "blacksmithShop");
  if (blacksmithShop) {
    blacksmithShop.x = 55 * TILE;
    blacksmithShop.y = 17 * TILE;
    blacksmithShop.width = 5 * TILE;
    blacksmithShop.height = 4 * TILE;
    blacksmithShop.solid = true;
    blacksmithShop.erVillageRebuilt = true;
    blacksmithShop.erRoofVariant = "forge";
  }

  // Abre clareiras reais sob as construcoes e liga cada porta aos caminhos.
  // Isso evita casas sobre mata fechada e mantém os acessos orgânicos/jogáveis.
  const rebuiltBuildings = villageObjects.filter((obj) => obj?.erVillageRebuilt && objectInInitialRegion(obj));
  for (const building of rebuiltBuildings) {
    const left = Math.floor(building.x / TILE) - 1;
    const right = Math.ceil((building.x + building.width) / TILE);
    const top = Math.floor(building.y / TILE) - 1;
    const bottom = Math.ceil((building.y + building.height) / TILE) + 1;
    for (let ty = top; ty <= bottom; ty += 1) {
      for (let tx = left; tx <= right; tx += 1) {
        if (inInitialRegionTile(tx, ty) && tileAt(tx, ty) === "F") setTile(tx, ty, "G");
      }
    }
    const doorX = Math.floor((building.x + building.width / 2) / TILE);
    const doorY = Math.floor((building.y + building.height) / TILE);
    stampRoad(doorX, doorY, 1.8, "D", 151 + doorX + doorY);
  }

  const buildingConnections = [
    [[29, 42], [31, 38], [34, 35]], [[50, 23], [46, 24], [42, 26]],
    [[22, 13], [23, 16], [26, 18]], [[37, 10], [38, 13], [36, 19]],
    [[21, 26], [25, 28], [29, 28]], [[51, 35], [48, 32], [45, 31]],
    [[4, 45], [2, 42], [0, 40]], [[16, 19], [18, 24], [18, 30]],
    [[29, 17], [31, 20], [31, 23]], [[51, 11], [55, 14], [58, 15]],
    [[60, 37], [60, 40]], [[70, 42], [69, 43]], [[16, 54], [13, 53], [8, 53]],
    [[57, 21], [55, 22], [52, 24]]
  ];
  buildingConnections.forEach((points, index) => carveRoad(points, 1.9, "D", 173 + index * 7));

  const npcPositions = {
    Nico: [35, 29], Ari: [41, 30], Mina: [23, 14], Vendedor: [50, 24], Beto: [31, 35],
    "Téo": [41, 13], Bran: [64, 24], Sora: [44, 23], Lia: [33, 30], Prefeito: [38, 11]
  };
  const npcFallbacks = [[29, 27], [44, 28], [32, 22], [46, 34], [26, 33], [53, 28]];
  let npcFallbackIndex = 0;
  for (const obj of villageObjects) {
    if (obj?.type !== "npc" || !objectInInitialRegion(obj)) continue;
    const pos = npcPositions[obj.name] || npcFallbacks[npcFallbackIndex++ % npcFallbacks.length];
    moveObjectToTile(obj, pos[0], pos[1], 5, 4);
  }

  const farmPositions = [[42, 12], [44, 12], [46, 12], [42, 14], [44, 14], [46, 14]];
  const farmPlots = villageObjects.filter((obj) => obj?.type === "farmPlot" && objectInInitialRegion(obj));
  farmPlots.forEach((obj, index) => moveObjectToTile(obj, farmPositions[index % farmPositions.length][0], farmPositions[index % farmPositions.length][1], 3, 5));

  const portals = villageObjects.filter((obj) => obj?.type === "portal" && objectInInitialRegion(obj));
  [[60, 25], [74, 51]].forEach((pos, index) => {
    if (portals[index]) moveObjectToTile(portals[index], pos[0], pos[1], 0, -8);
  });
  const cave = villageObjects.find((obj) => obj?.type === "cave" && objectInInitialRegion(obj));
  if (cave) moveObjectToTile(cave, 2, 8, 0, 0);
  const secretStoneObj = villageObjects.find((obj) => obj?.type === "secretStone" && objectInInitialRegion(obj));
  if (secretStoneObj) moveObjectToTile(secretStoneObj, 2, 16, 4, 8);

  const collectibleSpots = [[25, 19], [31, 32], [46, 28], [18, 48], [61, 28], [67, 17], [22, 54], [72, 47], [15, 21], [55, 42], [30, 50], [69, 13]];
  const crystalSpots = [[18, 18], [55, 29], [30, 50], [66, 9]];
  let collectibleIndex = 0;
  let crystalIndex = 0;
  for (const obj of villageObjects) {
    if (!objectInInitialRegion(obj)) continue;
    if (obj.type === "collectible") {
      const pos = collectibleSpots[collectibleIndex++ % collectibleSpots.length];
      moveObjectToTile(obj, pos[0], pos[1], 6, 6);
    } else if (obj.type === "crystal") {
      const pos = crystalSpots[crystalIndex++ % crystalSpots.length];
      moveObjectToTile(obj, pos[0], pos[1], 6, 2);
    }
  }

  const enemySpots = [
    [17, 49], [21, 51], [15, 54], [23, 55], [27, 51], [62, 49], [66, 43], [70, 45],
    [74, 47], [67, 50], [72, 53], [77, 50], [65, 8], [70, 10], [75, 12], [68, 15],
    [76, 16], [59, 52], [64, 55], [3, 12], [2, 47], [24, 48], [57, 45], [78, 43]
  ];
  const bossSpots = [[70, 10], [70, 45], [19, 53], [75, 52], [62, 51], [68, 14], [26, 51]];
  let enemyIndex = 0;
  let bossIndex = 0;
  for (const obj of villageObjects) {
    if (obj?.type !== "enemy" || !objectInInitialRegion(obj) || obj.isVillageInvasionEnemy) continue;
    const pos = obj.boss ? bossSpots[bossIndex++ % bossSpots.length] : enemySpots[enemyIndex++ % enemySpots.length];
    moveObjectToTile(obj, pos[0], pos[1], 4, 4);
  }

  const rareChestObj = villageObjects.find((obj) => obj?.type === "rareChest" && objectInInitialRegion(obj));
  if (rareChestObj) moveObjectToTile(rareChestObj, 74, 49, 2, 8);

  if (typeof powerUps !== "undefined" && Array.isArray(powerUps)) {
    const powerSpots = [[24, 19], [29, 33], [55, 29], [18, 50], [68, 17], [65, 47], [31, 52]];
    let powerIndex = 0;
    for (const obj of powerUps) {
      if (!objectInInitialRegion(obj)) continue;
      rememberOldSaveKey(obj);
      const pos = powerSpots[powerIndex++ % powerSpots.length];
      obj.x = pos[0] * TILE + 4;
      obj.y = pos[1] * TILE + 4;
    }
  }

  function makeDecor(id, kind, tx, ty, width, height, solid = false, message = "", extra = {}) {
    return {
      type: "vfDecor",
      erVillageForestId: id,
      kind,
      x: tx * TILE + (extra.offsetX || 0),
      y: ty * TILE + (extra.offsetY || 0),
      width,
      height,
      solid,
      message,
      ...extra
    };
  }

  function makeTree(id, tx, ty, variant, scale = 1) {
    const size = Math.round(22 * scale);
    return {
      type: "vfTree",
      erVillageForestId: id,
      variant,
      scale,
      x: tx * TILE + Math.round((TILE - size) / 2),
      y: ty * TILE + TILE - size,
      width: size,
      height: size,
      solid: true
    };
  }

  function addUnique(obj) {
    if (!obj?.erVillageForestId || villageObjects.some((entry) => entry?.erVillageForestId === obj.erVillageForestId)) return;
    villageObjects.push(obj);
  }

  // Floresta densa otimizada: colisão apenas nos troncos e distribuição determinística.
  let treeCount = 0;
  for (let ty = 1; ty < REGION_ROWS - 1; ty += 3) {
    for (let tx = 1; tx < REGION_COLS - 1; tx += 3) {
      if (tileAt(tx, ty) !== "F" || hash01(tx, ty, 101) < 0.28) continue;
      const jitterX = hash01(tx, ty, 103) > 0.5 ? 1 : 0;
      const jitterY = hash01(tx, ty, 107) > 0.64 ? 1 : 0;
      const px = Math.min(REGION_COLS - 2, tx + jitterX);
      const py = Math.min(REGION_ROWS - 2, ty + jitterY);
      if (tileAt(px, py) !== "F") continue;
      const visualClearance = { x: px * TILE - 42, y: py * TILE - 82, width: 106, height: 116 };
      if (rebuiltBuildings.some((building) => rectsOverlap(visualClearance, {
        x: building.x - TILE,
        y: building.y - TILE,
        width: building.width + TILE * 2,
        height: building.height + TILE * 2
      }))) continue;
      const variant = hash01(px, py, 109) > 0.72 ? "pine" : hash01(px, py, 113) > 0.5 ? "oak" : "maple";
      const scale = hash01(px, py, 127) > 0.76 ? 1.16 : 1;
      addUnique(makeTree(`vf-tree-${treeCount++}`, px, py, variant, scale));
    }
  }

  const decor = [
    makeDecor("vf-bridge", "bridge", BRIDGE.x1, BRIDGE.y1, (BRIDGE.x2 - BRIDGE.x1 + 1) * TILE, (BRIDGE.y2 - BRIDGE.y1 + 1) * TILE, false),
    makeDecor("vf-fountain", "fountain", 37, 25, TILE * 2, TILE * 2, true, "Fonte da Praça: água cristalina corre entre pedras antigas."),

    makeDecor("vf-market-red", "marketStallRed", 30, 19, TILE * 3, TILE * 2, true, "Barraca de frutas e provisões da vila."),
    makeDecor("vf-market-blue", "marketStallBlue", 42, 18, TILE * 3, TILE * 2, true, "Barraca de tecidos, mapas e pequenos tesouros."),
    makeDecor("vf-market-white", "marketStallWhite", 43, 31, TILE * 3, TILE * 2, true, "Barraca de pães, ervas e ingredientes frescos."),

    makeDecor("vf-sign-north", "signpost", 38, 3, 22, 28, true, "Norte: trilha da floresta e antigas ruínas."),
    makeDecor("vf-sign-east", "signpost", 63, 23, 22, 28, true, "Leste: saída da vila e caminho para outros biomas."),
    makeDecor("vf-sign-south", "signpost", 34, 47, 22, 28, true, "Sul: floresta inicial, áreas de combate e pântano distante."),
    makeDecor("vf-sign-bridge", "signpost", 15, 32, 22, 28, true, "Ponte do Bosque: a única travessia segura sobre o rio."),
    makeDecor("vf-sign-plaza", "signpost", 34, 26, 22, 28, true, "Praça de Valedouro: coração da vila principal."),

    makeDecor("vf-lamp-1", "lampPost", 34, 24, 14, 38, true), makeDecor("vf-lamp-2", "lampPost", 42, 24, 14, 38, true),
    makeDecor("vf-lamp-3", "lampPost", 34, 32, 14, 38, true), makeDecor("vf-lamp-4", "lampPost", 43, 32, 14, 38, true),
    makeDecor("vf-lamp-5", "lampPost", 25, 29, 14, 38, true), makeDecor("vf-lamp-6", "lampPost", 51, 27, 14, 38, true),
    makeDecor("vf-lamp-7", "lampPost", 16, 31, 14, 38, true), makeDecor("vf-lamp-8", "lampPost", 61, 24, 14, 38, true),

    makeDecor("vf-crate-1", "crate", 47, 25, 26, 26, true), makeDecor("vf-crate-2", "crate", 52, 31, 26, 26, true),
    makeDecor("vf-crate-3", "crate", 31, 18, 26, 26, true), makeDecor("vf-barrel-1", "barrel", 48, 26, 22, 28, true),
    makeDecor("vf-barrel-2", "barrel", 54, 35, 22, 28, true), makeDecor("vf-barrel-3", "barrel", 58, 21, 22, 28, true),
    makeDecor("vf-log-1", "logPile", 17, 46, 62, 30, true), makeDecor("vf-log-2", "logPile", 65, 38, 62, 30, true),
    makeDecor("vf-log-3", "logPile", 1, 48, 62, 30, true), makeDecor("vf-stump-1", "stump", 24, 52, 26, 24, true),
    makeDecor("vf-stump-2", "stump", 73, 43, 26, 24, true), makeDecor("vf-rock-1", "rockCluster", 14, 49, 48, 28, true),
    makeDecor("vf-rock-2", "rockCluster", 65, 13, 48, 28, true), makeDecor("vf-rock-3", "rockCluster", 1, 18, 48, 28, true),
    makeDecor("vf-broken-fence", "brokenFence", 26, 54, TILE * 3, 18, true),

    makeDecor("vf-flowers-1", "flowerPatch", 24, 21, 40, 24), makeDecor("vf-flowers-2", "flowerPatch", 47, 29, 40, 24),
    makeDecor("vf-flowers-3", "flowerPatch", 32, 36, 40, 24), makeDecor("vf-flowers-4", "flowerPatch", 57, 31, 40, 24),
    makeDecor("vf-shrub-1", "shrub", 18, 16, 34, 26), makeDecor("vf-shrub-2", "shrub", 53, 14, 34, 26),
    makeDecor("vf-shrub-3", "shrub", 61, 36, 34, 26), makeDecor("vf-shrub-4", "shrub", 13, 39, 34, 26),

    makeDecor("vf-fence-mina-top", "fenceH", 19, 9, TILE * 6, 12, true),
    makeDecor("vf-fence-mina-left", "fenceV", 19, 10, 12, TILE * 5, true),
    makeDecor("vf-fence-mina-right", "fenceV", 25, 10, 12, TILE * 5, true),
    makeDecor("vf-fence-mina-front-a", "fenceH", 19, 15, TILE * 2, 12, true),
    makeDecor("vf-fence-mina-front-b", "fenceH", 23, 15, TILE * 2, 12, true),
    makeDecor("vf-fence-farm-top", "fenceH", 40, 11, TILE * 8, 12, true),
    makeDecor("vf-fence-farm-left", "fenceV", 40, 11, 12, TILE * 6, true),
    makeDecor("vf-fence-farm-right", "fenceV", 48, 11, 12, TILE * 6, true),
    makeDecor("vf-fence-farm-front-a", "fenceH", 40, 17, TILE * 3, 12, true),
    makeDecor("vf-fence-farm-front-b", "fenceH", 45, 17, TILE * 3, 12, true)
  ];
  decor.forEach(addUnique);

  // ----------------------------------------------------------------
  // Terreno em chunks: autotile orgânico, cache limitado e água leve.
  // ----------------------------------------------------------------
  function surfaceColor(tile, tx, ty) {
    if (tile === "F") return hash01(tx, ty, 201) > 0.52 ? "#3f7139" : "#477b3e";
    return hash01(tx, ty, 203) > 0.52 ? "#72b94a" : "#7bc451";
  }

  function drawGrassTile(g, x, y, tx, ty, forest) {
    g.fillStyle = surfaceColor(forest ? "F" : "G", tx, ty);
    g.fillRect(x, y, TILE, TILE);
    const accent = forest ? "#315d34" : "#5ca13f";
    const light = forest ? "#5e8d47" : "#94d766";
    for (let dot = 0; dot < 4; dot += 1) {
      const ox = 3 + Math.floor(hash01(tx, ty, 211 + dot * 3) * 25);
      const oy = 3 + Math.floor(hash01(tx, ty, 223 + dot * 5) * 25);
      g.fillStyle = dot % 2 ? light : accent;
      g.fillRect(x + ox, y + oy, dot % 3 === 0 ? 3 : 2, dot % 2 ? 2 : 4);
    }
    if (forest && hash01(tx, ty, 241) > 0.72) {
      g.fillStyle = "#8b6b3c";
      g.fillRect(x + 7, y + 21, 5, 2);
      g.fillStyle = "#b28a48";
      g.fillRect(x + 22, y + 9, 3, 2);
    }
    if (!forest && hash01(tx, ty, 251) > 0.91) {
      g.fillStyle = hash01(tx, ty, 257) > 0.5 ? "#ffe37d" : "#f6a5d5";
      g.fillRect(x + 12, y + 9, 3, 3);
      g.fillStyle = "#d9f5b0";
      g.fillRect(x + 13, y + 12, 1, 4);
    }
  }

  function isRoad(tile) { return tile === "D" || tile === "P"; }

  function drawRoadEdge(g, x, y, tx, ty, side, neighbor) {
    if (isRoad(neighbor)) return;
    const edge = 4 + Math.floor(hash01(tx, ty, 271 + side.length) * 4);
    g.fillStyle = neighbor === "F" ? "#477b3e" : neighbor === "W" ? "#b8a26f" : "#72b94a";
    if (side === "top") g.fillRect(x, y, TILE, edge);
    if (side === "bottom") g.fillRect(x, y + TILE - edge, TILE, edge);
    if (side === "left") g.fillRect(x, y, edge, TILE);
    if (side === "right") g.fillRect(x + TILE - edge, y, edge, TILE);
    g.fillStyle = neighbor === "F" ? "#315d34" : "#5b963d";
    if (side === "top" || side === "bottom") {
      const yy = side === "top" ? y + edge - 1 : y + TILE - edge - 1;
      g.fillRect(x + 5, yy, 5, 2); g.fillRect(x + 20, yy + 1, 4, 2);
    } else {
      const xx = side === "left" ? x + edge - 1 : x + TILE - edge - 1;
      g.fillRect(xx, y + 6, 2, 5); g.fillRect(xx + 1, y + 21, 2, 4);
    }
  }

  function drawDirtTile(g, x, y, tx, ty) {
    g.fillStyle = hash01(tx, ty, 281) > 0.5 ? "#b9955f" : "#c2a06a";
    g.fillRect(x, y, TILE, TILE);
    g.fillStyle = "#8f704b";
    g.fillRect(x + 4 + Math.floor(hash01(tx, ty, 283) * 10), y + 7, 5, 2);
    g.fillRect(x + 19, y + 21 + Math.floor(hash01(tx, ty, 287) * 5), 4, 2);
    g.fillStyle = "#d9bc82";
    g.fillRect(x + 7, y + 17, 3, 2);
    drawRoadEdge(g, x, y, tx, ty, "top", tileAt(tx, ty - 1));
    drawRoadEdge(g, x, y, tx, ty, "bottom", tileAt(tx, ty + 1));
    drawRoadEdge(g, x, y, tx, ty, "left", tileAt(tx - 1, ty));
    drawRoadEdge(g, x, y, tx, ty, "right", tileAt(tx + 1, ty));
  }

  function drawPlazaTile(g, x, y, tx, ty) {
    g.fillStyle = "#8f8a7e";
    g.fillRect(x, y, TILE, TILE);
    for (let row = 0; row < 3; row += 1) {
      const yy = y + row * 11;
      const shift = row % 2 ? 6 : 0;
      g.fillStyle = row % 2 ? "#aaa395" : "#9d978b";
      for (let col = -1; col < 4; col += 1) {
        const xx = x + col * 12 + shift;
        g.fillRect(xx + 1, yy + 1, 10, 8);
        g.fillStyle = "rgba(236,226,199,0.24)";
        g.fillRect(xx + 2, yy + 2, 7, 1);
        g.fillStyle = row % 2 ? "#aaa395" : "#9d978b";
      }
    }
    g.fillStyle = "rgba(61,63,59,0.30)";
    g.fillRect(x, y + 10, TILE, 1); g.fillRect(x, y + 21, TILE, 1);
    drawRoadEdge(g, x, y, tx, ty, "top", tileAt(tx, ty - 1));
    drawRoadEdge(g, x, y, tx, ty, "bottom", tileAt(tx, ty + 1));
    drawRoadEdge(g, x, y, tx, ty, "left", tileAt(tx - 1, ty));
    drawRoadEdge(g, x, y, tx, ty, "right", tileAt(tx + 1, ty));
  }

  function drawWaterTileStatic(g, x, y, tx, ty) {
    g.fillStyle = hash01(tx, ty, 307) > 0.5 ? "#287eaa" : "#2d88b4";
    g.fillRect(x, y, TILE, TILE);
    g.fillStyle = "rgba(102,205,225,0.30)";
    g.fillRect(x + 3, y + 8, 12, 2);
    g.fillRect(x + 17, y + 22, 11, 2);
    const banks = [
      ["top", tileAt(tx, ty - 1)], ["bottom", tileAt(tx, ty + 1)],
      ["left", tileAt(tx - 1, ty)], ["right", tileAt(tx + 1, ty)]
    ];
    for (const [side, neighbor] of banks) {
      if (neighbor === "W") continue;
      g.fillStyle = neighbor === "F" ? "#426f3a" : "#7db754";
      if (side === "top") g.fillRect(x, y, TILE, 5);
      if (side === "bottom") g.fillRect(x, y + TILE - 5, TILE, 5);
      if (side === "left") g.fillRect(x, y, 5, TILE);
      if (side === "right") g.fillRect(x + TILE - 5, y, 5, TILE);
      g.fillStyle = "#b59a69";
      if (side === "top") g.fillRect(x, y + 5, TILE, 2);
      if (side === "bottom") g.fillRect(x, y + TILE - 7, TILE, 2);
      if (side === "left") g.fillRect(x + 5, y, 2, TILE);
      if (side === "right") g.fillRect(x + TILE - 7, y, 2, TILE);
    }
  }

  function drawStaticTerrainTile(g, x, y, tx, ty) {
    const tile = tileAt(tx, ty);
    if (tile === "F") drawGrassTile(g, x, y, tx, ty, true);
    else if (tile === "D") drawDirtTile(g, x, y, tx, ty);
    else if (tile === "P") drawPlazaTile(g, x, y, tx, ty);
    else if (tile === "W") drawWaterTileStatic(g, x, y, tx, ty);
    else drawGrassTile(g, x, y, tx, ty, false);

    if (tile === "G") {
      g.fillStyle = "#3f7139";
      if (tileAt(tx, ty - 1) === "F") g.fillRect(x, y, TILE, 2);
      if (tileAt(tx, ty + 1) === "F") g.fillRect(x, y + TILE - 2, TILE, 2);
      if (tileAt(tx - 1, ty) === "F") g.fillRect(x, y, 2, TILE);
      if (tileAt(tx + 1, ty) === "F") g.fillRect(x + TILE - 2, y, 2, TILE);
    }
  }

  function getTerrainChunk(chunkX, chunkY) {
    const key = `${chunkX}:${chunkY}`;
    if (terrainChunks.has(key)) {
      const cached = terrainChunks.get(key);
      terrainChunks.delete(key);
      terrainChunks.set(key, cached);
      return cached;
    }
    const startX = chunkX * CHUNK_TILES;
    const startY = chunkY * CHUNK_TILES;
    const tilesWide = Math.min(CHUNK_TILES, REGION_COLS - startX);
    const tilesHigh = Math.min(CHUNK_TILES, REGION_ROWS - startY);
    if (tilesWide <= 0 || tilesHigh <= 0) return null;
    const canvasChunk = document.createElement("canvas");
    canvasChunk.width = tilesWide * TILE;
    canvasChunk.height = tilesHigh * TILE;
    const g = canvasChunk.getContext("2d", { alpha: false });
    if (!g) return null;
    g.imageSmoothingEnabled = false;
    for (let localY = 0; localY < tilesHigh; localY += 1) {
      for (let localX = 0; localX < tilesWide; localX += 1) {
        drawStaticTerrainTile(g, localX * TILE, localY * TILE, startX + localX, startY + localY);
      }
    }
    const chunk = { canvas: canvasChunk, x: startX * TILE, y: startY * TILE };
    terrainChunks.set(key, chunk);
    const mobile = Boolean(typeof isMobile !== "undefined" && isMobile) || document.body?.classList?.contains("is-mobile");
    const maxChunks = mobile ? 12 : 24;
    while (terrainChunks.size > maxChunks) terrainChunks.delete(terrainChunks.keys().next().value);
    return chunk;
  }

  function drawTerrainOverlay() {
    if (currentScene !== "village") return;
    const viewW = typeof getZoomedViewWidth === "function" ? getZoomedViewWidth() : canvas.width;
    const viewH = typeof getZoomedViewHeight === "function" ? getZoomedViewHeight() : canvas.height;
    const startChunkX = Math.max(0, Math.floor(camera.x / (CHUNK_TILES * TILE)));
    const endChunkX = Math.min(Math.ceil(REGION_COLS / CHUNK_TILES) - 1, Math.floor((camera.x + viewW) / (CHUNK_TILES * TILE)));
    const startChunkY = Math.max(0, Math.floor(camera.y / (CHUNK_TILES * TILE)));
    const endChunkY = Math.min(Math.ceil(REGION_ROWS / CHUNK_TILES) - 1, Math.floor((camera.y + viewH) / (CHUNK_TILES * TILE)));
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    for (let cy = startChunkY; cy <= endChunkY; cy += 1) {
      for (let cx = startChunkX; cx <= endChunkX; cx += 1) {
        const chunk = getTerrainChunk(cx, cy);
        if (chunk) ctx.drawImage(chunk.canvas, chunk.x, chunk.y);
      }
    }

    const startTileX = Math.max(0, Math.floor(camera.x / TILE) - 1);
    const endTileX = Math.min(REGION_COLS - 1, Math.ceil((camera.x + viewW) / TILE) + 1);
    const startTileY = Math.max(0, Math.floor(camera.y / TILE) - 1);
    const endTileY = Math.min(REGION_ROWS - 1, Math.ceil((camera.y + viewH) / TILE) + 1);
    const time = performance.now() / 1000;
    const shimmerLimit = (Boolean(typeof isMobile !== "undefined" && isMobile) ? 12 : 24);
    let shimmerCount = 0;
    ctx.strokeStyle = "rgba(191,241,249,0.34)";
    ctx.lineWidth = 1.5;
    for (let ty = startTileY; ty <= endTileY && shimmerCount < shimmerLimit; ty += 1) {
      for (let tx = startTileX; tx <= endTileX && shimmerCount < shimmerLimit; tx += 1) {
        if (tileAt(tx, ty) !== "W" || hash01(tx, ty, 331) < 0.62) continue;
        const px = tx * TILE;
        const py = ty * TILE + 14 + Math.sin(time * 1.8 + tx * 0.7 + ty) * 2;
        ctx.beginPath();
        ctx.moveTo(px + 5, py);
        ctx.lineTo(px + 14, py - 2);
        ctx.lineTo(px + 25, py + 1);
        ctx.stroke();
        shimmerCount += 1;
      }
    }
    ctx.restore();
  }

  const drawMapBeforeVillageForest = typeof drawMap === "function" ? drawMap : null;
  drawMap = function drawMapVillageForestRefactor() {
    if (drawMapBeforeVillageForest) drawMapBeforeVillageForest.apply(this, arguments);
    drawTerrainOverlay();
  };

  // ----------------------------------------------------------------
  // Objetos pixel art desenhados por código.
  // ----------------------------------------------------------------
  const ROOFS = {
    blue: ["#244c67", "#347799", "#55a1b8"], teal: ["#24584f", "#367f70", "#58a88b"],
    green: ["#405b2d", "#637d3b", "#86a84d"], red: ["#6d3329", "#984532", "#c46242"],
    amber: ["#6a4a22", "#9a6a2c", "#c8943f"], brown: ["#4d3829", "#6e4b32", "#92704a"],
    forge: ["#382f35", "#52424a", "#8b4e39"]
  };

  function drawHouseCanvas(obj) {
    const x = Math.round(obj.x);
    const y = Math.round(obj.y);
    const w = Math.round(obj.width);
    const h = Math.round(obj.height);
    const roof = ROOFS[obj.erRoofVariant] || ROOFS.brown;
    const roofHeight = Math.max(42, Math.round(h * 0.52));
    const wallTop = y + roofHeight - 8;
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = "rgba(16,22,18,0.30)";
    ctx.fillRect(x + 7, y + h - 4, w - 2, 12);
    ctx.fillStyle = "#c9b58d";
    ctx.fillRect(x + 8, wallTop, w - 16, h - roofHeight + 1);
    ctx.fillStyle = "#e0cba2";
    ctx.fillRect(x + 13, wallTop + 5, w - 26, h - roofHeight - 8);
    ctx.fillStyle = "#6d5844";
    ctx.fillRect(x + 8, y + h - 13, w - 16, 9);

    for (let row = 0; row < roofHeight; row += 4) {
      const progress = row / roofHeight;
      const inset = Math.round((1 - progress) * (w * 0.30));
      ctx.fillStyle = row % 12 === 0 ? roof[2] : row % 8 === 0 ? roof[1] : roof[0];
      ctx.fillRect(x + inset - 6, y + row + 4, w - inset * 2 + 12, 5);
    }
    ctx.fillStyle = "#33281f";
    ctx.fillRect(x + Math.round(w * 0.25), y + 12, 6, roofHeight - 12);
    ctx.fillRect(x + Math.round(w * 0.68), y + 12, 6, roofHeight - 12);

    const doorW = obj.type === "playerHouse" ? 30 : 24;
    const doorX = x + Math.round(w / 2 - doorW / 2);
    const doorY = y + h - 43;
    ctx.fillStyle = "#493126";
    ctx.fillRect(doorX - 3, doorY - 3, doorW + 6, 40);
    ctx.fillStyle = "#7b4b32";
    ctx.fillRect(doorX, doorY, doorW, 37);
    ctx.fillStyle = "#d7a94f";
    ctx.fillRect(doorX + doorW - 7, doorY + 18, 3, 3);
    for (const wx of [x + 20, x + w - 42]) {
      ctx.fillStyle = "#4a372a";
      ctx.fillRect(wx - 3, wallTop + 15, 25, 25);
      ctx.fillStyle = "#6cc3d4";
      ctx.fillRect(wx, wallTop + 18, 19, 18);
      ctx.fillStyle = "#d6f3e9";
      ctx.fillRect(wx + 3, wallTop + 21, 6, 4);
      ctx.fillStyle = "#4a372a";
      ctx.fillRect(wx + 8, wallTop + 18, 3, 18);
      ctx.fillRect(wx, wallTop + 26, 19, 3);
    }
    ctx.fillStyle = "#75675b";
    ctx.fillRect(doorX - 10, y + h - 6, doorW + 20, 5);
    ctx.fillStyle = "#a99a87";
    ctx.fillRect(doorX - 6, y + h - 1, doorW + 12, 4);

    if (obj.type === "shop") {
      const awningY = wallTop + 8;
      for (let stripe = 0; stripe < 6; stripe += 1) {
        ctx.fillStyle = stripe % 2 ? "#f1dfba" : "#4e82a0";
        ctx.fillRect(x + 17 + stripe * 15, awningY, 15, 15);
      }
      ctx.fillStyle = "#4c3826";
      ctx.fillRect(x + 18, awningY + 15, 90, 5);
    }
    if (obj.type === "playerHouse") {
      ctx.fillStyle = "#d9b65d";
      ctx.fillRect(x + w - 24, wallTop + 1, 12, 24);
      ctx.fillStyle = "#315d8c";
      ctx.fillRect(x + w - 21, wallTop + 4, 6, 15);
    }
    if (obj.type === "blacksmithShop") {
      ctx.fillStyle = "#4a403d";
      ctx.fillRect(x + w - 35, y - 8, 20, 48);
      ctx.fillStyle = "#756a65";
      ctx.fillRect(x + w - 39, y - 10, 28, 8);
      ctx.fillStyle = "#24242a";
      ctx.fillRect(x + 15, wallTop + 9, 32, 8);
      ctx.fillStyle = "#c46a32";
      ctx.fillRect(x + 22, wallTop + 11, 18, 4);
    }
    ctx.restore();
  }

  function drawTreeCanvas(obj) {
    const scale = obj.scale || 1;
    const centerX = obj.x + obj.width / 2;
    const baseY = obj.y + obj.height;
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = "rgba(11,24,15,0.28)";
    ctx.fillRect(centerX - 22 * scale, baseY - 5, 44 * scale, 9);
    ctx.fillStyle = "#4b3022";
    ctx.fillRect(centerX - 6 * scale, baseY - 32 * scale, 12 * scale, 34 * scale);
    ctx.fillStyle = "#7a5030";
    ctx.fillRect(centerX - 2 * scale, baseY - 29 * scale, 4 * scale, 28 * scale);
    if (obj.variant === "pine") {
      const colors = ["#174934", "#1f6541", "#2d8050"];
      for (let layer = 0; layer < 4; layer += 1) {
        const yy = baseY - (82 - layer * 17) * scale;
        const width = (24 + layer * 9) * scale;
        for (let row = 0; row < 20 * scale; row += 4) {
          const inset = Math.max(0, 10 * scale - row * 0.45);
          ctx.fillStyle = colors[layer % colors.length];
          ctx.fillRect(centerX - width + inset, yy + row, (width - inset) * 2, 5);
        }
      }
    } else {
      const colors = obj.variant === "maple" ? ["#24633c", "#367f45", "#5a9c4c"] : ["#1d5a38", "#2e7942", "#4c964d"];
      const clusters = [[-22, -58, 36, 34], [4, -66, 38, 36], [-4, -86, 36, 32], [-36, -74, 34, 32], [22, -48, 30, 28]];
      clusters.forEach((cluster, index) => {
        const [ox, oy, cw, ch] = cluster;
        ctx.fillStyle = colors[index % colors.length];
        ctx.fillRect(centerX + ox * scale, baseY + oy * scale, cw * scale, ch * scale);
        ctx.fillStyle = "rgba(151,204,93,0.22)";
        ctx.fillRect(centerX + (ox + 5) * scale, baseY + (oy + 5) * scale, cw * 0.45 * scale, 5 * scale);
      });
    }
    ctx.restore();
  }

  function drawDecorCanvas(obj) {
    const x = obj.x;
    const y = obj.y;
    const w = obj.width;
    const h = obj.height;
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    if (obj.kind === "bridge") {
      ctx.fillStyle = "rgba(18,28,25,0.35)";
      ctx.fillRect(x, y + 8, w, h - 8);
      ctx.fillStyle = "#493225";
      ctx.fillRect(x, y + 3, w, 6); ctx.fillRect(x, y + h - 9, w, 6);
      for (let px = x + 4; px < x + w - 4; px += 15) {
        ctx.fillStyle = ((px / 15) | 0) % 2 ? "#9a673a" : "#ad7642";
        ctx.fillRect(px, y + 10, 13, h - 20);
        ctx.fillStyle = "#5b3c29";
        ctx.fillRect(px + 11, y + 10, 2, h - 20);
      }
      ctx.fillStyle = "#d0a05a";
      for (let px = x + 5; px < x + w; px += 32) {
        ctx.fillRect(px, y, 5, 15); ctx.fillRect(px, y + h - 15, 5, 15);
      }
    } else if (obj.kind === "fountain") {
      const pulse = 0.65 + Math.sin(performance.now() / 330) * 0.12;
      ctx.fillStyle = "rgba(35,50,52,0.25)"; ctx.fillRect(x + 3, y + h - 8, w, 10);
      ctx.fillStyle = "#777d78"; ctx.fillRect(x + 3, y + 18, w - 6, h - 22);
      ctx.fillStyle = "#b2b2a5"; ctx.fillRect(x + 8, y + 13, w - 16, h - 25);
      ctx.fillStyle = "#2b8fb2"; ctx.fillRect(x + 13, y + 20, w - 26, h - 35);
      ctx.fillStyle = `rgba(176,239,246,${pulse})`; ctx.fillRect(x + w / 2 - 3, y + 5, 6, 26);
      ctx.fillStyle = "#d5d0b9"; ctx.fillRect(x + w / 2 - 7, y + 9, 14, 8);
    } else if (obj.kind.startsWith("marketStall")) {
      const canopy = obj.kind === "marketStallRed" ? "#b84a3c" : obj.kind === "marketStallBlue" ? "#3c7599" : "#d6ccb3";
      ctx.fillStyle = "#5c3b25"; ctx.fillRect(x + 7, y + 12, 6, h - 12); ctx.fillRect(x + w - 13, y + 12, 6, h - 12);
      for (let stripe = 0; stripe < 6; stripe += 1) {
        ctx.fillStyle = stripe % 2 ? "#f0dfbd" : canopy;
        ctx.fillRect(x + stripe * (w / 6), y, w / 6 + 1, 24);
      }
      ctx.fillStyle = "#6a4529"; ctx.fillRect(x + 3, y + h - 25, w - 6, 17);
      ctx.fillStyle = "#e0a94f"; ctx.fillRect(x + 14, y + h - 21, 12, 7);
      ctx.fillStyle = "#78a955"; ctx.fillRect(x + 32, y + h - 20, 14, 6);
    } else if (obj.kind === "lampPost") {
      ctx.fillStyle = "#41352d"; ctx.fillRect(x + 5, y + 8, 5, h - 8); ctx.fillRect(x + 1, y + h - 5, 13, 5);
      ctx.fillStyle = "#7a5635"; ctx.fillRect(x + 1, y + 5, 13, 5);
      ctx.fillStyle = "#ffe477"; ctx.fillRect(x + 3, y, 9, 9);
      ctx.fillStyle = "rgba(255,228,119,0.18)"; ctx.fillRect(x - 5, y - 6, 23, 23);
    } else if (obj.kind === "signpost") {
      ctx.fillStyle = "#5b3b26"; ctx.fillRect(x + 8, y + 8, 6, h - 8);
      ctx.fillStyle = "#9d6c3c"; ctx.fillRect(x, y, 22, 14);
      ctx.fillStyle = "#c89552"; ctx.fillRect(x + 3, y + 3, 16, 3);
    } else if (obj.kind === "crate") {
      ctx.fillStyle = "#6b472c"; ctx.fillRect(x, y, w, h); ctx.fillStyle = "#a57442"; ctx.fillRect(x + 3, y + 3, w - 6, h - 6);
      ctx.fillStyle = "#5a3b27"; ctx.fillRect(x + 5, y + 4, 4, h - 8); ctx.fillRect(x + w - 9, y + 4, 4, h - 8);
    } else if (obj.kind === "barrel") {
      ctx.fillStyle = "#513621"; ctx.fillRect(x + 2, y, w - 4, h); ctx.fillStyle = "#94613a"; ctx.fillRect(x + 5, y + 2, w - 10, h - 4);
      ctx.fillStyle = "#3d4242"; ctx.fillRect(x + 2, y + 5, w - 4, 4); ctx.fillRect(x + 2, y + h - 9, w - 4, 4);
    } else if (obj.kind === "logPile") {
      ctx.fillStyle = "#4a301f"; ctx.fillRect(x, y + 10, w, h - 10);
      for (let log = 0; log < 3; log += 1) {
        ctx.fillStyle = log % 2 ? "#7a4e2e" : "#8b5a32"; ctx.fillRect(x + log * 18, y + 4 + (log % 2) * 7, 25, 11);
        ctx.fillStyle = "#c38a50"; ctx.fillRect(x + log * 18 + 19, y + 6 + (log % 2) * 7, 6, 7);
      }
    } else if (obj.kind === "stump") {
      ctx.fillStyle = "#5c3b24"; ctx.fillRect(x + 3, y + 7, w - 6, h - 7); ctx.fillStyle = "#b27a43"; ctx.fillRect(x, y + 2, w, 10);
      ctx.fillStyle = "#6e4628"; ctx.fillRect(x + 7, y + 5, w - 14, 3);
    } else if (obj.kind === "rockCluster") {
      ctx.fillStyle = "#5f6662"; ctx.fillRect(x + 3, y + 9, 21, h - 9); ctx.fillStyle = "#838b82"; ctx.fillRect(x + 8, y + 4, 22, h - 6);
      ctx.fillStyle = "#aeb09e"; ctx.fillRect(x + 13, y + 7, 8, 4); ctx.fillStyle = "#4b514f"; ctx.fillRect(x + 29, y + 13, 17, h - 13);
    } else if (obj.kind === "brokenFence") {
      ctx.fillStyle = "#6c482c"; ctx.fillRect(x, y + 8, w * 0.38, 6); ctx.fillRect(x + w * 0.58, y + 5, w * 0.42, 6);
      ctx.fillRect(x + 8, y, 6, h); ctx.fillRect(x + w - 15, y + 2, 6, h - 2);
    } else if (obj.kind === "flowerPatch") {
      const colors = ["#f7d86a", "#f09ac1", "#82c8f3", "#f5f0d3"];
      for (let f = 0; f < 7; f += 1) {
        const fx = x + 3 + Math.floor(hash01(Math.round(x), f, 401) * Math.max(5, w - 8));
        const fy = y + 5 + Math.floor(hash01(Math.round(y), f, 409) * Math.max(5, h - 8));
        ctx.fillStyle = "#3d843f"; ctx.fillRect(fx + 1, fy + 3, 1, 5);
        ctx.fillStyle = colors[f % colors.length]; ctx.fillRect(fx, fy, 4, 4);
      }
    } else if (obj.kind === "shrub") {
      ctx.fillStyle = "#255f38"; ctx.fillRect(x + 2, y + 9, w - 4, h - 9);
      ctx.fillStyle = "#3d8a46"; ctx.fillRect(x + 7, y + 4, w - 14, h - 7);
      ctx.fillStyle = "#78b952"; ctx.fillRect(x + 10, y + 6, 8, 4);
    } else if (obj.kind === "fenceH") {
      ctx.fillStyle = "#604027"; ctx.fillRect(x, y + 4, w, 5); ctx.fillRect(x, y + 10, w, 4);
      ctx.fillStyle = "#99643a"; for (let px = x + 3; px < x + w; px += 22) ctx.fillRect(px, y, 6, 17);
    } else if (obj.kind === "fenceV") {
      ctx.fillStyle = "#604027"; ctx.fillRect(x + 3, y, 5, h); ctx.fillRect(x + 9, y, 4, h);
      ctx.fillStyle = "#99643a"; for (let py = y + 3; py < y + h; py += 22) ctx.fillRect(x, py, 17, 6);
    }
    ctx.restore();
  }

  const drawObjectBeforeVillageForest = typeof drawObject === "function" ? drawObject : null;
  drawObject = function drawObjectVillageForestRefactor(obj) {
    if (obj?.erVillageRebuilt && ["house", "playerHouse", "shop", "blacksmithShop"].includes(obj.type)) return drawHouseCanvas(obj);
    if (obj?.type === "vfTree") return drawTreeCanvas(obj);
    if (obj?.type === "vfDecor") return drawDecorCanvas(obj);
    return drawObjectBeforeVillageForest ? drawObjectBeforeVillageForest.apply(this, arguments) : undefined;
  };

  // ----------------------------------------------------------------
  // Água, transições, save e segurança de posição.
  // ----------------------------------------------------------------
  function rectTouchesInitialWater(rect) {
    const left = Math.floor(rect.x / TILE);
    const right = Math.floor((rect.x + rect.width - 1) / TILE);
    const top = Math.floor(rect.y / TILE);
    const bottom = Math.floor((rect.y + rect.height - 1) / TILE);
    for (let ty = top; ty <= bottom; ty += 1) {
      for (let tx = left; tx <= right; tx += 1) {
        if (inInitialRegionTile(tx, ty) && tileAt(tx, ty) === "W") return true;
      }
    }
    return false;
  }

  const canMoveToBeforeVillageForest = typeof canMoveTo === "function" ? canMoveTo : null;
  canMoveTo = function canMoveToVillageForest(nextX, nextY) {
    if (currentScene === "village") {
      const rect = typeof getPlayerRect === "function" ? getPlayerRect(nextX, nextY) : { x: nextX, y: nextY, width: player.width, height: player.height };
      if (rectTouchesInitialWater(rect)) return false;
    }
    return canMoveToBeforeVillageForest ? canMoveToBeforeVillageForest.apply(this, arguments) : true;
  };

  if (oldSaveKey) {
    getSaveObjectKey = function getSaveObjectKeyVillageForestCompatible(obj) {
      if (obj?.erVillageForestOldSaveKey) return obj.erVillageForestOldSaveKey;
      return oldSaveKey(obj);
    };
  }

  function buildingDoor(obj) {
    return {
      x: obj.x + obj.width / 2 - 34,
      y: obj.y + obj.height - 14,
      width: 68,
      height: 54
    };
  }

  function playerCenterRect() {
    return { x: player.x + player.width / 2, y: player.y + player.height / 2, width: 1, height: 1 };
  }

  function findBuilding(type, titleText) {
    return villageObjects.find((obj) => obj && (type ? obj.type === type : true) && (!titleText || String(obj.title || "").includes(titleText)));
  }

  const handleTransitionsBeforeVillageForest = typeof handleMapTransitions === "function" ? handleMapTransitions : null;
  handleMapTransitions = function handleMapTransitionsVillageForest() {
    if (currentScene === "village") {
      const center = playerCenterRect();
      const home = findBuilding("playerHouse");
      const shopBuilding = findBuilding("shop");
      const mayor = findBuilding("house", "Prefeito");
      if (home && rectsOverlap(center, buildingDoor(home))) { enterHome(); return; }
      if (shopBuilding && rectsOverlap(center, buildingDoor(shopBuilding))) { enterShopInterior(); return; }
      if (mayor && rectsOverlap(center, buildingDoor(mayor))) { enterMayorInterior(); return; }

      // Bloqueia somente as três portas fantasmas da vila antiga.
      const oldGhostDoors = [
        { x: 24 * TILE + 18, y: 33 * TILE + 82, width: 40, height: 30 },
        { x: 42 * TILE + 18, y: 6 * TILE + 82, width: 40, height: 30 },
        { x: 36 * TILE + 18, y: 8 * TILE + 82, width: 40, height: 30 }
      ];
      if (oldGhostDoors.some((door) => rectsOverlap(center, door))) return;
    }
    return handleTransitionsBeforeVillageForest ? handleTransitionsBeforeVillageForest.apply(this, arguments) : undefined;
  };

  function placeOutsideBuilding(obj) {
    if (!obj || currentScene !== "village") return;
    player.x = obj.x + obj.width / 2 - player.width / 2;
    player.y = obj.y + obj.height + 12;
    player.direction = "down";
  }

  const exitHomeBeforeVillageForest = typeof exitHome === "function" ? exitHome : null;
  exitHome = function exitHomeVillageForest() {
    const result = exitHomeBeforeVillageForest ? exitHomeBeforeVillageForest.apply(this, arguments) : undefined;
    placeOutsideBuilding(findBuilding("playerHouse"));
    return result;
  };
  const exitShopBeforeVillageForest = typeof exitShopInterior === "function" ? exitShopInterior : null;
  exitShopInterior = function exitShopVillageForest() {
    const result = exitShopBeforeVillageForest ? exitShopBeforeVillageForest.apply(this, arguments) : undefined;
    placeOutsideBuilding(findBuilding("shop"));
    return result;
  };
  const exitMayorBeforeVillageForest = typeof exitMayorInterior === "function" ? exitMayorInterior : null;
  exitMayorInterior = function exitMayorVillageForest() {
    const result = exitMayorBeforeVillageForest ? exitMayorBeforeVillageForest.apply(this, arguments) : undefined;
    placeOutsideBuilding(findBuilding("house", "Prefeito"));
    return result;
  };

  function ensureSafeVillagePosition() {
    if (currentScene !== "village" || typeof canMoveTo !== "function" || canMoveTo(player.x, player.y)) return false;
    const candidates = [[37,31], [34,30], [43,29], [30,32], [52,28], [34,44], [62,24], [18,32]];
    candidates.sort((a, b) => Math.hypot(a[0] * TILE - player.x, a[1] * TILE - player.y) - Math.hypot(b[0] * TILE - player.x, b[1] * TILE - player.y));
    const safe = candidates.find(([tx, ty]) => canMoveTo(tx * TILE + 5, ty * TILE + 3));
    if (!safe) return false;
    player.x = safe[0] * TILE + 5;
    player.y = safe[1] * TILE + 3;
    return true;
  }

  player.startX = SAFE_SPAWN.x;
  player.startY = SAFE_SPAWN.y;
  if (!gameStarted) {
    player.x = SAFE_SPAWN.x;
    player.y = SAFE_SPAWN.y;
    lastVillagePosition = { x: player.x, y: player.y };
  }

  const resetBeforeVillageForest = typeof resetProgressForNewGame === "function" ? resetProgressForNewGame : null;
  resetProgressForNewGame = function resetProgressVillageForest() {
    const result = resetBeforeVillageForest ? resetBeforeVillageForest.apply(this, arguments) : undefined;
    player.startX = SAFE_SPAWN.x;
    player.startY = SAFE_SPAWN.y;
    player.x = SAFE_SPAWN.x;
    player.y = SAFE_SPAWN.y;
    return result;
  };

  const loadBeforeVillageForest = typeof loadGame === "function" ? loadGame : null;
  loadGame = function loadGameVillageForestCompatible() {
    const result = loadBeforeVillageForest ? loadBeforeVillageForest.apply(this, arguments) : false;
    if (result) ensureSafeVillagePosition();
    return result;
  };

  const getAreaNameBeforeVillageForest = typeof getAreaName === "function" ? getAreaName : null;
  getAreaName = function getAreaNameVillageForest() {
    if (currentScene === "village") {
      const tx = Math.floor((player.x + player.width / 2) / TILE);
      const ty = Math.floor((player.y + player.height / 2) / TILE);
      if (inInitialRegionTile(tx, ty)) {
        if (tileAt(tx, ty) === "W") return "Rio de Valedouro";
        if (tx >= 14 && tx <= 64 && ty >= 4 && ty <= 47 && tileAt(tx, ty) !== "F") return "Vila Principal";
        return "Floresta Inicial";
      }
    }
    return getAreaNameBeforeVillageForest ? getAreaNameBeforeVillageForest.apply(this, arguments) : "Vila Principal";
  };

  function refreshVillageLists() {
    if (currentScene !== "village") return;
    objects = villageObjects;
    colliders = villageObjects.filter((obj) => obj?.solid);
    interactables = villageObjects.filter((obj) => obj?.message || obj?.type === "npc");
  }

  refreshVillageLists();
  ensureSafeVillagePosition();

  window.ETERNAL_RIFT_VILLAGE_FOREST_STATUS = function villageForestStatus() {
    return {
      version: PATCH_ID,
      region: { cols: REGION_COLS, rows: REGION_ROWS },
      trees: villageObjects.filter((obj) => obj?.type === "vfTree").length,
      decorations: villageObjects.filter((obj) => obj?.type === "vfDecor").length,
      houses: villageObjects.filter((obj) => obj?.erVillageRebuilt).length,
      colliders: villageObjects.filter((obj) => obj?.solid && objectInInitialRegion(obj)).length,
      waterBlocked: true,
      referenceImageUsed: false
    };
  };

  try { console.log("Eternal Rift patch carregado:", PATCH_ID, window.ETERNAL_RIFT_VILLAGE_FOREST_STATUS()); } catch (error) {}
})();
