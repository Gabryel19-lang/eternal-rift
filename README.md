

# village-house-static-main-village-20260707
- Exterior das casas da vila trocado para sprites reais baseados exatamente nas imagens enviadas pelo usuário: CASA.png e CASA (2).png.
- Nenhuma imagem nova foi gerada; os arquivos enviados foram usados como assets com fundo transparente.
- O desenho das casas agora usa drawImage no Canvas: assets/casa-blue-reference.png e assets/casa-red-reference.png.
- Mobile preservado: HUD mobile, joystick, hotbar mobile e inventário legado não foram alterados.
- HUD PC interativo e rotbar antiga oculta no PC foram mantidos.
- node --check app.js passou sem erro.

# village-house-exterior-redesign-20260707
- Exterior das casas da vila redesenhado em Canvas, inspirado nas imagens CASA.png e CASA (2).png.
- Casas agora têm telhado azul/pedra ou telhado terracota/madeira, janelas iluminadas, chaminé, porta, floreiras, detalhes de pedra/madeira e decoração externa.
- Não foram geradas imagens novas e não foram adicionados sprites obrigatórios para as casas.
- Colisão, interiores, HUD PC, HUD mobile, inventário legado mobile, joystick e sistemas de jogo foram preservados.
- Base usada: versão com HUD PC interativo e rotbar antiga oculta no PC.

# Eternal Rift - HUD PC Interativo Only 20260707

Esta versão mantém a base anterior e adiciona interação real ao HUD novo do PC.

## O que mudou
- HUD novo do PC agora tem botões clicáveis.
- Bolsa abre o inventário.
- Missões abre o painel de missões.
- Menu abre a pausa.
- Status/Classe abre o painel de status.
- Loja tenta interagir com NPC/objeto próximo e avisa quando não houver alvo.
- Hotbar nova do PC executa ações: trocar arma, usar poder, poção, missões, chave/interação e status.
- Botões de ação do PC executam ataque, dash, bola de fogo, poder equipado e cura.
- Mini mapa do PC pode expandir/reduzir ao clicar.
- Chat visual do HUD registra avisos do próprio HUD.

## Regra principal
Tudo isso é SOMENTE no PC.
O mobile continua protegido: joystick, botões touch, hotbar mobile, HUD mobile limpo e inventário legado não foram alterados.

## Versão
pc-rpg-hud-interactive-only-20260707




# pc-rpg-hud-interactive-only-20260707
- SOMENTE no PC, a rotbar/hotbar antiga (`#sandbox2DHotbar`, `.sandbox-2d-hotbar` e `.er-mmo-bottom-hotbar`) fica oculta quando o HUD RPG de PC está ativo.
- A nova hotbar do HUD de PC (`.pc-rpg-hotbar`) continua aparecendo normalmente.
- Mobile não foi alterado: joystick, botões touch, inventário legado e hotbar mobile continuam preservados.
- Atualizado cache-busting para `pc-rpg-hud-interactive-only-20260707`.
- `node --check app.js` deve passar sem erro.
# mobile-inventory-legacy-20260706
- No mobile, o inventario voltou para a versao antiga/legada.
- O Inventory Rework novo continua ativo no PC.
- Save, itens, equipamentos, loja e a logica do inventario foram mantidos.

# mobile-clean-hud-only-20260706
- No mobile, o HUD principal agora esconde oxigenio, moedas, Classe/Contrato e barra fixa de boss para liberar espaco de jogo.
- No PC, o HUD continua completo.
- A logica de moedas, oxigenio, classes, contratos, bosses, inventario, loja e save foi mantida.
- O HUD mobile tambem evita atualizar DOM invisivel para reduzir custo visual.
- Toast mobile: `HUD mobile limpo carregado: mobile-clean-hud-only-20260706`.

# Eternal Rift - Correção da entrada da Mina Cristalina

## Ajuste aplicado
- Corrigido o problema da entrada da caverna/mina cristalina ficar apertada demais.
- A sala inicial da mina foi alargada.
- O ponto de spawn dentro da caverna foi movido para uma área mais aberta.
- A água perto da entrada foi empurrada um pouco mais para longe.
- A saída e as tochas da entrada foram reposicionadas para não prender o jogador.
- O cristal azul perto da entrada foi afastado para liberar melhor a movimentação.

## Resultado
Agora o jogador entra na caverna com mais espaço para se movimentar normalmente.

## Correção da entrada da Mina Cristalina
- Entrada interna da caverna foi alargada para o personagem andar sem ficar preso.
- Spawn dentro da Mina Cristalina foi movido para uma área mais aberta.
- Zona de saída foi reduzida e recebeu pequeno tempo de segurança ao entrar, evitando teleporte/acoplamento acidental.
- Visual da área inicial recebeu piso aberto por cima do mapa da caverna para combinar com a colisão corrigida.
- A entrada da caverna agora é desenhada atrás do personagem, evitando que ela cubra o jogador.
- `node --check app.js` passou sem erro.

## Correção das paredes invisíveis da Mina Cristalina
- Removida a colisão invisível gerada pelo mapa interno de tiles da caverna.
- A imagem `cave-map.png` agora funciona como cenário visual livre, sem prender o jogador em paredes que não aparecem.
- Dentro da caverna, somente objetos pontuais e visíveis continuam bloqueando: o baú antigo e o portão antigo.
- Cristais, tochas, trilhos e decorações não travam mais o personagem.
- `node --check app.js` passou sem erro após a correção.

## Atualizacao extra - Mina Cristalina com gameplay
- Adicionados inimigos dentro da Mina Cristalina: morcegos, aranha, slime azul, golem de pedra, fantasma, mago sombrio e mini guardiao.
- Adicionados minerios coletaveis por interacao: Ferro Sombrio, Cristal Azul, Ametista Lunar e Ouro Antigo.
- Adicionados 3 NPCs com missoes dentro da caverna:
  - Roan pede Ferro Sombrio para reforcar os trilhos.
  - Luma pede Cristais Azuis e Ametistas Lunares para pesquisa.
  - Teo pede para derrotar monstros da mina.
- Minerios aparecem no inventario e ficam salvos no progresso.
- Inimigos derrotados e jazidas mineradas ficam registrados no save.
- HUD da mina mostra o progresso das missoes ativas.
- Mantida a correcao anterior: sem paredes invisiveis na caverna.

Atualizacao extra:
- inimigos da Mina Cristalina agora renascem depois de 5 minutos apos serem derrotados;
- o contador da missao do Teo conta abates totais, entao inimigos que voltam tambem podem ajudar no progresso;
- o tempo de respawn fica salvo junto com o jogo, evitando que os inimigos voltem imediatamente ao recarregar.

Atualizacao extra:
- adicionada a Dimensao Acida no bioma venenoso (Pantano dos Sussurros);
- a Fenda Acida pode ser acessada clicando nela ou apertando E quando estiver perto;
- o interior da dimensao usa o visual da imagem verde fornecida como base;
- adicionados altar, reator, obeliscos, tochas e retorno para a vila;
- o save agora preserva o jogador dentro da Dimensao Acida.

Correcao extra:
- corrigido erro ao entrar na Dimensao Acida: updateCamera is not defined;
- camera da Dimensao Acida agora e atualizada diretamente pelo tamanho da propria dimensao;
- mantida a entrada por clique/toque/E e o retorno ao pantano.

Correcao da Dimensao Acida:
- removido o dialogo automatico ao entrar, para o personagem poder andar na hora;
- removidas paredes invisiveis e bloqueios da Dimensao Acida;
- corrigido o desenho do fundo da dimensao para aparecer direito;
- adicionado fallback visual mais parecido com a imagem pedida, caso o PNG demore para carregar.

Melhoria visual da Dimensao Acida:
- reator acido redesenhado com moldura, nucleo central, brilho pulsante e detalhes laterais;
- portal externo do pantano redesenhado com pedestal melhor, brilho e runas;
- portal interno/saida da dimensao redesenhado com visual mais forte e consistente.


Atualizacao extra:
- altar corrosivo da Dimensao Acida redesenhado com base, colunas, runas e nucleo brilhante;
- obeliscos acidos redesenhados com moldura, runas e aura pulsante;
- brilho acido animado reforcado com halos verdes, particulas e bolhas visuais.


Atualizacao extra:
- portal externo da Dimensao Acida redesenhado do zero;
- removido visual cinza/fallback do portal;
- adicionados moldura de pedra, energia liquida, cristais laterais, runas, aura pulsante e particulas;
- pedestal do portal redesenhado e sem colisao para nao atrapalhar movimento.


Atualizacao extra:
- portal interno da Dimensao Acida redesenhado do zero;
- adicionados altar de base, moldura de pedra, colunas laterais, runas, cristais, energia liquida e particulas orbitando;
- o portal interno agora combina melhor com o mapa verde da dimensao.

Atualizacao extra:
- reator acido reposicionado para ficar mais ao centro da Dimensao Acida;
- reator redesenhado com plataforma circular, corpo industrial, tubos laterais, camara de acido, runas e particulas orbitando;
- minimapa e brilho ambiente ajustados para acompanhar a nova posicao central do reator.


