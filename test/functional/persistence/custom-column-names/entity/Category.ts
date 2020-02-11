import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Post} from "./Post.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {OneToMany} from "../../../../../src/decorator/relations/OneToMany.ts";
import {OneToOne} from "../../../../../src/decorator/relations/OneToOne.ts";
import {JoinColumn} from "../../../../../src/decorator/relations/JoinColumn.ts";
import {CategoryMetadata} from "./CategoryMetadata.ts";

@Entity()
export class Category {

    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(type => Post, post => post.category)
    posts: Post[];

    @Column({ type: "int", nullable: true })
    metadataId: number;

    @OneToOne(type => CategoryMetadata, metadata => metadata.category, {
        cascade: ["insert"]
    })
    @JoinColumn({ name: "metadataId" })
    metadata: CategoryMetadata;

    @Column({ type: String })
    name: string;

}
