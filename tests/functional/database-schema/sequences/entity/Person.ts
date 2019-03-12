import {Entity} from "../../../../../src";
import {PrimaryGeneratedColumn} from "../../../../../src";
import {Column} from "../../../../../src";

@Entity()
export class Person {

    @PrimaryGeneratedColumn()
    Id: number;

    @Column({ unique: true })
    Name: string;

}
