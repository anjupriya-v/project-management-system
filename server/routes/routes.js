var express = require("express");
var userController = require("../controllers/user-controller");
var projectController = require("../controllers/project-controller");
var uploadProfile = require("../helpers/user-storage");
var uploadTaskWork = require("../helpers/task-storage");
const passport = require("passport");
const router = express.Router();
router.route("/login").post(userController.loginUserController);
router
  .route("/register", passport.authenticate("jwt", { session: false }))
  .post(
    uploadProfile.single("profileImage"),
    userController.registerUserController
  );
router
  .route("/check-user-name", passport.authenticate("jwt", { session: false }))
  .post(userController.checkUserNameController);
router
  .route(
    "/get-registered-users",
    passport.authenticate("jwt", { session: false })
  )
  .get(userController.getRegisteredUsersController);
router
  .route("/update-user", passport.authenticate("jwt", { session: false }))
  .put(
    uploadProfile.single("profileImage"),
    userController.updateUserController
  );
router
  .route(
    "/delete-user/:email",
    passport.authenticate("jwt", { session: false })
  )
  .delete(userController.deleteUserController);
router
  .route(
    "/fetch-user-info-for-edit",
    passport.authenticate("jwt", { session: false })
  )
  .post(userController.fetchUserInfoForEditController);
router
  .route("/fetch-user-names", passport.authenticate("jwt", { session: false }))
  .get(userController.fetchUserNamesController);
router
  .route("/project-creation", passport.authenticate("jwt", { session: false }))
  .post(projectController.projectCreationController);
router
  .route(
    "/get-project-details",
    passport.authenticate("jwt", { session: false })
  )
  .get(projectController.getProjectDetailsController);
router
  .route(
    "/change-project-status",
    passport.authenticate("jwt", { session: false })
  )
  .put(projectController.changeProjectStatusController);
router
  .route(
    "/delete-project/:projectId/:projectTitle",
    passport.authenticate("jwt", { session: false })
  )
  .delete(projectController.deleteProjectController);
router
  .route("/create-task", passport.authenticate("jwt", { session: false }))
  .post(projectController.createTaskController);
router
  .route(
    "/change-task-progress-status",
    passport.authenticate("jwt", { session: false })
  )
  .put(projectController.changeTaskProgressStatusController);
router
  .route("/upload-task-work", passport.authenticate("jwt", { session: false }))
  .post(
    uploadTaskWork.single("taskWork"),
    projectController.uploadTaskWorkController
  );
router
  .route(
    "/get-task-work-details",
    passport.authenticate("jwt", { session: false })
  )
  .post(projectController.getTaskWorkDetailsController);
router
  .route(
    "/change-task-approval-status",
    passport.authenticate("jwt", { session: false })
  )
  .post(projectController.changeTaskApprovalStatusController);
router
  .route("/re-submit-task", passport.authenticate("jwt", { session: false }))
  .post(projectController.reSubmitTaskController);
router
  .route(
    "/delete-task/:projectId/:taskId",
    passport.authenticate("jwt", { session: false })
  )
  .delete(projectController.deleteTaskController);
router
  .route("/add-task-comment", passport.authenticate("jwt", { session: false }))
  .post(projectController.addTaskCommentController);
router
  .route("/like-task-comment", passport.authenticate("jwt", { session: false }))
  .post(projectController.likeTaskCommentController);
router
  .route(
    "/unlike-task-comment",
    passport.authenticate("jwt", { session: false })
  )
  .post(projectController.unLikeTaskCommentController);
router
  .route(
    "/delete-task-comment/:projectId/:taskId/:commentId",
    passport.authenticate("jwt", { session: false })
  )
  .delete(projectController.deleteTaskCommentController);
router
  .route(
    "/submit-user-rating",
    passport.authenticate("jwt", { session: false })
  )
  .post(projectController.submitUserRatingController);
router
  .route(
    "/create-project-forum-post",
    passport.authenticate("jwt", { session: false })
  )
  .post(projectController.createProjectForumPostController);
router
  .route(
    "/like-project-forum",
    passport.authenticate("jwt", { session: false })
  )
  .post(projectController.likeProjectForumController);
router
  .route(
    "/unlike-project-forum",
    passport.authenticate("jwt", { session: false })
  )
  .post(projectController.unLikeProjectForumController);
router
  .route(
    "/add-project-forum-comment",
    passport.authenticate("jwt", { session: false })
  )
  .post(projectController.addProjectForumCommentController);

router
  .route(
    "/like-project-forum-comment",
    passport.authenticate("jwt", { session: false })
  )
  .post(projectController.likeProjectForumCommentController);
router
  .route(
    "/unLike-project-forum-comment",
    passport.authenticate("jwt", { session: false })
  )
  .post(projectController.unLikeProjectForumCommentController);
router
  .route(
    "/delete-project-forum/:projectId/:forumId",
    passport.authenticate("jwt", { session: false })
  )
  .delete(projectController.deleteProjectForumController);
router
  .route(
    "/delete-project-forum-comment/:projectId/:forumId/:commentId",
    passport.authenticate("jwt", { session: false })
  )
  .delete(projectController.deleteProjectForumCommentController);

router
  .route(
    "/authenticate-pass-key",
    passport.authenticate("jwt", { session: false })
  )
  .post(projectController.authenticatePassKeyController);
router
  .route("/resend-pass-key", passport.authenticate("jwt", { session: false }))
  .post(projectController.resendPassKeyController);
router
  .route(
    "/get-current-user-role-in-project",
    passport.authenticate("jwt", { session: false })
  )
  .post(projectController.getCurrentUserRoleInProjectController);
router
  .route(
    "/request-to-reset-pass-key",
    passport.authenticate("jwt", { session: false })
  )
  .post(projectController.requestToResetPassKeyController);
router
  .route(
    "/send-email-verification-code",
    passport.authenticate("jwt", { session: false })
  )
  .post(projectController.sendEmailVerificationCodeController);

router
  .route("/verify-email", passport.authenticate("jwt", { session: false }))
  .post(projectController.verifyEmailController);

router
  .route("/reset-pass-key", passport.authenticate("jwt", { session: false }))
  .post(projectController.resetPassKeyController);

module.exports = router;
