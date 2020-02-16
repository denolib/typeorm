import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";
import {Category} from "./Category.ts";
import {JoinColumn} from "../../../../src/decorator/relations/JoinColumn.ts";
import {OneToOne} from "../../../../src/decorator/relations/OneToOne.ts";
import {PostMetadata} from "./PostMetadata.ts";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    title: string;

    @OneToOne(type => Category, { cascade: true })
    @JoinColumn()
    category: Category|null;

    @OneToOne(type => PostMetadata, metadata => metadata.post, { cascade: true })
    @JoinColumn()
    metadata: PostMetadata|null;

}
