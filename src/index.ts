import dotenv from 'dotenv';
dotenv.config(); // To load all the environment variables
import Discord from 'discord.js';
import { CRUD } from './database';
import Bot from './bot';
const BOT = new Bot(process.env.TOKEN as string);

// Connects to the Mongo Database
// BOT.connectDB();
// Registers all the events!
BOT.registerEvents();
// Registers all the commands!
BOT.registerCommands();
// Loads all the commands!
BOT.loadCommands();
// Connects to the Discord Client
BOT.connectClient();

// Exports
export { BOT, CRUD, Discord };
