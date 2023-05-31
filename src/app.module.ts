import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { QueryModule } from './query/query.module';
import { TrainModule } from './train/train.module';

@Module({
  imports: [UsersModule, QueryModule, TrainModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
