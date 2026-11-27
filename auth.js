const jwt = require("jsonwebtoken");

function auth(req, res, next) {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "No token provided"
        });
    }

    const token = header.split(" ")[1];

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}

module.exports = auth;