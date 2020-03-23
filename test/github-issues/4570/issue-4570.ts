import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {ColumnOptions, PrimaryColumn} from "../../../src/index.ts";

describe("github issues > #4570 Fix PrimaryColumn decorator modifies passed option", () => {
    it("should not modify passed options to PrimaryColumn", () => {
        const options: ColumnOptions = {type: "varchar" };
        const clone = Object.assign({}, options);

        class Entity {
            @PrimaryColumn(options)
            pkey!: string;
        }

        expect(Entity).to.be;
        expect(clone).to.be.eql(options);
    });
});

runIfMain(import.meta);
