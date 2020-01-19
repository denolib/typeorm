import {RelationCountAttribute} from "./RelationCountAttribute.ts";

export interface RelationCountLoadResult {
    relationCountAttribute: RelationCountAttribute;
    results: { cnt: any, parentId: any }[];
}
