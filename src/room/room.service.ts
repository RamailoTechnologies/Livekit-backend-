import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { AccessToken, RoomServiceClient } from 'livekit-server-sdk';
import { ConfigService } from '@nestjs/config';
import { Room } from './entity/room.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HandRaiseDto } from './dto/HandRaise.dto';
import { HttpService } from '@nestjs/axios';
import { canPublishPremissionDto } from './dto/Canpublish.dto';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class RoomService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  async create(input: CreateRoomDto) {
    const apiKey = await this.configService.get('apikey');
    const secretKey = await this.configService.get('secretkey');
    const ttl = await this.configService.get('ttl');

    if (!input.user || !input.room)
      throw new BadRequestException('Please pass required data');

    const metadata = JSON.stringify({ raides: [] });

    const participantName = input.user;
    const at = new AccessToken(apiKey, secretKey, {
      identity: participantName,
      ttl,
      metadata,
    });
    at.addGrant({
      roomJoin: true,
      canPublish: input.user == 'supervisor',
      canPublishData: true,
      canSubscribe: true,
      room: input.room,
    });
    const token = at.toJwt();
    return { 'access token': token };
  }

  async canPublishPremission(input: canPublishPremissionDto) {
    const { roomId, premissionFor, publish, supervisorToken } = input;
    const identity = premissionFor;

    const apiKey = await this.configService.get('apikey');
    const secretKey = await this.configService.get('secretkey');
    const host = await this.configService.get('host');

    const checkSupervisor = await this.verify(
      supervisorToken,
      apiKey,
      secretKey,
    );
    if (checkSupervisor.jti !== 'supervisor') {
      throw new UnauthorizedException(
        'only supervisor can access this endpoint',
      );
    }
    const at = new RoomServiceClient(host, apiKey, secretKey);
    at.updateParticipant(roomId, identity, undefined, {
      canPublish: !publish,
      canSubscribe: true,
      canPublishData: true,
      hidden: false,
      recorder: false,
    });

    // return { message: `${identity} got premission to canPublish` };
    return {
      message: ` Permission ${
        publish ? 'granted' : 'revoked'
      } for ${identity} `,
    };
  }

  verify(token: string, apiKey, secretkey) {
    try {
      const decoded = jwt.verify(token, secretkey, { issuer: apiKey });
      if (!decoded) {
        throw Error('invalid token');
      }
      return decoded;
    } catch {
      throw new BadRequestException('Token Invalid');
    }
  }
}
