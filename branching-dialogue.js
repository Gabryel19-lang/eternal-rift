/* ================================================================
   Eternal Rift - Branching Dialogue System
   JSON-driven dialogue trees, actions, conditions and rewards.
   Uses existing NPC spritesheets as portraits. PC + mobile.
   ================================================================ */
(function eternalRiftBranchingDialogueSystem() {
  "use strict";

  const PATCH_ID = "branching-dialogue-json-pc-mobile-20260715";
  const DATA_URL = `assets/dialogues/branching-dialogues.json?v=${PATCH_ID}`;
  if (window.ETERNAL_RIFT_BRANCHING_DIALOGUE_PATCH === PATCH_ID) return;
  window.ETERNAL_RIFT_BRANCHING_DIALOGUE_PATCH = PATCH_ID;

  const NPC_DIALOGUE_MAP = {
    Branor: "blacksmith_branor",
    "Téo": "farmer_teo",
    Astrid: "rift_guardian_astrid",
    Lia: "villager_lia",
    Mina: "villager_mina",
    Bran: "village_guard_bran",
    Ari: "village_guard_ari"
  };

  const portraitCache = new Map();
  const weaponBaseDamage = new Map();
  let database = null;
  let active = null;
  let ui = null;
  let typewriterFrame = 0;
  let typewriterLastAt = 0;

  try {
    for (const [key, weapon] of Object.entries(weapons || {})) {
      if (weapon && Number.isFinite(Number(weapon.damage))) weaponBaseDamage.set(key, Number(weapon.damage));
    }
  } catch (error) {}

  function safeCall(callback, fallback) {
    try { return callback(); }
    catch (error) { return fallback; }
  }

  function ensureSystemState() {
    if (!questBook.branchingDialogue || typeof questBook.branchingDialogue !== "object" || Array.isArray(questBook.branchingDialogue)) {
      questBook.branchingDialogue = {};
    }
    const state = questBook.branchingDialogue;
    if (!state.missions || typeof state.missions !== "object" || Array.isArray(state.missions)) state.missions = {};
    if (!state.items || typeof state.items !== "object" || Array.isArray(state.items)) state.items = {};
    if (!state.itemMeta || typeof state.itemMeta !== "object" || Array.isArray(state.itemMeta)) state.itemMeta = {};
    if (!state.claimedRewards || typeof state.claimedRewards !== "object" || Array.isArray(state.claimedRewards)) state.claimedRewards = {};
    if (!state.executedActions || typeof state.executedActions !== "object" || Array.isArray(state.executedActions)) state.executedActions = {};
    if (!state.weaponUpgrades || typeof state.weaponUpgrades !== "object" || Array.isArray(state.weaponUpgrades)) state.weaponUpgrades = {};
    if (!state.history || !Array.isArray(state.history)) state.history = [];
    return state;
  }

  function rememberItem(itemId, itemName, metadata = {}) {
    const id = String(itemId || "");
    if (!id || Object.prototype.hasOwnProperty.call(inventory, id)) return;
    const state = ensureSystemState();
    state.itemMeta[id] = {
      name: itemName || state.itemMeta[id]?.name || id.replace(/[_-]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()),
      category: metadata.category || state.itemMeta[id]?.category || "materiais",
      rarity: metadata.rarity || state.itemMeta[id]?.rarity || "incomum",
      description: metadata.description || state.itemMeta[id]?.description || "Item recebido durante uma conversa na vila.",
      effect: metadata.effect || state.itemMeta[id]?.effect || "Pode ser usado em diálogos, missões e trocas."
    };
  }

  function missionState(missionId) {
    return ensureSystemState().missions[String(missionId || "")] || null;
  }

  function isMissionAccepted(missionId) {
    const mission = missionState(missionId);
    return Boolean(mission && (mission.status === "accepted" || mission.status === "completed"));
  }

  function isMissionCompleted(missionId) {
    return missionState(missionId)?.status === "completed";
  }

  function ensureFarmingState() {
    if (!questBook.farming || typeof questBook.farming !== "object" || Array.isArray(questBook.farming)) {
      questBook.farming = { version: 1, unlocked: false, seeds: 0, produce: 0, harvests: 0, plots: {} };
    }
    questBook.farming.seeds = Math.max(0, Math.floor(Number(questBook.farming.seeds || 0)));
    questBook.farming.produce = Math.max(0, Math.floor(Number(questBook.farming.produce || 0)));
    return questBook.farming;
  }

  function getItemCount(itemId) {
    const id = String(itemId || "");
    if (!id) return 0;
    if (id === "farming_seed") return ensureFarmingState().seeds;
    if (id === "raiz_dourada") return ensureFarmingState().produce;
    if (Number.isFinite(Number(inventory[id]))) return Math.max(0, Number(inventory[id]));
    return Math.max(0, Number(ensureSystemState().items[id] || 0));
  }

  function setItemCount(itemId, amount) {
    const id = String(itemId || "");
    const value = Math.max(0, Math.floor(Number(amount || 0)));
    if (!id) return;
    if (id === "farming_seed") {
      const farming = ensureFarmingState();
      farming.unlocked = true;
      farming.seeds = value;
      return;
    }
    if (id === "raiz_dourada") {
      ensureFarmingState().produce = value;
      return;
    }
    if (Object.prototype.hasOwnProperty.call(inventory, id) && Number.isFinite(Number(inventory[id]))) {
      inventory[id] = value;
      return;
    }
    ensureSystemState().items[id] = value;
  }

  function addItem(itemId, amount = 1) {
    setItemCount(itemId, getItemCount(itemId) + Math.max(0, Number(amount || 0)));
  }

  function takeItem(itemId, amount = 1) {
    const quantity = Math.max(1, Number(amount || 1));
    if (getItemCount(itemId) < quantity) return false;
    setItemCount(itemId, getItemCount(itemId) - quantity);
    return true;
  }

  function currentWeaponKey() {
    const key = safeCall(() => getCurrentWeaponKey(), "sword");
    return key && weapons?.[key] ? key : "sword";
  }

  function currentWeapon() {
    return weapons?.[currentWeaponKey()] || weapons?.sword || { name: "Arma", damage: 0 };
  }

  function templateValues() {
    const farming = ensureFarmingState();
    const weapon = currentWeapon();
    return {
      playerName: safeCall(() => getPlayerDisplayName(), player?.name || "Herói"),
      coins: Math.max(0, Number(inventory.moedas || 0)),
      weaponName: weapon.name || "Arma",
      weaponDamage: Math.max(0, Number(weapon.damage || 0)),
      farmSeeds: farming.seeds,
      farmProduce: farming.produce
    };
  }

  function formatText(value) {
    const values = templateValues();
    return String(value || "").replace(/\{([a-zA-Z0-9_]+)\}/g, (match, key) => {
      return Object.prototype.hasOwnProperty.call(values, key) ? String(values[key]) : match;
    });
  }

  function checkCondition(condition) {
    if (!condition || typeof condition !== "object") return true;
    const type = String(condition.type || "");
    if (type === "hasItem") return getItemCount(condition.itemId) >= Math.max(1, Number(condition.amount || 1));
    if (type === "coinsAtLeast") return Number(inventory.moedas || 0) >= Math.max(0, Number(condition.amount || 0));
    if (type === "missionAccepted") return isMissionAccepted(condition.missionId);
    if (type === "missionCompleted") return isMissionCompleted(condition.missionId);
    if (type === "missionNotAccepted") return !isMissionAccepted(condition.missionId);
    if (type === "missionNotCompleted") return !isMissionCompleted(condition.missionId);
    if (type === "all") return (condition.conditions || []).every(checkCondition);
    if (type === "any") return (condition.conditions || []).some(checkCondition);
    if (type === "not") return !checkCondition(condition.condition);
    return true;
  }

  function conditionsMet(conditions) {
    return !Array.isArray(conditions) || conditions.every(checkCondition);
  }

  function pushHistory(entry) {
    const history = ensureSystemState().history;
    history.push({ at: Date.now(), ...entry });
    if (history.length > 80) history.splice(0, history.length - 80);
  }

  function notify(message, duration = 2.8) {
    safeCall(() => showHudToast?.(String(message), duration));
  }

  function refreshGameUi() {
    safeCall(() => updateHud?.(true));
    safeCall(() => renderInventory?.());
    safeCall(() => updateQuestProgress?.());
  }

  function queueAutosave(reason) {
    window.setTimeout(() => {
      safeCall(() => window.ETERNAL_RIFT_FORCE_AUTOSAVE?.(reason));
    }, 0);
  }

  function applyStoredWeaponUpgrades() {
    const upgrades = ensureSystemState().weaponUpgrades;
    for (const [key, amount] of Object.entries(upgrades)) {
      const weapon = weapons?.[key];
      if (!weapon) continue;
      if (!weaponBaseDamage.has(key)) weaponBaseDamage.set(key, Number(weapon.damage || 0));
      weapon.damage = Number(weaponBaseDamage.get(key) || 0) + Math.max(0, Number(amount || 0));
    }
  }

  function startMission(action) {
    const state = ensureSystemState();
    const id = String(action.missionId || "");
    if (!id || isMissionAccepted(id)) return true;
    state.missions[id] = {
      id,
      name: action.name || id,
      status: "accepted",
      acceptedAt: Date.now(),
      completedAt: 0
    };
    notify(`Missão iniciada: ${action.name || id}`, 3.2);
    safeCall(() => playSound?.("mission"));
    return true;
  }

  function completeMission(action) {
    const state = ensureSystemState();
    const id = String(action.missionId || "");
    if (!id) return false;
    const mission = state.missions[id] || { id, name: action.name || id, acceptedAt: Date.now() };
    mission.status = "completed";
    mission.completedAt = Date.now();
    state.missions[id] = mission;
    notify(`Missão concluída: ${mission.name || id}`, 3.2);
    safeCall(() => playSound?.("mission"));
    return true;
  }

  function giveItemAction(action) {
    if (action.once && ensureSystemState().executedActions[action.once]) {
      notify("Esta recompensa já foi recebida.", 2.2);
      return true;
    }
    const amount = Math.max(1, Number(action.amount || 1));
    rememberItem(action.itemId, action.itemName, action);
    addItem(action.itemId, amount);
    if (action.once) ensureSystemState().executedActions[action.once] = true;
    notify(`Recebido: ${amount}x ${action.itemName || action.itemId}`, 2.8);
    safeCall(() => playSound?.("collect"));
    return true;
  }

  function takeItemAction(action) {
    const amount = Math.max(1, Number(action.amount || 1));
    if (!takeItem(action.itemId, amount)) {
      notify(`Você não possui ${amount}x ${action.itemName || action.itemId}.`, 2.8);
      return false;
    }
    notify(`Entregue: ${amount}x ${action.itemName || action.itemId}`, 2.4);
    return true;
  }

  function buyItemAction(action) {
    const price = Math.max(0, Number(action.price || 0));
    if (Number(inventory.moedas || 0) < price) {
      notify("Moedas insuficientes.", 2.6);
      safeCall(() => playSound?.("invalid"));
      return false;
    }
    inventory.moedas = Number(inventory.moedas || 0) - price;
    rememberItem(action.itemId, action.itemName, action);
    addItem(action.itemId, Math.max(1, Number(action.amount || 1)));
    notify(`Compra realizada: ${action.itemName || action.itemId}`, 2.8);
    safeCall(() => playSound?.("coin"));
    return true;
  }

  function upgradeWeaponAction(action) {
    const cost = Math.max(0, Number(action.cost || 0));
    if (Number(inventory.moedas || 0) < cost) {
      notify("Moedas insuficientes para melhorar a arma.", 2.8);
      safeCall(() => playSound?.("invalid"));
      return false;
    }
    const key = action.weapon === "equipped" || !action.weapon ? currentWeaponKey() : String(action.weapon);
    if (key === "unarmed") {
      notify("Equipe uma arma antes de pedir uma melhoria.", 2.8);
      safeCall(() => playSound?.("invalid"));
      return false;
    }
    const weapon = weapons?.[key];
    if (!weapon) {
      notify("A arma selecionada não pode ser melhorada.", 2.8);
      return false;
    }
    const amount = Math.max(1, Number(action.amount || 1));
    inventory.moedas = Number(inventory.moedas || 0) - cost;
    const state = ensureSystemState();
    state.weaponUpgrades[key] = Math.max(0, Number(state.weaponUpgrades[key] || 0)) + amount;
    applyStoredWeaponUpgrades();
    player.damageBonus = Math.max(0, Number(player.damageBonus || 0));
    notify(`${weapon.name} melhorada: +${amount} de dano.`, 3.1);
    safeCall(() => playSound?.("equipItem"));
    return true;
  }

  function grantReward(reward) {
    if (!reward || typeof reward !== "object") return;
    const amount = Math.max(0, Number(reward.amount || 0));
    if (reward.type === "coins") {
      inventory.moedas = Number(inventory.moedas || 0) + amount;
      notify(`Recompensa: +${amount} moedas`, 2.8);
      safeCall(() => playSound?.("coin"));
    } else if (reward.type === "item") {
      rememberItem(reward.itemId, reward.itemName, reward);
      addItem(reward.itemId, Math.max(1, amount || 1));
      notify(`Recompensa: ${Math.max(1, amount || 1)}x ${reward.itemName || reward.itemId}`, 2.8);
      safeCall(() => playSound?.("collect"));
    } else if (reward.type === "xp") {
      safeCall(() => awardXp?.(amount, "Diálogo e missão"));
    } else if (reward.type === "health") {
      player.health = Math.min(player.maxHealth, Number(player.health || 0) + amount);
    } else if (reward.type === "mana") {
      player.mana = Math.min(player.maxMana, Number(player.mana || 0) + amount);
    }
  }

  function grantNodeRewards(node, dialogueId, nodeId) {
    if (!Array.isArray(node?.rewards) || !node.rewards.length) return;
    const rewardId = String(node.rewardId || `${dialogueId}:${nodeId}`);
    const state = ensureSystemState();
    if (state.claimedRewards[rewardId]) return;
    state.claimedRewards[rewardId] = true;
    for (const reward of node.rewards) grantReward(reward);
    refreshGameUi();
    queueAutosave(`branching-reward-${rewardId}`);
  }

  function performAction(action) {
    if (!action || typeof action !== "object") return true;
    const type = String(action.type || "");
    if (action.once && type !== "giveItem") {
      const state = ensureSystemState();
      if (state.executedActions[action.once]) return true;
      state.executedActions[action.once] = true;
    }
    if (type === "closeDialogue") {
      closeDialogue();
      return true;
    }
    if (type === "openShop") {
      closeDialogue();
      window.setTimeout(() => safeCall(() => openShop?.()), 0);
      return true;
    }
    if (type === "startMission") return startMission(action);
    if (type === "completeMission") return completeMission(action);
    if (type === "giveItem" || type === "deliverItem") return giveItemAction(action);
    if (type === "takeItem") return takeItemAction(action);
    if (type === "buyItem") return buyItemAction(action);
    if (type === "upgradeWeapon") return upgradeWeaponAction(action);
    if (type === "giveReward") {
      grantReward(action.reward || action);
      return true;
    }
    return true;
  }

  function runActions(actions) {
    if (!Array.isArray(actions)) return true;
    for (const action of actions) {
      if (!performAction(action)) return false;
      if (!active) break;
    }
    refreshGameUi();
    queueAutosave("branching-dialogue-action");
    return true;
  }

  function buildUi() {
    if (ui?.root?.isConnected) return ui;
    const root = document.createElement("section");
    root.id = "erBranchingDialogue";
    root.className = "er-branch-dialogue is-hidden";
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-modal", "true");
    root.setAttribute("aria-hidden", "true");
    root.setAttribute("aria-labelledby", "erBranchNpcName");
    root.innerHTML = `
      <div class="er-branch-dialogue__shade" data-branch-close aria-hidden="true"></div>
      <article class="er-branch-dialogue__panel">
        <i class="er-branch-corner er-branch-corner--tl" aria-hidden="true"></i>
        <i class="er-branch-corner er-branch-corner--tr" aria-hidden="true"></i>
        <i class="er-branch-corner er-branch-corner--bl" aria-hidden="true"></i>
        <i class="er-branch-corner er-branch-corner--br" aria-hidden="true"></i>
        <aside class="er-branch-dialogue__speaker">
          <div class="er-branch-dialogue__portrait-frame">
            <canvas id="erBranchPortrait" class="er-branch-dialogue__portrait" width="128" height="128" aria-label="Retrato do NPC"></canvas>
            <span id="erBranchPortraitFallback" class="er-branch-dialogue__portrait-fallback" aria-hidden="true">ER</span>
          </div>
          <div class="er-branch-dialogue__identity">
            <strong id="erBranchNpcName">NPC</strong>
            <span id="erBranchNpcTitle">Eternal Rift</span>
          </div>
        </aside>
        <div class="er-branch-dialogue__content">
          <div class="er-branch-dialogue__rune" aria-hidden="true">✦</div>
          <p id="erBranchText" class="er-branch-dialogue__text"></p>
          <div id="erBranchChoices" class="er-branch-dialogue__choices" role="listbox" aria-label="Opções de resposta"></div>
          <div class="er-branch-dialogue__footer">
            <span id="erBranchStatus" class="er-branch-dialogue__status"></span>
            <span class="er-branch-dialogue__keys"><kbd>↑</kbd><kbd>↓</kbd> escolher · <kbd>E</kbd> confirmar</span>
            <button id="erBranchContinue" class="er-branch-dialogue__continue" type="button">Continuar</button>
          </div>
        </div>
      </article>
    `;
    document.body.appendChild(root);
    ui = {
      root,
      panel: root.querySelector(".er-branch-dialogue__panel"),
      portrait: root.querySelector("#erBranchPortrait"),
      portraitFallback: root.querySelector("#erBranchPortraitFallback"),
      name: root.querySelector("#erBranchNpcName"),
      title: root.querySelector("#erBranchNpcTitle"),
      text: root.querySelector("#erBranchText"),
      choices: root.querySelector("#erBranchChoices"),
      status: root.querySelector("#erBranchStatus"),
      continueButton: root.querySelector("#erBranchContinue")
    };
    ui.continueButton.addEventListener("click", (event) => {
      event.preventDefault();
      advanceDialogue();
    });
    root.querySelector("[data-branch-close]")?.addEventListener("click", () => closeDialogue());
    ui.choices.addEventListener("click", (event) => {
      const button = event.target.closest("[data-branch-option]");
      if (!button || button.disabled) return;
      chooseOption(Number(button.dataset.branchOption));
    });
    return ui;
  }

  function drawPortrait(portrait, npcName) {
    const elements = buildUi();
    const canvasEl = elements.portrait;
    const portraitContext = canvasEl.getContext("2d");
    portraitContext.clearRect(0, 0, canvasEl.width, canvasEl.height);
    elements.portraitFallback.textContent = String(npcName || "ER").split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
    elements.portraitFallback.classList.remove("is-hidden");
    canvasEl.classList.add("is-empty");
    if (!portrait?.src) return;

    let image = portraitCache.get(portrait.src);
    if (!image) {
      image = new Image();
      image.decoding = "async";
      image.src = `${portrait.src}?v=${PATCH_ID}`;
      portraitCache.set(portrait.src, image);
    }

    const paint = () => {
      if (!image.complete || !image.naturalWidth) return;
      const columns = Math.max(1, Number(portrait.columns || 1));
      const rows = Math.max(1, Number(portrait.rows || 1));
      const column = Math.max(0, Math.min(columns - 1, Number(portrait.column || 0)));
      const row = Math.max(0, Math.min(rows - 1, Number(portrait.row || 0)));
      const sourceWidth = Math.floor(image.naturalWidth / columns);
      const sourceHeight = Math.floor(image.naturalHeight / rows);
      const scale = Math.min((canvasEl.width - 8) / sourceWidth, (canvasEl.height - 8) / sourceHeight);
      const width = Math.max(1, Math.round(sourceWidth * scale));
      const height = Math.max(1, Math.round(sourceHeight * scale));
      portraitContext.clearRect(0, 0, canvasEl.width, canvasEl.height);
      portraitContext.imageSmoothingEnabled = false;
      portraitContext.drawImage(
        image,
        column * sourceWidth,
        row * sourceHeight,
        sourceWidth,
        sourceHeight,
        Math.round((canvasEl.width - width) / 2),
        Math.round((canvasEl.height - height) / 2),
        width,
        height
      );
      elements.portraitFallback.classList.add("is-hidden");
      canvasEl.classList.remove("is-empty");
    };
    if (image.complete) paint();
    else image.addEventListener("load", paint, { once: true });
  }

  function stopTypewriter(reveal = false) {
    if (typewriterFrame) cancelAnimationFrame(typewriterFrame);
    typewriterFrame = 0;
    if (active && reveal) {
      active.typing = false;
      active.visibleCharacters = active.fullText.length;
      buildUi().text.textContent = active.fullText;
    }
  }

  function startTypewriter(text) {
    stopTypewriter(false);
    if (!active) return;
    active.fullText = String(text || "");
    active.visibleCharacters = 0;
    active.typing = true;
    typewriterLastAt = performance.now();
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduceMotion) {
      stopTypewriter(true);
      return;
    }
    const tick = (now) => {
      if (!active || !active.typing) return;
      const elapsed = Math.max(0, now - typewriterLastAt);
      const step = Math.max(1, Math.floor(elapsed / 17));
      if (step > 0) {
        active.visibleCharacters = Math.min(active.fullText.length, active.visibleCharacters + step);
        buildUi().text.textContent = active.fullText.slice(0, active.visibleCharacters);
        typewriterLastAt = now;
      }
      if (active.visibleCharacters >= active.fullText.length) {
        active.typing = false;
        typewriterFrame = 0;
        return;
      }
      typewriterFrame = requestAnimationFrame(tick);
    };
    typewriterFrame = requestAnimationFrame(tick);
  }

  function visibleOptions(node) {
    const source = Array.isArray(node?.options) ? node.options : [];
    return source.map((option, sourceIndex) => ({
      option,
      sourceIndex,
      unlocked: conditionsMet(option.conditions)
    })).filter((entry) => !(entry.option.hideWhenLocked && !entry.unlocked));
  }

  function setSelectedOption(index) {
    if (!active || !active.options.length) return;
    const length = active.options.length;
    let next = ((Number(index || 0) % length) + length) % length;
    if (!active.options[next].unlocked) {
      const direction = next >= active.selectedIndex ? 1 : -1;
      for (let attempt = 0; attempt < length; attempt += 1) {
        next = (next + direction + length) % length;
        if (active.options[next].unlocked) break;
      }
    }
    active.selectedIndex = next;
    const buttons = [...buildUi().choices.querySelectorAll("[data-branch-option]")];
    buttons.forEach((button, buttonIndex) => {
      const selected = buttonIndex === next;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-selected", selected ? "true" : "false");
      if (selected) button.scrollIntoView({ block: "nearest" });
    });
  }

  function renderStatus() {
    if (!ui || !active) return;
    const farming = ensureFarmingState();
    ui.status.textContent = `Moedas: ${Math.max(0, Number(inventory.moedas || 0))} · Sementes: ${farming.seeds} · Colheitas: ${farming.produce}`;
  }

  function renderNode() {
    if (!active) return;
    const dialogue = database?.dialogues?.[active.dialogueId];
    const node = dialogue?.nodes?.[active.nodeId];
    if (!dialogue || !node) {
      closeDialogue();
      return;
    }
    const elements = buildUi();
    active.dialogue = dialogue;
    active.node = node;
    grantNodeRewards(node, active.dialogueId, active.nodeId);
    elements.name.textContent = dialogue.npc?.name || active.target?.name || "NPC";
    elements.title.textContent = dialogue.npc?.title || "Eternal Rift";
    drawPortrait(dialogue.npc?.portrait, elements.name.textContent);
    startTypewriter(formatText(node.text));

    active.options = visibleOptions(node);
    active.selectedIndex = Math.max(0, active.options.findIndex((entry) => entry.unlocked));
    elements.choices.innerHTML = "";
    active.options.forEach((entry, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `er-branch-choice${entry.unlocked ? "" : " is-locked"}`;
      button.dataset.branchOption = String(index);
      button.disabled = !entry.unlocked;
      button.setAttribute("role", "option");
      button.setAttribute("aria-selected", index === active.selectedIndex ? "true" : "false");
      const number = document.createElement("span");
      number.className = "er-branch-choice__number";
      number.textContent = `${index + 1}`;
      const label = document.createElement("span");
      label.className = "er-branch-choice__label";
      label.textContent = formatText(entry.option.text);
      button.append(number, label);
      if (!entry.unlocked) {
        const lock = document.createElement("small");
        lock.className = "er-branch-choice__lock";
        lock.textContent = entry.option.lockedText || "Condição não cumprida";
        button.appendChild(lock);
      }
      elements.choices.appendChild(button);
    });
    elements.choices.classList.toggle("is-empty", active.options.length === 0);
    elements.continueButton.textContent = active.options.length
      ? "Confirmar escolha"
      : (node.continueText || (node.next ? "Continuar" : "Encerrar"));
    elements.continueButton.disabled = active.options.length > 0 && !active.options.some((entry) => entry.unlocked);
    renderStatus();
    if (active.options.length) setSelectedOption(active.selectedIndex);
    pushHistory({ dialogueId: active.dialogueId, nodeId: active.nodeId, kind: "node" });
  }

  function goToNode(nodeId) {
    if (!active) return;
    const dialogue = database?.dialogues?.[active.dialogueId];
    if (!dialogue?.nodes?.[nodeId]) {
      closeDialogue();
      return;
    }
    active.nodeId = nodeId;
    renderNode();
  }

  function chooseOption(index) {
    if (!active) return;
    if (active.typing) stopTypewriter(true);
    const entry = active.options?.[Number(index)];
    if (!entry || !entry.unlocked) {
      notify(entry?.option?.lockedText || "Esta opção ainda está bloqueada.", 2.6);
      safeCall(() => playSound?.("invalid"));
      return;
    }
    const option = entry.option;
    pushHistory({ dialogueId: active.dialogueId, nodeId: active.nodeId, kind: "option", text: option.text });
    const targetNode = option.target;
    const completed = runActions(option.actions);
    if (!completed || !active) return;
    if (targetNode) goToNode(targetNode);
    else closeDialogue();
  }

  function advanceDialogue() {
    if (!active) return;
    if (active.typing) {
      stopTypewriter(true);
      return;
    }
    if (active.options?.length) {
      chooseOption(active.selectedIndex);
      return;
    }
    if (active.node?.next) goToNode(active.node.next);
    else closeDialogue();
  }

  function openDialogue(dialogueId, target = null, startNode = "") {
    const dialogue = database?.dialogues?.[dialogueId];
    if (!dialogue) return false;
    buildUi();
    safeCall(() => closeDialog?.());
    active = {
      dialogueId,
      dialogue,
      target,
      nodeId: startNode || dialogue.startNode || database.defaultStartNode || "intro",
      node: null,
      options: [],
      selectedIndex: 0,
      typing: false,
      fullText: "",
      visibleCharacters: 0
    };
    dialogOpen = true;
    ui.root.classList.remove("is-hidden");
    ui.root.setAttribute("aria-hidden", "false");
    document.body.classList.add("er-branch-dialogue-open");
    safeCall(() => playSound?.("npc"));
    renderNode();
    window.setTimeout(() => ui?.continueButton?.focus?.({ preventScroll: true }), 0);
    return true;
  }

  function closeDialogue() {
    stopTypewriter(false);
    if (ui) {
      ui.root.classList.add("is-hidden");
      ui.root.setAttribute("aria-hidden", "true");
    }
    document.body.classList.remove("er-branch-dialogue-open");
    active = null;
    dialogOpen = false;
    safeCall(() => updateInteractionHint?.());
  }

  function findDialogueIdForTarget(target) {
    if (!target) return "";
    if (target.type === "blacksmithNpc" || target.role === "blacksmithMaster") return "blacksmith_branor";
    return NPC_DIALOGUE_MAP[String(target.name || "")] || "";
  }

  function loadData(data) {
    if (!data?.dialogues || typeof data.dialogues !== "object") throw new Error("JSON de diálogos inválido.");
    database = data;
    document.body.classList.add("er-branch-dialogue-ready");
    return Object.keys(database.dialogues).length;
  }

  const toggleInteractionBeforeBranching = typeof toggleInteraction === "function" ? toggleInteraction : null;
  toggleInteraction = function toggleInteractionBranchingDialogue() {
    if (active) {
      advanceDialogue();
      return;
    }
    const target = safeCall(() => findInteraction?.(), null);
    const dialogueId = findDialogueIdForTarget(target);
    if (database && dialogueId && database.dialogues?.[dialogueId]) {
      openDialogue(dialogueId, target);
      return;
    }
    return toggleInteractionBeforeBranching ? toggleInteractionBeforeBranching.apply(this, arguments) : undefined;
  };

  const setActiveSceneBeforeBranching = typeof setActiveScene === "function" ? setActiveScene : null;
  setActiveScene = function setActiveSceneBranchingDialogue() {
    if (active) closeDialogue();
    return setActiveSceneBeforeBranching ? setActiveSceneBeforeBranching.apply(this, arguments) : undefined;
  };

  const loadGameBeforeBranching = typeof loadGame === "function" ? loadGame : null;
  loadGame = function loadGameBranchingDialogue() {
    const result = loadGameBeforeBranching ? loadGameBeforeBranching.apply(this, arguments) : false;
    ensureSystemState();
    applyStoredWeaponUpgrades();
    return result;
  };

  const saveGameBeforeBranching = typeof saveGame === "function" ? saveGame : null;
  saveGame = function saveGameBranchingDialogue() {
    ensureSystemState();
    applyStoredWeaponUpgrades();
    return saveGameBeforeBranching ? saveGameBeforeBranching.apply(this, arguments) : undefined;
  };

  const resetProgressBeforeBranching = typeof resetProgressForNewGame === "function" ? resetProgressForNewGame : null;
  resetProgressForNewGame = function resetProgressForNewGameBranchingDialogue() {
    if (active) closeDialogue();
    const result = resetProgressBeforeBranching ? resetProgressBeforeBranching.apply(this, arguments) : undefined;
    questBook.branchingDialogue = {
      missions: {}, items: {}, itemMeta: {}, claimedRewards: {}, executedActions: {}, weaponUpgrades: {}, history: []
    };
    for (const [key, damage] of weaponBaseDamage.entries()) {
      if (weapons?.[key]) weapons[key].damage = damage;
    }
    return result;
  };

  const getInventoryItemsBeforeBranching = typeof getInventoryItems === "function" ? getInventoryItems : null;
  if (getInventoryItemsBeforeBranching) {
    getInventoryItems = function getInventoryItemsWithDialogueRewards() {
      const baseItems = getInventoryItemsBeforeBranching.apply(this, arguments) || [];
      const state = ensureSystemState();
      const dialogueItems = Object.entries(state.items)
        .filter(([, quantity]) => Number(quantity) > 0)
        .map(([itemId, quantity]) => {
          const meta = state.itemMeta[itemId] || {};
          return {
            id: `branching-${itemId}`,
            name: meta.name || itemId.replace(/[_-]+/g, " "),
            icon: "◆",
            quantity: Math.max(0, Number(quantity || 0)),
            category: meta.category || "materiais",
            typeLabel: "Item de diálogo",
            rarity: meta.rarity || "incomum",
            description: meta.description || "Item recebido durante uma conversa na vila.",
            effect: meta.effect || "Pode ser usado em diálogos, missões e trocas.",
            locked: true,
            dialogueItemId: itemId
          };
        });
      return [...baseItems, ...dialogueItems];
    };
  }

  document.addEventListener("keydown", (event) => {
    if (!active) return;
    const key = String(event.key || "").toLowerCase();
    if (["e", "enter", "arrowup", "arrowdown", "w", "s", "escape"].includes(key) || /^[1-9]$/.test(key)) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation?.();
    }
    if (key === "escape") {
      closeDialogue();
      return;
    }
    if (key === "arrowup" || key === "w") {
      setSelectedOption(active.selectedIndex - 1);
      return;
    }
    if (key === "arrowdown" || key === "s") {
      setSelectedOption(active.selectedIndex + 1);
      return;
    }
    if (/^[1-9]$/.test(key)) {
      chooseOption(Number(key) - 1);
      return;
    }
    if (key === "e" || key === "enter") advanceDialogue();
  }, true);

  window.addEventListener("pagehide", () => {
    if (active) queueAutosave("branching-dialogue-pagehide");
  });

  buildUi();
  ensureSystemState();
  applyStoredWeaponUpgrades();

  window.ETERNAL_RIFT_BRANCHING_DIALOGUE = {
    version: PATCH_ID,
    open: openDialogue,
    close: closeDialogue,
    advance: advanceDialogue,
    choose: chooseOption,
    loadData,
    isOpen: () => Boolean(active),
    getActive: () => active ? { dialogueId: active.dialogueId, nodeId: active.nodeId, selectedIndex: active.selectedIndex } : null,
    getState: () => ensureSystemState(),
    getItemCount,
    checkCondition,
    runAction: performAction,
    findDialogueIdForTarget
  };

  fetch(DATA_URL, { cache: "no-store" })
    .then((response) => {
      if (!response.ok) throw new Error(`Falha ao carregar diálogos (${response.status}).`);
      return response.json();
    })
    .then((data) => {
      const count = loadData(data);
      console.log(`Eternal Rift Branching Dialogue carregado: ${count} árvores.`);
    })
    .catch((error) => {
      console.error("Eternal Rift: não foi possível carregar o JSON de diálogos.", error);
      notify("Não foi possível carregar os diálogos interativos.", 3.2);
    });
})();
