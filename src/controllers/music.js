const Joi = require("joi");
const fs = require('fs');
const { musics: Musics, artist} = require("../../models");
const resourceNotFound = "Resource Not Found";
const responseSuccess = "Success";

exports.getMusics = async (req,res) => {
    try {
        const musics = await Musics.findAll({
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
            include: {
                model: artist,
                as: "artists",
                attributes: {
                    exclude: ["createdAt", "updatedAt","deletedAt"],
                },
            },
        });

        if(!musics){
            return res.status(400).send({
                status: resourceNotFound,
                data: {
                    musics: [],
                }
            });
        }

        res.send({
            status: responseSuccess,
            message: "Musics successfully get",
            data : {
                musics
            },
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: {
                message: "Server Musics Error",
            },
        });
    }
};

//Get Detail Music
exports.getDetailMusic = async (req,res) => {
    try {
        const {id} = req.params;
        const music = await Musics.findOne({
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
            where: {
                id,
            },
            include: {
                model: artist,
                as: "artists",
                attributes: {
                    exclude: ["createdAt", "updatedAt","deletedAt","password"],
                },
            },
        });

        if(!music){
            return res.status(400).send({
                status : resourceNotFound,
                message : `Music with id: ${id} not found`,
                data: {
                    music: null,
                }
            });
        }

        res.send({
            status: responseSuccess,
            message: "Music successfully get",
            data : {
                music
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
//Add Music
exports.addMusic = async (req, res) => {
    try {
      const { body, files } = req;
      const thumbnailName = files.thumbnail[0].filename;
      const musicFileName  = files.attachment[0].filename;

      console.log(thumbnailName,musicFileName);
      const schema = Joi.object({
          title : Joi.string().required(),
          year : Joi.number().min(4).required(),
          artistId : Joi.number().min(1).required(),
      });

      const {error} = schema.validate(body, {
          abortEarly: false,
      });

      if (error) {
        const thumbnailDelete = `uploads/${thumbnailName}`;
        const musicDelete = `uploads/${musicFileName}`;
        console.log(thumbnailDelete, musicDelete);

        fs.unlinkSync(thumbnailDelete, function(err) {
            if(err) return console.error(err);
            console.log("File Thumbnail Success Deleted");
        });
        fs.unlinkSync(musicDelete, function(err) {
            if(err) return console.error(err);
            console.log("File Music Success Deleted");
        });
          return res.status(400).send({
              status : "Validation Error",
              error: {
                  message: error.details.map((error) => error.message),
              },
          });
      }

      try {
          console.log(req.body);
        const music = await Musics.create({ 
            ...body,
            thumbnail: thumbnailName,
            attachment: musicFileName,
          },{ attributes : ['title','year','artistId','thumbnail','attachment']});
          if(music){
                res.send({
                    status: responseSuccess,
                    message: "Music successfully added",
                    data: {
                        music,
                    },
                });
            } 
      } catch (error) {
            const thumbnailDelete = `uploads/${thumbnailName}`;
            const musicDelete = `uploads/${musicFileName}`;
            fs.unlinkSync(thumbnailDelete, function(err) {
                if(err) return console.error(err);
                console.log("File Thumbnail Success Deleted");
            });
            fs.unlinkSync(musicDelete, function(err) {
                if(err) return console.error(err);
                console.log("File Music Success Deleted");
            });
            return res.status(500).send({
                error: {
                message: "Sorry, Artist ID Not Found",
                },
            });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        error: {
          message: "Server Error",
        },
      });
    }
};

//Update Music
exports.updateMusic = async (req,res) => {
    try {
        const {id} = req.params;
        const {body} = req;

        const checkMusicById = await Musics.findOne({
            where : {
                id,
            },
        });

        if(!checkMusicById) {
            return res.status(400).send({
                status : resourceNotFound,
                message : `Music with id: ${id} not found`,
                data: {
                    music: null,
                },
            });
        }

        const music = await Musics.update( body, {
            where: {
                id,
            },
        });

        const getMusicAfterUpdate = await Musics.findOne({
            attributes : {
                exclude: ["createdAt", "updatedAt"]
            },
            where : {
                id,
            },
        });

        res.send({
            status: responseSuccess,
            message: "Music Successfully update",
            data : {
                music: getMusicAfterUpdate,
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
exports.deleteMusic = async (req,res) => {
    try {
        const {id} = req.params;
        const checkMusicById = await Musics.findOne({
            where : {
                id,
            },
        });

        if(!checkMusicById) {
            return res.status(400).send({
                status: resourceNotFound,
                message : `Music with id: ${id} not found`,
                data: {
                    checkMusicById: null,
                },
            });
        }
        const getThumbnail = checkMusicById.thumbnail;
        const getMusicFile = checkMusicById.attachment;
        const thumbnailDelete = `uploads/${getThumbnail}`;
        const musicDelete = `uploads/${getMusicFile}`;
        
        fs.unlinkSync(thumbnailDelete, function(err) {
            if(err) return console.error(err);
            console.log("Thumbnail Success Deleted");
        });
        fs.unlinkSync(musicDelete, function(err) {
            if(err) return console.error(err);
            console.log("File Music Success Deleted");
        });

        await Musics.destroy({
            where : {
                id,
            },
        });

        res.send({
            status: responseSuccess,
            message: `Music id ${id} Successfully Deleted`,
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