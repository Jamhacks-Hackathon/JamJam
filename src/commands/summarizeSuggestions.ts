import { Discord } from "../index";
import { USER } from "../database";
import { getJamJamResponse } from "../lib/gemini";

export = {
  data: new Discord.SlashCommandBuilder()
    .setName('summarize-suggestions')
    .setDescription('Ask JamJam to summarize and collect suggestions from the hackers!')
    .addStringOption(option => 
      option.setName('question')
      .setDescription('Type what you want to know about the suggestions here!')
      .setRequired(true)
    ),
  
    async execute(interaction: Discord.ChatInputCommandInteraction) {
      const currentUser = await USER.find({discord_id: interaction.user.id});
      if (currentUser.length === 0)
        return await interaction.reply({
          content: 'You are not a member of the JAMHacks community.',
          ephemeral: true
        });
      if (!currentUser[0].isAdmin)
        return await interaction.reply({
          content: 'You are not an admin.',
          ephemeral: true
        });

      await interaction.deferReply();

      const allUsers = await USER.find({});
      const allSuggestionResponses = [];
      for (const user of allUsers) {
        const suggestionResponse = user.wants_to_see;
        if (suggestionResponse) allSuggestionResponses.push(suggestionResponse);
      }

      const prompt = await interaction.options.getString('question');
      if (!prompt) return null;

      const jamJamResponse = await getJamJamResponse(allSuggestionResponses, prompt);

      if (!jamJamResponse)
        return await interaction.editReply('JamJam did not return a response.');
      await interaction.editReply(jamJamResponse);
    }
}