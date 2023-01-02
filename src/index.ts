import Discord from 'discord.js';
import dotenv from 'dotenv';
dotenv.config(); // to load all the environment variables
import mongoose from 'mongoose';

const CLIENT: Discord.Client = new Discord.Client({intents: [
    Discord.GatewayIntentBits.Guilds
]});

// client.on(Discord.Events.ClientReady, (client) => {
//     console.log(`Logged in as ${client.user.username}`)
// });

CLIENT.on('ready', (client) => {
    console.log(`Logged in as ${client.user.username}`); 
}); // Event that triggers when the bot goes online



CLIENT.login(process.env.TOKEN as string); // connecting with the Discord Client