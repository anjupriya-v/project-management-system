const projectModel = require("../models/project-model");
const userModel = require("../models/user-model");
var mongoose = require("mongoose");
var nodemailer = require("nodemailer");
var handlebars = require("handlebars");
var fs = require("fs");
key = "12345678rehtbetbejktejt";
var encryptor = require("simple-encryptor")(key);
const jwt = require("jsonwebtoken");
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
const markActiveDays = (progressStatus, projectId, currentUserUserName) => {
  return new Promise(function projectService(resolve, reject) {
    try {
      userModel
        .find(
          { userName: currentUserUserName },
          {
            profileImage: 1,
            fullName: 1,
            userName: 1,
            role: 1,
          }
        )
        .then((userDetailsResult, error) => {
          if (error) {
            reject({
              status: false,
              msg: "Unable to fetch corresponding details of userNames",
            });
          } else {
            const { timeStamp, progressDone } = progressStatus;
            var markStatus = {
              timeStamp: timeStamp,
              progressDone: progressDone,
              fullName: userDetailsResult[0].fullName,
              userName: currentUserUserName,
              role: userDetailsResult[0].role,
              profileImage: userDetailsResult[0].profileImage,
            };

            projectModel
              .findByIdAndUpdate(
                { _id: projectId },
                { $push: { activeDays: markStatus } }
              )
              .then((result, error) => {
                if (error) {
                  reject({
                    status: false,
                    msg: "Unable to set the day as active",
                  });
                } else {
                  resolve({
                    status: true,
                    msg: "This day is marked as active day",
                  });
                }
              })
              .catch((err) => {
                console.log(err);
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
const mailServiceForProject = (
  mailList,
  mailData,
  templatePath,
  mailSubject,
  content
) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.USEREMAIL,
      pass: process.env.USERPASSWORD,
    },
  });
  mailList.forEach(function (to, i) {
    readHTMLFile(templatePath, function (err, html) {
      if (err) {
        console.log("error reading file", err);
        return;
      }
      var template = handlebars.compile(html);

      var htmlToSend = template(mailData) + content;
      var mailOptions = {
        from: process.env.USEREMAIL,
        subject: mailSubject,
        html: htmlToSend,
      };
      mailOptions.to = to;
      transporter.sendMail(mailOptions, function (error, response) {
        if (error) {
          console.log(error);
        }
      });
    });
  });
};
const getMailData = (projectDetailsArr) => {
  var decryptedPassKey = encryptor.decrypt(projectDetailsArr.passKey);
  var mailList = [],
    processedPersonName = "",
    processedPersonRole = "",
    processedPersonEmail = "",
    processedPersonPhoneNumber = "";
  projectDetailsArr.teamMembers.forEach((element, i) => {
    if (element.role == "Admin" || element.role == "Team Lead") {
      processedPersonName = element.fullName;
      processedPersonRole = "Team Lead";
      processedPersonEmail = element.email;
      processedPersonPhoneNumber = element.phoneNumber;
    }
    mailList.push(element.email);
  });
  return [
    {
      projectTitle: projectDetailsArr.projectTitle,
      projectDescription: projectDetailsArr.projectDescription,
      deadline: projectDetailsArr.deadline,
      passKey: decryptedPassKey,
      teamMembers: projectDetailsArr.teamMembers,
      processedPersonName: processedPersonName,
      processedPersonRole: processedPersonRole,
      processedPersonEmail: processedPersonEmail,
      processedPersonPhoneNumber: processedPersonPhoneNumber,
    },
    mailList,
  ];
};
module.exports.projectCreationService = (projectDetails) => {
  return new Promise(function projectService(resolve, reject) {
    try {
      userModel
        .find(
          { userName: { $in: projectDetails["teamMembers"] } },
          {
            profileImage: 1,
            fullName: 1,
            userName: 1,
            role: 1,
            email: 1,
            phoneNumber: 1,
          }
        )
        .then((result, error) => {
          if (error) {
            reject({
              status: false,
              msg: "Unable to fetch corresponding details of userNames",
            });
          } else {
            try {
              var encryptedPassKey = encryptor.encrypt(
                projectDetails["passKey"]
              );
              var doc = {
                projectTitle: projectDetails["projectTitle"],
                projectDescription: projectDetails["projectDescription"],
                deadline: projectDetails["deadline"],
                teamMembers: result,
                passKey: encryptedPassKey,
                status: "Incomplete",
              };
              projectModel
                .create(doc)
                .then((projectCreationResult, error) => {
                  if (error) {
                    reject({
                      status: false,
                      msg: "Unable to create the project",
                    });
                  } else {
                    var objectId = new mongoose.Types.ObjectId(
                      projectCreationResult._id
                    );
                    var content = `<ul>`;
                    projectCreationResult.teamMembers.forEach((element, i) => {
                      content += `<ol><h4>Team Member- ${
                        i + 1
                      }</h4><p><b>Full Name</b> : ${
                        element.fullName
                      }</p><p><b>User Name</b> : ${
                        element.userName
                      }</p><p><b>Role </b>: ${
                        element.role
                      }</p><p><b>Email</b>: ${
                        element.email
                      }</p><p><b>Phone Number</b>: ${
                        element.phoneNumber
                      }</p></ol><br/>`;
                    });
                    content += "</ul>";
                    var [mailData, mailList] = getMailData(
                      projectCreationResult
                    );

                    mailServiceForProject(
                      mailList,
                      mailData,
                      "email-templates/project-creation.html",
                      "Project Creation - PMS Service",
                      content
                    );
                    var progressStatus = {
                      timeStamp: new Date(),
                      progressDone: "Project Created in this day",
                    };
                    markActiveDays(
                      progressStatus,
                      objectId,
                      projectDetails["currentUserUserName"]
                    );
                    resolve({
                      status: true,
                      msg: `Project created with the name "${projectCreationResult.projectTitle}"  Successfully!`,
                    });
                  }
                })

                .catch((err) => {
                  console.log(err);
                });
            } catch (err) {
              console.log(err);
            }
          }
        });
    } catch (err) {
      console.log(err);
    }
  });
};

module.exports.getProjectDetailsService = () => {
  return new Promise(function projectService(resolve, reject) {
    try {
      projectModel
        .find()
        .then((result, error) => {
          if (error) {
            reject({
              status: false,
              msg: "Unable to fetch the project details",
            });
          } else {
            resolve({
              status: true,
              msg: "Project details fetched successfully!",
              projectDetails: result,
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
module.exports.changeProjectStatusService = (projectDetails) => {
  var objectId = new mongoose.Types.ObjectId(projectDetails.projectId);
  return new Promise(function projectService(resolve, reject) {
    try {
      projectModel
        .findByIdAndUpdate({ _id: objectId }, { $set: { status: "Completed" } })
        .then((result, error) => {
          if (error) {
            reject({
              status: false,
              msg: "Unable to set the project status",
            });
          } else {
            var [mailData, mailList] = getMailData(result);
            mailServiceForProject(
              mailList,
              mailData,
              "email-templates/project-status.html",
              "Project Status Updation - PMS Service",
              ""
            );
            var progressStatus = {
              timeStamp: new Date(),
              progressDone: "Project Marked as Complete",
            };
            markActiveDays(
              progressStatus,
              objectId,
              projectDetails.currentUserUserName
            );
            resolve({
              status: true,
              msg: `Your project "${result.projectTitle}" is marked as complete!`,
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
module.exports.deleteProjectService = (projectDetails) => {
  var objectId = new mongoose.Types.ObjectId(projectDetails.projectId);
  return new Promise(function projectService(resolve, reject) {
    try {
      projectModel
        .findByIdAndDelete({ _id: objectId })
        .then((result, error) => {
          if (error) {
            reject({
              status: false,
              msg: "Unable to delete the project",
            });
          } else {
            var [mailData, mailList] = getMailData(result);
            mailServiceForProject(
              mailList,
              mailData,
              "email-templates/delete-project.html",
              "Project Deletion - PMS Service",
              ""
            );
            resolve({
              status: true,
              msg: `Your project "${projectDetails.projectTitle}" has been deleted`,
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
module.exports.createTaskService = (taskDetails) => {
  return new Promise(function projectService(resolve, reject) {
    var objectId = new mongoose.Types.ObjectId(taskDetails.projectId);
    var id = new mongoose.Types.ObjectId();
    var task = {
      taskId: JSON.stringify(id.getTimestamp()),
      taskName: taskDetails.taskName,
      assignee: taskDetails.assignee,
      deadline: taskDetails.deadline,
      priority: taskDetails.priority,
      progressStatus: "Not Started",
      approvalStatus: "Not Submitted",
    };
    try {
      projectModel
        .findByIdAndUpdate({ _id: objectId }, { $push: { tasks: task } })
        .then((result, error) => {
          if (error) {
            reject({
              status: false,
              msg: "Unable to assign the task",
            });
          } else {
            var progressStatus = {
              timeStamp: new Date(),
              progressDone: `The task '${task.taskName}' assigned to ${task.assignee}`,
            };
            markActiveDays(
              progressStatus,
              objectId,
              taskDetails.currentUserUserName
            );
            resolve({
              status: true,
              msg: `Task is successfully assigned to ${task.assignee}`,
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
module.exports.changeTaskProgressStatusService = (taskDetails) => {
  var objectId = new mongoose.Types.ObjectId(taskDetails.projectId);

  return new Promise(function userService(resolve, reject) {
    try {
      projectModel
        .findOneAndUpdate(
          {
            _id: objectId,
            "tasks.taskId": taskDetails.taskId,
          },
          {
            $set: {
              "tasks.$[item].progressStatus": taskDetails.progressStatus,
            },
          },
          {
            arrayFilters: [
              {
                "item.taskId": {
                  $eq: taskDetails.taskId,
                },
              },
            ],
          },
          { new: true }
        )
        .then((result, error) => {
          if (error) {
            reject({ status: false, msg: "Unable to update the task status" });
          } else {
            projectModel
              .find(
                { _id: objectId },
                {
                  tasks: 1,
                  _id: 0,
                }
              )
              .then((projectResult, error) => {
                projectResult[0].tasks.forEach((task) => {
                  if (task.taskId == taskDetails.taskId) {
                    var progressStatus = {
                      timeStamp: new Date(),
                      progressDone: `The task '${task.taskName}''s progress status changed as '${task.progressStatus}' by ${task.assignee}`,
                    };
                    markActiveDays(
                      progressStatus,
                      objectId,
                      taskDetails.currentUserUserName
                    );
                    resolve({
                      status: true,
                      msg: `Task Status has been updated`,
                    });
                  }
                });
              })
              .catch((err) => {
                reject({
                  status: false,
                  msg: "Something Went Wrong! Try Again!",
                });
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
module.exports.uploadTaskWorkService = (taskWorkDetails, taskWorkFile) => {
  var objectId = new mongoose.Types.ObjectId(taskWorkDetails.projectId);
  var taskWorkDoc = "";
  if (taskWorkFile == undefined) {
    taskWorkDoc = taskWorkDetails.taskWork;
  } else {
    taskWorkDoc =
      "http://localhost:5000/task-documents/" + taskWorkFile.filename;
  }

  return new Promise(function userService(resolve, reject) {
    try {
      projectModel
        .findOneAndUpdate(
          {
            _id: objectId,
            "tasks.taskId": taskWorkDetails.taskId,
          },
          {
            $set: {
              "tasks.$[item].taskWork": taskWorkDoc,
              "tasks.$[item].assigneeComments": taskWorkDetails.comments,
              "tasks.$[item].progressStatus": "Under Review",
              "tasks.$[item].approvalStatus": "Waiting for approval",
            },
          },
          {
            arrayFilters: [
              {
                "item.taskId": {
                  $eq: taskWorkDetails.taskId,
                },
              },
            ],
          },
          { new: true }
        )
        .then((result, error) => {
          if (error) {
            reject({ status: false, msg: "Unable to upload the task work" });
          } else {
            projectModel
              .find(
                { _id: objectId },
                {
                  tasks: 1,
                  _id: 0,
                }
              )
              .then((projectResult, error) => {
                projectResult[0].tasks.forEach((task) => {
                  if (task.taskId == taskWorkDetails.taskId) {
                    var progressStatus = {
                      timeStamp: new Date(),
                      progressDone: `The work documents for the task "${task.taskName}" is uploaded by "${task.assignee}"`,
                    };
                    markActiveDays(
                      progressStatus,
                      objectId,
                      taskWorkDetails.currentUserUserName
                    );
                    resolve({
                      status: true,
                      msg: `Yay! your task work has been uploaded...`,
                    });
                  }
                });
              })
              .catch((err) => {
                reject({
                  status: false,
                  msg: "Something Went Wrong! Try Again!",
                });
              });
          }
        })
        .catch((err) => {
          console.log(err);
          reject({
            status: false,
            msg: "Something Went Wrong! Try Again!",
          });
        });
    } catch (err) {
      console.log(err);
      reject({
        status: false,
        msg: "Something Went Wrong! Try Again!",
      });
    }
  });
};
module.exports.getTaskWorkDetailsService = (taskWorkDetails) => {
  var objectId = new mongoose.Types.ObjectId(taskWorkDetails.projectId);
  return new Promise(function projectService(resolve, reject) {
    try {
      projectModel
        .find(
          { _id: objectId },
          { tasks: { $elemMatch: { taskId: taskWorkDetails.taskId } } }
        )
        .then((result, error) => {
          if (error) {
            reject({
              status: false,
              msg: "Unable to fetch the Task Work details",
            });
          } else {
            resolve({
              status: true,
              msg: "Task Work Details fetched successfully!",
              taskWorkDetails: result,
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
module.exports.changeTaskApprovalStatusService = (taskApprovalDetails) => {
  var objectId = new mongoose.Types.ObjectId(taskApprovalDetails.projectId);
  return new Promise(function projectService(resolve, reject) {
    try {
      projectModel
        .findOneAndUpdate(
          {
            _id: objectId,
            "tasks.taskId": taskApprovalDetails.taskId,
          },
          {
            $set: {
              "tasks.$[item].progressStatus":
                taskApprovalDetails.progressStatus,
              "tasks.$[item].approvalStatus":
                taskApprovalDetails.approvalStatus,
            },
          },
          {
            arrayFilters: [
              {
                "item.taskId": {
                  $eq: taskApprovalDetails.taskId,
                },
              },
            ],
          },
          { new: true }
        )
        .then((result, error) => {
          if (error) {
            reject({
              status: false,
              msg: "Unable to change the task approval status",
            });
          } else {
            projectModel
              .find(
                { _id: objectId },
                {
                  tasks: 1,
                  _id: 0,
                }
              )
              .then((projectResult, error) => {
                projectResult[0].tasks.forEach((task) => {
                  if (task.taskId == taskApprovalDetails.taskId) {
                    var progressStatus = {
                      timeStamp: new Date(),
                      progressDone: `The approval status for the task "${task.taskName}" is marked as "${task.approvalStatus}"`,
                    };
                    markActiveDays(
                      progressStatus,
                      objectId,
                      taskApprovalDetails.currentUserUserName
                    );
                    resolve({
                      status: true,
                      msg: "The task approval status is updated!",
                      taskWorkDetails: result,
                    });
                  }
                });
              })
              .catch((err) => {
                console.log(err);
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
module.exports.reSubmitTaskService = (taskDetails) => {
  var objectId = new mongoose.Types.ObjectId(taskDetails.projectId);
  return new Promise(function projectService(resolve, reject) {
    try {
      projectModel
        .findOneAndUpdate(
          {
            _id: objectId,
            "tasks.taskId": taskDetails.taskId,
          },
          {
            $set: {
              "tasks.$[item].progressStatus": "In Progress",
              "tasks.$[item].approvalStatus": "Not Submitted",
            },
          },
          {
            arrayFilters: [
              {
                "item.taskId": {
                  $eq: taskDetails.taskId,
                },
              },
            ],
          },
          { new: true }
        )
        .then((result, error) => {
          if (error) {
            reject({
              status: false,
              msg: "Unable to re-submit the task",
            });
          } else {
            projectModel
              .find(
                { _id: objectId },
                {
                  tasks: 1,
                  _id: 0,
                }
              )
              .then((projectResult, error) => {
                projectResult[0].tasks.forEach((task) => {
                  if (task.taskId == taskDetails.taskId) {
                    var progressStatus = {
                      timeStamp: new Date(),
                      progressDone: `"${task.assignee}" has resubmitted the task "${task.taskName}`,
                    };
                    markActiveDays(
                      progressStatus,
                      objectId,
                      taskDetails.currentUserUserName
                    );
                    resolve({
                      status: true,
                      msg: "The task is resubmitted successfully!",
                      taskWorkDetails: result,
                    });
                  }
                });
              })
              .catch((err) => {
                console.log(err);
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
module.exports.deleteTaskService = (taskDetails) => {
  var objectId = new mongoose.Types.ObjectId(taskDetails.projectId);
  return new Promise(function projectService(resolve, reject) {
    try {
      projectModel
        .findOneAndUpdate(
          { _id: objectId },
          { $pull: { tasks: { taskId: taskDetails.taskId } } },
          false,
          true
        )
        .then((result, error) => {
          if (error) {
            reject({
              status: false,
              msg: "Unable to delete the task",
            });
          } else {
            resolve({
              status: true,
              msg: `Your Task has been deleted`,
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
module.exports.addTaskCommentService = (taskCommentDetails) => {
  return new Promise(function projectService(resolve, reject) {
    var objectId = new mongoose.Types.ObjectId(taskCommentDetails.projectId);
    var commentId = new mongoose.Types.ObjectId();
    var taskComment = {
      commentId: JSON.stringify(commentId.getTimestamp()),
      commentorUserName: taskCommentDetails.userName,
      commentorFullName: taskCommentDetails.fullName,
      commentorRole: taskCommentDetails.role,
      taskComment: taskCommentDetails.taskComment,
      timeStamp: taskCommentDetails.timeStamp,
    };
    try {
      projectModel
        .findOneAndUpdate(
          {
            _id: objectId,
            "tasks.taskId": taskCommentDetails.taskId,
          },
          {
            $push: {
              "tasks.$[item].taskComments": taskComment,
            },
          },
          {
            arrayFilters: [
              {
                "item.taskId": {
                  $eq: taskCommentDetails.taskId,
                },
              },
            ],
          },
          { new: true }
        )
        .then((result, error) => {
          if (error) {
            reject({
              status: false,
              msg: "Unable to add the task Comment",
            });
          } else {
            var progressStatus = {
              timeStamp: new Date(),
              progressDone: `${taskComment.commentorUserName} has added the task comment on the task ${task.taskName}`,
            };
            markActiveDays(
              progressStatus,
              objectId,
              taskCommentDetails.currentUserUserName
            );
            resolve({
              status: true,
              msg: "Your Comment is Successfully added!",
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
module.exports.likeTaskCommentService = (likedTaskCommentDetails) => {
  return new Promise(function projectService(resolve, reject) {
    var objectId = new mongoose.Types.ObjectId(
      likedTaskCommentDetails.projectId
    );
    var likedTaskCommentDetailsObj = {
      likedUserName: likedTaskCommentDetails.likedUserName,
    };
    try {
      projectModel
        .findOneAndUpdate(
          {
            _id: objectId,
            "tasks.taskId": likedTaskCommentDetails.taskId,
          },
          {
            $push: {
              "tasks.$[item].taskComments.$[commentItem].likedUserNames":
                likedTaskCommentDetailsObj,
            },
          },
          {
            arrayFilters: [
              {
                "item.taskId": {
                  $eq: likedTaskCommentDetails.taskId,
                },
              },
              {
                "commentItem.commentId": {
                  $eq: likedTaskCommentDetails.commentId,
                },
              },
            ],
          },
          { new: true }
        )
        .then((result, error) => {
          if (error) {
            reject({
              status: false,
              msg: "Unable to like the comment",
            });
          } else {
            resolve({
              status: true,
              msg: "You Liked the comment!",
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
module.exports.unLikeTaskCommentService = (likedTaskCommentDetails) => {
  return new Promise(function projectService(resolve, reject) {
    var objectId = new mongoose.Types.ObjectId(
      likedTaskCommentDetails.projectId
    );
    try {
      projectModel
        .findOneAndUpdate(
          {
            _id: objectId,
            "tasks.taskId": likedTaskCommentDetails.taskId,
          },
          {
            $pull: {
              "tasks.$[item].taskComments.$[commentItem].likedUserNames": {
                likedUserName: likedTaskCommentDetails.likedUserName,
              },
            },
          },
          {
            arrayFilters: [
              {
                "item.taskId": {
                  $eq: likedTaskCommentDetails.taskId,
                },
              },
              {
                "commentItem.commentId": {
                  $eq: likedTaskCommentDetails.commentId,
                },
              },
            ],
          },

          { new: true }
        )
        .then((result, error) => {
          if (error) {
            reject({
              status: false,
              msg: "Unable to un like the comment",
            });
          } else {
            resolve({
              status: true,
              msg: "You unliked the comment!",
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
module.exports.deleteTaskCommentService = (taskCommentDetails) => {
  var objectId = new mongoose.Types.ObjectId(taskCommentDetails.projectId);
  return new Promise(function projectService(resolve, reject) {
    try {
      projectModel
        .findOneAndUpdate(
          { _id: objectId },
          {
            $pull: {
              "tasks.$[item].taskComments": {
                commentId: taskCommentDetails.commentId,
              },
            },
          },
          {
            arrayFilters: [
              {
                "item.taskId": {
                  $eq: taskCommentDetails.taskId,
                },
              },
            ],
          },

          { new: true }
        )
        .then((result, error) => {
          if (error) {
            reject({
              status: false,
              msg: "Unable to delete the task Comment",
            });
          } else {
            resolve({
              status: true,
              msg: `Your Comment has been deleted`,
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
module.exports.submitUserRatingService = (userRatingDetails) => {
  return new Promise(function projectService(resolve, reject) {
    var objectId = new mongoose.Types.ObjectId(userRatingDetails.projectId);
    try {
      userModel
        .find(
          { userName: { $in: userRatingDetails.userName } },
          {
            fullName: 1,
          }
        )
        .then((teamMemberResult, error) => {
          if (error) {
            reject({
              status: false,
              msg: "Unable to fetch corresponding details of team Members",
            });
          } else {
            try {
              projectModel
                .findOneAndUpdate(
                  {
                    _id: objectId,
                  },
                  {
                    $set: {
                      "teamMembers.$[teamMember].rating":
                        userRatingDetails.rating,
                    },
                  },
                  {
                    arrayFilters: [
                      {
                        "teamMember.userName": {
                          $eq: userRatingDetails.userName,
                        },
                      },
                    ],
                  },

                  { new: true }
                )
                .then((result, error) => {
                  if (error) {
                    reject({
                      status: false,
                      msg: "Unable to rate the user",
                    });
                  } else {
                    var progressStatus = {
                      timeStamp: new Date(),
                      progressDone: `Team Lead has added ${userRatingDetails.rating} Rating for ${userRatingDetails.userName}`,
                    };
                    markActiveDays(
                      progressStatus,
                      objectId,
                      userRatingDetails.currentUserUserName
                    );

                    resolve({
                      status: true,
                      msg: `You Rated ${userRatingDetails.rating} to the user '${teamMemberResult[0].fullName}'!`,
                    });
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            } catch (err) {
              console.log(err);
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
module.exports.createProjectForumPostService = (forumPostDetails) => {
  return new Promise(function projectService(resolve, reject) {
    var objectId = new mongoose.Types.ObjectId(forumPostDetails.projectId);
    var id = new mongoose.Types.ObjectId();
    var forum = {
      forumId: JSON.stringify(id.getTimestamp()),
      forumTitle: forumPostDetails.forumTitle,
      forumDescription: forumPostDetails.forumDescription,
      timeStamp: forumPostDetails.timeStamp,
      postedPersonFullName: forumPostDetails.postedPersonFullName,
      postedPersonUserName: forumPostDetails.postedPersonUserName,
      postedPersonRole: forumPostDetails.postedPersonRole,
      postedPersonProfileImage: forumPostDetails.postedPersonProfileImage,
    };
    try {
      projectModel
        .findByIdAndUpdate(
          {
            _id: objectId,
          },
          {
            $push: {
              forums: forum,
            },
          }
        )
        .then((result, error) => {
          if (error) {
            reject({
              status: false,
              msg: "Unable to Create the forum post",
            });
          } else {
            var progressStatus = {
              timeStamp: new Date(),
              progressDone: `"${forumPostDetails.postedPersonUserName}"  added the forum`,
            };
            markActiveDays(
              progressStatus,
              objectId,
              forumPostDetails.currentUserUserName
            );
            resolve({
              status: true,
              msg: `Your forum post '${forum.forumTitle}' is posted successfully!`,
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
module.exports.likeProjectForumService = (forumDetails) => {
  return new Promise(function projectService(resolve, reject) {
    var objectId = new mongoose.Types.ObjectId(forumDetails.projectId);
    try {
      projectModel
        .findByIdAndUpdate(
          {
            _id: objectId,
            "forums.forumId": forumDetails.forumId,
          },
          {
            $push: {
              "forums.$[item].likedUserNames": {
                likedUserName: forumDetails.likedUserName,
              },
            },
          },
          {
            arrayFilters: [
              {
                "item.forumId": {
                  $eq: forumDetails.forumId,
                },
              },
            ],
          },
          { new: true }
        )
        .then((result, error) => {
          if (error) {
            reject({
              status: false,
              msg: "Unable to like the forum post",
            });
          } else {
            resolve({
              status: true,
              msg: `You liked the forum post`,
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
module.exports.unLikeProjectForumService = (forumDetails) => {
  return new Promise(function projectService(resolve, reject) {
    var objectId = new mongoose.Types.ObjectId(forumDetails.projectId);
    try {
      projectModel
        .findByIdAndUpdate(
          {
            _id: objectId,
            "forums.forumId": forumDetails.forumId,
          },
          {
            $pull: {
              "forums.$[item].likedUserNames": {
                likedUserName: forumDetails.likedUserName,
              },
            },
          },
          {
            arrayFilters: [
              {
                "item.forumId": {
                  $eq: forumDetails.forumId,
                },
              },
            ],
          },
          { new: true }
        )
        .then((result, error) => {
          if (error) {
            reject({
              status: false,
              msg: "Unable to un like the forum post",
            });
          } else {
            resolve({
              status: true,
              msg: `You unliked the forum post`,
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
module.exports.addProjectForumCommentService = (forumCommentDetails) => {
  return new Promise(function projectService(resolve, reject) {
    var objectId = new mongoose.Types.ObjectId(forumCommentDetails.projectId);
    var id = new mongoose.Types.ObjectId();
    var comment = {
      commentId: JSON.stringify(id.getTimestamp()),
      commentorName: forumCommentDetails.commentorName,
      commentorUserName: forumCommentDetails.commentorUserName,
      comment: forumCommentDetails.comment,
      timeStamp: forumCommentDetails.timeStamp,
    };
    try {
      projectModel
        .findByIdAndUpdate(
          {
            _id: objectId,
            "forums.forumId": forumCommentDetails.forumId,
          },
          {
            $push: {
              "forums.$[item].comments": comment,
            },
          },
          {
            arrayFilters: [
              {
                "item.forumId": {
                  $eq: forumCommentDetails.forumId,
                },
              },
            ],
          },
          { new: true }
        )
        .then((result, error) => {
          if (error) {
            reject({
              status: false,
              msg: "Unable to add the forum comment",
            });
          } else {
            projectModel
              .find(
                { _id: objectId },
                {
                  forums: 1,
                  _id: 0,
                }
              )
              .then((projectResult, error) => {
                projectResult[0].tasks.forEach((forum) => {
                  if (forum.forumId == forumCommentDetails.forumId) {
                    var progressStatus = {
                      timeStamp: new Date(),
                      progressDone: `"${forumCommentDetails.commentorUserName}"  added the comment in the forum "${forum.postedPersonUserName}"`,
                    };
                    markActiveDays(
                      progressStatus,
                      objectId,
                      forumCommentDetails.currentUserUserName
                    );
                    resolve({
                      status: true,
                      msg: "Comment Added Successfully!",
                    });
                  }
                });
              })
              .catch((err) => {
                console.log(err);
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
module.exports.likeProjectForumCommentService = (forumCommentDetails) => {
  return new Promise(function projectService(resolve, reject) {
    var objectId = new mongoose.Types.ObjectId(forumCommentDetails.projectId);
    try {
      var likedProjectForumCommentObj = {
        likedUserName: forumCommentDetails.likedUserName,
      };
      projectModel
        .findByIdAndUpdate(
          {
            _id: objectId,
            "forums.forumId": forumCommentDetails.forumId,
          },
          {
            $push: {
              "forums.$[item].comments.$[commentItem].likedUserNames":
                likedProjectForumCommentObj,
            },
          },
          {
            arrayFilters: [
              {
                "item.forumId": {
                  $eq: forumCommentDetails.forumId,
                },
              },
              {
                "commentItem.commentId": {
                  $eq: forumCommentDetails.commentId,
                },
              },
            ],
          },
          { new: true }
        )
        .then((result, error) => {
          if (error) {
            reject({
              status: false,
              msg: "Unable to like the comment",
            });
          } else {
            resolve({
              status: true,
              msg: "You liked the comment!",
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
module.exports.unLikeProjectForumCommentService = (forumCommentDetails) => {
  return new Promise(function projectService(resolve, reject) {
    var objectId = new mongoose.Types.ObjectId(forumCommentDetails.projectId);
    try {
      projectModel
        .findByIdAndUpdate(
          {
            _id: objectId,
            "forums.forumId": forumCommentDetails.forumId,
          },
          {
            $pull: {
              "forums.$[item].comments.$[commentItem].likedUserNames": {
                likedUserName: forumCommentDetails.likedUserName,
              },
            },
          },
          {
            arrayFilters: [
              {
                "item.forumId": {
                  $eq: forumCommentDetails.forumId,
                },
              },
              {
                "commentItem.commentId": {
                  $eq: forumCommentDetails.commentId,
                },
              },
            ],
          },
          { new: true }
        )
        .then((result, error) => {
          if (error) {
            reject({
              status: false,
              msg: "Unable to unlike the comment",
            });
          } else {
            resolve({
              status: true,
              msg: "You unliked the comment!",
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
module.exports.deleteProjectForumService = (forumDetails) => {
  var objectId = new mongoose.Types.ObjectId(forumDetails.projectId);
  return new Promise(function projectService(resolve, reject) {
    try {
      projectModel
        .findByIdAndUpdate(
          {
            _id: objectId,
          },
          {
            $pull: {
              forums: {
                forumId: forumDetails.forumId,
              },
            },
          },
          { new: true }
        )
        .then((result, error) => {
          if (error) {
            reject({
              status: false,
              msg: "Unable to delete the forum",
            });
          } else {
            resolve({
              status: true,
              msg: `Forum is deleted successfully!`,
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
module.exports.deleteProjectForumCommentService = (forumCommentDetails) => {
  var objectId = new mongoose.Types.ObjectId(forumCommentDetails.projectId);
  return new Promise(function projectService(resolve, reject) {
    try {
      projectModel
        .findByIdAndUpdate(
          {
            _id: objectId,
          },
          {
            $pull: {
              "forums.$[item].comments": {
                commentId: forumCommentDetails.commentId,
              },
            },
          },
          {
            arrayFilters: [
              {
                "item.forumId": {
                  $eq: forumCommentDetails.forumId,
                },
              },
            ],
          },
          { new: true }
        )
        .then((result, error) => {
          if (error) {
            reject({
              status: false,
              msg: "Unable to delete the comment",
            });
          } else {
            resolve({
              status: true,
              msg: `Comment is deleted successfully!`,
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
module.exports.authenticatePassKeyService = (projectDetails) => {
  var objectId = new mongoose.Types.ObjectId(projectDetails.projectId);
  return new Promise(function projectService(resolve, reject) {
    try {
      projectModel
        .find({ _id: objectId })
        .then((result, error) => {
          if (error) {
            reject({
              status: false,
              msg: "Unable to authenticate your pass key",
            });
          } else {
            var decryptedPassKey = encryptor.decrypt(result[0].passKey);
            if (decryptedPassKey == projectDetails.passKey) {
              token = jwt.sign(projectDetails, process.env.SECRETKEY);
              resolve({
                status: true,
                msg: `Your Pass Key is Authenticated`,
                token: token,
                project: {
                  projectId: result[0]._id,
                  projectTitle: result[0].projectTitle,
                  projectDescription: result[0].projectDescription,
                  teamMembers: result[0].teamMembers,
                  status: result[0].status,
                  deadline: result[0].deadline,
                  activeDays: result[0].activeDays,
                  forums: result[0].forums,
                  tasks: result[0].tasks,
                },
              });
            } else {
              reject({ status: false, msg: "Invalid Pass Key. Try Again!" });
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
module.exports.resendPassKeyService = (projectDetails) => {
  var objectId = new mongoose.Types.ObjectId(projectDetails.projectId);
  return new Promise(function projectService(resolve, reject) {
    try {
      projectModel
        .find({
          _id: objectId,
        })
        .then((result, error) => {
          if (error) {
            reject({
              status: false,
              msg: "Unable to authenticate your pass key",
            });
          } else {
            result[0].teamMembers.forEach((teamMember) => {
              if (teamMember.email == projectDetails.email) {
                var mailList = [projectDetails.email];
                var decryptedPassKey = encryptor.decrypt(result[0].passKey);
                var mailData = {
                  projectTitle: result[0].projectTitle,
                  passKey: decryptedPassKey,
                };
                mailServiceForProject(
                  mailList,
                  mailData,
                  "email-templates/resended-pass-key.html",
                  "Resended Pass Key - PMS Service"
                );
                resolve({
                  status: true,
                  msg: `Your Pass Key is resended.Check your inbox!`,
                });
                return;
              }
            });
            resolve({
              status: false,
              msg: `Your mail id is incorrect`,
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
