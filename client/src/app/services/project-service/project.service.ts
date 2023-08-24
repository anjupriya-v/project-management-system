import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProjectCreation } from 'src/app/models/project-creation';
import { TaskCreation } from 'src/app/models/task-creation';
import { GetProjects } from 'src/app/models/get-projects';
import { AuthService } from '../authentication-service/auth.service';
@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  public server: string = 'http://localhost:5000/';
  currentUser: any = JSON.parse(this.auth.getCurrentUser() || '{}');
  currentProject: any;
  constructor(private httpClient: HttpClient, private auth: AuthService) {}
  public handleProjectCreation(data: ProjectCreation) {
    const { projectTitle, projectDescription, deadline, teamMembers, passKey } =
      data;
    const formData = {
      projectTitle: projectTitle,
      projectDescription: projectDescription,
      deadline: deadline,
      teamMembers: teamMembers,
      passKey: passKey,
      currentUserUserName: this.currentUser['userName'],
    };

    return this.httpClient.post(this.server + 'project-creation/', formData);
  }
  public getProjectDetails() {
    return this.httpClient.get<GetProjects>(
      this.server + 'get-project-details/'
    );
  }
  public changeProjectStatus(projectId: any) {
    var formData = {
      projectId: projectId,
      currentUserUserName: this.currentUser['userName'],
    };
    return this.httpClient.put(
      this.server + 'change-project-status/',
      formData
    );
  }
  public deleteProject(projectId: any, projectTitle: any) {
    return this.httpClient.delete(
      this.server + 'delete-project/' + projectId + '/' + projectTitle
    );
  }
  public createTask(taskDetails: TaskCreation, projectId: any) {
    const { taskName, assignee, deadline, priority } = taskDetails;
    const formData = {
      taskName: taskName,
      assignee: assignee,
      deadline: deadline,
      priority: priority,
      projectId: projectId,
      projectStatus: 'Not Started',
      currentUserUserName: this.currentUser['userName'],
    };
    return this.httpClient.post(this.server + 'create-task/', formData);
  }
  public changeTaskProgressStatus(
    projectId: any,
    progressStatus: any,
    taskId: any
  ) {
    const formData = {
      projectId: projectId,
      taskId: taskId,
      progressStatus: progressStatus,
      currentUserUserName: this.currentUser['userName'],
    };
    return this.httpClient.put(
      this.server + 'change-task-progress-status/',
      formData
    );
  }
  public uploadTaskWork(
    taskWork: any,
    comments: any,
    projectId: any,
    taskId: any
  ) {
    const formData = new FormData();
    formData.append('taskWork', taskWork);
    formData.append('comments', comments);
    formData.append('projectId', projectId);
    formData.append('taskId', taskId);
    formData.append('currentUserUserName', this.currentUser['userName']);

    return this.httpClient.post(this.server + 'upload-task-work/', formData);
  }
  public getTaskWorkDetails(taskId: any, projectId: any) {
    var formData = {
      projectId: projectId,
      taskId: taskId,
    };
    return this.httpClient.post(
      this.server + 'get-task-work-details/',
      formData
    );
  }
  public taskApproval(
    progressStatus: any,
    approvalStatus: any,
    taskId: any,
    projectId: any
  ) {
    const formData = {
      projectId: projectId,
      taskId: taskId,
      progressStatus: progressStatus,
      approvalStatus: approvalStatus,
      currentUserUserName: this.currentUser['userName'],
    };
    return this.httpClient.post(
      this.server + 'change-task-approval-status/',
      formData
    );
  }
  public reSubmitTask(projectId: any, taskId: any) {
    const formData = {
      projectId: projectId,
      taskId: taskId,
      currentUserUserName: this.currentUser['userName'],
    };
    return this.httpClient.post(this.server + 're-submit-task/', formData);
  }
  public deleteTask(projectId: any, taskId: any) {
    return this.httpClient.delete(
      this.server + 'delete-task/' + projectId + '/' + taskId
    );
  }
  public deleteTaskComment(projectId: any, taskId: any, commentId: any) {
    return this.httpClient.delete(
      this.server +
        'delete-task-comment/' +
        projectId +
        '/' +
        taskId +
        '/' +
        commentId
    );
  }
  public addTaskComment(
    taskComment: any,
    projectId: any,
    taskId: any,
    userName: any,
    fullName: any,
    role: any,
    timeStamp: any
  ) {
    var formData = {
      taskComment: taskComment,
      projectId: projectId,
      taskId: taskId,
      userName: userName,
      fullName: fullName,
      role: role,
      timeStamp: timeStamp,
      currentUserUserName: this.currentUser['userName'],
    };
    return this.httpClient.post(this.server + 'add-task-comment', formData);
  }
  public likeTaskComment(
    projectId: any,
    taskId: any,
    commentId: any,
    likedUserName: any
  ) {
    var formData = {
      projectId: projectId,
      taskId: taskId,
      commentId: commentId,
      likedUserName: likedUserName,
    };
    return this.httpClient.post(this.server + 'like-task-comment/', formData);
  }
  public unLikeTaskComment(
    projectId: any,
    taskId: any,
    commentId: any,
    likedUserName: any
  ) {
    var formData = {
      projectId: projectId,
      taskId: taskId,
      commentId: commentId,
      likedUserName: likedUserName,
    };
    return this.httpClient.post(this.server + 'unlike-task-comment/', formData);
  }
  public submitUserRating(rating: any, userName: any, projectId: any) {
    var formData = {
      projectId: projectId,
      userName: userName,
      rating: rating,
      currentUserUserName: this.currentUser['userName'],
    };
    return this.httpClient.post(this.server + 'submit-user-rating/', formData);
  }
  public createProjectForumPost(
    projectId: any,
    projectForumPostDetails: any,
    timeStamp: any,
    fullName: any,
    userName: any,
    role: any,
    profileImage: any
  ) {
    var formData = {
      projectId: projectId,
      forumTitle: projectForumPostDetails.forumPostTitle,
      forumDescription: projectForumPostDetails.forumPostDescription,
      timeStamp: timeStamp,
      postedPersonFullName: fullName,
      postedPersonUserName: userName,
      postedPersonRole: role,
      postedPersonProfileImage: profileImage,
      currentUserUserName: this.currentUser['userName'],
    };
    return this.httpClient.post(
      this.server + 'create-project-forum-post/',
      formData
    );
  }
  public likeProjectForum(projectId: any, forumId: any, likedUserName: any) {
    var formData = {
      projectId: projectId,
      forumId: forumId,
      likedUserName: likedUserName,
    };
    return this.httpClient.post(this.server + 'like-project-forum/', formData);
  }
  public unLikeProjectForum(projectId: any, forumId: any, likedUserName: any) {
    var formData = {
      projectId: projectId,
      forumId: forumId,
      likedUserName: likedUserName,
    };
    return this.httpClient.post(
      this.server + 'unlike-project-forum/',
      formData
    );
  }
  public addProjectForumComment(
    projectId: any,
    forumId: any,
    timeStamp: any,
    fullName: any,
    userName: any,
    postCommentDetails: any
  ) {
    var formData = {
      projectId: projectId,
      forumId: forumId,
      timeStamp: timeStamp,
      commentorName: fullName,
      commentorUserName: userName,
      comment: postCommentDetails.comment,
      currentUserUserName: this.currentUser['userName'],
    };
    return this.httpClient.post(
      this.server + 'add-project-forum-comment/',
      formData
    );
  }
  public likeProjectForumComment(
    projectId: any,
    forumId: any,
    commentId: any,
    likedUserName: any
  ) {
    var formData = {
      projectId: projectId,
      forumId: forumId,
      commentId: commentId,
      likedUserName: likedUserName,
    };
    return this.httpClient.post(
      this.server + 'like-project-forum-comment/',
      formData
    );
  }
  public unLikeProjectForumComment(
    projectId: any,
    forumId: any,
    commentId: any,
    likedUserName: any
  ) {
    var formData = {
      projectId: projectId,
      forumId: forumId,
      commentId: commentId,
      likedUserName: likedUserName,
    };
    return this.httpClient.post(
      this.server + 'unLike-project-forum-comment/',
      formData
    );
  }
  public deleteProjectForum(projectId: any, forumId: any) {
    return this.httpClient.delete(
      this.server + 'delete-project-forum/' + projectId + '/' + forumId
    );
  }
  public deleteProjectForumComment(
    projectId: any,
    forumId: any,
    commentId: any
  ) {
    return this.httpClient.delete(
      this.server +
        'delete-project-forum-comment/' +
        projectId +
        '/' +
        forumId +
        '/' +
        commentId
    );
  }
  public authenticatePassKey(projectId: any, passKey: any) {
    var formData = {
      projectId: projectId,
      passKey: passKey,
    };
    return this.httpClient.post(
      this.server + 'authenticate-pass-key/',
      formData
    );
  }
  public isPassKeyAuthenticated() {
    return sessionStorage.getItem('token');
  }
  public getCurrentProject() {
    this.currentProject = sessionStorage.getItem('project');
    return this.currentProject;
  }
  public storeProjectData(token: any, project: any) {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('project', JSON.stringify(project));
  }
  public resendPassKey(projectId: any, email: any) {
    var formData = {
      projectId: projectId,
      email: email,
    };
    return this.httpClient.post(this.server + 'resend-pass-key/', formData);
  }
  public getCurrentUserRoleInProject(projectId: any, email: any) {
    var formData = {
      projectId: projectId,
      email: email,
    };
    return this.httpClient.post(
      this.server + 'get-current-user-role-in-project/',
      formData
    );
  }
  public requestToResetPassKey(projectId: any, email: any) {
    var formData = {
      projectId: projectId,
      email: email,
    };
    return this.httpClient.post(
      this.server + 'request-to-reset-pass-key/',
      formData
    );
  }
  public sendEmailVerificationCode(projectId: any, email: any) {
    var formData = {
      projectId: projectId,
      email: email,
    };
    return this.httpClient.post(
      this.server + 'send-email-verification-code/',
      formData
    );
  }
  public verifyEmail(projectId: any, verificationCode: any) {
    var formData = {
      projectId: projectId,
      verificationCode: verificationCode,
    };
    return this.httpClient.post(this.server + 'verify-email/', formData);
  }
  public resetPassKey(projectId: any, passKey: any) {
    var formData = {
      projectId: projectId,
      passKey: passKey,
    };
    return this.httpClient.post(this.server + 'reset-pass-key/', formData);
  }
  public scheduleMeeting(projectId: any, meetingDetails: any) {
    const {
      summary,
      description,
      startingDate,
      startingTime,
      endingDate,
      endingTime,
      timeZone,
      recurrence,
    } = meetingDetails;
    var formData = {
      projectId: projectId,
      summary: summary,
      description: description,
      startingDate: startingDate,
      startingTime: startingTime,
      endingDate: endingDate,
      endingTime: endingTime,
      recurrence: recurrence,
      timeZone: timeZone,
    };
    return this.httpClient.post(this.server + 'schedule-meeting/', formData);
  }
  public cancelMeeting(projectId: any, meetingId: any) {
    var formData = {
      projectId: projectId,
      meetingId: meetingId,
    };
    return this.httpClient.put(this.server + 'cancel-meeting/', formData);
  }
}
