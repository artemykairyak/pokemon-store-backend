import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Token } from '../../tokens/token.entity';

@Entity()
@ObjectType()
export class TokenType {
  @PrimaryColumn()
  @Field()
  id: string;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  picture: string;

  @OneToMany(() => Token, (token) => token.type)
  @Field(() => Token)
  tokens: Token[];
}
