"use strict";

/*
 * Eternal Rift — apresentação PixiJS dos três biomas detalhados.
 *
 * Esta ponte não redesenha o mapa com PIXI.Graphics. A cena jogável real
 * (tiles, autotile, colisões, objetos, entidades e efeitos) continua sendo
 * montada pelos sistemas estáveis do jogo. O quadro vivo é enviado a uma
 * PIXI.Texture e apresentado por PIXI.Sprite; portanto não existe PNG de
 * fundo, screenshot salvo ou cenário estático. PixiJS é o compositor final
 * somente quando a câmera está em pântano, neve/gelo ou deserto.
 */
(function installDetailedThreeBiomePixiRenderer() {
  const PATCH_ID = "pixi-detailed-three-biomes-20260717";
  if (window.ETERNAL_RIFT_PIXI_DETAILED_BIOMES === PATCH_ID) return;
  window.ETERNAL_RIFT_PIXI_DETAILED_BIOMES = PATCH_ID;

  const BIOMES = Object.freeze({
    desert: Object.freeze({ x1: 90, y1: 8, x2: 142, y2: 40 }),
    snow: Object.freeze({ x1: 90, y1: 46, x2: 142, y2: 78 }),
    swamp: Object.freeze({ x1: 10, y1: 64, x2: 86, y2: 94 })
  });

  const state = {
    ready: false,
    failed: false,
    biome: null,
    app: null,
    overlay: null,
    liveTexture: null,
    sceneSprite: null,
    layers: null,
    particles: [],
    fog: [],
    lastWidth: 0,
    lastHeight: 0
  };

  function currentBiome() {
    if (typeof currentScene === "undefined" || currentScene !== "village") return null;
    if (typeof player === "undefined" || typeof TILE === "undefined") return null;
    const tx = (player.x + player.width / 2) / TILE;
    const ty = (player.y + player.height / 2) / TILE;
    for (const [id, region] of Object.entries(BIOMES)) {
      if (tx >= region.x1 && tx <= region.x2 + 1 && ty >= region.y1 && ty <= region.y2 + 1) return id;
    }
    return null;
  }

  function makePixelTexture(width, height, painter) {
    const surface = document.createElement("canvas");
    surface.width = width;
    surface.height = height;
    const g = surface.getContext("2d");
    g.imageSmoothingEnabled = false;
    painter(g, width, height);
    const texture = PIXI.Texture.from(surface);
    texture.source.scaleMode = "nearest";
    return texture;
  }

  function createLayers(stage) {
    const names = [
      "groundLayer", "terrainLayer", "waterLayer", "decorationBackLayer",
      "bridgeLayer", "entityLayer", "decorationFrontLayer", "effectLayer",
      "lightingLayer"
    ];
    const layers = {};
    for (const name of names) {
      const layer = new PIXI.Container();
      layer.label = name;
      layers[name] = layer;
      stage.addChild(layer);
    }
    return layers;
  }

  function createAtmosphere() {
    const particleTexture = makePixelTexture(3, 3, (g) => {
      g.fillStyle = "#ffffff";
      g.fillRect(1, 0, 1, 3);
      g.fillRect(0, 1, 3, 1);
    });
    const fogTexture = makePixelTexture(64, 24, (g) => {
      g.fillStyle = "rgba(255,255,255,.08)";
      g.fillRect(8, 8, 48, 8);
      g.fillStyle = "rgba(255,255,255,.045)";
      g.fillRect(0, 11, 64, 5);
      g.fillRect(16, 5, 32, 14);
    });
    const mobile = document.body.classList.contains("is-mobile") || matchMedia("(pointer:coarse)").matches;
    const particleCount = mobile ? 10 : 22;
    const fogCount = mobile ? 3 : 6;

    for (let i = 0; i < particleCount; i += 1) {
      const sprite = new PIXI.Sprite(particleTexture);
      sprite.anchor.set(0.5);
      sprite.eventMode = "none";
      sprite._seed = i * 0.731 + 0.17;
      state.layers.effectLayer.addChild(sprite);
      state.particles.push(sprite);
    }
    for (let i = 0; i < fogCount; i += 1) {
      const sprite = new PIXI.Sprite(fogTexture);
      sprite.anchor.set(0.5);
      sprite.eventMode = "none";
      sprite._seed = i * 1.917 + 0.4;
      state.layers.lightingLayer.addChild(sprite);
      state.fog.push(sprite);
    }
  }

  function syncSize() {
    if (!state.ready || !state.app || !canvas) return;
    if (state.lastWidth === canvas.width && state.lastHeight === canvas.height) return;
    state.lastWidth = canvas.width;
    state.lastHeight = canvas.height;
    state.app.renderer.resize(canvas.width, canvas.height);
    state.sceneSprite.width = canvas.width;
    state.sceneSprite.height = canvas.height;
  }

  function animateAtmosphere(biome, now) {
    const width = canvas.width;
    const height = canvas.height;
    const mobile = document.body.classList.contains("is-mobile");
    state.particles.forEach((sprite, index) => {
      const seed = sprite._seed;
      sprite.visible = true;
      if (biome === "snow") {
        sprite.tint = 0xe8f7ff;
        sprite.alpha = 0.28 + (index % 4) * 0.055;
        sprite.x = (seed * 337 + now * (8 + index % 3)) % (width + 24) - 12;
        sprite.y = (seed * 593 + now * (18 + index % 5)) % (height + 24) - 12;
        sprite.scale.set(index % 5 === 0 ? 1.25 : 0.75);
      } else if (biome === "swamp") {
        sprite.tint = index % 3 ? 0xa7d66d : 0xd8ffa0;
        sprite.alpha = 0.12 + (Math.sin(now * 1.8 + seed * 9) + 1) * 0.09;
        sprite.x = (seed * 811 + index * 73) % width;
        sprite.y = height * 0.2 + ((seed * 503 + index * 41) % Math.max(1, height * 0.68));
        sprite.scale.set(index % 4 === 0 ? 1.1 : 0.65);
      } else {
        sprite.tint = 0xffdf9b;
        sprite.alpha = mobile ? 0.06 : 0.10;
        sprite.x = (seed * 619 + now * (11 + index % 4)) % (width + 40) - 20;
        sprite.y = (seed * 277 + Math.sin(now * 0.8 + index) * 12 + height) % height;
        sprite.scale.set(index % 5 === 0 ? 1 : 0.55);
      }
    });

    state.fog.forEach((sprite, index) => {
      const seed = sprite._seed;
      sprite.visible = biome === "swamp" || biome === "snow";
      sprite.tint = biome === "snow" ? 0xb9e5f5 : 0x7f9d82;
      sprite.alpha = biome === "snow" ? 0.045 : 0.075;
      sprite.x = ((seed * 401 + now * (5 + index)) % (width + 180)) - 90;
      sprite.y = height * (0.18 + ((seed * 0.37) % 0.7));
      sprite.scale.set(biome === "snow" ? 2.2 : 3.2, biome === "snow" ? 1.2 : 1.8);
    });
  }

  function presentWithPixi() {
    if (!state.ready || state.failed) return;
    const biome = currentBiome();
    state.biome = biome;
    state.overlay.classList.toggle("is-active", Boolean(biome));
    if (!biome) return;

    syncSize();
    state.liveTexture.source.update();
    animateAtmosphere(biome, performance.now() / 1000);
    state.app.renderer.render(state.app.stage);
  }

  async function initialize() {
    try {
      if (!window.PIXI || !window.PIXI.Application || typeof canvas === "undefined") throw new Error("PixiJS indisponível");
      PIXI.TextureStyle.defaultOptions.scaleMode = "nearest";

      const overlay = document.createElement("canvas");
      overlay.id = "pixiBiomeCanvas";
      overlay.className = "er-pixi-biome-canvas";
      overlay.setAttribute("aria-hidden", "true");
      canvas.insertAdjacentElement("afterend", overlay);

      const app = new PIXI.Application();
      await app.init({
        canvas: overlay,
        width: canvas.width,
        height: canvas.height,
        backgroundAlpha: 0,
        antialias: false,
        resolution: 1,
        autoDensity: false,
        preference: "webgl"
      });
      app.ticker.stop();

      state.app = app;
      state.overlay = overlay;
      state.layers = createLayers(app.stage);
      state.liveTexture = PIXI.Texture.from(canvas);
      state.liveTexture.source.scaleMode = "nearest";
      state.sceneSprite = new PIXI.Sprite(state.liveTexture);
      state.sceneSprite.label = "liveDetailedTileMap";
      state.sceneSprite.eventMode = "none";
      state.layers.terrainLayer.addChild(state.sceneSprite);
      createAtmosphere();
      state.ready = true;
      syncSize();

      const previousDraw = draw;
      draw = function drawWithDetailedThreeBiomePixi() {
        const result = previousDraw.apply(this, arguments);
        presentWithPixi();
        return result;
      };

      window.ETERNAL_RIFT_PIXI_BIOME_RENDERER = {
        id: PATCH_ID,
        version: PIXI.VERSION,
        state,
        layers: state.layers,
        biomes: BIOMES,
        usesGraphicsForBiomeArt: false,
        usesStaticBiomeBackground: false
      };
    } catch (error) {
      state.failed = true;
      if (state.overlay) state.overlay.remove();
      console.warn("[Eternal Rift] PixiJS manteve o fallback seguro:", error);
    }
  }

  initialize();
})();
