import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {getMetadataArgsStorage} from "../../../src/index.ts";
import {Foo} from "./entity/Foo.ts";

describe("github issues > #5004 expireAfterSeconds 0 can't be passed to Index decorator", () => {

    it("should allow expireAfterSeconds 0 to be passed to Index decorator", () => {

        const metadataArgsStorage = getMetadataArgsStorage();
        const fooIndices = metadataArgsStorage.indices.filter(indice => indice.target === Foo);

        expect(fooIndices.length).to.eql(1);
        expect(fooIndices[0].expireAfterSeconds).to.eql(0);

    });

});

runIfMain(import.meta);
