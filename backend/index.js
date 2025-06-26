const mongoose = require("mongoose");
const dotenv = require("dotenv");
const server = require('./src/app')

//config dotnev
dotenv.config({ path: "./.env" });

//database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    server.listen(process.env.PORT, () => console.log(`Database connected and App listening on port ${process.env.PORT}`));
  })
  .catch((error) => console.log("Database connection error", error));
