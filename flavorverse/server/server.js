/* eslint-disable no-undef */
const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const cors = require("cors");

require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(require("./routes/user"));
app.use(require("./routes/ingredient"));
app.use(require("./routes/recipe"));
// get driver connection
const dbo = require("./db/conn");
app.listen(port, async () => {
    // perform a database connection when server starts
    await dbo.connectToServer(function (err) {
        if (err) console.error(err);
    });
    console.log(`Server is running on port: ${port}`);
});