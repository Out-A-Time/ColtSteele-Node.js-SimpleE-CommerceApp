const fs = require("fs");
const crypto = require("crypto");
const util = require("util");
const scrypt = util.promisify(crypto.scrypt);

class UsersRepository {
  constructor(filename) {
    if (!filename) {
      throw new Error("Creating a repository requires a filename");
    }
    this.filename = filename;
    try {
      fs.accessSync(this.filename);
    } catch (err) {
      fs.writeFileSync(this.filename, "[]");
    }
  }
  async getAll() {
    return JSON.parse(
      await fs.promises.readFile(this.filename, {
        encoding: "utf-8",
      })
    );
  }
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

  //write the updated 'records' array back to this.filename
  async writeAll(records) {
    await fs.promises.writeFile(
      this.filename,
      JSON.stringify(records, null, 2) //null is formatter, and number 2 means indentention we want to use
    );
  }
  //Generating random User ID
  randomId() {
    return crypto.randomBytes(4).toString("hex");
  }

  async getOne(id) {
    const records = await this.getAll();
    return records.find((record) => record.id === id);
  }

  async delete(id) {
    const records = await this.getAll();
    const filteredRecords = records.filter((record) => record.id !== id);
    await this.writeAll(filteredRecords);
  }

  async update(id, attributes) {
    const records = await this.getAll();
    const record = records.find((record) => record.id === id);

    if (!record) {
      throw new Error(`Record with id ${id} not found!`);
    }

    Object.assign(record, attributes);
    await this.writeAll(records);
  }

  async getOneBy(filters) {
    const records = await this.getAll();

    for (let record of records) {
      let found = true;

      for (let key in filters) {
        if (record[key] !== filters[key]) {
          found = false;
        }
      }
      if (found) {
        return record;
      }
    }
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
