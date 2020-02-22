import {EntitySchemaOptions} from "../../../../src/entity-schema/EntitySchemaOptions.ts";

export class Post {
    id: number;
    name: string;
    title: string;
}

export const PostSchema: EntitySchemaOptions<Post> = {
    name: "Post",
    target: Post,
    columns: {
        id: {
            primary: true,
            type: Number
        },
        name: {
            type: "varchar",
            unique: true
        },
        title: {
            type: "varchar"
        }
    }
};
