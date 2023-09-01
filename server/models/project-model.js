var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var projectSchema = new Schema({
  projectTitle: {
    type: String,
    required: true,
  },
  projectDescription: {
    type: String,
    required: true,
  },
  deadline: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  teamMembers: {
    type: Array,
    required: true,
  },
  passKey: {
    type: String,
    required: true,
  },
  meetings: [
    {
      _id: false,
      meetingId: String,
      summary: String,
      description: String,
      startingDate: String,
      startingTime: String,
      endingDate: String,
      endingTime: String,
      timeZone: String,
      recurrence: String,
      happens: String,
      cancelled: Boolean,
      meetingLink: String,
      hostFullName: String,
      hostUserName: String,
      timeStamp: Date,
    },
  ],
  activeDays: [
    {
      _id: false,
      timeStamp: String,
      progressDone: String,
      fullName: String,
      userName: String,
      role: String,
      profileImage: String,
    },
  ],
  forums: [
    {
      _id: false,
      forumId: String,
      forumTitle: String,
      forumDescription: String,
      timeStamp: String,
      postedPersonFullName: String,
      postedPersonUserName: String,
      postedPersonRole: String,
      postedPersonProfileImage: String,
      likedUserNames: [
        {
          _id: false,
          likedUserName: String,
        },
      ],
      comments: [
        {
          _id: false,
          commentId: String,
          commentorName: String,
          commentorUserName: String,
          comment: String,
          timeStamp: String,
          likedUserNames: [
            {
              _id: false,
              likedUserName: String,
            },
          ],
        },
      ],
    },
  ],
  tasks: [
    {
      _id: false,
      taskId: String,
      taskName: String,
      assignee: String,
      deadline: String,
      priority: String,
      progressStatus: String,
      approvalStatus: String,
      assigneeComments: String,
      taskWork: String,
      taskComments: [
        {
          _id: false,
          commentId: String,
          commentorUserName: String,
          commentorFullName: String,
          commentorRole: String,
          taskComment: String,
          timeStamp: String,
          likedUserNames: [{ _id: false, likedUserName: String }],
        },
      ],
    },
  ],
});
module.exports = mongoose.model("projects", projectSchema);
