const { users } = require("../../models");
const resourceNotFound = "Resource Not Found";
const responseSuccess = "Success";

exports.getUsers = async (req, res) => {
    try {
        const user = await users.findAll({
            attributes:{
                exclude: ["createdAt", "updatedAt"],
            }
        });
        if(!user){
            return res.status(400).send({
                status: resourceNotFound,
                data: {
                    user: [],
                }
            });
        }

        res.send({
            status : responseSuccess,
            data: {
                user,
            },
        });

    } catch (err){
        console.log(err);
        return res.status(500).send({
            error : {
                message: "Server Error",
            },
        });
    }  
};

exports.deleteUser = async (req,res) => {
    try {
        const {id} = req.params;
        const getUserById = await users.findOne({
            where : {
                id,
            },
        });

        if(!getUserById) {
            return res.status(400).send({
                status : `User with id: ${id} not found`,
                data: {
                    user: null,
                },
            });
        }

        await users.destroy({
            where : {
                id,
            },
        });

        res.send({
            status: responseSuccess,
            message: `User id ${id} Successfully Deleted`,
            data : {
                id : id,
            }
        });
    } catch (err){
        console.log(err);
        return res.status(500).send({
            error: {
              message: "Server Error",
            },
        });
    }
};

//soft deleted
exports.restoreUser = async (req,res) => {
    try {
        const {id} = req.params;

        const user = await users.restore({
            where : {
                id,
            },
        });

        res.send({
            status: responseSuccess,
            message: `User id ${id} Successfully restored`,
            data : {
                user,
            },
        });

    } catch (err){
        console.log(err);
        return res.status(500).send({
            error: {
              message: "Server Error",
            },
        });
    }
};
