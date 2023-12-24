const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/AdminController");

router.get("/", AdminController.adminLogin);
router.post('/postLogin', AdminController.adminHome)
router.get('/getHome', AdminController.getAdminHome)
router.get("/home", AdminController.adminHome);
router.get("/logout", AdminController.adminLogout);
router.get('/add-user', AdminController.getNewUser);
router.post("/new-user", AdminController.newUser);
router.get('/searching', AdminController.userSearch);
router.get('/editUser', AdminController.renderUpdate);
router.post('/editUser', AdminController.updateUser);


module.exports = router;
