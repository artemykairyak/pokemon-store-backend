import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Card {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column()
  @Field()
  picture: string;

  @Column()
  @Field()
  name: string;

  @Column({ nullable: true })
  @Field((type) => Float, { nullable: true })
  price?: number;
}
