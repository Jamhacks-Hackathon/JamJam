import mongoose from 'mongoose';
async function mongo() {
  mongoose.set('strictQuery', true);
  mongoose.connect(process.env.MONGO_KEY as string).then(() => {
    console.log('Connected to Mongo Database');
  });
}

export default mongo;
