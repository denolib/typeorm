import {Category} from "./Category.ts";

export interface Post {

    id: number;
    title: string;
    text: string;
    categories: Category[];

}
