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
    const channelInput = interaction.fields.getTextInputValue('channelInput');
    const timeString = interaction.fields.getTextInputValue('timeInput');

    // Resolve channel from name or ID
    let channel;
    let channelId = channelInput;

    // Check if this is a channel mention or name
    if (channelInput.startsWith('<#') && channelInput.endsWith('>')) {
      // Extract ID from mention format <#123456789>
      channelId = channelInput.substring(2, channelInput.length - 1);
    } else if (!channelInput.match(/^\d+$/)) {
      // If it's not a raw ID, try to find by name
      channel = interaction.guild?.channels.cache.find(
        (c) =>
          c.name.toLowerCase() === channelInput.toLowerCase().replace('#', '')
      );

      if (channel) {
        channelId = channel.id;
      }
    }

    // Validate the channel
    channel =
      channel ||
      (await interaction.guild?.channels.fetch(channelId).catch(() => null));
    if (!channel || !channel.isTextBased()) {
      await interaction.reply({
        content:
          'Invalid channel. Please provide a valid text channel name or ID.',
        ephemeral: true
      });
      return;
    }

    // Parse and validate the time
    let scheduledTime;
    try {
      // Format the time string and parse it
      const formattedTimeString = timeString.trim();

      // Parse date components
      const [datePart, timePart] = formattedTimeString.split(' ');
      if (!datePart || !timePart) {
        throw new Error('Invalid format');
      }

      const [year, month, day] = datePart
        .split('-')
        .map((num) => parseInt(num));
      const [hour, minute] = timePart.split(':').map((num) => parseInt(num));

      // Create date (Month is 0-indexed in JavaScript Date)
      scheduledTime = new Date(year, month - 1, day, hour, minute);

      // Check if date is valid
      if (isNaN(scheduledTime.getTime())) {
        throw new Error('Invalid date format');
      }
    } catch (error) {
      await interaction.reply({
        content:
          'Invalid time format. Please use YYYY-MM-DD HH:MM format (e.g., 2025-05-17 15:34).',
        ephemeral: true
      });
      return;
    }

    // Get current time
    const now = new Date();

    // Ensure the time is in the future with a small 5-second buffer
    if (scheduledTime.getTime() <= now.getTime() - 5000) {
      await interaction.reply({
        content: `Scheduled time must be in the future. Current time is: ${now.toLocaleString()}`,
        ephemeral: true
      });
      return;
    }

    // Create the announcement in the database
    const announcement = new ANNOUNCEMENT({
      scheduledTime,
      channelId: channel.id,
      message,
      createdBy: interaction.user.id,
      sent: false
    });

    await announcement.save();

    // Calculate time until the announcement
    const timeUntil = scheduledTime.getTime() - now.getTime();
    const hours = Math.floor(timeUntil / (1000 * 60 * 60));
    const minutes = Math.floor((timeUntil % (1000 * 60 * 60)) / (1000 * 60));

    // Format time remaining for better user feedback
    let timeUntilText = '';
    if (hours > 0) {
      timeUntilText += `${hours} hour${hours === 1 ? '' : 's'}`;
    }
    if (minutes > 0 || hours === 0) {
      if (hours > 0) {
        timeUntilText += ' and ';
      }
      timeUntilText += `${minutes} minute${minutes === 1 ? '' : 's'}`;
    }

    // Reply to the user with better feedback
    await interaction.reply({
      content: `✅ Announcement scheduled for ${scheduledTime.toLocaleString()} (in ${timeUntilText}) in <#${channel.id}>
📝 Message: ${
        message.length > 50 ? message.substring(0, 47) + '...' : message
      }`,
      ephemeral: true
    });

    console.log(
      `Scheduled announcement created by ${interaction.user.tag} for ${scheduledTime.toISOString()}`
    );
  } catch (error) {
    console.error('Error handling announcement modal:', error);
    await interaction.reply({
      content: 'There was an error scheduling your announcement.',
      ephemeral: true
    });
  }
}
