const AuthModel = require("../Models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;
const secret = process.env.secretKey;
const transporter = require("../Utils/sendEmail");
const FRONTEND_URL = process.env.FRONTEND_URL;

async function createUser(req, res) {
  try {
    const existingEmail = await AuthModel.findOne({
      email: req.body.email,
    });

    if (existingEmail) {
      return res
        .status(400)
        .send({ success: false, message: "EmailId already exists" });
    }
    else {
      if (req.body.password) {
        bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
          if (hash) {
            let User = new AuthModel({ ...req.body, password: hash });
            User.save();
            return res
              .status(201)
              .send({ success: true, message: "User created sucessfully!" });
          } else {
            return res.status(500).json({
              success: false,
              message: "Something went wrong",
            });
          }
        });
      }
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      error: error.message,
    });
  }
}

function signInUser(req, res) {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is missing",
    });
  }
  if (!password) {
    return res.status(400).json({
      success: false,
      message: "Password is missing",
    });
  }

  AuthModel.findOne({ email: email })
    .then((response) => {
      if (response && response._id) {
        bcrypt.compare(password, response.password).then(function (result) {
          //if result is true then both the pass are crt
          if (result) {
            const token = jwt.sign({ role: ["User"] }, secret, {
              expiresIn: 60 * 5, //session time
            });
            return res.status(200).json({
              success: true,
              message: "Sign In successful",
              token: token,
              user:response
            });
          } else {
            return res.status(400).json({
              //having a emailId checking whether entered pass is crt user using the db.pass
              success: false,
              message: "Email Id or Password is invalid!",
            });
          }
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Account does not exists!",
        });
      }
    })
    .catch((error) => {
      return res.status(500).json({
        success: false,
        message: error,
      });
    });
}

async function googleAuth(userData) {
  const { googleId, email, displayName, accessToken, refreshToken } = userData;

    if (!googleId || !email) {
      return res.status(400).json({
        success: false,
        message: "Google ID and email are required",
      });
    }

    // Check if user already exists in the database
    const existingUser = await AuthModel.findOne({ googleId });

    if (existingUser) {
      // User exists, update tokens if necessary
      existingUser.accessToken = accessToken;
      existingUser.refreshToken = refreshToken;
      await existingUser.save();

      const token = jwt.sign({ id: existingUser._id, role: ["User"] }, secret, {
        expiresIn: 60 * 5,
      });

      return {
        success: true,
        message: "Login successful",
        token: token,
        user: existingUser,
      };
    } else {
      // User does not exist, create a new user
      const newUser = new AuthModel({
        googleId,
        email,
        Name: displayName,
        accessToken,
        refreshToken,
      });

      await newUser.save();

      const token = jwt.sign({ id: newUser._id, role: ["User"] }, secret, {
        expiresIn: 60*5,
      });

      return {
      success: true,
      message: "Account created successfully",
      token: token,
      user: newUser,
    };
    }
}

const currentUser = async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, secret);
    const user = await AuthModel.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, user,token ,message:"sign In successful"});
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to authenticate token' });
  }
}

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is missing",
    });
  }
  try {
    const user = await AuthModel.findOne({ email: email });

    if (user && user._id) {
      const token = jwt.sign({ id: user._id }, secret, {
        expiresIn: 3 * 60, //session time
      });
      const setusertoken = await AuthModel.findByIdAndUpdate(
        { _id: user._id },
        { verifytoken: token },
        { new: true }
      );
      if (setusertoken) {
        const options = {
          from: {
            name: "Web Admin",
            address: process.env.EMAIL_USER,
          },
          to: email,
          subject: "Reset Password - Reg",
          html: `<h3>Hello! Here is your New password Link</h3>
                <h5>The Link is valid only for the next 3 minutes</h5>
              <a href="${FRONTEND_URL}/resetPassword/${user._id}/${token}">Click here</a>`,
        };

        // Send Email
        transporter.sendMail(options, function (err, info) {
          if (err) {
            return res.status(400).json({
              success: false,
              message: "Error occured!Try after sometime",
            });
          } else {
            return res
              .status(200)
              .json({ success: true, message: "Email Sent successfully" });
          }
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Account does not exists!",
      });
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      error: error.message,
    });
  }
};


const sendMail = async (req, res) => {  //message sent from portfolio
  const data = req.body;
  try {
  
      if (data) {
        const options = {
          from: {
            name: "Portfolio Manager",
            address: process.env.EMAIL_USER,
          },
          to: process.env.myemail,
          subject: "Message from Postfolio",
          html: `<h3>Name: ${data.name}</h3>
                <h3>EMail: ${data.email}</h3>
                <h5>${data.subject}</h5>`,
        };

        // Send Email
        transporter.sendMail(options, function (err, info) {
          if (err) {
            return res.status(400).json({
              success: false,
              message: "Error occured!Try after sometime",
            });
          } else {
            return res
              .status(200)
              .json({ success: true, message: "Email Sent successfully" });
          }
        });
      }
    } catch (error) {
    return res.status(500).send({
      success: false,
      error: error.message,
    });
  }
};


const updatePass = async (req, res) => {
  const {password} = req.body;

  const { id, token } = req.params;

  if( !id && !token ){
    res
    .status(401)
    .json({ success: false, message: "Unauthorized Access!" });
  }

 
  try {
    const validuser = await AuthModel.findOne({ _id: id});

    const verifyToken = jwt.verify(token, secret);
    if (validuser._id == verifyToken.id) {

      const newpassword = await bcrypt.hash(password, saltRounds);
      const newuser = await AuthModel.findByIdAndUpdate(
        { _id: id },
        { password: newpassword }
      );

      newuser.save();
      res
        .status(201)
        .json({ success: true, message: "Password updated successfully" });
    } else {
      res
        .status(401)
        .json({ success: false, message: "User does not exists!" });
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      error: error.message,
    });
  }
};

module.exports = { createUser, signInUser,googleAuth,currentUser, forgotPassword, updatePass,sendMail};
