/*
File does not follow the proper naming conventions because of the JAMHacks website...
(Scott and Andrew do not value proper naming conventions)
*/
import { Schema, model } from 'mongoose';
import mongoose from 'mongoose';

const userSchema = new Schema({
  discord_id: String,
  name: String,
  email: String,
  social_media_info: {
    linkedin: {
      type: String,
      default: ''
    },
    instagram: {
      type: String,
      default: ''
    },
    github: {
      type: String,
      default: ''
    },
    personal_website: {
      type: String,
      default: ''
    }
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isRegistered: {
    type: Boolean,
    default: false
  },
  attendingStatus: {
    // 0: default, 1: attending, -1: not attending
    type: Number,
    default: 0
  },
  applicantStatus: {
    // 0: default, 1: accepted, -1: rejected, 2: waitlisted
    type: Number,
    default: 0
  },
  applicantRatings: {
    type: [{ type: mongoose.Types.ObjectId, ref: 'ApplicantRating' }],
    default: []
  },
  signedWaiver: {
    type: Boolean,
    default: false
  },
  event_specific: { // LIKE WHY IS THIS SNAKE CASE
    wistem_brunch: {
      // 0: undecided, 1: confirmed, -1: dismissed
      type: Number,
      default: 0
    },
    workshopAttendances: { // AND WHY IS THIS CAMEL CASE
      type: [{ type: mongoose.Types.ObjectId, ref: 'Events' }],
      default: []
    }
  }
});

const USER = model('user', userSchema);
export default USER;
