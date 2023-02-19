import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Card } from '../../cards/card.entity';

@Entity()
@ObjectType()
export class Author {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  picture: string;

  @OneToMany(() => Card, (card) => card.author)
  @Field((type) => [Card], { nullable: true })
  cards?: Card[];
}
