"use strict";

/*
 * ETERNAL RIFT — DUAS CASAS DO JOGADOR V5
 *
 * A casa original continua usando a cena `home` e os objetos originais.
 * A segunda casa usa a mesma infraestrutura segura de interiores, mas troca
 * temporariamente mapa/objetos apenas enquanto o modo `rogue` está ativo.
 * Fachada e quarto são montados com peças independentes de dois atlases.
 * Nenhum atlas é desenhado inteiro e nenhuma referência é usada como fundo.
 */
(function installDualPlayerHousesV5() {
  if (!window.ETERNAL_RIFT_DUAL_PLAYER_HOMES) return;
  const BUILD = "dual-player-houses-v5-real-tiles-20260717";
  if (window.ETERNAL_RIFT_DUAL_HOUSES?.build === BUILD) return;

  const HOUSE = Object.freeze({ tx: 59, ty: 45, tw: 7, th: 5 });
  const ENTRY = Object.freeze({ left: 14, width: 2, row: 19 });
  const SCENERY_TYPES = new Set(["tree", "rock", "fence", "flower", "outdoorDecor", "bench", "sign"]);

  const interiorAtlas = new Image();
  interiorAtlas.decoding = "async";
  interiorAtlas.src = `assets/rogue-room-atlas-v4.png?v=${BUILD}`;
  const exteriorAtlas = new Image();
  exteriorAtlas.decoding = "async";
  exteriorAtlas.src = `assets/rogue-house-exterior-atlas-v5.png?v=${BUILD}`;

  const I = Object.freeze({
    floor:{x:52,y:58,w:220,h:224}, wall:{x:346,y:50,w:105,h:239}, beam:{x:451,y:34,w:38,h:255},
    bed:{x:665,y:34,w:199,h:272}, rug:{x:943,y:51,w:260,h:242}, bannerMasks:{x:69,y:355,w:187,h:240},
    clothes:{x:360,y:355,w:214,h:237}, weapons:{x:681,y:348,w:175,h:229}, bookshelf:{x:971,y:337,w:207,h:277},
    planningDesk:{x:46,y:665,w:236,h:219}, alchemy:{x:348,y:660,w:253,h:224}, divider:{x:666,y:638,w:206,h:252},
    candle:{x:1029,y:647,w:112,h:246}, dummy:{x:38,y:918,w:255,h:260}, storage:{x:340,y:954,w:247,h:198},
    plant:{x:646,y:958,w:105,h:221}, cabinet:{x:748,y:965,w:119,h:214}, exit:{x:914,y:934,w:311,h:270}
  });
  const E = Object.freeze({
    roof:{x:47,y:48,w:230,h:238}, ridge:{x:337,y:100,w:274,h:148}, wall:{x:680,y:51,w:212,h:239},
    foundation:{x:962,y:104,w:238,h:174}, window:{x:47,y:392,w:235,h:177}, door:{x:361,y:346,w:245,h:268},
    chimney:{x:720,y:344,w:110,h:257}, banner:{x:1004,y:353,w:156,h:239}, fence:{x:34,y:706,w:282,h:161},
    lantern:{x:433,y:683,w:91,h:185}, shrub:{x:715,y:640,w:130,h:244}, steps:{x:948,y:692,w:253,h:183},
    mailbox:{x:93,y:936,w:130,h:265}, pillar:{x:400,y:940,w:137,h:269}, flowers:{x:659,y:991,w:208,h:177},
    gable:{x:940,y:937,w:259,h:258}
  });

  const state = {
    mode: "legacy",
    enteringRogue: false,
    legacyMap: homeMap.map((row) => row.slice()),
    legacyObjects: homeObjects.slice(),
    rogueMap: Array.from({ length: HOME_ROWS }, () => Array(HOME_COLS).fill("I")),
    rogueObjects: [],
    house: null,
    pixi: null
  };

  function imageReady(image) {
    return image.complete && image.naturalWidth > 0 && image.naturalHeight > 0;
  }

  function copyMap(target, source) {
    for (let y = 0; y < Math.min(target.length, source.length); y += 1) {
      for (let x = 0; x < Math.min(target[y].length, source[y].length); x += 1) target[y][x] = source[y][x];
    }
  }

  function captureLegacyHome() {
    if (state.mode === "rogue") return;
    state.legacyMap = homeMap.map((row) => row.slice());
    state.legacyObjects = homeObjects.slice();
  }

  function restoreLegacyHome() {
    copyMap(homeMap, state.legacyMap);
    homeObjects.splice(0, homeObjects.length, ...state.legacyObjects);
    if (currentScene === "home" && state.mode === "legacy") {
      objects = homeObjects;
      colliders = objects.filter((obj) => obj?.solid);
      interactables = objects.filter((obj) => obj?.message);
    }
  }

  function roomObject(id, frame, tx, ty, tw, th, solid, layer, action, message) {
    return {
      type: "furniture", id: `rogue-v5-${id}`, kind: `rogueV5_${frame}`, frame,
      x: tx * TILE, y: ty * TILE, width: tw * TILE, height: th * TILE,
      solid: Boolean(solid), layer, rogueRoomV5: true, rogueAction: action || "look", message: message || ""
    };
  }

  function wall(id, tx, ty, tw, th) {
    return { type: "block", id: `rogue-v5-${id}`, x: tx*TILE, y: ty*TILE, width: tw*TILE, height: th*TILE, solid: true, rogueRoomV5: true };
  }

  function buildRogueInterior() {
    for (let y = 0; y < HOME_ROWS; y += 1) {
      for (let x = 0; x < HOME_COLS; x += 1) {
        const gap = y === HOME_ROWS - 1 && x >= ENTRY.left && x < ENTRY.left + ENTRY.width;
        state.rogueMap[y][x] = (y === 0 || x === 0 || x === HOME_COLS - 1 || (y === HOME_ROWS - 1 && !gap)) ? "B" : "I";
      }
    }
    state.rogueObjects = [
      wall("top",0,0,30,1), wall("left",0,0,1,20), wall("right",29,0,1,20),
      wall("bottom-left",0,19,14,1), wall("bottom-right",16,19,14,1),

      roomObject("bed-rug","rug",1,5,7,5,false,"ground","look","Tapete escuro da área de descanso."),
      roomObject("center-rug","rug",10,8,8,5,false,"ground","Tapete com o símbolo da irmandade."),
      roomObject("training-rug","rug",20,13,8,5,false,"ground","Tapete da área de treinamento."),
      roomObject("bed","bed",2,2,4,4,true,"furniture","sleep","Cama do refúgio Rogue."),
      roomObject("masks-left","bannerMasks",5,1,2,3,false,"back","look","Estandarte, máscaras e símbolos da irmandade."),
      roomObject("masks-right","bannerMasks",27,1,2,3,false,"back","look","Máscaras de antigos agentes."),
      roomObject("divider","divider",8,4,2,4,true,"furniture","look","Biombo de madeira e tecido."),
      roomObject("clothes-a","clothes",10,1,3,4,true,"furniture","wardrobe","Capas e roupas de infiltração."),
      roomObject("clothes-b","clothes",13,1,3,4,true,"furniture","wardrobe","Trajes escuros organizados no suporte."),
      roomObject("wall-weapons","weapons",16,1,3,3,true,"furniture","weapons","Adagas e espadas curtas expostas."),
      roomObject("books","bookshelf",19,1,3,4,true,"furniture","read","Livros, frascos e registros secretos."),
      roomObject("planning","planningDesk",22,1,6,4,true,"furniture","study","Mesa de planejamento com mapa e papéis."),
      roomObject("alchemy","alchemy",1,10,5,4,true,"furniture","read","Bancada de poções, venenos e antídotos."),
      roomObject("left-weapons","weapons",5,11,3,3,true,"furniture","weapons","Lâminas de reserva e ferramentas."),
      roomObject("strategy","planningDesk",11,9,6,3,true,"furniture","study","Mesa central de estratégia."),
      roomObject("chest","storage",12,14,4,3,true,"furniture","chest","Baú, barril e caixas do refúgio."),
      roomObject("storage-left","storage",1,15,4,3,true,"furniture","storage","Suprimentos guardados com cuidado."),
      roomObject("storage-right","storage",25,11,3,5,true,"furniture","storage","Caixas e materiais de missão."),
      roomObject("dummy","dummy",22,14,3,4,true,"furniture","train","Boneco de treinamento marcado por golpes."),
      roomObject("plant-a","plant",1,6,2,3,true,"furniture","look","Planta cultivada dentro do refúgio."),
      roomObject("plant-b","plant",27,5,2,3,true,"furniture","look","Planta ornamental do aposento."),
      roomObject("candle-a","candle",7,6,1,2,false,"front","lamp","Candelabro de luz quente."),
      roomObject("candle-b","candle",18,7,1,2,false,"front","lamp","Candelabro de luz quente."),
      roomObject("candle-c","candle",27,9,1,2,false,"front","lamp","Candelabro de luz quente."),
      roomObject("exit","exit",14,18,2,1,false,"back","exit","Saída para a nova casa.")
    ];
  }

  function installRogueInterior() {
    copyMap(homeMap, state.rogueMap);
    homeObjects.splice(0, homeObjects.length, ...state.rogueObjects);
    objects = homeObjects;
    colliders = objects.filter((obj) => obj?.solid);
    interactables = objects.filter((obj) => obj?.message);
  }

  function overlap(a, b) {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
  }

  function terrainForNewHouse() {
    if (!Array.isArray(worldMap)) return;
    for (let ty = HOUSE.ty - 2; ty <= HOUSE.ty + HOUSE.th + 4; ty += 1) {
      for (let tx = HOUSE.tx - 2; tx <= HOUSE.tx + HOUSE.tw + 2; tx += 1) {
        if (worldMap[ty]?.[tx] !== undefined && worldMap[ty][tx] !== "W") worldMap[ty][tx] = "G";
      }
    }
    // Caminho próprio ligado à trilha existente, sem alterar outros edifícios.
    for (let step = 0; step <= 11; step += 1) {
      const t = step / 11;
      const tx = Math.round(60 + (62 - 60) * t);
      const ty = Math.round(40 + (52 - 40) * t);
      for (let ox = -1; ox <= 1; ox += 1) if (worldMap[ty]?.[tx + ox] !== undefined) worldMap[ty][tx + ox] = "D";
    }
  }

  function exteriorDecor(id, frame, tx, ty, tw, th, solid = false) {
    return { type:"rogueHouseDecor", id:`rogue-house-v5-${id}`, frame, x:tx*TILE, y:ty*TILE, width:tw*TILE, height:th*TILE, solid, rogueHouseV5:true };
  }

  function ensureRogueHouse() {
    let house = villageObjects.find((obj) => obj?.id === "rogue-player-house-v5");
    if (!house) {
      const footprint = { x:(HOUSE.tx-2)*TILE, y:(HOUSE.ty-2)*TILE, width:(HOUSE.tw+4)*TILE, height:(HOUSE.th+7)*TILE };
      for (let i = villageObjects.length - 1; i >= 0; i -= 1) {
        const obj = villageObjects[i];
        if (obj && SCENERY_TYPES.has(obj.type) && overlap(footprint, obj)) villageObjects.splice(i, 1);
      }
      house = {
        type:"roguePlayerHouse", id:"rogue-player-house-v5", role:"secondPlayerHouse",
        title:"Refúgio Rogue", name:"Nova Casa do Jogador", x:HOUSE.tx*TILE, y:HOUSE.ty*TILE,
        width:HOUSE.tw*TILE, height:HOUSE.th*TILE, solid:true, message:"Entrar no Refúgio Rogue",
        rogueHouseV5:true
      };
      villageObjects.push(
        house,
        exteriorDecor("fence-left","fence",57,51,5,2,true),
        exteriorDecor("fence-right","fence",65,51,4,2,true),
        exteriorDecor("pillar-left","pillar",61,50,1,2,true),
        exteriorDecor("pillar-right","pillar",65,50,1,2,true),
        exteriorDecor("mailbox","mailbox",57,49,1,2,true),
        exteriorDecor("flowers-left","flowers",57,48,2,1,false),
        exteriorDecor("flowers-right","flowers",66,48,2,1,false)
      );
    }
    state.house = house;
    terrainForNewHouse();
    if (currentScene === "village") {
      objects = villageObjects;
      colliders = objects.filter((obj) => obj?.solid);
      interactables = objects.filter((obj) => obj?.message);
    }
    return house;
  }

  function frameDraw(image, frames, name, dx, dy, dw, dh, alpha = 1) {
    const f = frames[name];
    if (!f || !imageReady(image)) return false;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(image, f.x, f.y, f.w, f.h, Math.round(dx), Math.round(dy), Math.round(dw), Math.round(dh));
    ctx.restore();
    return true;
  }

  function contained(image, frames, name, obj, widthScale = 1, heightScale = 1, offsetY = 0) {
    const f = frames[name];
    if (!f || !imageReady(image)) return false;
    const scale = Math.min(obj.width * widthScale / f.w, obj.height * heightScale / f.h);
    const dw = f.w * scale;
    const dh = f.h * scale;
    return frameDraw(image, frames, name, obj.x + obj.width/2 - dw/2, obj.y + obj.height - dh + offsetY, dw, dh);
  }

  function ellipseShadow(x, y, rx, ry, alpha = .25) {
    ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = "#000"; ctx.beginPath(); ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2); ctx.fill(); ctx.restore();
  }

  function drawRogueHouseExterior(obj) {
    if (!imageReady(exteriorAtlas)) return false;
    const x=obj.x, y=obj.y, w=obj.width, h=obj.height;
    ellipseShadow(x+w/2,y+h+7,w*.48,10,.28);
    // Parede e fundação são módulos repetidos, alinhados à grade da casa.
    for (let px=x+10; px<x+w-10; px+=64) {
      const pieceWidth=Math.min(66,x+w-10-px);
      if(pieceWidth>0)frameDraw(exteriorAtlas,E,"wall",px,y+55,pieceWidth,h-55);
    }
    frameDraw(exteriorAtlas,E,"foundation",x+8,y+h-43,w-16,47);
    // Telhado por dois módulos e cumeeira independente.
    frameDraw(exteriorAtlas,E,"roof",x-9,y-27,w/2+14,99);
    frameDraw(exteriorAtlas,E,"roof",x+w/2-5,y-27,w/2+14,99);
    frameDraw(exteriorAtlas,E,"ridge",x-5,y-34,w+10,48);
    frameDraw(exteriorAtlas,E,"gable",x+w/2-58,y+2,116,94);
    frameDraw(exteriorAtlas,E,"chimney",x+w-50,y-27,30,78);
    frameDraw(exteriorAtlas,E,"window",x+20,y+86,52,42);
    frameDraw(exteriorAtlas,E,"window",x+w-72,y+86,52,42);
    frameDraw(exteriorAtlas,E,"door",x+w/2-37,y+73,74,91);
    frameDraw(exteriorAtlas,E,"lantern",x+w/2-62,y+90,23,46);
    frameDraw(exteriorAtlas,E,"banner",x+w-42,y+67,31,55);
    frameDraw(exteriorAtlas,E,"shrub",x+w/2-70,y+111,34,57);
    frameDraw(exteriorAtlas,E,"shrub",x+w/2+36,y+111,34,57);
    frameDraw(exteriorAtlas,E,"steps",x+w/2-48,y+h-3,96,42);
    return true;
  }

  function drawRogueHouseDecor(obj) {
    if (!imageReady(exteriorAtlas)) return false;
    return frameDraw(exteriorAtlas,E,obj.frame,obj.x,obj.y,obj.width,obj.height);
  }

  function floorPatch(dx,dy,size,flip) {
    const f=I.floor;
    ctx.save(); ctx.imageSmoothingEnabled=false;
    if (flip) { ctx.translate(dx+size,dy); ctx.scale(-1,1); ctx.drawImage(interiorAtlas,f.x,f.y,f.w,f.h,0,0,size,size); }
    else ctx.drawImage(interiorAtlas,f.x,f.y,f.w,f.h,dx,dy,size,size);
    ctx.restore();
  }

  function drawRogueBackdrop() {
    ctx.fillStyle="#070609"; ctx.fillRect(0,0,HOME_WIDTH,HOME_HEIGHT);
    if (!imageReady(interiorAtlas)) return;
    const patch=TILE*4;
    for(let y=TILE*3;y<HOME_HEIGHT-TILE;y+=patch) for(let x=TILE;x<HOME_WIDTH-TILE;x+=patch) floorPatch(x,y,patch,((x/patch+y/patch)&1)===1);
    for(let x=TILE;x<HOME_WIDTH-TILE;x+=TILE*3) frameDraw(interiorAtlas,I,"wall",x,0,TILE*3,TILE*4);
    for(let x=TILE;x<HOME_WIDTH-TILE;x+=TILE*4) frameDraw(interiorAtlas,I,"beam",x-5,0,20,TILE*4);
    for(let y=TILE*4;y<HOME_HEIGHT-TILE;y+=TILE*3){frameDraw(interiorAtlas,I,"wall",0,y,TILE,TILE*3);frameDraw(interiorAtlas,I,"wall",HOME_WIDTH-TILE,y,TILE,TILE*3);}
    for(let x=0;x<HOME_WIDTH;x+=TILE*3){if(x>=TILE*12&&x<=TILE*16)continue;frameDraw(interiorAtlas,I,"wall",x,HOME_HEIGHT-TILE,TILE*3,TILE);}
    const shade=ctx.createLinearGradient(0,0,0,HOME_HEIGHT);shade.addColorStop(0,"rgba(7,4,9,.40)");shade.addColorStop(.3,"rgba(7,4,9,.08)");shade.addColorStop(1,"rgba(3,2,5,.25)");ctx.fillStyle=shade;ctx.fillRect(0,0,HOME_WIDTH,HOME_HEIGHT);
  }

  function drawRogueRoomObject(obj) {
    if (!obj?.rogueRoomV5 || obj.type === "block" || !imageReady(interiorAtlas)) return;
    const f=I[obj.frame]; if(!f)return;
    if(obj.frame==="rug"){frameDraw(interiorAtlas,I,"rug",obj.x+2,obj.y+2,obj.width-4,obj.height-4,.96);return;}
    if(obj.frame==="exit"){frameDraw(interiorAtlas,I,"exit",obj.x-TILE,obj.y-TILE*3,obj.width+TILE*2,TILE*4);return;}
    ellipseShadow(obj.x+obj.width/2,obj.y+obj.height-3,Math.max(7,obj.width*.38),Math.max(3,obj.height*.045),.24);
    const sizes={bed:[1.12,1.45],bannerMasks:[1,1.12],clothes:[1.14,1],weapons:[1.12,1.12],bookshelf:[1,1],planningDesk:[1.04,1.28],alchemy:[1.08,1.12],divider:[1.1,1],candle:[1.2,2.2],dummy:[1.24,1],storage:[1.08,1.24],plant:[1.3,1.24]};
    const scale=sizes[obj.frame]||[1,1];contained(interiorAtlas,I,obj.frame,obj,scale[0],scale[1]);
    if(obj.frame==="candle"){
      const cx=obj.x+obj.width/2,cy=obj.y+8,r=58+Math.sin(performance.now()/180)*4;ctx.save();ctx.globalCompositeOperation="lighter";const g=ctx.createRadialGradient(cx,cy,1,cx,cy,r);g.addColorStop(0,"rgba(255,220,126,.32)");g.addColorStop(.38,"rgba(255,151,53,.14)");g.addColorStop(1,"rgba(255,112,25,0)");ctx.fillStyle=g;ctx.fillRect(cx-r,cy-r,r*2,r*2);ctx.restore();
    }
  }

  function drawRogueLighting() {
    ctx.save();
    const vignette=ctx.createRadialGradient(HOME_WIDTH/2,HOME_HEIGHT/2,HOME_HEIGHT*.22,HOME_WIDTH/2,HOME_HEIGHT/2,HOME_WIDTH*.66);
    vignette.addColorStop(0,"rgba(0,0,0,0)");vignette.addColorStop(.72,"rgba(4,2,6,.10)");vignette.addColorStop(1,"rgba(4,2,6,.52)");ctx.fillStyle=vignette;ctx.fillRect(0,0,HOME_WIDTH,HOME_HEIGHT);ctx.restore();
  }

  function drawRogueInteriorScene() {
    ensureCanvasSize();ctx.clearRect(0,0,canvas.width,canvas.height);ctx.save();applyGameCameraTransform(ctx);drawRogueBackdrop();
    state.rogueObjects.filter((o)=>o.layer==="ground").forEach(drawRogueRoomObject);
    state.rogueObjects.filter((o)=>o.layer==="back").forEach(drawRogueRoomObject);
    const sorted=[...state.rogueObjects.filter((o)=>o.type!=="block"&&!["ground","back"].includes(o.layer)),{type:"__roguePlayer",x:player.x,y:player.y,width:player.width,height:player.height}]
      .sort((a,b)=>(a.y+a.height)-(b.y+b.height));
    for(const item of sorted){if(item.type==="__roguePlayer")drawPlayer();else drawRogueRoomObject(item);}
    drawRogueLighting();drawMobileTargetMark?.();drawAttack?.();drawProjectiles?.();drawShockwaves?.();drawDashTrails?.();drawHealBursts?.();drawFloatingTexts?.();drawAimCursor?.();ctx.restore();drawMiniMap?.();
  }

  function houseDoor() {
    const h=state.house;return h?{x:h.x+h.width/2-38,y:h.y+h.height-16,width:76,height:52}:null;
  }

  function playerCenter() { return {x:player.x+player.width/2,y:player.y+player.height/2,width:1,height:1}; }

  function enterRogueHome() {
    captureLegacyHome();
    state.enteringRogue=true;state.mode="rogue";lastVillagePosition={x:player.x,y:player.y};
    setActiveScene("home");installRogueInterior();state.enteringRogue=false;
    player.x=15*TILE-player.width/2;player.y=17*TILE;player.direction="up";camera.x=0;camera.y=0;
    questBook.rogueHouseDiscovered=true;showHudToast?.("Você entrou no Refúgio Rogue.",2.2);
  }

  function exitRogueHome() {
    setActiveScene("village");state.mode="legacy";restoreLegacyHome();ensureRogueHouse();
    const h=state.house;player.x=h.x+h.width/2-player.width/2;player.y=h.y+h.height+38;player.direction="down";
    showHudToast?.("Você saiu do Refúgio Rogue.",1.8);
  }

  buildRogueInterior();
  terrainForNewHouse();
  ensureRogueHouse();

  const previousEnterHome=enterHome;
  enterHome=function enterLegacyPlayerHomeV5(){state.mode="legacy";restoreLegacyHome();const result=previousEnterHome.apply(this,arguments);captureLegacyHome();return result;};

  const previousSetScene=setActiveScene;
  setActiveScene=function setSceneDualHomesV5(scene){
    if(scene==="home"&&!state.enteringRogue){state.mode="legacy";restoreLegacyHome();}
    const result=previousSetScene.apply(this,arguments);
    if(scene==="home"&&state.enteringRogue){state.mode="rogue";installRogueInterior();}
    if(currentScene==="village")ensureRogueHouse();
    return result;
  };

  const previousTransitions=handleMapTransitions;
  handleMapTransitions=function handleDualHouseTransitionsV5(){
    if(currentScene==="village"){
      ensureRogueHouse();const door=houseDoor();if(door&&overlap(playerCenter(),door)){enterRogueHome();return;}
    }
    if(currentScene==="home"&&state.mode==="rogue"){
      const c=playerCenter();if(c.x>=ENTRY.left*TILE&&c.x<=(ENTRY.left+ENTRY.width)*TILE&&c.y>=ENTRY.row*TILE-10)exitRogueHome();return;
    }
    return previousTransitions.apply(this,arguments);
  };

  const previousDrawObject=drawObject;
  drawObject=function drawDualHouseObjectV5(obj){
    if(obj?.type==="roguePlayerHouse"){if(drawRogueHouseExterior(obj))return;return drawHouse?.({...obj,type:"house"});}
    if(obj?.type==="rogueHouseDecor"){if(drawRogueHouseDecor(obj))return;return;}
    return previousDrawObject.apply(this,arguments);
  };

  const previousDraw=draw;
  draw=function drawDualHomesV5(){if(currentScene==="home"&&state.mode==="rogue")return drawRogueInteriorScene();return previousDraw.apply(this,arguments);};

  const previousName=getSceneName;
  getSceneName=function getDualHomeSceneNameV5(){if(currentScene==="home"&&state.mode==="rogue")return "Refúgio Rogue";return previousName.apply(this,arguments);};

  const previousZoom=getGameCameraZoom;
  getGameCameraZoom=function getDualHomeZoomV5(){if(currentScene==="home"&&state.mode==="rogue")return Math.max(canvas.width/HOME_WIDTH,canvas.height/HOME_HEIGHT);return previousZoom.apply(this,arguments);};

  const previousMessage=getQuestMessage;
  getQuestMessage=function getRogueRoomMessageV5(obj){
    if(!obj?.rogueRoomV5||state.mode!=="rogue")return previousMessage.apply(this,arguments);
    if(obj.rogueAction==="sleep"){player.health=player.maxHealth;player.mana=player.maxMana;saveGame?.();return "Você descansou no Refúgio Rogue. Vida e mana restauradas; jogo salvo.";}
    if(obj.rogueAction==="wardrobe"||obj.rogueAction==="weapons"){try{inventoryTab="armas";toggleInventory?.(true);renderInventory?.();}catch(error){}return obj.message;}
    if(obj.rogueAction==="study"){if(!questBook.rogueStudyAt||Date.now()-questBook.rogueStudyAt>45000){questBook.rogueStudyAt=Date.now();awardXp?.(35,"Planejamento no Refúgio Rogue");}return obj.message;}
    if(obj.rogueAction==="chest"){try{toggleInventory?.(true);renderInventory?.();}catch(error){}return obj.message;}
    if(obj.rogueAction==="train"){player.mana=Math.min(player.maxMana,player.mana+1);return "Você treinou alguns golpes rápidos. Mana +1.";}
    return obj.message||"Você observa o novo refúgio.";
  };

  const previousLoad=loadGame;
  loadGame=function loadGameDualHomesV5(){state.mode="legacy";restoreLegacyHome();const result=previousLoad.apply(this,arguments);ensureRogueHouse();captureLegacyHome();return result;};

  async function initPixiPresenter() {
    try {
      if(!window.PIXI||!canvas)return;
      const overlay=document.createElement("canvas");overlay.id="pixiRogueSecondHomeCanvas";overlay.className="er-pixi-bedroom-canvas";overlay.setAttribute("aria-hidden","true");canvas.insertAdjacentElement("afterend",overlay);
      const app=new PIXI.Application();await app.init({canvas:overlay,width:canvas.width,height:canvas.height,backgroundAlpha:0,antialias:false,resolution:1,autoDensity:false,preference:"webgl"});app.ticker.stop();
      const names=["groundLayer","terrainLayer","decorationBackLayer","furnitureLayer","entityLayer","decorationFrontLayer","effectLayer","lightingLayer"];
      const layers={};for(const name of names){const layer=new PIXI.Container();layer.label=name;layers[name]=layer;app.stage.addChild(layer);}
      const texture=PIXI.Texture.from(canvas);texture.source.scaleMode="nearest";const scene=new PIXI.Sprite(texture);scene.label="liveRogueSecondHomeTileMap";scene.eventMode="none";layers.furnitureLayer.addChild(scene);
      state.pixi={app,overlay,layers,texture,scene,lastW:0,lastH:0};
      const drawBeforePresenter=draw;
      draw=function drawWithSecondHomePixiV5(){const result=drawBeforePresenter.apply(this,arguments);presentPixi();return result;};
      window.ETERNAL_RIFT_PIXI_SECOND_HOME={build:BUILD,layers,state,usesStaticBackground:false,usesGraphicsForRoomArt:false};
    }catch(error){console.warn("[Eternal Rift] Pixi fallback seguro da segunda casa:",error);}
  }

  function presentPixi(){
    const p=state.pixi;if(!p)return;const active=currentScene==="home"&&state.mode==="rogue";p.overlay.classList.toggle("is-active",active);if(!active)return;
    if(p.lastW!==canvas.width||p.lastH!==canvas.height){p.lastW=canvas.width;p.lastH=canvas.height;p.app.renderer.resize(canvas.width,canvas.height);p.scene.width=canvas.width;p.scene.height=canvas.height;}
    p.texture.source.update();p.app.renderer.render(p.app.stage);
  }

  interiorAtlas.decode?.().catch(()=>{});exteriorAtlas.decode?.().catch(()=>{});initPixiPresenter();
  window.ETERNAL_RIFT_DUAL_HOUSES={build:BUILD,state,house:state.house,enterRogueHome,exitRogueHome,rogueObjects:state.rogueObjects};
})();
