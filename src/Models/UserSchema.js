import mongoose from "mongoose";

//we define type of data , validate data

//new means we are making cntructor
const UserSchema = new mongoose.Schema(
  {
    //prorperty is name and in {} we write requirements
    name: {
      type: String,
      required: true,
      minLength: [4, "Minimum 4 required"],
      //Minimum 4 required is error message
    },
    //prorperty is email and in {} we write requirements
    email: {
      type: String,
      unique: true,
      required: true,
    },
    //prorperty is password and in {} we write requirements
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      // maxlength: [50, "Password is too long"],
      // validate: {
      //   //v is value o password
      //   validator: function (v) {
      //     // At least one uppercase, one lowercase, one number, one special character
      //     return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      //       v,
      //     );
      //     //Explanation in last lines of this file
      //   },
      //   message:
      //     "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      // },
    },
    role:{
      type : String,
      //enum is method of mongoose , that used in typescript also , it means that character wise , length wise ksi value ko fixed kar do yani user hy to yahi likho agar User U capital bhi kia to nahi chaly ga
      enum : ['user','admin'],
      default:'user' //agar koi role na dy to by default role user save hoga
    }
  },
  {
    timestamps: true,
    //show created time , updated time of data
  },
);

//make a folder in mongodb compass and check this schema requirements
//folder name will be user but in compass it name this as users becausecompass always store in plural form
//UserSchema is schema name
const Users = mongoose.model("user", UserSchema);

export default Users;

// Part 1: ^ - Start of string (password yahan se shuru hota hai)

// Part 2: (?=.*[a-z])
// Iska matlab: Kahi na kahi ek chhota letter hona chahiye (a se z)
// .* ka matlab: kuch bhi ho sakta hai uske aage/piche

// Part 3: (?=.*[A-Z])
// Iska matlab: Kahi na kahi ek bada letter hona chahiye (A se Z)

// Part 4: (?=.*\d)
// Iska matlab: Kahi na kahi ek number hona chahiye (0-9)
// \d = digit (number)

// Part 5: (?=.*[@$!%*?&])
// Iska matlab: Kahi na kahi ek special character hona chahiye
// Allowed special chars: @ $ ! % * ? &

// Part 6: [A-Za-z\d@$!%*?&]{8,}
// [A-Za-z\d@$!%*?&] - Sirf ye characters allowed hain (koi space nahi)
// {8,} - Kam se kam 8 characters

// Part 7: $ - End of string