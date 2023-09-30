import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Car {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  model: string;

  @Column()
  price: number

  @Column()
  year: number;
}
