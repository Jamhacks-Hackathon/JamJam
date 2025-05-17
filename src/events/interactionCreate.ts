import { BOT, Discord, CRUD } from '..';
import { ANNOUNCEMENT } from '../database';

export = {
  name: Discord.Events.InteractionCreate,
  async execute(interaction: Discord.Interaction) {
    // Handle modal submissions
    if (interaction.isModalSubmit()) {
      if (interaction.customId === 'announceModal') {
        await handleAnnounceModal(interaction);
      }
      return;
    }

    // Handle chat input commands
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

/**
 * Handle the announcement modal submission
 */
async function handleAnnounceModal(
  interaction: Discord.ModalSubmitInteraction
) {
  try {
    // Get values from the modal
    const message = interaction.fields.getTextInputValue('messageInput');
    const channelId = interaction.fields.getTextInputValue('channelInput');
    const timeString = interaction.fields.getTextInputValue('timeInput');
    const pingRole = interaction.fields.getTextInputValue('pingInput');

    // Validate the channel
    const channel = await interaction.guild?.channels.fetch(channelId);
    if (!channel || !channel.isTextBased()) {
      await interaction.reply({
        content: 'Invalid channel ID. Please provide a valid text channel ID.',
        ephemeral: true
      });
      return;
    }

    // Parse and validate the time
    const scheduledTime = new Date(timeString);
    if (isNaN(scheduledTime.getTime())) {
      await interaction.reply({
        content: 'Invalid time format. Please use YYYY-MM-DD HH:MM format.',
        ephemeral: true
      });
      return;
    }

    if (scheduledTime <= new Date()) {
      await interaction.reply({
        content: 'Scheduled time must be in the future.',
        ephemeral: true
      });
      return;
    }

    // Create the announcement in the database
    const announcement = new ANNOUNCEMENT({
      scheduledTime,
      channelId,
      message,
      pingRole,
      createdBy: interaction.user.id,
      sent: false
    });

    await announcement.save();

    // Reply to the user
    await interaction.reply({
      content: `Announcement scheduled for ${scheduledTime.toLocaleString()} in <#${channelId}>`,
      ephemeral: true
    });
  } catch (error) {
    console.error('Error handling announcement modal:', error);
    await interaction.reply({
      content: 'There was an error scheduling your announcement.',
      ephemeral: true
    });
  }
}
