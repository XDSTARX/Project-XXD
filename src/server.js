require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Super Surveys in the World running on http://localhost:${PORT}`);
});
