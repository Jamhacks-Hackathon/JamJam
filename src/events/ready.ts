import { Discord } from '..';

export = {
  name: Discord.Events.ClientReady,
  once: true,
  execute(client: Discord.Client) {
    console.log(`${client.user?.username} is ready`);
  }
};
