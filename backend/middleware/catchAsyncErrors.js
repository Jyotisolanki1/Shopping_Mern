

export default (TheFun) => (req,res,next)=>{
 Promise.resolve(TheFun(req,res,next)).catch(next);
}