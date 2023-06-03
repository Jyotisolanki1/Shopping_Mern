import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import apiFeatures from "../utils/apiFeatures.js";

export const newOrder = catchAsyncErrors(async(req,res,next) =>{
 const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice
     } = req.body;
    
    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user :  req.user._id
    });

    res.status(201).json({
      success: true,
      order,
    });
});

//get single order
export const getSingleOrder = catchAsyncErrors(async(req,res,next)=>{
  const order = await Order.findById(req.params.id).populate("user","name email");
  if(!order){
    return next(new ErrorHandler("ordernot found with this id",404));
  }
  res.status(200).json({
    success:true,
    order
  });
});

//get logged in user orders
export const myOrders = catchAsyncErrors(async(req,res,next)=>{
  const orders = await Order.find({user:req.user._id})
  if(!orders){
    return next(new ErrorHandler("ordernot found with this id",404));
  }
  res.status(200).json({
    success:true,
    orders
  });
});

//get all orders --admin
export const getAllOrders = catchAsyncErrors(async(req,res,next)=>{
  const orders = await Order.find();
  if(!orders){
    return next(new ErrorHandler("order not found with this id",404));
  }
  let totalAmount = 0;
  orders.forEach((order)=>{
    totalAmount = order.totalPrice;
  })
  
  res.status(200).json({
    success:true,
    totalAmount,
    orders
  });
});

//update order status --admin
export const updateOrder = catchAsyncErrors(async(req,res,next)=>{
  const order = await Order.findById(req.params.id);
  if(!order){
    return next(new ErrorHandler("order not found",404));
 }
  if(order.orderStatus === "Delivered"){
    return next(new ErrorHandler("you have alrealy delivered this order",404));
  }
  order.orderItems.forEach(async(o)=>{
    await updateStock(o.product,o.quantity);
  });

  order.orderStatus = req.body.status;
  if(req.body.status === "Delivered"){
    order.deliveredAt = Date.now();
  }
  
  await order.save({validateBeforeSave: false});
  res.status(200).json({
    success:true,
    order
  });
});

async function updateStock(id, quantity){
  const product = await Product.findById(id);
  product.stock = product.stock - quantity;
  await product.save({validateBeforeSave: false})
}

//delete order--admin
export const deleteOrder = catchAsyncErrors(async(req,res,next)=>{
  let order = await Order.findById(req.params.id);
   if(!order){
      return next(new ErrorHandler("order not found",404));
   }

  await order.deleteOne({_id:req.params.id});
  res.status(200).json({
    success:true
  });
});