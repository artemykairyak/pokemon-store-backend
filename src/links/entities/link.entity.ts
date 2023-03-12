import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { LinkType } from '../../link-types/entities/link-type.entity';

@Entity()
@ObjectType()
export class Link {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  title: string;

  @Column()
  @Field()
  url: string;

  @ManyToOne(() => LinkType)
  @Field(() => LinkType)
  type: LinkType;
}
