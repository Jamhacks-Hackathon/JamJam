const fs = require('fs');
const path = require('path');
import { Discord } from "../index";
import { USER } from "../database";

const filePath = path.join(__dirname, 'alldiscordmembers.json');

export = {
  data: new Discord.SlashCommandBuilder()
    .setName('get-discord-members')
    .setDescription('Used to get all of the specified members')
    .addStringOption((option) => option
      .setName("specification")
      .setDescription("Choose a specific category of member.")
      .setRequired(true)
      .addChoices(
        {name: "Hackers", value: "hackers"},
        {name: "Everyone", value: "everyone"},
      )),
    
      async execute(interaction: Discord.ChatInputCommandInteraction) {
        const currentUser = await USER.find({discord_id: interaction.user.id});
        if (!process.env.HACKER_ROLE_ID) {
          return await interaction.reply({
            content: 'The hacker role is not defined.',
            ephemeral: true
          })
        }
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

        const userOption = interaction.options.getString('specification', true);
        const allDiscordMembers = await interaction.guild?.members.fetch();
        if (!allDiscordMembers) return;

        const requiredDiscordMembers = [];
        for (const [,discordMember] of allDiscordMembers) {
          var passSpecification = true;
          if (userOption === 'hackers' && !discordMember.roles.cache.has(process.env.HACKER_ROLE_ID)) {
            passSpecification = false;
          }
          if (passSpecification) requiredDiscordMembers.push(discordMember.user.id);
          
        }

        fs.writeFileSync(filePath, JSON.stringify(requiredDiscordMembers, null, 2), 'utf-8');
        const allMembersFile = new Discord.AttachmentBuilder(filePath);

        await interaction.reply({
          content: `Finished adding to the ${userOption} JSON file!`,
          files: [allMembersFile]
        })

      }
}