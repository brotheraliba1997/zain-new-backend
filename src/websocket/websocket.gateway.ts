// import {
//   WebSocketGateway,
//   SubscribeMessage,
//   MessageBody,
//   ConnectedSocket,
//   OnGatewayConnection,
//   OnGatewayDisconnect,
//   WebSocketServer,
// } from '@nestjs/websockets';
// import { Socket } from 'socket.io';
// import { MeetingRoomService } from 'src/meetingRoom/meetingRoom.service';

// @WebSocketGateway({ cors: true }) // CORS allow karna zaroori hai agar frontend alag server pe hai
// export class WebsocketGateway
//   implements OnGatewayConnection, OnGatewayDisconnect
// {
//   constructor(private meetingRoomService: MeetingRoomService) {}

//   @WebSocketServer()
//   socket: Socket;
//   private clients = new Map<string, Socket>();

//   handleConnection(client: Socket) {
//     const userId = client.handshake.query.userId as string;
//     if (userId) {
//       this.clients.set(userId, client);
//       console.log(`User ${userId} connected.`);
//     }
//     console.log(`User  connected.`);
//   }

//   handleDisconnect(client: Socket) {
//     for (const [userId, socket] of this.clients.entries()) {
//       if (socket.id === client.id) {
//         this.clients.delete(userId);
//         console.log(`User ${userId} disconnected.`);
//         break;
//       }
//     }
//     console.log(`User disconnected.`);
//   }

//   sendNotification(userIds: string[], message: any) {
//     userIds.forEach((userId) => {
//       const userSocket = this.clients.get(userId);
//       if (userSocket) {
//         return userSocket.emit('newNotification', {
//           status: 'success',
//           data: message,
//           message: 'New message received',
//         });
//       }
//     });
//   }

//   @SubscribeMessage('sendMessage')
//   handleMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
//     // console.log(`Message from `, data);
//     client.emit('sendMessage', data);
//   }

//   @SubscribeMessage('joinRoom') // sever
//   handleJoinRoom(client: Socket, data: any) {
//     // console.log("join room");

//     if (!data.chatId) {
//       return {
//         status: 'error',
//         message: 'chat id is requried',
//       };
//     }
//     client.join(data.chatId);

//     return {
//       status: 'success',
//       message: 'Room join Successfully',
//     };
//   }

//   async receiveMessage(data: any) {
//     console.log(data);
//     return this.socket.to(data.chatId).emit('newMessage', {
//       status: 'success',
//       data: data,
//       message: 'new message received',
//     });
//   }

//   @SubscribeMessage('startTyping')
//   handleStartTyping(client: Socket, data: any) {
//     // console.log("typing data==>", data);
//     this.socket.to(data.chatId).emit('userStartTyping', {
//       status: 'success',
//       message: `${data.name} is typing...`,
//     });
//   }

//   @SubscribeMessage('stopTyping')
//   handleStopTyping(client: Socket, data: any) {
//     // console.log("typing data==>", data);
//     this.socket.to(data.chatId).emit('userStopTyping', {
//       status: 'success',
//       message: `${data.name} stop typing...`,
//     });
//   }

//   // Meeting sockets

//   @SubscribeMessage('joinMeeting')
//   async handleJoinMeetingRoom(client: Socket, data: any) {
//     console.log('join meeting');

//     if (!data.meetingId) {
//       return {
//         status: 'error',
//         message: 'Meeting id is requried',
//       };
//     }
//     client.join(data.meetingId);

//     const payload = {
//       userId: data.userId ?? '',
//       userName: data.userName ?? '',
//       uid: data.uid ?? '',
//       logType: 'JOIN',
//       logMessage: 'User Joined',
//     };

//     await this.meetingRoomService.createMeetingParticipant({
//       meetingRoomId: data.meetingId,
//       payload,
//     });
//     const meetingRoom = await this.meetingRoomService.findActiveMeetingById(
//       data.meetingId,
//     );

//     return {
//       status: 'success',
//       message: 'Meeting joined Successfully',
//       data: meetingRoom,
//     };
//   }

//   @SubscribeMessage('leaveMeeting')
//   async handleLeaveMeetingRoom(client: Socket, data: any) {
//     console.log('leave meeting');

//     if (!data.meetingId) {
//       return {
//         status: 'error',
//         message: 'Meeting id is requried',
//       };
//     }
//     client.leave(data.meetingId);

//     const payload = {
//       userId: data.userId ?? '',
//       userName: data.userName ?? '',
//       uid: data.uid ?? '',
//       logType: 'Leave',
//       logMessage: 'User Left',
//     };

//     await this.meetingRoomService.createMeetingParticipant({
//       meetingRoomId: data.meetingId,
//       payload,
//     });

//     return {
//       status: 'success',
//       message: 'Meeting joined Successfully',
//     };
//   }

//   @SubscribeMessage('diconnectMeeting')
//   async handleDisconnectMeetingRoom(client: Socket, data: any) {
//     console.log('disconnect meeting');

//     if (!data.meetingId) {
//       return {
//         status: 'error',
//         message: 'Meeting id is requried',
//       };
//     }
//     client.leave(data.meetingId);

//     const payload = {
//       userId: data.userId ?? '',
//       userName: data.userName ?? '',
//       uid: data.uid ?? '',
//       logType: 'Disconnect',
//       logMessage: 'User Disconnect',
//     };

//     await this.meetingRoomService.removeMeetingParticipant({
//       meetingRoomId: data.meetingId,
//       payload,
//     });

//     return {
//       status: 'success',
//       message: 'Meeting joined Successfully',
//     };
//   }

//   @SubscribeMessage('getMeetingParticipants')
//   async handleMeetingRoomParticipants(client: Socket, data: any) {
//     // console.log("join room");

//     if (!data.meetingId) {
//       return {
//         status: 'error',
//         message: 'Meeting id is requried',
//       };
//     }

//     const meetingParticipants =
//       await this.meetingRoomService.getMeetingParticipants(data.meetingId);

//     return {
//       status: 'success',
//       message: 'Meeting participants fetched successfully',
//       data: meetingParticipants,
//     };
//   }

//   async sendMeetingMessage(data: any) {
//     console.log(data);
//     return this.socket.to(data.meetingRoomId).emit('newMeetingMessage', {
//       status: 'success',
//       data: data,
//       message: 'New message received',
//     });
//   }
// }
