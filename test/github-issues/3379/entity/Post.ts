import {Index, PrimaryGeneratedColumn} from "../../../../src/index.ts";
import {Column} from "../../../../src/index.ts";
import {Entity} from "../../../../src/index.ts";

@Index("name_index", ["name"])
@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    name: string;

}
