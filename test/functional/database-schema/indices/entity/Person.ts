import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {Index} from "../../../../../src/decorator/Index.ts";

@Entity()
@Index("IDX_TEST", ["firstname", "lastname"])
export class Person {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    firstname: string;

    @Column({ type: String })
    lastname: string;

}
