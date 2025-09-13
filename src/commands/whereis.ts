import { Discord } from "../index";
/*
Command that allows JAMHacks hackers to find out where important venues are.
E.g:
/whereis Opening Ceremony
--> Located in the Ideas Hub! (Room 1427)
--> (Insert Photo of where Room 1427 is)
*/

export = {
  data: new Discord.SlashCommandBuilder()
    .setName('whereis')
    .setDescription('Find where important rooms are located in E7!')
    .addStringOption((option) => option
      .setName("location")
      .setDescription("Choose a location")
      .setRequired(true)
      .addChoices(
        {name: "Opening Ceremony", value: "openingCeremony"},
        {name: "Judging Rooms", value: "judgingRooms"},
        {name: "Organizer Room", value: "organizerRoom"}
      )),
  
    async execute(interaction: Discord.ChatInputCommandInteraction) {
      const locationValue = interaction.options.getString("location", true);
      let reply: string;

      switch (locationValue) {
        case "openingCeremony" :
          reply = "The Opening Ceremony is located in Room 1427 in E7.";
          break;
        case "judgingRooms" :
          reply = "The Judging Rooms are located in Rooms 2454 - 2466.";
          break;
        case "organizerRoom":
          reply = "The organizer room is located in Room 2357.";
          break;
        default:
          reply = "Sorry, JamJam doesn't recognize that room. Let one of the organizers know if you require assistance!";
      }

      await interaction.reply(reply);

    },


};