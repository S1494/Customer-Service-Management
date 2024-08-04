const app = require("./app.js");
require("dotenv").config();
const connectDb = require("./db/db.js");

connectDb();
app.listen(process.env.PORT, console.log("connectd", process.env.PORT));
