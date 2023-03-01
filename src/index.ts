import dotenv from 'dotenv';
dotenv.config(); // To load all the environment variables
import Discord from 'discord.js';
import { CRUD } from './database';
import Bot from './bot';
const BOT = new Bot(process.env.TOKEN as string);

// Running the bot
// BOT.CLIENT.on('ready', () => {
//   console.log(`${BOT.CLIENT.user?.username} is ready!`);
// });
// BOT.connectDB();
// Registers all the commands!
BOT.registerEvents();
BOT.registerCommands();
BOT.connectClient();

export { CRUD, Discord };
