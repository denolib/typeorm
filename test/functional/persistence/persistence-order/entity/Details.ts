import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {OneToOne} from "../../../../../src/decorator/relations/OneToOne.ts";
import {Post} from "./Post.ts";
import {Photo} from "./Photo.ts";
import {JoinColumn} from "../../../../../src/decorator/relations/JoinColumn.ts";

@Entity()
export class Details {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    title!: string;

    @OneToOne(type => Post, post => post.details)
    post!: Post;

    @OneToOne(type => Photo, photo => photo.details, {
        nullable!: false
    })
    @JoinColumn()
    photo!: Photo;

}
