const express = require('express');

const bodyParser = require('body-parser');
const PUBLIC_WEB_DIR = __dirname + "/app";
const app = express();
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use("/", express.static(PUBLIC_WEB_DIR));
app.listen(process.env.PORT || 4000);
