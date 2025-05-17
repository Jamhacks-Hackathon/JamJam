import { Discord } from '../index';

export = {
  data: new Discord.SlashCommandBuilder()
    .setName('announce')
    .setDescription('Schedule an announcement')
    .setDefaultMemberPermissions(Discord.PermissionFlagsBits.ManageMessages),

  async execute(interaction: Discord.CommandInteraction) {
    // Create a modal for scheduling an announcement
    const modal = new Discord.ModalBuilder()
      .setCustomId('announceModal')
      .setTitle('Schedule Announcement');

    // Create text input components for the modal
    const messageInput = new Discord.TextInputBuilder()
      .setCustomId('messageInput')
      .setLabel('Announcement Message')
      .setStyle(Discord.TextInputStyle.Paragraph)
      .setPlaceholder('Enter your announcement message here')
      .setRequired(true);

    const channelInput = new Discord.TextInputBuilder()
      .setCustomId('channelInput')
      .setLabel('Channel ID')
      .setStyle(Discord.TextInputStyle.Short)
      .setPlaceholder('Enter the channel ID for the announcement')
      .setRequired(true);

    const timeInput = new Discord.TextInputBuilder()
      .setCustomId('timeInput')
      .setLabel('Time (YYYY-MM-DD HH:MM)')
      .setStyle(Discord.TextInputStyle.Short)
      .setPlaceholder('e.g., 2023-12-31 23:59')
      .setRequired(true);

    const pingInput = new Discord.TextInputBuilder()
      .setCustomId('pingInput')
      .setLabel('Role ID to Ping (optional)')
      .setStyle(Discord.TextInputStyle.Short)
      .setPlaceholder('Leave empty for no ping')
      .setRequired(false);

    // Add inputs to action rows
    const messageActionRow =
      new Discord.ActionRowBuilder<Discord.TextInputBuilder>().addComponents(
        messageInput
      );
    const channelActionRow =
      new Discord.ActionRowBuilder<Discord.TextInputBuilder>().addComponents(
        channelInput
      );
    const timeActionRow =
      new Discord.ActionRowBuilder<Discord.TextInputBuilder>().addComponents(
        timeInput
      );
    const pingActionRow =
      new Discord.ActionRowBuilder<Discord.TextInputBuilder>().addComponents(
        pingInput
      );

    // Add action rows to the modal
    modal.addComponents(
      messageActionRow,
      channelActionRow,
      timeActionRow,
      pingActionRow
    );

    // Show the modal to the user
    await interaction.showModal(modal);
  }
};
