import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Author } from '../authors/entities/author.entity';

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

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 })
  @Field((type) => Float, { nullable: true })
  price?: number;

  @Column()
  @Field((type) => Int)
  authorId: number;

  @ManyToOne(() => Author, (author) => author.cards)
  @Field((type) => Author)
  author: Author;
}
