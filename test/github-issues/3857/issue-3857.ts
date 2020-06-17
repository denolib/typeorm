import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {createTestingConnections, closeTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Person} from "./entity/Person.ts";
import {Men} from "./entity/Men.ts";
import {Women} from "./entity/Women.ts";

describe("github issues > #3857 Schema inheritance when STI pattern is used", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        enabledDrivers: ["postgres", "mariadb", "mysql"],
        entities: [Men, Person, Women],
        schema: "custom",
        schemaCreate: true
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("Child classes should have same schema as parent", () => Promise.all(connections.map(async connection => {
        const personMetadata = connection.getMetadata(Person);
        const menMetadata = connection.getMetadata(Men);
        const womenMetadata = connection.getMetadata(Women);
        // @ts-ignore
        personMetadata.schema.should.be.eq("custom");
        // @ts-ignore
        menMetadata.schema.should.be.eq(personMetadata.schema);
        // @ts-ignore
        womenMetadata.schema.should.be.eq(personMetadata.schema);
    })));

});

runIfMain(import.meta);