Atualizacao extra:
- adicionados inimigos acidos dentro da Dimensao Acida;
- adicionados minerios raros: Necrita Verde, Cristal Caustico e Ouro Corrosivo;
- adicionados 3 NPCs com missoes: Nira, Vekra e Dorian;
- minerios aparecem no inventario;
- progresso das missoes aparece no HUD;
- ataques, projeteis e onda de choque agora acertam inimigos dentro da Dimensao Acida.

Melhoria visual dos inimigos da Dimensao Acida:
- slime toxico com corpo mais vivo, brilho interno, olhos e bolhas;
- mosquito venenoso com asas translucidas, corpo segmentado e ferrão;
- serpente aquatica com corpo segmentado, olhos e detalhes venenosos;
- bruxa do pantano com chapeu, veste, rosto e cajado com brilho;
- golem ácido com rachaduras verdes e núcleo tóxico.

Melhoria visual dos poderes:
- Bola de Fogo agora tem núcleo brilhante, chamas, aura e faíscas orbitando;
- Raio Azul agora tem rastro cristalino, brilho forte, núcleo branco e partículas de energia;
- Onda de Choque agora tem anéis múltiplos, brilho interno e fragmentos energéticos ao redor;
- Cura agora tem círculo sagrado, cruz central, brilho suave e partículas verdes/brancas.

Melhoria visual dos inimigos da vila principal:
- slimes azul, verde, vermelho e azul aquático redesenhados com brilho, reflexos e rosto melhor;
- morcego redesenhado com asas animadas;
- mago e mago sombrio com chapéu, roupa e brilho mágico melhores;
- goblin e arqueiro goblin com rosto, roupa e arma melhores;
- aranha, golem, guardião, peixe hostil, fantasma, golem de pedra e mini dragão redesenhados;
- tudo feito no código, sem gerar imagens separadas.


Atualizacao LENDARIA:
- poderes de cura, bola de fogo, raio azul e onda de choque refeitos com efeitos muito maiores, aura, particulas, runas e brilho;
- inimigos principais e de biomas reforcados com sprites premium, sombras, brilho, reflexos e barras de vida melhores;
- tudo foi feito no codigo Canvas, sem gerar imagens externas.


Atualizacao extra:
- entrada da Dimensao Celestial totalmente redesenhada;
- portal externo agora tem halo sagrado, asas angelicais, colunas de marmore, arco dourado, energia celestial, runas e particulas;
- portal ficou maior e mais imponente, mas continua funcional.

Atualizacao visual do Pantano:
- agua venenosa redesenhada com brilho verde, correntes, bolhas toxicas, gases e profundidade;
- lama do pantano redesenhada com poças escuras, reflexos, pegadas, bolhas e musgo nas bordas;
- grama do pantano recebeu detalhes extras e pequenas luzes verdes para combinar com o brejo.


Atualizacao extra:
- gelo do Bioma Congelado redesenhado com profundidade, brilho, reflexos, rachaduras, bordas cristalinas e bolhas congeladas;
- neve melhorada com cristais pequenos, flocos e brilho frio;
- overlay do bioma congelado recebeu nevoa azul, particulas de neve e reflexo de aurora.


Atualizacao extra:
- areia movediça do deserto redesenhada com redemoinhos animados, anéis, sombra central, grãos girando e brilho dourado;
- deserto recebeu poeira brilhante, névoa de calor e tom cinematográfico.


CORRECAO REAL:
- o gelo e a areia movediça agora são desenhados por cima do drawMap real;
- isso corrige o problema em que as versões anteriores alteravam funções internas que não apareciam no jogo;
- gelo, neve e areia movediça agora têm mudança visual forte e visível.


Atualizacao extra:
- deserto inteiro redesenhado e estendido dentro do mapa existente;
- areia normal agora tem dunas, ondas, brilho, grãos e variação forte;
- areia movediça recebeu redemoinhos maiores e mais visíveis;
- caminhos, ruínas, oásis e água do deserto receberam visual próprio;
- adicionadas decorações: dunas douradas, obeliscos solares, cristais, palmeiras, ossadas gigantes, banners e ruínas soterradas.


Correção de performance do deserto:
- removido o overlay pesado que redesenhava cada tile do deserto com muitos paths e curvas;
- deserto agora usa textura otimizada, com menos chamadas de desenho por frame;
- oásis foi corrigido para água conectada, sem ficar parecendo várias bolinhas azuis separadas;
- água do oásis agora tem margem de areia, borda verde e ondas leves.


Correção EXTREMA de performance do deserto:
- quando a câmera encosta no deserto, o jogo pula todos os overlays antigos pesados do deserto;
- o mapa do deserto agora é renderizado direto com funções ultra leves;
- removidos efeitos animados por tile, curvas em massa e partículas excessivas;
- oásis foi redesenhado de forma conectada e leve;
- decorações do deserto ganharam versão barata de desenho para reduzir travamento.


Atualizacao:
- a piramide solar do deserto foi movida para outro lugar, ficando ao lado do oasis principal.


Correção DEFINITIVA do deserto:
- o chão do deserto agora é pré-renderizado em cache;
- em vez de redesenhar centenas de tiles e efeitos por frame, o jogo usa 1 drawImage;
- isso remove o travamento causado pelos overlays acumulados;
- o oásis continua conectado e leve.


Atualização gigante:
- adicionados bosses exclusivos de biomas e dimensões;
- adicionadas armas raras com raridades;
- adicionada forja com NPC Branor;
- adicionadas montarias com NPC Mira e tecla M;
- adicionados pets com NPC Lia e tecla P;
- adicionadas dungeons secretas;
- adicionado ciclo de dia e noite;
- adicionados títulos com tecla T;
- adicionadas conquistas.


Correção REAL da bolha verde que dava dano:
- o problema não era cura mágica nem Slime Azul;
- bosses distantes estavam soltando habilidades em cima do jogador mesmo fora da luta;
- corrigido: boss só usa habilidade especial se estiver perto/visível ou se o jogador estiver na dungeon/dimensão da luta;
- removido também o acidTrail do Cajado Ácido para evitar círculo verde de dano no próprio jogador.


Novos poderes em modo teste:
- Lança Celestial
- Explosão de Gelo Eterno
- Tornado de Areia Solar
- Raízes Venenosas
- Corte Dimensional
- Meteoro Carmesim
- Escudo Divino
- Teleporte Sombrio

Sistema:
- nova aba Poderes no inventário;
- todos os poderes aparecem no inventário para teste, sem taxa de drop ainda;
- cada poder tem botões Equipar no Slot 1/2/3/4;
- teclas 1/2/3/4 selecionam o slot equipado;
- Q ou botão direito do mouse usa o poder selecionado;
- no mobile, o botão Poder usa o slot selecionado.


Modo teste:
- mana infinita ativada temporariamente;
- poderes não gastam mana;
- barra de mana fica sempre cheia para testar os poderes novos.


Melhoria visual dos bosses:
- todos os bosses principais receberam desenho novo;
- agora eles têm silhuetas mais ricas e menos quadradas;
- Deserto: Faraó Solar com cocar, capa e sol flutuante;
- Gelo: Rainha Glacial com vestido, coroa e cristais;
- Pântano: Bruxa Suprema com capuz, cajado e raízes;
- Dimensão Ácida: Reator Vivo com núcleo, tubos e tentáculos;
- Dimensão Celestial: Serafim Caído com asas e halo quebrado;
- Dungeon final: Senhor das Catacumbas com armadura, capa e chifres.


Rework visual final dos bosses:
- chefes redesenhados com silhuetas muito mais exageradas;
- partes saem do hitbox para quebrar o formato de quadrado;
- Faraó Solar: cocar e capa abertos;
- Rainha Glacial: cristais/asa laterais;
- Bruxa Suprema: chapéu torto, robe e raízes;
- Reator Corrompido: corpo hexagonal com tentáculos, não parece mais portal/quadrado;
- Serafim Caído: asas grandes e halo quebrado;
- Senhor das Catacumbas: armadura, chifres e espada lateral.


Produção dos poderes novos:
- mana infinita removida;
- poderes antigos ficam equipados nos slots: Bola de Fogo, Raio Azul, Onda de Choque e Cura Mágica;
- poderes novos não aparecem mais no inventário até serem conquistados;
- bosses agora desbloqueiam poderes específicos;
- baús raros/dimensionais/celestiais/dungeons desbloqueiam poderes especiais.


Novo patch:
- adicionada Poção Arcana: aumenta mana máxima em +1 ao usar;
- limite máximo de mana agora é 50;
- bosses dão Poção Arcana garantida e mobs têm chance rara de dar a poção;
- baús abertos também dão Poção Arcana;
- todos os inimigos/mobs recebem respawn em 5 minutos após morrer;
- Branor agora fica parado na vila, com visual próprio, martelo, bigorna e bancada de trabalho.


Ajuste:
- Branor e a área da bigorna foram movidos para mais longe do portal;
- nova posição aproximada: X 25, Y 27;
- a bigorna/bancada ficou ao lado dele em X 26, Y 27.


