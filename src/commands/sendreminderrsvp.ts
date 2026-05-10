import { Discord } from "../index";
import { USER } from "../database";

export = {
  data: new Discord.SlashCommandBuilder()
    .setName('send-rsvp-reminder')
    .setDescription(`DM's people in the official JAMHacks server who have not RSVP'd yet, to RSVP if possible!`),
  
    async execute(interaction: Discord.ChatInputCommandInteraction) {

      const currentUser = await USER.find({discord_id: interaction.user.id});
      if (currentUser.length === 0) {
        return await interaction.reply(
          {content: 'You need to be a registered user in the JAMHacks 10 database.', ephemeral:true}
        )
      }
      if (currentUser[0].isAdmin === false) {
        return await interaction.reply(
          {content: 'You need to be an admin to use this command.', ephemeral:true}
        )
      }

      await interaction.reply({
        content: 'JamJam has started sending out RSVP reminders to members of this discord server!',
        ephemeral: true
      })
      
      async function sendReminders() {

        const serverMembers = await interaction.guild?.members.fetch();
        if (!serverMembers) return;

        //console.log("ROLE ID:", process.env.HACKER_ROLE_ID);
        for (const [, serverMember] of serverMembers) {
          if (serverMember.roles.cache.size === 1) {
            try {
              await serverMember.send(`
                Hello fellow JAMHacks 10 hacker!

I noticed you're in our discord server, but haven't verified yet.

If you don't know how to RSVP, follow these steps:
- Go to your hacker dashboard (app.jamhacks.ca)
- Sign and submit the waiver
- RSVP for the event!

After that, you're able to verify yourself on the JAMHacks 10 Discord Server!
- Go to the JAMHacks 10 Discord Server and perform /verify on the JamJam bot!

If you do not RSVP soon, you risk giving up your spot to attend JAMHacks 10.

Thank you!
              `);
              console.log(`DM sent to ${serverMember.user.id}`);
            } catch (err) {
              console.log(err);
            }
          }
        await new Promise(res => setTimeout(res, 1200));
        }
      }
      await sendReminders();
    }
}