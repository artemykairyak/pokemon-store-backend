import { Module } from '@nestjs/common';
import { TokenTypesService } from './token-types.service';
import { TokenTypesResolver } from './token-types.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenType } from './entities/token-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TokenType])],
  providers: [TokenTypesResolver, TokenTypesService],
  exports: [TokenTypesService],
})
export class TokenTypesModule {}
