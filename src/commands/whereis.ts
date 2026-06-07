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
  // General Events
  "hackerCheckIn": "Hacker Check-In will be held in the 1829 open space (Main Area) of PSE/E7",
  "washrooms": "Washrooms are located in the same area of each floor.",
  "openingCeremony": "The Opening Ceremony is located in the IDEAS Clinic (Room 1427) in PSE/E7.",
  "closingCeremony": "The Opening Ceremony is located in the IDEAS Clinic (Room 1427) in PSE/E7.",
  "judgingRooms": "The Judging Rooms are located in Rooms 2454 - 2466 in PSE/E7.",
  "organizerRoom": "The organizer room is located in Room 2357 in PSE/E7.",
  "sleepingRooms": "The sleeping rooms are located in Rooms 2324 and 2328 in PSE/E7. Room 2324 will be an all-gender sleeping room, and Room 2328 will be designed to females.",
  "foodArea": "The food area for all hacker meals is located in the 2472 open space (Dining Area) of PSE/E7.",
  "sponsorsArea": "The sponsors area is located in the 2822 open space of PSE/E7.",

  // Activities
  "networkingAndTeamBuilding": "The Networking and Team-Building activity will be held in the IDEAS Clinic (Room 1427) in PSE/E7",
  "gameDevelopment": "The Game Development workshop will be held in Activity Space B (Room 2328) in PSE/E7",
  "CLIAndTerminal": "The CLIs & Effective Terminal Use workshop will be held in Activity Space A (Room 2324) in PSE/E7",
  "spicyNoodleChallenge": "The Spicy Noodle Challenge activity will be held in the 2472 open space (Dining Area) of PSE/E7",
  "cupStacking": "The Cup Stacking activity will be held in the 1829 open space (Main Area) of PSE/E7",
  "musicalChairs": "The Musical Chairs activity will be held in Activity Space A (Room 2324) in PSE/E7",
  "customKeychainMaking": "The Custom Keychain Making activity will be held in Activity Space B (Room 2328) in PSE/E7",
  "trivia": "The Trivia activity will be held in Activity Space A (Room 2324) in PSE/E7",
  "pingPongTourney": "The Ping Pong Tournament activity will be held at the 2nd Floor Ping Pong Table (Open Space 2334) PSE/E7",
  "karaoke": "The Karaoke activity will be held in the IDEAS Clinic (Room 1427) in PSE/E7",
  "videoGameTourney": "The Video Game Tournament activity will be held in Activity Space A (Room 2324) in PSE/E7",
  "poker": "The Poker activity will be held in Activity Space B (Room 2328) in PSE/E7",
  "photobooth": "The Photobooth activity will be held in the 1829 open space (Main Area) of PSE/E7",

};

const imagePaths: Record<string, string> = {
  // General Events
  "hackerCheckIn": path.join(__dirname, "../assets/mainArea.png"),
  "washrooms": path.join(__dirname, "../assets/washrooms.png"),
  "openingCeremony": path.join(__dirname, "../assets/ideasClinic.png"),
  "closingCeremony": path.join(__dirname, "../assets/ideasClinic.png"),
  "judgingRooms": path.join(__dirname, "../assets/judgingrooms.png"),
  "organizerRoom": path.join(__dirname, "../assets/organizerroom.png"),
  "sleepingRooms": path.join(__dirname, "../assets/sleepingRooms.png"),
  "foodArea": path.join(__dirname, "../assets/diningArea.png"),
  "sponsorsArea": path.join(__dirname, "../assets/sponsorsArea.png"),

  // Activities
  "networkingAndTeamBuilding": path.join(__dirname, "../assets/ideasClinic.png"),
  "gameDevelopment": path.join(__dirname, "../assets/activitySpaceB.png"),
  "CLIAndTerminal": path.join(__dirname, "../assets/activitySpaceA.png"),
  "spicyNoodleChallenge": path.join(__dirname, "../assets/diningArea.png"),
  "cupStacking": path.join(__dirname, "../assets/mainArea.png"),
  "musicalChairs": path.join(__dirname, "../assets/activitySpaceA.png"),
  "customKeychainMaking": path.join(__dirname, "../assets/activitySpaceB.png"),
  "trivia": path.join(__dirname, "../assets/activitySpaceA.png"),
  "pingPongTourney": path.join(__dirname, "../assets/pingPong.png"),
  "karaoke": path.join(__dirname, "../assets/ideasClinic.png"),
  "videoGameTourney": path.join(__dirname, "../assets/activitySpaceA.png"),
  "poker": path.join(__dirname, "../assets/activitySpaceB.png"),
  "photobooth": path.join(__dirname, "../assets/mainArea.png"),
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
        {name: "Hacker Check-In", value: "hackerCheckIn"},
        // {name: "Washrooms", value: "washrooms"},
        // {name: "Opening Ceremony", value: "openingCeremony"},
        // {name: "Closing Ceremony", value: "closingCeremony"},
        // {name: "Judging Rooms", value: "judgingRooms"},
        // {name: "Organizer Room", value: "organizerRoom"},
        // {name: "Sleeping Rooms", value: "sleepingRooms"},
        // {name: "Food Area", value: "foodArea"},
        // {name: "Sponsors Area", value: "sponsorsArea"},
        // {name: "Networking and Team-Building", value: "networkingAndTeamBuilding"},
        // {name: "Workshop: Game Development", value: "gameDevelopment"},
        // {name: "Workshop: CLIs & Effective Terminal Use", value: "CLIAndTerminal"},
        // {name: "Spicy Noodle Challenge", value: "spicyNoodleChallenge"},
        // {name: "Cup Stacking", value: "cupStacking"},
        // {name: "Musical Chairs", value: "musicalChairs"},
        // {name: "Custom Keychain Making", value: "customKeychainMaking"},
        // {name: "Trivia", value: "trivia"},
        // {name: "Ping Pong Tournament", value: "pingPongTourney"},
        // {name: "Karaoke", value: "karaoke"},
        // {name: "Video Game Tournament", value: "videoGameTourney"},
        // {name: "Poker", value: "poker"},
        // {name: "Photobooth", value: "photobooth"}
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