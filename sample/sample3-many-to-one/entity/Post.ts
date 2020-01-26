import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "../../../src/index.ts";
import {PostDetails} from "./PostDetails.ts";
import {PostCategory} from "./PostCategory.ts";
import {PostAuthor} from "./PostAuthor.ts";
import {PostInformation} from "./PostInformation.ts";
import {PostImage} from "./PostImage.ts";
import {PostMetadata} from "./PostMetadata.ts";

@Entity("sample3_post")
export class Post {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    title: string;

    @Column({ type: String })
    text: string;

    // post has relation with category, however inverse relation is not set (category does not have relation with post set)
    @ManyToOne(type => PostCategory, {
        cascade: true
    })
    category: PostCategory;

    // post has relation with details. cascade inserts here means if new PostDetails instance will be set to this
    // relation it will be inserted automatically to the db when you save this Post entity
    @ManyToOne(type => PostDetails, details => details.posts, {
        cascade: ["insert"]
    })
    details: PostDetails;

    // post has relation with details. cascade update here means if new PostDetail instance will be set to this relation
    // it will be inserted automatically to the db when you save this Post entity
    @ManyToOne(type => PostImage, image => image.posts, {
        cascade: ["update"]
    })
    image: PostImage;

    // post has relation with details. cascade update here means if new PostDetail instance will be set to this relation
    // it will be inserted automatically to the db when you save this Post entity
    @ManyToOne(type => PostMetadata, metadata => metadata.posts)
    metadata: PostMetadata|null;

    // post has relation with details. full cascades here
    @ManyToOne(type => PostInformation, information => information.posts, {
        cascade: true
    })
    information: PostInformation;

    // post has relation with details. not cascades here. means cannot be persisted, updated or removed
    @ManyToOne(type => PostAuthor, author => author.posts)
    author: PostAuthor;

}
