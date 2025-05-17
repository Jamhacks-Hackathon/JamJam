import { BOT, Discord } from './index';
import { ANNOUNCEMENT } from './database';

/**
 * Check for and send scheduled announcements
 */
export async function checkScheduledAnnouncements(): Promise<void> {
  try {
    // Find all unsent announcements whose scheduled time has passed
    const now = new Date();
    const pendingAnnouncements = await ANNOUNCEMENT.find({
      scheduledTime: { $lte: now },
      sent: false
    });

    if (pendingAnnouncements.length === 0) {
      return;
    }

    console.log(
      `Found ${pendingAnnouncements.length} pending announcements to send`
    );

    // Process each pending announcement
    for (const announcement of pendingAnnouncements) {
      try {
        // Get the channel
        const channel = await BOT.CLIENT.channels.fetch(announcement.channelId);
        if (!channel || !channel.isTextBased()) {
          console.error(`Invalid channel for announcement ${announcement._id}`);
          continue;
        }

        // Prepare the message content
        let messageContent = announcement.message;

        // Add role ping if specified
        if (announcement.pingRole && announcement.pingRole.trim() !== '') {
          messageContent = `<@&${announcement.pingRole}> ${messageContent}`;
        }

        // Send the message
        await (channel as Discord.TextChannel).send(messageContent);

        // Mark the announcement as sent
        announcement.sent = true;
        await announcement.save();

        console.log(`Sent scheduled announcement ${announcement._id}`);
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
  console.log('Starting scheduled announcement checker');
  // Check immediately on startup
  checkScheduledAnnouncements();

  // Then check every minute
  return setInterval(checkScheduledAnnouncements, 60000);
}
