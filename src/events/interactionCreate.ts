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

    // Parse and validate the time with better error handling
    let scheduledTime;
    try {
      // Add seconds if not provided to ensure consistent format
      const formattedTimeString = timeString
        .trim()
        .match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/)
        ? `${timeString.trim()}:00`
        : timeString.trim();

      scheduledTime = new Date(formattedTimeString);

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

    // Ensure the time is in the future
    if (scheduledTime <= new Date()) {
      await interaction.reply({
        content:
          "Scheduled time must be in the future. It's currently: ." +
          new Date().toLocaleString(),
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
    const now = new Date();
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
