const {transactions : Transactions, users} = require('../../models');
const Joi = require('joi');
const fs = require('fs');
const resourceNotFound = "Resource Not Found";
const responseSuccess = "Success";

exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Transactions.findAll({
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
            include: {
                model: users,
                as: "user",
                attributes: {
                    exclude: ["createdAt", "updatedAt","deletedAt"],
                },
            },
        });

        if(!transactions){
            return res.status(400).send({
                status: resourceNotFound,
                data: {
                    transactions: [],
                }
            });
        }

        res.send({
            status: responseSuccess,
            message: "Transactions successfully get",
            data : {
                transactions
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: {
                message: "Server Error",
            },
        });
    }
};

exports.getDetailTransactions = async (req,res) => {
    try {
        const {id} = req.params;
        const transaction = await Transactions.findOne({
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
            where: {
                id,
            },
            include: {
                model: users,
                as: "user",
                attributes: {
                    exclude: ["createdAt", "updatedAt","deletedAt","password"],
                },
            },
        });

        if(!transaction){
            return res.status(400).send({
                status : resourceNotFound,
                message : `Transaction with id: ${id} not found`,
                data: {
                    transaction: null,
                }
            });
        }

        res.send({
            status: responseSuccess,
            message: "Transaction successfully get",
            data : {
                transaction
            },
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: {
                message: "Server Error",
            },
        });
    }
};

//Add Incoming Transactions
exports.addTransaction = async (req, res) => {
    try {
      const { body, file } = req;
      const proofFileName = file.filename;
      const remainingActive = 0;
      const paymentStatus = "Pending";

      console.log(proofFileName);
      const schema = Joi.object({
          userId : Joi.number().required(),
      });

      const {error} = schema.validate(body, {
          abortEarly: false,
      });

      if (error) {
          return res.status(400).send({
              status : "Validation Error",
              error: {
                  message: error.details.map((error) => error.message),
              },
          });
      }

      try {
        const transaction = await Transactions.create({ 
            ...body,
            proofTransaction: proofFileName,
            remainingActive: remainingActive,
            paymentStatus: paymentStatus,
          });
          if(transaction){
                res.send({
                    status: responseSuccess,
                    message: "Transaction successfully created",
                    data: {
                        transaction,
                    },
                });
            } 
      } catch (error) {
            const dirDelete = `uploads/${proofFileName}`;
            console.log(dirDelete);
            fs.unlinkSync(dirDelete, function(err) {
                if(err) return console.error(err);
                console.log("File Success Deleted");
            });
        return res.status(500).send({
            error: {
              message: "Sorry, User ID Not Found",
            },
          });
      }  
    } catch (err) {
      //error here
      console.log(err);
      return res.status(500).send({
        error: {
          message: "Server Error",
        },
      });
    }
};
// Edit Incoming Transaction 
exports.updateTransaction = async (req,res) => {
    try {
        const {id} = req.params;
        const {body} = req;

        const checkTransactionById = await Transactions.findOne({
            where : {
                id,
            },
        });

        if(!checkTransactionById) {
            return res.status(400).send({
                status : resourceNotFound,
                message : `Transaction with id: ${id} not found`,
                data: {
                    Transaction : null,
                },
            });
        }

        const remainingActiveData = checkTransactionById.remainingActive;
        const remainingActiveUpdate = 30 + remainingActiveData;
        console.log(remainingActiveUpdate, body);
        const transaction = await Transactions.update({
            ...body,
            remainingActive : remainingActiveUpdate,
        },{where : { id,}});

        const getTransactionAfterUpdate = await Transactions.findOne({
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
            where : {
                id,
            },
            include: {
                model: users,
                as: "user",
                attributes: {
                    exclude: ["createdAt", "updatedAt","deletedAt","password"],
                },
            },
        });

        res.send({
            status: responseSuccess,
            message: "Transaction Successfully update",
            data : {
                transaction: getTransactionAfterUpdate,
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

//Delete Incoming Transaction
exports.deleteTransaction = async (req,res) => {
    try {
        const {id} = req.params;
        const checkTransactionById = await Transactions.findOne({
            where : {
                id,
            },
        });

        if(!checkTransactionById) {
            return res.status(400).send({
                status: resourceNotFound,
                message : `Transaction with id: ${id} not found`,
                data: {
                    checkTransactionById: null,
                },
            });
        }
        const getFile = checkTransactionById.proofTransaction;
        const dirDelete = `uploads/${getFile}`;
        console.log(dirDelete);
        
        fs.unlinkSync(dirDelete, function(err) {
            if(err) return console.error(err);
            console.log("File Success Deleted");
        });

        await Transactions.destroy({
            where : {
                id,
            },
        });

        res.send({
            status: responseSuccess,
            message: `Transaction id ${id} Successfully Deleted`,
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