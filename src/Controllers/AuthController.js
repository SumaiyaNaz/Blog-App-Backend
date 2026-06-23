import Users from "../Models/UserSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

//Add user in database
const addUser = async (req, res) => {
  //console.log(req.body);
  const { name, email, password, role } = req.body;
  try {
    //making hash password
    //10 is saltround
    const hashPass = await bcrypt.hash(req.body.password, 10);
    console.log("hashpass --->", hashPass);

    const data1 = { name, email, password: hashPass, role: role };
    console.log(role);

    //new means we are creating constructor
    const user = new Users(data1);
    //save function will save data in db
    const data = await user.save();
    console.log(data);
    res.json({
      status: true,
      message: "User created successfully",
      user: data,
    });
  } catch (error) {
    console.log("Error in creating user --->", error);
    res.json({
      status: false,
      message: error.message,
    });
  }
};

//Fetch all users from database
const allUsers = async (req, res) => {
  try {
    const user = await Users.find(); //for all data and for specific data ({name : 'sana'})
    res.json({
      status: true,
      message: "Users fetched successfully",
      data: user,
    });
  } catch (error) {
    console.log("Error in fetching users --->", error);
    res.json({
      status: false,
      message: error.message,
    });
  }
};

//Fetch single user from database
const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Users.findById(id); //for data finding using id
    if (user == null) {
      return res.json({
        status: false,
        message: "Cannot find user",
      });
    }
    res.json({
      status: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    console.log("Error in fetching user --->", error);
    res.json({
      status: false,
      message: error.message,
    });
  }
};

//Update user
//token vefication ka kam yaha bhi ho sakta hy or middleware mein bhi
const updateUser = async (req, res) => {
  console.log("yahan ta agy");

  try {
    const { id } = req.params;

    const user = await Users.findByIdAndUpdate(id, req.body, { new: true }); //for data finding using id //{new :true} means show new data in console
    console.log("Data after updating --->", user);
    if (user == null) {
      return res.json({
        status: true,
        message: "user ot found",
      });
    }

    return res.json({
      status: true,
      message: "updatd uccsfully",
      udatedUser: user,
    });
   
  } catch (error) {
    return res.json({
      status: false,
      message: error.message,
    });
  }
};

//Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await Users.findByIdAndDelete(id);

    res.json({
      status: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.log("Error in deleting user --->", error);
    res.json({
      status: false,
      message: error.message,
    });
  }
};

//Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({
        status: false,
        message: "All fields are required",
      });
    }

    const user = await Users.findOne({ email: email }); //{email : email} first email is property name in database and second emmail is the email given by user means data base mein jo email hy usy user ny jo email abhi di hy us sy match karo
    console.log("User email", user);

    if (user == null) {
      return res.json({
        status: false,
        message: "Cannot find user",
      });
    }

    //user.password != password first password is the password saved in database and second is given by user
    // if (user.password != password) {
    //   return res.json({
    //     status: false,
    //     message: "Invalid credentials",
    //   });
    // }

    //first is database hash password and second is user plain password , bcrrypt convert plain pasword into encrypted form and than compare it to hash password , means plain password kabhi bhi show nahi karta
    const decoded = await bcrypt.compare(password, user.password);

    console.log("Data of user --->", req.body);
    console.log("Decoded --->", decoded);

    if (decoded) {
      //Assigning a token
      const token = jwt.sign(
        { email: user.email, id: user._id },
        //secret key
        process.env.TOKEN_KEY,
        function (err, token) {
          console.log(token);

          res.cookie("token", token, {
            httpOnly: true,
            secure: true,
          });
          console.log("line after cookies");
          res.json({
            status: true,
            message: "User log in successfully",
            //first token is proprty name and second is varaible name which will store token
            token: token,
            //it will expire token in one hour means you have to again login to generate token
            //expires_in: 3600
          });
        },
      );
    } else {
      res.json({
        status: false,
        message: "invalid credentials",
      });
    }
  } catch (error) {
    console.log("Error in login user --->", error);
    res.json({
      status: false,
      message: error.message,
    });
  }
};

//Logout user
const logout = async (req, res) => {
  try {
    //Clear / delete cookies from frontend
    res.clearCookie("token");
    res.json({
      status: true,
      message: "User log out successfully",
    });
  } catch (error) {
    res.status(404).json({
      status: false,
      message: error.message,
    });
  }
};

export {
  addUser,
  allUsers,
  getUser,
  updateUser,
  deleteUser,
  loginUser,
  logout,
};
