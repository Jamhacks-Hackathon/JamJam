import { Discord } from '..';

export = {
  name: Discord.Events.InteractionCreate,
  execute(interaction: Discord.Interaction) {
    console.log(`${interaction.user?.username} is ready`);
  }
};
