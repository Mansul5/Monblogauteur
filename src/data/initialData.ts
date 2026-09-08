import { Work, Chapter, PenName, Comment, LoreUniverse } from '../types';

export const INITIAL_PEN_NAMES: PenName[] = [
  {
    id: 'souleymane-thiao',
    name: 'Souleymane Thiao',
    tagline: 'Légendes solaires, épopées ancestrales et afrofantasy sombre',
    genreFocus: 'Dark Afrofantasy & Épopée Mythologique',
    bio: 'Auteur principal. Passionné par les récits oraux sahéliens, les mythes mandingues et wolofs réinventés dans des fresques de fantasy sombre et crépusculaire.',
  },
  {
    id: 'nox-diallo',
    name: 'Nox Diallo',
    tagline: 'Cyberpunk saharien, néon-noir et IA totémiques',
    genreFocus: 'Afrofuturisme & Thriller Technologique',
    bio: 'Pseudonyme dédié aux fictions prospectives : Dakar 2099, mémoires ancestrales encodées sur nanoréseaux et intrigues d’espionnage corpo-mystique.',
  },
  {
    id: 'st-kebe',
    name: 'S. T. Kébé',
    tagline: 'Fantastique ésotérique, pactes côtiers et mystères nocturnes',
    genreFocus: 'Nouvelles Ésotériques & Horreur Cosmique Africaine',
    bio: 'Plume réservée aux nouvelles d’ambiance, récits maritimes de l’Atlantique noir et rencontres aux frontières du monde des esprits.',
  },
];

export const INITIAL_WORKS: Work[] = [
  {
    id: 'work-1',
    title: 'Les Cendres de Songhaï',
    penNameId: 'souleymane-thiao',
    type: 'roman',
    status: 'en_cours',
    genres: ['Dark Afrofantasy', 'Magie Solaire', 'Épique'],
    tags: ['#EmpirePerdu', '#MasquesVivants', '#ForgeDeBraises', '#Ancêtres', '#MagieNoire'],
    shortDescription: 'Dans un Sahel calciné où les fleuves exigent des tributs d’ombre, une forgeuse de braises renégate réveille par erreur le dernier empereur-dieu de Gao.',
    fullDescription: 'Depuis la Grande Brûlure, les douze cités du fleuve vivent sous la terreur des Veilleurs de Cendre. Kani, orpheline née avec la marque des flammes dorées sur les paumes, survit en restaurant les reliques interdites des tombeaux royaux. Lorsqu’un seigneur de guerre la contraint à desceller le sarcophage d’obsidienne de l’antique souverain Askia le Maudit, elle ne libère pas un cadavre, mais une entité faite de magma et de rancœur millénaire. Une marche sanglante commence alors à travers les dunes incandescentes.',
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=80',
    universeId: 'universe-songhai',
    featured: true,
    createdAt: '2026-01-15',
    updatedAt: '2026-03-02',
    viewsCount: 3840,
  },
  {
    id: 'work-2',
    title: "Sahel Cybernétique : L'Ombre de N'Diaye",
    penNameId: 'nox-diallo',
    type: 'roman',
    status: 'en_cours',
    genres: ['Afrofuturisme', 'Cyberpunk', 'Thriller'],
    tags: ['#Dakar2099', '#GriotsAugmentés', '#IAAncestrale', '#NéonNoir', '#NeuroPuces'],
    shortDescription: 'Dakar, 2099. Des puces neuro-totémiques relient les citoyens à la mémoire ancestrale du Cloud. Quand un hacker efface des lignées entières, un détective usé mène l’enquête.',
    fullDescription: 'Sur la presqu’île hérissée de gratte-ciels en bio-titane et de marchés suspendus illuminés de néons ambrés, le réseau G.R.I.O.T. enregistre chaque pulsation d’âme. Makhtar Sarr, ancien cyber-commissaire devenu limier privé dans les tréfonds de Médina-Basse, reçoit un appel terrifiant : un oligarque de la biotechnologie a été retrouvé le cerveau calciné, ses généalogies numériques effacées jusqu’au XVe siècle. Qui cherche à voler la mémoire de tout un peuple ?',
    coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=900&q=80',
    universeId: 'universe-cyber-sahel',
    featured: true,
    createdAt: '2026-02-01',
    updatedAt: '2026-03-05',
    viewsCount: 2910,
  },
  {
    id: 'work-3',
    title: 'La Nuit du Kouroukan',
    penNameId: 'souleymane-thiao',
    type: 'nouvelle',
    status: 'one_shot',
    genres: ['Fantasy Sombre', 'Mystère Historique'],
    tags: ['#ChasseurDozo', '#ForêtSacrée', '#PacteDeSang', '#OneShot', '#Féline'],
    shortDescription: 'Un vieux maître chasseur Dozo accepte une ultime traque dans la clairière des serments oubliés, où rôde une bête sans ombre.',
    fullDescription: 'À la lisière de la falaise de Bandiagara, personne ne franchit le cercle des baobabs noueux après le coucher du soleil. Babacar, dont le fusil à silex a jadis terrassé les chimères de la savane, reçoit la visite d’une fillette aux yeux ambrés qui ne projette aucune ombre sur le sol. Elle lui murmure une promesse que son grand-père avait jurée soixante ans plus tôt. Une nouvelle poignante et immersive sur le poids de la parole donnée.',
    coverUrl: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&w=900&q=80',
    universeId: 'universe-songhai',
    featured: false,
    createdAt: '2026-02-12',
    updatedAt: '2026-02-12',
    viewsCount: 1750,
  },
  {
    id: 'work-4',
    title: 'Le Dernier Veilleur de Gorée',
    penNameId: 'st-kebe',
    type: 'nouvelle',
    status: 'one_shot',
    genres: ['Fantastique Ésotérique', 'Horreur Cosmique'],
    tags: ['#OcéanNocturne', '#ÎleMémoire', '#MamiWata', '#OneShot', '#Brumes'],
    shortDescription: 'Chaque nuit de pleine lune, un gardien de phare solitaire entend les voix des profondeurs océaniques réclamer le péage de l’oubli.',
    fullDescription: 'Les remparts ocres de l’île s’effritent sous les assauts de l’écume atlantique. Mansour est le seul gardien à refuser de brancher les lanternes automatisées. Car il sait ce que la lumière électrique aveugle : lorsque les marées de minuit se teintent de reflets pourpres, les créatures d’abîme remontent le long des récifs basaltiques pour murmurer les noms des disparus.',
    coverUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
    universeId: 'universe-oceans',
    featured: false,
    createdAt: '2026-01-20',
    updatedAt: '2026-01-20',
    viewsCount: 1420,
  },
  {
    id: 'work-5',
    title: "L'Éveil du Sang d'Or",
    penNameId: 'souleymane-thiao',
    type: 'roman',
    status: 'en_cours',
    genres: ['LitRPG Afrofantasy', 'Progression Fantasy', 'Action'],
    tags: ['#SystèmeRéfractaire', '#RunesKemit', '#ArbreMonde', '#ArtMartial'],
    shortDescription: 'Quand le Système Cosmique s’active au-dessus de l’Afrique subsaharienne, un jeune apprenti sculpteur hérite de la classe légendaire d’Architecte d’Âmes.',
    fullDescription: 'L’Aube des Runes a frappé la Terre sans avertissement. Des stèles célestes sont tombées sur les sept collines, projetant des fenêtres de statut translucides devant les yeux de chaque être humain. Alors que la plupart éveillent des classes de Chasseur de Dunes ou de Guerrier de Lance, Malik débloque une compétence scellée depuis les dynasties prédynastiques : la Fusion Runique des Métaux Primordiaux.',
    coverUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=900&q=80',
    universeId: 'universe-songhai',
    featured: true,
    createdAt: '2026-02-18',
    updatedAt: '2026-03-01',
    viewsCount: 2280,
  },
];