Patch das 10 espadas poderosas:
- adicionadas 10 novas espadas com visual melhorado, raridades e especiais;
- ataque carregado das espadas usa a tecla R;
- Espada do Rei Solar: Faraó Solar ou baú do deserto;
- Lâmina da Lua Sombria: dungeon noturna ou boss secreto;
- Espada de Gelo Eterno: Rainha Glacial;
- Katana Dimensional: Catacumbas ou baú dimensional;
- Espada Viva do Pântano: Bruxa Suprema;
- Espada do Serafim Caído: Serafim Caído;
- Espada Carmesim do Meteoro: baú raro;
- Espada Cristalina Suprema: evolução com Branor;
- Espada do Vazio Antigo e Espada Real do Castelo foram preparadas, mas ficam travadas até o castelo ser adicionado.


Correção de bosses:
- bosses pequenos da vila são recriados/revividos se sumirem;
- bosses grandes dos biomas são recriados/revividos se sumirem;
- bosses de dimensão/dungeon também são garantidos;
- bosses não ficam bloqueados pelo histórico de derrotado;
- ao morrerem, voltam imediatamente ao ponto de surgimento;
- bosses patrulham suas áreas quando o jogador está longe.


Ajuste de respawn:
- mobs, inimigos e bosses agora reaparecem em 1 minuto;
- removido o comportamento de reaparecer imediatamente;
- respawn acontece no ponto original de surgimento.


Ajuste visual do painel de armaduras: agora o painel mostra todas as informações sem cortar cards nem sobrepor textos.


Ajuste responsivo PC e Mobile: o painel de armaduras agora foi rebalanceado para desktop, tablet e celular, evitando cortes e sobreposição de informações.


Correção forte do painel de armaduras: o inventário agora empilha a coluna lateral mais cedo e o painel foi compactado de verdade para desktop menor e mobile, mostrando todas as informações sem layout apertado.


Correção mobile de equipamentos: o painel espremido foi escondido em telas menores e substituído por botão Ver Equipamentos com janela separada.


Correção de erro: removida a referência direta a openInventory quando essa função não existe nesta versão do jogo.


Mudança geral do inventário de armaduras: o painel embutido foi abandonado em PC e mobile. Agora os equipamentos usam somente uma janela separada aberta pelo botão Equipamentos.


Primeira leva de armaduras adicionada: conjuntos de Desert/Gelo/Pântano/Ácida/Celestial com drops iniciais em bosses e integração com a janela separada de Equipamentos.


Armaduras iniciais, forjáveis e visual no personagem adicionados: kit inicial, drops raros de mobs iniciais, receitas no Branor e overlay visual da armadura equipada no personagem.


Correção REAL do inventário mobile: detecção por toque/orientação, viewport corrigido, inventário dividido em Itens/Equipados/Detalhes e tamanho reduzido em retrato e paisagem.


Correção do inventário mobile: o botão Fechar voltou a esconder o painel corretamente mesmo com o layout compacto.


Trava final do inventário mobile: o botão Fechar agora usa fechamento direto por touch/pointer/click, com classe force-closed-inventory e função global forceCloseInventoryPanel.


## Correção anti-travamento PC e Mobile
- Reduzida a quantidade de partículas em dimensões, caverna e castelo.
- Otimizado o desenho das imagens grandes `cave-map.png` e `acid-dimension-map.png`, renderizando somente a área visível da câmera.
- Adicionado limitador final de FPS e resolução interna do canvas para evitar travamentos em tela cheia, PC fraco e celular.
- HUD, dica de interação e minimapa agora são atualizados em intervalos controlados, reduzindo alterações no DOM por frame.
- Intervalos de autosave e correções visuais do inventário foram espaçados para diminuir engasgos.
- Adicionado modo automático de economia de desempenho quando o jogo detecta queda de FPS.
- Adicionadas classes CSS de performance para reduzir sombras, filtros e animações pesadas quando necessário.
- `node --check app.js` passou sem erro após a correção.

## Correção definitiva do movimento travado
- Corrigida a parada periódica do personagem no PC e no mobile.
- Causa encontrada: o patch de fechamento forçado do inventário chamava `keys.clear()` e `resetJoystick()` automaticamente em intervalo, mesmo com o inventário fechado.
- Resultado: enquanto o jogador segurava WASD ou o joystick, o input era apagado em pulsos, fazendo o personagem andar travado.
- Ajuste: a manutenção automática do inventário agora só altera o visual do painel fechado e não mexe mais nos controles.
- `hardCloseInventoryPanel()` só limpa input quando existe um evento real de fechamento do jogador.
- Mantida a correção do inventário sem quebrar teclado, joystick, PC ou mobile.
- `node --check app.js` passou sem erro.

## Correção final: movimento livre sem pausas
- Adicionado patch `ETERNAL_RIFT_FREE_MOVEMENT_NO_PAUSES_FINAL_REAL`.
- Removido o efeito de movimento em "passos" causado por frame-skip e modo economia automático.
- O loop principal agora atualiza em todo `requestAnimationFrame`, sem alvo artificial de 28/38/45 FPS.
- Teclado, D-Pad e joystick agora têm estado de movimento próprio, então o personagem não para se algum patch antigo limpar `keys`.
- Joystick protegido contra `lostpointercapture` prematuro no mobile.
- Canvas só recalcula tamanho quando a tela realmente muda, reduzindo microtravadas.

## Correção finalíssima do movimento contínuo
- Adicionado um motor de movimento contínuo que aplica a movimentação antes dos sistemas pesados do jogo.
- Teclado, D-Pad e joystick preservam o input físico mesmo que patches antigos tentem limpar `keys`.
- O movimento não depende mais do update antigo para andar, evitando pausas ao virar para os lados.
- A hitbox do jogador agora usa uma área de pé menor, reduzindo agarrões em móveis, portas, paredes e cantos.
- Autosave é adiado enquanto o personagem está andando, evitando microtravadas no exato momento do movimento.
- O loop final usa `requestAnimationFrame` sem frame-skip artificial.
- `node --check app.js` passou sem erros.

## Correção mobile definitiva
- Joystick refeito para funcionar com Pointer Events e Touch Events.
- O dedo pode arrastar para fora do círculo sem perder movimento.
- Botões mobile agora têm interceptação própria para ataque, inventário, ação, poderes, poção, dash e pausa.
- Inventário mobile abre e fecha com estado único, removendo conflitos de patches antigos.
- Removida a pausa automática causada por blur falso no celular, que bloqueava movimento e ataque.
- CSS final força controles visíveis e clicáveis no mobile.
- `node --check app.js` passou sem erro.

## Correção mobile real 2026-07-01
- Adicionado cache-busting no `index.html` para `styles.css` e `app.js`, evitando o celular carregar JavaScript antigo do navegador.
- Recriados os controles `.touch-controls` no boot mobile para remover listeners antigos conflitantes.
- Joystick mobile substituído por um listener único com Pointer Events em `window`, permitindo arrastar fora do círculo sem perder movimento.
- `getMovementInput` agora usa o vetor do joystick final no mobile e ignora pausa fantasma.
- Botão `Inv` abre e fecha o inventário diretamente, sem depender de patches antigos de `toggleInventory`.
- Botão `Ataque` chama o ataque atual do jogo e prepara a direção pelo joystick.
- Botão `Ação` chama interação sem ser bloqueado por pause falso.
- CSS final força controles acima do canvas e inventário acima dos controles.
- `node --check app.js` passou sem erros.


## Correção HUD/Boss menor - 2026-07-02
- HUD mobile compactado para ocupar uma faixa fina no topo.
- Botão de música, salvar, reset e blocos extras ocultados no mobile para liberar visão do mapa.
- Barra de boss reduzida em largura, altura, fonte e padding.
- Botões Tela cheia/Pausa reduzidos para não parecerem parte de um HUD gigante.
- Cache-busting atualizado no index.html para forçar o celular a carregar o CSS novo.

## Atualizacao extra - Editor de HUD estilo Free Fire
- Adicionado botao `Editar HUD` no menu de pausa.
- O jogador pode arrastar elementos do HUD e controles pela tela.
- O jogador pode alterar o tamanho de cada elemento.
- O jogador pode esconder itens nao essenciais do HUD.
- Layout fica salvo no `localStorage` e volta igual ao recarregar o jogo.
- Adicionado preset `HUD pequeno` para mobile.
- Adicionado reset geral e reset por item.
- A barra de boss pode ser reposicionada e redimensionada usando uma previa no editor.
- `node --check app.js` passou sem erro.


## Atualização - Mais jazidas de minérios existentes
- A Mina Cristalina recebeu várias novas jazidas espalhadas pela entrada, corredores e salas profundas.
- A Dimensão Ácida recebeu várias novas jazidas raras pelo mapa.
- Não foram criados tipos novos de minério. Foram usados apenas os minérios que já existiam:
  - Ferro Sombrio
  - Cristal Azul
  - Ametista Lunar
  - Ouro Antigo
  - Necrita Verde
  - Cristal Cáustico
  - Ouro Corrosivo
- As novas jazidas usam o mesmo sistema de mineração, inventário, save e interação por E/toque.
- O cache do HTML foi atualizado para `mais-minerios-20260702`.

