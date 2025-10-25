import { Discord } from '../index';
import { REQUESTMENTOR } from '../database';
import { ChannelType, GuildMember, PermissionsBitField, StringSelectMenuBuilder, TextChannel } from 'discord.js';
import { exec } from 'child_process';

export = {
  data: new Discord.SlashCommandBuilder()
    .setName('requestmentordisable')
    .setDescription("This disables the request mentor ticket message and system."),

    async execute(interaction: Discord.ChatInputCommandInteraction) {
      if (!interaction.guild) {
        await interaction.reply("This command can only be used in the JAMHacks Discord Server!");
        return;
      }

      const user = interaction.member as GuildMember;

      if (! user.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return await interaction.reply({
          content: "You must have admin to set up the request-a-mentor ticket system",
          ephemeral: true
        })
      }

      const result = await REQUESTMENTOR.deleteMany({ Guild: interaction.guild.id });
      if (result.deletedCount && result.deletedCount > 0) {
        await interaction.reply({
          content: "Your mentor request ticket has been removed",
          ephemeral: true
        })
      }


    }
    
}