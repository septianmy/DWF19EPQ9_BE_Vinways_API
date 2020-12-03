const isLoggedIn = false;

exports.authenticated = (req, res, next) => {
    if(isLoggedIn)
        next()
    else {
        res.send({
            message: "You are Unauthenticated !"
        })
    }
};