// import io from 'socket.io-client';
// import {
//   IPostMessage,
//   IFetchMessagesSpecification,
//   updateSocketStatus,
//   receivedMessage,
//   IRead,
//   stopSocket,
// } from '@redux/chat/actions';
// import { eventChannel, END } from 'redux-saga';
// import { MessageModel, IMessage } from '@models/Message';
// import { ObjectMapper } from 'json-object-mapper';
// import { SOCKET_SERVER_URL } from '@network/constants';
// import { IConversation, ConversationModel, MetaData } from '@models/Conversation';
// import SocketConstants from '@redux/chat/SocketConstants';
// import { getRefreshedToken } from '@redux/chat/actions';
// import { WebStoreProviderService } from '@store/WebStoreProviderService';

// export class SocketService {

//   private static socketServiceInstance: SocketService | null;
//   private socket: any;
//   private static userToken: string = '';
//   public static userProfileId: string = '';

//   private constructor() {
//     this.socket = io(SOCKET_SERVER_URL, {
//       query: 'token=' + SocketService.userToken + '&profileId=' + SocketService.userProfileId,
//       transports: ['websocket'],
//     });
//   }

//   public static getInstance(): SocketService {
//     if (!SocketService.socketServiceInstance) {
//       SocketService.socketServiceInstance = new SocketService();
//     }
//     return SocketService.socketServiceInstance;
//   }

//   public static setUserToken(token: string) {
//     if (SocketService.userToken != '' && SocketService.userToken != token)
//       SocketService.socketServiceInstance = null;

//     SocketService.userToken = token;
//   }

//   public static setUserProfileId(id: string) {
//     SocketService.userProfileId = id;
//   }

//   public getSocket() {
//     return this.socket;
//   }

//   public connectSocket() {
//     let socket = SocketService.getInstance().getSocket();
//     socket.connect();
//     return new Promise((resolve, reject) => {
//       socket.on('connect', () => {
//         WebStoreProviderService.getStore().dispatch(updateSocketStatus(SocketConstants.SOCKETIO_CONNECT));
//         resolve(socket);
//       });
//       socket.on('error', (e: any) => {
//         reject(socket)
//       });
//     });
//   }

//   public disconnectSocket() {
//     let socket = SocketService.getInstance().getSocket();
//     socket.disconnect();
//   }

//   public postMessageCallback = (result: any, resolve: any, reject: any) => {
//     if (SocketService.socketServiceInstance && SocketService.socketServiceInstance.isEventSuccess(result)) {
//       let message: MessageModel = new MessageModel();
//       try {
//         message = ObjectMapper.deserialize(MessageModel, result.data.message);
//         message.setSent(true);
//         message.setPending(false);
//         resolve(message);
//       } catch (e) {
//         reject(e.message);
//       }
//     } else {
//       reject(result.data.error);
//     }
//   }

//   public postMessage(message: IPostMessage) {

//     let eventData = {
//       message: message,
//     };

//     return new Promise((resolve, reject) => {
//       SocketService.getInstance().getSocket().emit('postMessage', eventData, (result: any) => SocketService.getInstance().postMessageCallback(result, resolve, reject));
//     });
//   }

//   public getConversationsCallback = (result: any, resolve: any, reject: any) => {

//     if (SocketService.socketServiceInstance && SocketService.socketServiceInstance.isEventSuccess(result)
//       && result.data && result.data.conversations) {
//       const modeledConversations = result.data.conversations.map((item: IConversation) => {
//         try {
//           const conversation = ObjectMapper.deserialize(ConversationModel, item);
//           if (item.lastMessage){
//             const lastMessage = ObjectMapper.deserialize(MessageModel, item.lastMessage)
//             conversation.setLastMessage(lastMessage);
//           }
//           if (item.metadata) {
//             const metadata = ObjectMapper.deserialize(MetaData, item.metadata);
//             conversation.setMetadata(metadata)
//           }
//           return conversation;
//         } catch (e) {
//         }
//       }).filter((item: IConversation) => item !== undefined);

//       resolve(modeledConversations);
//     } else {
//       reject(result.error);
//     }
//   }

//   public getConversations(page: number, limit: number) {
//     const eventData = {
//       profileId: SocketService.userProfileId,
//       page,
//       limit,
//     };

//     return new Promise((resolve, reject) => {
//       SocketService.getInstance().getSocket().emit('getConversations', eventData, (result: any) => SocketService.getInstance().getConversationsCallback(result, resolve, reject));
//     });
//   }


//   public getMessagesCallback = (result: any, resolve: any, reject: any) => {

//     if (SocketService.socketServiceInstance && SocketService.socketServiceInstance.isEventSuccess(result)) {
//       let messages = result.data.messages;
//       let modeledMessages = messages.map((item: IMessage) => {
//         try {
//           let message = ObjectMapper.deserialize(MessageModel, item);
//           return message;
//         } catch (e) {
//         }
//       }).filter((item: IMessage) => item !== undefined);

