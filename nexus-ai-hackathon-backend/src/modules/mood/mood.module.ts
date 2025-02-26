import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MoodController } from './mood.controller';
import { MoodService } from './mood.service';
import { Mood } from './mood.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Mood', schema: Mood.schema }])
  ],
  controllers: [MoodController],
  providers: [MoodService],
  exports: [MoodService]
})
export class MoodModule {} 