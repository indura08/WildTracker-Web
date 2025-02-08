const express = require('express')
const app = express();

const cors = require("cors");

const mongoose = require("mongoose")
const dotenv =  require("dotenv")

const userRoute = require("./Routes/user")
const authRoute = require("./Routes/auth")

dotenv.config()

mongoose.connect(
    process.env.MONGO_URL
).then(() => console.log("Database connected successfully")).catch((err) => console.log("Error happened" , err));


app.use(cors())
app.use(express.json())

app.use("/api/auth" , authRoute);
app.use("/api/users", userRoute);

app.get('/', (req,res) => {
    res.send("WildTracker Backend Speaking")
})

app.listen(5000, () => {
    console.log("server runs on port 5000")
})