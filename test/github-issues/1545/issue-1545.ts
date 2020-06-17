import { runIfMain } from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import { Connection } from "../../../src/connection/Connection.ts";
import { createTestingConnections, reloadTestingDatabases, closeTestingConnections } from "../../utils/test-utils.ts";
import { ValidationModel } from "./entity/ValidationModel.ts";
import { MainModel } from "./entity/MainModel.ts";
import { DataModel } from "./entity/DataModel.ts";

describe("github issues > #1545 Typeorm runs insert query instead of update query on save of existing entity for ManyToOne relationships", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [DataModel, MainModel, ValidationModel],
        enabledDrivers: ["postgres"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should add intial validation data", () => Promise.all(connections.map(async connection => {
        const validation1 = new ValidationModel();
        validation1.validation = 123;

        const validation2 = new ValidationModel();
        validation2.validation = 456;
        await Promise.all([await connection.manager.save(validation1), await connection.manager.save(validation2)]);

        const data1_1 = new DataModel();
        data1_1.active = true;
        data1_1.validations = validation1;

        const main1 = new MainModel();
        main1.dataModel = [data1_1];

        await connection.manager.save(main1);

        // console.dir(main1, { colors: true, depth: null });

        main1.dataModel[0].active = false;
        await connection.manager.save(main1);
        // console.dir(main1, { colors: true, depth: null });

        return true;

    })));

});

runIfMain(import.meta);
