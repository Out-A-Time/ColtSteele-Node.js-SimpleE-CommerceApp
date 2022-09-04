const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send(`
  <div>
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

app.post("/", (req, res) => {
  console.log(req.body);
  res.send("Account Created");
});

console.log("!!!!!!");

app.listen(3000, () => {
  console.log("Listening on port");
});
