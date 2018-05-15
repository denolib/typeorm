import {Column, Entity, PrimaryGeneratedColumn} from "../../../../../src";

@Entity()
export class Tag {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

}