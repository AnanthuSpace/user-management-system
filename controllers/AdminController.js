const {User}=require('../models/userDB')
const bcrypt = require('bcrypt');
const { logout } = require('./UserController');


// Admin Loging Page Rendering
 const adminLogin = async(req, res) => {
    try {
        if(!req.session.admin){
        res.render('adminLogin')
        }else{
            res.redirect('/adminHome');
        }
    } catch (error) {
        res.render('adminLogin')
    }
}


// Get Admin Home Page and read the user details
const adminHome = async (req, res) => {
    const { email, password } = req.body;
    req.session.admin = email;
    res.cookie('email', req.email, { httpOnly: true })
    try {
  
      if (email === 'admin@gmail.com' && password === '123'){
        const userList = await User.find({},{_id:0,username:1,email:1})
        res.render('adminHome', {user:userList})
        return; 
      }
      
      res.render('adminLogin', { checkDetails: "Invalid User id and password" })
    } catch (error) {
      console.error('Login error:', error)
      res.render('adminLogin', { checkDetails: 'Error processing login' })
    }
  }

  // Logout
  const adminLogout = async (req,res) => {
    try {
        req.session.destroy((err)=>{
            if (err) {
                console.log("Logout error");
            }
            console.log("Logged out successfully");
            res.redirect("/admin")
        })
    } catch (error) {
        console.log('Logout Error');
    }
}
  
// Add New Users
const newUser = async (req,res) => {
  const { username, email, password ,repassword} = req.body;

  if (!username || !email || !password || !repassword) {
      res.render('', { enterUsername: "Fill the missing fields" })
  }
  if (password !== repassword) {
      res.render('',{enterUsername: "Password do not match"})
  }
  try {
      const existingUser = await User.findOne({ email })
      if(existingUser){
          return res.render('signup',{enterUsername: "Email is already registered"})
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      
      const newUser = new User({
          username,
          email,
          password: hashedPassword,
          repassword
      });

      await newUser.save();
      console.log("User created successfully");
      res.redirect('/adminHome')
  } catch (error) {
      console.error('Error creating user:', error);
  }
}



module.exports = {
    adminLogin,
    adminHome,
    adminLogout
}