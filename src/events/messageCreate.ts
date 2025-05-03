import { Discord } from '..';
import { Message } from 'discord.js';

export = {
  name: Discord.Events.MessageCreate,
  async execute(message: Message) {
    const ARRAY = [
      'Feeling JAMtacular :jam:',
      'JAMHacks 9 is the coolest hackathon!',
      'Ayush is coolest :sunglasses:, as long as you push him into a pool!',
      'JamJam jammin to music',
      'Strawberry Jam better'
    ];

    // Only proceed if the message mentions the bot
    if (message.content.includes(`<@1348137410893971547>`)) {
      // Check if the channel is fully functional (has .send and .sendTyping)
      if ('send' in message.channel && 'sendTyping' in message.channel) {
        await message.channel.sendTyping();

        const NUM: number = Math.floor(Math.random() * (5 - 2)) + 1;
        await message.channel.send(ARRAY[NUM]);
      }
    }
  }
};
