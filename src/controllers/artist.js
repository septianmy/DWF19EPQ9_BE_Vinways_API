const Joi = require("joi");
const { artist: Artists } = require("../../models");
const resourceNotFound = "Resource Not Found";
const responseSuccess = "Success";

exports.getArtists = async (req, res) => {
    try {
        const artists = await Artists.findAll({
            attributes:{
                exclude: ["createdAt", "updatedAt"],
            }
        });
        if(!artists){
            return res.status(400).send({
                status: resourceNotFound,
                data: {
                    artisData: [],
                }
            });
        }

        res.send({
            status : responseSuccess,
            data: {
                artists,
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

exports.getDetailArtist = async (req,res) => {
    try {

        const {id} = req.params;
        const artist = await Artists.findOne({
            where: {
                id,
            },
        });

        if(!artist){
            return res.status(400).send({
                status : resourceNotFound,
                message : `Artist with id: ${id} not found`,
                data: {
                    artist: null,
                }
            });
        }

        res.send({
            status : responseSuccess,
            message : "Data Successfully get",
            data : {
                artist,
            }
        })

    } catch (err){
        console.log(err);
        return res.status(500).send({
            error : {
                message: "Server Error",
            },
        });
    }
};

exports.addArtist = async (req, res) => {
    try {
      const { body, file } = req;
      const thumbnailName = file.filename;
      console.log(thumbnailName);

      const schema = Joi.object({
          name : Joi.string().min(2).required(),
          old : Joi.number().min(2),
          category: Joi.string().min(2),
          startCareer:Joi.string().min(2),
      });

      //destruct error result dari validation 
      const {error} = schema.validate(body, {
          abortEarly: false,
      });

      //jika ada error stop disini dan kirim response error
      if (error) {
          return res.status(400).send({
              status : "Validation Error",
              error: {
                  message: error.details.map((error) => error.message),
              },
          });
      }
  
      //method create menerima 1 parameter yaitu data yang mau diinsert
      const artist = await Artists.create({ 
            ...body, 
            thumbnail: thumbnailName
        });
  
      //send jika oke
      res.send({
        status: responseSuccess,
        message: "Artist successfully created",
        data: {
            artist : {
                id : artist.id,
                name : artist.name,
                old : artist.old,
                category : artist.category,
                startCareer : artist.startCareer,
                thumbnail: artist.thumbnail
            }
        },
      });
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

//Update Artist
exports.updateArtist = async (req,res) => {
    try {
        const {id} = req.params;
        const {body} = req;

        const checkArtistById = await Artists.findOne({
            where : {
                id,
            },
        });

        if(!checkArtistById) {
            return res.status(400).send({
                status : resourceNotFound,
                message : `Artist with id: ${id} not found`,
                data: {
                    post: null,
                },
            });
        }

        const artist = await Artists.update( body, {
            where: {
                id,
            },
        });

        const getArtistAfterUpdate = await Artists.findOne({
            attributes : {
                exclude: ["createdAt", "updatedAt", "deletedAt"]
            },
            where : {
                id,
            },
        });

        res.send({
            status: responseSuccess,
            message: "Artist Successfully update",
            data : {
                artist: getArtistAfterUpdate,
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

exports.deleteArtist = async (req,res) => {
    try {
        const {id} = req.params;
        const checkArtistById = await Artists.findOne({
            where : {
                id,
            },
        });

        if(!checkArtistById) {
            return res.status(400).send({
                status: resourceNotFound,
                message : `Artist with id: ${id} not found`,
                data: {
                    artist: null,
                },
            });
        }

        await Artists.destroy({
            where : {
                id,
            },
        });

        res.send({
            status: responseSuccess,
            message: `Artist id ${id} Successfully Deleted`,
            data : {
                id : checkArtistById.id
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

exports.restoreArtist = async (req,res) => {
    try {
        const {id} = req.params;

        const artist = await Artists.restore({
            where : {
                id,
            },
        });

        res.send({
            status: responseSuccess,
            message: `Artist id ${id} Successfully restored`,
            data : {
                artist,
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