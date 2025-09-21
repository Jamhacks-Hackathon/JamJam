import { Discord } from "../index";
import path from "path";
/*
Command that allows JAMHacks hackers to find out where important venues are.
E.g:
/whereis Opening Ceremony
--> Located in the Ideas Hub! (Room 1427)
--> (Insert Photo of where Room 1427 is)
*/

const locationReplies: Record<string, string> = {
  "openingCeremony": "The Opening Ceremony is located in Room 3101 - 3102 in E5.",
  "judgingRooms": "The Judging Rooms are located in Rooms 2454 - 2466 in E7.",
  "organizerRoom": "The organizer room is located in Room 2357 in E7."
};

const imagePaths: Record<string, string> = {
  "openingCeremony": path.join(__dirname, "../assets/openingceremony.png"),
  "judgingRooms": path.join(__dirname, "../assets/judgingrooms.png"),
  "organizerRoom": path.join(__dirname, "../assets/organizerroom.png")
};


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
      let image: Discord.AttachmentBuilder;

      if (locationReplies[ locationValue ] === null) {
        reply = "Sorry, JamJam doesn't recognize that room.";
      } else {
        reply = locationReplies[ locationValue ];
      }

      if (imagePaths[ locationValue ] === null) {
        image = new Discord.AttachmentBuilder( imagePaths[ locationValue ] );
      } else {
        image = new Discord.AttachmentBuilder( imagePaths[ locationValue ] );
      }

      await interaction.reply({
        content: reply, 
        files: [image]
      });

    },


};