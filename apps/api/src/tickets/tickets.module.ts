import { Module } from '@nestjs/common';
import { ResourceAuthorizationService } from '../common/services/resource-authorization.service';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';

@Module({
  controllers: [TicketsController],
  providers: [TicketsService, ResourceAuthorizationService],
  exports: [TicketsService, ResourceAuthorizationService],
})
export class TicketsModule {}
