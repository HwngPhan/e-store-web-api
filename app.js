const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const authJwt = require("./helper/jwt");
const errorHandler = require("./helper/error-handler");
require("dotenv/config");
const api = process.env.API_URL;

app.use(cors());
app.options("/{*any}", cors());

// Middleware

app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use(authJwt());
// app.use(errorHandler);

//Routers
const productsRouter = require("./routers/products");
const usersRouter = require("./routers/users");
const ordersRouter = require("./routers/orders");
const categoriesRouter = require("./routers/categories");
const vouchersRouter = require("./routers/vouchers");
const orderitemRouter = require("./routers/orderItems");
// app.use("/api/v1/products", productsRouter);
app.use(`${api}/products`, productsRouter);
app.use(`${api}/users`, usersRouter);
app.use(`${api}/orders`, ordersRouter);
app.use(`${api}/categories`, categoriesRouter);
app.use(`${api}/vouchers`, vouchersRouter);
app.use(`${api}/orderitems`, orderitemRouter);
//Database connection

mongoose
  .connect(process.env.CONNECTION_STRING, {
    dbName: "eshop-database",
  })
  .then(() => {
    console.log("Database connection is ready...");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(3000, () => {
  console.log("Server is running on : http://localhost:3000");
});
