const createError = require("http-errors");
const jwt = require("jsonwebtoken");



// const checkLogin = (req, res, next) => {
//     try {
//         const cookies = req.signedCookies;
//         if (cookies && cookies[process.env.COOKIE_NAME]) {
//             const token = cookies[process.env.COOKIE_NAME];
//             // console.log('token', token);
            
//             const decoded = jwt.verify(token, process.env.JWT_SECRET);
//             req.user = decoded; // Attach user info to the request object
//             return next(); // Pass control to the next middleware
//         }
//         // No valid cookie found
//         res.status(401).json({ message: "Authentication required" });
//     } catch (error) {
//         res.status(403).json({ message: "User authentication failed!" });
//     }
// };

const checkLogin = (req, res, next) => {
    try {
        const cookies = req.signedCookies;
        const token = cookies?.[process.env.COOKIE_NAME];

        if (!token) {
            return res.status(401).json({ authenticated: false, message: "Authentication required" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('checkLogin error:', error.message);
        return res.status(403).json({ authenticated: false, message: "User authentication failed!" });
    }
};


module.exports = checkLogin;