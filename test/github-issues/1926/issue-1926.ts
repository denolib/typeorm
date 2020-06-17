import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";

import {Role} from "./entity/Role.ts";
import {Event} from "./entity/Event.ts";
import {EventRole} from "./entity/EventRole.ts";

// todo: fix later (refactor persistence)
describe.skip("github issues > #1926 Update fails for entity with compound relation-based primary key on OneToMany relationship", () => {
    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Event, EventRole, Role],
        enabledDrivers: ["postgres"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("Should update OneToMany entity with compound relation-based primary key", () => Promise.all(connections.map(async connection => {
        let role = new Role();
        role.title = "The Boss";

        role = await connection.manager.save(role);

        let event = new Event();
        event.title = "The Big Event";

        let eventRole = new EventRole();
        eventRole.description = "Be the boss";
        eventRole.compensation = "All the money!";
        eventRole.roleId = role.id;

        event.roles = [eventRole];

        event = await connection.manager.save(event);

        event.roles[0].description = "Be a good boss";

        // Fails with:
        // QueryFailedError: duplicate key value violates unique constraint "PK_..."
        await connection.manager.save(event);
    })));
});

runIfMain(import.meta);