## Atualização extra - Poção Arcana salva + minérios com respawn
- Ao usar a Poção Arcana para aumentar a mana máxima, o jogo agora força um autosave imediatamente.
- A mana máxima aumentada pela Poção Arcana continua salva mesmo se o jogador fechar o jogo logo depois.
- Todas as jazidas de minério da Mina Cristalina agora voltam depois de 5 minutos.
- Todas as jazidas de minério da Dimensão Ácida agora voltam depois de 5 minutos.
- Os timers de respawn ficam salvos no progresso, então continuam contando ao sair e voltar ao jogo.
- Saves antigos com jazidas já mineradas recebem um timer de 5 minutos ao carregar, evitando minérios presos para sempre.
- `node --check app.js` passou sem erro após a alteração.


## Atualizacao extra - Musica dentro do menu
- O botao `Musica: Ligada/Desligada` foi removido do HUD principal.
- O controle de musica agora fica dentro do menu de pausa, logo abaixo de `Continuar`.
- A faixa grande de musica nao aparece mais por cima da tela durante o jogo.
- O mesmo botao continua ligando/desligando a musica e salvando a preferencia no navegador.
- Cache atualizado para `musica-no-menu-20260702`.


Atualizacao extra - HUD muito mais bonito:
- HUD recebeu visual real/medieval mais sofisticado;
- caixas do HUD agora usam gradientes mais ricos, brilho suave, dourado e sombra mais elegante;
- textos e labels do HUD ficaram mais legiveis e refinados;
- barras de XP, mana, oxigenio e boss foram redesenhadas com visual premium;
- barra de boss ganhou acabamento mais dramatico e efeito de brilho pulsante;
- cache do HTML atualizado para forcar o celular/navegador a puxar o novo visual.


## Correcao HUD visivel 2026-07-02
- Corrigido HUD bonito que escondia nome, XP, vida e mana no mobile.
- Nome do personagem, XP, barra de XP, vida e mana voltaram a aparecer.
- Mantido o visual bonito do HUD, sem alterar jogabilidade.
- Cache atualizado para hud-visivel-corrigido-20260702.
- node --check app.js passou sem erro.


Atualizacao: adicionada uma barreira real e bonita ao redor da vila principal, com quatro entradas elegantes e selos magicos que barram monstros sem impedir o jogador de entrar e sair.

Correcao: entradas da barreira alinhadas aos caminhos reais da vila. O jogador agora consegue sair e entrar pela barreira, enquanto os monstros continuam bloqueados pelos selos magicos.


Atualizacao: a barreira da vila agora ganhou um telhado externo muito mais bonito. O telhado aparece do lado de fora da muralha e por dentro a vila continua normal, sem teleporte e sem mudar de mapa.


Correcao: o telhado da barreira agora fica voltado para o lado de dentro da vila, permitindo ao jogador ver o lado de fora da vila sem mudar de mapa e sem teleporte.


Atualizacao: grande melhoria visual no personagem. O heroi ganhou visual mais bonito, armas redesenhadas (espada, arco, cajado e lanca), animacoes de ataque melhores e aparencia das armaduras equipadas bem mais marcante.


Atualizacao EXTRA: o heroi ficou ainda mais epico. Reforcei o sprite com cabelo melhor, postura mais heroica, roupa base mais bonita, armaduras com identidade propria, armas mais lendarias, animacoes/efeitos mais fortes e sensacao visual muito mais rica.


Correcao: reduzi a intensidade da aura do personagem para deixar o visual mais bonito e menos exagerado, mantendo apenas um brilho mais suave e controlado.


Atualizacao: deixei a hitbox do ataque muito mais bonita e elegante, substituindo o cone exagerado por um efeito mais refinado. Tambem adicionei contador de dano com numeros flutuantes melhores e total acumulado por alvo.


Atualizacao EXTRA: a hitbox foi refeita para ficar muito mais bonita e caprichada, com slash em camadas para espada e golpe de lanca mais elegante, reduzindo a simplicidade do efeito anterior.


Correcao: deixei o contador de dano mais visivel, com numeros maiores, fundo escuro, borda destacada e melhor leitura em combate.


Atualizacao: adicionei efeitos elementais nas armas. Armas de fogo agora queimam por alguns segundos, armas de gelo congelam e deixam lento, armas venenosas envenenam, armas eletricas eletrizam, armas sombrias amaldiçoam e armas sagradas marcam os inimigos com dano extra.


Atualizacao EXTRA: os efeitos elementais agora estao MUITO mais bonitos, com particulas especificas para fogo, gelo, veneno, raio, sombra e luz. Tambem adicionei aura elemental mais forte e bonita em bosses quando recebem esses efeitos.


Atualizacao EXTRA: deixei o interior da barreira / vila muito mais bonito, com jardins na frente das casas, praca central mais caprichada, lanternas decorativas, banners, sebes, enfeites no caminho e detalhes perto do lago.


Atualizacao EXTRA FORTE: refiz de forma bem mais visivel o interior da barreira / vila. Agora o chao de grama dentro da vila esta mais rico e florido, os caminhos estao mais nobres, a praca esta com padrao real, as arvores da vila viraram cerejeiras e a iluminacao ganhou brilhos bem mais fortes e bonitos na praca e nos caminhos.


Ajuste pedido: removi a grama da parte interior da vila e mantive grama apenas perto das arvores de cerejeira. O restante do interior ficou com piso mais nobre / de patio.


Hotfix: corrigi o erro radialGlow is not defined que podia travar a tela ao desenhar a iluminacao do interior da vila.


Atualizacao: Dimensao Tranquila da Vila refeita para ficar muito mais bonita e mais expandida. Melhorei a agua com brilho/reflexo, os caminhos, a praca central, as cerejeiras, petalas caindo, lanternas suaves, cristais brilhando, bancos, flores, fontes, ilhas e pontes entre as areas.


Atualizacao: removi a agua de dentro da vila e substitui por piso de praca (P), para o interior ficar seco e combinando com o visual da vila.


Atualizacao: adicionado favicon oficial do Eternal Rift usando o logo ER com fenda azul/roxa. Inclui favicon.ico, favicon.png, apple-touch-icon.png, icon-192.png e icon-512.png, com links configurados no index.html.


## Multiplayer básico com Firebase
- Adicionado Firebase Realtime Database com a URL:
  https://eternal-rift-default-rtdb.firebaseio.com/
- O jogo usa a sala padrão `sala1`.
- Também é possível escolher sala pelo link: `?room=sala1`.
- Sincroniza nome, posição X/Y, direção, vida, nível e cena atual.
- Mostra outros jogadores andando no mapa.
- Se Firebase falhar, o jogo continua funcionando offline.
- Para testar, suba estes arquivos no GitHub Pages e abra o mesmo link em dois aparelhos:
  `https://gabryel19-lang.github.io/jogorpg2d/?play=1&lite=1&room=sala1&v=multiplayer-user-files-1`

Regras recomendadas para teste no Realtime Database:
```json
{
  "rules": {
    "rooms": {
      "$roomId": {
        ".read": true,
        ".write": true
      }
    }
  }
}
```


## Correção do Firebase não carregou
- O jogo agora tenta carregar o Firebase automaticamente pelo `app.js`, mesmo se o `index.html` antigo estiver em cache ou sem os scripts.
- Tenta Firebase CDN em versões 10.12.5, 9.23.0 e 8.10.1.
- Se falhar, aparece aviso para verificar internet/CDN.
- Depois de subir no GitHub Pages, use `v=multiplayer-loader-fix`.


## Correção de cache no celular
- Versão: `mobile-cache-fix-20260702-1909`
- O `index.html` agora tem meta tags de no-cache.
- `styles.css`, `app.js` e ícones receberam `?v=mobile-cache-fix-20260702-1909`.
- O jogo mostra no HUD: `Versão nova carregada: mobile-cache-fix-20260702-1909` quando o app.js novo realmente carrega.
- Use no GitHub Pages:
  `https://gabryel19-lang.github.io/eternal-rift/index.html?play=1&lite=1&room=sala1&v=mobile-cache-fix-20260702-1909`


## Correção visual do jogador no multiplayer
- Versão: `multiplayer-player-visual-fix-20260702-1920`
- O jogador remoto não fica mais como um retângulo branco.
- Agora usa um sprite estilo herói pixelado, com cabeça, elmo, braços, pernas e túnica.
- Mantém barra de vida e nome no multiplayer.


## Correção de piscadas no mobile
- Versão: `mobile-no-flicker-decor-20260702-1935`
- O canvas no celular não fica mais redimensionando por pequenas variações da barra do navegador.
- A câmera é arredondada no mobile para evitar tremulação de pixels.
- Flores no mobile usam desenho estático, sem bob/pulse.
- CSS recebeu aceleração e renderização pixelada para diminuir flicker visual.


## Upgrade do multiplayer: visual, arma e animação
- Versão: `multiplayer-visual-arma-animacao-20260702-2054`
- Corrigido: no mobile, o jogador do PC não aparece mais como quadrado branco.
- Cada jogador agora tem um visual próprio gerado pelo ID/nome.
- A arma equipada aparece no multiplayer.
- Melhor animação de caminhada.
- Melhor animação de ataque, com efeito visual conforme o tipo da arma.


