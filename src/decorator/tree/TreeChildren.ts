import {getMetadataArgsStorage, RelationOptions} from "../../index.ts";
import {RelationMetadataArgs} from "../../metadata-args/RelationMetadataArgs.ts";

/**
 * Marks a entity property as a children of the tree.
 * "Tree children" will contain all children (bind) of this entity.
 */
export function TreeChildren(options?: { cascade?: boolean|("insert"|"update"|"remove")[] }): Function {
    return function (object: Object, propertyName: string) {
        if (!options) options = {} as RelationOptions;

        // add one-to-many relation for this
        getMetadataArgsStorage().relations.push({
            isTreeChildren: true,
            target: object.constructor,
            propertyName: propertyName,
            isLazy: false,
            relationType: "one-to-many",
            type: () => object.constructor,
            options: options
        } as RelationMetadataArgs);
    };
}
