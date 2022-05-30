const express = require("express");
require("dotenv").config();
const connect = require("./config/db");
const port = process.env.PORT;
const productController = require("./controllers/product.controller");
const cartController = require("./controllers/cart.controller");
const { login, register } = require("./controllers/auth.controller");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/login", login);
app.post("/register", register);
app.use("/products", productController);
app.use("/cart", cartController);

app.listen(port || 8080, async () => {
  await connect();
  console.log("Listening on ", port || 8080);
});
