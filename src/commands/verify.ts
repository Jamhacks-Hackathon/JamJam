import { Discord } from '../index';
export = {
  data: new Discord.SlashCommandBuilder()
    .setName('verify')
    .setDescription('Verify command!'),
  async execute(interaction: Discord.CommandInteraction) {
    await interaction.reply("It's working!");
  }
};
