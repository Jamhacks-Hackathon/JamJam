import { BOT, Discord } from '..';

export = {
  name: Discord.Events.InteractionCreate,
  async execute(interaction: Discord.Interaction) {
    if (!interaction.isChatInputCommand()) {
      return;
    }
    const COMMAND = BOT.COMMAND_MAP.get(interaction.commandName);
    if (!COMMAND) {
      console.error(
        `No command matching ${interaction.commandName} was found.`
      );
      return;
    }

    try {
      await COMMAND.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: 'There was an error while executing this command!',
          ephemeral: true
        });
      } else {
        await interaction.reply({
          content: 'There was an error while executing this command!',
          ephemeral: true
        });
      }
    }
  }
};