## Upgrade online visual 2
- versão: `multiplayer-tags-hp-mana-projectile-20260702-2130`
- nomes de jogadores agora têm cores bem visíveis e selo PLAYER.
- HUD online mostra HP e Mana mais bonitos.
- projéteis dos jogadores agora aparecem para os outros jogadores.


## Upgrade pesado dos novos biomas
- Terras da Forja Ardente, Floresta da Meia-Noite e Ruínas Submersas receberam MUITO mais conteúdo visual e gameplay.
- Mais inimigos espalhados em cada bioma.
- Bosses agora têm patrulha maior e habilidades especiais.
- Bioma oceânico ganhou respiradouros que recuperam oxigênio.
- Bioma sombrio ficou mais forte à noite.
- Bioma vulcânico ficou mais perigoso perto da lava.
- Mais recursos coletáveis, mais decorações e mais pontos de interesse.

## Versão sem bosses e minibosses
- Removidos todos os bosses e minibosses do jogo durante o carregamento e durante a atualização do mapa.
- A função de criação de boss foi neutralizada para impedir que sistemas antigos recriem bosses.
- HUD/barra de boss foi escondida.
- Mini Guardião, Mini Dragão, Reis/Rainhas/Guardiões, bosses de biomas, bosses de dimensões, bosses de dungeon e bosses dos novos biomas lendários foram bloqueados.
- Inimigos comuns, biomas, itens, recursos, mapa, multiplayer e demais sistemas continuam funcionando.
# Atualizacao: Redesign Visual Premium + Som de Bau

Primeira versao visual estavel inspirada na direcao artistica premium de Eternal Rift.

- Personagem principal redesenhado no Canvas com cabelo marrom, armadura azul/dourada, capa e brilho magico.
- Vila inicial recebeu mais clima aconchegante, fonte azul, flores, luzes e detalhes de chao sem mudar colisoes.
- Bioma vulcanico recebeu brilho quente, cinzas, rachaduras de lava, fagulhas leves e atmosfera dramatica.
- Ruinas submersas receberam reflexos ciano, bolhas, algas e nevoa aquatica discreta.
- Inventario ganhou icones SVG leves com moldura de raridade para armas, pocoes, materiais, chaves, reliquias e itens magicos.
- Baus importantes agora exibem uma tela de recompensa com bau grande, luz dourada/azul, particulas e cartas de loot.
- O audio `assets/sounds/chest-open-reward.mp3` toca ao abrir recompensa de bau, em volume 0.55, sem loop e sem interromper a musica de fundo.
- HUD, paineis e inventario receberam polimento RPG com fundo escuro translucido, bordas douradas e brilho azul.
- Mobile, minimapa, save, inventario, controles touch, musica de fundo e Firebase foram preservados.
# Atualizacao: Estilo Sandbox 2D de Exploracao

Esta versao deixa o Eternal Rift com clima de jogo 2D de exploracao, mineracao e construcao, sem copiar sprites, nomes ou assets de outros jogos.

- Adicionada hotbar inferior com Espada, Picareta, Terra, Pedra, Madeira, Tocha e Magia.
- Teclas `1` a `7` selecionam slots da hotbar; `B` alterna rapidamente entre combate e picareta.
- Picareta minera blocos proximos no mapa e guarda materiais no inventario.
- Blocos de terra, pedra, madeira e tochas podem ser colocados no mapa depois de minerar espacos.
- Mapa ganhou camada visual de blocos quadrados, pedra, terra, agua, lava, corais, madeira e minerios.
- Foram adicionados minerios decorativos/coletaveis como cobre, cristal azul e minerio dourado.
- Tela recebeu atmosfera de sandbox 2D com ceu, nuvens, brilho e visual mais pixelado.
- Save, inventario, minimapa, controles touch, musica, Firebase e sistemas existentes foram preservados.
# Eternal Rift - Rework visual estavel dos 3 biomas

## Atualizacao aplicada
- Adicionada escolha inicial de classe: Guerreiro, Arqueiro, Mago e Assassino.
- A classe escolhida altera vida, mana, velocidade, arma inicial e pequenos bonus de combate.
- O save agora preserva a classe em `playerClass` e roda a migracao `normalizeWorldReworkSaveState()`.
- Adicionado Quadro de Contratos na vila, com aceitar, acompanhar progresso e entregar recompensas.
- O mundo principal foi focado em tres regioes: Vila + Floresta, Terras Vulcanicas e Ruinas Aquaticas.
- A Dimensao Acida agora fica ligada as Terras Vulcanicas.
- A Dimensao Celestial agora fica ligada as Ruinas Aquaticas.
- Foram adicionados tres chefes principais com introducoes cinematicas curtas.
- O minimapa passou a destacar os tres biomas, os portais e os chefes principais.
- A hotbar sandbox fica escondida no menu inicial mobile para nao bloquear o botao Novo Jogo.
- Mobile, inventario, save, minimapa, toque, musica e Firebase foram preservados.

## Como testar rapido
- Inicie um Novo Jogo e escolha uma classe.
- Interaja com o Quadro de Contratos perto da praca da vila.
- Explore os tres biomas principais no mapa.
- Entre na Fenda Acida nas Terras Vulcanicas e no Portal Celestial das Ruinas Aquaticas.
- Aproxime-se dos chefes principais para ver as introducoes.


## Atualização: Editor de HUD completo + hotbar segura
- O Editor de HUD agora reconhece mais elementos: Classe/Contrato, hotbar/rotbar, caixa de diálogo, dica de interação, painel online, minimapa, botões, controles touch e HUDs criados depois.
- A rotbar/hotbar sobe automaticamente quando a caixa de diálogo de NPC está aberta, evitando ficar em cima do texto.
- Adicionado modo seguro para a hotbar quando o jogador conversa com NPCs.
- Mantidos mobile, inventário, minimapa, save e sistemas existentes.
- `node --check app.js` passou sem erro.


## Atualização: Ultra Anti-Lag sem remover conteúdo
- Mantidos os sistemas, biomas, HUD, hotbar, inventário, som, multiplayer e mecânicas existentes.
- Adicionado modo anti-travamento automático para reduzir custo de renderização.
- Minimap e HUD agora atualizam com intervalo inteligente em vez de pesar todo frame.
- Sincronização dos 3 biomas, contratos e classe foi reduzida para não rodar loops pesados a cada frame.
- Efeitos visuais continuam existindo, mas agora são limitados quando acumulam demais.
- Canvas recebe orçamento de pixels para reduzir uso de GPU em tela cheia/celular.
- O jogo usa modo economia visual por padrão quando detecta mobile/lite, sem apagar conteúdo.
- Para forçar qualidade maior, usar `?perf=quality` no link.
- Validação: `node --check app.js` passou sem erro.
# Eternal Rift - Quarto do Heroi Ultra Interativo

## Atualizacao aplicada em 2026-07-04
- Quarto do jogador reconstruido como quarto principal do heroi.
- Piso de madeira recebeu mais textura, marcas de tabuas e iluminacao quente.
- Tapetes agora sao visuais, bonitos e sem colisao, para o jogador andar por cima sem travar.
- Layout reorganizado em areas claras: cama, descanso, armazenamento, trabalho, equipamentos e decoracao.
- Adicionados moveis e decoracoes: cama principal, bau pessoal, guarda-roupa, bancada, mesa de estudo, estante, espelho, mapa, suporte de armas, suporte de armadura, prateleiras, plantas, velas, caixas e trofeus.
- Interacoes novas preservam sistemas existentes: dormir recupera vida/mana, bau abre inventario, guarda-roupa abre equipamentos, bancada organiza materiais, estante da XP com cooldown, espelho prepara troca visual futura, mapa mostra lore e suporte de armas mostra arma equipada.
- Objetos interativos recebem contorno/brilho sutil quando o jogador chega perto.
- Porta de saida, HUD, save, inventario, PC e mobile foram preservados.
## Atualizacao - Inventario do Aventureiro
- Adicionada uma nova camada visual de inventario por cima do sistema antigo, sem remover dados ou funcoes existentes.
- Novo painel "Inventario do Aventureiro" com visual escuro, moldura dourada, brilho magico discreto, grade de slots, raridades e painel de detalhes.
- Criada a funcao global `getUnifiedInventoryItems()` para adaptar moedas, armas, armaduras, acessorios, consumiveis, materiais, itens de missao e itens raros/lendarios.
- Adicionadas abas: Todos, Armas, Armaduras, Acessorios, Consumiveis, Materiais, Missao e Raros/Lendarios.
- Adicionados busca, ordenacao por raridade/nome/tipo/quantidade, slots equipados e acoes de usar, equipar, desequipar, mover para hotbar, inspecionar e fechar.
- O inventario antigo continua no HTML para compatibilidade, mas fica escondido quando a nova interface esta ativa.
- O estado visual da nova hotbar do inventario fica salvo em `questBook.inventoryRework`, sem sobrescrever a hotbar/rotbar sandbox existente.
- Mantida compatibilidade com PC e mobile, com layout responsivo e fechamento seguro.
## Atualizacao: Icones Visuais do Inventario
- Letras simples nos slots do inventario foram substituidas por icones visuais em SVG leve.
- Criado `getInventoryItemIcon(item)` com cache `inventoryIconCache` e fallback seguro `getFallbackItemIcon(item)`.
- Icones agora reconhecem categorias como armas, ferramentas, armaduras, acessorios, consumiveis, materiais, magia e itens de missao.
- Raridades ganharam borda/brilho visual: comum, incomum, raro, epico, lendario e mitico/divino.
- A hotbar/rotbar sandbox tambem recebe os mesmos icones visuais para espada, picareta, terra, pedra, madeira, tocha e magia.
- Mobile recebeu tamanho e espacamento ajustados para os icones nao ficarem pequenos nem cobertos por texto.
- O sistema nao remove itens, nao altera save, nao duplica inventario e nao muda as teclas 1 a 7 da rotbar.

