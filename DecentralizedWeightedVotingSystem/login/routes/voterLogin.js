const router = require('express').Router();
var WAValidator = require('wallet-address-validator');
let User = require("../models/User");
let UserSession = require("../models/UserSession");
  /**
   * SIgn up
   */
  router.route("/signup").post((req, res, next) => {
    const { body } = req;
    const { password, walletAddress, equity } = body;
    let { username } = body; // needs to be mutable unlike above

    if (!username) {
      return res.send({
        success: false,
        mes: "Error: Username cannot be blank."
      });
    }

    if (!password) {
      return res.send({
        success: false,
        mes: "Error: Password cannot be blank."
      });
    }

    var valid = WAValidator.validate(walletAddress, 'ETH');

    if (!valid) {
        return res.send({
          success: false,
          mes: "Error: Wallet Address INVALID."
        });
    }


    if (!equity) {
      return res.send({
        success: false,
        mes: "Error: Equity name cannot be blank."
      });
    }

    username = username.toLowerCase(); // username should always go in db in lowercase form

    /**
     * Steps:
     * 1. Verify username doesn't exists
     * 2. Save
     */
    // User.find({ walletAddress }).then(found => {
    //    if (found.length >0) {
    //         return res.send({
    //             success: false,
    //             mes: "Wallet Address already exists."
    //           });
    //     }
    // })

    User.find(
      {
        username
      },
      (err, previousUsers) => {
        if (err) {
          return res.send({
            success: false,
            mes: "Error: Server error."
          });
        } else if (previousUsers.length > 0) {
          return res.send({
            success: false,
            mes: "Error: Account already exists."
          });
        }
    

        // Save the new user
        const newUser = new User();
        newUser.username = username;
        newUser.password = newUser.generateHash(password);
        newUser.walletAddress = walletAddress;
        newUser.equity = equity;
        newUser.save((err, user) => {
          if (err) {
            return res.send({
              success: false,
              mes: "Error: Server error."
            });
          }

          return res.send({
            success: true,
            mes: "Signed up."
          });
        });
      }
    );
  });

  router.route("/signin").post((req, res, next) => {
    const { body } = req;
    const { password } = body;
    let { username } = body; // needs to be mutable unlike above

    if (!username) {
      return res.send({
        success: false,
        mes: "Error: Username cannot be blank."
      });
    }

    if (!password) {
      return res.send({
        success: false,
        mes: "Error: Password cannot be blank."
      });
    }

    username = username.toLowerCase();

    /**
     * Find the user in the DB with the given email
     */
    User.find(
      {
        username
      },
      (err, users) => {
        if (err) {
          return res.send({
            success: false,
            mes: "Error: Server error #0."
          });
        }
        // if there are zero users found (there cannot be more than one user found--it's impossible)
        if (users.length != 1) {
          return res.send({
            success: false,
            mes: "Error: Invalid"
          });
        }

        /**
         * Check the user's password
         */
        const user = users[0];
        // if invalid password
        if (!user.validPassword(password)) {
          return res.send({
            success: false,
            mes: "Error: Invalid"
          });
        }

        // otherwise, create user session
        /**
         * Everytime users log in, they will get a token.
         * The token is generated using the _id property of the new document created on the server.
         * This will verify that they have already successfully logged in.
         * If you feel you need to revoke their access, mark their document to `isDeleted: true`
         */
        let userSession = new UserSession();
        userSession.userId = user._id;
        userSession.save((err, doc) => {
          if (err) {
            return res.send({
              success: false,
              mes: "Error: Server error #1."
            });
          }

          return res.send({
            success: true,
            mes: "Valid sign in.",
            token: doc._id // the _id property that Mongo gives each document by default
          });
        });
      }
    );
  });

  router.route("/verify").get((req, res, verify) => {
    /**
     * 1. Get the token
     * 2. Verify the token is one of a kind and is not deleted
     */

    // get token
    const { query } = req;
    const { token } = query; //?token=test

    // Verify the token is one of a kind and is not deleted
    UserSession.find(
      {
        _id: token,
        isDeleted: false
      },
      (err, sessions) => {
        if (err) {
          return res.send({
            success: false,
            mes: "Error: Server error"
          });
        }

        if (sessions.length != 1) {
          return res.send({
            success: false,
            mes: "Error: Invalid"
          });
        } else {
          return res.send({
            success: true,
            mes: "Good"
          });
        }
      }
    );
  });

  router.route("/logout").post((req, res, next) => {
    const { query } = req;
    const { token } = query; //?token=test

    // Verify the token is one of a kind and is not deleted
    UserSession.findOneAndUpdate(
      {
        _id: token,
        isDeleted: false
      },
      {
        $set: { isDeleted: true }
      },
      null,
      (err, sessions) => {
        if (err) {
          return res.send({
            success: false,
            mes: "Error: Server error."
          });
        }

        // if there aren't any documents found by that token
        // if (sessions.length != 1) {
        //   return res.send({
        //     success: false,
        //     mes: "Error: Invalid token."
        //   });
        // }

        // otherwise, everything went fine and dandy
        return res.send({
          success: true,
          mes: "Good"
        });
      }
    );
  });
  router.route('/').get((req, res) => {
    User.find()
    .then(user => res.json(user))
    .catch(err => res.status(400).json('Error: ' + err));
  });


  module.exports = router;
