const {User}=require('../models/userDB')
const bcrypt = require('bcrypt');


// load loging page
const renderLogin = async(req, res) => {
    try {
        res.render('login')
    } catch (error) {
        res.redirect('/')
    }
}
  
// log signup page
const renderSignup = async(req, res) => {
    try {
      res.render('signup')
    } catch (error) {
        res.redirect('/signup')
    }
}
const renderHome = async(req, res) => {
    try {
        res.render('login')
    } catch (error) {
        res.redirect('/')
    }
}

// SignUp and validate
const createUser = async (req, res) => {
    const { username, email, password ,repassword} = req.body;
    if (!username || !email || !password || !repassword) {
        res.render('signup', { enterUsername: "Fill the missing fields" });
    }
    if (password !== repassword) {
        // return console.log('Password and repassword do not match');
        res.render('signup');
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            repassword
        });
        await newUser.save();
        console.log("User created successfully");
        res.redirect('/')
    } catch (error) {
        console.error('Error creating user:', error);
    }
}

// Login user verification
const userVerification = async(req,res) => {
    const {email, password} = req.body
    // const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({message : "Invalid User id and password"})
        }
        // res.status(200).json({ message: 'Login successful', user });
        res.redirect('/home')
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}


module.exports = {
    renderLogin,
    renderSignup,
    renderHome,
    createUser,
    userVerification
}
  