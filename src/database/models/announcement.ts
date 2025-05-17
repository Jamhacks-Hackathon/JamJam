import { Schema, model } from 'mongoose';

const announcementSchema = new Schema({
  scheduledTime: {
    type: Date,
    required: true
  },
  channelId: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  pingRole: {
    type: String,
    default: ''
  },
  createdBy: {
    type: String,
    required: true
  },
  sent: {
    type: Boolean,
    default: false
  }
});

const ANNOUNCEMENT = model('Announcements', announcementSchema);
export default ANNOUNCEMENT;
