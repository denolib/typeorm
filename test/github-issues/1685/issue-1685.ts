import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/index.ts";
import {Year} from "./entity/year.ts";
import {Month} from "./entity/month.ts";
import {User} from "./entity/user.ts";
import {UserMonth} from "./entity/user-month.ts";

describe.skip("github issues > #1685 JoinColumn from JoinColum is not considered when inserting new value", () => {

    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    before(async () => connections = await createTestingConnections({
        entities: [joinPaths(__dirname, "/entity/*.ts")],
        schemaCreate: true,
        dropSchema: true,
        enabledDrivers: ["mysql"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should not fail when inserting a new UserMonth with good PKs from JoinColumn", () => Promise.all(connections.map(async connection => {

        const year = new Year();
        year.yearNo = 2018;
        await connection.manager.save(year);

        const month = new Month();
        month.year = year;
        month.monthNo = 2;
        month.yearNo = year.yearNo;
        await connection.manager.save(month);

        const user = new User();
        user.username = "bobs";
        await connection.manager.save(user);

        const userMonth = new UserMonth();
        userMonth.user = user;
        userMonth.month = month;

        try {
            await connection.manager.save(userMonth);
        } catch (err) {
            throw new Error("userMonth should be added");
        }

    })));

});

runIfMain(import.meta);