## Atualizacao: Jogabilidade Mobile Confortavel
- Adicionada camada final de controles mobile sem remover os sistemas antigos.
- Joystick agora tem deadzone menor, sensibilidade configuravel e retorno visual mais limpo.
- Botoes mobile foram reorganizados: ataque maior, acao contextual, inventario, pocao, arma, dash, poder equipado e poderes 1-4.
- A acao mobile agora tambem continua/fecha dialogos, evitando travar conversa no celular.
- Mira assistida mobile busca inimigos da cena ativa e usa a direcao do joystick quando nao ha alvo.
- Hotbar/rotbar, inventario novo e dialogos receberam posicoes mais seguras para nao competir com os dedos.
- Adicionado painel de Ajustes Mobile com tamanho dos botoes, opacidade, sensibilidade do joystick, mira assistida, economia de desempenho e reset do layout.
- Adicionados presets mobile: Mobile Pequeno, Mobile Medio, Mobile Grande, Competitivo e Limpo.
- Camera mobile recebeu leve antecipacao na direcao do movimento/alvo.
- PC, saves, HUD, inventario, hotbar, classes, contratos, biomas, som e Firebase foram preservados.


## Atualização extra - Quarto exatamente igual à imagem de referência
- Adicionado `hero-bedroom.png` como cenário real do interior da casa do jogador.
- A casa agora desenha a imagem inteira como fundo, sem recriar cama, parede, janela, armário, mesa ou tapete por código.
- Foram adicionadas colisões invisíveis por cima da imagem para paredes, camas, armário e mesa.
- O tapete ficou apenas visual e não trava o jogador.
- A entrada e saída da casa foram alinhadas com a porta da imagem.
- O jogador aparece por cima da imagem e pode andar normalmente pelo quarto.

## Atualizacao - Quarto exato interativo
- Mantido o quarto usando `hero-bedroom.png` como imagem real de fundo, sem redesenhar os moveis por codigo.
- Adicionadas interacoes alinhadas com a imagem:
  - camas recuperam vida, mana e oxigenio, e salvam o jogo;
  - armario troca conjunto visual e abre equipamentos;
  - mesa de estudos concede XP com cooldown e mostra anotacoes;
  - cadeiras recuperam um pouco de mana;
  - luminaria liga/desliga a luz do quarto;
  - janela abre/fecha com brilho suave;
  - quadro abre lore do quarto;
  - tapete esconde 7 moedas uma unica vez;
  - saida inferior continua levando para a vila.
- Adicionado brilho discreto no objeto interativo mais proximo, sem estragar o visual da imagem.
- `node --check app.js` passou sem erro.

## Atualizacao extra - quarto com acoes visuais do personagem
- O quarto continua usando `hero-bedroom.png` como cenário real, para manter o visual idêntico à referência.
- Interações agora mostram o personagem fazendo a ação, não apenas uma mensagem:
  - dormir: personagem deitado na cama, respirando e com Zzz;
  - estudar: personagem sentado na mesa, escrevendo/lendo com livro e +XP visual;
  - sentar: personagem sentado na cadeira;
  - armário: personagem troca equipamento com brilho e porta visual abrindo;
  - luminária, janela e quadro: personagem aponta/interage com o objeto;
  - tapete: personagem se abaixa e procura moedas.
- Enquanto a ação acontece, o personagem fica preso na pose correta por alguns segundos.
- Ao terminar, o personagem volta para uma posição segura ao lado do objeto.
- `node --check app.js` passou sem erro.

## Correção - controle do jogador durante ações do quarto
- Corrigido o problema em que o personagem ficava preso sem conseguir andar depois de interagir com cama, mesa, cadeira, armário, janela, luminária, quadro ou tapete.
- Agora a animação visual da ação aparece normalmente, mas se o jogador apertar qualquer tecla de movimento ou usar o joystick, a pose é cancelada e o controle volta imediatamente.
- O personagem é devolvido para a posição segura onde estava antes da ação, evitando ficar preso dentro da cama, mesa ou cadeira.
- `node --check app.js` passou sem erro após a correção.

## Correção do quarto interativo animado - mesa/cadeiras sem travar
- Corrigida a área da mesa e das cadeiras onde o personagem podia ficar preso.
- As zonas de interação de estudar e sentar continuam funcionando.
- A colisão grande e sobreposta da mesa/cadeiras foi removida.
- Foi mantido apenas um bloqueio pequeno no tampo da mesa, sem canto invisível prendendo o jogador.
- Se o jogador carregar o save já encostado nessa área, o código empurra o personagem para uma posição segura.
- `node --check app.js` passou sem erro.

## Atualizacao extra - Espada Infernal com combate animado
- Adicionada `infernal-sword.png` como sprite transparente, criada a partir da imagem de referencia enviada pelo usuario.
- A espada padrao agora aparece como uma espada infernal de fogo na mao do personagem.
- A Espada Vulcanica tambem usa o visual infernal reforcado.
- Ataques de espada agora mostram rastro flamejante, faiscas e impacto de fogo.
- Ao acertar inimigos, a espada aplica queimadura e efeitos visuais de chama.
- A Espada Vulcanica causa uma pequena explosao em inimigos proximos.
- O inventario mostra a miniatura da espada infernal nos slots de espada.
- Tudo foi integrado por Canvas/codigo e sprite local, sem gerar imagem nova por IA.
- `node --check app.js` passou sem erro.

## Correção da Espada Infernal
- A imagem enviada agora cria uma arma separada chamada Espada Infernal do Rift.
- A Espada curta voltou a ser normal.
- As espadas elementais/boss continuam com seus próprios visuais.
- Somente a Espada Infernal do Rift usa o sprite `infernal-sword.png`, rastro de fogo, faíscas, impacto flamejante e queimadura.
- A Espada Infernal fica desbloqueada junto das armas do jogador para teste.
- `node --check app.js` passou sem erro após a correção.

## Atualizacao extra - tres espadas de referencia
- Adicionadas as tres novas espadas enviadas pelo usuario sem gerar imagem por IA.
- `glacial-sword.png` agora e usado como sprite real da Espada Glacial Cristalina.
- `shadow-sword.png` agora e usado como sprite real da Espada Sombria Abissal.
- `storm-sword.png` agora e usado como sprite real da Espada Celeste da Tempestade.
- As sprites aparecem na mao do personagem, nos baus elementais e no inventario.
- Mantidas as interacoes de combate: gelo congela/desacelera, sombra marca/rouba vida e tempestade cria raios em cadeia.
- As espadas continuam separadas da Espada Infernal do Rift e das espadas comuns.
- `node --check app.js` passou sem erro.

## Correção - espadas elementais sem depender de bosses
- O jogador informou que não encontrou os bosses indicados para pegar as novas espadas.
- Agora as três espadas novas também aparecem em baús fixos dentro do quarto do jogador.
- Para pegar: entrar no quarto/casa, chegar perto dos baús elementais e apertar E; no celular, usar Interagir.
- Os baús não têm colisão sólida, então não prendem o personagem no quarto.
- Cada baú desbloqueia uma espada: Espada Celeste da Tempestade, Espada Glacial Cristalina e Espada Sombria Abissal.
- Os bosses/recompensas antigas não foram removidos, mas agora existe um caminho garantido para pegar as armas.
- `node --check app.js` passou sem erro.

## Hotfix - baús das espadas visíveis no quarto
- Corrigido o problema em que os baús das espadas elementais podiam não aparecer.
- Agora os 3 baús ficam sempre visíveis em cima do tapete vermelho do quarto do jogador.
- Baús adicionados: RAIO, GELO e SOMBRA.
- Se a espada já estiver desbloqueada no save, o baú aparece aberto e informa que a espada já foi coletada.
- Os baús não possuem colisão, então não prendem o personagem.
- Ao entrar no quarto, aparece aviso indicando onde estão os baús.
- `node --check app.js` passou sem erro.

## Hotfix - baús elementais e tapete do quarto
- Corrigido o problema em que o tapete vermelho interceptava a interação dos baús elementais.
- Agora, quando o jogador estiver perto dos baús RAIO, GELO ou SOMBRA, apertar E/Interagir prioriza o baú, não o tapete.
- O tapete vermelho continua visual, mas não rouba mais a interação enquanto os baús existem no quarto.
- A área de interação dos baús foi aumentada para facilitar no PC e no mobile.
- `node --check app.js` passou sem erro.

