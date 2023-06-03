import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true,"please enter product name"],
        trim: true
    },
    description:{
        type: String,
        required:[true,"please enter product description"]
    },
    price:{
        type: Number,
        required:[true,"please enter product price"],
        maxLength: [8,"price can not exceed 8 char"]
    },
    ratings:{
        type:Number,
        default:0
    },
    images:[
        {
        public_id:{
        type : String,
        required:true
        },
        url:{
            type:String,
            required: true
        }
    }
    ],
    category:{
     type :String,
     required: [true,"please enter product category"]
    },
    stock:{
        type:Number,
        required: [true, "pleaseenter product stock"],
        maxLength:[4, "not excced for 4 character"],
        default: 1
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.ObjectId,
                ref:"User",
                required:true
            },
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type:String,
                required: true
            }
        }
    ],

    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    createAt:{
        type: Date,
        default:Date.now
    }
});
const Product = mongoose.model('Product',productSchema)
export default Product;