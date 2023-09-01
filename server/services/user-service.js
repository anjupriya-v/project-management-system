var userModel = require("../models/user-model");
var nodemailer = require("nodemailer");
var handlebars = require("handlebars");
key = "12345678rehtbetbejktejt";
var encryptor = require("simple-encryptor")(key);
var fs = require("fs");
const jwt = require("jsonwebtoken");
const projectModel = require("../models/project-model");
require("dotenv").config({ path: __dirname + "../.env" });
var token = "";
var readHTMLFile = function (path, callback) {
  fs.readFile(path, { encoding: "utf-8" }, function (err, html) {
    if (err) {
      callback(err);
    } else {
      callback(null, html);
    }
  });
};
const sendMail = (email, mailData, templatePath, mailSubject) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.USEREMAIL,
      pass: process.env.USERPASSWORD,
    },
  });
  readHTMLFile(templatePath, function (err, html) {
    if (err) {
      console.log("error reading file", err);
      return;
    }
    var template = handlebars.compile(html);
    var htmlToSend = template(mailData);
    var mailOptions = {
      from: process.env.USEREMAIL,
      to: email,
      subject: mailSubject,
      html: htmlToSend,
    };
    transporter.sendMail(mailOptions, function (error, response) {
      if (error) {
        console.log(error);
      }
    });
  });
};
module.exports.checkUserNameService = (data) => {
  return new Promise(function userService(resolve, reject) {
    try {
      userModel.findOne({ userName: data.userName }).then((result, error) => {
        if (result) {
          reject({
            status: false,
            checkUserStatus: "inValid",
            msg: "This User Name is already taken",
          });
        } else {
          resolve({
            status: true,
            checkUserStatus: "valid",
            msg: "This User Name is Available",
          });
        }
      });
    } catch (err) {
      console.log(err);
    }
  });
};

