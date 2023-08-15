const projectService = require("../services/project-service");

var projectCreationController = async (req, res) => {
  var result = null;
  try {
    result = await projectService.projectCreationService(req.body);
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
var getProjectDetailsController = async (req, res) => {
  var result = null;
  try {
    result = await projectService.getProjectDetailsService();
    if (result.status) {
      res.send({
        status: true,
        message: result.msg,
        projectDetails: result.projectDetails,
      });
    } else {
      res.send({ status: false, message: result.msg });
    }
  } catch (error) {
    res.send({ status: false, message: error.msg });
  }
};
var changeProjectStatusController = async (req, res) => {
  var result = null;
  try {
    result = await projectService.changeProjectStatusService(req.body);
    if (result.status) {
      res.send({
        status: true,
        message: result.msg,
      });
    } else {
      res.send({ status: false, message: result.msg });
    }
  } catch (error) {
    console.log(error);
    res.send({ status: false, message: error.msg });
  }
};
var deleteProjectController = async (req, res) => {
  var result = null;
  try {
    result = await projectService.deleteProjectService(req.params);
    if (result.status) {
      res.send({
        status: true,
        message: result.msg,
      });
    } else {
      res.send({ status: false, message: result.msg });
    }
  } catch (error) {
    console.log(error);
    res.send({ status: false, message: error.msg });
  }
};
var createTaskController = async (req, res) => {
  var result = null;
  try {
    result = await projectService.createTaskService(req.body);
    if (result.status) {
      res.send({
        status: true,
        message: result.msg,
      });
    } else {
      res.send({ status: false, message: result.msg });
    }
  } catch (error) {
    console.log(error);
    res.send({ status: false, message: error.msg });
  }
};
var changeTaskProgressStatusController = async (req, res) => {
  var result = null;
  try {
    result = await projectService.changeTaskProgressStatusService(req.body);
    if (result.status) {
      res.send({
        status: true,
        message: result.msg,
      });
    } else {
      res.send({ status: false, message: result.msg });
    }
  } catch (error) {
    console.log(error);
    res.send({ status: false, message: error.msg });
  }
};
var uploadTaskWorkController = async (req, res) => {
  var result = null;
  try {
    result = await projectService.uploadTaskWorkService(req.body, req.file);
    if (result.status) {
      res.send({
        status: true,
        message: result.msg,
      });
    } else {
      res.send({ status: false, message: result.msg });
    }
  } catch (error) {
    console.log(error);
    res.send({ status: false, message: error.msg });
  }
};
var getTaskWorkDetailsController = async (req, res) => {
  var result = null;
  try {
    result = await projectService.getTaskWorkDetailsService(req.body);
    if (result.status) {
      res.send({
        status: true,
        message: result.msg,
        taskWorkDetails: result.taskWorkDetails,
      });
    } else {
      res.send({ status: false, message: result.msg });
    }
  } catch (error) {
    res.send({ status: false, message: error.msg });
  }
};
var changeTaskApprovalStatusController = async (req, res) => {
  var result = null;
  try {
    result = await projectService.changeTaskApprovalStatusService(req.body);
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
var reSubmitTaskController = async (req, res) => {
  var result = null;
  try {
    result = await projectService.reSubmitTaskService(req.body);
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
var deleteTaskController = async (req, res) => {
  var result = null;
  try {
    result = await projectService.deleteTaskService(req.params);
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
var addTaskCommentController = async (req, res) => {
  var result = null;
  try {
    result = await projectService.addTaskCommentService(req.body);
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
var likeTaskCommentController = async (req, res) => {
  var result = null;
  try {
    result = await projectService.likeTaskCommentService(req.body);
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
var unLikeTaskCommentController = async (req, res) => {
  var result = null;
  try {
    result = await projectService.unLikeTaskCommentService(req.body);
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
var deleteTaskCommentController = async (req, res) => {
  var result = null;
  try {
    result = await projectService.deleteTaskCommentService(req.params);
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
var submitUserRatingController = async (req, res) => {
  var result = null;
  try {
    result = await projectService.submitUserRatingService(req.body);
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
var createProjectForumPostController = async (req, res) => {
  var result = null;
  try {
    result = await projectService.createProjectForumPostService(req.body);
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
var likeProjectForumController = async (req, res) => {
  var result = null;
  try {
    result = await projectService.likeProjectForumService(req.body);
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
var unLikeProjectForumController = async (req, res) => {
  var result = null;
  try {
    result = await projectService.unLikeProjectForumService(req.body);
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
var addProjectForumCommentController = async (req, res) => {
  var result = null;
  try {
    result = await projectService.addProjectForumCommentService(req.body);
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
var likeProjectForumCommentController = async (req, res) => {
  var result = null;
  try {
    result = await projectService.likeProjectForumCommentService(req.body);
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
var unLikeProjectForumCommentController = async (req, res) => {
  var result = null;
  try {
    result = await projectService.unLikeProjectForumCommentService(req.body);
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
var deleteProjectForumController = async (req, res) => {
  var result = null;
  try {
    result = await projectService.deleteProjectForumService(req.params);
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
var deleteProjectForumCommentController = async (req, res) => {
  var result = null;
  try {
    result = await projectService.deleteProjectForumCommentService(req.params);
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

module.exports = {
  projectCreationController,
  getProjectDetailsController,
  changeProjectStatusController,
  deleteProjectController,
  createTaskController,
  changeTaskProgressStatusController,
  uploadTaskWorkController,
  getTaskWorkDetailsController,
  changeTaskApprovalStatusController,
  reSubmitTaskController,
  deleteTaskController,
  addTaskCommentController,
  likeTaskCommentController,
  unLikeTaskCommentController,
  deleteTaskCommentController,
  submitUserRatingController,
  createProjectForumPostController,
  likeProjectForumController,
  unLikeProjectForumController,
  addProjectForumCommentController,
  likeProjectForumCommentController,
  unLikeProjectForumCommentController,
  deleteProjectForumController,
  deleteProjectForumCommentController,
};
