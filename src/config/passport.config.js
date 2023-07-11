import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import userManager from "../dao/dbmanagers/user.manager.js";
import { encryptPassword, comparePassword } from "../utils/encrypt.util.js";

const LocalStrategy = local.Strategy;
const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age, img } = req.body;
        try {
          let user = await userManager.getByEmail(username);
          if (user || username === "adminCoder@coder.com") {
            console.log("El usuario ya existe");
            return done(null, false);
          }
          const encryptedPass = await encryptPassword(password);
          const newUser = await userManager.createUser({
            first_name,
            last_name,
            email,
            age,
            password: encryptedPass,
            img,
          });

          return done(null, newUser);
        } catch (err) {
          return done(`Error al registrar el usuario: ${err}`, false);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          if (username === "adminCoder@coder.com") {
            return done(null, false);
          } else {
            const user = await userManager.getByEmail(username);
            if (!user) {
              console.log("El usuario no existe. Regístrese");
              return done(null, false);
            }
            if (!comparePassword(user, password)) {
              console.log("La contraseña no es correcta. Intente nuevamente");
              return done(null, false);
            }
            return done(null, user);
          }
        } catch (err) {
          console.log(`Error de servidor para el login: ${err}`);
        }
      }
    )
  );


  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv1.Iv1.88269743af4ad213",
        clientSecret: "ef6b7ec7ad67319906dadcae6ea5a7da458bad4b",
        callbackURL: "http://localhost:8080/api/users/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await userManager.getByEmail(profile._json.email);
          if (!user) {
            let newUser = {
              first_name: profile._json.name,
              last_name: "",
              email: profile._json.email,
              password: "",
              age: undefined,
              img: profile._json.avatar_url,
            };
            user = await userManager.createUser(newUser);
            done(null, user);
          } else {
            done(null, user);
          }
        } catch (err) {
          done(err, false);
        }
      }
    )
  );


  
  const jwtStrategy = jwt.Strategy;
  const jwtExtract = jwt.ExtractJwt;
  
  const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies.token;
    }
    return token;
  };

  passport.use(
    "current",
    new jwtStrategy(
      {
        jwtFromRequest: jwtExtract.fromExtractors([cookieExtractor]),
        secretOrKey: "coderSecret",
      },
      (payload, done) => {
        done(null, payload);
      }
    ),
    async (jwt_payload, done) => {
      try {
        return done(null, jwt_payload);
      } catch (err) {
        return done(err);
      }
    }
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await userManager.getById(id);
    done(null, user);
  });
};

export default initializePassport;