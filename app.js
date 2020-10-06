require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//my routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category")
const productRoutes = require("./routes/product")
const orderRoutes = require("./routes/order")
//const stripeRoutes = require("./routes/stripepayment")
const paymentBRoutes = require("./routes/paymentBRoutes");

const app = express();

//db connection
mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex: true })
const db = mongoose.connection
db.on('error', (error) => console.log('error'))
db.once('open', () => console.log("CONNECTED TO DATABASE"))

//middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api",productRoutes);
app.use("/api",orderRoutes)
//app.use("/api",stripeRoutes)
app.use("/api",paymentBRoutes)



//port
const port = 9000;

//server
app.listen(port, () => {
    console.log(`app is running at ${port}`);
});
