import { Discord } from '../index';

export = {
  data: new Discord.SlashCommandBuilder()
    .setName('requestmentor')
    .setDescription('Request a mentor based off of your needs!'),
    
}