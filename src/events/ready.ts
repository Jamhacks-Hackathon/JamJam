import { Events } from 'discord.js';
import { Discord } from '..';

export = {
  name: Events.ClientReady,
  once: true,
  execute(client: Discord.Client) {
    console.log(`${client.user?.username} is ready`);
  }
};
