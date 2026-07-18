/* ================================================================
   ETERNAL RIFT - REFORMA DOS BIOMAS NEVE, PANTANO E DESERTO
   Mapa real em tiles/Canvas, sem imagens de referencia no jogo.
   Escopo: somente as regioes antigas dos tres biomas.
   ================================================================ */
(function eternalRiftThreeBiomesRefactor20260717() {
  "use strict";

  const PATCH_ID = "three-explorable-biomes-organic-pc-mobile-20260717";
  if (typeof window === "undefined" || window.ETERNAL_RIFT_THREE_BIOMES_REFACTOR === PATCH_ID) return;
  if (typeof worldMap === "undefined" || !Array.isArray(worldMap) || typeof villageObjects === "undefined") return;
  window.ETERNAL_RIFT_THREE_BIOMES_REFACTOR = PATCH_ID;

  const REGIONS = {
    desert: { id: "desert", x1: 90, y1: 8, x2: 142, y2: 40, base: "A", title: "Deserto das Ruinas Douradas" },
    snow: { id: "snow", x1: 90, y1: 46, x2: 142, y2: 78, base: "N", title: "Terras do Inverno Eterno" },
    swamp: { id: "swamp", x1: 10, y1: 64, x2: 86, y2: 94, base: "H", title: "Pantano dos Sussurros" }
  };
  const TILES = {
    desertCliff: "desertCliff",
    snowCliff: "snowCliff",
    frozenDeep: "frozenDeep",
    snowPath: "snowPath",
    swampPath: "swampPath",
    boardwalk: "biomeBoardwalk"
  };
  const CHUNK_TILES = 10;
  const terrainCache = new Map();
  const oldSaveKey = typeof getSaveObjectKey === "function" ? getSaveObjectKey : null;

  function contains(region, tx, ty) {
    return tx >= region.x1 && tx <= region.x2 && ty >= region.y1 && ty <= region.y2;
  }
  function regionAt(tx, ty) {
    return Object.values(REGIONS).find((region) => contains(region, tx, ty)) || null;
  }
  function objectRegion(obj) {
    if (!obj || !Number.isFinite(obj.x) || !Number.isFinite(obj.y)) return null;
    return regionAt(Math.floor((obj.x + (obj.width || 1) / 2) / TILE), Math.floor((obj.y + (obj.height || 1) / 2) / TILE));
  }
  function tileAt(tx, ty) {
    return worldMap?.[ty]?.[tx] ?? "G";
  }
  function setTile(tx, ty, value) {
    if (ty < 0 || tx < 0 || ty >= worldMap.length || tx >= (worldMap[ty]?.length || 0)) return;
    worldMap[ty][tx] = value;
  }
  function hash01(x, y, salt = 0) {
    let n = Math.imul((x + 101 + salt * 19) | 0, 374761393) ^ Math.imul((y + 313 - salt * 11) | 0, 668265263);
    n = Math.imul(n ^ (n >>> 13), 1274126177);
    return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
  }
  function fillRegion(region, value) {
    for (let y = region.y1; y <= region.y2; y += 1) for (let x = region.x1; x <= region.x2; x += 1) setTile(x, y, value);
  }
  function paintBlob(region, cx, cy, rx, ry, value, seed = 1, roughness = 0.18) {
    for (let y = Math.floor(cy - ry - 2); y <= Math.ceil(cy + ry + 2); y += 1) {
      for (let x = Math.floor(cx - rx - 2); x <= Math.ceil(cx + rx + 2); x += 1) {
        if (!contains(region, x, y)) continue;
        const dx = (x - cx) / Math.max(1, rx);
        const dy = (y - cy) / Math.max(1, ry);
        const wobble = (hash01(x, y, seed) - 0.5) * roughness;
        if (dx * dx + dy * dy <= 1 + wobble) setTile(x, y, value);
      }
    }
  }
  function stampRoad(region, cx, cy, width, value, seed) {
    const radius = width / 2 + (hash01(cx, cy, seed) - 0.5) * 0.65;
    const reach = Math.ceil(radius + 1);
    for (let y = cy - reach; y <= cy + reach; y += 1) {
      for (let x = cx - reach; x <= cx + reach; x += 1) {
        if (!contains(region, x, y)) continue;
        if (Math.hypot(x - cx, y - cy) <= radius + (hash01(x, y, seed + 7) - 0.5) * 0.26) setTile(x, y, value);
      }
    }
  }
  function carveRoad(region, points, width, value, seed) {
    for (let index = 0; index < points.length - 1; index += 1) {
      const [x1, y1] = points[index];
      const [x2, y2] = points[index + 1];
      const steps = Math.max(1, Math.ceil(Math.hypot(x2 - x1, y2 - y1) * 2));
      for (let step = 0; step <= steps; step += 1) {
        const t = step / steps;
        const wobble = Math.sin(t * Math.PI * 2 + seed + index) * 0.28;
        stampRoad(region, Math.round(x1 + (x2 - x1) * t + wobble), Math.round(y1 + (y2 - y1) * t + wobble * 0.45), width, value, seed + step + index * 17);
      }
    }
  }
  function clearSpot(region, tx, ty, rx, ry, value) {
    for (let y = ty - ry; y <= ty + ry; y += 1) for (let x = tx - rx; x <= tx + rx; x += 1) if (contains(region, x, y)) setTile(x, y, value);
  }

  function buildDesert() {
    const r = REGIONS.desert;
    fillRegion(r, "A");
    paintBlob(r, 102, 13, 9, 4, TILES.desertCliff, 11, 0.22);
    paintBlob(r, 117, 9, 7, 3, TILES.desertCliff, 13, 0.18);
    paintBlob(r, 137, 11, 6, 4, TILES.desertCliff, 17, 0.20);
    paintBlob(r, 107, 29, 7, 5, TILES.desertCliff, 19, 0.24);
    paintBlob(r, 134, 27, 8, 5, TILES.desertCliff, 23, 0.22);
    paintBlob(r, 121, 38, 10, 3, TILES.desertCliff, 29, 0.18);
    paintBlob(r, 128, 15, 8, 6, "A", 31, 0.12);
    paintBlob(r, 129, 15, 5, 4, "W", 37, 0.12);
    paintBlob(r, 99, 34, 5, 3, "X", 41, 0.18);
    paintBlob(r, 135, 35, 4, 3, "X", 43, 0.18);
    paintBlob(r, 121, 12, 6, 5, "P", 47, 0.08);
    paintBlob(r, 125, 31, 7, 5, "P", 53, 0.10);
    carveRoad(r, [[90,24],[98,24],[108,22],[116,23],[125,25],[142,24]], 3.5, "D", 61);
    carveRoad(r, [[112,40],[112,33],[116,27],[121,20],[121,12]], 3.0, "D", 67);
    carveRoad(r, [[116,23],[123,19],[129,18]], 2.4, "D", 71);
    carveRoad(r, [[100,24],[99,30],[98,35]], 2.4, "D", 73);
    carveRoad(r, [[126,25],[129,29],[132,33]], 2.2, "D", 79);
    clearSpot(r, 90, 24, 1, 2, "D");
    clearSpot(r, 112, 40, 2, 1, "D");
  }

  function buildSnow() {
    const r = REGIONS.snow;
    fillRegion(r, "N");
    paintBlob(r, 98, 49, 7, 3, TILES.snowCliff, 101, 0.20);
    paintBlob(r, 122, 48, 8, 3, TILES.snowCliff, 103, 0.18);
    paintBlob(r, 139, 54, 5, 6, TILES.snowCliff, 107, 0.20);
    paintBlob(r, 101, 65, 7, 5, TILES.snowCliff, 109, 0.22);
    paintBlob(r, 124, 67, 8, 5, TILES.snowCliff, 113, 0.20);
    paintBlob(r, 139, 76, 6, 3, TILES.snowCliff, 127, 0.18);
    paintBlob(r, 117, 57, 10, 6, TILES.frozenDeep, 131, 0.14);
    paintBlob(r, 117, 57, 8, 4, "L", 137, 0.10);
    paintBlob(r, 97, 73, 6, 4, TILES.frozenDeep, 139, 0.12);
    paintBlob(r, 97, 73, 4, 3, "L", 149, 0.08);
    paintBlob(r, 133, 70, 5, 4, TILES.frozenDeep, 151, 0.12);
    paintBlob(r, 133, 70, 3, 2, "L", 157, 0.08);
    paintBlob(r, 119, 63, 7, 5, "P", 163, 0.08);
    paintBlob(r, 136, 51, 5, 3, "P", 167, 0.08);
    carveRoad(r, [[112,46],[112,51],[108,55],[104,60],[101,66],[99,77]], 3.1, TILES.snowPath, 173);
    carveRoad(r, [[104,60],[112,61],[120,63],[128,65],[138,69]], 3.0, TILES.snowPath, 179);
    carveRoad(r, [[120,63],[121,57],[126,53],[136,51]], 2.5, TILES.snowPath, 181);
    carveRoad(r, [[128,65],[131,70],[135,75]], 2.4, TILES.snowPath, 191);
    carveRoad(r, [[109,57],[118,57],[125,57]], 2.5, TILES.boardwalk, 193);
    carveRoad(r, [[94,73],[100,73]], 2.2, TILES.boardwalk, 197);
    clearSpot(r, 112, 46, 2, 1, TILES.snowPath);
  }

  function buildSwamp() {
    const r = REGIONS.swamp;
    fillRegion(r, "H");
    paintBlob(r, 18, 72, 8, 5, "V", 211, 0.20);
    paintBlob(r, 38, 76, 9, 6, "V", 223, 0.22);
    paintBlob(r, 62, 69, 10, 5, "V", 227, 0.18);
    paintBlob(r, 77, 78, 8, 7, "V", 229, 0.22);
    paintBlob(r, 23, 89, 10, 5, "V", 233, 0.20);
    paintBlob(r, 50, 89, 11, 5, "V", 239, 0.18);
    paintBlob(r, 73, 91, 10, 4, "V", 241, 0.18);
    paintBlob(r, 33, 69, 8, 4, "U", 251, 0.20);
    paintBlob(r, 56, 78, 10, 6, "U", 257, 0.24);
    paintBlob(r, 35, 86, 8, 5, "U", 263, 0.22);
    paintBlob(r, 69, 85, 8, 5, "U", 269, 0.22);
    paintBlob(r, 49, 71, 6, 4, "P", 271, 0.10);
    paintBlob(r, 70, 89, 5, 3, "P", 277, 0.10);
    carveRoad(r, [[33,64],[33,69],[37,73],[44,76],[52,80],[61,84],[70,88],[83,91]], 3.0, TILES.swampPath, 281);
    carveRoad(r, [[37,73],[31,79],[27,86],[20,92]], 2.6, TILES.swampPath, 283);
    carveRoad(r, [[52,80],[57,75],[64,71],[75,68]], 2.5, TILES.swampPath, 293);
    carveRoad(r, [[61,84],[69,80],[78,78]], 2.4, TILES.swampPath, 307);
    carveRoad(r, [[29,75],[38,76],[46,77]], 2.1, TILES.boardwalk, 311);
    carveRoad(r, [[57,70],[64,70],[70,71]], 2.1, TILES.boardwalk, 313);
    carveRoad(r, [[70,78],[77,78],[82,80]], 2.1, TILES.boardwalk, 317);
    carveRoad(r, [[43,88],[50,89],[57,89]], 2.1, TILES.boardwalk, 331);
    clearSpot(r, 33, 64, 2, 1, TILES.swampPath);
  }

  buildDesert();
  buildSnow();
  buildSwamp();

  function rememberOldKey(obj) {
    if (!obj || obj.erThreeBiomesOldSaveKey || !oldSaveKey) return;
    const tracked = ["enemy", "collectible", "crystal", "powerUp"].includes(obj.type) || Object.prototype.hasOwnProperty.call(obj, "collected");
    if (!tracked) return;
    try { obj.erThreeBiomesOldSaveKey = oldSaveKey(obj); } catch (error) {}
  }
  function moveTo(obj, tx, ty, offsetX = 4, offsetY = 4) {
    if (!obj) return;
    rememberOldKey(obj);
    obj.x = tx * TILE + offsetX;
    obj.y = ty * TILE + offsetY;
    if (obj.type === "enemy" || Number.isFinite(obj.spawnX) || Number.isFinite(obj.spawnY)) {
      obj.spawnX = obj.x;
      obj.spawnY = obj.y;
      obj.moveTimer = 0;
    }
  }

  const originalBiome = new Map();
  for (const obj of villageObjects) {
    const region = objectRegion(obj);
    if (region) originalBiome.set(obj, region.id);
  }

  const npcPlaces = {
    desertGuide: [98,24], shopkeeper: [134,20], frozenGuide: [103,60], frozenVictim: [136,74], swampGuide: [33,68]
  };
  for (const obj of villageObjects) {
    if (obj?.type !== "npc" || !npcPlaces[obj.role]) continue;
    const pos = npcPlaces[obj.role];
    moveTo(obj, pos[0], pos[1], 5, 4);
  }

  const featurePlaces = {
    caravan: [[101,33]], oasis: [[129,15]], sunTemple: [[120,10]], buriedRuins: [[124,30]], solarStone: [[107,19],[137,30]],
    ancientBones: [[95,34],[138,35]], quicksandPit: [[99,34],[135,35]], cactus: [[94,17],[105,20],[115,35],[137,18],[140,32]],
    scorpionBurrow: [[103,29],[132,27]], biomeChest_desert: [[139,37]],
    igloo: [[94,53]], woodLodge: [[133,73]], iceBridge: [[115,57]], frozenStatue: [[120,63]], iceCave: [[98,75]],
    snowTree: [[94,48],[103,51],[132,48],[140,65]], iceCrystal: [[106,56],[136,56]], frozenTorch: [[104,62],[114,64],[126,64],[137,68]], biomeChest_frozen: [[136,76]],
    swampTree: [[17,82],[26,92],[44,68],[82,86]], poisonMushroom: [[57,79],[74,84]], gasPlant: [[54,84],[80,73]],
    brokenBridge: [[34,76]], abandonedHouse: [[47,68]], skullPile: [[39,91],[60,90]], purifyShrine: [[70,89]], biomeChest_swamp: [[82,92]]
  };
  const featureCounters = {};
  for (const obj of villageObjects) {
    if (obj?.type !== "biomeFeature" || !originalBiome.has(obj)) continue;
    let key = obj.kind;
    if (obj.role === "biomeChest") key = `biomeChest_${obj.chestId}`;
    const list = featurePlaces[key];
    if (!list?.length) continue;
    const index = featureCounters[key] || 0;
    const pos = list[Math.min(index, list.length - 1)];
    featureCounters[key] = index + 1;
    moveTo(obj, pos[0], pos[1], 2, 2);
    if (["cactus", "iceCrystal", "snowTree", "swampTree"].includes(obj.kind)) obj.solid = true;
  }

  const collectiblePlaces = {
    desert: [[124,14],[107,26],[137,22]],
    snow: [[106,56],[113,55],[126,55],[96,69],[106,74],[135,53]],
    swamp: [[24,84],[31,89],[39,81],[61,90],[76,85],[68,73]]
  };
  const enemyPlaces = {
    desert: [[96,20],[103,25],[108,32],[137,28],[132,37],[115,20],[128,23],[139,17],[120,33],[124,35],[117,37],[130,29],[138,25],[110,17],[132,13],[140,33],[125,31]],
    snow: [[102,59],[107,62],[136,60],[102,76],[120,57],[130,59],[110,72],[126,67],[117,71],[98,68],[106,74],[132,73],[138,70],[123,67]],
    swamp: [[23,79],[28,88],[65,87],[79,82],[43,85],[58,78],[74,75],[34,83],[56,86],[76,89],[49,76],[62,81],[40,90],[53,91],[71,75],[17,88],[59,84]]
  };
  const collectibleCounters = { desert: 0, snow: 0, swamp: 0 };
  const enemyCounters = { desert: 0, snow: 0, swamp: 0 };
  for (const obj of villageObjects) {
    const biome = originalBiome.get(obj);
    if (!biome) continue;
    if (obj.type === "collectible" || obj.type === "crystal") {
      const list = collectiblePlaces[biome];
      const pos = list[collectibleCounters[biome]++ % list.length];
      moveTo(obj, pos[0], pos[1], 6, 5);
    } else if (obj.type === "enemy") {
      const list = enemyPlaces[biome];
      const pos = list[enemyCounters[biome]++ % list.length];
      moveTo(obj, pos[0], pos[1], 4, 4);
    }
  }

  function decor(id, biome, kind, tx, ty, width, height, solid = false, message = "", extra = {}) {
    return { type: "triBiomeDecor", erThreeBiomeId: id, biome, kind, x: tx * TILE + (extra.offsetX || 0), y: ty * TILE + (extra.offsetY || 0), width, height, solid, message, ...extra };
  }
  function addUnique(obj) {
    if (!villageObjects.some((entry) => entry?.erThreeBiomeId === obj.erThreeBiomeId)) villageObjects.push(obj);
  }

  const manualDecor = [
    // Deserto: templos, oasis, acampamentos, ruinas e marcos.
    decor("desert-temple-gate", "desert", "desertTemple", 118, 8, TILE * 6, TILE * 4, true, "Entrada do Templo Solar: inscrições antigas cobrem as pedras."),
    decor("desert-tomb", "desert", "tombGate", 132, 31, TILE * 4, TILE * 3, true, "Tumba soterrada: uma corrente de ar frio vem da passagem."),
    decor("desert-oasis", "desert", "oasisRim", 124, 11, TILE * 10, TILE * 8, false, "Oásis das Duas Luas."),
    decor("desert-camp-a", "desert", "desertTent", 96, 31, TILE * 3, TILE * 2, true, "Acampamento de exploradores."),
    decor("desert-camp-b", "desert", "desertTent", 136, 20, TILE * 3, TILE * 2, true, "Tenda de uma caravana perdida."),
    decor("desert-obelisk-a", "desert", "obelisk", 108, 25, 24, 54, true), decor("desert-obelisk-b", "desert", "obelisk", 129, 28, 24, 54, true),
    decor("desert-columns", "desert", "brokenColumns", 116, 29, TILE * 3, 42, true),
    decor("desert-bones-a", "desert", "bones", 92, 29, 52, 24), decor("desert-bones-b", "desert", "bones", 138, 12, 52, 24),
    decor("desert-palm-a", "desert", "palm", 124, 17, 28, 32, true), decor("desert-palm-b", "desert", "palm", 132, 18, 28, 32, true),
    decor("desert-palm-c", "desert", "palm", 126, 10, 28, 32, true), decor("desert-rock-a", "desert", "desertRock", 106, 36, 48, 30, true),
    decor("desert-rock-b", "desert", "desertRock", 139, 27, 48, 30, true), decor("desert-sign", "desert", "biomeSign", 91, 23, 24, 34, true, "Deserto das Ruínas Douradas"),

    // Neve: plataformas, ruinas, pontes, caverna e cristais.
    decor("snow-cave", "snow", "iceCaveGate", 96, 73, TILE * 4, TILE * 3, true, "Caverna de Gelo: cristais ressoam no interior."),
    decor("snow-ruin", "snow", "frozenRuin", 133, 48, TILE * 6, TILE * 4, true, "Ruínas congeladas de uma ordem esquecida."),
    decor("snow-bridge-main", "snow", "woodBridge", 109, 56, TILE * 17, TILE * 3, false),
    decor("snow-bridge-small", "snow", "woodBridge", 93, 72, TILE * 8, TILE * 2, false),
    decor("snow-stairs-a", "snow", "iceStairs", 104, 54, TILE * 2, TILE * 3, false), decor("snow-stairs-b", "snow", "iceStairs", 128, 65, TILE * 2, TILE * 3, false),
    decor("snow-crystal-a", "snow", "iceCrystal", 107, 53, 34, 46, true), decor("snow-crystal-b", "snow", "iceCrystal", 137, 59, 34, 46, true),
    decor("snow-crystal-c", "snow", "iceCrystal", 118, 75, 34, 46, true), decor("snow-column-a", "snow", "frozenColumn", 117, 62, 24, 52, true),
    decor("snow-column-b", "snow", "frozenColumn", 123, 62, 24, 52, true), decor("snow-camp", "snow", "snowCamp", 92, 76, TILE * 3, TILE * 2, true),
    decor("snow-pine-a", "snow", "snowPine", 94, 61, 26, 30, true), decor("snow-pine-b", "snow", "snowPine", 108, 47, 26, 30, true),
    decor("snow-pine-c", "snow", "snowPine", 140, 63, 26, 30, true), decor("snow-sign", "snow", "biomeSign", 111, 47, 24, 34, true, "Terras do Inverno Eterno"),

    // Pantano: ruinas, pontes, arvores mortas, raizes e luzes.
    decor("swamp-ruin", "swamp", "swampRuin", 46, 66, TILE * 5, TILE * 4, true, "Santuário coberto por musgo e raízes antigas."),
    decor("swamp-bridge-a", "swamp", "brokenWoodBridge", 28, 75, TILE * 19, TILE * 3, false),
    decor("swamp-bridge-b", "swamp", "brokenWoodBridge", 56, 69, TILE * 15, TILE * 3, false),
    decor("swamp-bridge-c", "swamp", "brokenWoodBridge", 69, 77, TILE * 14, TILE * 3, false),
    decor("swamp-root-a", "swamp", "giantRoot", 14, 76, TILE * 3, TILE * 2, true), decor("swamp-root-b", "swamp", "giantRoot", 64, 83, TILE * 3, TILE * 2, true),
    decor("swamp-tree-a", "swamp", "deadTree", 20, 67, 30, 34, true), decor("swamp-tree-b", "swamp", "deadTree", 42, 92, 30, 34, true),
    decor("swamp-tree-c", "swamp", "deadTree", 83, 70, 30, 34, true), decor("swamp-log-a", "swamp", "fallenLog", 28, 84, 68, 28, true),
    decor("swamp-log-b", "swamp", "fallenLog", 72, 92, 68, 28, true), decor("swamp-stone-a", "swamp", "mossStone", 17, 91, 44, 30, true),
    decor("swamp-stone-b", "swamp", "mossStone", 79, 85, 44, 30, true), decor("swamp-wisp-a", "swamp", "greenWisp", 24, 73, 12, 20),
    decor("swamp-wisp-b", "swamp", "greenWisp", 58, 74, 12, 20), decor("swamp-wisp-c", "swamp", "greenWisp", 74, 88, 12, 20),
    decor("swamp-sign", "swamp", "biomeSign", 32, 65, 24, 34, true, "Pântano dos Sussurros")
  ];
  manualDecor.forEach(addUnique);

  // Detalhes pequenos determinísticos, sem colisores desnecessários.
  for (const region of Object.values(REGIONS)) {
    let count = 0;
    for (let ty = region.y1 + 2; ty < region.y2 - 1; ty += 3) {
      for (let tx = region.x1 + 2; tx < region.x2 - 1; tx += 4) {
        if (hash01(tx, ty, 401) < 0.56) continue;
        const tile = tileAt(tx, ty);
        if (["W", "V", TILES.frozenDeep, TILES.desertCliff, TILES.snowCliff, "D", "P", TILES.snowPath, TILES.swampPath, TILES.boardwalk].includes(tile)) continue;
        const kind = region.id === "desert" ? (hash01(tx, ty, 409) > 0.55 ? "smallCactus" : "sandTuft") : region.id === "snow" ? (hash01(tx, ty, 419) > 0.55 ? "snowShrub" : "icePebbles") : (hash01(tx, ty, 421) > 0.55 ? "reeds" : "swampPlants");
        addUnique(decor(`${region.id}-detail-${count++}`, region.id, kind, tx, ty, 28, 24, false));
      }
    }
  }

  function terrainBlockedForBiome(tile, biomeId) {
    return tile === TILES.desertCliff || tile === TILES.snowCliff || tile === TILES.frozenDeep ||
      (biomeId === "desert" && tile === "W") || (biomeId === "swamp" && tile === "V");
  }
  function candidateOverlapsSolid(obj, x, y) {
    const rectangle = { x, y, width: obj.width || 22, height: obj.height || 26 };
    return villageObjects.some((other) => other && other !== obj && other.solid && other.type !== "enemy" && other.type !== "npc" && rectsOverlap(rectangle, other));
  }
  function relocateToNearestSafeTile(obj, region, reserved) {
    const currentTx = Math.floor((obj.x + (obj.width || 1) / 2) / TILE);
    const currentTy = Math.floor((obj.y + (obj.height || 1) / 2) / TILE);
    const currentKey = `${currentTx}:${currentTy}`;
    if (!terrainBlockedForBiome(tileAt(currentTx, currentTy), region.id) && !candidateOverlapsSolid(obj, obj.x, obj.y) && !reserved.has(currentKey)) {
      reserved.add(currentKey);
      return;
    }
    for (let radius = 1; radius <= 14; radius += 1) {
      for (let dy = -radius; dy <= radius; dy += 1) {
        for (let dx = -radius; dx <= radius; dx += 1) {
          if (Math.max(Math.abs(dx), Math.abs(dy)) !== radius) continue;
          const tx = currentTx + dx;
          const ty = currentTy + dy;
          const key = `${tx}:${ty}`;
          if (!contains(region, tx, ty) || reserved.has(key) || terrainBlockedForBiome(tileAt(tx, ty), region.id)) continue;
          const nextX = tx * TILE + 5;
          const nextY = ty * TILE + 4;
          if (candidateOverlapsSolid(obj, nextX, nextY)) continue;
          moveTo(obj, tx, ty, 5, 4);
          reserved.add(key);
          return;
        }
      }
    }
  }

  // Garante que missões, criaturas e coletáveis nunca nasçam em água/penhasco.
  for (const region of Object.values(REGIONS)) {
    const reserved = new Set();
    const important = villageObjects.filter((obj) => {
      if (!obj || !["npc", "enemy", "collectible", "crystal"].includes(obj.type)) return false;
      return objectRegion(obj)?.id === region.id;
    });
    important.sort((a, b) => (a.type === "npc" ? -1 : 0) - (b.type === "npc" ? -1 : 0));
    important.forEach((obj) => relocateToNearestSafeTile(obj, region, reserved));
  }

  // ----------------------------------------------------------------
  // Autotile orgânico em chunks, com cache limitado para mobile.
  // ----------------------------------------------------------------
  function createGradient(g, x1, y1, x2, y2, colors) {
    const gradient = g.createLinearGradient(x1, y1, x2, y2);
    colors.forEach(([stop, color]) => gradient.addColorStop(stop, color));
    return gradient;
  }
  function isPathTile(tile) {
    return ["D", "P", TILES.snowPath, TILES.swampPath, TILES.boardwalk].includes(tile);
  }
  function isWaterTile(tile) {
    return ["W", "V", "L", TILES.frozenDeep].includes(tile);
  }
  function organicSurface(g, x, y, tx, ty, targetTest, outer, inner, highlight) {
    const n = targetTest(tileAt(tx, ty - 1));
    const s = targetTest(tileAt(tx, ty + 1));
    const w = targetTest(tileAt(tx - 1, ty));
    const e = targetTest(tileAt(tx + 1, ty));
    const cx = x + TILE / 2;
    const cy = y + TILE / 2;
    function paint(color, radius) {
      g.fillStyle = color;
      g.beginPath(); g.arc(cx, cy, radius, 0, Math.PI * 2); g.fill();
      if (n) g.fillRect(cx - radius, y, radius * 2, TILE / 2 + 2);
      if (s) g.fillRect(cx - radius, cy - 2, radius * 2, TILE / 2 + 2);
      if (w) g.fillRect(x, cy - radius, TILE / 2 + 2, radius * 2);
      if (e) g.fillRect(cx - 2, cy - radius, TILE / 2 + 2, radius * 2);
      if (n && w) g.fillRect(x, y, TILE / 2 + 2, TILE / 2 + 2);
      if (n && e) g.fillRect(cx - 2, y, TILE / 2 + 2, TILE / 2 + 2);
      if (s && w) g.fillRect(x, cy - 2, TILE / 2 + 2, TILE / 2 + 2);
      if (s && e) g.fillRect(cx - 2, cy - 2, TILE / 2 + 2, TILE / 2 + 2);
    }
    paint(outer, 13.5);
    paint(inner, 10.5);
    g.fillStyle = highlight;
    g.fillRect(x + 7, y + 8, 7, 2);
    if (hash01(tx, ty, 503) > 0.45) g.fillRect(x + 18, y + 21, 6, 2);
  }
  function drawDesertBase(g, x, y, tx, ty) {
    g.fillStyle = hash01(tx, ty, 511) > 0.5 ? "#dfb85f" : "#e9c66e";
    g.fillRect(x, y, TILE, TILE);
    g.fillStyle = "rgba(174,112,57,.26)";
    g.fillRect(x + 4, y + 9, 8, 2); g.fillRect(x + 19, y + 23, 7, 2);
    if (hash01(tx, ty, 521) > 0.66) { g.fillStyle = "#c59248"; g.fillRect(x + 14, y + 15, 3, 3); }
  }
  function drawSnowBase(g, x, y, tx, ty) {
    g.fillStyle = createGradient(g, x, y, x, y + TILE, [[0,"#f4fbff"],[.62,"#dfedfa"],[1,"#c8dff1"]]);
    g.fillRect(x, y, TILE, TILE);
    g.fillStyle = "rgba(116,163,202,.25)";
    g.fillRect(x + 5, y + 23, 10, 2); g.fillRect(x + 21, y + 9, 4, 3);
    if (hash01(tx, ty, 541) > 0.72) { g.fillStyle = "rgba(255,255,255,.78)"; g.fillRect(x + 8, y + 6, 9, 2); }
  }
  function drawSwampBase(g, x, y, tx, ty) {
    g.fillStyle = hash01(tx, ty, 551) > .5 ? "#344d35" : "#3d593a";
    g.fillRect(x, y, TILE, TILE);
    g.fillStyle = "rgba(104,132,62,.32)";
    g.fillRect(x + 3, y + 6, 9, 3); g.fillRect(x + 19, y + 18, 8, 3);
    g.fillStyle = "rgba(19,34,26,.28)"; g.fillRect(x + 7, y + 26, 14, 3);
  }
  function drawPath(g, region, x, y, tx, ty, tile) {
    if (region.id === "desert") drawDesertBase(g, x, y, tx, ty);
    else if (region.id === "snow") drawSnowBase(g, x, y, tx, ty);
    else drawSwampBase(g, x, y, tx, ty);
    if (tile === TILES.boardwalk) {
      organicSurface(g, x, y, tx, ty, (value) => value === TILES.boardwalk, "#4a3427", "#8b6039", "rgba(234,183,104,.42)");
      g.fillStyle = "rgba(62,38,27,.52)"; g.fillRect(x + 7, y + 4, 2, 24); g.fillRect(x + 20, y + 4, 2, 24);
      return;
    }
    if (region.id === "snow") organicSurface(g, x, y, tx, ty, isPathTile, "#aebdca", "#d7e2e9", "rgba(255,255,255,.55)");
    else if (region.id === "swamp") organicSurface(g, x, y, tx, ty, isPathTile, "#43382d", "#756044", "rgba(174,145,90,.34)");
    else organicSurface(g, x, y, tx, ty, isPathTile, "#bd8845", "#d9aa5c", "rgba(255,225,144,.38)");
  }
  function drawWater(g, region, x, y, tx, ty, tile) {
    if (region.id === "desert") drawDesertBase(g, x, y, tx, ty);
    else if (region.id === "snow") drawSnowBase(g, x, y, tx, ty);
    else drawSwampBase(g, x, y, tx, ty);
    if (region.id === "desert") organicSurface(g, x, y, tx, ty, isWaterTile, "#7a9c7b", "#2d91a7", "rgba(196,248,225,.45)");
    else if (region.id === "snow") {
      const deep = tile === TILES.frozenDeep;
      organicSurface(g, x, y, tx, ty, isWaterTile, deep ? "#4e83a7" : "#86bad2", deep ? "#25678d" : "#a9def1", "rgba(234,255,255,.54)");
      g.strokeStyle = "rgba(85,157,198,.38)"; g.beginPath(); g.moveTo(x+5,y+24); g.lineTo(x+15,y+11); g.lineTo(x+27,y+18); g.stroke();
    } else {
      organicSurface(g, x, y, tx, ty, isWaterTile, "#172c26", "#24533b", "rgba(151,205,88,.27)");
      if (hash01(tx,ty,557) > .54) { g.fillStyle="#66874b"; g.fillRect(x+9,y+12,8,3); g.fillRect(x+12,y+9,3,8); }
    }
  }
  function drawCliff(g, region, x, y, tx, ty) {
    if (region.id === "desert") drawDesertBase(g,x,y,tx,ty); else drawSnowBase(g,x,y,tx,ty);
    const snow = region.id === "snow";
    g.fillStyle = snow ? "#547792" : "#80542f";
    g.fillRect(x + 1, y + 7, TILE - 2, TILE - 7);
    g.fillStyle = snow ? "#6e96b3" : "#a46d39";
    g.fillRect(x + 4, y + 10, 10, 18); g.fillRect(x + 18, y + 13, 9, 16);
    g.fillStyle = snow ? "#e9f7ff" : "#d8a657";
    g.fillRect(x, y + 3, TILE, 8); g.fillRect(x + 4, y, 10, 7); g.fillRect(x + 19, y + 1, 9, 7);
    g.fillStyle = snow ? "rgba(166,220,246,.55)" : "rgba(255,212,119,.28)";
    g.fillRect(x + 3, y + 12, 3, 14); g.fillRect(x + 17, y + 15, 2, 11);
  }
  function drawRuin(g, region, x, y, tx, ty) {
    if (region.id === "desert") drawDesertBase(g,x,y,tx,ty); else if (region.id === "snow") drawSnowBase(g,x,y,tx,ty); else drawSwampBase(g,x,y,tx,ty);
    const main = region.id === "desert" ? "#a88656" : region.id === "snow" ? "#768c9d" : "#566151";
    g.fillStyle = main; g.fillRect(x+2,y+2,28,28);
    g.fillStyle = "rgba(234,226,191,.24)"; g.fillRect(x+4,y+4,11,7); g.fillRect(x+18,y+14,10,7);
    g.fillStyle = "rgba(37,39,35,.35)"; g.fillRect(x+1,y+11,30,2); g.fillRect(x+15,y+1,2,30);
  }
  function drawMud(g, x, y, tx, ty) {
    drawSwampBase(g,x,y,tx,ty);
    organicSurface(g,x,y,tx,ty,(value)=>value==="U","#3d342d","#654c38","rgba(177,137,83,.25)");
    g.fillStyle="rgba(18,27,23,.28)"; g.fillRect(x+9,y+19,13,4);
  }
  function drawSandTrap(g,x,y,tx,ty) {
    drawDesertBase(g,x,y,tx,ty);
    organicSurface(g,x,y,tx,ty,(value)=>value==="X","#b4773e","#9b6039","rgba(244,185,92,.28)");
    g.strokeStyle="rgba(80,45,31,.42)"; g.beginPath(); g.arc(x+16,y+16,7,0,Math.PI*2); g.stroke();
  }
  function drawTerrainTile(g, region, tx, ty, lx, ly) {
    const x = lx * TILE;
    const y = ly * TILE;
    const tile = tileAt(tx,ty);
    if (tile === TILES.desertCliff || tile === TILES.snowCliff) return drawCliff(g,region,x,y,tx,ty);
    if (isWaterTile(tile)) return drawWater(g,region,x,y,tx,ty,tile);
    if (isPathTile(tile)) return drawPath(g,region,x,y,tx,ty,tile);
    if (tile === "P") return drawRuin(g,region,x,y,tx,ty);
    if (tile === "U") return drawMud(g,x,y,tx,ty);
    if (tile === "X") return drawSandTrap(g,x,y,tx,ty);
    if (region.id === "desert") drawDesertBase(g,x,y,tx,ty);
    else if (region.id === "snow") drawSnowBase(g,x,y,tx,ty);
    else drawSwampBase(g,x,y,tx,ty);
  }
  function chunkKey(region, cx, cy) { return `${region.id}:${cx}:${cy}`; }
  function terrainChunk(region, cx, cy) {
    const key = chunkKey(region,cx,cy);
    if (terrainCache.has(key)) { const value=terrainCache.get(key); terrainCache.delete(key); terrainCache.set(key,value); return value; }
    const sx = Math.max(region.x1, cx * CHUNK_TILES);
    const sy = Math.max(region.y1, cy * CHUNK_TILES);
    const ex = Math.min(region.x2, cx * CHUNK_TILES + CHUNK_TILES - 1);
    const ey = Math.min(region.y2, cy * CHUNK_TILES + CHUNK_TILES - 1);
    if (sx > ex || sy > ey) return null;
    const c = document.createElement("canvas"); c.width=(ex-sx+1)*TILE; c.height=(ey-sy+1)*TILE;
    const g=c.getContext("2d",{alpha:false}); if(!g) return null; g.imageSmoothingEnabled=false;
    for(let ty=sy;ty<=ey;ty+=1) for(let tx=sx;tx<=ex;tx+=1) drawTerrainTile(g,region,tx,ty,tx-sx,ty-sy);
    const item={canvas:c,x:sx*TILE,y:sy*TILE}; terrainCache.set(key,item);
    const mobile=(typeof isMobile!=="undefined"&&isMobile)||document.body?.classList?.contains("is-mobile");
    const max=mobile?14:30; while(terrainCache.size>max) terrainCache.delete(terrainCache.keys().next().value);
    return item;
  }
  function drawRegionTerrain(region) {
    if(currentScene!=="village") return;
    const viewW=typeof getZoomedViewWidth==="function"?getZoomedViewWidth():canvas.width;
    const viewH=typeof getZoomedViewHeight==="function"?getZoomedViewHeight():canvas.height;
    const left=Math.floor(camera.x/TILE)-1,right=Math.ceil((camera.x+viewW)/TILE)+1,top=Math.floor(camera.y/TILE)-1,bottom=Math.ceil((camera.y+viewH)/TILE)+1;
    if(right<region.x1||left>region.x2||bottom<region.y1||top>region.y2) return;
    const cx1=Math.floor(Math.max(left,region.x1)/CHUNK_TILES),cx2=Math.floor(Math.min(right,region.x2)/CHUNK_TILES);
    const cy1=Math.floor(Math.max(top,region.y1)/CHUNK_TILES),cy2=Math.floor(Math.min(bottom,region.y2)/CHUNK_TILES);
    ctx.save(); ctx.imageSmoothingEnabled=false;
    for(let cy=cy1;cy<=cy2;cy+=1) for(let cx=cx1;cx<=cx2;cx+=1){const item=terrainChunk(region,cx,cy);if(item)ctx.drawImage(item.canvas,item.x,item.y);}
    const mobile=(typeof isMobile!=="undefined"&&isMobile); const count=mobile?5:10; const t=performance.now()/1000;
    if(region.id==="snow") for(let i=0;i<count;i+=1){const px=camera.x+((i*173+t*(12+i%3))%(viewW+80))-40;const py=camera.y+((i*97+t*(25+i%4))%(viewH+70))-35;if(px>=region.x1*TILE&&px<=(region.x2+1)*TILE&&py>=region.y1*TILE&&py<=(region.y2+1)*TILE){ctx.fillStyle="rgba(255,255,255,.62)";ctx.fillRect(px,py,i%4?1:2,i%4?1:2);}}
    if(region.id==="swamp") for(let i=0;i<count-1;i+=1){const px=(region.x1+2+hash01(i,7,601)*(region.x2-region.x1-4))*TILE;const py=(region.y1+2+hash01(i,9,607)*(region.y2-region.y1-4))*TILE;const pulse=.25+(Math.sin(t*2+i)+1)*.16;ctx.fillStyle=`rgba(170,255,91,${pulse})`;ctx.fillRect(px,py,2,2);}
    if(region.id==="desert"&&!mobile) for(let i=0;i<4;i+=1){const py=camera.y+40+i*83+Math.sin(t+i)*4;ctx.strokeStyle="rgba(255,227,158,.12)";ctx.beginPath();ctx.moveTo(camera.x,py);ctx.lineTo(camera.x+viewW,py-5);ctx.stroke();}
    ctx.restore();
  }
  const drawMapBeforeThreeBiomes=typeof drawMap==="function"?drawMap:null;
  drawMap=function drawMapThreeBiomes(){if(drawMapBeforeThreeBiomes)drawMapBeforeThreeBiomes.apply(this,arguments);Object.values(REGIONS).forEach(drawRegionTerrain);};

  // ----------------------------------------------------------------
  // Objetos desenhados por código, sem PNG estático.
  // ----------------------------------------------------------------
  function rect(g,x,y,w,h,color){g.fillStyle=color;g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));}
  function drawTriObject(obj) {
    const x=obj.x,y=obj.y,w=obj.width,h=obj.height,t=performance.now()/1000;
    ctx.save();ctx.imageSmoothingEnabled=false;
    if(obj.kind==="biomeSign"){rect(ctx,x+8,y+9,6,h-9,"#553925");rect(ctx,x,y,w,15,"#946238");rect(ctx,x+3,y+3,w-6,4,"#c08c4b");}
    else if(obj.kind==="desertTemple"||obj.kind==="tombGate"){rect(ctx,x,y+18,w,h-18,"#8c693f");rect(ctx,x+5,y+12,w-10,12,"#b78d50");rect(ctx,x+w*.28,y+35,w*.44,h-35,"#281f1c");for(let px=x+8;px<x+w;px+=28)rect(ctx,px,y+5,12,h-9,"#a57b45");rect(ctx,x,y+h-8,w,8,"#6d4d32");}
    else if(obj.kind==="oasisRim"){ctx.strokeStyle="rgba(77,142,118,.75)";ctx.lineWidth=5;ctx.beginPath();ctx.ellipse(x+w/2,y+h/2,w*.42,h*.38,0,0,Math.PI*2);ctx.stroke();}
    else if(obj.kind==="desertTent"){rect(ctx,x+7,y+17,w-14,h-17,"#744535");ctx.fillStyle="#b45f42";ctx.beginPath();ctx.moveTo(x,y+23);ctx.lineTo(x+w/2,y);ctx.lineTo(x+w,y+23);ctx.fill();rect(ctx,x+w/2-3,y+18,6,h-18,"#392a27");}
    else if(obj.kind==="obelisk"||obj.kind==="frozenColumn"){const snow=obj.kind==="frozenColumn";rect(ctx,x+3,y+9,w-6,h-14,snow?"#728b9f":"#9d7645");rect(ctx,x,y+h-8,w,8,snow?"#a9c5d8":"#c49a58");rect(ctx,x+7,y+13,5,h-26,snow?"#d8edf7":"#e0b96d");ctx.fillStyle=snow?"#dff6ff":"#b98a4d";ctx.beginPath();ctx.moveTo(x+w/2,y);ctx.lineTo(x+w-4,y+12);ctx.lineTo(x+4,y+12);ctx.fill();}
    else if(obj.kind==="brokenColumns"){for(let i=0;i<3;i++){const ph=h-i*7;rect(ctx,x+i*30,y+h-ph,14,ph,"#9e835d");rect(ctx,x+i*30-3,y+h-ph,20,6,"#c0a477");}}
    else if(obj.kind==="bones"){rect(ctx,x+6,y+13,w-12,5,"#d9c89d");rect(ctx,x+17,y+5,7,17,"#eadbb4");rect(ctx,x+w-16,y+8,9,9,"#cbb88d");}
    else if(obj.kind==="palm"){rect(ctx,x+w/2-3,y+8,7,h-7,"#8a6031");for(let i=0;i<5;i++){ctx.fillStyle=i%2?"#3d7f3a":"#529441";ctx.save();ctx.translate(x+w/2,y+9);ctx.rotate((i/5)*Math.PI*2);ctx.fillRect(0,-3,24,7);ctx.restore();}}
    else if(obj.kind==="desertRock"||obj.kind==="mossStone"){const moss=obj.kind==="mossStone";rect(ctx,x+2,y+11,w-4,h-11,moss?"#4d5b4b":"#8c6038");rect(ctx,x+8,y+5,w*.55,h-8,moss?"#66715a":"#b27b42");rect(ctx,x+12,y+8,10,4,moss?"#77944f":"#d09a55");}
    else if(obj.kind==="smallCactus"){rect(ctx,x+11,y+4,7,20,"#3f7f3b");rect(ctx,x+5,y+10,8,6,"#4b9042");rect(ctx,x+17,y+8,7,6,"#4b9042");}
    else if(obj.kind==="sandTuft"){rect(ctx,x+6,y+16,18,3,"#a77735");rect(ctx,x+10,y+10,3,10,"#b8873f");rect(ctx,x+19,y+12,3,8,"#b8873f");}
    else if(obj.kind==="iceCaveGate"){rect(ctx,x,y+20,w,h-20,"#537690");rect(ctx,x+8,y+12,w-16,15,"#b9dced");ctx.fillStyle="#17394e";ctx.beginPath();ctx.arc(x+w/2,y+h,Math.min(w*.25,h*.55),Math.PI,Math.PI*2);ctx.fill();rect(ctx,x+w*.12,y+4,12,35,"#d9f5ff");rect(ctx,x+w*.78,y+1,10,38,"#bce8fa");}
    else if(obj.kind==="frozenRuin"){rect(ctx,x,y+20,w,h-20,"#647887");for(let px=x+7;px<x+w-8;px+=25){rect(ctx,px,y+3,12,h-10,"#8299a7");rect(ctx,px-3,y,18,7,"#d7e8ef");}rect(ctx,x+w*.35,y+h*.38,w*.3,h*.62,"#263d4d");}
    else if(obj.kind==="woodBridge"||obj.kind==="brokenWoodBridge"){const broken=obj.kind==="brokenWoodBridge";rect(ctx,x,y+4,w,h-8,"#4a3428");for(let px=x+3,index=0;px<x+w-3;px+=15,index++){if(broken&&index%7===4)continue;rect(ctx,px,y+7,12,h-14,index%2?"#765034":"#8b6039");rect(ctx,px+10,y+7,2,h-14,"#432d25");}rect(ctx,x,y+2,w,4,"#a17142");rect(ctx,x,y+h-6,w,4,"#5d3d2a");}
    else if(obj.kind==="iceStairs"){for(let i=0;i<6;i++)rect(ctx,x+2+i*2,y+i*(h/7),w-4-i*4,6,i%2?"#8ca9bc":"#b5cfdd");}
    else if(obj.kind==="iceCrystal"){const pulse=.7+Math.sin(t*2.5+x)*.18;ctx.fillStyle=`rgba(104,220,255,${.16*pulse})`;ctx.fillRect(x-7,y-7,w+14,h+14);ctx.fillStyle="#4abce8";ctx.beginPath();ctx.moveTo(x+w/2,y);ctx.lineTo(x+w,y+h*.7);ctx.lineTo(x+w*.55,y+h);ctx.lineTo(x,y+h*.7);ctx.fill();rect(ctx,x+w*.42,y+6,4,h*.65,"#d9fbff");}
    else if(obj.kind==="snowCamp"){ctx.fillStyle="#8b6b48";ctx.beginPath();ctx.moveTo(x,y+h*.65);ctx.lineTo(x+w*.5,y);ctx.lineTo(x+w,y+h*.65);ctx.fill();rect(ctx,x+5,y+h*.65,w-10,h*.35,"#5e4938");rect(ctx,x+w*.7,y+h*.64,8,8,"#ff9b43");}
    else if(obj.kind==="snowPine"){rect(ctx,x+w/2-3,y+13,7,h-10,"#584534");for(let i=0;i<3;i++){const yy=y+i*8;ctx.fillStyle=i%2?"#315f58":"#244f4a";ctx.beginPath();ctx.moveTo(x+w/2,yy);ctx.lineTo(x+w-i*3,y+18+i*6);ctx.lineTo(x+i*3,y+18+i*6);ctx.fill();rect(ctx,x+5+i*2,yy+8,w-10-i*4,4,"#eaf7ff");}}
    else if(obj.kind==="snowShrub"){rect(ctx,x+4,y+13,w-8,10,"#567263");rect(ctx,x+7,y+9,w-14,7,"#edf8ff");}
    else if(obj.kind==="icePebbles"){rect(ctx,x+5,y+15,8,6,"#8bb3c8");rect(ctx,x+15,y+12,10,8,"#b8d7e5");rect(ctx,x+18,y+13,4,2,"#effcff");}
    else if(obj.kind==="swampRuin"){rect(ctx,x,y+16,w,h-16,"#454e45");for(let px=x+6;px<x+w-8;px+=24){rect(ctx,px,y+4,12,h-8,"#66705e");rect(ctx,px-2,y,17,7,"#718552");}rect(ctx,x+w*.36,y+h*.4,w*.28,h*.6,"#17251e");}
    else if(obj.kind==="giantRoot"){ctx.strokeStyle="#5a3d2a";ctx.lineWidth=11;ctx.beginPath();ctx.moveTo(x,y+h);ctx.bezierCurveTo(x+w*.25,y,x+w*.65,y+h*1.2,x+w,y+4);ctx.stroke();ctx.strokeStyle="#81603a";ctx.lineWidth=3;ctx.stroke();}
    else if(obj.kind==="deadTree"){rect(ctx,x+w/2-4,y+7,9,h-5,"#513728");ctx.strokeStyle="#6c4a31";ctx.lineWidth=5;for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(x+w/2,y+14);ctx.lineTo(x+(i%2?w-2:2),y+i*6);ctx.stroke();}}
    else if(obj.kind==="fallenLog"){rect(ctx,x,y+8,w,h-12,"#553a29");rect(ctx,x+5,y+11,w-12,5,"#745038");rect(ctx,x+w-12,y+6,12,h-8,"#9a7245");rect(ctx,x+w-9,y+10,6,h-16,"#5f422d");}
    else if(obj.kind==="greenWisp"){const pulse=.45+(Math.sin(t*3+x)+1)*.18;ctx.fillStyle=`rgba(154,255,94,${pulse*.24})`;ctx.fillRect(x-8,y-8,w+16,h+16);ctx.fillStyle=`rgba(204,255,126,${pulse})`;ctx.fillRect(x+4,y+4,4,4);ctx.fillStyle="#efffcf";ctx.fillRect(x+5,y+5,2,2);}
    else if(obj.kind==="reeds"){for(let i=0;i<6;i++){rect(ctx,x+3+i*4,y+6+(i%2)*5,2,17-(i%2)*5,"#6c8b48");rect(ctx,x+2+i*4,y+5+(i%2)*5,4,3,"#7d5937");}}
    else if(obj.kind==="swampPlants"){rect(ctx,x+4,y+14,w-8,8,"#315c39");rect(ctx,x+8,y+9,7,10,"#558248");rect(ctx,x+18,y+11,6,8,"#6d934d");}
    ctx.restore();
  }
  const drawObjectBeforeThreeBiomes=typeof drawObject==="function"?drawObject:null;
  drawObject=function drawObjectThreeBiomes(obj){if(obj?.type==="triBiomeDecor")return drawTriObject(obj);return drawObjectBeforeThreeBiomes?drawObjectBeforeThreeBiomes.apply(this,arguments):undefined;};

  // ----------------------------------------------------------------
  // Colisao, save, nomes de area e atualizacao das listas ativas.
  // ----------------------------------------------------------------
  function blockedTile(tile, region) {
    if (!region) return false;
    if (tile===TILES.desertCliff||tile===TILES.snowCliff||tile===TILES.frozenDeep) return true;
    if (region.id==="desert"&&tile==="W") return true;
    if (region.id==="swamp"&&tile==="V") return true;
    return false;
  }
  function rectHitsBlocked(rectangle) {
    const left=Math.floor(rectangle.x/TILE),right=Math.floor((rectangle.x+rectangle.width-1)/TILE),top=Math.floor(rectangle.y/TILE),bottom=Math.floor((rectangle.y+rectangle.height-1)/TILE);
    for(let ty=top;ty<=bottom;ty+=1)for(let tx=left;tx<=right;tx+=1){const region=regionAt(tx,ty);if(region&&blockedTile(tileAt(tx,ty),region))return true;}
    return false;
  }
  const canMoveBeforeThreeBiomes=typeof canMoveTo==="function"?canMoveTo:null;
  canMoveTo=function canMoveToThreeBiomes(nextX,nextY){if(currentScene==="village"){const rectangle=typeof getPlayerRect==="function"?getPlayerRect(nextX,nextY):{x:nextX,y:nextY,width:player.width,height:player.height};if(rectHitsBlocked(rectangle))return false;}return canMoveBeforeThreeBiomes?canMoveBeforeThreeBiomes.apply(this,arguments):true;};
  const canEntityMoveBeforeThreeBiomes=typeof canEntityMoveTo==="function"?canEntityMoveTo:null;
  canEntityMoveTo=function canEntityMoveToThreeBiomes(entity,nextX,nextY){const rectangle={x:nextX,y:nextY,width:entity?.width||TILE,height:entity?.height||TILE};if(currentScene==="village"&&rectHitsBlocked(rectangle))return false;return canEntityMoveBeforeThreeBiomes?canEntityMoveBeforeThreeBiomes.apply(this,arguments):true;};
  if(oldSaveKey)getSaveObjectKey=function getSaveObjectKeyThreeBiomes(obj){return obj?.erThreeBiomesOldSaveKey||oldSaveKey(obj);};

  const getAreaNameBeforeThreeBiomes=typeof getAreaName==="function"?getAreaName:null;
  getAreaName=function getAreaNameThreeBiomes(){if(currentScene==="village"){const tx=Math.floor((player.x+player.width/2)/TILE),ty=Math.floor((player.y+player.height/2)/TILE);const region=regionAt(tx,ty);if(region)return region.title;}return getAreaNameBeforeThreeBiomes?getAreaNameBeforeThreeBiomes.apply(this,arguments):"Vila Principal";};

  function refreshLists(){if(currentScene!=="village")return;objects=villageObjects;colliders=villageObjects.filter((obj)=>obj?.solid);interactables=villageObjects.filter((obj)=>obj?.message||obj?.type==="npc");}
  refreshLists();

  window.ETERNAL_RIFT_THREE_BIOMES_STATUS=function threeBiomesStatus(){
    const counts={};
    for(const region of Object.values(REGIONS)){
      const tileCounts={};for(let y=region.y1;y<=region.y2;y+=1)for(let x=region.x1;x<=region.x2;x+=1)tileCounts[tileAt(x,y)]=(tileCounts[tileAt(x,y)]||0)+1;
      counts[region.id]={bounds:{...region},tiles:tileCounts,decorations:villageObjects.filter((obj)=>obj?.type==="triBiomeDecor"&&obj.biome===region.id).length,enemies:villageObjects.filter((obj)=>obj?.type==="enemy"&&objectRegion(obj)?.id===region.id).length};
    }
    return {version:PATCH_ID,regions:counts,referenceImagesUsed:false,mobileOptimized:true};
  };
  try{console.log("Eternal Rift patch carregado:",PATCH_ID,window.ETERNAL_RIFT_THREE_BIOMES_STATUS());}catch(error){}
})();
