import Product from "../models/productModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import apiFeatures from "../utils/apiFeatures.js";


//create product 
export const createProduct = catchAsyncErrors(async(req, res, next) =>{   
   req.body.user = req.user.id;
   const productData = req.body;
   const newproduct = new Product(productData);
  
    const product = await newproduct.save();
   res.status(201).json({
      success: true,
      product
   })
});
const resultPerPage  = 8;
//get all products
export const getAllProduct = catchAsyncErrors(async (req,res) =>{
   const productCount = await Product.countDocuments();;
   const ApiFeatures = new apiFeatures(Product.find(), req.query).search().filter().pagination(resultPerPage);
   const product = await ApiFeatures.query;
   res.status(201).json({
      success:true,
      product,
      productCount
     
   });
});
//admin route update product
export const updateProduct = catchAsyncErrors(async(req,res) =>{
   let product = Product.findById(req.params.id);
   if(!product){
      return next(new ErrorHandler("product not found",404));
   }

   product = await Product.findByIdAndUpdate(
      req.params.id,req.body,{
         new: true,
         runValidators:true,
         useFindAndModify: false

   });
   res.status(201).json({
      success: true,
      message: product
   })

 });
 
 export const deleteProduct = catchAsyncErrors(async(req,res) =>{
   let product = await Product.findById(req.params.id);
   if(!product){
      return next(new ErrorHandler("product not found",404));
   }

  await product.deleteOne({_id:req.params.id});
   res.status(201).json({
      success: true,
      message: "product deleted successfully"
   })
 });

 //get product details
 export const getProductDetails = catchAsyncErrors(async(req,res,next) =>{
      let product = await Product.findById(req.params.id);
      if(!product){
         return next(new ErrorHandler("product not found",404));
      }
      res.status(201).json({
         success: true,
         product
      });
 });

 //create new review or update the review
 export const createProductReview = catchAsyncErrors(async(req,res,next)=>{
  
   const {rating ,comment, productId} = req.body;
   const review =    {
      user:req.user.id,
      name:req.user.name,
      rating:Number(rating),
      comment,
   }
   const product = await Product.findById(productId);
   const isReviewed = product.reviews.find((rev)=>rev.user.toString() === req.user._id);
   if(isReviewed){
    product.reviews.forEach((rev)=>{
      if(rev.user.toString() === req.user._id.toString())
         (rev.rating =rating),
        ( rev.comment = comment);
    })
   }else{
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length
   }
   let avg = 0;
   product.reviews.forEach(rev=>{
      avg = avg+rev.rating
   });
   product.ratings=avg/product.reviews.length;
   await product.save({validateBeforeSave:false});
   res.status(200).json({
      success:true
   })
 });

 //get all reviews
export const getProductReviews = catchAsyncErrors(async(req,res,next) =>{
   
    const product = await Product.findById(req.query.id);
    if(!product){
      return next(new ErrorHandler("Product not found", 404));
    }
    res.status(200).json({
      success : true,
      review:product.reviews
    })
});

//delete review
export const deleteReview =  catchAsyncErrors(async(req,res,next)=>{
  const  product = await Product.findById(req.query.productId);
  if(!product){
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews  = product.reviews.filter(
  ( rev) => rev._id.toString() !== req.query.id.toString()
  );
 
  let avg = 0;

  reviews.forEach((rev)=> {
   avg += rev.rating;
  });

  const rating = avg / reviews.length;
  const numberOfReviews = reviews.length;
  await Product.findByIdAndUpdate(
   req.query.productId,
   {
   reviews,
   rating,
   numberOfReviews,
  },{
   new:true,
   runValidators:true,
   useFindAndModify: false
  });
  res.status(200).json({
     success: true,
  })
});