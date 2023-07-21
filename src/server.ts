import express from 'express';
const app = express();
const PORT = process.env.PORT || 6223;
app.get('/', (req, res) => res.send('OK'));
app.listen(PORT, () => console.log(`listening at http://localhost:${PORT}`));
