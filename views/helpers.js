module.exports = {
  getError(errors, prop) {
    //prop === 'email or 'password' or 'passwordConfirmation
    try {
      return errors.mapped()[prop].msg;
      //what is happening behind errors.mapped()
      //errors.mapped() === {
      //     email:{
      //       msg: 'Invalid Password'
      //     },
      //     password: {
      //       msg: 'Password too short'
      //     },
      //     passwordConfirmation: {
      //         msg: 'Passwords must match'
      //     }
      // }
    } catch (err) {
      return "";
    }
  },
};
