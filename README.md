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
