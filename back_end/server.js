const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const sequelize = require('./config/database');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Hello this is the root path');
})

sequelize.sync()
.then(result => {
  app.listen(3000, () => {
    console.log('server running')
  })
})
.catch(err => {
  console.log(err);
})
