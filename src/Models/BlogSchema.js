import mongoose from "mongoose";

//we define type of data , validate data

//new means we are making cntructor
const BlogSchema = new mongoose.Schema(
  {
    //prorperty is title and in {} we write requirements
    title: {
      type: String,
      required: true,
      minLength: [4, "Minimum 4 required"],
      //Minimum 4 required is error message
    },
    //prorperty is content and in {} we write requirements
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    //use to link / refernce oe table to another
    //its a method of moongose and then define schema and we use type and then objectID as we have this store in database means id is store as objectID
    author: {
      type: mongoose.Schema.Types.ObjectId,
      //means is schema table ko user ka reference sy link karo taky user ki id match kar sakein us ky blog dekhany ky liy
      //ref is reference means kis table/collection sy data match karna hy
      ref: "user",
    },
    public_id: {
      type: String,
    },
  },
  {
    timestamps: true,
    //show created time , updated time of data
  },
);

//make a folder in mongodb compass and check this schema requirements
//folder name will be user but in compass it name this as users becausecompass always store in plural form
//UserSchema is schema name
const Blog = mongoose.model("blog", BlogSchema);

export default Blog;

//mongoose.Schema.Types.ObjectId is a built-in Mongoose configuration type used exclusively within a schema definition to declare that a path must hold a MongoDB 12-byte binary ObjectId. It is most frequently deployed alongside the ref option to establish relationships (references) between documents across different collections, behaving similarly to a foreign key in relational databases
