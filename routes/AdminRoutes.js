const express = require('express')
const router = express.Router()
const AdminController = require("../controllers/AdminController")


router.get('/', AdminController.adminLogin)
router.post('/home', AdminController.adminHome)
router.get('/logout',AdminController.adminLogout)
router.get('/new-user')



module.exports = router;