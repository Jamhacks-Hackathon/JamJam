import { Discord } from '../index';
import { USER } from '../database';

export = {
  data: new Discord.SlashCommandBuilder()
    .setName('verify')
    .setDescription('Verify command!'),
  async execute(interaction: Discord.CommandInteraction) {
    if (await USER.exists({ discord_id: interaction.user.id })) {
      await USER.findOne({ discord_id: interaction.user.id }).then(
        async (doc) => {
          console.log(doc);
          if (doc?.attendingStatus === 1) {
            await interaction.reply(`Welcome to JAMHacks 9 ${doc.name}!`);
            const ROLE: Discord.Role = (await interaction.guild?.roles.fetch(
              process.env.HACKER_ROLE_ID
            )) as Discord.Role;
            const MEMBER: Discord.GuildMember =
              (await interaction.guild?.members.fetch(
                `${doc?.discord_id}` as string
              )) as Discord.GuildMember;
            await MEMBER.roles.add(ROLE);
            await MEMBER.setNickname(`${doc?.name}`);
            // Add role and change nickname to real name
          } else {
            await interaction.reply(
              `Sorry, you are not confirmed to attend JAMHacks 9! If you have been accepted, please RSVP first.\nPlease contact someone with the Organizer role if you believe that this is a mistake!`
            );
          }
        }
      );
    } else {
      await interaction.reply(
        `Sorry, my database records does not show their ever being a record of <@${interaction.user.id}> registering for JAMHacks 9, contact someone with the Organizer role if you believe that this is a mistake`
      );
    }
  }
};
