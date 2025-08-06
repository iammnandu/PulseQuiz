const express = require("express");
const dotenv = require("dotenv");
const userRoutes = require("./routes/user"); 
const adminRoutes = require("./routes/admin"); 
const cors= require("cors");

dotenv.config();

const app = express();
app.use(express.json()); 
app.use(cors()); 

app.use("/users", userRoutes); 
app.use("/admin", adminRoutes);


const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});