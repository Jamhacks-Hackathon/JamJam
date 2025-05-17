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
    const pingRoleInput = interaction.fields.getTextInputValue('pingInput');

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

    // Parse and validate the time with proper timezone handling
    let scheduledTime;
    try {
      // Format the time string and add timezone info
      const formattedTimeString = timeString.trim();

      // Create the date object - this will interpret the date in local timezone
      const [datePart, timePart] = formattedTimeString.split(' ');
      if (!datePart || !timePart) {
        throw new Error('Invalid format');
      }

      const [year, month, day] = datePart
        .split('-')
        .map((num) => parseInt(num));
      const [hour, minute] = timePart.split(':').map((num) => parseInt(num));

      // Month is 0-indexed in JavaScript Date
      scheduledTime = new Date(year, month - 1, day, hour, minute);

      // Check if date is valid
      if (isNaN(scheduledTime.getTime())) {
        throw new Error('Invalid date format');
      }

      // For debugging - show both dates in console
      console.log(
        `Input time: ${formattedTimeString}, Parsed time: ${scheduledTime.toLocaleString()}, Current time: ${new Date().toLocaleString()}`
      );
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

    // Log times for debugging
    console.log(
      `Now: ${now.toISOString()}, Scheduled: ${scheduledTime.toISOString()}`
    );
    console.log(
      `Current time milliseconds: ${now.getTime()}, Scheduled time milliseconds: ${scheduledTime.getTime()}`
    );

    // Ensure the time is in the future (with 10 seconds grace period for processing)
    if (scheduledTime.getTime() <= now.getTime() - 10000) {
      await interaction.reply({
        content: `Scheduled time must be in the future. It's currently: ${now.toLocaleString()}`,
        ephemeral: true
      });
      return;
    }

    // Resolve role from name or ID
    let pingRole = pingRoleInput.trim();
    if (pingRole) {
      // If it's a mention format like <@&123456789>
      if (pingRole.startsWith('<@&') && pingRole.endsWith('>')) {
        pingRole = pingRole.substring(3, pingRole.length - 1);
      }
      // If it's not a raw ID, try to find by name
      else if (!pingRole.match(/^\d+$/)) {
        const role = interaction.guild?.roles.cache.find(
          (r) =>
            r.name.toLowerCase() === pingRole.toLowerCase().replace('@', '')
        );

        if (role) {
          pingRole = role.id;
        } else {
          // If no matching role, keep the original input
          // This way the pingRole will show as text if not found
        }
      }
    }

    // Create the announcement in the database
    const announcement = new ANNOUNCEMENT({
      scheduledTime,
      channelId: channel.id,
      message,
      pingRole,
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
      content: `✅ Announcement scheduled for ${scheduledTime.toLocaleString()} (in ${timeUntilText}) in <#${
        channel.id
      }>
📝 Message: ${message.length > 50 ? message.substring(0, 47) + '...' : message}
${pingRole ? `🔔 Will ping: <@&${pingRole}>` : ''}`,
      ephemeral: true
    });

    console.log(
      `Scheduled announcement created by ${
        interaction.user.tag
      } for ${scheduledTime.toISOString()}`
    );
  } catch (error) {
    console.error('Error handling announcement modal:', error);
    await interaction.reply({
      content: 'There was an error scheduling your announcement.',
      ephemeral: true
    });
  }
}
