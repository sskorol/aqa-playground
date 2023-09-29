import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { hashSync } from 'bcrypt';

@Entity('users')
@Index(['accountId', 'email'], { unique: true })
export class User {
  @PrimaryGeneratedColumn()
  @PrimaryColumn({
    type: 'integer',
    nullable: false,
    primary: true,
    name: 'account_id',
  })
  accountId: number;

  @PrimaryColumn({
    type: 'varchar',
    length: 256,
    nullable: false,
    primary: true,
  })
  email: string;

  @Column({ type: 'varchar', length: 256, nullable: false, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 256, nullable: false })
  password: string;

  @BeforeInsert()
  hashPassword() {
    this.password = hashSync(this.password, 10);
  }
}
