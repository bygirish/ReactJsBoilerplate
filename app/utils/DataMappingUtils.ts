// import jwtDecode, { JwtPayload } from "jwt-decode";
// import { AuthenticationService } from "@services/AuthenticationService";
// import {userRoles} from '@constants/config';
// import {IEvaluationData} from "@models/MilestoneInstance";
// import { ConversationModel } from "@models/Conversation";
// import { AllowPost, ConversationType } from "@constants/config";

// const getInitials = (name: string) => {
//   if (!name) {
//     return '';
//   }
//   const firstLetters = name
//     .split(/\s/)
//     .reduce((response, word) => (response += word.slice(0, 1)), '');
//   const { length } = firstLetters;
//   if (firstLetters && length > 1) {
//     return firstLetters.slice(0, 1) + firstLetters.slice(length - 1, length);
//   }
//   return firstLetters || '';
// };



// export const getEmbedVideoId = (videoUrl: string): string => {
//   const vidReg = /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
//   const url = `https://www.youtube.com/embed/${videoUrl.match(vidReg)[1]}`;
//   return url;
// };

// const validateFileSize = (file: any, fileSizeLimit?: number) => {

//   const defaultFileSizeLimit = 1024 * 1024 * 2;
//   const updatedFileSizeLimit = !fileSizeLimit && defaultFileSizeLimit;

//   return file.size <= updatedFileSizeLimit ? true : false;
// };

// const calculateEvaluationScore = (evaluation : IEvaluationData[], userRole?: userRoles) => {
//   if(evaluation.length == 0)
//     return '';

//   let maxScore: number = 0;
//   let totalScore: number = 0;
//   let count = 0;
//   evaluation.map((data) => {
//     maxScore += data.result?.maxScore;
//     totalScore += data.result?.score;
//     count++;
//   });

//   return `${parseFloat((totalScore / maxScore) * 100 + '').toPrecision(4)}% ${userRole !== userRoles.faculty ? `(${count})` : ''}`;
// };

// export const getLoggedInUserId = async () => {
//   const token = await AuthenticationService.getAccessToken();
//   let userId = undefined;
//   if (!!token) {
//       const userIdSub = jwtDecode<JwtPayload>(token);
//       userId = userIdSub.sub;
//   }
//   return userId;
// }

// export const getConversationType = (conversation: ConversationModel): string => {
//   if (!conversation.getMetadata()){
//       return ConversationType.ONE;
//   } else if (conversation.getAllowPost() === AllowPost.ALL){
//       return ConversationType.GROUP;
//   } else if (conversation.getAllowPost() === AllowPost.ADMIN) {
//       return ConversationType.ANNOUNCEMENT;
//   }
//   return ConversationType.ONE;
// }

// /*
//       Utility function for generating unique UUID for each message
//   */

//  export const generateUuidv4 = () =>
//  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
//    const r = (Math.random() * 16) | 0;
//    const v = c == 'x' ? r : (r & 0x3) | 0x8;
//    return v.toString(16);
//  });


//  export const getYoutubeVideoId = (videoUrl: string): string => {

//   if(videoUrl !== '') {
//     const vidReg = /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
//     const videoId = videoUrl.match(vidReg)[1];
//     return videoId;
//   }

//   return "";

// };

// const validateYoutubeUrl = (url: string): boolean => {
//   const regex = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
//   if(url.match(regex)){
//     return true;
//   }
//   return false;
// } 

// const getHttpPrefixedLinkUrl = (url: string) => {
//   return url && !url.includes('http') && `http://${url}`;
// }

// export const DataMappingUtils = {
//   getInitials,
//   getEmbedVideoId,
//   validateFileSize,
//   calculateEvaluationScore,
//   getLoggedInUserId,
//   getConversationType,
//   generateUuidv4,
//   getHttpPrefixedLinkUrl,
//   getYoutubeVideoId,
//   validateYoutubeUrl
// };


