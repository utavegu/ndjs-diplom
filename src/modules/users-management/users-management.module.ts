import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { UsersManagementController } from './users-management.controller';

@Module({
  imports: [UsersModule],
  providers: [],
  controllers: [UsersManagementController],
})
export class UsersManagementModule {}
