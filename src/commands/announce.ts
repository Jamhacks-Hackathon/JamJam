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
      .setPlaceholder(
        'Enter your announcement message here (you can include pings like @role)'
      )
      .setRequired(true);

    // Channel input with improved instructions
    const channelInput = new Discord.TextInputBuilder()
      .setCustomId('channelInput')
      .setLabel('Channel')
      .setStyle(Discord.TextInputStyle.Short)
      .setPlaceholder('Enter channel name or ID (e.g. #announcements)')
      .setRequired(true);

    const timeInput = new Discord.TextInputBuilder()
      .setCustomId('timeInput')
      .setLabel('Time (YYYY-MM-DD HH:MM)')
      .setStyle(Discord.TextInputStyle.Short)
      .setPlaceholder('e.g., 2025-05-17 15:34')
      .setRequired(true);

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

    // Add action rows to the modal
    modal.addComponents(messageActionRow, channelActionRow, timeActionRow);

    // Show the modal to the user
    await interaction.showModal(modal);
  }
};
