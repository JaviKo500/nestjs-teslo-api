import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Socket } from 'socket.io';

@WebSocketGateway({
  cors: true,
})
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly messagesWsService: MessagesWsService) {}
  
  
  handleConnection( client: Socket ) {
    console.log('<--------------- JK Messages-ws.gateway --------------->');
    console.log(client.id);
  }

  handleDisconnect( client: Socket ) {
    console.log('<--------------- JK Messages-ws.gateway dis --------------->');
    console.log(client.id);
  }

}
