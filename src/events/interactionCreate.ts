import { ButtonBuilder, ButtonStyle, PermissionFlagsBits } from 'discord.js';
import { BOT, Discord, CRUD } from '..';
import { ANNOUNCEMENT, REQUESTMENTOR } from '../database';
import { requestMentorTicketModal } from './requestmentorticketModal';

export = {
  name: Discord.Events.InteractionCreate,
  async execute(interaction: Discord.Interaction) {

    // Handle Select Menu Interactions
    if (interaction.isStringSelectMenu()) {
      if (interaction.customId === 'requestMentorSelectMenu') {
        const result = interaction.values.join('');
        const filter = {Guild: interaction.guild!.id};
        const update = {Ticket: result};

        REQUESTMENTOR.updateOne(filter, update, {
          new: true
        }).then(value => {
          console.log(value);
        })

        interaction.showModal(requestMentorTicketModal);
      }
      return;
    }
    
    // Handle modal submissions
    if (interaction.isModalSubmit()) {
      if (interaction.customId === 'announceModal') {
        await handleAnnounceModal(interaction);
      }

      if (interaction.customId === 'requestMentorTicketModal') {
        await handleRequestMentorTicketModal(interaction);
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

/**
 * Handle the request ticket modal submission
 */

async function handleRequestMentorTicketModal(interaction: Discord.ModalSubmitInteraction) {
  if (!interaction.guild) {
        await interaction.reply("This command can only be used in the JAMHacks Discord Server!");
        return;
      }

  const data = await REQUESTMENTOR.findOne({ Guild: interaction.guild.id });
  const information = interaction.fields.getTextInputValue('informationInput');

  const posChannel = await interaction.guild?.channels.cache.find(c => c.name === `ticket-${interaction.user.id}`);
  if (posChannel) {
    return await interaction.reply({
      content: 'You already have requested a mentor',
      ephemeral: true
    })
  }

  const category = data?.Channel;
  const embed = new Discord.EmbedBuilder()
    .setColor("Blue")
    .setTitle(`${interaction.user.username}'s Mentor Request Ticket`)
    .setDescription('Welcome to your Mentor Request Ticket! Please wait while our mentors review your information.')
    .addFields({ name: "Additional Information", value: `${information} `})
    .addFields({ name: "Type", value: `${data!.Ticket} `})
    .setFooter({ text: `${interaction.guild.name} Mentor Request Tickets`})
  
  const button = new Discord.ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new Discord.ButtonBuilder()
        .setCustomId('requestmentorticket')
        .setLabel('Close Mentor Request Ticket')
        .setStyle(ButtonStyle.Danger)
    )
  
  const channel = await interaction.guild.channels.create({
    name: `ticket-${interaction.user.id}`,
    type: Discord.ChannelType.GuildText,
    parent: `${category}`,
    permissionOverwrites: [
      {
        id: interaction.guild.id,
        deny: [PermissionFlagsBits.ViewChannel]
      },
      {
        id: interaction.user.id,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ReadMessageHistory,
        ],
      },
      {
        id: process.env.MENTOR_ROLE_ID as string,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ReadMessageHistory,
        ],
      }
    ]
  })

  const message = await channel.send({
    embeds: [embed],
    components: [button]
  })

  await interaction.reply({
    content: `Your ticket is now open in ${channel}`,
    ephemeral: true
  })

  const collector = message.createMessageComponentCollector()
  collector.on('collect', async i => {
    ;(await channel).delete();
    const dmEmbed = new Discord.EmbedBuilder()
      .setColor("Blue")
      .setTitle(`Your Mentor Request Ticket has been closed.`)
      .setDescription('Thanks for using the Mentor Request Ticket system. If you need anymore help, feel free to create another ticket!')
      .setFooter({ text: `${interaction.guild!.name} Mentor Request Tickets`})
      .setTimestamp()
    
      const member = await interaction.guild!.members.fetch(interaction.user.id);
      member.send({
        embeds: [dmEmbed]
      }).catch(err => {
        console.log(err);
        return;
      })

  })

  

}