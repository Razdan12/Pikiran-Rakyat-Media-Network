const bodyParser = require("body-parser");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const userController = require("./User/UserControll");
const RoleController = require("./Role/RoleController");
const CustomerControler = require("./Cutomer/CustControler");
const Order = require("./Order/OrderControler");
const Quota = require("./Quatation/QuotaContr");
const enforce = require('express-sslify');
const corsOptions = {
  origin: "https",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTION",
  credentials: true,
};
const app = express();

app.use(enforce.HTTPS({ trustProtoHeader: true }));

app.use(cors(corsOptions));

dotenv.config();
const port = process.env.PORT;
app.use(bodyParser.json({ limit: "1gb" }));
app.use(bodyParser.urlencoded({ limit: "1gb", extended: true }));

app.use(express.json());

app.use("/user", userController);
app.use("/role", RoleController);
app.use("/customer", CustomerControler);
app.use("/img", express.static("public"));
app.use("/order", Order);
app.use("/quotation", Quota);

app.use((req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
});

app.listen(port, () => {
  console.log(`Server Runing on port ${port}`);
});
