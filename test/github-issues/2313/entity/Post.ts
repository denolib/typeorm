import {BaseEntity, Entity, PrimaryGeneratedColumn, Column} from "../../../../src/index.ts";

@Entity()
export class Post extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: Number })
    data: number;
}
