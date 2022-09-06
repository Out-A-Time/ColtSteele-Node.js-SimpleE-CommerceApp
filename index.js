const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const usersRepo = require("./repositories/users");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    keys: [";laksjdfa;lkdfjs.lkdjffffw"],
  })
);

app.get("/signup", (req, res) => {
  res.send(`
  <div>
  Your ID is: ${req.session.userId}
    <form method="POST" action="">
        <input name="email" type="text" placeholder="email" />
        <input name="password" type="text" placeholder="password" />
        <input name="passwordConfirmation" type="text" placeholder="password confirmation" />
        <button>Sign Up Mothafucka</button>
    </form>
  </div>
  `);
});

//Middleware that shows what is happening behind the curtain

// const bodyParser = (req, res, next) => {
//   if (req.method === "POST") {
//     req.on("data", (data) => {
//       const parsed = data.toString("utf8").split("&");
//       const formData = {};
//       for (let pair of parsed) {
//         const [key, value] = pair.split("=");
//         formData[key] = value;
//       }
//       req.body = formData;
//       next();
//     });
//   } else {
//     next();
//   }
// };

app.post("/signup", async (req, res) => {
  const { email, password, passwordConfirmation } = req.body;

  const existingUser = await usersRepo.getOneBy({ email: email });
  if (existingUser) {
    return res.send("Email already exists!");
  }
  if (password !== passwordConfirmation) {
    return res.send("Passwords must match");
  }

  console.log(req.body);

  //Create a user in our user repo to represent this person
  const user = await usersRepo.create({ email: email, password: password });

  //Store the id of that user inside the users cookie
  req.session.userId = user.id; //Added by cookie session!

  res.send("Account Created");
});

console.log("!!!!!!");

app.get("/signout", (req, res) => {
  req.session = null;
  res.send("You are logged out");
});

app.get("/signin", (req, res) => {
  res.send(`
  <div>
    <form method="POST" action="">
        <input name="email" type="text" placeholder="email" />
        <input name="password" type="text" placeholder="password" />
    
        <button>Sign In Mothafucka</button>
    </form>
  </div>
  `);
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  const user = await usersRepo.getOneBy({ email: email });
  if (!user) {
    return res.send("Email not found");
  }

  const validPassword = await usersRepo.comparePasswords(
    user.password,
    password
  );
  if (!validPassword) {
    return res.send("Invalid Password");
  }

  req.session.userId = user.id;

  res.send("You are signed in!");
});

app.listen(3000, () => {
  console.log("Listening on port");
});
