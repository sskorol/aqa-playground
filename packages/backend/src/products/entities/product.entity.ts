import {
  Column,
  Entity,
  Index,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('products')
@Index(['id', 'title'], { unique: true })
export class Product {
  @PrimaryGeneratedColumn()
  @PrimaryColumn({
    type: 'integer',
    nullable: false,
    primary: true,
    name: 'product_id',
  })
  id: number;

  @PrimaryColumn({
    type: 'varchar',
    length: 256,
    nullable: false,
    primary: true,
  })
  title: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: false })
  price: number;

  @Column({ type: 'integer', nullable: false })
  quantity: number;

  @Column({ type: 'varchar', length: 1024, nullable: false })
  description: string;

  @Column({ type: 'varchar', length: 512, nullable: false })
  image: string;
}
