const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => {
  res.send('BANGGCATS 88 FITUR + BANNER ONLINE +628816863236');
});
app.listen(PORT, () => {
  console.log(`Keep alive port ${PORT}`);
});