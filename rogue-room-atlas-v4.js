"use strict";

/*
 * Quarto Rogue V4 — arte final por tiles/sprites reais.
 *
 * O atlas contém peças independentes; nunca é desenhado inteiro e nunca é
 * usado como fundo. Piso, paredes e cada móvel são recortados em sprites
 * separados e posicionados no mapa jogável já existente. Formas vetoriais
 * ficam limitadas a sombra, iluminação e máscara, nunca à arte do cenário.
 */
(function installRogueRoomAtlasV4() {
  if (window.ETERNAL_RIFT_DUAL_PLAYER_HOMES) return;
  const BUILD = "rogue-room-atlas-v4-real-sprites-20260717";
  const ATLAS_URL = `assets/rogue-room-atlas-v4.png?v=${BUILD}`;
  const atlas = new Image();
  atlas.decoding = "async";
  atlas.src = ATLAS_URL;

  const F = Object.freeze({
    floor:        { x: 52,   y: 58,  w: 220, h: 224 },
    wall:         { x: 346,  y: 50,  w: 105, h: 239 },
    beam:         { x: 451,  y: 34,  w: 38,  h: 255 },
    bed:          { x: 665,  y: 34,  w: 199, h: 272 },
    rug:          { x: 943,  y: 51,  w: 260, h: 242 },
    bannerMasks:  { x: 69,   y: 355, w: 187, h: 240 },
    clothes:      { x: 360,  y: 355, w: 214, h: 237 },
    weapons:      { x: 681,  y: 348, w: 175, h: 229 },
    bookshelf:    { x: 971,  y: 337, w: 207, h: 277 },
    planningDesk: { x: 46,   y: 665, w: 236, h: 219 },
    alchemy:      { x: 348,  y: 660, w: 253, h: 224 },
    divider:      { x: 666,  y: 638, w: 206, h: 252 },
    candle:       { x: 1029, y: 647, w: 112, h: 246 },
    dummy:        { x: 38,   y: 918, w: 255, h: 260 },
    storage:      { x: 340,  y: 954, w: 247, h: 198 },
    plant:        { x: 646,  y: 958, w: 105, h: 221 },
    cabinet:      { x: 748,  y: 965, w: 119, h: 214 },
    exit:         { x: 914,  y: 934, w: 311, h: 270 }
  });

  const kindFrame = Object.freeze({
    forceRogueRug: "rug",
    forceRogueBed: "bed",
    forceRogueBanner: "bannerMasks",
    forceRogueScreen: "divider",
    forceRogueCandle: "candle",
    forceRogueDummy: "dummy",
    forceRogueFloorBlades: "weapons",
    forceRogueWardrobe: "clothes",
    forceRogueClothes: "clothes",
    forceRogueWeapons: "weapons",
    forceRogueBooks: "bookshelf",
    forceRogueMap: "planningDesk",
    forceRogueDesk: "planningDesk",
    forceRogueTable: "planningDesk",
    forceRogueAlchemy: "alchemy",
    forceRogueStorage: "storage",
    forceRoguePlant: "plant",
    forceRogueExit: "exit"
  });

  function ready() {
    return atlas.complete && atlas.naturalWidth > 0 && atlas.naturalHeight > 0;
  }

  function sprite(frameName, dx, dy, dw, dh, alpha = 1) {
    const f = F[frameName];
    if (!f || !ready()) return false;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(atlas, f.x, f.y, f.w, f.h,
      Math.round(dx), Math.round(dy), Math.round(dw), Math.round(dh));
    ctx.restore();
    return true;
  }

  function spriteContained(frameName, box, options = {}) {
    const f = F[frameName];
    if (!f || !ready()) return false;
    const widthScale = Number(options.widthScale || 1);
    const maxW = box.width * widthScale;
    const maxH = box.height * Number(options.heightScale || 1);
    const scale = Math.min(maxW / f.w, maxH / f.h);
    const dw = Math.max(1, f.w * scale);
    const dh = Math.max(1, f.h * scale);
    const dx = box.x + box.width / 2 - dw / 2 + Number(options.offsetX || 0);
    const dy = options.anchorTop
      ? box.y + Number(options.offsetY || 0)
      : box.y + box.height - dh + Number(options.offsetY || 0);
    return sprite(frameName, dx, dy, dw, dh, options.alpha ?? 1);
  }

  function shadowFor(obj, widthFactor = 0.78) {
    ctx.save();
    ctx.globalAlpha = 0.26;
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.ellipse(
      obj.x + obj.width / 2,
      obj.y + obj.height - 3,
      Math.max(8, obj.width * widthFactor / 2),
      Math.max(3, obj.height * 0.055),
      0, 0, Math.PI * 2
    );
    ctx.fill();
    ctx.restore();
  }

  function candleGlow(obj) {
    const cx = obj.x + obj.width / 2;
    const cy = obj.y + 7;
    const radius = 62 + Math.sin(performance.now() / 190) * 4;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    const glow = ctx.createRadialGradient(cx, cy, 1, cx, cy, radius);
    glow.addColorStop(0, "rgba(255,221,133,.34)");
    glow.addColorStop(.34, "rgba(255,157,58,.15)");
    glow.addColorStop(1, "rgba(255,120,24,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
    ctx.restore();
  }

  function drawFloorPatch(dx, dy, size, flip) {
    const f = F.floor;
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    if (flip) {
      ctx.translate(dx + size, dy);
      ctx.scale(-1, 1);
      ctx.drawImage(atlas, f.x, f.y, f.w, f.h, 0, 0, size, size);
    } else {
      ctx.drawImage(atlas, f.x, f.y, f.w, f.h, dx, dy, size, size);
    }
    ctx.restore();
  }

  function drawAtlasBackdrop() {
    const W = HOME_WIDTH;
    const H = HOME_HEIGHT;
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = "#08070a";
    ctx.fillRect(0, 0, W, H);

    // groundLayer: patches of the actual wood floor asset aligned to the
    // game's 32px tile grid. Each patch spans four logical tiles.
    const patch = TILE * 4;
    for (let y = TILE * 3; y < H - TILE; y += patch) {
      for (let x = TILE; x < W - TILE; x += patch) {
        drawFloorPatch(x, y, patch, ((x / patch + y / patch) & 1) === 1);
      }
    }

    // terrainLayer: real wall and timber sprites. The atlas is sampled in
    // independent pieces; it is never displayed as one room image.
    for (let x = TILE; x < W - TILE; x += TILE * 3) {
      sprite("wall", x, 0, TILE * 3, TILE * 4);
    }
    for (let x = TILE; x < W - TILE; x += TILE * 4) {
      sprite("beam", x - 5, 0, 20, TILE * 4);
    }
    for (let y = TILE * 4; y < H - TILE; y += TILE * 3) {
      sprite("wall", 0, y, TILE, TILE * 3);
      sprite("wall", W - TILE, y, TILE, TILE * 3);
    }
    for (let x = 0; x < W; x += TILE * 3) {
      if (x >= TILE * 12 && x <= TILE * 16) continue;
      sprite("wall", x, H - TILE, TILE * 3, TILE);
    }

    // Soft ambient shade only; this is a lighting layer, not scenery art.
    const shade = ctx.createLinearGradient(0, 0, 0, H);
    shade.addColorStop(0, "rgba(8,5,10,.38)");
    shade.addColorStop(.28, "rgba(8,5,10,.10)");
    shade.addColorStop(1, "rgba(4,3,7,.24)");
    ctx.fillStyle = shade;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  function drawAtlasFurniture(obj) {
    const frameName = kindFrame[obj.kind];
    if (!frameName || !ready()) return false;
    const box = { x: obj.x, y: obj.y, width: obj.width, height: obj.height };

    if (frameName === "rug") {
      sprite("rug", obj.x + 2, obj.y + 2, obj.width - 4, obj.height - 4, .96);
      return true;
    }
    if (frameName === "exit") {
      spriteContained("exit", { x: obj.x - TILE, y: obj.y - TILE * 3, width: obj.width + TILE * 2, height: TILE * 4 }, { widthScale: 1, heightScale: 1 });
      return true;
    }

    shadowFor(obj, frameName === "candle" ? .35 : .82);
    const options = { widthScale: 1, heightScale: 1 };
    if (frameName === "bed") { options.widthScale = 1.12; options.heightScale = 1.45; }
    if (frameName === "bannerMasks") { options.heightScale = 1.12; }
    if (frameName === "clothes") { options.widthScale = 1.15; }
    if (frameName === "weapons") { options.widthScale = 1.12; options.heightScale = 1.14; }
    if (frameName === "planningDesk") { options.widthScale = 1.04; options.heightScale = 1.28; }
    if (frameName === "alchemy") { options.widthScale = 1.10; options.heightScale = 1.08; }
    if (frameName === "divider") { options.widthScale = 1.12; }
    if (frameName === "candle") { options.widthScale = 1.25; options.heightScale = 2.25; }
    if (frameName === "dummy") { options.widthScale = 1.28; }
    if (frameName === "storage") { options.widthScale = 1.08; options.heightScale = 1.25; }
    if (frameName === "plant") { options.widthScale = 1.35; options.heightScale = 1.25; }
    spriteContained(frameName, box, options);
    if (frameName === "candle") candleGlow(obj);
    return true;
  }

  window.addEventListener("load", function activateRogueRoomAtlasV4() {
    window.ETERNAL_RIFT_ROGUE_ROOM_ATLAS = BUILD;

    const previousBackdrop = drawInteriorRoomBackdropV2;
    drawInteriorRoomBackdropV2 = function drawRogueRoomAtlasBackdropV4(scene) {
      if (scene !== "home" || !ready()) return previousBackdrop(scene);
      drawAtlasBackdrop();
      return true;
    };

    const previousFurniture = drawFurniture;
    drawFurniture = function drawRogueRoomAtlasFurnitureV4(obj) {
      if (currentScene === "home" && obj?.rogueRoomCoreV3 && drawAtlasFurniture(obj)) return;
      return previousFurniture(obj);
    };

    // The V3 core owns map/collision rebuilding. This final layer replaces
    // only its placeholder renderer with atlas sprites after all scripts load.
    atlas.decode?.().catch(() => {});
  });
})();
