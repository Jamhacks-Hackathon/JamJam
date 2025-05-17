import { BOT, Discord } from './index';
import { ANNOUNCEMENT } from './database';

/**
 * Check for and send scheduled announcements
 */
export async function checkScheduledAnnouncements(): Promise<void> {
  try {
    // Find all unsent announcements whose scheduled time has passed
    const now = new Date();

    console.log(`Checking for announcements at ${now.toLocaleString()}`);

    const pendingAnnouncements = await ANNOUNCEMENT.find({
      scheduledTime: { $lte: now },
      sent: false
    });

    if (pendingAnnouncements.length === 0) {
      return;
    }

    console.log(
      `Found ${
        pendingAnnouncements.length
      } pending announcements to send at ${now.toLocaleString()}`
    );

    // Process each pending announcement
    for (const announcement of pendingAnnouncements) {
      try {
        const scheduledTime = new Date(announcement.scheduledTime);
        console.log(
          `Processing announcement: ${
            announcement._id
          }, scheduled for ${scheduledTime.toLocaleString()}`
        );

        // Get the channel
        const channel = await BOT.CLIENT.channels.fetch(announcement.channelId);
        if (!channel || !channel.isTextBased()) {
          console.error(
            `Invalid channel for announcement ${announcement._id}: ${announcement.channelId}`
          );
          // Mark as sent to avoid continuous errors
          announcement.sent = true;
          await announcement.save();
          continue;
        }

        const textChannel = channel as Discord.TextChannel;
        const guild = textChannel.guild;

        // Process message to handle any manual mention formats
        let messageContent = announcement.message;

        // Try to resolve any manual mentions of users or roles that might not work automatically
        try {
          // Fetch all guild members for better mention resolution (if the guild isn't too large)
          if (guild && guild.memberCount < 1000) {
            await guild.members.fetch();
          }

          // 1. Handle user mentions in @username format
          const userMentions = messageContent.match(/@(\w+)/g);
          if (userMentions) {
            for (const mention of userMentions) {
              const username = mention.slice(1); // Remove the '@'

              // Try to find the user in guild members
              const member = guild.members.cache.find(
                (m) =>
                  m.user.username.toLowerCase() === username.toLowerCase() ||
                  m.displayName.toLowerCase() === username.toLowerCase() ||
                  m.nickname?.toLowerCase() === username.toLowerCase()
              );

              if (member) {
                // Replace the text mention with a proper Discord mention
                messageContent = messageContent.replace(
                  new RegExp(`@${username}\\b`, 'g'),
                  `<@${member.id}>`
                );
              }
            }
          }

          // 2. Handle role mentions in @rolename format
          const roleMentions = messageContent.match(/@(\w+)/g); // We reuse the same regex
          if (roleMentions) {
            for (const mention of roleMentions) {
              const roleName = mention.slice(1); // Remove the '@'

              // Try to find the role by name
              const role = guild.roles.cache.find(
                (r) => r.name.toLowerCase() === roleName.toLowerCase()
              );

              if (role) {
                // Replace the text mention with a proper Discord role mention
                messageContent = messageContent.replace(
                  new RegExp(`@${roleName}\\b`, 'g'),
                  `<@&${role.id}>`
                );
              }
            }
          }

          // 3. Handle everyone/here mentions
          messageContent = messageContent
            .replace(/@everyone\b/g, '@everyone')
            .replace(/@here\b/g, '@here');

          console.log(`Processed message content: ${messageContent}`);
        } catch (error) {
          console.warn('Error processing mentions:', error);
          // Continue with original message if there's an error
        }

        // Send the message with full ping support
        await textChannel.send({
          content: messageContent,
          allowedMentions: {
            parse: ['roles', 'users', 'everyone']
          }
        });

        // Mark the announcement as sent
        announcement.sent = true;
        await announcement.save();

        console.log(
          `Successfully sent scheduled announcement ${
            announcement._id
          } at ${now.toLocaleString()}`
        );
      } catch (error) {
        console.error(`Error sending announcement ${announcement._id}:`, error);
      }
    }
  } catch (error) {
    console.error('Error checking scheduled announcements:', error);
  }
}

/**
 * Start the scheduled announcement checker
 * Runs every minute to check for announcements that need to be sent
 */
export function startScheduledAnnouncementChecker(): NodeJS.Timeout {
  console.log(
    `Starting scheduled announcement checker at ${new Date().toLocaleString()}`
  );

  // Check immediately on startup
  checkScheduledAnnouncements();

  // Then check every minute
  return setInterval(checkScheduledAnnouncements, 60000);
}
