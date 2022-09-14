const layout = require("../layout");
const { getError } = require("../../helpers");

module.exports = ({ errors }) => {
  return layout({
    content: `
        <div>
        <form method="POST" action="">
            <input name="email" type="text" placeholder="email" />
            ${getError(errors, "email")}
            <input name="password" type="text" placeholder="password" />
            ${getError(errors, "password")}
            <button>Sign In Mothafucka</button>
        </form>
        </div>
    `,
  });
};