export const INITIAL_CHAPTERS: Chapter[] = [
  // Work 1: Les Cendres de Songhaï
  {
    id: 'ch-w1-1',
    workId: 'work-1',
    chapterNumber: 1,
    title: 'La Braise dans la Gorge',
    status: 'publie',
    publishedAt: '2026-01-15',
    wordCount: 1420,
    readingTimeMinutes: 6,
    content: `Le vent d’harmattan transportait une odeur de soufre et de peau brûlée. 

Kani essuya d'un revers de manche la suie qui lui encroûtait les cils. Devant elle, la forge troglodytique ronronnait comme un fauve repu, baignant les parois de grès rouge d'une pulsation écarlate. Dans le creuset, le métal ancestral ne fondait pas comme le vulgaire fer des marchands du fleuve. Il chantait. Une mélopée basse, syncopée, pareille aux tambours de guerre que les anciens guerriers frappaient avant d'affronter les djinns du désert.

— Plus fort, Kani ! cracha le maître de forge d'une voix rauque. Les soufflets doivent cracher du feu pur, pas l'haleine d'un chamelier fatigué !

Kani ne répondit pas. Elle serra les poings. Sous sa peau sombre, de fines veines incandescentes s'allumèrent le long de ses avant-bras, vibrant d'un éclat d'or liquide. Elle n'avait pas besoin de soufflet en cuir d'antilope. Son propre souffle suffisait à attiser la braise sacrée. 

Elle inspira profondément, emplissant ses poumons d'air sec et brûlant. Lorsqu'elle expira au-dessus du creuset, une gerbe de flammes violettes jaillit de sa bouche, enveloppant le lingot d'obsidienne. Le métal céda enfin, se pliant en une lame recourbée gravée de runes solaires.

— Par les neuf ancêtres... murmura une voix étrangère derrière eux.

Kani pivota d'un bond, saisissant la pince à braises encore rougie. Trois cavaliers vêtus de capes en soie d'ébène et de heaumes sculptés à l'effigie d'hyènes se tenaient à l'entrée de la grotte. Leurs montures aux yeux luminescents hennissaient d'impatience.

À leur tête se tenait le Commandant Balla, l'exécuteur en chef de la Cité des Ombres.

— Reste tranquille, forgeuse, susurra Balla en posant sa main gantée de cuir reptilien sur la garde de son cimeterre. Nous ne venons pas voler ton fer. Le Roi de Cendre a un sarcophage à ouvrir dans la nécropole interdite de Gao. Et selon la prophétie des sables, seul le souffle d'une enfant marquée par le feu primordial peut briser les sceaux.

Kani sentit un frisson glacial remonter le long de sa colonne vertébrale. La nécropole de Gao était scellée depuis sept siècles. Nul n'en était jamais revenu vivant.

— Et si je refuse ? demanda-t-elle calmement, la pointe de sa pince braisée dirigée vers la gorge du cavalier.

Balla eut un sourire sans joie. 

— Tu ne refuseras pas, Kani. Car dans ce tombeau repose le cœur de ta propre mère.`,
  },
  {
    id: 'ch-w1-2',
    workId: 'work-1',
    chapterNumber: 2,
    title: 'Le Sarcophage de Minuit',
    status: 'publie',
    publishedAt: '2026-01-22',
    wordCount: 1680,
    readingTimeMinutes: 7,
    content: `La descente vers les entrailles de la nécropole dura des heures dans un silence que seul troublait le cliquetis des armures d'ébène.

Des colonnes colossales taillées dans le basalte soutenaient une voûte invisible perdue dans les ténèbres. Les torches imprégnées de graisse de crocodile diffusaient une lueur verdâtre qui faisait danser les bas-reliefs : des armées de guerriers ailés terrassant des serpents d'étoiles, des rois coiffés de couronnes de cornes tressant la lumière du soleil naissant.

— Ne touche à rien, siffla Kani à l'adresse du soldat qui marchait à sa droite. Les dalles sont piégées avec du venin de scorpion lunaire. Un faux pas et ton sang se cristallise en poussière avant que tu n'aies le temps de crier.

Le mercenaire retira vivement sa botte d'une dalle ornée d'un œil gravé.

Au centre de la vaste rotonde funéraire se dressait le sarcophage. 

Il mesurait plus de quatre mètres de long, sculpté dans un bloc unique d'obsidienne si poli qu'il reflétait les visages des intrus comme un miroir d'eau noire. Sept chaînes d'orichalque le ceinturaient, verrouillées par des cadenas à combinaison runique.

— C'est ton heure, fille de la flamme, ordonna le Commandant Balla en la poussant vers l'estrade. Brise les liens.

Kani s'avança. À mesure qu'elle approchait, la chaleur de ses paumes répondait à une vibration sourde issue du cercueil. Ce n'était pas le calme de la mort qui régnait ici. C'était un sommeil artificiel, retenu de force depuis des âges.

Elle posa ses deux mains nues sur le premier anneau de chaîne.

Une décharge d'énergie brute parcourut son corps. Ses yeux devinrent deux soleils miniatures. Des symboles solaires oubliés apparurent en relief sur sa peau, s'étendant de ses doigts jusqu'à son cou.

*« Qui ose interrompre le festin de cendre ? »* murmura une voix directement dans son esprit, une voix qui ressemblait à l'effondrement d'une montagne.

— Je m'appelle Kani, pensa-t-elle avec une ferveur désespérée. Et je suis venue chercher ce qui m'appartient.

Le premier maillon de la chaîne explosa dans un fracas d'étincelles dorées.`,
  },
  {
    id: 'ch-w1-3',
    workId: 'work-1',
    chapterNumber: 3,
    title: 'L’Éveil du Dieu-Feu',
    status: 'publie',
    publishedAt: '2026-02-05',
    wordCount: 1550,
    readingTimeMinutes: 6,
    content: `La sixième chaîne tomba avec un tintement sinistre. 

Le couvercle d'obsidienne commença à glisser de lui-même, poussé de l'intérieur par une force titanesque. Une vapeur argentée et glaciale s'échappa de la fente, contrastant violemment avec la fournaise qui embrasait les doigts de Kani.

Balla et ses hommes reculèrent de trois pas, leurs arcs bandés, les pointes de flèches enduites d'huile bénite.

Une main squelettique, mais enveloppée de filaments de lumière pourpre, émergea du cercueil et s'agrippa au rebord de pierre.

Puis, une silhouette démesurée se dressa.

Ce n'était ni un homme ni un spectre. C'était le souverain Askia le Maudit. Sur son crâne chauve et noir comme la nuit reposait une couronne forgée dans les fragments d'une météorite tombée au temps des premiers empires. Ses yeux étaient deux puits de néant violet où tourbillonnaient des galaxies mourantes.

— Des hommes... prononça l'entité. Des créatures éphémères qui sentent la sueur et la peur.

Son regard se posa ensuite sur Kani. La lueur violette dans ses orbites vacilla un instant, remplacée par une nuance d'or intense.

— Toi... murmura-t-il, sa voix faisant trembler les dalles de basalte sous leurs pieds. Tu portes le sang de la Grande Lignée des Maîtres-Feu. Dis-moi, enfant... l'Empire existe-t-il encore, ou les sables ont-ils tout dévoré ?

— L'Empire est mort, répondit Kani sans ciller, refusant de baisser la tête devant le demi-dieu. Et les seigneurs qui règnent aujourd'hui ne valent guère mieux que des hyènes affamées.

Askia poussa un rire sourd qui fit pleuvoir des débris de roche du plafond de la crypte.

— Alors, jeune forgeuse... nous allons devoir tout recommencer à zéro.`,
  },

  // Work 2: Sahel Cybernétique
  {
    id: 'ch-w2-1',
    workId: 'work-2',
    chapterNumber: 1,
    title: 'Mémoire zappée à Ouakam-Plateau',
    status: 'publie',
    publishedAt: '2026-02-01',
    wordCount: 1390,
    readingTimeMinutes: 5,
    content: `La pluie acide glissait sur la visière holographique de Makhtar Sarr.

En bas, à trois cents mètres sous la passerelle magnétique, les néons ambrés et turquoises du quartier de Ouakam pulsaient au rythme des basses d'un mbalax électro-synthétique. Les gratte-ciels en bio-céramique arboraient des fresques géantes représentant les héros de la Fédération Ouest-Africaine Unie, leurs yeux animés par des algorithmes publicitaires personnalisés.

— Inspecteur Sarr ? La connexion neuronale est instable, grésilla l'IA de son oreillette en wolof moderne. Le débit dans votre implant occipital chute à 40 tera-octets.

— Règle le tampon sur le plexus totem, Fary, grogna Makhtar en tirant une bouffée de sa cigarette électronique à la cardamome. Dis-moi plutôt ce qui attend dans l'appartement 404.

— Le sujet s'appelle Cheikh Tidiane Wade. Cinquante-deux ans. Vice-président exécutif chez Sahel-NeuroTech. Son bio-moniteur s'est arrêté net à 02h17. Aucune effraction physique. Pourtant, tous les serveurs de généalogie quantique de sa demeure ont été wiped. Nettoyés jusqu'à la racine.

Makhtar activa ses semelles magnétiques et franchit le seuil du penthouse en verre fumé.

Le corps de Wade reposait dans un fauteuil ergonomique en peau de zébu synthétique. Ses yeux grand ouverts reflétaient un écran statique blanc. De ses deux oreilles coulaient de minces filets de liquide céphalo-rachidien iridescent mélangé à du nanogel de refroidissement.

Makhtar sortit son scanner optique et se pencha sur la nuque du cadavre.

Le port de connexion neuronale avait tout simplement fondu. Mais ce n'était pas une surtension électrique ordinaire. Quelqu'un avait forcé l'implant à télécharger une quantité d'arbres généalogiques équivalente à trois millions d'individus en moins d'une nanoseconde.

— Regarde ça, Fary, murmura Makhtar en déchiffrant une ligne de code résiduelle incrustée dans la pupille vitreuse du mort.

Sur l'affichage rétinien de Makhtar clignotait un glyphe runique mandingue stylisé en hyper-vecteurs :

\`[ALERTE: PROTOCOLE BAOBAB CORROMPU - LIGNÉE N'DIAYE SUPPRIMÉE]\`

— C'est impossible, souffla l'IA Fary d'une voix soudain déformée par la panique. La lignée N'Diaye... c'est celle des fondateurs de la capitale. Si leurs ancêtres sont effacés du Cloud Ancestral, toute la citoyenneté numérique de deux millions de Dakarois s'effondre demain matin.

Makhtar rechargea son arme à impulsion cinétique.

— Quelqu'un réécrit l'Histoire à coups de virus totémiques. Et il vient tout juste de commencer.`,
  },
  {
    id: 'ch-w2-2',
    workId: 'work-2',
    chapterNumber: 2,
    title: 'Le Souk des Âmes Artificielles',
    status: 'publie',
    publishedAt: '2026-02-14',
    wordCount: 1520,
    readingTimeMinutes: 6,
    content: `Le marché noir de Tilène-Nord n'apparaissait sur aucune carte satellite officielle.

Pour y accéder, il fallait emprunter les conduites de ventilation abandonnées de l'ancien métro aérien, là où les câbles supraconducteurs dégoulinaient comme des lianes lumineuses au-dessus d'étals bondés. On y vendait de tout : des implants rétiniens d'occasion récupérés sur des androïdes de combat, des flacons de phéromones de panthère génétiquement modifiée, et surtout, des fragments de souvenirs illégaux.

Makhtar avançait le chapeau rabattu sur les yeux, la main droite prête à dégainer sous sa veste en wax thermo-isolant.

Une silhouette encapuchonnée l'attendait devant une échoppe ornée d'amulettes électroniques en cuivre rouge.

— Tu es en retard, Makhtar, susurra la femme. Ses doigts étaient prolongés de fines aiguilles optiques qui effleuraient le clavier d'un terminal en bois d'ébène poli.

— Le trafic des drones au-dessus de la corniche était infernal, Amina. Tu as pu analyser le code du virus ?

Amina brancha un connecteur dans la paume de Makhtar. Immédiatement, une cascade de données et d'images jaillit dans son champ de vision intérieur : des visages d'anciens rois, des poèmes oraux du XVIe siècle traduits en équations matricielles, puis des scènes de panique dans les banques de données de la cité.

— Ce n'est pas un hacker isolé, dit Amina à voix basse. Ce code a été écrit avec une signature militaire impériale. Celle des unités fantômes que le gouvernement prétend avoir démantelées après la Guerre des Énergies Solaires.

— Pourquoi s'attaquer aux mémoires ancestrales ?

— Parce que dans ce pays, Makhtar, la terre et le pouvoir appartiennent à ceux qui peuvent prouver leur filiation avec les premiers bâtisseurs. Efface leur arbre, et leurs héritiers perdent tout droit légal au sol au prochain lever de soleil.

Soudain, le terminal d'Amina émit un sifflement strident.

Tous les néons du marché vacillèrent, passant de l'ambre chaud au rouge sang.

— Ils nous ont pistés, lâcha Amina en déconnectant violemment ses aiguilles. Tire-toi !`,
  },

  // Work 3: La Nuit du Kouroukan (One-shot complet)
  {
    id: 'ch-w3-1',
    workId: 'work-3',
    chapterNumber: 1,
    title: 'Le Pacte des Dozos',
    status: 'publie',
    publishedAt: '2026-02-12',
    wordCount: 1850,
    readingTimeMinutes: 8,
    content: `Babacar s’assit sur le billot d’acajou devant sa case en banco, la corne de poudre posée entre ses genoux rugueux. 

À soixante-douze ans, ses mains tremblaient parfois lorsqu’il versait le thé à la menthe dans les petits verres ébréchés, mais jamais lorsqu’il armait le chien de son fusil de chasse à silex. Les gris-gris cousus sur sa veste de dozo en cotonnade brune étaient noircis par la fumée de cinquante années de bivouac. Chacune de ces amulettes racontait une bête domptée : le buffle d’eau de la mare aux nénuphars, le léopard noir qui volait les enfants dans la falaise, et les esprits errants que les citadins modernes traitaient de superstitions ridicules.

Le soleil venait de basculer derrière la crête rouge des monts Mandingues, laissant le ciel drapé dans une mousseline d'indigo et d'or pourpre.

Un crissement de gravier le fit lever la tête.

Une fillette d'une dizaine d'années se tenait à la limite exacte du cercle tracé autour de sa concession avec de la cendre de bois sacré. Elle portait une robe blanche immaculée que la poussière rouge du chemin ne semblait pas toucher. Ses yeux brillaient d'un éclat d'ambre trop vif, trop profond pour son âge.

Mais ce qui glaça le vieux chasseur jusqu'aux os, ce fut le sol sous ses pieds nus :

Bien que la lune montante projetât l'ombre étirée de Babacar sur la façade de terre séchée, la fillette, elle, ne possédait aucune ombre.

— Salam aleykoum, vieux maître de la brousse, dit l'enfant d'une voix claire qui semblait résonner à la fois près de son oreille et du fond de la gorge de la montagne.

— Aleykoum salam, petite djinn, répondit posément Babacar en ne lâchant pas son fusil. Ton peuple n'a plus le droit de traverser la ligne de cendre depuis le traité scellé sous le grand baobab par mon grand-père.

La fillette esquissa un sourire qui dévoila des dents triangulaires, blanches comme des coquillages de mer.

— Le traité expire cette nuit, Babacar. À minuit pile, la constellation de la Panthère céleste alignera ses trois yeux avec la flèche de ta maison. Et la dette doit être payée.

Le cœur de Babacar tambourina contre ses côtes. Il se souvint des paroles de son aïeul sur son lit de mort : *« Un jour viendra où la forêt réclamera le fusil d’or ou l’âme du dernier chasseur. Ce jour-là, ne fuis pas. Regarde la nuit dans les yeux. »*

— Que réclame ton maître ?

— Pas ton âme, vieux dozo. Ton âme a trop le goût de la cendre et du tabac fort. Nous réclamons la bête sans nom qui s'est échappée des cavernes profondes et qui dévore les troupeaux des villageois. Elle porte une blessure de plomb magique que seuls tes yeux usés savent pister dans le noir. Si tu l'abats avant le chant du coq, le pacte sera renouvelé pour un autre siècle d'hommes.

Babacar se leva sans un mot. Ses articulations craquèrent, mais son pas était droit. Il accrocha sa gourde d'eau de source à sa ceinture, glissa trois balles trempées dans l'indigo dans sa cartouchière, et souffla sur la cendre protectrice.

— Montre-moi le chemin, ombrelette. Montre-moi où saigne la nuit.`,
  },

  // Work 4: Le Dernier Veilleur de Gorée (One-shot complet)
  {
    id: 'ch-w4-1',
    workId: 'work-4',
    chapterNumber: 1,
    title: 'Les Murmures de la Marée Pourpre',
    status: 'publie',
    publishedAt: '2026-01-20',
    wordCount: 1620,
    readingTimeMinutes: 7,
    content: `À vingt-trois heures, l'île de Gorée s'endormait enfin. 

Les chaloupes des touristes avaient regagné l'embarcadère de Dakar depuis longtemps. Les venelles bordées de bougainvilliers écarlates et de façades coloniales couleur safran sombraient dans un recueillement presque religieux. 

Seul le phare du promontoire nord continuait de balayer les flots noirs de son pinceau de lumière blanche.

Mansour montait les quatre-vingt-douze marches en colimaçon de fer forgé d'un pas mesuré. Dans sa main gauche, il tenait sa théière émaillée bleue et une fiole d'huile d'arachide bénite par les marabouts de Yoff.

Le directeur du port lui avait répété mille fois :
*« Mansour, nous allons installer un système LED programmable piloté par satellite. Tu n'auras plus besoin de veiller toute la nuit là-haut. »*

Et chaque fois, Mansour avait souri doucement sans expliquer l'évidence : une machine à diode ne sait pas chanter les prières quand l'eau de mer change de couleur.

Arrivé dans la coupole de verre, Mansour contourna la lentille de Fresnel monumentale. Il regarda par la baie vitrée ouverte sur le large.

Comme prévu, la marée d'équinoxe ne roulait pas d'écume blanche. 

Sous la clarté d'une lune ceinturée d'un halo violacé, les vagues qui venaient se briser contre les rochers basaltiques avaient la consistance huileuse du vin de palme fermenté et la teinte d'un sang noirci.

Puis vinrent les voix.

Elles ne venaient pas du ciel, mais de la surface mouvante des abysses. Des milliers de voix polyphoniques, entremêlées dans toutes les langues oubliées des côtes de l'Ouest : wolof ancien, sérère des îles du Saloum, mandingue, kimbundu.

*« Mansour... tourne la lumière vers le banc des coraux... montre-nous le passage... »*

Mansour ferma les yeux un instant pour ne pas céder au vertige. Il trempa son index dans l'huile bénite et traça un cercle protecteur sur le cuivre de la console.

— Vous ne passerez pas ce soir, murmura-t-il avec tendresse et fermeté. Le monde des vivants a besoin de repos. Dormez encore sous le sel, mes enfants. Dormez jusqu'à l'aube.

Il saisit la manivelle manuelle et dévia le faisceau vers le ciel étoilé, privant les créatures sous-marines du phare qu'elles cherchaient pour regagner la terre ferme.

Un long soupir d'embruns balaya les parois de verre. Les vagues reprirent peu à peu leur couleur d'argent limpide.

Mansour s'assit dans son fauteuil d'osier, servit un fond de thé bouillant, et reprit son carnet pour consigner la nuit :
*« 20 janvier. Marée haute. Les ancêtres ont chanté jusqu'à trois heures. Aucun naufrage à déplorer. La mémoire veille. »*`,
  },

  // Work 5: L'Éveil du Sang d'Or
  {
    id: 'ch-w5-1',
    workId: 'work-5',
    chapterNumber: 1,
    title: 'L’Apparition du Grand Système Mandingue',
    status: 'publie',
    publishedAt: '2026-02-18',
    wordCount: 1350,
    readingTimeMinutes: 5,
    content: `Malik martelait une bande de bronze dans l’atelier de son oncle lorsque le monde s’arrêta net.

Le marteau resta suspendu à dix centimètres de l’enclume. Les étincelles incandescentes se figèrent dans les airs comme des lucioles emprisonnées dans de la résine transparente. Au-dehors, les bruits de klaxons et les cris des vendeuses de mangues s’éteignirent d’un coup sec.

Une sonnerie cristalline résonna au centre de son crâne.

\`[AVIS DE SYNCHRONISATION PLANÉTAIRE]\`
\`[LA TERRE EST DÉSORMAIS INTÉGRÉE AU RÉSEAU SPIRITUEL DE L’ARBRE-MONDE TANGALIK]\`
\`[CALCUL DE LA COMPATIBILITÉ ANCESTRALE EN COURS...]\`

Des rideaux de lettres dorées translucides défilèrent devant les yeux ébahis de Malik. Ce n'était pas du français ni de l'anglais, mais des hiéroglyphes géométriques que son esprit traduisait instantanément, comme si ces symboles avaient toujours été gravés dans son ADN.

\`Nom : Malik Diallo\`
\`Niveau : 1\`
\`Force : 14 | Agilité : 11 | Volonté Spirituelle : 28\`
\`Affinité Unique Détectée : Résonance Métallique & Mémoire des Forges Sacrées\`

\`[ATTRIBUTION DE CLASSE SPÉCIALE...]\`
\`Félicitations. En vertu de votre sang d’artisan et de votre dévotion aux alliages oubliés, vous éveillez la classe légendaire :\n>>> ARCHITECTE D'ÂMES RUNIQUE <<<\`

Le temps reprit son cours avec la violence d'une vague de tsunami. Le marteau de Malik s'abattit sur le bronze avec une détonation sourde, projetant une onde de choc qui fit trembler les vitrines de l'échoppe.

Sur la paume droite de Malik, une rune dorée en forme de soleil à huit branches fumait doucement, brûlant sa peau sans lui causer la moindre douleur.

— Malik ! hurla son oncle depuis l'arrière-boutique. Tu as vu ce qui vient de s'afficher dans l'air ?! Le voisin est devenu un guerrier de niveau 3 et son bras est couvert d'écailles de crocodile !

Malik fixa sa propre main rayonnante et serra le manche de son marteau.

— Je crois, tonton, que le travail d'artisanat va être un peu différent à partir d'aujourd'hui.`,
  },
  {
    id: 'ch-w5-2',
    workId: 'work-5',
    chapterNumber: 2,
    title: 'Le Premier Donjon de la Colline Rouge',
    status: 'publie',
    publishedAt: '2026-03-01',
    wordCount: 1480,
    readingTimeMinutes: 6,
    content: `Trois jours après le Grand Éveil, une brèche pourpre haute de vingt mètres s'était ouverte sur la Colline Rouge, à la périphérie est de la ville.

Des bêtes hybrides mi-hyènes mi-scorpions en émergeaient à la tombée de la nuit, forçant l'armée régulière et les nouveaux Éveillés à ériger des barricades de fortune.

Malik ajusta sa cuirasse de bronze runique. 

Grâce à sa compétence d'Architecte d'Âmes, il avait fondu cinq lances de cavalerie ordinaire pour en faire une dague de jet et une armure légère capable d'absorber les attaques cinétiques. Les runes dorées gravées sur le métal absorbaient l'énergie thermique ambiante pour régénérer son pool de mana personnel.

\`[QUÊTE IMMÉDIATE : Purifier le Cœur de la Ruche d'Ombre]\`
\`[Récompense : Plan de forge de rang Épique + 500 cristaux d'éther ancestral]\`

— Tu es fou de rentrer là-dedans tout seul, Malik ! lui cria Seydou, un camarade d'enfance qui avait hérité d'une classe d'Arbalétrier du Vent. Même l'escouade des Chasseurs d'Élite hésite à franchir le portail !

Malik sourit calmement. Il dégaina sa dague. Une flamme dorée parcourut le fil de la lame.

— Seydou, les monstres ne me font pas peur. Ce sont des matériaux bruts qui attendent simplement d'être refondus.

Et sans se retourner, il fit un pas dans la déchirure pourpre.`,
  },
];

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'comm-1',
    targetType: 'chapter',
    targetId: 'ch-w1-1',
    authorName: 'Awa M.',
    authorEmail: 'awa@example.com',
    content: 'Cette introduction est magistrale ! L’harmattan, l’odeur de soufre et la description de la forge ancestrale… On ressent la chaleur du texte à chaque phrase. Hâte de lire la suite !',
    createdAt: '2026-01-16 14:22',
    likes: 18,
    pinned: true,
  },
  {
    id: 'comm-2',
    targetType: 'chapter',
    targetId: 'ch-w1-1',
    authorName: 'Souleymane Thiao',
    authorEmail: 'suleymanthiao10@gmail.com',
    isAuthorReply: true,
    content: 'Merci infiniment Awa ! Kani est un personnage qui me tient énormément à cœur. Son périple ne fait que commencer.',
    createdAt: '2026-01-16 16:40',
    parentId: 'comm-1',
    likes: 24,
  },
  {
    id: 'comm-3',
    targetType: 'chapter',
    targetId: 'ch-w1-3',
    authorName: 'Ousmane K.',
    authorEmail: 'ousmane@example.com',
    content: 'Askia le Maudit réveillé !! La tension à la fin du chapitre 3 est insoutenable. Quand sort le chapitre 4 Souleymane ??',
    createdAt: '2026-02-06 20:15',
    likes: 9,
  },
  {
    id: 'comm-4',
    targetType: 'chapter',
    targetId: 'ch-w2-1',
    authorName: 'CyberReader_221',
    authorEmail: 'reader221@example.com',
    content: 'Le mélange Dakar 2099 + mémoire ancestrale des griots dans un Cloud quantique est une trouvaille brillante sous la plume de Nox Diallo ! Très immersif.',
    createdAt: '2026-02-02 09:30',
    likes: 12,
  },
  {
    id: 'comm-5',
    targetType: 'work',
    targetId: 'work-3',
    authorName: 'Fatou B.',
    authorEmail: 'fatou@example.com',
    content: 'La Nuit du Kouroukan m’a donné des frissons. Ce respect de la parole donnée chez les chasseurs Dozos et cette fillette sans ombre… Une merveille de nouvelle.',
    createdAt: '2026-02-13 18:04',
    likes: 15,
    pinned: true,
  },
];

