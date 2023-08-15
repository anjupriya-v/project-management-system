var userService = require("../services/user-service");
var checkUserNameController = async (req, res) => {
  var result = null;
  try {
    result = await userService.checkUserNameService(req.body);
    if (result.status) {
      res.send({
        status: true,
        message: result.msg,
        checkUserStatus: result.checkUserStatus,
      });
    } else {
      res.send({
        status: false,
        message: result.msg,
        checkUserStatus: result.checkUserStatus,
      });
    }
  } catch (error) {
    res.send({
      status: false,
      message: error.msg,
      checkUserStatus: error.checkUserStatus,
    });
  }
};
var registerUserController = async (req, res) => {
  var result = null;
  try {
    result = await userService.registerUserService(req.body, req.file);
    if (result.status) {
      res.send({
        status: true,
        message: result.msg,
        user: result.user,
      });
    } else {
      res.send({ status: false, message: result.msg });
    }
  } catch (error) {
    res.send({ status: false, message: error.msg });
  }
};
var getRegisteredUsersController = async (req, res) => {
  var result = null;

  try {
    result = await userService.getRegisteredUsersService();
    if (result.status) {
      res.send({
        status: true,
        message: result.msg,
        registeredUsers: result.registeredUsers,
      });
    } else {
      res.send({
        status: false,
        message: result.msg,
      });
    }
  } catch (error) {
    res.send({ status: false, message: error.msg });
  }
};
var fetchUserInfoForEditController = async (req, res) => {
  var result = null;
  try {
    result = await userService.fetchUserInfoForEditService(req.body);
    if (result.status) {
      res.send({
        status: true,
        message: result.msg,
        user: result.user,
      });
    } else {
      res.send({ status: false, message: result.msg });
    }
  } catch (error) {
    res.send({ status: false, message: error.msg });
  }
};
var updateUserController = async (req, res) => {
  var result = null;
  try {
    result = await userService.updateUserService(req.body, req.file);
    if (result.status) {
      res.send({
        status: true,
        message: result.msg,
        user: result.user,
      });
    } else {
      res.send({ status: false, message: result.msg });
    }
  } catch (error) {
    res.send({ status: false, message: error.msg });
  }
};
var deleteUserController = async (req, res) => {
  var result = null;

  try {
    result = await userService.deleteUserService(req.params);
    if (result.status) {
      res.send({
        status: true,
        message: result.msg,
      });
    } else {
      res.send({ status: false, message: result.msg });
    }
  } catch (error) {
    res.send({ status: false, message: error.msg });
  }
};
var loginUserController = async (req, res) => {
  var result = null;

  try {
    result = await userService.loginUserService(req.body);
    if (result.status) {
      res.send({
        status: true,
        message: result.msg,
        token: result.token,
        user: result.user,
      });
    } else {
      res.send({ status: false, message: result.msg });
    }
  } catch (error) {
    res.send({ status: false, message: error.msg });
  }
};
var fetchUserNamesController = async (req, res) => {
  var result = null;

  try {
    result = await userService.fetchUserNamesService();
    if (result.status) {
      res.send({
        status: true,
        message: result.msg,
        userNames: result.userNames,
      });
    } else {
      res.send({ status: false, message: result.msg });
    }
  } catch (error) {
    res.send({ status: false, message: error.msg });
  }
};
module.exports = {
  registerUserController,
  loginUserController,
  getRegisteredUsersController,
  checkUserNameController,
  deleteUserController,
  fetchUserInfoForEditController,
  updateUserController,
  fetchUserNamesController,
};
