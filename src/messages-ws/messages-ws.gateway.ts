import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadInterface } from 'src/auth/interfaces';

@WebSocketGateway({
  cors: true,
})
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() wss: Server;

  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService,
  ) {}
  
  
  handleConnection( client: Socket ) {

    try {
      const token = client.handshake.headers.authentication as string ?? '';
      let payload: JwtPayloadInterface = this.jwtService.verify( token );
      console.log('<--------------- JK Messages-ws.gateway --------------->');
      console.log(payload); 
      this.messagesWsService.registerClient( client );
      this.wss.emit( 'clients-updated', this.messagesWsService.getConnectedClients() );
    } catch (error) {
      client.disconnect();
      return;
    }
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
