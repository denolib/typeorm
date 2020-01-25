import {getMetadataArgsStorage} from "../../index.ts";
import {RelationMetadataArgs} from "../../metadata-args/RelationMetadataArgs.ts";

/**
 * Marks a entity property as a parent of the tree.
 * "Tree parent" indicates who owns (is a parent) of this entity in tree structure.
 */
export function TreeParent(): Function {
    return function (object: Object, propertyName: string) {

        getMetadataArgsStorage().relations.push({
            isTreeParent: true,
            target: object.constructor,
            propertyName: propertyName,
            isLazy: false,
            relationType: "many-to-one",
            type: () => object.constructor,
            options: {}
        } as RelationMetadataArgs);
    };
}
