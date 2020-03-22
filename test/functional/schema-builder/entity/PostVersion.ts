import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";
import {ManyToOne} from "../../../../src/decorator/relations/ManyToOne.ts";
import {JoinColumn} from "../../../../src/index.ts";
import {PrimaryColumn} from "../../../../src/decorator/columns/PrimaryColumn.ts";
import {Post} from "./Post.ts";

@Entity()
export class PostVersion {

    @PrimaryColumn({ type: Number })
    id!: number;

    @ManyToOne(type => Post)
    @JoinColumn({ referencedColumnName: "version" })
    post!: Post;

    @Column({ type: String })
    details!: string;

}
