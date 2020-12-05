const jwt = require("jsonwebtoken");
const {users} = require('../../models');
const resourceNotFound = "Resource Not Found";

exports.auth = (req, res, next) => {
   let header, token;
   if(
       !(header = req.header("Authorization")) || !(token = header.replace("Bearer ", ""))
   )

   return res.status(401).send({ message : "Access Denied !"});
   try {
       const verified = jwt.verify(token, "vinways");

       req.user = verified;
       next();
   } catch (error) {
       res.status(400).send({ message: "Invalid token" });
   }
};

//Harus buat pengecekan UserID terlebih dahulu
exports.userCheck = async (req, res, next) => {
    try {
        const IdUser = 100;
        const checkUserById = await users.findOne({
            where: {
                id : IdUser,
            }
        });

        if(!checkUserById){
            return res.status(400).send({
                status : resourceNotFound,
                message : `User with id: ${IdUser} not found`,
                data: {
                    checkUserById: null,
                }
            });
        };
        next();
    } catch (error) {
        res.status(400).send({ message: "Invalid ID" });
    }
};