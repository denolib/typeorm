import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";
import {Index} from "../../../../src/decorator/Index.ts";
import {OneToOne} from "../../../../src/decorator/relations/OneToOne.ts";
import {JoinColumn} from "../../../../src/decorator/relations/JoinColumn.ts";
import {User} from "./User.ts";

@Entity()
@Index("table_index_userId_mid", (post: Item) => [post.userId, post.mid])
export class Item {

    @PrimaryGeneratedColumn()
    postId!: number;

    @OneToOne(type => User, users => users.userId)
    @JoinColumn({ name: "userId" })
    userData!: User;

    @Column({ type: "int"})
    userId!: number;

    @Column({ type: "int" })
    mid!: number;

}
