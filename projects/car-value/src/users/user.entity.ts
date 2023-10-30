import { Exclude } from 'class-transformer'
import { Car } from 'src/cars/car.entity'
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  email: string

  @Column({ default: true })
  admin: boolean

  @Column()
  @Exclude()
  password: string

  @OneToMany(() => Car, (report) => report.user)
  reports: Car[]

  @AfterInsert()
  logInsert() {
    console.log('Inserted user with id:', this.id)
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated user with id:', this.id)
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed user with id:', this.id)
  }
}
