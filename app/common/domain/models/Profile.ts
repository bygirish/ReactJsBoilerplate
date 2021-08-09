// import { JsonProperty } from 'json-object-mapper';

// export interface IProfile {
//   role: string[];
//   deleted: false;
//   userId: string;
//   source: string;
//   candidateId: string;
//   firstName: sa]tring;
//   lastName: string;
//   gender: string;
//   cookieConsents: string[];
//   preferredLanguage: string;
//   email: string;
//   lmsUserId: number;
//   lmsVendor: string;
//   createdAt?: string;
//   updatedAt?: string;
//   id?: string;
// }
// export class ProfileModel {
//     @JsonProperty({name: 'cookieConsents', required: false})
//     private cookieConsents: string = '';

//     @JsonProperty({name: 'countryCode', required: false})
//     private countryCode = '';

//     @JsonProperty({name: 'createdAt', required: false})
//     private createdAt: string = '';

//     @JsonProperty({name: 'deleted', required: true})
//     private deleted = false;

//     @JsonProperty({name: 'email', required: false})
//     private email: string = '';

//     @JsonProperty({name: 'firstName', required: true})
//     private firstName = '';

//     @JsonProperty({name: 'gender', required: false})
//     private gender: string = '';

//     @JsonProperty({name: 'id', required: true})
//     private id = '';

//     @JsonProperty({name: 'lastName', required: false})
//     private lastName: string = '';

//     @JsonProperty({name: 'lmsUserId', required: false})
//     private lmsUserId = '';

//     @JsonProperty({name: 'lmsVendor', required: false})
//     private lmsVendor: string = '';

//     @JsonProperty({name: 'middleName', required: false})
//     private middleName = '';

//     @JsonProperty({name: 'otherStream', required: false})
//     private otherStream: string = '';

//     @JsonProperty({name: 'phoneNumber', required: false})
//     private phoneNumber = '';

//     @JsonProperty({name: 'preferredLanguage', required: false})
//     private preferredLanguage: string = '';

//     @JsonProperty({name: 'profileImageUuid', required: false})
//     private profileImageUuid = '';

//     @JsonProperty({name: 'role', required: false})
//     private role = [];

//     @JsonProperty({name: 'streamId', required: false})
//     private streamId: string = '';

//     @JsonProperty({name: 'updatedAt', required: true})
//     private updatedAt = '';

//     @JsonProperty({name: 'userId', required: false})
//     private userId: string = '';

//     @JsonProperty({name: 'userStatus', required: false})
//     private userStatus = '';

//     public getEmail(): string {
//         return this.email;
//     }

//     public getFirstName(): string {
//         return this.firstName;
//     }

//     public getGender(): string {
//         return this.gender;
//     }

//     public getId(): string {
//         return this.id;
//     }

//     public getCookieConsents(): string {
//         return this.cookieConsents;
//     }

//     public getCountryCode(): string {
//         return this.countryCode;
//     }

//     public getCreatedAt(): string {
//         return this.createdAt;
//     }

//     public getDeleted(): boolean {
//         return this.deleted;
//     }

//     public getLastname(): string {
//         return this.lastName;
//     }

//     public getLmsUserId(): string {
//         return this.lmsUserId;
//     }

//     public getLmsVendor(): string {
//         return this.lmsVendor;
//     }

//     public getMiddleName(): string {
//         return this.middleName;
//     }

//     public getOtherStream(): string {
//         return this.otherStream;
//     }

//     public getPhoneNumber(): string {
//         return this.phoneNumber;
//     }

//     public getPreferredLanguage(): string {
//         return this.preferredLanguage;
//     }

//     public getProfileImageUuid(): string {
//         return this.profileImageUuid;
//     }

//     public getRole(): string[] {
//         return this.role;
//     }

//     public getStreamId(): string {
//         return this.streamId;
//     }

    
//     public getUpdatedAt(): string {
//         return this.updatedAt;
//     }

//     public getUserId(): string {
//         return this.userId;
//     }

//     public getUserStatus(): string {
//         return this.userStatus;
//     }

//     public getName(): string {
//         return `${this.firstName} ${this.lastName}`;
//     }
// }