## Atualizacao final - bau unico das 3 espadas
- Removidos os 3 baus separados do quarto.
- Agora existe apenas 1 bau elemental no quarto, colocado no tapete vermelho.
- O bau unico mostra as 3 sprites/imagens das espadas juntas: Glacial, Sombria e Tempestade.
- Ao abrir o bau, o jogador recebe as 3 espadas de uma vez.
- As espadas continuam usando as imagens enviadas como sprites reais, igual ao funcionamento da espada de fogo/infernal.
- O tapete nao rouba a interacao do bau unico.
- `node --check app.js` passou sem erro.

## Correção final das espadas por imagem
- Corrigido o visual das espadas elementais em combate: elas não usam mais o cone/lâmina branca genérica durante o golpe.
- Adicionadas sprites pequenas de combate derivadas das imagens enviadas: `glacial-sword-game.png`, `shadow-sword-game.png`, `storm-sword-game.png` e `infernal-sword-game.png`.
- O jogo continua usando as imagens originais grandes no inventário e a versão game-ready na mão do personagem para preservar o desenho sem distorcer.
- O ataque agora mostra a espada real acompanhando o arco do golpe, com rastro elemental fino, sem cobrir a sprite.
- Mantido o baú único do quarto que entrega as três espadas de uma vez.
- `node --check app.js` passou sem erro.

## Adição dos 10 cajados por imagem
- Adicionados 10 cajados novos usando as imagens reais enviadas, sem gerar arte nova.
- Os arquivos foram tratados com fundo transparente e versões game-ready pequenas para o combate.
- Novos arquivos adicionados: `fire-crystal-staff.png`, `frost-crystal-staff.png`, `nature-vine-staff.png`, `necro-skull-staff.png`, `holy-seraph-staff.png`, `storm-orb-staff.png`, `arcane-crystal-staff.png`, `venom-serpent-staff.png`, `solar-scarab-staff.png`, `infernal-demon-staff.png` e suas versões `-game.png`.
- Os cajados aparecem com a imagem real na mão do personagem, no inventário e nos detalhes do item.
- Nesta versão os 10 cajados foram liberados diretamente no inventário para testar/equipar rápido.
- `node --check app.js` passou sem erro.

## Poderes dos cajados com imagens exatas
- Cada um dos 10 cajados agora dispara/usa o poder visual correspondente às imagens enviadas pelo usuário.
- As imagens dos poderes foram tratadas com fundo transparente e versões `-game.png` para aparecerem no combate sem virar quadrado ou bolinha genérica.
- Mapeamento aplicado:
  - Cajado de Cristal Flamejante: `fire-orb-power.png`.
  - Cajado Glacial Cristalino: `ice-crystal-power.png` com vórtice visual `ice-tornado-power.png` como aura de gelo.
  - Cajado da Natureza Viva: `healing-cross-power.png` e cura o jogador ao usar.
  - Cajado Necrótico do Crânio: `shadow-slash-power.png`.
  - Cajado do Serafim Radiante: `holy-gate-power.png`.
  - Cajado da Orbe da Tempestade: `lightning-orb-power.png`.
  - Cajado Arcano de Cristal: `arcane-crystal-power.png`.
  - Cajado da Serpente Venenosa: `poison-skull-power.png`.
  - Cajado Solar do Escaravelho: `earth-crystal-power.png`.
  - Cajado Infernal Demoníaco: `shadow-slash-power.png` como corte demoníaco.
- O disparo dos cajados não usa mais bolinhas genéricas para esses cajados: a imagem real do poder aparece no mapa durante o combate.
- `node --check app.js` passou sem erro.

## Correção dos poderes dos cajados: efeitos vivos, não imagem dura
- Corrigido o comportamento anterior em que o projétil parecia uma imagem dura colada no jogo.
- As imagens enviadas agora são usadas como referência visual de cor, silhueta e tema, mas o poder em combate é desenhado com efeitos vivos no Canvas.
- Cada cajado recebeu poder animado próprio com aura, partículas, brilho, rastro e movimento:
  - Cajado de Cristal Flamejante: orbe de fogo espiral com chamas e faíscas.
  - Cajado Glacial Cristalino: cristal de gelo com shards, neve e vórtice frio.
  - Cajado da Natureza Viva: selo de cura com cruz, folhas, círculo e pulsação verde.
  - Cajado Necrótico do Crânio: corte sombrio/necromante com fumaça roxa.
  - Cajado do Serafim Radiante: portão sagrado com raios dourados e estrelas.
  - Cajado da Orbe da Tempestade: orbe elétrica com raios azuis/amarelos.
  - Cajado Arcano de Cristal: cristal arcano com anéis rúnicos e fragmentos flutuantes.
  - Cajado da Serpente Venenosa: caveira/veneno com bolhas verdes e névoa tóxica.
  - Cajado Solar do Escaravelho: ruptura terrestre com cristais/rochas e brilho solar.
  - Cajado Infernal Demoníaco: corte infernal vermelho/preto com faíscas demoníacas.
- O inventário ainda mantém as imagens dos cajados e poderes como referência/ícone, mas o combate agora usa efeitos animados vivos.
- `node --check app.js` passou sem erro.

## Correção de gameplay dos poderes dos cajados
- Os poderes dos 10 cajados agora não são só visuais: cada elemento aplica efeito real em combate.
- Cajado de Cristal Flamejante: aplica queimadura com dano contínuo e pequena área de fogo.
- Cajado Glacial Cristalino: congela/desacelera inimigos e atrasa ataques.
- Cajado da Natureza Viva: cura o personagem e prende inimigos com raízes.
- Cajado Necrótico do Crânio: amaldiçoa, drena vida dos inimigos e cura o jogador.
- Cajado do Serafim Radiante: cura e cria escudo sagrado que reduz dano recebido.
- Cajado da Orbe da Tempestade: atordoa e cria raios em cadeia.
- Cajado Arcano de Cristal: deixa inimigos frágeis, aumentando dano recebido.
- Cajado da Serpente Venenosa: envenena inimigos com dano contínuo.
- Cajado Solar do Escaravelho: prende inimigos no chão e quebra defesa.
- Cajado Infernal Demoníaco: aplica fogo infernal, medo/controle e dano contínuo forte.
- `node --check app.js` passou sem erro.


## Boneco de treino na vila
- Adicionado um Boneco de Treino fixo na vila, perto da área de treino.
- O boneco é imortal, não dá dano e não dropa moedas/XP.
- Serve para testar espadas, cajados, dano, queimadura, congelamento, veneno, stun, cura/roubo de vida e outros efeitos.
- O boneco mostra pequenos indicadores visuais dos status aplicados.
- `node --check app.js` passou sem erro.


## Mais baús pelo mapa e inimigos iniciais mais fortes
- Adicionados 10 baús extras espalhados pela vila/mundo principal.
- Baús novos têm recompensas salvas: moedas, poções, flechas, XP, orbes de mana e chaves raras nos baús mais fortes.
- Baús novos ficam abertos depois de coletados e não travam o personagem.
- Inimigos pequenos/iniciais ficaram mais fortes: slimes, morcego, aranha, goblin e arqueiro goblin.
- Esses inimigos agora têm mais vida, mais dano, um pouco mais de velocidade, mais alcance de agressão e dão mais XP/moedas.
- `node --check app.js` passou sem erro.


## Correção do boneco de treino
- O boneco de treino agora tem física/colisão real.
- Corrigida a hitbox para espada e projéteis acertarem corretamente.
- O boneco continua imortal, mas agora dá para bater, travar colisão e testar dano/efeitos sem atravessar.
- `node --check app.js` passou sem erro.


## Respawn de inimigos em 1 minuto
- Agora, quando um inimigo comum é derrotado, ele renasce após 60 segundos.
- O timer de respawn também é salvo no save.
- Bosses e o boneco de treino não entram no respawn automático.
- `node --check app.js` passou sem erro.


## Exteriores das casas da vila com imagem real
- As casas da vila agora usam as duas imagens enviadas como sprites reais.
- Fundo branco das imagens foi recortado e convertido para transparente.
- Casas normais alternam entre telhado azul e telhado de barro; casa do jogador/loja usam visual especial.
- Não foi gerada imagem nova, apenas uso direto das referências como assets do jogo.
- `node --check app.js` passou sem erro.


## Remoção do diálogo das casas
- Removido o diálogo automático das casas da vila.
- As casas continuam usando as imagens reais enviadas como sprites.
- Agora chegar perto das casas não abre a caixa de texto de exterior renovado.
- `node --check app.js` passou sem erro.


## Zoom da tela com mouse e mobile
- Scroll do mouse agora aproxima ou afasta a câmera do jogo.
- O zoom muda a câmera real do Canvas, não apenas o CSS.
- Mobile ganhou botões + e - e suporte a pinça com dois dedos.
- A mira do mouse e o toque no mobile foram ajustados para funcionar com zoom.
- O zoom fica salvo no navegador.
- `node --check app.js` passou sem erro.


