const {User}=require('../models/userDB')
const bcrypt = require('bcrypt')



// load loging page
const renderLogin = async(req, res) => {
    try {
        if(!req.session.user){
        res.render('login')
        }else{
            res.redirect('/home');
        }
    } catch (error) {
        res.render('home')
    }
}

// Login and user verification
const userVerification = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user || !(await bcrypt.compare(password, user.password))) {
        res.render('login', { checkDetails: "Invalid User id and password" });
        return; 
      }
  
      console.log(user.username);
  
      req.session.user = user.username;
      res.cookie('sessionId', req.sessionID, { httpOnly: true });
      res.render('home', { user: user.username });
  
    } catch (error) {
      console.error('Login error:', error);
    }
  };
  

const renderHome = async (req,res) => {
    if(req.session.user){
        res.render('home',{user:req.session.user})
    }else{
        res.redirect('/login')
    
    }}

// load signup page
const renderSignup = async(req, res) => {
    try {
      res.render('signup')
    } catch (error) {
        res.redirect('/signup')
    }
}

// SignUp and validate
const createUser = async (req, res) => {
    const { username, email, password ,repassword} = req.body;

    if (!username || !email || !password || !repassword) {
        res.render('signup', { enterUsername: "Fill the missing fields" })
    }
    if (password !== repassword) {
        res.render('signup',{enterUsername: "Password do not match"})
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
        res.redirect('/login')
    } catch (error) {
        console.error('Error creating user:', error);
    }
}

const logout = async (req,res) => {
        try {
            req.session.destroy((err)=>{
                if (err) {
                    console.log("Logout error");
                }
                console.log("Logged out successfully");
                res.redirect("/")
            })
        } catch (error) {
            console.log('Logout Error');
        }
}


module.exports = {
    renderLogin,
    renderSignup,
    renderHome,
    createUser,
    userVerification,
    logout
}
  