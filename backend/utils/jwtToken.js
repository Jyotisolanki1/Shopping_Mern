//creating token and saving in cookie
const sendToken = (user,statusCode,res) => {
  const token = user.getJWTToken();
  //options for cookies
  const options = {
    expires: new Date(
        Date.now() + 2*24*60*60*1000
    ),
    httpOnly:true
  };
  // let COOKIE_EXPIRE
  res.status(statusCode).cookie('token',token,options).json({
    success: true,
    user,
    token
  })
}
export default sendToken;