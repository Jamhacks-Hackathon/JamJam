import { Discord } from '../index';
import { USER } from '../database';
export = {
  data: new Discord.SlashCommandBuilder()
    .setName('verify')
    .setDescription('Verify command!')
    .addStringOption((option) =>
      option
        .setName('email')
        .setDescription('email you registered with')
        .setRequired(true)
    ),
  async execute(interaction: Discord.CommandInteraction) {
    const EMAIL = interaction.options.get('email');
    if (!EMAIL) {
      return;
    }
    console.log(`${EMAIL.value}`);
    console.log(await USER.exists({ email: EMAIL.value }));
    console.log(await USER.collection.getIndexes());
    if (await USER.exists({ email: EMAIL.value })) {
      await USER.findOne({ email: EMAIL.value }).then(async (doc) => {
        if (
          doc?.attendingStatus === 1 &&
          (doc?.discord_id as string) === `${interaction.user.id}`
        ) {
          const ROLE: Discord.Role = (await interaction.guild?.roles.fetch(
            '1092918980156596224'
          )) as Discord.Role;
          const MEMBER: Discord.GuildMember =
            (await interaction.guild?.members.fetch(
              `${doc?.discord_id}` as string
            )) as Discord.GuildMember;

          await MEMBER.roles.add(ROLE);
          await MEMBER.setNickname(`${doc?.name}`);
          // Add role and change nickname to real name
          console.log('cool beans');
        }
      });
    } else {
      // Reply that they arent in the system and to contact jamhacks exec if they think this is a mistake
      await interaction.reply(
        `Email \`${EMAIL.value}\` is not confirmed to attend the event. If you think this is a mistake please contact one of the JAMHacks organizers with the "Organizer" Role`
      );
    }
  }
};
