import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

interface ConnectedClients {
    [id:string]: {
        socket: Socket,
        user: User,
    };
}
@Injectable()
export class MessagesWsService {

    private connectClients: ConnectedClients = {};

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {
        
    }

    /**
     * registerClient
     */
    public async registerClient( client: Socket, id: string) {
        const user = await  this.userRepository.findOneBy({ id });
        if ( !user ) throw new Error(`User not find`);
        if ( !user.isActive ) throw new Error(`User not active`);

        this.connectClients[client.id] = {
            socket: client,
            user,
        };
        
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
    public getConnectedClients(): string[] {
        return Object.keys( this.connectClients );
    }

    /**
     * getUserFullName
     */
    public getUserFullName( socketId: string ) {
        return this.connectClients[socketId].user.fullName;
    }
}