## Zoom por scroll e mobile
- Scroll do mouse aumenta/diminui o zoom real da câmera do jogo.
- Mobile tem botões + e - na tela e suporte a gesto de pinça com dois dedos.
- A mira do mouse, o toque no mobile, a câmera e o carregamento do mapa foram ajustados para respeitar o zoom.
- O zoom fica salvo no navegador.
- `node --check app.js` passou sem erro.


## Casa do jogador com visual de mansao
- Apenas a casa do jogador agora usa o visual da mansao azul enviada como referencia.
- As outras casas da vila permanecem como antes.
- O tamanho visual da mansao foi ajustado para ficar bonita sem apertar o espaco da vila.
- O dialogo da casa continua desativado.


## Hotfix visual do jogador
- Corrigido erro `premiumWorldShadow is not defined`.
- Adicionadas versões seguras das funções visuais usadas pelo novo jogador.
- Mantida a animação de ataque melhorada.
- `node --check app.js` passou sem erro.


## Hotfix do jogador: sem fundo preto e com animação vertical
- Corrigido o fundo preto das sprites do jogador, agora transparente.
- Adicionados frames derivados das próprias sprites enviadas para caminhada subindo e descendo.
- Mantida a animação melhorada de ataque sem gerar imagem nova.
- `node --check app.js` passou sem erro.


## Hotfix do jogador: transparência precisa
- Corrigida a remoção agressiva de fundo que apagava partes do corpo.
- As sprites foram refeitas a partir das imagens originais com preservação de contorno, cabelo, braços, pernas e roupa.
- Mantida a animação para subir/descer e a animação de ataque melhorada.
- Atualizado cache-buster dos sprites para o navegador não usar os antigos.
- `node --check app.js` passou sem erro.

# pc-rpg-hud-only-20260707

## Ajuste aplicado
- Criado um novo HUD estilo RPG/MMORPG somente para PC, inspirado na imagem de referência enviada.
- O HUD antigo do PC é ocultado quando o novo HUD está ativo.
- O painel lateral de controles do PC é ocultado para deixar a tela mais limpa.
- O HUD novo mostra: personagem, classe, nível, HP, MP, XP, moedas, cristais, gemas, missão, contrato, boss, mapa tático, ações, hotbar e chat visual.

## Proteção do mobile
- O mobile não foi alterado.
- O inventário legado do mobile continua intacto.
- O HUD mobile limpo continua intacto.
- Joystick, botões touch, hotbar mobile, menu mobile e otimizações mobile não foram modificados.
- O HUD novo usa `body.pc-rpg-hud-active` e é bloqueado por `body.is-mobile` e `(pointer: coarse)`.

## Resultado
- PC recebe o HUD novo.
- Mobile continua com a versão já ajustada anteriormente.
- `node --check app.js` passou sem erro.


# pc-village-vivid-texture-only-20260707
- Adicionada textura mais viva para a Vila Principal SOMENTE no PC.
- O patch adiciona detalhes leves por cima dos tiles existentes: grama mais viva, pequenas flores, rachaduras, pedrinhas, musgo nas bordas, água com reflexos e brilho ambiente discreto no centro/portal.
- Nada foi removido: casas, HUD PC interativo, rotbar antiga oculta no PC, mobile, joystick, inventário legado, mapas, colisões, NPCs, inimigos e save foram preservados.
- O overlay não roda em `body.is-mobile`, pointer coarse ou tela menor que 900px.


## Atualização 2026-07-07 — inventário novo estilo referência
- remove o inventário antigo/legado e aplica o inventário novo em PC e mobile.
- mantém HUD, vila, casas, hotbar, missões, save, áudio e demais sistemas.
- novo inventário inspirado na referência enviada: topo com resumo, abas, busca, ordenação, painel equipado, grade central e detalhe lateral.


## Atualização 2026-07-07 — textura do chão da vila igual à referência
- textura do chão da Vila Principal refeita para ficar muito mais próxima da referência enviada.
- não usa a imagem por cima; o chão foi recriado por código/pixel render.
- mantém inventário novo, HUD, casas, hotbar, áudio e demais sistemas.


## Atualização 2026-07-07 — opção de mexer no HUD novo
- Adicionado botão **Mexer HUD** no HUD novo do PC.
- No modo edição, é possível arrastar status, menu, recursos, missão, classe, boss, minimapa, ações, hotbar e chat.
- O layout fica salvo no navegador e pode ser resetado.
- Mobile permanece protegido e sem mudanças.


## Atualização 2026-07-07 — editor do HUD novo com tamanho e ocultação
- adiciona opções para aumentar, diminuir e sumir com cada bloco do HUD novo no PC.
- mantém o modo de arrastar, salvar e resetar.
- mobile continua protegido sem alteração.


## Atualização 2026-07-07 — personagem novo com animações
- personagem trocado usando a sprite sheet enviada pelo usuário.
- animações adicionadas: parado, andando em quatro direções e ataque.
- não foi gerada imagem nova; a imagem enviada foi convertida em sprites transparentes do jogo.
- mantém HUD, inventário, vila, chão, casas, missões, save, áudio e demais sistemas.


## NPCs da referência adicionados
- NPCs com visual novo baseado nas 4 imagens de referência.
- Animação de idle, caminhada e ação ao interagir.
- Funções: fazendeira Mina cura e entrega recursos, Ari dá defesa temporária, Vendedor continua com loja, Nico continua com missão, Beto continua com carta.
- NPCs extras: Téo, Bran, Sora e Lia foram adicionados na vila sem remover os anteriores.


## Correção dos NPCs animados
- sprites dos NPCs recortados novamente por detecção de frames, não por grade fixa quebrada.
- removidos cortes, barras pretas e partes bugadas dos frames.
- escala de desenho ajustada para caber melhor na vila.


## Correção segura — sem alterar HUD, inventário, casas, NPCs ou chão da vila
- Esta versão volta para a base boa com HUD, inventário, textura da vila, casas, personagem e NPCs preservados.
- A Loja do Ferreiro e o interior do Ferreiro foram adicionados como patch isolado, sem substituir casas.
- O Quarto do Herói foi adicionado apenas dentro da casa do jogador, usando sistema de tilemap interno.
- O quarto é desenhado por tiles e objetos separados, com camadas ground, floorDecor, objectsBack, player, objectsFront e lighting.
- node --check app.js passou sem erro.

---
## Atualização segura — Quarto do Herói fiel em tilemap

Esta versão parte da última base boa restaurada com ferreiro e altera **somente** o interior da casa/quarto do herói.

Mantido sem alteração:
- HUD
- inventário
- casas da vila
- NPCs
- textura do chão da vila
- personagem
- ferreiro e interior da forja
- demais sistemas do jogo

O quarto foi reconstruído por `tilemap` e objetos separados, sem usar uma imagem única como fundo.
Camadas do sistema:
1. ground
2. floorDecor
3. objectsBack
4. player
5. objectsFront
6. lighting


## Correção 2026-07-07 — entrada no ferreiro
- Corrigido erro: `updatePlayerMovement is not defined`.
- Ajuste isolado: adicionada função de movimento usada apenas pelo update especial do interior do ferreiro.
- Nenhum sistema visual ou de conteúdo foi alterado.


## Correção 2026-07-07 — texturas dos biomas restauradas
- Corrige o patch que espalhava textura da Vila Principal por outros biomas.
- Restaura variação visual de grama, floresta, caminho, pedra e água fora da vila central.
- Mantém HUD, inventário, casas, NPCs, personagem, ferreiro e quarto sem alteração.

## Correção do Ferreiro — updateCamera

Corrige o erro `updateCamera is not defined` ao entrar no interior da Loja do Ferreiro.

Escopo da correção:
- não altera HUD
- não altera inventário
- não altera casas
- não altera NPCs
- não altera textura dos biomas
- não altera personagem
- não altera quarto
- não altera visual do ferreiro


## mobile-hud-clean-only-20260707
- Alteração SOMENTE no mobile via CSS (`body.is-mobile`).
- Mantém no mobile apenas HUD essencial: Herói, Vida e Mana.
- Esconde no mobile: Área, Missão, Moedas, Arma, Oxigênio, Poder, Boss, minimapa, botões de salvar/reset/menu e botões extras.
- Mantém controles principais: joystick, inventário, ataque, ação, poção, dash, cura e bola de fogo.
- Não altera PC, HUD do PC, inventário, casas, NPCs, vila, ferreiro, biomas, personagem ou quarto.

## Fix seguro: mobile entra novamente + sem HUD novo

Esta versao foi gerada a partir da ultima base mobile limpa anterior ao hardfix.
O hardfix anterior adicionava JavaScript forte demais para bloquear o HUD novo e podia travar o carregamento no celular.

Nesta versao:
- `app.js` nao foi alterado.
- Apenas `styles.css` recebeu um bloqueio visual do `#erMmoHud` em mobile.
- PC e sistemas do jogo permanecem intactos.


Alteração aplicada: personagem principal trocado para Rogue/Assassin com spritesheet funcional (idle, walk, attack slash e dash slash), para PC e mobile, sem mexer nas outras partes do jogo.
