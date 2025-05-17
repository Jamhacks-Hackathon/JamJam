import { BOT, Discord } from './index';
import { ANNOUNCEMENT } from './database';

/**
 * Check for and send scheduled announcements
 */
export async function checkScheduledAnnouncements(): Promise<void> {
  try {
    // Find all unsent announcements whose scheduled time has passed
    // Get current time in EDT
    const now = new Date();
    // Adjust for EDT (GMT-4)
    const edtOffset = -4 * 60; // EDT offset in minutes
    const nowEDT = new Date(
      now.getTime() + (now.getTimezoneOffset() + edtOffset) * 60000
    );

    console.log(
      `Checking for announcements at ${nowEDT.toLocaleString('en-US', { timeZone: 'America/New_York' })} EDT`
    );

    const pendingAnnouncements = await ANNOUNCEMENT.find({
      scheduledTime: { $lte: nowEDT },
      sent: false
    });

    if (pendingAnnouncements.length === 0) {
      return;
    }

    console.log(
      `Found ${pendingAnnouncements.length} pending announcements to send at ${nowEDT.toLocaleString('en-US', { timeZone: 'America/New_York' })} EDT`
    );

    // Process each pending announcement
    for (const announcement of pendingAnnouncements) {
      try {
        const scheduledTimeEDT = new Date(announcement.scheduledTime);
        console.log(
          `Processing announcement: ${announcement._id}, scheduled for ${scheduledTimeEDT.toLocaleString('en-US', { timeZone: 'America/New_York' })} EDT`
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

        // Prepare the message content
        let messageContent = announcement.message;

        // Add role ping if specified
        if (announcement.pingRole && announcement.pingRole.trim() !== '') {
          // Check if it's a valid role ID
          if (announcement.pingRole.match(/^\d+$/)) {
            messageContent = `<@&${announcement.pingRole}> ${messageContent}`;
          } else {
            // If it's not a valid ID, just include it as text
            messageContent = `${announcement.pingRole} ${messageContent}`;
          }
        }

        // Send the message
        const textChannel = channel as Discord.TextChannel;
        await textChannel.send(messageContent);

        // Mark the announcement as sent
        announcement.sent = true;
        await announcement.save();

        console.log(
          `Successfully sent scheduled announcement ${announcement._id} at ${nowEDT.toLocaleString('en-US', { timeZone: 'America/New_York' })} EDT`
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
    `Starting scheduled announcement checker at ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} EDT`
  );

  // Check immediately on startup
  checkScheduledAnnouncements();

  // Then check every minute
  return setInterval(checkScheduledAnnouncements, 60000);
}
