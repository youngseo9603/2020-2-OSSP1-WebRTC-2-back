const express = require("express");
const server = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const FileStore = require("session-file-store")(session);

// DEFINE MODEL
const { User } = require("./schema/User");

// CONFIGURE SERVER PORT
const port = process.env.PORT || 2000;

// CONNECT DATABASE
mongoose
  .connect(
    "mongodb+srv://WebRTC:1234@cluster0.j0rat.mongodb.net/WebRTC?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    }
  )
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// SOLVE CORS POLICY
let corsOption = {
  origin: "http://localhost:2000",
  credentials: true
};

server.use(cors(corsOption));
server.use(cookieParser());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

// CONFIGURE SESSION
// server.use(session({
//   secret: 'sid',
//   resave: false,
//   saveUninitialized: true,
//   store: new FileStore()
// }));

// IMPORT ROUTES
const route = require("./routes/api");
server.use("/", route);

// RUN SERVER
server.listen(port, () => console.log(`Listening on port ${port}`));
