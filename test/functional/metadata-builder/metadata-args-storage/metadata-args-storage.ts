import {Post} from "./entity/Post.ts";
import {ContentModule} from "./entity/ContentModule.ts";
import {Unit} from "./entity/Unit.ts";
import {MetadataUtils} from "../../../../src/metadata-builder/MetadataUtils.ts";
import "../../../deps/chai.ts";
import {runIfMain} from "../../../deps/mocha.ts";

describe("metadata builder > MetadataArgsUtils", () => {

    it("getInheritanceTree", () => {
        const inheritanceTree = MetadataUtils.getInheritanceTree(Post);
        inheritanceTree.should.be.eql([
            Post,
            ContentModule,
            Unit,
        ]);
    });

    it("filterByTargetClasses", () => {
        MetadataUtils.filterByTarget([
            { },
            { target: undefined },
            { target: null },
            { target: 1 },
            { target: "" },
            { target: Post },
            { target: ContentModule },
            { target: Unit },
        ], [Post, Unit]).should.be.eql([
            { target: Post },
            { target: Unit },
        ]);

        MetadataUtils.filterByTarget([
            { },
            { target: undefined },
            { target: null },
            { target: 1 },
            { target: "" },
            { target: ContentModule },
            { target: Unit },
        ], [Post, Unit]).should.be.eql([
            { target: Unit },
        ]);

        MetadataUtils.filterByTarget([
            { },
            { target: undefined },
            { target: null },
            { target: 1 },
            { target: "" },
            { target: ContentModule },
            { target: Post },
            { target: Unit },
        ], [Post, Unit, ContentModule]).should.be.eql([
            { target: ContentModule },
            { target: Post },
            { target: Unit },
        ]);

        MetadataUtils.filterByTarget([
        ], [Post, Unit, ContentModule]).should.be.eql([
        ]);

        MetadataUtils.filterByTarget([
            { },
            { target: undefined },
            { target: null },
            { target: 1 },
            { target: "" },
            { target: ContentModule },
            { target: Post },
            { target: Unit },
        ]).should.be.eql([
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

runIfMain(import.meta);
