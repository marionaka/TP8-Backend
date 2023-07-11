import jwt from "jsonwebtoken";
import passport from "passport";
const privateKey = "coderSecret";

const generateToken = (user) => {
  return jwt.sign(user, privateKey, { expiresIn: "50m" });
};

const authToken = (req, res, next) => {
  const auth = req.cookies.token;

  if (!auth) {
    return res.send({ message: "Falla de autorización: No se encuentra el token" });
  }

  jwt.verify(auth, privateKey, (err, credentials) => {
    if (err) {
      res.send({ message: "El token no es válido" });
    }
    req.user = credentials.user;
    next();
  });
};

const passportCall = async (req, res, next) => {
  passport.authenticate("current", { session: false }, (err, user, info) => {
    if (err) {
      next(err);
    }

    if (!user) {
      res.send({ message: info.messages ? info.messages : info.toString() });
    }

    req.user = user;
    next();
  })(req, res, next);
};

const authorization = (role) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.send({ error: "No autorizado" });
    }
    if (req.user.role != role) {
      return res.send({ error: "Sin permisos" });
    }
    next();
  };
};

export { generateToken, authToken, passportCall, authorization };
