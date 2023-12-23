const express = require("express");
const router = express.Router();
const controller = require("../controllers/UserController");

router.get("/", controller.renderLogin);
router.get("/login", controller.renderLogin);
router.get("/signup", controller.renderSignup);
router.post("/userCreated", controller.createUser);
router.post("/userVerification", controller.userVerification);
router.get("/home", controller.renderHome);
router.get("/logout", controller.logout);

module.exports = router;
