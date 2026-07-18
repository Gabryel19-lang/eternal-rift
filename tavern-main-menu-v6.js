"use strict";

/*
 * ETERNAL RIFT — MENU INICIAL TAVERNA V6
 * Conecta a nova interface aos fluxos existentes de nome, classe, save,
 * Novo Jogo, Continuar, Como Jogar, Creditos e tela cheia.
 */
(function installTavernMainMenuV6() {
  const BUILD = "tavern-main-menu-v6-interactive-20260717";
  if (window.ETERNAL_RIFT_TAVERN_MENU?.build === BUILD) return;

  const root = document.getElementById("startScreen");
  const tavern = root?.querySelector(".er-v6-tavern");
  const nameInput = document.getElementById("characterNameInput");
  const classPanel = document.getElementById("classSelectPanel");
  const classSummary = document.getElementById("classSelectSummary");
  const playButton = document.getElementById("playButton");
  const continueButton = document.getElementById("continueButton");
  const continueStatus = document.getElementById("erV6ContinueStatus");
  const howToButton = document.getElementById("howToButton");
  const creditsButton = document.getElementById("creditsButton");
  const fullscreenButton = document.getElementById("startFullscreenButton");
  const fullscreenLabel = document.getElementById("erV6FullscreenLabel");
  const startMessageEl = document.getElementById("startMessage");
  const embers = document.getElementById("erV6Embers");

  if (!root || !tavern || !nameInput || !classPanel) return;

  const PREFERRED_NAME_KEY = "eternalRiftPreferredPlayerNameV6";
  const CLASS_COPY = Object.freeze({
    warrior: "Guerreiro: forte e resistente, especialista em combate corpo a corpo.",
    archer: "Arqueiro: ágil e preciso, ataca de longe com letal precisão.",
    mage: "Mago: mestre das artes místicas, controla forças mágicas.",
    assassin: "Assassino: rápido e letal, especialista em ataques críticos."
  });

  let nameWasEdited = false;
  let cachedSave = null;

  function parseJson(value) {
    try { return value ? JSON.parse(value) : null; }
    catch (error) { return null; }
  }

  function readCurrentSaveRaw() {
    try {
      if (typeof readSaveRaw === "function") return readSaveRaw();
    } catch (error) {}
    try {
      for (const key of Object.keys(localStorage)) {
        if (/eternal.*rift.*save/i.test(key)) {
          const value = localStorage.getItem(key);
          if (value) return value;
        }
      }
    } catch (error) {}
    return null;
  }

  function readSave() {
    const raw = readCurrentSaveRaw();
    cachedSave = parseJson(raw);
    return { raw, save: cachedSave };
  }

  function savedPlayerName(save) {
    const value =
      save?.player?.name ||
      save?.futureState?.player?.name ||
      save?.playerName ||
      "";
    return String(value || "").trim().slice(0, 16);
  }

  function preferredName() {
    try { return String(localStorage.getItem(PREFERRED_NAME_KEY) || "").trim().slice(0, 16); }
    catch (error) { return ""; }
  }

  function storePreferredName() {
    const value = String(nameInput.value || "").trim().slice(0, 16);
    if (!value) return;
    try { localStorage.setItem(PREFERRED_NAME_KEY, value); } catch (error) {}
  }

  function syncNameFromSave(force = false) {
    if (nameWasEdited && !force) return;
    const { save } = readSave();
    const value = savedPlayerName(save) || preferredName() || String(nameInput.value || "").trim() || "Blade";
    nameInput.value = value.slice(0, 16);
  }

  function activeClassId() {
    return classPanel.querySelector("[data-class-choice].is-selected")?.dataset.classChoice || "assassin";
  }

  function syncClassUi() {
    const chosen = CLASS_COPY[activeClassId()] ? activeClassId() : "assassin";
    classPanel.querySelectorAll("[data-class-choice]").forEach((card) => {
      const selected = card.dataset.classChoice === chosen;
      card.classList.toggle("is-selected", selected);
      card.setAttribute("aria-checked", selected ? "true" : "false");
      card.setAttribute("aria-pressed", selected ? "true" : "false");
      card.tabIndex = selected ? 0 : -1;
    });
    if (classSummary) classSummary.textContent = CLASS_COPY[chosen];
    tavern.dataset.selectedClass = chosen;
    return chosen;
  }

  function hasSave() {
    return Boolean(readSave().raw);
  }

  function syncContinueState() {
    const available = hasSave();
    continueButton?.classList.toggle("is-unavailable", !available);
    continueButton?.setAttribute("aria-disabled", available ? "false" : "true");
    if (continueStatus) {
      const savedName = savedPlayerName(cachedSave);
      continueStatus.textContent = available
        ? savedName ? `Continuar jornada de ${savedName}` : "Save encontrado"
        : "Nenhum save encontrado";
    }
    return available;
  }

  function syncFullscreenLabel() {
    if (!fullscreenLabel) return;
    fullscreenLabel.textContent = document.fullscreenElement ? "Sair da tela cheia" : "Tela cheia";
    fullscreenButton?.setAttribute("aria-pressed", document.fullscreenElement ? "true" : "false");
  }

  function installEmbers() {
    if (!embers || embers.childElementCount) return;
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reducedMotion) return;
    const mobile = window.matchMedia?.("(max-width: 760px)")?.matches;
    const amount = mobile ? 8 : 16;
    for (let index = 0; index < amount; index += 1) {
      const ember = document.createElement("i");
      ember.className = "er-v6-ember";
      const x = 12 + ((index * 47) % 82);
      const size = 2 + (index % 3);
      const duration = 2.6 + (index % 5) * .42;
      const delay = -((index * .51) % 3.2);
      const drift = ((index % 2 ? 1 : -1) * (8 + (index % 4) * 5));
      ember.style.setProperty("--x", `${x}%`);
      ember.style.setProperty("--s", `${size}px`);
      ember.style.setProperty("--d", `${duration}s`);
      ember.style.setProperty("--delay", `${delay}s`);
      ember.style.setProperty("--drift", `${drift}px`);
      embers.appendChild(ember);
    }
  }

  function showNoSaveMessage(event) {
    if (syncContinueState()) return;
    event?.preventDefault?.();
    event?.stopImmediatePropagation?.();
    if (startMessageEl) startMessageEl.textContent = "Nenhum jogo salvo encontrado. Comece uma nova aventura.";
    continueButton?.animate?.(
      [{ transform: "translateX(0)" }, { transform: "translateX(-4px)" }, { transform: "translateX(4px)" }, { transform: "translateX(0)" }],
      { duration: 240, easing: "ease-out" }
    );
  }

  function showHowToV6() {
    if (typeof showInfo !== "function") return;
    showInfo(
      "Como Jogar",
      "PC\nWASD ou setas: mover\nE: interagir\nMouse ou tecla de ataque: combater\nZ, X, C e V: usar os poderes equipados\nEspaço: esquiva\nI: inventário\nM: missões\nEsc: menu\n\nMOBILE\nJoystick: mover\nBotão Atacar: atacar\nBotões de poder: usar Z, X, C e V\nBotão Interagir: conversar, entrar e ativar objetos\nBotão de esquiva: desviar\n\nExplore os biomas, cumpra missões, derrote criaturas e evolua seu aventureiro."
    );
  }

  function showCreditsV6() {
    if (typeof showInfo !== "function") return;
    showInfo(
      "Créditos",
      "ETERNAL RIFT\n\nCriadores\nGabryel Garcia\nVictor Ricardo Fonseca Baldin\n\nRPG 2D de fantasia desenvolvido em HTML, CSS e JavaScript, com integração visual em PixiJS.\n\nObrigado por atravessar o Rift."
    );
  }

  nameInput.addEventListener("input", () => {
    nameWasEdited = true;
    nameInput.value = String(nameInput.value || "").slice(0, 16);
    storePreferredName();
  });
  nameInput.addEventListener("change", storePreferredName);

  classPanel.addEventListener("click", (event) => {
    const card = event.target.closest("[data-class-choice]");
    if (!card) return;
    window.setTimeout(syncClassUi, 0);
  });
  classPanel.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
    const cards = [...classPanel.querySelectorAll("[data-class-choice]")];
    const current = Math.max(0, cards.findIndex((card) => card.classList.contains("is-selected")));
    const step = ["ArrowRight", "ArrowDown"].includes(event.key) ? 1 : -1;
    const next = cards[(current + step + cards.length) % cards.length];
    event.preventDefault();
    next?.focus();
    next?.click();
  });

  continueButton?.addEventListener("click", showNoSaveMessage, true);
  continueButton?.addEventListener("click", () => {
    if (hasSave()) nameWasEdited = false;
  });
  playButton?.addEventListener("click", () => {
    storePreferredName();
    syncClassUi();
  }, true);
  howToButton?.addEventListener("click", showHowToV6);
  creditsButton?.addEventListener("click", showCreditsV6);
  document.addEventListener("fullscreenchange", syncFullscreenLabel);
  window.addEventListener("storage", () => {
    syncContinueState();
    syncNameFromSave();
  });

  const classObserver = new MutationObserver(syncClassUi);
  classPanel.querySelectorAll("[data-class-choice]").forEach((card) => {
    classObserver.observe(card, { attributes: true, attributeFilter: ["class"] });
  });

  const menuObserver = new MutationObserver(() => {
    const open = !root.classList.contains("hidden");
    if (open) {
      syncContinueState();
      syncNameFromSave();
      syncClassUi();
    }
  });
  menuObserver.observe(root, { attributes: true, attributeFilter: ["class"] });

  syncNameFromSave(true);
  syncContinueState();
  syncClassUi();
  syncFullscreenLabel();
  installEmbers();

  window.setTimeout(() => {
    syncContinueState();
    syncClassUi();
  }, 180);

  window.ETERNAL_RIFT_TAVERN_MENU = Object.freeze({
    build: BUILD,
    usesStaticBackground: false,
    modularEnvironmentPieces: 16,
    interactiveClassCards: 4,
    syncContinueState,
    syncClassUi,
    syncNameFromSave
  });
})();

