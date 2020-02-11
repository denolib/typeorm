import {EntitySchema} from "../../../../../src/index.ts";
import {Category} from "../model/Category.ts";

export const CategoryEntity = new EntitySchema<Category>({
    name: "category",
    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true
        },
        name: {
            type: String
        }
    }
});
