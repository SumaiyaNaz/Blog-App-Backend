import jwt from "jsonwebtoken";
import Users from "../Models/UserSchema.js";

const adminMiddle = (req, res, next) => {
  //console.log('Admin request --->',req.body);
  console.log("user---", req.user);

  if (!req.user) {
    return res.json({
      status: false,
      message: "User not found login again",
    });
  }
    if(req.user.role == 'admin'){
      next();
    }
    else{
      return res.json({
      status: false,
      message: "Access denied",
    });
    }
  
};

const userMiddle = async (req, res, next) => {
  //console.log('User request --->',req.body);
  try {
    const { id } = req.params;
    //console.log(id);

    console.log('req.cookies--->',req.cookies.token)

    //check token from cookies or if not in cookies then check in authorization
    const token =
      req.headers?.authorization?.split(" ")[1] ||
      req.cookies.token
      //  ||
      // req.headers?.cookie?.match(/token=([^;]+)/)?.[1];
    //split means convert in array as in postman first one is bearer then space then token so on first inde there will be bearer and it split space and show index no 1 which is token
    //cookies string like data hy jo object mien data parse karta hy , its like a frontend database that fetch data from backend
    // console.log(token);

    if (!token) {
      return res.status(404).json({
        status: false,
        message: "Token not povided",
      });
    }

    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    console.log("decoded--->", decoded);

    //   //decoded id from token compare with login id means we have login id different and token id is differnet means both id are of diifferent person then it show error , thats why we want same id to check there is same one person
    //   if (decoded.id == id) {
    //     //agar id same ho to phir next agly controller ko chaly ga
    //     next();
    //   } else {
    //     return res.json({
    //       status: false,
    //       message: "Invalid token",
    //     });
    //   }
    //add - before property name that we dont want to include
    //- will not show the password
    const findUser = await Users.findById(decoded.id).select('-password');
    console.log("Find user --->", findUser);
    if (findUser) {
      //request mein user name ki property add karo or us ki value findUser save karo
      req.user = findUser;
      console.log('req.user---->',req.user);
      
      next();
    }
  } catch (error) {
    res.json({
      status: false,
      message: error.message,
    });
  }
};

export { adminMiddle, userMiddle };
