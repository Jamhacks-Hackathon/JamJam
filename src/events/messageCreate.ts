import { Discord } from '..';
import { Message } from 'discord.js';

export = {
  name: Discord.Events.MessageCreate,
  async execute(message: Message) {
    const ARRAY = [

      'Feeling JAMtacular <:JAM:1417676985274077295>',
      'JAMHacks 10 is the coolest hackathon!',
      'Ayush is coolest :sunglasses:, as long as you push him into a pool!',
      'JamJam jammin to music',
      'Strawberry Jam better',
      'i know what you did.',
      "i hope you enjoy all of jamjam's inner monologues",
      'jamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjamjam',
      'Are you in a Jam? You came to the right guy!',
      'i am jamjam, the cutest kitty made from grape jam',
      "snoozin' away in my pa**jam**as",
      'jamjams least favourite jam is a traffic jam :[',
      'jamjams boutta JAM ur finger'
    ];

    // Only proceed if the message mentions the bot
    if (message.content.includes(`<@${process.env.CLIENT_ID}>`)) {
      // Check if the channel is fully functional (has .send and .sendTyping)
      if ('send' in message.channel && 'sendTyping' in message.channel) {
        await message.channel.sendTyping();

        const NUM: number = Math.floor(Math.random() * (ARRAY.length));
        await message.channel.send(ARRAY[NUM]);
      }
    }
  }
};
