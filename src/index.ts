import dotenv from 'dotenv';
dotenv.config(); // Load all the environment variables
import Discord from 'discord.js';
import { CRUD } from './database';
import Bot from './bot';
import { startScheduledAnnouncementChecker } from './scheduledAnnouncements';

const BOT = new Bot(process.env.TOKEN as string);

// Connects to the Mongo Database
BOT.connectDB();
// Registers all the events!
BOT.registerEvents();
// Registers all the commands!
BOT.registerCommands();
// Loads all the commands!
BOT.loadCommands();
// Connects to the Discord Client
BOT.connectClient();

// Start the scheduled announcement checker
BOT.CLIENT.once('ready', () => {
  startScheduledAnnouncementChecker();
  console.log('Scheduled announcement checker started');
});

// Exports
export { BOT, CRUD, Discord };
