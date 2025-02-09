const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Import
const emailRoutes = require("./routes/emailRoutes");
const likeRoutes = require("./routes/likesRoutes");

// Use
app.use("/api", emailRoutes);
app.use("/api", likeRoutes);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));