import { Discord } from '..';

export = {
  name: Discord.Events.MessageCreate,
  async execute(message: Discord.Message) {
    const ARRAY = [
      'Feeling JAMtacular :jam:',
      'Ayush is coolest :sunglasses:',
      'JAMHacks 7 is the coolest hackathon!',
      'JamJam jammin to music',
      'Strawberry Jam better'
    ];
    if (message.content.includes(`<@1092977031869902918>`)) {
      message.channel.sendTyping().then(() => {
        const NUM: number = Math.floor(Math.random() * (5 - 2)) + 1;
        message.channel.send(ARRAY[NUM]);
      });
    }
  }
};