export const INITIAL_LORE_UNIVERSE: LoreUniverse = {
  id: 'universe-songhai',
  name: "L'Univers des Soleils Noirs & du Sahel Éternel",
  tagline: "Une fresque afrofantasy et cyberpunk interconnectée à travers les millénaires",
  summary: "Dans ce multivers littéraire, les mémoires des ancêtres, les forges magiques et les technologies neuronales s’entrelacent. Les événements de l'Antiquité des Braises influencent directement les conspirations de Dakar 2099 et les pactes des chasseurs dozos.",
  eras: [
    {
      id: 'era-1',
      era: 'Âge Premier (-1200 à l’an 800)',
      title: 'L’Ère des Forges Célestes & des Rois-Dieux',
      description: 'Chute des météorites d’orichalque sur le Sahel. Éveil des premiers Maîtres-Feu et fondation des cités-temples gardées par les masques vivants.',
      workId: 'work-1',
      workTitle: 'Les Cendres de Songhaï',
    },
    {
      id: 'era-2',
      era: 'Période Classique (1236 - 1650)',
      title: 'La Charte du Kouroukan & les Chasseurs Dozos',
      description: 'L’époque des traités secrets entre le monde visible des empires et le royaume invisible des esprits et des djinns de la savane.',
      workId: 'work-3',
      workTitle: 'La Nuit du Kouroukan',
    },
    {
      id: 'era-3',
      era: 'Époque Océane (1700 - Présent)',
      title: 'Les Veilleurs de la Mémoire & des Récifs',
      description: 'Période de recueillement et de résistance ésotérique face aux tempêtes de l’Atlantique noir, où les phares gardent le sel de l’oubli.',
      workId: 'work-4',
      workTitle: 'Le Dernier Veilleur de Gorée',
    },
    {
      id: 'era-4',
      era: 'Futur Proche (2099 et au-delà)',
      title: 'La Métropole G.R.I.O.T. & le Sahel Cybernétique',
      description: 'Numérisation des totems ancestraux. Les gratte-ciels en bio-titane de Dakar côtoient le cyberspace quantique et les guerres corpo-mystiques.',
      workId: 'work-2',
      workTitle: "Sahel Cybernétique : L'Ombre de N'Diaye",
    },
  ],
  factions: [
    {
      name: 'L’Ordre des Forgerons de Braise',
      title: 'Gardiens du Feu Primordial',
      description: 'Une guilde initiatique de métallurgistes et d’ensorceleurs capables de plier le métal céleste et de souffler la braise sacrée.',
      crestIcon: 'Flame',
    },
    {
      name: 'La Confrérie des Dozos Éternels',
      title: 'Pisteurs des Mondes Invisibles',
      description: 'Chasseurs liés par le serment du Kouroukan, armés de fusils à silex enchantés et d’amulettes protectrices face aux créatures de la brousse.',
      crestIcon: 'Compass',
    },
    {
      name: 'Le Consortium G.R.I.O.T.',
      title: 'Archivistes du Cloud Ancestral (2099)',
      description: 'L’entité techno-politique qui gère les puces neuronales et la transmission instantanée des mémoires généalogiques à l’ère cybernétique.',
      crestIcon: 'Cpu',
    },
  ],
};

export const PRESET_COVERS = [
  {
    name: 'Forge Incandescente',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=80',
    theme: 'Dark Afrofantasy',
  },
  {
    name: 'Néon Dakar 2099',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=900&q=80',
    theme: 'Cyberpunk & Sci-Fi',
  },
  {
    name: 'Brousse & Nuit Stellaire',
    url: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&w=900&q=80',
    theme: 'Mystère & Conte',
  },
  {
    name: 'Océan Atlantique Mystique',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
    theme: 'Fantastique Éso',
  },
  {
    name: 'Portail Runique Solaire',
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=900&q=80',
    theme: 'LitRPG / Progression',
  },
  {
    name: 'Temple Ancien & Or',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=80',
    theme: 'Mythologie Royale',
  },
];
