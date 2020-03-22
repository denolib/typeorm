import {EntitySchemaOptions} from "../../../../src/entity-schema/EntitySchemaOptions.ts";
import {Post} from "./Post.ts";

export class Author {
    id!: number;

    name!: string;

    posts!: Post[];
}

export const AuthorSchema: EntitySchemaOptions<Author> = {
    name!: "Author",

    target!: Author,

    columns!: {
        id: {
            primary!: true,
            type!: Number
        },

        name!: {
            type!: "varchar"
        }
    },

    relations!: {
        posts: {
            target: () => Post,
            type!: "one-to-many"
        }
    }
};
