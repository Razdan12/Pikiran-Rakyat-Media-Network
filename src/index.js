const fs = require('fs');
const https = require('https');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const userController = require('./User/UserControll');
const RoleController = require('./Role/RoleController');
const CustomerControler = require('./Cutomer/CustControler');
const Order = require('./Order/OrderControler');
const Quota = require('./Quatation/QuotaContr');
const Oti = require('./Oti/OtiContr');


const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTION',
  credentials: true,
};

const app = express();

app.use(cors(corsOptions));

dotenv.config();
const port = process.env.PORT || 443; // default to 443 if PORT not set

app.use(express.json({ limit: '1gb' }));
app.use(express.urlencoded({ limit: '1gb', extended: true }));

app.use('/user', userController);
app.use('/role', RoleController);
app.use('/customer', CustomerControler);
app.use('/img', express.static('public'));
app.use('/order', Order);
app.use('/quotation', Quota);
app.use('/oti', Oti);

app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// SSL configuration
// const privateKey = fs.readFileSync('../certs/sade.crt', 'utf8');
// const certificate = fs.readFileSync('../certs/sade.key', 'utf8');

// const credentials = { key: privateKey, cert: certificate };

// const httpsServer = https.createServer(credentials, app);

// httpsServer.listen(port, () => {
//   console.log(`HTTPS Server running on port ${port}`);
// });
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
});

app.listen(port, () => {
  console.log(`Server Runing on port ${port}`);
});
