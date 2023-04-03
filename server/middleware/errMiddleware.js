const notfound=(req,res,next)=>{
const error=new Error(`Not-Found-${req.originalUrl}`);
res.status(404);
next();
}

const errHandler=(err,req,res,next)=>{
    const status_code= res.status_code===200?500:res.status_code;
    res.status(status_code);
    res.json({
        message:err.message,
        stack:process.env.NODE_ENV==='production'?null:err.stack,
    })
}
export {notfound,errHandler};