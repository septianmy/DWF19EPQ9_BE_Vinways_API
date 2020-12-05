const express = require('express');
const app = express();
const port = 5001;
const bodyParser = require("body-parser");


const router = require('./src/routes');
app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(express.urlencoded({ extended: true })); 

app.use("/api/v1", router)

app.listen(port, () => console.log(`Listening on port ${port} !`))