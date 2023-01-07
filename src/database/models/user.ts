/*
Purpose of this model: */

import { Schema, model, Model, Document } from 'mongoose';

interface userInterface extends Document {
  discordID: string;
  name: string;
  email: string;
  socialMediaInfo: object;
  isAdmin: boolean;
  isRegistered: boolean;
  isAccepted: boolean;
}

const schema = new Schema<userInterface>(
  {
    discordID: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    socialMediaInfo: {
      linkedin: {
        type: String
      },
      instagram: {
        type: String
      }
    },
    isAdmin: {
      type: Boolean,
      required: true
    },
    isRegistered: {
      type: Boolean,
      required: true
    },
    isAccepted: {
      type: Boolean,
      required: true
    }
  },
  { versionKey: false }
); // Dictates what type of information will be stored and if it's required

const USER: Model<userInterface> = model<userInterface>('user', schema);
export default USER;
