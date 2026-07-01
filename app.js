// Jogo 2D top-down em Canvas puro.
// Tudo e desenhado com formas simples para ficar facil de estudar.

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const miniMapCanvas = document.getElementById("miniMapCanvas");
const miniCtx = miniMapCanvas.getContext("2d");

const startScreen = document.getElementById("startScreen");
const playButton = document.getElementById("playButton");
const continueButton = document.getElementById("continueButton");
const howToButton = document.getElementById("howToButton");
const creditsButton = document.getElementById("creditsButton");
const startMessage = document.getElementById("startMessage");
const characterNameInput = document.getElementById("characterNameInput");
const playerNameEl = document.getElementById("playerName");
const xpHud = document.getElementById("xpHud");
const xpFill = document.getElementById("xpFill");
const playerPositionEl = document.getElementById("playerPosition");
const questProgressEl = document.getElementById("questProgress");
const healthHud = document.getElementById("healthHud");
const manaHud = document.getElementById("manaHud");
const manaFill = document.getElementById("manaFill");
const coinHud = document.getElementById("coinHud");
const weaponHud = document.getElementById("weaponHud");
const oxygenHud = document.getElementById("oxygenHud");
const oxygenFill = document.getElementById("oxygenFill");
const powerHud = document.getElementById("powerHud");
const bossHud = document.getElementById("bossHud");
const bossNameHud = document.getElementById("bossNameHud");
const bossFill = document.getElementById("bossFill");
const resetButton = document.getElementById("resetButton");
const dialogBox = document.getElementById("dialogBox");
const dialogText = document.getElementById("dialogText");
const interactionHint = document.getElementById("interactionHint");
const inventoryPanel = document.getElementById("inventoryPanel");
const inventoryList = document.getElementById("inventoryList");
const closeInventoryButton = document.getElementById("closeInventoryButton");
const inventoryTabs = document.getElementById("inventoryTabs");
const inventoryGrid = document.getElementById("inventoryGrid");
const inventoryEmpty = document.getElementById("inventoryEmpty");
const equipmentSlots = document.getElementById("equipmentSlots");
const itemDetailName = document.getElementById("itemDetailName");
const itemDetailMeta = document.getElementById("itemDetailMeta");
const itemDetailDescription = document.getElementById("itemDetailDescription");
const itemDetailEffect = document.getElementById("itemDetailEffect");
const itemDetailActions = document.getElementById("itemDetailActions");
const shopPanel = document.getElementById("shopPanel");
const shopMessage = document.getElementById("shopMessage");
const buyPotionButton = document.getElementById("buyPotionButton");
const gameOverScreen = document.getElementById("gameOverScreen");
const gameOverResetButton = document.getElementById("gameOverResetButton");
const saveButton = document.getElementById("saveButton");
const infoPanel = document.getElementById("infoPanel");
const infoTitle = document.getElementById("infoTitle");
const infoText = document.getElementById("infoText");
const closeInfoButton = document.getElementById("closeInfoButton");
const touchDirectionButtons = document.querySelectorAll("[data-touch-key]");
const touchActionButton = document.getElementById("touchActionButton");
const touchAttackButton = document.getElementById("touchAttackButton");
const touchInventoryButton = document.getElementById("touchInventoryButton");
const touchFireballButton = document.getElementById("touchFireballButton");
const touchDashButton = document.getElementById("touchDashButton");
const touchShockwaveButton = document.getElementById("touchShockwaveButton");
const touchHealButton = document.getElementById("touchHealButton");
const touchPowerButton = document.getElementById("touchPowerButton");
const touchWeaponButton = document.getElementById("touchWeaponButton");
const touchPower1Button = document.getElementById("touchPower1Button");
const touchPower2Button = document.getElementById("touchPower2Button");
const touchPower3Button = document.getElementById("touchPower3Button");
const touchPower4Button = document.getElementById("touchPower4Button");
const touchPotionButton = document.getElementById("touchPotionButton");
const touchContextLabel = document.getElementById("touchContextLabel");
const joystickBase = document.getElementById("joystickBase");
const joystickStick = document.getElementById("joystickStick");
const orientationHint = document.getElementById("orientationHint");
const mobileFullscreenButton = document.getElementById("mobileFullscreenButton");
const startFullscreenButton = document.getElementById("startFullscreenButton");
const mobilePauseButton = document.getElementById("mobilePauseButton");
const mobileDebugButton = document.getElementById("mobileDebugButton");
const hudMenuButton = document.getElementById("hudMenuButton");
const pausePanel = document.getElementById("pausePanel");
const pauseContinueButton = document.getElementById("pauseContinueButton");
const pauseSaveButton = document.getElementById("pauseSaveButton");
const pauseResetButton = document.getElementById("pauseResetButton");
const pauseHowToButton = document.getElementById("pauseHowToButton");
const pauseMissionsButton = document.getElementById("pauseMissionsButton");
const pauseStatusButton = document.getElementById("pauseStatusButton");
const pauseInventoryButton = document.getElementById("pauseInventoryButton");
const pauseMenuButton = document.getElementById("pauseMenuButton");
const missionsPanel = document.getElementById("missionsPanel");
const missionsList = document.getElementById("missionsList");
const closeMissionsButton = document.getElementById("closeMissionsButton");
const statusPanel = document.getElementById("statusPanel");
const statusList = document.getElementById("statusList");
const closeStatusButton = document.getElementById("closeStatusButton");
const debugPanel = document.getElementById("debugPanel");
const dialogContinueButton = document.getElementById("dialogContinueButton");

if (bossHud && canvas.parentElement && bossHud.parentElement !== canvas.parentElement) {
  canvas.parentElement.appendChild(bossHud);
}

if (pausePanel && pausePanel.parentElement !== document.body) {
  document.body.appendChild(pausePanel);
}

const urlParams = new URLSearchParams(window.location.search);
const shouldAutoStart = urlParams.get("play") === "1" || urlParams.get("start") === "1";
const SAVE_KEY = "gabryel-garcia-o-brabo-save-v1";
const DEFAULT_NEW_PLAYER_NAME = "Upminaa";
const FALLBACK_PLAYER_NAME = "Lia";
const PLAYER_MAX_LEVEL = 1000;
const TILE = 32;
const MAP_COLS = 82;
const MAP_ROWS = 60;
const WORLD_WIDTH = MAP_COLS * TILE;
const WORLD_HEIGHT = MAP_ROWS * TILE;
const HOME_COLS = 30;
const HOME_ROWS = 20;
const HOME_WIDTH = HOME_COLS * TILE;
const HOME_HEIGHT = HOME_ROWS * TILE;
const CRYSTAL_COLS = 46;
const CRYSTAL_ROWS = 34;
const CRYSTAL_WIDTH = CRYSTAL_COLS * TILE;
const CRYSTAL_HEIGHT = CRYSTAL_ROWS * TILE;

const keys = new Set();
const camera = { x: 0, y: 0 };
let lastTime = 0;
let dialogOpen = false;
let currentScene = "village";
let lastVillagePosition = { x: 30 * TILE, y: 24 * TILE };
let inventoryOpen = false;
let shopOpen = false;
let gameOver = false;
let gameStarted = false;
let attackTimer = 0;
let damageCooldown = 0;
let saveNoticeTimer = 0;
let audioContext = null;
let musicGain = null;
let musicTimer = null;
let lastErrorMessage = "";
let attackWindupTimer = 0;
let attackRecoveryTimer = 0;
let attackHitDone = false;
let attackDirection = "down";
let hitstopTimer = 0;
let playerInvulnerableTimer = 0;
let playerKnockbackX = 0;
let playerKnockbackY = 0;
let regenTickTimer = 0;
let oxygenDamageTimer = 0;
let waterSoundTimer = 0;
let weaponCooldownTimer = 0;
let dodgeCooldownTimer = 0;
let equippedPower = "fireball";
let currentWeaponIndex = 0;
let currentMeleeAttack = null;
let isMobile = false;
let pauseOpen = false;
let missionsOpen = false;
let statusOpen = false;
let mobileLockedTarget = null;
let currentAutoAimTarget = null;
let pressedMobileButton = "";
let fpsEstimate = 0;
let fpsFrameCount = 0;
let fpsTimer = 0;
let debugEnabled = urlParams.get("debug") === "1";
let hudToastTimer = 0;
let hudToastText = "";
let inventoryTab = "all";
let selectedInventoryItemId = "";

const joystick = {
  active: false,
  pointerId: null,
  centerX: 0,
  centerY: 0,
  x: 0,
  y: 0,
  strength: 0
};

const mouseAim = {
  screenX: 0,
  screenY: 0,
  worldX: 30 * TILE,
  worldY: 24 * TILE,
  angle: 0,
  active: false
};

const activePowerUps = {
  speed: 0,
  force: 0,
  shield: 0,
  regen: 0,
  waterBreathing: 0
};

const projectiles = [];
const playerProjectiles = projectiles;
const enemyProjectiles = [];
const floatingTexts = [];
const shockwaves = [];
const dashTrails = [];
const healBursts = [];
const lootItems = [];
const hazardZones = [];

const spellCosts = {
  fireball: 2,
  blueRay: 2,
  dash: 1,
  shockwave: 3,
  heal: 3
};

const powerSlots = ["fireball", "blueRay", "shockwave", "heal"];

const powerNames = {
  fireball: "Bola de Fogo",
  blueRay: "Raio Azul",
  shockwave: "Onda de Choque",
  heal: "Cura Magica"
};

const weaponOrder = ["sword", "bow", "staff", "spear"];

const weapons = {
  sword: { name: "Espada curta", damage: 2, range: 48, cooldown: 0.32, arc: Math.PI * 0.72, kind: "melee", damageType: "fisico" },
  bow: { name: "Arco", damage: 2, range: 420, cooldown: 0.42, projectile: "arrow", projectileSpeed: 420, kind: "projectile", damageType: "fisico" },
  staff: { name: "Cajado", damage: 3, range: 390, cooldown: 0.52, projectile: "blueMagic", projectileSpeed: 330, kind: "projectile", damageType: "magico" },
  spear: { name: "Lanca", damage: 3, range: 72, cooldown: 0.48, arc: Math.PI * 0.24, kind: "line", damageType: "fisico" }
};

const quest = {
  status: "notStarted",
  collected: 0,
  total: 3,
  reward: "Amuleto da Vila"
};

const inventory = {
  cristais: 0,
  chaves: 0,
  pocoes: 1,
  moedas: 8,
  espadas: 0,
  cartas: 0,
  fragmentos: 0,
  flechas: 12,
  chavesRaras: 0,
  manaOrbes: 0,
  itensBoss: []
};

const questBook = {
  keyFound: false,
  forestMonstersDefeated: 0,
  forestMonstersGoal: 3,
  letterPicked: false,
  letterDelivered: false,
  bossDefeated: false,
  bossChestOpened: false,
  defeatedBosses: {},
  openedChests: {},
  discoveredAreas: {}
};

const dimensionQuest = {
  entered: false,
  status: "notStarted",
  activatedCrystals: 0,
  totalCrystals: 3,
  bridgeOpen: false,
  chestOpened: false,
  missionDone: false
};

const dimensionParticles = Array.from({ length: 70 }, (_, index) => ({
  x: ((index * 97) % CRYSTAL_WIDTH),
  y: ((index * 151) % CRYSTAL_HEIGHT),
  size: 2 + (index % 3),
  speed: 0.4 + (index % 5) * 0.12,
  phase: index * 0.73
}));

const player = {
  name: DEFAULT_NEW_PLAYER_NAME,
  x: 30 * TILE,
  y: 24 * TILE,
  startX: 30 * TILE,
  startY: 24 * TILE,
  width: 22,
  height: 26,
  speed: 150,
  baseSpeed: 150,
  maxHealth: 5,
  health: 5,
  defense: 0,
  critChance: 0.12,
  level: 1,
  xp: 0,
  xpToNextLevel: 58,
  maxLevel: PLAYER_MAX_LEVEL,
  totalXp: 0,
  skillPoints: 0,
  damageBonus: 0,
  levelGlowTimer: 0,
  maxMana: 6,
  mana: 6,
  manaRegen: 0.45,
  spellCooldowns: {
    fireball: 0,
    blueRay: 0,
    dash: 0,
    shockwave: 0,
    heal: 0
  },
  unlockedWeapons: ["sword", "bow", "staff", "spear"],
  isSwimming: false,
  maxOxygen: 10,
  oxygen: 10,
  direction: "down",
  moving: false,
  frame: 0,
  animTimer: 0
};

normalizeLevelState();
playerNameEl.textContent = getPlayerHudName();
if (characterNameInput) characterNameInput.value = DEFAULT_NEW_PLAYER_NAME;

// G = grama, F = floresta, D = caminho, P = praca, W = agua
const worldMap = createWorldMap();
const homeMap = createHomeMap();
const crystalDimensionMap = createCrystalDimensionMap();

function createWorldMap() {
  const map = Array.from({ length: MAP_ROWS }, () => Array(MAP_COLS).fill("G"));

  fillRect(map, 0, 0, 15, MAP_ROWS, "F");
  fillRect(map, 49, 0, 15, MAP_ROWS, "F");
  fillRect(map, 0, 0, MAP_COLS, 5, "F");
  fillRect(map, 0, 39, MAP_COLS, 7, "F");

  fillRect(map, 30, 5, 4, 35, "D");
  fillRect(map, 8, 22, 48, 4, "D");
  fillRect(map, 17, 10, 4, 27, "D");
  fillRect(map, 43, 11, 4, 24, "D");
  fillRect(map, 25, 18, 15, 10, "P");
  fillRect(map, 28, 21, 9, 4, "P");
  fillRect(map, 6, 31, 12, 7, "P");
  fillRect(map, 53, 31, 8, 7, "P");
  fillRect(map, 4, 8, 10, 7, "G");
  fillRect(map, 24, 33, 7, 5, "G");
  fillRect(map, 41, 6, 8, 5, "G");
  fillRect(map, 9, 24, 3, 9, "D");
  fillRect(map, 14, 33, 17, 3, "D");
  fillRect(map, 46, 24, 10, 3, "D");
  fillRect(map, 55, 26, 3, 7, "D");
  fillRect(map, 11, 14, 3, 9, "D");

  paintEllipse(map, 50, 13, 8, 6, "W");
  paintEllipse(map, 54, 17, 6, 4, "W");

  // Expansao do mapa: novas regioes conectadas por caminhos.
  fillRect(map, 60, 6, 15, 11, "P");   // ruinas antigas
  fillRect(map, 58, 30, 18, 11, "G");  // campo aberto
  fillRect(map, 3, 47, 18, 10, "F");   // cemiterio abandonado
  fillRect(map, 0, 45, 25, 15, "F");   // floresta profunda
  fillRect(map, 61, 43, 13, 10, "P");  // arena de treino
  fillRect(map, 70, 45, 10, 12, "F");  // monstros fortes

  fillRect(map, 56, 24, 4, 23, "D");
  fillRect(map, 31, 40, 30, 3, "D");
  fillRect(map, 18, 49, 45, 3, "D");
  fillRect(map, 67, 16, 4, 29, "D");
  fillRect(map, 63, 38, 9, 3, "D");
  fillRect(map, 65, 48, 10, 3, "D");
  fillRect(map, 6, 51, 16, 3, "D");
  fillRect(map, 51, 52, 14, 2, "D");   // caminho secreto

  paintEllipse(map, 66, 24, 10, 7, "W");
  paintEllipse(map, 73, 24, 6, 5, "W");
  paintEllipse(map, 62, 27, 5, 4, "W");
  paintEllipse(map, 36, 32, 3, 2, "W");

  return map;
}

function createHomeMap() {
  const map = Array.from({ length: HOME_ROWS }, () => Array(HOME_COLS).fill("I"));
  fillHomeRect(map, 0, 0, HOME_COLS, 1, "B");
  fillHomeRect(map, 0, HOME_ROWS - 1, HOME_COLS, 1, "B");
  fillHomeRect(map, 0, 0, 1, HOME_ROWS, "B");
  fillHomeRect(map, HOME_COLS - 1, 0, 1, HOME_ROWS, "B");
  fillHomeRect(map, 7, 7, 6, 4, "R");
  fillHomeRect(map, 14, HOME_ROWS - 1, 2, 1, "I");
  return map;
}

function createCrystalDimensionMap() {
  const map = Array.from({ length: CRYSTAL_ROWS }, () => Array(CRYSTAL_COLS).fill("C"));

  fillCrystalRect(map, 0, 0, CRYSTAL_COLS, 1, "M");
  fillCrystalRect(map, 0, CRYSTAL_ROWS - 1, CRYSTAL_COLS, 1, "M");
  fillCrystalRect(map, 0, 0, 1, CRYSTAL_ROWS, "M");
  fillCrystalRect(map, CRYSTAL_COLS - 1, 0, 1, CRYSTAL_ROWS, "M");

  fillCrystalRect(map, 20, 27, 7, 5, "Q");
  fillCrystalRect(map, 21, 13, 5, 16, "Q");
  fillCrystalRect(map, 9, 18, 28, 5, "Q");
  fillCrystalRect(map, 17, 7, 12, 7, "Q");
  fillCrystalRect(map, 21, 4, 5, 5, "Q");

  paintCrystalEllipse(map, 9, 10, 6, 4, "M");
  paintCrystalEllipse(map, 36, 9, 6, 4, "M");
  paintCrystalEllipse(map, 37, 25, 6, 4, "M");
  paintCrystalEllipse(map, 8, 27, 4, 3, "M");

  return map;
}

function fillHomeRect(map, startX, startY, width, height, tile) {
  for (let y = startY; y < startY + height; y++) {
    for (let x = startX; x < startX + width; x++) {
      if (x >= 0 && y >= 0 && x < HOME_COLS && y < HOME_ROWS) {
        map[y][x] = tile;
      }
    }
  }
}

function fillCrystalRect(map, startX, startY, width, height, tile) {
  for (let y = startY; y < startY + height; y++) {
    for (let x = startX; x < startX + width; x++) {
      if (x >= 0 && y >= 0 && x < CRYSTAL_COLS && y < CRYSTAL_ROWS) {
        map[y][x] = tile;
      }
    }
  }
}

function fillRect(map, startX, startY, width, height, tile) {
  for (let y = startY; y < startY + height; y++) {
    for (let x = startX; x < startX + width; x++) {
      if (x >= 0 && y >= 0 && x < MAP_COLS && y < MAP_ROWS) {
        map[y][x] = tile;
      }
    }
  }
}

function paintEllipse(map, centerX, centerY, radiusX, radiusY, tile) {
  for (let y = centerY - radiusY; y <= centerY + radiusY; y++) {
    for (let x = centerX - radiusX; x <= centerX + radiusX; x++) {
      const dx = (x - centerX) / radiusX;
      const dy = (y - centerY) / radiusY;
      if (dx * dx + dy * dy <= 1 && x >= 0 && y >= 0 && x < MAP_COLS && y < MAP_ROWS) {
        map[y][x] = tile;
      }
    }
  }
}

function paintCrystalEllipse(map, centerX, centerY, radiusX, radiusY, tile) {
  for (let y = centerY - radiusY; y <= centerY + radiusY; y++) {
    for (let x = centerX - radiusX; x <= centerX + radiusX; x++) {
      const dx = (x - centerX) / radiusX;
      const dy = (y - centerY) / radiusY;
      if (dx * dx + dy * dy <= 1 && x >= 0 && y >= 0 && x < CRYSTAL_COLS && y < CRYSTAL_ROWS) {
        map[y][x] = tile;
      }
    }
  }
}

const villageObjects = [
  playerHouse(24, 33),
  shop(42, 6),
  house(22, 8, "Casa da Dona Mina"),
  house(36, 8, "Casa do Prefeito"),
  house(21, 29, "Pousada da Vila"),
  house(38, 29, "Armazem"),
  house(12, 15, "Cabana da Floresta"),
  house(48, 28, "Casa do Pescador"),
  house(27, 12, "Padaria"),
  house(35, 14, "Atelie"),
  well(31, 21),
  portal(34, 24),
  portal(55, 32),
  bench(8, 34, "horizontal"),
  bench(13, 34, "horizontal"),
  bench(8, 36, "horizontal"),
  caveEntrance(10, 10),
  secretStone(7, 10),

  tree(3, 4), tree(6, 3), tree(10, 6), tree(13, 8), tree(4, 11),
  tree(8, 14), tree(12, 20), tree(5, 25), tree(10, 30), tree(6, 35),
  tree(2, 40), tree(13, 39), tree(50, 4), tree(55, 5), tree(60, 7),
  tree(51, 26), tree(58, 28), tree(53, 34), tree(60, 38), tree(48, 40),
  tree(19, 40), tree(25, 41), tree(33, 40), tree(43, 39),
  tree(3, 7), tree(6, 7), tree(9, 7), tree(12, 7), tree(14, 9),
  tree(14, 12), tree(3, 14), tree(6, 15), tree(9, 15),

  fence(20, 7, 7, "horizontal"),
  fence(35, 7, 7, "horizontal"),
  fence(20, 32, 7, "horizontal"),
  fence(38, 32, 7, "horizontal"),
  fence(23, 17, 5, "vertical"),
  fence(40, 17, 5, "vertical"),

  sign(30, 27, "Placa da praca: Bem-vindo a Vila Pixel! A vila fica ao redor da praca."),
  sign(14, 22, "Placa da floresta: As arvores sao solidas, mas as flores nao bloqueiam o caminho."),
  sign(48, 21, "Placa do lago: A agua tem colisao. Melhor admirar da margem."),
  sign(31, 5, "Placa norte: Siga o caminho para voltar ate a praca."),
  sign(25, 36, "Casa da Lia: seu ponto de descanso depois das aventuras."),
  sign(44, 10, "Loja Estrela Azul: pocoes, mapas e biscoitos de viagem."),
  sign(8, 33, "Parque da Vila: respire fundo e siga explorando."),
  sign(36, 27, "PORTAL NOVO: pressione E perto do brilho para entrar na Dimensao Cristalina."),
  sign(56, 38, "Portal antigo: o brilho agora leva para a Dimensao Cristalina."),

  npc(29, 20, "Nico", "Nico: Preciso de ajuda! Encontre 3 cristais brilhantes pela vila e volte aqui."),
  npc(44, 24, "Ari", "Ari: O lago cresceu depois das ultimas chuvas. Nao tente atravessar."),
  npc(18, 24, "Mina", "Mina: Na floresta ha flores por toda parte, mas cuidado com as arvores."),
  npc(45, 9, "Vendedor", "Vendedor: Bem-vinda a Loja Estrela Azul!", "shopkeeper"),
  npc(12, 34, "Beto", "Beto: Estou esperando uma carta da Mina.", "letterTarget"),

  crystal(12, 28), crystal(47, 20), crystal(35, 36),
  collectible(7, 11, "chave"),
  collectible(19, 23, "carta"),
  collectible(27, 34, "pocao"),
  collectible(13, 36, "espada"),
  collectible(54, 29, "espada"),
  collectible(9, 32, "moeda"), collectible(10, 35, "moeda"), collectible(45, 25, "moeda"),
  collectible(52, 24, "moeda"), collectible(56, 36, "moeda"), collectible(6, 12, "moeda"),
  enemy(9, 18, "slime"), enemy(12, 25, "slime"), enemy(52, 34, "slime"),
  enemy(7, 9, "morcego"),

  flower(26, 19, "pink"), flower(37, 19, "yellow"), flower(26, 26, "blue"),
  flower(38, 26, "pink"), flower(16, 18, "yellow"), flower(11, 27, "blue"),
  flower(9, 33, "pink"), flower(45, 31, "yellow"), flower(52, 24, "blue"),
  flower(56, 22, "pink"), flower(24, 35, "yellow"), flower(34, 34, "blue"),
  rock(15, 12), rock(11, 19), rock(47, 19), rock(56, 27),
  rock(18, 35), rock(41, 36), rock(7, 38), rock(58, 10),

  sign(33, 28, "MAPA EXPANDIDO: siga o novo caminho ao sul da praca para descobrir outras regioes."),
  sign(35, 30, "TESTE DE COMBATE: use mouse, Tab, Q, 1-4 e Espaco para praticar."),
  sign(34, 33, "Area de treino: armas liberadas, cristais de mana e lago pequeno para nadar."),
  sign(63, 18, "Lago Maior: a agua magica ficou mais profunda nesta parte da vila."),
  sign(63, 23, "Lago dos Ecos: entre na agua para nadar, mas cuide do oxigenio."),
  sign(61, 9, "Ruinas Antigas: dizem que um guardiao desperta quando alguem treina magia aqui."),
  sign(58, 37, "Campo Aberto: bom para testar dash e bola de fogo."),
  sign(7, 50, "Floresta profunda: aranhas, goblins e morcegos cercam os caminhos."),
  sign(63, 43, "Arena do Guardiao: bosses mostram barra de vida no topo."),
  sign(72, 46, "Area Perigosa: monstros fortes causam mais dano."),
  sign(74, 45, "Perigo: inimigos fortes e miniDragao guardam tesouros."),
  sign(53, 53, "Caminho Secreto: siga as pedras claras ate a floresta profunda."),

  house(60, 32, "Casa do Campo"),
  house(72, 34, "Casa do Treinador"),
  house(6, 53, "Cabana Esquecida"),
  fence(61, 42, 12, "horizontal"),
  fence(61, 52, 12, "horizontal"),
  fence(61, 43, 8, "vertical"),
  fence(72, 43, 8, "vertical"),
  fence(3, 46, 16, "horizontal"),

  tree(2, 48), tree(5, 46), tree(9, 45), tree(13, 46), tree(17, 48),
  tree(3, 55), tree(12, 56), tree(19, 54), tree(24, 50), tree(27, 52),
  tree(73, 47), tree(77, 48), tree(80, 52), tree(76, 56), tree(70, 57),
  tree(58, 29), tree(61, 30), tree(75, 31), tree(78, 34),
  rock(60, 8), rock(65, 9), rock(72, 12), rock(68, 15),
  rock(58, 35), rock(70, 38), rock(64, 47), rock(75, 50),
  flower(59, 33, "yellow"), flower(63, 36, "blue"), flower(70, 32, "pink"),
  flower(74, 39, "yellow"), flower(12, 49, "blue"), flower(16, 54, "pink"),

  enemy(62, 35, "slime"), enemy(67, 37, "morcego"),
  enemy(9, 51, "mago"), enemy(15, 53, "slimeVermelho"),
  enemy(73, 49, "slimeVermelho"), enemy(77, 52, "golem"),
  enemy(68, 47, "guardiao"),
  enemy(34, 31, "slimeVerde"), enemy(37, 34, "slimeVerde"), enemy(39, 31, "arqueiroGoblin"),
  enemy(58, 34, "slimeVerde"), enemy(62, 38, "goblin"), enemy(66, 35, "arqueiroGoblin"),
  enemy(8, 49, "aranha"), enemy(12, 50, "goblin"), enemy(17, 52, "morcego"),
  enemy(20, 55, "aranha"), enemy(24, 51, "arqueiroGoblin"),
  enemy(60, 24, "slimeAzul"), enemy(66, 26, "peixeHostil"), enemy(72, 24, "peixeHostil"),
  enemy(63, 12, "fantasma"), enemy(68, 13, "magoSombrio"), enemy(72, 10, "golemPedra"),
  enemy(75, 48, "miniDragao"), enemy(79, 54, "golemPedra"), enemy(74, 55, "magoSombrio"),
  boss(35, 35, "miniGuardiao"),
  boss(60, 30, "reiSlime"),
  boss(14, 56, "aranhaRainha"),
  boss(69, 10, "golemAncestral"),
  boss(73, 14, "bruxoSombrio"),
  boss(69, 24, "serpenteLago"),
  rareChest(67, 49)
];

const homeObjects = [
  block(0, 0, HOME_COLS, 1),
  block(0, 0, 1, HOME_ROWS),
  block(HOME_COLS - 1, 0, 1, HOME_ROWS),
  block(0, HOME_ROWS - 1, 14, 1),
  block(16, HOME_ROWS - 1, 14, 1),
  interiorBed(2, 2),
  interiorTable(12, 7),
  interiorBookshelf(25, 2),
  interiorChest(3, 10),
  interiorPlant(25, 12),
  sign(14, 17, "Porta de saida: caminhe para baixo para voltar a vila.")
];

const shopInteriorObjects = [
  block(0, 0, HOME_COLS, 1),
  block(0, 0, 1, HOME_ROWS),
  block(HOME_COLS - 1, 0, 1, HOME_ROWS),
  block(0, HOME_ROWS - 1, 14, 1),
  block(16, HOME_ROWS - 1, 14, 1),
  shopCounter(7, 5),
  interiorBookshelf(3, 2),
  interiorBookshelf(24, 2),
  interiorChest(22, 11),
  npc(14, 7, "Vendedor", "Vendedor: Pocao fresquinha por 5 moedas!", "shopkeeper"),
  sign(14, 17, "Saida da loja: caminhe para baixo para voltar a vila.")
];

const mayorInteriorObjects = [
  block(0, 0, HOME_COLS, 1),
  block(0, 0, 1, HOME_ROWS),
  block(HOME_COLS - 1, 0, 1, HOME_ROWS),
  block(0, HOME_ROWS - 1, 14, 1),
  block(16, HOME_ROWS - 1, 14, 1),
  mayorDesk(11, 5),
  interiorBookshelf(3, 2),
  interiorBookshelf(25, 2),
  interiorPlant(4, 12),
  npc(14, 9, "Prefeito", "Prefeito: Gabryel Garcia o Brabo protege esta vila!", "mayor"),
  sign(14, 17, "Saida da casa do prefeito: caminhe para baixo para voltar a vila.")
];

const crystalDimensionObjects = [
  block(0, 0, CRYSTAL_COLS, 1),
  block(0, CRYSTAL_ROWS - 1, CRYSTAL_COLS, 1),
  block(0, 0, 1, CRYSTAL_ROWS),
  block(CRYSTAL_COLS - 1, 0, 1, CRYSTAL_ROWS),
  dimensionPortal(22, 29, "exit"),
  dimensionBlocker(21, 13, 5, 2),

  npc(20, 25, "Orion", "Orion: Ative tres cristais magicos para abrir o caminho secreto.", "dimensionGuide"),
  npc(28, 17, "Nyx", "Nyx: Esta dimensao guarda ecos da vila. As pedras flutuam quando alguem desperta os cristais.", "dimensionMystic"),

  dimensionCrystal(12, 20, 0, "Cristal da Memoria: ele mostra a vila refletida em luz roxa."),
  dimensionCrystal(34, 20, 1, "Cristal do Caminho: linhas brilhantes apontam para o norte."),
  dimensionCrystal(23, 16, 2, "Cristal do Portal: um som baixo vibra dentro dele."),
  dimensionChest(22, 6),
  dimensionSign(20, 28, "Inscricao: tres luzes acordam a ponte perdida."),
  talkingStone(31, 25, "Pedra flutuante: quem entra deve lembrar o caminho de volta."),
  magicFountain(16, 9, "Fonte magica: a agua brilha, mas ainda bloqueia a passagem."),

  largeCrystal(7, 17), largeCrystal(39, 17), largeCrystal(18, 12), largeCrystal(28, 12),
  largeCrystal(15, 25), largeCrystal(31, 28), largeCrystal(10, 6), largeCrystal(40, 7),
  strangeTree(5, 23), strangeTree(39, 26), strangeTree(6, 14), strangeTree(36, 14),
  floatingRock(14, 18), floatingRock(32, 18), floatingRock(18, 24), floatingRock(27, 24),
  floatingRock(20, 9), floatingRock(27, 9)
];

const powerUps = [
  powerUp(35, 29, "speed"),
  powerUp(60, 35, "speed"),
  powerUp(64, 11, "force"),
  powerUp(73, 50, "force"),
  powerUp(64, 45, "shield"),
  powerUp(8, 52, "shield"),
  powerUp(12, 50, "regen"),
  powerUp(70, 38, "regen"),
  powerUp(58, 52, "mana"),
  powerUp(69, 24, "mana"),
  powerUp(63, 25, "waterBreathing"),
  powerUp(36, 32, "waterBreathing")
];

let objects = villageObjects;
let colliders = objects.filter((obj) => obj.solid);
let interactables = objects.filter((obj) => obj.message);

function block(tileX, tileY, widthTiles, heightTiles) {
  return {
    type: "block",
    x: tileX * TILE,
    y: tileY * TILE,
    width: widthTiles * TILE,
    height: heightTiles * TILE,
    solid: true
  };
}

function house(tileX, tileY, title) {
  return {
    type: "house",
    title,
    x: tileX * TILE,
    y: tileY * TILE,
    width: TILE * 4,
    height: TILE * 3,
    solid: true
  };
}

function playerHouse(tileX, tileY) {
  return {
    type: "playerHouse",
    title: "Casa da Lia",
    x: tileX * TILE,
    y: tileY * TILE,
    width: TILE * 4,
    height: TILE * 3,
    solid: true
  };
}

function shop(tileX, tileY) {
  return {
    type: "shop",
    title: "Loja Estrela Azul",
    x: tileX * TILE,
    y: tileY * TILE,
    width: TILE * 4,
    height: TILE * 3,
    solid: true
  };
}

function tree(tileX, tileY) {
  return {
    type: "tree",
    x: tileX * TILE,
    y: tileY * TILE,
    width: TILE,
    height: TILE * 2,
    solid: true
  };
}

function fence(tileX, tileY, length, direction) {
  return {
    type: "fence",
    x: tileX * TILE,
    y: tileY * TILE,
    width: direction === "horizontal" ? TILE * length : TILE,
    height: direction === "horizontal" ? TILE : TILE * length,
    direction,
    solid: true
  };
}

function sign(tileX, tileY, message) {
  return {
    type: "sign",
    x: tileX * TILE + 8,
    y: tileY * TILE + 6,
    width: 18,
    height: 24,
    solid: true,
    message
  };
}

function well(tileX, tileY) {
  return {
    type: "well",
    x: tileX * TILE + 2,
    y: tileY * TILE + 2,
    width: 28,
    height: 28,
    solid: true
  };
}

function bench(tileX, tileY, direction) {
  return {
    type: "bench",
    x: tileX * TILE + 2,
    y: tileY * TILE + 10,
    width: direction === "horizontal" ? 28 : 12,
    height: direction === "horizontal" ? 12 : 28,
    direction,
    solid: true
  };
}

function portal(tileX, tileY) {
  return {
    type: "portal",
    role: "crystalEntry",
    x: tileX * TILE,
    y: tileY * TILE - 8,
    width: TILE * 2,
    height: TILE * 3,
    solid: false,
    message: "Pressione E para entrar no portal."
  };
}

function dimensionPortal(tileX, tileY, role) {
  return {
    type: "dimensionPortal",
    role,
    x: tileX * TILE,
    y: tileY * TILE - 8,
    width: TILE * 2,
    height: TILE * 3,
    solid: false,
    message: role === "exit" ? "Portal de volta: pressione E para retornar a vila." : "Portal cristalino."
  };
}

function dimensionBlocker(tileX, tileY, widthTiles, heightTiles) {
  return {
    type: "dimensionBlocker",
    x: tileX * TILE,
    y: tileY * TILE,
    width: widthTiles * TILE,
    height: heightTiles * TILE,
    solid: true
  };
}

function dimensionCrystal(tileX, tileY, crystalIndex, message) {
  return {
    type: "dimensionCrystal",
    crystalIndex,
    x: tileX * TILE + 6,
    y: tileY * TILE,
    width: 22,
    height: 32,
    solid: false,
    message,
    activated: false,
    activatedAt: 0
  };
}

function dimensionChest(tileX, tileY) {
  return {
    type: "dimensionChest",
    x: tileX * TILE,
    y: tileY * TILE + 8,
    width: TILE * 2,
    height: TILE,
    solid: true,
    opened: false,
    message: "Bau especial: a fechadura tem tres marcas de cristal."
  };
}

function dimensionSign(tileX, tileY, message) {
  return {
    type: "dimensionSign",
    x: tileX * TILE + 8,
    y: tileY * TILE + 6,
    width: 18,
    height: 24,
    solid: true,
    message
  };
}

function talkingStone(tileX, tileY, message) {
  return {
    type: "talkingStone",
    x: tileX * TILE + 4,
    y: tileY * TILE + 8,
    width: 24,
    height: 20,
    solid: true,
    message
  };
}

function magicFountain(tileX, tileY, message) {
  return {
    type: "magicFountain",
    x: tileX * TILE,
    y: tileY * TILE,
    width: TILE * 2,
    height: TILE * 2,
    solid: true,
    message
  };
}

function largeCrystal(tileX, tileY) {
  return {
    type: "largeCrystal",
    x: tileX * TILE + 2,
    y: tileY * TILE - 4,
    width: 28,
    height: 42,
    solid: true
  };
}

function strangeTree(tileX, tileY) {
  return {
    type: "strangeTree",
    x: tileX * TILE,
    y: tileY * TILE - 8,
    width: TILE,
    height: TILE * 2,
    solid: true
  };
}

function floatingRock(tileX, tileY) {
  return {
    type: "floatingRock",
    x: tileX * TILE + 5,
    y: tileY * TILE + 8,
    width: 22,
    height: 18,
    solid: true
  };
}

function secretStone(tileX, tileY) {
  return {
    type: "secretStone",
    x: tileX * TILE + 4,
    y: tileY * TILE + 8,
    width: 24,
    height: 20,
    solid: false,
    message: "Voce encontrou a clareira secreta escondida atras das arvores!"
  };
}

function caveEntrance(tileX, tileY) {
  return {
    type: "cave",
    x: tileX * TILE,
    y: tileY * TILE,
    width: TILE * 3,
    height: TILE * 2,
    solid: true,
    message: "Caverna escondida: morcegos costumam rondar essa entrada."
  };
}

function interiorBed(tileX, tileY) {
  return {
    type: "bed",
    x: tileX * TILE,
    y: tileY * TILE,
    width: TILE * 3,
    height: TILE * 2,
    solid: true
  };
}

function interiorTable(tileX, tileY) {
  return {
    type: "table",
    x: tileX * TILE,
    y: tileY * TILE,
    width: TILE * 3,
    height: TILE * 2,
    solid: true
  };
}

function shopCounter(tileX, tileY) {
  return {
    type: "counter",
    x: tileX * TILE,
    y: tileY * TILE,
    width: TILE * 16,
    height: TILE * 2,
    solid: true
  };
}

function mayorDesk(tileX, tileY) {
  return {
    type: "mayorDesk",
    x: tileX * TILE,
    y: tileY * TILE,
    width: TILE * 7,
    height: TILE * 3,
    solid: true
  };
}

function interiorBookshelf(tileX, tileY) {
  return {
    type: "bookshelf",
    x: tileX * TILE,
    y: tileY * TILE,
    width: TILE * 2,
    height: TILE * 3,
    solid: true
  };
}

function interiorChest(tileX, tileY) {
  return {
    type: "chest",
    x: tileX * TILE,
    y: tileY * TILE,
    width: TILE * 2,
    height: TILE,
    solid: true,
    message: "Bau da Lia: tem mapas, fitas coloridas e uma lanterna pequena."
  };
}

function rareChest(tileX, tileY) {
  return {
    type: "rareChest",
    x: tileX * TILE,
    y: tileY * TILE + 8,
    width: TILE * 2,
    height: TILE,
    solid: true,
    message: "Bau raro do Guardiao: parece esperar a queda do boss."
  };
}

function interiorPlant(tileX, tileY) {
  return {
    type: "plant",
    x: tileX * TILE + 4,
    y: tileY * TILE,
    width: 24,
    height: 32,
    solid: true
  };
}

function flower(tileX, tileY, color) {
  return {
    type: "flower",
    color,
    x: tileX * TILE + 10,
    y: tileY * TILE + 12,
    width: 12,
    height: 12,
    solid: false
  };
}

function rock(tileX, tileY) {
  return {
    type: "rock",
    x: tileX * TILE + 7,
    y: tileY * TILE + 11,
    width: 18,
    height: 15,
    solid: false
  };
}

function crystal(tileX, tileY) {
  return {
    type: "crystal",
    x: tileX * TILE + 8,
    y: tileY * TILE + 4,
    width: 16,
    height: 24,
    solid: false,
    collected: false
  };
}

function collectible(tileX, tileY, item) {
  return {
    type: "collectible",
    item,
    x: tileX * TILE + 8,
    y: tileY * TILE + 8,
    width: 16,
    height: 16,
    solid: false,
    collected: false
  };
}

function powerUp(tileX, tileY, kind, dropped = false) {
  return {
    type: "powerUp",
    kind,
    x: tileX * TILE + 7,
    y: tileY * TILE + 7,
    width: 18,
    height: 18,
    solid: false,
    collected: false,
    dropped
  };
}

function enemy(tileX, tileY, kind) {
  const stats = getEnemyStats(kind);
  return {
    type: "enemy",
    kind,
    x: tileX * TILE + 4,
    y: tileY * TILE + 4,
    width: stats.width,
    height: stats.height,
    solid: false,
    hp: stats.hp,
    maxHp: stats.hp,
    damage: stats.damage,
    speed: stats.speed,
    state: "idle",
    spawnX: tileX * TILE + 4,
    spawnY: tileY * TILE + 4,
    aggroRange: stats.aggroRange,
    attackRange: stats.attackRange,
    attackCooldown: 0,
    attackDelay: stats.attackDelay,
    attackTimer: 0,
    invulnerableTimer: 0,
    knockbackX: 0,
    knockbackY: 0,
    canFly: Boolean(stats.canFly),
    canSwim: Boolean(stats.canSwim),
    projectileType: stats.projectileType || null,
    dropTable: stats.dropTable,
    xpReward: stats.xpReward || stats.coinReward,
    coinReward: stats.coinReward,
    coinsReward: stats.coinReward,
    defense: stats.defense || 0,
    resistances: stats.resistances || {},
    boss: stats.boss,
    bossItem: stats.bossItem || null,
    phase: 1,
    direction: Math.random() > 0.5 ? "left" : "right",
    moveTimer: 0,
    alive: true
  };
}

function boss(tileX, tileY, kind) {
  const obj = enemy(tileX, tileY, kind);
  obj.boss = true;
  obj.state = "bossIdle";
  return obj;
}

function getEnemyStats(kind) {
  const baseDrop = { coin: 0.8, potion: 0.12, powerUp: 0.15, loot: 0.2 };
  const stats = {
    slimeVerde: {
      width: 22, height: 20, hp: 3, damage: 1, speed: 45,
      aggroRange: 190, attackRange: 28, attackDelay: 1.1, coinReward: 3,
      projectileType: null, dropTable: baseDrop, xpReward: 2
    },
    slimeVermelho: {
      width: 24, height: 22, hp: 5, damage: 2, speed: 54,
      aggroRange: 230, attackRange: 30, attackDelay: 1.0, coinReward: 6,
      projectileType: null, dropTable: { coin: 0.9, potion: 0.16, powerUp: 0.22, loot: 0.24 }, xpReward: 4
    },
    slimeAzul: {
      width: 23, height: 21, hp: 4, damage: 1, speed: 48,
      aggroRange: 230, attackRange: 150, attackDelay: 1.35, coinReward: 5,
      canSwim: true, projectileType: "bubble", resistances: { agua: 0.5 },
      dropTable: { coin: 0.8, potion: 0.1, powerUp: 0.2, loot: 0.3 }, xpReward: 3
    },
    morcego: {
      width: 24, height: 18, hp: 2, damage: 1, speed: 82,
      aggroRange: 250, attackRange: 26, attackDelay: 0.9, coinReward: 5,
      canFly: true, dropTable: { coin: 0.8, potion: 0.08, powerUp: 0.16, loot: 0.18 }, xpReward: 3
    },
    aranha: {
      width: 24, height: 18, hp: 4, damage: 1, speed: 62,
      aggroRange: 230, attackRange: 32, attackDelay: 1.0, coinReward: 5,
      projectileType: "web", dropTable: { coin: 0.75, potion: 0.1, powerUp: 0.18, loot: 0.25 }, xpReward: 4
    },
    goblin: {
      width: 22, height: 28, hp: 5, damage: 1, speed: 66,
      aggroRange: 250, attackRange: 30, attackDelay: 0.95, coinReward: 7,
      dropTable: { coin: 0.9, potion: 0.12, powerUp: 0.18, loot: 0.28 }, xpReward: 5
    },
    arqueiroGoblin: {
      width: 22, height: 28, hp: 4, damage: 1, speed: 52,
      aggroRange: 280, attackRange: 215, attackDelay: 1.45, coinReward: 8,
      projectileType: "arrow", dropTable: { coin: 0.9, potion: 0.1, powerUp: 0.2, loot: 0.4 }, xpReward: 5
    },
    magoSombrio: {
      width: 24, height: 28, hp: 5, damage: 1, speed: 42,
      aggroRange: 295, attackRange: 230, attackDelay: 1.55, coinReward: 10,
      projectileType: "shadow", resistances: { sombra: 0.5 },
      dropTable: { coin: 1, potion: 0.16, powerUp: 0.28, loot: 0.45 }, xpReward: 7
    },
    golemPedra: {
      width: 30, height: 30, hp: 9, damage: 2, speed: 32,
      aggroRange: 220, attackRange: 36, attackDelay: 1.35, coinReward: 10,
      projectileType: "stone", defense: 1, resistances: { fisico: 0.75, magico: 1.25 },
      dropTable: { coin: 1, potion: 0.2, powerUp: 0.24, loot: 0.36 }, xpReward: 8
    },
    fantasma: {
      width: 24, height: 28, hp: 4, damage: 1, speed: 58,
      aggroRange: 270, attackRange: 30, attackDelay: 1.1, coinReward: 7,
      canFly: true, resistances: { fisico: 0.45, magico: 1.2 },
      dropTable: { coin: 0.8, potion: 0.08, powerUp: 0.22, loot: 0.35 }, xpReward: 6
    },
    peixeHostil: {
      width: 24, height: 16, hp: 3, damage: 1, speed: 72,
      aggroRange: 240, attackRange: 26, attackDelay: 0.85, coinReward: 5,
      canSwim: true, resistances: { agua: 0.5 },
      dropTable: { coin: 0.75, potion: 0.08, powerUp: 0.2, loot: 0.35 }, xpReward: 4
    },
    miniDragao: {
      width: 34, height: 26, hp: 12, damage: 2, speed: 68,
      aggroRange: 330, attackRange: 250, attackDelay: 1.2, coinReward: 18,
      canFly: true, projectileType: "fire", resistances: { fogo: 0.5, agua: 1.35 },
      dropTable: { coin: 1, potion: 0.35, powerUp: 0.5, loot: 0.7 }, xpReward: 14
    },
    miniGuardiao: {
      width: 34, height: 36, hp: 14, damage: 1, speed: 38,
      aggroRange: 260, attackRange: 150, attackDelay: 1.25, coinReward: 20,
      projectileType: "stone", defense: 1, boss: true, bossItem: "Insignia de Treino",
      dropTable: { coin: 1, potion: 0.5, powerUp: 0.8, loot: 0.7 }, xpReward: 12
    },
    reiSlime: {
      width: 42, height: 34, hp: 28, damage: 2, speed: 46,
      aggroRange: 330, attackRange: 44, attackDelay: 1.05, coinReward: 35,
      boss: true, bossItem: "Gelatina Real", projectileType: "slimeBall",
      dropTable: { coin: 1, potion: 0.8, powerUp: 1, loot: 1 }, xpReward: 25
    },
    aranhaRainha: {
      width: 44, height: 34, hp: 34, damage: 2, speed: 54,
      aggroRange: 350, attackRange: 210, attackDelay: 1.25, coinReward: 42,
      boss: true, bossItem: "Presa da Rainha", projectileType: "web",
      dropTable: { coin: 1, potion: 0.8, powerUp: 1, loot: 1 }, xpReward: 30
    },
    golemAncestral: {
      width: 46, height: 48, hp: 42, damage: 3, speed: 30,
      aggroRange: 350, attackRange: 230, attackDelay: 1.35, coinReward: 50,
      boss: true, bossItem: "Nucleo de Pedra", projectileType: "stone", defense: 2,
      resistances: { fisico: 0.65, magico: 1.25 },
      dropTable: { coin: 1, potion: 0.8, powerUp: 1, loot: 1 }, xpReward: 36
    },
    bruxoSombrio: {
      width: 30, height: 38, hp: 36, damage: 2, speed: 48,
      aggroRange: 380, attackRange: 260, attackDelay: 1.05, coinReward: 48,
      boss: true, bossItem: "Olho Sombrio", projectileType: "shadow", resistances: { sombra: 0.45 },
      dropTable: { coin: 1, potion: 0.8, powerUp: 1, loot: 1 }, xpReward: 34
    },
    serpenteLago: {
      width: 54, height: 24, hp: 38, damage: 2, speed: 72,
      aggroRange: 360, attackRange: 240, attackDelay: 1.15, coinReward: 50,
      boss: true, bossItem: "Escama da Serpente", projectileType: "bubble", canSwim: true,
      resistances: { agua: 0.45, fogo: 1.35 },
      dropTable: { coin: 1, potion: 0.8, powerUp: 1, loot: 1 }, xpReward: 35
    },
    guardiao: {
      width: 38, height: 42, hp: 22, damage: 2, speed: 44,
      aggroRange: 330, attackRange: 240, attackDelay: 1.35, coinReward: 35,
      dropTable: { coin: 1, potion: 1, powerUp: 1 },
      boss: true
    }
  };

  stats.slime = stats.slimeVerde;
  stats.golem = stats.golemPedra;
  stats.mago = stats.magoSombrio;

  return stats[kind] || stats.slime;
}

function npc(tileX, tileY, name, message, role = "villager") {
  return {
    type: "npc",
    name,
    role,
    x: tileX * TILE + 5,
    y: tileY * TILE + 4,
    width: 22,
    height: 28,
    solid: true,
    message,
    bob: Math.random() * Math.PI * 2,
    speed: 28,
    direction: Math.random() > 0.5 ? "left" : "right",
    moveTimer: 1 + Math.random() * 2,
    spawnX: tileX * TILE + 5,
    spawnY: tileY * TILE + 4
  };
}

function getPlayerRect(nextX = player.x, nextY = player.y) {
  return {
    x: nextX + 5,
    y: nextY + 8,
    width: player.width - 10,
    height: player.height - 8
  };
}

function rectsOverlap(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function isWaterAt(tileX, tileY) {
  if (currentScene === "crystalDimension") {
    if (tileX < 0 || tileY < 0 || tileX >= CRYSTAL_COLS || tileY >= CRYSTAL_ROWS) {
      return true;
    }
    return crystalDimensionMap[tileY][tileX] === "M";
  }

  if (currentScene !== "village") return false;

  if (tileX < 0 || tileY < 0 || tileX >= MAP_COLS || tileY >= MAP_ROWS) {
    return true;
  }
  return worldMap[tileY][tileX] === "W";
}

function isColliderActive(obj) {
  if (obj.type === "dimensionBlocker" && dimensionQuest.bridgeOpen) return false;
  if (obj.type === "rareChest" && (!questBook.bossDefeated || questBook.bossChestOpened)) return false;
  return obj.solid;
}

function hitsWater(rect) {
  const left = Math.floor(rect.x / TILE);
  const right = Math.floor((rect.x + rect.width - 1) / TILE);
  const top = Math.floor(rect.y / TILE);
  const bottom = Math.floor((rect.y + rect.height - 1) / TILE);

  for (let y = top; y <= bottom; y++) {
    for (let x = left; x <= right; x++) {
      if (isWaterAt(x, y)) return true;
    }
  }

  return false;
}

function isPointInVillageWater(x, y) {
  if (currentScene !== "village") return false;
  const tileX = Math.floor(x / TILE);
  const tileY = Math.floor(y / TILE);
  if (tileX < 0 || tileY < 0 || tileX >= MAP_COLS || tileY >= MAP_ROWS) return false;
  return worldMap[tileY][tileX] === "W";
}

function updateSwimming(delta) {
  if (currentScene !== "village") {
    player.isSwimming = false;
    player.oxygen = Math.min(player.maxOxygen, player.oxygen + delta * 3);
    return;
  }

  const centerX = player.x + player.width / 2;
  const centerY = player.y + player.height / 2 + 6;
  player.isSwimming = isPointInVillageWater(centerX, centerY);

  if (player.isSwimming) {
    if (activePowerUps.waterBreathing <= 0) {
      player.oxygen = Math.max(0, player.oxygen - delta * 0.55);
    } else {
      player.oxygen = Math.min(player.maxOxygen, player.oxygen + delta * 1.5);
    }

    waterSoundTimer -= delta;
    if (waterSoundTimer <= 0) {
      playSound("water");
      waterSoundTimer = 1.6;
    }

    if (player.oxygen <= 0) {
      oxygenDamageTimer -= delta;
      if (oxygenDamageTimer <= 0) {
        takeDamage(1, centerX, centerY);
        oxygenDamageTimer = 1.4;
      }
    } else {
      oxygenDamageTimer = 0.6;
    }
  } else {
    player.oxygen = Math.min(player.maxOxygen, player.oxygen + delta * 2.2);
    oxygenDamageTimer = 0;
  }
}

function canMoveTo(nextX, nextY) {
  const rect = getPlayerRect(nextX, nextY);
  if (gameOver) return false;
  const sceneWidth = getSceneWidth();
  const sceneHeight = getSceneHeight();

  if (
    rect.x < 0 ||
    rect.y < 0 ||
    rect.x + rect.width > sceneWidth ||
    rect.y + rect.height > sceneHeight
  ) {
    return false;
  }

  if (hitsWater(rect) && currentScene !== "village") return false;

  return !colliders.some((obj) => isColliderActive(obj) && rectsOverlap(rect, obj));
}

function canEntityMoveTo(entity, nextX, nextY) {
  const rect = {
    x: nextX,
    y: nextY,
    width: entity.width,
    height: entity.height
  };
  const sceneWidth = getSceneWidth();
  const sceneHeight = getSceneHeight();

  if (rect.x < 0 || rect.y < 0 || rect.x + rect.width > sceneWidth || rect.y + rect.height > sceneHeight) {
    return false;
  }

  if (currentScene === "crystalDimension" && hitsWater(rect)) return false;
  if (currentScene === "village" && hitsWater(rect) && !entity.canSwim && !entity.canFly) return false;

  return !colliders.some((obj) => (
    obj !== entity &&
    obj.type !== "enemy" &&
    isColliderActive(obj) &&
    !entityIgnoresCollider(entity, obj) &&
    rectsOverlap(rect, obj)
  ));
}

function entityIgnoresCollider(entity, obj) {
  if (entity.canFly && ["tree", "fence", "rock", "well", "bench"].includes(obj.type)) return true;
  if (entity.kind === "fantasma" && !["block", "house", "playerHouse", "shop", "cave"].includes(obj.type)) return true;
  return false;
}

function getSceneWidth() {
  if (currentScene === "village") return WORLD_WIDTH;
  if (currentScene === "crystalDimension") return CRYSTAL_WIDTH;
  return HOME_WIDTH;
}

function getSceneHeight() {
  if (currentScene === "village") return WORLD_HEIGHT;
  if (currentScene === "crystalDimension") return CRYSTAL_HEIGHT;
  return HOME_HEIGHT;
}

function getSceneName() {
  if (currentScene === "home") return "Casa";
  if (currentScene === "shopInterior") return "Loja";
  if (currentScene === "mayorInterior") return "Prefeito";
  if (currentScene === "crystalDimension") return "Dimensao Cristalina";
  return "Vila";
}

function setActiveScene(scene) {
  const validScenes = ["village", "home", "shopInterior", "mayorInterior", "crystalDimension"];
  const safeScene = validScenes.includes(scene) ? scene : "village";
  if (safeScene !== scene) {
    showErrorMessage(`Cena invalida "${scene}". Voltando para a vila.`);
  }

  currentScene = safeScene;
  if (safeScene === "home") objects = homeObjects;
  else if (safeScene === "shopInterior") objects = shopInteriorObjects;
  else if (safeScene === "mayorInterior") objects = mayorInteriorObjects;
  else if (safeScene === "crystalDimension") objects = crystalDimensionObjects;
  else objects = villageObjects;
  normalizeRuntimeState();
  colliders = objects.filter((obj) => obj.solid);
  interactables = objects.filter((obj) => obj.message);
  closeDialog();
  closeShop();
  keys.clear();
  projectiles.length = 0;
  enemyProjectiles.length = 0;
}

function normalizeRuntimeState() {
  normalizeLevelState();
  inventory.cristais = Number(inventory.cristais || 0);
  inventory.chaves = Number(inventory.chaves || 0);
  inventory.pocoes = Number(inventory.pocoes || 0);
  inventory.moedas = Number(inventory.moedas || 0);
  inventory.espadas = Number(inventory.espadas || 0);
  inventory.cartas = Number(inventory.cartas || 0);
  inventory.fragmentos = Number(inventory.fragmentos || 0);
  inventory.flechas = Number(inventory.flechas ?? 12);
  inventory.chavesRaras = Number(inventory.chavesRaras || 0);
  inventory.manaOrbes = Number(inventory.manaOrbes || 0);
  if (!Array.isArray(inventory.itensBoss)) inventory.itensBoss = [];

  if (!questBook.defeatedBosses || typeof questBook.defeatedBosses !== "object") {
    questBook.defeatedBosses = {};
  }
  if (!questBook.openedChests || typeof questBook.openedChests !== "object") {
    questBook.openedChests = {};
  }
  if (!questBook.discoveredAreas || typeof questBook.discoveredAreas !== "object") {
    questBook.discoveredAreas = {};
  }

  if (!Array.isArray(player.unlockedWeapons) || !player.unlockedWeapons.length) player.unlockedWeapons = [...weaponOrder];
  player.unlockedWeapons = player.unlockedWeapons.filter((key) => weapons[key]);
  if (!player.unlockedWeapons.length) player.unlockedWeapons = ["sword"];
  currentWeaponIndex = Number.isFinite(Number(currentWeaponIndex)) ? Math.floor(Number(currentWeaponIndex)) : 0;
  currentWeaponIndex = clamp(currentWeaponIndex, 0, player.unlockedWeapons.length - 1);
  if (!powerSlots.includes(equippedPower)) equippedPower = "fireball";
  if (!Number.isFinite(player.oxygen)) player.oxygen = player.maxOxygen;
  if (!Number.isFinite(player.maxOxygen)) player.maxOxygen = 10;
  player.oxygen = clamp(player.oxygen, 0, player.maxOxygen);

  for (const obj of villageObjects) {
    if (obj.type === "enemy") normalizeEnemy(obj);
  }
}

function normalizeEnemy(obj) {
  const stats = getEnemyStats(obj.kind);
  obj.width = obj.width || stats.width;
  obj.height = obj.height || stats.height;
  obj.maxHp = obj.maxHp || stats.hp;
  obj.hp = Number.isFinite(obj.hp) ? clamp(obj.hp, 0, obj.maxHp) : obj.maxHp;
  obj.damage = obj.damage || stats.damage;
  obj.speed = obj.speed || stats.speed;
  obj.aggroRange = obj.aggroRange || stats.aggroRange;
  obj.attackRange = obj.attackRange || stats.attackRange;
  obj.attackDelay = obj.attackDelay || stats.attackDelay;
  obj.attackCooldown = Number.isFinite(obj.attackCooldown) ? obj.attackCooldown : 0;
  obj.attackTimer = Number.isFinite(obj.attackTimer) ? obj.attackTimer : 0;
  obj.invulnerableTimer = Number.isFinite(obj.invulnerableTimer) ? obj.invulnerableTimer : 0;
  obj.knockbackX = Number.isFinite(obj.knockbackX) ? obj.knockbackX : 0;
  obj.knockbackY = Number.isFinite(obj.knockbackY) ? obj.knockbackY : 0;
  obj.spawnX = Number.isFinite(obj.spawnX) ? obj.spawnX : obj.x;
  obj.spawnY = Number.isFinite(obj.spawnY) ? obj.spawnY : obj.y;
  obj.canFly = Boolean(obj.canFly || stats.canFly);
  obj.canSwim = Boolean(obj.canSwim || stats.canSwim);
  obj.projectileType = obj.projectileType || stats.projectileType || null;
  obj.dropTable = obj.dropTable || stats.dropTable || { coin: 0.7, potion: 0.1, powerUp: 0.1, loot: 0.1 };
  obj.coinReward = Number.isFinite(obj.coinReward) ? obj.coinReward : stats.coinReward;
  obj.coinsReward = obj.coinReward;
  obj.xpReward = obj.xpReward || stats.xpReward || obj.coinReward;
  obj.defense = Number.isFinite(obj.defense) ? obj.defense : stats.defense || 0;
  obj.resistances = obj.resistances || stats.resistances || {};
  obj.boss = Boolean(obj.boss || stats.boss);
  obj.bossItem = obj.bossItem || stats.bossItem || null;
  obj.phase = obj.phase || 1;
  obj.direction = obj.direction || "down";
  obj.moveTimer = Number.isFinite(obj.moveTimer) ? obj.moveTimer : 0;
  obj.alive = obj.alive !== false;
}

function updateDeviceMode() {
  isMobile = window.matchMedia("(max-width: 880px), (pointer: coarse)").matches;
  document.body.classList.toggle("is-mobile", isMobile);

  const tooSmall = isMobile && window.innerWidth < 720 && window.innerHeight > window.innerWidth;
  orientationHint?.classList.toggle("hidden", !tooSmall);
  mobileDebugButton?.classList.toggle("hidden", !debugEnabled);
  debugPanel?.classList.toggle("hidden", !debugEnabled);
}

function ensureCanvasSize() {
  if (canvas.width <= 0) canvas.width = 960;
  if (canvas.height <= 0) canvas.height = 640;
  if (miniMapCanvas.width <= 0) miniMapCanvas.width = 170;
  if (miniMapCanvas.height <= 0) miniMapCanvas.height = 124;
}

function vibrate(pattern = 20) {
  if (!isMobile || !navigator.vibrate) return;
  try {
    navigator.vibrate(pattern);
  } catch (error) {
    // Alguns navegadores bloqueiam vibracao fora de gestos do usuario.
  }
}

function setMobilePressedButton(name) {
  pressedMobileButton = name;
}

function clearMobilePressedButton(name) {
  if (pressedMobileButton === name) pressedMobileButton = "";
}

function requestGameFullscreen() {
  const target = document.documentElement;
  const request = target.requestFullscreen || target.webkitRequestFullscreen || target.msRequestFullscreen;
  if (!request) {
    startMessage.textContent = "Tela cheia nao e suportada neste navegador.";
    return;
  }

  try {
    const result = request.call(target);
    if (result?.catch) {
      result.catch(() => {
        startMessage.textContent = "Toque novamente para ativar tela cheia.";
      });
    }
  } catch (error) {
    startMessage.textContent = "Toque novamente para ativar tela cheia.";
  }
}

function keepPauseMenuVisible() {
  if (!pausePanel || pausePanel.classList.contains("hidden")) return;
  const menu = pausePanel.querySelector(".pause-menu");
  if (menu) menu.scrollTop = Math.min(menu.scrollTop, Math.max(0, menu.scrollHeight - menu.clientHeight));
}

function setPause(open) {
  pauseOpen = Boolean(open);
  pausePanel?.classList.toggle("hidden", !pauseOpen);
  if (pauseOpen) {
    keepPauseMenuVisible();
    closeOverlayPanels();
    if (inventoryOpen) toggleInventory(false);
    closeShop();
    keys.clear();
  } else {
    keys.clear();
  }
}

function showHowTo() {
  showInfo(
    "Como Jogar",
    "PC:\nW A S D ou setas: mover\nE: interagir\nI: inventario\nMouse: mirar\nClique esquerdo: atacar\nQ: usar poder equipado\n1, 2, 3, 4: escolher poder\nTab: trocar arma\nEspaco: dash\nU: usar pocao\nM: missoes\nC: status\nEsc: menu\nF3: debug\n\nCelular:\nJoystick: mover\nAtaque: atacar\nPoder: usar poder equipado\nInteragir: conversar, abrir, entrar ou ativar\nInventario: abrir bolsa\nDash: esquivar\nPocao: curar\n\nProgressao:\nDerrote inimigos, complete missoes, ative cristais e abra baus para ganhar XP.\nO nivel maximo e 1000."
  );
}

function returnToStartMenu() {
  setPause(false);
  closeOverlayPanels();
  closeDialog();
  closeShop();
  inventoryOpen = false;
  inventoryPanel.classList.add("hidden");
  gameStarted = false;
  startScreen.classList.remove("hidden");
  keys.clear();
  resetJoystick();
}

function enterHome() {
  lastVillagePosition = { x: player.x, y: player.y };
  setActiveScene("home");
  player.x = 14 * TILE + 8;
  player.y = 16 * TILE;
  player.direction = "up";
}

function exitHome() {
  setActiveScene("village");
  player.x = 25 * TILE;
  player.y = 37 * TILE;
  player.direction = "down";
}

function enterShopInterior() {
  lastVillagePosition = { x: player.x, y: player.y };
  setActiveScene("shopInterior");
  player.x = 14 * TILE + 8;
  player.y = 16 * TILE;
  player.direction = "up";
}

function exitShopInterior() {
  setActiveScene("village");
  player.x = 43 * TILE + 12;
  player.y = 10 * TILE + 18;
  player.direction = "down";
}

function enterMayorInterior() {
  lastVillagePosition = { x: player.x, y: player.y };
  setActiveScene("mayorInterior");
  player.x = 14 * TILE + 8;
  player.y = 16 * TILE;
  player.direction = "up";
}

function exitMayorInterior() {
  setActiveScene("village");
  player.x = 37 * TILE + 12;
  player.y = 11 * TILE + 18;
  player.direction = "down";
}

function enterCrystalDimension() {
  lastVillagePosition = { x: player.x, y: player.y };
  const firstVisit = !questBook.discoveredAreas?.crystalDimension;
  if (!questBook.discoveredAreas) questBook.discoveredAreas = {};
  questBook.discoveredAreas.crystalDimension = true;
  dimensionQuest.entered = true;
  setActiveScene("crystalDimension");
  player.x = 22 * TILE + 16;
  player.y = 30 * TILE;
  player.direction = "up";
  playSound("portal");
  vibrate([20, 35, 20]);
  showHudToast("Voce entrou na Dimensao Cristalina");
  showDialogMessage("Voce atravessou o portal e chegou na Dimensao Cristalina.");
  if (firstVisit) awardXp(150, "Nova dimensao");
  updateQuestProgress();
}

function exitCrystalDimension() {
  setActiveScene("village");
  player.x = 35 * TILE;
  player.y = 27 * TILE;
  player.direction = "down";
  playSound("portal");
  vibrate([20, 35, 20]);
  showHudToast("Voce voltou para a vila");
  showDialogMessage("O portal devolveu voce para a vila.");
  updateQuestProgress();
}

function handleMapTransitions() {
  const playerCenter = {
    x: player.x + player.width / 2,
    y: player.y + player.height / 2,
    width: 1,
    height: 1
  };

  if (currentScene === "village") {
    const homeDoor = {
      x: 24 * TILE + 18,
      y: 33 * TILE + 82,
      width: 40,
      height: 30
    };
    if (rectsOverlap(playerCenter, homeDoor)) enterHome();
    const shopDoor = {
      x: 42 * TILE + 18,
      y: 6 * TILE + 82,
      width: 40,
      height: 30
    };
    if (rectsOverlap(playerCenter, shopDoor)) enterShopInterior();
    const mayorDoor = {
      x: 36 * TILE + 18,
      y: 8 * TILE + 82,
      width: 40,
      height: 30
    };
    if (rectsOverlap(playerCenter, mayorDoor)) enterMayorInterior();
    return;
  }

  const exitDoor = {
    x: 14 * TILE,
    y: 18 * TILE,
    width: TILE * 2,
    height: TILE * 2
  };
  if (!rectsOverlap(playerCenter, exitDoor)) return;
  if (currentScene === "home") exitHome();
  else if (currentScene === "shopInterior") exitShopInterior();
  else if (currentScene === "mayorInterior") exitMayorInterior();
}

function update(delta) {
  ensureCanvasSize();
  if (!["village", "home", "shopInterior", "mayorInterior", "crystalDimension"].includes(currentScene)) {
    setActiveScene("village");
  }

  if (!gameStarted) {
    updateHud();
    updateDebugPanel(delta);
    updateHudToast(delta);
    return;
  }

  if (gameOver) {
    updateHud();
    updateDebugPanel(delta);
    updateHudToast(delta);
    return;
  }

  updateTimedEffects(delta);
  player.levelGlowTimer = Math.max(0, Number(player.levelGlowTimer || 0) - delta);
  if (hitstopTimer > 0) {
    hitstopTimer = Math.max(0, hitstopTimer - delta);
    updateAttack(delta);
    updateFloatingTexts(delta);
    updateVisualEffects(delta);
    updateHud();
    updateHudToast(delta);
    return;
  }

  if (pauseOpen || inventoryOpen || shopOpen) {
    updateHud();
    updateInteractionHint();
    updateDebugPanel(delta);
    updateHudToast(delta);
    return;
  }

  const movement = getMovementInput();
  const inputX = movement.x;
  const inputY = movement.y;

  player.moving = inputX !== 0 || inputY !== 0;

  applyPlayerKnockback(delta);
  updateSwimming(delta);

  if (player.moving && !dialogOpen && !inventoryOpen && !shopOpen && Math.abs(playerKnockbackX) + Math.abs(playerKnockbackY) < 8) {
    const length = Math.hypot(inputX, inputY) || 1;
    const strength = movement.strength;
    const moveX = (inputX / length) * getPlayerSpeed() * strength * delta;
    const moveY = (inputY / length) * getPlayerSpeed() * strength * delta;

    if (Math.abs(inputX) > Math.abs(inputY)) {
      player.direction = inputX > 0 ? "right" : "left";
    } else if (inputY !== 0) {
      player.direction = inputY > 0 ? "down" : "up";
    }

    // Testa cada eixo separado para o jogador deslizar em paredes.
    if (canMoveTo(player.x + moveX, player.y)) player.x += moveX;
    if (canMoveTo(player.x, player.y + moveY)) player.y += moveY;
    updateSwimming(delta);
    handleMapTransitions();

    player.animTimer += delta;
    if (player.animTimer > 0.14) {
      player.frame = (player.frame + 1) % 4;
      player.animTimer = 0;
    }
  } else {
    player.frame = 0;
    player.animTimer = 0;
  }

  updateNpcs(delta);
  updateEnemies(delta);
  updateProjectiles(delta);
  updateEnemyProjectiles(delta);
  updateHazards(delta);
  collectWorldItems();
  collectPowerUps();
  updateLoot(delta);
  updateAttack(delta);
  updateFloatingTexts(delta);
  updateVisualEffects(delta);

  camera.x = clamp(player.x + player.width / 2 - canvas.width / 2, 0, getSceneWidth() - canvas.width);
  camera.y = clamp(player.y + player.height / 2 - canvas.height / 2, 0, getSceneHeight() - canvas.height);

  playerPositionEl.textContent = getAreaName();
  checkAreaDiscovery();
  collectCrystals();
  updateQuestProgress();
  updateHud();
  updateInteractionHint();
  updateDebugPanel(delta);
  updateHudToast(delta);
  if (saveNoticeTimer > 0) saveNoticeTimer = Math.max(0, saveNoticeTimer - delta);
}

function updateNpcs(delta) {
  if (currentScene !== "village" || dialogOpen || shopOpen) return;

  for (const obj of villageObjects) {
    if (obj.type !== "npc" || obj.role === "shopkeeper") continue;

    obj.moveTimer -= delta;
    if (obj.moveTimer <= 0) {
      const directions = ["up", "down", "left", "right", "idle"];
      obj.direction = directions[Math.floor(Math.random() * directions.length)];
      obj.moveTimer = 1 + Math.random() * 2.5;
    }

    if (obj.direction === "idle") continue;

    const step = directionVector(obj.direction);
    const nextX = obj.x + step.x * obj.speed * delta;
    const nextY = obj.y + step.y * obj.speed * delta;
    const nearSpawn = Math.hypot(nextX - obj.spawnX, nextY - obj.spawnY) < TILE * 4;
    if (nearSpawn && canEntityMoveTo(obj, nextX, nextY)) {
      obj.x = nextX;
      obj.y = nextY;
    } else {
      obj.moveTimer = 0;
    }
  }
}

function updateEnemies(delta) {
  if (currentScene !== "village") return;

  damageCooldown = Math.max(0, damageCooldown - delta);
  const playerRect = getPlayerRect();
  const playerCenterX = player.x + player.width / 2;
  const playerCenterY = player.y + player.height / 2;

  for (const obj of villageObjects) {
    if (obj.type !== "enemy" || !obj.alive) continue;
    normalizeEnemy(obj);

    obj.invulnerableTimer = Math.max(0, obj.invulnerableTimer - delta);
    obj.attackCooldown = Math.max(0, obj.attackCooldown - delta);
    obj.attackTimer = Math.max(0, obj.attackTimer - delta);

    if (Math.abs(obj.knockbackX) + Math.abs(obj.knockbackY) > 1) {
      const nextX = obj.x + obj.knockbackX * delta;
      const nextY = obj.y + obj.knockbackY * delta;
      if (canEntityMoveTo(obj, nextX, obj.y)) obj.x = nextX;
      if (canEntityMoveTo(obj, obj.x, nextY)) obj.y = nextY;
      obj.knockbackX *= 0.84;
      obj.knockbackY *= 0.84;
      continue;
    }

    obj.knockbackX = 0;
    obj.knockbackY = 0;

    const enemyCenterX = obj.x + obj.width / 2;
    const enemyCenterY = obj.y + obj.height / 2;
    const distanceToPlayer = Math.hypot(playerCenterX - enemyCenterX, playerCenterY - enemyCenterY);
    const distanceToSpawn = Math.hypot(obj.x - obj.spawnX, obj.y - obj.spawnY);
    const isAquaticHunter = obj.kind === "peixeHostil" || obj.kind === "serpenteLago";
    const canNoticePlayer = !isAquaticHunter || player.isSwimming || distanceToPlayer < 90;
    const isRanged = Boolean(obj.projectileType);

    if (obj.boss) {
      obj.phase = obj.hp <= obj.maxHp * 0.5 ? 2 : 1;
    }

    if (canNoticePlayer && isRanged && distanceToPlayer < obj.attackRange && obj.attackCooldown <= 0) {
      fireEnemyProjectile(obj, playerCenterX, playerCenterY);
      if (obj.boss && obj.phase === 2) fireBossPattern(obj, playerCenterX, playerCenterY);
      if (obj.kind === "aranhaRainha" || obj.kind === "aranha") {
        spawnHazardZone("web", playerCenterX, playerCenterY, obj.boss ? 44 : 30, 2.3, 1);
      }
      obj.attackCooldown = obj.attackDelay * (obj.phase === 2 ? 0.72 : 1);
      obj.state = "attack";
    }

    if (distanceToPlayer < obj.aggroRange && canNoticePlayer) {
      obj.state = "chase";
      const lowHealth = obj.hp <= obj.maxHp * 0.3;
      const shouldFlee = lowHealth && ["goblin", "arqueiroGoblin", "magoSombrio", "bruxoSombrio"].includes(obj.kind);
      const shouldKeepDistance = isRanged && distanceToPlayer < obj.attackRange * 0.55;
      const speedMultiplier = obj.boss && obj.phase === 2 ? 1.18 : 1;

      if (shouldFlee || shouldKeepDistance) {
        obj.state = "retreat";
        moveEnemyToward(obj, enemyCenterX - playerCenterX, enemyCenterY - playerCenterY, delta, speedMultiplier * 0.78);
      } else {
        let chaseX = playerCenterX - enemyCenterX;
        let chaseY = playerCenterY - enemyCenterY;
        if (obj.kind === "aranha" || obj.kind === "aranhaRainha") {
          chaseX += Math.sin(performance.now() / 260 + obj.spawnX) * 60;
          chaseY += Math.cos(performance.now() / 280 + obj.spawnY) * 45;
        }
        moveEnemyToward(obj, chaseX, chaseY, delta, speedMultiplier);
      }
    } else if (distanceToSpawn > TILE * 2) {
      obj.state = "return";
      moveEnemyToward(obj, obj.spawnX - obj.x, obj.spawnY - obj.y, delta, 0.75);
    } else {
      obj.state = "idle";
      updateEnemyWander(obj, delta);
    }

    if (obj.kind === "slimeVermelho" && obj.state === "chase" && Math.random() < delta * 0.55) {
      spawnHazardZone("slime", enemyCenterX, enemyCenterY, 24, 1.8, 1);
    }

    if (obj.kind === "serpenteLago" && obj.phase === 2 && Math.random() < delta * 0.35) {
      spawnHazardZone("whirlpool", playerCenterX, playerCenterY, 38, 1.6, 1);
    }

    if (obj.boss && distanceToPlayer < 130 && obj.attackTimer <= 0) {
      enemyProjectiles.push({
        type: "bossWave",
        x: enemyCenterX,
        y: enemyCenterY,
        radius: 10,
        maxRadius: obj.phase === 2 ? 120 : 88,
        timer: 0.7,
        damage: obj.damage
      });
      obj.attackTimer = obj.attackDelay + (obj.phase === 2 ? 0.35 : 0.8);
      playSound("shockwave");
    }

    if (rectsOverlap(playerRect, obj) && damageCooldown <= 0) {
      takeDamage(obj.damage, enemyCenterX, enemyCenterY);
      damageCooldown = obj.attackDelay;
    }
  }
}

function moveEnemyToward(obj, dx, dy, delta, speedMultiplier = 1) {
  const length = Math.hypot(dx, dy) || 1;
  const nextX = obj.x + (dx / length) * obj.speed * speedMultiplier * delta;
  const nextY = obj.y + (dy / length) * obj.speed * speedMultiplier * delta;

  if (Math.abs(dx) > Math.abs(dy)) obj.direction = dx > 0 ? "right" : "left";
  else obj.direction = dy > 0 ? "down" : "up";

  if (canEntityMoveTo(obj, nextX, obj.y) && !enemyWouldCrowd(obj, nextX, obj.y)) obj.x = nextX;
  if (canEntityMoveTo(obj, obj.x, nextY) && !enemyWouldCrowd(obj, obj.x, nextY)) obj.y = nextY;
}

function enemyWouldCrowd(obj, nextX, nextY) {
  const centerX = nextX + obj.width / 2;
  const centerY = nextY + obj.height / 2;

  return villageObjects.some((other) => {
    if (other === obj || other.type !== "enemy" || !other.alive) return false;
    const otherCenterX = other.x + other.width / 2;
    const otherCenterY = other.y + other.height / 2;
    const minDistance = (Math.max(obj.width, obj.height) + Math.max(other.width, other.height)) * 0.38;
    return Math.hypot(centerX - otherCenterX, centerY - otherCenterY) < minDistance;
  });
}

function updateEnemyWander(obj, delta) {
  obj.moveTimer -= delta;
  if (obj.moveTimer <= 0) {
    const directions = ["up", "down", "left", "right", "idle"];
    obj.direction = directions[Math.floor(Math.random() * directions.length)];
    obj.moveTimer = 0.8 + Math.random() * 1.8;
  }

  if (obj.direction === "idle") return;
  const step = directionVector(obj.direction);
  const nextX = obj.x + step.x * obj.speed * 0.55 * delta;
  const nextY = obj.y + step.y * obj.speed * 0.55 * delta;
  const nearSpawn = Math.hypot(nextX - obj.spawnX, nextY - obj.spawnY) < TILE * 4;
  if (nearSpawn && canEntityMoveTo(obj, nextX, nextY) && !enemyWouldCrowd(obj, nextX, nextY)) {
    obj.x = nextX;
    obj.y = nextY;
  } else {
    obj.moveTimer = 0;
  }
}

function fireEnemyProjectile(obj, targetX, targetY, angleOffset = 0) {
  const centerX = obj.x + obj.width / 2;
  const centerY = obj.y + obj.height / 2;
  const dx = targetX - centerX;
  const dy = targetY - centerY;
  const angle = Math.atan2(dy, dx) + angleOffset;
  const type = obj.projectileType || (obj.boss ? "bossBolt" : "shadow");
  const config = getEnemyProjectileConfig(type, obj);

  enemyProjectiles.push({
    type,
    x: centerX - config.width / 2,
    y: centerY - config.height / 2,
    width: config.width,
    height: config.height,
    vx: Math.cos(angle) * config.speed,
    vy: Math.sin(angle) * config.speed,
    damage: obj.damage,
    timer: config.timer
  });
  playSound("enemyMagic");
}

function getEnemyProjectileConfig(type, obj) {
  const bossBoost = obj.boss ? 1.18 : 1;
  const configs = {
    arrow: { width: 14, height: 5, speed: 210 * bossBoost, timer: 2.2 },
    shadow: { width: 11, height: 11, speed: 170 * bossBoost, timer: 2.1 },
    stone: { width: 13, height: 13, speed: 155 * bossBoost, timer: 2.3 },
    bubble: { width: 12, height: 12, speed: 170 * bossBoost, timer: 2.2 },
    fire: { width: 13, height: 13, speed: 220 * bossBoost, timer: 2.0 },
    slimeBall: { width: 14, height: 12, speed: 165 * bossBoost, timer: 2.0 },
    web: { width: 14, height: 14, speed: 155 * bossBoost, timer: 2.0 },
    bossBolt: { width: 14, height: 14, speed: 190, timer: 2.2 }
  };
  return configs[type] || configs.shadow;
}

function fireBossPattern(obj, targetX, targetY) {
  if (obj.kind === "reiSlime") {
    fireEnemyProjectile(obj, targetX, targetY, -0.38);
    fireEnemyProjectile(obj, targetX, targetY, 0.38);
  } else if (obj.kind === "aranhaRainha") {
    spawnHazardZone("web", targetX, targetY, 48, 2.5, 1);
  } else if (obj.kind === "golemAncestral") {
    fireEnemyProjectile(obj, targetX, targetY, -0.24);
    fireEnemyProjectile(obj, targetX, targetY, 0.24);
  } else if (obj.kind === "bruxoSombrio") {
    for (const offset of [-0.42, 0, 0.42]) fireEnemyProjectile(obj, targetX, targetY, offset);
  } else if (obj.kind === "serpenteLago") {
    spawnHazardZone("whirlpool", targetX, targetY, 42, 1.8, 1);
    fireEnemyProjectile(obj, targetX, targetY, -0.3);
    fireEnemyProjectile(obj, targetX, targetY, 0.3);
  } else {
    fireEnemyProjectile(obj, targetX, targetY, 0.32);
  }
}

function directionVector(direction) {
  if (direction === "left") return { x: -1, y: 0 };
  if (direction === "right") return { x: 1, y: 0 };
  if (direction === "up") return { x: 0, y: -1 };
  return { x: 0, y: 1 };
}

function getMovementInput() {
  const keyboardX = (keys.has("arrowright") || keys.has("d") ? 1 : 0) -
    (keys.has("arrowleft") || keys.has("a") ? 1 : 0);
  const keyboardY = (keys.has("arrowdown") || keys.has("s") ? 1 : 0) -
    (keys.has("arrowup") || keys.has("w") ? 1 : 0);
  const keyboardLength = Math.hypot(keyboardX, keyboardY);

  if (joystick.active || joystick.strength > 0.05) {
    return {
      x: joystick.x,
      y: joystick.y,
      strength: clamp(joystick.strength, 0, 1)
    };
  }

  return {
    x: keyboardX,
    y: keyboardY,
    strength: keyboardLength > 0 ? 1 : 0
  };
}

function getAimVector() {
  const centerX = player.x + player.width / 2;
  const centerY = player.y + player.height / 2;

  if (isMobile) {
    return getMobileAimDirection();
  }

  if (mouseAim.active) {
    const dx = mouseAim.worldX - centerX;
    const dy = mouseAim.worldY - centerY;
    const length = Math.hypot(dx, dy) || 1;
    return { x: dx / length, y: dy / length, angle: Math.atan2(dy, dx) };
  }

  const vector = directionVector(player.direction);
  return { ...vector, angle: Math.atan2(vector.y, vector.x) };
}

function getNearestEnemyToPlayer(maxDistance = 320) {
  if (currentScene !== "village") return null;

  const centerX = player.x + player.width / 2;
  const centerY = player.y + player.height / 2;
  let nearest = null;
  let nearestDistance = maxDistance;

  for (const obj of villageObjects) {
    if (obj.type !== "enemy" || !obj.alive) continue;
    const enemyX = obj.x + obj.width / 2;
    const enemyY = obj.y + obj.height / 2;
    const distance = Math.hypot(enemyX - centerX, enemyY - centerY);
    if (distance <= nearestDistance) {
      nearest = obj;
      nearestDistance = distance;
    }
  }

  return nearest;
}

function getMobileAimDirection(maxDistance = 360) {
  const centerX = player.x + player.width / 2;
  const centerY = player.y + player.height / 2;
  let target = mobileLockedTarget;

  if (!target || !target.alive || Math.hypot(target.x - player.x, target.y - player.y) > maxDistance + 90) {
    target = getNearestEnemyToPlayer(maxDistance);
  }

  currentAutoAimTarget = target;

  if (target) {
    const dx = target.x + target.width / 2 - centerX;
    const dy = target.y + target.height / 2 - centerY;
    const length = Math.hypot(dx, dy) || 1;
    return { x: dx / length, y: dy / length, angle: Math.atan2(dy, dx), target };
  }

  if (joystick.strength > 0.08) {
    return { x: joystick.x, y: joystick.y, angle: Math.atan2(joystick.y, joystick.x), target: null };
  }

  const vector = directionVector(player.direction);
  return { ...vector, angle: Math.atan2(vector.y, vector.x), target: null };
}

function updateDirectionFromAim() {
  const aim = getAimVector();
  if (Math.abs(aim.x) > Math.abs(aim.y)) player.direction = aim.x >= 0 ? "right" : "left";
  else player.direction = aim.y >= 0 ? "down" : "up";
}

function getCurrentWeaponKey() {
  const unlocked = player.unlockedWeapons?.length ? player.unlockedWeapons : weaponOrder;
  return unlocked[currentWeaponIndex % unlocked.length] || "sword";
}

function getCurrentWeapon() {
  return weapons[getCurrentWeaponKey()] || weapons.sword;
}

function cycleWeapon() {
  const unlocked = player.unlockedWeapons?.length ? player.unlockedWeapons : weaponOrder;
  currentWeaponIndex = (currentWeaponIndex + 1) % unlocked.length;
  spawnFloatingText(`Arma: ${getCurrentWeapon().name}`, player.x + 10, player.y - 18, "#fff264");
  showHudToast(`Arma equipada: ${getCurrentWeapon().name}`);
  playSound("weaponSwap");
  updateHud();
}

function equipWeapon(weaponKey) {
  const unlocked = player.unlockedWeapons?.length ? player.unlockedWeapons : weaponOrder;
  const index = unlocked.indexOf(weaponKey);
  if (index === -1 || !weapons[weaponKey]) {
    showHudToast("Arma ainda bloqueada.");
    playSound("invalid");
    return false;
  }

  currentWeaponIndex = index;
  spawnFloatingText(`Arma: ${weapons[weaponKey].name}`, player.x + 10, player.y - 18, "#fff264");
  showHudToast(`Arma equipada: ${weapons[weaponKey].name}`);
  playSound("equipItem");
  updateHud();
  return true;
}

function equipPower(slotIndex) {
  equippedPower = powerSlots[slotIndex] || "fireball";
  spawnFloatingText(`Poder equipado: ${powerNames[equippedPower]}`, player.x + 12, player.y - 18, "#55e8ff");
  showHudToast(`Poder equipado: ${powerNames[equippedPower]}`);
  playSound("powerup");
  vibrate(10);
  updateMobilePowerButtons();
  updateHud();
}

function useEquippedPower() {
  if (equippedPower === "fireball") castFireball();
  else if (equippedPower === "blueRay") castBlueRay();
  else if (equippedPower === "shockwave") shockwave();
  else if (equippedPower === "heal") quickHeal();
}

function updateMobilePowerButtons() {
  const buttons = [touchPower1Button, touchPower2Button, touchPower3Button, touchPower4Button];
  buttons.forEach((button, index) => {
    button?.classList.toggle("is-equipped", powerSlots[index] === equippedPower);
  });
}

function getPlayerSpeed() {
  let speed = player.speed + (activePowerUps.speed > 0 ? 70 : 0);
  if (player.isSwimming) speed *= activePowerUps.waterBreathing > 0 ? 0.82 : 0.58;
  return speed;
}

function getAreaName() {
  if (currentScene !== "village") return getSceneName();
  const tileX = Math.floor(player.x / TILE);
  const tileY = Math.floor(player.y / TILE);

  if (tileX >= 60 && tileY <= 18) return "Ruinas Antigas";
  if (tileX >= 61 && tileY >= 43 && tileY <= 54) return "Arena de Treino";
  if (tileX >= 70 && tileY >= 45) return "Monstros Fortes";
  if (tileX <= 25 && tileY >= 45) return "Floresta Profunda";
  if (tileX <= 21 && tileY >= 47) return "Cemiterio Abandonado";
  if (tileX >= 58 && tileY >= 30 && tileY <= 41) return "Campo Aberto";
  if (tileX >= 58 && tileY >= 18 && tileY <= 30) return "Lago Maior";
  if (tileX >= 51 && tileY >= 51) return "Caminho Secreto";
  return "Vila Principal";
}

function checkAreaDiscovery() {
  if (currentScene !== "village" || !gameStarted || gameOver) return;
  if (!questBook.discoveredAreas) questBook.discoveredAreas = {};
  const areaName = getAreaName();
  if (areaName === "Vila Principal" || questBook.discoveredAreas[areaName]) return;

  questBook.discoveredAreas[areaName] = true;
  awardXp(50, "Nova area");
}

function updateTimedEffects(delta) {
  updatePowerUps(delta);
  playerInvulnerableTimer = Math.max(0, playerInvulnerableTimer - delta);
  player.mana = Math.min(player.maxMana, player.mana + player.manaRegen * delta);

  for (const key of Object.keys(player.spellCooldowns)) {
    player.spellCooldowns[key] = Math.max(0, player.spellCooldowns[key] - delta);
  }
}

function updatePowerUps(delta) {
  for (const key of Object.keys(activePowerUps)) {
    activePowerUps[key] = Math.max(0, activePowerUps[key] - delta);
  }

  if (activePowerUps.regen > 0) {
    regenTickTimer += delta;
    if (regenTickTimer >= 1.2) {
      regenTickTimer = 0;
      if (player.health < player.maxHealth) {
        player.health = Math.min(player.maxHealth, player.health + 1);
        spawnFloatingText("+1", player.x + 8, player.y - 8, "#7bdb73");
      }
    }
  } else {
    regenTickTimer = 0;
  }
}

function applyPlayerKnockback(delta) {
  if (Math.abs(playerKnockbackX) + Math.abs(playerKnockbackY) < 1) {
    playerKnockbackX = 0;
    playerKnockbackY = 0;
    return;
  }

  const nextX = player.x + playerKnockbackX * delta;
  const nextY = player.y + playerKnockbackY * delta;
  if (canMoveTo(nextX, player.y)) player.x = nextX;
  if (canMoveTo(player.x, nextY)) player.y = nextY;
  playerKnockbackX *= 0.86;
  playerKnockbackY *= 0.86;
}

function spendMana(cost) {
  if (player.mana < cost) {
    spawnFloatingText("Mana insuficiente!", player.x - 18, player.y - 18, "#55e8ff");
    showHudToast("Mana insuficiente!");
    return false;
  }

  player.mana = Math.max(0, player.mana - cost);
  return true;
}

function canUsePower(name, cost) {
  if (gameOver || dialogOpen || inventoryOpen || shopOpen || pauseOpen) return false;
  if (player.spellCooldowns[name] > 0) return false;
  return spendMana(cost);
}

function castFireball() {
  if (!canUsePower("fireball", spellCosts.fireball)) return;

  updateDirectionFromAim();
  const vector = getAimVector();
  const centerX = player.x + player.width / 2;
  const centerY = player.y + player.height / 2;
  spawnPlayerProjectile({
    type: "fireball",
    x: centerX - 6,
    y: centerY - 6,
    width: 12,
    height: 12,
    vx: vector.x * 330,
    vy: vector.y * 330,
    damage: activePowerUps.force > 0 ? 4 : 3,
    damageType: "fogo",
    distance: 0,
    maxDistance: 360
  });
  player.spellCooldowns.fireball = 0.55;
  playSound("magic");
  vibrate(22);
}

function castBlueRay() {
  if (!canUsePower("blueRay", spellCosts.blueRay)) return;

  updateDirectionFromAim();
  const vector = getAimVector();
  const centerX = player.x + player.width / 2;
  const centerY = player.y + player.height / 2;
  spawnPlayerProjectile({
    type: "blueRay",
    x: centerX - 5,
    y: centerY - 5,
    width: 10,
    height: 10,
    vx: vector.x * 520,
    vy: vector.y * 520,
    damage: 3,
    damageType: "magico",
    distance: 0,
    maxDistance: 520,
    pierce: 1,
    hitKeys: new Set()
  });
  player.spellCooldowns.blueRay = 0.72;
  playSound("magic");
  vibrate(18);
}

function spawnPlayerProjectile(config) {
  playerProjectiles.push({
    pierce: 0,
    damageType: "fisico",
    hitKeys: new Set(),
    ...config
  });
}

function dash() {
  if (!canUsePower("dash", spellCosts.dash)) return;

  const vector = directionVector(player.direction);
  let moved = 0;
  for (let i = 0; i < 12; i++) {
    const nextX = player.x + vector.x * 12;
    const nextY = player.y + vector.y * 12;
    if (!canMoveTo(nextX, nextY)) break;
    dashTrails.push({ x: player.x, y: player.y, timer: 0.22, direction: player.direction });
    player.x = nextX;
    player.y = nextY;
    moved += 12;
  }

  if (moved > 0) {
    playerInvulnerableTimer = Math.max(playerInvulnerableTimer, 0.35);
    player.spellCooldowns.dash = 1.0;
    playSound("dash");
  }
}

function dodgeDash() {
  if (gameOver || dialogOpen || inventoryOpen || shopOpen || pauseOpen || dodgeCooldownTimer > 0) return;

  let vector = directionVector(player.direction);
  if (isMobile && joystick.strength > 0.08) {
    vector = { x: joystick.x, y: joystick.y };
    if (Math.abs(vector.x) > Math.abs(vector.y)) player.direction = vector.x >= 0 ? "right" : "left";
    else player.direction = vector.y >= 0 ? "down" : "up";
  } else {
    updateDirectionFromAim();
    vector = directionVector(player.direction);
  }
  let moved = 0;
  for (let i = 0; i < 7; i++) {
    const nextX = player.x + vector.x * 10;
    const nextY = player.y + vector.y * 10;
    if (!canMoveTo(nextX, nextY)) break;
    dashTrails.push({ x: player.x, y: player.y, timer: 0.18, direction: player.direction });
    player.x = nextX;
    player.y = nextY;
    moved += 10;
  }

  if (moved > 0) {
    playerInvulnerableTimer = Math.max(playerInvulnerableTimer, 0.28);
    dodgeCooldownTimer = 0.55;
    playSound("dash");
    vibrate(16);
  }
}

function shockwave() {
  if (!canUsePower("shockwave", spellCosts.shockwave)) return;

  const centerX = player.x + player.width / 2;
  const centerY = player.y + player.height / 2;
  const radius = 78;
  shockwaves.push({ x: centerX, y: centerY, radius, timer: 0.32, maxTimer: 0.32 });

  if (currentScene === "village") {
    for (const obj of villageObjects) {
      if (obj.type !== "enemy" || !obj.alive) continue;
      const enemyCenterX = obj.x + obj.width / 2;
      const enemyCenterY = obj.y + obj.height / 2;
      const distance = Math.hypot(enemyCenterX - centerX, enemyCenterY - centerY);
      if (distance <= radius) {
        damageEnemy(obj, 1, centerX, centerY, 260, "magico");
      }
    }
  }

  player.spellCooldowns.shockwave = 2.6;
  playSound("shockwave");
  vibrate([22, 30, 22]);
}

function quickHeal() {
  if (!canUsePower("heal", spellCosts.heal)) return;

  const healed = Math.min(2, player.maxHealth - player.health);
  if (healed <= 0) {
    spawnFloatingText("Vida cheia", player.x - 8, player.y - 18, "#7bdb73");
    player.mana = Math.min(player.maxMana, player.mana + spellCosts.heal);
    return;
  }

  player.health += healed;
  healBursts.push({ x: player.x + player.width / 2, y: player.y + player.height / 2, timer: 0.55, maxTimer: 0.55 });
  spawnFloatingText(`+${healed}`, player.x + 8, player.y - 12, "#7bdb73");
  player.spellCooldowns.heal = 3.0;
  playSound("heal");
  vibrate(18);
}

function updateProjectiles(delta) {
  for (let i = projectiles.length - 1; i >= 0; i--) {
    const obj = projectiles[i];
    const moveX = obj.vx * delta;
    const moveY = obj.vy * delta;
    obj.x += moveX;
    obj.y += moveY;
    obj.distance += Math.hypot(moveX, moveY);

    if (currentScene === "village" && projectileTouchesWater(obj)) {
      if (obj.type === "fireball" || obj.type === "fire") {
        spawnFloatingText("pshh", obj.x, obj.y, "#55e8ff");
        projectiles.splice(i, 1);
        continue;
      }
      if (obj.type === "arrow") {
        obj.vx *= 0.985;
        obj.vy *= 0.985;
      }
    }

    if (obj.distance > obj.maxDistance || projectileHitsObstacle(obj)) {
      projectiles.splice(i, 1);
      continue;
    }

    if (currentScene !== "village") continue;
    const target = villageObjects.find((enemyObj) => (
      enemyObj.type === "enemy" &&
      enemyObj.alive &&
      rectsOverlap(obj, enemyObj)
    ));

    if (target) {
      const targetKey = getSaveObjectKey(target);
      if (!obj.hitKeys?.has(targetKey)) {
        damageEnemy(target, obj.damage, obj.x, obj.y, 210, obj.damageType);
        obj.hitKeys?.add(targetKey);
        if (obj.pierce > 0) {
          obj.pierce -= 1;
        } else {
          projectiles.splice(i, 1);
        }
      }
    }
  }
}

function updateEnemyProjectiles(delta) {
  const playerRect = getPlayerRect();

  for (let i = enemyProjectiles.length - 1; i >= 0; i--) {
    const obj = enemyProjectiles[i];

    if (obj.type === "bossWave") {
      obj.timer -= delta;
      obj.radius += (obj.maxRadius / 0.7) * delta;
      const centerX = player.x + player.width / 2;
      const centerY = player.y + player.height / 2;
      const distance = Math.hypot(centerX - obj.x, centerY - obj.y);
      if (distance <= obj.radius && distance >= obj.radius - 20 && damageCooldown <= 0) {
        takeDamage(obj.damage, obj.x, obj.y);
        damageCooldown = 1.0;
      }
      if (obj.timer <= 0) enemyProjectiles.splice(i, 1);
      continue;
    }

    obj.timer -= delta;
    obj.x += obj.vx * delta;
    obj.y += obj.vy * delta;

    if (currentScene === "village" && projectileTouchesWater(obj)) {
      if (obj.type === "fire") {
        spawnFloatingText("pshh", obj.x, obj.y, "#55e8ff");
        enemyProjectiles.splice(i, 1);
        continue;
      }
      if (obj.type === "arrow") {
        obj.vx *= 0.985;
        obj.vy *= 0.985;
      }
    }

    if (obj.timer <= 0 || projectileHitsObstacle(obj)) {
      enemyProjectiles.splice(i, 1);
      continue;
    }

    if (rectsOverlap(playerRect, obj)) {
      takeDamage(obj.damage, obj.x, obj.y);
      enemyProjectiles.splice(i, 1);
    }
  }
}

function projectileHitsObstacle(obj) {
  if (obj.x < 0 || obj.y < 0 || obj.x + obj.width > getSceneWidth() || obj.y + obj.height > getSceneHeight()) {
    return true;
  }

  if (currentScene !== "village" && hitsWater(obj)) return true;
  return colliders.some((collider) => isColliderActive(collider) && rectsOverlap(obj, collider));
}

function projectileTouchesWater(obj) {
  return isPointInVillageWater(obj.x + obj.width / 2, obj.y + obj.height / 2);
}

function damageEnemy(obj, amount, sourceX, sourceY, knockbackPower = 170, damageType = "fisico") {
  if (!obj.alive || obj.invulnerableTimer > 0) return false;

  const critical = Math.random() < player.critChance;
  const resistance = obj.resistances?.[damageType] ?? 1;
  const rawDamage = (critical ? amount * 2 : amount) * resistance - (obj.defense || 0);
  const damage = Math.max(1, Math.round(rawDamage));
  obj.hp -= damage;
  obj.invulnerableTimer = 0.28;

  const centerX = obj.x + obj.width / 2;
  const centerY = obj.y + obj.height / 2;
  const dx = centerX - sourceX;
  const dy = centerY - sourceY;
  const length = Math.hypot(dx, dy) || 1;
  obj.knockbackX = (dx / length) * knockbackPower;
  obj.knockbackY = (dy / length) * knockbackPower;

  spawnFloatingText(critical ? `CRITICO -${damage}` : `-${damage}`, obj.x + obj.width / 2, obj.y - 8, critical ? "#ff4f62" : "#fff264");
  playSound("hitEnemy");
  hitstopTimer = 0.055;

  if (obj.hp <= 0) defeatEnemy(obj);
  return true;
}

function defeatEnemy(obj) {
  obj.alive = false;
  inventory.moedas += obj.coinReward;
  awardXp(getEnemyXpReward(obj), obj.boss ? "Boss derrotado" : "Inimigo derrotado");
  spawnFloatingText(`+${obj.coinReward} moedas`, obj.x, obj.y - 18, "#fff264");
  playSound(obj.boss ? "bossDown" : "enemyDown");

  if (["slime", "slimeVerde", "slimeVermelho", "aranha", "goblin", "morcego"].includes(obj.kind)) {
    const previousCount = questBook.forestMonstersDefeated;
    questBook.forestMonstersDefeated = Math.min(
      questBook.forestMonstersGoal,
      questBook.forestMonstersDefeated + 1
    );
    if (previousCount < questBook.forestMonstersGoal && questBook.forestMonstersDefeated >= questBook.forestMonstersGoal) {
      awardXp(300, "Missao dos monstros");
    }
  }

  if (obj.boss) {
    questBook.bossDefeated = true;
    questBook.defeatedBosses[obj.kind] = true;
    inventory.moedas += 20;
    spawnFloatingText("Item raro!", obj.x, obj.y - 34, "#55e8ff");
    vibrate([40, 60, 60]);
  }

  spawnEnemyDrops(obj);
  updateHud();
  renderInventory();
}

function spawnEnemyDrops(obj) {
  const dropTable = obj.dropTable || {};
  const centerX = obj.x + obj.width / 2 - 8;
  const centerY = obj.y + obj.height / 2 - 8;
  const scatter = (index) => ({
    x: centerX + ((index % 3) - 1) * 16,
    y: centerY + (Math.floor(index / 3) - 1) * 14
  });

  let slot = 0;
  const coinAmount = Math.max(1, Math.ceil(obj.coinReward / 3));
  if (Math.random() < (dropTable.coin ?? 0.75)) {
    const pos = scatter(slot++);
    lootItems.push(lootItem(pos.x, pos.y, "moeda", coinAmount));
  }

  if (Math.random() < (dropTable.potion ?? 0.1)) {
    const pos = scatter(slot++);
    lootItems.push(lootItem(pos.x, pos.y, "pocao", 1));
  }

  if (Math.random() < (dropTable.loot ?? 0.15)) {
    const kind = chooseLootKind(obj);
    const pos = scatter(slot++);
    lootItems.push(lootItem(pos.x, pos.y, kind, kind === "flechas" ? 4 : 1));
  }

  if (obj.boss && obj.bossItem) {
    const pos = scatter(slot++);
    lootItems.push(lootItem(pos.x, pos.y, "bossItem", 1, obj.bossItem));
  }

  if (Math.random() < (dropTable.powerUp ?? 0.1)) {
    const kinds = ["speed", "force", "shield", "regen", "mana"];
    const kind = kinds[Math.floor(Math.random() * kinds.length)];
    powerUps.push(powerUp(Math.floor(obj.x / TILE), Math.floor(obj.y / TILE), kind, true));
  }
}

function chooseLootKind(obj) {
  if (obj.kind === "arqueiroGoblin") return "flechas";
  if (obj.kind === "magoSombrio" || obj.kind === "bruxoSombrio") return "manaOrbe";
  if (obj.kind === "golemPedra" || obj.kind === "golemAncestral") return "fragmento";
  if (obj.kind === "peixeHostil" || obj.kind === "serpenteLago") return "fragmentoAzul";
  if (Math.random() < 0.06) return "chaveRara";
  return Math.random() < 0.5 ? "fragmento" : "flechas";
}

function lootItem(x, y, kind, amount = 1, itemName = "") {
  return {
    type: "loot",
    kind,
    itemName,
    amount,
    x,
    y,
    width: 16,
    height: 16,
    timer: 0,
    collected: false
  };
}

function updateLoot(delta) {
  if (currentScene !== "village") return;

  const playerRect = getPlayerRect();
  for (let i = lootItems.length - 1; i >= 0; i--) {
    const obj = lootItems[i];
    obj.timer += delta;
    if (!rectsOverlap(playerRect, obj)) continue;
    collectLoot(obj);
    lootItems.splice(i, 1);
  }
}

function collectLoot(obj) {
  const amount = obj.amount || 1;

  if (obj.kind === "moeda") {
    inventory.moedas += amount;
    playSound("coin");
    spawnFloatingText(`+${amount} moedas`, obj.x, obj.y - 8, "#fff264");
  } else if (obj.kind === "pocao") {
    inventory.pocoes += amount;
    playSound("powerup");
    spawnFloatingText("+pocao", obj.x, obj.y - 8, "#d24c63");
  } else if (obj.kind === "flechas") {
    inventory.flechas += amount;
    playSound("powerup");
    spawnFloatingText(`+${amount} flechas`, obj.x, obj.y - 8, "#fff3d6");
  } else if (obj.kind === "manaOrbe") {
    inventory.manaOrbes += amount;
    player.mana = Math.min(player.maxMana, player.mana + 2);
    playSound("magic");
    spawnFloatingText("+mana", obj.x, obj.y - 8, "#55e8ff");
  } else if (obj.kind === "chaveRara") {
    inventory.chavesRaras += amount;
    playSound("chest");
    spawnFloatingText("Chave rara!", obj.x, obj.y - 8, "#fff264");
  } else if (obj.kind === "bossItem") {
    if (!inventory.itensBoss.includes(obj.itemName)) inventory.itensBoss.push(obj.itemName);
    playSound("chest");
    spawnFloatingText(obj.itemName, obj.x, obj.y - 8, "#55e8ff");
  } else {
    inventory.fragmentos += amount;
    playSound("powerup");
    spawnFloatingText(`+${amount} fragmento`, obj.x, obj.y - 8, "#c7ccd4");
  }

  vibrate(obj.kind === "bossItem" || obj.kind === "chaveRara" ? [18, 35, 18] : 12);
  updateHud();
  renderInventory();
}

function spawnHazardZone(type, x, y, radius = 28, timer = 2.2, damage = 1) {
  hazardZones.push({
    type,
    x,
    y,
    radius,
    timer,
    maxTimer: timer,
    damage,
    tick: 0
  });
}

function updateHazards(delta) {
  if (currentScene !== "village") {
    hazardZones.length = 0;
    return;
  }

  const playerCenterX = player.x + player.width / 2;
  const playerCenterY = player.y + player.height / 2;

  for (let i = hazardZones.length - 1; i >= 0; i--) {
    const obj = hazardZones[i];
    obj.timer -= delta;
    obj.tick -= delta;

    if (obj.timer <= 0) {
      hazardZones.splice(i, 1);
      continue;
    }

    const distance = Math.hypot(playerCenterX - obj.x, playerCenterY - obj.y);
    if (distance <= obj.radius) {
      if (obj.type === "web" && player.moving) {
        player.animTimer += delta * 0.5;
      }

      if (obj.tick <= 0 && damageCooldown <= 0) {
        takeDamage(obj.damage, obj.x, obj.y);
        damageCooldown = obj.type === "whirlpool" ? 0.9 : 1.2;
        obj.tick = 1.1;
      }
    }
  }
}

function spawnFloatingText(text, x, y, color) {
  floatingTexts.push({ text, x, y, color, timer: 1.1, vy: -22 });
}

function updateFloatingTexts(delta) {
  for (let i = floatingTexts.length - 1; i >= 0; i--) {
    const obj = floatingTexts[i];
    obj.timer -= delta;
    obj.y += obj.vy * delta;
    if (obj.timer <= 0) floatingTexts.splice(i, 1);
  }
}

function updateVisualEffects(delta) {
  for (let i = shockwaves.length - 1; i >= 0; i--) {
    shockwaves[i].timer -= delta;
    if (shockwaves[i].timer <= 0) shockwaves.splice(i, 1);
  }

  for (let i = dashTrails.length - 1; i >= 0; i--) {
    dashTrails[i].timer -= delta;
    if (dashTrails[i].timer <= 0) dashTrails.splice(i, 1);
  }

  for (let i = healBursts.length - 1; i >= 0; i--) {
    healBursts[i].timer -= delta;
    if (healBursts[i].timer <= 0) healBursts.splice(i, 1);
  }
}

function drawProjectiles() {
  for (const obj of projectiles) {
    const color = getPlayerProjectileColor(obj.type);
    ctx.fillStyle = color.glow;
    ctx.fillRect(obj.x - 5, obj.y - 5, obj.width + 10, obj.height + 10);

    if (obj.type === "arrow") {
      ctx.save();
      ctx.translate(obj.x + obj.width / 2, obj.y + obj.height / 2);
      ctx.rotate(Math.atan2(obj.vy, obj.vx));
      ctx.fillStyle = "#273052";
      ctx.fillRect(-8, -2, 16, 4);
      ctx.fillStyle = "#f0b276";
      ctx.fillRect(-6, -1, 11, 2);
      ctx.fillStyle = "#fff3d6";
      ctx.fillRect(4, -3, 4, 6);
      ctx.restore();
      continue;
    }

    ctx.fillStyle = color.main;
    ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
    ctx.fillStyle = color.core;
    ctx.fillRect(obj.x + 3, obj.y + 3, Math.max(2, obj.width - 6), Math.max(2, obj.height - 6));
  }

  for (const obj of enemyProjectiles) {
    if (obj.type === "bossWave") {
      ctx.strokeStyle = "rgba(255, 79, 98, 0.85)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI * 2);
      ctx.stroke();
      continue;
    }

    const color = getEnemyProjectileColor(obj.type);
    ctx.fillStyle = color.glow;
    ctx.fillRect(obj.x - 4, obj.y - 4, obj.width + 8, obj.height + 8);
    ctx.fillStyle = color.main;
    ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
    ctx.fillStyle = color.core;
    ctx.fillRect(obj.x + 3, obj.y + 3, Math.max(2, obj.width - 6), Math.max(2, obj.height - 6));
  }
}

function getPlayerProjectileColor(type) {
  if (type === "blueRay" || type === "blueMagic") {
    return { glow: "rgba(85, 232, 255, 0.34)", main: "#3f8fe5", core: "#e9ffff" };
  }
  if (type === "arrow") {
    return { glow: "rgba(255, 243, 214, 0.18)", main: "#f0b276", core: "#fff3d6" };
  }
  return { glow: "rgba(255, 90, 58, 0.32)", main: "#ff4f62", core: "#fff264" };
}

function getEnemyProjectileColor(type) {
  if (type === "arrow") return { glow: "rgba(255, 243, 214, 0.18)", main: "#f0b276", core: "#fff3d6" };
  if (type === "stone") return { glow: "rgba(199, 204, 212, 0.25)", main: "#8a8da2", core: "#c7ccd4" };
  if (type === "bubble") return { glow: "rgba(85, 232, 255, 0.32)", main: "#3f8fe5", core: "#e9ffff" };
  if (type === "fire") return { glow: "rgba(255, 79, 98, 0.35)", main: "#ff4f62", core: "#fff264" };
  if (type === "slimeBall") return { glow: "rgba(123, 219, 115, 0.32)", main: "#7bdb73", core: "#d9ff73" };
  if (type === "web") return { glow: "rgba(233, 255, 255, 0.22)", main: "#c8dbff", core: "#e9ffff" };
  if (type === "bossBolt") return { glow: "rgba(255, 79, 98, 0.35)", main: "#ff4f62", core: "#fff264" };
  return { glow: "rgba(180, 109, 255, 0.35)", main: "#b46dff", core: "#55e8ff" };
}

function drawShockwaves() {
  for (const obj of shockwaves) {
    const progress = 1 - obj.timer / obj.maxTimer;
    ctx.strokeStyle = `rgba(85, 232, 255, ${1 - progress})`;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(obj.x, obj.y, obj.radius * progress, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawDashTrails() {
  for (const obj of dashTrails) {
    ctx.fillStyle = `rgba(85, 232, 255, ${obj.timer / 0.22})`;
    ctx.fillRect(obj.x + 4, obj.y + 5, player.width, player.height);
  }
}

function drawHealBursts() {
  for (const obj of healBursts) {
    const progress = 1 - obj.timer / obj.maxTimer;
    ctx.strokeStyle = `rgba(123, 219, 115, ${1 - progress})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(obj.x, obj.y, 18 + progress * 28, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawFloatingTexts() {
  ctx.font = "bold 12px Trebuchet MS, Arial";
  ctx.textAlign = "center";
  for (const obj of floatingTexts) {
    ctx.fillStyle = "rgba(26, 31, 61, 0.85)";
    ctx.fillText(obj.text, obj.x + 1, obj.y + 1);
    ctx.fillStyle = obj.color;
    ctx.fillText(obj.text, obj.x, obj.y);
  }
  ctx.textAlign = "start";
}

function drawAimCursor() {
  if (!mouseAim.active || !gameStarted || currentScene !== "village") return;

  ctx.strokeStyle = "rgba(255, 242, 100, 0.75)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(mouseAim.worldX - 8, mouseAim.worldY);
  ctx.lineTo(mouseAim.worldX + 8, mouseAim.worldY);
  ctx.moveTo(mouseAim.worldX, mouseAim.worldY - 8);
  ctx.lineTo(mouseAim.worldX, mouseAim.worldY + 8);
  ctx.stroke();

  ctx.strokeStyle = "rgba(39, 48, 82, 0.85)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(mouseAim.worldX, mouseAim.worldY, 10, 0, Math.PI * 2);
  ctx.stroke();
}

function drawMobileTargetMark() {
  if (!isMobile || currentScene !== "village") return;
  const target = currentAutoAimTarget || getNearestEnemyToPlayer(300);
  if (!target || !target.alive) return;

  const cx = target.x + target.width / 2;
  const cy = target.y + target.height / 2;
  const pulse = 4 + Math.sin(performance.now() / 120) * 2;
  ctx.strokeStyle = "rgba(255, 242, 100, 0.9)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, Math.max(target.width, target.height) / 2 + pulse, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "rgba(255, 242, 100, 0.85)";
  ctx.fillRect(cx - 2, target.y - 12, 4, 7);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function sanitizePlayerName(name, fallback = FALLBACK_PLAYER_NAME) {
  const cleaned = String(name || "").trim().replace(/\s+/g, " ").slice(0, 16);
  return cleaned || fallback;
}

function isTypingInTextField() {
  const el = document.activeElement;
  return Boolean(el && (
    el.tagName === "INPUT" ||
    el.tagName === "TEXTAREA" ||
    el.tagName === "SELECT" ||
    el.isContentEditable
  ));
}

function isInfoPanelOpen() {
  return Boolean(infoPanel && !infoPanel.classList.contains("hidden"));
}

function getNameFromInput() {
  return sanitizePlayerName(characterNameInput?.value, DEFAULT_NEW_PLAYER_NAME);
}

function setPlayerName(name, fallback = FALLBACK_PLAYER_NAME) {
  player.name = sanitizePlayerName(name, fallback);
  if (characterNameInput) characterNameInput.value = player.name;
  updateHud();
}

function getPlayerDisplayName() {
  return sanitizePlayerName(player.name, FALLBACK_PLAYER_NAME);
}

function getPlayerHudName() {
  normalizeLevelState();
  if (player.level >= player.maxLevel) return `${getPlayerDisplayName()} | Nv. ${player.level} MAX`;
  return `${getPlayerDisplayName()} | Nv. ${player.level}`;
}

function getXpToNextLevel(level) {
  const safeLevel = clamp(Math.floor(Number(level) || 1), 1, PLAYER_MAX_LEVEL);
  if (safeLevel >= PLAYER_MAX_LEVEL) return 0;
  return Math.floor(50 + safeLevel * safeLevel * 8);
}

function normalizeLevelState() {
  player.name = sanitizePlayerName(player.name, FALLBACK_PLAYER_NAME);
  player.maxLevel = Number.isFinite(Number(player.maxLevel)) ? Math.floor(Number(player.maxLevel)) : PLAYER_MAX_LEVEL;
  player.maxLevel = clamp(player.maxLevel, 1, PLAYER_MAX_LEVEL);
  player.level = Number.isFinite(Number(player.level)) ? Math.floor(Number(player.level)) : 1;
  player.level = clamp(player.level, 1, player.maxLevel);
  player.xp = Math.max(0, Math.floor(Number(player.xp) || 0));
  player.totalXp = Math.max(0, Math.floor(Number(player.totalXp) || 0));
  player.skillPoints = Math.max(0, Math.floor(Number(player.skillPoints) || 0));
  player.damageBonus = Math.max(0, Number(player.damageBonus) || 0);
  player.baseSpeed = Number.isFinite(Number(player.baseSpeed)) ? Number(player.baseSpeed) : 150;
  player.speed = Number.isFinite(Number(player.speed)) ? Number(player.speed) : player.baseSpeed;

  if (player.level >= player.maxLevel) {
    player.level = player.maxLevel;
    player.xp = 0;
    player.xpToNextLevel = 0;
  } else {
    player.xpToNextLevel = getXpToNextLevel(player.level);
  }
}

function awardXp(amount, reason = "XP") {
  normalizeLevelState();
  if (player.level >= player.maxLevel) {
    showHudToast("Nivel maximo");
    updateHud();
    return;
  }

  const gained = Math.max(0, Math.floor(Number(amount) || 0));
  if (!gained) return;

  player.xp += gained;
  player.totalXp += gained;
  spawnFloatingText(`+${gained} XP`, player.x + 8, player.y - 26, "#55e8ff");

  let levelsGained = 0;
  let guard = 0;
  while (player.level < player.maxLevel && player.xp >= player.xpToNextLevel && guard < PLAYER_MAX_LEVEL) {
    player.xp -= player.xpToNextLevel;
    player.level += 1;
    levelsGained += 1;
    applyLevelReward(player.level);
    player.xpToNextLevel = getXpToNextLevel(player.level);
    guard += 1;
  }

  if (player.level >= player.maxLevel) {
    player.level = player.maxLevel;
    player.xp = 0;
    player.xpToNextLevel = 0;
  }

  if (levelsGained > 0) {
    player.levelGlowTimer = 1.6;
    playSound("levelUp");
    vibrate([20, 35, 20]);
    showHudToast(`Subiu para o nivel ${player.level}!`);
    spawnFloatingText(`Nivel ${player.level}!`, player.x - 4, player.y - 42, "#fff264");
  } else {
    showHudToast(`${reason}: +${gained} XP`, 1.7);
  }

  updateHud();
  if (statusOpen) renderStatusPanel();
}

function applyLevelReward(level) {
  player.skillPoints = (player.skillPoints || 0) + 1;
  player.damageBonus = Number(player.damageBonus || 0) + 0.05;

  if (level % 5 === 0) {
    player.maxHealth += 1;
    player.health = Math.min(player.maxHealth, player.health + 1);
  }
  if (level % 3 === 0) {
    player.maxMana += 1;
    player.mana = Math.min(player.maxMana, player.mana + 1);
  }
  if (level % 10 === 0) {
    player.defense += 1;
  }
  if (level % 25 === 0) {
    player.speed = Math.min(190, player.speed + 1);
  }
}

function getEnemyXpReward(obj) {
  if (obj.boss) {
    if (["reiSlime", "aranhaRainha", "golemAncestral", "bruxoSombrio", "serpenteLago"].includes(obj.kind)) return 1000;
    return 200;
  }

  const rewards = {
    slime: 10,
    slimeVerde: 10,
    slimeVermelho: 14,
    slimeAzul: 12,
    morcego: 10,
    aranha: 15,
    goblin: 25,
    arqueiroGoblin: 30,
    magoSombrio: 50,
    golemPedra: 50,
    fantasma: 35,
    peixeHostil: 18,
    miniDragao: 80,
    guardiao: 200
  };

  return rewards[obj.kind] || Math.max(10, Number(obj.xpReward || 10));
}

function countDefeatedBosses() {
  return Object.values(questBook.defeatedBosses || {}).filter(Boolean).length;
}

function countCompletedMissions() {
  return [
    quest.status === "done",
    Boolean(questBook.keyFound),
    questBook.forestMonstersDefeated >= questBook.forestMonstersGoal,
    Boolean(questBook.letterDelivered),
    Boolean(dimensionQuest.missionDone),
    Boolean(questBook.bossChestOpened)
  ].filter(Boolean).length;
}

function readSaveRaw() {
  try {
    return localStorage.getItem(SAVE_KEY);
  } catch (error) {
    startMessage.textContent = "Nao foi possivel acessar o save neste navegador.";
    showHudToast("Save indisponivel neste navegador.");
    return null;
  }
}

function writeSaveRaw(payload) {
  try {
    localStorage.setItem(SAVE_KEY, payload);
    return true;
  } catch (error) {
    startMessage.textContent = "Nao foi possivel salvar, mas o jogo continua.";
    showHudToast("Nao foi possivel salvar.");
    return false;
  }
}

function draw() {
  ensureCanvasSize();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(-Math.round(camera.x), -Math.round(camera.y));

  drawMap();
  if (currentScene === "crystalDimension") drawDimensionAmbient();
  drawHazards();

  const visibleObjects = objects.filter((obj) => {
    if (!isOnCamera(obj, 96)) return false;
    if (obj.type === "crystal" || obj.type === "collectible") return !obj.collected;
    if (obj.type === "enemy") return obj.alive;
    if (obj.type === "dimensionBlocker" && dimensionQuest.bridgeOpen) return false;
    if (obj.type === "rareChest") return questBook.bossDefeated && !questBook.bossChestOpened;
    return obj.type !== "block";
  });
  const visiblePowerUps = currentScene === "village" ? powerUps.filter((obj) => !obj.collected && isOnCamera(obj, 80)) : [];
  const visibleLoot = currentScene === "village" ? lootItems.filter((obj) => !obj.collected && isOnCamera(obj, 80)) : [];
  const drawables = [...visibleObjects, ...visiblePowerUps, ...visibleLoot, { type: "player", y: player.y, height: player.height }];
  drawables.sort((a, b) => (a.y + a.height) - (b.y + b.height));

  for (const item of drawables) {
    if (item.type === "player") drawPlayer();
    else drawObject(item);
  }
  drawMobileTargetMark();
  drawAttack();
  drawProjectiles();
  drawShockwaves();
  drawDashTrails();
  drawHealBursts();
  drawFloatingTexts();
  drawAimCursor();

  ctx.restore();
  drawMiniMap();
}

function isOnCamera(obj, margin = 64) {
  return (
    obj.x + obj.width >= camera.x - margin &&
    obj.x <= camera.x + canvas.width + margin &&
    obj.y + obj.height >= camera.y - margin &&
    obj.y <= camera.y + canvas.height + margin
  );
}

function drawMap() {
  let activeMap = homeMap;
  let cols = HOME_COLS;
  let rows = HOME_ROWS;

  if (currentScene === "village") {
    activeMap = worldMap;
    cols = MAP_COLS;
    rows = MAP_ROWS;
  } else if (currentScene === "crystalDimension") {
    activeMap = crystalDimensionMap;
    cols = CRYSTAL_COLS;
    rows = CRYSTAL_ROWS;
  }

  const startCol = Math.floor(camera.x / TILE) - 1;
  const endCol = Math.ceil((camera.x + canvas.width) / TILE) + 1;
  const startRow = Math.floor(camera.y / TILE) - 1;
  const endRow = Math.ceil((camera.y + canvas.height) / TILE) + 1;

  for (let y = startRow; y <= endRow; y++) {
    for (let x = startCol; x <= endCol; x++) {
      if (x < 0 || y < 0 || x >= cols || y >= rows) continue;

      const tile = activeMap[y][x];
      const px = x * TILE;
      const py = y * TILE;

      if (tile === "D") drawDirt(px, py, x, y);
      else if (tile === "W") drawWater(px, py, x, y);
      else if (tile === "F") drawForestGrass(px, py, x, y);
      else if (tile === "P") drawPlaza(px, py, x, y);
      else if (tile === "I") drawInteriorFloor(px, py, x, y);
      else if (tile === "B") drawInteriorWall(px, py, x, y);
      else if (tile === "R") drawRug(px, py, x, y);
      else if (tile === "C") drawCrystalFloor(px, py, x, y);
      else if (tile === "Q") drawCrystalPath(px, py, x, y);
      else if (tile === "M") drawMagicWater(px, py, x, y);
      else drawGrass(px, py, x, y);
    }
  }
}

function pixelRect(x, y, width, height, fill, outline = "#273052") {
  ctx.fillStyle = outline;
  ctx.fillRect(Math.round(x), Math.round(y), width, height);
  ctx.fillStyle = fill;
  ctx.fillRect(Math.round(x) + 2, Math.round(y) + 2, width - 4, height - 4);
}

function drawGrass(x, y, tileX, tileY) {
  ctx.fillStyle = (tileX + tileY) % 2 === 0 ? "#8de68f" : "#82dc83";
  ctx.fillRect(x, y, TILE, TILE);
  ctx.fillStyle = "#2f8b60";
  if ((tileX * 7 + tileY * 3) % 5 === 0) {
    ctx.fillRect(x + 7, y + 19, 3, 8);
    ctx.fillRect(x + 10, y + 23, 3, 3);
  }
  if ((tileX * 2 + tileY * 9) % 7 === 0) {
    ctx.fillRect(x + 23, y + 8, 3, 8);
    ctx.fillRect(x + 20, y + 13, 3, 3);
  }
}

function drawForestGrass(x, y, tileX, tileY) {
  ctx.fillStyle = (tileX + tileY) % 2 === 0 ? "#70c96f" : "#67be66";
  ctx.fillRect(x, y, TILE, TILE);
  ctx.fillStyle = "#26794d";
  ctx.fillRect(x + 5, y + 6, 4, 12);
  if ((tileX * 5 + tileY * 11) % 4 === 0) {
    ctx.fillRect(x + 20, y + 16, 5, 10);
    ctx.fillRect(x + 16, y + 21, 4, 4);
  }
}

function drawDirt(x, y, tileX, tileY) {
  ctx.fillStyle = (tileX + tileY) % 2 === 0 ? "#a85f4a" : "#9c5744";
  ctx.fillRect(x, y, TILE, TILE);
  ctx.fillStyle = "#5d3843";
  ctx.fillRect(x + 4, y + 7, 8, 3);
  ctx.fillRect(x + 22, y + 20, 7, 3);
  ctx.fillRect(x + 15, y + 14, 4, 3);
}

function drawPlaza(x, y, tileX, tileY) {
  ctx.fillStyle = (tileX + tileY) % 2 === 0 ? "#ffd38b" : "#f2c27d";
  ctx.fillRect(x, y, TILE, TILE);
  ctx.strokeStyle = "#916b55";
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 0.5, y + 0.5, TILE - 1, TILE - 1);
  ctx.fillStyle = "rgba(255, 255, 240, 0.3)";
  if ((tileX + tileY) % 3 === 0) ctx.fillRect(x + 8, y + 8, 8, 3);
}

function drawWater(x, y, tileX, tileY) {
  ctx.fillStyle = (tileX + tileY) % 2 === 0 ? "#48a7e6" : "#3b9cdc";
  ctx.fillRect(x, y, TILE, TILE);
  ctx.fillStyle = "#7bd5ff";
  ctx.fillRect(x + 4, y + 10, 9, 3);
  ctx.fillRect(x + 16, y + 18, 11, 3);
  ctx.fillStyle = "rgba(37, 79, 150, 0.3)";
  ctx.fillRect(x, y + TILE - 3, TILE, 3);
}

function drawCrystalFloor(x, y, tileX, tileY) {
  const pulse = Math.sin(performance.now() / 1200 + tileX * 0.3 + tileY * 0.2) * 10;
  ctx.fillStyle = (tileX + tileY) % 2 === 0 ? "#34205f" : "#2a1a52";
  ctx.fillRect(x, y, TILE, TILE);
  ctx.fillStyle = `rgba(124, ${84 + pulse}, 220, 0.18)`;
  if ((tileX * 3 + tileY * 5) % 6 === 0) ctx.fillRect(x + 8, y + 9, 5, 5);
  if ((tileX * 7 + tileY * 2) % 8 === 0) ctx.fillRect(x + 21, y + 20, 6, 3);
}

function drawCrystalPath(x, y, tileX, tileY) {
  ctx.fillStyle = (tileX + tileY) % 2 === 0 ? "#5a3d86" : "#50357c";
  ctx.fillRect(x, y, TILE, TILE);
  ctx.fillStyle = "rgba(222, 194, 255, 0.2)";
  ctx.fillRect(x + 6, y + 7, 10, 3);
  ctx.fillRect(x + 18, y + 21, 8, 3);
  ctx.strokeStyle = "rgba(25, 17, 45, 0.45)";
  ctx.strokeRect(x + 0.5, y + 0.5, TILE - 1, TILE - 1);
}

function drawMagicWater(x, y, tileX, tileY) {
  const wave = Math.sin(performance.now() / 300 + tileX + tileY) * 2;
  ctx.fillStyle = (tileX + tileY) % 2 === 0 ? "#3d48c9" : "#3341aa";
  ctx.fillRect(x, y, TILE, TILE);
  ctx.fillStyle = "rgba(112, 242, 255, 0.7)";
  ctx.fillRect(x + 5, y + 10 + wave, 10, 3);
  ctx.fillRect(x + 18, y + 19 - wave, 9, 3);
  ctx.fillStyle = "rgba(188, 111, 255, 0.3)";
  ctx.fillRect(x, y + TILE - 4, TILE, 4);
}

function drawDimensionAmbient() {
  const time = performance.now() / 1000;
  const alpha = 0.06 + Math.sin(time * 0.8) * 0.025;

  if (dimensionQuest.bridgeOpen) drawCrystalBridge();

  ctx.fillStyle = `rgba(141, 75, 224, ${alpha})`;
  ctx.fillRect(camera.x, camera.y, canvas.width, canvas.height);

  const particleStep = isMobile ? 2 : 1;
  for (let i = 0; i < dimensionParticles.length; i += particleStep) {
    const particle = dimensionParticles[i];
    const px = particle.x + Math.sin(time * particle.speed + particle.phase) * 14;
    const py = particle.y + Math.cos(time * particle.speed + particle.phase) * 10;
    if (px < camera.x - 8 || px > camera.x + canvas.width + 8 || py < camera.y - 8 || py > camera.y + canvas.height + 8) continue;
    ctx.fillStyle = particle.size === 2 ? "rgba(129, 239, 255, 0.55)" : "rgba(255, 242, 100, 0.45)";
    ctx.fillRect(px, py, particle.size, particle.size);
  }
}

function drawInteriorFloor(x, y, tileX, tileY) {
  ctx.fillStyle = (tileX + tileY) % 2 === 0 ? "#f0c686" : "#e7b978";
  ctx.fillRect(x, y, TILE, TILE);
  ctx.strokeStyle = "rgba(112, 75, 55, 0.28)";
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 0.5, y + 0.5, TILE - 1, TILE - 1);
}

function drawInteriorWall(x, y, tileX, tileY) {
  ctx.fillStyle = y < TILE ? "#9cc7f2" : "#6d5c75";
  ctx.fillRect(x, y, TILE, TILE);
  ctx.fillStyle = "#273052";
  if (tileY === 0) ctx.fillRect(x, y + TILE - 4, TILE, 4);
}

function drawRug(x, y, tileX, tileY) {
  ctx.fillStyle = (tileX + tileY) % 2 === 0 ? "#d24c63" : "#bd4058";
  ctx.fillRect(x, y, TILE, TILE);
  ctx.fillStyle = "rgba(255, 242, 100, 0.22)";
  ctx.fillRect(x + 8, y + 8, 16, 16);
}

function drawObject(obj) {
  if (obj.type === "house") drawHouse(obj);
  if (obj.type === "playerHouse") drawPlayerHouse(obj);
  if (obj.type === "shop") drawShop(obj);
  if (obj.type === "tree") drawTree(obj);
  if (obj.type === "fence") drawFence(obj);
  if (obj.type === "sign") drawSign(obj);
  if (obj.type === "well") drawWell(obj);
  if (obj.type === "bench") drawBench(obj);
  if (obj.type === "portal") drawPortal(obj);
  if (obj.type === "dimensionPortal") drawPortal(obj);
  if (obj.type === "dimensionBlocker") drawDimensionBlocker(obj);
  if (obj.type === "dimensionCrystal") drawDimensionCrystal(obj);
  if (obj.type === "dimensionChest") drawDimensionChest(obj);
  if (obj.type === "dimensionSign") drawDimensionSign(obj);
  if (obj.type === "talkingStone") drawTalkingStone(obj);
  if (obj.type === "magicFountain") drawMagicFountain(obj);
  if (obj.type === "largeCrystal") drawLargeCrystal(obj);
  if (obj.type === "strangeTree") drawStrangeTree(obj);
  if (obj.type === "floatingRock") drawFloatingRock(obj);
  if (obj.type === "secretStone") drawSecretStone(obj);
  if (obj.type === "cave") drawCave(obj);
  if (obj.type === "bed") drawBed(obj);
  if (obj.type === "table") drawTable(obj);
  if (obj.type === "counter") drawCounter(obj);
  if (obj.type === "mayorDesk") drawMayorDesk(obj);
  if (obj.type === "bookshelf") drawBookshelf(obj);
  if (obj.type === "chest") drawChest(obj);
  if (obj.type === "rareChest") drawRareChest(obj);
  if (obj.type === "plant") drawPlant(obj);
  if (obj.type === "flower") drawFlower(obj);
  if (obj.type === "rock") drawRock(obj);
  if (obj.type === "crystal") drawCrystal(obj);
  if (obj.type === "collectible") drawCollectible(obj);
  if (obj.type === "loot") drawLootItem(obj);
  if (obj.type === "powerUp") drawPowerUp(obj);
  if (obj.type === "enemy") drawEnemy(obj);
  if (obj.type === "npc") drawNpc(obj);
}

function drawHouse(obj) {
  const x = obj.x;
  const y = obj.y;
  const roofColor = obj.title.length % 2 === 0 ? "#d24c63" : "#3f8fe5";

  ctx.fillStyle = "rgba(39, 48, 82, 0.25)";
  ctx.fillRect(x + 6, y + obj.height - 5, obj.width - 12, 8);

  ctx.fillStyle = "#273052";
  ctx.fillRect(x + 5, y + 35, obj.width - 10, obj.height - 35);
  ctx.fillStyle = "#d9d3d7";
  ctx.fillRect(x + 9, y + 39, obj.width - 18, obj.height - 43);
  ctx.fillStyle = "#b7b2bd";
  ctx.fillRect(x + 9, y + obj.height - 14, obj.width - 18, 10);

  ctx.fillStyle = "#273052";
  ctx.fillRect(x - 3, y + 17, obj.width + 6, 24);
  ctx.fillStyle = roofColor;
  ctx.fillRect(x + 1, y + 21, obj.width - 2, 16);
  ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
  ctx.fillRect(x + 8, y + 24, obj.width - 16, 4);

  pixelRect(x + 24, y + 61, 22, 31, "#985b44");
  ctx.fillStyle = "#ffd18b";
  ctx.fillRect(x + 38, y + 75, 3, 3);

  pixelRect(x + 73, y + 57, 25, 22, "#56b7f4");
  ctx.fillStyle = "#e6fbff";
  ctx.fillRect(x + 88, y + 61, 5, 5);
  ctx.fillStyle = "#273052";
  ctx.fillRect(x + 84, y + 57, 3, 22);
  ctx.fillRect(x + 73, y + 67, 25, 3);
}

function drawPlayerHouse(obj) {
  drawHouse({ ...obj, title: "Minha Casa" });
  const x = obj.x;
  const y = obj.y;

  ctx.fillStyle = "#fff264";
  ctx.fillRect(x + 56, y + 23, 10, 10);
  ctx.fillStyle = "#273052";
  ctx.fillRect(x + 59, y + 25, 4, 6);
}

function drawShop(obj) {
  drawHouse({ ...obj, title: "Loja" });
  const x = obj.x;
  const y = obj.y;

  pixelRect(x + 34, y + 42, 58, 14, "#fff264");
  ctx.fillStyle = "#273052";
  ctx.fillRect(x + 42, y + 47, 6, 4);
  ctx.fillRect(x + 53, y + 47, 6, 4);
  ctx.fillRect(x + 64, y + 47, 6, 4);
  ctx.fillRect(x + 75, y + 47, 6, 4);
}

function drawTree(obj) {
  const x = obj.x;
  const y = obj.y;

  ctx.fillStyle = "rgba(39, 48, 82, 0.22)";
  ctx.fillRect(x + 2, y + 55, 29, 6);
  pixelRect(x + 11, y + 35, 12, 25, "#8b5a3f");

  ctx.fillStyle = "#273052";
  ctx.fillRect(x + 4, y + 13, 24, 30);
  ctx.fillRect(x, y + 23, 32, 23);
  ctx.fillRect(x + 8, y + 4, 19, 18);
  ctx.fillStyle = "#bdf25a";
  ctx.fillRect(x + 7, y + 16, 19, 24);
  ctx.fillRect(x + 3, y + 25, 26, 15);
  ctx.fillRect(x + 10, y + 7, 15, 15);
  ctx.fillStyle = "#d9ff73";
  ctx.fillRect(x + 10, y + 10, 8, 5);
  ctx.fillRect(x + 17, y + 20, 7, 4);
}

function drawFence(obj) {
  const dark = "#273052";
  const wood = "#f0b276";

  if (obj.direction === "horizontal") {
    for (let x = obj.x; x < obj.x + obj.width; x += TILE) {
      pixelRect(x + 4, obj.y + 7, 8, 23, wood, dark);
      pixelRect(x + 20, obj.y + 7, 8, 23, wood, dark);
    }
    pixelRect(obj.x, obj.y + 13, obj.width, 7, wood, dark);
  } else {
    for (let y = obj.y; y < obj.y + obj.height; y += TILE) {
      pixelRect(obj.x + 7, y + 4, 23, 8, wood, dark);
      pixelRect(obj.x + 7, y + 20, 23, 8, wood, dark);
    }
    pixelRect(obj.x + 13, obj.y, 7, obj.height, wood, dark);
  }
}

function drawSign(obj) {
  pixelRect(obj.x + 7, obj.y + 10, 5, 18, "#8f5a3f");
  pixelRect(obj.x, obj.y, 19, 14, "#efbd75");
  ctx.fillStyle = "#8a5b4b";
  ctx.fillRect(obj.x + 4, obj.y + 5, 11, 2);
}

function drawWell(obj) {
  pixelRect(obj.x + 3, obj.y + 10, 22, 16, "#8a8da2");
  ctx.fillStyle = "#273052";
  ctx.fillRect(obj.x + 6, obj.y + 13, 16, 8);
  pixelRect(obj.x + 1, obj.y + 3, 26, 8, "#d24c63");
  pixelRect(obj.x + 4, obj.y, 5, 15, "#8b5a3f");
  pixelRect(obj.x + 20, obj.y, 5, 15, "#8b5a3f");
}

function drawBench(obj) {
  pixelRect(obj.x, obj.y, obj.width, obj.height, "#f0b276");
  ctx.fillStyle = "#8f5a3f";
  if (obj.direction === "horizontal") {
    ctx.fillRect(obj.x + 4, obj.y + 3, obj.width - 8, 2);
    ctx.fillRect(obj.x + 4, obj.y + 8, obj.width - 8, 2);
  } else {
    ctx.fillRect(obj.x + 3, obj.y + 4, 2, obj.height - 8);
    ctx.fillRect(obj.x + 8, obj.y + 4, 2, obj.height - 8);
  }
}

function drawPortal(obj) {
  const time = performance.now() / 1000;
  const pulse = Math.sin(time * 3.8);
  const isDimensional = obj.type === "dimensionPortal";
  const mainColor = isDimensional ? "#ff72dc" : "#55e8ff";
  const deepColor = isDimensional ? "#8d3fd1" : "#1f7bd8";
  const lightColor = isDimensional ? "#ffe4fb" : "#e9ffff";
  const runeColor = isDimensional ? "#fff264" : "#fff264";
  const x = obj.x;
  const y = obj.y;
  const cx = x + 32;
  const cy = y + 55;

  ctx.save();

  // Aura grande no fundo, em blocos translúcidos para manter o estilo pixel art.
  ctx.globalAlpha = 0.16 + Math.abs(pulse) * 0.07;
  ctx.fillStyle = mainColor;
  ctx.fillRect(x - 9, y + 19, 82, 69);
  ctx.globalAlpha = 0.1 + Math.abs(pulse) * 0.05;
  ctx.fillRect(x - 16, y + 34, 96, 36);
  ctx.globalAlpha = 1;

  drawSoftShadow(x + 2, y + 84, 62, 10, 0.3);

  // Plataforma de pedra com degraus e runas.
  pixelRect(x + 4, y + 80, 56, 12, "#777f98", "#232a46");
  pixelRect(x + 10, y + 72, 44, 12, "#9aa2b6", "#232a46");
  ctx.fillStyle = "#555d78";
  ctx.fillRect(x + 11, y + 83, 43, 3);
  ctx.fillRect(x + 17, y + 75, 30, 2);
  ctx.fillStyle = runeColor;
  ctx.fillRect(x + 13, y + 82, 4, 4);
  ctx.fillRect(x + 47, y + 82, 4, 4);
  ctx.fillStyle = mainColor;
  ctx.fillRect(x + 29, y + 75, 6, 3);

  // Pilares laterais, mais grossos e detalhados.
  pixelRect(x + 3, y + 18, 14, 66, "#858ca3", "#222944");
  pixelRect(x + 47, y + 18, 14, 66, "#858ca3", "#222944");
  pixelRect(x, y + 14, 20, 9, "#aeb5c8", "#222944");
  pixelRect(x + 44, y + 14, 20, 9, "#aeb5c8", "#222944");
  pixelRect(x + 7, y + 8, 50, 12, "#9ea6bd", "#222944");
  pixelRect(x + 18, y + 3, 28, 10, "#b8bfd0", "#222944");

  // Rachaduras e brilho nas pedras.
  ctx.fillStyle = "rgba(255, 255, 255, 0.24)";
  ctx.fillRect(x + 7, y + 25, 4, 18);
  ctx.fillRect(x + 51, y + 25, 4, 18);
  ctx.fillRect(x + 14, y + 11, 18, 3);
  ctx.fillStyle = "#3b435f";
  ctx.fillRect(x + 12, y + 51, 2, 13);
  ctx.fillRect(x + 50, y + 45, 2, 10);
  ctx.fillRect(x + 23, y + 8, 13, 2);
  ctx.fillStyle = mainColor;
  ctx.fillRect(x + 8, y + 60, 5, 5);
  ctx.fillRect(x + 51, y + 60, 5, 5);
  ctx.fillStyle = lightColor;
  ctx.fillRect(x + 29, y + 7, 6, 5);

  // Campo mágico interno com camadas pulsantes.
  ctx.globalAlpha = 0.75 + Math.abs(pulse) * 0.18;
  ctx.fillStyle = deepColor;
  ctx.fillRect(x + 18, y + 24, 28, 52);
  ctx.fillStyle = mainColor;
  ctx.fillRect(x + 22, y + 27 + pulse * 2, 20, 46 - pulse * 2);
  ctx.fillStyle = lightColor;
  ctx.fillRect(x + 29, y + 31 + pulse * 2, 7, 37);
  ctx.globalAlpha = 1;

  // Cristal/fenda central em formato facetado.
  ctx.save();
  ctx.translate(cx, cy + pulse * 1.5);
  ctx.shadowColor = mainColor;
  ctx.shadowBlur = 10;
  ctx.fillStyle = mainColor;
  ctx.beginPath();
  ctx.moveTo(0, -28);
  ctx.lineTo(15, -9);
  ctx.lineTo(10, 22);
  ctx.lineTo(0, 31);
  ctx.lineTo(-10, 22);
  ctx.lineTo(-15, -9);
  ctx.closePath();
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = lightColor;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
  ctx.fillRect(-4, -20, 5, 32);
  ctx.fillStyle = "rgba(255, 255, 255, 0.32)";
  ctx.fillRect(3, -12, 5, 23);
  ctx.restore();

  // Anéis/losangos de energia girando em volta do cristal.
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(time * 1.25);
  ctx.strokeStyle = mainColor;
  ctx.lineWidth = 2;
  ctx.strokeRect(-20, -27, 40, 54);
  ctx.restore();

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-time * 0.9 + 0.6);
  ctx.strokeStyle = lightColor;
  ctx.globalAlpha = 0.8;
  ctx.lineWidth = 2;
  ctx.strokeRect(-16, -23, 32, 46);
  ctx.restore();

  // Raios quebrados, estilo fenda dimensional.
  ctx.strokeStyle = lightColor;
  ctx.lineWidth = 2;
  for (let i = 0; i < 3; i++) {
    const off = Math.sin(time * 4 + i) * 3;
    ctx.beginPath();
    ctx.moveTo(x + 21 + i * 9, y + 31 + off);
    ctx.lineTo(x + 17 + i * 8, y + 45 - off);
    ctx.lineTo(x + 24 + i * 6, y + 57 + off);
    ctx.lineTo(x + 20 + i * 8, y + 70 - off);
    ctx.stroke();
  }

  // Partículas orbitando e subindo.
  for (let i = 0; i < 18; i++) {
    const angle = time * 2.2 + i * 0.7;
    const radiusX = 30 + (i % 3) * 5 + Math.sin(time * 2 + i) * 2;
    const radiusY = 34 + (i % 4) * 3;
    const px = cx + Math.cos(angle) * radiusX;
    const py = cy + Math.sin(angle) * radiusY - ((time * 18 + i * 11) % 26) * 0.25;
    drawPixelSpark(px, py, i % 3 === 0 ? lightColor : i % 2 === 0 ? mainColor : runeColor);
  }

  // Luz no chão, para o portal parecer importante na praça.
  ctx.globalAlpha = 0.28 + Math.abs(pulse) * 0.07;
  ctx.fillStyle = mainColor;
  ctx.fillRect(x + 13, y + 90, 38, 4);
  ctx.fillRect(x + 22, y + 96, 20, 3);
  ctx.globalAlpha = 1;

  ctx.restore();
}

function drawCrystalBridge() {
  const x = 21 * TILE;
  const y = 13 * TILE;
  const width = 5 * TILE;
  const height = 2 * TILE;

  ctx.fillStyle = "rgba(255, 242, 100, 0.2)";
  ctx.fillRect(x - 4, y - 4, width + 8, height + 8);
  pixelRect(x, y + 6, width, height - 12, "#8f6ec9", "#24193f");
  ctx.fillStyle = "#bba0ff";
  for (let ix = x + 12; ix < x + width - 8; ix += 24) {
    ctx.fillRect(ix, y + 12, 4, height - 24);
  }
}

function drawDimensionBlocker(obj) {
  if (dimensionQuest.bridgeOpen) return;

  const shimmer = Math.sin(performance.now() / 180) * 3;
  ctx.fillStyle = "rgba(14, 9, 30, 0.55)";
  ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
  for (let x = obj.x + 8; x < obj.x + obj.width; x += 24) {
    pixelRect(x, obj.y + 8 + shimmer, 14, 40, "#6a39c7", "#1b1336");
    ctx.fillStyle = "#c7fcff";
    ctx.fillRect(x + 5, obj.y + 13 + shimmer, 4, 10);
  }
}

function drawDimensionCrystal(obj) {
  const glow = obj.activated ? 0.45 : 0.22;
  const pulse = Math.sin(performance.now() / 220 + obj.crystalIndex) * 3;
  const flash = performance.now() - obj.activatedAt < 650 ? 8 : 0;

  ctx.fillStyle = `rgba(129, 239, 255, ${glow})`;
  ctx.fillRect(obj.x - 6 - flash, obj.y + 4 - flash, obj.width + 12 + flash * 2, obj.height + 8 + flash * 2);
  ctx.fillStyle = "#1b1336";
  ctx.fillRect(obj.x + 7, obj.y, 8, 4);
  ctx.fillRect(obj.x + 3, obj.y + 4, 16, 6);
  ctx.fillRect(obj.x, obj.y + 10, 22, 15);
  ctx.fillRect(obj.x + 6, obj.y + 25, 10, 7);
  ctx.fillStyle = obj.activated ? "#fff264" : "#55e8ff";
  ctx.fillRect(obj.x + 8, obj.y + 3 + pulse, 6, 5);
  ctx.fillRect(obj.x + 5, obj.y + 9 + pulse, 12, 15);
  ctx.fillRect(obj.x + 9, obj.y + 24 + pulse, 4, 6);
  ctx.fillStyle = "#e9ffff";
  ctx.fillRect(obj.x + 12, obj.y + 10 + pulse, 3, 8);
}

function drawDimensionChest(obj) {
  const opened = obj.opened || dimensionQuest.chestOpened;
  pixelRect(obj.x, obj.y + 12, obj.width, 20, opened ? "#a97146" : "#7f543b", "#1b1336");
  ctx.fillStyle = "#fff264";
  ctx.fillRect(obj.x + obj.width / 2 - 4, obj.y + 20, 8, 7);
  if (opened) {
    pixelRect(obj.x + 3, obj.y, obj.width - 6, 16, "#d69b5e", "#1b1336");
    ctx.fillStyle = "rgba(255, 242, 100, 0.6)";
    ctx.fillRect(obj.x + 12, obj.y - 12, obj.width - 24, 12);
  } else {
    pixelRect(obj.x + 3, obj.y + 4, obj.width - 6, 15, "#b87955", "#1b1336");
  }
}

function drawDimensionSign(obj) {
  pixelRect(obj.x + 7, obj.y + 10, 5, 18, "#6d4a8d", "#1b1336");
  pixelRect(obj.x, obj.y, 20, 14, "#bba0ff", "#1b1336");
  ctx.fillStyle = "#fff264";
  ctx.fillRect(obj.x + 5, obj.y + 5, 10, 2);
}

function drawTalkingStone(obj) {
  pixelRect(obj.x, obj.y + 4, obj.width, obj.height, "#8a8da2", "#1b1336");
  ctx.fillStyle = "#55e8ff";
  ctx.fillRect(obj.x + 8, obj.y + 1, 8, 5);
  ctx.fillStyle = "#1b1336";
  ctx.fillRect(obj.x + 6, obj.y + 13, 4, 3);
  ctx.fillRect(obj.x + 15, obj.y + 13, 4, 3);
}

function drawMagicFountain(obj) {
  pixelRect(obj.x + 8, obj.y + 24, obj.width - 16, 25, "#6d5c75", "#1b1336");
  ctx.fillStyle = "#55e8ff";
  ctx.fillRect(obj.x + 20, obj.y + 8, 24, 24);
  ctx.fillStyle = "rgba(255, 242, 100, 0.45)";
  ctx.fillRect(obj.x + 26, obj.y + 2, 12, 12);
  ctx.fillStyle = "#3d48c9";
  ctx.fillRect(obj.x + 18, obj.y + 30, 28, 10);
}

function drawLargeCrystal(obj) {
  const pulse = Math.sin(performance.now() / 300 + obj.x) * 2;
  ctx.fillStyle = "rgba(129, 239, 255, 0.25)";
  ctx.fillRect(obj.x - 5, obj.y + 8, obj.width + 10, obj.height);
  ctx.fillStyle = "#1b1336";
  ctx.fillRect(obj.x + 10, obj.y, 8, 6);
  ctx.fillRect(obj.x + 4, obj.y + 6, 20, 18);
  ctx.fillRect(obj.x, obj.y + 24, 28, 16);
  ctx.fillStyle = "#8d4be0";
  ctx.fillRect(obj.x + 8, obj.y + 8 + pulse, 12, 18);
  ctx.fillStyle = "#55e8ff";
  ctx.fillRect(obj.x + 11, obj.y + 11 + pulse, 5, 16);
  ctx.fillStyle = "#bba0ff";
  ctx.fillRect(obj.x + 7, obj.y + 27 + pulse, 14, 12);
}

function drawStrangeTree(obj) {
  const x = obj.x;
  const y = obj.y;
  pixelRect(x + 11, y + 36, 12, 28, "#4b386f", "#1b1336");
  ctx.fillStyle = "#1b1336";
  ctx.fillRect(x + 3, y + 13, 26, 28);
  ctx.fillRect(x, y + 25, 32, 23);
  ctx.fillStyle = "#7c4fd4";
  ctx.fillRect(x + 6, y + 17, 21, 20);
  ctx.fillRect(x + 4, y + 29, 24, 14);
  ctx.fillStyle = "#55e8ff";
  ctx.fillRect(x + 13, y + 21, 5, 5);
}

function drawFloatingRock(obj) {
  const float = Math.sin(performance.now() / 420 + obj.x) * 3;
  ctx.fillStyle = "rgba(0, 0, 0, 0.22)";
  ctx.fillRect(obj.x + 2, obj.y + 17, obj.width - 4, 5);
  pixelRect(obj.x, obj.y + float, obj.width, obj.height, "#76708e", "#1b1336");
  ctx.fillStyle = "#bba0ff";
  ctx.fillRect(obj.x + 6, obj.y + 5 + float, 8, 3);
}

function drawSecretStone(obj) {
  pixelRect(obj.x, obj.y + 4, obj.width, obj.height, "#9ba1ad");
  ctx.fillStyle = "#55e8ff";
  ctx.fillRect(obj.x + 9, obj.y, 6, 6);
  ctx.fillStyle = "#273052";
  ctx.fillRect(obj.x + 6, obj.y + 12, 12, 3);
}

function drawCave(obj) {
  const x = obj.x;
  const y = obj.y;
  ctx.fillStyle = "#273052";
  ctx.fillRect(x + 4, y + 18, obj.width - 8, obj.height - 18);
  ctx.fillStyle = "#6d5c75";
  ctx.fillRect(x + 10, y + 10, obj.width - 20, 20);
  ctx.fillStyle = "#1a1f3d";
  ctx.fillRect(x + 28, y + 30, 38, 34);
  ctx.fillStyle = "#9ba1ad";
  ctx.fillRect(x + 14, y + 18, 10, 9);
  ctx.fillRect(x + 70, y + 24, 8, 8);
}

function drawBed(obj) {
  pixelRect(obj.x, obj.y, obj.width, obj.height, "#9cc7f2");
  ctx.fillStyle = "#fff3d6";
  ctx.fillRect(obj.x + 8, obj.y + 8, 28, 18);
  ctx.fillStyle = "#d24c63";
  ctx.fillRect(obj.x + 8, obj.y + 32, obj.width - 16, 20);
}

function drawTable(obj) {
  pixelRect(obj.x + 8, obj.y + 8, obj.width - 16, obj.height - 16, "#b87955");
  ctx.fillStyle = "#8f5a3f";
  ctx.fillRect(obj.x + 18, obj.y + 48, 8, 16);
  ctx.fillRect(obj.x + obj.width - 26, obj.y + 48, 8, 16);
  ctx.fillStyle = "#fff264";
  ctx.fillRect(obj.x + 42, obj.y + 22, 10, 10);
}

function drawCounter(obj) {
  pixelRect(obj.x, obj.y, obj.width, obj.height, "#b87955");
  ctx.fillStyle = "#8f5a3f";
  for (let x = obj.x + 12; x < obj.x + obj.width - 12; x += 42) {
    ctx.fillRect(x, obj.y + 8, 24, 8);
  }
  ctx.fillStyle = "#d24c63";
  ctx.fillRect(obj.x + 70, obj.y + 18, 16, 16);
  ctx.fillStyle = "#55e8ff";
  ctx.fillRect(obj.x + 132, obj.y + 16, 16, 18);
}

function drawMayorDesk(obj) {
  pixelRect(obj.x, obj.y, obj.width, obj.height, "#8f5a3f");
  ctx.fillStyle = "#b87955";
  ctx.fillRect(obj.x + 8, obj.y + 8, obj.width - 16, obj.height - 16);
  ctx.fillStyle = "#fff3d6";
  ctx.fillRect(obj.x + 24, obj.y + 18, 34, 22);
  ctx.fillRect(obj.x + 96, obj.y + 22, 42, 18);
  ctx.fillStyle = "#fff264";
  ctx.fillRect(obj.x + obj.width / 2 - 8, obj.y + 48, 16, 12);
}

function drawBookshelf(obj) {
  pixelRect(obj.x, obj.y, obj.width, obj.height, "#8f5a3f");
  ctx.fillStyle = "#273052";
  ctx.fillRect(obj.x + 7, obj.y + 22, obj.width - 14, 4);
  ctx.fillRect(obj.x + 7, obj.y + 50, obj.width - 14, 4);
  ctx.fillStyle = "#55c4ff";
  ctx.fillRect(obj.x + 10, obj.y + 8, 7, 14);
  ctx.fillStyle = "#d24c63";
  ctx.fillRect(obj.x + 21, obj.y + 8, 7, 14);
  ctx.fillStyle = "#fff264";
  ctx.fillRect(obj.x + 34, obj.y + 36, 7, 14);
}

function drawChest(obj) {
  pixelRect(obj.x, obj.y + 4, obj.width, obj.height - 4, "#b87955");
  ctx.fillStyle = "#fff264";
  ctx.fillRect(obj.x + obj.width / 2 - 4, obj.y + 14, 8, 8);
}

function drawRareChest(obj) {
  const shine = Math.sin(performance.now() / 180) * 3;
  ctx.fillStyle = "rgba(255, 242, 100, 0.35)";
  ctx.fillRect(obj.x - 6, obj.y - 8 + shine, obj.width + 12, obj.height + 16);
  pixelRect(obj.x, obj.y + 8, obj.width, 22, "#8f5a3f", "#1a1f3d");
  pixelRect(obj.x + 4, obj.y, obj.width - 8, 18, "#fff264", "#1a1f3d");
  ctx.fillStyle = "#55e8ff";
  ctx.fillRect(obj.x + obj.width / 2 - 5, obj.y + 14, 10, 8);
}

function drawPlant(obj) {
  pixelRect(obj.x + 5, obj.y + 18, 14, 14, "#d24c63");
  ctx.fillStyle = "#26794d";
  ctx.fillRect(obj.x + 10, obj.y + 8, 4, 14);
  ctx.fillStyle = "#7bdb73";
  ctx.fillRect(obj.x + 4, obj.y + 3, 10, 8);
  ctx.fillRect(obj.x + 12, obj.y, 10, 9);
}

function drawFlower(obj) {
  const colors = {
    pink: "#ff6fa8",
    yellow: "#fff264",
    blue: "#55c4ff"
  };

  ctx.fillStyle = "#26794d";
  ctx.fillRect(obj.x + 5, obj.y + 5, 2, 8);
  ctx.fillStyle = "#273052";
  ctx.fillRect(obj.x + 2, obj.y, 9, 9);
  ctx.fillStyle = colors[obj.color] || colors.pink;
  ctx.fillRect(obj.x + 3, obj.y + 1, 3, 3);
  ctx.fillRect(obj.x + 7, obj.y + 1, 3, 3);
  ctx.fillRect(obj.x + 5, obj.y + 4, 3, 3);
}

function drawRock(obj) {
  ctx.fillStyle = "#273052";
  ctx.fillRect(obj.x + 1, obj.y + 5, 16, 10);
  ctx.fillStyle = "#9ba1ad";
  ctx.fillRect(obj.x + 3, obj.y + 6, 12, 7);
  ctx.fillStyle = "#c7ccd4";
  ctx.fillRect(obj.x + 6, obj.y + 4, 7, 4);
}

function drawCrystal(obj) {
  const pulse = Math.sin(performance.now() / 180) * 2;
  const y = obj.y + pulse;

  ctx.fillStyle = "rgba(85, 196, 255, 0.35)";
  ctx.fillRect(obj.x - 3, obj.y + 18, 22, 6);
  ctx.fillStyle = "#273052";
  ctx.fillRect(obj.x + 5, y, 7, 6);
  ctx.fillRect(obj.x + 2, y + 5, 13, 14);
  ctx.fillRect(obj.x + 5, y + 18, 7, 6);
  ctx.fillStyle = "#55e8ff";
  ctx.fillRect(obj.x + 6, y + 2, 5, 5);
  ctx.fillRect(obj.x + 4, y + 7, 9, 10);
  ctx.fillRect(obj.x + 7, y + 17, 4, 4);
  ctx.fillStyle = "#e9ffff";
  ctx.fillRect(obj.x + 6, y + 8, 3, 5);
}

function drawCollectible(obj) {
  const x = obj.x;
  const y = obj.y + Math.sin(performance.now() / 240) * 1.5;

  if (obj.item === "moeda") {
    ctx.fillStyle = "#273052";
    ctx.fillRect(x + 3, y + 2, 12, 12);
    ctx.fillStyle = "#fff264";
    ctx.fillRect(x + 5, y + 4, 8, 8);
    ctx.fillStyle = "#f0b276";
    ctx.fillRect(x + 8, y + 5, 2, 6);
    return;
  }

  if (obj.item === "pocao") {
    pixelRect(x + 4, y + 2, 10, 15, "#d24c63");
    ctx.fillStyle = "#55e8ff";
    ctx.fillRect(x + 6, y, 6, 4);
    return;
  }

  if (obj.item === "chave") {
    ctx.fillStyle = "#273052";
    ctx.fillRect(x + 2, y + 5, 14, 6);
    ctx.fillStyle = "#fff264";
    ctx.fillRect(x + 3, y + 6, 8, 4);
    ctx.fillRect(x + 10, y + 9, 6, 3);
    ctx.fillRect(x + 13, y + 12, 3, 3);
    return;
  }

  if (obj.item === "espada") {
    ctx.fillStyle = "#273052";
    ctx.fillRect(x + 7, y, 4, 18);
    ctx.fillStyle = "#e9ffff";
    ctx.fillRect(x + 8, y + 1, 2, 13);
    ctx.fillStyle = "#fff264";
    ctx.fillRect(x + 4, y + 13, 10, 3);
    return;
  }

  if (obj.item === "carta") {
    pixelRect(x + 1, y + 3, 16, 12, "#fff3d6");
    ctx.fillStyle = "#d24c63";
    ctx.fillRect(x + 6, y + 7, 5, 4);
  }
}

function drawLootItem(obj) {
  const x = obj.x;
  const y = obj.y + Math.sin(performance.now() / 190 + obj.x) * 2;

  if (obj.kind === "bossItem") {
    ctx.fillStyle = "rgba(85, 232, 255, 0.35)";
    ctx.fillRect(x - 3, y - 3, 22, 22);
    pixelRect(x + 2, y + 2, 12, 12, "#55e8ff");
    ctx.fillStyle = "#fff264";
    ctx.fillRect(x + 6, y + 5, 4, 4);
    return;
  }

  if (obj.kind === "fragmento" || obj.kind === "fragmentoAzul") {
    ctx.fillStyle = "#273052";
    ctx.fillRect(x + 2, y + 4, 12, 10);
    ctx.fillStyle = obj.kind === "fragmentoAzul" ? "#55e8ff" : "#c7ccd4";
    ctx.fillRect(x + 4, y + 5, 8, 7);
    ctx.fillStyle = "#e9ffff";
    ctx.fillRect(x + 7, y + 4, 4, 3);
    return;
  }

  if (obj.kind === "flechas") {
    ctx.fillStyle = "#273052";
    ctx.fillRect(x + 2, y + 7, 14, 4);
    ctx.fillRect(x + 10, y + 4, 4, 10);
    ctx.fillStyle = "#f0b276";
    ctx.fillRect(x + 3, y + 8, 11, 2);
    ctx.fillStyle = "#fff3d6";
    ctx.fillRect(x + 12, y + 5, 3, 3);
    return;
  }

  if (obj.kind === "manaOrbe") {
    ctx.fillStyle = "rgba(180, 109, 255, 0.3)";
    ctx.fillRect(x - 2, y - 2, 20, 20);
    pixelRect(x + 3, y + 3, 10, 10, "#b46dff");
    ctx.fillStyle = "#55e8ff";
    ctx.fillRect(x + 7, y + 5, 3, 3);
    return;
  }

  if (obj.kind === "chaveRara") {
    ctx.fillStyle = "#273052";
    ctx.fillRect(x + 1, y + 5, 16, 6);
    ctx.fillStyle = "#55e8ff";
    ctx.fillRect(x + 3, y + 6, 9, 4);
    ctx.fillRect(x + 11, y + 9, 6, 3);
    ctx.fillStyle = "#fff264";
    ctx.fillRect(x + 5, y + 7, 3, 2);
    return;
  }

  drawCollectible({
    item: obj.kind === "moeda" ? "moeda" : "pocao",
    x,
    y
  });
}

function drawHazards() {
  for (const obj of hazardZones) {
    const alpha = Math.max(0, obj.timer / obj.maxTimer);
    if (obj.type === "web") {
      ctx.strokeStyle = `rgba(233, 255, 255, ${0.35 * alpha})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(obj.x - obj.radius, obj.y);
      ctx.lineTo(obj.x + obj.radius, obj.y);
      ctx.moveTo(obj.x, obj.y - obj.radius);
      ctx.lineTo(obj.x, obj.y + obj.radius);
      ctx.stroke();
    } else if (obj.type === "whirlpool") {
      ctx.strokeStyle = `rgba(85, 232, 255, ${0.55 * alpha})`;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(obj.x, obj.y, obj.radius * (1 - alpha * 0.25), performance.now() / 300, Math.PI * 1.6 + performance.now() / 300);
      ctx.stroke();
    } else {
      ctx.fillStyle = `rgba(255, 79, 98, ${0.18 * alpha})`;
      ctx.beginPath();
      ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawPowerUp(obj) {
  const x = obj.x;
  const y = obj.y + Math.sin(performance.now() / 210 + obj.x) * 2;
  const glow = 0.28 + Math.sin(performance.now() / 180) * 0.08;

  const colors = {
    speed: "#55e8ff",
    force: "#ff4f62",
    shield: "#fff264",
    regen: "#7bdb73",
    mana: "#b46dff"
  };
  colors.waterBreathing = "#7bd5ff";

  ctx.fillStyle = `rgba(255, 255, 255, ${glow})`;
  ctx.fillRect(x - 5, y - 5, 28, 28);
  ctx.fillStyle = "#273052";

  if (obj.kind === "speed") {
    ctx.fillRect(x + 3, y + 5, 12, 12);
    ctx.fillStyle = colors.speed;
    ctx.fillRect(x + 5, y + 3, 8, 10);
    ctx.fillRect(x + 2, y + 12, 15, 5);
    ctx.fillStyle = "#e9ffff";
    ctx.fillRect(x + 11, y + 5, 3, 5);
    return;
  }

  if (obj.kind === "force") {
    ctx.fillRect(x + 8, y, 4, 20);
    ctx.fillStyle = colors.force;
    ctx.fillRect(x + 9, y + 1, 2, 14);
    ctx.fillStyle = "#fff264";
    ctx.fillRect(x + 4, y + 14, 12, 3);
    return;
  }

  if (obj.kind === "shield") {
    ctx.fillRect(x + 3, y + 2, 14, 17);
    ctx.fillStyle = colors.shield;
    ctx.fillRect(x + 5, y + 4, 10, 10);
    ctx.fillRect(x + 8, y + 14, 4, 4);
    return;
  }

  if (obj.kind === "regen") {
    ctx.fillStyle = colors.regen;
    ctx.fillRect(x + 6, y + 4, 8, 4);
    ctx.fillRect(x + 4, y + 8, 12, 4);
    ctx.fillRect(x + 6, y + 12, 8, 4);
    ctx.fillRect(x + 8, y + 16, 4, 3);
    return;
  }

  if (obj.kind === "waterBreathing") {
    ctx.fillStyle = colors.waterBreathing;
    ctx.fillRect(x + 4, y + 8, 12, 8);
    ctx.fillRect(x + 7, y + 4, 6, 6);
    ctx.fillStyle = "#e9ffff";
    ctx.fillRect(x + 5, y + 2, 4, 4);
    ctx.fillRect(x + 13, y, 3, 3);
    return;
  }

  ctx.fillStyle = "#273052";
  ctx.fillRect(x + 2, y + 2, 16, 16);
  ctx.fillStyle = colors.mana;
  ctx.fillRect(x + 5, y + 5, 10, 10);
  ctx.fillStyle = "#e9ffff";
  ctx.fillRect(x + 8, y + 4, 4, 4);
}

function drawEnemy(obj) {
  const x = obj.x;
  const y = obj.y;
  const blinking = obj.invulnerableTimer > 0 && Math.floor(performance.now() / 70) % 2 === 0;
  const phaseGlow = obj.boss && obj.phase === 2;

  ctx.save();
  if (blinking) ctx.globalAlpha = 0.45;

  if (phaseGlow) {
    ctx.fillStyle = "rgba(255, 79, 98, 0.22)";
    ctx.fillRect(x - 6, y - 8, obj.width + 12, obj.height + 14);
  }

  if (obj.kind === "morcego") {
    ctx.fillStyle = "#273052";
    ctx.fillRect(x, y + 8, 24, 8);
    ctx.fillRect(x + 8, y + 3, 8, 14);
    ctx.fillStyle = "#6d5c75";
    ctx.fillRect(x + 2, y + 9, 7, 4);
    ctx.fillRect(x + 15, y + 9, 7, 4);
    ctx.fillStyle = "#fff264";
    ctx.fillRect(x + 10, y + 7, 2, 2);
    ctx.fillRect(x + 14, y + 7, 2, 2);
  } else if (obj.kind === "slimeVermelho" || obj.kind === "reiSlime" || obj.kind === "slimeVerde" || obj.kind === "slimeAzul" || obj.kind === "slime") {
    const slimeColor = obj.kind === "slimeVermelho" ? "#ff4f62" :
      obj.kind === "slimeAzul" ? "#55e8ff" :
        obj.kind === "reiSlime" ? "#7bdb73" : "#55e8ff";
    ctx.fillStyle = "rgba(39, 48, 82, 0.25)";
    ctx.fillRect(x + 2, y + obj.height - 4, obj.width - 2, 5);
    ctx.fillStyle = "#273052";
    ctx.fillRect(x + 1, y + 5, obj.width - 2, obj.height - 5);
    ctx.fillStyle = slimeColor;
    ctx.fillRect(x + 3, y + 7, obj.width - 6, obj.height - 9);
    ctx.fillStyle = "#fff264";
    ctx.fillRect(x + 6, y + 11, 2, 2);
    ctx.fillRect(x + obj.width - 8, y + 11, 2, 2);
    if (obj.kind === "reiSlime") {
      ctx.fillStyle = "#fff264";
      ctx.fillRect(x + obj.width / 2 - 7, y, 14, 5);
      ctx.fillRect(x + obj.width / 2 - 4, y - 4, 3, 5);
      ctx.fillRect(x + obj.width / 2 + 3, y - 4, 3, 5);
    }
  } else if (obj.kind === "golem" || obj.kind === "golemPedra" || obj.kind === "golemAncestral") {
    ctx.fillStyle = "rgba(39, 48, 82, 0.25)";
    ctx.fillRect(x + 1, y + obj.height - 4, obj.width, 6);
    pixelRect(x + 4, y + Math.max(10, obj.height - 20), obj.width - 8, 18, "#8a8da2");
    pixelRect(x + 7, y + 2, obj.width - 14, 14, "#76708e");
    ctx.fillStyle = "#55e8ff";
    ctx.fillRect(x + 9, y + 8, 3, 3);
    ctx.fillRect(x + obj.width - 13, y + 8, 3, 3);
  } else if (obj.kind === "mago" || obj.kind === "magoSombrio" || obj.kind === "bruxoSombrio") {
    pixelRect(x + 4, y + 9, obj.width - 8, obj.height - 9, obj.kind === "bruxoSombrio" ? "#6d3d8f" : "#4b386f");
    ctx.fillStyle = "#273052";
    ctx.fillRect(x + 2, y + 4, obj.width - 4, 8);
    ctx.fillStyle = "#b46dff";
    ctx.fillRect(x + obj.width / 2 - 4, y + 1, 8, 8);
    ctx.fillStyle = "#55e8ff";
    ctx.fillRect(x + obj.width / 2 - 2, y + 15, 4, 4);
  } else if (obj.kind === "guardiao" || obj.kind === "miniGuardiao") {
    ctx.fillStyle = "rgba(39, 48, 82, 0.3)";
    ctx.fillRect(x + 2, y + obj.height - 5, obj.width - 2, 7);
    pixelRect(x + 4, y + 16, obj.width - 8, obj.height - 17, "#7c6b8f", "#1a1f3d");
    pixelRect(x + 9, y + 1, obj.width - 18, 19, "#8a8da2", "#1a1f3d");
    ctx.fillStyle = "#ff4f62";
    ctx.fillRect(x + 13, y + 9, 4, 4);
    ctx.fillRect(x + obj.width - 17, y + 9, 4, 4);
    ctx.fillStyle = "#fff264";
    ctx.fillRect(x + obj.width / 2 - 3, y + obj.height - 15, 7, 7);
  } else if (obj.kind === "aranha" || obj.kind === "aranhaRainha") {
    ctx.fillStyle = "rgba(39, 48, 82, 0.25)";
    ctx.fillRect(x + 2, y + obj.height - 4, obj.width - 2, 5);
    ctx.fillStyle = "#273052";
    for (let i = 0; i < 4; i++) {
      ctx.fillRect(x + 2 + i * 6, y + 6, 4, obj.height - 6);
      ctx.fillRect(x + 1 + i * 7, y + obj.height - 8, 6, 3);
    }
    ctx.fillStyle = obj.kind === "aranhaRainha" ? "#d24c63" : "#6d5c75";
    ctx.fillRect(x + 6, y + 7, obj.width - 12, obj.height - 9);
    ctx.fillStyle = "#fff264";
    ctx.fillRect(x + 10, y + 11, 2, 2);
    ctx.fillRect(x + obj.width - 12, y + 11, 2, 2);
  } else if (obj.kind === "goblin" || obj.kind === "arqueiroGoblin") {
    pixelRect(x + 4, y + 11, obj.width - 8, obj.height - 10, obj.kind === "arqueiroGoblin" ? "#7bdb73" : "#a45d3d");
    pixelRect(x + 5, y + 2, obj.width - 10, 13, "#7bdb73");
    ctx.fillStyle = "#273052";
    ctx.fillRect(x + 2, y + 7, 5, 3);
    ctx.fillRect(x + obj.width - 7, y + 7, 5, 3);
    ctx.fillRect(x + 8, y + 8, 2, 2);
    ctx.fillRect(x + obj.width - 11, y + 8, 2, 2);
    if (obj.kind === "arqueiroGoblin") {
      ctx.fillStyle = "#f0b276";
      ctx.fillRect(x + obj.width - 4, y + 9, 3, 17);
    }
  } else if (obj.kind === "fantasma") {
    ctx.globalAlpha = blinking ? 0.35 : 0.78;
    ctx.fillStyle = "#273052";
    ctx.fillRect(x + 2, y + 3, obj.width - 4, obj.height - 4);
    ctx.fillStyle = "#e9ffff";
    ctx.fillRect(x + 4, y + 5, obj.width - 8, obj.height - 8);
    ctx.fillStyle = "#b46dff";
    ctx.fillRect(x + 8, y + 12, 3, 3);
    ctx.fillRect(x + obj.width - 11, y + 12, 3, 3);
    ctx.fillRect(x + 5, y + obj.height - 8, 4, 5);
    ctx.fillRect(x + 14, y + obj.height - 8, 4, 5);
  } else if (obj.kind === "peixeHostil" || obj.kind === "serpenteLago") {
    ctx.fillStyle = "rgba(39, 48, 82, 0.25)";
    ctx.fillRect(x + 2, y + obj.height - 2, obj.width - 4, 4);
    ctx.fillStyle = "#273052";
    ctx.fillRect(x + 1, y + 4, obj.width - 6, obj.height - 6);
    ctx.fillRect(x + obj.width - 9, y + 8, 8, 8);
    ctx.fillStyle = obj.kind === "serpenteLago" ? "#3f8fe5" : "#55e8ff";
    ctx.fillRect(x + 3, y + 6, obj.width - 10, obj.height - 10);
    ctx.fillRect(x + obj.width - 7, y + 10, 5, 4);
    ctx.fillStyle = "#fff264";
    ctx.fillRect(x + 8, y + 8, 2, 2);
  } else if (obj.kind === "miniDragao") {
    ctx.fillStyle = "rgba(39, 48, 82, 0.25)";
    ctx.fillRect(x + 3, y + obj.height - 4, obj.width - 5, 5);
    ctx.fillStyle = "#273052";
    ctx.fillRect(x + 3, y + 8, obj.width - 8, obj.height - 8);
    ctx.fillRect(x + obj.width - 8, y + 4, 8, 11);
    ctx.fillRect(x + 2, y + 4, 8, 8);
    ctx.fillStyle = "#ff4f62";
    ctx.fillRect(x + 5, y + 10, obj.width - 13, obj.height - 12);
    ctx.fillStyle = "#fff264";
    ctx.fillRect(x + obj.width - 6, y + 7, 2, 2);
  } else {
    ctx.fillStyle = "rgba(39, 48, 82, 0.25)";
    ctx.fillRect(x + 2, y + 17, 20, 5);
    ctx.fillStyle = "#273052";
    ctx.fillRect(x + 1, y + 5, 20, 15);
    ctx.fillStyle = "#55e8ff";
    ctx.fillRect(x + 3, y + 7, 16, 11);
    ctx.fillStyle = "#273052";
    ctx.fillRect(x + 6, y + 11, 2, 2);
    ctx.fillRect(x + 14, y + 11, 2, 2);
  }

  ctx.fillStyle = "#273052";
  ctx.fillRect(x, y - 6, obj.width, 4);
  ctx.fillStyle = "#d24c63";
  ctx.fillRect(x, y - 6, Math.max(0, obj.width * (obj.hp / obj.maxHp)), 4);
  if (obj.boss) {
    ctx.fillStyle = "#fff264";
    ctx.fillRect(x, y - 12, Math.max(0, obj.width * (obj.hp / obj.maxHp)), 3);
  }
  ctx.restore();
}

function drawAttack() {
  if (attackTimer <= 0 || !currentMeleeAttack) return;
  const centerX = player.x + player.width / 2;
  const centerY = player.y + player.height / 2;
  const preparing = attackWindupTimer > 0;

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(currentMeleeAttack.angle);
  ctx.strokeStyle = preparing ? "#55e8ff" : "#fff264";
  ctx.fillStyle = preparing ? "rgba(85, 232, 255, 0.12)" : "rgba(255, 242, 100, 0.32)";
  ctx.lineWidth = preparing ? 2 : 4;

  if (currentMeleeAttack.weaponKey === "spear") {
    ctx.fillRect(8, -5, currentMeleeAttack.range, 10);
    ctx.strokeRect(8, -5, currentMeleeAttack.range, 10);
  } else {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, currentMeleeAttack.range, -currentMeleeAttack.arc / 2, currentMeleeAttack.arc / 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
}

function drawNpc(obj) {
  const bob = Math.sin(performance.now() / 300 + obj.bob) * 2;
  const x = obj.x;
  const y = obj.y + bob;
  const shirt = obj.role === "dimensionGuide" ? "#8d4be0" :
    obj.role === "dimensionMystic" ? "#55e8ff" :
      obj.name === "Nico" ? "#3f8fe5" : obj.name === "Ari" ? "#d24c63" : "#7bdb73";

  ctx.fillStyle = "rgba(39, 48, 82, 0.25)";
  ctx.fillRect(x + 4, y + 27, 20, 5);
  pixelRect(x + 5, y + 11, 14, 16, shirt);
  pixelRect(x + 4, y + 2, 16, 13, "#f4bd8f");
  ctx.fillStyle = "#273052";
  ctx.fillRect(x + 3, y, 18, 5);
  ctx.fillRect(x + 7, y + 27, 4, 6);
  ctx.fillRect(x + 15, y + 27, 4, 6);
  ctx.fillRect(x + 8, y + 8, 2, 2);
  ctx.fillRect(x + 15, y + 8, 2, 2);
}

function drawPlayer() {
  const x = player.x;
  const y = player.y;
  const legOffset = player.moving ? [0, 2, 0, -2][player.frame] : 0;
  const blinking = playerInvulnerableTimer > 0 && Math.floor(performance.now() / 80) % 2 === 0;

  ctx.save();
  if (blinking) ctx.globalAlpha = 0.45;

  if (player.isSwimming) {
    ctx.strokeStyle = "rgba(233, 255, 255, 0.75)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(x + 12, y + 25, 18, 7, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  if (player.levelGlowTimer > 0) {
    const pulse = 0.35 + Math.sin(performance.now() / 80) * 0.18;
    ctx.fillStyle = `rgba(255, 242, 100, ${pulse})`;
    ctx.fillRect(x - 8, y - 8, player.width + 16, player.height + 16);
    ctx.fillStyle = "rgba(85, 232, 255, 0.34)";
    ctx.fillRect(x - 2, y - 14, player.width + 4, 5);
    ctx.fillRect(x + 3, y + player.height + 4, player.width - 6, 4);
  }

  ctx.fillStyle = "rgba(39, 48, 82, 0.25)";
  ctx.fillRect(x + 3, y + 25, 22, 5);

  pixelRect(x + 5, y + 12, 17, 14, "#313a78");
  ctx.fillStyle = "#f4bd8f";
  ctx.fillRect(x + 7, y + 4, 14, 10);
  ctx.fillStyle = "#273052";
  ctx.fillRect(x + 5, y + 2, 18, 5);
  ctx.fillRect(x + 4, y + 6, 5, 8);
  ctx.fillStyle = "#5ad6e7";
  ctx.fillRect(x + 7, y, 12, 5);
  ctx.fillRect(x + 4, y + 5, 5, 7);

  ctx.fillStyle = "#273052";
  ctx.fillRect(x + 7, y + 25 + legOffset, 5, 6);
  ctx.fillRect(x + 16, y + 25 - legOffset, 5, 6);

  if (player.direction === "up") {
    ctx.fillRect(x + 9, y + 6, 10, 2);
  } else if (player.direction === "down") {
    ctx.fillRect(x + 11, y + 9, 2, 2);
    ctx.fillRect(x + 17, y + 9, 2, 2);
  } else if (player.direction === "left") {
    ctx.fillRect(x + 9, y + 9, 2, 2);
  } else {
    ctx.fillRect(x + 19, y + 9, 2, 2);
  }

  ctx.restore();
}

function findInteraction() {
  const playerCenter = {
    x: player.x + player.width / 2,
    y: player.y + player.height / 2,
    width: 1,
    height: 1
  };

  return interactables.find((obj) => {
    if (obj.type === "rareChest" && (!questBook.bossDefeated || questBook.bossChestOpened)) return false;
    const range = {
      x: obj.x - 26,
      y: obj.y - 26,
      width: obj.width + 52,
      height: obj.height + 52
    };
    return rectsOverlap(playerCenter, range);
  });
}

function countActivatedDimensionCrystals() {
  return crystalDimensionObjects.filter((obj) => obj.type === "dimensionCrystal" && obj.activated).length;
}

function syncDimensionQuestState() {
  dimensionQuest.activatedCrystals = countActivatedDimensionCrystals();
  if (dimensionQuest.activatedCrystals >= dimensionQuest.totalCrystals) {
    dimensionQuest.bridgeOpen = true;
    if (dimensionQuest.status === "active") dimensionQuest.status = "ready";
  }

  const chestObj = crystalDimensionObjects.find((obj) => obj.type === "dimensionChest");
  if (chestObj) chestObj.opened = dimensionQuest.chestOpened;
}

function getDimensionNpcMessage(npcObj) {
  if (npcObj.role === "dimensionGuide") {
    if (dimensionQuest.status === "notStarted") {
      dimensionQuest.status = "active";
      return "Orion: A ponte esta selada. Ative os 3 cristais magicos e o caminho para o bau vai aparecer.";
    }

    if (dimensionQuest.status === "active") {
      return `Orion: Ainda faltam cristais. Progresso: ${dimensionQuest.activatedCrystals}/${dimensionQuest.totalCrystals}.`;
    }

    if (dimensionQuest.status === "ready" && !dimensionQuest.chestOpened) {
      return "Orion: A ponte brilhou! Siga para o norte e abra o bau especial.";
    }

    return "Orion: A dimensao reconhece sua coragem. A ponte continuara aberta para voce.";
  }

  if (npcObj.role === "dimensionMystic") {
    if (!dimensionQuest.bridgeOpen) {
      return "Nyx: As pedras flutuantes escutam os cristais. Quando tres luzes acordarem, o norte vai se abrir.";
    }
    return "Nyx: A passagem secreta esta viva. O bau guarda uma recompensa da propria dimensao.";
  }

  return npcObj.message;
}

function activateDimensionCrystal(crystalObj) {
  if (dimensionQuest.status === "notStarted") {
    return `${crystalObj.message} Uma voz distante sussurra: fale com Orion antes de ativar este cristal.`;
  }

  if (crystalObj.activated) {
    return `${crystalObj.message} Este cristal ja esta ativo. Cristais ativados: ${dimensionQuest.activatedCrystals}/${dimensionQuest.totalCrystals}.`;
  }

  crystalObj.activated = true;
  crystalObj.activatedAt = performance.now();
  dimensionQuest.activatedCrystals = countActivatedDimensionCrystals();
  awardXp(150, "Cristal ativado");
  playSound("crystal");

  let message = `${crystalObj.message} Voce ativou uma luz magica. Cristais ativados: ${dimensionQuest.activatedCrystals}/${dimensionQuest.totalCrystals}.`;

  if (dimensionQuest.activatedCrystals >= dimensionQuest.totalCrystals) {
    dimensionQuest.bridgeOpen = true;
    dimensionQuest.status = "ready";
    playSound("mission");
    message += " A ponte secreta apareceu ao norte!";
  }

  return message;
}

function openDimensionChest(chestObj) {
  if (!dimensionQuest.bridgeOpen) {
    return "Bau especial: as tres marcas ainda estao apagadas. Ative os cristais primeiro.";
  }

  if (dimensionQuest.chestOpened || chestObj.opened) {
    return "Bau especial: ele ja foi aberto. A luz roxa ainda gira devagar dentro dele.";
  }

  chestObj.opened = true;
  dimensionQuest.chestOpened = true;
  dimensionQuest.missionDone = true;
  dimensionQuest.status = "done";
  inventory.moedas += 25;
  inventory.pocoes += 1;
  inventory.espadas += 1;
  player.maxHealth += 1;
  player.health = Math.min(player.maxHealth, player.health + 1);
  awardXp(300, "Bau da dimensao");
  playSound("chest");
  updateHud();
  renderInventory();
  return "Bau especial aberto! Voce recebeu 25 moedas, 1 pocao, 1 espada rara e ganhou mais 1 coracao maximo.";
}

function openRareChest() {
  if (!questBook.bossDefeated) {
    return "Bau raro: derrote o Guardiao das Ruinas para quebrar o selo.";
  }

  if (questBook.bossChestOpened) {
    return "Bau raro: ele ja foi aberto. So resta um brilho dourado.";
  }

  questBook.bossChestOpened = true;
  inventory.moedas += 50;
  inventory.pocoes += 2;
  inventory.espadas += 1;
  player.maxMana += 1;
  player.mana = player.maxMana;
  awardXp(300, "Bau raro");
  playSound("chest");
  updateHud();
  renderInventory();
  return "Bau raro aberto! Voce recebeu 50 moedas, 2 pocoes, uma espada rara e +1 mana maxima.";
}

function getQuestMessage(npcObj) {
  if (npcObj.type === "rareChest") {
    return openRareChest();
  }

  if (npcObj.type === "portal") {
    enterCrystalDimension();
    return "";
  }

  if (npcObj.type === "dimensionPortal") {
    exitCrystalDimension();
    return "";
  }

  if (npcObj.type === "dimensionCrystal") {
    return activateDimensionCrystal(npcObj);
  }

  if (npcObj.type === "dimensionChest") {
    return openDimensionChest(npcObj);
  }

  if (npcObj.type === "npc" && (npcObj.role === "dimensionGuide" || npcObj.role === "dimensionMystic")) {
    return getDimensionNpcMessage(npcObj);
  }

  if (npcObj.type === "npc" && npcObj.role === "shopkeeper") {
    openShop();
    return "Vendedor: Escolha com calma. Pocao custa 5 moedas.";
  }

  if (npcObj.type === "npc" && npcObj.role === "letterTarget") {
    if (inventory.cartas > 0 && !questBook.letterDelivered) {
      inventory.cartas -= 1;
      questBook.letterDelivered = true;
      inventory.moedas += 6;
      awardXp(300, "Carta entregue");
      return `Beto: Minha carta! Obrigado, ${getPlayerDisplayName()}. Aceite 6 moedas pela entrega.`;
    }
    if (questBook.letterDelivered) return "Beto: Obrigado pela carta. A vila precisava dessa noticia.";
    return "Beto: Se encontrar uma carta perdida, pode trazer para mim?";
  }

  if (npcObj.type !== "npc" || npcObj.name !== "Nico") return npcObj.message;

  if (quest.status === "notStarted") {
    quest.status = "active";
    return `Nico: ${getPlayerDisplayName()}, preciso de ajuda! Encontre 3 cristais brilhantes pela vila e volte aqui.`;
  }

  if (quest.status === "active") {
    return `Nico: Voce encontrou ${quest.collected}/${quest.total} cristais. Continue procurando!`;
  }

  if (quest.status === "ready") {
    quest.status = "done";
    awardXp(300, "Missao dos cristais");
    return `Nico: Voce conseguiu, ${getPlayerDisplayName()}! Receba sua recompensa: ${quest.reward}.`;
  }

  return `Nico: Obrigado de novo pela ajuda. O ${quest.reward} combina com voce!`;
}

function collectCrystals() {
  if (currentScene !== "village") return;
  if (quest.status !== "active") return;

  const playerRect = getPlayerRect();
  for (const obj of villageObjects) {
    if (obj.type === "crystal" && !obj.collected && rectsOverlap(playerRect, obj)) {
      obj.collected = true;
      quest.collected += 1;
      inventory.cristais += 1;
      if (quest.collected >= quest.total) {
        quest.status = "ready";
      }
    }
  }
}

function collectWorldItems() {
  if (currentScene !== "village") return;

  const playerRect = getPlayerRect();
  for (const obj of villageObjects) {
    if (obj.type !== "collectible" || obj.collected || !rectsOverlap(playerRect, obj)) continue;

    obj.collected = true;
    if (obj.item === "moeda") {
      inventory.moedas += 1;
      playSound("coin");
    }
    if (obj.item === "pocao") inventory.pocoes += 1;
    if (obj.item === "chave") {
      inventory.chaves += 1;
      questBook.keyFound = true;
    }
    if (obj.item === "espada") inventory.espadas += 1;
    if (obj.item === "carta") {
      inventory.cartas += 1;
      questBook.letterPicked = true;
    }
    vibrate(12);
  }
}

function collectPowerUps() {
  if (currentScene !== "village") return;

  const playerRect = getPlayerRect();
  for (const obj of powerUps) {
    if (obj.collected || !rectsOverlap(playerRect, obj)) continue;

    obj.collected = true;
    applyPowerUp(obj.kind);
    spawnFloatingText(getPowerUpName(obj.kind), obj.x - 8, obj.y - 14, "#fff264");
    playSound("powerup");
    vibrate(16);
  }
}

function applyPowerUp(kind) {
  if (kind === "speed") activePowerUps.speed = 10;
  if (kind === "force") activePowerUps.force = 10;
  if (kind === "shield") activePowerUps.shield = 10;
  if (kind === "regen") activePowerUps.regen = 8;
  if (kind === "waterBreathing") activePowerUps.waterBreathing = 20;
  if (kind === "mana") player.mana = player.maxMana;
}

function getPowerUpName(kind) {
  if (kind === "speed") return "Velocidade";
  if (kind === "force") return "Forca";
  if (kind === "shield") return "Escudo";
  if (kind === "regen") return "Regeneracao";
  if (kind === "waterBreathing") return "Respiracao Aquatica";
  return "Mana cheia";
}

function updateQuestProgress() {
  syncDimensionQuestState();
  questProgressEl.textContent = getCompactMissionText();
  if (missionsOpen) renderMissionsPanel();
}

function getCompactMissionText() {
  if (currentScene === "crystalDimension" || dimensionQuest.status === "active" || dimensionQuest.status === "ready") {
    if (dimensionQuest.chestOpened) return "Dimensao: bau aberto";
    if (dimensionQuest.bridgeOpen) return "Dimensao: abra o bau";
    return `Cristais ativados: ${dimensionQuest.activatedCrystals}/${dimensionQuest.totalCrystals}`;
  }

  if (quest.status === "notStarted") return "Missao: fale com Nico";
  if (quest.status === "active") return `Cristais: ${quest.collected}/${quest.total}`;
  if (quest.status === "ready") return "Cristais: volte ao Nico";
  if (!questBook.keyFound) return "Chave: perdida";
  if (questBook.forestMonstersDefeated < questBook.forestMonstersGoal) {
    return `Monstros: ${questBook.forestMonstersDefeated}/${questBook.forestMonstersGoal}`;
  }
  if (!questBook.letterDelivered) return questBook.letterPicked ? "Carta: leve ao Beto" : "Carta: perdida";
  return "Missoes: em dia";
}

function updateHud() {
  normalizeLevelState();
  updateMobilePowerButtons();
  playerNameEl.textContent = getPlayerHudName();
  if (xpHud) {
    xpHud.textContent = player.level >= player.maxLevel ? "XP: Nivel maximo" : `XP: ${player.xp}/${player.xpToNextLevel}`;
  }
  if (xpFill) {
    const percent = player.level >= player.maxLevel ? 100 : clamp((player.xp / player.xpToNextLevel) * 100, 0, 100);
    xpFill.style.width = `${percent}%`;
  }
  healthHud.textContent = "♥ ".repeat(player.health).trim() || "0";
  manaHud.textContent = `${Math.floor(player.mana)}/${player.maxMana}`;
  manaFill.style.width = `${clamp((player.mana / player.maxMana) * 100, 0, 100)}%`;
  coinHud.textContent = inventory.moedas;
  playerPositionEl.textContent = getAreaName();
  weaponHud.textContent = `Arma: ${getCurrentWeapon().name}${getCurrentWeaponKey() === "bow" ? ` (${inventory.flechas})` : ""}`;
  if (player.isSwimming) {
    oxygenHud.textContent = activePowerUps.waterBreathing > 0 ? "Respirando" : `${Math.ceil(player.oxygen)}/${player.maxOxygen}`;
  } else {
    oxygenHud.textContent = "Fora da agua";
  }
  oxygenFill.style.width = `${clamp((player.oxygen / player.maxOxygen) * 100, 0, 100)}%`;
  const oxygenBox = oxygenHud.closest(".hud-oxygen-box");
  oxygenBox?.classList.toggle("mobile-hidden", isMobile && !player.isSwimming);
  oxygenBox?.classList.toggle("hidden", !player.isSwimming);
  oxygenBox?.classList.toggle("is-low", player.isSwimming && player.oxygen <= 3);
  powerHud.textContent = getPowerHudText();
  if (statusOpen) renderStatusPanel();

  const activeBoss = getActiveBoss();
  bossHud.classList.toggle("hidden", !activeBoss);
  if (activeBoss) {
    bossNameHud.textContent = `${getEnemyDisplayName(activeBoss.kind)}${activeBoss.phase === 2 ? " - fase 2" : ""}`;
    bossFill.style.width = `${clamp((activeBoss.hp / activeBoss.maxHp) * 100, 0, 100)}%`;
  }
}

function getPowerHudText() {
  const cooldown = player.spellCooldowns[equippedPower] || 0;
  const suffix = cooldown > 0 ? ` ${formatCooldown(cooldown)}` : "";
  return `Q: ${powerNames[equippedPower] || "Poder"}${suffix}`;
}

function formatCooldown(value) {
  return value <= 0 ? "ok" : `${value.toFixed(1)}s`;
}

function renderMissionsPanel() {
  if (!missionsList) return;
  syncDimensionQuestState();
  const rows = [
    ["Cristais", quest.status === "notStarted" ? "fale com Nico" : quest.status === "ready" ? "volte ao Nico" : quest.status === "done" ? "ok" : `${quest.collected}/${quest.total}`],
    ["Chave", questBook.keyFound ? "ok" : "perdida"],
    ["Monstros", `${questBook.forestMonstersDefeated}/${questBook.forestMonstersGoal}`],
    ["Carta", questBook.letterDelivered ? "ok" : questBook.letterPicked ? "levar ao Beto" : "perdida"],
    ["Dimensao", `${dimensionQuest.activatedCrystals}/${dimensionQuest.totalCrystals} cristais`],
    ["Bau da dimensao", dimensionQuest.chestOpened ? "aberto" : dimensionQuest.bridgeOpen ? "liberado" : "selado"]
  ];
  missionsList.innerHTML = rows.map(([name, value]) => `<li><span>${name}</span><strong>${value}</strong></li>`).join("");
}

function renderStatusPanel() {
  if (!statusList) return;
  const buffs = Object.entries(activePowerUps)
    .filter(([, value]) => value > 0)
    .map(([key, value]) => `${getPowerUpName(key)} ${Math.ceil(value)}s`);
  const rows = [
    ["Nome", getPlayerDisplayName()],
    ["Nivel", player.level >= player.maxLevel ? `${player.level} MAX` : player.level],
    ["XP", player.level >= player.maxLevel ? "Nivel maximo" : `${player.xp}/${player.xpToNextLevel}`],
    ["XP total", player.totalXp],
    ["Vida", `${player.health}/${player.maxHealth}`],
    ["Mana", `${Math.floor(player.mana)}/${player.maxMana}`],
    ["Oxigenio", player.isSwimming ? `${Math.ceil(player.oxygen)}/${player.maxOxygen}` : "fora da agua"],
    ["Dano base", `+${Math.floor(player.damageBonus || 0)}`],
    ["Defesa", player.defense || 0],
    ["Critico", `${Math.round((player.critChance || 0) * 100)}%`],
    ["Arma", getCurrentWeapon().name],
    ["Poder", powerNames[equippedPower] || "Poder"],
    ["Pontos", player.skillPoints || 0],
    ["Bosses", countDefeatedBosses()],
    ["Missoes", countCompletedMissions()],
    ["Buffs", buffs.length ? buffs.join(", ") : "nenhum"]
  ];
  statusList.innerHTML = rows.map(([name, value]) => `<li><span>${name}</span><strong>${value}</strong></li>`).join("");
}

function toggleMissionsPanel(force) {
  missionsOpen = typeof force === "boolean" ? force : !missionsOpen;
  missionsPanel?.classList.toggle("hidden", !missionsOpen);
  if (missionsOpen) {
    statusOpen = false;
    statusPanel?.classList.add("hidden");
    setPause(false);
    renderMissionsPanel();
  }
}

function toggleStatusPanel(force) {
  statusOpen = typeof force === "boolean" ? force : !statusOpen;
  statusPanel?.classList.toggle("hidden", !statusOpen);
  if (statusOpen) {
    missionsOpen = false;
    missionsPanel?.classList.add("hidden");
    setPause(false);
    renderStatusPanel();
  }
}

function closeOverlayPanels() {
  missionsOpen = false;
  statusOpen = false;
  missionsPanel?.classList.add("hidden");
  statusPanel?.classList.add("hidden");
}

function showHudToast(text, duration = 2.4) {
  hudToastText = text || "";
  hudToastTimer = duration;
  let toast = document.getElementById("hudToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "hudToast";
    toast.className = "hud-toast hidden";
    canvas.parentElement?.appendChild(toast);
  }
  toast.textContent = hudToastText;
  toast.classList.toggle("hidden", !hudToastText);
}

function updateHudToast(delta) {
  if (hudToastTimer <= 0) return;
  hudToastTimer = Math.max(0, hudToastTimer - delta);
  if (hudToastTimer <= 0) {
    const toast = document.getElementById("hudToast");
    toast?.classList.add("hidden");
  }
}

function getStrongEnemyWarning() {
  if (currentScene !== "village") return "";

  const playerCenterX = player.x + player.width / 2;
  const playerCenterY = player.y + player.height / 2;
  const strong = villageObjects.find((obj) => {
    if (obj.type !== "enemy" || !obj.alive) return false;
    if (!obj.boss && !["slimeVermelho", "golem", "golemPedra", "mago", "magoSombrio", "guardiao", "miniDragao"].includes(obj.kind)) return false;
    return Math.hypot(obj.x - playerCenterX, obj.y - playerCenterY) < 190;
  });

  return strong ? "Inimigo forte perto!" : "";
}

function getActiveBoss() {
  if (currentScene !== "village") return null;

  const playerCenterX = player.x + player.width / 2;
  const playerCenterY = player.y + player.height / 2;
  let nearest = null;
  let nearestDistance = Infinity;

  for (const obj of villageObjects) {
    if (obj.type !== "enemy" || !obj.alive || !obj.boss) continue;
    const distance = Math.hypot(obj.x + obj.width / 2 - playerCenterX, obj.y + obj.height / 2 - playerCenterY);
    if ((distance < 520 || obj.hp < obj.maxHp) && distance < nearestDistance) {
      nearest = obj;
      nearestDistance = distance;
    }
  }

  return nearest;
}

function getEnemyDisplayName(kind) {
  const names = {
    slimeVerde: "Slime Verde",
    slimeVermelho: "Slime Vermelho",
    slimeAzul: "Slime Azul",
    morcego: "Morcego",
    aranha: "Aranha",
    goblin: "Goblin",
    arqueiroGoblin: "Arqueiro Goblin",
    magoSombrio: "Mago Sombrio",
    golemPedra: "Golem de Pedra",
    fantasma: "Fantasma",
    peixeHostil: "Peixe Hostil",
    miniDragao: "Mini Dragao",
    miniGuardiao: "Mini Guardiao",
    reiSlime: "Rei Slime",
    aranhaRainha: "Aranha Rainha",
    golemAncestral: "Golem Ancestral",
    bruxoSombrio: "Bruxo Sombrio",
    serpenteLago: "Serpente do Lago",
    guardiao: "Guardiao das Ruinas",
    slime: "Slime",
    golem: "Golem de Pedra",
    mago: "Mago Sombrio"
  };
  return names[kind] || kind;
}

function drawMiniMap() {
  miniCtx.clearRect(0, 0, miniMapCanvas.width, miniMapCanvas.height);
  miniCtx.fillStyle = "rgba(39, 48, 82, 0.95)";
  miniCtx.fillRect(0, 0, miniMapCanvas.width, miniMapCanvas.height);

  if (currentScene === "crystalDimension") {
    const sx = miniMapCanvas.width / CRYSTAL_WIDTH;
    const sy = miniMapCanvas.height / CRYSTAL_HEIGHT;

    miniCtx.fillStyle = "#2a1a52";
    miniCtx.fillRect(0, 0, miniMapCanvas.width, miniMapCanvas.height);

    miniCtx.fillStyle = "#3341aa";
    for (let y = 0; y < CRYSTAL_ROWS; y++) {
      for (let x = 0; x < CRYSTAL_COLS; x++) {
        if (crystalDimensionMap[y][x] === "M") {
          miniCtx.fillRect(x * TILE * sx, y * TILE * sy, Math.ceil(TILE * sx), Math.ceil(TILE * sy));
        }
      }
    }

    miniCtx.fillStyle = "#55e8ff";
    for (const obj of crystalDimensionObjects) {
      if (obj.type === "dimensionPortal" || obj.type === "dimensionCrystal") {
        miniCtx.fillRect(obj.x * sx - 2, obj.y * sy - 2, 5, 5);
      }
    }

    miniCtx.fillStyle = "#fff264";
    for (const obj of crystalDimensionObjects) {
      if (obj.type === "npc" || obj.type === "dimensionChest") {
        miniCtx.fillRect(obj.x * sx - 2, obj.y * sy - 2, 5, 5);
      }
    }

    miniCtx.fillStyle = "#d24c63";
    miniCtx.fillRect(player.x * sx - 3, player.y * sy - 3, 7, 7);
    return;
  }

  if (currentScene !== "village") {
    miniCtx.fillStyle = "#f0c686";
    miniCtx.fillRect(12, 12, miniMapCanvas.width - 24, miniMapCanvas.height - 24);
    miniCtx.fillStyle = "#273052";
    miniCtx.fillRect(12, 12, miniMapCanvas.width - 24, 8);
    miniCtx.fillStyle = "#fff264";
    miniCtx.fillRect(miniMapCanvas.width / 2 - 3, miniMapCanvas.height - 16, 6, 6);
    miniCtx.fillStyle = "#d24c63";
    miniCtx.fillRect(
      (player.x / HOME_WIDTH) * (miniMapCanvas.width - 24) + 12 - 3,
      (player.y / HOME_HEIGHT) * (miniMapCanvas.height - 24) + 12 - 3,
      6,
      6
    );
    return;
  }

  const sx = miniMapCanvas.width / WORLD_WIDTH;
  const sy = miniMapCanvas.height / WORLD_HEIGHT;

  miniCtx.fillStyle = "#82dc83";
  miniCtx.fillRect(0, 0, miniMapCanvas.width, miniMapCanvas.height);

  miniCtx.fillStyle = "#48a7e6";
  for (let y = 0; y < MAP_ROWS; y++) {
    for (let x = 0; x < MAP_COLS; x++) {
      if (worldMap[y][x] === "W") {
        miniCtx.fillRect(x * TILE * sx, y * TILE * sy, Math.ceil(TILE * sx), Math.ceil(TILE * sy));
      }
    }
  }

  miniCtx.fillStyle = "#fff264";
  for (const obj of villageObjects) {
    if (obj.type === "house" || obj.type === "playerHouse" || obj.type === "shop") {
      miniCtx.fillRect(obj.x * sx, obj.y * sy, obj.width * sx, obj.height * sy);
    }
  }

  miniCtx.fillStyle = "#3f8fe5";
  for (const obj of villageObjects) {
    if (obj.type === "npc" && ["Nico", "Vendedor", "Beto"].includes(obj.name)) {
      miniCtx.fillRect(obj.x * sx - 2, obj.y * sy - 2, 5, 5);
    }
  }

  miniCtx.fillStyle = "#ff4f62";
  for (const obj of villageObjects) {
    if (obj.type === "enemy" && obj.boss && obj.alive) {
      miniCtx.fillRect(obj.x * sx - 2, obj.y * sy - 2, 6, 6);
    }
  }

  miniCtx.fillStyle = "#d24c63";
  miniCtx.fillRect(player.x * sx - 3, player.y * sy - 3, 7, 7);
}

function saveGame() {
  syncDimensionQuestState();
  normalizeLevelState();
  const save = {
    scene: currentScene,
    player: {
      name: getPlayerDisplayName(),
      x: player.x,
      y: player.y,
      level: player.level,
      xp: player.xp,
      xpToNextLevel: player.xpToNextLevel,
      maxLevel: player.maxLevel,
      totalXp: player.totalXp,
      skillPoints: player.skillPoints,
      damageBonus: player.damageBonus,
      speed: player.speed,
      baseSpeed: player.baseSpeed,
      defense: player.defense,
      health: player.health,
      maxHealth: player.maxHealth,
      mana: player.mana,
      maxMana: player.maxMana,
      oxygen: player.oxygen,
      maxOxygen: player.maxOxygen,
      isSwimming: player.isSwimming,
      spellCooldowns: { ...player.spellCooldowns },
      direction: player.direction,
      currentWeaponIndex,
      equippedPower,
      unlockedWeapons: [...player.unlockedWeapons]
    },
    inventory: { ...inventory },
    quest: { ...quest },
    questBook: { ...questBook },
    unlockedPowers: { fireball: true, dash: true, shockwave: true, heal: true },
    activePowerUps: { ...activePowerUps },
    dimensionQuest: { ...dimensionQuest },
    dimensionCrystals: crystalDimensionObjects
      .filter((obj) => obj.type === "dimensionCrystal" && obj.activated)
      .map((obj) => obj.crystalIndex),
    powerUpsCollected: powerUps
      .filter((obj) => obj.collected)
      .map(getSaveObjectKey),
    collected: villageObjects
      .filter((obj) => (obj.type === "collectible" || obj.type === "crystal") && obj.collected)
      .map(getSaveObjectKey),
    enemies: villageObjects
      .filter((obj) => obj.type === "enemy")
      .map((obj) => ({ key: getSaveObjectKey(obj), alive: obj.alive, hp: obj.hp, phase: obj.phase })),
    lootItems: lootItems
      .filter((obj) => !obj.collected)
      .map((obj) => ({
        kind: obj.kind,
        itemName: obj.itemName,
        amount: obj.amount,
        x: obj.x,
        y: obj.y
      }))
  };

  if (!writeSaveRaw(JSON.stringify(save))) return;
  startMessage.textContent = "Jogo salvo!";
  showHudToast("Jogo salvo!");
  saveNoticeTimer = 2;
}

function loadGame() {
  const raw = readSaveRaw();
  if (!raw) return false;

  try {
    const save = JSON.parse(raw);
    Object.assign(inventory, save.inventory || {});
    Object.assign(quest, save.quest || {});
    Object.assign(questBook, save.questBook || {});
    Object.assign(dimensionQuest, save.dimensionQuest || {});
    Object.assign(activePowerUps, save.activePowerUps || {});
    currentWeaponIndex = save.player?.currentWeaponIndex ?? 0;
    equippedPower = save.player?.equippedPower || "fireball";
    player.unlockedWeapons = save.player?.unlockedWeapons || player.unlockedWeapons;
    player.name = sanitizePlayerName(save.player?.name, FALLBACK_PLAYER_NAME);
    player.level = save.player?.level ?? 1;
    player.xp = save.player?.xp ?? 0;
    player.xpToNextLevel = save.player?.xpToNextLevel ?? getXpToNextLevel(player.level);
    player.maxLevel = save.player?.maxLevel ?? PLAYER_MAX_LEVEL;
    player.totalXp = save.player?.totalXp ?? 0;
    player.skillPoints = save.player?.skillPoints ?? 0;
    player.damageBonus = save.player?.damageBonus ?? 0;
    player.defense = save.player?.defense ?? 0;
    player.baseSpeed = save.player?.baseSpeed ?? 150;
    player.speed = save.player?.speed ?? player.baseSpeed;

    const collected = new Set(save.collected || []);
    const powerUpsCollected = new Set(save.powerUpsCollected || []);
    const enemies = new Map((save.enemies || []).map((entry) => [entry.key, entry]));
    for (const obj of villageObjects) {
      if (obj.type === "collectible" || obj.type === "crystal") {
        obj.collected = collected.has(getSaveObjectKey(obj));
      }
      if (obj.type === "enemy") {
        const savedEnemy = enemies.get(getSaveObjectKey(obj));
        obj.alive = savedEnemy ? savedEnemy.alive : true;
        obj.hp = savedEnemy ? savedEnemy.hp : obj.maxHp;
        obj.phase = savedEnemy?.phase || 1;
      }
    }

    lootItems.length = 0;
    for (const obj of save.lootItems || []) {
      if (!Number.isFinite(obj.x) || !Number.isFinite(obj.y)) continue;
      lootItems.push(lootItem(obj.x, obj.y, obj.kind || "moeda", obj.amount || 1, obj.itemName || ""));
    }

    for (const obj of powerUps) {
      obj.collected = powerUpsCollected.has(getSaveObjectKey(obj));
    }

    const dimensionCrystals = new Set(save.dimensionCrystals || []);
    for (const obj of crystalDimensionObjects) {
      if (obj.type === "dimensionCrystal") {
        obj.activated = dimensionCrystals.has(obj.crystalIndex);
        obj.activatedAt = obj.activated ? performance.now() - 1000 : 0;
      }
      if (obj.type === "dimensionChest") {
        obj.opened = Boolean(dimensionQuest.chestOpened);
      }
    }
    syncDimensionQuestState();

    const savedScene = ["village", "home", "shopInterior", "mayorInterior", "crystalDimension"].includes(save.scene) ?
      save.scene : "village";
    setActiveScene(savedScene);
    if (savedScene === "crystalDimension") dimensionQuest.entered = true;
    player.x = save.player?.x ?? player.startX;
    player.y = save.player?.y ?? player.startY;
    player.maxHealth = save.player?.maxHealth ?? 5;
    player.health = save.player?.health ?? player.maxHealth;
    player.maxMana = save.player?.maxMana ?? 6;
    player.mana = save.player?.mana ?? player.maxMana;
    player.maxOxygen = save.player?.maxOxygen ?? 10;
    player.oxygen = save.player?.oxygen ?? player.maxOxygen;
    player.isSwimming = Boolean(save.player?.isSwimming);
    Object.assign(player.spellCooldowns, save.player?.spellCooldowns || {});
    player.direction = save.player?.direction || "down";
    normalizeRuntimeState();
    if (characterNameInput) characterNameInput.value = getPlayerDisplayName();
    gameOver = player.health <= 0;
    gameOverScreen.classList.toggle("hidden", !gameOver);
    updateQuestProgress();
    updateHud();
    renderInventory();
    return true;
  } catch (error) {
    console.error("Erro ao carregar save", error);
    return false;
  }
}

function getSaveObjectKey(obj) {
  if (obj.type === "enemy") {
    return `${obj.type}:${obj.kind}:${Math.round(obj.spawnX ?? obj.x)}:${Math.round(obj.spawnY ?? obj.y)}`;
  }

  return `${obj.type}:${obj.item || obj.kind || "item"}:${Math.round(obj.x)}:${Math.round(obj.y)}`;
}

function resetProgressForNewGame(name) {
  closeOverlayPanels();
  closeDialog();
  closeShop();
  inventoryOpen = false;
  inventoryPanel?.classList.add("hidden");
  gameOver = false;
  gameOverScreen.classList.add("hidden");
  gameStarted = false;

  Object.assign(inventory, {
    cristais: 0,
    chaves: 0,
    pocoes: 1,
    moedas: 8,
    espadas: 0,
    cartas: 0,
    fragmentos: 0,
    flechas: 12,
    chavesRaras: 0,
    manaOrbes: 0,
    itensBoss: []
  });

  Object.assign(quest, {
    status: "notStarted",
    collected: 0,
    total: 3,
    reward: "Amuleto da Vila"
  });

  Object.assign(questBook, {
    keyFound: false,
    forestMonstersDefeated: 0,
    forestMonstersGoal: 3,
    letterPicked: false,
    letterDelivered: false,
    bossDefeated: false,
    bossChestOpened: false,
    defeatedBosses: {},
    openedChests: {},
    discoveredAreas: {}
  });

  Object.assign(dimensionQuest, {
    entered: false,
    status: "notStarted",
    activatedCrystals: 0,
    totalCrystals: 3,
    bridgeOpen: false,
    chestOpened: false,
    missionDone: false
  });

  for (const key of Object.keys(activePowerUps)) activePowerUps[key] = 0;
  lootItems.length = 0;
  projectiles.length = 0;
  enemyProjectiles.length = 0;
  floatingTexts.length = 0;
  shockwaves.length = 0;
  dashTrails.length = 0;
  healBursts.length = 0;
  hazardZones.length = 0;

  for (const obj of villageObjects) {
    if (obj.type === "collectible" || obj.type === "crystal") obj.collected = false;
    if (obj.type === "enemy") {
      obj.alive = true;
      obj.hp = obj.maxHp;
      obj.phase = 1;
      obj.x = obj.spawnX ?? obj.x;
      obj.y = obj.spawnY ?? obj.y;
      normalizeEnemy(obj);
    }
  }

  for (const obj of crystalDimensionObjects) {
    if (obj.type === "dimensionCrystal") {
      obj.activated = false;
      obj.activatedAt = 0;
    }
    if (obj.type === "dimensionChest") obj.opened = false;
  }

  for (const obj of powerUps) obj.collected = false;

  Object.assign(player, {
    name: sanitizePlayerName(name, DEFAULT_NEW_PLAYER_NAME),
    x: player.startX,
    y: player.startY,
    speed: 150,
    baseSpeed: 150,
    maxHealth: 5,
    health: 5,
    defense: 0,
    critChance: 0.12,
    level: 1,
    xp: 0,
    xpToNextLevel: getXpToNextLevel(1),
    maxLevel: PLAYER_MAX_LEVEL,
    totalXp: 0,
    skillPoints: 0,
    damageBonus: 0,
    levelGlowTimer: 0,
    maxMana: 6,
    mana: 6,
    maxOxygen: 10,
    oxygen: 10,
    isSwimming: false,
    direction: "down",
    moving: false,
    frame: 0,
    animTimer: 0
  });
  Object.assign(player.spellCooldowns, { fireball: 0, blueRay: 0, dash: 0, shockwave: 0, heal: 0 });
  player.unlockedWeapons = ["sword", "bow", "staff", "spear"];
  currentWeaponIndex = 0;
  equippedPower = "fireball";
  lastVillagePosition = { x: player.startX, y: player.startY };
  playerInvulnerableTimer = 0;
  playerKnockbackX = 0;
  playerKnockbackY = 0;
  damageCooldown = 0;
  weaponCooldownTimer = 0;
  dodgeCooldownTimer = 0;
  hitstopTimer = 0;

  setActiveScene("village");
  normalizeRuntimeState();
  if (characterNameInput) characterNameInput.value = getPlayerDisplayName();
  updateHud();
  updateQuestProgress();
  renderInventory();
}

function startNewGame() {
  ensureAudio();
  startMusic();
  updateDeviceMode();
  setPause(false);
  const chosenName = getNameFromInput();
  if (readSaveRaw()) {
    const confirmed = window.confirm("Existe um save antigo. Comecar do zero e apagar o progresso salvo?");
    if (!confirmed) {
      startMessage.textContent = "Novo jogo cancelado. Use Continuar para carregar o save.";
      return;
    }
  }

  resetProgressForNewGame(chosenName);
  gameStarted = true;
  startScreen.classList.add("hidden");
  saveGame();
}

function startGame(loadSave = false) {
  ensureAudio();
  startMusic();
  updateDeviceMode();
  setPause(false);

  if (loadSave && !loadGame()) {
    startMessage.textContent = "Nenhum jogo salvo encontrado.";
    return;
  }

  normalizeRuntimeState();
  if (!loadSave) setPlayerName(getNameFromInput(), DEFAULT_NEW_PLAYER_NAME);
  gameStarted = true;
  startScreen.classList.add("hidden");
  updateHud();
  updateQuestProgress();
}

function showInfo(title, text) {
  infoTitle.textContent = title;
  infoText.textContent = text;
  infoPanel.classList.remove("hidden");
}

function showErrorMessage(error) {
  const message = error instanceof Error ? error.message : String(error);
  if (message === lastErrorMessage) return;

  lastErrorMessage = message;
  console.error("Erro no jogo:", error);
  showInfo("Erro no jogo", `Algo deu errado, mas a tela nao vai ficar preta. Detalhe: ${message}`);
}

function updateDebugPanel(delta) {
  if (!debugEnabled || !debugPanel) return;

  fpsFrameCount += 1;
  fpsTimer += delta;
  if (fpsTimer >= 0.5) {
    fpsEstimate = Math.round(fpsFrameCount / fpsTimer);
    fpsFrameCount = 0;
    fpsTimer = 0;
  }

  debugPanel.innerHTML = [
    `Tela: ${window.innerWidth}x${window.innerHeight}`,
    `Canvas: ${canvas.width}x${canvas.height}`,
    `FPS: ${fpsEstimate || "--"}`,
    `isMobile: ${isMobile}`,
    `Cena: ${currentScene}`,
    `X/Y: ${Math.round(player.x)} / ${Math.round(player.y)}`,
    `Erro: ${lastErrorMessage || "nenhum"}`,
    `Joystick: ${joystick.active ? "ativo" : "parado"} ${joystick.strength.toFixed(2)}`,
    `Botao: ${pressedMobileButton || "nenhum"}`
  ].join("<br>");
}

function ensureAudio() {
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }
  } catch (error) {
    audioContext = null;
  }
}

function playTone(frequency, duration, type = "square", volume = 0.08) {
  if (!audioContext) return;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(volume, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration);
}

function playSound(name) {
  ensureAudio();
  if (!audioContext) return;
  if (name === "coin") {
    playTone(880, 0.08, "square", 0.09);
    setTimeout(() => playTone(1320, 0.08, "square", 0.07), 70);
  } else if (name === "npc") {
    playTone(360, 0.08, "triangle", 0.07);
    setTimeout(() => playTone(430, 0.08, "triangle", 0.06), 80);
  } else if (name === "dialog") {
    playTone(620, 0.06, "sine", 0.06);
  } else if (name === "inventoryOpen") {
    playTone(260, 0.06, "square", 0.05);
    setTimeout(() => playTone(520, 0.08, "triangle", 0.05), 55);
  } else if (name === "inventoryClose") {
    playTone(420, 0.05, "triangle", 0.04);
    setTimeout(() => playTone(220, 0.07, "square", 0.035), 55);
  } else if (name === "selectItem") {
    playTone(680, 0.04, "square", 0.035);
  } else if (name === "usePotion") {
    playTone(540, 0.08, "triangle", 0.06);
    setTimeout(() => playTone(760, 0.08, "triangle", 0.05), 70);
  } else if (name === "equipItem") {
    playTone(480, 0.05, "square", 0.05);
    setTimeout(() => playTone(720, 0.06, "square", 0.04), 55);
  } else if (name === "levelUp") {
    playTone(520, 0.08, "triangle", 0.07);
    setTimeout(() => playTone(780, 0.09, "triangle", 0.065), 80);
    setTimeout(() => playTone(1040, 0.12, "sine", 0.06), 170);
  } else if (name === "invalid") {
    playTone(110, 0.09, "sawtooth", 0.045);
  } else if (name === "hit") {
    playTone(150, 0.12, "sawtooth", 0.08);
  } else if (name === "portal") {
    playTone(220, 0.12, "sine", 0.08);
    setTimeout(() => playTone(440, 0.12, "triangle", 0.07), 90);
    setTimeout(() => playTone(880, 0.16, "sine", 0.06), 180);
  } else if (name === "crystal") {
    playTone(760, 0.08, "triangle", 0.08);
    setTimeout(() => playTone(1140, 0.1, "sine", 0.06), 75);
  } else if (name === "chest") {
    playTone(520, 0.08, "square", 0.08);
    setTimeout(() => playTone(740, 0.08, "square", 0.07), 80);
    setTimeout(() => playTone(980, 0.13, "triangle", 0.07), 160);
  } else if (name === "mission") {
    playTone(330, 0.08, "triangle", 0.06);
    setTimeout(() => playTone(660, 0.08, "triangle", 0.06), 90);
    setTimeout(() => playTone(990, 0.12, "triangle", 0.06), 180);
  } else if (name === "attack") {
    playTone(260, 0.05, "sawtooth", 0.05);
    setTimeout(() => playTone(180, 0.05, "sawtooth", 0.04), 55);
  } else if (name === "hitEnemy") {
    playTone(170, 0.08, "square", 0.06);
    setTimeout(() => playTone(110, 0.06, "square", 0.05), 55);
  } else if (name === "playerHit") {
    playTone(120, 0.12, "sawtooth", 0.08);
  } else if (name === "powerup") {
    playTone(680, 0.08, "triangle", 0.08);
    setTimeout(() => playTone(1020, 0.11, "triangle", 0.07), 70);
  } else if (name === "magic") {
    playTone(420, 0.08, "sine", 0.07);
    setTimeout(() => playTone(840, 0.08, "triangle", 0.06), 70);
  } else if (name === "dash") {
    playTone(520, 0.06, "sawtooth", 0.06);
    setTimeout(() => playTone(260, 0.05, "sawtooth", 0.05), 45);
  } else if (name === "shockwave") {
    playTone(96, 0.14, "sine", 0.09);
    setTimeout(() => playTone(192, 0.12, "sine", 0.07), 90);
  } else if (name === "heal") {
    playTone(540, 0.08, "triangle", 0.06);
    setTimeout(() => playTone(720, 0.08, "triangle", 0.06), 80);
  } else if (name === "enemyMagic") {
    playTone(300, 0.08, "triangle", 0.05);
    setTimeout(() => playTone(240, 0.08, "triangle", 0.04), 70);
  } else if (name === "enemyDown") {
    playTone(330, 0.08, "square", 0.07);
    setTimeout(() => playTone(520, 0.1, "square", 0.06), 80);
  } else if (name === "bossDown") {
    playTone(180, 0.12, "sawtooth", 0.09);
    setTimeout(() => playTone(360, 0.12, "triangle", 0.08), 110);
    setTimeout(() => playTone(720, 0.18, "triangle", 0.07), 230);
  } else if (name === "weaponSwap") {
    playTone(420, 0.05, "square", 0.05);
    setTimeout(() => playTone(640, 0.06, "square", 0.04), 55);
  } else if (name === "bow") {
    playTone(220, 0.04, "triangle", 0.045);
    setTimeout(() => playTone(160, 0.05, "triangle", 0.035), 45);
  } else if (name === "water") {
    playTone(180, 0.06, "sine", 0.025);
    setTimeout(() => playTone(240, 0.05, "sine", 0.02), 40);
  }
}

function startMusic() {
  if (musicTimer || !audioContext) return;

  const notes = [262, 330, 392, 523, 392, 330, 294, 392];
  let index = 0;
  musicGain = audioContext.createGain();
  musicGain.gain.value = 0.035;
  musicGain.connect(audioContext.destination);

  musicTimer = setInterval(() => {
    if (!audioContext || audioContext.state !== "running") return;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = "triangle";
    oscillator.frequency.value = notes[index % notes.length];
    gain.gain.setValueAtTime(0.0, audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(0.8, audioContext.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.32);
    oscillator.connect(gain);
    gain.connect(musicGain);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.34);
    index += 1;
  }, 360);
}

function toggleInventory(force) {
  const nextOpen = typeof force === "boolean" ? force : !inventoryOpen;
  if (inventoryOpen === nextOpen) return;

  inventoryOpen = nextOpen;
  inventoryPanel?.classList.toggle("hidden", !inventoryOpen);

  if (inventoryOpen) {
    closeOverlayPanels();
    closeShop();
    setPause(false);
    keys.clear();
    playSound("inventoryOpen");
    renderInventory();
  } else {
    playSound("inventoryClose");
  }
}

function getInventoryItems() {
  const items = [];
  const addItem = (item) => {
    if (!item || item.quantity <= 0) return;
    items.push({
      rarity: "comum",
      typeLabel: "Item",
      effect: "",
      action: "",
      ...item
    });
  };

  addItem({
    id: "moedas",
    name: "Moedas",
    icon: "$",
    quantity: Number(inventory.moedas || 0),
    category: "materiais",
    typeLabel: "Dinheiro",
    rarity: "comum",
    description: "Usadas para comprar pocoes e recompensas na vila.",
    effect: "Loja: 5 moedas compram 1 pocao."
  });
  addItem({
    id: "pocoes",
    name: "Pocoes",
    icon: "P",
    quantity: Number(inventory.pocoes || 0),
    category: "consumiveis",
    typeLabel: "Consumivel",
    rarity: "comum",
    description: "Frasco vermelho para recuperar vida durante a aventura.",
    effect: "Recupera 1 coracao.",
    action: "usePotion"
  });
  addItem({
    id: "cristais",
    name: "Cristais",
    icon: "C",
    quantity: Number(inventory.cristais || 0),
    category: "missao",
    typeLabel: "Missao",
    rarity: "incomum",
    description: "Cristais brilhantes pedidos por Nico.",
    effect: "Leve 3 cristais para concluir a primeira missao.",
    locked: true
  });
  addItem({
    id: "chaves",
    name: "Chaves",
    icon: "K",
    quantity: Number(inventory.chaves || 0),
    category: "missao",
    typeLabel: "Missao",
    rarity: "incomum",
    description: "Chaves perdidas encontradas pela vila.",
    effect: "Podem abrir caminhos e completar missoes.",
    locked: true
  });
  addItem({
    id: "cartas",
    name: "Cartas",
    icon: "L",
    quantity: Number(inventory.cartas || 0),
    category: "missao",
    typeLabel: "Entrega",
    rarity: "comum",
    description: "Carta que precisa chegar ao morador certo.",
    effect: "Entregue para concluir a missao da carta.",
    locked: true
  });
  addItem({
    id: "espadas-extra",
    name: "Espadas extras",
    icon: "S",
    quantity: Number(inventory.espadas || 0),
    category: "armas",
    typeLabel: "Arma rara",
    rarity: "raro",
    description: "Espadas especiais obtidas em recompensa.",
    effect: "Cada espada extra aumenta o dano fisico em +1.",
    locked: true
  });
  addItem({
    id: "flechas",
    name: "Flechas",
    icon: "A",
    quantity: Number(inventory.flechas || 0),
    category: "materiais",
    typeLabel: "Municao",
    rarity: "comum",
    description: "Municao usada pelo arco.",
    effect: "O arco consome 1 flecha por disparo."
  });
  addItem({
    id: "fragmentos",
    name: "Fragmentos",
    icon: "F",
    quantity: Number(inventory.fragmentos || 0),
    category: "materiais",
    typeLabel: "Material",
    rarity: "raro",
    description: "Pedacos brilhantes deixados por monstros fortes.",
    effect: "Material raro para futuras melhorias.",
    locked: true
  });
  addItem({
    id: "mana-orbes",
    name: "Orbes de mana",
    icon: "M",
    quantity: Number(inventory.manaOrbes || 0),
    category: "consumiveis",
    typeLabel: "Energia",
    rarity: "incomum",
    description: "Orbes roxos cheios de magia.",
    effect: "Recarregam mana quando coletados pelo mapa.",
    locked: true
  });
  addItem({
    id: "chaves-raras",
    name: "Chaves raras",
    icon: "R",
    quantity: Number(inventory.chavesRaras || 0),
    category: "raros",
    typeLabel: "Raro",
    rarity: "epico",
    description: "Chaves antigas carregadas de energia.",
    effect: "Guardam segredos de baus especiais.",
    locked: true
  });

  const collectedPowerUps = typeof powerUps !== "undefined" ? powerUps.filter((obj) => obj.collected).length : 0;
  addItem({
    id: "powerups-coletados",
    name: "Power-ups coletados",
    icon: "B",
    quantity: collectedPowerUps,
    category: "raros",
    typeLabel: "Registro",
    rarity: "incomum",
    description: "Total de power-ups temporarios ja encontrados.",
    effect: "Velocidade, forca, escudo, regeneracao e respiracao aquatica.",
    locked: true
  });

  for (const [key, timeLeft] of Object.entries(activePowerUps)) {
    if (timeLeft <= 0) continue;
    addItem({
      id: `buff-${key}`,
      name: getPowerUpName(key),
      icon: "B",
      quantity: Math.ceil(timeLeft),
      category: "raros",
      typeLabel: "Buff ativo",
      rarity: "epico",
      description: "Power-up temporario ativo agora.",
      effect: `Tempo restante: ${Math.ceil(timeLeft)}s.`,
      locked: true
    });
  }

  for (const weaponKey of player.unlockedWeapons || []) {
    const weapon = weapons[weaponKey] || weapons.sword;
    const rarity = weaponKey === "sword" ? "comum" : weaponKey === "bow" ? "incomum" : weaponKey === "staff" ? "raro" : "epico";
    addItem({
      id: `weapon-${weaponKey}`,
      name: weapon.name,
      icon: weaponKey === "bow" ? "A" : weaponKey === "staff" ? "W" : weaponKey === "spear" ? "L" : "S",
      quantity: 1,
      category: "armas",
      typeLabel: "Arma",
      rarity,
      description: getWeaponDescription(weaponKey),
      effect: `Dano ${weapon.damage} | Alcance ${weapon.range}`,
      action: "equipWeapon",
      weaponKey
    });
  }

  for (const powerKey of powerSlots) {
    addItem({
      id: `power-${powerKey}`,
      name: powerNames[powerKey] || "Poder",
      icon: "Q",
      quantity: 1,
      category: "raros",
      typeLabel: "Poder",
      rarity: powerKey === "heal" ? "incomum" : powerKey === "shockwave" ? "epico" : "raro",
      description: getPowerDescription(powerKey),
      effect: `Custo de mana: ${spellCosts[powerKey] || 0}`,
      action: "equipPower",
      powerKey
    });
  }

  if (quest.status === "done") {
    addItem({
      id: "amuleto-vila",
      name: quest.reward || "Amuleto da Vila",
      icon: "O",
      quantity: 1,
      category: "raros",
      typeLabel: "Amuleto",
      rarity: "lendario",
      description: "Recompensa por ajudar Nico com os cristais.",
      effect: "Simbolo de amizade com a vila.",
      locked: true
    });
  }

  (inventory.itensBoss || []).forEach((itemName, index) => {
    addItem({
      id: `boss-${index}-${String(itemName).replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`,
      name: itemName || "Item misterioso",
      icon: "X",
      quantity: 1,
      category: "raros",
      typeLabel: "Boss",
      rarity: "lendario",
      description: "Trofeu raro deixado por um chefe derrotado.",
      effect: "Item especial guardado na bolsa.",
      locked: true
    });
  });

  return items;
}

function getWeaponDescription(weaponKey) {
  if (weaponKey === "bow") return "Arma de longo alcance que consome flechas.";
  if (weaponKey === "staff") return "Cajado magico que dispara energia azul.";
  if (weaponKey === "spear") return "Lanca com ataque frontal mais comprido.";
  return "Espada confiavel para combate de perto.";
}

function getPowerDescription(powerKey) {
  if (powerKey === "blueRay") return "Disparo magico rapido para acertar inimigos a distancia.";
  if (powerKey === "shockwave") return "Onda de choque que empurra e fere inimigos ao redor.";
  if (powerKey === "heal") return "Magia de cura para recuperar vida usando mana.";
  return "Bola de fogo para causar dano magico.";
}

function getFilteredInventoryItems(items) {
  if (inventoryTab === "all") return items;
  if (inventoryTab === "raros") return items.filter((item) => item.category === "raros" || ["raro", "epico", "lendario"].includes(item.rarity));
  return items.filter((item) => item.category === inventoryTab);
}

function getInventoryItemById(itemId) {
  return getInventoryItems().find((item) => item.id === itemId) || null;
}

function formatRarity(rarity) {
  if (rarity === "incomum") return "Incomum";
  if (rarity === "raro") return "Raro";
  if (rarity === "epico") return "Epico";
  if (rarity === "lendario") return "Lendario";
  return "Comum";
}

function renderInventory() {
  const items = getInventoryItems();
  const filteredItems = getFilteredInventoryItems(items);
  const selectedExists = filteredItems.some((item) => item.id === selectedInventoryItemId);
  if (!selectedExists) selectedInventoryItemId = filteredItems[0]?.id || "";

  renderInventoryTabs();
  renderInventoryGrid(filteredItems, items.length);
  renderEquipmentSlots();
  renderItemDetails(getInventoryItemById(selectedInventoryItemId));

  if (inventoryList) {
    inventoryList.innerHTML = items.map((item) => `<li>${item.name}: <strong>${item.quantity}</strong></li>`).join("");
  }
}

function renderInventoryTabs() {
  if (!inventoryTabs) return;
  for (const button of inventoryTabs.querySelectorAll("[data-inventory-tab]")) {
    button.classList.toggle("is-active", button.dataset.inventoryTab === inventoryTab);
  }
}

function renderInventoryGrid(filteredItems, totalItems) {
  if (!inventoryGrid) return;

  const slotCount = Math.max(30, filteredItems.length);
  const slots = [];
  for (let index = 0; index < slotCount; index += 1) {
    const item = filteredItems[index];
    if (!item) {
      slots.push(`<button class="inventory-slot is-empty" type="button" disabled aria-label="Slot vazio"></button>`);
      continue;
    }

    const equipped = (item.weaponKey && item.weaponKey === getCurrentWeaponKey()) ||
      (item.powerKey && item.powerKey === equippedPower);
    slots.push(`
      <button class="inventory-slot rarity-${item.rarity}${selectedInventoryItemId === item.id ? " is-selected" : ""}${equipped ? " is-equipped" : ""}" type="button" data-item-id="${item.id}">
        <span class="item-icon">${item.icon || "?"}</span>
        <span class="item-qty">${item.quantity > 1 ? item.quantity : ""}</span>
      </button>
    `);
  }

  inventoryGrid.innerHTML = slots.join("");
  if (inventoryEmpty) {
    inventoryEmpty.textContent = totalItems ? "Nada nesta aba." : "Sua bolsa esta vazia.";
    inventoryEmpty.classList.toggle("hidden", filteredItems.length > 0);
  }
}

function renderEquipmentSlots() {
  if (!equipmentSlots) return;

  const bossItem = inventory.itensBoss?.[0] || "Vazio";
  const slots = [
    ["Arma", getCurrentWeapon().name],
    ["Poder Q", powerNames[equippedPower] || "Nenhum"],
    ["Amuleto", quest.status === "done" ? (quest.reward || "Amuleto da Vila") : "Vazio"],
    ["Especial", bossItem],
    ["Defesa", `${player.defense || 0}`]
  ];

  equipmentSlots.innerHTML = slots.map(([label, value]) => `
    <div class="equipment-slot">
      <span>${label}</span>
      <strong>${value}</strong>
    </div>
  `).join("");
}

function renderItemDetails(item) {
  if (!itemDetailName || !itemDetailMeta || !itemDetailDescription || !itemDetailEffect || !itemDetailActions) return;

  if (!item) {
    itemDetailName.textContent = "Bolsa vazia";
    itemDetailMeta.textContent = "Nenhum item selecionado.";
    itemDetailDescription.textContent = "Colete moedas, pocoes, cristais, chaves e armas pelo mapa.";
    itemDetailEffect.textContent = "";
    itemDetailActions.innerHTML = "";
    return;
  }

  itemDetailName.textContent = item.name;
  itemDetailMeta.textContent = `${item.typeLabel} | ${formatRarity(item.rarity)} | Qtd. ${item.quantity}`;
  itemDetailDescription.textContent = item.description || "Item desconhecido guardado com cuidado.";
  itemDetailEffect.textContent = item.effect || "";
  itemDetailActions.innerHTML = getInventoryActionHtml(item);
}

function getInventoryActionHtml(item) {
  if (item.action === "usePotion") {
    const disabled = player.health >= player.maxHealth ? " disabled" : "";
    const text = player.health >= player.maxHealth ? "Vida cheia" : "Usar pocao";
    return `<button type="button" data-inventory-action="usePotion"${disabled}>${text}</button>`;
  }

  if (item.action === "equipWeapon") {
    const isEquipped = item.weaponKey === getCurrentWeaponKey();
    return `<button type="button" data-inventory-action="equipWeapon" data-weapon-key="${item.weaponKey}">${isEquipped ? "Equipado" : "Equipar arma"}</button>`;
  }

  if (item.action === "equipPower") {
    const isEquipped = item.powerKey === equippedPower;
    return `<button type="button" data-inventory-action="equipPower" data-power-key="${item.powerKey}">${isEquipped ? "Equipado no Q" : "Equipar no Q"}</button>`;
  }

  if (item.locked || item.category === "missao") {
    return `<button type="button" disabled>Item de missao</button>`;
  }

  return `<button type="button" disabled>Sem acao</button>`;
}

function handleInventoryAction(actionButton) {
  const action = actionButton.dataset.inventoryAction;
  if (action === "usePotion") {
    usePotion();
  } else if (action === "equipWeapon") {
    equipWeapon(actionButton.dataset.weaponKey);
  } else if (action === "equipPower") {
    const slotIndex = powerSlots.indexOf(actionButton.dataset.powerKey);
    if (slotIndex === -1) {
      playSound("invalid");
      showHudToast("Poder desconhecido.");
    } else {
      equipPower(slotIndex);
      playSound("equipItem");
    }
  } else {
    playSound("invalid");
  }

  renderInventory();
}

function openShop() {
  playSound("npc");
  shopOpen = true;
  shopPanel.classList.remove("hidden");
  shopMessage.textContent = `Voce tem ${inventory.moedas} moedas.`;
}

function closeShop() {
  shopOpen = false;
  shopPanel.classList.add("hidden");
}

function buyPotion() {
  if (inventory.moedas < 5) {
    shopMessage.textContent = "Moedas insuficientes.";
    return;
  }
  inventory.moedas -= 5;
  inventory.pocoes += 1;
  shopMessage.textContent = "Pocao comprada!";
  renderInventory();
  updateHud();
}

function usePotion() {
  if (gameOver) return false;
  if (inventory.pocoes <= 0) {
    showHudToast("Voce nao tem pocoes.");
    playSound("invalid");
    return false;
  }
  if (player.health >= player.maxHealth) {
    showHudToast("Vida ja esta cheia.");
    playSound("invalid");
    return false;
  }

  inventory.pocoes -= 1;
  player.health = Math.min(player.maxHealth, player.health + 1);
  showHudToast("Pocao usada.");
  playSound("usePotion");
  renderInventory();
  updateHud();
  return true;
}

function takeDamage(amount, sourceX = player.x, sourceY = player.y) {
  if (gameOver || playerInvulnerableTimer > 0) return;

  const shieldBlock = activePowerUps.shield > 0 ? 1 : 0;
  const finalDamage = Math.max(0, amount - shieldBlock - (player.defense || 0));
  playerInvulnerableTimer = 0.9;
  playSound("playerHit");
  vibrate(finalDamage > 0 ? 45 : 16);

  if (finalDamage > 0) {
    player.health = Math.max(0, player.health - finalDamage);
    spawnFloatingText(`-${finalDamage}`, player.x + 12, player.y - 12, "#ff4f62");
  } else {
    spawnFloatingText("Bloqueou!", player.x + 12, player.y - 12, "#fff264");
  }

  const centerX = player.x + player.width / 2;
  const centerY = player.y + player.height / 2;
  const dx = centerX - sourceX;
  const dy = centerY - sourceY;
  const length = Math.hypot(dx, dy) || 1;
  playerKnockbackX = (dx / length) * 160;
  playerKnockbackY = (dy / length) * 160;
  updateHud();
  if (player.health <= 0) {
    gameOver = true;
    gameOverScreen.classList.remove("hidden");
  }
}

function triggerAttack() {
  triggerPrimaryAttack();
}

function triggerPrimaryAttack() {
  if (gameOver || dialogOpen || inventoryOpen || shopOpen || pauseOpen || currentScene !== "village") return;
  if (weaponCooldownTimer > 0 || attackWindupTimer > 0 || attackRecoveryTimer > 0 || attackTimer > 0) return;

  updateDirectionFromAim();
  const weapon = getCurrentWeapon();
  const aim = getAimVector();
  const swimPenalty = player.isSwimming && weapon.kind !== "projectile" ? 1.35 : 1;
  weaponCooldownTimer = weapon.cooldown * swimPenalty;

  if (weapon.kind === "projectile") {
    fireWeaponProjectile(weapon, aim);
    return;
  }

  attackDirection = player.direction;
  attackWindupTimer = weapon.kind === "line" ? 0.12 * swimPenalty : 0.09 * swimPenalty;
  attackRecoveryTimer = weapon.cooldown * swimPenalty;
  attackTimer = weapon.cooldown * swimPenalty;
  attackHitDone = false;
  currentMeleeAttack = {
    weaponKey: getCurrentWeaponKey(),
    angle: aim.angle,
    range: isMobile ? weapon.range + 16 : weapon.range,
    arc: isMobile ? Math.min(Math.PI * 0.95, weapon.arc * 1.22) : weapon.arc,
    timer: attackTimer,
    maxTimer: attackTimer
  };
  playSound("attack");
  vibrate(18);
}

function fireWeaponProjectile(weapon, aim) {
  if (weapon.projectile === "arrow") {
    if (inventory.flechas <= 0) {
      weaponCooldownTimer = 0.12;
      spawnFloatingText("Sem flechas", player.x + 4, player.y - 16, "#fff264");
      return;
    }
    inventory.flechas -= 1;
    renderInventory();
    updateHud();
  }

  if (weapon.projectile === "arrow" && player.isSwimming) {
    spawnFloatingText("Flecha lenta na agua", player.x + 8, player.y - 16, "#55e8ff");
  }

  const centerX = player.x + player.width / 2;
  const centerY = player.y + player.height / 2;
  const waterSlow = player.isSwimming && weapon.projectile === "arrow" ? 0.48 : 1;
  spawnPlayerProjectile({
    type: weapon.projectile,
    x: centerX - 5,
    y: centerY - 5,
    width: weapon.projectile === "arrow" ? 14 : 11,
    height: weapon.projectile === "arrow" ? 5 : 11,
    vx: aim.x * weapon.projectileSpeed * waterSlow,
    vy: aim.y * weapon.projectileSpeed * waterSlow,
    damage: weapon.damage,
    damageType: weapon.damageType,
    distance: 0,
    maxDistance: weapon.range
  });
  playSound(weapon.projectile === "arrow" ? "bow" : "magic");
}

function updateAttack(delta) {
  weaponCooldownTimer = Math.max(0, weaponCooldownTimer - delta);
  dodgeCooldownTimer = Math.max(0, dodgeCooldownTimer - delta);

  if (attackWindupTimer > 0) {
    attackWindupTimer = Math.max(0, attackWindupTimer - delta);
    if (attackWindupTimer <= 0 && !attackHitDone) {
      resolveBasicAttack();
      attackHitDone = true;
    }
  }

  if (attackWindupTimer <= 0 && attackRecoveryTimer > 0) {
    attackRecoveryTimer = Math.max(0, attackRecoveryTimer - delta);
  }

  attackTimer = Math.max(0, attackTimer - delta);
  if (currentMeleeAttack) {
    currentMeleeAttack.timer = Math.max(0, currentMeleeAttack.timer - delta);
    if (currentMeleeAttack.timer <= 0) currentMeleeAttack = null;
  }
}

function resolveBasicAttack() {
  if (!currentMeleeAttack) return;
  let hit = false;

  for (const obj of villageObjects) {
    if (obj.type !== "enemy" || !obj.alive || !enemyInMeleeArc(obj, currentMeleeAttack)) continue;
    const damage = getBasicAttackDamage(currentMeleeAttack.weaponKey);
    const weapon = weapons[currentMeleeAttack.weaponKey] || weapons.sword;
    if (damageEnemy(obj, damage, player.x + player.width / 2, player.y + player.height / 2, 190, weapon.damageType)) {
      hit = true;
    }
  }

  if (hit) playSound("hitEnemy");
}

function enemyInMeleeArc(enemyObj, attack) {
  const centerX = player.x + player.width / 2;
  const centerY = player.y + player.height / 2;
  const enemyX = enemyObj.x + enemyObj.width / 2;
  const enemyY = enemyObj.y + enemyObj.height / 2;
  const dx = enemyX - centerX;
  const dy = enemyY - centerY;
  const distance = Math.hypot(dx, dy);
  if (distance > attack.range + Math.max(enemyObj.width, enemyObj.height) / 2) return false;

  const angle = Math.atan2(dy, dx);
  const diff = Math.abs(angleDifference(angle, attack.angle));
  return diff <= attack.arc / 2;
}

function angleDifference(a, b) {
  return Math.atan2(Math.sin(a - b), Math.cos(a - b));
}

function getBasicAttackDamage(weaponKey = getCurrentWeaponKey()) {
  const weapon = weapons[weaponKey] || weapons.sword;
  return weapon.damage + Math.floor(player.damageBonus || 0) + (inventory.espadas > 0 ? 1 : 0) + (activePowerUps.force > 0 ? 1 : 0);
}

function getAttackRect(direction = player.direction) {
  const centerX = player.x + player.width / 2;
  const centerY = player.y + player.height / 2;
  const forward = direction === "up" || direction === "down" ? 42 : 46;
  const side = direction === "up" || direction === "down" ? 32 : 30;

  if (direction === "left") return { x: centerX - forward, y: centerY - side / 2, width: forward, height: side };
  if (direction === "right") return { x: centerX, y: centerY - side / 2, width: forward, height: side };
  if (direction === "up") return { x: centerX - side / 2, y: centerY - forward, width: side, height: forward };
  return { x: centerX - side / 2, y: centerY, width: side, height: forward };
}

function updateInteractionHint() {
  const target = findInteraction();
  const hidden = !target || dialogOpen || shopOpen;
  interactionHint.classList.toggle("hidden", hidden);
  touchActionButton?.classList.toggle("is-context-ready", Boolean(target) && !dialogOpen && !shopOpen);
  if (hidden) {
    if (touchContextLabel) touchContextLabel.textContent = "...";
    return;
  }

  let label = "Interagir";
  if (target.type === "portal") {
    interactionHint.textContent = "Pressione E para entrar no portal";
    label = "Entrar";
  } else if (target.type === "dimensionPortal") {
    interactionHint.textContent = "Pressione E para voltar";
    label = "Entrar";
  } else if (target.type === "dimensionCrystal") {
    interactionHint.textContent = "Pressione E para ativar cristal";
    label = "Ativar";
  } else if (target.type === "dimensionChest" || target.type === "rareChest") {
    interactionHint.textContent = target.type === "rareChest" ? "Pressione E para abrir o bau raro" : "Pressione E para abrir o bau";
    label = "Abrir";
  } else if (target.type === "npc") {
    interactionHint.textContent = "Pressione E para conversar";
    label = target.role === "shopkeeper" ? "Comprar" : "Falar";
  } else {
    interactionHint.textContent = "Pressione E para interagir";
  }
  if (touchContextLabel) touchContextLabel.textContent = label;
}

function showDialogMessage(message) {
  if (!message) return;
  dialogText.textContent = message;
  dialogBox.classList.remove("hidden");
  dialogOpen = true;
}

function toggleInteraction() {
  if (shopOpen) {
    closeShop();
    closeDialog();
    return;
  }

  if (dialogOpen) {
    closeDialog();
    return;
  }

  const target = findInteraction();
  if (target) {
    const specialSound = ["portal", "dimensionPortal", "dimensionCrystal", "dimensionChest"].includes(target.type);
    if (!specialSound) playSound(target.type === "npc" ? "npc" : "dialog");
    const message = getQuestMessage(target);
    updateQuestProgress();
    showDialogMessage(message);
  }
}

function closeDialog() {
  dialogBox.classList.add("hidden");
  dialogOpen = false;
}

function resetPlayer() {
  if (currentScene !== "village") {
    setActiveScene("village");
  }
  gameOver = false;
  gameOverScreen.classList.add("hidden");
  player.health = player.maxHealth;
  player.mana = player.maxMana;
  player.oxygen = player.maxOxygen;
  player.isSwimming = false;
  playerInvulnerableTimer = 0;
  playerKnockbackX = 0;
  playerKnockbackY = 0;
  projectiles.length = 0;
  enemyProjectiles.length = 0;
  hazardZones.length = 0;
  floatingTexts.length = 0;
  player.x = player.startX;
  player.y = player.startY;
  player.direction = "down";
  closeDialog();
}

function gameLoop(time) {
  const delta = Math.min((time - lastTime) / 1000, 0.05);
  lastTime = time;

  try {
    update(delta);
    draw();
  } catch (error) {
    showErrorMessage(error);
  }
  requestAnimationFrame(gameLoop);
}

window.addEventListener("error", (event) => {
  showErrorMessage(event.error || event.message);
});

window.addEventListener("unhandledrejection", (event) => {
  showErrorMessage(event.reason || "Promessa rejeitada sem detalhe.");
});

function updateMouseAim(event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  mouseAim.screenX = (event.clientX - rect.left) * scaleX;
  mouseAim.screenY = (event.clientY - rect.top) * scaleY;
  mouseAim.worldX = mouseAim.screenX + camera.x;
  mouseAim.worldY = mouseAim.screenY + camera.y;
  mouseAim.angle = Math.atan2(
    mouseAim.worldY - (player.y + player.height / 2),
    mouseAim.worldX - (player.x + player.width / 2)
  );
  mouseAim.active = true;
}

canvas.addEventListener("mousemove", updateMouseAim);

canvas.addEventListener("mousedown", (event) => {
  updateMouseAim(event);
  event.preventDefault();

  if (event.button === 0) {
    triggerPrimaryAttack();
  } else if (event.button === 2) {
    useEquippedPower();
  }
});

canvas.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});

canvas.addEventListener("pointerdown", (event) => {
  if (event.pointerType === "mouse") return;
  event.preventDefault();
  selectMobileTargetFromPoint(event);
});

function selectMobileTargetFromPoint(event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const worldX = (event.clientX - rect.left) * scaleX + camera.x;
  const worldY = (event.clientY - rect.top) * scaleY + camera.y;
  const tapRect = { x: worldX - 18, y: worldY - 18, width: 36, height: 36 };

  const target = villageObjects.find((obj) => (
    obj.type === "enemy" &&
    obj.alive &&
    rectsOverlap(tapRect, obj)
  ));

  if (target) {
    mobileLockedTarget = target;
    currentAutoAimTarget = target;
    spawnFloatingText("Alvo", target.x + target.width / 2, target.y - 12, "#fff264");
    vibrate(10);
  }
}

window.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  const gameplayKeys = ["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d", "e", "i", "u", "q", "r", "f", "c", "m", "escape", "f3", " ", "tab", "1", "2", "3", "4"];

  if (isTypingInTextField()) {
    keys.clear();
    if (key === "escape") {
      document.activeElement?.blur();
    } else if (key === "enter" && !gameStarted && document.activeElement === characterNameInput) {
      event.preventDefault();
      startNewGame();
    }
    return;
  }

  if (gameplayKeys.includes(key)) {
    event.preventDefault();
  }

  if (key === "f3") {
    debugEnabled = !debugEnabled;
    debugPanel?.classList.toggle("hidden", !debugEnabled);
    mobileDebugButton?.classList.toggle("hidden", !debugEnabled);
    return;
  }

  if (isInfoPanelOpen()) {
    if (key === "escape" || key === "enter") {
      infoPanel.classList.add("hidden");
    }
    return;
  }

  if (!gameStarted) {
    keys.clear();
    if (key === "enter") startNewGame();
    if (key === "escape") closeOverlayPanels();
    return;
  }

  if (key === "escape") {
    if (inventoryOpen) {
      toggleInventory(false);
    } else if (missionsOpen || statusOpen) {
      closeOverlayPanels();
    } else if (shopOpen) {
      closeShop();
      closeDialog();
    } else if (dialogOpen) {
      closeDialog();
    } else {
      setPause(!pauseOpen);
    }
    return;
  }

  if (key === "m" && !inventoryOpen && !shopOpen && !dialogOpen) {
    toggleMissionsPanel();
    return;
  }

  if (key === "c" && !inventoryOpen && !shopOpen && !dialogOpen) {
    toggleStatusPanel();
    return;
  }

  if (key === "i") {
    toggleInventory();
    return;
  }

  if (dialogOpen || shopOpen) {
    if (key === "e") toggleInteraction();
    return;
  }

  if (inventoryOpen || missionsOpen || statusOpen) {
    keys.clear();
    return;
  }

  if (pauseOpen) {
    return;
  }

  if (["1", "2", "3", "4"].includes(key)) {
    equipPower(Number(key) - 1);
    return;
  }

  if (key === "tab") {
    cycleWeapon();
    return;
  }

  if (key === "u") {
    usePotion();
    return;
  }

  if (key === " ") {
    dodgeDash();
    return;
  }

  if (key === "q") {
    useEquippedPower();
    return;
  }

  if (key === "r") {
    dash();
    return;
  }

  if (key === "f") {
    shockwave();
    return;
  }

  if (key === "e") {
    toggleInteraction();
    return;
  }

  keys.add(key);
});

window.addEventListener("keyup", (event) => {
  keys.delete(event.key.toLowerCase());
});

function setupTouchControls() {
  setupJoystick();
  if (touchActionButton) touchActionButton.textContent = "E";

  for (const button of touchDirectionButtons) {
    const key = button.dataset.touchKey;

    button.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      button.setPointerCapture(event.pointerId);
      button.classList.add("is-pressed");
      keys.add(key);
    });

    const release = (event) => {
      event.preventDefault();
      button.classList.remove("is-pressed");
      keys.delete(key);
    };

    button.addEventListener("pointerup", release);
    button.addEventListener("pointercancel", release);
    button.addEventListener("lostpointercapture", () => {
      button.classList.remove("is-pressed");
      keys.delete(key);
    });
  }

  const bindTouchAction = (button, action, name = "") => {
    if (!button) return;
    button.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      try {
        button.setPointerCapture(event.pointerId);
      } catch (error) {
        // Alguns navegadores nao permitem captura em certos eventos sinteticos.
      }
      button.classList.add("is-pressed");
      setMobilePressedButton(name || button.id);
      action();
    });
    button.addEventListener("pointerup", (event) => {
      event.preventDefault();
      button.classList.remove("is-pressed");
      clearMobilePressedButton(name || button.id);
    });
    button.addEventListener("pointercancel", () => {
      button.classList.remove("is-pressed");
      clearMobilePressedButton(name || button.id);
    });
    button.addEventListener("lostpointercapture", () => {
      button.classList.remove("is-pressed");
      clearMobilePressedButton(name || button.id);
    });
  };

  bindTouchAction(touchActionButton, toggleInteraction, "interagir");
  bindTouchAction(touchAttackButton, triggerPrimaryAttack, "ataque");
  bindTouchAction(touchInventoryButton, toggleInventory, "inventario");
  bindTouchAction(touchPotionButton, usePotion, "pocao");
  bindTouchAction(touchFireballButton, () => {
    equipPower(0);
    useEquippedPower();
  }, "fogo");
  bindTouchAction(touchDashButton, dodgeDash, "dash");
  bindTouchAction(touchShockwaveButton, () => {
    equipPower(2);
    useEquippedPower();
  }, "onda");
  bindTouchAction(touchHealButton, () => {
    equipPower(3);
    useEquippedPower();
  }, "cura");
  bindTouchAction(touchPowerButton, useEquippedPower, "poder");
  bindTouchAction(touchWeaponButton, cycleWeapon, "arma");
  bindTouchAction(touchPower1Button, () => equipPower(0), "poder1");
  bindTouchAction(touchPower2Button, () => equipPower(1), "poder2");
  bindTouchAction(touchPower3Button, () => equipPower(2), "poder3");
  bindTouchAction(touchPower4Button, () => equipPower(3), "poder4");
  bindTouchAction(mobileFullscreenButton, requestGameFullscreen, "fullscreen");
  bindTouchAction(startFullscreenButton, requestGameFullscreen, "fullscreen");
  bindTouchAction(mobilePauseButton, () => setPause(true), "pausa");
  bindTouchAction(hudMenuButton, () => setPause(true), "menu");
  bindTouchAction(mobileDebugButton, () => {
    debugEnabled = !debugEnabled;
    debugPanel?.classList.toggle("hidden", !debugEnabled);
  }, "debug");
  bindTouchAction(dialogContinueButton, closeDialog, "dialogo");

  document.addEventListener("touchmove", (event) => {
    if (event.target.closest(".touch-controls")) {
      event.preventDefault();
    }
  }, { passive: false });
}

function setupJoystick() {
  if (!joystickBase || !joystickStick) return;

  joystickBase.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    joystick.active = true;
    joystick.pointerId = event.pointerId;
    const rect = joystickBase.getBoundingClientRect();
    joystick.centerX = rect.left + rect.width / 2;
    joystick.centerY = rect.top + rect.height / 2;
    try {
      joystickBase.setPointerCapture(event.pointerId);
    } catch (error) {
      // Captura nao e obrigatoria.
    }
    updateJoystick(event);
  });

  joystickBase.addEventListener("pointermove", (event) => {
    if (!joystick.active || event.pointerId !== joystick.pointerId) return;
    event.preventDefault();
    updateJoystick(event);
  });

  const release = (event) => {
    if (event.pointerId !== joystick.pointerId) return;
    event.preventDefault();
    resetJoystick();
  };

  joystickBase.addEventListener("pointerup", release);
  joystickBase.addEventListener("pointercancel", release);
  joystickBase.addEventListener("lostpointercapture", resetJoystick);
}

function updateJoystick(event) {
  const radius = joystickBase.getBoundingClientRect().width * 0.38;
  const dx = event.clientX - joystick.centerX;
  const dy = event.clientY - joystick.centerY;
  const distance = Math.hypot(dx, dy);
  const clamped = Math.min(distance, radius);
  const angle = Math.atan2(dy, dx);
  const stickX = Math.cos(angle) * clamped;
  const stickY = Math.sin(angle) * clamped;

  joystick.x = distance > 4 ? dx / Math.max(distance, 1) : 0;
  joystick.y = distance > 4 ? dy / Math.max(distance, 1) : 0;
  joystick.strength = clamp(distance / radius, 0, 1);
  joystickStick.style.transform = `translate(calc(-50% + ${stickX}px), calc(-50% + ${stickY}px))`;
}

function resetJoystick() {
  joystick.active = false;
  joystick.pointerId = null;
  joystick.x = 0;
  joystick.y = 0;
  joystick.strength = 0;
  if (joystickStick) joystickStick.style.transform = "translate(-50%, -50%)";
}

resetButton.addEventListener("click", resetPlayer);
gameOverResetButton.addEventListener("click", resetPlayer);
buyPotionButton.addEventListener("click", buyPotion);
saveButton.addEventListener("click", () => {
  saveGame();
  saveButton.textContent = "Salvo!";
  setTimeout(() => {
    saveButton.textContent = "Salvar Jogo";
  }, 1200);
});
playButton.addEventListener("click", startNewGame);
continueButton.addEventListener("click", () => startGame(true));
howToButton.addEventListener("click", () => {
  showHowTo();
});
creditsButton.addEventListener("click", () => {
  showInfo(
    "Creditos",
    "Eternal Rift\n\nCriadores:\nGabryel Garcia\nVictor Ricardo Fonseca Baldin\n\nFeito em HTML, CSS e JavaScript com Canvas 2D."
  );
});
closeInfoButton.addEventListener("click", () => infoPanel.classList.add("hidden"));
hudMenuButton?.addEventListener("click", () => setPause(true));
pauseContinueButton?.addEventListener("click", () => setPause(false));
pauseSaveButton?.addEventListener("click", () => {
  saveGame();
  setPause(false);
});
pauseResetButton?.addEventListener("click", () => {
  resetPlayer();
  setPause(false);
});
pauseHowToButton?.addEventListener("click", () => {
  setPause(false);
  showHowTo();
});
pauseMissionsButton?.addEventListener("click", () => toggleMissionsPanel(true));
pauseStatusButton?.addEventListener("click", () => toggleStatusPanel(true));
pauseInventoryButton?.addEventListener("click", () => {
  setPause(false);
  if (!inventoryOpen) toggleInventory();
});
pauseMenuButton?.addEventListener("click", returnToStartMenu);
closeMissionsButton?.addEventListener("click", () => toggleMissionsPanel(false));
closeStatusButton?.addEventListener("click", () => toggleStatusPanel(false));
characterNameInput?.addEventListener("focus", () => {
  keys.clear();
  resetJoystick();
});
characterNameInput?.addEventListener("input", () => {
  if (characterNameInput.value.length > 16) {
    characterNameInput.value = characterNameInput.value.slice(0, 16);
  }
});
closeInventoryButton?.addEventListener("click", () => toggleInventory(false));
inventoryTabs?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-inventory-tab]");
  if (!button) return;
  inventoryTab = button.dataset.inventoryTab || "all";
  selectedInventoryItemId = "";
  playSound("selectItem");
  renderInventory();
});
inventoryGrid?.addEventListener("click", (event) => {
  const slot = event.target.closest("[data-item-id]");
  if (!slot) return;
  selectedInventoryItemId = slot.dataset.itemId || "";
  playSound("selectItem");
  renderInventory();
});
itemDetailActions?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-inventory-action]");
  if (!button || button.disabled) return;
  handleInventoryAction(button);
});
inventoryPanel?.addEventListener("pointerdown", (event) => {
  event.stopPropagation();
});
inventoryPanel?.addEventListener("touchmove", (event) => {
  event.stopPropagation();
}, { passive: true });

window.addEventListener("resize", updateDeviceMode);
window.addEventListener("orientationchange", () => setTimeout(updateDeviceMode, 250));
document.addEventListener("fullscreenchange", () => {
  updateDeviceMode();
  setTimeout(keepPauseMenuVisible, 80);
});
window.addEventListener("blur", () => {
  if (gameStarted && !gameOver && isMobile) setPause(true);
});

updateDeviceMode();
setupTouchControls();
requestAnimationFrame(gameLoop);

if (shouldAutoStart) {
  setTimeout(() => startGame(false), 120);
}


/* ==================================================
   Eternal Rift - Visual upgrade patch
   Inspirado em RPG 2D pixel art, mantendo Canvas puro.
   ================================================== */

function visualHash(tileX, tileY, salt = 0) {
  const raw = Math.sin(tileX * 127.1 + tileY * 311.7 + salt * 43.13) * 43758.5453123;
  return raw - Math.floor(raw);
}

function drawPixelSpark(x, y, color, shadow = "rgba(26, 31, 61, 0.35)") {
  ctx.fillStyle = shadow;
  ctx.fillRect(Math.round(x) - 1, Math.round(y), 4, 2);
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), 2, 2);
}

function drawSoftShadow(x, y, width, height, alpha = 0.22) {
  ctx.fillStyle = `rgba(26, 31, 61, ${alpha})`;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(width), Math.round(height));
}

function drawTilePebbles(x, y, tileX, tileY, colorA, colorB) {
  if (visualHash(tileX, tileY, 1) > 0.44) {
    ctx.fillStyle = colorA;
    ctx.fillRect(x + 5 + Math.floor(visualHash(tileX, tileY, 2) * 8), y + 6, 3, 2);
  }
  if (visualHash(tileX, tileY, 3) > 0.58) {
    ctx.fillStyle = colorB;
    ctx.fillRect(x + 20, y + 18 + Math.floor(visualHash(tileX, tileY, 4) * 7), 4, 2);
  }
}

function drawGrassTuft(x, y, offsetX, offsetY, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x + offsetX, y + offsetY + 4, 2, 7);
  ctx.fillRect(x + offsetX + 2, y + offsetY + 2, 2, 9);
  ctx.fillRect(x + offsetX + 4, y + offsetY + 5, 2, 5);
}

function drawGrass(x, y, tileX, tileY) {
  const variant = visualHash(tileX, tileY, 10);
  const base = variant < 0.34 ? "#83d873" : variant < 0.67 ? "#8ee47c" : "#78ca67";
  ctx.fillStyle = base;
  ctx.fillRect(x, y, TILE, TILE);

  ctx.fillStyle = "rgba(255, 255, 210, 0.08)";
  if (visualHash(tileX, tileY, 11) > 0.54) ctx.fillRect(x, y, TILE, 3);
  ctx.fillStyle = "rgba(39, 92, 61, 0.10)";
  if (visualHash(tileX, tileY, 12) > 0.5) ctx.fillRect(x, y + TILE - 4, TILE, 4);

  if (visualHash(tileX, tileY, 13) > 0.24) drawGrassTuft(x, y, 6, 17, "#2f8b60");
  if (visualHash(tileX, tileY, 14) > 0.62) drawGrassTuft(x, y, 22, 7, "#3fa164");
  if (visualHash(tileX, tileY, 15) > 0.84) {
    ctx.fillStyle = "#fff264";
    ctx.fillRect(x + 15, y + 15, 2, 2);
    ctx.fillStyle = "#ff7ab5";
    ctx.fillRect(x + 18, y + 16, 2, 2);
  }
}

function drawForestGrass(x, y, tileX, tileY) {
  const variant = visualHash(tileX, tileY, 20);
  ctx.fillStyle = variant < 0.5 ? "#68bb64" : "#5fb45d";
  ctx.fillRect(x, y, TILE, TILE);
  ctx.fillStyle = "rgba(23, 73, 45, 0.18)";
  ctx.fillRect(x, y + TILE - 5, TILE, 5);
  drawGrassTuft(x, y, 4, 6, "#236f48");
  if (visualHash(tileX, tileY, 21) > 0.38) drawGrassTuft(x, y, 20, 16, "#2e844e");
  if (visualHash(tileX, tileY, 22) > 0.7) {
    ctx.fillStyle = "#bdf25a";
    ctx.fillRect(x + 11, y + 24, 4, 2);
    ctx.fillRect(x + 15, y + 21, 2, 4);
  }
}

function drawDirt(x, y, tileX, tileY) {
  const variant = visualHash(tileX, tileY, 30);
  ctx.fillStyle = variant < 0.36 ? "#ad6c4e" : variant < 0.72 ? "#9b5b43" : "#b87552";
  ctx.fillRect(x, y, TILE, TILE);
  ctx.fillStyle = "rgba(82, 45, 39, 0.32)";
  ctx.fillRect(x, y + TILE - 4, TILE, 4);
  ctx.fillStyle = "rgba(255, 229, 166, 0.16)";
  if (visualHash(tileX, tileY, 31) > 0.48) ctx.fillRect(x + 3, y + 6, 18, 3);
  if (visualHash(tileX, tileY, 32) > 0.48) ctx.fillRect(x + 13, y + 19, 14, 3);
  drawTilePebbles(x, y, tileX, tileY, "#6f463f", "#d99b67");
}

function drawPlaza(x, y, tileX, tileY) {
  const variant = visualHash(tileX, tileY, 40);
  ctx.fillStyle = variant < 0.5 ? "#e8c382" : "#d9b475";
  ctx.fillRect(x, y, TILE, TILE);
  ctx.strokeStyle = "rgba(91, 70, 61, 0.55)";
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 0.5, y + 0.5, TILE - 1, TILE - 1);
  ctx.fillStyle = "rgba(255, 246, 202, 0.28)";
  if ((tileX + tileY) % 2 === 0) ctx.fillRect(x + 5, y + 5, 9, 3);
  if ((tileX * 3 + tileY) % 4 === 0) ctx.fillRect(x + 19, y + 21, 8, 3);
  ctx.fillStyle = "rgba(116, 84, 64, 0.22)";
  if (visualHash(tileX, tileY, 41) > 0.65) ctx.fillRect(x + 2, y + 27, 28, 2);
}

function drawWater(x, y, tileX, tileY) {
  const time = performance.now() / 450;
  const wave = Math.sin(time + tileX * 0.6 + tileY * 0.4) * 2;
  ctx.fillStyle = (tileX + tileY) % 2 === 0 ? "#3c99dd" : "#338bd0";
  ctx.fillRect(x, y, TILE, TILE);
  ctx.fillStyle = "rgba(17, 81, 145, 0.28)";
  ctx.fillRect(x, y + TILE - 5, TILE, 5);
  ctx.fillStyle = "rgba(137, 224, 255, 0.72)";
  ctx.fillRect(x + 4, y + 9 + wave, 10, 2);
  ctx.fillRect(x + 17, y + 18 - wave, 11, 2);
  ctx.fillStyle = "rgba(233, 255, 255, 0.35)";
  if (visualHash(tileX, tileY, 50) > 0.68) ctx.fillRect(x + 9, y + 23, 5, 2);
}

function drawInteriorFloor(x, y, tileX, tileY) {
  const variant = visualHash(tileX, tileY, 60);
  ctx.fillStyle = variant < 0.5 ? "#c98a57" : "#b9794b";
  ctx.fillRect(x, y, TILE, TILE);
  ctx.fillStyle = "rgba(78, 47, 35, 0.35)";
  ctx.fillRect(x, y + 15, TILE, 2);
  ctx.fillRect(x, y + 31, TILE, 1);
  ctx.fillStyle = "rgba(255, 220, 155, 0.18)";
  if (visualHash(tileX, tileY, 61) > 0.55) ctx.fillRect(x + 7, y + 6, 12, 2);
  if (visualHash(tileX, tileY, 62) > 0.62) ctx.fillRect(x + 20, y + 22, 6, 2);
}

function drawInteriorWall(x, y, tileX, tileY) {
  const isTop = tileY === 0;
  ctx.fillStyle = isTop ? "#9bbfe0" : "#7d6a80";
  ctx.fillRect(x, y, TILE, TILE);
  ctx.fillStyle = isTop ? "rgba(236, 249, 255, 0.24)" : "rgba(255, 234, 176, 0.12)";
  ctx.fillRect(x + 4, y + 5, 9, 3);
  if ((tileX + tileY) % 3 === 0) ctx.fillRect(x + 18, y + 17, 7, 3);
  ctx.fillStyle = "#273052";
  if (isTop) ctx.fillRect(x, y + TILE - 5, TILE, 5);
}

function drawRug(x, y, tileX, tileY) {
  ctx.fillStyle = (tileX + tileY) % 2 === 0 ? "#c8465e" : "#a93b55";
  ctx.fillRect(x, y, TILE, TILE);
  ctx.fillStyle = "#7f2e49";
  ctx.fillRect(x, y, TILE, 3);
  ctx.fillRect(x, y + TILE - 3, TILE, 3);
  ctx.fillStyle = "rgba(255, 242, 100, 0.32)";
  ctx.fillRect(x + 9, y + 8, 14, 4);
  ctx.fillRect(x + 12, y + 16, 8, 8);
}

function drawObject(obj) {
  if (obj.type === "outdoorDecor") return drawOutdoorDecor(obj);
  if (obj.type === "furniture") return drawFurniture(obj);
  if (obj.type === "house") return drawHouse(obj);
  if (obj.type === "playerHouse") return drawPlayerHouse(obj);
  if (obj.type === "shop") return drawShop(obj);
  if (obj.type === "tree") return drawTree(obj);
  if (obj.type === "fence") return drawFence(obj);
  if (obj.type === "sign") return drawSign(obj);
  if (obj.type === "well") return drawWell(obj);
  if (obj.type === "bench") return drawBench(obj);
  if (obj.type === "portal") return drawPortal(obj);
  if (obj.type === "dimensionPortal") return drawPortal(obj);
  if (obj.type === "dimensionBlocker") return drawDimensionBlocker(obj);
  if (obj.type === "dimensionCrystal") return drawDimensionCrystal(obj);
  if (obj.type === "dimensionChest") return drawDimensionChest(obj);
  if (obj.type === "dimensionSign") return drawDimensionSign(obj);
  if (obj.type === "talkingStone") return drawTalkingStone(obj);
  if (obj.type === "magicFountain") return drawMagicFountain(obj);
  if (obj.type === "largeCrystal") return drawLargeCrystal(obj);
  if (obj.type === "strangeTree") return drawStrangeTree(obj);
  if (obj.type === "floatingRock") return drawFloatingRock(obj);
  if (obj.type === "secretStone") return drawSecretStone(obj);
  if (obj.type === "cave") return drawCave(obj);
  if (obj.type === "bed") return drawBed(obj);
  if (obj.type === "table") return drawTable(obj);
  if (obj.type === "counter") return drawCounter(obj);
  if (obj.type === "mayorDesk") return drawMayorDesk(obj);
  if (obj.type === "bookshelf") return drawBookshelf(obj);
  if (obj.type === "chest") return drawChest(obj);
  if (obj.type === "rareChest") return drawRareChest(obj);
  if (obj.type === "plant") return drawPlant(obj);
  if (obj.type === "flower") return drawFlower(obj);
  if (obj.type === "rock") return drawRock(obj);
  if (obj.type === "crystal") return drawCrystal(obj);
  if (obj.type === "collectible") return drawCollectible(obj);
  if (obj.type === "loot") return drawLootItem(obj);
  if (obj.type === "powerUp") return drawPowerUp(obj);
  if (obj.type === "enemy") return drawEnemy(obj);
  if (obj.type === "npc") return drawNpc(obj);
}

function drawHouse(obj) {
  const x = obj.x;
  const y = obj.y;
  const variant = visualHash(Math.floor(x / TILE), Math.floor(y / TILE), obj.title?.length || 0);
  const roofColor = variant < 0.25 ? "#c94a5c" : variant < 0.5 ? "#d68045" : variant < 0.75 ? "#4c86d9" : "#9b5fc7";
  const wallColor = variant < 0.5 ? "#e5d1aa" : "#d8c2a0";

  drawSoftShadow(x + 7, y + obj.height - 4, obj.width - 8, 10, 0.26);

  ctx.fillStyle = "#273052";
  ctx.fillRect(x + 4, y + 34, obj.width - 8, obj.height - 34);
  ctx.fillStyle = wallColor;
  ctx.fillRect(x + 8, y + 38, obj.width - 16, obj.height - 42);
  ctx.fillStyle = "rgba(121, 88, 70, 0.18)";
  for (let yy = y + 43; yy < y + obj.height - 14; yy += 14) {
    ctx.fillRect(x + 10, yy, obj.width - 20, 2);
  }
  ctx.fillStyle = "rgba(255, 255, 235, 0.24)";
  ctx.fillRect(x + 14, y + 44, 30, 4);
  ctx.fillRect(x + 72, y + 48, 32, 4);

  ctx.fillStyle = "#273052";
  ctx.fillRect(x - 5, y + 14, obj.width + 10, 31);
  ctx.fillStyle = roofColor;
  ctx.fillRect(x - 1, y + 18, obj.width + 2, 23);
  ctx.fillStyle = "rgba(255, 245, 207, 0.18)";
  for (let rx = x + 6; rx < x + obj.width - 8; rx += 18) ctx.fillRect(rx, y + 22, 10, 5);
  ctx.fillStyle = "rgba(91, 39, 53, 0.22)";
  ctx.fillRect(x - 1, y + 36, obj.width + 2, 5);
  pixelRect(x + 88, y + 3, 15, 25, "#a36a46");
  ctx.fillStyle = "#f3c77a";
  ctx.fillRect(x + 92, y + 7, 7, 4);

  pixelRect(x + 24, y + 60, 23, 32, "#93583d");
  ctx.fillStyle = "#f5ce79";
  ctx.fillRect(x + 39, y + 75, 3, 3);
  ctx.fillStyle = "rgba(35, 31, 42, 0.28)";
  ctx.fillRect(x + 27, y + 87, 17, 3);

  drawHouseWindow(x + 73, y + 56, "#63c8f5");
  drawHouseWindow(x + 12, y + 50, "#9ee6ff");

  ctx.fillStyle = "#7bdb73";
  ctx.fillRect(x + 72, y + 77, 28, 5);
  ctx.fillStyle = "#ff7ab5";
  ctx.fillRect(x + 78, y + 73, 3, 3);
  ctx.fillStyle = "#fff264";
  ctx.fillRect(x + 89, y + 74, 3, 3);
}

function drawHouseWindow(x, y, glass) {
  pixelRect(x, y, 25, 21, glass);
  ctx.fillStyle = "#e9ffff";
  ctx.fillRect(x + 5, y + 4, 7, 4);
  ctx.fillStyle = "#273052";
  ctx.fillRect(x + 11, y, 3, 21);
  ctx.fillRect(x, y + 9, 25, 3);
}

function drawPlayerHouse(obj) {
  drawHouse({ ...obj, title: "Minha Casa" });
  const x = obj.x;
  const y = obj.y;
  ctx.fillStyle = "#fff264";
  ctx.fillRect(x + 55, y + 20, 13, 12);
  ctx.fillStyle = "#273052";
  ctx.fillRect(x + 59, y + 23, 5, 7);
  ctx.fillStyle = "#55e8ff";
  ctx.fillRect(x + 60, y + 21, 3, 3);
}

function drawShop(obj) {
  drawHouse({ ...obj, title: "Loja" });
  const x = obj.x;
  const y = obj.y;
  pixelRect(x + 33, y + 42, 60, 15, "#fff264");
  ctx.fillStyle = "#273052";
  ctx.fillRect(x + 40, y + 47, 7, 4);
  ctx.fillRect(x + 52, y + 47, 7, 4);
  ctx.fillRect(x + 64, y + 47, 7, 4);
  ctx.fillRect(x + 76, y + 47, 7, 4);
  ctx.fillStyle = "#d24c63";
  ctx.fillRect(x + 98, y + 54, 9, 18);
  ctx.fillStyle = "#fff264";
  ctx.fillRect(x + 100, y + 58, 5, 5);
}

function drawTree(obj) {
  const x = obj.x;
  const y = obj.y;
  drawSoftShadow(x + 2, y + 56, 30, 7, 0.24);
  pixelRect(x + 11, y + 34, 12, 27, "#8c5a3e");
  ctx.fillStyle = "#b87955";
  ctx.fillRect(x + 15, y + 38, 3, 17);

  ctx.fillStyle = "#273052";
  ctx.fillRect(x + 6, y + 11, 22, 22);
  ctx.fillRect(x, y + 24, 32, 24);
  ctx.fillRect(x + 8, y + 4, 20, 18);
  ctx.fillRect(x + 3, y + 16, 27, 20);
  ctx.fillStyle = "#6fc95b";
  ctx.fillRect(x + 8, y + 13, 18, 19);
  ctx.fillRect(x + 3, y + 25, 26, 17);
  ctx.fillRect(x + 10, y + 7, 15, 16);
  ctx.fillStyle = "#93e665";
  ctx.fillRect(x + 11, y + 10, 8, 5);
  ctx.fillRect(x + 18, y + 22, 7, 4);
  ctx.fillStyle = "#4ca84e";
  ctx.fillRect(x + 5, y + 37, 11, 5);
  ctx.fillRect(x + 19, y + 31, 7, 5);
}

function drawFence(obj) {
  const dark = "#273052";
  const wood = "#d99b67";
  const light = "#f4c27c";
  if (obj.direction === "horizontal") {
    for (let x = obj.x; x < obj.x + obj.width; x += TILE) {
      pixelRect(x + 4, obj.y + 7, 8, 23, wood, dark);
      pixelRect(x + 20, obj.y + 7, 8, 23, wood, dark);
      ctx.fillStyle = light;
      ctx.fillRect(x + 6, obj.y + 10, 3, 6);
    }
    pixelRect(obj.x, obj.y + 13, obj.width, 7, wood, dark);
    ctx.fillStyle = "rgba(115, 70, 47, 0.45)";
    ctx.fillRect(obj.x + 2, obj.y + 18, obj.width - 4, 2);
  } else {
    for (let y = obj.y; y < obj.y + obj.height; y += TILE) {
      pixelRect(obj.x + 7, y + 4, 23, 8, wood, dark);
      pixelRect(obj.x + 7, y + 20, 23, 8, wood, dark);
    }
    pixelRect(obj.x + 13, obj.y, 7, obj.height, wood, dark);
  }
}

function drawSign(obj) {
  pixelRect(obj.x + 7, obj.y + 10, 5, 18, "#8f5a3f");
  pixelRect(obj.x - 1, obj.y, 21, 15, "#e9b56f");
  ctx.fillStyle = "#7b4b38";
  ctx.fillRect(obj.x + 4, obj.y + 5, 12, 2);
  ctx.fillRect(obj.x + 6, obj.y + 9, 8, 2);
}

function drawWell(obj) {
  drawSoftShadow(obj.x + 2, obj.y + 22, 27, 7, 0.24);
  pixelRect(obj.x + 3, obj.y + 10, 22, 16, "#9298a7");
  ctx.fillStyle = "#273052";
  ctx.fillRect(obj.x + 6, obj.y + 13, 16, 8);
  ctx.fillStyle = "#55e8ff";
  ctx.fillRect(obj.x + 9, obj.y + 15, 10, 3);
  pixelRect(obj.x + 1, obj.y + 3, 26, 8, "#c94a5c");
  pixelRect(obj.x + 4, obj.y, 5, 15, "#8b5a3f");
  pixelRect(obj.x + 20, obj.y, 5, 15, "#8b5a3f");
}

function drawBench(obj) {
  drawSoftShadow(obj.x + 1, obj.y + obj.height - 2, obj.width, 5, 0.22);
  pixelRect(obj.x, obj.y, obj.width, obj.height, "#d99b67");
  ctx.fillStyle = "#8f5a3f";
  if (obj.direction === "horizontal") {
    ctx.fillRect(obj.x + 4, obj.y + 3, obj.width - 8, 2);
    ctx.fillRect(obj.x + 4, obj.y + 8, obj.width - 8, 2);
  } else {
    ctx.fillRect(obj.x + 3, obj.y + 4, 2, obj.height - 8);
    ctx.fillRect(obj.x + 8, obj.y + 4, 2, obj.height - 8);
  }
}

function drawPortal(obj) {
  const time = performance.now() / 1000;
  const pulse = Math.sin(time * 3.8);
  const isDimensional = obj.type === "dimensionPortal";
  const mainColor = isDimensional ? "#ff72dc" : "#55e8ff";
  const deepColor = isDimensional ? "#8d3fd1" : "#1f7bd8";
  const lightColor = isDimensional ? "#ffe4fb" : "#e9ffff";
  const runeColor = isDimensional ? "#fff264" : "#fff264";
  const x = obj.x;
  const y = obj.y;
  const cx = x + 32;
  const cy = y + 55;

  ctx.save();

  // Aura grande no fundo, em blocos translúcidos para manter o estilo pixel art.
  ctx.globalAlpha = 0.16 + Math.abs(pulse) * 0.07;
  ctx.fillStyle = mainColor;
  ctx.fillRect(x - 9, y + 19, 82, 69);
  ctx.globalAlpha = 0.1 + Math.abs(pulse) * 0.05;
  ctx.fillRect(x - 16, y + 34, 96, 36);
  ctx.globalAlpha = 1;

  drawSoftShadow(x + 2, y + 84, 62, 10, 0.3);

  // Plataforma de pedra com degraus e runas.
  pixelRect(x + 4, y + 80, 56, 12, "#777f98", "#232a46");
  pixelRect(x + 10, y + 72, 44, 12, "#9aa2b6", "#232a46");
  ctx.fillStyle = "#555d78";
  ctx.fillRect(x + 11, y + 83, 43, 3);
  ctx.fillRect(x + 17, y + 75, 30, 2);
  ctx.fillStyle = runeColor;
  ctx.fillRect(x + 13, y + 82, 4, 4);
  ctx.fillRect(x + 47, y + 82, 4, 4);
  ctx.fillStyle = mainColor;
  ctx.fillRect(x + 29, y + 75, 6, 3);

  // Pilares laterais, mais grossos e detalhados.
  pixelRect(x + 3, y + 18, 14, 66, "#858ca3", "#222944");
  pixelRect(x + 47, y + 18, 14, 66, "#858ca3", "#222944");
  pixelRect(x, y + 14, 20, 9, "#aeb5c8", "#222944");
  pixelRect(x + 44, y + 14, 20, 9, "#aeb5c8", "#222944");
  pixelRect(x + 7, y + 8, 50, 12, "#9ea6bd", "#222944");
  pixelRect(x + 18, y + 3, 28, 10, "#b8bfd0", "#222944");

  // Rachaduras e brilho nas pedras.
  ctx.fillStyle = "rgba(255, 255, 255, 0.24)";
  ctx.fillRect(x + 7, y + 25, 4, 18);
  ctx.fillRect(x + 51, y + 25, 4, 18);
  ctx.fillRect(x + 14, y + 11, 18, 3);
  ctx.fillStyle = "#3b435f";
  ctx.fillRect(x + 12, y + 51, 2, 13);
  ctx.fillRect(x + 50, y + 45, 2, 10);
  ctx.fillRect(x + 23, y + 8, 13, 2);
  ctx.fillStyle = mainColor;
  ctx.fillRect(x + 8, y + 60, 5, 5);
  ctx.fillRect(x + 51, y + 60, 5, 5);
  ctx.fillStyle = lightColor;
  ctx.fillRect(x + 29, y + 7, 6, 5);

  // Campo mágico interno com camadas pulsantes.
  ctx.globalAlpha = 0.75 + Math.abs(pulse) * 0.18;
  ctx.fillStyle = deepColor;
  ctx.fillRect(x + 18, y + 24, 28, 52);
  ctx.fillStyle = mainColor;
  ctx.fillRect(x + 22, y + 27 + pulse * 2, 20, 46 - pulse * 2);
  ctx.fillStyle = lightColor;
  ctx.fillRect(x + 29, y + 31 + pulse * 2, 7, 37);
  ctx.globalAlpha = 1;

  // Cristal/fenda central em formato facetado.
  ctx.save();
  ctx.translate(cx, cy + pulse * 1.5);
  ctx.shadowColor = mainColor;
  ctx.shadowBlur = 10;
  ctx.fillStyle = mainColor;
  ctx.beginPath();
  ctx.moveTo(0, -28);
  ctx.lineTo(15, -9);
  ctx.lineTo(10, 22);
  ctx.lineTo(0, 31);
  ctx.lineTo(-10, 22);
  ctx.lineTo(-15, -9);
  ctx.closePath();
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = lightColor;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
  ctx.fillRect(-4, -20, 5, 32);
  ctx.fillStyle = "rgba(255, 255, 255, 0.32)";
  ctx.fillRect(3, -12, 5, 23);
  ctx.restore();

  // Anéis/losangos de energia girando em volta do cristal.
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(time * 1.25);
  ctx.strokeStyle = mainColor;
  ctx.lineWidth = 2;
  ctx.strokeRect(-20, -27, 40, 54);
  ctx.restore();

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-time * 0.9 + 0.6);
  ctx.strokeStyle = lightColor;
  ctx.globalAlpha = 0.8;
  ctx.lineWidth = 2;
  ctx.strokeRect(-16, -23, 32, 46);
  ctx.restore();

  // Raios quebrados, estilo fenda dimensional.
  ctx.strokeStyle = lightColor;
  ctx.lineWidth = 2;
  for (let i = 0; i < 3; i++) {
    const off = Math.sin(time * 4 + i) * 3;
    ctx.beginPath();
    ctx.moveTo(x + 21 + i * 9, y + 31 + off);
    ctx.lineTo(x + 17 + i * 8, y + 45 - off);
    ctx.lineTo(x + 24 + i * 6, y + 57 + off);
    ctx.lineTo(x + 20 + i * 8, y + 70 - off);
    ctx.stroke();
  }

  // Partículas orbitando e subindo.
  for (let i = 0; i < 18; i++) {
    const angle = time * 2.2 + i * 0.7;
    const radiusX = 30 + (i % 3) * 5 + Math.sin(time * 2 + i) * 2;
    const radiusY = 34 + (i % 4) * 3;
    const px = cx + Math.cos(angle) * radiusX;
    const py = cy + Math.sin(angle) * radiusY - ((time * 18 + i * 11) % 26) * 0.25;
    drawPixelSpark(px, py, i % 3 === 0 ? lightColor : i % 2 === 0 ? mainColor : runeColor);
  }

  // Luz no chão, para o portal parecer importante na praça.
  ctx.globalAlpha = 0.28 + Math.abs(pulse) * 0.07;
  ctx.fillStyle = mainColor;
  ctx.fillRect(x + 13, y + 90, 38, 4);
  ctx.fillRect(x + 22, y + 96, 20, 3);
  ctx.globalAlpha = 1;

  ctx.restore();
}

function drawBed(obj) {
  drawSoftShadow(obj.x + 1, obj.y + obj.height - 2, obj.width, 5, 0.22);
  pixelRect(obj.x, obj.y, obj.width, obj.height, "#7b4b5f");
  ctx.fillStyle = "#f4e1bf";
  ctx.fillRect(obj.x + 8, obj.y + 8, obj.width - 16, 18);
  ctx.fillStyle = "#d24c63";
  ctx.fillRect(obj.x + 8, obj.y + 30, obj.width - 16, obj.height - 38);
  ctx.fillStyle = "rgba(255, 242, 100, 0.22)";
  ctx.fillRect(obj.x + 16, obj.y + 38, obj.width - 32, 5);
}

function drawTable(obj) {
  drawSoftShadow(obj.x + 3, obj.y + obj.height - 2, obj.width - 6, 6, 0.2);
  pixelRect(obj.x, obj.y, obj.width, obj.height, "#9b613f");
  ctx.fillStyle = "#d99b67";
  ctx.fillRect(obj.x + 8, obj.y + 8, obj.width - 16, 15);
  ctx.fillStyle = "#fff3d6";
  ctx.fillRect(obj.x + 20, obj.y + 13, 17, 8);
  ctx.fillStyle = "#7bdb73";
  ctx.fillRect(obj.x + 53, obj.y + 10, 9, 12);
}

function drawCounter(obj) {
  pixelRect(obj.x, obj.y, obj.width, obj.height, "#a56b44");
  ctx.fillStyle = "#d99b67";
  ctx.fillRect(obj.x + 8, obj.y + 8, obj.width - 16, 12);
  ctx.fillStyle = "#8f5a3f";
  for (let x = obj.x + 12; x < obj.x + obj.width - 12; x += 42) ctx.fillRect(x, obj.y + 24, 24, 8);
  ctx.fillStyle = "#d24c63";
  ctx.fillRect(obj.x + 70, obj.y + 18, 16, 16);
  ctx.fillStyle = "#55e8ff";
  ctx.fillRect(obj.x + 132, obj.y + 16, 16, 18);
  ctx.fillStyle = "#fff264";
  ctx.fillRect(obj.x + 200, obj.y + 19, 11, 11);
}

function drawMayorDesk(obj) {
  pixelRect(obj.x, obj.y, obj.width, obj.height, "#7d4d38");
  ctx.fillStyle = "#b87955";
  ctx.fillRect(obj.x + 8, obj.y + 8, obj.width - 16, obj.height - 16);
  ctx.fillStyle = "#fff3d6";
  ctx.fillRect(obj.x + 24, obj.y + 18, 34, 22);
  ctx.fillRect(obj.x + 96, obj.y + 22, 42, 18);
  ctx.fillStyle = "#fff264";
  ctx.fillRect(obj.x + obj.width / 2 - 8, obj.y + 48, 16, 12);
  ctx.fillStyle = "#55e8ff";
  ctx.fillRect(obj.x + obj.width / 2 - 3, obj.y + 51, 6, 5);
}

function drawBookshelf(obj) {
  pixelRect(obj.x, obj.y, obj.width, obj.height, "#854f38");
  ctx.fillStyle = "#273052";
  ctx.fillRect(obj.x + 7, obj.y + 22, obj.width - 14, 4);
  ctx.fillRect(obj.x + 7, obj.y + 50, obj.width - 14, 4);
  const books = ["#55c4ff", "#d24c63", "#fff264", "#7bdb73", "#b46dff"];
  for (let i = 0; i < 8; i++) {
    ctx.fillStyle = books[i % books.length];
    const bx = obj.x + 10 + (i % 4) * 11;
    const by = obj.y + 7 + Math.floor(i / 4) * 28;
    ctx.fillRect(bx, by, 7, 15);
  }
}

function drawChest(obj) {
  drawSoftShadow(obj.x + 2, obj.y + obj.height - 1, obj.width - 2, 5, 0.2);
  pixelRect(obj.x, obj.y + 4, obj.width, obj.height - 4, "#9b613f");
  ctx.fillStyle = "#f5ce79";
  ctx.fillRect(obj.x + obj.width / 2 - 4, obj.y + 14, 8, 8);
  ctx.fillStyle = "rgba(255, 242, 100, 0.2)";
  ctx.fillRect(obj.x + 6, obj.y + 8, obj.width - 12, 4);
}

function drawPlant(obj) {
  pixelRect(obj.x + 5, obj.y + 18, 14, 14, "#b44d60");
  ctx.fillStyle = "#26794d";
  ctx.fillRect(obj.x + 10, obj.y + 8, 4, 14);
  ctx.fillStyle = "#7bdb73";
  ctx.fillRect(obj.x + 4, obj.y + 3, 10, 8);
  ctx.fillRect(obj.x + 12, obj.y, 10, 9);
  ctx.fillStyle = "#bdf25a";
  ctx.fillRect(obj.x + 8, obj.y + 5, 5, 3);
}

function drawFlower(obj) {
  const colors = { pink: "#ff7ab5", yellow: "#fff264", blue: "#55c4ff" };
  ctx.fillStyle = "#26794d";
  ctx.fillRect(obj.x + 5, obj.y + 5, 2, 8);
  ctx.fillStyle = "#273052";
  ctx.fillRect(obj.x + 2, obj.y, 9, 9);
  ctx.fillStyle = colors[obj.color] || colors.pink;
  ctx.fillRect(obj.x + 3, obj.y + 1, 3, 3);
  ctx.fillRect(obj.x + 7, obj.y + 1, 3, 3);
  ctx.fillRect(obj.x + 5, obj.y + 4, 3, 3);
  ctx.fillStyle = "#fff3d6";
  ctx.fillRect(obj.x + 6, obj.y + 3, 1, 1);
}

function drawRock(obj) {
  drawSoftShadow(obj.x + 1, obj.y + 13, 17, 4, 0.2);
  ctx.fillStyle = "#273052";
  ctx.fillRect(obj.x + 1, obj.y + 5, 16, 10);
  ctx.fillStyle = "#8f98a5";
  ctx.fillRect(obj.x + 3, obj.y + 6, 12, 7);
  ctx.fillStyle = "#c8d0d8";
  ctx.fillRect(obj.x + 6, obj.y + 4, 7, 4);
  ctx.fillStyle = "rgba(39, 48, 82, 0.25)";
  ctx.fillRect(obj.x + 4, obj.y + 12, 10, 2);
}

function drawCrystal(obj) {
  const pulse = Math.sin(performance.now() / 180) * 2;
  const y = obj.y + pulse;
  ctx.fillStyle = "rgba(85, 196, 255, 0.35)";
  ctx.fillRect(obj.x - 5, obj.y + 18, 26, 8);
  ctx.fillStyle = "#273052";
  ctx.fillRect(obj.x + 5, y, 7, 6);
  ctx.fillRect(obj.x + 2, y + 5, 13, 14);
  ctx.fillRect(obj.x + 5, y + 18, 7, 6);
  ctx.fillStyle = "#55e8ff";
  ctx.fillRect(obj.x + 6, y + 2, 5, 5);
  ctx.fillRect(obj.x + 4, y + 7, 9, 10);
  ctx.fillRect(obj.x + 7, y + 17, 4, 4);
  ctx.fillStyle = "#e9ffff";
  ctx.fillRect(obj.x + 6, y + 8, 3, 5);
  drawPixelSpark(obj.x + 17, obj.y + 3 + pulse, "#fff264");
}

function drawFurniture(obj) {
  const x = obj.x;
  const y = obj.y;
  const kind = obj.kind;
  if (kind === "chair") {
    drawSoftShadow(x + 2, y + 21, 24, 5, 0.18);
    pixelRect(x + 4, y + 7, 22, 18, "#9b613f");
    ctx.fillStyle = "#d99b67";
    ctx.fillRect(x + 8, y + 11, 14, 8);
    return;
  }
  if (kind === "armoire") {
    pixelRect(x, y, obj.width, obj.height, "#7d4d38");
    ctx.fillStyle = "#b87955";
    ctx.fillRect(x + 8, y + 8, obj.width - 16, obj.height - 16);
    ctx.fillStyle = "#273052";
    ctx.fillRect(x + obj.width / 2 - 2, y + 7, 4, obj.height - 14);
    ctx.fillStyle = "#fff264";
    ctx.fillRect(x + obj.width / 2 - 8, y + 34, 3, 3);
    ctx.fillRect(x + obj.width / 2 + 5, y + 34, 3, 3);
    return;
  }
  if (kind === "barrel") {
    drawSoftShadow(x + 2, y + 25, 26, 5, 0.18);
    pixelRect(x + 4, y + 4, 24, 27, "#9b613f");
    ctx.fillStyle = "#d99b67";
    ctx.fillRect(x + 7, y + 8, 18, 5);
    ctx.fillRect(x + 7, y + 22, 18, 5);
    return;
  }
  if (kind === "stove") {
    pixelRect(x, y + 6, obj.width, obj.height - 6, "#6d5c75");
    ctx.fillStyle = "#273052";
    ctx.fillRect(x + 9, y + 18, obj.width - 18, 16);
    ctx.fillStyle = "#ff8a4b";
    ctx.fillRect(x + 17, y + 23, 14, 7);
    ctx.fillStyle = "#f5ce79";
    ctx.fillRect(x + 22, y + 21, 5, 5);
    return;
  }
  if (kind === "window") {
    drawHouseWindow(x + 4, y + 5, "#73d5ff");
    ctx.fillStyle = "#f5ce79";
    ctx.fillRect(x + 2, y + 27, 34, 4);
    return;
  }
  if (kind === "painting") {
    pixelRect(x + 2, y + 5, obj.width - 4, obj.height - 10, "#f5ce79");
    ctx.fillStyle = "#3f8fe5";
    ctx.fillRect(x + 8, y + 10, obj.width - 16, obj.height - 20);
    ctx.fillStyle = "#7bdb73";
    ctx.fillRect(x + 9, y + obj.height - 14, obj.width - 18, 5);
    return;
  }
  if (kind === "lamp") {
    pixelRect(x + 13, y + 10, 6, 18, "#8f5a3f");
    ctx.fillStyle = "rgba(255, 242, 100, 0.32)";
    ctx.fillRect(x + 5, y + 3, 22, 16);
    pixelRect(x + 8, y + 4, 16, 12, "#fff264");
    return;
  }
  if (kind === "vase") {
    pixelRect(x + 9, y + 17, 14, 13, "#c94a5c");
    ctx.fillStyle = "#26794d";
    ctx.fillRect(x + 15, y + 7, 3, 11);
    ctx.fillStyle = "#7bdb73";
    ctx.fillRect(x + 9, y + 5, 9, 6);
    ctx.fillRect(x + 16, y + 3, 9, 7);
    return;
  }
  if (kind === "shelf") {
    pixelRect(x, y + 8, obj.width, 18, "#8f5a3f");
    ctx.fillStyle = "#fff264";
    ctx.fillRect(x + 10, y + 5, 8, 8);
    ctx.fillStyle = "#55e8ff";
    ctx.fillRect(x + 26, y + 4, 7, 9);
    ctx.fillStyle = "#d24c63";
    ctx.fillRect(x + 42, y + 6, 9, 7);
    return;
  }
  if (kind === "rugSmall") {
    ctx.fillStyle = "#7f2e49";
    ctx.fillRect(x + 2, y + 7, obj.width - 4, obj.height - 14);
    ctx.fillStyle = "#d24c63";
    ctx.fillRect(x + 5, y + 10, obj.width - 10, obj.height - 20);
    ctx.fillStyle = "rgba(255, 242, 100, 0.3)";
    ctx.fillRect(x + obj.width / 2 - 11, y + obj.height / 2 - 3, 22, 6);
    return;
  }
  if (kind === "crate") {
    pixelRect(x + 3, y + 5, 26, 23, "#a56b44");
    ctx.fillStyle = "#7d4d38";
    ctx.fillRect(x + 7, y + 9, 18, 3);
    ctx.fillRect(x + 14, y + 9, 3, 15);
    return;
  }
  pixelRect(x + 4, y + 4, obj.width - 8, obj.height - 8, "#b87955");
}

function drawOutdoorDecor(obj) {
  const x = obj.x;
  const y = obj.y;
  const kind = obj.kind;
  if (kind === "barrel") return drawFurniture({ ...obj, type: "furniture", kind: "barrel" });
  if (kind === "crate") return drawFurniture({ ...obj, type: "furniture", kind: "crate" });
  if (kind === "lantern") {
    pixelRect(x + 13, y + 8, 6, 24, "#8f5a3f");
    ctx.fillStyle = "rgba(255, 242, 100, 0.28)";
    ctx.fillRect(x + 2, y, 28, 22);
    pixelRect(x + 8, y + 3, 16, 15, "#fff264");
    ctx.fillStyle = "#273052";
    ctx.fillRect(x + 12, y + 5, 2, 11);
    ctx.fillRect(x + 18, y + 5, 2, 11);
    return;
  }
  if (kind === "flowerPot") {
    pixelRect(x + 8, y + 17, 16, 13, "#c94a5c");
    ctx.fillStyle = "#26794d";
    ctx.fillRect(x + 15, y + 8, 3, 10);
    ctx.fillStyle = "#ff7ab5";
    ctx.fillRect(x + 10, y + 7, 7, 6);
    ctx.fillStyle = "#fff264";
    ctx.fillRect(x + 17, y + 5, 7, 7);
    return;
  }
  if (kind === "stonePath") {
    ctx.fillStyle = "rgba(75, 65, 62, 0.25)";
    ctx.fillRect(x + 4, y + 16, 24, 8);
    ctx.fillStyle = "#c7ccd4";
    ctx.fillRect(x + 7, y + 17, 7, 4);
    ctx.fillRect(x + 17, y + 19, 8, 4);
    return;
  }
  if (kind === "flag") {
    pixelRect(x + 8, y + 3, 5, 29, "#8f5a3f");
    ctx.fillStyle = "#55e8ff";
    ctx.fillRect(x + 13, y + 4, 16, 10);
    ctx.fillStyle = "#fff264";
    ctx.fillRect(x + 17, y + 7, 5, 4);
    return;
  }
  if (kind === "marketStall") {
    drawSoftShadow(x + 2, y + 30, 59, 6, 0.22);
    pixelRect(x + 6, y + 13, 52, 22, "#b87955");
    ctx.fillStyle = "#273052";
    ctx.fillRect(x + 2, y + 5, 60, 11);
    ctx.fillStyle = "#d24c63";
    ctx.fillRect(x + 5, y + 7, 12, 7);
    ctx.fillStyle = "#fff264";
    ctx.fillRect(x + 17, y + 7, 12, 7);
    ctx.fillStyle = "#d24c63";
    ctx.fillRect(x + 29, y + 7, 12, 7);
    ctx.fillStyle = "#fff264";
    ctx.fillRect(x + 41, y + 7, 12, 7);
    return;
  }
}

function drawNpc(obj) {
  const bob = Math.sin(performance.now() / 300 + obj.bob) * 2;
  const x = obj.x;
  const y = obj.y + bob;
  const role = obj.role || obj.name;
  const palette = {
    shopkeeper: { shirt: "#fff264", hair: "#7d4d38", hat: "#d24c63" },
    letterTarget: { shirt: "#7bdb73", hair: "#273052", hat: "#55c4ff" },
    mayor: { shirt: "#9b5fc7", hair: "#f5ce79", hat: "#fff264" },
    dimensionGuide: { shirt: "#8d4be0", hair: "#e9ffff", hat: "#55e8ff" },
    dimensionMystic: { shirt: "#55e8ff", hair: "#b46dff", hat: "#ff72dc" },
    Nico: { shirt: "#3f8fe5", hair: "#4a2f39", hat: "#55e8ff" },
    Ari: { shirt: "#d24c63", hair: "#273052", hat: "#ff7ab5" },
    Mina: { shirt: "#7bdb73", hair: "#8f5a3f", hat: "#fff264" }
  };
  const look = palette[role] || palette[obj.name] || { shirt: "#7bdb73", hair: "#273052", hat: "#f5ce79" };

  drawSoftShadow(x + 4, y + 27, 20, 5, 0.25);
  pixelRect(x + 5, y + 12, 15, 15, look.shirt);
  ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
  ctx.fillRect(x + 8, y + 14, 8, 3);
  pixelRect(x + 4, y + 3, 16, 12, "#f4bd8f");
  ctx.fillStyle = look.hair;
  ctx.fillRect(x + 3, y + 1, 18, 5);
  ctx.fillRect(x + 4, y + 5, 4, 7);
  if (obj.role === "shopkeeper") {
    ctx.fillStyle = look.hat;
    ctx.fillRect(x + 2, y - 3, 20, 5);
    ctx.fillStyle = "#fff264";
    ctx.fillRect(x + 8, y - 6, 8, 5);
  }
  if (obj.role === "mayor") {
    ctx.fillStyle = look.hat;
    ctx.fillRect(x + 5, y - 4, 14, 5);
    ctx.fillStyle = "#55e8ff";
    ctx.fillRect(x + 11, y - 7, 3, 3);
  }
  ctx.fillStyle = "#273052";
  ctx.fillRect(x + 7, y + 27, 4, 6);
  ctx.fillRect(x + 15, y + 27, 4, 6);
  ctx.fillRect(x + 8, y + 9, 2, 2);
  ctx.fillRect(x + 15, y + 9, 2, 2);
}

function drawPlayer() {
  const x = player.x;
  const y = player.y;
  const legOffset = player.moving ? [0, 2, 0, -2][player.frame] : 0;
  const blinking = playerInvulnerableTimer > 0 && Math.floor(performance.now() / 80) % 2 === 0;

  ctx.save();
  if (blinking) ctx.globalAlpha = 0.45;

  if (player.isSwimming) {
    ctx.strokeStyle = "rgba(233, 255, 255, 0.75)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(x + 12, y + 25, 18, 7, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  if (player.levelGlowTimer > 0) {
    const pulse = 0.35 + Math.sin(performance.now() / 80) * 0.18;
    ctx.fillStyle = `rgba(255, 242, 100, ${pulse})`;
    ctx.fillRect(x - 8, y - 8, player.width + 16, player.height + 16);
    ctx.fillStyle = "rgba(85, 232, 255, 0.34)";
    ctx.fillRect(x - 2, y - 14, player.width + 4, 5);
    ctx.fillRect(x + 3, y + player.height + 4, player.width - 6, 4);
  }

  drawSoftShadow(x + 3, y + 25, 22, 5, 0.25);
  pixelRect(x + 5, y + 12, 17, 14, "#313a78");
  ctx.fillStyle = "#55e8ff";
  ctx.fillRect(x + 8, y + 14, 11, 4);
  ctx.fillStyle = "#f4bd8f";
  ctx.fillRect(x + 7, y + 4, 14, 10);
  ctx.fillStyle = "#273052";
  ctx.fillRect(x + 5, y + 2, 18, 5);
  ctx.fillRect(x + 4, y + 6, 5, 8);
  ctx.fillStyle = "#5ad6e7";
  ctx.fillRect(x + 7, y, 12, 5);
  ctx.fillRect(x + 4, y + 5, 5, 7);
  ctx.fillStyle = "#fff264";
  ctx.fillRect(x + 18, y + 1, 3, 3);

  ctx.fillStyle = "#273052";
  ctx.fillRect(x + 7, y + 25 + legOffset, 5, 6);
  ctx.fillRect(x + 16, y + 25 - legOffset, 5, 6);
  ctx.fillStyle = "#f4bd8f";
  ctx.fillRect(x + 3, y + 15, 4, 8);
  ctx.fillRect(x + 21, y + 15, 4, 8);

  if (player.direction === "up") {
    ctx.fillStyle = "#273052";
    ctx.fillRect(x + 9, y + 6, 10, 2);
  } else if (player.direction === "down") {
    ctx.fillStyle = "#273052";
    ctx.fillRect(x + 11, y + 9, 2, 2);
    ctx.fillRect(x + 17, y + 9, 2, 2);
  } else if (player.direction === "left") {
    ctx.fillStyle = "#273052";
    ctx.fillRect(x + 9, y + 9, 2, 2);
  } else {
    ctx.fillStyle = "#273052";
    ctx.fillRect(x + 19, y + 9, 2, 2);
  }

  if (attackTimer > 0 || weaponCooldownTimer > 0) {
    ctx.fillStyle = "#e9ffff";
    if (player.direction === "left") ctx.fillRect(x - 5, y + 15, 9, 3);
    else if (player.direction === "right") ctx.fillRect(x + 22, y + 15, 9, 3);
    else if (player.direction === "up") ctx.fillRect(x + 13, y + 5, 3, 10);
    else ctx.fillRect(x + 13, y + 22, 3, 10);
  }

  ctx.restore();
}

const drawEnemyBeforeVisualPatch = drawEnemy;
drawEnemy = function drawEnemyVisualUpgrade(obj) {
  if (obj.boss) {
    const pulse = 0.16 + Math.sin(performance.now() / 180) * 0.06;
    ctx.fillStyle = `rgba(255, 79, 98, ${pulse})`;
    ctx.fillRect(obj.x - 10, obj.y - 12, obj.width + 20, obj.height + 22);
    ctx.fillStyle = "rgba(255, 242, 100, 0.22)";
    ctx.fillRect(obj.x + obj.width / 2 - 4, obj.y - 18, 8, 8);
  }
  drawEnemyBeforeVisualPatch(obj);
  if (obj.kind === "slime" || obj.kind === "slimeVerde" || obj.kind === "slimeAzul" || obj.kind === "slimeVermelho" || obj.kind === "reiSlime") {
    ctx.fillStyle = "rgba(233, 255, 255, 0.55)";
    ctx.fillRect(obj.x + 7, obj.y + 8, 6, 3);
  }
  if (obj.kind === "miniDragao") {
    ctx.fillStyle = "#fff264";
    ctx.fillRect(obj.x + 5, obj.y + 6, 5, 3);
  }
};

function outdoorDecor(tileX, tileY, kind, solid = false, widthTiles = 1, heightTiles = 1) {
  return {
    type: "outdoorDecor",
    kind,
    x: tileX * TILE,
    y: tileY * TILE,
    width: widthTiles * TILE,
    height: heightTiles * TILE,
    solid
  };
}

function interiorFurniture(tileX, tileY, kind, solid = false, widthTiles = 1, heightTiles = 1, message = "") {
  return {
    type: "furniture",
    kind,
    x: tileX * TILE,
    y: tileY * TILE,
    width: widthTiles * TILE,
    height: heightTiles * TILE,
    solid,
    message
  };
}

villageObjects.push(
  outdoorDecor(29, 22, "lantern", true), outdoorDecor(37, 22, "lantern", true),
  outdoorDecor(29, 26, "lantern", true), outdoorDecor(37, 26, "lantern", true),
  outdoorDecor(32, 20, "stonePath"), outdoorDecor(36, 20, "stonePath"), outdoorDecor(33, 27, "stonePath"),
  outdoorDecor(25, 32, "flowerPot"), outdoorDecor(28, 32, "barrel", true), outdoorDecor(41, 5, "crate", true),
  outdoorDecor(44, 5, "flowerPot"), outdoorDecor(43, 11, "marketStall", true, 2, 1),
  outdoorDecor(23, 7, "flag", true), outdoorDecor(38, 7, "flag", true),
  outdoorDecor(21, 28, "barrel", true), outdoorDecor(39, 28, "crate", true), outdoorDecor(48, 31, "flowerPot"),
  outdoorDecor(55, 31, "lantern", true), outdoorDecor(59, 31, "barrel", true), outdoorDecor(72, 33, "flag", true)
);

homeObjects.push(
  interiorFurniture(8, 2, "window", false, 2, 1), interiorFurniture(16, 2, "painting", false, 2, 1),
  interiorFurniture(6, 6, "chair", true), interiorFurniture(15, 8, "chair", true),
  interiorFurniture(18, 7, "rugSmall", false, 4, 3), interiorFurniture(20, 3, "armoire", true, 2, 3),
  interiorFurniture(22, 12, "stove", true, 2, 2), interiorFurniture(6, 12, "barrel", true),
  interiorFurniture(10, 12, "vase", true), interiorFurniture(13, 3, "lamp", false),
  interiorFurniture(19, 13, "shelf", false, 2, 1)
);

shopInteriorObjects.push(
  interiorFurniture(6, 3, "window", false, 2, 1), interiorFurniture(18, 3, "painting", false, 2, 1),
  interiorFurniture(4, 11, "crate", true), interiorFurniture(6, 11, "barrel", true), interiorFurniture(19, 11, "vase", true),
  interiorFurniture(12, 9, "rugSmall", false, 5, 2), interiorFurniture(22, 5, "lamp", false),
  interiorFurniture(2, 13, "shelf", false, 2, 1), interiorFurniture(26, 13, "shelf", false, 2, 1)
);

mayorInteriorObjects.push(
  interiorFurniture(8, 2, "painting", false, 2, 1), interiorFurniture(18, 2, "window", false, 2, 1),
  interiorFurniture(8, 9, "chair", true), interiorFurniture(20, 9, "chair", true),
  interiorFurniture(12, 10, "rugSmall", false, 5, 3), interiorFurniture(23, 12, "armoire", true, 2, 3),
  interiorFurniture(7, 13, "vase", true), interiorFurniture(14, 3, "lamp", false)
);

if (currentScene === "home") objects = homeObjects;
else if (currentScene === "shopInterior") objects = shopInteriorObjects;
else if (currentScene === "mayorInterior") objects = mayorInteriorObjects;
else if (currentScene === "crystalDimension") objects = crystalDimensionObjects;
else objects = villageObjects;
colliders = objects.filter((obj) => obj.solid);
interactables = objects.filter((obj) => obj.message);

/* ==================================================
   Eternal Rift - Visual upgrade V2
   Foco: vila mais rica, interiores aconchegantes e sprites mais legiveis.
   Tudo continua em Canvas 2D puro, sem bibliotecas externas.
   ================================================== */

const VISUAL_V2 = {
  grassA: "#7ed36c",
  grassB: "#8de57a",
  grassC: "#6fbe5c",
  darkGrass: "#276b46",
  outline: "#273052",
  woodDark: "#744631",
  wood: "#a66a43",
  woodLight: "#d59a63",
  stoneDark: "#6d655f",
  stone: "#b6aaa0",
  cream: "#f2d4a0",
  gold: "#fff264",
  blue: "#55c4ff",
  red: "#d24c63"
};

function visualHashV2(x, y, salt = 0) {
  const raw = Math.sin(x * 91.73 + y * 283.11 + salt * 17.37) * 10000;
  return raw - Math.floor(raw);
}

function fillPixelV2(x, y, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(width), Math.round(height));
}

function outlinePixelV2(x, y, width, height, fill, outline = VISUAL_V2.outline) {
  fillPixelV2(x, y, width, height, outline);
  if (width > 4 && height > 4) fillPixelV2(x + 2, y + 2, width - 4, height - 4, fill);
}

function drawLeafClusterV2(x, y, color, light) {
  fillPixelV2(x + 4, y + 13, 24, 15, VISUAL_V2.outline);
  fillPixelV2(x + 0, y + 19, 32, 18, VISUAL_V2.outline);
  fillPixelV2(x + 7, y + 3, 20, 17, VISUAL_V2.outline);
  fillPixelV2(x + 5, y + 14, 22, 13, color);
  fillPixelV2(x + 2, y + 20, 28, 15, color);
  fillPixelV2(x + 8, y + 5, 18, 14, color);
  fillPixelV2(x + 8, y + 11, 9, 5, light);
  fillPixelV2(x + 19, y + 20, 8, 5, light);
  fillPixelV2(x + 5, y + 28, 7, 4, "rgba(24, 78, 45, 0.45)");
}

function drawGrassBladeV2(x, y, ox, oy, color) {
  fillPixelV2(x + ox, y + oy + 5, 2, 5, color);
  fillPixelV2(x + ox + 2, y + oy + 2, 2, 8, color);
  fillPixelV2(x + ox + 4, y + oy + 6, 2, 4, color);
}

drawGrass = function drawGrassVisualV2(x, y, tileX, tileY) {
  const h = visualHashV2(tileX, tileY, 1);
  const base = h < 0.28 ? VISUAL_V2.grassA : h < 0.63 ? VISUAL_V2.grassB : VISUAL_V2.grassC;
  fillPixelV2(x, y, TILE, TILE, base);
  fillPixelV2(x, y, TILE, 2, "rgba(255,255,210,0.08)");
  if (visualHashV2(tileX, tileY, 2) > 0.32) drawGrassBladeV2(x, y, 6, 18, "#2f8b55");
  if (visualHashV2(tileX, tileY, 3) > 0.58) drawGrassBladeV2(x, y, 22, 7, "#3f9c5f");
  if (visualHashV2(tileX, tileY, 4) > 0.78) {
    fillPixelV2(x + 12, y + 12, 2, 2, "#fff264");
    fillPixelV2(x + 16, y + 14, 2, 2, "#ff7ab5");
    fillPixelV2(x + 19, y + 13, 2, 2, "#e9ffff");
  }
  if (visualHashV2(tileX, tileY, 5) > 0.88) {
    fillPixelV2(x + 8, y + 25, 8, 2, "rgba(38, 105, 69, 0.18)");
  }
};

drawForestGrass = function drawForestGrassVisualV2(x, y, tileX, tileY) {
  const base = visualHashV2(tileX, tileY, 6) < 0.5 ? "#62b957" : "#59aa51";
  fillPixelV2(x, y, TILE, TILE, base);
  fillPixelV2(x, y + 25, TILE, 7, "rgba(18, 66, 39, 0.20)");
  drawGrassBladeV2(x, y, 4, 7, "#1f6b43");
  drawGrassBladeV2(x, y, 19, 17, "#27794b");
  if (visualHashV2(tileX, tileY, 7) > 0.7) {
    fillPixelV2(x + 11, y + 23, 8, 2, "#bdf25a");
    fillPixelV2(x + 14, y + 20, 2, 6, "#bdf25a");
  }
};

drawDirt = function drawDirtVisualV2(x, y, tileX, tileY) {
  const base = visualHashV2(tileX, tileY, 10) < 0.42 ? "#a96345" : "#b57350";
  fillPixelV2(x, y, TILE, TILE, base);
  fillPixelV2(x, y + 28, TILE, 4, "rgba(81, 49, 38, 0.24)");
  fillPixelV2(x + 3, y + 5, 12, 3, "rgba(255, 221, 162, 0.15)");
  fillPixelV2(x + 19, y + 18, 9, 3, "rgba(255, 221, 162, 0.12)");
  if (visualHashV2(tileX, tileY, 11) > 0.36) fillPixelV2(x + 6, y + 17, 5, 3, "#735044");
  if (visualHashV2(tileX, tileY, 12) > 0.42) fillPixelV2(x + 23, y + 7, 4, 2, "#dba36b");
  if (visualHashV2(tileX, tileY, 13) > 0.73) fillPixelV2(x + 14, y + 25, 3, 2, "#efe0bb");
};

drawPlaza = function drawPlazaVisualV2(x, y, tileX, tileY) {
  const base = visualHashV2(tileX, tileY, 20) < 0.5 ? "#e8c98e" : "#dcbc7d";
  fillPixelV2(x, y, TILE, TILE, base);
  ctx.strokeStyle = "rgba(81, 62, 52, 0.56)";
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 0.5, y + 0.5, TILE - 1, TILE - 1);
  fillPixelV2(x + 4, y + 4, 9, 3, "rgba(255, 249, 219, 0.30)");
  if (visualHashV2(tileX, tileY, 21) > 0.5) fillPixelV2(x + 18, y + 20, 8, 3, "rgba(116, 85, 64, 0.22)");
  if ((tileX + tileY) % 4 === 0) fillPixelV2(x + 1, y + 1, 4, 4, "rgba(255, 242, 100, 0.12)");
};

drawWater = function drawWaterVisualV2(x, y, tileX, tileY) {
  const t = performance.now() / 520;
  const waveA = Math.sin(t + tileX * 0.7 + tileY * 0.35) * 2;
  const waveB = Math.cos(t * 0.8 + tileX * 0.4) * 1.5;
  fillPixelV2(x, y, TILE, TILE, (tileX + tileY) % 2 ? "#358ed1" : "#3ca2e3");
  fillPixelV2(x, y + 26, TILE, 6, "rgba(16, 74, 137, 0.28)");
  fillPixelV2(x + 4, y + 8 + waveA, 10, 2, "rgba(196, 245, 255, 0.78)");
  fillPixelV2(x + 17, y + 17 - waveB, 11, 2, "rgba(137, 224, 255, 0.72)");
  if (visualHashV2(tileX, tileY, 30) > 0.68) fillPixelV2(x + 10, y + 24, 5, 2, "rgba(233,255,255,0.36)");
};

drawInteriorFloor = function drawInteriorFloorVisualV2(x, y, tileX, tileY) {
  const plank = tileY % 2 === 0;
  const base = plank ? "#c68a56" : "#b97849";
  fillPixelV2(x, y, TILE, TILE, base);
  fillPixelV2(x, y + 15, TILE, 2, "rgba(70, 42, 32, 0.28)");
  fillPixelV2(x, y + 31, TILE, 1, "rgba(70, 42, 32, 0.34)");
  if ((tileX + tileY) % 2 === 0) fillPixelV2(x + 3, y + 5, 12, 2, "rgba(255, 224, 166, 0.14)");
  if (visualHashV2(tileX, tileY, 41) > 0.65) fillPixelV2(x + 20, y + 22, 7, 2, "rgba(83, 52, 37, 0.22)");
};

drawInteriorWall = function drawInteriorWallVisualV2(x, y, tileX, tileY) {
  const top = tileY === 0;
  fillPixelV2(x, y, TILE, TILE, top ? "#8fb5d6" : "#706078");
  fillPixelV2(x, y + 26, TILE, 6, top ? "#273052" : "#51445c");
  if ((tileX + tileY) % 3 === 0) fillPixelV2(x + 5, y + 7, 10, 3, "rgba(241, 251, 255, 0.20)");
  if ((tileX + tileY) % 4 === 0) fillPixelV2(x + 18, y + 18, 8, 3, "rgba(255, 236, 180, 0.14)");
};

drawRug = function drawRugVisualV2(x, y, tileX, tileY) {
  fillPixelV2(x, y, TILE, TILE, (tileX + tileY) % 2 === 0 ? "#b63e58" : "#95334f");
  fillPixelV2(x, y, TILE, 3, "#6f2a45");
  fillPixelV2(x, y + TILE - 3, TILE, 3, "#6f2a45");
  fillPixelV2(x + 7, y + 8, 18, 4, "rgba(255, 242, 100, 0.30)");
  fillPixelV2(x + 11, y + 17, 10, 7, "rgba(255, 220, 155, 0.24)");
};

const drawMapBeforeVisualV2 = drawMap;
drawMap = function drawMapWithVisualV2() {
  drawMapBeforeVisualV2();
  drawSceneGroundOverlayV2();
};

function drawSceneGroundOverlayV2() {
  if (currentScene === "village") {
    drawVillageGroundDetailsV2();
    return;
  }
  if (currentScene === "home" || currentScene === "shopInterior" || currentScene === "mayorInterior") {
    drawInteriorRoomBackdropV2(currentScene);
  }
}

function drawVillageGroundDetailsV2() {
  const details = [
    [30.5, 20.5, "flowerBlue"], [36.4, 20.3, "flowerPink"], [28.2, 27.1, "flowerYellow"], [39.2, 27.4, "flowerBlue"],
    [25.2, 22.2, "stoneBits"], [41.5, 22.7, "stoneBits"], [32.3, 27.6, "grassPatch"], [36.1, 27.8, "grassPatch"],
    [23.2, 32.2, "flowerPink"], [47.6, 29.8, "flowerYellow"], [61.4, 33.4, "grassPatch"], [72.5, 36.4, "stoneBits"],
    [55.5, 28.5, "reed"], [62.8, 25.5, "reed"], [66.2, 22.6, "waterLily"], [36.2, 32.8, "waterLily"]
  ];
  for (const [tx, ty, kind] of details) {
    const x = tx * TILE;
    const y = ty * TILE;
    if (x < camera.x - 48 || x > camera.x + canvas.width + 48 || y < camera.y - 48 || y > camera.y + canvas.height + 48) continue;
    if (kind === "flowerBlue") drawTinyFlowerPatchV2(x, y, "#55c4ff");
    if (kind === "flowerPink") drawTinyFlowerPatchV2(x, y, "#ff7ab5");
    if (kind === "flowerYellow") drawTinyFlowerPatchV2(x, y, "#fff264");
    if (kind === "stoneBits") drawStoneBitsV2(x, y);
    if (kind === "grassPatch") drawGrassPatchV2(x, y);
    if (kind === "reed") drawReedsV2(x, y);
    if (kind === "waterLily") drawWaterLilyV2(x, y);
  }
}

function drawTinyFlowerPatchV2(x, y, color) {
  fillPixelV2(x + 6, y + 18, 3, 8, "#26794d");
  fillPixelV2(x + 14, y + 14, 3, 9, "#26794d");
  fillPixelV2(x + 22, y + 20, 3, 7, "#26794d");
  fillPixelV2(x + 4, y + 14, 7, 5, color);
  fillPixelV2(x + 12, y + 10, 8, 6, color);
  fillPixelV2(x + 20, y + 17, 7, 5, color);
  fillPixelV2(x + 15, y + 12, 2, 2, "#fff3d6");
}

function drawStoneBitsV2(x, y) {
  fillPixelV2(x + 5, y + 18, 9, 4, "rgba(39, 48, 82, 0.20)");
  fillPixelV2(x + 7, y + 16, 7, 4, "#a4a7a8");
  fillPixelV2(x + 19, y + 12, 8, 5, "#c8d0d8");
  fillPixelV2(x + 21, y + 17, 4, 2, "#777e87");
}

function drawGrassPatchV2(x, y) {
  drawGrassBladeV2(x, y, 6, 13, "#236f48");
  drawGrassBladeV2(x, y, 14, 17, "#2e844e");
  drawGrassBladeV2(x, y, 23, 11, "#3fa164");
}

function drawReedsV2(x, y) {
  fillPixelV2(x + 8, y + 9, 3, 20, "#26794d");
  fillPixelV2(x + 15, y + 6, 3, 22, "#2f8b60");
  fillPixelV2(x + 22, y + 11, 3, 18, "#26794d");
  fillPixelV2(x + 14, y + 5, 5, 3, "#b87955");
}

function drawWaterLilyV2(x, y) {
  fillPixelV2(x + 8, y + 16, 18, 6, "rgba(28, 111, 85, 0.62)");
  fillPixelV2(x + 14, y + 12, 5, 5, "#ff7ab5");
  fillPixelV2(x + 18, y + 14, 4, 4, "#fff3d6");
}

function drawInteriorRoomBackdropV2(scene) {
  fillPixelV2(camera.x, camera.y, canvas.width, 96, "rgba(44, 37, 58, 0.10)");
  fillPixelV2(32, 32, HOME_WIDTH - 64, 20, "rgba(241, 251, 255, 0.10)");
  fillPixelV2(32, 94, HOME_WIDTH - 64, 5, "rgba(39, 48, 82, 0.45)");
  fillPixelV2(64, 76, 96, 10, "rgba(255, 242, 100, 0.12)");
  fillPixelV2(HOME_WIDTH - 160, 74, 96, 10, "rgba(85, 196, 255, 0.10)");

  if (scene === "home") {
    drawFloorRugOverlayV2(9 * TILE, 11 * TILE, 8 * TILE, 4 * TILE, "#9d3555", "#d24c63");
    drawFloorRugOverlayV2(20 * TILE, 13 * TILE, 5 * TILE, 3 * TILE, "#315a78", "#55c4ff");
  } else if (scene === "shopInterior") {
    drawFloorRugOverlayV2(8 * TILE, 10 * TILE, 12 * TILE, 3 * TILE, "#674261", "#9b5fc7");
    fillPixelV2(3 * TILE, 4 * TILE, 24 * TILE, 4, "rgba(255, 242, 100, 0.11)");
  } else if (scene === "mayorInterior") {
    drawFloorRugOverlayV2(9 * TILE, 8 * TILE, 12 * TILE, 5 * TILE, "#6b2d4a", "#d24c63");
    fillPixelV2(4 * TILE, 3 * TILE, 22 * TILE, 4, "rgba(255, 242, 100, 0.13)");
  }
}

function drawFloorRugOverlayV2(x, y, width, height, border, fill) {
  fillPixelV2(x, y, width, height, border);
  fillPixelV2(x + 6, y + 6, width - 12, height - 12, fill);
  fillPixelV2(x + width / 2 - 20, y + height / 2 - 4, 40, 8, "rgba(255, 242, 100, 0.28)");
  fillPixelV2(x + 10, y + 10, 10, 5, "rgba(255, 255, 255, 0.16)");
  fillPixelV2(x + width - 22, y + height - 16, 10, 5, "rgba(39, 48, 82, 0.18)");
}

function drawRoofTilesV2(x, y, width, roofColor) {
  fillPixelV2(x - 8, y + 15, width + 16, 33, VISUAL_V2.outline);
  fillPixelV2(x - 4, y + 18, width + 8, 26, roofColor);
  for (let rx = x; rx < x + width; rx += 16) {
    fillPixelV2(rx, y + 21, 10, 5, "rgba(255, 245, 210, 0.18)");
    fillPixelV2(rx + 8, y + 34, 11, 4, "rgba(67, 35, 49, 0.16)");
  }
  fillPixelV2(x - 4, y + 42, width + 8, 5, "rgba(53, 31, 43, 0.24)");
}

drawHouse = function drawHouseVisualV2(obj) {
  const x = obj.x;
  const y = obj.y;
  const variant = visualHashV2(Math.floor(x / TILE), Math.floor(y / TILE), obj.title?.length || 1);
  const roofColor = variant < 0.22 ? "#c94a5c" : variant < 0.45 ? "#3f8fe5" : variant < 0.7 ? "#d68045" : "#8d4be0";
  const wallColor = variant < 0.5 ? "#e8d7b8" : "#d8c2a0";
  drawSoftShadow(x + 8, y + 88, obj.width - 4, 10, 0.28);
  outlinePixelV2(x + 6, y + 39, obj.width - 12, 53, wallColor);
  for (let yy = y + 48; yy < y + 82; yy += 13) fillPixelV2(x + 10, yy, obj.width - 20, 2, "rgba(117, 85, 66, 0.18)");
  fillPixelV2(x + 12, y + 45, 36, 4, "rgba(255,255,235,0.24)");
  drawRoofTilesV2(x, y, obj.width, roofColor);
  outlinePixelV2(x + 86, y + 4, 16, 27, "#a36a46");
  fillPixelV2(x + 91, y + 8, 7, 4, "#f3c77a");
  outlinePixelV2(x + 24, y + 60, 24, 32, "#93583d");
  fillPixelV2(x + 39, y + 75, 3, 3, VISUAL_V2.gold);
  fillPixelV2(x + 29, y + 88, 15, 3, "rgba(35, 31, 42, 0.30)");
  drawHouseWindowV2(x + 72, y + 55, "#73d5ff");
  drawHouseWindowV2(x + 12, y + 52, "#9ee6ff");
  drawWindowBoxV2(x + 70, y + 77);
  drawWindowBoxV2(x + 10, y + 74);
};

function drawHouseWindowV2(x, y, glass) {
  outlinePixelV2(x, y, 25, 21, glass);
  fillPixelV2(x + 4, y + 4, 8, 5, "#e9ffff");
  fillPixelV2(x + 13, y + 3, 2, 16, VISUAL_V2.outline);
  fillPixelV2(x + 3, y + 11, 19, 2, VISUAL_V2.outline);
}

function drawWindowBoxV2(x, y) {
  fillPixelV2(x, y + 7, 30, 6, "#7d4d38");
  fillPixelV2(x + 3, y + 3, 5, 5, "#ff7ab5");
  fillPixelV2(x + 13, y + 1, 5, 6, "#fff264");
  fillPixelV2(x + 22, y + 4, 5, 5, "#55c4ff");
}

drawPlayerHouse = function drawPlayerHouseVisualV2(obj) {
  drawHouse(obj);
  fillPixelV2(obj.x + 52, obj.y + 18, 24, 9, "#55e8ff");
  fillPixelV2(obj.x + 58, obj.y + 21, 12, 3, "#fff264");
};

drawShop = function drawShopVisualV2(obj) {
  drawHouse(obj);
  fillPixelV2(obj.x + 20, obj.y + 45, 88, 16, VISUAL_V2.outline);
  fillPixelV2(obj.x + 23, obj.y + 48, 82, 10, "#fff264");
  fillPixelV2(obj.x + 31, obj.y + 51, 12, 4, "#d24c63");
  fillPixelV2(obj.x + 58, obj.y + 51, 12, 4, "#3f8fe5");
  fillPixelV2(obj.x + 84, obj.y + 51, 12, 4, "#7bdb73");
};

drawTree = function drawTreeVisualV2(obj) {
  const x = obj.x;
  const y = obj.y;
  drawSoftShadow(x - 4, y + 55, 42, 9, 0.22);
  outlinePixelV2(x + 12, y + 37, 11, 25, "#8f5a3f");
  fillPixelV2(x + 15, y + 40, 3, 20, "#d99b67");
  drawLeafClusterV2(x - 7, y - 2, "#2f9e56", "#7bdb73");
  drawLeafClusterV2(x + 4, y - 14, "#3aaa5e", "#8de57a");
  drawLeafClusterV2(x - 14, y + 10, "#26794d", "#6fbe5c");
  fillPixelV2(x + 21, y + 6, 5, 4, "rgba(255, 255, 220, 0.18)");
};

const drawBedBeforeVisualV2 = drawBed;
drawBed = function drawBedVisualV2(obj) {
  drawSoftShadow(obj.x + 4, obj.y + obj.height - 2, obj.width - 8, 7, 0.2);
  outlinePixelV2(obj.x, obj.y, obj.width, obj.height, "#88485b");
  fillPixelV2(obj.x + 8, obj.y + 8, obj.width - 16, 16, "#f4e1bf");
  fillPixelV2(obj.x + 8, obj.y + 28, obj.width - 16, obj.height - 36, "#d24c63");
  fillPixelV2(obj.x + 15, obj.y + 38, obj.width - 30, 5, "rgba(255, 242, 100, 0.26)");
  fillPixelV2(obj.x + 8, obj.y + obj.height - 8, obj.width - 16, 4, "rgba(73, 42, 50, 0.30)");
};

const drawTableBeforeVisualV2 = drawTable;
drawTable = function drawTableVisualV2(obj) {
  drawSoftShadow(obj.x + 4, obj.y + obj.height - 2, obj.width - 8, 7, 0.2);
  outlinePixelV2(obj.x, obj.y, obj.width, obj.height, "#9b613f");
  fillPixelV2(obj.x + 8, obj.y + 8, obj.width - 16, 15, "#d99b67");
  fillPixelV2(obj.x + 18, obj.y + 12, 18, 8, "#fff3d6");
  fillPixelV2(obj.x + 52, obj.y + 10, 10, 12, "#7bdb73");
  fillPixelV2(obj.x + 55, obj.y + 7, 5, 5, "#ff7ab5");
};

const drawFurnitureBeforeVisualV2 = drawFurniture;
drawFurniture = function drawFurnitureVisualV2(obj) {
  const x = obj.x;
  const y = obj.y;
  const w = obj.width;
  const h = obj.height;
  const kind = obj.kind;
  if (kind === "largeRug") return drawFloorRugOverlayV2(x, y, w, h, "#6f2a45", "#c8465e");
  if (kind === "blueRug") return drawFloorRugOverlayV2(x, y, w, h, "#244c75", "#3f8fe5");
  if (kind === "roundTable") {
    drawSoftShadow(x + 5, y + 23, 43, 7, 0.2);
    outlinePixelV2(x + 7, y + 5, 42, 29, "#9b613f");
    fillPixelV2(x + 16, y + 10, 24, 13, "#d99b67");
    fillPixelV2(x + 22, y + 13, 8, 6, "#fff3d6");
    fillPixelV2(x + 34, y + 12, 5, 8, "#55c4ff");
    return;
  }
  if (kind === "sofa") {
    drawSoftShadow(x + 4, y + h - 4, w - 8, 7, 0.2);
    outlinePixelV2(x, y + 7, w, h - 8, "#71476c");
    fillPixelV2(x + 7, y + 13, w - 14, 12, "#9b5fc7");
    fillPixelV2(x + 9, y + 28, w - 18, 9, "#dcb5ff");
    fillPixelV2(x + 13, y + 15, 12, 9, "#d24c63");
    fillPixelV2(x + w - 26, y + 15, 12, 9, "#55c4ff");
    return;
  }
  if (kind === "kitchenCounter") {
    outlinePixelV2(x, y, w, h, "#8f5a3f");
    fillPixelV2(x + 8, y + 6, w - 16, 8, "#d99b67");
    fillPixelV2(x + 12, y + 18, 16, 12, "#6d5c75");
    fillPixelV2(x + 39, y + 18, 20, 10, "#c8d0d8");
    fillPixelV2(x + 76, y + 16, 12, 12, "#d24c63");
    return;
  }
  if (kind === "fireplace") {
    outlinePixelV2(x, y, w, h, "#7b6f65");
    fillPixelV2(x + 7, y + 7, w - 14, 11, "#b6aaa0");
    fillPixelV2(x + 13, y + 22, w - 26, h - 30, VISUAL_V2.outline);
    fillPixelV2(x + 19, y + 30, w - 38, 12, "#ff8a4b");
    fillPixelV2(x + 26, y + 25, 8, 10, "#fff264");
    return;
  }
  if (kind === "tallPlant") {
    outlinePixelV2(x + 10, y + h - 18, 18, 16, "#b44d60");
    fillPixelV2(x + 18, y + 12, 4, h - 24, "#26794d");
    fillPixelV2(x + 8, y + 11, 15, 9, "#7bdb73");
    fillPixelV2(x + 20, y + 4, 16, 12, "#8de57a");
    fillPixelV2(x + 9, y + 23, 14, 8, "#3fa164");
    return;
  }
  if (kind === "nightstand") {
    outlinePixelV2(x + 4, y + 8, 24, 22, "#8f5a3f");
    fillPixelV2(x + 10, y + 12, 12, 5, "#d99b67");
    fillPixelV2(x + 14, y + 21, 4, 4, "#fff264");
    return;
  }
  if (kind === "wallBanner") {
    outlinePixelV2(x + 6, y + 3, w - 12, h - 4, "#d24c63");
    fillPixelV2(x + w / 2 - 8, y + 12, 16, 5, "#fff264");
    fillPixelV2(x + w / 2 - 4, y + 18, 8, 13, "#55c4ff");
    return;
  }
  if (kind === "displayShelf") {
    outlinePixelV2(x, y + 2, w, h - 4, "#854f38");
    fillPixelV2(x + 7, y + 20, w - 14, 4, VISUAL_V2.outline);
    fillPixelV2(x + 7, y + 42, w - 14, 4, VISUAL_V2.outline);
    const goods = ["#fff264", "#55c4ff", "#d24c63", "#7bdb73", "#b46dff"];
    for (let i = 0; i < 10; i++) {
      fillPixelV2(x + 10 + (i % 5) * 11, y + 7 + Math.floor(i / 5) * 22, 7, 12, goods[i % goods.length]);
    }
    return;
  }
  if (kind === "cashRegister") {
    outlinePixelV2(x + 4, y + 9, 26, 20, "#6d5c75");
    fillPixelV2(x + 10, y + 13, 12, 5, "#55e8ff");
    fillPixelV2(x + 10, y + 22, 3, 3, "#fff264");
    fillPixelV2(x + 16, y + 22, 3, 3, "#d24c63");
    return;
  }
  if (kind === "noticeBoard") {
    outlinePixelV2(x + 3, y + 5, w - 6, h - 10, "#8f5a3f");
    fillPixelV2(x + 10, y + 12, w - 20, 7, "#fff3d6");
    fillPixelV2(x + 12, y + 24, w - 24, 6, "#f5ce79");
    fillPixelV2(x + 14, y + 34, 18, 5, "#55c4ff");
    return;
  }
  if (kind === "partition") {
    outlinePixelV2(x, y + 4, w, h - 8, "#7d4d38");
    for (let sx = x + 7; sx < x + w - 10; sx += 15) fillPixelV2(sx, y + 9, 7, h - 18, "#d99b67");
    return;
  }
  return drawFurnitureBeforeVisualV2(obj);
};

const drawOutdoorDecorBeforeVisualV2 = drawOutdoorDecor;
drawOutdoorDecor = function drawOutdoorDecorVisualV2(obj) {
  const x = obj.x;
  const y = obj.y;
  const kind = obj.kind;
  if (kind === "lampPost") {
    outlinePixelV2(x + 13, y + 8, 7, 27, "#5c413c");
    fillPixelV2(x + 2, y, 30, 24, "rgba(255, 242, 100, 0.28)");
    outlinePixelV2(x + 7, y + 3, 18, 17, "#fff264");
    fillPixelV2(x + 12, y + 6, 2, 12, VISUAL_V2.outline);
    fillPixelV2(x + 18, y + 6, 2, 12, VISUAL_V2.outline);
    return;
  }
  if (kind === "flowerBed") {
    outlinePixelV2(x + 1, y + 17, wOrDefaultV2(obj, 30), 12, "#7d4d38");
    for (let i = 0; i < 5; i++) {
      fillPixelV2(x + 5 + i * 5, y + 12 - (i % 2), 4, 4, i % 2 ? "#fff264" : "#ff7ab5");
      fillPixelV2(x + 6 + i * 5, y + 16, 2, 6, "#26794d");
    }
    return;
  }
  if (kind === "woodPile") {
    drawSoftShadow(x + 2, y + 24, 30, 6, 0.2);
    for (let i = 0; i < 3; i++) {
      outlinePixelV2(x + 3, y + 8 + i * 7, 26, 7, "#9b613f");
      fillPixelV2(x + 7, y + 10 + i * 7, 6, 3, "#d99b67");
    }
    return;
  }
  if (kind === "mailbox") {
    outlinePixelV2(x + 13, y + 12, 6, 19, "#8f5a3f");
    outlinePixelV2(x + 6, y + 6, 22, 13, "#3f8fe5");
    fillPixelV2(x + 21, y + 10, 5, 4, "#fff264");
    return;
  }
  return drawOutdoorDecorBeforeVisualV2(obj);
};

function wOrDefaultV2(obj, fallback) {
  return obj.width || fallback;
}

drawNpc = function drawNpcVisualV2(obj) {
  const bob = Math.sin(performance.now() / 320 + (obj.bob || 0)) * 1.6;
  const x = obj.x;
  const y = obj.y + bob;
  const role = obj.role || obj.name || "villager";
  const palette = {
    shopkeeper: { shirt: "#fff264", vest: "#d24c63", hair: "#7d4d38", hat: "#d24c63" },
    letterTarget: { shirt: "#7bdb73", vest: "#3f8fe5", hair: "#273052", hat: "#55c4ff" },
    mayor: { shirt: "#9b5fc7", vest: "#fff264", hair: "#f5ce79", hat: "#fff264" },
    dimensionGuide: { shirt: "#8d4be0", vest: "#55e8ff", hair: "#e9ffff", hat: "#55e8ff" },
    dimensionMystic: { shirt: "#55e8ff", vest: "#b46dff", hair: "#b46dff", hat: "#ff72dc" },
    Nico: { shirt: "#3f8fe5", vest: "#55e8ff", hair: "#4a2f39", hat: "#55e8ff" },
    Ari: { shirt: "#d24c63", vest: "#fff264", hair: "#273052", hat: "#ff7ab5" },
    Mina: { shirt: "#7bdb73", vest: "#fff264", hair: "#8f5a3f", hat: "#fff264" },
    villager: { shirt: "#7bdb73", vest: "#f5ce79", hair: "#273052", hat: "#d99b67" }
  };
  const look = palette[role] || palette[obj.name] || palette.villager;
  drawSoftShadow(x + 3, y + 27, 22, 5, 0.25);
  outlinePixelV2(x + 5, y + 12, 17, 16, look.shirt);
  fillPixelV2(x + 8, y + 15, 11, 4, look.vest);
  outlinePixelV2(x + 4, y + 3, 17, 13, "#f4bd8f");
  fillPixelV2(x + 3, y + 1, 19, 5, look.hair);
  fillPixelV2(x + 4, y + 6, 4, 7, look.hair);
  if (role === "shopkeeper") {
    fillPixelV2(x + 2, y - 3, 21, 5, look.hat);
    fillPixelV2(x + 8, y - 7, 8, 5, VISUAL_V2.gold);
  }
  if (role === "mayor") {
    fillPixelV2(x + 5, y - 4, 14, 5, look.hat);
    fillPixelV2(x + 10, y - 8, 5, 4, VISUAL_V2.blue);
  }
  fillPixelV2(x + 7, y + 28, 5, 6, VISUAL_V2.outline);
  fillPixelV2(x + 16, y + 28, 5, 6, VISUAL_V2.outline);
  fillPixelV2(x + 9, y + 9, 2, 2, VISUAL_V2.outline);
  fillPixelV2(x + 16, y + 9, 2, 2, VISUAL_V2.outline);
};

drawPlayer = function drawPlayerVisualV2() {
  const x = player.x;
  const y = player.y;
  const leg = player.moving ? [0, 2, 0, -2][player.frame] : 0;
  const blinking = playerInvulnerableTimer > 0 && Math.floor(performance.now() / 80) % 2 === 0;
  ctx.save();
  if (blinking) ctx.globalAlpha = 0.45;
  if (player.isSwimming) {
    ctx.strokeStyle = "rgba(233, 255, 255, 0.75)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(x + 12, y + 26, 18, 7, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  if (player.levelGlowTimer > 0) {
    const pulse = 0.30 + Math.sin(performance.now() / 80) * 0.15;
    fillPixelV2(x - 8, y - 8, player.width + 16, player.height + 16, `rgba(255, 242, 100, ${pulse})`);
  }
  drawSoftShadow(x + 3, y + 26, 23, 5, 0.25);
  outlinePixelV2(x + 5, y + 12, 18, 15, "#2d3d83");
  fillPixelV2(x + 8, y + 14, 12, 4, "#55e8ff");
  fillPixelV2(x + 10, y + 20, 8, 5, "#3f8fe5");
  outlinePixelV2(x + 7, y + 4, 15, 11, "#f4bd8f");
  fillPixelV2(x + 5, y + 2, 18, 5, "#273052");
  fillPixelV2(x + 4, y + 6, 5, 8, "#273052");
  fillPixelV2(x + 7, y, 12, 5, "#5ad6e7");
  fillPixelV2(x + 4, y + 5, 5, 7, "#5ad6e7");
  fillPixelV2(x + 18, y + 1, 3, 3, VISUAL_V2.gold);
  fillPixelV2(x + 7, y + 26 + leg, 5, 6, VISUAL_V2.outline);
  fillPixelV2(x + 16, y + 26 - leg, 5, 6, VISUAL_V2.outline);
  fillPixelV2(x + 3, y + 15, 4, 8, "#f4bd8f");
  fillPixelV2(x + 22, y + 15, 4, 8, "#f4bd8f");
  if (player.direction === "up") fillPixelV2(x + 9, y + 7, 10, 2, VISUAL_V2.outline);
  else if (player.direction === "left") fillPixelV2(x + 9, y + 9, 2, 2, VISUAL_V2.outline);
  else if (player.direction === "right") fillPixelV2(x + 19, y + 9, 2, 2, VISUAL_V2.outline);
  else {
    fillPixelV2(x + 11, y + 9, 2, 2, VISUAL_V2.outline);
    fillPixelV2(x + 17, y + 9, 2, 2, VISUAL_V2.outline);
  }
  if (attackTimer > 0 || weaponCooldownTimer > 0) {
    const weaponKey = getCurrentWeaponKey();
    const color = weaponKey === "staff" ? "#55e8ff" : weaponKey === "bow" ? "#d99b67" : "#e9ffff";
    fillPixelV2(player.direction === "left" ? x - 8 : player.direction === "right" ? x + 23 : x + 13, player.direction === "up" ? y + 3 : player.direction === "down" ? y + 23 : y + 15, player.direction === "left" || player.direction === "right" ? 12 : 3, player.direction === "up" || player.direction === "down" ? 12 : 3, color);
  }
  ctx.restore();
};

const drawEnemyBeforeVisualV2 = drawEnemy;
drawEnemy = function drawEnemyVisualV2(obj) {
  if (obj.boss) {
    const pulse = 0.16 + Math.sin(performance.now() / 180) * 0.06;
    fillPixelV2(obj.x - 12, obj.y - 14, obj.width + 24, obj.height + 26, `rgba(255, 79, 98, ${pulse})`);
    fillPixelV2(obj.x + obj.width / 2 - 6, obj.y - 20, 12, 9, "rgba(255, 242, 100, 0.32)");
  }
  drawEnemyBeforeVisualV2(obj);
  if (["slime", "slimeVerde", "slimeAzul", "slimeVermelho", "reiSlime"].includes(obj.kind)) {
    fillPixelV2(obj.x + 7, obj.y + 7, 8, 3, "rgba(233, 255, 255, 0.70)");
    fillPixelV2(obj.x + obj.width - 12, obj.y + 14, 4, 4, "rgba(255,255,255,0.35)");
  }
  if (obj.kind === "morcego") {
    fillPixelV2(obj.x - 3, obj.y + 7, 8, 3, "#273052");
    fillPixelV2(obj.x + obj.width - 5, obj.y + 7, 8, 3, "#273052");
  }
  if (obj.kind === "goblin" || obj.kind === "arqueiroGoblin") {
    fillPixelV2(obj.x + 6, obj.y + 3, 10, 4, "#bdf25a");
    fillPixelV2(obj.x + obj.width - 7, obj.y + 11, 5, 3, "#fff264");
  }
};

function addVisualV2Objects(target, items) {
  for (const item of items) {
    if (!target.some((obj) => obj.visualV2Id === item.visualV2Id)) target.push(item);
  }
}

function furnitureV2(id, tileX, tileY, kind, solid = false, widthTiles = 1, heightTiles = 1, message = "") {
  const item = interiorFurniture(tileX, tileY, kind, solid, widthTiles, heightTiles, message);
  item.visualV2Id = id;
  return item;
}

function outdoorV2(id, tileX, tileY, kind, solid = false, widthTiles = 1, heightTiles = 1, message = "") {
  const item = outdoorDecor(tileX, tileY, kind, solid, widthTiles, heightTiles);
  item.visualV2Id = id;
  if (message) item.message = message;
  return item;
}

if (typeof window !== "undefined" && !window.ETERNAL_RIFT_VISUAL_PATCH_V2) {
  window.ETERNAL_RIFT_VISUAL_PATCH_V2 = true;

  fillHomeRect(homeMap, 9, 11, 8, 4, "I");
  fillHomeRect(homeMap, 20, 13, 5, 3, "I");
  fillHomeRect(shopInteriorObjects === objects ? homeMap : homeMap, 7, 13, 7, 2, "I");

  addVisualV2Objects(villageObjects, [
    outdoorV2("plaza-lamp-a", 27, 21, "lampPost", true), outdoorV2("plaza-lamp-b", 39, 21, "lampPost", true),
    outdoorV2("plaza-lamp-c", 27, 27, "lampPost", true), outdoorV2("plaza-lamp-d", 39, 27, "lampPost", true),
    outdoorV2("plaza-flowerbed-a", 24, 19, "flowerBed", true, 1, 1), outdoorV2("plaza-flowerbed-b", 41, 19, "flowerBed", true, 1, 1),
    outdoorV2("plaza-flowerbed-c", 24, 28, "flowerBed", true, 1, 1), outdoorV2("plaza-flowerbed-d", 41, 28, "flowerBed", true, 1, 1),
    outdoorV2("home-mailbox", 25, 36, "mailbox", true), outdoorV2("home-woodpile", 28, 35, "woodPile", true),
    outdoorV2("shop-flowerbed", 43, 9, "flowerBed", true), outdoorV2("shop-mailbox", 46, 9, "mailbox", true),
    outdoorV2("pousada-woodpile", 20, 31, "woodPile", true), outdoorV2("campo-flowerbed", 60, 34, "flowerBed", true),
    outdoorV2("treino-lamp", 68, 44, "lampPost", true), outdoorV2("cabana-mailbox", 8, 54, "mailbox", true)
  ]);

  addVisualV2Objects(homeObjects, [
    furnitureV2("home-wall-banner", 11, 1, "wallBanner", false, 4, 2), furnitureV2("home-window-left", 4, 2, "window", false, 2, 1),
    furnitureV2("home-nightstand", 7, 3, "nightstand", true), furnitureV2("home-large-rug", 9, 11, "largeRug", false, 8, 4),
    furnitureV2("home-round-table", 11, 11, "roundTable", true, 2, 1), furnitureV2("home-sofa", 2, 14, "sofa", true, 4, 2),
    furnitureV2("home-kitchen", 20, 14, "kitchenCounter", true, 4, 1), furnitureV2("home-fireplace", 23, 5, "fireplace", true, 2, 2),
    furnitureV2("home-tall-plant", 26, 8, "tallPlant", true, 1, 2), furnitureV2("home-partition", 2, 7, "partition", true, 4, 1),
    furnitureV2("home-blue-rug", 20, 12, "blueRug", false, 5, 3), furnitureV2("home-notice", 16, 2, "noticeBoard", false, 3, 2)
  ]);

  addVisualV2Objects(shopInteriorObjects, [
    furnitureV2("shop-display-left", 3, 4, "displayShelf", true, 3, 2), furnitureV2("shop-display-right", 23, 4, "displayShelf", true, 3, 2),
    furnitureV2("shop-cash-register", 15, 5, "cashRegister", false), furnitureV2("shop-large-rug", 8, 10, "blueRug", false, 12, 3),
    furnitureV2("shop-notice", 12, 2, "noticeBoard", false, 4, 2), furnitureV2("shop-sofa", 3, 14, "sofa", true, 4, 2),
    furnitureV2("shop-tall-plant", 25, 12, "tallPlant", true, 1, 2), furnitureV2("shop-partition", 21, 13, "partition", true, 5, 1)
  ]);

  addVisualV2Objects(mayorInteriorObjects, [
    furnitureV2("mayor-banner", 12, 1, "wallBanner", false, 5, 2), furnitureV2("mayor-display-left", 2, 5, "displayShelf", true, 3, 2),
    furnitureV2("mayor-display-right", 25, 5, "displayShelf", true, 3, 2), furnitureV2("mayor-large-rug", 9, 8, "largeRug", false, 12, 5),
    furnitureV2("mayor-sofa", 3, 14, "sofa", true, 5, 2), furnitureV2("mayor-fireplace", 23, 11, "fireplace", true, 2, 2),
    furnitureV2("mayor-notice", 11, 3, "noticeBoard", false, 4, 2), furnitureV2("mayor-tall-plant", 26, 14, "tallPlant", true, 1, 2)
  ]);

  if (currentScene === "home") objects = homeObjects;
  else if (currentScene === "shopInterior") objects = shopInteriorObjects;
  else if (currentScene === "mayorInterior") objects = mayorInteriorObjects;
  else if (currentScene === "crystalDimension") objects = crystalDimensionObjects;
  else objects = villageObjects;
  colliders = objects.filter((obj) => obj.solid);
  interactables = objects.filter((obj) => obj.message);
}


// === Sanctuary dimension patch ===
if (typeof window !== "undefined" && !window.ETERNAL_RIFT_SANCTUARY_PATCH) {
  window.ETERNAL_RIFT_SANCTUARY_PATCH = true;

  getSceneName = function getSceneNameSanctuary() {
    if (currentScene === "home") return "Casa";
    if (currentScene === "shopInterior") return "Loja";
    if (currentScene === "mayorInterior") return "Prefeito";
    if (currentScene === "crystalDimension") return "Refugio Cristalino";
    return "Vila";
  };

  drawCrystalFloor = function drawCrystalFloorSanctuary(x, y, tileX, tileY) {
    const mix = (tileX + tileY) % 3;
    const base = mix === 0 ? "#80c56f" : mix === 1 ? "#75ba67" : "#89cd79";
    fillPixelV2(x, y, TILE, TILE, base);
    fillPixelV2(x, y + 25, TILE, 7, "rgba(47, 114, 64, 0.18)");
    if ((tileX * 5 + tileY * 3) % 5 === 0) {
      fillPixelV2(x + 5, y + 10, 3, 7, "#3f9158");
      fillPixelV2(x + 8, y + 7, 3, 5, "#2f7c4c");
      fillPixelV2(x + 10, y + 11, 3, 6, "#4aa56b");
    }
    if ((tileX * 7 + tileY * 2) % 8 === 0) {
      fillPixelV2(x + 20, y + 14, 3, 3, "#fff3d6");
      fillPixelV2(x + 22, y + 12, 3, 3, "#ff7ab5");
      fillPixelV2(x + 18, y + 16, 2, 2, "#55c4ff");
    }
  };

  drawCrystalPath = function drawCrystalPathSanctuary(x, y, tileX, tileY) {
    const base = (tileX + tileY) % 2 === 0 ? "#d9c79b" : "#ceb98a";
    fillPixelV2(x, y, TILE, TILE, base);
    ctx.strokeStyle = "rgba(104, 84, 63, 0.42)";
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 0.5, y + 0.5, TILE - 1, TILE - 1);
    fillPixelV2(x + 2, y + 2, TILE - 4, 2, "rgba(255,255,240,0.16)");
    fillPixelV2(x + 4, y + 26, TILE - 8, 2, "rgba(76, 119, 74, 0.18)");
    if ((tileX + tileY) % 4 === 0) fillPixelV2(x + 12, y + 12, 7, 4, "rgba(255, 242, 100, 0.14)");
    if ((tileX * 3 + tileY) % 5 === 0) fillPixelV2(x + 23, y + 7, 4, 3, "rgba(141, 175, 109, 0.30)");
  };

  drawMagicWater = function drawMagicWaterSanctuary(x, y, tileX, tileY) {
    const wave = Math.sin(performance.now() / 420 + tileX * 0.7 + tileY * 0.35) * 2;
    fillPixelV2(x, y, TILE, TILE, (tileX + tileY) % 2 === 0 ? "#4aa6df" : "#3b90cf");
    fillPixelV2(x, y + 25, TILE, 7, "rgba(12, 62, 122, 0.25)");
    fillPixelV2(x + 4, y + 9 + wave, 10, 3, "rgba(222, 251, 255, 0.85)");
    fillPixelV2(x + 18, y + 18 - wave, 9, 3, "rgba(147, 236, 255, 0.80)");
    fillPixelV2(x + 10, y + 22, 6, 2, "rgba(109, 255, 201, 0.35)");
    if ((tileX * 11 + tileY * 7) % 10 === 0) {
      fillPixelV2(x + 13, y + 12, 4, 4, "#ff7ab5");
      fillPixelV2(x + 10, y + 15, 10, 3, "rgba(35, 134, 92, 0.42)");
    }
  };

  function drawSanctuaryFlowerCluster(x, y, palette = ["#ff7ab5", "#fff264", "#55c4ff"]) {
    fillPixelV2(x + 3, y + 19, 3, 7, "#26794d");
    fillPixelV2(x + 11, y + 16, 3, 9, "#2f8b60");
    fillPixelV2(x + 19, y + 19, 3, 7, "#26794d");
    fillPixelV2(x + 1, y + 14, 7, 5, palette[0]);
    fillPixelV2(x + 9, y + 11, 7, 5, palette[1]);
    fillPixelV2(x + 17, y + 15, 7, 5, palette[2]);
    fillPixelV2(x + 10, y + 13, 2, 2, "#fff3d6");
  }

  function drawSanctuaryShrub(x, y) {
    fillPixelV2(x + 4, y + 17, 24, 11, "#2f8b60");
    fillPixelV2(x + 7, y + 12, 18, 8, "#4eb86c");
    fillPixelV2(x + 12, y + 8, 10, 6, "#79d98a");
    fillPixelV2(x + 8, y + 22, 3, 3, "rgba(255,255,255,0.15)");
  }

  function drawSanctuaryLight(x, y, color) {
    fillPixelV2(x - 5, y - 5, 12, 12, color);
    fillPixelV2(x - 2, y - 2, 6, 6, "#fff3d6");
  }

  drawDimensionAmbient = function drawDimensionAmbientSanctuary() {
    if (dimensionQuest.bridgeOpen) drawCrystalBridge();

    const haze = 0.05 + Math.sin(performance.now() / 1300) * 0.015;
    fillPixelV2(camera.x, camera.y, canvas.width, canvas.height, `rgba(195, 245, 226, ${haze})`);

    const gardens = [
      [5, 5, "flowers"], [8, 7, "shrub"], [36, 7, "shrub"], [39, 5, "flowers"],
      [7, 14, "flowers"], [38, 14, "flowers"], [5, 24, "shrub"], [39, 26, "shrub"],
      [7, 28, "flowers"], [37, 29, "flowers"], [12, 22, "flowers"], [31, 22, "flowers"]
    ];

    for (const [tx, ty, kind] of gardens) {
      const px = tx * TILE;
      const py = ty * TILE;
      if (px < camera.x - 40 || px > camera.x + canvas.width + 40 || py < camera.y - 40 || py > camera.y + canvas.height + 40) continue;
      if (kind === "flowers") drawSanctuaryFlowerCluster(px, py);
      if (kind === "shrub") drawSanctuaryShrub(px, py);
    }

    const time = performance.now() / 1000;
    const particleStep = isMobile ? 2 : 1;
    for (let i = 0; i < dimensionParticles.length; i += particleStep) {
      const particle = dimensionParticles[i];
      const px = particle.x + Math.sin(time * particle.speed + particle.phase) * 12;
      const py = particle.y + Math.cos(time * particle.speed + particle.phase) * 8;
      if (px < camera.x - 8 || px > camera.x + canvas.width + 8 || py < camera.y - 8 || py > camera.y + canvas.height + 8) continue;
      const tone = i % 3 === 0 ? "rgba(255, 242, 100, 0.48)" : i % 3 === 1 ? "rgba(233, 255, 255, 0.52)" : "rgba(85, 228, 255, 0.46)";
      drawSanctuaryLight(px, py, tone);
    }
  };

  getDimensionNpcMessage = function getDimensionNpcMessageSanctuary(npcObj) {
    if (npcObj.role === "dimensionGuide") {
      if (dimensionQuest.status === "notStarted") {
        dimensionQuest.status = "active";
        return "Orion: Bem-vindo ao Refugio Cristalino. Este lugar foi preparado para ser um lar calmo para a vila. Ative os 3 cristais e a ponte do jardim sera liberada.";
      }
      if (dimensionQuest.status === "active") {
        return `Orion: O refugio esta quase completo. Cristais ativados: ${dimensionQuest.activatedCrystals}/${dimensionQuest.totalCrystals}.`;
      }
      if (dimensionQuest.status === "ready" && !dimensionQuest.chestOpened) {
        return "Orion: A ponte do jardim despertou. Atravesse o caminho do norte e abra o bau especial.";
      }
      return "Orion: Agora este refugio pode receber moradores da vila para descansar, conversar e admirar as aguas claras.";
    }
    if (npcObj.role === "dimensionMystic") {
      if (!dimensionQuest.bridgeOpen) {
        return "Nyx: Troquei o antigo vazio roxo por um jardim sereno. Quando os tres cristais brilharem, o refugio vai ficar completo.";
      }
      return "Nyx: O Refugio Cristalino esta em paz. Ate os moradores da vila ja conseguem imaginar piqueniques por aqui.";
    }
    return npcObj.message;
  };

  function ensureDimensionObject(matchFn, createFn) {
    if (!crystalDimensionObjects.some(matchFn)) crystalDimensionObjects.push(createFn());
  }

  addVisualV2Objects(crystalDimensionObjects, [
    outdoorV2("sanctuary-lamp-left", 18, 27, "lampPost", true),
    outdoorV2("sanctuary-lamp-right", 27, 27, "lampPost", true),
    outdoorV2("sanctuary-flowerbed-left", 15, 26, "flowerBed", true),
    outdoorV2("sanctuary-flowerbed-right", 30, 26, "flowerBed", true),
    outdoorV2("sanctuary-flowerbed-top-left", 18, 10, "flowerBed", true),
    outdoorV2("sanctuary-flowerbed-top-right", 25, 10, "flowerBed", true)
  ]);

  ensureDimensionObject(
    (obj) => obj.type === "bench" && obj.x === 14 * TILE + 2 && obj.y === 26 * TILE + 10,
    () => bench(14, 26, "horizontal")
  );
  ensureDimensionObject(
    (obj) => obj.type === "bench" && obj.x === 29 * TILE + 2 && obj.y === 26 * TILE + 10,
    () => bench(29, 26, "horizontal")
  );
  ensureDimensionObject(
    (obj) => obj.type === "npc" && obj.name === "Mila",
    () => npc(16, 25, "Mila", "Mila: Finalmente esta dimensao parece um jardim de descanso. Eu adoraria trazer mais moradores da vila para ca.")
  );
  ensureDimensionObject(
    (obj) => obj.type === "npc" && obj.name === "Caio",
    () => npc(29, 25, "Caio", "Caio: As aguas estao calmas, o ar esta leve e ate o portal parece mais amigavel agora.")
  );
  ensureDimensionObject(
    (obj) => obj.type === "npc" && obj.name === "Lina",
    () => npc(10, 11, "Lina", "Lina: Eu gosto de andar pelos caminhos de pedra e ver as luzes flutuando sobre o lago.")
  );
  ensureDimensionObject(
    (obj) => obj.type === "flower" && obj.x === 19 * TILE + 8,
    () => flower(19, 24, "pink")
  );
  ensureDimensionObject(
    (obj) => obj.type === "flower" && obj.x === 24 * TILE + 8,
    () => flower(24, 24, "blue")
  );
  ensureDimensionObject(
    (obj) => obj.type === "flower" && obj.x === 11 * TILE + 8,
    () => flower(11, 21, "yellow")
  );
  ensureDimensionObject(
    (obj) => obj.type === "flower" && obj.x === 34 * TILE + 8,
    () => flower(34, 21, "pink")
  );
  ensureDimensionObject(
    (obj) => obj.type === "sign" && obj.x === 22 * TILE + 8 && obj.y === 30 * TILE + 6,
    () => sign(22, 30, "Jardim do Refugio: um lugar tranquilo onde os moradores da vila podem descansar, conversar e apreciar a luz dos cristais.")
  );

  const dimensionGuide = crystalDimensionObjects.find((obj) => obj.type === "npc" && obj.role === "dimensionGuide");
  if (dimensionGuide) dimensionGuide.message = "Orion: Este lugar nao e mais um vazio sombrio. Agora ele pode se tornar um refugio para todos.";
  const dimensionMystic = crystalDimensionObjects.find((obj) => obj.type === "npc" && obj.role === "dimensionMystic");
  if (dimensionMystic) dimensionMystic.message = "Nyx: As aguas, flores e caminhos de pedra trouxeram paz para este plano.";

  if (currentScene === "crystalDimension") {
    objects = crystalDimensionObjects;
    colliders = objects.filter((obj) => obj.solid);
    interactables = objects.filter((obj) => obj.message);
  }
}


// === Remove placas/postes decorativos patch ===
if (typeof window !== "undefined" && !window.ETERNAL_RIFT_REMOVE_SIGNS_PATCH) {
  window.ETERNAL_RIFT_REMOVE_SIGNS_PATCH = true;

  function removeUnwantedSigns(list) {
    for (let i = list.length - 1; i >= 0; i--) {
      const obj = list[i];
      if (!obj) continue;
      const isVillageSign = obj.type === "sign";
      const isDimensionSign = obj.type === "dimensionSign";
      const isLampPostDecor = obj.type === "outdoorDecor" && obj.kind === "lampPost";
      if (isVillageSign || isDimensionSign || isLampPostDecor) {
        list.splice(i, 1);
      }
    }
  }

  removeUnwantedSigns(villageObjects);
  removeUnwantedSigns(crystalDimensionObjects);
  removeUnwantedSigns(homeObjects);
  removeUnwantedSigns(shopInteriorObjects);
  removeUnwantedSigns(mayorInteriorObjects);

  objects = currentScene === "home" ? homeObjects
    : currentScene === "shopInterior" ? shopInteriorObjects
    : currentScene === "mayorInterior" ? mayorInteriorObjects
    : currentScene === "crystalDimension" ? crystalDimensionObjects
    : villageObjects;

  colliders = objects.filter((obj) => obj.solid);
  interactables = objects.filter((obj) => obj.message);
}


// === Inventory image icons patch ===
if (typeof window !== "undefined" && !window.ETERNAL_RIFT_INVENTORY_ICONS_PATCH) {
  window.ETERNAL_RIFT_INVENTORY_ICONS_PATCH = true;

  function injectInventoryIconStyles() {
    if (document.getElementById("inventory-icon-styles")) return;
    const style = document.createElement("style");
    style.id = "inventory-icon-styles";
    style.textContent = `
      .inventory-slot { overflow: hidden; }
      .inventory-icon-wrap {
        width: 30px;
        height: 30px;
        display: grid;
        place-items: center;
        filter: drop-shadow(0 1px 0 rgba(0,0,0,0.35));
      }
      .inventory-art {
        width: 30px;
        height: 30px;
        display: block;
        image-rendering: pixelated;
      }
      .inventory-slot .item-icon {
        font-size: 0;
        line-height: 0;
      }
      .item-detail-icon-preview {
        display: inline-grid;
        place-items: center;
        width: 34px;
        height: 34px;
        margin-right: 8px;
        vertical-align: middle;
        border: 2px solid rgba(245, 206, 121, 0.45);
        border-radius: 6px;
        background: linear-gradient(180deg, rgba(90,58,52,.95), rgba(45,31,26,.92));
      }
    `;
    document.head.appendChild(style);
  }

  function inventoryIconKey(item) {
    if (!item) return "unknown";
    if (item.weaponKey) return item.weaponKey;
    if (item.powerKey) return item.powerKey;
    if (item.id === "moedas") return "coins";
    if (item.id === "pocoes") return "potion";
    if (item.id === "cristais") return "crystal";
    if (item.id === "chaves") return "key";
    if (item.id === "cartas") return "letter";
    if (item.id === "espadas-extra") return "sword";
    if (item.id === "flechas") return "arrows";
    if (item.id === "fragmentos") return "fragment";
    if (item.id === "mana-orbes") return "manaOrb";
    if (item.id === "chaves-raras") return "rareKey";
    if (item.id === "powerups-coletados") return "buff";
    if (item.id === "amuleto-vila") return "amulet";
    if (String(item.id).startsWith("buff-")) return "buff";
    if (String(item.id).startsWith("boss-")) return "boss";
    return "unknown";
  }

  function svgShell(inner) {
    return `<span class="inventory-icon-wrap"><svg class="inventory-art" viewBox="0 0 32 32" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">${inner}</svg></span>`;
  }

  function getInventoryIconHtml(item) {
    const key = inventoryIconKey(item);
    const icons = {
      coins: svgShell(`
        <circle cx="13" cy="16" r="7" fill="#f5ce79" stroke="#8a5b2a" stroke-width="2"/>
        <circle cx="19" cy="13" r="7" fill="#fff264" stroke="#8a5b2a" stroke-width="2"/>
        <path d="M17 9h4M19 7v12" stroke="#8a5b2a" stroke-width="2"/>
      `),
      potion: svgShell(`
        <rect x="12" y="5" width="8" height="5" rx="1" fill="#9ee6ff" stroke="#273052" stroke-width="2"/>
        <path d="M12 10h8v3l3 4v8c0 2-2 3-4 3H13c-2 0-4-1-4-3v-8l3-4z" fill="#d24c63" stroke="#273052" stroke-width="2"/>
        <path d="M11 17h12" stroke="#fff3d6" stroke-width="2" opacity=".8"/>
        <circle cx="15" cy="20" r="2" fill="#fff3d6" opacity=".8"/>
      `),
      crystal: svgShell(`
        <path d="M16 3 23 8 24 17 16 29 8 17 9 8z" fill="#55e8ff" stroke="#1f7bd8" stroke-width="2"/>
        <path d="M16 7v18M11 11l5 5 5-5M11 20l5-4 5 4" stroke="#e9ffff" stroke-width="2" opacity=".85"/>
      `),
      key: svgShell(`
        <circle cx="10" cy="15" r="5" fill="none" stroke="#fff264" stroke-width="3"/>
        <path d="M15 15h9v3h-2v3h-3v-3h-4z" fill="#f5ce79" stroke="#8a5b2a" stroke-width="1.5"/>
      `),
      letter: svgShell(`
        <rect x="6" y="8" width="20" height="16" rx="2" fill="#fff3d6" stroke="#7d4d38" stroke-width="2"/>
        <path d="M7 10 16 17 25 10" fill="none" stroke="#c94a5c" stroke-width="2"/>
        <path d="M9 21h14" stroke="#d8c2a0" stroke-width="2"/>
      `),
      sword: svgShell(`
        <path d="M18 4 24 10 14 20 12 18z" fill="#e9ffff" stroke="#394066" stroke-width="2"/>
        <path d="M10 20 7 23l2 2-2 2 1 1 2-2 2 2 1-1-2-2 2-2z" fill="#f5ce79" stroke="#5c413c" stroke-width="1.5"/>
      `),
      arrows: svgShell(`
        <path d="M9 22 21 10" stroke="#d99b67" stroke-width="3"/>
        <path d="M19 8h7v7" fill="none" stroke="#e9ffff" stroke-width="2"/>
        <path d="M8 23 5 18" stroke="#fff3d6" stroke-width="2"/>
        <path d="M13 26 25 14" stroke="#d99b67" stroke-width="3" opacity=".75"/>
      `),
      fragment: svgShell(`
        <path d="M8 22 12 8 18 4 24 12 19 25z" fill="#9b5fc7" stroke="#4f2d73" stroke-width="2"/>
        <path d="M12 11 18 9M13 18l5-3" stroke="#e7d3ff" stroke-width="2" opacity=".8"/>
      `),
      manaOrb: svgShell(`
        <circle cx="16" cy="16" r="9" fill="#9b5fc7" stroke="#4f2d73" stroke-width="2"/>
        <circle cx="13" cy="13" r="4" fill="#e7d3ff" opacity=".7"/>
        <path d="M11 21c2 2 8 2 10 0" stroke="#55e8ff" stroke-width="2"/>
      `),
      rareKey: svgShell(`
        <circle cx="10" cy="15" r="5" fill="none" stroke="#55e8ff" stroke-width="3"/>
        <path d="M15 15h9v3h-2v3h-3v-3h-4z" fill="#fff264" stroke="#3f8fe5" stroke-width="1.5"/>
        <circle cx="10" cy="15" r="1.5" fill="#fff264"/>
      `),
      buff: svgShell(`
        <path d="M16 4 19 11 27 11 21 16 23 24 16 19 9 24 11 16 5 11 13 11z" fill="#fff264" stroke="#8a5b2a" stroke-width="2"/>
        <circle cx="16" cy="16" r="3" fill="#55e8ff"/>
      `),
      bow: svgShell(`
        <path d="M11 5c7 5 7 17 0 22" fill="none" stroke="#d99b67" stroke-width="3"/>
        <path d="M11 5v22" stroke="#fff3d6" stroke-width="1.5"/>
        <path d="M13 16h12" stroke="#c8d0d8" stroke-width="2"/>
        <path d="M22 13 27 16 22 19" fill="#e9ffff" stroke="#394066" stroke-width="1.5"/>
      `),
      staff: svgShell(`
        <path d="M13 6v18" stroke="#8f5a3f" stroke-width="3"/>
        <circle cx="13" cy="6" r="4" fill="#55c4ff" stroke="#273052" stroke-width="2"/>
        <path d="M18 10c4 1 6 4 7 8" stroke="#9ee6ff" stroke-width="2" opacity=".8"/>
      `),
      spear: svgShell(`
        <path d="M8 24 24 8" stroke="#d99b67" stroke-width="3"/>
        <path d="M24 8l2-5 3 3-5 2z" fill="#e9ffff" stroke="#394066" stroke-width="1.5"/>
        <path d="M8 24l-3 3" stroke="#5c413c" stroke-width="2"/>
      `),
      fireball: svgShell(`
        <circle cx="16" cy="16" r="7" fill="#ff8d4a" stroke="#9b2f1b" stroke-width="2"/>
        <path d="M17 6c3 2 5 6 4 10-2-1-5-1-7 0 0-4 1-7 3-10z" fill="#fff264" opacity=".9"/>
        <path d="M10 20c2 4 10 4 12 0" stroke="#9b2f1b" stroke-width="2"/>
      `),
      blueRay: svgShell(`
        <path d="M7 18 14 11 18 15 25 8" fill="none" stroke="#55e8ff" stroke-width="3"/>
        <path d="M18 15h6l-3 7" fill="none" stroke="#e9ffff" stroke-width="2"/>
      `),
      shockwave: svgShell(`
        <circle cx="16" cy="16" r="4" fill="#fff264" stroke="#8a5b2a" stroke-width="2"/>
        <circle cx="16" cy="16" r="8" fill="none" stroke="#ff7ab5" stroke-width="2" opacity=".8"/>
        <circle cx="16" cy="16" r="12" fill="none" stroke="#55c4ff" stroke-width="2" opacity=".7"/>
      `),
      heal: svgShell(`
        <circle cx="16" cy="16" r="10" fill="#5fcf7a" stroke="#26794d" stroke-width="2"/>
        <path d="M16 10v12M10 16h12" stroke="#fff3d6" stroke-width="3"/>
      `),
      amulet: svgShell(`
        <path d="M16 5 24 11 21 24 16 27 11 24 8 11z" fill="#fff264" stroke="#8a5b2a" stroke-width="2"/>
        <circle cx="16" cy="16" r="4" fill="#55c4ff" stroke="#394066" stroke-width="2"/>
      `),
      boss: svgShell(`
        <path d="M8 22h16l-2 4H10z" fill="#8f5a3f" stroke="#5c413c" stroke-width="1.5"/>
        <path d="M10 8h12v6c0 4-3 7-6 8-3-1-6-4-6-8z" fill="#d24c63" stroke="#5d2031" stroke-width="2"/>
        <circle cx="12" cy="11" r="2" fill="#fff264"/><circle cx="20" cy="11" r="2" fill="#fff264"/>
      `),
      unknown: svgShell(`
        <rect x="7" y="7" width="18" height="18" rx="4" fill="#c8d0d8" stroke="#394066" stroke-width="2"/>
        <path d="M16 11c2 0 4 1 4 3 0 2-2 3-3 4-1 1-1 1-1 2" fill="none" stroke="#394066" stroke-width="2"/>
        <circle cx="16" cy="23" r="1.8" fill="#394066"/>
      `)
    };
    return icons[key] || icons.unknown;
  }

  function getInventoryNameHtml(item) {
    return `<span class="item-detail-icon-preview">${getInventoryIconHtml(item)}</span><span>${item.name}</span>`;
  }

  injectInventoryIconStyles();

  renderInventoryGrid = function renderInventoryGridWithImages(filteredItems, totalItems) {
    if (!inventoryGrid) return;

    const slotCount = Math.max(30, filteredItems.length);
    const slots = [];
    for (let index = 0; index < slotCount; index += 1) {
      const item = filteredItems[index];
      if (!item) {
        slots.push(`<button class="inventory-slot is-empty" type="button" disabled aria-label="Slot vazio"></button>`);
        continue;
      }

      const equipped = (item.weaponKey && item.weaponKey === getCurrentWeaponKey()) ||
        (item.powerKey && item.powerKey === equippedPower);
      slots.push(`
        <button class="inventory-slot rarity-${item.rarity}${selectedInventoryItemId === item.id ? " is-selected" : ""}${equipped ? " is-equipped" : ""}" type="button" data-item-id="${item.id}" aria-label="${item.name}">
          <span class="item-icon">${getInventoryIconHtml(item)}</span>
          <span class="item-qty">${item.quantity > 1 ? item.quantity : ""}</span>
        </button>
      `);
    }

    inventoryGrid.innerHTML = slots.join("");
    if (inventoryEmpty) {
      inventoryEmpty.textContent = totalItems ? "Nada nesta aba." : "Sua bolsa esta vazia.";
      inventoryEmpty.classList.toggle("hidden", filteredItems.length > 0);
    }
  };

  renderItemDetails = function renderItemDetailsWithPreview(item) {
    if (!itemDetailName || !itemDetailMeta || !itemDetailDescription || !itemDetailEffect || !itemDetailActions) return;

    if (!item) {
      itemDetailName.textContent = "Bolsa vazia";
      itemDetailMeta.textContent = "Nenhum item selecionado.";
      itemDetailDescription.textContent = "Colete moedas, pocoes, cristais, chaves e armas pelo mapa.";
      itemDetailEffect.textContent = "";
      itemDetailActions.innerHTML = "";
      return;
    }

    itemDetailName.innerHTML = getInventoryNameHtml(item);
    itemDetailMeta.textContent = `${item.typeLabel} | ${formatRarity(item.rarity)} | Qtd. ${item.quantity}`;
    itemDetailDescription.textContent = item.description || "Item desconhecido guardado com cuidado.";
    itemDetailEffect.textContent = item.effect || "";
    itemDetailActions.innerHTML = getInventoryActionHtml(item);
  };
}

// === Weapon visuals patch: armas visiveis na mao, ataques e projeteis ===
var weaponVisualState = typeof weaponVisualState === "undefined" ? {
  timer: 0,
  maxTimer: 0,
  weaponKey: "sword",
  angle: 0,
  kind: "idle"
} : weaponVisualState;

function safeCurrentWeaponKeyForVisual() {
  try {
    const key = typeof getCurrentWeaponKey === "function" ? getCurrentWeaponKey() : "sword";
    return weapons?.[key] ? key : "sword";
  } catch (error) {
    return "sword";
  }
}

function safeCurrentWeaponForVisual() {
  const key = safeCurrentWeaponKeyForVisual();
  return weapons?.[key] || weapons.sword || { name: "Espada curta", kind: "melee", range: 48 };
}

function safeAimForWeaponVisual() {
  try {
    const aim = typeof getAimVector === "function" ? getAimVector() : null;
    if (aim && Number.isFinite(aim.x) && Number.isFinite(aim.y)) {
      const length = Math.hypot(aim.x, aim.y) || 1;
      return { x: aim.x / length, y: aim.y / length, angle: Number.isFinite(aim.angle) ? aim.angle : Math.atan2(aim.y, aim.x) };
    }
  } catch (error) {
    // Usa direcao do jogador abaixo.
  }

  const fallback = typeof directionVector === "function" ? directionVector(player?.direction || "down") : { x: 0, y: 1 };
  return { x: fallback.x, y: fallback.y, angle: Math.atan2(fallback.y, fallback.x) };
}

function drawPixelBlade(width, height, color, stroke = "#273052") {
  ctx.fillStyle = stroke;
  ctx.fillRect(0, -height / 2 - 1, width + 2, height + 2);
  ctx.fillStyle = color;
  ctx.fillRect(1, -height / 2, width, height);
  ctx.fillStyle = "rgba(255,255,255,0.65)";
  ctx.fillRect(3, -height / 2 + 1, Math.max(4, width - 8), 2);
}

function drawWeaponHandle(x, y, length = 10) {
  ctx.fillStyle = "#273052";
  ctx.fillRect(x - 1, y - 3, length + 2, 6);
  ctx.fillStyle = "#7d4d38";
  ctx.fillRect(x, y - 2, length, 4);
  ctx.fillStyle = "#f5ce79";
  ctx.fillRect(x + length - 2, y - 3, 3, 6);
}

function getWeaponVisualProgress() {
  if (currentMeleeAttack && currentMeleeAttack.maxTimer > 0) {
    return 1 - clamp(currentMeleeAttack.timer / currentMeleeAttack.maxTimer, 0, 1);
  }
  if (weaponVisualState.maxTimer > 0 && weaponVisualState.timer > 0) {
    return 1 - clamp(weaponVisualState.timer / weaponVisualState.maxTimer, 0, 1);
  }
  return 0;
}

function getWeaponVisualAngle(baseAim, weaponKey) {
  if (currentMeleeAttack && Number.isFinite(currentMeleeAttack.angle)) {
    const progress = getWeaponVisualProgress();
    if (weaponKey === "sword") return currentMeleeAttack.angle - 0.75 + progress * 1.5;
    return currentMeleeAttack.angle;
  }
  if (weaponVisualState.timer > 0 && Number.isFinite(weaponVisualState.angle)) {
    return weaponVisualState.angle;
  }
  return baseAim.angle;
}

function drawSwordInHand(progress) {
  const thrust = progress > 0 ? Math.sin(Math.min(1, progress) * Math.PI) * 7 : 0;
  ctx.translate(8 + thrust, 0);
  drawWeaponHandle(-7, 0, 9);
  ctx.fillStyle = "#273052";
  ctx.fillRect(0, -6, 5, 12);
  drawPixelBlade(24, 6, "#e9ffff");
  ctx.fillStyle = "#c8d0d8";
  ctx.fillRect(8, -1, 11, 2);
}

function drawSpearInHand(progress) {
  const thrust = progress > 0 ? Math.sin(Math.min(1, progress) * Math.PI) * 15 : 0;
  ctx.translate(6 + thrust, 0);
  ctx.fillStyle = "#273052";
  ctx.fillRect(-10, -3, 42, 6);
  ctx.fillStyle = "#9b613f";
  ctx.fillRect(-9, -2, 39, 4);
  ctx.fillStyle = "#273052";
  ctx.beginPath();
  ctx.moveTo(29, -8);
  ctx.lineTo(43, 0);
  ctx.lineTo(29, 8);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#e9ffff";
  ctx.beginPath();
  ctx.moveTo(31, -5);
  ctx.lineTo(41, 0);
  ctx.lineTo(31, 5);
  ctx.closePath();
  ctx.fill();
  if (progress > 0) {
    ctx.fillStyle = "rgba(233,255,255,0.75)";
    ctx.fillRect(39, -2, 12, 4);
  }
}

function drawBowInHand(progress) {
  const tension = progress > 0 ? Math.sin(Math.min(1, progress) * Math.PI) * 5 : 0;
  ctx.translate(6, 0);
  ctx.strokeStyle = "#273052";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(0, 0, 15, -1.15, 1.15);
  ctx.stroke();
  ctx.strokeStyle = "#9b613f";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, 15, -1.1, 1.1);
  ctx.stroke();
  ctx.strokeStyle = "#fff3d6";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(6, -13);
  ctx.lineTo(-6 - tension, 0);
  ctx.lineTo(6, 13);
  ctx.stroke();
  if (progress > 0) {
    ctx.fillStyle = "#273052";
    ctx.fillRect(-6 - tension, -2, 27 + tension, 4);
    ctx.fillStyle = "#d99b67";
    ctx.fillRect(-5 - tension, -1, 22 + tension, 2);
    ctx.fillStyle = "#e9ffff";
    ctx.beginPath();
    ctx.moveTo(18 + tension, -5);
    ctx.lineTo(27 + tension, 0);
    ctx.lineTo(18 + tension, 5);
    ctx.closePath();
    ctx.fill();
  }
}

function drawStaffInHand(progress) {
  const glow = progress > 0 ? 0.35 + Math.sin(Math.min(1, progress) * Math.PI) * 0.45 : 0.22;
  ctx.translate(7, 0);
  ctx.fillStyle = "#273052";
  ctx.fillRect(-9, -3, 31, 6);
  ctx.fillStyle = "#7d4d38";
  ctx.fillRect(-8, -2, 28, 4);
  ctx.fillStyle = `rgba(85,232,255,${glow})`;
  ctx.fillRect(17, -11, 18, 22);
  ctx.fillStyle = "#273052";
  ctx.fillRect(20, -7, 11, 14);
  ctx.fillStyle = "#55e8ff";
  ctx.fillRect(22, -5, 7, 10);
  ctx.fillStyle = "#e9ffff";
  ctx.fillRect(24, -3, 3, 5);
  if (progress > 0) {
    ctx.fillStyle = "rgba(155,95,199,0.55)";
    ctx.fillRect(32, -4, 14, 8);
    ctx.fillStyle = "rgba(85,232,255,0.75)";
    ctx.fillRect(37, -2, 12, 4);
  }
}

function drawEquippedWeapon() {
  try {
    if (!player || gameOver) return;
    const weaponKey = safeCurrentWeaponKeyForVisual();
    const aim = safeAimForWeaponVisual();
    const progress = getWeaponVisualProgress();
    const angle = getWeaponVisualAngle(aim, weaponKey);
    const centerX = player.x + player.width / 2;
    const centerY = player.y + player.height / 2;
    const handX = centerX + Math.cos(angle) * 8;
    const handY = centerY + Math.sin(angle) * 7 + 3;

    ctx.save();
    ctx.translate(handX, handY);
    ctx.rotate(angle);
    if (Math.cos(angle) < -0.05) ctx.scale(1, -1);

    if (weaponKey === "spear") drawSpearInHand(progress);
    else if (weaponKey === "bow") drawBowInHand(progress || (weaponVisualState.weaponKey === "bow" ? getWeaponVisualProgress() : 0));
    else if (weaponKey === "staff") drawStaffInHand(progress || (weaponVisualState.weaponKey === "staff" ? getWeaponVisualProgress() : 0));
    else drawSwordInHand(progress);

    ctx.restore();
  } catch (error) {
    drawWeaponPatchError("Erro arma: " + (error?.message || error));
  }
}

function drawSwordSwingEffect(attack, progress) {
  const range = attack.range || 48;
  const arc = attack.arc || Math.PI * 0.72;
  const sweep = -arc / 2 + arc * progress;
  ctx.strokeStyle = "rgba(255, 252, 210, 0.86)";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(0, 0, range, sweep - 0.34, sweep + 0.34);
  ctx.stroke();
  ctx.strokeStyle = "rgba(255, 242, 100, 0.42)";
  ctx.lineWidth = 11;
  ctx.beginPath();
  ctx.arc(0, 0, range - 4, sweep - 0.20, sweep + 0.20);
  ctx.stroke();
}

function drawSpearThrustEffect(attack, progress) {
  const range = attack.range || 72;
  const reach = 16 + range * (0.68 + Math.sin(progress * Math.PI) * 0.22);
  ctx.fillStyle = "rgba(233, 255, 255, 0.18)";
  ctx.fillRect(11, -7, reach, 14);
  ctx.strokeStyle = "rgba(85, 232, 255, 0.78)";
  ctx.lineWidth = 3;
  ctx.strokeRect(12, -5, reach, 10);
  ctx.fillStyle = "rgba(255, 242, 100, 0.65)";
  ctx.beginPath();
  ctx.moveTo(12 + reach, -8);
  ctx.lineTo(24 + reach, 0);
  ctx.lineTo(12 + reach, 8);
  ctx.closePath();
  ctx.fill();
}

function drawAttack() {
  try {
    if (attackTimer <= 0 || !currentMeleeAttack) return;
    const centerX = player.x + player.width / 2;
    const centerY = player.y + player.height / 2;
    const progress = 1 - clamp(currentMeleeAttack.timer / Math.max(0.001, currentMeleeAttack.maxTimer || attackTimer), 0, 1);

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(currentMeleeAttack.angle || 0);
    if (currentMeleeAttack.weaponKey === "spear") drawSpearThrustEffect(currentMeleeAttack, progress);
    else drawSwordSwingEffect(currentMeleeAttack, progress);
    ctx.restore();
  } catch (error) {
    drawWeaponPatchError("Erro ataque: " + (error?.message || error));
  }
}

function drawProjectileTrail(obj, color, length = 18) {
  const angle = Math.atan2(obj.vy || 0, obj.vx || 1);
  const cx = obj.x + obj.width / 2;
  const cy = obj.y + obj.height / 2;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  ctx.fillStyle = color;
  ctx.fillRect(-length, -1, length, 2);
  ctx.restore();
}

function drawArrowProjectile(obj) {
  drawProjectileTrail(obj, "rgba(255, 243, 214, 0.45)", 20);
  const angle = Math.atan2(obj.vy || 0, obj.vx || 1);
  ctx.save();
  ctx.translate(obj.x + obj.width / 2, obj.y + obj.height / 2);
  ctx.rotate(angle);
  ctx.fillStyle = "rgba(39, 48, 82, 0.35)";
  ctx.fillRect(-11, -4, 24, 8);
  ctx.fillStyle = "#273052";
  ctx.fillRect(-9, -2, 18, 4);
  ctx.fillStyle = "#d99b67";
  ctx.fillRect(-8, -1, 16, 2);
  ctx.fillStyle = "#e9ffff";
  ctx.beginPath();
  ctx.moveTo(8, -5);
  ctx.lineTo(17, 0);
  ctx.lineTo(8, 5);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#fff3d6";
  ctx.fillRect(-12, -4, 5, 2);
  ctx.fillRect(-12, 2, 5, 2);
  ctx.restore();
}

function drawMagicProjectile(obj) {
  const isFire = obj.type === "fireball" || obj.type === "fire";
  const isRay = obj.type === "blueRay";
  const glow = isFire ? "rgba(255, 79, 98, 0.42)" : isRay ? "rgba(85, 232, 255, 0.46)" : "rgba(155, 95, 199, 0.42)";
  const main = isFire ? "#ff4f62" : isRay ? "#55e8ff" : "#9b5fc7";
  const core = isFire ? "#fff264" : "#e9ffff";
  drawProjectileTrail(obj, glow, isRay ? 26 : 18);
  const cx = obj.x + obj.width / 2;
  const cy = obj.y + obj.height / 2;
  ctx.fillStyle = glow;
  ctx.fillRect(cx - 11, cy - 11, 22, 22);
  ctx.fillStyle = "#273052";
  ctx.fillRect(cx - 6, cy - 6, 12, 12);
  ctx.fillStyle = main;
  ctx.fillRect(cx - 5, cy - 5, 10, 10);
  ctx.fillStyle = core;
  ctx.fillRect(cx - 2, cy - 2, 4, 4);
  if (isRay) {
    ctx.strokeStyle = "rgba(233,255,255,0.8)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 10, cy);
    ctx.lineTo(cx + 10, cy);
    ctx.stroke();
  }
}

function drawProjectiles() {
  try {
    const playerShots = Array.isArray(projectiles) ? projectiles : [];
    for (const obj of playerShots) {
      if (!obj) continue;
      if (obj.type === "arrow") drawArrowProjectile(obj);
      else drawMagicProjectile(obj);
    }

    const enemyShots = Array.isArray(enemyProjectiles) ? enemyProjectiles : [];
    for (const obj of enemyShots) {
      if (!obj) continue;
      if (obj.type === "bossWave") {
        ctx.strokeStyle = "rgba(255, 79, 98, 0.85)";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI * 2);
        ctx.stroke();
        continue;
      }
      if (obj.type === "arrow") drawArrowProjectile(obj);
      else drawMagicProjectile(obj);
    }
  } catch (error) {
    drawWeaponPatchError("Erro projeteis: " + (error?.message || error));
  }
}

function drawWeaponDebugVisual() {
  if (!debugEnabled) return;
  const aim = safeAimForWeaponVisual();
  const centerX = player.x + player.width / 2;
  const centerY = player.y + player.height / 2;
  const key = safeCurrentWeaponKeyForVisual();
  const weapon = safeCurrentWeaponForVisual();

  ctx.save();
  ctx.strokeStyle = "rgba(255, 79, 98, 0.78)";
  ctx.fillStyle = "rgba(255, 79, 98, 0.10)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(centerX + aim.x * 58, centerY + aim.y * 58);
  ctx.stroke();

  if (currentMeleeAttack) {
    ctx.translate(centerX, centerY);
    ctx.rotate(currentMeleeAttack.angle || aim.angle);
    if (currentMeleeAttack.weaponKey === "spear") {
      ctx.fillRect(8, -6, currentMeleeAttack.range || weapon.range || 72, 12);
      ctx.strokeRect(8, -6, currentMeleeAttack.range || weapon.range || 72, 12);
    } else {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, currentMeleeAttack.range || weapon.range || 48, -(currentMeleeAttack.arc || Math.PI * 0.72) / 2, (currentMeleeAttack.arc || Math.PI * 0.72) / 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.translate(-Math.round(camera.x), -Math.round(camera.y));
  }

  ctx.font = "bold 12px Trebuchet MS, Arial";
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(26,31,61,0.88)";
  ctx.fillRect(centerX - 58, centerY - 45, 116, 18);
  ctx.fillStyle = "#fff264";
  ctx.fillText(`Arma: ${weapon.name || key}`, centerX, centerY - 32);
  ctx.textAlign = "start";
  ctx.restore();
}

function drawWeaponPatchError(message) {
  try {
    lastErrorMessage = message;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = "rgba(26, 31, 61, 0.92)";
    ctx.fillRect(12, canvas.height - 46, Math.min(canvas.width - 24, 520), 34);
    ctx.fillStyle = "#ff7ab5";
    ctx.font = "bold 12px Trebuchet MS, Arial";
    ctx.fillText(message, 22, canvas.height - 24);
    ctx.restore();
  } catch (ignored) {
    // Evita tela preta em cascata.
  }
}

if (typeof window !== "undefined" && !window.ETERNAL_RIFT_WEAPON_VISUALS_PATCH) {
  window.ETERNAL_RIFT_WEAPON_VISUALS_PATCH = true;

  const spawnPlayerProjectileBeforeWeaponVisuals = spawnPlayerProjectile;
  spawnPlayerProjectile = function spawnPlayerProjectileVisible(config) {
    const cfg = { ...(config || {}) };
    const vx = Number(cfg.vx || 0);
    const vy = Number(cfg.vy || 0);
    cfg.angle = Number.isFinite(cfg.angle) ? cfg.angle : Math.atan2(vy, vx || 1);
    cfg.age = 0;
    cfg.minVisibleTime = cfg.minVisibleTime || 0.035;
    cfg.width = Math.max(4, Number(cfg.width || 10));
    cfg.height = Math.max(4, Number(cfg.height || 10));
    if (!Number.isFinite(cfg.x)) cfg.x = player.x + player.width / 2 - cfg.width / 2;
    if (!Number.isFinite(cfg.y)) cfg.y = player.y + player.height / 2 - cfg.height / 2;
    spawnPlayerProjectileBeforeWeaponVisuals(cfg);
  };

  const updateProjectilesBeforeWeaponVisuals = updateProjectiles;
  updateProjectiles = function updateProjectilesVisible(delta) {
    const list = Array.isArray(projectiles) ? projectiles : [];
    for (const obj of list) obj.age = Number(obj.age || 0) + delta;
    updateProjectilesBeforeWeaponVisuals(delta);
  };

  const fireWeaponProjectileBeforeWeaponVisuals = fireWeaponProjectile;
  fireWeaponProjectile = function fireWeaponProjectileVisible(weapon, aim) {
    const safeWeapon = weapon || safeCurrentWeaponForVisual();
    const safeAim = aim && Number.isFinite(aim.angle) ? aim : safeAimForWeaponVisual();
    weaponVisualState = {
      timer: safeWeapon.projectile === "arrow" ? 0.22 : 0.32,
      maxTimer: safeWeapon.projectile === "arrow" ? 0.22 : 0.32,
      weaponKey: safeWeapon.projectile === "arrow" ? "bow" : "staff",
      angle: safeAim.angle,
      kind: safeWeapon.projectile || "projectile"
    };
    fireWeaponProjectileBeforeWeaponVisuals(safeWeapon, safeAim);
  };

  const updateAttackBeforeWeaponVisuals = updateAttack;
  updateAttack = function updateAttackWeaponVisuals(delta) {
    weaponVisualState.timer = Math.max(0, Number(weaponVisualState.timer || 0) - delta);
    updateAttackBeforeWeaponVisuals(delta);
  };

  const drawBeforeWeaponVisuals = draw;
  draw = function drawWithEquippedWeapon() {
    try {
      drawBeforeWeaponVisuals();
      ctx.save();
      ctx.translate(-Math.round(camera.x), -Math.round(camera.y));
      drawEquippedWeapon();
      drawWeaponDebugVisual();
      ctx.restore();
    } catch (error) {
      drawWeaponPatchError("Erro visual: " + (error?.message || error));
    }
  };
}


// === Elemental boss swords patch ===
// Quatro espadas inspiradas nas referencias enviadas, desenhadas direto no Canvas.
// Elas so aparecem como recompensa ao abrir o bau do boss correspondente.
const ELEMENTAL_BOSS_SWORDS = {
  miniGuardiao: {
    bossKind: "miniGuardiao",
    weaponKey: "stormSword",
    name: "Espada Celeste da Tempestade",
    shortName: "Tempestade",
    element: "storm",
    damageType: "stormSword",
    bossName: "Mini Guardiao",
    chestTile: [36, 34],
    color: "#55e8ff",
    core: "#fff264",
    dark: "#1f7bd8",
    itemName: "Lamina Celeste da Tempestade"
  },
  reiSlime: {
    bossKind: "reiSlime",
    weaponKey: "fireSword",
    name: "Espada Vulcanica",
    shortName: "Vulcanica",
    element: "fire",
    damageType: "fireSword",
    bossName: "Rei Slime",
    chestTile: [61, 29],
    color: "#ff4f25",
    core: "#fff264",
    dark: "#9b221b",
    itemName: "Lamina Vulcanica"
  },
  serpenteLago: {
    bossKind: "serpenteLago",
    weaponKey: "iceSword",
    name: "Espada Glacial Cristalina",
    shortName: "Glacial",
    element: "ice",
    damageType: "iceSword",
    bossName: "Serpente do Lago",
    chestTile: [70, 23],
    color: "#73d5ff",
    core: "#e9ffff",
    dark: "#1f7bd8",
    itemName: "Lamina Glacial Cristalina"
  },
  bruxoSombrio: {
    bossKind: "bruxoSombrio",
    weaponKey: "shadowSword",
    name: "Espada Sombria Abissal",
    shortName: "Sombria",
    element: "shadow",
    damageType: "shadowSword",
    bossName: "Bruxo Sombrio",
    chestTile: [74, 13],
    color: "#9b5fc7",
    core: "#d9a8ff",
    dark: "#20152f",
    itemName: "Lamina Sombria Abissal"
  }
};

const ELEMENTAL_SWORD_BY_WEAPON = Object.values(ELEMENTAL_BOSS_SWORDS).reduce((acc, reward) => {
  acc[reward.weaponKey] = reward;
  return acc;
}, {});

const ELEMENTAL_SWORD_BY_DAMAGE = Object.values(ELEMENTAL_BOSS_SWORDS).reduce((acc, reward) => {
  acc[reward.damageType] = reward;
  return acc;
}, {});

var elementalSwordEffects = Array.isArray(globalThis.elementalSwordEffects) ? globalThis.elementalSwordEffects : [];
var shadowSwordHealCooldown = Number(globalThis.shadowSwordHealCooldown || 0);

function registerElementalBossSwords() {
  for (const reward of Object.values(ELEMENTAL_BOSS_SWORDS)) {
    if (weapons[reward.weaponKey]) continue;
    weapons[reward.weaponKey] = {
      name: reward.name,
      damage: reward.element === "shadow" ? 7 : 6,
      range: reward.element === "ice" ? 66 : 62,
      cooldown: reward.element === "storm" ? 0.34 : 0.38,
      arc: reward.element === "ice" ? Math.PI * 0.86 : Math.PI * 0.78,
      kind: "melee",
      damageType: reward.damageType,
      elemental: reward.element,
      bossWeapon: true
    };
  }
}

function elementalChestKey(bossKind) {
  return `elementalSword:${bossKind}`;
}

function elementalWeaponAlreadyUnlocked(weaponKey) {
  return Array.isArray(player.unlockedWeapons) && player.unlockedWeapons.includes(weaponKey);
}

function unlockElementalWeapon(weaponKey) {
  if (!weapons[weaponKey]) registerElementalBossSwords();
  if (!Array.isArray(player.unlockedWeapons)) player.unlockedWeapons = ["sword", "bow", "staff", "spear"];
  if (!player.unlockedWeapons.includes(weaponKey)) player.unlockedWeapons.push(weaponKey);
  currentWeaponIndex = player.unlockedWeapons.indexOf(weaponKey);
}

function syncElementalWeaponsFromSave() {
  if (!questBook.openedChests || typeof questBook.openedChests !== "object") questBook.openedChests = {};
  for (const reward of Object.values(ELEMENTAL_BOSS_SWORDS)) {
    if (questBook.openedChests[elementalChestKey(reward.bossKind)]) {
      unlockElementalWeapon(reward.weaponKey);
    }
  }
}

function elementalBossChestFromReward(reward, worldX = null, worldY = null) {
  const x = Number.isFinite(worldX) ? worldX : reward.chestTile[0] * TILE;
  const y = Number.isFinite(worldY) ? worldY : reward.chestTile[1] * TILE + 8;
  return {
    type: "elementalBossChest",
    bossKind: reward.bossKind,
    weaponKey: reward.weaponKey,
    x,
    y,
    width: TILE * 2,
    height: TILE,
    solid: true,
    message: `Bau elemental de ${reward.bossName}: abra para obter ${reward.name}.`,
    opened: false
  };
}

function refreshCurrentObjectListsForElementalChest() {
  if (currentScene === "home") objects = homeObjects;
  else if (currentScene === "shopInterior") objects = shopInteriorObjects;
  else if (currentScene === "mayorInterior") objects = mayorInteriorObjects;
  else if (currentScene === "crystalDimension") objects = crystalDimensionObjects;
  else objects = villageObjects;
  colliders = objects.filter((obj) => obj.solid);
  interactables = objects.filter((obj) => obj.message);
}

function removeElementalChestObject(bossKind) {
  for (let i = villageObjects.length - 1; i >= 0; i--) {
    const obj = villageObjects[i];
    if (obj?.type === "elementalBossChest" && obj.bossKind === bossKind) {
      villageObjects.splice(i, 1);
    }
  }
  refreshCurrentObjectListsForElementalChest();
}

function ensureElementalBossChests() {
  if (!questBook.defeatedBosses || typeof questBook.defeatedBosses !== "object") questBook.defeatedBosses = {};
  if (!questBook.openedChests || typeof questBook.openedChests !== "object") questBook.openedChests = {};

  for (const reward of Object.values(ELEMENTAL_BOSS_SWORDS)) {
    const opened = Boolean(questBook.openedChests[elementalChestKey(reward.bossKind)]);
    const defeated = Boolean(questBook.defeatedBosses[reward.bossKind]);
    const exists = villageObjects.some((obj) => obj?.type === "elementalBossChest" && obj.bossKind === reward.bossKind);
    if (opened) {
      if (exists) removeElementalChestObject(reward.bossKind);
      continue;
    }
    if (defeated && !exists) {
      villageObjects.push(elementalBossChestFromReward(reward));
    }
  }
  refreshCurrentObjectListsForElementalChest();
}

function spawnElementalBossChestForBoss(bossObj) {
  const reward = ELEMENTAL_BOSS_SWORDS[bossObj?.kind];
  if (!reward) return;
  if (questBook.openedChests?.[elementalChestKey(reward.bossKind)]) return;
  const exists = villageObjects.some((obj) => obj?.type === "elementalBossChest" && obj.bossKind === reward.bossKind);
  if (exists) return;
  const chestX = Math.round((bossObj.x + bossObj.width / 2) / TILE) * TILE;
  const chestY = Math.round((bossObj.y + bossObj.height / 2) / TILE) * TILE + 8;
  villageObjects.push(elementalBossChestFromReward(reward, chestX, chestY));
  refreshCurrentObjectListsForElementalChest();
  spawnFloatingText("Bau elemental apareceu!", chestX, chestY - 18, reward.color);
  showHudToast(`Bau de ${reward.shortName} apareceu perto do boss.`);
}

function openElementalBossChest(chestObj) {
  const reward = ELEMENTAL_BOSS_SWORDS[chestObj?.bossKind];
  if (!reward) return "Bau elemental: energia desconhecida.";
  if (!questBook.defeatedBosses?.[reward.bossKind]) {
    return `Bau elemental: derrote ${reward.bossName} para quebrar o selo.`;
  }
  if (!questBook.openedChests || typeof questBook.openedChests !== "object") questBook.openedChests = {};
  const key = elementalChestKey(reward.bossKind);
  if (questBook.openedChests[key] || elementalWeaponAlreadyUnlocked(reward.weaponKey)) {
    removeElementalChestObject(reward.bossKind);
    return `Bau elemental: ${reward.name} ja foi coletada.`;
  }

  questBook.openedChests[key] = true;
  chestObj.opened = true;
  unlockElementalWeapon(reward.weaponKey);
  if (!Array.isArray(inventory.itensBoss)) inventory.itensBoss = [];
  if (!inventory.itensBoss.includes(reward.itemName)) inventory.itensBoss.push(reward.itemName);
  inventory.fragmentos = Number(inventory.fragmentos || 0) + 4;
  player.mana = player.maxMana;
  awardXp(450, `Espada ${reward.shortName}`);
  playSound("chest");
  spawnFloatingText(`Nova arma: ${reward.shortName}!`, chestObj.x, chestObj.y - 22, reward.color);
  showHudToast(`${reward.name} desbloqueada! Use Tab para trocar ou equipe no inventario.`);
  removeElementalChestObject(reward.bossKind);
  updateHud();
  renderInventory();
  return `Bau elemental aberto! Voce recebeu ${reward.name}. Poder: ${getElementalSwordPowerText(reward.weaponKey)}`;
}

function getElementalSwordPowerText(weaponKey) {
  if (weaponKey === "stormSword") return "raios pulam para inimigos proximos.";
  if (weaponKey === "fireSword") return "explosao de fogo e queimadura.";
  if (weaponKey === "iceSword") return "congela e deixa inimigos lentos.";
  if (weaponKey === "shadowSword") return "rouba vida e cria energia sombria.";
  return "energia elemental.";
}

function drawElementalBossChest(obj) {
  const reward = ELEMENTAL_BOSS_SWORDS[obj.bossKind] || ELEMENTAL_BOSS_SWORDS.miniGuardiao;
  const x = obj.x;
  const y = obj.y;
  const pulse = 0.5 + Math.sin(performance.now() / 220) * 0.5;
  drawSoftShadow(x + 2, y + obj.height - 1, obj.width - 2, 6, 0.24);
  ctx.fillStyle = `${reward.color}33`;
  ctx.fillRect(x - 5, y - 8, obj.width + 10, obj.height + 14);
  pixelRect(x, y + 4, obj.width, obj.height - 4, reward.dark);
  ctx.fillStyle = "#273052";
  ctx.fillRect(x + 4, y + 9, obj.width - 8, 4);
  ctx.fillStyle = reward.color;
  ctx.fillRect(x + 8, y + 7, obj.width - 16, 6);
  ctx.fillStyle = reward.core;
  ctx.fillRect(x + obj.width / 2 - 5, y + 13, 10, 10);
  ctx.fillStyle = "#fff3d6";
  ctx.fillRect(x + obj.width / 2 - 2, y + 15, 4, 6);
  ctx.fillStyle = `rgba(255,255,255,${0.18 + pulse * 0.22})`;
  ctx.fillRect(x + 11, y + 5, 13, 2);
  ctx.fillRect(x + obj.width - 24, y + 5, 8, 2);

  ctx.save();
  ctx.translate(x + obj.width / 2, y + 1);
  ctx.rotate(-Math.PI / 2);
  drawMiniElementalSwordSprite(reward.weaponKey, 0.62, true);
  ctx.restore();
}

function drawMiniElementalSwordSprite(weaponKey, scale = 1, chestMode = false) {
  const reward = ELEMENTAL_SWORD_BY_WEAPON[weaponKey] || ELEMENTAL_BOSS_SWORDS.miniGuardiao;
  ctx.save();
  ctx.scale(scale, scale);
  ctx.fillStyle = "rgba(255,255,255,0.10)";
  ctx.fillRect(7, -8, 44, 16);
  ctx.fillStyle = "#20152f";
  ctx.fillRect(-6, -4, 16, 8);
  ctx.fillStyle = "#7d4d38";
  ctx.fillRect(-5, -2, 15, 4);
  ctx.fillStyle = "#f5ce79";
  ctx.fillRect(8, -8, 5, 16);
  ctx.fillRect(3, -7, 5, 4);
  ctx.fillRect(3, 3, 5, 4);
  ctx.fillStyle = reward.dark;
  ctx.beginPath();
  ctx.moveTo(12, -9);
  ctx.lineTo(48, -6);
  ctx.lineTo(60, 0);
  ctx.lineTo(48, 6);
  ctx.lineTo(12, 9);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = reward.color;
  ctx.beginPath();
  ctx.moveTo(14, -6);
  ctx.lineTo(47, -4);
  ctx.lineTo(56, 0);
  ctx.lineTo(47, 4);
  ctx.lineTo(14, 6);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = reward.core;
  ctx.fillRect(18, -2, 28, 4);

  if (reward.element === "fire") {
    ctx.fillStyle = "rgba(255, 242, 100, 0.85)";
    ctx.fillRect(25, -7, 4, 14);
    ctx.fillRect(35, -8, 4, 16);
    ctx.fillStyle = "#ff8d4a";
    ctx.fillRect(31, -10, 4, 5);
    ctx.fillRect(42, 5, 4, 5);
  } else if (reward.element === "ice") {
    ctx.fillStyle = "rgba(233, 255, 255, 0.90)";
    ctx.fillRect(17, -8, 4, 16);
    ctx.fillRect(31, -8, 4, 16);
    ctx.fillRect(45, -4, 6, 8);
  } else if (reward.element === "shadow") {
    ctx.fillStyle = "rgba(32, 21, 47, 0.82)";
    ctx.fillRect(22, -4, 21, 8);
    ctx.fillStyle = "#d9a8ff";
    ctx.fillRect(26, -1, 15, 2);
  } else {
    ctx.fillStyle = "#fff264";
    ctx.fillRect(23, -5, 3, 10);
    ctx.fillRect(34, -5, 3, 10);
    ctx.fillStyle = "#e9ffff";
    ctx.fillRect(28, -7, 3, 14);
  }

  if (!chestMode) {
    const spark = Math.sin(performance.now() / 120) > 0 ? 1 : 0;
    ctx.fillStyle = reward.element === "shadow" ? "rgba(155,95,199,.7)" : `${reward.core}cc`;
    ctx.fillRect(54, -10 + spark, 3, 3);
    ctx.fillRect(39, 9 - spark, 2, 2);
  }
  ctx.restore();
}

function drawElementalSwordInHand(weaponKey, progress = 0) {
  const reward = ELEMENTAL_SWORD_BY_WEAPON[weaponKey] || ELEMENTAL_BOSS_SWORDS.miniGuardiao;
  const thrust = progress > 0 ? Math.sin(Math.min(1, progress) * Math.PI) * 7 : 0;
  ctx.save();
  ctx.translate(7 + thrust, 0);
  drawMiniElementalSwordSprite(weaponKey, 0.58, false);
  ctx.restore();

  if (progress > 0) {
    ctx.fillStyle = `${reward.color}55`;
    ctx.fillRect(34 + thrust, -12, 18, 24);
  }
}

function drawElementalSwordSwingEffect(attack, progress) {
  const reward = ELEMENTAL_SWORD_BY_WEAPON[attack.weaponKey] || ELEMENTAL_BOSS_SWORDS.miniGuardiao;
  const range = attack.range || 62;
  const arc = attack.arc || Math.PI * 0.78;
  const sweep = -arc / 2 + arc * progress;
  ctx.strokeStyle = `${reward.color}dd`;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(0, 0, range, sweep - 0.38, sweep + 0.38);
  ctx.stroke();
  ctx.strokeStyle = `${reward.core}99`;
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.arc(0, 0, range - 5, sweep - 0.18, sweep + 0.18);
  ctx.stroke();

  if (reward.element === "fire") {
    ctx.fillStyle = "rgba(255, 79, 37, 0.32)";
    ctx.beginPath();
    ctx.arc(range * 0.72, 0, 16 + Math.sin(progress * Math.PI) * 8, 0, Math.PI * 2);
    ctx.fill();
  } else if (reward.element === "ice") {
    ctx.fillStyle = "rgba(233, 255, 255, 0.38)";
    ctx.fillRect(range * 0.45, -10, 8, 20);
    ctx.fillRect(range * 0.70, -8, 6, 16);
  } else if (reward.element === "shadow") {
    ctx.strokeStyle = "rgba(155, 95, 199, 0.50)";
    ctx.lineWidth = 17;
    ctx.beginPath();
    ctx.arc(0, 0, range - 12, sweep - 0.12, sweep + 0.12);
    ctx.stroke();
  } else {
    ctx.strokeStyle = "rgba(233, 255, 255, 0.78)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(range * 0.42, -14);
    ctx.lineTo(range * 0.55, 0);
    ctx.lineTo(range * 0.44, 14);
    ctx.lineTo(range * 0.68, -2);
    ctx.stroke();
  }
}

function addElementalEffect(kind, x, y, color, core = "#fff3d6", radius = 40) {
  elementalSwordEffects.push({ kind, x, y, color, core, radius, timer: 0.42, maxTimer: 0.42 });
}

function directElementalDamage(enemyObj, amount, label, color) {
  if (!enemyObj || enemyObj.type !== "enemy" || !enemyObj.alive) return false;
  enemyObj.hp -= amount;
  spawnFloatingText(`${label} -${amount}`, enemyObj.x + enemyObj.width / 2, enemyObj.y - 12, color);
  if (enemyObj.hp <= 0) defeatEnemy(enemyObj);
  return true;
}

function applyElementalSwordEffect(target, reward) {
  if (!target || !target.alive || !reward) return;
  const tx = target.x + target.width / 2;
  const ty = target.y + target.height / 2;

  if (reward.element === "storm") {
    addElementalEffect("storm", tx, ty, reward.color, reward.core, 48);
    const nearby = villageObjects
      .filter((obj) => obj.type === "enemy" && obj.alive && obj !== target)
      .map((obj) => ({ obj, d: Math.hypot(obj.x + obj.width / 2 - tx, obj.y + obj.height / 2 - ty) }))
      .filter((entry) => entry.d < 115)
      .sort((a, b) => a.d - b.d)
      .slice(0, 2);
    for (const entry of nearby) {
      directElementalDamage(entry.obj, 2, "RAIO", reward.color);
      addElementalEffect("chain", entry.obj.x + entry.obj.width / 2, entry.obj.y + entry.obj.height / 2, reward.color, reward.core, 34);
    }
    return;
  }

  if (reward.element === "fire") {
    addElementalEffect("fire", tx, ty, reward.color, reward.core, 58);
    target.burnTimer = Math.max(Number(target.burnTimer || 0), 2.2);
    target.burnTick = Math.min(Number(target.burnTick || 0), 0.1);
    for (const obj of villageObjects) {
      if (obj.type !== "enemy" || !obj.alive || obj === target) continue;
      const d = Math.hypot(obj.x + obj.width / 2 - tx, obj.y + obj.height / 2 - ty);
      if (d < 58) directElementalDamage(obj, 2, "FOGO", reward.color);
    }
    return;
  }

  if (reward.element === "ice") {
    addElementalEffect("ice", tx, ty, reward.color, reward.core, 46);
    target.freezeTimer = Math.max(Number(target.freezeTimer || 0), 2.0);
    target.attackCooldown = Math.max(target.attackCooldown || 0, 0.65);
    spawnFloatingText("LENTO", tx, ty - 22, reward.core);
    return;
  }

  if (reward.element === "shadow") {
    addElementalEffect("shadow", tx, ty, reward.color, reward.core, 44);
    target.shadowMarkTimer = Math.max(Number(target.shadowMarkTimer || 0), 2.4);
    if (shadowSwordHealCooldown <= 0 && player.health < player.maxHealth) {
      player.health = Math.min(player.maxHealth, player.health + 1);
      shadowSwordHealCooldown = 1.7;
      spawnFloatingText("+1 vida", player.x + player.width / 2, player.y - 16, reward.color);
      updateHud();
    }
  }
}

function drawElementalSwordEffects() {
  for (const fx of elementalSwordEffects) {
    const progress = 1 - clamp(fx.timer / Math.max(0.001, fx.maxTimer), 0, 1);
    const alpha = clamp(fx.timer / Math.max(0.001, fx.maxTimer), 0, 1);
    const radius = fx.radius * (0.35 + progress * 0.9);
    ctx.save();
    ctx.globalAlpha = alpha;
    if (fx.kind === "fire") {
      ctx.fillStyle = "rgba(255, 79, 37, 0.30)";
      ctx.beginPath();
      ctx.arc(fx.x, fx.y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = fx.core;
      ctx.fillRect(fx.x - 5, fx.y - radius * 0.55, 10, radius * 0.7);
    } else if (fx.kind === "ice") {
      ctx.strokeStyle = fx.core;
      ctx.lineWidth = 3;
      ctx.strokeRect(fx.x - radius / 2, fx.y - radius / 2, radius, radius);
      ctx.fillStyle = `${fx.color}88`;
      ctx.fillRect(fx.x - 4, fx.y - radius / 2 - 6, 8, 12);
      ctx.fillRect(fx.x + radius / 2 - 6, fx.y - 4, 12, 8);
    } else if (fx.kind === "shadow") {
      ctx.strokeStyle = fx.color;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(fx.x, fx.y, radius * 0.75, progress * Math.PI * 2, progress * Math.PI * 2 + Math.PI * 1.35);
      ctx.stroke();
      ctx.fillStyle = "rgba(32, 21, 47, 0.45)";
      ctx.fillRect(fx.x - radius / 2, fx.y - radius / 2, radius, radius);
    } else {
      ctx.strokeStyle = fx.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(fx.x - radius * 0.55, fx.y - radius * 0.2);
      ctx.lineTo(fx.x - radius * 0.15, fx.y + radius * 0.05);
      ctx.lineTo(fx.x + radius * 0.08, fx.y - radius * 0.35);
      ctx.lineTo(fx.x + radius * 0.28, fx.y + radius * 0.32);
      ctx.lineTo(fx.x + radius * 0.58, fx.y - radius * 0.05);
      ctx.stroke();
      ctx.fillStyle = fx.core;
      ctx.fillRect(fx.x - 2, fx.y - 2, 4, 4);
    }
    ctx.restore();
  }
}

function drawElementalEnemyStatus(obj) {
  if (!obj || obj.type !== "enemy" || !obj.alive) return;
  const cx = obj.x + obj.width / 2;
  const cy = obj.y + obj.height / 2;
  if (obj.freezeTimer > 0) {
    ctx.strokeStyle = "rgba(233, 255, 255, 0.74)";
    ctx.lineWidth = 2;
    ctx.strokeRect(obj.x - 3, obj.y - 4, obj.width + 6, obj.height + 8);
  }
  if (obj.burnTimer > 0) {
    ctx.fillStyle = "rgba(255, 79, 37, 0.62)";
    ctx.fillRect(cx - 3, obj.y - 8, 6, 8);
    ctx.fillStyle = "rgba(255, 242, 100, 0.72)";
    ctx.fillRect(cx - 1, obj.y - 11, 3, 5);
  }
  if (obj.shadowMarkTimer > 0) {
    ctx.strokeStyle = "rgba(155, 95, 199, 0.70)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, Math.max(obj.width, obj.height) / 2 + 6, 0, Math.PI * 2);
    ctx.stroke();
  }
}

if (typeof window !== "undefined" && !window.ETERNAL_RIFT_ELEMENTAL_BOSS_SWORDS_PATCH) {
  window.ETERNAL_RIFT_ELEMENTAL_BOSS_SWORDS_PATCH = true;
  registerElementalBossSwords();
  syncElementalWeaponsFromSave();
  ensureElementalBossChests();

  const getWeaponDescriptionBeforeElementalSwords = getWeaponDescription;
  getWeaponDescription = function getWeaponDescriptionElemental(weaponKey) {
    if (ELEMENTAL_SWORD_BY_WEAPON[weaponKey]) {
      const reward = ELEMENTAL_SWORD_BY_WEAPON[weaponKey];
      return `${reward.name}: ${getElementalSwordPowerText(weaponKey)} So pode ser obtida abrindo o bau do boss ${reward.bossName}.`;
    }
    return getWeaponDescriptionBeforeElementalSwords(weaponKey);
  };

  const defeatEnemyBeforeElementalSwords = defeatEnemy;
  defeatEnemy = function defeatEnemyElementalBossChest(obj) {
    const wasBoss = Boolean(obj?.boss);
    const bossKind = obj?.kind;
    defeatEnemyBeforeElementalSwords(obj);
    if (wasBoss && ELEMENTAL_BOSS_SWORDS[bossKind]) {
      spawnElementalBossChestForBoss(obj);
    }
  };

  const getQuestMessageBeforeElementalSwords = getQuestMessage;
  getQuestMessage = function getQuestMessageElementalChest(npcObj) {
    if (npcObj?.type === "elementalBossChest") return openElementalBossChest(npcObj);
    return getQuestMessageBeforeElementalSwords(npcObj);
  };

  const drawObjectBeforeElementalSwords = drawObject;
  drawObject = function drawObjectElementalBossChest(obj) {
    if (obj?.type === "elementalBossChest") return drawElementalBossChest(obj);
    return drawObjectBeforeElementalSwords(obj);
  };

  const drawEquippedWeaponBeforeElementalSwords = drawEquippedWeapon;
  drawEquippedWeapon = function drawEquippedWeaponElementalSwords() {
    const weaponKey = safeCurrentWeaponKeyForVisual();
    if (!ELEMENTAL_SWORD_BY_WEAPON[weaponKey]) return drawEquippedWeaponBeforeElementalSwords();
    try {
      const aim = safeAimForWeaponVisual();
      const progress = getWeaponVisualProgress();
      const angle = getWeaponVisualAngle(aim, weaponKey);
      const centerX = player.x + player.width / 2;
      const centerY = player.y + player.height / 2;
      const handX = centerX + Math.cos(angle) * 8;
      const handY = centerY + Math.sin(angle) * 7 + 3;
      ctx.save();
      ctx.translate(handX, handY);
      ctx.rotate(angle);
      if (Math.cos(angle) < -0.05) ctx.scale(1, -1);
      drawElementalSwordInHand(weaponKey, progress);
      ctx.restore();
    } catch (error) {
      drawWeaponPatchError("Erro espada elemental: " + (error?.message || error));
    }
  };

  const drawAttackBeforeElementalSwords = drawAttack;
  drawAttack = function drawAttackElementalSwords() {
    if (!currentMeleeAttack || !ELEMENTAL_SWORD_BY_WEAPON[currentMeleeAttack.weaponKey]) return drawAttackBeforeElementalSwords();
    try {
      const centerX = player.x + player.width / 2;
      const centerY = player.y + player.height / 2;
      const progress = 1 - clamp(currentMeleeAttack.timer / Math.max(0.001, currentMeleeAttack.maxTimer || attackTimer), 0, 1);
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(currentMeleeAttack.angle || 0);
      drawElementalSwordSwingEffect(currentMeleeAttack, progress);
      ctx.restore();
    } catch (error) {
      drawWeaponPatchError("Erro ataque elemental: " + (error?.message || error));
    }
  };

  const damageEnemyBeforeElementalSwords = damageEnemy;
  damageEnemy = function damageEnemyElementalSwords(obj, amount, sourceX, sourceY, knockbackPower = 170, damageType = "fisico") {
    const reward = ELEMENTAL_SWORD_BY_DAMAGE[damageType];
    const ok = damageEnemyBeforeElementalSwords(obj, amount, sourceX, sourceY, knockbackPower, damageType);
    if (ok && reward && obj?.alive) applyElementalSwordEffect(obj, reward);
    return ok;
  };

  const updateEnemiesBeforeElementalSwords = updateEnemies;
  updateEnemies = function updateEnemiesElementalStatuses(delta) {
    shadowSwordHealCooldown = Math.max(0, shadowSwordHealCooldown - delta);
    for (const obj of villageObjects) {
      if (obj?.type !== "enemy" || !obj.alive) continue;
      obj.freezeTimer = Math.max(0, Number(obj.freezeTimer || 0) - delta);
      obj.shadowMarkTimer = Math.max(0, Number(obj.shadowMarkTimer || 0) - delta);
      if (obj.burnTimer > 0) {
        obj.burnTimer = Math.max(0, Number(obj.burnTimer || 0) - delta);
        obj.burnTick = Math.max(0, Number(obj.burnTick || 0) - delta);
        if (obj.burnTick <= 0) {
          obj.burnTick = 0.65;
          directElementalDamage(obj, 1, "QUEIMA", "#ff8d4a");
        }
      }
    }
    updateEnemiesBeforeElementalSwords(delta);
  };

  const moveEnemyTowardBeforeElementalSwords = moveEnemyToward;
  moveEnemyToward = function moveEnemyTowardElementalSlow(obj, dx, dy, delta, speedMultiplier = 1) {
    const freezeSlow = obj?.freezeTimer > 0 ? 0.38 : 1;
    const shadowSlow = obj?.shadowMarkTimer > 0 ? 0.78 : 1;
    return moveEnemyTowardBeforeElementalSwords(obj, dx, dy, delta, speedMultiplier * freezeSlow * shadowSlow);
  };

  const drawEnemyBeforeElementalSwords = drawEnemy;
  drawEnemy = function drawEnemyElementalStatus(obj) {
    drawEnemyBeforeElementalSwords(obj);
    drawElementalEnemyStatus(obj);
  };

  const updateAttackBeforeElementalSwords = updateAttack;
  updateAttack = function updateAttackElementalEffects(delta) {
    for (let i = elementalSwordEffects.length - 1; i >= 0; i--) {
      elementalSwordEffects[i].timer -= delta;
      if (elementalSwordEffects[i].timer <= 0) elementalSwordEffects.splice(i, 1);
    }
    updateAttackBeforeElementalSwords(delta);
  };

  const drawBeforeElementalSwords = draw;
  draw = function drawWithElementalSwordEffects() {
    drawBeforeElementalSwords();
    try {
      ctx.save();
      ctx.translate(-Math.round(camera.x), -Math.round(camera.y));
      drawElementalSwordEffects();
      ctx.restore();
    } catch (error) {
      drawWeaponPatchError("Erro efeitos elementais: " + (error?.message || error));
    }
  };

  const loadGameBeforeElementalSwords = loadGame;
  loadGame = function loadGameElementalSwords() {
    const ok = loadGameBeforeElementalSwords();
    registerElementalBossSwords();
    syncElementalWeaponsFromSave();
    ensureElementalBossChests();
    return ok;
  };

  renderInventory();
  updateHud();
}


// === Elemental sword inventory icon patch ===
if (typeof window !== "undefined" && !window.ETERNAL_RIFT_ELEMENTAL_SWORD_INVENTORY_ICONS_PATCH) {
  window.ETERNAL_RIFT_ELEMENTAL_SWORD_INVENTORY_ICONS_PATCH = true;

  function elementalSwordInventoryIconHtml(weaponKey) {
    const reward = ELEMENTAL_SWORD_BY_WEAPON[weaponKey] || ELEMENTAL_BOSS_SWORDS.miniGuardiao;
    return `<span class="inventory-icon-wrap"><svg class="inventory-art" viewBox="0 0 32 32" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 3 22 9 19 23 16 29 13 23 10 9z" fill="${reward.color}" stroke="#273052" stroke-width="2"/>
      <path d="M16 5v20" stroke="${reward.core}" stroke-width="2"/>
      <path d="M10 18h12l-3 4h-6z" fill="#f5ce79" stroke="#5c413c" stroke-width="1.5"/>
      <rect x="14" y="22" width="4" height="7" fill="#7d4d38" stroke="#273052" stroke-width="1"/>
      <rect x="14" y="16" width="4" height="4" fill="${reward.core}"/>
      <path d="M8 12h3M21 12h3M9 25h4M19 25h4" stroke="${reward.color}" stroke-width="2" opacity=".9"/>
    </svg></span>`;
  }

  const renderInventoryGridBeforeElementalSwordIcons = renderInventoryGrid;
  renderInventoryGrid = function renderInventoryGridElementalSwordIcons(filteredItems, totalItems) {
    renderInventoryGridBeforeElementalSwordIcons(filteredItems, totalItems);
    if (!inventoryGrid) return;
    for (const item of filteredItems || []) {
      if (!item?.weaponKey || !ELEMENTAL_SWORD_BY_WEAPON[item.weaponKey]) continue;
      const safeId = typeof CSS !== "undefined" && CSS.escape ? CSS.escape(item.id) : String(item.id).replace(/"/g, '\\"');
      const slot = inventoryGrid.querySelector(`[data-item-id="${safeId}"] .item-icon`);
      if (slot) slot.innerHTML = elementalSwordInventoryIconHtml(item.weaponKey);
    }
  };

  const renderItemDetailsBeforeElementalSwordIcons = renderItemDetails;
  renderItemDetails = function renderItemDetailsElementalSwordIcons(item) {
    renderItemDetailsBeforeElementalSwordIcons(item);
    if (!item?.weaponKey || !ELEMENTAL_SWORD_BY_WEAPON[item.weaponKey] || !itemDetailName) return;
    itemDetailName.innerHTML = `<span class="item-detail-icon-preview">${elementalSwordInventoryIconHtml(item.weaponKey)}</span><span>${item.name}</span>`;
  };
}


// === Reference texture patch inspired by provided village screenshot ===
if (typeof window !== "undefined" && !window.ETERNAL_RIFT_REFERENCE_TEXTURE_PATCH) {
  window.ETERNAL_RIFT_REFERENCE_TEXTURE_PATCH = true;

  function refGrassBlade(x, y, ox, oy, color) {
    fillPixelV2(x + ox, y + oy, 2, 8, color);
    fillPixelV2(x + ox + 2, y + oy - 3, 2, 6, color);
    fillPixelV2(x + ox + 4, y + oy + 1, 2, 6, color);
  }

  drawGrass = function drawGrassReferenceTexture(x, y, tileX, tileY) {
    const h = visualHashV2(tileX, tileY, 301);
    const base = h < 0.28 ? "#78c44b" : h < 0.62 ? "#6eb847" : "#84ce56";
    fillPixelV2(x, y, TILE, TILE, base);
    fillPixelV2(x, y + 26, TILE, 6, "rgba(49, 111, 45, 0.16)");
    fillPixelV2(x + 3, y + 3, 8, 3, "rgba(184, 235, 132, 0.22)");
    if (visualHashV2(tileX, tileY, 302) > 0.36) refGrassBlade(x, y, 5, 18, "#2e8746");
    if (visualHashV2(tileX, tileY, 303) > 0.53) refGrassBlade(x, y, 21, 11, "#3e9c56");
    if (visualHashV2(tileX, tileY, 304) > 0.72) fillPixelV2(x + 15, y + 8, 3, 3, "#9fe16e");
    if (visualHashV2(tileX, tileY, 305) > 0.78) {
      fillPixelV2(x + 10, y + 13, 2, 2, "#fff3d6");
      fillPixelV2(x + 13, y + 12, 2, 2, "#55c4ff");
    }
  };

  drawDirt = function drawDirtReferenceTexture(x, y, tileX, tileY) {
    const warm = (tileX + tileY) % 2 === 0;
    fillPixelV2(x, y, TILE, TILE, warm ? "#9f683a" : "#8f5d33");
    fillPixelV2(x, y + 25, TILE, 7, "rgba(63, 38, 24, 0.16)");
    fillPixelV2(x + 4, y + 5, 7, 3, "rgba(201, 145, 90, 0.24)");
    if (visualHashV2(tileX, tileY, 311) > 0.18) fillPixelV2(x + 19, y + 9, 5, 4, "#cbb8a3");
    if (visualHashV2(tileX, tileY, 312) > 0.38) fillPixelV2(x + 7, y + 19, 4, 3, "#d9cab8");
    if (visualHashV2(tileX, tileY, 313) > 0.57) fillPixelV2(x + 23, y + 20, 3, 2, "#6f4728");
    if (visualHashV2(tileX, tileY, 314) > 0.75) fillPixelV2(x + 13, y + 14, 3, 2, "#efe0bb");
  };

  drawPlaza = function drawPlazaReferenceTexture(x, y, tileX, tileY) {
    const base = (tileX + tileY) % 2 === 0 ? "#e8cb97" : "#dfbf87";
    fillPixelV2(x, y, TILE, TILE, base);
    ctx.strokeStyle = "rgba(114, 91, 70, 0.55)";
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 0.5, y + 0.5, TILE - 1, TILE - 1);
    fillPixelV2(x + 2, y + 2, TILE - 4, 2, "rgba(255, 245, 220, 0.18)");
    fillPixelV2(x + 2, y + 28, TILE - 4, 1, "rgba(112, 90, 68, 0.20)");
    if ((tileX + tileY) % 3 === 0) fillPixelV2(x + 11, y + 11, 6, 4, "rgba(255, 239, 165, 0.16)");
    if ((tileX * 2 + tileY) % 5 === 0) fillPixelV2(x + 23, y + 20, 4, 3, "rgba(123, 112, 88, 0.16)");
  };

  drawWater = function drawWaterReferenceTexture(x, y, tileX, tileY) {
    const t = performance.now() / 500;
    const waveA = Math.sin(t + tileX * 0.6 + tileY * 0.3) * 2;
    const waveB = Math.cos(t * 0.8 + tileX * 0.45) * 2;
    fillPixelV2(x, y, TILE, TILE, (tileX + tileY) % 2 === 0 ? "#4499dd" : "#3a8cd0");
    fillPixelV2(x, y + 25, TILE, 7, "rgba(16, 68, 128, 0.30)");
    fillPixelV2(x + 4, y + 10 + waveA, 10, 2, "rgba(210, 246, 255, 0.82)");
    fillPixelV2(x + 17, y + 18 - waveB, 10, 2, "rgba(125, 226, 255, 0.76)");
    if (visualHashV2(tileX, tileY, 321) > 0.65) fillPixelV2(x + 11, y + 23, 5, 2, "rgba(234,255,255,0.34)");
  };

  function drawReferenceRoof(x, y, width, roofColor) {
    fillPixelV2(x - 8, y + 14, width + 16, 34, "#29324d");
    fillPixelV2(x - 4, y + 17, width + 8, 27, roofColor);
    for (let rx = x - 1; rx < x + width; rx += 14) {
      fillPixelV2(rx, y + 20, 10, 5, "rgba(255,255,255,0.16)");
      fillPixelV2(rx + 1, y + 28, 11, 4, "rgba(34,39,63,0.16)");
      fillPixelV2(rx, y + 36, 10, 4, "rgba(255,255,255,0.08)");
    }
    fillPixelV2(x - 4, y + 42, width + 8, 5, "rgba(31, 25, 40, 0.28)");
  }

  function drawReferenceWindow(x, y, warm = false) {
    outlinePixelV2(x, y, 24, 22, warm ? "#ffd46d" : "#73d5ff", "#3a2630");
    fillPixelV2(x + 4, y + 4, 8, 6, warm ? "#fff1a7" : "#e9ffff");
    fillPixelV2(x + 13, y + 4, 2, 15, "#3a2630");
    fillPixelV2(x + 4, y + 11, 17, 2, "#3a2630");
  }

  function drawReferenceFlowerBox(x, y) {
    fillPixelV2(x, y + 7, 30, 7, "#8a5b3f");
    fillPixelV2(x + 3, y + 4, 5, 5, "#ff7ab5");
    fillPixelV2(x + 11, y + 2, 5, 6, "#fff264");
    fillPixelV2(x + 20, y + 4, 5, 5, "#6ddc77");
    fillPixelV2(x + 4, y + 10, 2, 4, "#26794d");
    fillPixelV2(x + 12, y + 9, 2, 5, "#26794d");
    fillPixelV2(x + 21, y + 10, 2, 4, "#26794d");
  }

  function drawReferenceDoor(x, y) {
    outlinePixelV2(x, y, 24, 32, "#98613f", "#3a2630");
    fillPixelV2(x + 4, y + 4, 16, 24, "#8c5639");
    fillPixelV2(x + 10, y + 3, 5, 4, "rgba(255,255,255,0.12)");
    fillPixelV2(x + 17, y + 16, 3, 3, "#f5ce79");
  }

  drawHouse = function drawHouseReferenceTexture(obj) {
    const x = obj.x;
    const y = obj.y;
    const variant = visualHashV2(Math.floor(x / TILE), Math.floor(y / TILE), obj.title?.length || 1);
    const roofColor = variant < 0.33 ? "#3e82de" : variant < 0.66 ? "#d04d57" : "#b87435";
    drawSoftShadow(x + 8, y + 88, obj.width - 4, 10, 0.26);
    outlinePixelV2(x + 7, y + 40, obj.width - 14, 52, "#f0e7d6", "#394066");
    fillPixelV2(x + 10, y + 44, obj.width - 20, 42, "#efe5d2");
    for (let yy = y + 50; yy < y + 82; yy += 11) fillPixelV2(x + 12, yy, obj.width - 24, 2, "rgba(135, 116, 97, 0.12)");
    fillPixelV2(x + 12, y + 46, 32, 4, "rgba(255,255,255,0.22)");
    drawReferenceRoof(x, y, obj.width, roofColor);
    if (variant > 0.68) {
      outlinePixelV2(x + 86, y + 5, 16, 26, "#a06b48", "#394066");
      fillPixelV2(x + 90, y + 8, 8, 5, "#f3c77a");
    }
    drawReferenceDoor(x + 24, y + 60);
    drawReferenceWindow(x + 70, y + 55, true);
    drawReferenceFlowerBox(x + 67, y + 76);
    if (obj.width > 96) {
      drawReferenceWindow(x + 8, y + 55, false);
      drawReferenceFlowerBox(x + 5, y + 76);
    }
    fillPixelV2(x + 27, y + 90, 18, 3, "rgba(35,31,42,0.26)");
  };

  drawPlayerHouse = function drawPlayerHouseReferenceTexture(obj) {
    const x = obj.x;
    const y = obj.y;
    drawSoftShadow(x + 10, y + 90, obj.width - 6, 10, 0.28);
    outlinePixelV2(x + 8, y + 42, obj.width - 16, 56, "#f0e7d6", "#394066");
    fillPixelV2(x + 12, y + 46, obj.width - 24, 46, "#efe5d2");
    drawReferenceRoof(x, y, obj.width, "#357bdb");
    outlinePixelV2(x + 84, y + 7, 18, 28, "#7d4d38", "#394066");
    fillPixelV2(x + 89, y + 11, 8, 5, "#f3c77a");
    drawReferenceDoor(x + 42, y + 62);
    drawReferenceWindow(x + 12, y + 58, true);
    drawReferenceWindow(x + 78, y + 58, true);
    drawReferenceFlowerBox(x + 9, y + 79);
    drawReferenceFlowerBox(x + 75, y + 79);
    fillPixelV2(x + 28, y + 95, 58, 4, "rgba(35,31,42,0.26)");
  };

  drawVillageGroundDetailsV2 = function drawVillageGroundDetailsReference() {
    const details = [
      [28.5, 20.4, "flowerBlue"], [35.2, 20.4, "flowerPink"], [41.2, 20.6, "flowerYellow"],
      [24.2, 27.8, "flowerBlue"], [43.6, 27.8, "flowerPink"], [32.0, 30.2, "flowerYellow"],
      [22.1, 23.0, "stoneBits"], [45.4, 23.6, "stoneBits"], [18.6, 33.0, "grassPatch"],
      [50.6, 34.0, "grassPatch"], [58.8, 27.0, "reed"], [64.8, 24.6, "reed"],
      [66.0, 23.0, "waterLily"], [36.0, 33.2, "grassPatch"], [12.0, 12.0, "flowerBlue"],
      [48.4, 10.4, "flowerPink"], [9.2, 40.5, "flowerYellow"], [71.2, 19.8, "flowerBlue"]
    ];
    for (const [tx, ty, kind] of details) {
      const x = tx * TILE;
      const y = ty * TILE;
      if (x < camera.x - 48 || x > camera.x + canvas.width + 48 || y < camera.y - 48 || y > camera.y + canvas.height + 48) continue;
      if (kind === "flowerBlue") drawTinyFlowerPatchV2(x, y, "#55c4ff");
      if (kind === "flowerPink") drawTinyFlowerPatchV2(x, y, "#ff7ab5");
      if (kind === "flowerYellow") drawTinyFlowerPatchV2(x, y, "#fff264");
      if (kind === "stoneBits") drawStoneBitsV2(x, y);
      if (kind === "grassPatch") drawGrassPatchV2(x, y);
      if (kind === "reed") drawReedsV2(x, y);
      if (kind === "waterLily") drawWaterLilyV2(x, y);
    }
  };
}


// === Autosave and future-proof save patch ===
if (typeof window !== "undefined" && !window.ETERNAL_RIFT_AUTOSAVE_FUTURE_PATCH) {
  window.ETERNAL_RIFT_AUTOSAVE_FUTURE_PATCH = true;

  const AUTOSAVE_BACKUP_KEY = `${SAVE_KEY}-backup`;
  let lastAutoSaveAt = 0;
  let autosaveTimerId = 0;

  function safePlainClone(value, fallback = null) {
    try {
      if (typeof structuredClone === "function") return structuredClone(value);
    } catch (error) {
      // Cai para JSON abaixo.
    }

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (error) {
      return fallback;
    }
  }

  function getSerializableWeaponsSnapshot() {
    const snapshot = {};
    for (const [key, weapon] of Object.entries(weapons || {})) {
      if (!weapon || typeof weapon !== "object") continue;
      const plainWeapon = safePlainClone(weapon, null);
      if (!plainWeapon) continue;
      snapshot[key] = plainWeapon;
    }
    return snapshot;
  }

  function getFutureSaveState() {
    return {
      version: 2,
      savedAt: Date.now(),
      reason: "future-proof-save",
      player: safePlainClone(player, {}),
      inventory: safePlainClone(inventory, {}),
      quest: safePlainClone(quest, {}),
      questBook: safePlainClone(questBook, {}),
      dimensionQuest: safePlainClone(dimensionQuest, {}),
      activePowerUps: safePlainClone(activePowerUps, {}),
      unlockedWeapons: Array.isArray(player.unlockedWeapons) ? [...player.unlockedWeapons] : ["sword"],
      currentWeaponKey: typeof getCurrentWeaponKey === "function" ? getCurrentWeaponKey() : "sword",
      equippedPower,
      weapons: getSerializableWeaponsSnapshot(),
      openedChests: safePlainClone(questBook.openedChests || {}, {}),
      defeatedBosses: safePlainClone(questBook.defeatedBosses || {}, {}),
      collectedBossItems: safePlainClone(inventory.itensBoss || [], [])
    };
  }

  function buildSaveSnapshotFuture() {
    syncDimensionQuestState();
    normalizeLevelState();

    return {
      scene: currentScene,
      player: {
        name: getPlayerDisplayName(),
        x: player.x,
        y: player.y,
        level: player.level,
        xp: player.xp,
        xpToNextLevel: player.xpToNextLevel,
        maxLevel: player.maxLevel,
        totalXp: player.totalXp,
        skillPoints: player.skillPoints,
        damageBonus: player.damageBonus,
        speed: player.speed,
        baseSpeed: player.baseSpeed,
        defense: player.defense,
        health: player.health,
        maxHealth: player.maxHealth,
        mana: player.mana,
        maxMana: player.maxMana,
        oxygen: player.oxygen,
        maxOxygen: player.maxOxygen,
        isSwimming: player.isSwimming,
        spellCooldowns: { ...player.spellCooldowns },
        direction: player.direction,
        currentWeaponIndex,
        equippedPower,
        unlockedWeapons: Array.isArray(player.unlockedWeapons) ? [...player.unlockedWeapons] : ["sword"]
      },
      inventory: { ...inventory },
      quest: { ...quest },
      questBook: { ...questBook },
      unlockedPowers: { fireball: true, dash: true, shockwave: true, heal: true },
      activePowerUps: { ...activePowerUps },
      dimensionQuest: { ...dimensionQuest },
      dimensionCrystals: crystalDimensionObjects
        .filter((obj) => obj.type === "dimensionCrystal" && obj.activated)
        .map((obj) => obj.crystalIndex),
      powerUpsCollected: powerUps
        .filter((obj) => obj.collected)
        .map(getSaveObjectKey),
      collected: villageObjects
        .filter((obj) => (obj.type === "collectible" || obj.type === "crystal") && obj.collected)
        .map(getSaveObjectKey),
      enemies: villageObjects
        .filter((obj) => obj.type === "enemy")
        .map((obj) => ({ key: getSaveObjectKey(obj), alive: obj.alive, hp: obj.hp, phase: obj.phase })),
      lootItems: lootItems
        .filter((obj) => !obj.collected)
        .map((obj) => ({
          kind: obj.kind,
          itemName: obj.itemName,
          amount: obj.amount,
          x: obj.x,
          y: obj.y
        })),
      futureState: getFutureSaveState()
    };
  }

  function writeSaveSnapshotFuture(save, silent = false) {
    try {
      const payload = JSON.stringify(save);
      const ok = writeSaveRaw(payload);
      if (ok) {
        try {
          localStorage.setItem(AUTOSAVE_BACKUP_KEY, payload);
        } catch (error) {
          // Backup opcional: se falhar, o save principal continua valendo.
        }
      }
      if (!ok) return false;
      lastAutoSaveAt = Date.now();
      if (!silent) {
        startMessage.textContent = "Jogo salvo!";
        showHudToast("Jogo salvo!");
        saveNoticeTimer = 2;
      }
      return true;
    } catch (error) {
      console.error("Erro ao montar save", error);
      if (!silent) showHudToast("Erro ao salvar.");
      return false;
    }
  }

  const saveGameBeforeAutosaveFuture = saveGame;
  saveGame = function saveGameFutureProof() {
    const snapshot = buildSaveSnapshotFuture();
    return writeSaveSnapshotFuture(snapshot, false);
  };

  function autosaveNow(reason = "auto") {
    if (!gameStarted && startScreen && !startScreen.classList.contains("hidden")) return false;
    try {
      const snapshot = buildSaveSnapshotFuture();
      snapshot.futureState.reason = reason;
      return writeSaveSnapshotFuture(snapshot, true);
    } catch (error) {
      console.error("Autosave falhou", error);
      return false;
    }
  }

  function queueAutosave(reason = "queued") {
    if (Date.now() - lastAutoSaveAt < 1200) return;
    window.setTimeout(() => autosaveNow(reason), 0);
  }

  function restoreFutureState(save) {
    const future = save?.futureState;
    if (!future || typeof future !== "object") return;

    if (future.weapons && typeof future.weapons === "object") {
      for (const [key, weapon] of Object.entries(future.weapons)) {
        if (!weapon || typeof weapon !== "object") continue;
        if (!weapons[key] || weapon.bossWeapon || weapon.customWeapon) {
          weapons[key] = { ...weapon };
        }
      }
    }

    if (future.inventory && typeof future.inventory === "object") {
      Object.assign(inventory, future.inventory);
    }

    if (future.questBook && typeof future.questBook === "object") {
      Object.assign(questBook, future.questBook);
    }

    if (future.openedChests && typeof future.openedChests === "object") {
      if (!questBook.openedChests || typeof questBook.openedChests !== "object") questBook.openedChests = {};
      Object.assign(questBook.openedChests, future.openedChests);
    }

    if (future.defeatedBosses && typeof future.defeatedBosses === "object") {
      if (!questBook.defeatedBosses || typeof questBook.defeatedBosses !== "object") questBook.defeatedBosses = {};
      Object.assign(questBook.defeatedBosses, future.defeatedBosses);
    }

    if (future.dimensionQuest && typeof future.dimensionQuest === "object") {
      Object.assign(dimensionQuest, future.dimensionQuest);
    }

    if (future.activePowerUps && typeof future.activePowerUps === "object") {
      Object.assign(activePowerUps, future.activePowerUps);
    }

    const mergedWeapons = new Set([
      ...(Array.isArray(player.unlockedWeapons) ? player.unlockedWeapons : []),
      ...(Array.isArray(save.player?.unlockedWeapons) ? save.player.unlockedWeapons : []),
      ...(Array.isArray(future.unlockedWeapons) ? future.unlockedWeapons : [])
    ]);

    player.unlockedWeapons = [...mergedWeapons].filter((key) => weapons[key]);
    if (!player.unlockedWeapons.length) player.unlockedWeapons = ["sword"];

    if (future.currentWeaponKey && weapons[future.currentWeaponKey] && player.unlockedWeapons.includes(future.currentWeaponKey)) {
      currentWeaponIndex = player.unlockedWeapons.indexOf(future.currentWeaponKey);
    } else {
      currentWeaponIndex = clamp(currentWeaponIndex, 0, player.unlockedWeapons.length - 1);
    }

    if (future.equippedPower) equippedPower = future.equippedPower;
  }

  const loadGameBeforeAutosaveFuture = loadGame;
  loadGame = function loadGameFutureProof() {
    const raw = readSaveRaw() || (() => {
      try { return localStorage.getItem(AUTOSAVE_BACKUP_KEY); } catch (error) { return null; }
    })();

    let parsedSave = null;
    try {
      parsedSave = raw ? JSON.parse(raw) : null;
    } catch (error) {
      parsedSave = null;
    }

    const ok = loadGameBeforeAutosaveFuture();
    if (parsedSave) restoreFutureState(parsedSave);
    normalizeRuntimeState();
    updateHud();
    renderInventory();
    return ok || Boolean(parsedSave);
  };

  if (typeof unlockElementalWeapon === "function") {
    const unlockElementalWeaponBeforeAutosave = unlockElementalWeapon;
    unlockElementalWeapon = function unlockElementalWeaponAndAutosave(weaponKey) {
      const result = unlockElementalWeaponBeforeAutosave(weaponKey);
      queueAutosave("weapon-unlocked");
      return result;
    };
  }

  if (typeof openElementalBossChest === "function") {
    const openElementalBossChestBeforeAutosave = openElementalBossChest;
    openElementalBossChest = function openElementalBossChestAndAutosave(chestObj) {
      const result = openElementalBossChestBeforeAutosave(chestObj);
      queueAutosave("boss-chest-opened");
      return result;
    };
  }

  window.addEventListener("pagehide", () => autosaveNow("pagehide"));
  window.addEventListener("beforeunload", () => autosaveNow("beforeunload"));
  window.addEventListener("blur", () => autosaveNow("window-blur"));
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") autosaveNow("visibility-hidden");
  });

  if (typeof document.onfreeze !== "undefined") {
    document.addEventListener("freeze", () => autosaveNow("page-freeze"));
  }

  autosaveTimerId = window.setInterval(() => {
    if (gameStarted && !gameOver) autosaveNow("interval");
  }, 10000);

  window.ETERNAL_RIFT_FORCE_AUTOSAVE = autosaveNow;
}

// === Mega biome expansion patch ===
if (typeof window !== "undefined" && !window.ETERNAL_RIFT_MEGA_BIOME_EXPANSION_PATCH) {
  window.ETERNAL_RIFT_MEGA_BIOME_EXPANSION_PATCH = true;

  const EXT_WORLD_COLS = 146;
  const EXT_WORLD_ROWS = 96;
  const EXT_WORLD_WIDTH = EXT_WORLD_COLS * TILE;
  const EXT_WORLD_HEIGHT = EXT_WORLD_ROWS * TILE;
  const BIOME_BOUNDS = {
    desert: { x1: 90, y1: 8, x2: 142, y2: 40 },
    frozen: { x1: 90, y1: 46, x2: 142, y2: 78 },
    swamp: { x1: 10, y1: 64, x2: 86, y2: 94 }
  };
  const ENV_TILES = {
    sand: "A",
    quicksand: "X",
    snow: "N",
    ice: "L",
    swamp: "H",
    mud: "U",
    toxicWater: "V"
  };

  function biomeContains(region, tileX, tileY) {
    return tileX >= region.x1 && tileX <= region.x2 && tileY >= region.y1 && tileY <= region.y2;
  }

  function getVillageMapCols() {
    return worldMap[0]?.length || MAP_COLS;
  }

  function getVillageMapRows() {
    return worldMap.length || MAP_ROWS;
  }

  function getMapTileAt(tileX, tileY) {
    if (tileX < 0 || tileY < 0 || tileY >= getVillageMapRows() || tileX >= getVillageMapCols()) return "G";
    return worldMap[tileY][tileX];
  }

  function setMapTile(tileX, tileY, tile) {
    if (tileX < 0 || tileY < 0 || tileY >= getVillageMapRows() || tileX >= getVillageMapCols()) return;
    worldMap[tileY][tileX] = tile;
  }

  function fillDynamicRect(startX, startY, width, height, tile) {
    for (let y = startY; y < startY + height; y++) {
      for (let x = startX; x < startX + width; x++) setMapTile(x, y, tile);
    }
  }

  function paintDynamicEllipse(centerX, centerY, radiusX, radiusY, tile) {
    for (let y = centerY - radiusY; y <= centerY + radiusY; y++) {
      for (let x = centerX - radiusX; x <= centerX + radiusX; x++) {
        const dx = (x - centerX) / radiusX;
        const dy = (y - centerY) / radiusY;
        if (dx * dx + dy * dy <= 1) setMapTile(x, y, tile);
      }
    }
  }

  function buildExpandedWorldMap() {
    const original = worldMap.map((row) => row.slice());
    worldMap.length = 0;
    for (let y = 0; y < EXT_WORLD_ROWS; y++) {
      worldMap.push(Array(EXT_WORLD_COLS).fill("G"));
    }
    for (let y = 0; y < original.length; y++) {
      for (let x = 0; x < original[y].length; x++) {
        worldMap[y][x] = original[y][x];
      }
    }

    // Faixas externas para a expansao.
    fillDynamicRect(82, 0, EXT_WORLD_COLS - 82, EXT_WORLD_ROWS, "G");
    fillDynamicRect(0, 60, EXT_WORLD_COLS, EXT_WORLD_ROWS - 60, "G");

    // Conexoes principais saindo da vila.
    fillDynamicRect(79, 22, 56, 4, "D"); // caminho leste
    fillDynamicRect(79, 56, 4, 26, "D"); // caminho sul
    fillDynamicRect(32, 58, 4, 22, "D"); // caminho sul central
    fillDynamicRect(34, 78, 40, 4, "D");
    fillDynamicRect(112, 24, 4, 58, "D");
    fillDynamicRect(96, 60, 36, 4, "D");

    // Deserto.
    fillDynamicRect(BIOME_BOUNDS.desert.x1, BIOME_BOUNDS.desert.y1, BIOME_BOUNDS.desert.x2 - BIOME_BOUNDS.desert.x1 + 1, BIOME_BOUNDS.desert.y2 - BIOME_BOUNDS.desert.y1 + 1, ENV_TILES.sand);
    fillDynamicRect(90, 22, 6, 4, "D");
    fillDynamicRect(96, 22, 32, 3, "D");
    fillDynamicRect(110, 12, 4, 24, "D");
    paintDynamicEllipse(103, 28, 5, 4, ENV_TILES.quicksand);
    paintDynamicEllipse(127, 17, 5, 4, "W");
    paintDynamicEllipse(131, 34, 4, 3, ENV_TILES.quicksand);
    fillDynamicRect(120, 10, 10, 8, "P");
    fillDynamicRect(116, 28, 12, 10, "P");

    // Congelado.
    fillDynamicRect(BIOME_BOUNDS.frozen.x1, BIOME_BOUNDS.frozen.y1, BIOME_BOUNDS.frozen.x2 - BIOME_BOUNDS.frozen.x1 + 1, BIOME_BOUNDS.frozen.y2 - BIOME_BOUNDS.frozen.y1 + 1, ENV_TILES.snow);
    fillDynamicRect(96, 60, 30, 4, "D");
    fillDynamicRect(110, 46, 4, 34, "D");
    paintDynamicEllipse(128, 56, 8, 5, ENV_TILES.ice);
    paintDynamicEllipse(100, 71, 6, 4, ENV_TILES.ice);
    fillDynamicRect(118, 68, 12, 8, "P");
    fillDynamicRect(94, 50, 10, 8, "P");

    // Pantano.
    fillDynamicRect(BIOME_BOUNDS.swamp.x1, BIOME_BOUNDS.swamp.y1, BIOME_BOUNDS.swamp.x2 - BIOME_BOUNDS.swamp.x1 + 1, BIOME_BOUNDS.swamp.y2 - BIOME_BOUNDS.swamp.y1 + 1, ENV_TILES.swamp);
    fillDynamicRect(30, 60, 4, 8, "D");
    fillDynamicRect(30, 68, 34, 4, "D");
    fillDynamicRect(62, 68, 4, 20, "D");
    fillDynamicRect(20, 78, 46, 3, ENV_TILES.mud);
    paintDynamicEllipse(19, 88, 8, 4, ENV_TILES.toxicWater);
    paintDynamicEllipse(48, 88, 9, 5, ENV_TILES.toxicWater);
    paintDynamicEllipse(74, 76, 7, 5, ENV_TILES.toxicWater);
    paintDynamicEllipse(60, 70, 5, 3, ENV_TILES.mud);
  }

  function biomeFeature(tileX, tileY, kind, options = {}) {
    const width = options.width || 24;
    const height = options.height || 24;
    return {
      type: "biomeFeature",
      kind,
      x: tileX * TILE + (options.offsetX ?? Math.max(0, (TILE - width) / 2)),
      y: tileY * TILE + (options.offsetY ?? Math.max(0, (TILE - height) / 2)),
      width,
      height,
      solid: Boolean(options.solid),
      message: options.message || "",
      damageOnTouch: options.damageOnTouch || 0,
      slowAmount: options.slowAmount || 0,
      rewardKey: options.rewardKey || "",
      rewardItems: options.rewardItems || null,
      chestId: options.chestId || "",
      opened: Boolean(options.opened),
      lit: Boolean(options.lit),
      hiddenUntil: options.hiddenUntil || "",
      role: options.role || "",
      title: options.title || "",
      points: options.points || 0
    };
  }

  function biomeCollectible(tileX, tileY, item, message = "") {
    const obj = collectible(tileX, tileY, item);
    if (message) obj.message = message;
    return obj;
  }

  buildExpandedWorldMap();

  function ensureBiomeQuestBook() {
    if (!questBook.biomeMissions || typeof questBook.biomeMissions !== "object") questBook.biomeMissions = {};
    if (!questBook.biomeMissions.desert) questBook.biomeMissions.desert = { oasisFound: false, scorpions: 0, pyramidOpened: false, crystalSolar: false };
    if (!questBook.biomeMissions.frozen) questBook.biomeMissions.frozen = { torches: 0, iceCrystals: 0, npcRescued: false, whiteWolfDefeated: false };
    if (!questBook.biomeMissions.swamp) questBook.biomeMissions.swamp = { poisonousHerbs: 0, witchCabinFound: false, waterPurified: false, giantFrogs: 0 };
    if (!questBook.biomeMissions.chests) questBook.biomeMissions.chests = {};
  }

  function ensureBiomeInventory() {
    if (!Array.isArray(inventory.itensBoss)) inventory.itensBoss = [];
    if (!Array.isArray(inventory.biomeRelics)) inventory.biomeRelics = [];
  }

  function grantUniqueRelic(itemName) {
    ensureBiomeInventory();
    if (!inventory.biomeRelics.includes(itemName)) inventory.biomeRelics.push(itemName);
    if (!inventory.itensBoss.includes(itemName)) inventory.itensBoss.push(itemName);
  }

  function hasRelic(itemName) {
    return Array.isArray(inventory.biomeRelics) && inventory.biomeRelics.includes(itemName);
  }

  const biomeObjectsToAdd = [
    sign(84, 23, "Expansao do mapa: siga para o leste para encontrar o Deserto e a Vila Congelada."),
    sign(33, 61, "Expansao do mapa: siga para o sul para entrar no Pantano dos Sussurros."),

    // Deserto.
    sign(96, 23, "Bioma Deserto: tome cuidado com a areia movediça e procure o oasis perdido."),
    npc(98, 24, "Sahir", "Sahir: O deserto guarda caravanas, ruinas e um templo soterrado.", "desertGuide"),
    npc(126, 18, "Mercador Nadir", "Mercador Nadir: Agua rara, amuletos e historias do deserto!", "shopkeeper"),
    biomeFeature(101, 15, "caravan", { width: 58, height: 34, solid: true, message: "Caravana de mercadores: caixas, tecidos e suprimentos cruzaram o deserto ate aqui." }),
    biomeFeature(126, 17, "oasis", { width: 48, height: 40, message: "Oasis perdido: voce encontrou uma das fontes mais raras do deserto.", role: "desertOasis" }),
    biomeFeature(123, 12, "sunTemple", { width: 76, height: 76, solid: true, message: "Piramide antiga: a entrada finalmente apareceu entre as dunas.", role: "sunTemple" }),
    biomeFeature(118, 30, "buriedRuins", { width: 62, height: 44, solid: true, message: "Ruinas enterradas: pedras antigas escondem segredos sob a areia." }),
    biomeFeature(109, 27, "solarStone", { width: 20, height: 26, message: "Pedra solar: ela pulsa com luz quente durante o dia." }),
    biomeFeature(133, 29, "solarStone", { width: 20, height: 26, message: "Pedra solar: um brilho dourado corta a tempestade de areia." }),
    biomeFeature(95, 32, "ancientBones", { width: 36, height: 18, message: "Ossos antigos: parecem restos de criaturas soterradas pelo tempo." }),
    biomeFeature(136, 31, "ancientBones", { width: 34, height: 18, message: "Ossos antigos: enormes costelas apontam para o ceu seco." }),
    biomeFeature(101, 28, "quicksandPit", { width: 36, height: 36, message: "Areia movedica: a superficie parece viva e tenta puxar quem se aproxima." }),
    biomeFeature(130, 34, "quicksandPit", { width: 34, height: 34, message: "Areia movedica: uma poça traiçoeira de areia densa e pesada." }),
    biomeFeature(92, 18, "cactus", { width: 24, height: 30, damageOnTouch: 1 }),
    biomeFeature(94, 30, "cactus", { width: 24, height: 30, damageOnTouch: 1 }),
    biomeFeature(108, 18, "cactus", { width: 24, height: 30, damageOnTouch: 1 }),
    biomeFeature(114, 34, "cactus", { width: 24, height: 30, damageOnTouch: 1 }),
    biomeFeature(136, 16, "cactus", { width: 24, height: 30, damageOnTouch: 1 }),
    biomeFeature(120, 27, "scorpionBurrow", { width: 24, height: 12, message: "Buraco de escorpiao: ha marcas frescas ao redor da areia." }),
    biomeFeature(99, 19, "scorpionBurrow", { width: 24, height: 12, message: "Buraco de escorpiao: parece que algo acabou de se esconder aqui." }),
    biomeCollectible(124, 14, "cristalSolar", "Cristal solar: um nucleo quente e brilhante, digno de um templo antigo."),
    biomeFeature(120, 35, "biomeChest", { width: 26, height: 22, message: "Bau do Deserto", role: "biomeChest", chestId: "desert", rewardItems: ["Espada Solar", "Cajado de Areia", "Botas do Deserto", "Amuleto Anti-Calor"] }),

    // Congelado.
    sign(100, 60, "Bioma Congelado: acenda as tochas, colete cristais de gelo e derrote o Yeti Ancestral."),
    npc(97, 62, "Astrid", "Astrid: A vila congelada precisa de ajuda para sobreviver ao frio eterno.", "frozenGuide"),
    biomeFeature(97, 52, "igloo", { width: 58, height: 44, solid: true, message: "Iglu: abrigo compacto e aquecido contra a neve." }),
    biomeFeature(122, 70, "woodLodge", { width: 72, height: 54, solid: true, message: "Casa de madeira com lareira: alguem ainda tenta viver no gelo." }),
    biomeFeature(125, 56, "iceBridge", { width: 72, height: 14, message: "Ponte de gelo: parece forte, mas algumas placas estao quebradicas." }),
    biomeFeature(127, 60, "frozenStatue", { width: 24, height: 34, message: "Estatua congelada: o gelo preservou cada detalhe do rosto." }),
    biomeFeature(100, 71, "iceCave", { width: 70, height: 50, solid: true, message: "Caverna congelada: o eco aqui dentro parece uma nevasca distante." }),
    biomeFeature(95, 50, "snowTree", { width: 28, height: 36, solid: true }),
    biomeFeature(102, 48, "snowTree", { width: 28, height: 36, solid: true }),
    biomeFeature(132, 48, "snowTree", { width: 28, height: 36, solid: true }),
    biomeFeature(137, 69, "snowTree", { width: 28, height: 36, solid: true }),
    biomeFeature(118, 55, "iceCrystal", { width: 20, height: 26, message: "Cristal de gelo: um brilho frio atravessa o ar." }),
    biomeFeature(133, 54, "iceCrystal", { width: 20, height: 26, message: "Cristal de gelo: ele parece ainda mais puro sob a neve." }),
    biomeFeature(95, 68, "frozenTorch", { width: 18, height: 30, message: "Tocha congelada: pressione E para acender.", role: "frozenTorch" }),
    biomeFeature(103, 68, "frozenTorch", { width: 18, height: 30, message: "Tocha congelada: pressione E para acender.", role: "frozenTorch" }),
    biomeFeature(131, 68, "frozenTorch", { width: 18, height: 30, message: "Tocha congelada: pressione E para acender.", role: "frozenTorch" }),
    biomeFeature(139, 68, "frozenTorch", { width: 18, height: 30, message: "Tocha congelada: pressione E para acender.", role: "frozenTorch" }),
    npc(135, 72, "Eirik", "Eirik: Estou preso no gelo... por favor, aqueça estas tochas!", "frozenVictim"),
    biomeCollectible(116, 54, "cristalGelo"),
    biomeCollectible(121, 53, "cristalGelo"),
    biomeCollectible(126, 54, "cristalGelo"),
    biomeCollectible(98, 70, "cristalGelo"),
    biomeCollectible(104, 72, "cristalGelo"),
    biomeFeature(120, 74, "biomeChest", { width: 26, height: 22, message: "Bau Congelado", role: "biomeChest", chestId: "frozen", rewardItems: ["Arco Congelante", "Espada de Gelo", "Armadura Polar", "Pocao Anti-Frio", "Botas Antiderrapantes"] }),

    // Pantano.
    sign(29, 70, "Pantano dos Sussurros: a nevoa, a lama e a agua venenosa deixam tudo mais perigoso."),
    npc(32, 70, "Mora", "Mora: O pantano esconde ervas venenosas, uma cabana abandonada e a Bruxa do Pantano.", "swampGuide"),
    biomeFeature(20, 84, "swampTree", { width: 28, height: 42, solid: true }),
    biomeFeature(26, 89, "swampTree", { width: 28, height: 42, solid: true }),
    biomeFeature(42, 72, "swampTree", { width: 28, height: 42, solid: true }),
    biomeFeature(69, 84, "swampTree", { width: 28, height: 42, solid: true }),
    biomeFeature(58, 78, "poisonMushroom", { width: 18, height: 18, message: "Cogumelo venenoso: exala um cheiro estranho e adocicado." }),
    biomeFeature(72, 79, "poisonMushroom", { width: 18, height: 18, message: "Cogumelo venenoso: seu topo brilha mesmo na nevoa." }),
    biomeFeature(52, 83, "gasPlant", { width: 20, height: 28, message: "Planta toxica: cuidado com o gas venenoso que ela libera.", damageOnTouch: 1 }),
    biomeFeature(76, 74, "gasPlant", { width: 20, height: 28, message: "Planta toxica: uma nuvem esverdeada fica presa entre as folhas.", damageOnTouch: 1 }),
    biomeFeature(64, 79, "brokenBridge", { width: 74, height: 18, message: "Ponte quebrada: algumas tabuas ainda se mantem de pe." }),
    biomeFeature(48, 71, "abandonedHouse", { width: 74, height: 56, solid: true, message: "Casa abandonada: o interior foi engolido pela umidade do pantano.", role: "witchCabin" }),
    biomeFeature(40, 89, "skullPile", { width: 28, height: 16, message: "Craneos e ossos: o brejo guarda memorias nada tranquilas." }),
    biomeFeature(55, 87, "skullPile", { width: 28, height: 16, message: "Craneos e ossos: parte da lama parece se mover ao redor deles." }),
    biomeFeature(70, 89, "purifyShrine", { width: 24, height: 30, message: "Totem do Brejo: pressione E para purificar a agua do pantano.", role: "purifyShrine" }),
    biomeCollectible(25, 83, "ervaVenenosa"),
    biomeCollectible(30, 88, "ervaVenenosa"),
    biomeCollectible(37, 80, "ervaVenenosa"),
    biomeCollectible(60, 90, "ervaVenenosa"),
    biomeCollectible(75, 84, "ervaVenenosa"),
    biomeFeature(69, 91, "biomeChest", { width: 26, height: 22, message: "Bau do Brejo", role: "biomeChest", chestId: "swamp", rewardItems: ["Cajado Venenoso", "Pocao Antidoto", "Armadura de Musgo", "Anel contra Veneno", "Lanca do Brejo"] })
  ];

  const biomeEnemiesToAdd = [
    enemy(100, 21, "escorpiao"), enemy(104, 25, "escorpiao"), enemy(108, 31, "escorpiao"), enemy(135, 28, "escorpiao"), enemy(132, 36, "escorpiao"),
    enemy(114, 20, "serpenteDeserto"), enemy(126, 23, "serpenteDeserto"), enemy(138, 18, "serpenteDeserto"),
    enemy(120, 32, "mumia"), enemy(122, 33, "mumia"), enemy(118, 36, "mumia"),
    enemy(128, 29, "esqueletoArqueiro"), enemy(137, 26, "esqueletoArqueiro"),
    enemy(111, 17, "golemAreia"), enemy(130, 13, "besouroGigante"), enemy(139, 33, "besouroGigante"),
    boss(124, 31, "faraoAreia"),

    enemy(101, 58, "loboGelo"), enemy(106, 62, "loboGelo"), enemy(135, 60, "loboGelo"), enemy(100, 74, "loboBranco"),
    enemy(120, 57, "slimeGelo"), enemy(129, 59, "slimeGelo"), enemy(110, 72, "slimeGelo"),
    enemy(126, 66, "espiritoCongelado"), enemy(117, 71, "espiritoCongelado"),
    enemy(98, 69, "morcegoNeve"), enemy(104, 73, "morcegoNeve"),
    enemy(132, 73, "golemGelo"), enemy(136, 70, "arqueiroCongelado"),
    boss(122, 67, "yetiAncestral"),

    enemy(24, 79, "sapoGigante"), enemy(27, 88, "sapoGigante"), enemy(64, 87, "sapoGigante"), enemy(77, 82, "sapoGigante"),
    enemy(42, 85, "mosquitoVenenoso"), enemy(58, 78, "mosquitoVenenoso"), enemy(73, 75, "mosquitoVenenoso"),
    enemy(33, 83, "slimeToxico"), enemy(56, 86, "slimeToxico"), enemy(75, 89, "slimeToxico"),
    enemy(48, 76, "bruxaPantano"), enemy(61, 81, "bruxaPantano"),
    enemy(39, 90, "zumbiLama"), enemy(51, 91, "zumbiLama"),
    enemy(70, 75, "serpenteAquatica"), enemy(17, 88, "serpenteAquatica"),
    boss(58, 84, "bruxaDoPantano")
  ];

  for (const obj of biomeObjectsToAdd) {
    if (!villageObjects.includes(obj)) villageObjects.push(obj);
  }
  for (const obj of biomeEnemiesToAdd) {
    if (!villageObjects.includes(obj)) villageObjects.push(obj);
  }

  ensureBiomeQuestBook();
  ensureBiomeInventory();

  function syncBiomeObjectState() {
    ensureBiomeQuestBook();
    ensureBiomeInventory();
    for (const obj of villageObjects) {
      if (obj.type === "biomeFeature" && obj.role === "biomeChest") {
        obj.opened = Boolean(questBook.biomeMissions.chests[obj.chestId]);
      }
      if (obj.type === "biomeFeature" && obj.role === "frozenTorch") {
        const litCount = questBook.biomeMissions.frozen.torches;
        const allTorches = villageObjects.filter((item) => item.type === "biomeFeature" && item.role === "frozenTorch");
        const index = allTorches.indexOf(obj);
        obj.lit = index >= 0 && index < litCount;
      }
      if (obj.type === "npc" && obj.role === "frozenVictim") {
        obj.message = questBook.biomeMissions.frozen.npcRescued
          ? "Eirik: Obrigado! A neve nao vai me prender de novo."
          : "Eirik: Estou preso no gelo... por favor, aqueça estas tochas!";
      }
    }
  }
  syncBiomeObjectState();

  const normalizeRuntimeStateBeforeBiomePatch = normalizeRuntimeState;
  normalizeRuntimeState = function normalizeRuntimeStateBiomePatch() {
    normalizeRuntimeStateBeforeBiomePatch();
    ensureBiomeQuestBook();
    ensureBiomeInventory();
    syncBiomeObjectState();
  };

  const resetProgressBeforeBiomePatch = resetProgressForNewGame;
  resetProgressForNewGame = function resetProgressForNewGameBiomePatch(name) {
    resetProgressBeforeBiomePatch(name);
    ensureBiomeQuestBook();
    ensureBiomeInventory();
    inventory.biomeRelics = [];
    questBook.biomeMissions = {
      desert: { oasisFound: false, scorpions: 0, pyramidOpened: false, crystalSolar: false },
      frozen: { torches: 0, iceCrystals: 0, npcRescued: false, whiteWolfDefeated: false },
      swamp: { poisonousHerbs: 0, witchCabinFound: false, waterPurified: false, giantFrogs: 0 },
      chests: {}
    };
    syncBiomeObjectState();
  };

  const setActiveSceneBeforeBiomePatch = setActiveScene;
  setActiveScene = function setActiveSceneBiomePatch(scene) {
    setActiveSceneBeforeBiomePatch(scene);
    if (currentScene === "village") {
      colliders = objects.filter((obj) => obj.solid);
      interactables = objects.filter((obj) => obj.message);
      syncBiomeObjectState();
    }
  };

  getSceneWidth = function getSceneWidthBiomePatch() {
    if (currentScene === "village") return EXT_WORLD_WIDTH;
    if (currentScene === "crystalDimension") return CRYSTAL_WIDTH;
    return HOME_WIDTH;
  };

  getSceneHeight = function getSceneHeightBiomePatch() {
    if (currentScene === "village") return EXT_WORLD_HEIGHT;
    if (currentScene === "crystalDimension") return CRYSTAL_HEIGHT;
    return HOME_HEIGHT;
  };

  isPointInVillageWater = function isPointInVillageWaterBiomePatch(x, y) {
    if (currentScene !== "village") return false;
    const tileX = Math.floor(x / TILE);
    const tileY = Math.floor(y / TILE);
    const tile = getMapTileAt(tileX, tileY);
    return tile === "W" || tile === ENV_TILES.toxicWater;
  };

  hitsWater = function hitsWaterBiomePatch(rect) {
    const left = Math.floor(rect.x / TILE);
    const right = Math.floor((rect.x + rect.width - 1) / TILE);
    const top = Math.floor(rect.y / TILE);
    const bottom = Math.floor((rect.y + rect.height - 1) / TILE);
    for (let y = top; y <= bottom; y++) {
      for (let x = left; x <= right; x++) {
        const tile = getMapTileAt(x, y);
        if (tile === "W" || tile === ENV_TILES.toxicWater) return true;
      }
    }
    return false;
  };

  projectileTouchesWater = function projectileTouchesWaterBiomePatch(obj) {
    return isPointInVillageWater(obj.x + obj.width / 2, obj.y + obj.height / 2);
  };

  const drawMapBeforeBiomePatch = drawMap;
  function drawSandTile(x, y, tileX, tileY) {
    ctx.fillStyle = (tileX + tileY) % 2 === 0 ? "#e7c067" : "#ddb45c";
    ctx.fillRect(x, y, TILE, TILE);
    ctx.fillStyle = "rgba(184, 121, 85, 0.45)";
    ctx.fillRect(x + 4, y + 7, 8, 2);
    ctx.fillRect(x + 20, y + 20, 7, 2);
    ctx.fillRect(x + 12, y + 15, 4, 2);
  }
  function drawQuicksandTile(x, y, tileX, tileY) {
    drawSandTile(x, y, tileX, tileY);
    ctx.fillStyle = "rgba(168, 95, 74, 0.38)";
    ctx.beginPath();
    ctx.arc(x + 16, y + 16, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(93, 56, 67, 0.48)";
    ctx.beginPath();
    ctx.arc(x + 16, y + 16, 6 + Math.sin((tileX + tileY + performance.now() / 420) * 0.8) * 1.4, 0, Math.PI * 2);
    ctx.stroke();
  }
  function drawSnowTile(x, y, tileX, tileY) {
    ctx.fillStyle = (tileX + tileY) % 2 === 0 ? "#edf5ff" : "#deebff";
    ctx.fillRect(x, y, TILE, TILE);
    ctx.fillStyle = "rgba(180, 205, 241, 0.65)";
    ctx.fillRect(x + 6, y + 8, 3, 3);
    ctx.fillRect(x + 20, y + 21, 4, 4);
    ctx.fillRect(x + 14, y + 14, 2, 2);
  }
  function drawIceTile(x, y, tileX, tileY) {
    ctx.fillStyle = (tileX + tileY) % 2 === 0 ? "#d4f3ff" : "#c1e6ff";
    ctx.fillRect(x, y, TILE, TILE);
    ctx.strokeStyle = "rgba(63, 143, 229, 0.42)";
    ctx.beginPath();
    ctx.moveTo(x + 4, y + 24);
    ctx.lineTo(x + 16, y + 10);
    ctx.lineTo(x + 28, y + 18);
    ctx.stroke();
  }
  function drawSwampTile(x, y, tileX, tileY) {
    ctx.fillStyle = (tileX + tileY) % 2 === 0 ? "#49684d" : "#415f46";
    ctx.fillRect(x, y, TILE, TILE);
    ctx.fillStyle = "rgba(140, 165, 92, 0.28)";
    ctx.fillRect(x + 6, y + 20, 5, 5);
    ctx.fillRect(x + 18, y + 14, 4, 4);
  }
  function drawMudTile(x, y, tileX, tileY) {
    ctx.fillStyle = (tileX + tileY) % 2 === 0 ? "#705a44" : "#614d3b";
    ctx.fillRect(x, y, TILE, TILE);
    ctx.fillStyle = "rgba(39, 48, 82, 0.2)";
    ctx.fillRect(x + 6, y + 18, 16, 6);
  }
  function drawToxicWaterTile(x, y, tileX, tileY) {
    ctx.fillStyle = (tileX + tileY) % 2 === 0 ? "#417d5d" : "#376d52";
    ctx.fillRect(x, y, TILE, TILE);
    ctx.fillStyle = "rgba(154, 255, 114, 0.25)";
    ctx.fillRect(x + 4, y + 6, 10, 6);
    ctx.fillRect(x + 18, y + 16, 8, 5);
    ctx.strokeStyle = "rgba(195, 255, 131, 0.32)";
    ctx.beginPath();
    ctx.arc(x + 12, y + 22, 5, 0, Math.PI * 2);
    ctx.stroke();
  }

  drawMap = function drawMapBiomePatch() {
    if (currentScene !== "village") {
      drawMapBeforeBiomePatch();
      return;
    }
    const cols = getVillageMapCols();
    const rows = getVillageMapRows();
    const startCol = Math.floor(camera.x / TILE) - 1;
    const endCol = Math.ceil((camera.x + canvas.width) / TILE) + 1;
    const startRow = Math.floor(camera.y / TILE) - 1;
    const endRow = Math.ceil((camera.y + canvas.height) / TILE) + 1;
    for (let y = startRow; y <= endRow; y++) {
      for (let x = startCol; x <= endCol; x++) {
        if (x < 0 || y < 0 || x >= cols || y >= rows) continue;
        const tile = worldMap[y][x];
        const px = x * TILE;
        const py = y * TILE;
        if (tile === ENV_TILES.sand) drawSandTile(px, py, x, y);
        else if (tile === ENV_TILES.quicksand) drawQuicksandTile(px, py, x, y);
        else if (tile === ENV_TILES.snow) drawSnowTile(px, py, x, y);
        else if (tile === ENV_TILES.ice) drawIceTile(px, py, x, y);
        else if (tile === ENV_TILES.swamp) drawSwampTile(px, py, x, y);
        else if (tile === ENV_TILES.mud) drawMudTile(px, py, x, y);
        else if (tile === ENV_TILES.toxicWater) drawToxicWaterTile(px, py, x, y);
        else if (tile === "D") drawDirt(px, py, x, y);
        else if (tile === "W") drawWater(px, py, x, y);
        else if (tile === "F") drawForestGrass(px, py, x, y);
        else if (tile === "P") drawPlaza(px, py, x, y);
        else drawGrass(px, py, x, y);
      }
    }
    drawSceneGroundOverlayV2?.();
  };

  const drawSceneGroundOverlayV2BeforeBiomePatch = typeof drawSceneGroundOverlayV2 === "function" ? drawSceneGroundOverlayV2 : null;
  if (drawSceneGroundOverlayV2BeforeBiomePatch) {
    drawSceneGroundOverlayV2 = function drawSceneGroundOverlayV2BiomePatch() {
      drawSceneGroundOverlayV2BeforeBiomePatch();
      if (currentScene !== "village") return;
      const area = getAreaName();
      if (area === "Vila Congelada") {
        for (let i = 0; i < 26; i++) {
          const sx = camera.x + ((i * 137 + performance.now() * 0.03) % (canvas.width + 120)) - 60;
          const sy = camera.y + ((i * 89 + performance.now() * 0.11) % (canvas.height + 90)) - 45;
          ctx.fillStyle = "rgba(255,255,255,0.7)";
          ctx.fillRect(sx, sy, 2, 2);
        }
      }
      if (area === "Pantano dos Sussurros") {
        ctx.fillStyle = "rgba(25, 38, 31, 0.12)";
        ctx.fillRect(camera.x, camera.y, canvas.width, canvas.height);
        for (let i = 0; i < 8; i++) {
          const fx = camera.x + ((i * 183 + performance.now() * 0.02) % (canvas.width + 80)) - 40;
          const fy = camera.y + 30 + (i * 47) % canvas.height;
          ctx.fillStyle = "rgba(180, 228, 180, 0.06)";
          ctx.fillRect(fx, fy, 90, 24);
        }
      }
      if (area === "Vila do Deserto") {
        ctx.fillStyle = "rgba(255, 214, 124, 0.05)";
        ctx.fillRect(camera.x, camera.y, canvas.width, canvas.height);
      }
    };
  }

  const drawObjectBeforeBiomePatch = drawObject;
  drawObject = function drawObjectBiomePatch(obj) {
    if (obj.type === "biomeFeature") {
      return drawBiomeFeature(obj);
    }
    drawObjectBeforeBiomePatch(obj);
  };

  function drawBiomeFeature(obj) {
    const x = obj.x;
    const y = obj.y;
    if (obj.kind === "cactus") {
      ctx.fillStyle = "#26794d";
      ctx.fillRect(x + 9, y + 2, 8, 24);
      ctx.fillRect(x + 4, y + 10, 6, 12);
      ctx.fillRect(x + 17, y + 12, 6, 11);
      ctx.fillStyle = "#d9ff73";
      ctx.fillRect(x + 8, y + 4, 1, 2); ctx.fillRect(x + 16, y + 9, 1, 2); ctx.fillRect(x + 20, y + 15, 1, 2);
      return;
    }
    if (obj.kind === "ancientBones") {
      ctx.fillStyle = "#e9dfcd";
      ctx.fillRect(x + 2, y + 8, obj.width - 4, 4);
      ctx.fillRect(x + 6, y + 4, 6, 14);
      ctx.fillRect(x + obj.width - 12, y + 4, 6, 14);
      return;
    }
    if (obj.kind === "quicksandPit") {
      ctx.fillStyle = "rgba(168, 95, 74, 0.55)";
      ctx.beginPath();
      ctx.arc(x + obj.width / 2, y + obj.height / 2, obj.width / 2 - 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(93,56,67,0.55)";
      ctx.beginPath();
      ctx.arc(x + obj.width / 2, y + obj.height / 2, obj.width / 4, 0, Math.PI * 2);
      ctx.stroke();
      return;
    }
    if (obj.kind === "oasis") {
      ctx.fillStyle = "#48a7e6";
      ctx.beginPath();
      ctx.ellipse(x + 22, y + 20, 18, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#2f8b60";
      ctx.fillRect(x + 2, y + 18, 8, 14);
      ctx.fillRect(x + 32, y + 10, 8, 20);
      ctx.fillStyle = "#8f5a3f";
      ctx.fillRect(x + 4, y + 8, 4, 12);
      ctx.fillRect(x + 34, y + 4, 4, 14);
      return;
    }
    if (obj.kind === "sunTemple") {
      ctx.fillStyle = "#8f5a3f";
      ctx.fillRect(x + 6, y + 22, obj.width - 12, obj.height - 22);
      ctx.fillStyle = "#b87955";
      ctx.fillRect(x + 12, y + 10, obj.width - 24, 18);
      ctx.fillStyle = "#fff264";
      ctx.fillRect(x + obj.width / 2 - 5, y + 34, 10, 10);
      ctx.fillStyle = "#273052";
      ctx.fillRect(x + obj.width / 2 - 12, y + obj.height - 26, 24, 22);
      return;
    }
    if (obj.kind === "buriedRuins") {
      ctx.fillStyle = "#92817a";
      ctx.fillRect(x + 4, y + 10, obj.width - 8, obj.height - 10);
      ctx.fillStyle = "#706760";
      ctx.fillRect(x + 10, y + 4, 14, 10);
      ctx.fillRect(x + obj.width - 24, y + 12, 10, 18);
      return;
    }
    if (obj.kind === "solarStone") {
      pixelRect(x + 2, y + 4, 16, 20, "#e9dfcd", "#8f5a3f");
      ctx.fillStyle = "#fff264";
      ctx.fillRect(x + 6, y + 8, 8, 8);
      return;
    }
    if (obj.kind === "scorpionBurrow") {
      ctx.fillStyle = "#5d3843";
      ctx.fillRect(x + 2, y + 4, obj.width - 4, 6);
      return;
    }
    if (obj.kind === "caravan") {
      ctx.fillStyle = "#8f5a3f";
      ctx.fillRect(x + 4, y + 10, obj.width - 8, 16);
      ctx.fillStyle = "#d24c63";
      ctx.fillRect(x + 8, y + 2, obj.width - 16, 12);
      ctx.fillStyle = "#273052";
      ctx.fillRect(x + 10, y + 24, 10, 10);
      ctx.fillRect(x + obj.width - 20, y + 24, 10, 10);
      return;
    }
    if (obj.kind === "igloo") {
      ctx.fillStyle = "#edf5ff";
      ctx.beginPath();
      ctx.arc(x + obj.width / 2, y + obj.height / 2 + 6, 22, Math.PI, 0);
      ctx.fill();
      ctx.fillRect(x + 12, y + 18, obj.width - 24, obj.height - 18);
      ctx.fillStyle = "#273052";
      ctx.fillRect(x + obj.width / 2 - 8, y + obj.height - 18, 16, 16);
      return;
    }
    if (obj.kind === "woodLodge" || obj.kind === "abandonedHouse") {
      ctx.fillStyle = obj.kind === "abandonedHouse" ? "#6d5c75" : "#b7b2bd";
      ctx.fillRect(x + 8, y + 24, obj.width - 16, obj.height - 24);
      ctx.fillStyle = obj.kind === "abandonedHouse" ? "#415f46" : "#3f8fe5";
      ctx.fillRect(x + 2, y + 10, obj.width - 4, 18);
      ctx.fillStyle = "#273052";
      ctx.fillRect(x + obj.width / 2 - 10, y + obj.height - 22, 20, 18);
      return;
    }
    if (obj.kind === "iceBridge") {
      ctx.fillStyle = "#c1e6ff";
      ctx.fillRect(x, y + 3, obj.width, 8);
      ctx.strokeStyle = "#8bcfff";
      ctx.strokeRect(x + 0.5, y + 3.5, obj.width - 1, 7);
      return;
    }
    if (obj.kind === "frozenStatue") {
      ctx.fillStyle = "#c7ccd4";
      ctx.fillRect(x + 7, y + 6, 10, 18);
      ctx.fillRect(x + 4, y + 22, 16, 10);
      ctx.fillStyle = "rgba(233,255,255,0.55)";
      ctx.fillRect(x + 4, y + 4, 18, 28);
      return;
    }
    if (obj.kind === "iceCave") {
      ctx.fillStyle = "#9cc7f2";
      ctx.fillRect(x + 4, y + 10, obj.width - 8, obj.height - 10);
      ctx.fillStyle = "#273052";
      ctx.fillRect(x + obj.width / 2 - 14, y + obj.height - 22, 28, 18);
      return;
    }
    if (obj.kind === "snowTree") {
      ctx.fillStyle = "#8f5a3f";
      ctx.fillRect(x + 10, y + 18, 8, 16);
      ctx.fillStyle = "#edf5ff";
      ctx.fillRect(x + 4, y + 10, 20, 10);
      ctx.fillRect(x + 2, y + 18, 24, 8);
      ctx.fillRect(x + 6, y + 4, 16, 8);
      return;
    }
    if (obj.kind === "iceCrystal") {
      ctx.fillStyle = "#8bcfff";
      ctx.fillRect(x + 8, y + 4, 8, 18);
      ctx.fillRect(x + 4, y + 10, 16, 8);
      ctx.fillStyle = "#e9ffff";
      ctx.fillRect(x + 10, y + 7, 4, 8);
      return;
    }
    if (obj.kind === "frozenTorch") {
      ctx.fillStyle = "#8f5a3f";
      ctx.fillRect(x + 7, y + 8, 4, 20);
      ctx.fillStyle = obj.lit ? "#fff264" : "#c7ccd4";
      ctx.fillRect(x + 4, y + 2, 10, 8);
      if (obj.lit) {
        ctx.fillStyle = "rgba(255, 242, 100, 0.28)";
        ctx.fillRect(x - 2, y - 2, 18, 16);
      }
      return;
    }
    if (obj.kind === "swampTree") {
      ctx.fillStyle = "#5d3843";
      ctx.fillRect(x + 10, y + 18, 8, 22);
      ctx.fillStyle = "#415f46";
      ctx.fillRect(x + 2, y + 8, 24, 12);
      ctx.fillRect(x + 6, y + 2, 18, 10);
      return;
    }
    if (obj.kind === "poisonMushroom") {
      ctx.fillStyle = "#fff264";
      ctx.fillRect(x + 4, y + 5, 10, 4);
      ctx.fillStyle = "#b46dff";
      ctx.fillRect(x + 2, y + 2, 14, 6);
      ctx.fillStyle = "#e9dfcd";
      ctx.fillRect(x + 7, y + 8, 4, 8);
      return;
    }
    if (obj.kind === "gasPlant") {
      ctx.fillStyle = "#26794d";
      ctx.fillRect(x + 8, y + 4, 4, 18);
      ctx.fillRect(x + 4, y + 11, 12, 8);
      ctx.fillStyle = "rgba(154, 255, 114, 0.28)";
      ctx.fillRect(x + 2, y, 16, 10);
      return;
    }
    if (obj.kind === "brokenBridge") {
      ctx.fillStyle = "#8f5a3f";
      for (let dx = 0; dx < obj.width; dx += 12) ctx.fillRect(x + dx, y + (dx % 24 === 0 ? 4 : 0), 8, 4);
      return;
    }
    if (obj.kind === "skullPile") {
      ctx.fillStyle = "#e9dfcd";
      ctx.fillRect(x + 2, y + 8, 10, 6);
      ctx.fillRect(x + 12, y + 5, 10, 8);
      return;
    }
    if (obj.kind === "purifyShrine") {
      pixelRect(x + 2, y + 4, 18, 22, "#49684d", "#273052");
      ctx.fillStyle = "#55e8ff";
      ctx.fillRect(x + 8, y + 10, 6, 6);
      return;
    }
    if (obj.kind === "biomeChest") {
      pixelRect(x, y + 3, obj.width, obj.height - 3, obj.opened ? "#76708e" : "#b87955");
      ctx.fillStyle = obj.opened ? "#55e8ff" : "#fff264";
      ctx.fillRect(x + 8, y + 8, 10, 6);
      return;
    }
    // fallback generico.
    pixelRect(x, y, obj.width, obj.height, "#9ba1ad");
  }

  const drawCollectibleBeforeBiomePatch = drawCollectible;
  drawCollectible = function drawCollectibleBiomePatch(obj) {
    if (obj.item === "cristalSolar") {
      const x = obj.x; const y = obj.y + Math.sin(performance.now() / 240) * 1.5;
      ctx.fillStyle = "#fff264";
      ctx.fillRect(x + 6, y + 1, 6, 16);
      ctx.fillRect(x + 3, y + 5, 12, 8);
      ctx.fillStyle = "#ffb347";
      ctx.fillRect(x + 7, y + 4, 4, 8);
      return;
    }
    if (obj.item === "cristalGelo") {
      const x = obj.x; const y = obj.y + Math.sin(performance.now() / 240) * 1.5;
      ctx.fillStyle = "#8bcfff";
      ctx.fillRect(x + 7, y + 1, 4, 16);
      ctx.fillRect(x + 4, y + 6, 10, 6);
      ctx.fillStyle = "#e9ffff";
      ctx.fillRect(x + 8, y + 4, 2, 8);
      return;
    }
    if (obj.item === "ervaVenenosa") {
      const x = obj.x; const y = obj.y + Math.sin(performance.now() / 240) * 1.5;
      ctx.fillStyle = "#26794d";
      ctx.fillRect(x + 8, y + 2, 2, 14);
      ctx.fillRect(x + 5, y + 7, 8, 4);
      ctx.fillStyle = "#9aff72";
      ctx.fillRect(x + 4, y + 4, 10, 4);
      return;
    }
    drawCollectibleBeforeBiomePatch(obj);
  };

  const getEnemyStatsBeforeBiomePatch = getEnemyStats;
  getEnemyStats = function getEnemyStatsBiomePatch(kind) {
    const base = getEnemyStatsBeforeBiomePatch(kind);
    const extra = {
      escorpiao: { width: 26, height: 18, hp: 5, damage: 1, speed: 62, aggroRange: 220, attackRange: 28, attackDelay: 0.92, coinReward: 8, dropTable: { coin: 0.9, potion: 0.08, powerUp: 0.14, loot: 0.25 }, xpReward: 12 },
      serpenteDeserto: { width: 32, height: 18, hp: 6, damage: 1, speed: 70, aggroRange: 240, attackRange: 34, attackDelay: 0.9, coinReward: 9, dropTable: { coin: 0.95, potion: 0.08, powerUp: 0.18, loot: 0.28 }, xpReward: 14 },
      mumia: { width: 22, height: 30, hp: 7, damage: 2, speed: 38, aggroRange: 210, attackRange: 28, attackDelay: 1.15, coinReward: 11, dropTable: { coin: 1, potion: 0.12, powerUp: 0.12, loot: 0.3 }, xpReward: 20 },
      esqueletoArqueiro: { width: 22, height: 28, hp: 6, damage: 1, speed: 48, aggroRange: 280, attackRange: 230, attackDelay: 1.3, coinReward: 12, projectileType: "arrow", dropTable: { coin: 1, potion: 0.1, powerUp: 0.16, loot: 0.32 }, xpReward: 18 },
      golemAreia: { width: 32, height: 34, hp: 12, damage: 2, speed: 32, aggroRange: 250, attackRange: 36, attackDelay: 1.35, coinReward: 15, defense: 1, projectileType: "sandBolt", dropTable: { coin: 1, potion: 0.18, powerUp: 0.22, loot: 0.38 }, xpReward: 26 },
      besouroGigante: { width: 26, height: 20, hp: 8, damage: 2, speed: 54, aggroRange: 220, attackRange: 32, attackDelay: 1.0, coinReward: 12, dropTable: { coin: 1, potion: 0.12, powerUp: 0.16, loot: 0.3 }, xpReward: 18 },
      faraoAreia: { width: 34, height: 42, hp: 54, damage: 3, speed: 44, aggroRange: 390, attackRange: 260, attackDelay: 1.05, coinReward: 85, boss: true, bossItem: "Coroa Solar", projectileType: "sandBolt", dropTable: { coin: 1, potion: 1, powerUp: 1, loot: 1 }, xpReward: 80 },
      loboGelo: { width: 28, height: 18, hp: 6, damage: 1, speed: 74, aggroRange: 250, attackRange: 30, attackDelay: 0.88, coinReward: 10, dropTable: { coin: 0.9, potion: 0.08, powerUp: 0.15, loot: 0.26 }, xpReward: 14 },
      loboBranco: { width: 30, height: 20, hp: 12, damage: 2, speed: 84, aggroRange: 290, attackRange: 32, attackDelay: 0.82, coinReward: 18, dropTable: { coin: 1, potion: 0.2, powerUp: 0.25, loot: 0.34 }, xpReward: 26 },
      slimeGelo: { width: 24, height: 21, hp: 5, damage: 1, speed: 44, aggroRange: 220, attackRange: 150, attackDelay: 1.32, coinReward: 8, projectileType: "iceShard", dropTable: { coin: 0.8, potion: 0.1, powerUp: 0.18, loot: 0.28 }, xpReward: 14 },
      espiritoCongelado: { width: 24, height: 28, hp: 6, damage: 1, speed: 62, aggroRange: 290, attackRange: 210, attackDelay: 1.22, coinReward: 12, canFly: true, projectileType: "iceShard", dropTable: { coin: 0.9, potion: 0.12, powerUp: 0.2, loot: 0.28 }, xpReward: 20 },
      morcegoNeve: { width: 24, height: 18, hp: 3, damage: 1, speed: 86, aggroRange: 250, attackRange: 28, attackDelay: 0.9, coinReward: 8, canFly: true, dropTable: { coin: 0.8, potion: 0.08, powerUp: 0.12, loot: 0.24 }, xpReward: 12 },
      golemGelo: { width: 32, height: 34, hp: 14, damage: 2, speed: 30, aggroRange: 250, attackRange: 185, attackDelay: 1.4, coinReward: 16, defense: 1, projectileType: "iceShard", dropTable: { coin: 1, potion: 0.16, powerUp: 0.2, loot: 0.34 }, xpReward: 28 },
      arqueiroCongelado: { width: 22, height: 28, hp: 6, damage: 1, speed: 48, aggroRange: 290, attackRange: 240, attackDelay: 1.3, coinReward: 13, projectileType: "iceArrow", dropTable: { coin: 1, potion: 0.12, powerUp: 0.18, loot: 0.32 }, xpReward: 18 },
      yetiAncestral: { width: 44, height: 46, hp: 58, damage: 3, speed: 36, aggroRange: 390, attackRange: 250, attackDelay: 1.15, coinReward: 88, boss: true, bossItem: "Pelagem Ancestral", projectileType: "iceShard", dropTable: { coin: 1, potion: 1, powerUp: 1, loot: 1 }, xpReward: 84 },
      sapoGigante: { width: 28, height: 20, hp: 7, damage: 1, speed: 56, aggroRange: 210, attackRange: 28, attackDelay: 0.95, coinReward: 9, dropTable: { coin: 0.9, potion: 0.08, powerUp: 0.16, loot: 0.26 }, xpReward: 15 },
      mosquitoVenenoso: { width: 18, height: 18, hp: 3, damage: 1, speed: 94, aggroRange: 250, attackRange: 155, attackDelay: 1.0, coinReward: 7, canFly: true, projectileType: "poison", dropTable: { coin: 0.8, potion: 0.06, powerUp: 0.12, loot: 0.18 }, xpReward: 12 },
      slimeToxico: { width: 24, height: 21, hp: 6, damage: 1, speed: 46, aggroRange: 230, attackRange: 150, attackDelay: 1.25, coinReward: 9, projectileType: "poison", dropTable: { coin: 0.9, potion: 0.1, powerUp: 0.18, loot: 0.28 }, xpReward: 15 },
      bruxaPantano: { width: 24, height: 32, hp: 8, damage: 2, speed: 42, aggroRange: 280, attackRange: 225, attackDelay: 1.25, coinReward: 14, projectileType: "poison", dropTable: { coin: 1, potion: 0.16, powerUp: 0.2, loot: 0.32 }, xpReward: 24 },
      zumbiLama: { width: 22, height: 30, hp: 8, damage: 2, speed: 34, aggroRange: 220, attackRange: 28, attackDelay: 1.18, coinReward: 10, dropTable: { coin: 1, potion: 0.1, powerUp: 0.12, loot: 0.24 }, xpReward: 18 },
      serpenteAquatica: { width: 34, height: 18, hp: 7, damage: 2, speed: 72, aggroRange: 250, attackRange: 34, attackDelay: 0.95, coinReward: 12, canSwim: true, projectileType: "poison", dropTable: { coin: 1, potion: 0.12, powerUp: 0.16, loot: 0.28 }, xpReward: 18 },
      bruxaDoPantano: { width: 34, height: 40, hp: 56, damage: 3, speed: 44, aggroRange: 390, attackRange: 260, attackDelay: 1.05, coinReward: 82, boss: true, bossItem: "Lagrima do Brejo", projectileType: "poison", dropTable: { coin: 1, potion: 1, powerUp: 1, loot: 1 }, xpReward: 82 }
    };
    return extra[kind] || base;
  };

  const getEnemyProjectileConfigBeforeBiomePatch = getEnemyProjectileConfig;
  getEnemyProjectileConfig = function getEnemyProjectileConfigBiomePatch(type, obj) {
    const existing = getEnemyProjectileConfigBeforeBiomePatch(type, obj);
    if (existing && !["sandBolt", "iceShard", "iceArrow", "poison"].includes(type)) return existing;
    const bossBoost = obj?.boss ? 1.18 : 1;
    const extraConfigs = {
      sandBolt: { width: 13, height: 13, speed: 180 * bossBoost, timer: 2.2 },
      iceShard: { width: 12, height: 12, speed: 185 * bossBoost, timer: 2.2 },
      iceArrow: { width: 14, height: 5, speed: 220 * bossBoost, timer: 2.1 },
      poison: { width: 12, height: 12, speed: 175 * bossBoost, timer: 2.1 }
    };
    return extraConfigs[type] || existing;
  };

  const getEnemyProjectileColorBeforeBiomePatch = getEnemyProjectileColor;
  getEnemyProjectileColor = function getEnemyProjectileColorBiomePatch(type) {
    if (type === "sandBolt") return { glow: "rgba(231, 192, 103, 0.34)", main: "#ddb45c", core: "#fff3d6" };
    if (type === "iceShard" || type === "iceArrow") return { glow: "rgba(139, 207, 255, 0.34)", main: "#8bcfff", core: "#e9ffff" };
    if (type === "poison") return { glow: "rgba(154, 255, 114, 0.34)", main: "#6fc95d", core: "#e9ffcb" };
    return getEnemyProjectileColorBeforeBiomePatch(type);
  };

  const fireBossPatternBeforeBiomePatch = fireBossPattern;
  fireBossPattern = function fireBossPatternBiomePatch(obj, targetX, targetY) {
    if (obj.kind === "faraoAreia") {
      for (const offset of [-0.35, 0, 0.35]) fireEnemyProjectile(obj, targetX, targetY, offset);
      spawnHazardZone("sandstorm", targetX, targetY, 42, 1.9, 1);
      return;
    }
    if (obj.kind === "yetiAncestral") {
      for (const offset of [-0.28, 0.28]) fireEnemyProjectile(obj, targetX, targetY, offset);
      spawnHazardZone("frost", targetX, targetY, 46, 1.8, 1);
      return;
    }
    if (obj.kind === "bruxaDoPantano") {
      for (const offset of [-0.42, 0, 0.42]) fireEnemyProjectile(obj, targetX, targetY, offset);
      spawnHazardZone("poisonCloud", targetX, targetY, 46, 2.1, 1);
      return;
    }
    fireBossPatternBeforeBiomePatch(obj, targetX, targetY);
  };

  const updateEnemiesBeforeBiomePatch = updateEnemies;
  updateEnemies = function updateEnemiesBiomePatch(delta) {
    updateEnemiesBeforeBiomePatch(delta);
    if (currentScene !== "village") return;
    for (const obj of villageObjects) {
      if (obj.type !== "enemy" || !obj.alive) continue;
      if (obj.kind === "slimeToxico" && obj.state === "chase" && Math.random() < delta * 0.45) {
        spawnHazardZone("poisonCloud", obj.x + obj.width / 2, obj.y + obj.height / 2, 28, 1.6, 1);
      }
      if (obj.kind === "golemAreia" && obj.state === "chase" && Math.random() < delta * 0.35) {
        spawnHazardZone("sandstorm", obj.x + obj.width / 2, obj.y + obj.height / 2, 28, 1.5, 1);
      }
      if ((obj.kind === "golemGelo" || obj.kind === "yetiAncestral") && obj.state === "chase" && Math.random() < delta * 0.28) {
        spawnHazardZone("frost", obj.x + obj.width / 2, obj.y + obj.height / 2, 28, 1.6, 1);
      }
    }
  };

  const drawHazardsBeforeBiomePatch = drawHazards;
  drawHazards = function drawHazardsBiomePatch() {
    drawHazardsBeforeBiomePatch();
    for (const obj of hazardZones) {
      const alpha = Math.max(0, obj.timer / obj.maxTimer);
      if (obj.type === "sandstorm") {
        ctx.strokeStyle = `rgba(231, 192, 103, ${0.45 * alpha})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI * 2);
        ctx.stroke();
      } else if (obj.type === "frost") {
        ctx.strokeStyle = `rgba(139, 207, 255, ${0.55 * alpha})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI * 2);
        ctx.stroke();
      } else if (obj.type === "poisonCloud") {
        ctx.fillStyle = `rgba(154, 255, 114, ${0.18 * alpha})`;
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  const getEnemyXpRewardBeforeBiomePatch = getEnemyXpReward;
  getEnemyXpReward = function getEnemyXpRewardBiomePatch(obj) {
    const extraRewards = {
      escorpiao: 40, serpenteDeserto: 45, mumia: 55, esqueletoArqueiro: 55, golemAreia: 70, besouroGigante: 50, faraoAreia: 1400,
      loboGelo: 40, loboBranco: 80, slimeGelo: 42, espiritoCongelado: 58, morcegoNeve: 36, golemGelo: 75, arqueiroCongelado: 60, yetiAncestral: 1500,
      sapoGigante: 42, mosquitoVenenoso: 34, slimeToxico: 44, bruxaPantano: 62, zumbiLama: 50, serpenteAquatica: 52, bruxaDoPantano: 1480
    };
    if (extraRewards[obj.kind]) return extraRewards[obj.kind];
    return getEnemyXpRewardBeforeBiomePatch(obj);
  };

  const getEnemyDisplayNameBeforeBiomePatch = getEnemyDisplayName;
  getEnemyDisplayName = function getEnemyDisplayNameBiomePatch(kind) {
    const extraNames = {
      escorpiao: "Escorpiao", serpenteDeserto: "Serpente do Deserto", mumia: "Mumia", esqueletoArqueiro: "Esqueleto Arqueiro", golemAreia: "Golem de Areia", besouroGigante: "Besouro Gigante", faraoAreia: "Farao de Areia",
      loboGelo: "Lobo de Gelo", loboBranco: "Lobo Branco", slimeGelo: "Slime de Gelo", espiritoCongelado: "Espirito Congelado", morcegoNeve: "Morcego de Neve", golemGelo: "Golem de Gelo", arqueiroCongelado: "Arqueiro Congelado", yetiAncestral: "Yeti Ancestral",
      sapoGigante: "Sapo Gigante", mosquitoVenenoso: "Mosquito Venenoso", slimeToxico: "Slime Toxico", bruxaPantano: "Bruxa do Pantano", zumbiLama: "Zumbi Enlameado", serpenteAquatica: "Serpente Aquatica", bruxaDoPantano: "Bruxa do Pantano"
    };
    return extraNames[kind] || getEnemyDisplayNameBeforeBiomePatch(kind);
  };

  const drawEnemyBeforeBiomePatch = drawEnemy;
  drawEnemy = function drawEnemyBiomePatch(obj) {
    drawEnemyBeforeBiomePatch(obj);
    if (["escorpiao", "besouroGigante"].includes(obj.kind)) {
      fillPixelV2(obj.x + 4, obj.y + 5, obj.width - 8, 4, "#8f5a3f");
    }
    if (["mumia", "esqueletoArqueiro"].includes(obj.kind)) {
      fillPixelV2(obj.x + 6, obj.y + 4, obj.width - 12, 6, "#e9dfcd");
    }
    if (["loboGelo", "loboBranco", "slimeGelo", "golemGelo", "yetiAncestral"].includes(obj.kind)) {
      fillPixelV2(obj.x + 5, obj.y + 5, Math.max(8, obj.width - 10), 4, "rgba(233,255,255,0.75)");
    }
    if (["mosquitoVenenoso", "slimeToxico", "bruxaPantano", "bruxaDoPantano"].includes(obj.kind)) {
      fillPixelV2(obj.x + 5, obj.y + 6, Math.max(8, obj.width - 10), 4, "rgba(154,255,114,0.65)");
    }
  };

  const defeatEnemyBeforeBiomePatch = defeatEnemy;
  defeatEnemy = function defeatEnemyBiomePatch(obj) {
    defeatEnemyBeforeBiomePatch(obj);
    ensureBiomeQuestBook();
    if (obj.kind === "escorpiao") questBook.biomeMissions.desert.scorpions = Math.min(5, questBook.biomeMissions.desert.scorpions + 1);
    if (obj.kind === "loboBranco") questBook.biomeMissions.frozen.whiteWolfDefeated = true;
    if (obj.kind === "sapoGigante") questBook.biomeMissions.swamp.giantFrogs = Math.min(4, questBook.biomeMissions.swamp.giantFrogs + 1);
    if (["faraoAreia", "yetiAncestral", "bruxaDoPantano"].includes(obj.kind)) {
      spawnFloatingText("Bau liberado!", obj.x, obj.y - 46, "#55e8ff");
      playSound("chest");
    }
  };

  const findInteractionBeforeBiomePatch = findInteraction;
  findInteraction = function findInteractionBiomePatch() {
    const found = findInteractionBeforeBiomePatch();
    return found;
  };

  function openBiomeChest(obj) {
    ensureBiomeQuestBook();
    ensureBiomeInventory();
    if (obj.opened || questBook.biomeMissions.chests[obj.chestId]) {
      return `${obj.message}: este bau ja foi aberto.`;
    }
    const bossRequired = obj.chestId === "desert" ? "faraoAreia" : obj.chestId === "frozen" ? "yetiAncestral" : "bruxaDoPantano";
    if (!questBook.defeatedBosses?.[bossRequired]) {
      return `${obj.message}: o selo do chefe ainda nao foi quebrado.`;
    }
    obj.opened = true;
    questBook.biomeMissions.chests[obj.chestId] = true;
    inventory.moedas += 35;
    inventory.pocoes += 1;
    for (const itemName of obj.rewardItems || []) grantUniqueRelic(itemName);
    awardXp(500, `Bau ${obj.chestId}`);
    playSound("chest");
    renderInventory();
    updateHud();
    return `${obj.message} aberto! Voce recebeu 35 moedas, 1 pocao e os itens: ${(obj.rewardItems || []).join(", ")}.`;
  }

  const getQuestMessageBeforeBiomePatch = getQuestMessage;
  getQuestMessage = function getQuestMessageBiomePatch(npcObj) {
    ensureBiomeQuestBook();
    if (npcObj.type === "biomeFeature" && npcObj.role === "desertOasis") {
      questBook.biomeMissions.desert.oasisFound = true;
      awardXp(150, "Oasis perdido");
      return npcObj.message;
    }
    if (npcObj.type === "biomeFeature" && npcObj.role === "sunTemple") {
      questBook.biomeMissions.desert.pyramidOpened = true;
      awardXp(150, "Piramide antiga");
      return npcObj.message;
    }
    if (npcObj.type === "biomeFeature" && npcObj.role === "frozenTorch") {
      if (!npcObj.lit) {
        npcObj.lit = true;
        questBook.biomeMissions.frozen.torches = Math.min(4, questBook.biomeMissions.frozen.torches + 1);
        playSound("crystal");
        awardXp(70, "Tocha acesa");
        return `Tocha congelada acesa! Progresso: ${questBook.biomeMissions.frozen.torches}/4.`;
      }
      return `Tocha congelada: ela ja esta acesa. Progresso: ${questBook.biomeMissions.frozen.torches}/4.`;
    }
    if (npcObj.type === "npc" && npcObj.role === "frozenVictim") {
      if (!questBook.biomeMissions.frozen.npcRescued && questBook.biomeMissions.frozen.torches >= 4) {
        questBook.biomeMissions.frozen.npcRescued = true;
        inventory.moedas += 12;
        awardXp(250, "NPC salvo no gelo");
        npcObj.message = "Eirik: Voce me salvou! Tome estas moedas e meu respeito.";
        return "Eirik: O calor das tochas me libertou! Receba 12 moedas pela ajuda.";
      }
      return npcObj.message;
    }
    if (npcObj.type === "biomeFeature" && npcObj.role === "witchCabin") {
      questBook.biomeMissions.swamp.witchCabinFound = true;
      awardXp(120, "Cabana da bruxa");
      return npcObj.message;
    }
    if (npcObj.type === "biomeFeature" && npcObj.role === "purifyShrine") {
      if (!questBook.biomeMissions.swamp.waterPurified && questBook.biomeMissions.swamp.poisonousHerbs >= 3) {
        questBook.biomeMissions.swamp.waterPurified = true;
        awardXp(220, "Agua purificada");
        return "Totem do Brejo: a agua do pantano foi purificada por enquanto.";
      }
      if (questBook.biomeMissions.swamp.waterPurified) return "Totem do Brejo: a agua segue purificada.";
      return "Totem do Brejo: colete ao menos 3 ervas venenosas antes de tentar purificar a agua.";
    }
    if (npcObj.type === "biomeFeature" && npcObj.role === "biomeChest") {
      return openBiomeChest(npcObj);
    }
    if (npcObj.type === "npc" && npcObj.role === "desertGuide") {
      return `Sahir: Oasis ${questBook.biomeMissions.desert.oasisFound ? "ok" : "pendente"} | Escorpioes ${questBook.biomeMissions.desert.scorpions}/5 | Piramide ${questBook.biomeMissions.desert.pyramidOpened ? "aberta" : "fechada"} | Cristal solar ${questBook.biomeMissions.desert.crystalSolar ? "coletado" : "perdido"}.`;
    }
    if (npcObj.type === "npc" && npcObj.role === "frozenGuide") {
      return `Astrid: Tochas ${questBook.biomeMissions.frozen.torches}/4 | Cristais de gelo ${questBook.biomeMissions.frozen.iceCrystals}/5 | Lobo branco ${questBook.biomeMissions.frozen.whiteWolfDefeated ? "derrotado" : "vivo"} | NPC ${questBook.biomeMissions.frozen.npcRescued ? "salvo" : "preso"}.`;
    }
    if (npcObj.type === "npc" && npcObj.role === "swampGuide") {
      return `Mora: Ervas ${questBook.biomeMissions.swamp.poisonousHerbs}/5 | Cabana ${questBook.biomeMissions.swamp.witchCabinFound ? "achada" : "oculta"} | Agua ${questBook.biomeMissions.swamp.waterPurified ? "purificada" : "toxica"} | Sapos ${questBook.biomeMissions.swamp.giantFrogs}/4.`;
    }
    return getQuestMessageBeforeBiomePatch(npcObj);
  };

  const collectWorldItemsBeforeBiomePatch = collectWorldItems;
  collectWorldItems = function collectWorldItemsBiomePatch() {
    ensureBiomeQuestBook();
    const playerRect = getPlayerRect();
    const pendingCustomCollects = villageObjects
      .filter((obj) => obj.type === "collectible" && !obj.collected && rectsOverlap(playerRect, obj) && ["cristalSolar", "cristalGelo", "ervaVenenosa"].includes(obj.item))
      .map((obj) => ({ key: getSaveObjectKey(obj), item: obj.item }));
    collectWorldItemsBeforeBiomePatch();
    let changed = false;
    for (const pending of pendingCustomCollects) {
      const obj = villageObjects.find((entry) => getSaveObjectKey(entry) === pending.key);
      if (!obj || !obj.collected) continue;
      if (pending.item === "cristalSolar" && !questBook.biomeMissions.desert.crystalSolar) {
        questBook.biomeMissions.desert.crystalSolar = true;
        grantUniqueRelic("Cristal Solar");
        awardXp(180, "Cristal Solar");
        playSound("crystal");
        changed = true;
      }
      if (pending.item === "cristalGelo") {
        questBook.biomeMissions.frozen.iceCrystals = Math.min(5, questBook.biomeMissions.frozen.iceCrystals + 1);
        awardXp(50, "Cristal de Gelo");
        changed = true;
      }
      if (pending.item === "ervaVenenosa") {
        questBook.biomeMissions.swamp.poisonousHerbs = Math.min(5, questBook.biomeMissions.swamp.poisonousHerbs + 1);
        awardXp(50, "Erva venenosa");
        changed = true;
      }
    }
    if (changed) {
      updateHud();
      renderInventory();
    }
  };

  const getPlayerSpeedBeforeBiomePatch = getPlayerSpeed;
  getPlayerSpeed = function getPlayerSpeedBiomePatch() {
    let speed = getPlayerSpeedBeforeBiomePatch();
    if (currentScene !== "village") return speed;
    const tileX = Math.floor((player.x + player.width / 2) / TILE);
    const tileY = Math.floor((player.y + player.height / 2) / TILE);
    const tile = getMapTileAt(tileX, tileY);
    if (tile === ENV_TILES.quicksand) speed *= hasRelic("Botas do Deserto") ? 0.9 : 0.55;
    if (tile === ENV_TILES.mud) speed *= hasRelic("Anel contra Veneno") ? 0.88 : 0.62;
    if (tile === ENV_TILES.ice) speed *= hasRelic("Botas Antiderrapantes") ? 1.05 : 1.12;
    return speed;
  };

  let biomeTickTimer = 0;
  const updateBeforeBiomePatch = update;
  update = function updateBiomePatch(delta) {
    updateBeforeBiomePatch(delta);
    if (!gameStarted || gameOver || currentScene !== "village") return;
    ensureBiomeQuestBook();
    biomeTickTimer = Math.max(0, biomeTickTimer - delta);
    const centerX = player.x + player.width / 2;
    const centerY = player.y + player.height / 2;
    const tileX = Math.floor(centerX / TILE);
    const tileY = Math.floor(centerY / TILE);
    const tile = getMapTileAt(tileX, tileY);

    if (tile === ENV_TILES.ice && player.moving) {
      const step = directionVector(player.direction);
      const slideBoost = hasRelic("Botas Antiderrapantes") ? 6 : 18;
      const nextX = player.x + step.x * slideBoost * delta;
      const nextY = player.y + step.y * slideBoost * delta;
      if (canMoveTo(nextX, player.y)) player.x = nextX;
      if (canMoveTo(player.x, nextY)) player.y = nextY;
    }

    for (const obj of villageObjects) {
      if (obj.type !== "biomeFeature" || !obj.damageOnTouch) continue;
      if (rectsOverlap(getPlayerRect(), obj) && biomeTickTimer <= 0 && damageCooldown <= 0) {
        takeDamage(obj.damageOnTouch, obj.x + obj.width / 2, obj.y + obj.height / 2);
        biomeTickTimer = 0.9;
      }
    }

    if (tile === ENV_TILES.quicksand && biomeTickTimer <= 0 && damageCooldown <= 0) {
      takeDamage(1, centerX, centerY);
      spawnFloatingText("Areia movedica!", centerX, centerY - 20, "#fff264");
      biomeTickTimer = 1.1;
    }
    if ((tile === ENV_TILES.toxicWater || tile === ENV_TILES.mud) && biomeTickTimer <= 0 && damageCooldown <= 0 && !hasRelic("Anel contra Veneno")) {
      takeDamage(1, centerX, centerY);
      spawnFloatingText(tile === ENV_TILES.toxicWater ? "Agua venenosa!" : "Lama pesada!", centerX, centerY - 20, "#9aff72");
      biomeTickTimer = 1.1;
    }
    if (Array.isArray(hazardZones)) {
      for (const hazard of hazardZones) {
        if (!hazard || hazard.timer <= 0) continue;
        const distance = Math.hypot(centerX - hazard.x, centerY - hazard.y);
        if (distance <= hazard.radius && biomeTickTimer <= 0 && damageCooldown <= 0 && ["sandstorm", "frost", "poisonCloud"].includes(hazard.type)) {
          takeDamage(hazard.damage || 1, hazard.x, hazard.y);
          biomeTickTimer = 1.0;
        }
      }
    }
    camera.x = clamp(player.x + player.width / 2 - canvas.width / 2, 0, getSceneWidth() - canvas.width);
    camera.y = clamp(player.y + player.height / 2 - canvas.height / 2, 0, getSceneHeight() - canvas.height);
    playerPositionEl.textContent = getAreaName();
  };

  const getAreaNameBeforeBiomePatch = getAreaName;
  getAreaName = function getAreaNameBiomePatch() {
    if (currentScene !== "village") return getSceneName();
    const tileX = Math.floor(player.x / TILE);
    const tileY = Math.floor(player.y / TILE);
    if (biomeContains(BIOME_BOUNDS.desert, tileX, tileY)) return "Vila do Deserto";
    if (biomeContains(BIOME_BOUNDS.frozen, tileX, tileY)) return "Vila Congelada";
    if (biomeContains(BIOME_BOUNDS.swamp, tileX, tileY)) return "Pantano dos Sussurros";
    return getAreaNameBeforeBiomePatch();
  };

  const renderMissionsPanelBeforeBiomePatch = renderMissionsPanel;
  renderMissionsPanel = function renderMissionsPanelBiomePatch() {
    renderMissionsPanelBeforeBiomePatch();
    ensureBiomeQuestBook();
    if (!missionsList) return;
    const extraRows = [
      `<li><span>Deserto</span><strong>Oasis ${questBook.biomeMissions.desert.oasisFound ? "ok" : "?"} | Escorpioes ${questBook.biomeMissions.desert.scorpions}/5 | Piramide ${questBook.biomeMissions.desert.pyramidOpened ? "ok" : "?"} | Cristal ${questBook.biomeMissions.desert.crystalSolar ? "ok" : "?"}</strong></li>`,
      `<li><span>Congelado</span><strong>Tochas ${questBook.biomeMissions.frozen.torches}/4 | Cristais ${questBook.biomeMissions.frozen.iceCrystals}/5 | Lobo branco ${questBook.biomeMissions.frozen.whiteWolfDefeated ? "ok" : "?"} | NPC ${questBook.biomeMissions.frozen.npcRescued ? "ok" : "?"}</strong></li>`,
      `<li><span>Pantano</span><strong>Ervas ${questBook.biomeMissions.swamp.poisonousHerbs}/5 | Cabana ${questBook.biomeMissions.swamp.witchCabinFound ? "ok" : "?"} | Agua ${questBook.biomeMissions.swamp.waterPurified ? "ok" : "?"} | Sapos ${questBook.biomeMissions.swamp.giantFrogs}/4</strong></li>`
    ];
    missionsList.innerHTML += extraRows.join("");
  };

  const getCompactMissionTextBeforeBiomePatch = getCompactMissionText;
  getCompactMissionText = function getCompactMissionTextBiomePatch() {
    ensureBiomeQuestBook();
    const area = getAreaName();
    if (area === "Vila do Deserto") {
      if (!questBook.biomeMissions.desert.oasisFound) return "Deserto: ache o oasis perdido";
      if (questBook.biomeMissions.desert.scorpions < 5) return `Deserto: escorpioes ${questBook.biomeMissions.desert.scorpions}/5`;
      if (!questBook.biomeMissions.desert.pyramidOpened) return "Deserto: abra a piramide antiga";
      if (!questBook.biomeMissions.desert.crystalSolar) return "Deserto: pegue o cristal solar";
    }
    if (area === "Vila Congelada") {
      if (questBook.biomeMissions.frozen.torches < 4) return `Gelo: tochas ${questBook.biomeMissions.frozen.torches}/4`;
      if (!questBook.biomeMissions.frozen.whiteWolfDefeated) return "Gelo: derrote o lobo branco";
      if (questBook.biomeMissions.frozen.iceCrystals < 5) return `Gelo: cristais ${questBook.biomeMissions.frozen.iceCrystals}/5`;
      if (!questBook.biomeMissions.frozen.npcRescued) return "Gelo: salve o NPC preso";
    }
    if (area === "Pantano dos Sussurros") {
      if (questBook.biomeMissions.swamp.poisonousHerbs < 5) return `Pantano: ervas ${questBook.biomeMissions.swamp.poisonousHerbs}/5`;
      if (!questBook.biomeMissions.swamp.witchCabinFound) return "Pantano: ache a cabana da bruxa";
      if (!questBook.biomeMissions.swamp.waterPurified) return "Pantano: purifique a agua";
      if (questBook.biomeMissions.swamp.giantFrogs < 4) return `Pantano: sapos ${questBook.biomeMissions.swamp.giantFrogs}/4`;
    }
    return getCompactMissionTextBeforeBiomePatch();
  };

  const getInventoryItemsBeforeBiomePatch = getInventoryItems;
  getInventoryItems = function getInventoryItemsBiomePatch() {
    const items = getInventoryItemsBeforeBiomePatch();
    ensureBiomeInventory();
    for (const relic of inventory.biomeRelics) {
      items.push({
        id: `relic-${String(relic).replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`,
        name: relic,
        icon: "R",
        quantity: 1,
        category: "raros",
        typeLabel: "Bioma",
        rarity: "lendario",
        description: "Item unico obtido nas novas regioes expandidas do mapa.",
        effect: "Recompensa especial das aventuras pelos novos biomas.",
        locked: true
      });
    }
    return items;
  };

  const drawMiniMapBeforeBiomePatch = drawMiniMap;
  drawMiniMap = function drawMiniMapBiomePatch() {
    if (currentScene !== "village") {
      drawMiniMapBeforeBiomePatch();
      return;
    }
    miniCtx.clearRect(0, 0, miniMapCanvas.width, miniMapCanvas.height);
    miniCtx.fillStyle = "rgba(39, 48, 82, 0.95)";
    miniCtx.fillRect(0, 0, miniMapCanvas.width, miniMapCanvas.height);
    const sx = miniMapCanvas.width / EXT_WORLD_WIDTH;
    const sy = miniMapCanvas.height / EXT_WORLD_HEIGHT;
    for (let y = 0; y < getVillageMapRows(); y++) {
      for (let x = 0; x < getVillageMapCols(); x++) {
        const tile = worldMap[y][x];
        let color = "#82dc83";
        if (tile === "W") color = "#48a7e6";
        else if (tile === ENV_TILES.sand || tile === ENV_TILES.quicksand) color = "#ddb45c";
        else if (tile === ENV_TILES.snow || tile === ENV_TILES.ice) color = tile === ENV_TILES.ice ? "#bfe6ff" : "#edf5ff";
        else if (tile === ENV_TILES.swamp || tile === ENV_TILES.mud || tile === ENV_TILES.toxicWater) color = tile === ENV_TILES.toxicWater ? "#4f8f66" : "#4c674d";
        else if (tile === "D") color = "#9c5744";
        else if (tile === "P") color = "#f2c27d";
        miniCtx.fillStyle = color;
        miniCtx.fillRect(x * TILE * sx, y * TILE * sy, Math.ceil(TILE * sx), Math.ceil(TILE * sy));
      }
    }
    miniCtx.fillStyle = "#fff264";
    for (const obj of villageObjects) {
      if (["house", "playerHouse", "shop"].includes(obj.type)) {
        miniCtx.fillRect(obj.x * sx, obj.y * sy, Math.max(2, obj.width * sx), Math.max(2, obj.height * sy));
      }
      if (obj.type === "biomeFeature" && ["sunTemple", "igloo", "abandonedHouse", "woodLodge", "oasis"].includes(obj.kind)) {
        miniCtx.fillRect(obj.x * sx, obj.y * sy, Math.max(2, obj.width * sx), Math.max(2, obj.height * sy));
      }
    }
    miniCtx.fillStyle = "#ff4f62";
    for (const obj of villageObjects) {
      if (obj.type === "enemy" && obj.boss && obj.alive) miniCtx.fillRect(obj.x * sx - 2, obj.y * sy - 2, 6, 6);
    }
    miniCtx.fillStyle = "#55e8ff";
    for (const obj of villageObjects) {
      if (obj.type === "npc" && ["Sahir", "Astrid", "Mora"].includes(obj.name)) miniCtx.fillRect(obj.x * sx - 2, obj.y * sy - 2, 5, 5);
    }
    miniCtx.fillStyle = "#d24c63";
    miniCtx.fillRect(player.x * sx - 3, player.y * sy - 3, 7, 7);
  };

  if (currentScene === "village") {
    objects = villageObjects;
    colliders = objects.filter((obj) => obj.solid);
    interactables = objects.filter((obj) => obj.message);
  }
}


// === Performance optimization patch for mobile/PC ===
if (typeof window !== "undefined" && !window.ETERNAL_RIFT_PERFORMANCE_PATCH) {
  window.ETERNAL_RIFT_PERFORMANCE_PATCH = true;

  const performanceSettings = {
    lite: urlParams.get("lite") === "1" || urlParams.get("leve") === "1" || Boolean(isMobile) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4),
    fpsMobile: 30,
    fpsPcLite: 45,
    fpsPc: 60,
    minimapCacheMs: 900,
    enemyWakeDistance: 920,
    bossWakeDistance: 1500,
    maxParticlesMobile: 70,
    maxProjectilesMobile: 55,
    maxFloatingTextsMobile: 24
  };

  window.ER_PERFORMANCE = performanceSettings;

  function getPerformanceFps() {
    if (performanceSettings.lite && isMobile) return performanceSettings.fpsMobile;
    if (performanceSettings.lite) return performanceSettings.fpsPcLite;
    return performanceSettings.fpsPc;
  }

  function setLiteMode(enabled, showToastMessage = true) {
    performanceSettings.lite = Boolean(enabled);
    if (showToastMessage && typeof showHudToast === "function") {
      showHudToast(performanceSettings.lite ? "Modo leve ativado" : "Modo leve desativado", 1.8);
    }
  }

  window.ETERNAL_RIFT_SET_LITE_MODE = setLiteMode;

  const updateDeviceModeBeforePerformance = updateDeviceMode;
  updateDeviceMode = function updateDeviceModePerformance() {
    updateDeviceModeBeforePerformance();
    if (isMobile) performanceSettings.lite = true;
  };

  window.addEventListener("keydown", (event) => {
    if (event.key === "F2") {
      event.preventDefault();
      setLiteMode(!performanceSettings.lite, true);
    }
  });

  function distanceToPlayer(obj) {
    const px = player.x + player.width / 2;
    const py = player.y + player.height / 2;
    return Math.hypot((obj.x + obj.width / 2) - px, (obj.y + obj.height / 2) - py);
  }

  function isEnemyAwakeForPerformance(obj) {
    if (!obj || obj.type !== "enemy") return true;
    if (!obj.alive) return true;
    if (isOnCamera(obj, 220)) return true;
    const maxDistance = obj.boss ? performanceSettings.bossWakeDistance : performanceSettings.enemyWakeDistance;
    return distanceToPlayer(obj) <= maxDistance;
  }

  const updateEnemiesBeforePerformance = updateEnemies;
  updateEnemies = function updateEnemiesPerformance(delta) {
    if (!performanceSettings.lite || currentScene !== "village") {
      updateEnemiesBeforePerformance(delta);
      return;
    }

    const originalList = villageObjects.slice();
    const filteredList = originalList.filter((obj) => obj.type !== "enemy" || isEnemyAwakeForPerformance(obj));
    villageObjects.length = 0;
    villageObjects.push(...filteredList);

    try {
      updateEnemiesBeforePerformance(delta);
    } finally {
      villageObjects.length = 0;
      villageObjects.push(...originalList);
    }
  };

  const updateNpcsBeforePerformance = updateNpcs;
  updateNpcs = function updateNpcsPerformance(delta) {
    if (!performanceSettings.lite || currentScene !== "village") {
      updateNpcsBeforePerformance(delta);
      return;
    }

    const originalList = villageObjects.slice();
    const filteredList = originalList.filter((obj) => obj.type !== "npc" || isOnCamera(obj, 420) || distanceToPlayer(obj) < 520);
    villageObjects.length = 0;
    villageObjects.push(...filteredList);

    try {
      updateNpcsBeforePerformance(delta);
    } finally {
      villageObjects.length = 0;
      villageObjects.push(...originalList);
    }
  };

  const updateBeforePerformance = update;
  update = function updatePerformance(delta) {
    updateBeforePerformance(delta);

    if (!performanceSettings.lite) return;

    if (Array.isArray(projectiles) && projectiles.length > performanceSettings.maxProjectilesMobile) {
      projectiles.splice(0, projectiles.length - performanceSettings.maxProjectilesMobile);
    }
    if (Array.isArray(enemyProjectiles) && enemyProjectiles.length > performanceSettings.maxProjectilesMobile) {
      enemyProjectiles.splice(0, enemyProjectiles.length - performanceSettings.maxProjectilesMobile);
    }
    if (Array.isArray(floatingTexts) && floatingTexts.length > performanceSettings.maxFloatingTextsMobile) {
      floatingTexts.splice(0, floatingTexts.length - performanceSettings.maxFloatingTextsMobile);
    }
    if (Array.isArray(hazardZones) && hazardZones.length > 28) {
      hazardZones.splice(0, hazardZones.length - 28);
    }
    if (Array.isArray(dashTrails) && dashTrails.length > 16) {
      dashTrails.splice(0, dashTrails.length - 16);
    }
  };

  const drawSceneGroundOverlayBeforePerformance = typeof drawSceneGroundOverlayV2 === "function" ? drawSceneGroundOverlayV2 : null;
  if (drawSceneGroundOverlayBeforePerformance) {
    let overlaySkip = 0;
    drawSceneGroundOverlayV2 = function drawSceneGroundOverlayPerformance() {
      if (!performanceSettings.lite) {
        drawSceneGroundOverlayBeforePerformance();
        return;
      }

      overlaySkip = (overlaySkip + 1) % (isMobile ? 3 : 2);
      if (overlaySkip !== 0) return;
      drawSceneGroundOverlayBeforePerformance();
    };
  }

  const drawProjectilesBeforePerformance = drawProjectiles;
  drawProjectiles = function drawProjectilesPerformance() {
    if (!performanceSettings.lite) {
      drawProjectilesBeforePerformance();
      return;
    }

    const savedProjectiles = projectiles.slice();
    const savedEnemyProjectiles = enemyProjectiles.slice();
    try {
      projectiles.length = 0;
      projectiles.push(...savedProjectiles.filter((obj) => isOnCamera(obj, 120)));
      enemyProjectiles.length = 0;
      enemyProjectiles.push(...savedEnemyProjectiles.filter((obj) => obj.type === "bossWave" || isOnCamera(obj, 120)));
      drawProjectilesBeforePerformance();
    } finally {
      projectiles.length = 0;
      projectiles.push(...savedProjectiles);
      enemyProjectiles.length = 0;
      enemyProjectiles.push(...savedEnemyProjectiles);
    }
  };

  const drawHazardsBeforePerformance = drawHazards;
  drawHazards = function drawHazardsPerformance() {
    if (!performanceSettings.lite) {
      drawHazardsBeforePerformance();
      return;
    }

    const savedHazards = hazardZones.slice();
    try {
      hazardZones.length = 0;
      hazardZones.push(...savedHazards.filter((obj) => isOnCamera({
        x: obj.x - obj.radius,
        y: obj.y - obj.radius,
        width: obj.radius * 2,
        height: obj.radius * 2
      }, 80)));
      drawHazardsBeforePerformance();
    } finally {
      hazardZones.length = 0;
      hazardZones.push(...savedHazards);
    }
  };

  const minimapCacheCanvas = document.createElement("canvas");
  const minimapCacheCtx = minimapCacheCanvas.getContext("2d");
  let minimapCacheTime = 0;
  let minimapCacheScene = "";
  let minimapCacheWidth = 0;
  let minimapCacheHeight = 0;

  function getMiniTileColor(tile) {
    if (tile === "W") return "#48a7e6";
    if (tile === "A" || tile === "X") return "#ddb45c";
    if (tile === "N") return "#edf5ff";
    if (tile === "L") return "#bfe6ff";
    if (tile === "H" || tile === "U") return "#4c674d";
    if (tile === "V") return "#4f8f66";
    if (tile === "D") return "#9c5744";
    if (tile === "P") return "#f2c27d";
    if (tile === "F") return "#5f9f55";
    return "#82dc83";
  }

  function redrawVillageMinimapBase(sx, sy) {
    minimapCacheCtx.clearRect(0, 0, minimapCacheCanvas.width, minimapCacheCanvas.height);
    minimapCacheCtx.fillStyle = "#82dc83";
    minimapCacheCtx.fillRect(0, 0, minimapCacheCanvas.width, minimapCacheCanvas.height);

    const rows = worldMap.length;
    const cols = worldMap[0]?.length || MAP_COLS;
    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < cols; x += 1) {
        const tile = worldMap[y][x];
        minimapCacheCtx.fillStyle = getMiniTileColor(tile);
        minimapCacheCtx.fillRect(x * TILE * sx, y * TILE * sy, Math.ceil(TILE * sx), Math.ceil(TILE * sy));
      }
    }

    minimapCacheCtx.fillStyle = "#fff264";
    for (const obj of villageObjects) {
      if (["house", "playerHouse", "shop"].includes(obj.type)) {
        minimapCacheCtx.fillRect(obj.x * sx, obj.y * sy, Math.max(2, obj.width * sx), Math.max(2, obj.height * sy));
      }
      if (obj.type === "biomeFeature" && ["sunTemple", "igloo", "abandonedHouse", "woodLodge", "oasis"].includes(obj.kind)) {
        minimapCacheCtx.fillRect(obj.x * sx, obj.y * sy, Math.max(2, obj.width * sx), Math.max(2, obj.height * sy));
      }
    }
  }

  const drawMiniMapBeforePerformance = drawMiniMap;
  drawMiniMap = function drawMiniMapPerformance() {
    if (currentScene !== "village") {
      drawMiniMapBeforePerformance();
      return;
    }

    const now = performance.now();
    const mapWidth = getSceneWidth();
    const mapHeight = getSceneHeight();
    const sx = miniMapCanvas.width / mapWidth;
    const sy = miniMapCanvas.height / mapHeight;

    if (
      minimapCacheCanvas.width !== miniMapCanvas.width ||
      minimapCacheCanvas.height !== miniMapCanvas.height ||
      minimapCacheScene !== currentScene ||
      minimapCacheWidth !== mapWidth ||
      minimapCacheHeight !== mapHeight ||
      now - minimapCacheTime > performanceSettings.minimapCacheMs
    ) {
      minimapCacheCanvas.width = miniMapCanvas.width;
      minimapCacheCanvas.height = miniMapCanvas.height;
      minimapCacheScene = currentScene;
      minimapCacheWidth = mapWidth;
      minimapCacheHeight = mapHeight;
      minimapCacheTime = now;
      redrawVillageMinimapBase(sx, sy);
    }

    miniCtx.clearRect(0, 0, miniMapCanvas.width, miniMapCanvas.height);
    miniCtx.drawImage(minimapCacheCanvas, 0, 0);

    miniCtx.fillStyle = "#ff4f62";
    for (const obj of villageObjects) {
      if (obj.type === "enemy" && obj.boss && obj.alive) {
        miniCtx.fillRect(obj.x * sx - 2, obj.y * sy - 2, 6, 6);
      }
    }

    miniCtx.fillStyle = "#55e8ff";
    for (const obj of villageObjects) {
      if (obj.type === "npc" && ["Nico", "Vendedor", "Beto", "Sahir", "Astrid", "Mora"].includes(obj.name)) {
        miniCtx.fillRect(obj.x * sx - 2, obj.y * sy - 2, 5, 5);
      }
    }

    miniCtx.fillStyle = "#d24c63";
    miniCtx.fillRect(player.x * sx - 3, player.y * sy - 3, 7, 7);
  };

  let lastOptimizedFrameTime = 0;
  gameLoop = function gameLoopPerformance(time) {
    const targetFrameMs = 1000 / getPerformanceFps();

    if (time - lastOptimizedFrameTime < targetFrameMs) {
      requestAnimationFrame(gameLoop);
      return;
    }

    lastOptimizedFrameTime = time;
    const delta = Math.min((time - lastTime) / 1000, performanceSettings.lite ? 0.06 : 0.05);
    lastTime = time;

    try {
      update(delta);
      draw();
    } catch (error) {
      showErrorMessage(error);
    }

    requestAnimationFrame(gameLoop);
  };

  if (typeof showHudToast === "function") {
    setTimeout(() => {
      if (performanceSettings.lite) showHudToast("Modo leve automatico ativo. F2 alterna.", 2.4);
    }, 800);
  }
}

// === Camera zoom-out + medieval menu music patch ===
if (typeof window !== "undefined" && !window.ETERNAL_RIFT_CAMERA_MENU_MUSIC_PATCH) {
  window.ETERNAL_RIFT_CAMERA_MENU_MUSIC_PATCH = true;

  const CAMERA_ZOOM_DEFAULT_PC = 0.80;
  const CAMERA_ZOOM_DEFAULT_MOBILE = 0.88;
  let lastCameraCanvasWidth = 0;
  let lastCameraCanvasHeight = 0;

  function getCameraZoomOutValue() {
    const requested = Number(urlParams.get("zoom"));
    if (Number.isFinite(requested) && requested >= 0.65 && requested <= 1.15) return requested;
    return isMobile ? CAMERA_ZOOM_DEFAULT_MOBILE : CAMERA_ZOOM_DEFAULT_PC;
  }

  const ensureCanvasSizeBeforeCameraZoom = ensureCanvasSize;
  ensureCanvasSize = function ensureCanvasSizeCameraZoomPatch() {
    ensureCanvasSizeBeforeCameraZoom();

    const rect = canvas.getBoundingClientRect();
    const cssWidth = Math.max(320, Math.round(rect.width || window.innerWidth || 960));
    const cssHeight = Math.max(240, Math.round(rect.height || window.innerHeight || 640));
    const zoom = getCameraZoomOutValue();
    const targetWidth = Math.round(cssWidth / zoom);
    const targetHeight = Math.round(cssHeight / zoom);

    if (Math.abs(canvas.width - targetWidth) > 2 || Math.abs(canvas.height - targetHeight) > 2) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      lastCameraCanvasWidth = targetWidth;
      lastCameraCanvasHeight = targetHeight;
    }

    if (miniMapCanvas.width <= 0) miniMapCanvas.width = 170;
    if (miniMapCanvas.height <= 0) miniMapCanvas.height = 124;
  };

  let medievalMenuTimer = null;
  let medievalMenuGain = null;
  let medievalMenuStep = 0;
  let menuMusicStartedOnce = false;

  function playMenuTone(frequency, startOffset, duration, volume = 0.08, type = "triangle") {
    if (!audioContext || !medievalMenuGain) return;
    const now = audioContext.currentTime + startOffset;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    oscillator.connect(gain);
    gain.connect(medievalMenuGain);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.04);
  }

  function playMedievalMenuBar() {
    if (!audioContext || !medievalMenuGain || startScreen?.classList.contains("hidden")) return;

    const melody = [392, 440, 523, 494, 440, 392, 330, 349, 392, 330, 294, 330, 349, 392, 440, 392];
    const bass = [196, 196, 220, 220, 174, 174, 196, 196];
    const note = melody[medievalMenuStep % melody.length];
    const bassNote = bass[Math.floor(medievalMenuStep / 2) % bass.length];

    playMenuTone(note, 0, 0.36, 0.07, "triangle");
    if (medievalMenuStep % 2 === 0) {
      playMenuTone(bassNote, 0, 0.62, 0.035, "sine");
      playMenuTone(note * 1.5, 0.02, 0.22, 0.024, "sine");
    }

    medievalMenuStep += 1;
  }

  function startMedievalMenuMusic() {
    ensureAudio();
    if (!audioContext || medievalMenuTimer || startScreen?.classList.contains("hidden")) return;

    try {
      if (audioContext.state === "suspended") audioContext.resume();
    } catch (error) {
      return;
    }

    medievalMenuGain = audioContext.createGain();
    medievalMenuGain.gain.value = isMobile ? 0.035 : 0.045;
    medievalMenuGain.connect(audioContext.destination);
    medievalMenuStep = 0;
    playMedievalMenuBar();
    medievalMenuTimer = setInterval(playMedievalMenuBar, 380);
    menuMusicStartedOnce = true;
  }

  function stopMedievalMenuMusic() {
    if (medievalMenuTimer) {
      clearInterval(medievalMenuTimer);
      medievalMenuTimer = null;
    }
    if (medievalMenuGain && audioContext) {
      try {
        medievalMenuGain.gain.cancelScheduledValues(audioContext.currentTime);
        medievalMenuGain.gain.setValueAtTime(medievalMenuGain.gain.value, audioContext.currentTime);
        medievalMenuGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.35);
        setTimeout(() => {
          try { medievalMenuGain?.disconnect(); } catch (error) { return; }
          medievalMenuGain = null;
        }, 420);
      } catch (error) {
        medievalMenuGain = null;
      }
    }
  }

  function tryStartMenuMusicFromUserGesture() {
    if (!gameStarted && startScreen && !startScreen.classList.contains("hidden")) {
      startMedievalMenuMusic();
    }
  }

  startScreen?.addEventListener("pointerdown", tryStartMenuMusicFromUserGesture);
  startScreen?.addEventListener("click", tryStartMenuMusicFromUserGesture);
  document.addEventListener("keydown", () => {
    if (!gameStarted && startScreen && !startScreen.classList.contains("hidden")) startMedievalMenuMusic();
  });

  const startNewGameBeforeMenuMusicPatch = startNewGame;
  startNewGame = function startNewGameCameraMenuMusicPatch() {
    stopMedievalMenuMusic();
    return startNewGameBeforeMenuMusicPatch();
  };

  const startGameBeforeMenuMusicPatch = startGame;
  startGame = function startGameCameraMenuMusicPatch(loadSave = false) {
    stopMedievalMenuMusic();
    return startGameBeforeMenuMusicPatch(loadSave);
  };

  const updateDebugPanelBeforeCameraMusicPatch = updateDebugPanel;
  updateDebugPanel = function updateDebugPanelCameraMusicPatch(delta) {
    updateDebugPanelBeforeCameraMusicPatch(delta);
    if (!debugEnabled || !debugPanel || debugPanel.classList.contains("hidden")) return;
    const zoom = getCameraZoomOutValue();
    debugPanel.innerHTML += `<br>Camera: ${Math.round(zoom * 100)}% | Canvas: ${canvas.width}x${canvas.height}<br>Musica menu: ${medievalMenuTimer ? "tocando" : menuMusicStartedOnce ? "parada" : "aguardando toque"}`;
  };
}

// === Celestial dimension expansion patch ===
if (typeof window !== "undefined" && !window.ETERNAL_RIFT_CELESTIAL_DIMENSION_PATCH) {
  window.ETERNAL_RIFT_CELESTIAL_DIMENSION_PATCH = true;

  const CELESTIAL_COLS = 56;
  const CELESTIAL_ROWS = 42;
  const CELESTIAL_WIDTH = CELESTIAL_COLS * TILE;
  const CELESTIAL_HEIGHT = CELESTIAL_ROWS * TILE;
  const CELESTIAL_TILES = {
    VOID: "Z",
    MARBLE: "Y",
    CLOUD: "J",
    GOLD: "K",
    WATER: "R",
    STAIRS: "S",
    STAR: "E"
  };
  const CELESTIAL_ENTRY_TILE = { x: 27, y: 36 };
  const CELESTIAL_DESERT_PORTAL_TILE = { x: 122, y: 12 };
  const celestialDimensionMap = createCelestialDimensionMap();
  const celestialDimensionObjects = [];
  let celestialEventTimer = 26;
  let celestialCurrentEvent = "";
  let celestialEventDuration = 0;
  let celestialFallCooldown = 0;

  function fillCelestialRect(map, startX, startY, width, height, tile) {
    for (let y = startY; y < startY + height; y++) {
      for (let x = startX; x < startX + width; x++) {
        if (y >= 0 && y < map.length && x >= 0 && x < map[0].length) map[y][x] = tile;
      }
    }
  }

  function paintCelestialEllipse(map, centerX, centerY, radiusX, radiusY, tile) {
    for (let y = centerY - radiusY; y <= centerY + radiusY; y++) {
      for (let x = centerX - radiusX; x <= centerX + radiusX; x++) {
        if (y < 0 || y >= map.length || x < 0 || x >= map[0].length) continue;
        const dx = (x - centerX) / Math.max(1, radiusX);
        const dy = (y - centerY) / Math.max(1, radiusY);
        if (dx * dx + dy * dy <= 1) map[y][x] = tile;
      }
    }
  }

  function lineCelestial(map, x1, y1, x2, y2, thickness, tile) {
    const minX = Math.min(x1, x2) - thickness;
    const maxX = Math.max(x1, x2) + thickness;
    const minY = Math.min(y1, y2) - thickness;
    const maxY = Math.max(y1, y2) + thickness;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const lenSq = dx * dx + dy * dy || 1;
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        if (y < 0 || y >= map.length || x < 0 || x >= map[0].length) continue;
        const t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / lenSq));
        const px = x1 + dx * t;
        const py = y1 + dy * t;
        const dist = Math.hypot(x - px, y - py);
        if (dist <= thickness) map[y][x] = tile;
      }
    }
  }

  function createCelestialDimensionMap() {
    const map = Array.from({ length: CELESTIAL_ROWS }, () => Array(CELESTIAL_COLS).fill(CELESTIAL_TILES.VOID));

    // Templo principal.
    fillCelestialRect(map, 18, 1, 20, 10, CELESTIAL_TILES.MARBLE);
    fillCelestialRect(map, 21, 0, 14, 2, CELESTIAL_TILES.STAIRS);
    fillCelestialRect(map, 23, 9, 10, 7, CELESTIAL_TILES.MARBLE);
    fillCelestialRect(map, 26, 6, 4, 7, CELESTIAL_TILES.GOLD);
    fillCelestialRect(map, 24, 4, 8, 2, CELESTIAL_TILES.STAIRS);

    // Praca central e entrada.
    fillCelestialRect(map, 12, 16, 32, 16, CELESTIAL_TILES.MARBLE);
    fillCelestialRect(map, 22, 31, 12, 5, CELESTIAL_TILES.MARBLE);
    fillCelestialRect(map, 24, 34, 8, 6, CELESTIAL_TILES.STAIRS);
    fillCelestialRect(map, 22, 39, 12, 2, CELESTIAL_TILES.MARBLE);

    // Jardim das nuvens.
    paintCelestialEllipse(map, 10, 24, 8, 7, CELESTIAL_TILES.CLOUD);
    fillCelestialRect(map, 6, 21, 9, 6, CELESTIAL_TILES.MARBLE);
    fillCelestialRect(map, 8, 23, 4, 3, CELESTIAL_TILES.WATER);
    fillCelestialRect(map, 14, 24, 4, 4, CELESTIAL_TILES.CLOUD);

    // Biblioteca divina.
    paintCelestialEllipse(map, 46, 22, 8, 7, CELESTIAL_TILES.CLOUD);
    fillCelestialRect(map, 41, 18, 10, 8, CELESTIAL_TILES.MARBLE);
    fillCelestialRect(map, 44, 26, 5, 4, CELESTIAL_TILES.CLOUD);

    // Arena dos guardioes.
    paintCelestialEllipse(map, 46, 8, 8, 6, CELESTIAL_TILES.MARBLE);
    fillCelestialRect(map, 44, 6, 4, 4, CELESTIAL_TILES.STAR);

    // Ilhas flutuantes pequenas.
    paintCelestialEllipse(map, 28, 14, 5, 3, CELESTIAL_TILES.CLOUD);
    paintCelestialEllipse(map, 6, 11, 5, 3, CELESTIAL_TILES.CLOUD);
    paintCelestialEllipse(map, 51, 13, 4, 3, CELESTIAL_TILES.CLOUD);
    paintCelestialEllipse(map, 19, 8, 4, 3, CELESTIAL_TILES.CLOUD);

    // Pontes de luz e nuvens solidas.
    lineCelestial(map, 28, 15, 28, 30, 1, CELESTIAL_TILES.GOLD);
    lineCelestial(map, 16, 24, 23, 24, 1, CELESTIAL_TILES.GOLD);
    lineCelestial(map, 33, 24, 41, 24, 1, CELESTIAL_TILES.GOLD);
    lineCelestial(map, 31, 16, 42, 10, 1, CELESTIAL_TILES.GOLD);
    lineCelestial(map, 24, 13, 20, 10, 1, CELESTIAL_TILES.GOLD);
    lineCelestial(map, 12, 17, 22, 18, 1, CELESTIAL_TILES.CLOUD);
    lineCelestial(map, 34, 18, 49, 14, 1, CELESTIAL_TILES.CLOUD);

    // Peças decorativas de estrela no piso.
    for (const [sx, sy] of [[17, 20], [38, 20], [28, 23], [28, 27], [24, 30], [32, 30], [9, 28], [48, 29]]) {
      if (map[sy] && map[sy][sx]) map[sy][sx] = CELESTIAL_TILES.STAR;
    }

    return map;
  }

  function celestialFeature(tileX, tileY, kind, options = {}) {
    const width = options.width || 24;
    const height = options.height || 24;
    return {
      type: "celestialFeature",
      kind,
      role: options.role || "",
      x: tileX * TILE + (options.offsetX ?? Math.max(0, (TILE - width) / 2)),
      y: tileY * TILE + (options.offsetY ?? Math.max(0, (TILE - height) / 2)),
      width,
      height,
      solid: Boolean(options.solid),
      message: options.message || "",
      points: options.points || 0,
      rewardItems: options.rewardItems || null,
      chestId: options.chestId || "",
      opened: Boolean(options.opened),
      platformGroup: options.platformGroup || "",
      active: options.active !== false,
      blinkOffset: options.blinkOffset || 0,
      checkpoint: Boolean(options.checkpoint)
    };
  }

  function celestialCrystal(tileX, tileY, crystalKey, title, message) {
    return {
      type: "celestialCrystal",
      crystalKey,
      title,
      x: tileX * TILE + 6,
      y: tileY * TILE - 2,
      width: 22,
      height: 34,
      solid: false,
      message,
      activated: false,
      activatedAt: 0
    };
  }

  function celestialChest(tileX, tileY, chestId, rewardItems, requiresBoss = "") {
    return {
      type: "celestialChest",
      x: tileX * TILE,
      y: tileY * TILE + 8,
      width: TILE * 2,
      height: TILE,
      solid: true,
      message: "Bau celestial: um fecho de luz protege o conteudo.",
      chestId,
      rewardItems: rewardItems || [],
      requiresBoss,
      opened: false
    };
  }

  function celestialGate(tileX, tileY) {
    return {
      type: "celestialGate",
      role: "celestialEntry",
      x: tileX * TILE,
      y: tileY * TILE - 8,
      width: TILE * 2,
      height: TILE * 3,
      solid: false,
      message: "Portal Sagrado: pressione E para subir a Dimensao Celestial."
    };
  }

  function celestialCollectible(tileX, tileY, item, label, message = "") {
    return {
      type: "celestialCollectible",
      item,
      label,
      x: tileX * TILE + 8,
      y: tileY * TILE + 8,
      width: 16,
      height: 16,
      solid: false,
      collected: false,
      message
    };
  }

  function ensureCelestialState() {
    if (!questBook.celestial || typeof questBook.celestial !== "object") {
      questBook.celestial = {};
    }
    const c = questBook.celestial;
    if (!c.crystals || typeof c.crystals !== "object") c.crystals = { light: false, aurora: false, stars: false };
    if (!c.openedChests || typeof c.openedChests !== "object") c.openedChests = {};
    if (!c.eventsSeen || typeof c.eventsSeen !== "object") c.eventsSeen = {};
    if (!c.resources || typeof c.resources !== "object") c.resources = {};
    c.entered = Boolean(c.entered);
    c.portalOpen = Boolean(c.portalOpen);
    c.bridgeOpen = Boolean(c.bridgeOpen);
    c.introDone = Boolean(c.introDone);
    c.starPuzzleSolved = Boolean(c.starPuzzleSolved);
    c.lightPuzzleSolved = Boolean(c.lightPuzzleSolved);
    c.libraryPuzzleSolved = Boolean(c.libraryPuzzleSolved);
    c.seraphPurified = Boolean(c.seraphPurified);
    c.guardianChallengeDone = Boolean(c.guardianChallengeDone);
    c.angelQuestDone = Boolean(c.angelQuestDone);
    c.dashCelestialUnlocked = Boolean(c.dashCelestialUnlocked);
    c.feathers = Number.isFinite(c.feathers) ? c.feathers : 0;
    if (!c.checkpoint || !Number.isFinite(c.checkpoint.x) || !Number.isFinite(c.checkpoint.y)) {
      c.checkpoint = {
        x: CELESTIAL_ENTRY_TILE.x * TILE + 4,
        y: CELESTIAL_ENTRY_TILE.y * TILE + 4
      };
    }
  }

  function ensureCelestialInventory() {
    if (!Array.isArray(inventory.celestialResources)) inventory.celestialResources = [];
    if (!Array.isArray(inventory.celestialRelics)) inventory.celestialRelics = [];
    if (!Array.isArray(inventory.itensBoss)) inventory.itensBoss = [];
  }

  function addCelestialInventoryItem(name, type = "resource") {
    ensureCelestialInventory();
    const list = type === "relic" ? inventory.celestialRelics : inventory.celestialResources;
    if (!list.includes(name)) list.push(name);
    if (type === "relic" && !inventory.itensBoss.includes(name)) inventory.itensBoss.push(name);
  }

  function syncCelestialObjectState() {
    ensureCelestialState();
    ensureCelestialInventory();
    for (const obj of celestialDimensionObjects) {
      if (obj.type === "celestialCrystal") {
        obj.activated = Boolean(questBook.celestial.crystals[obj.crystalKey]);
        obj.activatedAt = obj.activated ? performance.now() - 1000 : 0;
      }
      if (obj.type === "celestialChest") {
        obj.opened = Boolean(questBook.celestial.openedChests[obj.chestId]);
      }
    }
  }

  function countActivatedCelestialCrystals() {
    ensureCelestialState();
    return Object.values(questBook.celestial.crystals).filter(Boolean).length;
  }

  function areAllCelestialCrystalsActive() {
    return countActivatedCelestialCrystals() >= 3;
  }

  function updateCelestialProgress() {
    ensureCelestialState();
    questBook.celestial.bridgeOpen = areAllCelestialCrystalsActive();
    questBook.celestial.portalOpen = questBook.celestial.bridgeOpen && questBook.celestial.seraphPurified;
  }

  function setCelestialCheckpoint(x, y) {
    ensureCelestialState();
    questBook.celestial.checkpoint = { x, y };
  }

  function resetCelestialPosition() {
    ensureCelestialState();
    player.x = questBook.celestial.checkpoint.x;
    player.y = questBook.celestial.checkpoint.y;
    showHudToast("Voce caiu no vazio e voltou para a ponte inicial.");
    spawnFloatingText("Retorno celestial", player.x, player.y - 18, "#9defff");
    celestialFallCooldown = 1.2;
  }

  function enterCelestialDimension() {
    ensureCelestialState();
    ensureCelestialInventory();
    setActiveScene("celestialDimension");
    player.x = CELESTIAL_ENTRY_TILE.x * TILE + 4;
    player.y = CELESTIAL_ENTRY_TILE.y * TILE + 4;
    setCelestialCheckpoint(player.x, player.y);
    player.direction = "up";
    player.oxygen = player.maxOxygen;
    questBook.celestial.entered = true;
    if (!questBook.discoveredAreas || typeof questBook.discoveredAreas !== "object") questBook.discoveredAreas = {};
    questBook.discoveredAreas.celestialDimension = true;
    updateCelestialProgress();
    updateHud();
    renderInventory();
    if (!questBook.celestial.introDone) {
      questBook.celestial.introDone = true;
      showDialogMessage("Voce chegou a Dimensao Celestial. Ative os 3 Cristais Celestiais e purifique o Serafim Corrompido para abrir o Portal do Nexus.");
    }
  }

  function exitCelestialDimension() {
    setActiveScene("village");
    player.x = CELESTIAL_DESERT_PORTAL_TILE.x * TILE + 4;
    player.y = (CELESTIAL_DESERT_PORTAL_TILE.y + 2) * TILE + 4;
    player.direction = "down";
    updateHud();
  }

  function initCelestialObjects() {
    if (celestialDimensionObjects.length) return;
    celestialDimensionObjects.push(
      dimensionPortal(27, 37, "exit"),
      npc(27, 33, "Guardiao da Luz", "Guardiao da Luz: Somente quem carrega coragem pode tocar os cristais celestiais.", "celestialGuide"),
      npc(42, 20, "Ferreiro Celestial", "Ferreiro Celestial: Eu moldo armas de luz para herois que provam seu valor.", "celestialSmith"),
      npc(11, 24, "Curandeira das Nuvens", "Curandeira das Nuvens: A fonte sagrada cura o corpo e acalma a mente.", "cloudHealer"),
      npc(46, 22, "Sabio Aster", "Sabio Aster: A Biblioteca Divina guarda a historia do mundo e os simbolos da passagem estelar.", "celestialSage"),
      npc(16, 30, "Anjo Perdido", "Anjo Perdido: Minhas asas se desfizeram. Se encontrar 3 Penas Douradas, posso lhe ensinar o Dash Celestial.", "lostAngel"),
      celestialCrystal(28, 5, "light", "Cristal da Luz", "Cristal da Luz"),
      celestialCrystal(9, 23, "aurora", "Cristal da Aurora", "Cristal da Aurora"),
      celestialCrystal(49, 13, "stars", "Cristal das Estrelas", "Cristal das Estrelas"),
      celestialChest(6, 10, "cloudChest", ["Pocao de Luz", "Fragmento de Estrela", "Botas das Nuvens"], ""),
      celestialChest(51, 12, "starChest", ["Cristal Azul Celestial", "Anel de Mana Celestial"], ""),
      celestialChest(28, 2, "templeChest", ["Espada Solar", "Cajado da Aurora", "Arco Estelar"], "serafimCorrompido"),
      celestialFeature(10, 25, "sacredFountain", { width: 40, height: 40, solid: true, role: "heal", message: "Fonte sagrada: pressione E para receber Cura Divina.", checkpoint: true }),
      celestialFeature(7, 21, "cloudTree", { width: 26, height: 34, solid: true }),
      celestialFeature(13, 21, "cloudTree", { width: 26, height: 34, solid: true }),
      celestialFeature(43, 18, "bookshelf", { width: 26, height: 40, solid: true, message: "Estante antiga: livros magicos flutuam sozinhos diante de voce." }),
      celestialFeature(47, 18, "bookshelf", { width: 26, height: 40, solid: true, message: "Pergaminhos dourados contam a queda do Serafim Corrompido." }),
      celestialFeature(45, 24, "starPuzzle", { width: 28, height: 18, solid: false, role: "starPuzzle", message: "Puzzle das estrelas: Sol -> Lua -> Estrela -> Asa -> Cristal." }),
      celestialFeature(22, 12, "mirrorPuzzle", { width: 30, height: 22, solid: false, role: "mirrorPuzzle", message: "Puzzle dos raios de luz: espelhos refletem energia ate o cristal central." }),
      celestialFeature(44, 8, "guardianArenaCrystal", { width: 24, height: 28, solid: false, role: "arenaCrystal", message: "Cristal da Arena: pressione E para iniciar o desafio dos Guardioes." }),
      celestialFeature(33, 18, "angelStatue", { width: 28, height: 44, solid: true, role: "statue", message: "Estatua de anjo: 'Somente a luz pura abre o Portal Sagrado'." }),
      celestialFeature(21, 18, "angelStatue", { width: 28, height: 44, solid: true, role: "statue", message: "Estatua de anjo: 'As estrelas apontam o caminho para o Nexus'." }),
      celestialFeature(28, 16, "blueFlame", { width: 16, height: 26, solid: false }),
      celestialFeature(24, 16, "blueFlame", { width: 16, height: 26, solid: false }),
      celestialFeature(32, 16, "blueFlame", { width: 16, height: 26, solid: false }),
      celestialFeature(28, 33, "nexusGate", { width: 56, height: 86, solid: false, role: "nexusGate", message: "Portal Sagrado: ele se abrira quando os cristais forem ativados e o Serafim for purificado." }),
      celestialFeature(26, 19, "celestialPlatform", { width: 32, height: 12, solid: true, role: "platform", platformGroup: "bridgeA", blinkOffset: 0.0 }),
      celestialFeature(29, 18, "celestialPlatform", { width: 32, height: 12, solid: true, role: "platform", platformGroup: "bridgeA", blinkOffset: 0.4 }),
      celestialFeature(32, 17, "celestialPlatform", { width: 32, height: 12, solid: true, role: "platform", platformGroup: "bridgeA", blinkOffset: 0.8 }),
      celestialFeature(35, 16, "celestialPlatform", { width: 32, height: 12, solid: true, role: "platform", platformGroup: "bridgeA", blinkOffset: 1.2 }),
      celestialFeature(38, 15, "celestialPlatform", { width: 32, height: 12, solid: true, role: "platform", platformGroup: "bridgeA", blinkOffset: 1.6 }),
      celestialCollectible(7, 9, "penaDourada", "Pena Dourada", "Uma pena dourada pulsa com energia leve."),
      celestialCollectible(49, 11, "penaDourada", "Pena Dourada", "Uma pena dourada flutua ao redor de uma estrela."),
      celestialCollectible(15, 28, "penaDourada", "Pena Dourada", "Uma pena dourada repousa entre flores celestiais."),
      celestialCollectible(11, 27, "florAurora", "Flor da Aurora", "Flor da Aurora"),
      celestialCollectible(8, 20, "lagrimaAnjo", "Lagrima de Anjo", "Lagrima de Anjo"),
      celestialCollectible(47, 27, "fragmentoEstrela", "Fragmento de Estrela", "Fragmento de Estrela"),
      celestialCollectible(29, 3, "essenciaLuz", "Essencia de Luz", "Essencia de Luz"),
      celestialCollectible(25, 13, "pedraMarmore", "Pedra de Marmore Sagrado", "Pedra de Marmore Sagrado"),
      celestialCollectible(51, 15, "poNuvem", "Po de Nuvem", "Po de Nuvem"),
      enemy(17, 22, "slimeLuz"), enemy(12, 27, "espiritoEstelar"), enemy(45, 19, "livroMagicoVivo"),
      enemy(48, 24, "sentinelaCristalAzul"), enemy(32, 22, "guardiaoMarmore"), enemy(39, 11, "cavaleiroAurora"),
      enemy(23, 9, "miniAnjoCorrompido"), enemy(49, 9, "passaroCelestial"),
      boss(46, 8, "guardiaoCelestial"),
      boss(27, 4, "serafimCorrompido"),
      boss(7, 11, "dragaoAurora")
    );

    // Objetos decorativos extras leves.
    for (const [fx, fy] of [[8, 28], [14, 29], [40, 27], [49, 28], [26, 28], [30, 28], [22, 21], [34, 21]]) {
      celestialDimensionObjects.push(celestialFeature(fx, fy, "glowFlower", { width: 14, height: 14, solid: false }));
    }
    for (const [tx, ty] of [[20, 2], [36, 2], [18, 8], [38, 8], [6, 20], [14, 20], [41, 17], [50, 17], [24, 39], [31, 39]]) {
      celestialDimensionObjects.push(celestialFeature(tx, ty, "blueFlame", { width: 16, height: 26, solid: false }));
    }
    syncCelestialObjectState();
  }

  initCelestialObjects();
  ensureCelestialState();
  ensureCelestialInventory();

  if (!villageObjects.some((obj) => obj.type === "celestialGate")) {
    villageObjects.push(celestialGate(CELESTIAL_DESERT_PORTAL_TILE.x, CELESTIAL_DESERT_PORTAL_TILE.y));
  }

  const setActiveSceneBeforeCelestialPatch = setActiveScene;
  setActiveScene = function setActiveSceneCelestialPatch(scene) {
    if (scene === "celestialDimension") {
      currentScene = "celestialDimension";
      objects = celestialDimensionObjects;
      colliders = objects.filter((obj) => obj.solid || obj.type === "celestialPlatform" || obj.type === "celestialChest");
      interactables = objects.filter((obj) => obj.message);
      syncCelestialObjectState();
      return;
    }
    setActiveSceneBeforeCelestialPatch(scene);
    if (currentScene === "village" || currentScene === "home" || currentScene === "shopInterior" || currentScene === "mayorInterior" || currentScene === "crystalDimension") {
      interactables = objects.filter((obj) => obj.message);
    }
  };

  const getSceneNameBeforeCelestialPatch = getSceneName;
  getSceneName = function getSceneNameCelestialPatch() {
    if (currentScene === "celestialDimension") return "Dimensao Celestial";
    return getSceneNameBeforeCelestialPatch();
  };

  const getSceneWidthBeforeCelestialPatch = getSceneWidth;
  getSceneWidth = function getSceneWidthCelestialPatch() {
    if (currentScene === "celestialDimension") return CELESTIAL_WIDTH;
    return getSceneWidthBeforeCelestialPatch();
  };

  const getSceneHeightBeforeCelestialPatch = getSceneHeight;
  getSceneHeight = function getSceneHeightCelestialPatch() {
    if (currentScene === "celestialDimension") return CELESTIAL_HEIGHT;
    return getSceneHeightBeforeCelestialPatch();
  };

  function getCelestialTileAt(tileX, tileY) {
    if (tileX < 0 || tileY < 0 || tileX >= CELESTIAL_COLS || tileY >= CELESTIAL_ROWS) return CELESTIAL_TILES.VOID;
    return celestialDimensionMap[tileY][tileX];
  }

  const hitsWaterBeforeCelestialPatch = hitsWater;
  hitsWater = function hitsWaterCelestialPatch(rect) {
    if (currentScene !== "celestialDimension") return hitsWaterBeforeCelestialPatch(rect);
    const left = Math.floor(rect.x / TILE);
    const right = Math.floor((rect.x + rect.width - 1) / TILE);
    const top = Math.floor(rect.y / TILE);
    const bottom = Math.floor((rect.y + rect.height - 1) / TILE);
    for (let y = top; y <= bottom; y++) {
      for (let x = left; x <= right; x++) {
        const tile = getCelestialTileAt(x, y);
        if (tile === CELESTIAL_TILES.VOID || tile === CELESTIAL_TILES.WATER) return true;
      }
    }
    return false;
  };

  const isColliderActiveBeforeCelestialPatch = isColliderActive;
  isColliderActive = function isColliderActiveCelestialPatch(obj) {
    if (obj?.type === "celestialFeature" && obj.role === "platform") return Boolean(obj.active);
    return isColliderActiveBeforeCelestialPatch(obj);
  };

  const canMoveToBeforeCelestialPatch = canMoveTo;
  canMoveTo = function canMoveToCelestialPatch(nextX, nextY) {
    if (currentScene !== "celestialDimension") return canMoveToBeforeCelestialPatch(nextX, nextY);
    const rect = getPlayerRect(nextX, nextY);
    if (rect.x < 0 || rect.y < 0 || rect.x + rect.width > CELESTIAL_WIDTH || rect.y + rect.height > CELESTIAL_HEIGHT) return false;

    const supportedByPlatform = celestialDimensionObjects.some((obj) => obj.type === "celestialFeature" && obj.role === "platform" && obj.active && rectsOverlap(rect, obj));
    if (!supportedByPlatform && hitsWater(rect)) return false;

    return !colliders.some((obj) => isColliderActive(obj) && rectsOverlap(rect, obj));
  };

  const canEntityMoveToBeforeCelestialPatch = canEntityMoveTo;
  canEntityMoveTo = function canEntityMoveToCelestialPatch(entity, nextX, nextY) {
    if (currentScene !== "celestialDimension") return canEntityMoveToBeforeCelestialPatch(entity, nextX, nextY);
    const rect = { x: nextX, y: nextY, width: entity.width, height: entity.height };
    if (rect.x < 0 || rect.y < 0 || rect.x + rect.width > CELESTIAL_WIDTH || rect.y + rect.height > CELESTIAL_HEIGHT) return false;
    if (hitsWater(rect)) return false;
    return !colliders.some((obj) => (
      obj !== entity &&
      obj.type !== "enemy" &&
      isColliderActive(obj) &&
      !entityIgnoresCollider(entity, obj) &&
      rectsOverlap(rect, obj)
    ));
  };

  function drawCelestialVoid(x, y, tileX, tileY) {
    ctx.fillStyle = (tileX + tileY) % 2 === 0 ? "#dceeff" : "#d4e6ff";
    ctx.fillRect(x, y, TILE, TILE);
    ctx.fillStyle = "rgba(255,255,255,0.10)";
    ctx.fillRect(x + 4, y + 4, 2, 2);
    ctx.fillRect(x + 23, y + 9, 2, 2);
  }

  function drawCelestialMarble(x, y, tileX, tileY) {
    ctx.fillStyle = (tileX + tileY) % 2 === 0 ? "#f7f7fb" : "#eff1f6";
    ctx.fillRect(x, y, TILE, TILE);
    ctx.strokeStyle = "rgba(188, 196, 214, 0.55)";
    ctx.beginPath();
    ctx.moveTo(x, y + TILE - 1);
    ctx.lineTo(x + TILE, y + TILE - 1);
    ctx.moveTo(x + TILE - 1, y);
    ctx.lineTo(x + TILE - 1, y + TILE);
    ctx.stroke();
    ctx.strokeStyle = "rgba(212, 190, 124, 0.28)";
    ctx.beginPath();
    ctx.moveTo(x + 6, y + 6);
    ctx.lineTo(x + 26, y + 24);
    ctx.stroke();
  }

  function drawCelestialCloud(x, y, tileX, tileY) {
    ctx.fillStyle = (tileX + tileY) % 2 === 0 ? "#f8fbff" : "#edf5ff";
    ctx.fillRect(x, y, TILE, TILE);
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.beginPath();
    ctx.arc(x + 12, y + 20, 7, 0, Math.PI * 2);
    ctx.arc(x + 20, y + 16, 8, 0, Math.PI * 2);
    ctx.arc(x + 8, y + 15, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawCelestialGold(x, y, tileX, tileY) {
    ctx.fillStyle = (tileX + tileY) % 2 === 0 ? "#e7d391" : "#ddc16d";
    ctx.fillRect(x, y, TILE, TILE);
    ctx.strokeStyle = "rgba(255, 252, 219, 0.65)";
    ctx.strokeRect(x + 2, y + 2, TILE - 4, TILE - 4);
    ctx.fillStyle = "rgba(255,255,255,0.32)";
    ctx.fillRect(x + 4, y + 4, TILE - 8, 4);
  }

  function drawCelestialWater(x, y, tileX, tileY) {
    ctx.fillStyle = (tileX + tileY) % 2 === 0 ? "#bfeeff" : "#afe4ff";
    ctx.fillRect(x, y, TILE, TILE);
    ctx.strokeStyle = "rgba(255,255,255,0.55)";
    ctx.beginPath();
    ctx.arc(x + 16, y + 16, 9, 0, Math.PI * 2);
    ctx.stroke();
  }

  function drawCelestialStairs(x, y) {
    drawCelestialMarble(x, y, 0, 0);
    ctx.fillStyle = "rgba(215, 195, 136, 0.6)";
    for (let i = 0; i < 4; i++) ctx.fillRect(x + 3, y + 4 + i * 7, 26, 3);
  }

  function drawCelestialStarTile(x, y) {
    drawCelestialMarble(x, y, 0, 0);
    ctx.fillStyle = "rgba(255, 228, 112, 0.85)";
    ctx.fillRect(x + 15, y + 7, 2, 18);
    ctx.fillRect(x + 7, y + 15, 18, 2);
    ctx.fillRect(x + 10, y + 10, 12, 12);
  }

  const drawMapBeforeCelestialPatch = drawMap;
  drawMap = function drawMapCelestialPatch() {
    if (currentScene !== "celestialDimension") return drawMapBeforeCelestialPatch();

    const startCol = Math.floor(camera.x / TILE) - 1;
    const endCol = Math.ceil((camera.x + canvas.width) / TILE) + 1;
    const startRow = Math.floor(camera.y / TILE) - 1;
    const endRow = Math.ceil((camera.y + canvas.height) / TILE) + 1;

    for (let y = startRow; y <= endRow; y++) {
      for (let x = startCol; x <= endCol; x++) {
        if (x < 0 || y < 0 || x >= CELESTIAL_COLS || y >= CELESTIAL_ROWS) continue;
        const tile = celestialDimensionMap[y][x];
        const px = x * TILE;
        const py = y * TILE;
        if (tile === CELESTIAL_TILES.MARBLE) drawCelestialMarble(px, py, x, y);
        else if (tile === CELESTIAL_TILES.CLOUD) drawCelestialCloud(px, py, x, y);
        else if (tile === CELESTIAL_TILES.GOLD) drawCelestialGold(px, py, x, y);
        else if (tile === CELESTIAL_TILES.WATER) drawCelestialWater(px, py, x, y);
        else if (tile === CELESTIAL_TILES.STAIRS) drawCelestialStairs(px, py, x, y);
        else if (tile === CELESTIAL_TILES.STAR) drawCelestialStarTile(px, py, x, y);
        else drawCelestialVoid(px, py, x, y);
      }
    }

    ctx.fillStyle = "rgba(255,255,255,0.16)";
    for (let i = 0; i < 18; i++) {
      const sx = camera.x + ((i * 179 + performance.now() * 0.02) % (canvas.width + 90)) - 45;
      const sy = camera.y + ((i * 113 + performance.now() * 0.05) % (canvas.height + 70)) - 35;
      ctx.fillRect(sx, sy, 2, 2);
    }
    ctx.fillStyle = "rgba(255,255,220,0.08)";
    ctx.fillRect(camera.x, camera.y, canvas.width, canvas.height);
  };

  const drawObjectBeforeCelestialPatch = drawObject;
  drawObject = function drawObjectCelestialPatch(obj) {
    if (obj.type === "celestialGate") return drawCelestialGate(obj);
    if (obj.type === "celestialFeature") return drawCelestialFeature(obj);
    if (obj.type === "celestialCrystal") return drawCelestialCrystalObject(obj);
    if (obj.type === "celestialChest") return drawCelestialChest(obj);
    if (obj.type === "celestialCollectible") return drawCelestialCollectible(obj);
    drawObjectBeforeCelestialPatch(obj);
  };

  function drawCelestialGate(obj) {
    const x = obj.x;
    const y = obj.y;
    pixelRect(x + 8, y + 16, 48, 64, "#f5f7ff");
    pixelRect(x + 12, y + 20, 40, 56, "#dceeff");
    pixelRect(x + 16, y + 24, 32, 48, "#a7dcff");
    ctx.strokeStyle = "rgba(255,255,255,0.75)";
    ctx.strokeRect(x + 20, y + 28, 24, 40);
    ctx.fillStyle = "#d5b971";
    ctx.fillRect(x + 6, y + 10, 52, 6);
    ctx.fillRect(x + 10, y + 12, 44, 3);
    ctx.fillRect(x + 6, y + 76, 52, 5);
    ctx.fillStyle = "rgba(114, 198, 255, 0.32)";
    ctx.fillRect(x + 18, y + 26, 28, 44);
  }

  function drawCelestialCrystalObject(obj) {
    const x = obj.x;
    const y = obj.y + Math.sin(performance.now() / 220 + x * 0.01) * 1.5;
    const glow = obj.activated ? "rgba(130, 220, 255, 0.38)" : "rgba(130, 220, 255, 0.18)";
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x + 11, y + 15, obj.activated ? 18 : 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = obj.activated ? "#bff8ff" : "#7fd5ff";
    ctx.fillRect(x + 9, y + 2, 4, 22);
    ctx.fillRect(x + 6, y + 8, 10, 12);
    ctx.fillStyle = "#edfaff";
    ctx.fillRect(x + 10, y + 5, 2, 12);
    ctx.strokeStyle = "#8fd5ff";
    ctx.strokeRect(x + 6, y + 8, 10, 12);
    if (obj.activated) {
      ctx.fillStyle = "rgba(255, 241, 176, 0.8)";
      ctx.fillRect(x + 2, y + 1, 2, 2);
      ctx.fillRect(x + 18, y + 4, 2, 2);
      ctx.fillRect(x + 4, y + 24, 2, 2);
    }
  }

  function drawCelestialChest(obj) {
    const x = obj.x;
    const y = obj.y;
    pixelRect(x + 2, y + 5, 60, 18, obj.opened ? "#b7cadb" : "#d7b66a");
    pixelRect(x + 6, y + 8, 52, 12, obj.opened ? "#d9ebff" : "#7f4350");
    ctx.fillStyle = "#f7e7a5";
    ctx.fillRect(x + 28, y + 9, 6, 9);
  }

  function drawCelestialCollectible(obj) {
    const x = obj.x;
    const y = obj.y + Math.sin(performance.now() / 260 + x * 0.01) * 1.2;
    if (obj.collected) return;
    if (obj.item === "penaDourada") {
      ctx.fillStyle = "#f5e28c";
      ctx.fillRect(x + 7, y + 2, 2, 12);
      ctx.fillRect(x + 5, y + 5, 6, 2);
      ctx.fillRect(x + 4, y + 8, 7, 2);
    } else if (obj.item === "fragmentoEstrela") {
      ctx.fillStyle = "#fff3ae";
      ctx.fillRect(x + 7, y + 2, 2, 12);
      ctx.fillRect(x + 2, y + 7, 12, 2);
      ctx.fillRect(x + 4, y + 4, 8, 8);
    } else if (obj.item === "florAurora") {
      ctx.fillStyle = "#ffd3ec";
      ctx.fillRect(x + 5, y + 4, 6, 6);
      ctx.fillStyle = "#8ef39e";
      ctx.fillRect(x + 7, y + 10, 2, 6);
    } else if (obj.item === "lagrimaAnjo") {
      ctx.fillStyle = "#b7f2ff";
      ctx.fillRect(x + 6, y + 3, 4, 10);
      ctx.fillRect(x + 5, y + 5, 6, 6);
    } else if (obj.item === "essenciaLuz") {
      ctx.fillStyle = "#fff4bc";
      ctx.fillRect(x + 7, y + 2, 2, 12);
      ctx.fillRect(x + 3, y + 6, 10, 2);
    } else if (obj.item === "pedraMarmore") {
      ctx.fillStyle = "#f3f5fa";
      ctx.fillRect(x + 4, y + 4, 8, 8);
      ctx.strokeStyle = "#bcc6d8";
      ctx.strokeRect(x + 4, y + 4, 8, 8);
    } else if (obj.item === "poNuvem") {
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(x + 8, y + 8, 5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = "#9defff";
      ctx.fillRect(x + 4, y + 4, 8, 8);
    }
  }

  function drawCelestialFeature(obj) {
    const x = obj.x;
    const y = obj.y;
    if (obj.kind === "sacredFountain") {
      pixelRect(x + 4, y + 20, 32, 12, "#d6b86d");
      pixelRect(x + 8, y + 8, 24, 16, "#dfeeff");
      ctx.fillStyle = "#8fe3ff";
      ctx.fillRect(x + 13, y + 4, 14, 12);
      ctx.fillRect(x + 15, y, 10, 8);
      return;
    }
    if (obj.kind === "cloudTree") {
      ctx.fillStyle = "#d9c489";
      ctx.fillRect(x + 10, y + 14, 6, 20);
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(x + 13, y + 10, 12, 0, Math.PI * 2);
      ctx.arc(x + 7, y + 14, 10, 0, Math.PI * 2);
      ctx.arc(x + 19, y + 14, 10, 0, Math.PI * 2);
      ctx.fill();
      return;
    }
    if (obj.kind === "bookshelf") {
      pixelRect(x, y, 24, 38, "#95734b");
      ctx.fillStyle = "#d8bc75";
      ctx.fillRect(x + 3, y + 4, 18, 4);
      ctx.fillRect(x + 3, y + 16, 18, 4);
      ctx.fillRect(x + 3, y + 28, 18, 4);
      ctx.fillStyle = "#6ac8ff";
      ctx.fillRect(x + 5, y + 6, 3, 8);
      ctx.fillStyle = "#ef86dd";
      ctx.fillRect(x + 10, y + 6, 3, 8);
      ctx.fillStyle = "#fff2a8";
      ctx.fillRect(x + 15, y + 6, 3, 8);
      return;
    }
    if (obj.kind === "starPuzzle") {
      ctx.fillStyle = "rgba(255, 231, 143, 0.22)";
      ctx.fillRect(x, y, obj.width, obj.height);
      ctx.fillStyle = "#f8edaf";
      for (let i = 0; i < 5; i++) ctx.fillRect(x + 3 + i * 5, y + 6 + (i % 2) * 4, 4, 4);
      return;
    }
    if (obj.kind === "mirrorPuzzle") {
      ctx.fillStyle = "#edf5ff";
      ctx.fillRect(x + 2, y + 2, obj.width - 4, obj.height - 4);
      ctx.strokeStyle = "#b8cef5";
      ctx.strokeRect(x + 2, y + 2, obj.width - 4, obj.height - 4);
      ctx.strokeStyle = "#f5df86";
      ctx.beginPath();
      ctx.moveTo(x + 4, y + obj.height - 4);
      ctx.lineTo(x + obj.width - 4, y + 4);
      ctx.stroke();
      return;
    }
    if (obj.kind === "guardianArenaCrystal") {
      drawCelestialCrystalObject({ ...obj, activated: questBook.defeatedBosses?.guardiaoCelestial });
      return;
    }
    if (obj.kind === "angelStatue") {
      pixelRect(x + 8, y + 18, 12, 22, "#e9edf4");
      pixelRect(x + 3, y + 12, 6, 14, "#f2f6fb");
      pixelRect(x + 19, y + 12, 6, 14, "#f2f6fb");
      ctx.fillStyle = "#f7e6a9";
      ctx.fillRect(x + 10, y + 4, 8, 8);
      return;
    }
    if (obj.kind === "blueFlame") {
      const flicker = Math.sin(performance.now() / 180 + x * 0.02) * 2;
      ctx.fillStyle = "#f0d996";
      ctx.fillRect(x + 6, y + 16, 4, 10);
      ctx.fillStyle = "rgba(117, 227, 255, 0.25)";
      ctx.beginPath();
      ctx.arc(x + 8, y + 10, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#8defff";
      ctx.fillRect(x + 5, y + 6 - flicker * 0.2, 6, 10 + flicker * 0.4);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(x + 7, y + 9 - flicker * 0.15, 2, 4 + flicker * 0.3);
      return;
    }
    if (obj.kind === "nexusGate") {
      pixelRect(x + 6, y + 16, 44, 58, "#f7fbff");
      pixelRect(x + 10, y + 20, 36, 50, "#b8dfff");
      ctx.fillStyle = questBook.celestial.portalOpen ? "#94d2ff" : "rgba(148,210,255,0.35)";
      ctx.fillRect(x + 14, y + 24, 28, 42);
      ctx.fillStyle = "#d8be6c";
      ctx.fillRect(x + 4, y + 10, 48, 6);
      ctx.fillRect(x + 4, y + 74, 48, 5);
      return;
    }
    if (obj.kind === "celestialPlatform") {
      if (!obj.active) return;
      ctx.fillStyle = "rgba(255,255,255,0.82)";
      ctx.fillRect(x, y, obj.width, obj.height);
      ctx.fillStyle = "rgba(147, 222, 255, 0.65)";
      ctx.fillRect(x + 2, y + obj.height - 4, obj.width - 4, 2);
      return;
    }
    if (obj.kind === "glowFlower") {
      ctx.fillStyle = "#9be48f";
      ctx.fillRect(x + 5, y + 6, 2, 6);
      ctx.fillStyle = "#ffd8f3";
      ctx.fillRect(x + 2, y + 2, 8, 6);
      return;
    }
  }

  function getCelestialNpcMessage(npcObj) {
    ensureCelestialState();
    ensureCelestialInventory();
    updateCelestialProgress();

    if (npcObj.role === "celestialGuide") {
      if (!questBook.celestial.bridgeOpen) {
        return `Guardiao da Luz: Ative os 3 Cristais Celestiais. Progresso ${countActivatedCelestialCrystals()}/3.`;
      }
      if (!questBook.celestial.seraphPurified) {
        return "Guardiao da Luz: O Portal Sagrado ainda rejeita nossa luz. Purifique o Serafim Corrompido no templo principal.";
      }
      return "Guardiao da Luz: O Portal do Nexus agora responde a sua presenca. A aurora voltou a brilhar.";
    }

    if (npcObj.role === "cloudHealer") {
      player.health = player.maxHealth;
      player.mana = player.maxMana;
      playSound("heal");
      return "Curandeira das Nuvens: A Fonte Sagrada restaurou sua vida e sua mana.";
    }

    if (npcObj.role === "celestialSage") {
      if (!questBook.celestial.libraryPuzzleSolved) {
        questBook.celestial.libraryPuzzleSolved = true;
        awardXp(120, "Biblioteca Divina");
        addCelestialInventoryItem("Pergaminho da Biblioteca", "resource");
        return "Sabio Aster: Os simbolos certos sao Sol, Lua, Estrela, Asa e Cristal. Tome este Pergaminho da Biblioteca.";
      }
      return "Sabio Aster: A Dimensao Celestial era um lugar de paz ate um cristal ser corrompido por energia sombria.";
    }

    if (npcObj.role === "celestialSmith") {
      const rewards = [];
      if (questBook.defeatedBosses?.guardiaoCelestial && !inventory.celestialRelics.includes("Espada Celestial")) {
        addCelestialInventoryItem("Espada Celestial", "relic");
        rewards.push("Espada Celestial");
      }
      if (questBook.defeatedBosses?.serafimCorrompido && !inventory.celestialRelics.includes("Cajado Sagrado")) {
        addCelestialInventoryItem("Cajado Sagrado", "relic");
        rewards.push("Cajado Sagrado");
      }
      if (questBook.defeatedBosses?.dragaoAurora && !inventory.celestialRelics.includes("Armadura da Aurora")) {
        addCelestialInventoryItem("Armadura da Aurora", "relic");
        rewards.push("Armadura da Aurora");
      }
      if (questBook.celestial.bridgeOpen && !inventory.celestialRelics.includes("Arco Estelar")) {
        addCelestialInventoryItem("Arco Estelar", "relic");
        rewards.push("Arco Estelar");
      }
      if (rewards.length) {
        awardXp(140, "Forja Celestial");
        renderInventory();
        return `Ferreiro Celestial: Sua prova foi suficiente. Eu forjei ${rewards.join(", ")} para voce.`;
      }
      return "Ferreiro Celestial: Derrote os guardioes e traga fragmentos da aurora. Entao eu poderei melhorar suas armas de luz.";
    }

    if (npcObj.role === "lostAngel") {
      if (questBook.celestial.feathers >= 3 && !questBook.celestial.angelQuestDone) {
        questBook.celestial.angelQuestDone = true;
        questBook.celestial.dashCelestialUnlocked = true;
        player.baseSpeed += 12;
        player.speed = Math.max(player.speed, player.baseSpeed);
        addCelestialInventoryItem("Asas Pequenas", "relic");
        awardXp(180, "Anjo perdido");
        return "Anjo Perdido: Minhas penas voltaram! Como recompensa, voce aprendeu o Dash Celestial e recebeu Asas Pequenas.";
      }
      return `Anjo Perdido: Ainda preciso de 3 Penas Douradas. Progresso ${questBook.celestial.feathers}/3.`;
    }

    return npcObj.message;
  }

  function activateCelestialCrystal(obj) {
    ensureCelestialState();
    if (obj.activated) {
      return `${obj.title}: este cristal ja esta ativo. Progresso ${countActivatedCelestialCrystals()}/3.`;
    }
    obj.activated = true;
    obj.activatedAt = performance.now();
    questBook.celestial.crystals[obj.crystalKey] = true;
    updateCelestialProgress();
    playSound("crystal");
    awardXp(160, obj.title);
    if (areAllCelestialCrystalsActive()) {
      playSound("mission");
      return `${obj.title} foi ativado! Os 3 Cristais Celestiais despertaram e o caminho para o Portal Sagrado ficou disponivel.`;
    }
    return `${obj.title} foi ativado! Cristais despertos: ${countActivatedCelestialCrystals()}/3.`;
  }

  function openCelestialChest(obj) {
    ensureCelestialState();
    ensureCelestialInventory();
    if (obj.requiresBoss && !questBook.defeatedBosses?.[obj.requiresBoss]) {
      return "Bau celestial: um selo impede sua abertura. Derrote o guardiao deste santuario primeiro.";
    }
    if (questBook.celestial.openedChests[obj.chestId] || obj.opened) {
      return "Bau celestial: ele ja foi aberto.";
    }
    obj.opened = true;
    questBook.celestial.openedChests[obj.chestId] = true;
    for (const reward of obj.rewardItems || []) addCelestialInventoryItem(reward, "relic");
    inventory.moedas += 18;
    inventory.pocoes += 1;
    awardXp(120, "Bau celestial");
    playSound("chest");
    renderInventory();
    updateHud();
    return `Bau celestial aberto! Recompensas: ${(obj.rewardItems || []).join(", ")}.`;
  }

  const getQuestMessageBeforeCelestialPatch = getQuestMessage;
  getQuestMessage = function getQuestMessageCelestialPatch(npcObj) {
    if (npcObj?.type === "celestialGate") {
      enterCelestialDimension();
      return "";
    }
    if (currentScene === "celestialDimension") {
      if (npcObj.type === "dimensionPortal") {
        exitCelestialDimension();
        return "";
      }
      if (npcObj.type === "celestialCrystal") return activateCelestialCrystal(npcObj);
      if (npcObj.type === "celestialChest") return openCelestialChest(npcObj);
      if (npcObj.type === "npc") return getCelestialNpcMessage(npcObj);
      if (npcObj.type === "celestialFeature" && npcObj.kind === "sacredFountain") {
        player.health = player.maxHealth;
        player.mana = player.maxMana;
        setCelestialCheckpoint(player.x, player.y);
        playSound("heal");
        return "Fonte Sagrada: sua vida e mana foram restauradas. Este lugar agora serve como seu ponto de retorno.";
      }
      if (npcObj.type === "celestialFeature" && npcObj.role === "starPuzzle") {
        if (!questBook.celestial.starPuzzleSolved) {
          questBook.celestial.starPuzzleSolved = true;
          addCelestialInventoryItem("Pingente da Aurora", "relic");
          awardXp(130, "Puzzle das Estrelas");
          return "As estrelas responderam a ordem correta! Voce recebeu o Pingente da Aurora.";
        }
        return "Puzzle das Estrelas: as constelacoes ja se alinharam para voce.";
      }
      if (npcObj.type === "celestialFeature" && npcObj.role === "mirrorPuzzle") {
        if (!questBook.celestial.lightPuzzleSolved) {
          questBook.celestial.lightPuzzleSolved = true;
          addCelestialInventoryItem("Amuleto de Luz", "relic");
          awardXp(130, "Puzzle dos Raios de Luz");
          return "Os espelhos desviaram a luz para o cristal central! Voce recebeu o Amuleto de Luz.";
        }
        return "Puzzle dos Raios de Luz: a energia ja segue brilhando pelo templo.";
      }
      if (npcObj.type === "celestialFeature" && npcObj.role === "arenaCrystal") {
        if (!questBook.celestial.guardianChallengeDone && questBook.defeatedBosses?.guardiaoCelestial) {
          questBook.celestial.guardianChallengeDone = true;
          addCelestialInventoryItem("Fragmento da Aurora", "relic");
          awardXp(180, "Arena dos Guardioes");
          return "O desafio da arena foi concluido. O Cristal Central entregou a voce um Fragmento da Aurora.";
        }
        return questBook.defeatedBosses?.guardiaoCelestial
          ? "Cristal Central: a arena reconhece sua vitoria."
          : "Cristal Central: derrote o Guardiao Celestial para conquistar este desafio.";
      }
      if (npcObj.type === "celestialFeature" && npcObj.role === "nexusGate") {
        updateCelestialProgress();
        if (!questBook.celestial.portalOpen) {
          return "Portal Sagrado: ative os 3 cristais e purifique o Serafim Corrompido para abrir o Nexus.";
        }
        addCelestialInventoryItem("Cristal Supremo Celestial", "relic");
        return "Portal do Nexus: a aurora sorri para voce. O Cristal Supremo Celestial foi despertado.";
      }
    }
    return getQuestMessageBeforeCelestialPatch(npcObj);
  };

  const collectWorldItemsBeforeCelestialPatch = collectWorldItems;
  collectWorldItems = function collectWorldItemsCelestialPatch() {
    if (currentScene !== "celestialDimension") return collectWorldItemsBeforeCelestialPatch();
    ensureCelestialState();
    ensureCelestialInventory();
    const playerRect = getPlayerRect();
    for (const obj of celestialDimensionObjects) {
      if (obj.type !== "celestialCollectible" || obj.collected || !rectsOverlap(playerRect, obj)) continue;
      obj.collected = true;
      if (obj.item === "penaDourada") {
        questBook.celestial.feathers += 1;
        addCelestialInventoryItem("Pena Dourada", "resource");
      } else if (obj.item === "fragmentoEstrela") {
        addCelestialInventoryItem("Fragmento de Estrela", "resource");
      } else if (obj.item === "florAurora") {
        addCelestialInventoryItem("Flor da Aurora", "resource");
      } else if (obj.item === "lagrimaAnjo") {
        addCelestialInventoryItem("Lagrima de Anjo", "resource");
      } else if (obj.item === "essenciaLuz") {
        addCelestialInventoryItem("Essencia de Luz", "resource");
      } else if (obj.item === "pedraMarmore") {
        addCelestialInventoryItem("Pedra de Marmore Sagrado", "resource");
      } else if (obj.item === "poNuvem") {
        addCelestialInventoryItem("Po de Nuvem", "resource");
      }
      awardXp(30, obj.label || "Recurso celestial");
      playSound("coin");
    }
  };

  const getEnemyStatsBeforeCelestialPatch = getEnemyStats;
  getEnemyStats = function getEnemyStatsCelestialPatch(kind) {
    const base = getEnemyStatsBeforeCelestialPatch(kind);
    const extra = {
      slimeLuz: { width: 24, height: 20, hp: 6, damage: 1, speed: 44, aggroRange: 180, attackRange: 145, attackDelay: 1.2, coinReward: 11, projectileType: "lightBolt", dropTable: { coin: 1, potion: 0.10, powerUp: 0.16, loot: 0.24 }, xpReward: 16 },
      espiritoEstelar: { width: 22, height: 26, hp: 6, damage: 1, speed: 62, aggroRange: 260, attackRange: 220, attackDelay: 1.08, coinReward: 12, canFly: true, projectileType: "starShot", dropTable: { coin: 1, potion: 0.12, powerUp: 0.18, loot: 0.26 }, xpReward: 18 },
      guardiaoMarmore: { width: 28, height: 34, hp: 10, damage: 2, speed: 34, aggroRange: 220, attackRange: 34, attackDelay: 1.14, coinReward: 16, defense: 1, dropTable: { coin: 1, potion: 0.12, powerUp: 0.18, loot: 0.3 }, xpReward: 26 },
      passaroCelestial: { width: 24, height: 18, hp: 4, damage: 1, speed: 84, aggroRange: 250, attackRange: 170, attackDelay: 1.0, coinReward: 10, canFly: true, projectileType: "lightBolt", dropTable: { coin: 0.9, potion: 0.08, powerUp: 0.14, loot: 0.2 }, xpReward: 14 },
      cavaleiroAurora: { width: 24, height: 32, hp: 11, damage: 2, speed: 48, aggroRange: 250, attackRange: 36, attackDelay: 1.08, coinReward: 18, projectileType: "lightBolt", dropTable: { coin: 1, potion: 0.12, powerUp: 0.18, loot: 0.34 }, xpReward: 28 },
      livroMagicoVivo: { width: 20, height: 20, hp: 5, damage: 1, speed: 58, aggroRange: 230, attackRange: 210, attackDelay: 1.05, coinReward: 12, canFly: true, projectileType: "starShot", dropTable: { coin: 1, potion: 0.1, powerUp: 0.18, loot: 0.28 }, xpReward: 16 },
      sentinelaCristalAzul: { width: 24, height: 28, hp: 8, damage: 2, speed: 42, aggroRange: 240, attackRange: 220, attackDelay: 1.18, coinReward: 14, projectileType: "lightBolt", dropTable: { coin: 1, potion: 0.12, powerUp: 0.16, loot: 0.28 }, xpReward: 22 },
      miniAnjoCorrompido: { width: 22, height: 28, hp: 7, damage: 2, speed: 56, aggroRange: 260, attackRange: 210, attackDelay: 1.0, coinReward: 15, canFly: true, projectileType: "auroraFeather", dropTable: { coin: 1, potion: 0.12, powerUp: 0.18, loot: 0.32 }, xpReward: 22 },
      guardiaoCelestial: { width: 40, height: 46, hp: 60, damage: 3, speed: 38, aggroRange: 400, attackRange: 270, attackDelay: 1.0, coinReward: 95, boss: true, bossItem: "Espada Celestial", projectileType: "lightBolt", dropTable: { coin: 1, potion: 1, powerUp: 1, loot: 1 }, xpReward: 90 },
      serafimCorrompido: { width: 36, height: 44, hp: 64, damage: 3, speed: 44, aggroRange: 420, attackRange: 290, attackDelay: 0.95, coinReward: 98, boss: true, bossItem: "Cajado Sagrado", projectileType: "auroraFeather", dropTable: { coin: 1, potion: 1, powerUp: 1, loot: 1 }, xpReward: 94 },
      dragaoAurora: { width: 52, height: 40, hp: 72, damage: 4, speed: 34, aggroRange: 450, attackRange: 300, attackDelay: 1.12, coinReward: 110, boss: true, bossItem: "Armadura da Aurora", projectileType: "sunRay", canFly: true, dropTable: { coin: 1, potion: 1, powerUp: 1, loot: 1 }, xpReward: 110 }
    };
    return extra[kind] || base;
  };

  const getEnemyProjectileConfigBeforeCelestialPatch = getEnemyProjectileConfig;
  getEnemyProjectileConfig = function getEnemyProjectileConfigCelestialPatch(type, obj) {
    const existing = getEnemyProjectileConfigBeforeCelestialPatch(type, obj);
    if (existing && !["lightBolt", "starShot", "auroraFeather", "sunRay"].includes(type)) return existing;
    const bossBoost = obj?.boss ? 1.2 : 1;
    const extra = {
      lightBolt: { width: 12, height: 12, speed: 190 * bossBoost, timer: 2.2 },
      starShot: { width: 11, height: 11, speed: 200 * bossBoost, timer: 2.15 },
      auroraFeather: { width: 14, height: 8, speed: 210 * bossBoost, timer: 2.1 },
      sunRay: { width: 16, height: 10, speed: 215 * bossBoost, timer: 2.1 }
    };
    return extra[type] || existing;
  };

  const getEnemyProjectileColorBeforeCelestialPatch = getEnemyProjectileColor;
  getEnemyProjectileColor = function getEnemyProjectileColorCelestialPatch(type) {
    if (type === "lightBolt") return { glow: "rgba(255, 245, 165, 0.35)", main: "#f3d86f", core: "#fffdf0" };
    if (type === "starShot") return { glow: "rgba(173, 220, 255, 0.35)", main: "#8dd8ff", core: "#ffffff" };
    if (type === "auroraFeather") return { glow: "rgba(204, 171, 255, 0.35)", main: "#c4a1ff", core: "#ffffff" };
    if (type === "sunRay") return { glow: "rgba(255, 224, 136, 0.35)", main: "#ffd36a", core: "#ffffff" };
    return getEnemyProjectileColorBeforeCelestialPatch(type);
  };

  const fireBossPatternBeforeCelestialPatch = fireBossPattern;
  fireBossPattern = function fireBossPatternCelestialPatch(obj, targetX, targetY) {
    if (obj.kind === "guardiaoCelestial") {
      for (const offset of [-0.25, 0, 0.25]) fireEnemyProjectile(obj, targetX, targetY, offset);
      spawnHazardZone("celestialRay", targetX, targetY, 42, 1.8, 1);
      return;
    }
    if (obj.kind === "serafimCorrompido") {
      for (const offset of [-0.35, 0, 0.35]) fireEnemyProjectile(obj, targetX, targetY, offset);
      spawnHazardZone("sacredCircle", targetX, targetY, 46, 1.7, 1);
      return;
    }
    if (obj.kind === "dragaoAurora") {
      for (const offset of [-0.42, -0.16, 0.16, 0.42]) fireEnemyProjectile(obj, targetX, targetY, offset);
      spawnHazardZone("starRain", targetX, targetY, 48, 1.8, 1);
      return;
    }
    fireBossPatternBeforeCelestialPatch(obj, targetX, targetY);
  };

  const drawHazardsBeforeCelestialPatch = drawHazards;
  drawHazards = function drawHazardsCelestialPatch() {
    drawHazardsBeforeCelestialPatch();
    for (const obj of hazardZones) {
      const alpha = Math.max(0, obj.timer / obj.maxTimer);
      if (obj.type === "celestialRay") {
        ctx.strokeStyle = `rgba(255, 245, 181, ${0.52 * alpha})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI * 2);
        ctx.stroke();
      } else if (obj.type === "sacredCircle") {
        ctx.strokeStyle = `rgba(192, 170, 255, ${0.52 * alpha})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI * 2);
        ctx.stroke();
      } else if (obj.type === "starRain") {
        ctx.fillStyle = `rgba(141, 216, 255, ${0.16 * alpha})`;
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  const updateEnemiesBeforeCelestialPatch = updateEnemies;
  updateEnemies = function updateEnemiesCelestialPatch(delta) {
    updateEnemiesBeforeCelestialPatch(delta);
    if (currentScene !== "celestialDimension") return;
    for (const obj of celestialDimensionObjects) {
      if (obj.type !== "enemy" || !obj.alive) continue;
      if (obj.kind === "serafimCorrompido" && obj.state === "chase" && Math.random() < delta * 0.25) {
        obj.x = clamp(obj.x + (Math.random() > 0.5 ? 48 : -48), 0, CELESTIAL_WIDTH - obj.width);
        obj.y = clamp(obj.y + (Math.random() > 0.5 ? 32 : -32), 0, CELESTIAL_HEIGHT - obj.height);
      }
      if (obj.kind === "miniAnjoCorrompido" && obj.state === "chase" && Math.random() < delta * 0.34) {
        spawnHazardZone("sacredCircle", obj.x + obj.width / 2, obj.y + obj.height / 2, 22, 1.1, 1);
      }
    }
  };

  const defeatEnemyBeforeCelestialPatch = defeatEnemy;
  defeatEnemy = function defeatEnemyCelestialPatch(obj) {
    defeatEnemyBeforeCelestialPatch(obj);
    if (!["guardiaoCelestial", "serafimCorrompido", "dragaoAurora"].includes(obj.kind)) return;
    ensureCelestialState();
    if (obj.kind === "guardiaoCelestial") {
      questBook.celestial.guardianChallengeDone = true;
    }
    if (obj.kind === "serafimCorrompido") {
      questBook.celestial.seraphPurified = true;
    }
    updateCelestialProgress();
    addCelestialInventoryItem(obj.bossItem || "Reliquia Celestial", "relic");
    if (obj.kind === "dragaoAurora") addCelestialInventoryItem("Cristal Azul Celestial", "resource");
  };

  const updateBeforeCelestialPatch = update;
  update = function updateCelestialPatch(delta) {
    updateBeforeCelestialPatch(delta);
    if (currentScene !== "celestialDimension") return;

    ensureCelestialState();
    updateCelestialProgress();

    celestialFallCooldown = Math.max(0, celestialFallCooldown - delta);

    for (const obj of celestialDimensionObjects) {
      if (obj.type === "celestialFeature" && obj.role === "platform") {
        const cycle = (performance.now() / 1000 + obj.blinkOffset) % 2.4;
        obj.active = cycle < 1.55;
      }
    }

    const playerRect = getPlayerRect();
    const standingOnPlatform = celestialDimensionObjects.some((obj) => obj.type === "celestialFeature" && obj.role === "platform" && obj.active && rectsOverlap(playerRect, obj));
    if (!standingOnPlatform && hitsWater(playerRect) && celestialFallCooldown <= 0) {
      resetCelestialPosition();
    }

    const area = getAreaName();
    if (area === "Jardim das Nuvens" && player.health < player.maxHealth && Math.random() < delta * 0.22) {
      player.health = Math.min(player.maxHealth, player.health + 1);
    }

    celestialEventTimer -= delta;
    if (celestialEventTimer <= 0) {
      const events = [
        { key: "chuvaEstrelas", duration: 12, message: "Chuva de estrelas: fragmentos celestiais estao caindo do ceu!" },
        { key: "bencaoAurora", duration: 14, message: "Bencao da Aurora: voce recebeu velocidade, mana e cura lenta." },
        { key: "eclipseSagrado", duration: 10, message: "Eclipse Sagrado: a luz enfraqueceu e guardioes corrompidos despertaram." },
        { key: "invasaoSombria", duration: 10, message: "Invasao Sombria: criaturas do abismo tentam invadir o templo celestial." }
      ];
      const chosen = events[Math.floor(Math.random() * events.length)];
      celestialCurrentEvent = chosen.key;
      celestialEventDuration = chosen.duration;
      celestialEventTimer = 30 + Math.random() * 16;
      showHudToast(chosen.message);
    }

    if (celestialEventDuration > 0) {
      celestialEventDuration -= delta;
      if (celestialCurrentEvent === "bencaoAurora") {
        player.mana = Math.min(player.maxMana, player.mana + delta * 0.9);
        player.health = Math.min(player.maxHealth, player.health + delta * 0.12);
      } else if (celestialCurrentEvent === "chuvaEstrelas" && Math.random() < delta * 0.25) {
        spawnFloatingText("*", camera.x + 40 + Math.random() * (canvas.width - 80), camera.y + 20 + Math.random() * (canvas.height - 40), "#fff4ac");
      }
      if (celestialEventDuration <= 0) celestialCurrentEvent = "";
    }
  };

  const getAreaNameBeforeCelestialPatch = getAreaName;
  getAreaName = function getAreaNameCelestialPatch() {
    if (currentScene !== "celestialDimension") return getAreaNameBeforeCelestialPatch();
    const tileX = Math.floor(player.x / TILE);
    const tileY = Math.floor(player.y / TILE);
    if (tileY <= 10 && tileX >= 18 && tileX <= 38) return "Templo Celestial";
    if (tileX <= 18 && tileY >= 18 && tileY <= 31) return "Jardim das Nuvens";
    if (tileX >= 40 && tileY >= 17 && tileY <= 30) return "Biblioteca Divina";
    if (tileX >= 39 && tileY <= 14) return "Arena dos Guardioes";
    return "Ilhas Flutuantes";
  };

  const renderMissionsPanelBeforeCelestialPatch = renderMissionsPanel;
  renderMissionsPanel = function renderMissionsPanelCelestialPatch() {
    renderMissionsPanelBeforeCelestialPatch();
    ensureCelestialState();
    if (!missionsList) return;
    missionsList.innerHTML += `<li><span>Celestial</span><strong>Cristais ${countActivatedCelestialCrystals()}/3 | Serafim ${questBook.celestial.seraphPurified ? "purificado" : "corrompido"} | Penas ${questBook.celestial.feathers}/3</strong></li>`;
  };

  const getCompactMissionTextBeforeCelestialPatch = getCompactMissionText;
  getCompactMissionText = function getCompactMissionTextCelestialPatch() {
    if (currentScene === "celestialDimension") {
      if (!questBook.celestial.crystals.light) return "Celestial: ative o Cristal da Luz";
      if (!questBook.celestial.crystals.aurora) return "Celestial: ative o Cristal da Aurora";
      if (!questBook.celestial.crystals.stars) return "Celestial: ative o Cristal das Estrelas";
      if (!questBook.celestial.seraphPurified) return "Celestial: purifique o Serafim Corrompido";
      if (!questBook.celestial.portalOpen) return "Celestial: abra o Portal Sagrado";
      return "Celestial: o Nexus foi despertado";
    }
    return getCompactMissionTextBeforeCelestialPatch();
  };

  const getInventoryItemsBeforeCelestialPatch = getInventoryItems;
  getInventoryItems = function getInventoryItemsCelestialPatch() {
    const items = getInventoryItemsBeforeCelestialPatch();
    ensureCelestialInventory();
    for (const resource of inventory.celestialResources) {
      items.push({
        id: `celestial-resource-${String(resource).replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`,
        name: resource,
        icon: "C",
        quantity: 1,
        category: "materiais",
        typeLabel: "Recurso celestial",
        rarity: "incomum",
        description: "Recurso coletado na Dimensao Celestial.",
        effect: "Pode ser usado futuramente para craftar armas, pocoes e armaduras celestiais.",
        locked: true
      });
    }
    for (const relic of inventory.celestialRelics) {
      items.push({
        id: `celestial-relic-${String(relic).replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`,
        name: relic,
        icon: "★",
        quantity: 1,
        category: "raros",
        typeLabel: "Reliquia celestial",
        rarity: "lendario",
        description: "Item unico da Dimensao Celestial.",
        effect: "Recompensa especial de puzzles, baus, NPCs ou bosses celestiais.",
        locked: true
      });
    }
    return items;
  };

  const saveGameBeforeCelestialPatch = saveGame;
  saveGame = function saveGameCelestialPatch() {
    const ok = saveGameBeforeCelestialPatch();
    try {
      const raw = readSaveRaw();
      if (!raw) return ok;
      const parsed = JSON.parse(raw);
      parsed.scene = currentScene;
      parsed.futureState = parsed.futureState || {};
      parsed.futureState.celestial = {
        state: JSON.parse(JSON.stringify(questBook.celestial || {})),
        collected: celestialDimensionObjects
          .filter((obj) => obj.type === "celestialCollectible" && obj.collected)
          .map(getSaveObjectKey),
        enemies: celestialDimensionObjects
          .filter((obj) => obj.type === "enemy")
          .map((obj) => ({ key: getSaveObjectKey(obj), alive: obj.alive, hp: obj.hp, phase: obj.phase })),
        chests: { ...(questBook.celestial?.openedChests || {}) }
      };
      writeSaveRaw(JSON.stringify(parsed));
    } catch (error) {
      console.error("Erro ao salvar estado celestial", error);
    }
    return ok;
  };

  const loadGameBeforeCelestialPatch = loadGame;
  loadGame = function loadGameCelestialPatch() {
    let parsed = null;
    try {
      const raw = readSaveRaw() || (() => {
        try { return localStorage.getItem("eternalRiftAutosaveBackup"); } catch (error) { return null; }
      })();
      parsed = raw ? JSON.parse(raw) : null;
    } catch (error) {
      parsed = null;
    }

    const ok = loadGameBeforeCelestialPatch();
    ensureCelestialState();
    ensureCelestialInventory();
    syncCelestialObjectState();

    const celestialSave = parsed?.futureState?.celestial;
    if (celestialSave) {
      if (celestialSave.state && typeof celestialSave.state === "object") {
        Object.assign(questBook.celestial, celestialSave.state);
      }
      const collected = new Set(celestialSave.collected || []);
      const enemies = new Map((celestialSave.enemies || []).map((entry) => [entry.key, entry]));
      for (const obj of celestialDimensionObjects) {
        if (obj.type === "celestialCollectible") {
          obj.collected = collected.has(getSaveObjectKey(obj));
        }
        if (obj.type === "enemy") {
          const savedEnemy = enemies.get(getSaveObjectKey(obj));
          obj.alive = savedEnemy ? savedEnemy.alive : true;
          obj.hp = savedEnemy ? savedEnemy.hp : obj.maxHp;
          obj.phase = savedEnemy?.phase || 1;
        }
        if (obj.type === "celestialChest") {
          obj.opened = Boolean(celestialSave.chests?.[obj.chestId]);
        }
      }
      syncCelestialObjectState();
    }

    if (parsed?.scene === "celestialDimension") {
      setActiveScene("celestialDimension");
      player.x = parsed.player?.x ?? CELESTIAL_ENTRY_TILE.x * TILE + 4;
      player.y = parsed.player?.y ?? CELESTIAL_ENTRY_TILE.y * TILE + 4;
    }
    return ok || Boolean(parsed);
  };

  // Garante que o estado da nova cena fique valido ao iniciar.
  if (currentScene === "celestialDimension") {
    objects = celestialDimensionObjects;
    colliders = objects.filter((obj) => obj.solid || obj.type === "celestialPlatform" || obj.type === "celestialChest");
    interactables = objects.filter((obj) => obj.message);
  }
}


// === Celestial dimension crash-safe runtime patch ===
if (typeof window !== "undefined" && !window.ETERNAL_RIFT_CELESTIAL_RUNTIME_SAFE_PATCH) {
  window.ETERNAL_RIFT_CELESTIAL_RUNTIME_SAFE_PATCH = true;

  const updateBeforeCelestialRuntimeSafePatch = update;
  update = function updateCelestialRuntimeSafePatch(delta) {
    if (currentScene !== "celestialDimension") {
      return updateBeforeCelestialRuntimeSafePatch(delta);
    }

    try {
      ensureCanvasSize();
      if (!gameStarted) {
        updateHud();
        updateDebugPanel(delta);
        updateHudToast(delta);
        return;
      }

      if (gameOver) {
        updateHud();
        updateDebugPanel(delta);
        updateHudToast(delta);
        return;
      }

      updateTimedEffects(delta);
      player.levelGlowTimer = Math.max(0, Number(player.levelGlowTimer || 0) - delta);

      if (hitstopTimer > 0) {
        hitstopTimer = Math.max(0, hitstopTimer - delta);
        updateAttack(delta);
        updateFloatingTexts(delta);
        updateVisualEffects(delta);
        updateHud();
        updateHudToast(delta);
        return;
      }

      if (pauseOpen || inventoryOpen || shopOpen) {
        updateHud();
        updateInteractionHint();
        updateDebugPanel(delta);
        updateHudToast(delta);
        return;
      }

      const movement = getMovementInput();
      const inputX = movement.x;
      const inputY = movement.y;
      player.moving = inputX !== 0 || inputY !== 0;

      applyPlayerKnockback(delta);
      updateSwimming(delta);

      if (player.moving && !dialogOpen && !inventoryOpen && !shopOpen && Math.abs(playerKnockbackX) + Math.abs(playerKnockbackY) < 8) {
        const length = Math.hypot(inputX, inputY) || 1;
        const strength = movement.strength;
        const moveX = (inputX / length) * getPlayerSpeed() * strength * delta;
        const moveY = (inputY / length) * getPlayerSpeed() * strength * delta;

        if (Math.abs(inputX) > Math.abs(inputY)) {
          player.direction = inputX > 0 ? "right" : "left";
        } else if (inputY !== 0) {
          player.direction = inputY > 0 ? "down" : "up";
        }

        if (canMoveTo(player.x + moveX, player.y)) player.x += moveX;
        if (canMoveTo(player.x, player.y + moveY)) player.y += moveY;

        player.animTimer += delta;
        if (player.animTimer > 0.14) {
          player.frame = (player.frame + 1) % 4;
          player.animTimer = 0;
        }
      } else {
        player.frame = 0;
        player.animTimer = 0;
      }

      // Atualizacoes leves da cena celestial sem chamar o update antigo, que resetava cenas desconhecidas.
      updateProjectiles(delta);
      updateEnemyProjectiles(delta);
      updateHazards(delta);
      collectWorldItems();
      updateLoot(delta);
      updateAttack(delta);
      updateFloatingTexts(delta);
      updateVisualEffects(delta);

      // IA simples e barata para inimigos celestiais: só ativa perto da câmera/jogador.
      if (Array.isArray(objects)) {
        const px = player.x + player.width / 2;
        const py = player.y + player.height / 2;
        for (const obj of objects) {
          if (!obj || obj.type !== "enemy" || !obj.alive) continue;
          const distance = Math.hypot((obj.x + obj.width / 2) - px, (obj.y + obj.height / 2) - py);
          if (distance > Math.max(obj.aggroRange || 240, 420)) continue;

          obj.attackCooldown = Math.max(0, Number(obj.attackCooldown || 0) - delta);
          obj.invulnerableTimer = Math.max(0, Number(obj.invulnerableTimer || 0) - delta);

          const dx = px - (obj.x + obj.width / 2);
          const dy = py - (obj.y + obj.height / 2);
          const len = Math.hypot(dx, dy) || 1;
          const range = obj.attackRange || 34;

          if (distance > range * 0.75) {
            const nextX = obj.x + (dx / len) * (obj.speed || 40) * delta;
            const nextY = obj.y + (dy / len) * (obj.speed || 40) * delta;
            if (canEntityMoveTo(obj, nextX, obj.y)) obj.x = nextX;
            if (canEntityMoveTo(obj, obj.x, nextY)) obj.y = nextY;
          }

          if (distance <= range && obj.attackCooldown <= 0) {
            if (obj.projectileType && typeof fireEnemyProjectile === "function") {
              fireEnemyProjectile(obj, px, py, 0);
            } else if (damageCooldown <= 0) {
              takeDamage(obj.damage || 1, obj.x + obj.width / 2, obj.y + obj.height / 2);
            }
            obj.attackCooldown = obj.attackDelay || 1;
          }

          if (obj.boss && distance < (obj.aggroRange || 380) && obj.attackCooldown <= 0.05 && typeof fireBossPattern === "function") {
            fireBossPattern(obj, px, py);
            obj.attackCooldown = obj.attackDelay || 1.1;
          }
        }
      }

      // Parte especial da Dimensao Celestial: plataformas, queda no vazio e eventos.
      ensureCelestialState();
      updateCelestialProgress();

      celestialFallCooldown = Math.max(0, celestialFallCooldown - delta);

      for (const obj of celestialDimensionObjects) {
        if (obj.type === "celestialFeature" && obj.role === "platform") {
          const cycle = (performance.now() / 1000 + obj.blinkOffset) % 2.4;
          obj.active = cycle < 1.55;
        }
      }

      const playerRect = getPlayerRect();
      const standingOnPlatform = celestialDimensionObjects.some((obj) => (
        obj.type === "celestialFeature" &&
        obj.role === "platform" &&
        obj.active &&
        rectsOverlap(playerRect, obj)
      ));

      if (!standingOnPlatform && hitsWater(playerRect) && celestialFallCooldown <= 0) {
        resetCelestialPosition();
      }

      if (getAreaName() === "Jardim das Nuvens" && player.health < player.maxHealth && Math.random() < delta * 0.22) {
        player.health = Math.min(player.maxHealth, player.health + 1);
      }

      celestialEventTimer -= delta;
      if (celestialEventTimer <= 0) {
        const events = [
          { key: "chuvaEstrelas", duration: 12, message: "Chuva de estrelas: fragmentos celestiais estao caindo do ceu!" },
          { key: "bencaoAurora", duration: 14, message: "Bencao da Aurora: voce recebeu velocidade, mana e cura lenta." },
          { key: "eclipseSagrado", duration: 10, message: "Eclipse Sagrado: a luz enfraqueceu e guardioes corrompidos despertaram." },
          { key: "invasaoSombria", duration: 10, message: "Invasao Sombria: criaturas do abismo tentam invadir o templo celestial." }
        ];
        const chosen = events[Math.floor(Math.random() * events.length)];
        celestialCurrentEvent = chosen.key;
        celestialEventDuration = chosen.duration;
        celestialEventTimer = 30 + Math.random() * 16;
        showHudToast(chosen.message);
      }

      if (celestialEventDuration > 0) {
        celestialEventDuration -= delta;
        if (celestialCurrentEvent === "bencaoAurora") {
          player.mana = Math.min(player.maxMana, player.mana + delta * 0.9);
          player.health = Math.min(player.maxHealth, player.health + delta * 0.12);
        } else if (celestialCurrentEvent === "chuvaEstrelas" && Math.random() < delta * 0.25) {
          spawnFloatingText("*", camera.x + 40 + Math.random() * Math.max(20, canvas.width - 80), camera.y + 20 + Math.random() * Math.max(20, canvas.height - 40), "#fff4ac");
        }
        if (celestialEventDuration <= 0) celestialCurrentEvent = "";
      }

      camera.x = clamp(player.x + player.width / 2 - canvas.width / 2, 0, Math.max(0, getSceneWidth() - canvas.width));
      camera.y = clamp(player.y + player.height / 2 - canvas.height / 2, 0, Math.max(0, getSceneHeight() - canvas.height));

      playerPositionEl.textContent = getAreaName();
      updateHud();
      updateInteractionHint();
      updateDebugPanel(delta);
      updateHudToast(delta);
      if (saveNoticeTimer > 0) saveNoticeTimer = Math.max(0, saveNoticeTimer - delta);
    } catch (error) {
      console.error("Erro seguro na Dimensao Celestial:", error);
      showHudToast("Erro celestial evitado. Voltando ao deserto.");
      setActiveScene("village");
      player.x = 122 * TILE + 4;
      player.y = 14 * TILE + 4;
      currentScene = "village";
      updateHud();
    }
  };

  const drawMiniMapBeforeCelestialRuntimeSafePatch = drawMiniMap;
  drawMiniMap = function drawMiniMapCelestialRuntimeSafePatch() {
    if (currentScene !== "celestialDimension") {
      return drawMiniMapBeforeCelestialRuntimeSafePatch();
    }

    try {
      miniCtx.clearRect(0, 0, miniMapCanvas.width, miniMapCanvas.height);
      miniCtx.fillStyle = "rgba(225, 238, 255, 0.95)";
      miniCtx.fillRect(0, 0, miniMapCanvas.width, miniMapCanvas.height);

      const sx = miniMapCanvas.width / (56 * TILE);
      const sy = miniMapCanvas.height / (42 * TILE);

      for (let y = 0; y < 42; y++) {
        for (let x = 0; x < 56; x++) {
          const tile = celestialDimensionMap[y]?.[x];
          if (!tile || tile === "Z") continue;
          miniCtx.fillStyle = tile === "K" ? "#d7b66a" : tile === "J" ? "#ffffff" : tile === "R" ? "#9defff" : "#eef4ff";
          miniCtx.fillRect(x * TILE * sx, y * TILE * sy, Math.ceil(TILE * sx), Math.ceil(TILE * sy));
        }
      }

      miniCtx.fillStyle = "#55e8ff";
      for (const obj of celestialDimensionObjects) {
        if (obj.type === "celestialCrystal" || obj.type === "celestialGate" || obj.type === "dimensionPortal") {
          miniCtx.fillRect(obj.x * sx - 2, obj.y * sy - 2, 5, 5);
        }
      }

      miniCtx.fillStyle = "#fff264";
      for (const obj of celestialDimensionObjects) {
        if (obj.type === "npc" || obj.type === "celestialChest") {
          miniCtx.fillRect(obj.x * sx - 2, obj.y * sy - 2, 5, 5);
        }
      }

      miniCtx.fillStyle = "#d24c63";
      miniCtx.fillRect(player.x * sx - 3, player.y * sy - 3, 7, 7);
    } catch (error) {
      console.error("Erro no minimapa celestial:", error);
    }
  };

  // Corrige saves antigos que ficaram presos na cena celestial quebrada.
  const loadGameBeforeCelestialSafePatch = loadGame;
  loadGame = function loadGameCelestialSafePatch() {
    const result = loadGameBeforeCelestialSafePatch();
    if (currentScene === "celestialDimension") {
      try {
        objects = celestialDimensionObjects;
        colliders = objects.filter((obj) => obj.solid || obj.type === "celestialChest");
        interactables = objects.filter((obj) => obj.message);
        ensureCelestialState();
        syncCelestialObjectState();
      } catch (error) {
        console.error("Save celestial antigo corrigido:", error);
        setActiveScene("village");
        player.x = 122 * TILE + 4;
        player.y = 14 * TILE + 4;
      }
    }
    return result;
  };
}


// === Celestial dimension runtime-safe patch V2 ===
if (typeof window !== "undefined" && !window.ETERNAL_RIFT_CELESTIAL_RUNTIME_SAFE_PATCH_V2) {
  window.ETERNAL_RIFT_CELESTIAL_RUNTIME_SAFE_PATCH_V2 = true;
  window.__celestialSafe = window.__celestialSafe || {
    fallCooldown: 0,
    eventTimer: 28,
    eventName: "",
    eventDuration: 0
  };

  const updateBeforeCelestialRuntimeSafePatchV2 = update;
  update = function updateCelestialRuntimeSafePatchV2(delta) {
    if (currentScene !== "celestialDimension") {
      return updateBeforeCelestialRuntimeSafePatchV2(delta);
    }

    try {
      ensureCanvasSize();

      if (typeof ensureCelestialState === "function") ensureCelestialState();
      if (typeof ensureCelestialInventory === "function") ensureCelestialInventory();
      if (typeof updateCelestialProgress === "function") updateCelestialProgress();

      if (!gameStarted) {
        updateHud();
        updateDebugPanel(delta);
        updateHudToast(delta);
        return;
      }

      if (gameOver) {
        updateHud();
        updateDebugPanel(delta);
        updateHudToast(delta);
        return;
      }

      updateTimedEffects(delta);
      player.levelGlowTimer = Math.max(0, Number(player.levelGlowTimer || 0) - delta);

      if (hitstopTimer > 0) {
        hitstopTimer = Math.max(0, hitstopTimer - delta);
        updateAttack(delta);
        updateFloatingTexts(delta);
        updateVisualEffects(delta);
        updateHud();
        updateHudToast(delta);
        return;
      }

      if (pauseOpen || inventoryOpen || shopOpen) {
        updateHud();
        updateInteractionHint();
        updateDebugPanel(delta);
        updateHudToast(delta);
        return;
      }

      const movement = getMovementInput();
      const inputX = movement.x;
      const inputY = movement.y;
      player.moving = inputX !== 0 || inputY !== 0;

      applyPlayerKnockback(delta);
      updateSwimming(delta);

      if (player.moving && !dialogOpen && !inventoryOpen && !shopOpen && Math.abs(playerKnockbackX) + Math.abs(playerKnockbackY) < 8) {
        const length = Math.hypot(inputX, inputY) || 1;
        const strength = movement.strength;
        const moveX = (inputX / length) * getPlayerSpeed() * strength * delta;
        const moveY = (inputY / length) * getPlayerSpeed() * strength * delta;

        if (Math.abs(inputX) > Math.abs(inputY)) {
          player.direction = inputX > 0 ? "right" : "left";
        } else if (inputY !== 0) {
          player.direction = inputY > 0 ? "down" : "up";
        }

        if (canMoveTo(player.x + moveX, player.y)) player.x += moveX;
        if (canMoveTo(player.x, player.y + moveY)) player.y += moveY;

        player.animTimer += delta;
        if (player.animTimer > 0.14) {
          player.frame = (player.frame + 1) % 4;
          player.animTimer = 0;
        }
      } else {
        player.frame = 0;
        player.animTimer = 0;
      }

      updateProjectiles(delta);
      updateEnemyProjectiles(delta);
      updateHazards(delta);
      collectWorldItems();
      updateLoot(delta);
      updateAttack(delta);
      updateFloatingTexts(delta);
      updateVisualEffects(delta);

      const px = player.x + player.width / 2;
      const py = player.y + player.height / 2;
      for (const obj of objects) {
        if (!obj || obj.type !== "enemy" || !obj.alive) continue;
        const ex = obj.x + obj.width / 2;
        const ey = obj.y + obj.height / 2;
        const distance = Math.hypot(ex - px, ey - py);
        if (distance > Math.max(obj.aggroRange || 240, 420)) continue;

        obj.attackCooldown = Math.max(0, Number(obj.attackCooldown || 0) - delta);
        obj.invulnerableTimer = Math.max(0, Number(obj.invulnerableTimer || 0) - delta);

        const dx = px - ex;
        const dy = py - ey;
        const len = Math.hypot(dx, dy) || 1;
        const range = obj.attackRange || 34;

        if (distance > range * 0.75) {
          const nextX = obj.x + (dx / len) * (obj.speed || 40) * delta;
          const nextY = obj.y + (dy / len) * (obj.speed || 40) * delta;
          if (canEntityMoveTo(obj, nextX, obj.y)) obj.x = nextX;
          if (canEntityMoveTo(obj, obj.x, nextY)) obj.y = nextY;
        }

        if (distance <= range && obj.attackCooldown <= 0) {
          if (obj.projectileType && typeof fireEnemyProjectile === "function") {
            fireEnemyProjectile(obj, px, py, 0);
          } else if (damageCooldown <= 0) {
            takeDamage(obj.damage || 1, ex, ey);
          }
          obj.attackCooldown = obj.attackDelay || 1;
        }

        if (obj.boss && distance < (obj.aggroRange || 380) && obj.attackCooldown <= 0.05 && typeof fireBossPattern === "function") {
          fireBossPattern(obj, px, py);
          obj.attackCooldown = obj.attackDelay || 1.1;
        }
      }

      const celestialSafe = window.__celestialSafe;
      celestialSafe.fallCooldown = Math.max(0, celestialSafe.fallCooldown - delta);

      for (const obj of objects) {
        if (obj?.type === "celestialFeature" && obj.role === "platform") {
          const cycle = (performance.now() / 1000 + (obj.blinkOffset || 0)) % 2.4;
          obj.active = cycle < 1.55;
        }
      }

      const playerRect = getPlayerRect();
      const standingOnPlatform = objects.some((obj) => (
        obj?.type === "celestialFeature" &&
        obj.role === "platform" &&
        obj.active &&
        rectsOverlap(playerRect, obj)
      ));

      if (!standingOnPlatform && hitsWater(playerRect) && celestialSafe.fallCooldown <= 0) {
        if (typeof resetCelestialPosition === "function") {
          resetCelestialPosition();
        } else {
          player.x = 27 * TILE + 4;
          player.y = 36 * TILE + 4;
          showHudToast("Voce caiu no vazio e voltou para a ponte inicial.");
        }
        celestialSafe.fallCooldown = 1.2;
      }

      if (getAreaName() === "Jardim das Nuvens" && player.health < player.maxHealth && Math.random() < delta * 0.22) {
        player.health = Math.min(player.maxHealth, player.health + 1);
      }

      celestialSafe.eventTimer -= delta;
      if (celestialSafe.eventTimer <= 0) {
        const events = [
          { key: "chuvaEstrelas", duration: 12, message: "Chuva de estrelas: fragmentos celestiais estao caindo do ceu!" },
          { key: "bencaoAurora", duration: 14, message: "Bencao da Aurora: voce recebeu velocidade, mana e cura lenta." },
          { key: "eclipseSagrado", duration: 10, message: "Eclipse Sagrado: a luz enfraqueceu e guardioes corrompidos despertaram." },
          { key: "invasaoSombria", duration: 10, message: "Invasao Sombria: criaturas do abismo tentam invadir o templo celestial." }
        ];
        const chosen = events[Math.floor(Math.random() * events.length)];
        celestialSafe.eventName = chosen.key;
        celestialSafe.eventDuration = chosen.duration;
        celestialSafe.eventTimer = 30 + Math.random() * 16;
        showHudToast(chosen.message);
      }

      if (celestialSafe.eventDuration > 0) {
        celestialSafe.eventDuration -= delta;
        if (celestialSafe.eventName === "bencaoAurora") {
          player.mana = Math.min(player.maxMana, player.mana + delta * 0.9);
          player.health = Math.min(player.maxHealth, player.health + delta * 0.12);
        } else if (celestialSafe.eventName === "chuvaEstrelas" && Math.random() < delta * 0.25) {
          spawnFloatingText("*", camera.x + 40 + Math.random() * Math.max(20, canvas.width - 80), camera.y + 20 + Math.random() * Math.max(20, canvas.height - 40), "#fff4ac");
        }
        if (celestialSafe.eventDuration <= 0) celestialSafe.eventName = "";
      }

      camera.x = clamp(player.x + player.width / 2 - canvas.width / 2, 0, Math.max(0, getSceneWidth() - canvas.width));
      camera.y = clamp(player.y + player.height / 2 - canvas.height / 2, 0, Math.max(0, getSceneHeight() - canvas.height));

      playerPositionEl.textContent = getAreaName();
      updateHud();
      updateInteractionHint();
      updateDebugPanel(delta);
      updateHudToast(delta);
      if (saveNoticeTimer > 0) saveNoticeTimer = Math.max(0, saveNoticeTimer - delta);
    } catch (error) {
      console.error("Erro seguro na Dimensao Celestial V2:", error);
      showHudToast("Erro celestial evitado. Voltando ao deserto.");
      setActiveScene("village");
      player.x = 122 * TILE + 4;
      player.y = 14 * TILE + 4;
      updateHud();
    }
  };

  const drawMiniMapBeforeCelestialRuntimeSafePatchV2 = drawMiniMap;
  drawMiniMap = function drawMiniMapCelestialRuntimeSafePatchV2() {
    if (currentScene !== "celestialDimension") return drawMiniMapBeforeCelestialRuntimeSafePatchV2();

    try {
      miniCtx.clearRect(0, 0, miniMapCanvas.width, miniMapCanvas.height);
      miniCtx.fillStyle = "rgba(225, 238, 255, 0.95)";
      miniCtx.fillRect(0, 0, miniMapCanvas.width, miniMapCanvas.height);

      const sx = miniMapCanvas.width / Math.max(1, getSceneWidth());
      const sy = miniMapCanvas.height / Math.max(1, getSceneHeight());

      miniCtx.fillStyle = "#f7f7fb";
      miniCtx.fillRect(12, 8, miniMapCanvas.width - 24, miniMapCanvas.height - 16);

      miniCtx.fillStyle = "#d7b66a";
      miniCtx.fillRect(miniMapCanvas.width * 0.43, miniMapCanvas.height * 0.40, miniMapCanvas.width * 0.14, 4);
      miniCtx.fillRect(miniMapCanvas.width * 0.50, miniMapCanvas.height * 0.20, 4, miniMapCanvas.height * 0.55);

      miniCtx.fillStyle = "#55e8ff";
      for (const obj of objects) {
        if (obj.type === "celestialCrystal" || obj.type === "dimensionPortal" || obj.type === "celestialGate") {
          miniCtx.fillRect(obj.x * sx - 2, obj.y * sy - 2, 5, 5);
        }
      }

      miniCtx.fillStyle = "#fff264";
      for (const obj of objects) {
        if (obj.type === "npc" || obj.type === "celestialChest") {
          miniCtx.fillRect(obj.x * sx - 2, obj.y * sy - 2, 5, 5);
        }
      }

      miniCtx.fillStyle = "#d24c63";
      miniCtx.fillRect(player.x * sx - 3, player.y * sy - 3, 7, 7);
    } catch (error) {
      console.error("Erro no minimapa celestial V2:", error);
    }
  };
}

// === Realistic combat feel patch ===
// Deixa o combate mais pesado, legivel e tatico sem alterar o HUD desktop.
if (typeof window !== "undefined" && !window.ETERNAL_RIFT_REALISTIC_COMBAT_PATCH) {
  window.ETERNAL_RIFT_REALISTIC_COMBAT_PATCH = true;

  const realisticCombat = {
    stamina: 100,
    maxStamina: 100,
    regen: 22,
    exhaustedTimer: 0,
    lastAttackKind: "",
    lastImpactTimer: 0,
    pendingRanged: null,
    statusTimer: 0,
    statusText: "",
    comboWindow: 0,
    comboStep: 0
  };

  function realisticProfileForWeapon(weaponKey = getCurrentWeaponKey()) {
    const weapon = weapons[weaponKey] || weapons.sword;
    const elemental = weapon.elemental || "";
    const isElementalSword = Boolean(weapon.bossWeapon || elemental);

    const baseProfiles = {
      sword: {
        stamina: 18,
        windup: 0.13,
        active: 0.15,
        recovery: 0.22,
        cooldown: 0.48,
        range: 52,
        arc: Math.PI * 0.68,
        knockback: 155,
        movementPenalty: 0.72,
        name: "Corte curto",
        visual: "slash"
      },
      spear: {
        stamina: 24,
        windup: 0.20,
        active: 0.17,
        recovery: 0.34,
        cooldown: 0.72,
        range: 86,
        arc: Math.PI * 0.18,
        knockback: 210,
        movementPenalty: 0.60,
        name: "Estocada precisa",
        visual: "thrust"
      },
      bow: {
        stamina: 16,
        windup: 0.34,
        active: 0.08,
        recovery: 0.20,
        cooldown: 0.62,
        range: Math.max(420, weapon.range || 420),
        arc: Math.PI * 0.12,
        knockback: 105,
        movementPenalty: 0.56,
        name: "Disparo tensionado",
        visual: "bow"
      },
      staff: {
        stamina: 22,
        windup: 0.30,
        active: 0.10,
        recovery: 0.28,
        cooldown: 0.72,
        range: Math.max(390, weapon.range || 390),
        arc: Math.PI * 0.18,
        knockback: 130,
        movementPenalty: 0.62,
        name: "Conjuracao",
        visual: "cast"
      }
    };

    let profile = baseProfiles[weaponKey] || (weapon.kind === "projectile" ? baseProfiles.staff : baseProfiles.sword);
    profile = { ...profile };

    if (weapon.kind === "line") {
      profile = { ...baseProfiles.spear, range: Math.max(profile.range, weapon.range || 72), arc: Math.min(profile.arc, weapon.arc || profile.arc) };
    } else if (weapon.kind === "projectile") {
      profile = { ...(weapon.projectile === "arrow" ? baseProfiles.bow : baseProfiles.staff), range: weapon.range || profile.range };
    } else if (weapon.kind === "melee" && weaponKey !== "sword") {
      profile = {
        ...baseProfiles.sword,
        stamina: isElementalSword ? 23 : 20,
        windup: elemental === "storm" ? 0.11 : 0.16,
        active: 0.16,
        recovery: elemental === "ice" ? 0.30 : 0.25,
        cooldown: Math.max(0.52, weapon.cooldown || 0.52),
        range: Math.max(58, weapon.range || 58),
        arc: weapon.arc || Math.PI * 0.74,
        knockback: elemental === "fire" ? 195 : elemental === "ice" ? 170 : 165,
        movementPenalty: 0.66,
        name: weapon.name || "Espada elemental",
        visual: elemental || "slash"
      };
    }

    profile.damage = Math.max(1, Number(weapon.damage || 2));
    profile.damageType = weapon.damageType || "fisico";
    profile.projectile = weapon.projectile || null;
    profile.projectileSpeed = weapon.projectileSpeed || (weapon.projectile === "arrow" ? 440 : 340);
    profile.weaponName = weapon.name || "Arma";
    return profile;
  }

  function canUseRealisticCombatInScene() {
    return !["home", "shopInterior", "mayorInterior"].includes(currentScene);
  }

  function getAttackableObjectsForCurrentScene() {
    if (currentScene === "village") return villageObjects;
    if (Array.isArray(objects)) return objects;
    return [];
  }

  function setRealisticCombatStatus(text, seconds = 1.2) {
    realisticCombat.statusText = text;
    realisticCombat.statusTimer = seconds;
  }

  function spendCombatStamina(amount) {
    if (realisticCombat.stamina + 0.001 < amount) {
      realisticCombat.exhaustedTimer = 0.8;
      setRealisticCombatStatus("Sem folego", 0.9);
      spawnFloatingText("Sem folego", player.x + 4, player.y - 18, "#fff264");
      playSound("invalid");
      vibrate(10);
      return false;
    }
    realisticCombat.stamina = Math.max(0, realisticCombat.stamina - amount);
    return true;
  }

  function startRealisticMeleeAttack(weaponKey, weapon, profile, aim, swimPenalty) {
    const comboBonus = realisticCombat.comboWindow > 0 ? Math.min(2, realisticCombat.comboStep + 1) : 0;
    realisticCombat.comboStep = comboBonus;
    realisticCombat.comboWindow = 0.48;

    const activeTime = profile.active * swimPenalty;
    const totalTime = (profile.windup + profile.active + profile.recovery) * swimPenalty;
    attackDirection = player.direction;
    attackWindupTimer = profile.windup * swimPenalty;
    attackRecoveryTimer = (profile.recovery + profile.active) * swimPenalty;
    attackTimer = totalTime;
    weaponCooldownTimer = Math.max(profile.cooldown, totalTime) * swimPenalty;
    attackHitDone = false;

    currentMeleeAttack = {
      weaponKey,
      angle: aim.angle,
      range: (isMobile ? profile.range + 12 : profile.range),
      arc: isMobile ? Math.min(Math.PI * 0.92, profile.arc * 1.14) : profile.arc,
      timer: totalTime,
      maxTimer: totalTime,
      windup: profile.windup * swimPenalty,
      active: activeTime,
      recovery: profile.recovery * swimPenalty,
      profile,
      comboStep: comboBonus,
      hitboxLength: profile.range,
      realistic: true
    };

    realisticCombat.lastAttackKind = profile.visual;
    setRealisticCombatStatus(profile.name, 0.65);
    playSound("attack");
    vibrate(18);
  }

  function startRealisticRangedAttack(weaponKey, weapon, profile, aim, swimPenalty) {
    attackWindupTimer = profile.windup * swimPenalty;
    attackRecoveryTimer = (profile.recovery + profile.active) * swimPenalty;
    attackTimer = (profile.windup + profile.active + profile.recovery) * swimPenalty;
    weaponCooldownTimer = profile.cooldown * swimPenalty;
    attackHitDone = true;
    currentMeleeAttack = null;
    realisticCombat.pendingRanged = {
      weaponKey,
      weapon,
      profile,
      aim: { ...aim },
      timer: profile.windup * swimPenalty,
      fired: false
    };
    realisticCombat.lastAttackKind = profile.visual;
    setRealisticCombatStatus(profile.name, 0.65);
    playSound(weapon.projectile === "arrow" ? "bow" : "magic");
    vibrate(12);
  }

  triggerPrimaryAttack = function triggerPrimaryAttackRealisticCombat() {
    if (gameOver || dialogOpen || inventoryOpen || shopOpen || pauseOpen || !canUseRealisticCombatInScene()) return;
    if (weaponCooldownTimer > 0 || attackWindupTimer > 0 || attackRecoveryTimer > 0 || attackTimer > 0 || realisticCombat.pendingRanged) return;

    updateDirectionFromAim();
    const weaponKey = getCurrentWeaponKey();
    const weapon = getCurrentWeapon() || weapons.sword;
    const profile = realisticProfileForWeapon(weaponKey);
    const aim = getAimVector();
    const swimPenalty = player.isSwimming && weapon.kind !== "projectile" ? 1.35 : 1;
    const staminaCost = profile.stamina * (player.isSwimming ? 1.15 : 1);

    if (!spendCombatStamina(staminaCost)) {
      weaponCooldownTimer = 0.18;
      return;
    }

    if (weapon.kind === "projectile") {
      if (weapon.projectile === "arrow" && inventory.flechas <= 0) {
        realisticCombat.stamina = Math.min(realisticCombat.maxStamina, realisticCombat.stamina + staminaCost * 0.72);
        weaponCooldownTimer = 0.18;
        spawnFloatingText("Sem flechas", player.x + 4, player.y - 16, "#fff264");
        playSound("invalid");
        return;
      }
      startRealisticRangedAttack(weaponKey, weapon, profile, aim, swimPenalty);
      return;
    }

    startRealisticMeleeAttack(weaponKey, weapon, profile, aim, swimPenalty);
  };

  triggerAttack = function triggerAttackRealisticCombat() {
    triggerPrimaryAttack();
  };

  const updateAttackBeforeRealisticCombat = updateAttack;
  updateAttack = function updateAttackRealisticCombat(delta) {
    realisticCombat.comboWindow = Math.max(0, realisticCombat.comboWindow - delta);
    if (realisticCombat.comboWindow <= 0) realisticCombat.comboStep = 0;

    const staminaRegenPenalty = (attackWindupTimer > 0 || attackRecoveryTimer > 0 || realisticCombat.pendingRanged) ? 0.34 : 1;
    const staminaRegen = realisticCombat.regen * staminaRegenPenalty * (realisticCombat.exhaustedTimer > 0 ? 0.45 : 1);
    realisticCombat.stamina = Math.min(realisticCombat.maxStamina, realisticCombat.stamina + staminaRegen * delta);
    realisticCombat.exhaustedTimer = Math.max(0, realisticCombat.exhaustedTimer - delta);
    realisticCombat.lastImpactTimer = Math.max(0, realisticCombat.lastImpactTimer - delta);
    realisticCombat.statusTimer = Math.max(0, realisticCombat.statusTimer - delta);

    if (realisticCombat.pendingRanged) {
      const pending = realisticCombat.pendingRanged;
      pending.timer = Math.max(0, pending.timer - delta);
      if (!pending.fired && pending.timer <= 0) {
        pending.fired = true;
        const weapon = pending.weapon || getCurrentWeapon() || weapons.sword;
        const profile = pending.profile || realisticProfileForWeapon(pending.weaponKey);
        const aim = pending.aim || getAimVector();
        const finalWeapon = { ...weapon, damage: profile.damage, range: profile.range, projectileSpeed: profile.projectileSpeed };
        fireWeaponProjectile(finalWeapon, aim);
        realisticCombat.lastImpactTimer = 0.12;
      }
      if (pending.fired && attackRecoveryTimer <= 0.02) realisticCombat.pendingRanged = null;
    }

    updateAttackBeforeRealisticCombat(delta);
  };

  resolveBasicAttack = function resolveBasicAttackRealisticCombat() {
    if (!currentMeleeAttack) return;
    const profile = currentMeleeAttack.profile || realisticProfileForWeapon(currentMeleeAttack.weaponKey);
    let hit = false;
    let hitCount = 0;
    const centerX = player.x + player.width / 2;
    const centerY = player.y + player.height / 2;

    const attackables = getAttackableObjectsForCurrentScene();
    for (const obj of attackables) {
      if (obj.type !== "enemy" || !obj.alive || !enemyInRealisticMeleeArc(obj, currentMeleeAttack)) continue;
      hitCount += 1;
      const targetCenterX = obj.x + obj.width / 2;
      const targetCenterY = obj.y + obj.height / 2;
      const distance = Math.hypot(targetCenterX - centerX, targetCenterY - centerY);
      const sweetSpot = clamp(1 - Math.abs(distance - currentMeleeAttack.range * 0.68) / Math.max(1, currentMeleeAttack.range), 0.82, 1.18);
      const multiTargetPenalty = hitCount > 1 && profile.visual !== "slash" ? 0.72 : 1;
      const comboBonus = currentMeleeAttack.comboStep ? currentMeleeAttack.comboStep * 0.12 : 0;
      const damage = Math.max(1, Math.round(getBasicAttackDamage(currentMeleeAttack.weaponKey) * sweetSpot * multiTargetPenalty * (1 + comboBonus)));
      const knockback = profile.knockback * (obj.boss ? 0.42 : 1) * (profile.visual === "thrust" ? 1.18 : 1);
      if (damageEnemy(obj, damage, centerX, centerY, knockback, profile.damageType)) {
        hit = true;
        obj.attackCooldown = Math.max(obj.attackCooldown || 0, profile.visual === "thrust" ? 0.35 : 0.22);
      }
    }

    if (hit) {
      realisticCombat.lastImpactTimer = 0.16;
      hitstopTimer = Math.max(hitstopTimer || 0, 0.045);
      playSound("hitEnemy");
      vibrate(hitCount > 1 ? [12, 18, 12] : 22);
    } else {
      setRealisticCombatStatus("Errou", 0.45);
      realisticCombat.comboWindow = 0;
      realisticCombat.comboStep = 0;
    }
  };

  function enemyInRealisticMeleeArc(enemyObj, attack) {
    const centerX = player.x + player.width / 2;
    const centerY = player.y + player.height / 2;
    const enemyX = enemyObj.x + enemyObj.width / 2;
    const enemyY = enemyObj.y + enemyObj.height / 2;
    const dx = enemyX - centerX;
    const dy = enemyY - centerY;
    const distance = Math.hypot(dx, dy);
    const targetRadius = Math.max(enemyObj.width, enemyObj.height) * 0.46;
    if (distance > attack.range + targetRadius) return false;

    const angle = Math.atan2(dy, dx);
    const diff = Math.abs(angleDifference(angle, attack.angle));
    const closeGrace = distance < 26 ? Math.PI * 0.18 : 0;
    return diff <= attack.arc / 2 + closeGrace;
  }

  const updateProjectilesBeforeRealisticCombat = updateProjectiles;
  updateProjectiles = function updateProjectilesRealisticCombat(delta) {
    updateProjectilesBeforeRealisticCombat(delta);
    if (currentScene === "village") return;
    const attackables = getAttackableObjectsForCurrentScene();
    if (!Array.isArray(projectiles) || !attackables.length) return;

    for (let i = projectiles.length - 1; i >= 0; i--) {
      const obj = projectiles[i];
      const target = attackables.find((enemyObj) => enemyObj.type === "enemy" && enemyObj.alive && rectsOverlap(obj, enemyObj));
      if (!target) continue;
      const targetKey = getSaveObjectKey(target);
      if (!obj.hitKeys) obj.hitKeys = new Set();
      if (obj.hitKeys.has(targetKey)) continue;
      damageEnemy(target, obj.damage || 1, obj.x, obj.y, obj.type === "arrow" ? 160 : 185, obj.damageType || "fisico");
      obj.hitKeys.add(targetKey);
      if (obj.pierce > 0) obj.pierce -= 1;
      else projectiles.splice(i, 1);
    }
  };

  const getPlayerSpeedBeforeRealisticCombat = getPlayerSpeed;
  getPlayerSpeed = function getPlayerSpeedRealisticCombat() {
    let speed = getPlayerSpeedBeforeRealisticCombat();
    const weaponKey = getCurrentWeaponKey();
    const profile = realisticProfileForWeapon(weaponKey);
    if (attackWindupTimer > 0 || realisticCombat.pendingRanged) speed *= profile.movementPenalty;
    else if (attackRecoveryTimer > 0 || attackTimer > 0) speed *= Math.min(0.86, profile.movementPenalty + 0.16);
    if (realisticCombat.stamina <= 8) speed *= 0.88;
    return speed;
  };

  function drawRealisticAttackArc(attack, profile, progress, activeProgress) {
    const centerX = player.x + player.width / 2;
    const centerY = player.y + player.height / 2;
    const preparing = attackWindupTimer > 0;
    const impact = realisticCombat.lastImpactTimer > 0;
    const visual = profile.visual;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(attack.angle);

    if (visual === "thrust") {
      const reach = 18 + attack.range * (preparing ? 0.42 : 0.72 + activeProgress * 0.28);
      ctx.fillStyle = preparing ? "rgba(235, 245, 255, 0.18)" : "rgba(230, 235, 245, 0.32)";
      ctx.fillRect(12, -4, reach, 8);
      ctx.strokeStyle = impact ? "#fff4bc" : "#e9ffff";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(10, 0);
      ctx.lineTo(reach + 20, 0);
      ctx.stroke();
      ctx.fillStyle = "#c8d0d8";
      ctx.beginPath();
      ctx.moveTo(reach + 26, 0);
      ctx.lineTo(reach + 12, -7);
      ctx.lineTo(reach + 12, 7);
      ctx.closePath();
      ctx.fill();
    } else {
      const radius = attack.range * (preparing ? 0.62 : 0.9 + activeProgress * 0.1);
      const start = -attack.arc / 2 + activeProgress * 0.25;
      const end = attack.arc / 2 + activeProgress * 0.25;
      const elementalColor = visual === "fire" ? "255, 108, 48" : visual === "ice" ? "128, 220, 255" : visual === "storm" ? "255, 235, 91" : visual === "shadow" ? "174, 95, 255" : "255, 242, 180";
      ctx.fillStyle = preparing ? `rgba(${elementalColor}, 0.10)` : `rgba(${elementalColor}, 0.24)`;
      ctx.strokeStyle = impact ? "#ffffff" : `rgba(${elementalColor}, 0.86)`;
      ctx.lineWidth = preparing ? 2 : 4;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, start, end);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgba(39, 48, 82, 0.48)";
      ctx.beginPath();
      ctx.arc(0, 0, radius + 2, start, end);
      ctx.stroke();
    }

    ctx.restore();
  }

  drawAttack = function drawAttackRealisticCombat() {
    if (attackTimer <= 0 && !realisticCombat.pendingRanged) return;

    if (realisticCombat.pendingRanged) {
      const pending = realisticCombat.pendingRanged;
      const profile = pending.profile || realisticProfileForWeapon(pending.weaponKey);
      const progress = 1 - clamp(pending.timer / Math.max(0.001, profile.windup), 0, 1);
      const centerX = player.x + player.width / 2;
      const centerY = player.y + player.height / 2;
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(pending.aim?.angle || getAimVector().angle);
      if (profile.visual === "bow") {
        ctx.strokeStyle = "rgba(217, 155, 103, 0.95)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(13, 0, 17, -1.25, 1.25);
        ctx.stroke();
        ctx.strokeStyle = "rgba(245, 243, 226, 0.85)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(18, -16);
        ctx.lineTo(18 - progress * 14, 0);
        ctx.lineTo(18, 16);
        ctx.stroke();
        ctx.fillStyle = "#e9ffff";
        ctx.fillRect(3 - progress * 10, -2, 28, 4);
      } else {
        ctx.fillStyle = `rgba(85, 232, 255, ${0.16 + progress * 0.22})`;
        ctx.beginPath();
        ctx.arc(22, 0, 8 + progress * 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#e9ffff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(2, 0);
        ctx.lineTo(34 + progress * 10, 0);
        ctx.stroke();
      }
      ctx.restore();
      return;
    }

    if (!currentMeleeAttack) return;
    const profile = currentMeleeAttack.profile || realisticProfileForWeapon(currentMeleeAttack.weaponKey);
    const progress = 1 - clamp(currentMeleeAttack.timer / Math.max(0.001, currentMeleeAttack.maxTimer || attackTimer), 0, 1);
    const activeStart = currentMeleeAttack.windup / Math.max(0.001, currentMeleeAttack.maxTimer);
    const activeEnd = (currentMeleeAttack.windup + currentMeleeAttack.active) / Math.max(0.001, currentMeleeAttack.maxTimer);
    const activeProgress = clamp((progress - activeStart) / Math.max(0.001, activeEnd - activeStart), 0, 1);
    drawRealisticAttackArc(currentMeleeAttack, profile, progress, activeProgress);
  };

  const drawBeforeRealisticCombat = draw;
  draw = function drawRealisticCombatHud() {
    drawBeforeRealisticCombat();
    drawCombatStaminaHud();
  };

  function drawCombatStaminaHud() {
    if (!gameStarted || startScreen?.classList.contains("hidden") === false) return;
    if (realisticCombat.stamina > 97 && attackTimer <= 0 && !realisticCombat.pendingRanged && realisticCombat.statusTimer <= 0) return;

    const screenX = Math.round(player.x + player.width / 2 - camera.x);
    const screenY = Math.round(player.y - camera.y - 14);
    const width = isMobile ? 54 : 62;
    const height = 6;
    const x = screenX - width / 2;
    const y = screenY;
    const percent = clamp(realisticCombat.stamina / realisticCombat.maxStamina, 0, 1);

    ctx.save();
    ctx.fillStyle = "rgba(21, 25, 44, 0.72)";
    ctx.fillRect(x - 2, y - 2, width + 4, height + 4);
    ctx.fillStyle = "rgba(58, 49, 44, 0.92)";
    ctx.fillRect(x, y, width, height);
    ctx.fillStyle = percent < 0.22 ? "#ff7a5f" : percent < 0.5 ? "#fff264" : "#77e67a";
    ctx.fillRect(x, y, width * percent, height);
    ctx.strokeStyle = "rgba(255,255,255,0.45)";
    ctx.strokeRect(x - 0.5, y - 0.5, width + 1, height + 1);

    if (realisticCombat.statusTimer > 0 && realisticCombat.statusText) {
      ctx.font = isMobile ? "10px Arial" : "11px Arial";
      ctx.textAlign = "center";
      ctx.lineWidth = 3;
      ctx.strokeStyle = "rgba(21, 25, 44, 0.92)";
      ctx.fillStyle = "#fff3d6";
      ctx.strokeText(realisticCombat.statusText, screenX, y - 4);
      ctx.fillText(realisticCombat.statusText, screenX, y - 4);
    }
    ctx.restore();
  }

  const updateHudBeforeRealisticCombat = updateHud;
  updateHud = function updateHudRealisticCombat() {
    updateHudBeforeRealisticCombat();
    if (weaponHud && canUseRealisticCombatInScene()) {
      const staminaText = realisticCombat.stamina < 28 ? " | Folego baixo" : "";
      weaponHud.textContent = `${weaponHud.textContent}${staminaText}`;
    }
  };
}

// === Realistic 2D pixel sword visuals patch ===
(function () {
  function getSwordThemeForGame(weaponKey) {
    const key = weaponKey || safeCurrentWeaponKeyForVisual();
    const base = {
      key,
      guard: "#d2a95a",
      guardShadow: "#7d5832",
      grip: "#38548a",
      gripShadow: "#1f2d4d",
      pommel: "#d2a95a",
      gem: "#63d4ff",
      gemGlow: "rgba(99,212,255,0.35)",
      bladeCore: "#f8fbff",
      bladeMid: "#b9c8e8",
      bladeEdge: "#5b78b3",
      bladeShadow: "#26355b",
      bladeAccent: "#ebf4ff",
      slashMain: "rgba(255,252,210,0.92)",
      slashGlow: "rgba(130,195,255,0.40)",
      aura: "rgba(99,212,255,0.20)",
      element: "classic",
      serrated: false,
      crystal: false,
      dark: false,
      lightning: false
    };

    if (key === "stormSword") {
      return {
        ...base,
        guard: "#d6b05a",
        guardShadow: "#715527",
        grip: "#294f86",
        gripShadow: "#162844",
        gem: "#5fe8ff",
        gemGlow: "rgba(95,232,255,0.45)",
        bladeCore: "#ffe67b",
        bladeMid: "#3c5ea2",
        bladeEdge: "#92d9ff",
        bladeShadow: "#17325f",
        bladeAccent: "#f7fbff",
        slashMain: "rgba(255,235,121,0.90)",
        slashGlow: "rgba(95,232,255,0.42)",
        aura: "rgba(95,232,255,0.22)",
        element: "storm",
        lightning: true
      };
    }
    if (key === "fireSword") {
      return {
        ...base,
        guard: "#4d2c24",
        guardShadow: "#22120f",
        grip: "#6c4330",
        gripShadow: "#362116",
        pommel: "#4d2c24",
        gem: "#ff6b2f",
        gemGlow: "rgba(255,107,47,0.45)",
        bladeCore: "#ff7f32",
        bladeMid: "#7c120d",
        bladeEdge: "#ffcf54",
        bladeShadow: "#2c0908",
        bladeAccent: "#ffd56b",
        slashMain: "rgba(255,142,68,0.92)",
        slashGlow: "rgba(255,78,37,0.36)",
        aura: "rgba(255,84,34,0.18)",
        element: "fire",
        serrated: true,
        dark: true
      };
    }
    if (key === "iceSword") {
      return {
        ...base,
        guard: "#c5d9f3",
        guardShadow: "#61779d",
        grip: "#356fbf",
        gripShadow: "#1e3b67",
        pommel: "#c5d9f3",
        gem: "#63d4ff",
        gemGlow: "rgba(115,213,255,0.50)",
        bladeCore: "#c7f7ff",
        bladeMid: "#55bff1",
        bladeEdge: "#dff8ff",
        bladeShadow: "#225ca7",
        bladeAccent: "#ffffff",
        slashMain: "rgba(210,248,255,0.94)",
        slashGlow: "rgba(115,213,255,0.40)",
        aura: "rgba(115,213,255,0.22)",
        element: "ice",
        crystal: true
      };
    }
    if (key === "shadowSword") {
      return {
        ...base,
        guard: "#352245",
        guardShadow: "#17101f",
        grip: "#3c3051",
        gripShadow: "#1d1628",
        pommel: "#352245",
        gem: "#b86bff",
        gemGlow: "rgba(184,107,255,0.45)",
        bladeCore: "#6b3bd3",
        bladeMid: "#20152f",
        bladeEdge: "#b98dff",
        bladeShadow: "#09060d",
        bladeAccent: "#d8beff",
        slashMain: "rgba(198,136,255,0.92)",
        slashGlow: "rgba(112,72,165,0.34)",
        aura: "rgba(155,95,199,0.24)",
        element: "shadow",
        dark: true
      };
    }
    return base;
  }

  function drawPixelDiamond(cx, cy, w, h, fill, outline) {
    ctx.fillStyle = outline || "#273052";
    ctx.beginPath();
    ctx.moveTo(cx, cy - h / 2 - 1);
    ctx.lineTo(cx + w / 2 + 1, cy);
    ctx.lineTo(cx, cy + h / 2 + 1);
    ctx.lineTo(cx - w / 2 - 1, cy);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.moveTo(cx, cy - h / 2);
    ctx.lineTo(cx + w / 2, cy);
    ctx.lineTo(cx, cy + h / 2);
    ctx.lineTo(cx - w / 2, cy);
    ctx.closePath();
    ctx.fill();
  }

  function drawRealisticSwordAura(theme, progress) {
    const pulse = 0.8 + Math.sin(((performance.now ? performance.now() : Date.now()) / 120) % (Math.PI * 2)) * 0.2;
    const alpha = (0.14 + Math.max(0, progress) * 0.18) * pulse;
    ctx.fillStyle = theme.aura.replace(/0\.\d+\)/, `${Math.min(0.55, alpha).toFixed(2)})`);
    if (theme.element === "shadow") {
      ctx.fillRect(1, -12, 32, 24);
      ctx.fillRect(6, -15, 22, 30);
    } else if (theme.element === "fire") {
      ctx.fillRect(5, -10, 26, 20);
      ctx.fillRect(10, -13, 16, 26);
    } else {
      ctx.fillRect(4, -10, 28, 20);
      ctx.fillRect(10, -13, 16, 26);
    }

    if (theme.lightning) {
      ctx.strokeStyle = "rgba(95,232,255,0.65)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(10, -10); ctx.lineTo(14, -4); ctx.lineTo(11, 0); ctx.lineTo(17, 7);
      ctx.moveTo(23, -9); ctx.lineTo(27, -2); ctx.lineTo(24, 3); ctx.lineTo(29, 10);
      ctx.stroke();
    } else if (theme.element === "fire") {
      ctx.fillStyle = "rgba(255,214,107,0.55)";
      ctx.fillRect(27, -11, 2, 2); ctx.fillRect(30, -6, 2, 2); ctx.fillRect(28, 7, 2, 2);
    } else if (theme.element === "ice") {
      ctx.fillStyle = "rgba(223,248,255,0.75)";
      ctx.fillRect(27, -9, 2, 2); ctx.fillRect(29, 2, 2, 2); ctx.fillRect(8, -12, 2, 2);
    } else if (theme.element === "shadow") {
      ctx.fillStyle = "rgba(184,107,255,0.45)";
      ctx.fillRect(29, -11, 2, 2); ctx.fillRect(30, 8, 2, 2); ctx.fillRect(6, -13, 2, 2);
    }
  }

  function drawOrnateSwordBody(theme, progress) {
    const thrust = progress > 0 ? Math.sin(Math.min(1, progress) * Math.PI) * 9 : 0;
    ctx.translate(7 + thrust, 0);

    drawRealisticSwordAura(theme, progress);

    // Grip
    ctx.fillStyle = theme.gripShadow;
    ctx.fillRect(-10, -4, 12, 8);
    ctx.fillStyle = theme.grip;
    ctx.fillRect(-9, -3, 10, 6);
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.fillRect(-7, -2, 6, 1);
    ctx.fillStyle = theme.guardShadow;
    for (let i = -8; i <= -1; i += 3) ctx.fillRect(i, -3, 1, 6);

    // Pommel
    ctx.fillStyle = theme.guardShadow;
    ctx.fillRect(-13, -3, 4, 6);
    drawPixelDiamond(-14, 0, 6, 8, theme.gem, theme.guardShadow);

    // Guard
    ctx.fillStyle = theme.guardShadow;
    ctx.fillRect(-1, -7, 8, 14);
    ctx.fillRect(1, -9, 4, 18);
    ctx.fillRect(3, -10, 2, 20);

    ctx.fillStyle = theme.guard;
    ctx.fillRect(0, -6, 6, 12);
    ctx.fillRect(2, -8, 2, 16);
    ctx.fillRect(-2, -3, 6, 2);
    ctx.fillRect(-3, -4, 7, 2);
    ctx.fillRect(-4, -5, 8, 1);
    ctx.fillRect(-2, 1, 6, 2);
    ctx.fillRect(-3, 3, 7, 1);

    if (theme.element === "fire" || theme.element === "shadow") {
      ctx.fillStyle = theme.guard;
      ctx.fillRect(-4, -8, 3, 3); ctx.fillRect(-5, -9, 2, 2);
      ctx.fillRect(-4, 5, 3, 3); ctx.fillRect(-5, 7, 2, 2);
      ctx.fillRect(4, -8, 3, 3); ctx.fillRect(5, -9, 2, 2);
      ctx.fillRect(4, 5, 3, 3); ctx.fillRect(5, 7, 2, 2);
    } else {
      ctx.fillStyle = theme.guard;
      ctx.fillRect(-5, -6, 4, 2); ctx.fillRect(-6, -7, 2, 2);
      ctx.fillRect(-5, 4, 4, 2); ctx.fillRect(-6, 5, 2, 2);
      ctx.fillRect(4, -6, 4, 2); ctx.fillRect(7, -7, 2, 2);
      ctx.fillRect(4, 4, 4, 2); ctx.fillRect(7, 5, 2, 2);
    }

    drawPixelDiamond(3, 0, 7, 8, theme.gem, theme.guardShadow);

    // Blade outline and body
    ctx.fillStyle = theme.bladeShadow;
    ctx.beginPath();
    ctx.moveTo(6, -7);
    ctx.lineTo(14, -7);
    ctx.lineTo(34, -2);
    ctx.lineTo(39, 0);
    ctx.lineTo(34, 2);
    ctx.lineTo(14, 7);
    ctx.lineTo(6, 7);
    ctx.closePath();
    ctx.fill();

    if (theme.crystal) {
      ctx.fillStyle = theme.bladeMid;
      ctx.beginPath();
      ctx.moveTo(8, -5);
      ctx.lineTo(15, -5);
      ctx.lineTo(33, -1);
      ctx.lineTo(37, 0);
      ctx.lineTo(33, 1);
      ctx.lineTo(15, 5);
      ctx.lineTo(8, 5);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = theme.bladeAccent;
      ctx.fillRect(14, -3, 18, 2);
      ctx.fillRect(14, 1, 18, 1);
      ctx.fillRect(20, -7, 3, 3); ctx.fillRect(26, -8, 3, 3);
      ctx.fillRect(20, 4, 3, 3); ctx.fillRect(26, 5, 3, 3);
    } else {
      ctx.fillStyle = theme.bladeMid;
      ctx.beginPath();
      ctx.moveTo(8, -5);
      ctx.lineTo(14, -5);
      ctx.lineTo(33, -1);
      ctx.lineTo(37, 0);
      ctx.lineTo(33, 1);
      ctx.lineTo(14, 5);
      ctx.lineTo(8, 5);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = theme.bladeCore;
      ctx.fillRect(16, -2, 15, 4);
      ctx.fillStyle = theme.bladeAccent;
      ctx.fillRect(16, -4, 14, 1);
    }

    ctx.fillStyle = theme.bladeEdge;
    ctx.fillRect(9, -5, 2, 10);
    ctx.fillRect(32, -2, 4, 4);
    if (theme.serrated) {
      ctx.fillRect(19, -6, 3, 1); ctx.fillRect(24, -7, 3, 1); ctx.fillRect(19, 5, 3, 1); ctx.fillRect(24, 6, 3, 1);
    }
    if (theme.element === "shadow") {
      ctx.fillStyle = theme.bladeAccent;
      for (let i = 13; i < 30; i += 4) { ctx.fillRect(i, -1, 2, 1); ctx.fillRect(i + 1, 1, 1, 1); }
    }
    if (theme.lightning) {
      ctx.fillStyle = theme.bladeCore;
      ctx.fillRect(18, -1, 3, 1); ctx.fillRect(21, 0, 2, 1); ctx.fillRect(23, -1, 3, 1); ctx.fillRect(26, 0, 2, 1);
    }
  }

  drawSwordInHand = function drawSwordInHandRealistic(progress, weaponKey) {
    const theme = getSwordThemeForGame(weaponKey || safeCurrentWeaponKeyForVisual());
    drawOrnateSwordBody(theme, progress || 0);
  };

  drawEquippedWeapon = function drawEquippedWeaponRealistic() {
    try {
      if (!player || gameOver) return;
      const weaponKey = safeCurrentWeaponKeyForVisual();
      const aim = safeAimForWeaponVisual();
      const progress = getWeaponVisualProgress();
      const angle = getWeaponVisualAngle(aim, weaponKey);
      const centerX = player.x + player.width / 2;
      const centerY = player.y + player.height / 2;
      const handDistance = weaponKey === "bow" ? 7 : 8;
      const handX = centerX + Math.cos(angle) * handDistance;
      const handY = centerY + Math.sin(angle) * (weaponKey === "spear" ? 6 : 7) + 3;

      ctx.save();
      ctx.translate(handX, handY);
      ctx.rotate(angle);
      if (Math.cos(angle) < -0.05) ctx.scale(1, -1);

      if (weaponKey === "spear") drawSpearInHand(progress);
      else if (weaponKey === "bow") drawBowInHand(progress || (weaponVisualState.weaponKey === "bow" ? getWeaponVisualProgress() : 0));
      else if (weaponKey === "staff") drawStaffInHand(progress || (weaponVisualState.weaponKey === "staff" ? getWeaponVisualProgress() : 0));
      else drawSwordInHand(progress, weaponKey);

      ctx.restore();
    } catch (error) {
      drawWeaponPatchError("Erro arma: " + (error?.message || error));
    }
  };

  drawSwordSwingEffect = function drawSwordSwingEffectRealistic(attack, progress) {
    const theme = getSwordThemeForGame(attack?.weaponKey || safeCurrentWeaponKeyForVisual());
    const range = attack?.range || 48;
    const arc = attack?.arc || Math.PI * 0.72;
    const sweep = -arc / 2 + arc * progress;

    ctx.strokeStyle = theme.slashGlow;
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.arc(0, 0, range - 4, sweep - 0.18, sweep + 0.18);
    ctx.stroke();

    ctx.strokeStyle = theme.slashMain;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(0, 0, range, sweep - 0.30, sweep + 0.30);
    ctx.stroke();

    const tipX = Math.cos(sweep) * range;
    const tipY = Math.sin(sweep) * range;
    if (theme.element === "storm") {
      ctx.strokeStyle = "rgba(95,232,255,0.8)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(tipX - 3, tipY - 9); ctx.lineTo(tipX + 1, tipY - 2); ctx.lineTo(tipX - 2, tipY + 2); ctx.lineTo(tipX + 5, tipY + 10);
      ctx.stroke();
    } else if (theme.element === "fire") {
      ctx.fillStyle = "rgba(255,214,107,0.7)";
      ctx.fillRect(tipX - 2, tipY - 6, 2, 2); ctx.fillRect(tipX + 2, tipY - 1, 2, 2); ctx.fillRect(tipX - 1, tipY + 4, 2, 2);
    } else if (theme.element === "ice") {
      ctx.fillStyle = "rgba(223,248,255,0.8)";
      ctx.fillRect(tipX - 5, tipY - 1, 4, 1); ctx.fillRect(tipX + 1, tipY - 4, 1, 4); ctx.fillRect(tipX + 3, tipY + 2, 3, 1);
    } else if (theme.element === "shadow") {
      ctx.fillStyle = "rgba(184,107,255,0.55)";
      ctx.fillRect(tipX - 4, tipY - 4, 8, 8);
    }
  };
})();

// === Realistic 2D pixel visuals for spear, bow, and staff ===
(function () {
  function weaponGlowSpark(color, x, y) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 2, 2);
    ctx.fillRect(x + 2, y + 1, 1, 1);
  }

  drawSpearInHand = function drawSpearInHandRealistic(progress) {
    const thrust = progress > 0 ? Math.sin(Math.min(1, progress) * Math.PI) * 17 : 0;
    const shimmer = 0.2 + Math.max(0, progress) * 0.35;
    ctx.translate(7 + thrust, 0);

    // Soft thrust aura
    ctx.fillStyle = `rgba(205,240,255,${shimmer * 0.35})`;
    ctx.fillRect(2, -8, 42, 16);

    // Counterweight / butt cap
    ctx.fillStyle = "#2a324f";
    ctx.fillRect(-16, -3, 6, 6);
    ctx.fillStyle = "#c3ccd8";
    ctx.fillRect(-15, -2, 4, 4);

    // Shaft outline and wood
    ctx.fillStyle = "#25304d";
    ctx.fillRect(-10, -3, 47, 6);
    ctx.fillStyle = "#8f5c36";
    ctx.fillRect(-9, -2, 45, 4);
    ctx.fillStyle = "#b47949";
    ctx.fillRect(-6, -1, 34, 1);

    // Grip wrapping
    ctx.fillStyle = "#563726";
    for (let i = -2; i < 12; i += 4) {
      ctx.fillRect(i, -2, 1, 4);
    }

    // Gold ring / center band
    ctx.fillStyle = "#d1af65";
    ctx.fillRect(13, -4, 3, 8);
    ctx.fillStyle = "#70552a";
    ctx.fillRect(14, -3, 1, 6);

    // Small cloth pennant near the head
    ctx.fillStyle = "#9cc7ff";
    ctx.fillRect(26, -7, 4, 5);
    ctx.fillRect(28, -2, 3, 3);
    ctx.fillStyle = "#4568a8";
    ctx.fillRect(27, -6, 1, 6);

    // Head outline
    ctx.fillStyle = "#25304d";
    ctx.beginPath();
    ctx.moveTo(31, -10);
    ctx.lineTo(46, 0);
    ctx.lineTo(31, 10);
    ctx.lineTo(27, 0);
    ctx.closePath();
    ctx.fill();

    // Main metal head
    ctx.fillStyle = "#dbe6f4";
    ctx.beginPath();
    ctx.moveTo(32, -8);
    ctx.lineTo(44, 0);
    ctx.lineTo(32, 8);
    ctx.lineTo(29, 0);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#f8fcff";
    ctx.fillRect(33, -2, 9, 2);
    ctx.fillStyle = "#98b1d6";
    ctx.fillRect(33, 1, 8, 2);
    ctx.fillStyle = "#6b83aa";
    ctx.fillRect(36, -5, 1, 10);

    // Side wings for an ornate look
    ctx.fillStyle = "#aabdd6";
    ctx.fillRect(27, -5, 4, 2);
    ctx.fillRect(27, 3, 4, 2);

    if (progress > 0.02) {
      // Impact trail
      ctx.fillStyle = `rgba(235,250,255,${0.42 + shimmer * 0.4})`;
      ctx.fillRect(40, -3, 16, 6);
      ctx.fillStyle = "rgba(125,211,252,0.5)";
      ctx.fillRect(48, -1, 10, 2);
    }
  };

  drawBowInHand = function drawBowInHandRealistic(progress) {
    const t = Math.max(0, Math.min(1, progress || 0));
    const tension = Math.sin(t * Math.PI) * 7;
    ctx.translate(6, 0);

    // Bow glow/backing
    ctx.fillStyle = `rgba(255,228,171,${0.10 + t * 0.15})`;
    ctx.fillRect(-18, -18, 28, 36);

    // Outer frame outline
    ctx.strokeStyle = "#25304d";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(-1, 0, 17, -1.18, 1.18);
    ctx.stroke();

    // Wooden body
    ctx.strokeStyle = "#8e5a37";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(-1, 0, 17, -1.12, 1.12);
    ctx.stroke();

    // Inner gilded trim
    ctx.strokeStyle = "#d0b06a";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(-1, 0, 15, -1.03, 1.03);
    ctx.stroke();

    // Tips / reinforced horns
    ctx.fillStyle = "#25304d";
    ctx.fillRect(2, -15, 4, 3);
    ctx.fillRect(2, 12, 4, 3);
    ctx.fillStyle = "#d0b06a";
    ctx.fillRect(3, -14, 2, 2);
    ctx.fillRect(3, 12, 2, 2);

    // Grip block
    ctx.fillStyle = "#25304d";
    ctx.fillRect(-6, -4, 8, 8);
    ctx.fillStyle = "#6f452e";
    ctx.fillRect(-5, -3, 6, 6);
    ctx.fillStyle = "#c9c3a8";
    ctx.fillRect(-4, -1, 4, 2);

    // Bow string
    ctx.strokeStyle = "#f6ecd1";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(4, -13);
    ctx.lineTo(-5 - tension, 0);
    ctx.lineTo(4, 13);
    ctx.stroke();

    // Arrow always visible while bow equipped, more pulled during attack
    const arrowBack = -5 - tension;
    ctx.fillStyle = "#25304d";
    ctx.fillRect(arrowBack, -2, 28 + tension, 4);
    ctx.fillStyle = "#c99157";
    ctx.fillRect(arrowBack + 1, -1, 23 + tension, 2);
    ctx.fillStyle = "#eef8ff";
    ctx.beginPath();
    ctx.moveTo(19 + tension, -5);
    ctx.lineTo(29 + tension, 0);
    ctx.lineTo(19 + tension, 5);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#9cd4ff";
    ctx.fillRect(21 + tension, -1, 5, 1);

    // Fletching
    ctx.fillStyle = "#b8d8ff";
    ctx.fillRect(arrowBack - 2, -3, 3, 2);
    ctx.fillRect(arrowBack - 2, 1, 3, 2);
    ctx.fillStyle = "#5d84b8";
    ctx.fillRect(arrowBack - 1, -2, 1, 4);

    if (t > 0.02) {
      ctx.fillStyle = `rgba(245,233,190,${0.35 + t * 0.25})`;
      ctx.fillRect(24 + tension, -3, 12, 6);
      ctx.fillStyle = "rgba(180,220,255,0.45)";
      ctx.fillRect(33 + tension, -1, 10, 2);
    }
  };

  drawStaffInHand = function drawStaffInHandRealistic(progress) {
    const t = Math.max(0, Math.min(1, progress || 0));
    const glow = 0.25 + Math.sin(t * Math.PI) * 0.35;
    ctx.translate(7, 0);

    // Aura behind head crystal
    ctx.fillStyle = `rgba(125,215,255,${glow * 0.35})`;
    ctx.fillRect(13, -15, 26, 30);

    // Shaft outline and wood
    ctx.fillStyle = "#24304a";
    ctx.fillRect(-11, -3, 34, 6);
    ctx.fillStyle = "#7a4e37";
    ctx.fillRect(-10, -2, 31, 4);
    ctx.fillStyle = "#9b6b4c";
    ctx.fillRect(-7, -1, 21, 1);

    // Decorative wraps
    ctx.fillStyle = "#ccb06a";
    ctx.fillRect(-1, -4, 2, 8);
    ctx.fillRect(8, -4, 2, 8);
    ctx.fillRect(16, -4, 2, 8);

    // Forked head / ornament
    ctx.fillStyle = "#24304a";
    ctx.fillRect(18, -12, 6, 24);
    ctx.fillRect(21, -15, 5, 5);
    ctx.fillRect(21, 10, 5, 5);
    ctx.fillRect(24, -9, 4, 3);
    ctx.fillRect(24, 6, 4, 3);

    ctx.fillStyle = "#ccb06a";
    ctx.fillRect(19, -11, 4, 22);
    ctx.fillRect(22, -14, 3, 4);
    ctx.fillRect(22, 10, 3, 4);
    ctx.fillRect(24, -8, 3, 2);
    ctx.fillRect(24, 6, 3, 2);

    // Main crystal
    ctx.fillStyle = "rgba(109,225,255,0.25)";
    ctx.fillRect(24, -12, 17, 24);
    ctx.fillStyle = "#24304a";
    ctx.beginPath();
    ctx.moveTo(29, -10);
    ctx.lineTo(37, 0);
    ctx.lineTo(29, 10);
    ctx.lineTo(24, 0);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#65e7ff";
    ctx.beginPath();
    ctx.moveTo(30, -8);
    ctx.lineTo(36, 0);
    ctx.lineTo(30, 8);
    ctx.lineTo(26, 0);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#f6fdff";
    ctx.fillRect(30, -4, 2, 6);
    ctx.fillRect(28, -1, 5, 1);

    // Side shards
    ctx.fillStyle = "#b6f4ff";
    ctx.beginPath();
    ctx.moveTo(25, -4); ctx.lineTo(21, -8); ctx.lineTo(23, -1); ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(25, 4); ctx.lineTo(21, 8); ctx.lineTo(23, 1); ctx.closePath(); ctx.fill();

    // Small orbit runes
    weaponGlowSpark("rgba(109,225,255,0.70)", 38, -8);
    weaponGlowSpark("rgba(183,132,255,0.55)", 40, 5);

    if (t > 0.02) {
      ctx.fillStyle = `rgba(183,132,255,${0.28 + t * 0.35})`;
      ctx.fillRect(35, -5, 16, 10);
      ctx.fillStyle = `rgba(109,225,255,${0.40 + t * 0.30})`;
      ctx.fillRect(42, -2, 12, 4);
      weaponGlowSpark("rgba(240,250,255,0.8)", 45, -7);
      weaponGlowSpark("rgba(240,250,255,0.8)", 47, 6);
    }
  };
})();

// === Usable custom item system patch ===
(function () {
  function normalizeItemNameForUse(name) {
    return String(name || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  function ensureUsableItemState() {
    if (!inventory.customItems || typeof inventory.customItems !== "object" || Array.isArray(inventory.customItems)) inventory.customItems = {};
    if (!inventory.equippedCustomItems || typeof inventory.equippedCustomItems !== "object" || Array.isArray(inventory.equippedCustomItems)) {
      inventory.equippedCustomItems = { armor: "", accessory: "", boots: "", charm: "" };
    }
    if (!inventory.customItemsUsed || typeof inventory.customItemsUsed !== "object" || Array.isArray(inventory.customItemsUsed)) inventory.customItemsUsed = {};
    if (!Array.isArray(inventory.celestialRelics)) inventory.celestialRelics = [];
    if (!Array.isArray(inventory.celestialResources)) inventory.celestialResources = [];
    if (!Array.isArray(inventory.biomeRelics)) inventory.biomeRelics = [];
    if (!Array.isArray(inventory.itensBoss)) inventory.itensBoss = [];
  }

  function addGameItem(name, amount = 1) {
    ensureUsableItemState();
    if (!name) return false;
    const safeAmount = Math.max(1, Number(amount || 1));
    inventory.customItems[name] = Number(inventory.customItems[name] || 0) + safeAmount;
    renderInventory?.();
    updateHud?.();
    return true;
  }
  window.addGameItem = addGameItem;

  const CUSTOM_ITEM_DEFS = {
    // Deserto
    "espada solar": { icon: "S", typeLabel: "Arma", category: "armas", rarity: "lendario", actionLabel: "Equipar espada", actionType: "weapon", weaponKey: "solarSword", description: "Espada de luz quente encontrada no deserto.", effect: "Desbloqueia e equipa uma espada solar de combate corpo a corpo." },
    "cajado de areia": { icon: "W", typeLabel: "Arma", category: "armas", rarity: "epico", actionLabel: "Equipar cajado", actionType: "weapon", weaponKey: "sandStaff", description: "Cajado antigo capaz de disparar energia de areia.", effect: "Desbloqueia e equipa um cajado que dispara magia de areia." },
    "botas do deserto": { icon: "B", typeLabel: "Botas", category: "raros", rarity: "epico", actionLabel: "Equipar botas", actionType: "gear", slot: "boots", description: "Botas feitas para cruzar dunas e areia movediça.", effect: "Aumenta velocidade e ajuda no deserto." },
    "amuleto anti calor": { icon: "O", typeLabel: "Amuleto", category: "raros", rarity: "epico", actionLabel: "Equipar amuleto", actionType: "gear", slot: "charm", description: "Amuleto frio ao toque mesmo sob sol forte.", effect: "Reduz efeitos de calor e aumenta defesa levemente." },
    "coroa solar": { icon: "★", typeLabel: "Trofeu", category: "raros", rarity: "lendario", actionLabel: "Ativar aura", actionType: "buff", buff: "force", duration: 25, description: "Trofeu do Farao de Areia.", effect: "Ativa um bônus temporário de força." },

    // Gelo
    "arco congelante": { icon: "A", typeLabel: "Arma", category: "armas", rarity: "epico", actionLabel: "Equipar arco", actionType: "weapon", weaponKey: "frostBow", description: "Arco que congela a ponta das flechas.", effect: "Desbloqueia e equipa um arco com dano de gelo." },
    "espada de gelo": { icon: "S", typeLabel: "Arma", category: "armas", rarity: "epico", actionLabel: "Equipar espada", actionType: "weapon", weaponKey: "frostSword", description: "Lâmina fria feita de gelo mágico.", effect: "Desbloqueia e equipa uma espada de gelo." },
    "armadura polar": { icon: "D", typeLabel: "Armadura", category: "raros", rarity: "lendario", actionLabel: "Equipar armadura", actionType: "gear", slot: "armor", description: "Armadura resistente ao frio extremo.", effect: "Aumenta defesa e resistência no gelo." },
    "pocao anti frio": { icon: "P", typeLabel: "Consumivel", category: "consumiveis", rarity: "raro", actionLabel: "Usar poção", actionType: "consumable", buff: "antiCold", duration: 70, consume: true, description: "Poção azul que aquece por dentro.", effect: "Ativa resistência ao frio por tempo limitado." },
    "botas antiderrapantes": { icon: "B", typeLabel: "Botas", category: "raros", rarity: "epico", actionLabel: "Equipar botas", actionType: "gear", slot: "boots", description: "Botas que agarram no gelo.", effect: "Melhora controle em pisos escorregadios." },
    "pelagem ancestral": { icon: "★", typeLabel: "Trofeu", category: "raros", rarity: "lendario", actionLabel: "Ativar proteção", actionType: "buff", buff: "shield", duration: 25, description: "Trofeu do Yeti Ancestral.", effect: "Ativa um escudo temporário." },

    // Pântano
    "cajado venenoso": { icon: "W", typeLabel: "Arma", category: "armas", rarity: "epico", actionLabel: "Equipar cajado", actionType: "weapon", weaponKey: "poisonStaff", description: "Cajado verde que canaliza veneno.", effect: "Desbloqueia e equipa um cajado venenoso." },
    "pocao antidoto": { icon: "P", typeLabel: "Consumivel", category: "consumiveis", rarity: "raro", actionLabel: "Usar antídoto", actionType: "consumable", buff: "antiPoison", duration: 70, consume: true, description: "Poção que limpa veneno do corpo.", effect: "Ativa resistência contra veneno por tempo limitado." },
    "armadura de musgo": { icon: "D", typeLabel: "Armadura", category: "raros", rarity: "epico", actionLabel: "Equipar armadura", actionType: "gear", slot: "armor", description: "Armadura coberta por musgo vivo.", effect: "Aumenta defesa e ajuda contra veneno." },
    "anel contra veneno": { icon: "O", typeLabel: "Anel", category: "raros", rarity: "epico", actionLabel: "Equipar anel", actionType: "gear", slot: "accessory", description: "Anel que filtra toxinas do pântano.", effect: "Protege contra lama e água venenosa." },
    "lanca do brejo": { icon: "L", typeLabel: "Arma", category: "armas", rarity: "epico", actionLabel: "Equipar lança", actionType: "weapon", weaponKey: "marshSpear", description: "Lança pesada usada por guerreiros do brejo.", effect: "Desbloqueia e equipa uma lança venenosa." },
    "lagrima do brejo": { icon: "★", typeLabel: "Trofeu", category: "raros", rarity: "lendario", actionLabel: "Ativar regeneração", actionType: "buff", buff: "regen", duration: 24, description: "Trofeu da Bruxa do Pântano.", effect: "Ativa regeneração temporária." },

    // Celestial: armas e equipamentos
    "espada celestial": { icon: "S", typeLabel: "Arma", category: "armas", rarity: "lendario", actionLabel: "Equipar espada", actionType: "weapon", weaponKey: "celestialSword", description: "Espada luminosa de um guardião celestial.", effect: "Desbloqueia e equipa uma espada celestial." },
    "cajado sagrado": { icon: "W", typeLabel: "Arma", category: "armas", rarity: "lendario", actionLabel: "Equipar cajado", actionType: "weapon", weaponKey: "holyStaff", description: "Cajado sagrado purificado pela aurora.", effect: "Desbloqueia e equipa um cajado sagrado." },
    "cajado da aurora": { icon: "W", typeLabel: "Arma", category: "armas", rarity: "lendario", actionLabel: "Equipar cajado", actionType: "weapon", weaponKey: "auroraStaff", description: "Cajado que carrega a primeira luz do dia.", effect: "Desbloqueia e equipa um cajado da aurora." },
    "arco estelar": { icon: "A", typeLabel: "Arma", category: "armas", rarity: "lendario", actionLabel: "Equipar arco", actionType: "weapon", weaponKey: "starBow", description: "Arco que dispara flechas com brilho de constelação.", effect: "Desbloqueia e equipa um arco estelar." },
    "armadura da aurora": { icon: "D", typeLabel: "Armadura", category: "raros", rarity: "lendario", actionLabel: "Equipar armadura", actionType: "gear", slot: "armor", description: "Armadura dourada e azul iluminada pela aurora.", effect: "Aumenta bastante defesa e mana." },
    "botas das nuvens": { icon: "B", typeLabel: "Botas", category: "raros", rarity: "lendario", actionLabel: "Equipar botas", actionType: "gear", slot: "boots", description: "Botas leves como nuvens sólidas.", effect: "Aumenta velocidade e ajuda em regiões celestiais." },
    "anel de mana celestial": { icon: "O", typeLabel: "Anel", category: "raros", rarity: "lendario", actionLabel: "Equipar anel", actionType: "gear", slot: "accessory", description: "Anel que expande a energia mágica.", effect: "Aumenta mana máxima." },
    "amuleto de luz": { icon: "O", typeLabel: "Amuleto", category: "raros", rarity: "lendario", actionLabel: "Equipar amuleto", actionType: "gear", slot: "charm", description: "Amuleto de luz usado contra energia sombria.", effect: "Aumenta proteção e ativa escudo ao equipar." },
    "pingente da aurora": { icon: "O", typeLabel: "Pingente", category: "raros", rarity: "lendario", actionLabel: "Equipar pingente", actionType: "gear", slot: "accessory", description: "Pingente obtido no puzzle das estrelas.", effect: "Aumenta mana e velocidade." },
    "asas pequenas": { icon: "B", typeLabel: "Acessorio", category: "raros", rarity: "lendario", actionLabel: "Equipar asas", actionType: "gear", slot: "boots", description: "Asas pequenas dadas pelo Anjo Perdido.", effect: "Aumenta velocidade e ativa Dash Celestial." },
    "fragmento da aurora": { icon: "★", typeLabel: "Material", category: "materiais", rarity: "lendario", actionLabel: "Ativar força", actionType: "buff", buff: "force", duration: 30, description: "Fragmento quente da primeira luz.", effect: "Ativa força temporária." },
    "cristal supremo celestial": { icon: "★", typeLabel: "Reliquia", category: "raros", rarity: "lendario", actionLabel: "Ativar bênção", actionType: "buff", buff: "regen", duration: 35, description: "Cristal maior da dimensão celestial.", effect: "Ativa regeneração e escudo." },

    // Celestial: consumíveis e recursos
    "pocao de luz": { icon: "P", typeLabel: "Consumivel", category: "consumiveis", rarity: "raro", actionLabel: "Usar poção", actionType: "consumable", heal: 2, consume: true, description: "Poção brilhante de cura celestial.", effect: "Recupera vida." },
    "pocao de mana celestial": { icon: "P", typeLabel: "Consumivel", category: "consumiveis", rarity: "raro", actionLabel: "Usar mana", actionType: "consumable", mana: 999, consume: true, description: "Poção azul-prateada cheia de energia.", effect: "Recupera mana." },
    "bencao de protecao": { icon: "O", typeLabel: "Benção", category: "consumiveis", rarity: "epico", actionLabel: "Ativar bênção", actionType: "consumable", buff: "shield", duration: 35, consume: true, description: "Benção que cria uma barreira de luz.", effect: "Ativa escudo por tempo limitado." },
    "antidoto contra maldicao": { icon: "P", typeLabel: "Consumivel", category: "consumiveis", rarity: "epico", actionLabel: "Usar antídoto", actionType: "consumable", buff: "antiCurse", duration: 60, consume: true, description: "Antídoto usado contra maldição sombria.", effect: "Ativa proteção contra maldição." },
    "pena dourada": { icon: "C", typeLabel: "Recurso", category: "materiais", rarity: "raro", actionLabel: "Ativar leveza", actionType: "buff", buff: "speed", duration: 18, description: "Pena leve que carrega vento celestial.", effect: "Ativa velocidade temporária." },
    "fragmento de estrela": { icon: "C", typeLabel: "Recurso", category: "materiais", rarity: "raro", actionLabel: "Ativar estrela", actionType: "buff", buff: "force", duration: 18, description: "Fragmento brilhante caído do céu.", effect: "Ativa força temporária." },
    "cristal azul celestial": { icon: "C", typeLabel: "Recurso", category: "materiais", rarity: "epico", actionLabel: "Recarregar mana", actionType: "consumable", mana: 999, consume: false, description: "Cristal azul cheio de mana celestial.", effect: "Recarrega mana." },
    "flor da aurora": { icon: "C", typeLabel: "Recurso", category: "materiais", rarity: "raro", actionLabel: "Usar flor", actionType: "consumable", heal: 1, consume: false, description: "Flor que nasce no Jardim das Nuvens.", effect: "Recupera um pouco de vida." },
    "essencia de luz": { icon: "C", typeLabel: "Recurso", category: "materiais", rarity: "raro", actionLabel: "Ativar luz", actionType: "buff", buff: "shield", duration: 16, description: "Essência pura de luz.", effect: "Ativa escudo curto." },
    "pedra de marmore sagrado": { icon: "C", typeLabel: "Recurso", category: "materiais", rarity: "raro", actionLabel: "Endurecer pele", actionType: "buff", buff: "shield", duration: 20, description: "Pedra usada em templos celestiais.", effect: "Ativa proteção temporária." },
    "po de nuvem": { icon: "C", typeLabel: "Recurso", category: "materiais", rarity: "raro", actionLabel: "Usar pó", actionType: "buff", buff: "speed", duration: 18, description: "Pó branco coletado nas ilhas flutuantes.", effect: "Ativa velocidade temporária." },
    "lagrima de anjo": { icon: "C", typeLabel: "Recurso", category: "materiais", rarity: "epico", actionLabel: "Usar lágrima", actionType: "consumable", heal: 2, mana: 2, consume: false, description: "Lágrima sagrada com poder de cura.", effect: "Recupera vida e mana." },
    "pergaminho da biblioteca": { icon: "L", typeLabel: "Conhecimento", category: "raros", rarity: "epico", actionLabel: "Ler pergaminho", actionType: "buff", buff: "regen", duration: 18, description: "Pergaminho que ensina símbolos antigos.", effect: "Ativa regeneração curta." }
  };

  function getCustomItemDef(name) {
    return CUSTOM_ITEM_DEFS[normalizeItemNameForUse(name)] || null;
  }
  window.getCustomItemDef = getCustomItemDef;

  function registerUsableCustomWeapons() {
    const customWeapons = {
      solarSword: { name: "Espada Solar", damage: 7, range: 66, cooldown: 0.36, arc: Math.PI * 0.82, kind: "melee", damageType: "solar", customWeapon: true },
      sandStaff: { name: "Cajado de Areia", damage: 5, range: 385, cooldown: 0.50, projectile: "sandBolt", projectileSpeed: 315, kind: "projectile", damageType: "areia", customWeapon: true },
      frostBow: { name: "Arco Congelante", damage: 4, range: 440, cooldown: 0.44, projectile: "arrow", projectileSpeed: 430, kind: "projectile", damageType: "gelo", customWeapon: true },
      frostSword: { name: "Espada de Gelo", damage: 6, range: 64, cooldown: 0.37, arc: Math.PI * 0.82, kind: "melee", damageType: "gelo", customWeapon: true },
      poisonStaff: { name: "Cajado Venenoso", damage: 5, range: 385, cooldown: 0.50, projectile: "poison", projectileSpeed: 315, kind: "projectile", damageType: "veneno", customWeapon: true },
      marshSpear: { name: "Lança do Brejo", damage: 6, range: 84, cooldown: 0.48, arc: Math.PI * 0.24, kind: "line", damageType: "veneno", customWeapon: true },
      celestialSword: { name: "Espada Celestial", damage: 8, range: 70, cooldown: 0.34, arc: Math.PI * 0.86, kind: "melee", damageType: "luz", customWeapon: true },
      holyStaff: { name: "Cajado Sagrado", damage: 7, range: 420, cooldown: 0.48, projectile: "sunRay", projectileSpeed: 350, kind: "projectile", damageType: "luz", customWeapon: true },
      auroraStaff: { name: "Cajado da Aurora", damage: 6, range: 410, cooldown: 0.46, projectile: "blueMagic", projectileSpeed: 360, kind: "projectile", damageType: "aurora", customWeapon: true },
      starBow: { name: "Arco Estelar", damage: 5, range: 470, cooldown: 0.42, projectile: "arrow", projectileSpeed: 455, kind: "projectile", damageType: "estrela", customWeapon: true },
      lightDagger: { name: "Adaga de Luz", damage: 5, range: 46, cooldown: 0.24, arc: Math.PI * 0.70, kind: "melee", damageType: "luz", customWeapon: true },
      sacredHammer: { name: "Martelo Sagrado", damage: 9, range: 58, cooldown: 0.58, arc: Math.PI * 0.92, kind: "melee", damageType: "sagrado", customWeapon: true }
    };
    for (const [key, weapon] of Object.entries(customWeapons)) {
      if (!weapons[key]) weapons[key] = weapon;
    }
  }
  registerUsableCustomWeapons();

  function itemCountInCustomSources(name) {
    ensureUsableItemState();
    let count = 0;
    count += Number(inventory.customItems[name] || 0);
    for (const list of [inventory.biomeRelics, inventory.celestialRelics, inventory.celestialResources, inventory.itensBoss]) {
      if (Array.isArray(list)) count += list.filter((entry) => entry === name).length;
    }
    return count;
  }

  function consumeCustomItemIfPossible(name) {
    ensureUsableItemState();
    if (Number(inventory.customItems[name] || 0) > 0) {
      inventory.customItems[name] -= 1;
      if (inventory.customItems[name] <= 0) delete inventory.customItems[name];
      return true;
    }
    for (const list of [inventory.celestialResources, inventory.celestialRelics, inventory.biomeRelics, inventory.itensBoss]) {
      const index = Array.isArray(list) ? list.indexOf(name) : -1;
      if (index >= 0) {
        list.splice(index, 1);
        return true;
      }
    }
    return false;
  }

  function applyCustomGearStats() {
    ensureUsableItemState();
    if (!Number.isFinite(player.customBaseDefense)) player.customBaseDefense = Number(player.defense || 0);
    if (!Number.isFinite(player.customBaseMaxMana)) player.customBaseMaxMana = Number(player.maxMana || 0);
    if (!Number.isFinite(player.customBaseMaxHealth)) player.customBaseMaxHealth = Number(player.maxHealth || 0);

    const gear = inventory.equippedCustomItems || {};
    let defenseBonus = 0;
    let maxManaBonus = 0;
    let maxHealthBonus = 0;

    const equippedNames = Object.values(gear).filter(Boolean).map(normalizeItemNameForUse);
    if (equippedNames.includes("armadura polar")) defenseBonus += 2;
    if (equippedNames.includes("armadura de musgo")) defenseBonus += 1;
    if (equippedNames.includes("armadura da aurora")) { defenseBonus += 3; maxManaBonus += 2; }
    if (equippedNames.includes("amuleto anti calor")) defenseBonus += 1;
    if (equippedNames.includes("amuleto de luz")) defenseBonus += 1;
    if (equippedNames.includes("anel de mana celestial")) maxManaBonus += 2;
    if (equippedNames.includes("pingente da aurora")) maxManaBonus += 1;
    if (equippedNames.includes("asas pequenas")) maxHealthBonus += 1;

    player.defense = Math.max(0, player.customBaseDefense + defenseBonus);
    player.maxMana = Math.max(1, player.customBaseMaxMana + maxManaBonus);
    player.maxHealth = Math.max(1, player.customBaseMaxHealth + maxHealthBonus);
    player.mana = Math.min(player.mana, player.maxMana);
    player.health = Math.min(player.health, player.maxHealth);
  }

  function equipCustomGear(name, def) {
    ensureUsableItemState();
    const slot = def.slot || "accessory";
    inventory.equippedCustomItems[slot] = name;
    applyCustomGearStats();
    if (normalizeItemNameForUse(name) === "amuleto de luz") activePowerUps.shield = Math.max(activePowerUps.shield || 0, 12);
    if (normalizeItemNameForUse(name) === "asas pequenas") activePowerUps.speed = Math.max(activePowerUps.speed || 0, 12);
    playSound("equipItem");
    showHudToast(`${name} equipado.`);
    renderInventory();
    updateHud();
    return true;
  }

  function useCustomInventoryItem(name) {
    ensureUsableItemState();
    const def = getCustomItemDef(name);
    if (!def) {
      playSound("invalid");
      showHudToast("Esse item ainda nao tem uso configurado.");
      return false;
    }

    if (def.actionType === "weapon") {
      registerUsableCustomWeapons();
      if (!Array.isArray(player.unlockedWeapons)) player.unlockedWeapons = ["sword", "bow", "staff", "spear"];
      if (!player.unlockedWeapons.includes(def.weaponKey)) player.unlockedWeapons.push(def.weaponKey);
      equipWeapon(def.weaponKey);
      showHudToast(`${name} equipado.`);
      return true;
    }

    if (def.actionType === "gear") {
      return equipCustomGear(name, def);
    }

    if (def.actionType === "buff" || def.actionType === "consumable") {
      if (def.heal) player.health = Math.min(player.maxHealth, player.health + def.heal);
      if (def.mana) player.mana = Math.min(player.maxMana, player.mana + def.mana);
      if (def.buff) activePowerUps[def.buff] = Math.max(activePowerUps[def.buff] || 0, def.duration || 20);
      if (normalizeItemNameForUse(name) === "cristal supremo celestial") activePowerUps.shield = Math.max(activePowerUps.shield || 0, 25);
      if (def.consume) consumeCustomItemIfPossible(name);
      playSound(def.heal ? "heal" : "usePotion");
      showHudToast(`${name} usado.`);
      renderInventory();
      updateHud();
      return true;
    }

    playSound("invalid");
    return false;
  }
  window.useCustomInventoryItem = useCustomInventoryItem;

  const getWeaponDescriptionBeforeUsableItems = getWeaponDescription;
  getWeaponDescription = function getWeaponDescriptionUsableItems(weaponKey) {
    const custom = weapons[weaponKey];
    if (custom?.customWeapon) return `${custom.name}: arma especial desbloqueada por item unico.`;
    return getWeaponDescriptionBeforeUsableItems(weaponKey);
  };

  const getPowerUpNameBeforeUsableItems = getPowerUpName;
  getPowerUpName = function getPowerUpNameUsableItems(kind) {
    if (kind === "antiCold") return "Anti-frio";
    if (kind === "antiPoison") return "Antidoto";
    if (kind === "antiHeat") return "Anti-calor";
    if (kind === "antiCurse") return "Anti-maldicao";
    return getPowerUpNameBeforeUsableItems(kind);
  };

  const getInventoryItemsBeforeUsableItems = getInventoryItems;
  getInventoryItems = function getInventoryItemsUsableItems() {
    ensureUsableItemState();
    registerUsableCustomWeapons();
    const items = getInventoryItemsBeforeUsableItems();
    const seen = new Set(items.map((item) => item.name));

    // Itens que foram guardados via addGameItem(name, amount)
    for (const [name, amount] of Object.entries(inventory.customItems || {})) {
      if (!amount || seen.has(name)) continue;
      const def = getCustomItemDef(name) || {};
      items.push({
        id: `custom-${String(name).replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`,
        name,
        icon: def.icon || "I",
        quantity: amount,
        category: def.category || "raros",
        typeLabel: def.typeLabel || "Item",
        rarity: def.rarity || "raro",
        description: def.description || "Item especial adicionado ao jogo.",
        effect: def.effect || "Item preparado para uso no inventario.",
        action: def.actionType ? "useCustomItem" : "",
        customItemName: name,
        customUsable: Boolean(def.actionType),
        locked: !def.actionType
      });
      seen.add(name);
    }

    return items.map((item) => {
      const def = getCustomItemDef(item.name);
      if (!def) return item;
      return {
        ...item,
        icon: def.icon || item.icon,
        category: def.category || item.category,
        typeLabel: def.typeLabel || item.typeLabel,
        rarity: def.rarity || item.rarity,
        description: def.description || item.description,
        effect: def.effect || item.effect,
        action: "useCustomItem",
        customItemName: item.name,
        customUsable: true,
        locked: false
      };
    });
  };

  const getInventoryActionHtmlBeforeUsableItems = getInventoryActionHtml;
  getInventoryActionHtml = function getInventoryActionHtmlUsableItems(item) {
    if (item?.action === "useCustomItem" || item?.customUsable) {
      const name = item.customItemName || item.name;
      const def = getCustomItemDef(name);
      const label = def?.actionLabel || "Usar item";
      const slot = def?.slot;
      const equipped = slot && inventory.equippedCustomItems?.[slot] === name;
      const safeName = String(name).replace(/"/g, "&quot;");
      if (equipped) return `<button type="button" disabled>Equipado</button>`;
      return `<button type="button" data-inventory-action="useCustomItem" data-custom-item-name="${safeName}">${label}</button>`;
    }
    return getInventoryActionHtmlBeforeUsableItems(item);
  };

  const handleInventoryActionBeforeUsableItems = handleInventoryAction;
  handleInventoryAction = function handleInventoryActionUsableItems(actionButton) {
    if (actionButton?.dataset?.inventoryAction === "useCustomItem") {
      useCustomInventoryItem(actionButton.dataset.customItemName || "");
      return;
    }
    handleInventoryActionBeforeUsableItems(actionButton);
  };

  const renderEquipmentSlotsBeforeUsableItems = renderEquipmentSlots;
  renderEquipmentSlots = function renderEquipmentSlotsUsableItems() {
    renderEquipmentSlotsBeforeUsableItems();
    if (!equipmentSlots) return;
    ensureUsableItemState();
    const gear = inventory.equippedCustomItems || {};
    const extraSlots = [
      ["Armadura", gear.armor || "Vazio"],
      ["Acessorio", gear.accessory || "Vazio"],
      ["Botas", gear.boots || "Vazio"],
      ["Amuleto", gear.charm || "Vazio"]
    ];
    equipmentSlots.innerHTML += extraSlots.map(([label, value]) => `
      <div class="equipment-slot">
        <span>${label}</span>
        <strong>${value}</strong>
      </div>
    `).join("");
  };

  const getPlayerSpeedBeforeUsableItems = getPlayerSpeed;
  getPlayerSpeed = function getPlayerSpeedUsableItems() {
    let speed = getPlayerSpeedBeforeUsableItems();
    ensureUsableItemState();
    const equipped = Object.values(inventory.equippedCustomItems || {}).map(normalizeItemNameForUse);
    if (equipped.includes("botas do deserto")) speed += 18;
    if (equipped.includes("botas antiderrapantes")) speed += 12;
    if (equipped.includes("botas das nuvens")) speed += 20;
    if (equipped.includes("asas pequenas")) speed += 18;
    if (equipped.includes("pingente da aurora")) speed += 8;
    return speed;
  };

  const takeDamageBeforeUsableItems = takeDamage;
  takeDamage = function takeDamageUsableItems(amount, sourceX = player.x, sourceY = player.y) {
    ensureUsableItemState();
    const equipped = Object.values(inventory.equippedCustomItems || {}).map(normalizeItemNameForUse);
    let reduced = amount;
    if (equipped.includes("anel contra veneno") && activePowerUps.antiPoison > 0) reduced = Math.max(0, reduced - 1);
    if (equipped.includes("amuleto anti calor") && activePowerUps.antiHeat > 0) reduced = Math.max(0, reduced - 1);
    if (equipped.includes("amuleto de luz") && activePowerUps.antiCurse > 0) reduced = Math.max(0, reduced - 1);
    return takeDamageBeforeUsableItems(reduced, sourceX, sourceY);
  };

  const loadGameBeforeUsableItems = loadGame;
  loadGame = function loadGameUsableItems() {
    const ok = loadGameBeforeUsableItems();
    ensureUsableItemState();
    registerUsableCustomWeapons();
    applyCustomGearStats();
    return ok;
  };

  const saveGameBeforeUsableItems = saveGame;
  saveGame = function saveGameUsableItems() {
    ensureUsableItemState();
    return saveGameBeforeUsableItems();
  };

  // Ajusta visual das armas novas: cajados personalizados aparecem como cajado, arcos como arco e lanças como lança.
  drawEquippedWeapon = function drawEquippedWeaponAllUsableItems() {
    try {
      if (!player || gameOver) return;
      const weaponKey = safeCurrentWeaponKeyForVisual();
      const weapon = weapons[weaponKey] || weapons.sword;
      const aim = safeAimForWeaponVisual();
      const progress = getWeaponVisualProgress();
      const angle = getWeaponVisualAngle(aim, weaponKey);
      const centerX = player.x + player.width / 2;
      const centerY = player.y + player.height / 2;
      const handX = centerX + Math.cos(angle) * 8;
      const handY = centerY + Math.sin(angle) * 7 + 3;

      ctx.save();
      ctx.translate(handX, handY);
      ctx.rotate(angle);
      if (Math.cos(angle) < -0.05) ctx.scale(1, -1);

      if (weapon.kind === "line" || weaponKey.toLowerCase().includes("spear")) drawSpearInHand(progress);
      else if (weapon.projectile === "arrow" || weaponKey.toLowerCase().includes("bow")) drawBowInHand(progress || (weaponVisualState.weaponKey === "bow" ? getWeaponVisualProgress() : 0));
      else if (weapon.kind === "projectile" || weaponKey.toLowerCase().includes("staff")) drawStaffInHand(progress || (weaponVisualState.weaponKey === "staff" ? getWeaponVisualProgress() : 0));
      else drawSwordInHand(progress, weaponKey);

      ctx.restore();
    } catch (error) {
      drawWeaponPatchError("Erro arma: " + (error?.message || error));
    }
  };

  ensureUsableItemState();
  registerUsableCustomWeapons();
  applyCustomGearStats();
})();

// === One equipped weapon only: troca de arma apenas pelo inventario ===
(function () {
  const ONE_WEAPON_PATCH = "one-weapon-inventory-equip-v1";
  window.ETERNAL_RIFT_ONE_WEAPON_PATCH = ONE_WEAPON_PATCH;

  function normalizeWeaponListForEquipOnly() {
    if (!Array.isArray(player.unlockedWeapons) || !player.unlockedWeapons.length) {
      player.unlockedWeapons = ["sword"];
    }

    // Remove armas repetidas e armas que nao existem mais, sem apagar recompensas validas.
    player.unlockedWeapons = [...new Set(player.unlockedWeapons)].filter((key) => weapons[key]);
    if (!player.unlockedWeapons.length) player.unlockedWeapons = ["sword"];

    if (!player.equippedWeaponKey || !weapons[player.equippedWeaponKey] || !player.unlockedWeapons.includes(player.equippedWeaponKey)) {
      const indexKey = player.unlockedWeapons[currentWeaponIndex] || player.unlockedWeapons[0] || "sword";
      player.equippedWeaponKey = weapons[indexKey] ? indexKey : "sword";
    }

    currentWeaponIndex = Math.max(0, player.unlockedWeapons.indexOf(player.equippedWeaponKey));
    return player.equippedWeaponKey;
  }

  const getCurrentWeaponKeyBeforeOneWeapon = getCurrentWeaponKey;
  getCurrentWeaponKey = function getCurrentWeaponKeyInventoryOnly() {
    try {
      return normalizeWeaponListForEquipOnly();
    } catch (error) {
      try {
        return getCurrentWeaponKeyBeforeOneWeapon();
      } catch (fallbackError) {
        return "sword";
      }
    }
  };

  getCurrentWeapon = function getCurrentWeaponInventoryOnly() {
    return weapons[getCurrentWeaponKey()] || weapons.sword;
  };

  equipWeapon = function equipWeaponFromInventoryOnly(weaponKey) {
    normalizeWeaponListForEquipOnly();
    if (!weaponKey || !weapons[weaponKey] || !player.unlockedWeapons.includes(weaponKey)) {
      showHudToast("Essa arma ainda nao esta no inventario.");
      playSound("invalid");
      return false;
    }

    player.equippedWeaponKey = weaponKey;
    currentWeaponIndex = player.unlockedWeapons.indexOf(weaponKey);
    weaponCooldownTimer = 0;
    attackWindupTimer = 0;
    attackRecoveryTimer = 0;
    attackTimer = 0;
    currentMeleeAttack = null;

    spawnFloatingText(`Arma equipada: ${weapons[weaponKey].name}`, player.x + 10, player.y - 18, "#fff264");
    showHudToast(`Equipado pelo inventario: ${weapons[weaponKey].name}`);
    playSound("equipItem");
    updateHud();
    return true;
  };

  cycleWeapon = function cycleWeaponDisabledInventoryOnly() {
    normalizeWeaponListForEquipOnly();
    inventoryTab = "armas";
    selectedInventoryItemId = `weapon-${getCurrentWeaponKey()}`;
    showHudToast("Troca de arma agora e so pelo inventario.");
    if (typeof toggleInventory === "function") toggleInventory(true);
    if (typeof renderInventory === "function") renderInventory();
    playSound("inventoryOpen");
  };

  // Baus de boss e recompensas novas adicionam a arma no inventario, mas nao equipam automaticamente.
  if (typeof unlockElementalWeapon === "function") {
    unlockElementalWeapon = function unlockElementalWeaponWithoutAutoEquip(weaponKey) {
      if (!weapons[weaponKey] && typeof registerElementalBossSwords === "function") registerElementalBossSwords();
      if (!Array.isArray(player.unlockedWeapons)) player.unlockedWeapons = ["sword"];
      if (weapons[weaponKey] && !player.unlockedWeapons.includes(weaponKey)) player.unlockedWeapons.push(weaponKey);
      normalizeWeaponListForEquipOnly();
      updateHud();
    };
  }

  function openWeaponInventoryFromMobileButton(event) {
    event?.preventDefault?.();
    event?.stopPropagation?.();
    event?.stopImmediatePropagation?.();
    cycleWeapon();
  }

  function replaceMobileWeaponButton() {
    const oldButton = document.getElementById("touchWeaponButton");
    if (!oldButton || oldButton.dataset.inventoryEquipOnly === "1") return;
    const newButton = oldButton.cloneNode(true);
    newButton.dataset.inventoryEquipOnly = "1";
    newButton.setAttribute("aria-label", "Abrir armas no inventario");
    newButton.textContent = "Armas";
    newButton.addEventListener("pointerdown", openWeaponInventoryFromMobileButton, true);
    newButton.addEventListener("click", openWeaponInventoryFromMobileButton, true);
    oldButton.replaceWith(newButton);
  }

  replaceMobileWeaponButton();
  window.addEventListener("DOMContentLoaded", replaceMobileWeaponButton);

  const loadGameBeforeOneWeapon = loadGame;
  loadGame = function loadGameOneWeaponInventoryOnly() {
    const ok = loadGameBeforeOneWeapon();
    try {
      const raw = typeof readSaveRaw === "function" ? readSaveRaw() : null;
      const save = raw ? JSON.parse(raw) : null;
      const savedKey = save?.futureState?.currentWeaponKey || save?.futureState?.player?.equippedWeaponKey || save?.player?.equippedWeaponKey;
      if (savedKey && weapons[savedKey] && Array.isArray(player.unlockedWeapons) && player.unlockedWeapons.includes(savedKey)) {
        player.equippedWeaponKey = savedKey;
      }
    } catch (error) {
      // Se o save antigo nao tiver a chave, o normalizador escolhe uma arma segura.
    }
    normalizeWeaponListForEquipOnly();
    updateHud();
    return ok;
  };

  const saveGameBeforeOneWeapon = saveGame;
  saveGame = function saveGameOneWeaponInventoryOnly() {
    normalizeWeaponListForEquipOnly();
    player.equippedWeaponKey = getCurrentWeaponKey();
    return saveGameBeforeOneWeapon();
  };

  const renderInventoryBeforeOneWeapon = renderInventory;
  renderInventory = function renderInventoryOneWeaponMode() {
    normalizeWeaponListForEquipOnly();
    return renderInventoryBeforeOneWeapon();
  };

  const getInventoryActionHtmlBeforeOneWeapon = getInventoryActionHtml;
  getInventoryActionHtml = function getInventoryActionHtmlOneWeaponMode(item) {
    if (item?.action === "equipWeapon") {
      const isEquipped = item.weaponKey === getCurrentWeaponKey();
      return `<button type="button" data-inventory-action="equipWeapon" data-weapon-key="${item.weaponKey}"${isEquipped ? " disabled" : ""}>${isEquipped ? "Arma equipada" : "Equipar esta arma"}</button>`;
    }
    return getInventoryActionHtmlBeforeOneWeapon(item);
  };

  const updateHudBeforeOneWeapon = updateHud;
  updateHud = function updateHudOneWeaponMode() {
    normalizeWeaponListForEquipOnly();
    updateHudBeforeOneWeapon();
    if (weaponHud) {
      const current = getCurrentWeapon();
      weaponHud.textContent = `Arma equipada: ${current.name}${getCurrentWeaponKey() === "bow" ? ` (${inventory.flechas})` : ""}`;
    }
  };

  normalizeWeaponListForEquipOnly();
  updateHud();
})();

// === Wife companions patch: esposas/companheiras do jogador ===
(function () {
  const WIFE_PATCH_VERSION = "wife-companions-v1";
  if (typeof window !== "undefined" && window.ETERNAL_RIFT_WIFE_PATCH === WIFE_PATCH_VERSION) return;
  if (typeof window !== "undefined") window.ETERNAL_RIFT_WIFE_PATCH = WIFE_PATCH_VERSION;

  const WIFE_DEFS = [
    {
      id: "selene",
      name: "Selene",
      title: "Maga Lunar",
      file: "assets/wives/selene.png",
      tileX: 22,
      tileY: 31,
      color: "#d98cff",
      gem: "#f7d36b",
      bonus: "Regenera mana aos poucos.",
      line: "Selene: Vou iluminar seu caminho com magia lunar. Estou com voce."
    },
    {
      id: "nyra",
      name: "Nyra",
      title: "Ladra Felina",
      file: "assets/wives/nyra.png",
      tileX: 25,
      tileY: 31,
      color: "#9b5fc7",
      gem: "#d1a55f",
      bonus: "Aumenta velocidade e reflexo.",
      line: "Nyra: Se precisar fugir ou atacar rapido, deixa comigo."
    },
    {
      id: "lilith",
      name: "Lilith",
      title: "Dama Sombria",
      file: "assets/wives/lilith.png",
      tileX: 28,
      tileY: 31,
      color: "#8b36c9",
      gem: "#ff79f2",
      bonus: "Aumenta dano fisico e magico.",
      line: "Lilith: Inimigo nenhum vai encostar em voce sem pagar caro."
    },
    {
      id: "yumi",
      name: "Yumi",
      title: "Raposa Violeta",
      file: "assets/wives/yumi.png",
      tileX: 31,
      tileY: 31,
      color: "#b13bb4",
      gem: "#7d7cff",
      bonus: "Melhora movimento e recuperacao.",
      line: "Yumi: Vou ficar por perto. A estrada fica mais leve quando andamos juntos."
    },
    {
      id: "mika",
      name: "Mika",
      title: "Guarda Felina",
      file: "assets/wives/mika.png",
      tileX: 23,
      tileY: 36,
      color: "#7b4bd1",
      gem: "#b46dff",
      bonus: "Reduz parte do dano recebido.",
      line: "Mika: Eu cuido da defesa. Voce cuida da aventura."
    },
    {
      id: "violet",
      name: "Violet",
      title: "Nobre Arcana",
      file: "assets/wives/violet.png",
      tileX: 27,
      tileY: 36,
      color: "#a73cdf",
      gem: "#3f8fe5",
      bonus: "Fortalece ataques magicos.",
      line: "Violet: Minha magia vai acompanhar seus golpes."
    },
    {
      id: "aurora",
      name: "Aurora",
      title: "Coelha Estelar",
      file: "assets/wives/aurora.png",
      tileX: 31,
      tileY: 36,
      color: "#d783ff",
      gem: "#fff264",
      bonus: "Cura o jogador aos poucos.",
      line: "Aurora: Prometo cuidar de voce depois das batalhas."
    }
  ];

  const wifeById = WIFE_DEFS.reduce((acc, wife) => {
    acc[wife.id] = wife;
    return acc;
  }, {});

  const wifeImages = {};
  if (typeof Image !== "undefined") {
    for (const wife of WIFE_DEFS) {
      const img = new Image();
      img.src = wife.file;
      wifeImages[wife.id] = img;
    }
  }

  let wifeSupportTimer = 0;
  let wifeSparkTimer = 0;

  function wifeClamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function ensureWifeSystemState() {
    if (!questBook.wives || typeof questBook.wives !== "object" || Array.isArray(questBook.wives)) {
      questBook.wives = { activeId: "selene", wives: {}, totalTalks: 0 };
    }
    if (!questBook.wives.wives || typeof questBook.wives.wives !== "object" || Array.isArray(questBook.wives.wives)) {
      questBook.wives.wives = {};
    }
    for (const wife of WIFE_DEFS) {
      if (!questBook.wives.wives[wife.id]) {
        questBook.wives.wives[wife.id] = {
          married: true,
          affection: 1,
          talks: 0,
          giftLevel: 0
        };
      }
      questBook.wives.wives[wife.id].married = true;
      questBook.wives.wives[wife.id].affection = wifeClamp(Number(questBook.wives.wives[wife.id].affection || 1), 1, 100);
      questBook.wives.wives[wife.id].talks = Number(questBook.wives.wives[wife.id].talks || 0);
    }
    if (!wifeById[questBook.wives.activeId]) questBook.wives.activeId = "selene";
    return questBook.wives;
  }

  function getActiveWifeDef() {
    const state = ensureWifeSystemState();
    return wifeById[state.activeId] || WIFE_DEFS[0];
  }

  function getActiveWifeState() {
    const state = ensureWifeSystemState();
    const active = getActiveWifeDef();
    return state.wives[active.id];
  }

  function setActiveWife(wifeId, fromInventory = false) {
    const wife = wifeById[wifeId] || WIFE_DEFS[0];
    const state = ensureWifeSystemState();
    state.activeId = wife.id;
    state.wives[wife.id].affection = wifeClamp(Number(state.wives[wife.id].affection || 1) + (fromInventory ? 0 : 1), 1, 100);
    state.wives[wife.id].talks = Number(state.wives[wife.id].talks || 0) + (fromInventory ? 0 : 1);
    if (!fromInventory) state.totalTalks = Number(state.totalTalks || 0) + 1;

    if (typeof spawnFloatingText === "function") {
      spawnFloatingText(`♥ ${wife.name}`, player.x + 8, player.y - 24, wife.color);
    }
    if (typeof showHudToast === "function") {
      showHudToast(`${wife.name} agora esta te acompanhando.`);
    }
    if (typeof playSound === "function") playSound("equipItem");
    if (typeof updateHud === "function") updateHud();
    return wife;
  }

  function createWifeNpc(wife) {
    const obj = typeof npc === "function"
      ? npc(wife.tileX, wife.tileY, wife.name, `${wife.name}: ${wife.bonus}`, "wife")
      : {
          type: "npc",
          name: wife.name,
          role: "wife",
          x: wife.tileX * TILE + 5,
          y: wife.tileY * TILE + 4,
          width: 22,
          height: 28,
          solid: true,
          message: `${wife.name}: ${wife.bonus}`,
          bob: Math.random() * Math.PI * 2,
          speed: 10,
          direction: "idle",
          moveTimer: 1,
          spawnX: wife.tileX * TILE + 5,
          spawnY: wife.tileY * TILE + 4
        };
    obj.role = "wife";
    obj.wifeId = wife.id;
    obj.wifeTitle = wife.title;
    obj.message = `${wife.name}: ${wife.bonus}`;
    obj.speed = 10;
    obj.width = 24;
    obj.height = 31;
    return obj;
  }

  function refreshVillageSceneListsForWives() {
    try {
      if (currentScene === "village") {
        objects = villageObjects;
        colliders = objects.filter((obj) => obj.solid);
        interactables = objects.filter((obj) => obj.message);
      }
    } catch (error) {
      // Mantem o jogo rodando mesmo se a cena ainda estiver carregando.
    }
  }

  function addWifeNpcsToVillage() {
    ensureWifeSystemState();
    for (const wife of WIFE_DEFS) {
      const alreadyExists = villageObjects.some((obj) => obj?.type === "npc" && obj.role === "wife" && obj.wifeId === wife.id);
      if (!alreadyExists) villageObjects.push(createWifeNpc(wife));
    }
    refreshVillageSceneListsForWives();
  }

  function getWifeLook(wife) {
    const looks = {
      selene: { hair: "#ba63f7", outfit: "#6c49c5", trim: "#f0d57d", accent: "#f9f1ff", feature: "moon" },
      nyra: { hair: "#54316b", outfit: "#2e2547", trim: "#b46dff", accent: "#d9b57c", feature: "cat" },
      lilith: { hair: "#6f2a8f", outfit: "#4b235f", trim: "#ff7adf", accent: "#b98cff", feature: "demon" },
      yumi: { hair: "#8b2aa0", outfit: "#7640ae", trim: "#fff264", accent: "#7d7cff", feature: "fox" },
      mika: { hair: "#4a2c68", outfit: "#5c4597", trim: "#caa7ff", accent: "#92b7ff", feature: "guardcat" },
      violet: { hair: "#7f33ae", outfit: "#5d2d83", trim: "#f7d36b", accent: "#55c4ff", feature: "crown" },
      aurora: { hair: "#cf80ff", outfit: "#8d56ca", trim: "#fff4bf", accent: "#fff264", feature: "bunny" }
    };
    return looks[wife.id] || { hair: wife.color || "#9b5fc7", outfit: wife.color || "#7b4bd1", trim: wife.gem || "#fff264", accent: "#fff3d6", feature: "none" };
  }

  function drawWifePixelFallback(x, y, wife, scale = 1, active = false) {
    const look = getWifeLook(wife);
    const skin = "#f4bd8f";
    const outline = typeof VISUAL_V2 !== "undefined" ? VISUAL_V2.outline : "#273052";
    const time = (typeof performance !== "undefined" ? performance.now() : Date.now()) / 330;
    const bob = Math.sin(time + wife.id.length) * 1.4;
    const s = scale;
    const px = x;
    const py = y + bob;
    if (typeof drawSoftShadow === "function") drawSoftShadow(px + 3 * s, py + 26 * s, 21 * s, 5 * s, 0.24);

    ctx.save();
    const oldSmooth = ctx.imageSmoothingEnabled;
    ctx.imageSmoothingEnabled = false;

    // Cauda / asas por tras do corpo
    if (look.feature === "fox") {
      ctx.fillStyle = outline;
      ctx.fillRect(px + 15 * s, py + 11 * s, 12 * s, 12 * s);
      ctx.fillStyle = look.hair;
      ctx.fillRect(px + 16 * s, py + 12 * s, 10 * s, 10 * s);
      ctx.fillStyle = look.trim;
      ctx.fillRect(px + 21 * s, py + 18 * s, 5 * s, 3 * s);
    }
    if (look.feature === "cat" || look.feature === "guardcat") {
      ctx.fillStyle = outline;
      ctx.fillRect(px + 21 * s, py + 15 * s, 7 * s, 9 * s);
      ctx.fillStyle = look.hair;
      ctx.fillRect(px + 22 * s, py + 16 * s, 5 * s, 7 * s);
    }
    if (look.feature === "demon") {
      ctx.fillStyle = outline;
      ctx.fillRect(px - 2 * s, py + 10 * s, 8 * s, 9 * s);
      ctx.fillRect(px + 20 * s, py + 10 * s, 8 * s, 9 * s);
      ctx.fillStyle = look.outfit;
      ctx.fillRect(px - 1 * s, py + 11 * s, 6 * s, 7 * s);
      ctx.fillRect(px + 21 * s, py + 11 * s, 6 * s, 7 * s);
    }

    // Corpo principal estilo NPC top-down bonito
    if (typeof outlinePixelV2 === "function" && typeof fillPixelV2 === "function") {
      outlinePixelV2(px + 5 * s, py + 11 * s, 16 * s, 15 * s, look.outfit);
      fillPixelV2(px + 8 * s, py + 14 * s, 10 * s, 4 * s, look.trim);
      fillPixelV2(px + 9 * s, py + 19 * s, 8 * s, 5 * s, look.accent);
      outlinePixelV2(px + 7 * s, py + 4 * s, 14 * s, 11 * s, skin);
      fillPixelV2(px + 5 * s, py + 2 * s, 18 * s, 5 * s, look.hair);
      fillPixelV2(px + 4 * s, py + 6 * s, 5 * s, 8 * s, look.hair);
      fillPixelV2(px + 18 * s, py + 7 * s, 3 * s, 5 * s, look.hair);
      fillPixelV2(px + 8 * s, py + 27 * s, 4 * s, 6 * s, outline);
      fillPixelV2(px + 15 * s, py + 27 * s, 4 * s, 6 * s, outline);
      fillPixelV2(px + 10 * s, py + 8 * s, 2 * s, 2 * s, outline);
      fillPixelV2(px + 16 * s, py + 8 * s, 2 * s, 2 * s, outline);
    } else {
      ctx.fillStyle = outline;
      ctx.fillRect(px + 5 * s, py + 11 * s, 16 * s, 15 * s);
      ctx.fillStyle = look.outfit;
      ctx.fillRect(px + 6 * s, py + 12 * s, 14 * s, 13 * s);
      ctx.fillStyle = look.trim;
      ctx.fillRect(px + 8 * s, py + 14 * s, 10 * s, 4 * s);
      ctx.fillStyle = skin;
      ctx.fillRect(px + 7 * s, py + 4 * s, 14 * s, 11 * s);
      ctx.fillStyle = look.hair;
      ctx.fillRect(px + 5 * s, py + 2 * s, 18 * s, 5 * s);
      ctx.fillRect(px + 4 * s, py + 6 * s, 5 * s, 8 * s);
      ctx.fillStyle = outline;
      ctx.fillRect(px + 8 * s, py + 27 * s, 4 * s, 6 * s);
      ctx.fillRect(px + 15 * s, py + 27 * s, 4 * s, 6 * s);
    }

    // Detalhes bonitos / silhueta unica por esposa
    ctx.fillStyle = outline;
    if (look.feature === "moon") {
      ctx.fillRect(px + 18 * s, py + 1 * s, 3 * s, 3 * s);
      ctx.fillStyle = look.trim;
      ctx.fillRect(px + 19 * s, py, 4 * s, 4 * s);
    }
    if (look.feature === "cat" || look.feature === "guardcat") {
      ctx.fillStyle = outline;
      ctx.fillRect(px + 7 * s, py + 1 * s, 3 * s, 4 * s);
      ctx.fillRect(px + 17 * s, py + 1 * s, 3 * s, 4 * s);
      ctx.fillStyle = look.hair;
      ctx.fillRect(px + 8 * s, py + 2 * s, 2 * s, 3 * s);
      ctx.fillRect(px + 17 * s, py + 2 * s, 2 * s, 3 * s);
      if (look.feature === "guardcat") {
        ctx.fillStyle = look.accent;
        ctx.fillRect(px + 3 * s, py + 12 * s, 3 * s, 8 * s);
      }
    }
    if (look.feature === "demon") {
      ctx.fillStyle = outline;
      ctx.fillRect(px + 8 * s, py + 1 * s, 3 * s, 4 * s);
      ctx.fillRect(px + 16 * s, py + 1 * s, 3 * s, 4 * s);
      ctx.fillStyle = look.trim;
      ctx.fillRect(px + 9 * s, py + 1 * s, 2 * s, 3 * s);
      ctx.fillRect(px + 16 * s, py + 1 * s, 2 * s, 3 * s);
    }
    if (look.feature === "fox") {
      ctx.fillStyle = outline;
      ctx.fillRect(px + 7 * s, py + 1 * s, 3 * s, 4 * s);
      ctx.fillRect(px + 17 * s, py + 1 * s, 3 * s, 4 * s);
      ctx.fillStyle = look.hair;
      ctx.fillRect(px + 8 * s, py + 2 * s, 2 * s, 3 * s);
      ctx.fillRect(px + 17 * s, py + 2 * s, 2 * s, 3 * s);
      ctx.fillStyle = look.trim;
      ctx.fillRect(px + 20 * s, py + 17 * s, 2 * s, 2 * s);
    }
    if (look.feature === "crown") {
      ctx.fillStyle = outline;
      ctx.fillRect(px + 9 * s, py, 8 * s, 3 * s);
      ctx.fillStyle = look.trim;
      ctx.fillRect(px + 9 * s, py, 2 * s, 2 * s);
      ctx.fillRect(px + 12 * s, py - 1 * s, 2 * s, 3 * s);
      ctx.fillRect(px + 15 * s, py, 2 * s, 2 * s);
      ctx.fillStyle = look.accent;
      ctx.fillRect(px + 12 * s, py + 2 * s, 2 * s, 2 * s);
    }
    if (look.feature === "bunny") {
      ctx.fillStyle = outline;
      ctx.fillRect(px + 8 * s, py - 4 * s, 3 * s, 7 * s);
      ctx.fillRect(px + 16 * s, py - 4 * s, 3 * s, 7 * s);
      ctx.fillStyle = look.trim;
      ctx.fillRect(px + 9 * s, py - 3 * s, 1 * s, 5 * s);
      ctx.fillRect(px + 17 * s, py - 3 * s, 1 * s, 5 * s);
    }

    // Brilho/gema
    ctx.fillStyle = look.trim;
    ctx.fillRect(px + 12 * s, py + 16 * s, 3 * s, 3 * s);
    ctx.fillStyle = look.accent;
    ctx.fillRect(px + 13 * s, py + 17 * s, 1 * s, 1 * s);

    if (active) {
      ctx.fillStyle = wife.color || look.trim;
      ctx.fillRect(px + 10 * s, py - 6 * s, 2 * s, 2 * s);
      ctx.fillRect(px + 16 * s, py - 6 * s, 2 * s, 2 * s);
      ctx.fillRect(px + 12 * s, py - 4 * s, 4 * s, 2 * s);
      ctx.fillRect(px + 13 * s, py - 2 * s, 2 * s, 2 * s);
    }

    ctx.imageSmoothingEnabled = oldSmooth;
    ctx.restore();
  }

  function drawWifeImageAt(wifeId, centerX, footY, height, active = false) {
    const wife = wifeById[wifeId] || WIFE_DEFS[0];
    const s = Math.max(0.75, height / 36);
    const x = centerX - 14 * s;
    const y = footY - 32 * s;
    drawWifePixelFallback(x, y, wife, s, active);
  }

  const drawNpcBeforeWives = drawNpc;
  drawNpc = function drawNpcWithWives(obj) {
    if (obj?.role === "wife" && obj.wifeId) {
      const state = ensureWifeSystemState();
      drawWifeImageAt(obj.wifeId, obj.x + obj.width / 2, obj.y + obj.height + 6, 34, state.activeId === obj.wifeId);
      return;
    }
    return drawNpcBeforeWives(obj);
  };

  const drawPlayerBeforeWifeFollower = drawPlayer;
  drawPlayer = function drawPlayerWithWifeFollower() {
    try {
      if (gameStarted && !gameOver) {
        const wife = getActiveWifeDef();
        const offsets = {
          up: { x: -18, y: 20 },
          down: { x: 18, y: 18 },
          left: { x: 22, y: 18 },
          right: { x: -20, y: 18 }
        };
        const off = offsets[player.direction] || offsets.down;
        drawWifeImageAt(wife.id, player.x + player.width / 2 + off.x, player.y + player.height + off.y, 30, false);
      }
    } catch (error) {
      // Desenho extra nunca deve quebrar o jogador.
    }
    return drawPlayerBeforeWifeFollower();
  };

  function interactWithWifeNpc(wifeId) {
    const wife = setActiveWife(wifeId, false);
    const wifeState = getActiveWifeState();
    const affection = wifeState.affection;
    let extra = "";

    if (wife.id === "aurora" && player.health < player.maxHealth) {
      player.health = Math.min(player.maxHealth, player.health + 1);
      extra = " Ela curou 1 coracao.";
    } else if (wife.id === "selene" && player.mana < player.maxMana) {
      player.mana = Math.min(player.maxMana, player.mana + 1);
      extra = " Ela recuperou 1 ponto de mana.";
    } else if (wife.id === "mika") {
      activePowerUps.shield = Math.max(Number(activePowerUps.shield || 0), 6);
      extra = " Escudo leve ativado por alguns segundos.";
    }

    return `${wife.line} Bonus: ${wife.bonus} Afinidade: ${affection}/100.${extra} Use a Alianca de ${wife.name} no inventario para chama-la quando quiser.`;
  }

  const getQuestMessageBeforeWives = getQuestMessage;
  getQuestMessage = function getQuestMessageWifePatch(npcObj) {
    if (npcObj?.type === "npc" && npcObj.role === "wife" && npcObj.wifeId) {
      return interactWithWifeNpc(npcObj.wifeId);
    }
    return getQuestMessageBeforeWives(npcObj);
  };

  const updateInteractionHintBeforeWives = updateInteractionHint;
  updateInteractionHint = function updateInteractionHintWives() {
    updateInteractionHintBeforeWives();
    try {
      const target = findInteraction();
      if (target?.role === "wife") {
        interactionHint.textContent = "Pressione E para chamar esposa";
        if (touchContextLabel) touchContextLabel.textContent = "Chamar";
      }
    } catch (error) {
      // Ignora se a interface ainda nao existir.
    }
  };

  const getInventoryItemsBeforeWives = getInventoryItems;
  getInventoryItems = function getInventoryItemsWithWifeRings() {
    const items = getInventoryItemsBeforeWives();
    const state = ensureWifeSystemState();
    for (const wife of WIFE_DEFS) {
      const wifeState = state.wives[wife.id];
      items.push({
        id: `wife-ring-${wife.id}`,
        name: `Alianca de ${wife.name}`,
        icon: "♥",
        quantity: 1,
        category: "raros",
        typeLabel: "Esposa",
        rarity: state.activeId === wife.id ? "lendario" : "epico",
        description: `${wife.name}, ${wife.title}. Ela pode acompanhar o jogador como esposa/companheira.`,
        effect: `${wife.bonus} Afinidade ${wifeState.affection}/100.`,
        action: "summonWife",
        wifeId: wife.id
      });
    }
    return items;
  };

  const getInventoryActionHtmlBeforeWives = getInventoryActionHtml;
  getInventoryActionHtml = function getInventoryActionHtmlWives(item) {
    if (item?.action === "summonWife") {
      const state = ensureWifeSystemState();
      const active = state.activeId === item.wifeId;
      return `<button type="button" data-inventory-action="summonWife" data-wife-id="${item.wifeId}"${active ? " disabled" : ""}>${active ? "Acompanhando" : "Chamar esposa"}</button>`;
    }
    return getInventoryActionHtmlBeforeWives(item);
  };

  const handleInventoryActionBeforeWives = handleInventoryAction;
  handleInventoryAction = function handleInventoryActionWives(actionButton) {
    if (actionButton?.dataset?.inventoryAction === "summonWife") {
      setActiveWife(actionButton.dataset.wifeId, true);
      if (typeof renderInventory === "function") renderInventory();
      return;
    }
    return handleInventoryActionBeforeWives(actionButton);
  };

  const renderEquipmentSlotsBeforeWives = renderEquipmentSlots;
  renderEquipmentSlots = function renderEquipmentSlotsWives() {
    renderEquipmentSlotsBeforeWives();
    try {
      if (!equipmentSlots) return;
      const wife = getActiveWifeDef();
      const wifeState = getActiveWifeState();
      equipmentSlots.innerHTML += `
        <div class="equipment-slot">
          <span>Esposa</span>
          <strong>${wife.name} ${wifeState.affection}/100</strong>
        </div>
      `;
    } catch (error) {
      // Nao quebra inventario se algo estiver vazio.
    }
  };

  const getPlayerSpeedBeforeWives = getPlayerSpeed;
  getPlayerSpeed = function getPlayerSpeedWifeBonus() {
    let speed = getPlayerSpeedBeforeWives();
    const wife = getActiveWifeDef();
    if (wife.id === "nyra") speed += 14;
    if (wife.id === "yumi") speed += 10;
    if (wife.id === "aurora") speed += 4;
    return speed;
  };

  const getBasicAttackDamageBeforeWives = getBasicAttackDamage;
  getBasicAttackDamage = function getBasicAttackDamageWifeBonus(weaponKey = getCurrentWeaponKey()) {
    let damage = getBasicAttackDamageBeforeWives(weaponKey);
    const wife = getActiveWifeDef();
    if (wife.id === "lilith") damage += 1;
    if (wife.id === "nyra" && weaponKey !== "bow") damage += 1;
    if (wife.id === "violet" && (weapons[weaponKey]?.kind === "projectile" || String(weapons[weaponKey]?.damageType || "").includes("magic"))) damage += 1;
    return damage;
  };

  const takeDamageBeforeWives = takeDamage;
  takeDamage = function takeDamageWifeBonus(amount, sourceX = player.x, sourceY = player.y) {
    const wife = getActiveWifeDef();
    let reduced = amount;
    if (wife.id === "mika") reduced = Math.max(0, reduced - 1);
    if (wife.id === "selene" && player.mana > 0 && amount > 1) {
      player.mana = Math.max(0, player.mana - 1);
      reduced = Math.max(0, reduced - 1);
    }
    return takeDamageBeforeWives(reduced, sourceX, sourceY);
  };

  const updateBeforeWives = update;
  update = function updateWifeSupport(delta) {
    updateBeforeWives(delta);
    try {
      if (!gameStarted || gameOver || pauseOpen || inventoryOpen || shopOpen) return;
      ensureWifeSystemState();
      const wife = getActiveWifeDef();
      wifeSupportTimer += delta;
      wifeSparkTimer += delta;

      if (wifeSupportTimer >= 1) {
        wifeSupportTimer = 0;
        if (wife.id === "selene") {
          player.mana = Math.min(player.maxMana, Number(player.mana || 0) + 0.20);
        }
        if (wife.id === "aurora" && player.health < player.maxHealth) {
          const state = getActiveWifeState();
          if (state.affection >= 8) player.health = Math.min(player.maxHealth, Number(player.health || 0) + 0.04);
        }
        if (wife.id === "violet") {
          player.mana = Math.min(player.maxMana, Number(player.mana || 0) + 0.08);
        }
      }

      if (wifeSparkTimer >= 4.5) {
        wifeSparkTimer = 0;
        if (typeof spawnFloatingText === "function") {
          spawnFloatingText(`♥ ${wife.name}`, player.x + player.width / 2, player.y - 20, wife.color);
        }
      }
    } catch (error) {
      // Bonus das esposas nunca deve travar o update principal.
    }
  };

  const updateHudBeforeWives = updateHud;
  updateHud = function updateHudWithWifeInfo() {
    updateHudBeforeWives();
    try {
      const wife = getActiveWifeDef();
      const wifeState = getActiveWifeState();
      if (areaHud && gameStarted) {
        const base = areaHud.textContent.replace(/ \| Esposa:.*/, "");
        areaHud.textContent = `${base} | Esposa: ${wife.name} ${wifeState.affection}/100`;
      }
    } catch (error) {
      // HUD segue normal.
    }
  };

  const loadGameBeforeWives = loadGame;
  loadGame = function loadGameWives() {
    const ok = loadGameBeforeWives();
    ensureWifeSystemState();
    addWifeNpcsToVillage();
    return ok;
  };

  const saveGameBeforeWives = saveGame;
  saveGame = function saveGameWives() {
    ensureWifeSystemState();
    return saveGameBeforeWives();
  };

  ensureWifeSystemState();
  addWifeNpcsToVillage();
})();

// === Hide decorative trophy/question inventory icons patch ===
// Mantem os itens nos sistemas internos do jogo, mas remove da grade do inventario
// os trofeus decorativos de boss e os recursos sem uso que apareciam com interrogação.
(function () {
  if (typeof window !== "undefined" && window.ETERNAL_RIFT_HIDE_DECORATIVE_INVENTORY_ICONS_PATCH) return;
  if (typeof window !== "undefined") window.ETERNAL_RIFT_HIDE_DECORATIVE_INVENTORY_ICONS_PATCH = true;

  function normalizeHiddenInventoryName(name) {
    return String(name || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  const hiddenDecorativeResourceNames = new Set([
    "pena dourada",
    "fragmento de estrela",
    "cristal azul celestial",
    "flor da aurora",
    "essencia de luz",
    "pedra de marmore sagrado",
    "po de nuvem",
    "pergaminho antigo",
    "reliquia celestial",
    "trofeu raro"
  ]);

  function shouldHideDecorativeInventoryItem(item) {
    if (!item) return false;
    const id = String(item.id || "");
    const type = normalizeHiddenInventoryName(item.typeLabel || "");
    const category = normalizeHiddenInventoryName(item.category || "");
    const name = normalizeHiddenInventoryName(item.name || "");

    // Icone de trofeu do boss: continua salvo em inventory.itensBoss e no jogo,
    // mas nao ocupa mais espaco na bolsa.
    if (id.startsWith("boss-") || type === "boss") return true;

    // Recursos/reliquias apenas decorativos que estavam aparecendo como interrogação.
    // Itens usaveis de verdade continuam aparecendo.
    const looksLikeDecorativeUnknown =
      id.startsWith("celestial-resource-") ||
      id.startsWith("celestial-relic-") ||
      id.startsWith("relic-") ||
      type === "recurso celestial" ||
      type === "reliquia celestial" ||
      type === "bioma";

    if (looksLikeDecorativeUnknown && !item.action && !item.customUsable) return true;
    if (hiddenDecorativeResourceNames.has(name) && !item.action && !item.customUsable) return true;

    // Evita esconder arma, poder, esposa ou item com ação real.
    return false;
  }

  function tinyInventorySvg(inner) {
    return `<span class="inventory-icon-wrap"><svg class="inventory-art" viewBox="0 0 32 32" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">${inner}</svg></span>`;
  }

  function customVisibleInventoryIconHtml(item) {
    if (!item) return "";
    const id = String(item.id || "");
    const icon = String(item.icon || "").trim();
    const cat = normalizeHiddenInventoryName(item.category || "");

    if (id.startsWith("wife-ring-")) {
      return tinyInventorySvg(`
        <circle cx="13" cy="16" r="6" fill="none" stroke="#f5ce79" stroke-width="3"/>
        <circle cx="20" cy="16" r="6" fill="none" stroke="#fff264" stroke-width="3"/>
        <path d="M16 9l2 3 4 .5-3 2.5.8 4-3.8-2-3.8 2 .8-4-3-2.5 4-.5z" fill="#ff7ab5" stroke="#7d3a60" stroke-width="1.2"/>
      `);
    }

    if (icon === "S") return tinyInventorySvg(`
      <path d="M18 4 24 10 14 20 12 18z" fill="#e9ffff" stroke="#394066" stroke-width="2"/>
      <path d="M10 20 7 23l2 2-2 2 1 1 2-2 2 2 1-1-2-2 2-2z" fill="#f5ce79" stroke="#5c413c" stroke-width="1.5"/>
    `);
    if (icon === "A") return tinyInventorySvg(`
      <path d="M11 5c7 5 7 17 0 22" fill="none" stroke="#d99b67" stroke-width="3"/>
      <path d="M11 5v22" stroke="#fff3d6" stroke-width="1.5"/>
      <path d="M13 16h12" stroke="#c8d0d8" stroke-width="2"/>
      <path d="M22 13 27 16 22 19" fill="#e9ffff" stroke="#394066" stroke-width="1.5"/>
    `);
    if (icon === "W") return tinyInventorySvg(`
      <path d="M13 6v20" stroke="#8f5a3f" stroke-width="3"/>
      <path d="M16 3 22 9 16 15 10 9z" fill="#55e8ff" stroke="#273052" stroke-width="2"/>
      <path d="M21 12c4 1 6 4 7 8" stroke="#9ee6ff" stroke-width="2" opacity=".8"/>
    `);
    if (icon === "L") return tinyInventorySvg(cat === "armas" ? `
      <path d="M8 24 24 8" stroke="#d99b67" stroke-width="3"/>
      <path d="M24 8l2-5 3 3-5 2z" fill="#e9ffff" stroke="#394066" stroke-width="1.5"/>
      <path d="M8 24l-3 3" stroke="#5c413c" stroke-width="2"/>
    ` : `
      <rect x="6" y="8" width="20" height="16" rx="2" fill="#fff3d6" stroke="#7d4d38" stroke-width="2"/>
      <path d="M7 10 16 17 25 10" fill="none" stroke="#c94a5c" stroke-width="2"/>
    `);
    if (icon === "P") return tinyInventorySvg(`
      <rect x="12" y="5" width="8" height="5" rx="1" fill="#9ee6ff" stroke="#273052" stroke-width="2"/>
      <path d="M12 10h8v3l3 4v8c0 2-2 3-4 3H13c-2 0-4-1-4-3v-8l3-4z" fill="#d24c63" stroke="#273052" stroke-width="2"/>
      <circle cx="15" cy="20" r="2" fill="#fff3d6" opacity=".8"/>
    `);
    if (icon === "B") return tinyInventorySvg(`
      <path d="M9 11h7v9h6c2 0 4 2 4 4v2H8V12z" fill="#6b4b8f" stroke="#273052" stroke-width="2"/>
      <path d="M11 9h5v5h-5z" fill="#9b5fc7" stroke="#273052" stroke-width="1.5"/>
      <path d="M9 25h16" stroke="#f5ce79" stroke-width="2"/>
    `);
    if (icon === "D") return tinyInventorySvg(`
      <path d="M16 4 25 8v7c0 7-4 11-9 14-5-3-9-7-9-14V8z" fill="#6f86b8" stroke="#273052" stroke-width="2"/>
      <path d="M16 7v18M10 12h12" stroke="#e9ffff" stroke-width="2" opacity=".75"/>
    `);
    if (icon === "O") return tinyInventorySvg(`
      <circle cx="16" cy="17" r="8" fill="none" stroke="#f5ce79" stroke-width="3"/>
      <path d="M16 5 21 10 16 14 11 10z" fill="#55e8ff" stroke="#394066" stroke-width="1.5"/>
      <path d="M12 25h8" stroke="#8a5b2a" stroke-width="2"/>
    `);
    if (icon === "C") return tinyInventorySvg(`
      <path d="M16 3 23 8 24 17 16 29 8 17 9 8z" fill="#55e8ff" stroke="#1f7bd8" stroke-width="2"/>
      <path d="M16 7v18M11 11l5 5 5-5" stroke="#e9ffff" stroke-width="2" opacity=".85"/>
    `);
    if (icon === "★" || icon === "*") return tinyInventorySvg(`
      <path d="M16 4 19 11 27 11 21 16 23 24 16 19 9 24 11 16 5 11 13 11z" fill="#fff264" stroke="#8a5b2a" stroke-width="2"/>
      <circle cx="16" cy="16" r="3" fill="#55c4ff"/>
    `);
    if (icon === "♥" || icon === "❤") return tinyInventorySvg(`
      <path d="M16 25C8 19 5 15 5 10c0-3 2-5 5-5 2 0 4 1 6 4 2-3 4-4 6-4 3 0 5 2 5 5 0 5-3 9-11 15z" fill="#ff7ab5" stroke="#7d3a60" stroke-width="2"/>
      <path d="M12 10c1-1 3-1 4 1" stroke="#fff3d6" stroke-width="1.5" opacity=".8"/>
    `);

    return "";
  }

  function itemNeedsCustomIcon(item) {
    if (!item) return false;
    const id = String(item.id || "");
    if (id.startsWith("wife-ring-")) return true;
    if (id.startsWith("custom-")) return true;
    if (item.customItemName || item.customUsable) return true;
    return false;
  }

  const getInventoryItemsBeforeHideDecorativeIcons = getInventoryItems;
  getInventoryItems = function getInventoryItemsHideDecorativeIcons() {
    return getInventoryItemsBeforeHideDecorativeIcons().filter((item) => !shouldHideDecorativeInventoryItem(item));
  };

  const renderInventoryGridBeforeHideDecorativeIcons = renderInventoryGrid;
  renderInventoryGrid = function renderInventoryGridHideDecorativeIcons(filteredItems, totalItems) {
    const visibleItems = (filteredItems || []).filter((item) => !shouldHideDecorativeInventoryItem(item));
    renderInventoryGridBeforeHideDecorativeIcons(visibleItems, visibleItems.length);

    if (!inventoryGrid) return;
    for (const item of visibleItems) {
      if (!itemNeedsCustomIcon(item)) continue;
      const html = customVisibleInventoryIconHtml(item);
      if (!html) continue;
      const safeId = typeof CSS !== "undefined" && CSS.escape ? CSS.escape(item.id) : String(item.id).replace(/"/g, '\\"');
      const slotIcon = inventoryGrid.querySelector(`[data-item-id="${safeId}"] .item-icon`);
      if (slotIcon) slotIcon.innerHTML = html;
    }
  };

  const renderItemDetailsBeforeHideDecorativeIcons = renderItemDetails;
  renderItemDetails = function renderItemDetailsHideDecorativeIcons(item) {
    if (shouldHideDecorativeInventoryItem(item)) {
      renderItemDetailsBeforeHideDecorativeIcons(null);
      return;
    }
    renderItemDetailsBeforeHideDecorativeIcons(item);
    if (!itemDetailName || !itemNeedsCustomIcon(item)) return;
    const html = customVisibleInventoryIconHtml(item);
    if (html) itemDetailName.innerHTML = `<span class="item-detail-icon-preview">${html}</span><span>${item.name}</span>`;
  };

  try { renderInventory?.(); } catch (error) { console.warn("Inventario atualizado sem itens decorativos", error); }
})();

// === Ultra biome bosses + arrows in every chest patch ===
(function () {
  const PATCH_ID = "ultra-biome-bosses-arrows-v1";
  if (typeof window !== "undefined" && window.ETERNAL_RIFT_ULTRA_BIOME_BOSSES === PATCH_ID) return;
  if (typeof window !== "undefined") window.ETERNAL_RIFT_ULTRA_BIOME_BOSSES = PATCH_ID;

  const ULTRA_BIOME_BOSSES = {
    imperadorDunas: {
      kind: "imperadorDunas",
      name: "Imperador das Dunas",
      biome: "Deserto",
      tileX: 135,
      tileY: 14,
      color: "#e7c267",
      core: "#fff264",
      projectile: "sandLance",
      hazard: "sandstorm",
      chestArrows: 22
    },
    dragaoGlacialAntigo: {
      kind: "dragaoGlacialAntigo",
      name: "Dragao Glacial Antigo",
      biome: "Congelado",
      tileX: 137,
      tileY: 55,
      color: "#8bd8ff",
      core: "#e9ffff",
      projectile: "iceShard",
      hazard: "frost",
      chestArrows: 22
    },
    hidraVenenosa: {
      kind: "hidraVenenosa",
      name: "Hidra Venenosa",
      biome: "Pantano",
      tileX: 75,
      tileY: 88,
      color: "#9aff72",
      core: "#d9ff73",
      projectile: "poisonOrb",
      hazard: "poisonCloud",
      chestArrows: 22
    }
  };

  const ULTRA_BOSS_KINDS = Object.keys(ULTRA_BIOME_BOSSES);

  function ultraClamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function ensureUltraBossState() {
    if (!questBook.ultraBiomeBosses || typeof questBook.ultraBiomeBosses !== "object" || Array.isArray(questBook.ultraBiomeBosses)) {
      questBook.ultraBiomeBosses = { defeated: {}, rewards: {}, arrowsFromChests: {} };
    }
    if (!questBook.ultraBiomeBosses.defeated || typeof questBook.ultraBiomeBosses.defeated !== "object") questBook.ultraBiomeBosses.defeated = {};
    if (!questBook.ultraBiomeBosses.rewards || typeof questBook.ultraBiomeBosses.rewards !== "object") questBook.ultraBiomeBosses.rewards = {};
    if (!questBook.ultraBiomeBosses.arrowsFromChests || typeof questBook.ultraBiomeBosses.arrowsFromChests !== "object") questBook.ultraBiomeBosses.arrowsFromChests = {};
    if (!questBook.defeatedBosses || typeof questBook.defeatedBosses !== "object") questBook.defeatedBosses = {};
    if (!Number.isFinite(inventory.flechas)) inventory.flechas = 0;
    return questBook.ultraBiomeBosses;
  }

  const getEnemyStatsBeforeUltraBiomeBosses = getEnemyStats;
  getEnemyStats = function getEnemyStatsUltraBiomeBosses(kind) {
    if (kind === "imperadorDunas") {
      return {
        width: 52, height: 50, hp: 180, damage: 5, speed: 54,
        aggroRange: 430, attackRange: 250, attackDelay: 0.72, coinReward: 95,
        projectileType: "sandLance", dropTable: { coin: 1, potion: 0.45, loot: 1, powerUp: 0.25 }, xpReward: 2600,
        boss: true, defense: 2,
        resistances: { fireSword: 0.75, iceSword: 1.15, stormSword: 0.9, shadowSword: 1 }
      };
    }
    if (kind === "dragaoGlacialAntigo") {
      return {
        width: 56, height: 50, hp: 200, damage: 5, speed: 50,
        aggroRange: 440, attackRange: 270, attackDelay: 0.78, coinReward: 105,
        projectileType: "iceShard", dropTable: { coin: 1, potion: 0.5, loot: 1, powerUp: 0.25 }, xpReward: 2800,
        boss: true, defense: 3,
        resistances: { iceSword: 0.65, fireSword: 1.18, stormSword: 0.95, shadowSword: 1 }
      };
    }
    if (kind === "hidraVenenosa") {
      return {
        width: 58, height: 48, hp: 210, damage: 5, speed: 48,
        aggroRange: 430, attackRange: 240, attackDelay: 0.68, coinReward: 110,
        projectileType: "poisonOrb", dropTable: { coin: 1, potion: 0.55, loot: 1, powerUp: 0.3 }, xpReward: 2900,
        boss: true, canSwim: true, defense: 2,
        resistances: { shadowSword: 0.85, fireSword: 1.1, stormSword: 1, iceSword: 1 }
      };
    }
    return getEnemyStatsBeforeUltraBiomeBosses(kind);
  };

  const getEnemyDisplayNameBeforeUltraBiomeBosses = getEnemyDisplayName;
  getEnemyDisplayName = function getEnemyDisplayNameUltraBiomeBosses(kind) {
    if (ULTRA_BIOME_BOSSES[kind]) return ULTRA_BIOME_BOSSES[kind].name;
    return getEnemyDisplayNameBeforeUltraBiomeBosses(kind);
  };

  const getEnemyXpRewardBeforeUltraBiomeBosses = getEnemyXpReward;
  getEnemyXpReward = function getEnemyXpRewardUltraBiomeBosses(obj) {
    if (obj?.kind === "imperadorDunas") return 2600;
    if (obj?.kind === "dragaoGlacialAntigo") return 2800;
    if (obj?.kind === "hidraVenenosa") return 2900;
    return getEnemyXpRewardBeforeUltraBiomeBosses(obj);
  };

  const getEnemyProjectileConfigBeforeUltraBiomeBosses = getEnemyProjectileConfig;
  getEnemyProjectileConfig = function getEnemyProjectileConfigUltraBiomeBosses(type, obj) {
    if (type === "sandLance") return { width: 20, height: 10, speed: 245, timer: 2.4 };
    if (type === "iceShard") return { width: 18, height: 18, speed: 230, timer: 2.5 };
    if (type === "poisonOrb") return { width: 17, height: 17, speed: 220, timer: 2.35 };
    return getEnemyProjectileConfigBeforeUltraBiomeBosses(type, obj);
  };

  const getEnemyProjectileColorBeforeUltraBiomeBosses = getEnemyProjectileColor;
  getEnemyProjectileColor = function getEnemyProjectileColorUltraBiomeBosses(type) {
    if (type === "sandLance") return { glow: "rgba(231,194,103,0.38)", main: "#c9973f", core: "#fff264" };
    if (type === "iceShard") return { glow: "rgba(139,216,255,0.38)", main: "#55c4ff", core: "#e9ffff" };
    if (type === "poisonOrb") return { glow: "rgba(154,255,114,0.36)", main: "#62c95d", core: "#d9ff73" };
    return getEnemyProjectileColorBeforeUltraBiomeBosses(type);
  };

  const fireBossPatternBeforeUltraBiomeBosses = fireBossPattern;
  fireBossPattern = function fireBossPatternUltraBiomeBosses(obj, targetX, targetY) {
    if (obj?.kind === "imperadorDunas") {
      for (const offset of [-0.48, -0.2, 0.2, 0.48]) fireEnemyProjectile(obj, targetX, targetY, offset);
      spawnHazardZone("sandstorm", targetX, targetY, obj.phase === 2 ? 56 : 44, 2.2, 1);
      return;
    }
    if (obj?.kind === "dragaoGlacialAntigo") {
      for (const offset of [-0.55, -0.25, 0, 0.25, 0.55]) fireEnemyProjectile(obj, targetX, targetY, offset);
      spawnHazardZone("frost", targetX, targetY, obj.phase === 2 ? 58 : 46, 2.3, 1);
      return;
    }
    if (obj?.kind === "hidraVenenosa") {
      for (const offset of [-0.6, -0.3, 0, 0.3, 0.6]) fireEnemyProjectile(obj, targetX, targetY, offset);
      spawnHazardZone("poisonCloud", targetX, targetY, obj.phase === 2 ? 60 : 48, 2.4, 1);
      return;
    }
    return fireBossPatternBeforeUltraBiomeBosses(obj, targetX, targetY);
  };

  function createUltraBiomeBoss(def) {
    const obj = boss(def.tileX, def.tileY, def.kind);
    obj.ultraBiomeBoss = true;
    obj.bossTitle = def.name;
    obj.name = def.name;
    obj.message = `${def.name}: um chefe muito forte do bioma ${def.biome}.`;
    obj.width = getEnemyStats(def.kind).width;
    obj.height = getEnemyStats(def.kind).height;
    obj.spawnX = def.tileX * TILE + 4;
    obj.spawnY = def.tileY * TILE + 4;
    obj.x = obj.spawnX;
    obj.y = obj.spawnY;
    obj.aggroRange = getEnemyStats(def.kind).aggroRange;
    obj.attackRange = getEnemyStats(def.kind).attackRange;
    return obj;
  }

  function ultraBossKey(kind) {
    const def = ULTRA_BIOME_BOSSES[kind];
    if (!def) return "";
    return `enemy:${kind}:${Math.round(def.tileX * TILE + 4)}:${Math.round(def.tileY * TILE + 4)}`;
  }

  function ensureUltraBiomeBossesOnMap() {
    ensureUltraBossState();
    if (!Array.isArray(villageObjects)) return;
    for (const def of Object.values(ULTRA_BIOME_BOSSES)) {
      const existing = villageObjects.find((obj) => obj?.type === "enemy" && obj.kind === def.kind);
      if (!existing) {
        const obj = createUltraBiomeBoss(def);
        obj.alive = !questBook.defeatedBosses?.[def.kind] && !questBook.ultraBiomeBosses.defeated?.[def.kind];
        villageObjects.push(obj);
      } else {
        existing.ultraBiomeBoss = true;
        existing.boss = true;
        existing.name = def.name;
        existing.bossTitle = def.name;
        if (questBook.defeatedBosses?.[def.kind] || questBook.ultraBiomeBosses.defeated?.[def.kind]) existing.alive = false;
      }
    }
    try {
      if (currentScene === "village") {
        objects = villageObjects;
        colliders = objects.filter((obj) => obj.solid);
        interactables = objects.filter((obj) => obj.message);
      }
    } catch (error) {
      // Nao trava o jogo se a vila ainda estiver carregando.
    }
  }

  const normalizeRuntimeStateBeforeUltraBiomeBosses = normalizeRuntimeState;
  normalizeRuntimeState = function normalizeRuntimeStateUltraBiomeBosses() {
    normalizeRuntimeStateBeforeUltraBiomeBosses();
    ensureUltraBiomeBossesOnMap();
  };

  const loadGameBeforeUltraBiomeBosses = loadGame;
  loadGame = function loadGameUltraBiomeBosses() {
    const loaded = loadGameBeforeUltraBiomeBosses();
    ensureUltraBiomeBossesOnMap();
    return loaded;
  };

  const resetProgressBeforeUltraBiomeBosses = resetProgressForNewGame;
  resetProgressForNewGame = function resetProgressForNewGameUltraBiomeBosses(name) {
    resetProgressBeforeUltraBiomeBosses(name);
    if (questBook.ultraBiomeBosses) {
      questBook.ultraBiomeBosses.defeated = {};
      questBook.ultraBiomeBosses.rewards = {};
      questBook.ultraBiomeBosses.arrowsFromChests = {};
    }
    for (const obj of villageObjects) {
      if (obj?.type === "enemy" && ULTRA_BIOME_BOSSES[obj.kind]) {
        const stats = getEnemyStats(obj.kind);
        obj.alive = true;
        obj.hp = stats.hp;
        obj.maxHp = stats.hp;
        obj.x = obj.spawnX;
        obj.y = obj.spawnY;
        obj.phase = 1;
      }
    }
    ensureUltraBiomeBossesOnMap();
  };

  const setActiveSceneBeforeUltraBiomeBosses = setActiveScene;
  setActiveScene = function setActiveSceneUltraBiomeBosses(scene) {
    setActiveSceneBeforeUltraBiomeBosses(scene);
    ensureUltraBiomeBossesOnMap();
  };

  const updateEnemiesBeforeUltraBiomeBosses = updateEnemies;
  updateEnemies = function updateEnemiesUltraBiomeBosses(delta) {
    updateEnemiesBeforeUltraBiomeBosses(delta);
    if (currentScene !== "village") return;
    const px = player.x + player.width / 2;
    const py = player.y + player.height / 2;
    for (const obj of villageObjects) {
      if (!obj?.alive || !ULTRA_BIOME_BOSSES[obj.kind]) continue;
      const def = ULTRA_BIOME_BOSSES[obj.kind];
      const cx = obj.x + obj.width / 2;
      const cy = obj.y + obj.height / 2;
      const dist = Math.hypot(px - cx, py - cy);
      if (dist < obj.aggroRange && Math.random() < delta * (obj.phase === 2 ? 0.38 : 0.22)) {
        spawnHazardZone(def.hazard, px + (Math.random() - 0.5) * 90, py + (Math.random() - 0.5) * 70, obj.phase === 2 ? 46 : 36, 1.8, 1);
      }
      if (obj.phase === 2 && dist < obj.attackRange && Math.random() < delta * 0.18) {
        fireBossPattern(obj, px, py);
      }
    }
  };

  const drawEnemyBeforeUltraBiomeBosses = drawEnemy;
  drawEnemy = function drawEnemyUltraBiomeBosses(obj) {
    drawEnemyBeforeUltraBiomeBosses(obj);
    const def = ULTRA_BIOME_BOSSES[obj?.kind];
    if (!def || !obj.alive) return;
    const x = obj.x;
    const y = obj.y;
    const t = (typeof performance !== "undefined" ? performance.now() : Date.now()) / 180;
    const pulse = 0.22 + Math.sin(t) * 0.08;
    ctx.save();
    ctx.fillStyle = `rgba(255,242,100,${ultraClamp(pulse, 0.08, 0.32)})`;
    ctx.fillRect(x - 5, y - 7, obj.width + 10, obj.height + 12);
    ctx.fillStyle = def.color;
    ctx.fillRect(x + 6, y - 8, obj.width - 12, 5);
    ctx.fillStyle = def.core;
    ctx.fillRect(x + obj.width / 2 - 4, y - 12, 8, 5);
    ctx.fillStyle = "rgba(39,48,82,0.85)";
    ctx.fillRect(x + 8, y + obj.height - 3, obj.width - 16, 5);
    if (obj.kind === "imperadorDunas") {
      ctx.fillStyle = "#7d5832";
      ctx.fillRect(x + 10, y + 8, obj.width - 20, 10);
      ctx.fillStyle = def.core;
      ctx.fillRect(x + 14, y + 4, obj.width - 28, 5);
      ctx.fillRect(x + obj.width / 2 - 3, y, 6, 8);
    } else if (obj.kind === "dragaoGlacialAntigo") {
      ctx.fillStyle = "rgba(139,216,255,0.75)";
      ctx.fillRect(x - 6, y + 15, 12, 18);
      ctx.fillRect(x + obj.width - 6, y + 15, 12, 18);
      ctx.fillStyle = def.core;
      ctx.fillRect(x + obj.width / 2 - 10, y + 5, 20, 5);
    } else if (obj.kind === "hidraVenenosa") {
      ctx.fillStyle = "rgba(154,255,114,0.55)";
      ctx.fillRect(x + 6, y + 6, 9, 18);
      ctx.fillRect(x + obj.width / 2 - 5, y + 2, 10, 22);
      ctx.fillRect(x + obj.width - 15, y + 6, 9, 18);
      ctx.fillStyle = def.core;
      ctx.fillRect(x + 10, y + 8, 5, 5);
      ctx.fillRect(x + obj.width / 2 - 3, y + 5, 6, 6);
      ctx.fillRect(x + obj.width - 15, y + 8, 5, 5);
    }
    ctx.restore();
  };

  const defeatEnemyBeforeUltraBiomeBosses = defeatEnemy;
  defeatEnemy = function defeatEnemyUltraBiomeBosses(obj) {
    const isUltraBoss = Boolean(obj && ULTRA_BIOME_BOSSES[obj.kind]);
    defeatEnemyBeforeUltraBiomeBosses(obj);
    if (!isUltraBoss) return;
    const state = ensureUltraBossState();
    if (state.rewards[obj.kind]) return;
    state.defeated[obj.kind] = true;
    state.rewards[obj.kind] = true;
    questBook.defeatedBosses[obj.kind] = true;
    inventory.moedas += 120;
    inventory.pocoes += 2;
    inventory.flechas += 30;
    player.maxMana += 1;
    player.mana = player.maxMana;
    awardXp(900, ULTRA_BIOME_BOSSES[obj.kind].name);
    spawnFloatingText("BOSS SUPREMO DERROTADO!", obj.x, obj.y - 58, ULTRA_BIOME_BOSSES[obj.kind].color);
    spawnFloatingText("+30 flechas", obj.x, obj.y - 38, "#fff3d6");
    if (typeof showHudToast === "function") showHudToast(`${ULTRA_BIOME_BOSSES[obj.kind].name} caiu! +30 flechas, +120 moedas e +1 mana.`);
    updateHud();
    renderInventory();
  };

  function isChestLikeForArrowReward(obj) {
    if (!obj) return false;
    if (["chest", "rareChest", "dimensionChest", "elementalBossChest", "celestialChest"].includes(obj.type)) return true;
    if (obj.type === "biomeFeature" && obj.role === "biomeChest") return true;
    return false;
  }

  function getArrowChestKey(obj) {
    if (!obj) return "unknown";
    if (obj.type === "rareChest") return "rareChest:ruins";
    if (obj.type === "dimensionChest") return "dimensionChest:crystal";
    if (obj.type === "elementalBossChest") return `elementalBossChest:${obj.bossKind || obj.chestId || Math.round(obj.x)}:${Math.round(obj.y)}`;
    if (obj.type === "celestialChest") return `celestialChest:${obj.chestId || Math.round(obj.x) + ':' + Math.round(obj.y)}`;
    if (obj.type === "biomeFeature" && obj.role === "biomeChest") return `biomeChest:${obj.chestId || Math.round(obj.x) + ':' + Math.round(obj.y)}`;
    return `${obj.type || "chest"}:${obj.chestId || obj.kind || Math.round(obj.x) + ':' + Math.round(obj.y)}`;
  }

  function getChestOpenedState(obj) {
    if (!obj) return false;
    if (obj.type === "rareChest") return Boolean(questBook.bossChestOpened);
    if (obj.type === "dimensionChest") return Boolean(dimensionQuest.chestOpened);
    if (obj.type === "elementalBossChest") {
      const key = typeof elementalChestKey === "function" && obj.bossKind ? elementalChestKey(obj.bossKind) : "";
      return Boolean(obj.opened || (key && questBook.openedChests?.[key]));
    }
    if (obj.type === "celestialChest") return Boolean(obj.opened || questBook.celestial?.openedChests?.[obj.chestId]);
    if (obj.type === "biomeFeature" && obj.role === "biomeChest") return Boolean(obj.opened || questBook.biomeMissions?.chests?.[obj.chestId]);
    return Boolean(obj.opened);
  }

  function getArrowAmountForChest(obj) {
    if (obj?.type === "rareChest") return 18;
    if (obj?.type === "dimensionChest") return 14;
    if (obj?.type === "elementalBossChest") return 12;
    if (obj?.type === "celestialChest") return 16;
    if (obj?.type === "biomeFeature" && obj.role === "biomeChest") return 20;
    return 8;
  }

  function awardArrowsForChest(obj) {
    const state = ensureUltraBossState();
    const key = getArrowChestKey(obj);
    if (state.arrowsFromChests[key]) return false;
    const amount = getArrowAmountForChest(obj);
    inventory.flechas += amount;
    state.arrowsFromChests[key] = true;
    spawnFloatingText(`+${amount} flechas`, obj.x || player.x, (obj.y || player.y) - 16, "#fff3d6");
    if (typeof showHudToast === "function") showHudToast(`Bau aberto: +${amount} flechas.`);
    updateHud();
    renderInventory();
    return true;
  }

  const getQuestMessageBeforeArrowChestPatch = getQuestMessage;
  getQuestMessage = function getQuestMessageArrowChestPatch(npcObj) {
    const isChest = isChestLikeForArrowReward(npcObj);
    const wasOpened = isChest ? getChestOpenedState(npcObj) : false;
    const result = getQuestMessageBeforeArrowChestPatch(npcObj);
    if (isChest) {
      const nowOpened = getChestOpenedState(npcObj);
      const openedByText = typeof result === "string" && /aberto!|aberto\s*\!/i.test(result) && !/ja foi aberto|já foi aberto/i.test(result);
      if (!wasOpened && (nowOpened || openedByText)) awardArrowsForChest(npcObj);
    }
    return result;
  };

  function updateUltraBossMissionPanelText() {
    ensureUltraBossState();
    const defeated = ULTRA_BOSS_KINDS.filter((kind) => questBook.defeatedBosses?.[kind] || questBook.ultraBiomeBosses?.defeated?.[kind]).length;
    return `${defeated}/${ULTRA_BOSS_KINDS.length}`;
  }

  if (typeof renderMissionsPanel === "function") {
    const renderMissionsPanelBeforeUltraBiomeBosses = renderMissionsPanel;
    renderMissionsPanel = function renderMissionsPanelUltraBiomeBosses() {
      renderMissionsPanelBeforeUltraBiomeBosses();
      try {
        const missionPanel = document.getElementById("missionsPanel") || document.querySelector(".missions-panel");
        if (!missionPanel || missionPanel.querySelector("[data-ultra-biome-bosses]")) return;
        const row = document.createElement("div");
        row.className = "mission-row";
        row.dataset.ultraBiomeBosses = "true";
        row.innerHTML = `<span>Bosses supremos dos biomas</span><strong>${updateUltraBossMissionPanelText()}</strong>`;
        missionPanel.appendChild(row);
      } catch (error) {
        // Painel opcional.
      }
    };
  }

  ensureUltraBossState();
  ensureUltraBiomeBossesOnMap();
})();

/* ==================================================
   Patch: Casa do jogador mais realista + exterior de spawn chamativo
   ================================================== */
(function heroHomeRealisticAndSpawnPatch() {
  function resetHomeMapForHeroHouse() {
    if (!Array.isArray(homeMap)) return;
    for (let y = 0; y < HOME_ROWS; y++) {
      for (let x = 0; x < HOME_COLS; x++) {
        homeMap[y][x] = "I";
      }
    }
    fillHomeRect(homeMap, 0, 0, HOME_COLS, 1, "B");
    fillHomeRect(homeMap, 0, HOME_ROWS - 1, HOME_COLS, 1, "B");
    fillHomeRect(homeMap, 0, 0, 1, HOME_ROWS, "B");
    fillHomeRect(homeMap, HOME_COLS - 1, 0, 1, HOME_ROWS, "B");
    fillHomeRect(homeMap, 14, HOME_ROWS - 1, 2, 1, "I");
    fillHomeRect(homeMap, 3, 3, 7, 4, "R");      // quarto
    fillHomeRect(homeMap, 8, 10, 10, 4, "R");    // sala principal
    fillHomeRect(homeMap, 18, 12, 8, 3, "R");    // area social
  }

  function rebuildHeroHomeInterior() {
    resetHomeMapForHeroHouse();
    homeObjects.length = 0;
    homeObjects.push(
      block(0, 0, HOME_COLS, 1),
      block(0, 0, 1, HOME_ROWS),
      block(HOME_COLS - 1, 0, 1, HOME_ROWS),
      block(0, HOME_ROWS - 1, 14, 1),
      block(16, HOME_ROWS - 1, 14, 1),

      interiorBed(3, 3),
      interiorFurniture(2, 4, "nightstand", true, 1, 1),
      interiorFurniture(9, 4, "nightstand", true, 1, 1),
      interiorFurniture(4, 2, "window", false, 2, 1),
      interiorFurniture(23, 2, "window", false, 2, 1),
      interiorFurniture(12, 2, "wallBanner", false, 5, 2),
      interiorBookshelf(25, 3),
      interiorFurniture(22, 4, "displayShelf", true, 3, 2),
      interiorFurniture(18, 5, "kitchenCounter", true, 4, 2),
      interiorFurniture(12, 7, "roundTable", true, 2, 2),
      interiorFurniture(10, 7, "chair", true, 1, 1),
      interiorFurniture(15, 8, "chair", true, 1, 1),
      interiorFurniture(8, 10, "largeRug", false, 10, 4),
      interiorFurniture(19, 12, "sofa", true, 4, 2),
      interiorFurniture(24, 10, "fireplace", true, 3, 3),
      interiorChest(3, 13),
      interiorFurniture(25, 13, "tallPlant", true, 1, 2),
      interiorFurniture(6, 13, "barrel", true, 1, 1),
      interiorFurniture(8, 13, "vase", true, 1, 1),
      interiorFurniture(19, 15, "shelf", false, 2, 1),
      sign(14, 17, "Saida da casa: caminhe para baixo para voltar a vila. Aqui tambem e o seu ponto de spawn.")
    );

    if (currentScene === "home") {
      objects = homeObjects;
      colliders = objects.filter((obj) => obj.solid);
      interactables = objects.filter((obj) => obj.message);
    }
  }

  function rebuildSpawnExterior() {
    const existingHouse = villageObjects.find((obj) => obj.type === "playerHouse");
    if (existingHouse) {
      existingHouse.title = "Casa do Heroi";
      existingHouse.isSpawnHouse = true;
    }

    for (let i = villageObjects.length - 1; i >= 0; i--) {
      if (villageObjects[i] && villageObjects[i].spawnUpgradeTag) villageObjects.splice(i, 1);
    }

    const spawnExtras = [
      outdoorDecor(23, 34, "lampPost", true),
      outdoorDecor(28, 34, "lampPost", true),
      outdoorDecor(22, 35, "flowerBed", false),
      outdoorDecor(29, 35, "flowerBed", false),
      outdoorDecor(24, 36, "stonePath", false),
      outdoorDecor(25, 36, "stonePath", false),
      outdoorDecor(26, 36, "stonePath", false),
      outdoorDecor(24, 37, "stonePath", false),
      outdoorDecor(25, 37, "stonePath", false),
      outdoorDecor(26, 37, "stonePath", false),
      outdoorDecor(22, 33, "flag", true),
      outdoorDecor(29, 33, "flag", true),
      outdoorDecor(29, 36, "mailbox", true),
      sign(27, 37, "SPAWN: esta casa e o ponto principal de inicio e retorno do jogador.")
    ];

    for (const obj of spawnExtras) {
      obj.spawnUpgradeTag = true;
      villageObjects.push(obj);
    }

    if (currentScene === "village") {
      objects = villageObjects;
      colliders = objects.filter((obj) => obj.solid);
      interactables = objects.filter((obj) => obj.message);
    }
  }

  rebuildHeroHomeInterior();
  rebuildSpawnExterior();

  const drawPlayerHouseBeforeSpawnUpgrade = drawPlayerHouse;
  drawPlayerHouse = function drawPlayerHouseSpawnUpgrade(obj) {
    drawPlayerHouseBeforeSpawnUpgrade(obj);
    const x = obj.x;
    const y = obj.y;
    const glow = 0.65 + Math.sin(performance.now() / 280) * 0.08;

    drawSoftShadow(x + 18, y + 90, 92, 11, 0.32);

    // placa brilhante indicando spawn
    fillPixelV2(x + 32, y + 34, 64, 18, `rgba(85, 232, 255, ${0.12 * glow})`);
    outlinePixelV2(x + 36, y + 38, 56, 13, "#273052");
    fillPixelV2(x + 40, y + 41, 48, 3, "#fff264");
    fillPixelV2(x + 46, y + 45, 8, 2, "#55e8ff");
    fillPixelV2(x + 58, y + 45, 8, 2, "#fff264");
    fillPixelV2(x + 70, y + 45, 8, 2, "#55e8ff");

    // cristal luminoso no topo do telhado
    fillPixelV2(x + 51, y + 4, 26, 24, `rgba(255, 242, 100, ${0.14 * glow})`);
    outlinePixelV2(x + 57, y + 8, 14, 14, "#55e8ff");
    fillPixelV2(x + 61, y + 10, 6, 10, "#fff264");
    fillPixelV2(x + 59, y + 12, 2, 6, "#e9ffff");
    fillPixelV2(x + 67, y + 12, 2, 6, "#e9ffff");

    // luzes do alpendre
    fillPixelV2(x + 20, y + 66, 10, 14, `rgba(255, 242, 100, ${0.20 * glow})`);
    fillPixelV2(x + 98, y + 66, 10, 14, `rgba(255, 242, 100, ${0.20 * glow})`);
    outlinePixelV2(x + 22, y + 70, 6, 10, "#fff264");
    outlinePixelV2(x + 100, y + 70, 6, 10, "#fff264");

    // varanda/entrada para chamar atencao
    outlinePixelV2(x + 22, y + 89, 84, 10, "#a66a43");
    fillPixelV2(x + 28, y + 92, 72, 3, "#f2d4a0");
    fillPixelV2(x + 45, y + 86, 32, 4, "#d24c63");
    fillPixelV2(x + 49, y + 87, 24, 2, "#fff264");

    // pequenos brilhos
    fillPixelV2(x + 14, y + 23, 4, 4, "#fff264");
    fillPixelV2(x + 110, y + 22, 4, 4, "#fff264");
    fillPixelV2(x + 18, y + 27, 2, 2, "#e9ffff");
    fillPixelV2(x + 106, y + 27, 2, 2, "#e9ffff");
  };

  const drawInteriorRoomBackdropBeforeHomeUpgrade = drawInteriorRoomBackdropV2;
  drawInteriorRoomBackdropV2 = function drawInteriorRoomBackdropHomeUpgrade(scene) {
    drawInteriorRoomBackdropBeforeHomeUpgrade(scene);
    if (scene !== "home") return;

    // parede superior com faixa decorativa e luz quente
    fillPixelV2(36, 42, HOME_WIDTH - 72, 10, "rgba(255, 245, 210, 0.10)");
    fillPixelV2(40, 60, HOME_WIDTH - 80, 4, "rgba(39, 48, 82, 0.30)");
    fillPixelV2(70, 86, 120, 8, "rgba(255, 242, 100, 0.10)");
    fillPixelV2(HOME_WIDTH - 190, 86, 120, 8, "rgba(255, 242, 100, 0.10)");

    // divisao visual de ambientes
    fillPixelV2(10 * TILE, 8 * TILE, 2, 8 * TILE, "rgba(116, 70, 49, 0.18)");
    fillPixelV2(20 * TILE, 8 * TILE, 2, 8 * TILE, "rgba(116, 70, 49, 0.18)");
  };
})();

/* ==================================================
   Patch: exterior da casa mais epico + loja e casa do prefeito melhoradas
   ================================================== */
(function epicSpawnShopMayorPatch() {
  if (typeof window !== "undefined" && window.ETERNAL_RIFT_EPIC_SPAWN_SHOP_MAYOR_PATCH) return;
  if (typeof window !== "undefined") window.ETERNAL_RIFT_EPIC_SPAWN_SHOP_MAYOR_PATCH = true;

  function removeByVisualPrefix(target, prefixes) {
    for (let i = target.length - 1; i >= 0; i--) {
      const id = target[i] && target[i].visualV2Id;
      if (id && prefixes.some((prefix) => id.startsWith(prefix))) target.splice(i, 1);
    }
  }

  removeByVisualPrefix(shopInteriorObjects, ["shop-"]);
  removeByVisualPrefix(mayorInteriorObjects, ["mayor-"]);
  for (let i = villageObjects.length - 1; i >= 0; i--) {
    if (villageObjects[i] && villageObjects[i].spawnEpicTag) villageObjects.splice(i, 1);
  }

  addVisualV2Objects(shopInteriorObjects, [
    furnitureV2("shop-window-left", 2, 2, "window", false, 2, 1),
    furnitureV2("shop-window-right", 26, 2, "window", false, 2, 1),
    furnitureV2("shop-banner", 11, 1, "wallBanner", false, 7, 2),
    furnitureV2("shop-display-left", 2, 4, "displayShelf", true, 4, 2),
    furnitureV2("shop-display-right", 24, 4, "displayShelf", true, 4, 2),
    furnitureV2("shop-cash-register", 19, 4, "cashRegister", false, 1, 1),
    furnitureV2("shop-notice", 11, 2, "noticeBoard", false, 6, 2),
    furnitureV2("shop-rug", 8, 10, "largeRug", false, 12, 4),
    furnitureV2("shop-table-left", 3, 12, "merchantTable", true, 3, 2),
    furnitureV2("shop-table-right", 23, 12, "merchantTable", true, 3, 2),
    furnitureV2("shop-armor-left", 3, 8, "armorStand", true, 1, 2),
    furnitureV2("shop-armor-right", 25, 8, "armorStand", true, 1, 2),
    furnitureV2("shop-sofa", 11, 14, "sofa", true, 4, 2),
    furnitureV2("shop-tall-plant-left", 2, 14, "tallPlant", true, 1, 2),
    furnitureV2("shop-tall-plant-right", 27, 14, "tallPlant", true, 1, 2)
  ]);

  addVisualV2Objects(mayorInteriorObjects, [
    furnitureV2("mayor-pillar-left", 2, 2, "pillar", true, 1, 3),
    furnitureV2("mayor-pillar-right", 27, 2, "pillar", true, 1, 3),
    furnitureV2("mayor-banner-left", 5, 1, "wallBanner", false, 4, 2),
    furnitureV2("mayor-banner-right", 21, 1, "wallBanner", false, 4, 2),
    furnitureV2("mayor-throne", 12, 2, "throne", true, 4, 3),
    furnitureV2("mayor-display-left", 2, 5, "displayShelf", true, 3, 2),
    furnitureV2("mayor-display-right", 25, 5, "displayShelf", true, 3, 2),
    furnitureV2("mayor-rug", 9, 8, "largeRug", false, 12, 5),
    furnitureV2("mayor-map-table", 5, 12, "mapTable", true, 4, 2),
    furnitureV2("mayor-office", 20, 12, "officeDesk", true, 4, 2),
    furnitureV2("mayor-sofa", 10, 14, "sofa", true, 5, 2),
    furnitureV2("mayor-fireplace", 24, 11, "fireplace", true, 2, 2),
    furnitureV2("mayor-tall-plant-left", 3, 14, "tallPlant", true, 1, 2),
    furnitureV2("mayor-tall-plant-right", 26, 14, "tallPlant", true, 1, 2)
  ]);

  const epicSpawnExtras = [
    outdoorV2("spawn-epic-banner-left", 22, 33, "spawnBanner", true, 1, 2),
    outdoorV2("spawn-epic-banner-right", 29, 33, "spawnBanner", true, 1, 2),
    outdoorV2("spawn-epic-brazier-left", 23, 36, "crystalBrazier", true, 1, 1),
    outdoorV2("spawn-epic-brazier-right", 28, 36, "crystalBrazier", true, 1, 1),
    outdoorV2("spawn-epic-path-a", 24, 36, "stonePath", false),
    outdoorV2("spawn-epic-path-b", 25, 36, "stonePath", false),
    outdoorV2("spawn-epic-path-c", 26, 36, "stonePath", false),
    outdoorV2("spawn-epic-path-d", 24, 37, "stonePath", false),
    outdoorV2("spawn-epic-path-e", 25, 37, "stonePath", false),
    outdoorV2("spawn-epic-path-f", 26, 37, "stonePath", false),
    outdoorV2("spawn-epic-flowers-left", 21, 36, "flowerBed", false),
    outdoorV2("spawn-epic-flowers-right", 30, 36, "flowerBed", false),
    outdoorV2("spawn-epic-mailbox", 29, 35, "mailbox", true),
    outdoorV2("spawn-epic-arch", 24, 35, "spawnArch", false, 3, 2, "Portal do Lar: este e o ponto de spawn principal do jogador."),
    sign(27, 38, "Spawn Principal: volte para ca depois das aventuras para descansar e organizar seu inventario.")
  ];
  for (const obj of epicSpawnExtras) {
    obj.spawnEpicTag = true;
    villageObjects.push(obj);
  }

  if (currentScene === "shopInterior") objects = shopInteriorObjects;
  else if (currentScene === "mayorInterior") objects = mayorInteriorObjects;
  else if (currentScene === "village") objects = villageObjects;
  colliders = objects.filter((obj) => obj.solid);
  interactables = objects.filter((obj) => obj.message);

  const drawFurnitureBeforeEpicPatch = drawFurniture;
  drawFurniture = function drawFurnitureEpicPatch(obj) {
    const x = obj.x;
    const y = obj.y;
    const w = obj.width;
    const h = obj.height;
    if (obj.kind === "merchantTable") {
      drawSoftShadow(x + 4, y + h - 4, w - 8, 7, 0.2);
      outlinePixelV2(x, y + 6, w, h - 8, "#8f5a3f");
      fillPixelV2(x + 6, y + 8, w - 12, 10, "#d99b67");
      fillPixelV2(x + 8, y + 12, 7, 8, "#d24c63");
      fillPixelV2(x + 18, y + 11, 6, 9, "#55c4ff");
      fillPixelV2(x + 28, y + 12, 6, 8, "#7bdb73");
      fillPixelV2(x + w - 14, y + 11, 5, 5, "#fff264");
      return;
    }
    if (obj.kind === "armorStand") {
      drawSoftShadow(x + 5, y + h - 3, w - 10, 6, 0.18);
      fillPixelV2(x + 14, y + 8, 4, h - 14, "#7d4d38");
      outlinePixelV2(x + 6, y + 4, 20, 18, "#273052");
      fillPixelV2(x + 10, y + 8, 12, 10, "#b46dff");
      fillPixelV2(x + 11, y + 20, 10, 6, "#fff264");
      fillPixelV2(x + 23, y + 5, 5, 18, "#c8d0d8");
      return;
    }
    if (obj.kind === "pillar") {
      outlinePixelV2(x + 8, y, w - 16, h, "#8c8a96");
      fillPixelV2(x + 12, y + 6, w - 24, h - 12, "#d9d7e4");
      fillPixelV2(x + 6, y + h - 8, w - 12, 6, "#b6b3c8");
      fillPixelV2(x + 6, y + 2, w - 12, 6, "#f1eff7");
      return;
    }
    if (obj.kind === "throne") {
      drawSoftShadow(x + 6, y + h - 3, w - 12, 7, 0.22);
      outlinePixelV2(x + 6, y + 8, w - 12, h - 10, "#71476c");
      fillPixelV2(x + 14, y + 12, w - 28, h - 24, "#d24c63");
      fillPixelV2(x + 18, y + 4, w - 36, 12, "#fff264");
      fillPixelV2(x + 10, y + h - 18, w - 20, 8, "#9b5fc7");
      fillPixelV2(x + w / 2 - 4, y + 16, 8, 8, "#55e8ff");
      return;
    }
    if (obj.kind === "mapTable") {
      drawSoftShadow(x + 4, y + h - 3, w - 8, 7, 0.2);
      outlinePixelV2(x, y + 6, w, h - 8, "#8f5a3f");
      fillPixelV2(x + 6, y + 9, w - 12, h - 18, "#d99b67");
      fillPixelV2(x + 12, y + 12, w - 24, h - 24, "#fff3d6");
      fillPixelV2(x + 18, y + 16, 16, 6, "#55c4ff");
      fillPixelV2(x + 40, y + 19, 14, 5, "#7bdb73");
      fillPixelV2(x + 62, y + 15, 10, 10, "#d24c63");
      return;
    }
    if (obj.kind === "officeDesk") {
      drawSoftShadow(x + 4, y + h - 3, w - 8, 7, 0.22);
      outlinePixelV2(x, y + 5, w, h - 8, "#7d4d38");
      fillPixelV2(x + 6, y + 8, w - 12, 11, "#c48a5a");
      fillPixelV2(x + 12, y + 12, 20, 5, "#fff3d6");
      fillPixelV2(x + 36, y + 12, 12, 6, "#55c4ff");
      fillPixelV2(x + 56, y + 10, 16, 8, "#d24c63");
      fillPixelV2(x + 16, y + 23, 14, 10, "#6d5c75");
      fillPixelV2(x + 48, y + 23, 16, 10, "#6d5c75");
      return;
    }
    return drawFurnitureBeforeEpicPatch(obj);
  };

  const drawOutdoorBeforeEpicPatch = drawOutdoorDecor;
  drawOutdoorDecor = function drawOutdoorEpicPatch(obj) {
    const x = obj.x;
    const y = obj.y;
    const pulse = 0.72 + Math.sin(performance.now() / 260) * 0.12;
    if (obj.kind === "spawnBanner") {
      fillPixelV2(x + 14, y + 2, 4, 28, "#7d4d38");
      outlinePixelV2(x + 18, y + 4, 14, 18, "#273052");
      fillPixelV2(x + 20, y + 6, 10, 14, "#55c4ff");
      fillPixelV2(x + 22, y + 9, 6, 6, "#fff264");
      return;
    }
    if (obj.kind === "crystalBrazier") {
      drawSoftShadow(x + 4, y + 24, 24, 6, 0.22);
      outlinePixelV2(x + 6, y + 16, 20, 10, "#8f5a3f");
      fillPixelV2(x + 10, y + 10, 12, 10, `rgba(85, 232, 255, ${0.18 * pulse})`);
      fillPixelV2(x + 12, y + 12, 8, 8, "#55e8ff");
      fillPixelV2(x + 14, y + 14, 4, 4, "#fff264");
      return;
    }
    if (obj.kind === "spawnArch") {
      fillPixelV2(x + 10, y + 18, 6, 34, "#8f5a3f");
      fillPixelV2(x + obj.width - 16, y + 18, 6, 34, "#8f5a3f");
      outlinePixelV2(x + 10, y + 12, obj.width - 20, 10, "#273052");
      fillPixelV2(x + 16, y + 14, obj.width - 32, 6, "#55e8ff");
      fillPixelV2(x + obj.width / 2 - 6, y + 4, 12, 12, "#fff264");
      fillPixelV2(x + obj.width / 2 - 4, y + 7, 8, 6, "#55e8ff");
      fillPixelV2(x + 6, y + 8, obj.width - 12, 24, `rgba(255, 242, 100, ${0.08 * pulse})`);
      return;
    }
    return drawOutdoorBeforeEpicPatch(obj);
  };

  const drawPlayerHouseBeforeEpicPatch = drawPlayerHouse;
  drawPlayerHouse = function drawPlayerHouseEpicPatch(obj) {
    drawPlayerHouseBeforeEpicPatch(obj);
    const x = obj.x;
    const y = obj.y;
    const pulse = 0.8 + Math.sin(performance.now() / 240) * 0.12;

    // faixas laterais do spawn
    outlinePixelV2(x + 10, y + 34, 12, 30, "#273052");
    outlinePixelV2(x + 102, y + 34, 12, 30, "#273052");
    fillPixelV2(x + 12, y + 36, 8, 26, "#55c4ff");
    fillPixelV2(x + 104, y + 36, 8, 26, "#55c4ff");
    fillPixelV2(x + 14, y + 42, 4, 8, "#fff264");
    fillPixelV2(x + 106, y + 42, 4, 8, "#fff264");

    // emblema central
    fillPixelV2(x + 49, y + 48, 18, 18, `rgba(255, 242, 100, ${0.16 * pulse})`);
    outlinePixelV2(x + 53, y + 52, 10, 10, "#fff264");
    fillPixelV2(x + 56, y + 55, 4, 4, "#55e8ff");

    // varanda e degraus mais nobres
    fillPixelV2(x + 40, y + 96, 44, 4, "#f5ce79");
    fillPixelV2(x + 44, y + 100, 36, 4, "#d99b67");
    fillPixelV2(x + 48, y + 104, 28, 4, "#b9845a");

    // janelas mais brilhantes
    fillPixelV2(x + 26, y + 61, 14, 14, `rgba(255, 242, 100, ${0.18 * pulse})`);
    fillPixelV2(x + 85, y + 61, 14, 14, `rgba(255, 242, 100, ${0.18 * pulse})`);
    fillPixelV2(x + 30, y + 65, 6, 6, "#fff264");
    fillPixelV2(x + 89, y + 65, 6, 6, "#fff264");
  };

  const drawInteriorBackdropBeforeEpicPatch = drawInteriorRoomBackdropV2;
  drawInteriorRoomBackdropV2 = function drawInteriorRoomBackdropEpicPatch(scene) {
    drawInteriorBackdropBeforeEpicPatch(scene);
    if (scene === "shopInterior") {
      // vigas e luz quente de loja
      fillPixelV2(2 * TILE, 2 * TILE, 26 * TILE, 6, "rgba(120, 78, 46, 0.22)");
      fillPixelV2(5 * TILE, 3 * TILE, 20 * TILE, 4, "rgba(255, 242, 100, 0.08)");
      fillPixelV2(3 * TILE, 9 * TILE, 24 * TILE, 3, "rgba(39, 48, 82, 0.10)");
      fillPixelV2(3 * TILE, 14 * TILE, 24 * TILE, 3, "rgba(39, 48, 82, 0.10)");
    }
    if (scene === "mayorInterior") {
      // sala mais nobre do prefeito
      fillPixelV2(3 * TILE, 2 * TILE, 24 * TILE, 5, "rgba(255, 242, 100, 0.12)");
      fillPixelV2(5 * TILE, 4 * TILE, 20 * TILE, 3, "rgba(85, 196, 255, 0.10)");
      fillPixelV2(8 * TILE, 7 * TILE, 14 * TILE, 4, "rgba(107, 45, 74, 0.18)");
      fillPixelV2(4 * TILE, 13 * TILE, 22 * TILE, 3, "rgba(39, 48, 82, 0.12)");
    }
  };
})();

/* ==================================================
   Patch extra: casa maior por dentro + quarto especial das esposas
   ================================================== */
(function expandedHomeAndWivesRoomPatch() {
  if (typeof window !== "undefined" && window.ETERNAL_RIFT_EXPANDED_HOME_WIVES_ROOM_PATCH) return;
  if (typeof window !== "undefined") window.ETERNAL_RIFT_EXPANDED_HOME_WIVES_ROOM_PATCH = true;

  function resetHomeInteriorLayout() {
    homeObjects.length = 0;

    // paredes e saida
    homeObjects.push(
      block(0, 0, HOME_COLS, 1),
      block(0, 0, 1, HOME_ROWS),
      block(HOME_COLS - 1, 0, 1, HOME_ROWS),
      block(0, HOME_ROWS - 1, 14, 1),
      block(16, HOME_ROWS - 1, 14, 1),
      sign(14, 17, "Porta de saida: caminhe para baixo para voltar a vila."),

      // ala principal - casa mais ampla, organizada e aconchegante
      interiorBed(2, 2),
      interiorBookshelf(6, 2),
      interiorTable(10, 3),
      interiorChest(2, 12),
      interiorPlant(8, 12),
      furnitureV2("home-window-left", 3, 2, "window", false, 2, 1),
      furnitureV2("home-window-mid", 12, 2, "window", false, 2, 1),
      furnitureV2("home-window-right", 16, 2, "window", false, 2, 1),
      furnitureV2("home-chair-a", 10, 5, "chair", true),
      furnitureV2("home-chair-b", 13, 5, "chair", true),
      furnitureV2("home-chair-c", 12, 8, "chair", true),
      furnitureV2("home-reading-rug", 2, 6, "rugSmall", false, 6, 3),
      furnitureV2("home-grand-rug", 8, 10, "rugSmall", false, 8, 4),
      furnitureV2("home-stove", 10, 12, "stove", true, 2, 2),
      furnitureV2("home-shelf", 13, 12, "shelf", false, 2, 1),
      furnitureV2("home-vase", 16, 12, "vase", true),
      furnitureV2("home-armoire", 5, 11, "armoire", true, 2, 3),
      furnitureV2("home-lamp-a", 8, 2, "lamp", false),
      furnitureV2("home-lamp-b", 15, 2, "lamp", false),
      furnitureV2("home-family-frame", 15, 4, "wifePortrait", false, 2, 1, "Lar do heroi: este salao ficou maior por dentro para o jogador descansar, organizar equipamentos e viver com suas esposas."),

      // divisoria / corredor para a suite das esposas
      furnitureV2("wives-partition-top", 19, 2, "partition", true, 1, 4),
      furnitureV2("wives-partition-bottom", 19, 8, "partition", true, 1, 7),

      // suite especial das esposas
      furnitureV2("wives-title-frame", 22, 2, "wifePortrait", false, 2, 1, "Suite das Esposas: um quarto especial preparado para Selene, Nyra, Lilith, Yumi, Aurora, Mika e Violet."),
      furnitureV2("wives-bed-1", 21, 3, "wifeCanopyBed", true, 3, 2),
      furnitureV2("wives-bed-2", 24, 3, "wifeCanopyBed", true, 3, 2),
      furnitureV2("wives-plaque-a", 21, 6, "wifePortrait", false, 2, 1, "Moradoras: Selene, Nyra e Lilith."),
      furnitureV2("wives-plaque-b", 24, 6, "wifePortrait", false, 2, 1, "Moradoras: Yumi, Aurora, Mika e Violet."),
      furnitureV2("wives-bed-3", 21, 8, "wifeCanopyBed", true, 3, 2),
      furnitureV2("wives-bed-4", 24, 8, "wifeCanopyBed", true, 3, 2),
      furnitureV2("wives-vanity", 21, 12, "vanityTable", true, 3, 2, "Penteadeira delicada das esposas: perfume, joias, flores e cartas guardadas com carinho."),
      furnitureV2("wives-chest", 25, 12, "wivesChest", true, 2, 1, "Bau das Esposas: vestidos, fitas, presentes e lembrancas especiais do lar."),
      furnitureV2("wives-armoire", 27, 11, "armoire", true, 2, 3),
      furnitureV2("wives-rug", 21, 14, "rugSmall", false, 7, 2),
      furnitureV2("wives-vase", 27, 3, "vase", true),
      sign(22, 15, "Quarto das Esposas: um espaco reservado e bonito dentro da casa do jogador.")
    );
  }

  resetHomeInteriorLayout();

  if (currentScene === "home") {
    objects = homeObjects;
    colliders = objects.filter((obj) => obj.solid);
    interactables = objects.filter((obj) => obj.message);
  }

  const drawFurnitureBeforeExpandedHomePatch = drawFurniture;
  drawFurniture = function drawFurnitureExpandedHomePatch(obj) {
    const x = obj.x;
    const y = obj.y;
    const w = obj.width;
    const h = obj.height;

    if (obj.kind === "partition") {
      drawSoftShadow(x + 3, y + h - 4, w - 6, 5, 0.18);
      fillPixelV2(x + 10, y, w - 20, h, "#8f5a3f");
      fillPixelV2(x + 3, y + 4, w - 6, 6, "#d99b67");
      fillPixelV2(x + 3, y + h - 10, w - 6, 6, "#d99b67");
      fillPixelV2(x + 5, y + 12, w - 10, h - 24, "#7b4bd1");
      fillPixelV2(x + 8, y + 16, w - 16, h - 32, "#a56bff");
      return;
    }

    if (obj.kind === "wifeCanopyBed") {
      drawSoftShadow(x + 4, y + h - 4, w - 8, 6, 0.20);
      // dossel
      outlinePixelV2(x + 4, y + 2, w - 8, 10, "#6d3d89");
      fillPixelV2(x + 8, y + 5, w - 16, 6, "#c98aff");
      fillPixelV2(x + 4, y + 2, 4, h - 10, "#8f5a3f");
      fillPixelV2(x + w - 8, y + 2, 4, h - 10, "#8f5a3f");
      // colchao
      outlinePixelV2(x + 8, y + 18, w - 16, h - 22, "#71476c");
      fillPixelV2(x + 12, y + 22, w - 24, 10, "#fff3d6");
      fillPixelV2(x + 12, y + 34, w - 24, h - 40, "#d48cff");
      fillPixelV2(x + 14, y + 24, 10, 6, "#f5ce79");
      fillPixelV2(x + w - 24, y + 24, 10, 6, "#f5ce79");
      fillPixelV2(x + w / 2 - 3, y + 7, 6, 6, "#fff264");
      return;
    }

    if (obj.kind === "vanityTable") {
      drawSoftShadow(x + 4, y + h - 4, w - 8, 6, 0.18);
      outlinePixelV2(x + 2, y + 18, w - 4, h - 20, "#8f5a3f");
      fillPixelV2(x + 8, y + 22, w - 16, 9, "#d99b67");
      // espelho
      outlinePixelV2(x + 18, y + 2, w - 36, 18, "#6d3d89");
      fillPixelV2(x + 22, y + 6, w - 44, 10, "#bde8ff");
      fillPixelV2(x + 10, y + 25, 6, 5, "#ff7ab5");
      fillPixelV2(x + 18, y + 24, 6, 6, "#fff264");
      fillPixelV2(x + 26, y + 24, 6, 6, "#55e8ff");
      return;
    }

    if (obj.kind === "wifePortrait") {
      outlinePixelV2(x + 4, y + 4, w - 8, h - 8, "#6d3d89");
      fillPixelV2(x + 8, y + 8, w - 16, h - 16, "#f5e0ff");
      fillPixelV2(x + w / 2 - 10, y + 12, 20, 3, "#c98aff");
      fillPixelV2(x + w / 2 - 4, y + 16, 8, 8, "#fff264");
      fillPixelV2(x + w / 2 - 2, y + 18, 4, 4, "#55e8ff");
      return;
    }

    if (obj.kind === "wivesChest") {
      drawSoftShadow(x + 4, y + h - 3, w - 8, 5, 0.18);
      outlinePixelV2(x + 2, y + 10, w - 4, h - 12, "#7d4d38");
      fillPixelV2(x + 6, y + 14, w - 12, h - 20, "#b87955");
      fillPixelV2(x + 10, y + 6, w - 20, 10, "#8e59ca");
      fillPixelV2(x + w / 2 - 3, y + 16, 6, 6, "#fff264");
      return;
    }

    return drawFurnitureBeforeExpandedHomePatch(obj);
  };

  const drawInteriorBackdropBeforeExpandedHomePatch = drawInteriorRoomBackdropV2;
  drawInteriorRoomBackdropV2 = function drawInteriorBackdropExpandedHomePatch(scene) {
    drawInteriorBackdropBeforeExpandedHomePatch(scene);
    if (scene !== "home") return;

    // sala principal mais ampla
    fillPixelV2(2 * TILE, 2 * TILE, 16 * TILE, 13 * TILE, "rgba(255, 245, 210, 0.045)");
    fillPixelV2(3 * TILE, 3 * TILE, 14 * TILE, 3, "rgba(255, 242, 100, 0.08)");
    fillPixelV2(9 * TILE, 9 * TILE, 7 * TILE, 4 * TILE, "rgba(210, 76, 99, 0.12)");

    // corredor / porta visual para a suite das esposas
    fillPixelV2(19 * TILE - 3, 2 * TILE, 6, 13 * TILE, "rgba(116, 70, 49, 0.30)");
    fillPixelV2(19 * TILE - 4, 6 * TILE, 8, 2 * TILE, "rgba(255, 242, 100, 0.10)");

    // suite das esposas com tom roxo elegante
    fillPixelV2(20 * TILE, 2 * TILE, 8 * TILE, 13 * TILE, "rgba(124, 77, 177, 0.08)");
    fillPixelV2(21 * TILE, 3 * TILE, 6 * TILE, 8 * TILE, "rgba(201, 138, 255, 0.05)");
    fillPixelV2(21 * TILE, 13 * TILE, 7 * TILE, 2 * TILE, "rgba(255, 242, 100, 0.08)");
  };
})();

/* ==================================================
   Patch extra 4: casa ultra realista + tapetes com colisao
   ================================================== */
(function ultraRealisticHomePatch() {
  if (typeof window !== 'undefined' && window.ETERNAL_RIFT_ULTRA_REALISTIC_HOME_PATCH) return;
  if (typeof window !== 'undefined') window.ETERNAL_RIFT_ULTRA_REALISTIC_HOME_PATCH = true;

  function rebuildUltraHome() {
    homeObjects.length = 0;
    homeObjects.push(
      // limites da casa
      block(0, 0, HOME_COLS, 1),
      block(0, 0, 1, HOME_ROWS),
      block(HOME_COLS - 1, 0, 1, HOME_ROWS),
      block(0, HOME_ROWS - 1, 14, 1),
      block(16, HOME_ROWS - 1, 14, 1),
      sign(14, 17, 'Porta de saida: caminhe para baixo para voltar para a vila.'),

      // janelas e decoracao superior
      furnitureV2('ultra-window-a', 2, 1, 'window', false, 2, 1),
      furnitureV2('ultra-window-b', 7, 1, 'window', false, 2, 1),
      furnitureV2('ultra-window-c', 12, 1, 'window', false, 2, 1),
      furnitureV2('ultra-window-d', 21, 1, 'window', false, 2, 1),
      furnitureV2('ultra-window-e', 25, 1, 'window', false, 2, 1),
      furnitureV2('ultra-lamp-a', 4, 1, 'lamp', false),
      furnitureV2('ultra-lamp-b', 17, 1, 'lamp', false),
      furnitureV2('ultra-lamp-c', 27, 1, 'lamp', false),
      furnitureV2('ultra-banner', 14, 1, 'royalBanner', false, 2, 3),
      furnitureV2('ultra-frame-top', 15, 4, 'paintingWide', false, 3, 1),

      // sala de estar principal (lado esquerdo)
      furnitureV2('ultra-sofa-left', 2, 8, 'luxurySofa', true, 4, 2),
      furnitureV2('ultra-sofa-right', 8, 8, 'luxurySofa', true, 4, 2),
      furnitureV2('ultra-fireplace', 5, 11, 'stoneFireplace', true, 3, 2),
      furnitureV2('ultra-coffee', 6, 7, 'coffeeTable', true, 2, 1),
      furnitureV2('ultra-bookshelf', 2, 3, 'bookshelfTall', true, 2, 3),
      furnitureV2('ultra-armoire-left', 10, 3, 'armoire', true, 2, 3),
      furnitureV2('ultra-living-rug', 2, 6, 'solidRugRed', true, 10, 5, 'Tapete da sala: agora ele possui colisao para o jogador nao atravessar o desenho.'),

      // cozinha e jantar (centro)
      furnitureV2('ultra-kitchen-counter-a', 12, 5, 'kitchenCounter', true, 3, 1),
      furnitureV2('ultra-kitchen-counter-b', 15, 5, 'kitchenCounter', true, 3, 1),
      furnitureV2('ultra-kitchen-counter-c', 12, 6, 'kitchenCounter', true, 1, 2),
      furnitureV2('ultra-stove', 16, 6, 'stoveDeluxe', true, 2, 2),
      furnitureV2('ultra-sink', 14, 6, 'kitchenSink', true, 2, 1),
      furnitureV2('ultra-table', 13, 9, 'diningTable', true, 4, 2),
      furnitureV2('ultra-chair-a', 13, 8, 'chair', true),
      furnitureV2('ultra-chair-b', 16, 8, 'chair', true),
      furnitureV2('ultra-chair-c', 13, 11, 'chair', true),
      furnitureV2('ultra-chair-d', 16, 11, 'chair', true),
      furnitureV2('ultra-floor-rug', 12, 8, 'solidRugBlue', true, 6, 5, 'Tapete da sala de jantar: colisao ativada para nao ficar bugado.'),
      furnitureV2('ultra-plant-center', 18, 8, 'vase', true),

      // divisoria elegante para a suite das esposas
      furnitureV2('ultra-divider-top', 19, 2, 'partitionGold', true, 1, 5),
      furnitureV2('ultra-divider-bottom', 19, 9, 'partitionGold', true, 1, 6),

      // suite das esposas (lado direito)
      furnitureV2('ultra-wives-title', 22, 2, 'wifePortrait', false, 3, 1, 'Suite das esposas: um quarto mais bonito e digno para as companheiras do jogador.'),
      furnitureV2('ultra-wives-bed-a', 21, 3, 'wifeCanopyBedDeluxe', true, 3, 2),
      furnitureV2('ultra-wives-bed-b', 25, 3, 'wifeCanopyBedDeluxe', true, 3, 2),
      furnitureV2('ultra-wives-bed-c', 21, 8, 'wifeCanopyBedDeluxe', true, 3, 2),
      furnitureV2('ultra-wives-bed-d', 25, 8, 'wifeCanopyBedDeluxe', true, 3, 2),
      furnitureV2('ultra-vanity', 21, 12, 'vanityTableDeluxe', true, 3, 2),
      furnitureV2('ultra-wardrobe-right', 26, 11, 'armoire', true, 2, 3),
      furnitureV2('ultra-wife-chest', 24, 12, 'wivesChest', true, 2, 1, 'Bau das esposas: vestidos, presentes e itens especiais guardados aqui.'),
      furnitureV2('ultra-wife-rug', 21, 6, 'solidRugPurple', true, 7, 8, 'Tapete da suite: colisao ativada.'),
      furnitureV2('ultra-wife-plant', 28, 6, 'vase', true),
      furnitureV2('ultra-wife-shelf', 24, 14, 'shelf', false, 2, 1),
      furnitureV2('ultra-wife-frame', 27, 2, 'paintingWide', false, 2, 1),
      sign(22, 15, 'Quarto das esposas: um ambiente luxuoso, bonito e mais realista.')
    );
  }

  rebuildUltraHome();
  if (currentScene === 'home') {
    objects = homeObjects;
    colliders = objects.filter((obj) => obj.solid);
    interactables = objects.filter((obj) => obj.message);
  }

  const prevDrawFurnitureUltra = drawFurniture;
  drawFurniture = function drawFurnitureUltraRealistic(obj) {
    const x = obj.x;
    const y = obj.y;
    const w = obj.width;
    const h = obj.height;

    if (obj.kind === 'solidRugRed' || obj.kind === 'solidRugBlue' || obj.kind === 'solidRugPurple') {
      const base = obj.kind === 'solidRugRed' ? '#b84d63' : obj.kind === 'solidRugBlue' ? '#5b93d1' : '#9363cb';
      const dark = obj.kind === 'solidRugRed' ? '#8f3349' : obj.kind === 'solidRugBlue' ? '#376ea9' : '#6d42a8';
      const light = obj.kind === 'solidRugRed' ? '#d96d82' : obj.kind === 'solidRugBlue' ? '#7fb8ec' : '#bc8ef4';
      drawSoftShadow(x + 2, y + h - 3, w - 4, 5, 0.16);
      outlinePixelV2(x, y, w, h, dark);
      fillPixelV2(x + 2, y + 2, w - 4, h - 4, base);
      for (let iy = y + 6; iy < y + h - 6; iy += 8) {
        fillPixelV2(x + 4, iy, w - 8, 2, light);
      }
      for (let ix = x + 6; ix < x + w - 6; ix += 10) {
        fillPixelV2(ix, y + 4, 2, h - 8, light);
      }
      fillPixelV2(x + 5, y + 5, w - 10, h - 10, 'rgba(255,255,255,0.06)');
      return;
    }

    if (obj.kind === 'royalBanner') {
      fillPixelV2(x + w / 2 - 2, y, 4, h, '#8f5a3f');
      outlinePixelV2(x + 6, y + 3, w - 12, h - 8, '#20315e');
      fillPixelV2(x + 8, y + 5, w - 16, h - 14, '#6a54d7');
      fillPixelV2(x + w / 2 - 4, y + 10, 8, 8, '#fff264');
      fillPixelV2(x + w / 2 - 8, y + 20, 16, 3, '#c7a13a');
      return;
    }

    if (obj.kind === 'paintingWide') {
      outlinePixelV2(x + 2, y + 2, w - 4, h - 4, '#6d3d89');
      fillPixelV2(x + 6, y + 6, w - 12, h - 12, '#f4e8ff');
      fillPixelV2(x + w / 2 - 10, y + h / 2 - 2, 20, 4, '#c98aff');
      fillPixelV2(x + w / 2 - 3, y + h / 2 - 8, 6, 16, '#fff264');
      return;
    }

    if (obj.kind === 'bookshelfTall') {
      drawSoftShadow(x + 3, y + h - 3, w - 6, 5, 0.16);
      outlinePixelV2(x + 2, y + 2, w - 4, h - 4, '#68452f');
      fillPixelV2(x + 6, y + 6, w - 12, h - 12, '#8f5a3f');
      for (let sy = y + 12; sy < y + h - 8; sy += 12) {
        fillPixelV2(x + 8, sy, w - 16, 2, '#e7b97f');
        fillPixelV2(x + 10, sy + 3, 5, 7, '#4fb1ff');
        fillPixelV2(x + 17, sy + 3, 5, 7, '#df5ca8');
        fillPixelV2(x + 24, sy + 3, 5, 7, '#fff264');
      }
      return;
    }

    if (obj.kind === 'luxurySofa') {
      drawSoftShadow(x + 4, y + h - 4, w - 8, 5, 0.18);
      outlinePixelV2(x + 2, y + 8, w - 4, h - 10, '#5f3650');
      fillPixelV2(x + 4, y + 10, w - 8, h - 14, '#8c5fd0');
      fillPixelV2(x + 6, y + 14, w - 12, h - 18, '#b287f0');
      fillPixelV2(x + 4, y + h - 8, w - 8, 4, '#6a4779');
      fillPixelV2(x + 4, y + 4, 6, 8, '#774490');
      fillPixelV2(x + w - 10, y + 4, 6, 8, '#774490');
      return;
    }

    if (obj.kind === 'coffeeTable') {
      drawSoftShadow(x + 2, y + h - 3, w - 4, 4, 0.16);
      outlinePixelV2(x + 2, y + 4, w - 4, h - 8, '#7d4d38');
      fillPixelV2(x + 4, y + 6, w - 8, h - 12, '#c98c62');
      fillPixelV2(x + 8, y + 8, 6, 4, '#fff264');
      fillPixelV2(x + 16, y + 8, 6, 4, '#ff7ab5');
      return;
    }

    if (obj.kind === 'stoneFireplace') {
      drawSoftShadow(x + 4, y + h - 4, w - 8, 5, 0.20);
      outlinePixelV2(x + 2, y + 6, w - 4, h - 8, '#4b556b');
      fillPixelV2(x + 4, y + 8, w - 8, h - 12, '#6f778c');
      fillPixelV2(x + 10, y + 14, w - 20, h - 20, '#2f2a34');
      fillPixelV2(x + w / 2 - 8, y + 18, 16, 8, '#ff9a3c');
      fillPixelV2(x + w / 2 - 4, y + 14, 8, 6, '#fff264');
      fillPixelV2(x + 12, y + 2, w - 24, 6, '#a5afc2');
      return;
    }

    if (obj.kind === 'kitchenCounter') {
      drawSoftShadow(x + 3, y + h - 3, w - 6, 4, 0.14);
      outlinePixelV2(x + 2, y + 6, w - 4, h - 8, '#704d38');
      fillPixelV2(x + 4, y + 8, w - 8, h - 12, '#c08a63');
      fillPixelV2(x + 2, y + 2, w - 4, 6, '#d8dfef');
      return;
    }

    if (obj.kind === 'kitchenSink') {
      drawSoftShadow(x + 2, y + h - 3, w - 4, 4, 0.12);
      outlinePixelV2(x + 2, y + 4, w - 4, h - 6, '#5c6474');
      fillPixelV2(x + 4, y + 6, w - 8, h - 10, '#c7d8ea');
      fillPixelV2(x + 10, y + 10, w - 20, h - 18, '#8eb5d8');
      fillPixelV2(x + w / 2 - 2, y + 2, 4, 8, '#7d4d38');
      return;
    }

    if (obj.kind === 'stoveDeluxe') {
      drawSoftShadow(x + 2, y + h - 3, w - 4, 4, 0.16);
      outlinePixelV2(x + 2, y + 4, w - 4, h - 6, '#313645');
      fillPixelV2(x + 4, y + 6, w - 8, h - 10, '#5e677c');
      fillPixelV2(x + 8, y + 10, w - 16, 8, '#2e3444');
      fillPixelV2(x + 10, y + 12, 6, 6, '#ff6b3d');
      fillPixelV2(x + w - 16, y + 12, 6, 6, '#fff264');
      return;
    }

    if (obj.kind === 'diningTable') {
      drawSoftShadow(x + 4, y + h - 3, w - 8, 5, 0.16);
      outlinePixelV2(x + 2, y + 4, w - 4, h - 8, '#744d34');
      fillPixelV2(x + 4, y + 6, w - 8, h - 12, '#be8458');
      fillPixelV2(x + 10, y + 10, w - 20, 4, '#f7d783');
      fillPixelV2(x + w / 2 - 3, y + h / 2 - 3, 6, 6, '#ff7ab5');
      return;
    }

    if (obj.kind === 'partitionGold') {
      drawSoftShadow(x + 3, y + h - 4, w - 6, 5, 0.16);
      fillPixelV2(x + 10, y, w - 20, h, '#8f5a3f');
      fillPixelV2(x + 3, y + 4, w - 6, 6, '#f5ce79');
      fillPixelV2(x + 3, y + h - 10, w - 6, 6, '#f5ce79');
      fillPixelV2(x + 5, y + 12, w - 10, h - 24, '#8b62d5');
      fillPixelV2(x + 8, y + 16, w - 16, h - 32, '#c98aff');
      return;
    }

    if (obj.kind === 'wifeCanopyBedDeluxe') {
      drawSoftShadow(x + 4, y + h - 4, w - 8, 6, 0.18);
      fillPixelV2(x + 4, y + 2, 4, h - 6, '#8f5a3f');
      fillPixelV2(x + w - 8, y + 2, 4, h - 6, '#8f5a3f');
      outlinePixelV2(x + 4, y + 2, w - 8, 10, '#6d3d89');
      fillPixelV2(x + 8, y + 5, w - 16, 6, '#c98aff');
      outlinePixelV2(x + 8, y + 18, w - 16, h - 22, '#71476c');
      fillPixelV2(x + 12, y + 22, w - 24, 10, '#fff1cf');
      fillPixelV2(x + 12, y + 34, w - 24, h - 40, '#b685ff');
      fillPixelV2(x + 14, y + 24, 9, 6, '#f5ce79');
      fillPixelV2(x + w - 23, y + 24, 9, 6, '#f5ce79');
      return;
    }

    if (obj.kind === 'vanityTableDeluxe') {
      drawSoftShadow(x + 4, y + h - 4, w - 8, 5, 0.18);
      outlinePixelV2(x + 2, y + 18, w - 4, h - 20, '#8f5a3f');
      fillPixelV2(x + 8, y + 22, w - 16, 9, '#d99b67');
      outlinePixelV2(x + 18, y + 2, w - 36, 18, '#6d3d89');
      fillPixelV2(x + 22, y + 6, w - 44, 10, '#bde8ff');
      fillPixelV2(x + 10, y + 25, 6, 5, '#ff7ab5');
      fillPixelV2(x + 19, y + 24, 6, 6, '#fff264');
      fillPixelV2(x + 28, y + 24, 6, 6, '#55e8ff');
      return;
    }

    return prevDrawFurnitureUltra(obj);
  };

  const prevBackdropUltra = drawInteriorRoomBackdropV2;
  drawInteriorRoomBackdropV2 = function drawInteriorRoomBackdropUltraRealistic(scene) {
    prevBackdropUltra(scene);
    if (scene !== 'home') return;

    // piso de madeira com brilho suave
    fillPixelV2(1 * TILE, 1 * TILE, 28 * TILE, 15 * TILE, 'rgba(255,245,220,0.02)');

    // moldura de parede superior
    fillPixelV2(1 * TILE, 1 * TILE, 28 * TILE, 1 * TILE, 'rgba(85,58,44,0.16)');
    fillPixelV2(1 * TILE, 2 * TILE, 28 * TILE, 4, 'rgba(255,255,255,0.05)');

    // destaque da sala principal
    fillPixelV2(2 * TILE, 6 * TILE, 10 * TILE, 6 * TILE, 'rgba(255,214,170,0.05)');
    // destaque da cozinha
    fillPixelV2(12 * TILE, 5 * TILE, 6 * TILE, 8 * TILE, 'rgba(160,210,255,0.04)');
    // destaque da suite
    fillPixelV2(20 * TILE, 2 * TILE, 8 * TILE, 13 * TILE, 'rgba(188,142,244,0.06)');

    // passadeira de entrada
    fillPixelV2(13 * TILE, 14 * TILE, 4 * TILE, 3 * TILE, 'rgba(255,242,100,0.05)');
  };
})();

/* ==================================================
   Patch extra 5: interior da casa inspirado na imagem de referencia
   Objetivo: deixar aconchegante, rico em detalhes e leve.
   ================================================== */
(function homeReferenceLitePatch() {
  if (typeof window !== 'undefined' && window.ETERNAL_RIFT_HOME_REFERENCE_LITE_PATCH) return;
  if (typeof window !== 'undefined') window.ETERNAL_RIFT_HOME_REFERENCE_LITE_PATCH = true;

  function rebuildHomeInspiredByReference() {
    homeObjects.length = 0;

    homeObjects.push(
      // limites e saida
      block(0, 0, HOME_COLS, 1),
      block(0, 0, 1, HOME_ROWS),
      block(HOME_COLS - 1, 0, 1, HOME_ROWS),
      block(0, HOME_ROWS - 1, 14, 1),
      block(16, HOME_ROWS - 1, 14, 1),
      sign(14, 17, 'Porta de saida: caminhe para baixo para voltar para a vila.'),

      // janelas e iluminacao quente superiores
      furnitureV2('ref-window-a', 4, 2, 'window', false, 2, 1),
      furnitureV2('ref-window-b', 8, 2, 'window', false, 2, 1),
      furnitureV2('ref-window-c', 22, 2, 'window', false, 2, 1),
      furnitureV2('ref-window-d', 25, 2, 'window', false, 2, 1),
      furnitureV2('ref-wall-lamp-a', 2, 2, 'wallLampWarm', false, 1, 1),
      furnitureV2('ref-wall-lamp-b', 11, 2, 'wallLampWarm', false, 1, 1),
      furnitureV2('ref-wall-lamp-c', 20, 2, 'wallLampWarm', false, 1, 1),
      furnitureV2('ref-wall-lamp-d', 28, 2, 'wallLampWarm', false, 1, 1),

      // lado esquerdo - escritorio/leitura
      furnitureV2('ref-bookshelf-left', 2, 2, 'cozyBookshelf', true, 2, 3),
      furnitureV2('ref-desk', 5, 3, 'writingDesk', true, 3, 2),
      furnitureV2('ref-stool-a', 5, 5, 'stoolRound', true, 1, 1),
      furnitureV2('ref-stool-b', 8, 5, 'stoolRound', true, 1, 1),
      furnitureV2('ref-painting', 11, 5, 'paintingWarm', false, 3, 1),

      // sala principal central
      furnitureV2('ref-rug-main', 4, 11, 'cozyRugRed', false, 10, 5),
      furnitureV2('ref-low-table', 7, 12, 'lowTableMeal', true, 3, 2),
      furnitureV2('ref-wardrobe-left', 2, 13, 'wardrobeDark', true, 2, 3),
      furnitureV2('ref-storage-left', 14, 12, 'sideCabinet', true, 1, 1),
      furnitureV2('ref-plant-left', 2, 16, 'pottedPlantTall', true, 1, 1),
      furnitureV2('ref-plant-mid', 14, 15, 'pottedPlantTall', true, 1, 1),

      // colunas / divisorias centrais para separar ambientes
      furnitureV2('ref-pillar-a', 18, 3, 'roomPillar', true, 1, 4),
      furnitureV2('ref-pillar-b', 18, 8, 'roomPillar', true, 1, 5),
      furnitureV2('ref-divider-top', 19, 3, 'roomDividerBeam', true, 1, 4),
      furnitureV2('ref-divider-bottom', 19, 9, 'roomDividerBeam', true, 1, 4),

      // dormitorio superior direito - 2 camas
      furnitureV2('ref-bed-top-a', 21, 3, 'cozyBedPurple', true, 3, 2),
      furnitureV2('ref-bed-top-b', 25, 3, 'cozyBedPurple', true, 3, 2),
      furnitureV2('ref-bed-top-rug', 21, 5, 'cozyRugPurple', false, 7, 1),
      furnitureV2('ref-side-table-top', 28, 4, 'sideCabinet', true, 1, 1),
      furnitureV2('ref-bed-plant-top', 28, 3, 'pottedPlantTall', true, 1, 1),

      // dormitorio inferior direito - 2 camas
      furnitureV2('ref-bed-bottom-a', 21, 9, 'cozyBedPurple', true, 3, 2),
      furnitureV2('ref-bed-bottom-b', 25, 9, 'cozyBedPurple', true, 3, 2),
      furnitureV2('ref-bed-bottom-rug', 21, 11, 'cozyRugPurple', false, 7, 1),

      // area social direita inferior
      furnitureV2('ref-console', 21, 13, 'dresserCabinet', true, 4, 2),
      furnitureV2('ref-trunk', 26, 13, 'sideCabinet', true, 1, 1),
      furnitureV2('ref-blue-rug', 20, 14, 'cozyRugBlue', false, 5, 3),
      furnitureV2('ref-daybed', 22, 16, 'daybedRed', true, 5, 2),
      furnitureV2('ref-wardrobe-right', 28, 14, 'wardrobeDark', true, 1, 3),
      furnitureV2('ref-room-plant', 20, 16, 'pottedPlantTall', true, 1, 1)
    );
  }

  rebuildHomeInspiredByReference();

  if (currentScene === 'home') {
    objects = homeObjects;
    colliders = objects.filter((obj) => obj.solid);
    interactables = objects.filter((obj) => obj.message);
  }

  const drawFurnitureBeforeReferencePatch = drawFurniture;
  drawFurniture = function drawFurnitureReferencePatch(obj) {
    const x = obj.x;
    const y = obj.y;
    const w = obj.width;
    const h = obj.height;
    const pulse = 0.86 + Math.sin(performance.now() / 320) * 0.10;

    if (obj.kind === 'wallLampWarm') {
      fillPixelV2(x + 8, y + 2, 16, 18, `rgba(255, 214, 120, ${0.18 * pulse})`);
      outlinePixelV2(x + 12, y + 8, 8, 12, '#6f4a33');
      fillPixelV2(x + 13, y + 9, 6, 7, '#ffcc6d');
      fillPixelV2(x + 14, y + 6, 4, 4, '#fff3c8');
      return;
    }

    if (obj.kind === 'cozyBookshelf') {
      drawSoftShadow(x + 4, y + h - 4, w - 8, 6, 0.20);
      outlinePixelV2(x + 2, y + 2, w - 4, h - 4, '#5a3c2c');
      fillPixelV2(x + 6, y + 6, w - 12, h - 12, '#7e543a');
      fillPixelV2(x + 8, y + 18, w - 16, 4, '#4a3126');
      fillPixelV2(x + 10, y + 8, 6, 12, '#7aa8ff');
      fillPixelV2(x + 18, y + 8, 5, 12, '#d96f6f');
      fillPixelV2(x + 25, y + 8, 5, 12, '#f3d17e');
      fillPixelV2(x + 10, y + 24, 7, 12, '#8cd79f');
      fillPixelV2(x + 19, y + 24, 5, 12, '#c8b8ff');
      fillPixelV2(x + 26, y + 24, 4, 12, '#87d9e8');
      return;
    }

    if (obj.kind === 'writingDesk') {
      drawSoftShadow(x + 6, y + h - 4, w - 12, 6, 0.18);
      outlinePixelV2(x + 2, y + 10, w - 4, h - 12, '#6a4631');
      fillPixelV2(x + 8, y + 14, w - 16, 12, '#a06a46');
      fillPixelV2(x + 16, y + 16, 18, 10, '#f1e4c4');
      fillPixelV2(x + 40, y + 14, 6, 10, '#d2b16d');
      fillPixelV2(x + 41, y + 10, 4, 5, '#fff0b0');
      return;
    }

    if (obj.kind === 'stoolRound') {
      drawSoftShadow(x + 6, y + h - 4, w - 12, 5, 0.16);
      outlinePixelV2(x + 8, y + 10, w - 16, 12, '#734d38');
      fillPixelV2(x + 10, y + 12, w - 20, 8, '#b88158');
      fillPixelV2(x + 12, y + 20, 3, 6, '#734d38');
      fillPixelV2(x + w - 15, y + 20, 3, 6, '#734d38');
      return;
    }

    if (obj.kind === 'paintingWarm') {
      outlinePixelV2(x + 2, y + 4, w - 4, h - 8, '#6d5038');
      fillPixelV2(x + 6, y + 8, w - 12, h - 16, '#d9c7aa');
      fillPixelV2(x + 10, y + 12, 20, 5, '#7ea7c8');
      fillPixelV2(x + 32, y + 14, 14, 6, '#8c6545');
      fillPixelV2(x + 48, y + 10, 20, 8, '#73966d');
      return;
    }

    if (obj.kind === 'cozyRugRed' || obj.kind === 'cozyRugBlue' || obj.kind === 'cozyRugPurple') {
      const palette = obj.kind === 'cozyRugBlue'
        ? { base: '#355b77', inner: '#678eb4', accent: '#c9d4e8' }
        : obj.kind === 'cozyRugPurple'
          ? { base: '#5b416e', inner: '#8566a5', accent: '#e1d5f0' }
          : { base: '#6b231f', inner: '#8a342d', accent: '#d3a88b' };
      fillPixelV2(x, y, w, h, palette.base);
      fillPixelV2(x + 4, y + 4, w - 8, h - 8, palette.inner);
      fillPixelV2(x + 10, y + 10, w - 20, h - 20, 'rgba(0,0,0,0.10)');
      fillPixelV2(x + Math.max(8, w / 2 - 14), y + Math.max(8, h / 2 - 2), 28, 4, palette.accent);
      fillPixelV2(x + 8, y + 8, 8, 4, 'rgba(255,255,255,0.14)');
      fillPixelV2(x + w - 16, y + h - 12, 8, 4, 'rgba(0,0,0,0.16)');
      return;
    }

    if (obj.kind === 'lowTableMeal') {
      drawSoftShadow(x + 8, y + h - 4, w - 16, 6, 0.18);
      outlinePixelV2(x + 4, y + 8, w - 8, h - 12, '#6e4933');
      fillPixelV2(x + 10, y + 12, w - 20, h - 20, '#8d5d3f');
      fillPixelV2(x + 26, y + 16, 12, 8, '#d9a05a');
      fillPixelV2(x + 42, y + 15, 6, 10, '#fff1b2');
      fillPixelV2(x + 43, y + 11, 4, 5, '#fff9dd');
      fillPixelV2(x + 17, y + 15, 6, 6, '#7fb260');
      return;
    }

    if (obj.kind === 'wardrobeDark') {
      drawSoftShadow(x + 4, y + h - 4, w - 8, 6, 0.20);
      outlinePixelV2(x + 2, y + 2, w - 4, h - 4, '#553826');
      fillPixelV2(x + 6, y + 6, w - 12, h - 12, '#7c533b');
      fillPixelV2(x + w / 2 - 2, y + 8, 4, h - 16, '#5c3d2c');
      fillPixelV2(x + 12, y + h / 2, 3, 5, '#e5c36b');
      fillPixelV2(x + w - 15, y + h / 2, 3, 5, '#e5c36b');
      return;
    }

    if (obj.kind === 'pottedPlantTall') {
      drawSoftShadow(x + 8, y + h - 4, 16, 5, 0.14);
      outlinePixelV2(x + 8, y + h - 14, 16, 12, '#7e4c3a');
      fillPixelV2(x + 10, y + h - 12, 12, 8, '#a8634a');
      fillPixelV2(x + 15, y + 8, 4, h - 24, '#41744c');
      fillPixelV2(x + 8, y + 6, 12, 10, '#71b77f');
      fillPixelV2(x + 16, y + 2, 12, 10, '#8ad08a');
      fillPixelV2(x + 6, y + 16, 12, 10, '#5e9868');
      return;
    }

    if (obj.kind === 'roomPillar') {
      outlinePixelV2(x + 10, y, w - 20, h, '#5a3b2b');
      fillPixelV2(x + 13, y + 4, w - 26, h - 8, '#8d5f45');
      fillPixelV2(x + 6, y + 2, w - 12, 5, '#b38360');
      fillPixelV2(x + 6, y + h - 7, w - 12, 5, '#6a4631');
      return;
    }

    if (obj.kind === 'roomDividerBeam') {
      fillPixelV2(x + 10, y, w - 20, h, '#4f3427');
      fillPixelV2(x + 8, y + 8, w - 16, h - 16, '#6f4a35');
      return;
    }

    if (obj.kind === 'cozyBedPurple') {
      drawSoftShadow(x + 4, y + h - 4, w - 8, 6, 0.20);
      outlinePixelV2(x + 4, y + 8, w - 8, h - 10, '#553b2b');
      fillPixelV2(x + 10, y + 12, w - 20, 12, '#f4efe5');
      fillPixelV2(x + 10, y + 24, w - 20, h - 30, '#8562a0');
      fillPixelV2(x + 12, y + 14, 14, 6, '#ffffff');
      fillPixelV2(x + w - 26, y + 14, 14, 6, '#ece8e1');
      fillPixelV2(x + 10, y + h - 10, w - 20, 4, '#6c4d86');
      return;
    }

    if (obj.kind === 'sideCabinet') {
      drawSoftShadow(x + 6, y + h - 4, w - 12, 6, 0.18);
      outlinePixelV2(x + 4, y + 10, w - 8, h - 12, '#6a4732');
      fillPixelV2(x + 8, y + 14, w - 16, h - 20, '#a06c4a');
      fillPixelV2(x + w / 2 - 2, y + 18, 4, 4, '#e5c36b');
      return;
    }

    if (obj.kind === 'dresserCabinet') {
      drawSoftShadow(x + 4, y + h - 4, w - 8, 6, 0.18);
      outlinePixelV2(x + 2, y + 10, w - 4, h - 12, '#6a4834');
      fillPixelV2(x + 8, y + 14, w - 16, h - 22, '#946245');
      fillPixelV2(x + 8, y + 24, w - 16, 3, '#6d4631');
      fillPixelV2(x + 14, y + 18, 3, 3, '#e2bf69');
      fillPixelV2(x + 34, y + 18, 3, 3, '#e2bf69');
      fillPixelV2(x + 54, y + 18, 3, 3, '#e2bf69');
      fillPixelV2(x + 74, y + 18, 3, 3, '#e2bf69');
      fillPixelV2(x + 10, y + 12, 14, 6, '#b98464');
      fillPixelV2(x + 28, y + 12, 12, 6, '#f0e1c0');
      fillPixelV2(x + 44, y + 12, 8, 6, '#9a72d8');
      return;
    }

    if (obj.kind === 'daybedRed') {
      drawSoftShadow(x + 6, y + h - 4, w - 12, 7, 0.18);
      outlinePixelV2(x + 2, y + 8, w - 4, h - 12, '#6c402f');
      fillPixelV2(x + 8, y + 12, w - 16, h - 20, '#a56a46');
      fillPixelV2(x + 10, y + 14, w - 20, h - 26, '#8a342d');
      fillPixelV2(x + w - 20, y + 14, 12, h - 26, '#ece7dc');
      fillPixelV2(x + 12, y + 16, w - 28, 4, 'rgba(255,255,255,0.10)');
      return;
    }

    return drawFurnitureBeforeReferencePatch(obj);
  };

  const drawInteriorBackdropBeforeReferencePatch = drawInteriorRoomBackdropV2;
  drawInteriorRoomBackdropV2 = function drawInteriorBackdropReferencePatch(scene) {
    drawInteriorBackdropBeforeReferencePatch(scene);
    if (scene !== 'home') return;

    // brilho quente no topo, inspirado na imagem de referencia, sem usar texturas pesadas.
    fillPixelV2(2 * TILE, 2 * TILE, 27 * TILE, 2, 'rgba(255, 240, 200, 0.16)');
    fillPixelV2(2 * TILE, 3 * TILE, 27 * TILE, 2, 'rgba(70, 46, 34, 0.18)');
    fillPixelV2(2 * TILE, 5 * TILE, 15 * TILE, 3, 'rgba(255, 216, 140, 0.06)');
    fillPixelV2(20 * TILE, 5 * TILE, 8 * TILE, 3, 'rgba(255, 216, 140, 0.07)');

    // zonas dos quartos direitos.
    fillPixelV2(20 * TILE, 3 * TILE, 9 * TILE, 3 * TILE, 'rgba(80, 55, 86, 0.08)');
    fillPixelV2(20 * TILE, 9 * TILE, 9 * TILE, 3 * TILE, 'rgba(80, 55, 86, 0.08)');

    // sombra suave de divisao.
    fillPixelV2(18 * TILE, 2 * TILE, 2, 14 * TILE, 'rgba(40, 25, 18, 0.26)');

    // brilho do tapete e da area de estar.
    fillPixelV2(4 * TILE, 11 * TILE, 10 * TILE, 5 * TILE, 'rgba(130, 45, 36, 0.06)');
    fillPixelV2(20 * TILE, 14 * TILE, 5 * TILE, 3 * TILE, 'rgba(53, 91, 119, 0.07)');
  };
})();

/* ==================================================
   Patch extra 6: tapetes por baixo do jogador + moveis interativos
   - Tapete volta a ser piso decorativo: jogador anda POR CIMA dele.
   - Moveis ganham interacoes de vida real.
   - Cama das esposas permite descansar com a esposa ativa.
   ================================================== */
(function homeInteractiveRealLifePatch() {
  if (typeof window !== 'undefined' && window.ETERNAL_RIFT_HOME_INTERACTIVE_REAL_LIFE_PATCH) return;
  if (typeof window !== 'undefined') window.ETERNAL_RIFT_HOME_INTERACTIVE_REAL_LIFE_PATCH = true;

  const WIFE_NAME_BY_ID = {
    selene: 'Selene', nyra: 'Nyra', lilith: 'Lilith', yumi: 'Yumi', mika: 'Mika', violet: 'Violet', aurora: 'Aurora'
  };

  function getHomeState() {
    if (!questBook.homeLife) {
      questBook.homeLife = {
        lightsOn: true,
        windowOpen: false,
        outfit: 0,
        sleepCount: 0,
        wifeSleepCount: 0,
        plantsWatered: 0,
        chestOpened: false,
        lastCookAt: 0,
        lastMealAt: 0,
        lastStudyAt: 0,
        lastReadAt: 0,
        lastVanityAt: 0
      };
    }
    return questBook.homeLife;
  }

  function activeWifeId() {
    return questBook?.wives?.activeId || 'selene';
  }

  function activeWifeName() {
    return WIFE_NAME_BY_ID[activeWifeId()] || 'sua esposa';
  }

  function improveActiveWifeAffection(amount = 1) {
    const id = activeWifeId();
    if (!questBook.wives) return;
    if (!questBook.wives.wives) questBook.wives.wives = {};
    if (!questBook.wives.wives[id]) questBook.wives.wives[id] = { married: true, affection: 1, talks: 0 };
    const current = Number(questBook.wives.wives[id].affection || 1);
    questBook.wives.wives[id].affection = Math.max(1, Math.min(100, current + amount));
  }

  function healPlayerSmall(hp = 1, mana = 1) {
    if (typeof player !== 'object') return;
    player.health = Math.min(player.maxHealth || player.health, (player.health || 0) + hp);
    player.mana = Math.min(player.maxMana || player.mana, (player.mana || 0) + mana);
    if (typeof updateHud === 'function') updateHud();
  }

  function fullRestPlayer() {
    player.health = player.maxHealth;
    player.mana = player.maxMana;
    if (player.oxygen !== undefined && player.maxOxygen !== undefined) player.oxygen = player.maxOxygen;
    if (typeof updateHud === 'function') updateHud();
  }

  function f(id, tileX, tileY, kind, solid, widthTiles = 1, heightTiles = 1, message = '', action = '') {
    const obj = furnitureV2(id, tileX, tileY, kind, solid, widthTiles, heightTiles, message);
    obj.homeAction = action || kind;
    obj.homeInteractive = true;
    return obj;
  }

  function resetHomeMapToWoodOnly() {
    if (!Array.isArray(homeMap)) return;
    for (let y = 0; y < HOME_ROWS; y++) {
      for (let x = 0; x < HOME_COLS; x++) homeMap[y][x] = 'I';
    }
    fillHomeRect(homeMap, 0, 0, HOME_COLS, 1, 'B');
    fillHomeRect(homeMap, 0, HOME_ROWS - 1, HOME_COLS, 1, 'B');
    fillHomeRect(homeMap, 0, 0, 1, HOME_ROWS, 'B');
    fillHomeRect(homeMap, HOME_COLS - 1, 0, 1, HOME_ROWS, 'B');
    fillHomeRect(homeMap, 14, HOME_ROWS - 1, 2, 1, 'I');
  }

  function rebuildInteractiveHome() {
    resetHomeMapToWoodOnly();
    homeObjects.length = 0;
    homeObjects.push(
      // paredes e saida
      block(0, 0, HOME_COLS, 1), block(0, 0, 1, HOME_ROWS), block(HOME_COLS - 1, 0, 1, HOME_ROWS),
      block(0, HOME_ROWS - 1, 14, 1), block(16, HOME_ROWS - 1, 14, 1),
      sign(14, 17, 'Porta de saida: caminhe para baixo para voltar para a vila.'),

      // parede superior, janelas e luzes
      f('life-window-a', 4, 2, 'windowLife', false, 2, 1, 'Janela: pressione E para abrir ou fechar e deixar o ar circular.', 'window'),
      f('life-window-b', 9, 2, 'windowLife', false, 2, 1, 'Janela: pressione E para observar a vila la fora.', 'window'),
      f('life-window-c', 22, 2, 'windowLife', false, 2, 1, 'Janela: pressione E para abrir ou fechar.', 'window'),
      f('life-window-d', 25, 2, 'windowLife', false, 2, 1, 'Janela: pressione E para olhar a noite e as lanternas da vila.', 'window'),
      f('life-lamp-a', 2, 2, 'wallLampWarmLife', false, 1, 1, 'Luminaria: pressione E para ligar ou desligar as luzes da casa.', 'lamp'),
      f('life-lamp-b', 12, 2, 'wallLampWarmLife', false, 1, 1, 'Luminaria: pressione E para ajustar a luz quente.', 'lamp'),
      f('life-lamp-c', 20, 2, 'wallLampWarmLife', false, 1, 1, 'Luminaria: pressione E para controlar a iluminacao.', 'lamp'),
      f('life-lamp-d', 28, 2, 'wallLampWarmLife', false, 1, 1, 'Luminaria: pressione E para ligar ou desligar.', 'lamp'),

      // escritorio e leitura
      f('life-bookshelf-left', 2, 3, 'cozyBookshelfLife', true, 2, 3, 'Estante: pressione E para ler livros, estudar historia e ganhar conhecimento.', 'read'),
      f('life-desk', 5, 3, 'writingDeskLife', true, 3, 2, 'Mesa de estudo: pressione E para estudar, escrever anotacoes e ganhar XP.', 'study'),
      f('life-stool-a', 5, 5, 'stoolRoundLife', true, 1, 1, 'Banquinho: pressione E para sentar um pouco e recuperar mana.', 'sit'),
      f('life-stool-b', 8, 5, 'stoolRoundLife', true, 1, 1, 'Banquinho: pressione E para descansar as pernas.', 'sit'),
      f('life-painting', 11, 5, 'paintingWarmLife', false, 3, 1, 'Quadro: pressione E para admirar a paisagem pintada.', 'painting'),

      // sala principal. Tapetes NAO entram como objetos para nao cobrir o jogador.
      f('life-low-table', 7, 12, 'lowTableMealLife', true, 3, 2, 'Mesa de jantar: pressione E para comer uma refeicao e recuperar energia.', 'eat'),
      f('life-wardrobe-left', 2, 13, 'wardrobeDarkLife', true, 2, 3, 'Guarda-roupa: pressione E para trocar o visual do personagem.', 'wardrobe'),
      f('life-storage-left', 14, 12, 'sideCabinetLife', true, 1, 1, 'Armario pequeno: pressione E para organizar itens e verificar suprimentos.', 'cabinet'),
      f('life-plant-left', 2, 16, 'pottedPlantTallLife', true, 1, 1, 'Planta: pressione E para regar e deixar a casa mais viva.', 'plant'),
      f('life-plant-mid', 14, 15, 'pottedPlantTallLife', true, 1, 1, 'Planta: pressione E para cuidar dela.', 'plant'),
      f('life-chest', 4, 14, 'homeChestLife', true, 2, 1, 'Bau de casa: pressione E para abrir e pegar suprimentos guardados.', 'homeChest'),

      // divisorias centrais
      f('life-pillar-a', 18, 3, 'roomPillarLife', true, 1, 4, 'Pilar de madeira: estrutura principal da casa.', 'look'),
      f('life-pillar-b', 18, 8, 'roomPillarLife', true, 1, 5, 'Pilar de madeira: divide a sala e os quartos.', 'look'),
      f('life-divider-top', 19, 3, 'roomDividerBeamLife', true, 1, 4, 'Divisoria: separa a area social do quarto das esposas.', 'look'),
      f('life-divider-bottom', 19, 9, 'roomDividerBeamLife', true, 1, 4, 'Divisoria: deixa a casa organizada e realista.', 'look'),

      // cozinha e utilidades
      f('life-kitchen-counter', 12, 6, 'kitchenCounterLife', true, 4, 1, 'Balcao da cozinha: pressione E para preparar comida.', 'cook'),
      f('life-sink', 14, 7, 'kitchenSinkLife', true, 2, 1, 'Pia: pressione E para lavar as maos e limpar os equipamentos.', 'sink'),
      f('life-stove', 16, 7, 'stoveDeluxeLife', true, 2, 2, 'Fogao: pressione E para cozinhar uma refeicao quente.', 'cook'),
      f('life-dining-table', 12, 9, 'diningTableLife', true, 4, 2, 'Mesa de refeicao: pressione E para comer e recuperar vida/mana.', 'eat'),
      f('life-chair-a', 12, 8, 'chairLife', true, 1, 1, 'Cadeira: pressione E para sentar.', 'sit'),
      f('life-chair-b', 16, 8, 'chairLife', true, 1, 1, 'Cadeira: pressione E para sentar.', 'sit'),
      f('life-chair-c', 12, 11, 'chairLife', true, 1, 1, 'Cadeira: pressione E para sentar.', 'sit'),
      f('life-chair-d', 16, 11, 'chairLife', true, 1, 1, 'Cadeira: pressione E para sentar.', 'sit'),

      // quarto das esposas / area direita
      f('life-bed-wife-a', 21, 3, 'cozyBedPurpleLife', true, 3, 2, 'Cama das esposas: pressione E para dormir ao lado da esposa ativa.', 'sleepWife'),
      f('life-bed-wife-b', 25, 3, 'cozyBedPurpleLife', true, 3, 2, 'Cama das esposas: pressione E para descansar com sua esposa.', 'sleepWife'),
      f('life-bed-wife-c', 21, 9, 'cozyBedPurpleLife', true, 3, 2, 'Cama das esposas: pressione E para dormir com sua esposa ativa.', 'sleepWife'),
      f('life-bed-wife-d', 25, 9, 'cozyBedPurpleLife', true, 3, 2, 'Cama das esposas: pressione E para descansar ao lado dela.', 'sleepWife'),
      f('life-side-table-top', 28, 4, 'sideCabinetLife', true, 1, 1, 'Criado-mudo: pressione E para acender a vela e guardar pequenos itens.', 'cabinet'),
      f('life-bed-plant-top', 28, 3, 'pottedPlantTallLife', true, 1, 1, 'Planta do quarto: pressione E para regar.', 'plant'),
      f('life-console', 21, 13, 'dresserCabinetLife', true, 4, 2, 'Comoda: pressione E para arrumar cartas, joias e presentes.', 'dresser'),
      f('life-trunk', 26, 13, 'sideCabinetLife', true, 1, 1, 'Baul pequeno: pressione E para conferir lembrancas das esposas.', 'cabinet'),
      f('life-daybed', 22, 16, 'daybedRedLife', true, 5, 2, 'Cama principal: pressione E para dormir e recuperar tudo.', 'sleep'),
      f('life-wardrobe-right', 28, 14, 'wardrobeDarkLife', true, 1, 3, 'Guarda-roupa das esposas: pressione E para organizar roupas.', 'wardrobe'),
      f('life-room-plant', 20, 16, 'pottedPlantTallLife', true, 1, 1, 'Planta do quarto: pressione E para cuidar.', 'plant'),
      f('life-vanity', 24, 14, 'vanityTableLife', true, 2, 2, 'Penteadeira: pressione E para preparar um presente carinhoso para a esposa ativa.', 'vanity')
    );
  }

  rebuildInteractiveHome();
  if (currentScene === 'home') {
    objects = homeObjects;
    colliders = objects.filter((obj) => obj.solid);
    interactables = objects.filter((obj) => obj.message);
  }

  function homeCooldownReady(key, ms) {
    const state = getHomeState();
    const now = performance.now ? performance.now() : Date.now();
    const last = Number(state[key] || 0);
    if (now - last < ms) return false;
    state[key] = now;
    return true;
  }

  function homeActionMessage(obj) {
    const state = getHomeState();
    const action = obj.homeAction || obj.kind;
    if (action === 'sleep') {
      state.sleepCount += 1;
      fullRestPlayer();
      playSound?.('heal');
      return 'Voce dormiu na cama principal. Vida, mana e oxigenio foram recuperados. O personagem acordou pronto para continuar a aventura.';
    }
    if (action === 'sleepWife') {
      const wife = activeWifeName();
      state.wifeSleepCount += 1;
      improveActiveWifeAffection(3);
      fullRestPlayer();
      playSound?.('heal');
      if (typeof spawnFloatingText === 'function') spawnFloatingText(`♥ ${wife}`, player.x + 8, player.y - 22, '#ff7ab5');
      return `Voce descansou ao lado de ${wife}. Vida e mana recuperadas. Afinidade com ${wife} aumentou +3. Um descanso de verdade, sem travar o jogo e sem baguncar a casa.`;
    }
    if (action === 'cook') {
      const ready = homeCooldownReady('lastCookAt', 25000);
      healPlayerSmall(1, 2);
      if (ready && inventory) inventory.pocoes = Number(inventory.pocoes || 0) + 1;
      renderInventory?.();
      updateHud?.();
      return ready
        ? 'Voce cozinhou uma refeicao quente. Recuperou energia e guardou 1 pocao de comida preparada.'
        : 'Voce mexeu na cozinha e recuperou um pouco de energia. Ainda tem comida pronta, entao nao ganhou outra pocao agora.';
    }
    if (action === 'eat') {
      homeCooldownReady('lastMealAt', 12000);
      healPlayerSmall(2, 2);
      playSound?.('heal');
      return 'Voce comeu uma refeicao simples na mesa. Vida +2 e mana +2.';
    }
    if (action === 'study') {
      if (homeCooldownReady('lastStudyAt', 30000)) {
        awardXp?.(35, 'Estudo em casa');
        return 'Voce estudou na mesa, escreveu anotacoes e ganhou 35 XP. A mente tambem precisa de treino.';
      }
      return 'Voce revisou suas anotacoes. Melhor esperar um pouco antes de ganhar XP estudando de novo.';
    }
    if (action === 'read') {
      if (homeCooldownReady('lastReadAt', 30000)) {
        awardXp?.(25, 'Leitura');
        return 'Voce leu um livro antigo da estante e ganhou 25 XP. Algumas paginas falam sobre biomas e chefes secretos.';
      }
      return 'Voce folheou alguns livros. A estante ainda esta cheia de historias, mas o XP de leitura precisa descansar um pouco.';
    }
    if (action === 'homeChest') {
      if (!state.chestOpened) {
        state.chestOpened = true;
        inventory.moedas = Number(inventory.moedas || 0) + 20;
        inventory.flechas = Number(inventory.flechas || 0) + 12;
        inventory.pocoes = Number(inventory.pocoes || 0) + 1;
        renderInventory?.();
        updateHud?.();
        playSound?.('chest');
        return 'Voce abriu o bau de casa e pegou 20 moedas, 12 flechas e 1 pocao. Agora o bau fica como armazenamento decorativo.';
      }
      return 'O bau de casa ja foi aberto. Voce confere os itens guardados e deixa tudo organizado.';
    }
    if (action === 'wardrobe') {
      state.outfit = (Number(state.outfit || 0) + 1) % 4;
      showHudToast?.(`Roupa ${state.outfit + 1} equipada`);
      return `Voce trocou o visual no guarda-roupa. Roupa atual: conjunto ${state.outfit + 1}.`;
    }
    if (action === 'lamp') {
      state.lightsOn = !state.lightsOn;
      return state.lightsOn ? 'Voce acendeu as luminarias. A casa ficou quente e aconchegante.' : 'Voce apagou parte das luzes. A casa ficou mais calma e escura.';
    }
    if (action === 'window') {
      state.windowOpen = !state.windowOpen;
      return state.windowOpen ? 'Voce abriu a janela. Entrou ar fresco da vila.' : 'Voce fechou a janela. O interior ficou mais silencioso.';
    }
    if (action === 'plant') {
      state.plantsWatered = Number(state.plantsWatered || 0) + 1;
      healPlayerSmall(0, 1);
      return 'Voce regou a planta. A casa ficou mais viva e voce recuperou 1 de mana pela calma do ambiente.';
    }
    if (action === 'sit') {
      healPlayerSmall(0, 1);
      return 'Voce sentou um pouco. Mana +1. As cadeiras agora servem para descansar, nao so enfeitar.';
    }
    if (action === 'sink') {
      return 'Voce lavou as maos, limpou o rosto e organizou os equipamentos. A casa parece mais realista assim.';
    }
    if (action === 'vanity') {
      const wife = activeWifeName();
      improveActiveWifeAffection(1);
      if (homeCooldownReady('lastVanityAt', 20000)) healPlayerSmall(0, 1);
      return `Voce preparou um presente simples na penteadeira para ${wife}. Afinidade +1.`;
    }
    if (action === 'dresser') {
      return 'Voce abriu a comoda, dobrou roupas, guardou cartas e ajeitou pequenos presentes. Tudo ficou arrumado.';
    }
    if (action === 'cabinet') {
      return 'Voce abriu o armario, conferiu suprimentos e fechou tudo com cuidado.';
    }
    if (action === 'painting') {
      return 'Voce observou o quadro. Ele mostra uma paisagem calma, perfeita para lembrar que sua casa e um lugar seguro.';
    }
    return obj.message || 'Voce interagiu com o movel.';
  }

  const getQuestMessageBeforeHomeInteractive = getQuestMessage;
  getQuestMessage = function getQuestMessageHomeInteractive(obj) {
    if (obj?.type === 'furniture' && obj.homeInteractive) return homeActionMessage(obj);
    return getQuestMessageBeforeHomeInteractive(obj);
  };

  const updateInteractionHintBeforeHomeInteractive = updateInteractionHint;
  updateInteractionHint = function updateInteractionHintHomeInteractive() {
    updateInteractionHintBeforeHomeInteractive();
    try {
      const target = findInteraction();
      if (!target || target.type !== 'furniture' || !target.homeInteractive || dialogOpen || shopOpen) return;
      const labelMap = {
        sleep: 'Dormir', sleepWife: 'Dormir com esposa', cook: 'Cozinhar', eat: 'Comer', study: 'Estudar', read: 'Ler',
        homeChest: 'Abrir bau', wardrobe: 'Trocar roupa', lamp: 'Luz', window: 'Janela', plant: 'Regar', sit: 'Sentar',
        vanity: 'Presente', sink: 'Lavar', dresser: 'Arrumar', cabinet: 'Abrir', painting: 'Olhar', look: 'Olhar'
      };
      const label = labelMap[target.homeAction] || 'Usar';
      interactionHint.textContent = `Pressione E para ${label.toLowerCase()}`;
      if (touchContextLabel) touchContextLabel.textContent = label;
    } catch (error) {
      // Dica opcional; nunca quebra o jogo.
    }
  };

  const drawFurnitureBeforeInteractiveHome = drawFurniture;
  drawFurniture = function drawFurnitureInteractiveHome(obj) {
    const x = obj.x, y = obj.y, w = obj.width, h = obj.height;
    const state = getHomeState();
    const pulse = state.lightsOn ? (0.88 + Math.sin(performance.now() / 320) * 0.10) : 0.35;

    if (obj.kind === 'wallLampWarmLife') {
      fillPixelV2(x + 8, y + 2, 16, 18, `rgba(255, 214, 120, ${0.20 * pulse})`);
      outlinePixelV2(x + 12, y + 8, 8, 12, '#6f4a33');
      fillPixelV2(x + 13, y + 9, 6, 7, state.lightsOn ? '#ffcc6d' : '#7a5a3c');
      fillPixelV2(x + 14, y + 6, 4, 4, state.lightsOn ? '#fff3c8' : '#4a3126');
      return;
    }

    if (obj.kind === 'windowLife') {
      outlinePixelV2(x + 4, y + 5, 40, 24, '#5c3d2c');
      fillPixelV2(x + 8, y + 9, 32, 16, state.windowOpen ? '#9fe6ff' : '#73b8e8');
      fillPixelV2(x + 22, y + 7, 3, 20, '#5c3d2c');
      fillPixelV2(x + 7, y + 16, 34, 3, '#5c3d2c');
      if (state.windowOpen) fillPixelV2(x + 40, y + 10, 5, 15, 'rgba(180,240,255,0.35)');
      return;
    }

    if (obj.kind === 'cozyBookshelfLife') {
      drawSoftShadow(x + 4, y + h - 4, w - 8, 6, 0.20);
      outlinePixelV2(x + 2, y + 2, w - 4, h - 4, '#5a3c2c');
      fillPixelV2(x + 6, y + 6, w - 12, h - 12, '#7e543a');
      for (let row = 0; row < 2; row++) {
        const sy = y + 10 + row * 21;
        fillPixelV2(x + 8, sy + 12, w - 16, 3, '#4a3126');
        const colors = ['#7aa8ff', '#d96f6f', '#f3d17e', '#8cd79f', '#c8b8ff'];
        for (let i = 0; i < 5; i++) fillPixelV2(x + 10 + i * 6, sy, 4, 12, colors[(i + row) % colors.length]);
      }
      return;
    }

    if (obj.kind === 'writingDeskLife') {
      drawSoftShadow(x + 6, y + h - 4, w - 12, 6, 0.18);
      outlinePixelV2(x + 2, y + 10, w - 4, h - 12, '#6a4631');
      fillPixelV2(x + 8, y + 14, w - 16, 12, '#a06a46');
      fillPixelV2(x + 16, y + 16, 18, 10, '#f1e4c4');
      fillPixelV2(x + 40, y + 14, 6, 10, '#d2b16d');
      fillPixelV2(x + 41, y + 10, 4, 5, state.lightsOn ? '#fff0b0' : '#715a37');
      return;
    }

    if (obj.kind === 'stoolRoundLife' || obj.kind === 'chairLife') {
      drawSoftShadow(x + 6, y + h - 4, w - 12, 5, 0.16);
      outlinePixelV2(x + 7, y + 8, w - 14, 14, '#734d38');
      fillPixelV2(x + 10, y + 11, w - 20, 8, '#b88158');
      fillPixelV2(x + 12, y + 20, 3, 7, '#734d38');
      fillPixelV2(x + w - 15, y + 20, 3, 7, '#734d38');
      return;
    }

    if (obj.kind === 'paintingWarmLife') {
      outlinePixelV2(x + 2, y + 4, w - 4, h - 8, '#6d5038');
      fillPixelV2(x + 6, y + 8, w - 12, h - 16, '#d9c7aa');
      fillPixelV2(x + 10, y + 12, 20, 5, '#7ea7c8');
      fillPixelV2(x + 32, y + 14, 14, 6, '#8c6545');
      fillPixelV2(x + 48, y + 10, 20, 8, '#73966d');
      return;
    }

    if (obj.kind === 'lowTableMealLife' || obj.kind === 'diningTableLife') {
      drawSoftShadow(x + 8, y + h - 4, w - 16, 6, 0.18);
      outlinePixelV2(x + 4, y + 8, w - 8, h - 12, '#6e4933');
      fillPixelV2(x + 10, y + 12, w - 20, h - 20, '#8d5d3f');
      fillPixelV2(x + Math.max(18, w / 2 - 6), y + 16, 12, 8, '#d9a05a');
      fillPixelV2(x + Math.max(34, w / 2 + 10), y + 15, 6, 10, '#fff1b2');
      fillPixelV2(x + Math.max(35, w / 2 + 11), y + 11, 4, 5, state.lightsOn ? '#fff9dd' : '#7b5d2f');
      fillPixelV2(x + 17, y + 15, 6, 6, '#7fb260');
      return;
    }

    if (obj.kind === 'wardrobeDarkLife') {
      drawSoftShadow(x + 4, y + h - 4, w - 8, 6, 0.20);
      outlinePixelV2(x + 2, y + 2, w - 4, h - 4, '#553826');
      fillPixelV2(x + 6, y + 6, w - 12, h - 12, '#7c533b');
      fillPixelV2(x + w / 2 - 2, y + 8, 4, h - 16, '#5c3d2c');
      fillPixelV2(x + 12, y + h / 2, 3, 5, '#e5c36b');
      fillPixelV2(x + w - 15, y + h / 2, 3, 5, '#e5c36b');
      return;
    }

    if (obj.kind === 'sideCabinetLife' || obj.kind === 'dresserCabinetLife') {
      drawSoftShadow(x + 4, y + h - 4, w - 8, 6, 0.18);
      outlinePixelV2(x + 2, y + 10, w - 4, h - 12, '#6a4834');
      fillPixelV2(x + 8, y + 14, w - 16, h - 22, '#946245');
      fillPixelV2(x + 8, y + 24, w - 16, 3, '#6d4631');
      fillPixelV2(x + w / 2 - 3, y + 18, 6, 4, '#e2bf69');
      return;
    }

    if (obj.kind === 'pottedPlantTallLife') {
      drawSoftShadow(x + 8, y + h - 4, 16, 5, 0.14);
      outlinePixelV2(x + 8, y + h - 14, 16, 12, '#7e4c3a');
      fillPixelV2(x + 10, y + h - 12, 12, 8, '#a8634a');
      fillPixelV2(x + 15, y + 8, 4, h - 24, '#41744c');
      fillPixelV2(x + 8, y + 6, 12, 10, '#71b77f');
      fillPixelV2(x + 16, y + 2, 12, 10, '#8ad08a');
      fillPixelV2(x + 6, y + 16, 12, 10, '#5e9868');
      return;
    }

    if (obj.kind === 'homeChestLife') {
      drawSoftShadow(x + 5, y + h - 4, w - 10, 6, 0.18);
      outlinePixelV2(x + 4, y + 10, w - 8, h - 12, '#553826');
      fillPixelV2(x + 8, y + 14, w - 16, h - 20, '#90603f');
      fillPixelV2(x + 8, y + 8, w - 16, 8, '#45506e');
      fillPixelV2(x + w / 2 - 4, y + 16, 8, 6, '#e5c36b');
      return;
    }

    if (obj.kind === 'roomPillarLife' || obj.kind === 'roomDividerBeamLife') {
      outlinePixelV2(x + 10, y, w - 20, h, '#5a3b2b');
      fillPixelV2(x + 13, y + 4, w - 26, h - 8, '#8d5f45');
      fillPixelV2(x + 6, y + 2, w - 12, 5, '#b38360');
      fillPixelV2(x + 6, y + h - 7, w - 12, 5, '#6a4631');
      return;
    }

    if (obj.kind === 'kitchenCounterLife' || obj.kind === 'kitchenSinkLife' || obj.kind === 'stoveDeluxeLife') {
      drawSoftShadow(x + 3, y + h - 3, w - 6, 4, 0.14);
      outlinePixelV2(x + 2, y + 6, w - 4, h - 8, '#704d38');
      fillPixelV2(x + 4, y + 8, w - 8, h - 12, obj.kind === 'stoveDeluxeLife' ? '#5e677c' : '#c08a63');
      fillPixelV2(x + 2, y + 2, w - 4, 6, '#d8dfef');
      if (obj.kind === 'kitchenSinkLife') fillPixelV2(x + 10, y + 10, w - 20, h - 18, '#8eb5d8');
      if (obj.kind === 'stoveDeluxeLife') {
        fillPixelV2(x + 8, y + 10, w - 16, 8, '#2e3444');
        fillPixelV2(x + 10, y + 12, 6, 6, '#ff6b3d');
        fillPixelV2(x + w - 16, y + 12, 6, 6, '#fff264');
      }
      return;
    }

    if (obj.kind === 'cozyBedPurpleLife' || obj.kind === 'daybedRedLife') {
      const blanket = obj.kind === 'daybedRedLife' ? '#8a342d' : '#8562a0';
      drawSoftShadow(x + 4, y + h - 4, w - 8, 6, 0.20);
      outlinePixelV2(x + 4, y + 8, w - 8, h - 10, '#553b2b');
      fillPixelV2(x + 10, y + 12, w - 20, 12, '#f4efe5');
      fillPixelV2(x + 10, y + 24, w - 20, h - 30, blanket);
      fillPixelV2(x + 12, y + 14, 14, 6, '#ffffff');
      fillPixelV2(x + w - 26, y + 14, 14, 6, '#ece8e1');
      fillPixelV2(x + 10, y + h - 10, w - 20, 4, '#6c4d86');
      return;
    }

    if (obj.kind === 'vanityTableLife') {
      drawSoftShadow(x + 4, y + h - 4, w - 8, 5, 0.18);
      outlinePixelV2(x + 2, y + 18, w - 4, h - 20, '#8f5a3f');
      fillPixelV2(x + 8, y + 22, w - 16, 9, '#d99b67');
      outlinePixelV2(x + 18, y + 2, w - 36, 18, '#6d3d89');
      fillPixelV2(x + 22, y + 6, w - 44, 10, '#bde8ff');
      fillPixelV2(x + 10, y + 25, 6, 5, '#ff7ab5');
      fillPixelV2(x + 19, y + 24, 6, 6, '#fff264');
      fillPixelV2(x + 28, y + 24, 6, 6, '#55e8ff');
      return;
    }

    return drawFurnitureBeforeInteractiveHome(obj);
  };

  function drawHomeRugBelowPlayer(x, y, w, h, palette) {
    fillPixelV2(x, y, w, h, palette.base);
    fillPixelV2(x + 4, y + 4, w - 8, h - 8, palette.inner);
    fillPixelV2(x + 10, y + 10, w - 20, h - 20, 'rgba(0,0,0,0.10)');
    fillPixelV2(x + Math.max(8, w / 2 - 14), y + Math.max(8, h / 2 - 2), 28, 4, palette.accent);
    fillPixelV2(x + 8, y + 8, 8, 4, 'rgba(255,255,255,0.14)');
    fillPixelV2(x + w - 16, y + h - 12, 8, 4, 'rgba(0,0,0,0.16)');
  }

  const drawInteriorRoomBackdropBeforeInteractiveHome = drawInteriorRoomBackdropV2;
  drawInteriorRoomBackdropV2 = function drawInteriorRoomBackdropInteractiveHome(scene) {
    drawInteriorRoomBackdropBeforeInteractiveHome(scene);
    if (scene !== 'home') return;

    // tapetes desenhados NO CHAO, antes dos objetos e antes do jogador.
    drawHomeRugBelowPlayer(4 * TILE, 11 * TILE, 10 * TILE, 5 * TILE, { base: '#6b231f', inner: '#8a342d', accent: '#d3a88b' });
    drawHomeRugBelowPlayer(20 * TILE, 5 * TILE, 8 * TILE, 1 * TILE, { base: '#5b416e', inner: '#8566a5', accent: '#e1d5f0' });
    drawHomeRugBelowPlayer(20 * TILE, 11 * TILE, 8 * TILE, 1 * TILE, { base: '#5b416e', inner: '#8566a5', accent: '#e1d5f0' });
    drawHomeRugBelowPlayer(20 * TILE, 14 * TILE, 5 * TILE, 3 * TILE, { base: '#355b77', inner: '#678eb4', accent: '#c9d4e8' });

    const state = getHomeState();
    if (!state.lightsOn) fillPixelV2(camera.x, camera.y, canvas.width, canvas.height, 'rgba(15, 10, 18, 0.20)');
    if (state.windowOpen) fillPixelV2(1 * TILE, 2 * TILE, 28 * TILE, 1 * TILE, 'rgba(150, 230, 255, 0.06)');
  };
})();

/* ==================================================
   Patch: exterior da casa do jogador em formato de mansao
   maior, com entrada mais facil e menos objetos visuais
   ================================================== */
(function mansionSpawnExteriorPatch() {
  if (typeof window !== 'undefined' && window.ETERNAL_RIFT_MANSION_SPAWN_PATCH) return;
  if (typeof window !== 'undefined') window.ETERNAL_RIFT_MANSION_SPAWN_PATCH = true;

  const heroHouse = Array.isArray(villageObjects)
    ? villageObjects.find((obj) => obj && obj.type === 'playerHouse')
    : null;
  if (!heroHouse) return;

  heroHouse.title = 'Mansao do Heroi';
  heroHouse.isSpawnHouse = true;
  heroHouse.mansionExterior = true;
  heroHouse.x = 23 * TILE;
  heroHouse.y = 32 * TILE;
  heroHouse.width = TILE * 7;
  heroHouse.height = TILE * 4;

  for (let i = villageObjects.length - 1; i >= 0; i--) {
    const obj = villageObjects[i];
    if (!obj || obj === heroHouse) continue;
    const nearHouse = obj.x >= heroHouse.x - TILE * 2 && obj.x <= heroHouse.x + heroHouse.width + TILE * 2 &&
      obj.y >= heroHouse.y - TILE * 2 && obj.y <= heroHouse.y + heroHouse.height + TILE * 3;
    const removableType = ['sign', 'flower', 'collectible'].includes(obj.type);
    if (obj.spawnUpgradeTag || obj.spawnEpicTag || (nearHouse && removableType)) {
      villageObjects.splice(i, 1);
    }
  }

  const mansionExtras = [
    outdoorDecor(24, 36, 'stonePath', false),
    outdoorDecor(25, 36, 'stonePath', false),
    outdoorDecor(26, 36, 'stonePath', false),
    outdoorDecor(27, 36, 'stonePath', false),
    outdoorDecor(24, 37, 'stonePath', false),
    outdoorDecor(25, 37, 'stonePath', false),
    outdoorDecor(26, 37, 'stonePath', false),
    outdoorDecor(27, 37, 'stonePath', false),
    outdoorDecor(24, 38, 'stonePath', false),
    outdoorDecor(25, 38, 'stonePath', false),
    outdoorDecor(26, 38, 'stonePath', false),
    outdoorDecor(27, 38, 'stonePath', false),
    outdoorDecor(22, 35, 'lampPost', true),
    outdoorDecor(29, 35, 'lampPost', true),
    outdoorDecor(30, 36, 'mailbox', true),
    sign(28, 39, 'Mansao do Heroi: esta e a casa principal e o ponto de spawn do jogador.')
  ];
  for (const obj of mansionExtras) {
    obj.mansionSpawnTag = true;
    villageObjects.push(obj);
  }

  if (currentScene === 'village') {
    objects = villageObjects;
    colliders = objects.filter((obj) => obj.solid);
    interactables = objects.filter((obj) => obj.message);
  }

  const drawPlayerHouseBeforeMansion = drawPlayerHouse;
  drawPlayerHouse = function drawPlayerHouseMansion(obj) {
    if (!obj || !obj.mansionExterior) {
      return drawPlayerHouseBeforeMansion(obj);
    }

    const x = obj.x;
    const y = obj.y;
    const w = obj.width;
    const h = obj.height;
    const mid = x + w / 2;
    const glow = 0.75 + Math.sin(performance.now() / 400) * 0.08;

    drawSoftShadow(x + 10, y + h - 6, w - 20, 14, 0.30);

    // fundacao e paredes
    pixelRect(x + 8, y + 56, w - 16, h - 56, '#5e6676');
    pixelRect(x + 12, y + 60, w - 24, h - 70, '#e2d6bf');
    pixelRect(x + 16, y + h - 22, w - 32, 12, '#a7896a');

    // telhado principal largo
    pixelRect(x - 8, y + 22, w + 16, 18, '#273052');
    pixelRect(x - 2, y + 28, w + 4, 24, '#3f8fe5');
    fillPixelV2(x + 10, y + 32, w - 20, 4, 'rgba(255,255,255,0.18)');

    // topo superior central
    pixelRect(mid - 54, y + 6, 108, 22, '#273052');
    pixelRect(mid - 48, y + 10, 96, 18, '#4ea4ff');

    // janelas grandes
    pixelRect(x + 18, y + 66, 26, 28, '#56b7f4');
    pixelRect(x + 56, y + 66, 26, 28, '#56b7f4');
    pixelRect(x + w - 82, y + 66, 26, 28, '#56b7f4');
    pixelRect(x + w - 44, y + 66, 26, 28, '#56b7f4');
    pixelRect(mid - 13, y + 24, 26, 22, '#56b7f4');

    ctx.fillStyle = '#e6fbff';
    ctx.fillRect(x + 28, y + 72, 6, 6);
    ctx.fillRect(x + 66, y + 72, 6, 6);
    ctx.fillRect(x + w - 72, y + 72, 6, 6);
    ctx.fillRect(x + w - 34, y + 72, 6, 6);
    ctx.fillRect(mid - 4, y + 30, 6, 6);

    ctx.fillStyle = '#273052';
    for (const wx of [x + 30, x + 68, x + w - 70, x + w - 32]) {
      ctx.fillRect(wx, y + 66, 3, 28);
      ctx.fillRect(wx - 10, y + 78, 26, 3);
    }
    ctx.fillRect(mid - 1, y + 24, 3, 22);
    ctx.fillRect(mid - 13, y + 34, 26, 3);

    // entrada principal ampla
    pixelRect(mid - 24, y + h - 54, 48, 44, '#8f5a3f');
    pixelRect(mid - 19, y + h - 49, 38, 34, '#a96d49');
    ctx.fillStyle = '#ffd18b';
    ctx.fillRect(mid + 10, y + h - 32, 4, 4);

    // escadaria larga para facilitar entrada
    pixelRect(mid - 44, y + h - 12, 88, 8, '#8b8f9c');
    pixelRect(mid - 34, y + h - 4, 68, 8, '#c8b18d');
    pixelRect(mid - 22, y + h + 4, 44, 6, '#e5d1ad');

    // colunas frontais
    pixelRect(mid - 54, y + 62, 10, h - 72, '#c8b18d');
    pixelRect(mid + 44, y + 62, 10, h - 72, '#c8b18d');
    pixelRect(mid - 58, y + 58, 18, 8, '#8b8f9c');
    pixelRect(mid + 40, y + 58, 18, 8, '#8b8f9c');

    // placa simples de spawn no topo
    fillPixelV2(mid - 36, y + 48, 72, 12, 'rgba(39,48,82,0.92)');
    outlinePixelV2(mid - 36, y + 48, 72, 12, '#55e8ff');
    fillPixelV2(mid - 24, y + 52, 48, 4, '#fff264');

    // luzes suaves
    fillPixelV2(mid - 68, y + h - 48, 18, 18, `rgba(255, 242, 100, ${0.16 * glow})`);
    fillPixelV2(mid + 50, y + h - 48, 18, 18, `rgba(255, 242, 100, ${0.16 * glow})`);
    outlinePixelV2(mid - 63, y + h - 42, 8, 10, '#fff264');
    outlinePixelV2(mid + 55, y + h - 42, 8, 10, '#fff264');
  };

  const handleMapTransitionsBeforeMansion = handleMapTransitions;
  handleMapTransitions = function handleMapTransitionsMansion() {
    if (currentScene === 'village' && heroHouse) {
      const playerCenter = {
        x: player.x + player.width / 2,
        y: player.y + player.height / 2,
        width: 1,
        height: 1
      };
      const easyDoor = {
        x: heroHouse.x + heroHouse.width / 2 - 60,
        y: heroHouse.y + heroHouse.height - 14,
        width: 120,
        height: 56
      };
      if (rectsOverlap(playerCenter, easyDoor)) {
        enterHome();
        return;
      }
    }
    return handleMapTransitionsBeforeMansion();
  };
})();

/* ==================================================
   Patch seguro: acoes visiveis em casa sem travar o jogo
   - nao usa homeActionMessage interno
   - intercepta moveis antes dos wrappers antigos
   - usa tempo por performance.now, sem trocar o loop principal
   ================================================== */
(function safeHomeActionsNoFreezePatch() {
  if (typeof window !== 'undefined' && window.ETERNAL_RIFT_SAFE_HOME_ACTIONS_PATCH) return;
  if (typeof window !== 'undefined') window.ETERNAL_RIFT_SAFE_HOME_ACTIONS_PATCH = true;

  const SAFE_WIFE_NAMES = {
    selene: 'Selene', nyra: 'Nyra', lilith: 'Lilith', yumi: 'Yumi', mika: 'Mika', violet: 'Violet', aurora: 'Aurora'
  };

  function nowMs() {
    return typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now();
  }

  function safeHomeState() {
    if (!questBook.safeHomeActions || typeof questBook.safeHomeActions !== 'object') {
      questBook.safeHomeActions = { chestOpened: false, outfit: 0, lightsOn: true, windowOpen: false, cooldowns: {} };
    }
    if (!questBook.safeHomeActions.cooldowns || typeof questBook.safeHomeActions.cooldowns !== 'object') {
      questBook.safeHomeActions.cooldowns = {};
    }
    return questBook.safeHomeActions;
  }

  function getActiveWifeNameSafe() {
    const id = questBook.wives?.activeId || 'selene';
    return SAFE_WIFE_NAMES[id] || 'Selene';
  }

  function getActiveWifeIdSafe() {
    return questBook.wives?.activeId || 'selene';
  }

  function addWifeAffectionSafe(amount) {
    const id = getActiveWifeIdSafe();
    if (!questBook.wives || typeof questBook.wives !== 'object') questBook.wives = { activeId: id, wives: {} };
    if (!questBook.wives.wives || typeof questBook.wives.wives !== 'object') questBook.wives.wives = {};
    if (!questBook.wives.wives[id]) questBook.wives.wives[id] = { married: true, affection: 1, talks: 0, giftLevel: 0 };
    const current = Number(questBook.wives.wives[id].affection || 1);
    questBook.wives.wives[id].affection = Math.max(1, Math.min(100, current + amount));
  }

  function healFullSafe() {
    player.health = player.maxHealth || player.health;
    player.mana = player.maxMana || player.mana;
    if (player.maxOxygen !== undefined) player.oxygen = player.maxOxygen;
    if (typeof updateHud === 'function') updateHud();
  }

  function healSmallSafe(hp, mana) {
    if (hp) player.health = Math.min(player.maxHealth || player.health, (player.health || 0) + hp);
    if (mana) player.mana = Math.min(player.maxMana || player.mana, (player.mana || 0) + mana);
    if (typeof updateHud === 'function') updateHud();
  }

  function cooldownReadySafe(key, ms) {
    const state = safeHomeState();
    const t = Date.now();
    const last = Number(state.cooldowns[key] || 0);
    if (t - last < ms) return false;
    state.cooldowns[key] = t;
    return true;
  }

  function startSafeActionVisual(action, obj) {
    const duration = {
      sleep: 2800, sleepWife: 3200, study: 2200, read: 1900, sink: 1800, cook: 1900,
      eat: 1600, sit: 1400, wardrobe: 1300, vanity: 1500, dresser: 1400, cabinet: 1200,
      homeChest: 1500, plant: 1300, lamp: 900, window: 900, painting: 1000, look: 900
    }[action] || 1400;
    player.safeHomeActionVisual = {
      action,
      startAt: nowMs(),
      endAt: nowMs() + duration,
      duration,
      x: obj?.x ?? player.x,
      y: obj?.y ?? player.y,
      w: obj?.width ?? TILE,
      h: obj?.height ?? TILE,
      wife: getActiveWifeNameSafe()
    };
  }

  function safeHomeActionMessage(obj) {
    const action = obj?.homeAction || obj?.kind || 'look';
    const state = safeHomeState();
    const wife = getActiveWifeNameSafe();
    startSafeActionVisual(action, obj);

    if (action === 'sleep') {
      healFullSafe();
      if (typeof playSound === 'function') playSound('heal');
      return 'Voce se deitou na cama principal e descansou ate recuperar as forcas. Vida, mana e oxigenio restaurados.';
    }

    if (action === 'sleepWife') {
      healFullSafe();
      addWifeAffectionSafe(3);
      if (typeof playSound === 'function') playSound('heal');
      if (typeof spawnFloatingText === 'function') spawnFloatingText(`♥ ${wife}`, player.x + 8, player.y - 22, '#ff7ab5');
      return `Voce descansou ao lado de ${wife}. O vinculo entre voces ficou mais forte. Vida e mana recuperadas. Afinidade +3.`;
    }

    if (action === 'sink') {
      return 'Voce lavou as maos, limpou o rosto e tirou a poeira da aventura. A agua fria trouxe uma sensacao de descanso.';
    }

    if (action === 'study') {
      if (cooldownReadySafe('study', 30000)) {
        if (typeof awardXp === 'function') awardXp(35, 'Estudo em casa');
        return 'Voce estudou na mesa, escreveu anotacoes e treinou a mente. Ganhou 35 XP.';
      }
      return 'Voce revisou suas anotacoes. Melhor esperar um pouco antes de ganhar XP estudando de novo.';
    }

    if (action === 'read') {
      if (cooldownReadySafe('read', 30000)) {
        if (typeof awardXp === 'function') awardXp(25, 'Leitura em casa');
        return 'Voce leu um livro antigo da estante e aprendeu mais sobre o mundo. Ganhou 25 XP.';
      }
      return 'Voce folheou alguns livros. A estante ainda guarda muitas historias para outro momento.';
    }

    if (action === 'cook') {
      healSmallSafe(1, 2);
      if (cooldownReadySafe('cook', 25000)) {
        inventory.pocoes = Number(inventory.pocoes || 0) + 1;
        if (typeof renderInventory === 'function') renderInventory();
        if (typeof updateHud === 'function') updateHud();
        return 'Voce cozinhou uma refeicao quente, recuperou energia e guardou 1 porcao como suprimento.';
      }
      return 'Voce mexeu nas panelas e recuperou um pouco de energia. Ainda ha comida pronta na cozinha.';
    }

    if (action === 'eat') {
      healSmallSafe(2, 2);
      if (typeof playSound === 'function') playSound('heal');
      return 'Voce comeu uma refeicao simples na mesa. Vida +2 e mana +2.';
    }

    if (action === 'sit') {
      healSmallSafe(0, 1);
      return 'Voce se sentou por um instante, respirou fundo e recuperou 1 de mana.';
    }

    if (action === 'homeChest') {
      if (!state.chestOpened) {
        state.chestOpened = true;
        inventory.moedas = Number(inventory.moedas || 0) + 20;
        inventory.flechas = Number(inventory.flechas || 0) + 12;
        inventory.pocoes = Number(inventory.pocoes || 0) + 1;
        if (typeof renderInventory === 'function') renderInventory();
        if (typeof updateHud === 'function') updateHud();
        if (typeof playSound === 'function') playSound('chest');
        return 'Voce abriu o bau da casa e encontrou 20 moedas, 12 flechas e 1 suprimento.';
      }
      return 'Voce verificou o bau da casa. Tudo continua bem guardado.';
    }

    if (action === 'wardrobe') {
      state.outfit = (Number(state.outfit || 0) + 1) % 4;
      if (typeof showHudToast === 'function') showHudToast(`Roupa ${state.outfit + 1} equipada`);
      return `Voce abriu o guarda-roupa e trocou o visual. Roupa atual: conjunto ${state.outfit + 1}.`;
    }

    if (action === 'lamp') {
      state.lightsOn = !state.lightsOn;
      return state.lightsOn ? 'Voce acendeu as luminarias. A casa ficou mais quente e acolhedora.' : 'Voce reduziu a luz. A casa ficou calma e silenciosa.';
    }

    if (action === 'window') {
      state.windowOpen = !state.windowOpen;
      return state.windowOpen ? 'Voce abriu a janela e deixou o ar fresco entrar.' : 'Voce fechou a janela e deixou o ambiente mais quieto.';
    }

    if (action === 'plant') {
      healSmallSafe(0, 1);
      return 'Voce regou a planta. O canto da casa ficou mais vivo e voce recuperou 1 de mana.';
    }

    if (action === 'vanity') {
      addWifeAffectionSafe(1);
      return `Voce preparou um pequeno presente para ${wife} na penteadeira. Afinidade +1.`;
    }

    if (action === 'dresser') return 'Voce organizou roupas, cartas e lembrancas na comoda. Tudo ficou arrumado.';
    if (action === 'cabinet') return 'Voce abriu o movel, conferiu os suprimentos e guardou tudo no lugar certo.';
    if (action === 'painting') return 'Voce observou o quadro por alguns instantes e aproveitou a calma da casa.';
    if (action === 'look') return obj?.message || 'Voce observou o movel com atencao.';

    return obj?.message || 'Voce interagiu com o movel.';
  }

  const previousGetQuestMessageSafeActions = getQuestMessage;
  getQuestMessage = function getQuestMessageSafeHomeActions(obj) {
    if (obj && obj.type === 'furniture' && obj.homeInteractive) {
      try { return safeHomeActionMessage(obj); }
      catch (error) { return 'Voce tentou usar o movel, mas ele nao respondeu. O jogo continuou funcionando.'; }
    }
    return previousGetQuestMessageSafeActions(obj);
  };

  const previousUpdateInteractionHintSafeActions = updateInteractionHint;
  updateInteractionHint = function updateInteractionHintSafeHomeActions() {
    previousUpdateInteractionHintSafeActions();
    try {
      const target = findInteraction();
      if (!target || target.type !== 'furniture' || !target.homeInteractive || dialogOpen || shopOpen) return;
      const labels = {
        sleep: 'Dormir', sleepWife: 'Dormir', cook: 'Cozinhar', eat: 'Comer', study: 'Estudar', read: 'Ler',
        homeChest: 'Abrir', wardrobe: 'Trocar', lamp: 'Luz', window: 'Janela', plant: 'Regar', sit: 'Sentar',
        vanity: 'Presente', sink: 'Lavar', dresser: 'Arrumar', cabinet: 'Abrir', painting: 'Olhar', look: 'Olhar'
      };
      const label = labels[target.homeAction] || 'Usar';
      interactionHint.textContent = `Pressione E para ${label.toLowerCase()}`;
      if (touchContextLabel) touchContextLabel.textContent = label;
    } catch (error) {}
  };

  function getSafeVisualAction() {
    const act = player?.safeHomeActionVisual;
    if (!act || currentScene !== 'home' || nowMs() > Number(act.endAt || 0)) {
      if (player?.safeHomeActionVisual && nowMs() > Number(player.safeHomeActionVisual.endAt || 0)) player.safeHomeActionVisual = null;
      return null;
    }
    return act;
  }

  function miniPlayerStand(px, py, facing = 'down') {
    drawSoftShadow(px + 4, py + 24, 18, 5, 0.22);
    outlinePixelV2(px + 6, py + 10, 14, 13, '#2d3d83');
    fillPixelV2(px + 9, py + 12, 8, 3, '#55e8ff');
    fillPixelV2(px + 10, py + 17, 7, 5, '#3f8fe5');
    outlinePixelV2(px + 8, py + 3, 12, 9, '#f4bd8f');
    fillPixelV2(px + 7, py, 14, 4, '#273052');
    fillPixelV2(px + 7, py + 1, 10, 4, '#5ad6e7');
    fillPixelV2(px + 6, py + 12, 3, 7, '#f4bd8f');
    fillPixelV2(px + 19, py + 12, 3, 7, '#f4bd8f');
    fillPixelV2(px + 9, py + 23, 4, 5, '#20263e');
    fillPixelV2(px + 15, py + 23, 4, 5, '#20263e');
    if (facing === 'up') fillPixelV2(px + 11, py + 5, 6, 2, '#20263e');
    else if (facing === 'left') fillPixelV2(px + 10, py + 6, 2, 2, '#20263e');
    else if (facing === 'right') fillPixelV2(px + 16, py + 6, 2, 2, '#20263e');
    else { fillPixelV2(px + 11, py + 6, 2, 2, '#20263e'); fillPixelV2(px + 15, py + 6, 2, 2, '#20263e'); }
  }

  function miniPlayerSit(px, py) {
    miniPlayerStand(px, py, 'down');
    fillPixelV2(px + 9, py + 23, 12, 3, '#20263e');
    fillPixelV2(px + 15, py + 25, 7, 3, '#20263e');
  }

  function miniPlayerLie(px, py) {
    drawSoftShadow(px + 4, py + 19, 24, 5, 0.18);
    outlinePixelV2(px + 2, py + 10, 20, 10, '#2d3d83');
    fillPixelV2(px + 4, py + 12, 14, 6, '#3f8fe5');
    outlinePixelV2(px + 19, py + 10, 9, 8, '#f4bd8f');
    fillPixelV2(px + 18, py + 8, 10, 4, '#273052');
    fillPixelV2(px + 18, py + 9, 7, 4, '#5ad6e7');
    fillPixelV2(px + 2, py + 18, 22, 4, '#b26576');
  }

  function tinyWifeLie(px, py) {
    fillPixelV2(px + 2, py + 18, 22, 4, '#8f5aa8');
    fillPixelV2(px + 4, py + 12, 14, 6, '#aa73d0');
    outlinePixelV2(px + 18, py + 10, 8, 8, '#f1c2b7');
    fillPixelV2(px + 18, py + 8, 8, 4, '#7b3b9a');
  }

  function sparkle(cx, cy, color) {
    fillPixelV2(cx - 1, cy - 4, 2, 8, color);
    fillPixelV2(cx - 4, cy - 1, 8, 2, color);
  }

  function getSafeHomeActionAnchor(act) {
    const fallback = { x: player.x, y: player.y, direction: player.direction || 'down' };
    if (!act) return fallback;
    const action = act.action;
    if (action === 'sleep' || action === 'sleepWife') {
      return { x: act.x + 8, y: act.y + 7, direction: 'right' };
    }
    if (action === 'study' || action === 'read') {
      return { x: act.x + 8, y: act.y + 22, direction: 'up' };
    }
    if (action === 'sink') {
      return { x: act.x + 5, y: act.y + 10, direction: 'up' };
    }
    if (action === 'cook') {
      return { x: act.x + 4, y: act.y + 10, direction: 'up' };
    }
    if (action === 'eat') {
      return { x: act.x + 4, y: act.y + 18, direction: 'right' };
    }
    if (action === 'sit') {
      return { x: act.x + 4, y: act.y + 18, direction: 'down' };
    }
    if (['wardrobe','dresser','cabinet','vanity'].includes(action)) {
      return { x: act.x - 2, y: act.y + 12, direction: 'up' };
    }
    if (action === 'homeChest') {
      return { x: act.x - 2, y: act.y + 12, direction: 'right' };
    }
    if (action === 'plant') {
      return { x: act.x - 2, y: act.y + 12, direction: 'up' };
    }
    return { x: act.x - 4, y: act.y + 12, direction: 'up' };
  }

  function drawSafeHomeActionOverlay(act) {
    const pulse = 0.75 + Math.sin(nowMs() / 140) * 0.25;
    const anchor = getSafeHomeActionAnchor(act);
    const px = anchor.x;
    const py = anchor.y;
    if (act.action === 'sleep' || act.action === 'sleepWife') {
      fillPixelV2(px + 2, py + 19, 25, 8, 'rgba(178,101,118,0.75)');
      fillPixelV2(px + 19, py + 10, 10, 6, 'rgba(246,236,220,0.65)');
      fillPixelV2(px + 30, py - 2, 4, 4, `rgba(255,255,255,${0.65 * pulse})`);
      fillPixelV2(px + 35, py - 10, 5, 5, `rgba(255,255,255,${0.50 * pulse})`);
      if (act.action === 'sleepWife') {
        fillPixelV2(px + 15, py + 3, 3, 3, '#ff6ab5');
        fillPixelV2(px + 27, py + 20, 18, 7, 'rgba(143,90,168,0.70)');
      }
      return;
    }
    if (act.action === 'sink') {
      fillPixelV2(act.x + 16, act.y + 4, 6, 5, '#93d9ff');
      fillPixelV2(act.x + 17, act.y + 9, 4, 8, `rgba(120,220,255,${0.45 + 0.15 * pulse})`);
      fillPixelV2(act.x + 11, act.y + 17, 3, 3, '#dff8ff');
      return;
    }
    if (act.action === 'study' || act.action === 'read') {
      fillPixelV2(act.x + 30, act.y + 30, 12, 8, '#efe1b8');
      fillPixelV2(act.x + 35, act.y + 30, 2, 8, '#6d4631');
      if (act.action === 'study') fillPixelV2(act.x + 41, act.y + 26, 2, 8, '#ffffff');
      else sparkle(act.x + 41, act.y + 24, '#fff2a5');
      return;
    }
    if (act.action === 'cook') {
      fillPixelV2(act.x + 34, act.y + 8, 10, 6, '#4e4e57');
      fillPixelV2(act.x + 36, act.y + 5, 6, 3, '#ffb95d');
      fillPixelV2(act.x + 39, act.y + 1, 3, 4, `rgba(255,255,255,${0.45 * pulse})`);
      return;
    }
    if (act.action === 'eat' || act.action === 'sit') {
      if (act.action === 'eat') fillPixelV2(act.x + 31, act.y + 27, 7, 3, '#d99b67');
      return;
    }
    if (['wardrobe','dresser','cabinet','vanity','homeChest'].includes(act.action)) {
      sparkle(act.x + act.w / 2, act.y + 8, '#ffe58b');
      return;
    }
    if (act.action === 'plant') {
      fillPixelV2(act.x + 16, act.y + 3, 3, 5, '#7bd7ff');
      return;
    }
  }

  const previousDrawPlayerSafeHomeActions = drawPlayer;
  drawPlayer = function drawPlayerSafeHomeActions() {
    const act = getSafeVisualAction();
    if (!act) return previousDrawPlayerSafeHomeActions();

    const original = {
      x: player.x,
      y: player.y,
      direction: player.direction,
      moving: player.moving,
      frame: player.frame
    };

    try {
      const anchor = getSafeHomeActionAnchor(act);
      player.x = anchor.x;
      player.y = anchor.y;
      player.direction = anchor.direction || player.direction;
      player.moving = false;
      player.frame = 0;
      previousDrawPlayerSafeHomeActions();
      drawSafeHomeActionOverlay(act);
      return;
    } finally {
      player.x = original.x;
      player.y = original.y;
      player.direction = original.direction;
      player.moving = original.moving;
      player.frame = original.frame;
    }
  };
})();

/* Final safety guard: never allow older action patches to crash if they search for homeActionMessage globally. */
if (typeof window !== 'undefined' && typeof window.homeActionMessage !== 'function') {
  window.homeActionMessage = function safeFallbackHomeActionMessage(obj) {
    return (obj && obj.message) || 'Voce interagiu com o movel.';
  };
}


/* ==================================================
   Patch: equipar/desequipar arma + musica medieval divertida com suspense
   Mantem as acoes visiveis da casa do patch anterior.
   ================================================== */
(function weaponUnequipAndSuspenseMusicPatch() {
  if (typeof window !== "undefined" && window.ETERNAL_RIFT_WEAPON_UNEQUIP_SUSPENSE_MUSIC_PATCH) return;
  if (typeof window !== "undefined") window.ETERNAL_RIFT_WEAPON_UNEQUIP_SUSPENSE_MUSIC_PATCH = true;

  weapons.unarmed = {
    name: "Mãos vazias",
    damage: 0,
    range: 0,
    cooldown: 0.35,
    kind: "none",
    arc: Math.PI * 0.3,
    damageType: "none",
    description: "Nenhuma arma equipada."
  };

  function ensureWeaponUnequipState() {
    if (!Array.isArray(player.unlockedWeapons) || !player.unlockedWeapons.length) player.unlockedWeapons = ["sword"];
    player.unlockedWeapons = [...new Set(player.unlockedWeapons)].filter((key) => weapons[key] || key === "unarmed");
    if (!player.unlockedWeapons.includes("unarmed")) player.unlockedWeapons.push("unarmed");

    if (!player.equippedWeaponKey) {
      const safeKey = player.unlockedWeapons.find((key) => key !== "unarmed" && weapons[key]) || "sword";
      player.equippedWeaponKey = safeKey;
    }

    if (player.equippedWeaponKey !== "unarmed" && (!weapons[player.equippedWeaponKey] || !player.unlockedWeapons.includes(player.equippedWeaponKey))) {
      player.equippedWeaponKey = player.unlockedWeapons.find((key) => key !== "unarmed" && weapons[key]) || "sword";
    }

    currentWeaponIndex = Math.max(0, player.unlockedWeapons.indexOf(player.equippedWeaponKey));
    return player.equippedWeaponKey;
  }

  const getCurrentWeaponKeyBeforeUnequipPatch = getCurrentWeaponKey;
  getCurrentWeaponKey = function getCurrentWeaponKeyWithUnequip() {
    try {
      return ensureWeaponUnequipState();
    } catch (error) {
      try { return getCurrentWeaponKeyBeforeUnequipPatch(); } catch (fallbackError) { return "sword"; }
    }
  };

  getCurrentWeapon = function getCurrentWeaponWithUnequip() {
    const key = getCurrentWeaponKey();
    return weapons[key] || weapons.sword;
  };

  const equipWeaponBeforeUnequipPatch = equipWeapon;
  equipWeapon = function equipWeaponWithUnequip(weaponKey) {
    ensureWeaponUnequipState();
    if (weaponKey === "unarmed") return unequipWeapon();
    if (!weaponKey || !weapons[weaponKey] || !player.unlockedWeapons.includes(weaponKey)) {
      showHudToast("Essa arma ainda nao esta no inventario.");
      playSound("invalid");
      return false;
    }

    player.equippedWeaponKey = weaponKey;
    currentWeaponIndex = player.unlockedWeapons.indexOf(weaponKey);
    weaponCooldownTimer = 0;
    attackWindupTimer = 0;
    attackRecoveryTimer = 0;
    attackTimer = 0;
    currentMeleeAttack = null;

    spawnFloatingText(`Arma equipada: ${weapons[weaponKey].name}`, player.x + 10, player.y - 18, "#fff264");
    showHudToast(`Arma equipada: ${weapons[weaponKey].name}`);
    playSound("equipItem");
    updateHud();
    return true;
  };

  function unequipWeapon() {
    ensureWeaponUnequipState();
    player.equippedWeaponKey = "unarmed";
    currentWeaponIndex = player.unlockedWeapons.indexOf("unarmed");
    weaponCooldownTimer = 0;
    attackWindupTimer = 0;
    attackRecoveryTimer = 0;
    attackTimer = 0;
    currentMeleeAttack = null;

    spawnFloatingText("Arma desequipada", player.x + 10, player.y - 18, "#fff264");
    showHudToast("Você guardou a arma. Mãos vazias.");
    playSound("equipItem");
    updateHud();
    return true;
  }

  if (typeof window !== "undefined") window.unequipWeapon = unequipWeapon;

  const triggerPrimaryAttackBeforeUnequipPatch = triggerPrimaryAttack;
  triggerPrimaryAttack = function triggerPrimaryAttackWithUnequip() {
    if (getCurrentWeaponKey() === "unarmed") {
      if (weaponCooldownTimer <= 0 && !dialogOpen && !inventoryOpen && !shopOpen && !pauseOpen) {
        weaponCooldownTimer = 0.25;
        spawnFloatingText("Sem arma equipada", player.x + 4, player.y - 16, "#fff264");
        showHudToast("Equipe uma arma pelo inventario.");
        playSound("invalid");
      }
      return;
    }
    return triggerPrimaryAttackBeforeUnequipPatch();
  };

  const drawEquippedWeaponBeforeUnequipPatch = typeof drawEquippedWeapon === "function" ? drawEquippedWeapon : null;
  if (drawEquippedWeaponBeforeUnequipPatch) {
    drawEquippedWeapon = function drawEquippedWeaponWithUnequip() {
      if (getCurrentWeaponKey() === "unarmed") return;
      return drawEquippedWeaponBeforeUnequipPatch();
    };
  }

  const getInventoryItemsBeforeUnequipPatch = getInventoryItems;
  getInventoryItems = function getInventoryItemsWithoutUnarmedSlot() {
    const items = getInventoryItemsBeforeUnequipPatch();
    return items.filter((item) => item?.id !== "weapon-unarmed" && item?.weaponKey !== "unarmed");
  };

  const getInventoryActionHtmlBeforeUnequipPatch = getInventoryActionHtml;
  getInventoryActionHtml = function getInventoryActionHtmlWeaponUnequip(item) {
    if (item?.action === "equipWeapon" && item.weaponKey) {
      const isEquipped = item.weaponKey === getCurrentWeaponKey();
      const safeWeaponKey = String(item.weaponKey).replace(/"/g, "&quot;");
      if (isEquipped) {
        return `<button type="button" data-inventory-action="unequipWeapon" data-weapon-key="${safeWeaponKey}">Desequipar arma</button>`;
      }
      return `<button type="button" data-inventory-action="equipWeapon" data-weapon-key="${safeWeaponKey}">Equipar arma</button>`;
    }
    return getInventoryActionHtmlBeforeUnequipPatch(item);
  };

  const handleInventoryActionBeforeUnequipPatch = handleInventoryAction;
  handleInventoryAction = function handleInventoryActionWeaponUnequip(actionButton) {
    const action = actionButton?.dataset?.inventoryAction;
    if (action === "unequipWeapon") {
      unequipWeapon();
      renderInventory();
      return;
    }
    if (action === "equipWeapon") {
      equipWeapon(actionButton.dataset.weaponKey);
      renderInventory();
      return;
    }
    return handleInventoryActionBeforeUnequipPatch(actionButton);
  };

  const updateHudBeforeUnequipPatch = updateHud;
  updateHud = function updateHudWeaponUnequip() {
    ensureWeaponUnequipState();
    updateHudBeforeUnequipPatch();
    if (weaponHud) {
      const key = getCurrentWeaponKey();
      if (key === "unarmed") {
        weaponHud.textContent = "Arma equipada: Nenhuma";
      } else {
        const current = getCurrentWeapon();
        const arrowKeys = new Set(["bow", "frostBow", "starBow"]);
        weaponHud.textContent = `Arma equipada: ${current.name}${arrowKeys.has(key) ? ` (${inventory.flechas})` : ""}`;
      }
    }
  };

  const renderEquipmentSlotsBeforeUnequipPatch = renderEquipmentSlots;
  renderEquipmentSlots = function renderEquipmentSlotsWeaponUnequip() {
    ensureWeaponUnequipState();
    return renderEquipmentSlotsBeforeUnequipPatch();
  };

  const saveGameBeforeUnequipPatch = saveGame;
  saveGame = function saveGameWeaponUnequip() {
    ensureWeaponUnequipState();
    const unequipped = player.equippedWeaponKey === "unarmed";
    if (unequipped && !player.unlockedWeapons.includes("unarmed")) player.unlockedWeapons.push("unarmed");

    const ok = saveGameBeforeUnequipPatch();

    // O save antigo normalizava a arma para uma espada. Corrige o JSON salvo sem quebrar saves antigos.
    try {
      const raw = typeof readSaveRaw === "function" ? readSaveRaw() : null;
      if (raw) {
        const parsed = JSON.parse(raw);
        parsed.player = parsed.player || {};
        parsed.player.equippedWeaponKey = player.equippedWeaponKey;
        parsed.player.unlockedWeapons = [...new Set([...(parsed.player.unlockedWeapons || []), ...(player.unlockedWeapons || [])])];
        parsed.futureState = parsed.futureState || {};
        parsed.futureState.player = parsed.futureState.player || {};
        parsed.futureState.player.equippedWeaponKey = player.equippedWeaponKey;
        parsed.futureState.currentWeaponKey = player.equippedWeaponKey;
        if (typeof writeSaveRaw === "function") writeSaveRaw(JSON.stringify(parsed));
      }
    } catch (error) {
      // Save extra opcional.
    }
    return ok;
  };

  const loadGameBeforeUnequipPatch = loadGame;
  loadGame = function loadGameWeaponUnequip() {
    const ok = loadGameBeforeUnequipPatch();
    try {
      const raw = typeof readSaveRaw === "function" ? readSaveRaw() : null;
      const parsed = raw ? JSON.parse(raw) : null;
      const savedKey = parsed?.futureState?.player?.equippedWeaponKey || parsed?.futureState?.currentWeaponKey || parsed?.player?.equippedWeaponKey;
      if (savedKey === "unarmed" || weapons[savedKey]) {
        if (savedKey === "unarmed" && !player.unlockedWeapons.includes("unarmed")) player.unlockedWeapons.push("unarmed");
        player.equippedWeaponKey = savedKey;
      }
    } catch (error) {
      // Sem problema se for save antigo.
    }
    ensureWeaponUnequipState();
    updateHud();
    return ok;
  };

  cycleWeapon = function cycleWeaponStillInventoryOnlyAfterUnequip() {
    ensureWeaponUnequipState();
    inventoryTab = "armas";
    selectedInventoryItemId = getCurrentWeaponKey() === "unarmed" ? "" : `weapon-${getCurrentWeaponKey()}`;
    showHudToast("Troque ou desequipe armas pelo inventario.");
    if (typeof toggleInventory === "function") toggleInventory(true);
    if (typeof renderInventory === "function") renderInventory();
    playSound("inventoryOpen");
  };

  // Musica medieval mais divertida com suspense, leve e sintetizada no navegador.
  function stopCurrentBackgroundMusicSmoothly() {
    if (musicTimer) {
      clearInterval(musicTimer);
      musicTimer = null;
    }
    if (musicGain && audioContext) {
      try {
        musicGain.gain.cancelScheduledValues(audioContext.currentTime);
        musicGain.gain.setValueAtTime(Math.max(0.0001, musicGain.gain.value || 0.0001), audioContext.currentTime);
        musicGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.25);
        const oldGain = musicGain;
        setTimeout(() => { try { oldGain.disconnect(); } catch (error) {} }, 320);
      } catch (error) {}
      musicGain = null;
    }
  }

  function playBardTone(freq, offset, duration, volume, type = "triangle", destination = musicGain) {
    if (!audioContext || !destination) return;
    const now = audioContext.currentTime + offset;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(gain);
    gain.connect(destination);
    osc.start(now);
    osc.stop(now + duration + 0.04);
  }

  function playMedievalSuspensePerc(offset = 0, volume = 0.020) {
    if (!audioContext || !musicGain) return;
    const now = audioContext.currentTime + offset;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(92, now);
    osc.frequency.exponentialRampToValueAtTime(48, now + 0.08);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.connect(gain);
    gain.connect(musicGain);
    osc.start(now);
    osc.stop(now + 0.14);
  }

  startMusic = function startMusicMedievalFunSuspense() {
    ensureAudio();
    if (musicTimer || !audioContext) return;
    try {
      if (audioContext.state === "suspended") audioContext.resume();
    } catch (error) {}

    musicGain = audioContext.createGain();
    musicGain.gain.value = isMobile ? 0.028 : 0.038;
    musicGain.connect(audioContext.destination);

    let step = 0;
    const melody = [294, 349, 370, 440, 392, 349, 330, 392, 440, 466, 440, 392, 349, 330, 294, 262];
    const bass = [147, 147, 196, 196, 174, 174, 220, 196];
    const sparkle = [587, 698, 740, 880, 784, 698, 659, 784];

    const playBar = () => {
      if (!audioContext || audioContext.state !== "running" || !musicGain) return;
      const note = melody[step % melody.length];
      const bassNote = bass[Math.floor(step / 2) % bass.length];

      // Flauta/alaúde principal: leve, saltitante, mas em tom menor.
      playBardTone(note, 0, 0.30, 0.055, "triangle");
      if (step % 2 === 0) playBardTone(note * 1.5, 0.045, 0.18, 0.022, "sine");
      if (step % 4 === 1) playBardTone(sparkle[step % sparkle.length], 0.08, 0.12, 0.014, "triangle");

      // Bordao grave medieval, dando suspense.
      if (step % 2 === 0) playBardTone(bassNote, 0, 0.58, 0.030, "sine");
      if (step % 8 === 6) playBardTone(bassNote * 0.75, 0.03, 0.44, 0.018, "sawtooth");

      // Batida discreta de taverna/masmorra.
      if (step % 4 === 0 || step % 4 === 3) playMedievalSuspensePerc(0.02, isMobile ? 0.012 : 0.018);

      step += 1;
    };

    playBar();
    musicTimer = setInterval(playBar, 360);
  };

  // Se a musica antiga ja estava tocando, troca suavemente para a nova.
  if (gameStarted && audioContext) {
    stopCurrentBackgroundMusicSmoothly();
    startMusic();
  }

  ensureWeaponUnequipState();
  updateHud();
})();

/* ==================================================
   Patch PRO mobile gameplay: canvas, zoom e classes de orientacao
   ================================================== */
(function mobileGameplayProPatch() {
  if (typeof window !== 'undefined' && window.ETERNAL_RIFT_MOBILE_GAMEPLAY_PRO_PATCH) return;
  if (typeof window !== 'undefined') window.ETERNAL_RIFT_MOBILE_GAMEPLAY_PRO_PATCH = true;

  function isTouchLikeDevice() {
    return Boolean(window.matchMedia && window.matchMedia('(max-width: 880px), (pointer: coarse)').matches);
  }

  function updateMobileGameplayClasses() {
    const mobile = isTouchLikeDevice();
    document.body.classList.toggle('is-mobile', mobile);
    document.body.classList.toggle('mobile-landscape', mobile && window.innerWidth >= window.innerHeight);
    document.body.classList.toggle('mobile-portrait', mobile && window.innerHeight > window.innerWidth);
  }

  updateMobileGameplayClasses();
  window.addEventListener('resize', updateMobileGameplayClasses, { passive: true });
  window.addEventListener('orientationchange', () => setTimeout(updateMobileGameplayClasses, 120), { passive: true });

  const ensureCanvasSizeBeforeMobilePro = ensureCanvasSize;
  ensureCanvasSize = function ensureCanvasSizeMobileGameplayPro() {
    ensureCanvasSizeBeforeMobilePro();
    if (!isTouchLikeDevice()) return;

    const rect = canvas.getBoundingClientRect();
    const cssWidth = Math.max(320, Math.round(rect.width || window.innerWidth || 960));
    const cssHeight = Math.max(240, Math.round(rect.height || window.innerHeight || 640));
    const requestedZoom = Number(urlParams.get('zoom'));
    const hasManualZoom = Number.isFinite(requestedZoom) && requestedZoom >= 0.65 && requestedZoom <= 1.15;
    const landscape = cssWidth >= cssHeight;
    const zoom = hasManualZoom ? requestedZoom : (landscape ? 0.74 : 0.84);
    const targetWidth = Math.round(cssWidth / zoom);
    const targetHeight = Math.round(cssHeight / zoom);

    if (Math.abs(canvas.width - targetWidth) > 2 || Math.abs(canvas.height - targetHeight) > 2) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
    }
  };

  const updateDeviceModeBeforeMobilePro = updateDeviceMode;
  updateDeviceMode = function updateDeviceModeMobileGameplayPro() {
    updateDeviceModeBeforeMobilePro();
    updateMobileGameplayClasses();
  };
})();
