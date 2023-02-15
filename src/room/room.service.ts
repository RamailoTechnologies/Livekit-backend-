import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { AccessToken, RoomServiceClient } from 'livekit-server-sdk';
import { ConfigService } from '@nestjs/config';
import { Room } from './entity/room.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HandRaiseDto } from './dto/HandRaise.dto';
import { HttpService } from '@nestjs/axios';
import { canPublishPremissionDto } from './dto/Canpublish.dto';

@Injectable()
export class RoomService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  async create(input: CreateRoomDto) {
    const apiKey = await this.configService.get('apikey');
    const secretKey = await this.configService.get('secretkey');
    const metadata = JSON.stringify({ raised: [] });
    const ttl = await this.configService.get('ttl');

    if (!input.user || !input.room)
      throw new BadRequestException('Please pass required data');

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

  async UpdateHandRaise(input: HandRaiseDto) {
    const apiKey = await this.configService.get('apikey');
    const secretKey = await this.configService.get('secretkey');
    const host = await this.configService.get('host');

    const { roomId, userId } = input;
    const metadata = JSON.stringify({ raised: [`${userId}`] });
    console.log(metadata);

    const at = new RoomServiceClient(host, apiKey, secretKey);
    at.updateRoomMetadata(roomId, metadata);
    return { message: `${userId} has Raise the Hand`, raised: true };
  }

  async canPublishPremission(input: canPublishPremissionDto) {
    const { roomId, identity } = input;

    const apiKey = await this.configService.get('apikey');
    const secretKey = await this.configService.get('secretkey');
    const host = await this.configService.get('host');
    const at = new RoomServiceClient(host, apiKey, secretKey);
    at.updateParticipant(roomId, identity, undefined, {
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
      hidden: false,
      recorder: false,
    });

    return { message: `${identity} got premission to canPublish` };
  }
}
