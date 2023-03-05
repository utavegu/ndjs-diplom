import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersManagementModule } from './modules/users-management/users-management.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongo:27017', {
      user: 'root',
      pass: 'example',
      dbName: 'hotels-aggregator',
    }),
    UsersModule,
    AuthModule,
    UsersManagementModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
