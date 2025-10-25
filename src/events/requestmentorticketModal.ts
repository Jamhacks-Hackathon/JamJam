import {Discord} from '../index'

export const requestMentorTicketModal = new Discord.ModalBuilder()
  .setCustomId("requestMentorTicketModal")
  .setTitle("Provide ")
  .addComponents(

    // Information Section of the Modal
    new Discord.ActionRowBuilder<Discord.TextInputBuilder>().addComponents(
      new Discord.TextInputBuilder()
      .setCustomId('informationInput')
      .setLabel('Provide additional information on issue.')
      .setStyle(Discord.TextInputStyle.Paragraph)
      .setRequired(true)
    )
  );

