// import { APIv1 } from "@common/network/constants";
// import { ICreateProfilePayload } from "@common/redux/auth/interface";
// import { ApiClient } from "@network/client";

// const ENDPOINTS = {
//     fetchProfilesByUsersIds: () => `${APIv1}/profileservice/users`,
// };

// class ProfileRepository {
//   private apiClient: any;

//   constructor(apiClient: any) {
//     this.apiClient = apiClient;
//   }

//   public fetchProfilesByUserIds = async (userIds: string[]) => {
//     try {
//       const params = {
//         userId: userIds.toString()
//       }
//       const response = await this.apiClient.get(ENDPOINTS.fetchProfilesByUsersIds(), params);
//       return response;
//     } catch (e) {
//       throw e.message;
//     }
//   }

//   public createProfile = async (payload: ICreateProfilePayload) => {
//     const response = await this.apiClient.post(ENDPOINTS.fetchProfilesByUsersIds(), payload);
//     return response;  
// };

// }


// const profileRepository = new ProfileRepository(ApiClient);

// export { profileRepository as ProfileRepository };
