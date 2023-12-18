const {User}=require('../models/userDB')

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


// SignUp
const createUser = async (req, res) => {
    const { username, email, password ,repassword} = req.body;
    try {
        const newUser = new User({
            username,
            email,
            password,
            repassword
        });
        await newUser.save();
        console.log("User created successfully");
        res.status(200).send('Internal Server Error');
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Internal Server Error');
    }
};


module.exports = {
    renderLogin,
    renderSignup,
    createUser
}
  