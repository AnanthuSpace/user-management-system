const { User } = require("../models/userDB");
const bcrypt = require("bcrypt");


// Admin Loging Page Rendering
const adminLogin = async (req, res) => {
  try {
    if (req.session.admin) {
      res.redirect('/admin/getHome')
    } else {
      res.render('adminLogin')
    }
  } catch (error) {
    res.render("adminHome");
  }
};


// Get Admin Home Page and read the user details
const adminHome = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (email === "admin@gmail.com" && password === "123") {
      req.session.admin = email;
      res.cookie("sessionId", req.sessionID, { httpOnly: true });
      res.redirect("/admin/getHome");
      return;
    } else {
      res.render("adminLogin", { checkDetails: "Invalid User id and password" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.render("adminLogin", { checkDetails: "Error processing login" });
  }
};

const getAdminHome = async (req, res) => {
  try {
    if (req.session.admin) {
      let userList = await User.find({});
      res.render("adminHome", { userList });
      console.log("USer Deatils Listed");
    } else {
      res.render('adminLogin')
    }
  } catch (error) {
    console.log("User value find Error", error);
  }
}

// Logout
const adminLogout = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.log("Logout error");
        res.redirect("/admin/getHome");
      }
      console.log("Logged out successfully");
      res.redirect("/admin");
    });
  } catch (error) {
    console.log("Logout Error");
  }
};

// Add New Users
const newUser = async (req, res) => {
  const { username, email, password, repassword } = req.body;

  const trimmedUsername = username.trim()

  if (!trimmedUsername) {
    res.render('newUser', { enterUsername: "Username cannot be just whitespaces." })
    return
  }

  if (password !== repassword) {
    res.render("newUser", { enterUsername: "Password do not match" });
    return
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render("newUser", {
        enterUsername: "Email is already registered",
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();
    console.log("User created successfully");
    const userList = await User.find({});
    res.render("adminHome", { userList });
  } catch (error) {
    console.error("Error creating user:", error);
  }
};

// Add new user 
const getNewUser = async (req, res) => {
  try {
    res.render("newUser.ejs")
  } catch (error) {
    res.redirect("/getHome");
  }
};


// Handle Search form Submition
const userSearch = async (req, res) => {
  try {

    let search = ''
    if (req.query.search) {
      search = req.query.search;
    }

    const userList = await User.find(
      {
        $or: [
          { username: { $regex: new RegExp(`^${search}`, 'i') } },
          { email: { $regex: new RegExp(`^${search}`, 'i') } }
        ]
      })
    userList.search = search;

    res.render('adminHome', { userList });
  } catch (error) {
    console.log("Search Error", error);
  }
}

// Render Update Page
const renderUpdate = async (req, res) => {
  try {

    const id = req.query.id;

    const userList = await User.findById(id);
    if (userList) {
      res.render('updateUser', { user: userList });
    } else {
      res.redirect('getHome');
    }
  } catch (error) {
    console.log(error.message);
  }
}

// Update User Details
const updateUser = async (req, res) => {


  try {

    const userId = req.query.id
    const data = req.body

    const updateUsername = data.updateUsername.trim()

    if (!updateUsername) {
      return res.render('updateUser', { user: data, enterUsername: "Username cannot be just whitespaces." });
    }
    const hashedPassword = await bcrypt.hash(data.updatePass, 10)
    await User.updateOne({ _id: userId },
      {
        $set:
        {
          username: data.updateUsername,
          email: data.updateEmail,
          password: hashedPassword
        }
      })
      .then(x => console.log(x))
    res.redirect('getHome');
  } catch (error) {
    res.redirect('getHome')
    console.log("user update error", error);
  }
}

const deleteUser = async (req, res) => {
  try {
    const userId = req.query.id;
    console.log(userId);
    await User.deleteOne({ _id: userId });
    res.redirect('/admin/getHome');
  } catch (error) {
    res.redirect('getHome')
  }
}


module.exports = {
  adminLogin,
  adminHome,
  getAdminHome,
  adminLogout,
  newUser,
  getNewUser,
  userSearch,
  renderUpdate,
  updateUser,
  deleteUser
};
