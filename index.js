const express = require("express");
const mongoose = require("mongoose");
const port = process.env.PORT || 4000;
require("dotenv").config();

//Routes Middleware
const movieRoutes = require("./routes/movie");
const userRoutes = require("./routes/user");

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGODB_STRING)
mongoose.connection.once("open", () => console.log("Connected to MongoDB Atlas."))

app.use("/movies", movieRoutes);
app.use("/users", userRoutes);

if(require.main === module){
	app.listen(port, "0.0.0.0", () => {
	  console.log(`Server is listening on port ${port}.`);
	});
}

module.exports = {app,mongoose};