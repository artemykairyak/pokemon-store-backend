import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { LinkType } from '../../link-types/entities/link-type.entity';
import { User } from '../../users/user.entity';

@Entity()
@ObjectType()
export class Link {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  url: string;

  @ManyToOne(() => LinkType)
  @Field(() => LinkType)
  type: LinkType;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;
}
