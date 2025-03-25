import jwt from "jsonwebtoken";

// Admin Authentication Middleware

const authAdmin = async (req, res, next) => {

try{

    const {atoken} = req.headers;
    if(!atoken){
        return res.json({success: false, message: "Access Denied, Token Missing"});
    }
    const token_decode = jwt.verify(atoken, process.env.JWT_SECRET);

    if(token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD){
        return res.json({success: false, message: "Access Denied, Invalid Token"});
    }

    next();

}
catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }

}

export default authAdmin;