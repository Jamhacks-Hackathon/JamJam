import { Events } from 'discord.js';
import { Discord } from '..';

export = {
  name: Events.InteractionCreate,
  execute(interaction: Discord.Interaction) {
    console.log(`${interaction.user?.username} is ready`);
  }
};
