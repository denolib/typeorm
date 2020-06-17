import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {closeTestingConnections, createTestingConnections} from "../../utils/test-utils.ts";
import {User} from "./entity/User.ts";

describe("github issues > #1680 Delete & Update applies to all entities in table if criteria is undefined or empty", () => {

    let connections: Connection[];
    before(async () => {
        connections = await createTestingConnections({
            entities: [User],
            schemaCreate: true,
            dropSchema: true,
        });
    });
    after(() => closeTestingConnections(connections));

    it("Delete & Update should throw an error when supplied with an empty criteria", () => Promise.all(connections.map(async connection => {

        const userA = new User();
        userA.name = "User A";
        const userB = new User();
        userB.name = "User B";
        const userC = new User();
        userC.name = "User C";

        await connection.manager.save([userA, userB, userC]);

        const problematicCriterias: any[] = [null, undefined, [], ""];

        // Execute potentially problematic deletes
        for (const criteria of problematicCriterias) {
            let error: any = null;

            await connection.manager.delete(User, criteria).catch(err => error = err);

            expect(error).to.be.instanceof(Error);
        }

        // Execute potentially problematic updates
        for (const criteria of problematicCriterias) {
            let error: any = null;

            await connection.manager.update(User, criteria, {
                name: "Override Name"
            }).catch(err => error = err);

            expect(error).to.be.instanceof(Error);
        }

        // Ensure normal deleting works
        await connection.manager.delete(User, 3);

        // Ensure normal updating works
        await connection.manager.update(User, 2, { name: "User B Updated" } );

        // All users should still exist except for User C
        expect(await connection.manager.find(User)).to.eql([{
            id: 1,
            name: "User A"
        }, {
            id: 2,
            name: "User B Updated"
        }]);

    })));

});

runIfMain(import.meta);
