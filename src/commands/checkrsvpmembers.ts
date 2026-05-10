const fs = require('fs');
const path = require('path');
import { Discord } from "../index";
import { USER } from "../database";

const filePath = path.join(__dirname, 'rsvpnodiscordmembers.json');

export = {
  data: new Discord.SlashCommandBuilder()
    .setName('check-rsvp-discord-members')
    .setDescription(`Lists out the EMAILS of who is not in the discord server, but has RSVP'd.`),

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
      await interaction.deferReply();
      const allRSVPMembers = await USER.find({attendingStatus: 1});

      if (allRSVPMembers.length === 0) {
        return await interaction.reply({
          content: `There are no RSVP'd members.`,
          ephemeral: true
        })
      }
      const rsvpNoDiscordMembers = [];
      await interaction.guild?.members.fetch();
      for (const rsvpMember of allRSVPMembers) {

        if (!rsvpMember.discord_id) {
          break;
        }

        if (!interaction.guild?.members.cache.has(rsvpMember.discord_id)) {
          rsvpNoDiscordMembers.push(rsvpMember.email);
        }
      }

      fs.writeFileSync(filePath, JSON.stringify(rsvpNoDiscordMembers, null, 2), 'utf8');

      const emailFile = new Discord.AttachmentBuilder(filePath);

      await interaction.editReply({
        content: 'Added to the JSON file!',
        files: [emailFile]
      })
    }
}