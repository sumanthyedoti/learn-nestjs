import { User } from 'src/users/user.entity'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Car {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  make: string

  @Column()
  model: string

  @Column()
  price: number

  @Column()
  year: number

  @Column()
  lng: number

  @Column()
  lat: number

  @Column()
  mileage: number

  @Column({ default: false })
  approved: boolean

  @ManyToOne(() => User, (user) => user.reports)
  user: User
}
