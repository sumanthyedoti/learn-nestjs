import { User } from 'src/auth/user.entity'
import { TaskStatus } from 'src/tasks/types'
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column()
  description: string

  @Column()
  status: TaskStatus

  @ManyToOne(() => User, (user) => user.tasks, { eager: true })
  user: User

  @Column()
  userid: number
}
