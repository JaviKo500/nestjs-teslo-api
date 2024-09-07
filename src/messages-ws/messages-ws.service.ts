import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

interface ConnectedClients {
    [id:string]: Socket;
}
@Injectable()
export class MessagesWsService {

    private connectClients: ConnectedClients = {};

    /**
     * registerClient
     */
    public registerClient( client: Socket ) {
        this.connectClients[client.id] = client;
    }

    /**
     * removeClient
     */
    public removeClient( clientId ) {
        delete this.connectClients[clientId];
    }

    /**
     * getConnectedClients
     */
    public getConnectedClients(): number {
        return Object.keys( this.connectClients ).length;
    }
}
