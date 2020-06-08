module.exports = (req, res, next) => {
    // if passport could not find the user that was referenced inside the request
    if (!req.user){
        return res.status(401).send({error: 'You must login!'})
    }

    next();
};