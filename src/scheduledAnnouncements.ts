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

        // Simply send the message with all mentions enabled
        // Discord.js will handle the proper mention formatting
        await textChannel.send({
          content: announcement.message,
          allowedMentions: {
            parse: ['users', 'roles', 'everyone']
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

        try {
          // If sending fails, try again with a simpler approach without complex mention handling
          const channel = await BOT.CLIENT.channels.fetch(
            announcement.channelId
          );
          if (channel && channel.isTextBased()) {
            const textChannel = channel as Discord.TextChannel;
            await textChannel.send(announcement.message);

            // Mark as sent if the fallback succeeds
            announcement.sent = true;
            await announcement.save();
            console.log(
              `Sent announcement ${announcement._id} using fallback method`
            );
          }
        } catch (fallbackError) {
          console.error(
            `Fallback also failed for announcement ${announcement._id}:`,
            fallbackError
          );
        }
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
  void checkScheduledAnnouncements();

  // Then check 10s
  return setInterval(checkScheduledAnnouncements, 10000);
}
