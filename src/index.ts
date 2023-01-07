import dotenv from 'dotenv';
dotenv.config(); // To load all the environment variables
import Bot from './bot';
const BOT = new Bot(process.env.TOKEN as string);

// Running the bot
BOT.CLIENT.on('ready', () => {
  console.log(`${BOT.CLIENT.user?.username} is ready!`);
});
BOT.connectDB();
BOT.connectClient();