module.exports.registerUserService = (userDetails, profileImage) => {
  return new Promise(function userService(resolve, reject) {
    const imagePath = "http://localhost:5000/images/" + profileImage.filename;
    try {
      userModel.findOne({ email: userDetails.email }).then((result, error) => {
        if (result) {
          reject({ status: false, msg: "This email is already registered" });
        } else {
          var encryptedPassword = encryptor.encrypt(userDetails["password"]);
          var doc = {
            profileImage: imagePath,
            fullName: userDetails["fullName"],
            userName: userDetails["userName"],
            role: userDetails["role"],
            email: userDetails["email"],
            phoneNumber: userDetails["phoneNumber"],
            password: encryptedPassword,
          };
          userModel
            .create(doc)
            .then((result, error) => {
              if (result != undefined && result != null) {
                var decryptedPassword = encryptor.decrypt(result.password);
                var mailData = {
                  userName: result.userName,
                  fullName: result.fullName,
                  role: result.role,
                  email: result.email,
                  phoneNumber: result.phoneNumber,
                  password: decryptedPassword,
                };
                sendMail(
                  result.email,
                  mailData,
                  "email-templates/register-user.html",
                  "User Registration - PMS"
                );
                resolve({
                  status: true,
                  msg: `User with email "${result.email}" has been created successfully!`,
                  user: {
                    id: result._id,
                    fullName: result.fullName,
                    userName: result.userName,
                    role: result.role,
                    email: result.email,
                    phoneNumber: result.phoneNumber,
                  },
                });
              } else {
                reject({
                  status: false,
                  msg: "Unable to create the user",
                });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    } catch (err) {
      console.log(err);
    }
  });
};
module.exports.fetchUserInfoForEditService = (userDetails) => {
  return new Promise(function userService(resolve, reject) {
    try {
      userModel
        .findOne({ email: userDetails.email })
        .then((result, error) => {
          if (error) {
            reject({ status: false, msg: "Unable to fetch the user" });
          } else {
            var decryptedPassword = encryptor.decrypt(result.password);
            var user = {
              profileImage: result.profileImage,
              fullName: result.fullName,
              userName: result.userName,
              role: result.role,
              email: result.email,
              phoneNumber: result.phoneNumber,
              password: decryptedPassword,
            };
            resolve({
              status: true,
              msg: "User Details fetched Successfully!",
              user: {
                user,
              },
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  });
};
module.exports.updateUserService = (userDetails, profileImage) => {
  const imagePath = "http://localhost:5000/images/" + profileImage.filename;
  return new Promise(function userService(resolve, reject) {
    try {
      var encrypted = encryptor.encrypt(userDetails.password);
      userModel
        .findOneAndUpdate(
          { email: userDetails.email },
          {
            $set: {
              fullName: userDetails.fullName,
              role: userDetails.role,
              phoneNumber: userDetails.phoneNumber,
              password: encrypted,
              profileImage: imagePath,
            },
          },
          { new: true }
        )
        .then((result, error) => {
          if (error) {
            reject({ status: false, msg: "Unable to update the user details" });
          } else {
            var decryptedPassword = encryptor.decrypt(result.password);
            var mailData = {
              fullName: result.fullName,
              userName: result.userName,
              role: result.role,
              email: result.email,
              phoneNumber: result.phoneNumber,
              password: decryptedPassword,
            };
            sendMail(
              result.email,
              mailData,
              "email-templates/update-user.html",
              "User Details Updation - PMS"
            );
            resolve({
              status: true,
              msg: `User details belongs to "${result.email}" has been updated successfully!`,
            });
          }
        })
        .catch((err) => {
          reject({
            status: false,
            msg: "Something Went Wrong! Try Again!",
          });
        });
    } catch (err) {
      reject({
        status: false,
        msg: "Something Went Wrong! Try Again!",
      });
    }
  });
};
module.exports.deleteUserService = (userDetails) => {
  return new Promise(function userService(resolve, reject) {
    try {
      userModel
        .findOneAndDelete({ email: userDetails.email })
        .then((result, error) => {
          if (error) {
            reject({ status: false, msg: "Unable to delete the user" });
          } else {
            var mailData = {
              email: userDetails.email,
            };
            sendMail(
              userDetails.email,
              mailData,
              "email-templates/delete-user.html",
              "User Account Deletion - PMS"
            );
            resolve({
              status: true,
              msg: `User with email id "${userDetails.email}" has been deleted!`,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  });
};
module.exports.loginUserService = (userDetails) => {
  return new Promise(function userService(resolve, reject) {
    try {
      userModel
        .findOne({ email: userDetails.email })
        .then((result, error) => {
          if (error) {
            reject({ status: false, msg: "Invalid Data" });
          } else {
            if (result != undefined && result != null) {
              var decrypted = encryptor.decrypt(result.password);
              if (decrypted == userDetails.password) {
                token = jwt.sign(userDetails, process.env.SECRETKEY);
                resolve({
                  status: true,
                  msg: "Login Successful!",
                  token: token,
                  user: {
                    id: result._id,
                    fullName: result.fullName,
                    userName: result.userName,
                    role: result.role,
                    email: result.email,
                    phoneNumber: result.phoneNumber,
                    profileImage: result.profileImage,
                  },
                });
              } else {
                reject({ status: false, msg: "Invalid Password. Try Again!" });
              }
            } else {
              reject({
                status: false,
                msg: "This Email is not registered. Please Contact Admin",
              });
            }
          }
        })
        .catch((err) => {
          reject({
            status: false,
            msg: "Something Went Wrong! Try Again!",
          });
        });
    } catch (err) {
      reject({
        status: false,
        msg: "Something Went Wrong! Try Again!",
      });
    }
  });
};
module.exports.getRegisteredUsersService = () => {
  return new Promise(function userService(resolve, reject) {
    try {
      userModel
        .find()
        .then((result, error) => {
          if (error) {
            reject({ status: false, msg: "Unable to fetch the user details" });
          } else {
            if (result.length === 0) {
              resolve({
                status: false,
                msg: "No users have been registered",
                registeredUsers: {},
              });
            } else {
              resolve({
                status: true,
                msg: "Fetched User details successfully",
                registeredUsers: {
                  result,
                },
              });
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  });
};
module.exports.fetchUserNamesService = () => {
  return new Promise(function userService(resolve, reject) {
    try {
      userModel
        .find({ role: { $eq: "Employee" } }, { userName: 1 })
        .then((result, error) => {
          if (error) {
            reject({ status: false, msg: "Unable to fetch the user names" });
          } else {
            if (result.length === 0) {
              resolve({
                status: false,
                msg: "No users have been registered",
                registeredUsers: {},
              });
            } else {
              resolve({
                status: true,
                msg: "Fetched User names successfully",
                userNames: {
                  result,
                },
              });
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  });
};
