import "reflect-metadata";
import {Post} from "./entity/Post";
import {ContentModule} from "./entity/ContentModule";
import {Unit} from "./entity/Unit";
import {MetadataUtils} from "../../../../src/metadata-builder/MetadataUtils";

describe("metadata builder > MetadataArgsUtils", () => {

    test("getInheritanceTree", () => {
        const inheritanceTree = MetadataUtils.getInheritanceTree(Post);
        expect(inheritanceTree).toEqual([
            Post,
            ContentModule,
            Unit,
        ]);
    });

    test("filterByTargetClasses", () => {
        expect(MetadataUtils.filterByTarget([
            { },
            { target: undefined },
            { target: null },
            { target: 1 },
            { target: "" },
            { target: Post },
            { target: ContentModule },
            { target: Unit },
        ], [Post, Unit])).toEqual([
            { target: Post },
            { target: Unit },
        ]);

        expect(MetadataUtils.filterByTarget([
            { },
            { target: undefined },
            { target: null },
            { target: 1 },
            { target: "" },
            { target: ContentModule },
            { target: Unit },
        ], [Post, Unit])).toEqual([
            { target: Unit },
        ]);

        expect(MetadataUtils.filterByTarget([
            { },
            { target: undefined },
            { target: null },
            { target: 1 },
            { target: "" },
            { target: ContentModule },
            { target: Post },
            { target: Unit },
        ], [Post, Unit, ContentModule])).toEqual([
            { target: ContentModule },
            { target: Post },
            { target: Unit },
        ]);

        expect(MetadataUtils.filterByTarget([
        ], [Post, Unit, ContentModule])).toEqual([
        ]);

        expect(MetadataUtils.filterByTarget([
            { },
            { target: undefined },
            { target: null },
            { target: 1 },
            { target: "" },
            { target: ContentModule },
            { target: Post },
            { target: Unit },
        ])).toEqual([
            { },
            { target: undefined },
            { target: null },
            { target: 1 },
            { target: "" },
            { target: ContentModule },
            { target: Post },
            { target: Unit },
        ]);
    });

});
