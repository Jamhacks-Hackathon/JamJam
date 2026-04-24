import mongoose from "mongoose"
import { Schema, model } from 'mongoose';

const allEmailsSchema = new Schema({
  email: String
})
const ALLEMAILS = model('AllEmails', allEmailsSchema);
export default ALLEMAILS;