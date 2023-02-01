const jwt = require("jsonwebtoken");

const checkAuth = (req, res, next) => {
  const jwtAccess = req.cookies.jwt_access;
  if (!jwtAccess) {
    return res.status(401).json({ message: "Unauthorized" }).redirect("/login");
  }

  try {
    const decoded = jwt.verify(jwtAccess, process.env.SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token is invalid" });
  }
};

module.exports = checkAuth;
