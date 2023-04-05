import jwt from 'jsonwebtoken';
import "dotenv/config";

const validateToken = (req, res, next) => {
  const token = req.headers.token;
  console.log(token);
  if (!token) {
    return res.status(403).json({ success: false, message: "Token not provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded.id);
    req.userId = decoded.id; // Set the userId property on the req object
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: "Invalid token" });
  }
};

export { validateToken };
