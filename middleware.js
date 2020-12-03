const jwt = require("jsonwebtoken");

exports.authenticated = (req, res, next) => {
   let header, token;
   if(
       !(header = req.header("Authorization")) || !(token = header.replace("Bearer ", ""))
   )

   return res.status(401).send({ message : "Access Denied !"});
   try {
       const verified = jwt.verify(token, "our-secret-key");
       req.user = verified;
       next();
   } catch (error) {
       res.status(400).send({ message: "Invalid token" });
   }
};