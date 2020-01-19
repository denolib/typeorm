import {Query} from "./Query.ts";

/**
 * This class stores up and down queries needed for migrations functionality.
 */
export class SqlInMemory {
    upQueries: Query[] = [];
    downQueries: Query[] = [];
}
