require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Game = require('../models/Game');
const Review = require('../models/Review');
const Session = require('../models/Session');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/vaultgg';

const games = [
  {
    title: 'Grand Theft Auto V',
    genre: 'Action',
    description: 'An open-world action-adventure game set in the fictional state of San Andreas. Players can switch between three protagonists as they carry out heists and navigate the criminal underworld of Los Santos.',
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/271590/header.jpg',
    platforms: [
      { name: 'PC', releaseDate: new Date('2015-04-14'), price: 29.99 },
      { name: 'PS5', releaseDate: new Date('2022-03-15'), price: 39.99 },
      { name: 'Xbox Series X', releaseDate: new Date('2022-03-15'), price: 39.99 }
    ],
    developer: 'Rockstar Games',
    tags: ['open-world', 'multiplayer', 'heist', 'crime', 'story-rich']
  },
  {
    title: 'Minecraft',
    genre: 'Sandbox',
    description: 'A game about placing blocks and going on adventures. Explore randomly generated worlds and build amazing things from the simplest of homes to the grandest of castles.',
    coverImage: 'https://www.minecraft.net/content/dam/games/minecraft/key-art/Games_Subnav_Minecraft-300x yogurt300.jpg',
    platforms: [
      { name: 'PC', releaseDate: new Date('2011-11-18'), price: 26.95 },
      { name: 'PS5', releaseDate: new Date('2020-09-17'), price: 19.99 },
      { name: 'Nintendo Switch', releaseDate: new Date('2018-06-21'), price: 29.99 },
      { name: 'Mobile', releaseDate: new Date('2011-10-07'), price: 7.49 }
    ],
    developer: 'Mojang Studios',
    tags: ['survival', 'creative', 'multiplayer', 'sandbox', 'family-friendly']
  },
  {
    title: 'The Witcher 3: Wild Hunt',
    genre: 'RPG',
    description: 'As war rages on throughout the Northern Realms, you take on the greatest contract of your life — tracking down the Child of Prophecy, a living weapon that can alter the shape of the world.',
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/292030/header.jpg',
    platforms: [
      { name: 'PC', releaseDate: new Date('2015-05-19'), price: 39.99 },
      { name: 'PS5', releaseDate: new Date('2022-12-14'), price: 49.99 },
      { name: 'Nintendo Switch', releaseDate: new Date('2019-10-15'), price: 59.99 }
    ],
    developer: 'CD Projekt Red',
    tags: ['RPG', 'open-world', 'fantasy', 'story-rich', 'choices-matter']
  },
  {
    title: 'Red Dead Redemption 2',
    genre: 'Adventure',
    description: 'America, 1899. Arthur Morgan and the Van der Linde gang are outlaws on the run. With federal agents and bounty hunters closing in, the gang must rob, steal and fight their way across the rugged heartland of America.',
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg',
    platforms: [
      { name: 'PC', releaseDate: new Date('2019-12-05'), price: 59.99 },
      { name: 'PS4', releaseDate: new Date('2018-10-26'), price: 39.99 },
      { name: 'Xbox One', releaseDate: new Date('2018-10-26'), price: 39.99 }
    ],
    developer: 'Rockstar Games',
    tags: ['western', 'open-world', 'story-rich', 'action', 'horses']
  },
  {
    title: 'Cyberpunk 2077',
    genre: 'RPG',
    description: 'An open-world, action-adventure story set in Night City, a megalopolis obsessed with power, glamour and body modification. You play as V, a mercenary outlaw going after a one-of-a-kind implant that is the key to immortality.',
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg',
    platforms: [
      { name: 'PC', releaseDate: new Date('2020-12-10'), price: 59.99 },
      { name: 'PS5', releaseDate: new Date('2022-02-15'), price: 59.99 },
      { name: 'Xbox Series X', releaseDate: new Date('2022-02-15'), price: 59.99 }
    ],
    developer: 'CD Projekt Red',
    tags: ['cyberpunk', 'open-world', 'RPG', 'futuristic', 'story-rich']
  },
  {
    title: 'Dark Souls III',
    genre: 'Action',
    description: 'Dark Souls continues to push the boundaries with the latest, ambitious chapter in the critically-acclaimed and genre-defining series. As fires fade and the world falls into ruin, journey into a universe filled with more darkness, tension and despair.',
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/374320/header.jpg',
    platforms: [
      { name: 'PC', releaseDate: new Date('2016-04-12'), price: 59.99 },
      { name: 'PS4', releaseDate: new Date('2016-03-24'), price: 39.99 },
      { name: 'Xbox One', releaseDate: new Date('2016-03-24'), price: 39.99 }
    ],
    developer: 'FromSoftware',
    tags: ['souls-like', 'challenging', 'dark-fantasy', 'action', 'boss-fights']
  },
  {
    title: 'Counter-Strike 2',
    genre: 'FPS',
    description: 'The largest technical leap in Counter-Strike\'s history, CS2 is built on an entirely new engine and features updated maps, sub-tick servers, and overhauled responsive smokes. The global offensive era is over.',
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg',
    platforms: [
      { name: 'PC', releaseDate: new Date('2023-09-27'), price: 0 }
    ],
    developer: 'Valve',
    tags: ['FPS', 'competitive', 'multiplayer', 'free-to-play', 'tactical']
  },
  {
    title: 'Elden Ring',
    genre: 'RPG',
    description: 'THE NEW FANTASY ACTION RPG. Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between.',
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg',
    platforms: [
      { name: 'PC', releaseDate: new Date('2022-02-25'), price: 59.99 },
      { name: 'PS5', releaseDate: new Date('2022-02-25'), price: 59.99 },
      { name: 'Xbox Series X', releaseDate: new Date('2022-02-25'), price: 59.99 }
    ],
    developer: 'FromSoftware',
    tags: ['souls-like', 'open-world', 'dark-fantasy', 'challenging', 'RPG']
  },
  {
    title: 'God of War',
    genre: 'Action',
    description: 'His vengeance against the Gods of Olympus years behind him, Kratos now lives as a man in the realm of Norse Gods and monsters. It is in this harsh, unforgiving world that he must fight to survive and teach his son to do the same.',
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1593500/header.jpg',
    platforms: [
      { name: 'PC', releaseDate: new Date('2022-01-14'), price: 49.99 },
      { name: 'PS4', releaseDate: new Date('2018-04-20'), price: 39.99 },
      { name: 'PS5', releaseDate: new Date('2022-01-14'), price: 49.99 }
    ],
    developer: 'Santa Monica Studio',
    tags: ['action', 'mythology', 'story-rich', 'combat', 'father-son']
  },
  {
    title: 'Hollow Knight',
    genre: 'Adventure',
    description: 'Forge your own path in Hollow Knight! An epic action adventure through a vast ruined kingdom of insects and heroes. Explore twisting caverns, battle tainted creatures and befriend bizarre bugs, all in a classic, hand-drawn art style.',
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/367520/header.jpg',
    platforms: [
      { name: 'PC', releaseDate: new Date('2017-02-24'), price: 14.99 },
      { name: 'Nintendo Switch', releaseDate: new Date('2018-06-12'), price: 14.99 },
      { name: 'PS4', releaseDate: new Date('2018-09-25'), price: 14.99 }
    ],
    developer: 'Team Cherry',
    tags: ['metroidvania', 'indie', 'challenging', 'beautiful', 'atmospheric']
  },
  {
    title: 'Stardew Valley',
    genre: 'Simulation',
    description: 'You\'ve inherited your grandfather\'s old farm plot in Stardew Valley. Armed with hand-me-down tools and a few coins, you set out to begin your new life. Can you learn to live off the land and turn these overgrown fields into a thriving home?',
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/413150/header.jpg',
    platforms: [
      { name: 'PC', releaseDate: new Date('2016-02-26'), price: 14.99 },
      { name: 'Nintendo Switch', releaseDate: new Date('2017-10-05'), price: 14.99 },
      { name: 'Mobile', releaseDate: new Date('2018-10-24'), price: 7.99 }
    ],
    developer: 'ConcernedApe',
    tags: ['farming', 'relaxing', 'simulation', 'indie', 'multiplayer']
  },
  {
    title: 'Hades',
    genre: 'Action',
    description: 'Defy the god of the dead as you hack and slash your way out of the Underworld in this rogue-like dungeon crawler from the creators of Bastion, Transistor, and Pyre.',
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1145360/header.jpg',
    platforms: [
      { name: 'PC', releaseDate: new Date('2020-09-17'), price: 24.99 },
      { name: 'Nintendo Switch', releaseDate: new Date('2020-09-17'), price: 24.99 },
      { name: 'PS5', releaseDate: new Date('2021-08-13'), price: 24.99 }
    ],
    developer: 'Supergiant Games',
    tags: ['roguelike', 'action', 'Greek-mythology', 'indie', 'story-rich']
  },
  {
    title: 'DOOM Eternal',
    genre: 'FPS',
    description: 'Bigger, badder, and more blood-pumping. Slay hordes of demons across dimensions as the Doom Slayer in this fast-paced shooter.',
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/782330/header.jpg',
    platforms: [{ name: 'PC', releaseDate: new Date('2020-03-20'), price: 39.99 }, { name: 'PS4', releaseDate: new Date('2020-03-20'), price: 39.99 }],
    developer: 'id Software',
    tags: ['FPS', 'action', 'gore', 'fast-paced']
  },
  {
    title: 'The Legend of Zelda: Breath of the Wild',
    genre: 'Adventure',
    description: 'Step into a world of discovery, exploration, and adventure in this boundary-breaking new game in the acclaimed series.',
    coverImage: 'https://assets.nintendo.com/image/upload/ar_16:9,b_auto:border,c_lpad/b_white/f_auto/q_auto/dpr_auto/c_scale,w_300/v1/ncom/en_US/games/switch/t/the-legend-of-zelda-breath-of-the-wild-switch/hero',
    platforms: [{ name: 'Nintendo Switch', releaseDate: new Date('2017-03-03'), price: 59.99 }],
    developer: 'Nintendo',
    tags: ['open-world', 'exploration', 'puzzle', 'fantasy']
  },
  {
    title: 'Bloodborne',
    genre: 'Action',
    description: 'Hunt your nightmares as you search for answers in the ancient city of Yharnam, now cursed with a strange endemic illness spreading through the streets like wildfire.',
    coverImage: 'https://image.api.playstation.com/vulcan/img/rnd/202010/2614/yqOepN8yiv4RMYh292215xO2.png',
    platforms: [{ name: 'PS4', releaseDate: new Date('2015-03-24'), price: 19.99 }],
    developer: 'FromSoftware',
    tags: ['souls-like', 'dark-fantasy', 'horror', 'challenging']
  },
  {
    title: 'The Last of Us Part I',
    genre: 'Adventure',
    description: 'Experience the emotional storytelling and unforgettable characters in the game that won over 200 Game of the Year awards.',
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1888930/header.jpg',
    platforms: [{ name: 'PC', releaseDate: new Date('2023-03-28'), price: 59.99 }, { name: 'PS5', releaseDate: new Date('2022-09-02'), price: 69.99 }],
    developer: 'Naughty Dog',
    tags: ['story-rich', 'zombies', 'survival', 'action']
  },
  {
    title: 'Resident Evil 4',
    genre: 'Action',
    description: 'Survival is just the beginning. Six years have passed since the biological disaster in Raccoon City. Agent Leon S. Kennedy is sent to rescue the president\'s kidnapped daughter.',
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/2050650/header.jpg',
    platforms: [{ name: 'PC', releaseDate: new Date('2023-03-24'), price: 59.99 }, { name: 'PS5', releaseDate: new Date('2023-03-24'), price: 59.99 }],
    developer: 'Capcom',
    tags: ['horror', 'survival', 'shooter', 'remake']
  },
  {
    title: 'Ghost of Tsushima',
    genre: 'Action',
    description: 'In the late 13th century, the Mongol empire has laid waste to entire nations. As one of the last surviving samurai, you must forge a new path to protect Tsushima.',
    coverImage: 'https://image.api.playstation.com/vulcan/ap/rnd/202106/1715/0n3LAKB6wONXb5mWeLpP9Pj0.png',
    platforms: [{ name: 'PS5', releaseDate: new Date('2021-08-20'), price: 69.99 }],
    developer: 'Sucker Punch Productions',
    tags: ['samurai', 'open-world', 'beautiful', 'combat']
  },
  {
    title: 'Portal 2',
    genre: 'Puzzle',
    description: 'The "single-player" portion of Portal 2 introduces a cast of dynamic new characters, a host of fresh puzzle elements, and a much larger set of devious test chambers.',
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/620/header.jpg',
    platforms: [{ name: 'PC', releaseDate: new Date('2011-04-18'), price: 9.99 }],
    developer: 'Valve',
    tags: ['puzzle', 'comedy', 'sci-fi', 'multiplayer']
  },
  {
    title: 'The Elder Scrolls V: Skyrim',
    genre: 'RPG',
    description: 'Live another life, in another world. The legendary open-world masterpiece from Bethesda Game Studios.',
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/489830/header.jpg',
    platforms: [{ name: 'PC', releaseDate: new Date('2011-11-10'), price: 39.99 }, { name: 'PS4', releaseDate: new Date('2016-10-28'), price: 39.99 }],
    developer: 'Bethesda Game Studios',
    tags: ['open-world', 'RPG', 'fantasy', 'moddable']
  },
  {
    title: 'Persona 5 Royal',
    genre: 'RPG',
    description: 'Don the mask of Joker and join the Phantom Thieves of Hearts. Break free from the chains of modern society and stage grand heists.',
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1687950/header.jpg',
    platforms: [{ name: 'PC', releaseDate: new Date('2022-10-21'), price: 59.99 }, { name: 'Nintendo Switch', releaseDate: new Date('2022-10-21'), price: 59.99 }],
    developer: 'ATLUS',
    tags: ['JRPG', 'anime', 'story-rich', 'turn-based']
  },
  {
    title: 'Subnautica',
    genre: 'Survival',
    description: 'Descend into the depths of an alien underwater world filled with wonder and peril. Craft equipment, pilot submarines and out-smart wildlife to survive.',
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/264710/header.jpg',
    platforms: [{ name: 'PC', releaseDate: new Date('2018-01-23'), price: 29.99 }],
    developer: 'Unknown Worlds Entertainment',
    tags: ['survival', 'exploration', 'underwater', 'open-world']
  },
  {
    title: 'Cuphead',
    genre: 'Action',
    description: 'A classic run and gun action game heavily focused on boss battles, inspired by cartoons of the 1930s.',
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/268910/header.jpg',
    platforms: [{ name: 'PC', releaseDate: new Date('2017-09-29'), price: 19.99 }],
    developer: 'Studio MDHR',
    tags: ['difficult', 'co-op', '2D', 'hand-drawn']
  },
  {
    title: 'Terraria',
    genre: 'Sandbox',
    description: 'Dig, fight, explore, build! Nothing is impossible in this action-packed adventure game. The world is your canvas.',
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/105600/header.jpg',
    platforms: [{ name: 'PC', releaseDate: new Date('2011-05-16'), price: 9.99 }],
    developer: 'Re-Logic',
    tags: ['survival', 'crafting', 'pixel-graphics', 'multiplayer']
  },
  {
    title: 'Horizon Zero Dawn',
    genre: 'Action',
    description: 'Experience Aloy\'s legendary quest to unravel the mysteries of a future Earth ruled by Machines. Use devastating tactical attacks against your prey.',
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1151640/header.jpg',
    platforms: [{ name: 'PC', releaseDate: new Date('2020-08-07'), price: 49.99 }],
    developer: 'Guerrilla',
    tags: ['open-world', ' sci-fi', 'action-rpg', 'female-protagonist']
  },
  {
    title: 'Undertale',
    genre: 'RPG',
    description: 'The RPG game where you don\'t have to destroy anyone.',
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/391540/header.jpg',
    platforms: [{ name: 'PC', releaseDate: new Date('2015-09-15'), price: 9.99 }],
    developer: 'tobyfox',
    tags: ['story-rich', 'great-soundtrack', 'multiple-endings', 'indie']
  },
  {
    title: 'Sekiro: Shadows Die Twice',
    genre: 'Action',
    description: 'Carve your own clever path to vengeance in the award winning action adventure. In Sekiro, you are the one-armed wolf, a disgraced and disfigured warrior.',
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/814380/header.jpg',
    platforms: [{ name: 'PC', releaseDate: new Date('2019-03-21'), price: 59.99 }],
    developer: 'FromSoftware',
    tags: ['souls-like', 'challenging', 'action', 'ninja']
  },
  {
    title: 'Halo Infinite',
    genre: 'FPS',
    description: 'When all hope is lost and humanity’s fate hangs in the balance, the Master Chief is ready to confront the most ruthless foe he’s ever faced.',
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1240440/header.jpg',
    platforms: [{ name: 'PC', releaseDate: new Date('2021-12-08'), price: 59.99 }, { name: 'Xbox Series X', releaseDate: new Date('2021-12-08'), price: 59.99 }],
    developer: '343 Industries',
    tags: ['sci-fi', 'shooter', 'multiplayer', 'master-chief']
  },
  {
    title: 'Star Wars Jedi: Survivor',
    genre: 'Action',
    description: 'Stand against the darkness in this galaxy-spanning, third-person action-adventure title from Respawn Entertainment.',
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1774580/header.jpg',
    platforms: [{ name: 'PC', releaseDate: new Date('2023-04-28'), price: 69.99 }, { name: 'PS5', releaseDate: new Date('2023-04-28'), price: 69.99 }],
    developer: 'Respawn',
    tags: ['star-wars', 'lightsaber', 'story-rich', 'souls-lite']
  },
  {
    title: 'It Takes Two',
    genre: 'Adventure',
    description: 'Embark on the craziest journey of your life in It Takes Two, a genre-bending platform adventure created purely for co-op.',
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1426210/header.jpg',
    platforms: [{ name: 'PC', releaseDate: new Date('2021-03-26'), price: 39.99 }, { name: 'PS5', releaseDate: new Date('2021-03-26'), price: 39.99 }],
    developer: 'Hazelight',
    tags: ['co-op', 'puzzle', 'split-screen', 'family-friendly']
  },
  {
    title: 'Sid Meier\'s Civilization VI',
    genre: 'Strategy',
    description: 'Civilization VI offers new ways to interact with your world, expand your empire across the map, advance your culture, and compete against history’s greatest leaders.',
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/289070/header.jpg',
    platforms: [{ name: 'PC', releaseDate: new Date('2016-10-20'), price: 59.99 }],
    developer: 'Firaxis Games',
    tags: ['turn-based', '4x', 'historical', 'multiplayer']
  },
  {
    title: 'Rocket League',
    genre: 'Sports',
    description: 'Rocket League is a high-powered hybrid of arcade-style soccer and vehicular mayhem with easy-to-understand controls and fluid, physics-driven competition.',
    coverImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Rocket_League_coverart.jpg/600px-Rocket_League_coverart.jpg',
    platforms: [{ name: 'PC', releaseDate: new Date('2015-07-07'), price: 0 }, { name: 'PS4', releaseDate: new Date('2015-07-07'), price: 0 }],
    developer: 'Psyonix LLC',
    tags: ['soccer', 'cars', 'competitive', 'esports']
  },
  {
    title: 'Inside',
    genre: 'Puzzle',
    description: 'Hunted and alone, a boy finds himself drawn into the center of a dark project.',
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/304430/header.jpg',
    platforms: [{ name: 'PC', releaseDate: new Date('2016-07-07'), price: 19.99 }],
    developer: 'Playdead',
    tags: ['atmospheric', '2D', 'dark', 'platformer']
  },
  {
    title: 'Dota 2',
    genre: 'MOBA',
    description: 'Every day, millions of players worldwide enter battle as one of over a hundred Dota heroes. And no matter if it\'s their 10th hour of play or 1,000th, there\'s always something new to discover.',
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/570/header.jpg',
    platforms: [{ name: 'PC', releaseDate: new Date('2013-07-09'), price: 0 }],
    developer: 'Valve',
    tags: ['multiplayer', 'competitive', 'esports', 'free-to-play']
  },
  {
    title: 'Apex Legends',
    genre: 'Battle Royale',
    description: 'Conquer with character in Apex Legends, a free-to-play Hero shooter where legendary characters with powerful abilities team up to battle for fame & fortune.',
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1172470/header.jpg',
    platforms: [{ name: 'PC', releaseDate: new Date('2020-11-04'), price: 0 }, { name: 'PS5', releaseDate: new Date('2022-03-29'), price: 0 }],
    developer: 'Respawn',
    tags: ['hero-shooter', 'multiplayer', 'fast-paced', 'free-to-play']
  },
  {
    title: 'Hitman 3',
    genre: 'Stealth',
    description: 'Death Awaits. Agent 47 returns in HITMAN 3, the dramatic conclusion to the World of Assassination trilogy.',
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1659040/header.jpg',
    platforms: [{ name: 'PC', releaseDate: new Date('2022-01-20'), price: 59.99 }, { name: 'PS5', releaseDate: new Date('2021-01-20'), price: 59.99 }],
    developer: 'IO Interactive',
    tags: ['assassin', 'sandbox', 'stealth', 'replayable']
  },
  {
    title: 'Final Fantasy VII Remake',
    genre: 'RPG',
    description: 'A spectacular reimagining of one of the most visionary games ever, the first game in this project will be set in the eclectic city of Midgar and presents a fully standalone gaming experience.',
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1462040/header.jpg',
    platforms: [{ name: 'PC', releaseDate: new Date('2022-06-17'), price: 69.99 }, { name: 'PS5', releaseDate: new Date('2021-06-10'), price: 69.99 }],
    developer: 'Square Enix',
    tags: ['JRPG', 'remake', 'story-rich', 'beautiful']
  },
  {
    title: 'The Sims 4',
    genre: 'Simulation',
    description: 'Play with life and discover the power to create and control people in a virtual world where there are no rules.',
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1222670/header.jpg',
    platforms: [{ name: 'PC', releaseDate: new Date('2014-09-02'), price: 0 }],
    developer: 'Maxis',
    tags: ['life-sim', 'sandbox', 'character-customization', 'building']
  },
  {
    title: 'Dead Space (Remake)',
    genre: 'Horror',
    description: 'The sci-fi survival horror classic returns, completely rebuilt to offer an even more immersive experience.',
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1693980/header.jpg',
    platforms: [{ name: 'PC', releaseDate: new Date('2023-01-27'), price: 59.99 }, { name: 'PS5', releaseDate: new Date('2023-01-27'), price: 59.99 }],
    developer: 'Motive',
    tags: ['space', 'survival-horror', 'gore', 'atmospheric']
  },
  {
    title: 'Animal Crossing: New Horizons',
    genre: 'Simulation',
    description: 'Escape to a deserted island and create your own paradise as you explore, create, and customize.',
    coverImage: 'https://assets.nintendo.com/image/upload/ar_16:9,b_auto:border,c_lpad/b_white/f_auto/q_auto/dpr_auto/c_scale,w_300/v1/ncom/en_US/games/switch/a/animal-crossing-new-horizons-switch/hero',
    platforms: [{ name: 'Nintendo Switch', releaseDate: new Date('2020-03-20'), price: 59.99 }],
    developer: 'Nintendo',
    tags: ['relaxing', 'cute', 'building', 'multiplayer']
  },
  {
    title: 'Monster Hunter: World',
    genre: 'Action',
    description: 'Welcome to a new world! Take on the role of a hunter and slay ferocious monsters in a living, breathing ecosystem where you can use the landscape and its diverse inhabitants to get the upper hand.',
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/582010/header.jpg',
    platforms: [{ name: 'PC', releaseDate: new Date('2018-08-09'), price: 29.99 }, { name: 'PS4', releaseDate: new Date('2018-01-26'), price: 19.99 }],
    developer: 'CAPCOM',
    tags: ['co-op', 'hunting', 'dinosaurs', 'action-rpg']
  },
  {
    title: 'Death Stranding',
    genre: 'Adventure',
    description: 'From legendary game creator Hideo Kojima comes an all-new, genre-defying experience. Sam Bridges must brave a world utterly transformed by the Death Stranding.',
    coverImage: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1850570/header.jpg',
    platforms: [{ name: 'PC', releaseDate: new Date('2022-03-30'), price: 39.99 }, { name: 'PS5', releaseDate: new Date('2021-09-24'), price: 49.99 }],
    developer: 'KOJIMA PRODUCTIONS',
    tags: ['walking-simulator', 'story-rich', 'sci-fi', 'atmospheric']
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');
    console.log(`📦 Seeding database: vaultgg\n`);

    // Clear existing data
    await User.deleteMany({});
    await Game.deleteMany({});
    await Review.deleteMany({});
    await Session.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // ── Create indexes explicitly ──
    await mongoose.connection.collection('games').createIndex({ genre: 1 });
    await mongoose.connection.collection('games').createIndex({ title: 'text', description: 'text' });
    await mongoose.connection.collection('reviews').createIndex({ gameId: 1, rating: -1 });
    console.log('📇 Indexes created');

    // ── Seed Users ──
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const usersData = [
      {
        username: 'GamerPro99',
        email: 'gamerpro99@example.com',
        passwordHash: hashedPassword,
        profile: { avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=GamerPro99', bio: 'Hardcore gamer since 2005. Love RPGs and Soulslikes.' },
        preferences: { favoriteGenres: ['RPG', 'Action'], notifications: true }
      },
      {
        username: 'NightOwlGamer',
        email: 'nightowl@example.com',
        passwordHash: hashedPassword,
        profile: { avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=NightOwlGamer', bio: 'I play games after midnight. FPS enthusiast.' },
        preferences: { favoriteGenres: ['FPS', 'Battle Royale'], notifications: false }
      },
      {
        username: 'CasualCrafter',
        email: 'casual@example.com',
        passwordHash: hashedPassword,
        profile: { avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=CasualCrafter', bio: 'Indie games and cozy simulations are my jam.' },
        preferences: { favoriteGenres: ['Simulation', 'Sandbox'], notifications: true }
      },
      {
        username: 'LoreHunter',
        email: 'lorehunter@example.com',
        passwordHash: hashedPassword,
        profile: { avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=LoreHunter', bio: 'I read every item description. Story over gameplay.' },
        preferences: { favoriteGenres: ['RPG', 'Adventure'], notifications: true }
      }
    ];

    const users = await User.insertMany(usersData);
    console.log(`👥 Created ${users.length} users`);

    // ── Seed Games ──
    const createdGames = await Game.insertMany(games);
    console.log(`🎮 Created ${createdGames.length} games`);

    // ── Seed Reviews ──
    const reviewsData = [
      { userId: users[0]._id, gameId: createdGames[0]._id, rating: 5, reviewText: 'An absolute masterpiece. GTA V still holds up after all these years. The open world is incredibly detailed and the story is compelling.', votes: [{ userId: users[1]._id, helpful: true }, { userId: users[2]._id, helpful: true }] },
      { userId: users[1]._id, gameId: createdGames[0]._id, rating: 4, reviewText: 'Great game but the online can be chaotic. Single player is exceptional. Rockstar really outdid themselves with the character switching mechanic.', votes: [{ userId: users[0]._id, helpful: true }] },
      { userId: users[2]._id, gameId: createdGames[1]._id, rating: 5, reviewText: 'Minecraft never gets old. The creativity is limitless. I have over 2000 hours and still discovering new things every session.', votes: [] },
      { userId: users[3]._id, gameId: createdGames[1]._id, rating: 4, reviewText: 'Perfect game for all ages. The survival mode is challenging but rewarding. Creative mode is great for stress-free building.', votes: [{ userId: users[2]._id, helpful: true }] },
      { userId: users[0]._id, gameId: createdGames[2]._id, rating: 5, reviewText: 'The best RPG ever made. The world, the lore, the characters – everything is top tier. Geralt of Rivia is the most believable protagonist in gaming history.', votes: [{ userId: users[1]._id, helpful: true }, { userId: users[3]._id, helpful: true }] },
      { userId: users[3]._id, gameId: createdGames[2]._id, rating: 5, reviewText: 'Expansive world with incredible depth. Every side quest feels meaningful. The DLCs are better than most full-priced games.', votes: [{ userId: users[0]._id, helpful: true }] },
      { userId: users[1]._id, gameId: createdGames[3]._id, rating: 5, reviewText: 'RDR2 is cinematic perfection. Arthur Morgan is one of the greatest characters in all of fiction. The ending had me in tears.', votes: [{ userId: users[2]._id, helpful: true }, { userId: users[0]._id, helpful: true }] },
      { userId: users[0]._id, gameId: createdGames[4]._id, rating: 4, reviewText: 'Cyberpunk at launch was rough but after the 2.0 update it is incredible. Night City is the most detailed game world I have ever explored.', votes: [] },
      { userId: users[2]._id, gameId: createdGames[5]._id, rating: 4, reviewText: 'Dark Souls 3 is the most polished entry in the series. The bosses are challenging but fair. Absolutely worth the frustration.', votes: [{ userId: users[1]._id, helpful: true }] },
      { userId: users[1]._id, gameId: createdGames[6]._id, rating: 5, reviewText: 'CS2 is a massive improvement over CSGO. The sub-tick servers and smoke rework completely changed how matches play. Best competitive FPS available.', votes: [{ userId: users[3]._id, helpful: true }] },
      { userId: users[3]._id, gameId: createdGames[7]._id, rating: 5, reviewText: 'Elden Ring is FromSoftware\'s magnum opus. The open world approach suits the souls formula perfectly. Every boss encounter is memorable.', votes: [{ userId: users[0]._id, helpful: true }, { userId: users[1]._id, helpful: true }] },
      { userId: users[0]._id, gameId: createdGames[8]._id, rating: 5, reviewText: 'God of War is stunning. The one-shot camera, the emotional story, the combat – all perfect. Kratos vs Norse mythology is a brilliant concept.', votes: [] },
      { userId: users[2]._id, gameId: createdGames[9]._id, rating: 5, reviewText: 'Hollow Knight is a masterclass in game design. Every area feels distinct and the bosses are incredibly satisfying to defeat.', votes: [{ userId: users[3]._id, helpful: true }] },
      { userId: users[3]._id, gameId: createdGames[10]._id, rating: 5, reviewText: 'Stardew Valley is the most relaxing game I have ever played. ConcernedApe made this solo and it beats most AAA titles in depth and charm.', votes: [{ userId: users[2]._id, helpful: true }] },
      { userId: users[1]._id, gameId: createdGames[11]._id, rating: 5, reviewText: 'Hades redefined what a roguelike can be. The narrative integration is genius – dying is part of the story. Never gets repetitive.', votes: [{ userId: users[0]._id, helpful: true }] }
    ];

    const createdReviews = await Review.insertMany(reviewsData);
    console.log(`⭐ Created ${createdReviews.length} reviews`);

    // ── Seed Sessions (game library entries) ──
    const now = new Date();
    const monthAgo = (n) => { const d = new Date(); d.setMonth(d.getMonth() - n); return d; };

    const sessionsData = [
      { userId: users[0]._id, gameId: createdGames[0]._id, hoursPlayed: 187.5, lastPlayed: monthAgo(0), completed: true },
      { userId: users[0]._id, gameId: createdGames[2]._id, hoursPlayed: 220.0, lastPlayed: monthAgo(1), completed: true },
      { userId: users[0]._id, gameId: createdGames[7]._id, hoursPlayed: 95.5, lastPlayed: monthAgo(0), completed: false },
      { userId: users[0]._id, gameId: createdGames[8]._id, hoursPlayed: 45.0, lastPlayed: monthAgo(2), completed: true },
      { userId: users[1]._id, gameId: createdGames[3]._id, hoursPlayed: 156.0, lastPlayed: monthAgo(0), completed: true },
      { userId: users[1]._id, gameId: createdGames[6]._id, hoursPlayed: 842.0, lastPlayed: now, completed: false },
      { userId: users[1]._id, gameId: createdGames[5]._id, hoursPlayed: 72.5, lastPlayed: monthAgo(1), completed: false },
      { userId: users[2]._id, gameId: createdGames[1]._id, hoursPlayed: 1240.0, lastPlayed: now, completed: false },
      { userId: users[2]._id, gameId: createdGames[10]._id, hoursPlayed: 318.5, lastPlayed: monthAgo(0), completed: false },
      { userId: users[2]._id, gameId: createdGames[9]._id, hoursPlayed: 52.0, lastPlayed: monthAgo(3), completed: true },
      { userId: users[3]._id, gameId: createdGames[4]._id, hoursPlayed: 134.5, lastPlayed: monthAgo(1), completed: false },
      { userId: users[3]._id, gameId: createdGames[11]._id, hoursPlayed: 89.0, lastPlayed: monthAgo(0), completed: false },
      { userId: users[3]._id, gameId: createdGames[2]._id, hoursPlayed: 176.0, lastPlayed: monthAgo(2), completed: true }
    ];

    await Session.insertMany(sessionsData);
    console.log(`🕹️  Created ${sessionsData.length} sessions`);

    console.log('\n✅ Database seeded successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Test login credentials:');
    console.log('   Email: gamerpro99@example.com  | Password: password123');
    console.log('   Email: nightowl@example.com    | Password: password123');
    console.log('   Email: casual@example.com      | Password: password123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedDB();
