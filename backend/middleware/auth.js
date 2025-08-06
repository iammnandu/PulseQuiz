const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    const token = req.headers.token || req.headers.authorization;
    if (!token) {
        return res.status(403).json({ error: "Token missing" });
    }
    
    try {
        const user = jwt.verify(token, process.env.SECRET || "123random");
        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({ error: "Invalid token" });
    }
}

module.exports = auth;

