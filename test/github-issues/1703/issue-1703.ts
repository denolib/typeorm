import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/index.ts";
import {UserEntity} from "./entity/UserEntity.ts";
import {UserToOrganizationEntity} from "./entity/UserToOrganizationEntity.ts";
import {OrganizationEntity} from "./entity/OrganizationEntity.ts";

describe("github issues > #1703 Many to Many with association table returns odd values.", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [UserEntity, UserToOrganizationEntity, OrganizationEntity],
        enabledDrivers: ["mysql"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should work as expected", () => Promise.all(connections.map(async connection => {

        const user1 = new UserEntity();
        const user2 = new UserEntity();
        const user3 = new UserEntity();
        await connection.manager.save(user1);
        await connection.manager.save(user2);
        await connection.manager.save(user3);

        const organization1 = new OrganizationEntity();
        const organization2 = new OrganizationEntity();
        const organization3 = new OrganizationEntity();
        await connection.manager.save(organization1);
        await connection.manager.save(organization2);
        await connection.manager.save(organization3);

        const userOrganization1 = new UserToOrganizationEntity();
        userOrganization1.role = "owner";
        userOrganization1.user = user1;
        userOrganization1.organization = organization1;
        await connection.manager.save(userOrganization1);

        const userOrganization2 = new UserToOrganizationEntity();
        userOrganization2.role = "owner";
        userOrganization2.user = user2;
        userOrganization2.organization = organization2;
        await connection.manager.save(userOrganization2);

        const userOrganization3 = new UserToOrganizationEntity();
        userOrganization3.role = "owner";
        userOrganization3.user = user2;
        userOrganization3.organization = organization3;
        await connection.manager.save(userOrganization3);

        await connection.manager
            .createQueryBuilder(OrganizationEntity, "organization")
            .leftJoinAndSelect("organization.users", "users")
            .getMany();

        // console.log(organizations);
    })));

});

runIfMain(import.meta);
