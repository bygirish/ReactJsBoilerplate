// import { LocalStorage, StorageKeys } from "@utils/LocalStorage.ts";

// import { AuthRepository } from "@repositories/AuthRepository";
// import { IIamRepository } from "@repositories/interfaces";

// import { LoginModel } from "@models/Login";

// import { IAuthHelper } from '@network/interfaces';


// class AuthenticationService implements IAuthHelper {
//   private userRepository: IIamRepository;

//   constructor(userRepository: IIamRepository) {
//     this.userRepository = userRepository;
//   }

//   public getUser = async (): Promise<LoginModel | null> => {
//     const user = await LocalStorage.get<LoginModel>(StorageKeys.USER);
//     return user;
//   };

//   public getAccessToken = async (): Promise<string> => {
//     const userToken = await localStorage.getItem(StorageKeys.ACCESS_TOKEN);
//     return userToken ? userToken : '';
//   };

//   public refreshTokens = async (): Promise<void> => {
//    //todo refresh token
//   };

// }

// const authenticationService = new AuthenticationService(AuthRepository);
// export { authenticationService as AuthenticationService };
