import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Token } from '../tokens/token.entity';
import { Link } from '../links/entities/link.entity';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => Int, { nullable: true })
  id: number;

  @Column()
  @Field({ nullable: true })
  username: string;

  @Column()
  @Field()
  password: string;

  @Column()
  @Field()
  email: string;

  @Column()
  @Field()
  bio: string;

  @Column()
  @Field()
  boughtTokensCount: number;

  @Column()
  @Field()
  createdTokensCount: number;

  @OneToMany(() => Token, (token) => token.owner)
  @Field(() => [Token], { nullable: true })
  ownedTokens?: Token[];

  @OneToMany(() => Token, (token) => token.author)
  @Field(() => [Token], { nullable: true })
  authoredTokens?: Token[];

  @OneToMany(() => Link, (link) => link.user)
  @Field(() => [Link], { nullable: true })
  links?: Link[];
}
