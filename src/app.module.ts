import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { FotosModule } from './fotos/fotos.module.js';

@Module({
  imports: [FotosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
