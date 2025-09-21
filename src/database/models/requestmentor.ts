import { Schema, model } from 'mongoose';
import mongoose from 'mongoose';

const requestMentorSchema = new Schema({
  Guild: String,
  Channel: String,
  Ticket: String,

});

const REQUESTMENTOR = model("requestmentor", requestMentorSchema);
export default REQUESTMENTOR;