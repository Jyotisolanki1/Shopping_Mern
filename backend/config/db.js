import mongoose from "mongoose";
const URL = 'mongodb://127.0.0.1:27017/Ecommerce';


const connectDatabase = () =>{
    mongoose.connect(URL,{useUnifiedTopology: true, useNewUrlParser:true}).then((data)=>{
        console.log(`mongodb connected to server ${data.connection.host}`);
    }).catch(()=>{
        console.log(err);
    });
}
export default connectDatabase;