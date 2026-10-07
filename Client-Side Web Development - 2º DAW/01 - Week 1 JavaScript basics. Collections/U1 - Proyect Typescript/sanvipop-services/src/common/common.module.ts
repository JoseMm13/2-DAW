import { Module } from '@nestjs/common';
import { ImageService } from './services/image/image.service.js';
import { FirebaseService } from './services/firebase/firebase.service.js';

@Module({
  providers: [ImageService, FirebaseService],
  exports: [ImageService, FirebaseService],
})
export class CommonModule {}

