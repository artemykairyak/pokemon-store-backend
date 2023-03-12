import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Token } from '../../tokens/token.entity';

@Entity()
@ObjectType()
export class TokenType {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

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