//       resolve(modeledMessages);
//     } else {
//       reject(result.data.error);
//     }
//   }


//   public getMessages(messageSpecification: IFetchMessagesSpecification) {
//     let eventData = messageSpecification;
//     return new Promise((resolve, reject) => {
//       SocketService.getInstance().getSocket().emit('getMessages', eventData, (result: any) => SocketService.getInstance().getMessagesCallback(result, resolve, reject));
//     });
//   }


//   public readRecieptCallback = (result: any, resolve: any, reject: any) => {

//     if (SocketService.socketServiceInstance && SocketService.socketServiceInstance.isEventSuccess(result)
//       && result.data && result.data.conversations) {
//       try {
//         const conversationRes = result.data.conversations;
//         const conversation = ObjectMapper.deserialize(ConversationModel, conversationRes);
//         if (conversationRes.lastMessage) {
//           const lastMessage = ObjectMapper.deserialize(MessageModel, conversationRes.lastMessage);
//           conversation.setLastMessage(lastMessage);
//         }
//         if (conversationRes.metadata) {
//           const metadata = ObjectMapper.deserialize(MetaData, conversationRes.metadata);
//           conversation.setMetadata(metadata)
//         }
//         resolve(conversation);
//       } catch (e) {
//         reject(e.message);
//       }
//     } else {
//       reject(result.data.error);
//     }
//   }

//   public readReceipt(read: IRead) {
//     const eventData = read;
//     return new Promise((resolve, reject) => {
//       SocketService.getInstance().getSocket().emit('readReceipt', eventData, (result: any) => SocketService.getInstance().readRecieptCallback(result, resolve, reject));
//     });
//   }

//   public isEventSuccess = (eventResult: any): boolean => {
//     return eventResult.status === 'SUCCESS';
//   }



//   public createSocketChannel(socket: any): any {
//     return eventChannel(emit => {
//       socket.on(SocketConstants.SOCKETIO_CONNECT, () => {
//         emit(updateSocketStatus(SocketConstants.SOCKETIO_CONNECT));
//       });
//       socket.on(SocketConstants.SOCKETIO_CONNECT_ERROR, (error: any) => {
//         emit(updateSocketStatus(SocketConstants.SOCKETIO_CONNECT_ERROR, error));
//       });
//       socket.on(SocketConstants.SOCKETIO_DISCONNECT, (data: any) => {
//         emit(updateSocketStatus(SocketConstants.SOCKETIO_DISCONNECT, data));
//       });
//       socket.on(SocketConstants.SOCKETIO_ERROR, function (data: any) {
//         if(data === SocketConstants.SOCKETIO_INVALID_TOKEN) {
//           emit(getRefreshedToken());
//           return;
//         }
//         emit(updateSocketStatus(SocketConstants.SOCKETIO_ERROR, data));
//       });
//       socket.on(SocketConstants.SOCKETIO_CONNECT_TIMEOUT, function (data: any) {
//         emit(updateSocketStatus(SocketConstants.SOCKETIO_CONNECT_TIMEOUT, data));
//       });
//       socket.on(SocketConstants.SOCKETIO_RECONNECT, function (data: any) {
//         emit(updateSocketStatus(SocketConstants.SOCKETIO_RECONNECT, data));
//       });
//       socket.on(SocketConstants.SOCKETIO_RECONNECTING, function (reconnect_attempt: any) {
//         if (reconnect_attempt <= 5)
//           emit(updateSocketStatus(SocketConstants.SOCKETIO_RECONNECTING, reconnect_attempt));
//         else
//           emit(stopSocket());

//       });
//       socket.on(SocketConstants.SOCKETIO_RECONNECT_ERROR, function (data: any) {
//         emit(updateSocketStatus(SocketConstants.SOCKETIO_RECONNECT_ERROR, data));
//       });
//       socket.on(SocketConstants.SOCKETIO_RECONNECT_FAILED, function (data: any) {
//         emit(updateSocketStatus(SocketConstants.SOCKETIO_RECONNECT_FAILED, data));
//       });


//       socket.on(SocketConstants.SOCKETIO_RECEIVED_MESSAGE, (data: { message: IMessage }) => {
//         try {
//           let modeledReceivedMessage = ObjectMapper.deserialize(MessageModel, data.message);
//           emit(receivedMessage(modeledReceivedMessage));
//         } catch (e) {
//         }

//       });


//       // Specific event that will be used to kill socket
//       socket.on(SocketConstants.KILL_WEBSOCKET, () => {
//         // This will call unsubscribe function
//         emit(END);
//       });

//       const unsubscribe = () => {
//         // eventTypes.map((eventType) => {
//         //   socket.off(eventType);
//         // });
//         socket.off(SocketConstants.KILL_WEBSOCKET);
//         socket.close();
//       };

//       return unsubscribe;
//     });
//   }
// }

