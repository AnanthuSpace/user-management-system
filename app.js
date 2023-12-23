const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const nocache = require("nocache");
const userRoute = require("./routes/UserRoutes");
const adminRoute = require("./routes/AdminRoutes");
require("./DB/db_connection");

const app = express();

app.use(cookieParser());
app.use(
    session({
        secret: "myKey",
        resave: false,
        saveUninitialized: true,
    })
);

app.set("view engine", "ejs");
app.use(express.static("views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(nocache());

app.use("/", userRoute);
app.use("/admin", adminRoute);

app.listen(3000, () => {
    console.log(`Server running on port http://localhost:3000`);
});
