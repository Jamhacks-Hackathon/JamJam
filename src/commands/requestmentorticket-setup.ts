import { Discord } from '../index';
import { REQUESTMENTOR } from '../database';
import { ChannelType, GuildMember, PermissionsBitField, StringSelectMenuBuilder, TextChannel } from 'discord.js';
import { exec } from 'child_process';

export = {
  data: new Discord.SlashCommandBuilder()
    .setName('requestmentorsetup')
    .setDescription("Setup the request a mentor ticket system through JamJam!")
    .addChannelOption(option => 
      option.setName('channel')
      .setDescription('The channel you want to send the ticket message in')
      .addChannelTypes(ChannelType.GuildText)
      .setRequired(true)
    )
    .addChannelOption(option => 
      option.setName('category')
      .setDescription('The category you want the tickets to be sent in')
      .addChannelTypes(ChannelType.GuildCategory)
      .setRequired(true)
    ),

    async execute(interaction: Discord.ChatInputCommandInteraction) {
      if (!interaction.guild) {
        await interaction.reply("This command can only be used in the JAMHacks Discord Server!");
        return;
      }

      const user = interaction.member as GuildMember;

      if (!user.permissions.has(PermissionsBitField.Flags.Administrator)) {
        await interaction.reply({
          content: "You do not have permission to use this command.",
          ephemeral: true
        });
      }

      const channel = interaction.options.getChannel('channel') as TextChannel;
      const category = interaction.options.getChannel('category');

      const data = await REQUESTMENTOR.findOne({ Guild: interaction.guild.id });
      if (!data) {
        try {
          await REQUESTMENTOR.create({
            Guild: interaction.guild.id,
            Channel: category?.id,
            Ticket: 'first'
          })
        } catch(err) {
          console.log(err);
        }
      } else {
          await interaction.reply({
            content: "You already requested help from a mentor!",
            ephemeral: true
          });
        return;
      }

      const embed = new Discord.EmbedBuilder()
        .setColor("Blue")
        .setTitle("Request Mentor Ticket System")
        .setDescription("If you want to request a mentor, open a ticket to ping all of them!")
        .setFooter({text: `${interaction.guild.name} tickets`})
      
        const menu = new Discord.ActionRowBuilder<StringSelectMenuBuilder>()
          .addComponents(
            new Discord.SelectMenuBuilder()
            .setCustomId('requestMentorSelectMenu')
            .setMaxValues(1)
            .setPlaceholder('Select a category that you need help in...')

            // Change/Add Subjects here
            .addOptions(
              {
                label: 'Web Development Support',
                value: 'Subject: Web Development Support'
              },
              {
                label: 'Game Development Issue',
                value: 'Subject: Game Development Support'
              },
              {
                label: 'AI/ML Development Issue',
                value: 'Subject: AI/ML Development Support'
              },
              {
                label: 'Other',
                value: 'Subject: Other'
              }
              
            )
          )

    await channel.send({
      embeds: [embed],
      components: [menu]
    })

    await interaction.reply({
      content: `Your ticket to request a mentor has been set up in ${channel}`,
      ephemeral: true
    })

    }
    
}