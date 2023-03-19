import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { TokenType } from '../token-types/entities/token-type.entity';

@Entity()
@ObjectType()
export class Token {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  picture: string;

  @Column()
  @Field()
  description?: string;

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 })
  @Field(() => Float, { nullable: true })
  price: number;

  @ManyToOne(() => TokenType, (type) => type.tokens)
  @Field(() => TokenType)
  type: TokenType;

  @ManyToOne(() => User, (user) => user.ownedTokens)
  @Field(() => User)
  owner?: User;

  @ManyToOne(() => User, (user) => user.authoredTokens)
  @Field(() => User)
  author: User;
}
