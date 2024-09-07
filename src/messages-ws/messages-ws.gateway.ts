import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';

@WebSocketGateway({
  cors: true,
})
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() wss: Server;

  constructor(private readonly messagesWsService: MessagesWsService) {}
  
  
  handleConnection( client: Socket ) {
    this.messagesWsService.registerClient( client );
    this.wss.emit( 'clients-updated', this.messagesWsService.getConnectedClients() );
  }
  
  handleDisconnect( client: Socket ) {
    this.messagesWsService.removeClient( client.id );
    this.wss.emit( 'clients-updated', this.messagesWsService.getConnectedClients() );
  }

  // message-from-client

  @SubscribeMessage( 'message-from-client' )
  handleMessageFromClient( client: Socket, payload: NewMessageDto ) {
    console.log('<--------------- JK Messages-ws.gateway --------------->');
    console.log(client.id );
    console.log(payload);
    // only emit client
    // client.emit( 'message-from-client', { 
    //   fullName: 'Test',
    //   message: payload.message ?? 'No message received'
    // });
    // emit all minus client
    // client.broadcast.emit( 'message-from-client', { 
    //   fullName: 'Test',
    //   message: payload.message ?? 'No message received'
    // });

    // all
    this.wss.emit( 'message-from-client', { 
      fullName: 'Test',
      message: payload.message ?? 'No message received'
    });
  }

}
