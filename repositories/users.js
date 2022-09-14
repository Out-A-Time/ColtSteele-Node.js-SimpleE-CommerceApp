const fs = require("fs");
const crypto = require("crypto");
const util = require("util");
const scrypt = util.promisify(crypto.scrypt);
const Repository = require("./repository");

class UsersRepository extends Repository {
  async create(attributes) {
    //Assuming that  attributes === {email: '', password: ''}
    attributes.id = this.randomId();

    const salt = crypto.randomBytes(8).toString("hex");
    const hashed = await scrypt(attributes.password, salt, 64);

    const records = await this.getAll();

    //Overwriting text password with hashed version with salt (extra characters)
    const record = {
      ...attributes,
      password: `${hashed.toString("hex")}.${salt}`,
    };
    records.push(record);

    await this.writeAll(records);

    return record;
  }

  async comparePasswords(saved, supplied) {
    //Saved -> password saved in our database. 'hashed.salt'
    //Supplied -> password given to us by a user trying sign in
    // const result = saved.split(".");
    // const hashed = result[0];
    // const salt = result[1];
    //Other way to write code. Destructuring result array
    const [hashed, salt] = saved.split(".");
    const hashedSupplied = await scrypt(supplied, salt, 64);

    return hashed === hashedSupplied.toString("hex");
  }
}

//TESTING FUNCTION
// const test = async () => {
//   const repo = new UsersRepository("users.json");

//   // await repo.create({ email: "test@test.com" });
//   //await repo.update("c9277600", { password: "mypasswordhere" });
//   const user = await repo.getOneBy({
//     email: "test@test.com",
//     password: "mypasswordhere",
//   });
//   console.log(user);
// };

// test();

module.exports = new UsersRepository("users.json");
