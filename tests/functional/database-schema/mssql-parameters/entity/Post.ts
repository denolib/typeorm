import {Entity} from "../../../../../src";
import {PrimaryColumn} from "../../../../../src";
import {Column} from "../../../../../src";
import {CreateDateColumn} from "../../../../../src";
import {UpdateDateColumn} from "../../../../../src";

@Entity()
export class Post {

    @PrimaryColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    category: string;

    @Column()
    text: string;

    @CreateDateColumn()
    createDate: Date;

    @UpdateDateColumn()
    updateDate: Date;

}
