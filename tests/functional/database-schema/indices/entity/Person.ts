import {Entity} from "../../../../../src";
import {PrimaryGeneratedColumn} from "../../../../../src";
import {Column} from "../../../../../src";
import {Index} from "../../../../../src/decorator";

@Entity()
@Index("IDX_TEST", ["firstname", "lastname"])
export class Person {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstname: string;

    @Column()
    lastname: string;

}
