import {Column, Entity, OneToOne, PrimaryGeneratedColumn} from "../../../src/index.ts";
import {PostDetails} from "./PostDetails.ts";
import {PostCategory} from "./PostCategory.ts";
import {PostAuthor} from "./PostAuthor.ts";
import {PostInformation} from "./PostInformation.ts";
import {PostImage} from "./PostImage.ts";
import {PostMetadata} from "./PostMetadata.ts";
import {JoinColumn} from "../../../src/decorator/relations/JoinColumn.ts";

@Entity("sample2_post")
export class Post {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    title: string;

    @Column({ type: String })
    text: string;

    // post has relation with category, however inverse relation is not set (category does not have relation with post set)
    @OneToOne(type => PostCategory, {
        cascade: true
    })
    @JoinColumn()
    category: PostCategory;

    // post has relation with details. cascade inserts here means if new PostDetails instance will be set to this
    // relation it will be inserted automatically to the db when you save this Post entity
    @OneToOne(type => PostDetails, details => details.post, {
        cascade: ["insert"]
    })
    @JoinColumn()
    details: PostDetails;

    // post has relation with details. cascade update here means if new PostDetail instance will be set to this relation
    // it will be inserted automatically to the db when you save this Post entity
    @OneToOne(type => PostImage, image => image.post, {
        cascade: ["update"]
    })
    @JoinColumn()
    image: PostImage;

    // post has relation with details. cascade update here means if new PostDetail instance will be set to this relation
    // it will be inserted automatically to the db when you save this Post entity
    @OneToOne(type => PostMetadata, metadata => metadata.post)
    @JoinColumn()
    metadata: PostMetadata|null;

    // post has relation with details. full cascades here
    @OneToOne(type => PostInformation, information => information.post, {
        cascade: true
    })
    @JoinColumn()
    information: PostInformation;

    // post has relation with details. not cascades here. means cannot be persisted, updated or removed
    @OneToOne(type => PostAuthor, author => author.post)
    @JoinColumn()
    author: PostAuthor;

}
