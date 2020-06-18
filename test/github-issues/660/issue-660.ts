import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {User} from "./entity/User.ts";
import {SqlServerDriver} from "../../../src/driver/sqlserver/SqlServerDriver.ts";
// import {PostgresDriver} from "../../../src/driver/postgres/PostgresDriver.ts";
import {ReturningStatementNotSupportedError} from "../../../src/error/ReturningStatementNotSupportedError.ts";

describe("github issues > #660 Specifying a RETURNING or OUTPUT clause with QueryBuilder", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [User],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should create an INSERT statement, including RETURNING or OUTPUT clause (PostgreSQL and MSSQL only)", () => Promise.all(connections.map(async connection => {

        const user = new User();
        user.name = "Tim Merrison";

        let sql: string = "";
        try {
            sql = connection.createQueryBuilder()
                .insert()
                .into(User)
                .values(user)
                .returning(false/*connection.driver instanceof PostgresDriver*/ ? "*" : "inserted.*") // TODO(uki00a) uncomment this when PostgresDriver is implemented.
                .disableEscaping()
                .getSql();

        } catch (err) {
            expect(err.message).to.eql(new ReturningStatementNotSupportedError().message);
        }

        if (connection.driver instanceof SqlServerDriver) {
            expect(sql).to.equal("INSERT INTO user(name) OUTPUT inserted.* VALUES (@0)");

        } else if (false/*connection.driver instanceof PostgresDriver*/) { // TODO(uki00a) uncomment this when PostgresDriver is implemented.
            expect(sql).to.equal("INSERT INTO user(name) VALUES ($1) RETURNING *");
        }
    })));

    it("should perform insert with RETURNING or OUTPUT clause (PostgreSQL and MSSQL only)", () => Promise.all(connections.map(async connection => {

        const user = new User();
        user.name = "Tim Merrison";

        if (connection.driver instanceof SqlServerDriver || false/*connection.driver instanceof PostgresDriver*/) { // TODO(uki00a) uncomment this when PostgresDriver is implemented.
            const returning = await connection.createQueryBuilder()
                .insert()
                .into(User)
                .values(user)
                .returning(false/*connection.driver instanceof PostgresDriver*/ ? "*" : "inserted.*") // TODO(uki00a) uncomment this when PostgresDriver is implemented.
                .execute();

            returning.raw.should.be.eql([
                { id: 1, name: user.name }
            ]);
        }
    })));

    it("should create an UPDATE statement, including RETURNING or OUTPUT clause (PostgreSQL and MSSQL only)", () => Promise.all(connections.map(async connection => {

        const user = new User();
        user.name = "Tim Merrison";

        try {
            const sql = connection.createQueryBuilder()
                .update(User)
                .set({ name: "Joe Bloggs" })
                .where("name = :name", { name: user.name })
                .returning(false/*connection.driver instanceof PostgresDriver*/ ? "*" : "inserted.*") // TODO(uki00a) uncomment this when PostgresDriver is implemented.
                .disableEscaping()
                .getSql();

            if (connection.driver instanceof SqlServerDriver) {
                expect(sql).to.equal("UPDATE user SET name = @0 OUTPUT inserted.* WHERE name = @1");
            } else if (false/*connection.driver instanceof PostgresDriver*/) { // TODO(uki00a) uncomment this when PostgresDriver is implemented.
                expect(sql).to.equal("UPDATE user SET name = $1 WHERE name = $2 RETURNING *");
            }
        } catch (err) {
            expect(err.message).to.eql(new ReturningStatementNotSupportedError().message);
        }
    })));

    it("should perform update with RETURNING or OUTPUT clause (PostgreSQL and MSSQL only)", () => Promise.all(connections.map(async connection => {

        const user = new User();
        user.name = "Tim Merrison";

        await connection.manager.save(user);

        if (connection.driver instanceof SqlServerDriver || false/*connection.driver instanceof PostgresDriver*/) { // TODO(uki00a) uncomment this when PostgresDriver is implemented.
            const returning = await connection.createQueryBuilder()
                .update(User)
                .set({ name: "Joe Bloggs" })
                .where("name = :name", { name: user.name })
                .returning(false/*connection.driver instanceof PostgresDriver*/ ? "*" : "inserted.*") // TODO(uki00a) uncomment this when PostgresDriver is implemented.
                .execute();

            returning.raw.should.be.eql([
                { id: 1, name: "Joe Bloggs" }
            ]);
        }
    })));

    it("should create a DELETE statement, including RETURNING or OUTPUT clause (PostgreSQL and MSSQL only)", () => Promise.all(connections.map(async connection => {

        try {
            const user = new User();
            user.name = "Tim Merrison";

            const sql = connection.createQueryBuilder()
                .delete()
                .from(User)
                .where("name = :name", { name: user.name })
                .returning(false/*connection.driver instanceof PostgresDriver*/ ? "*" : "deleted.*") // TODO(uki00a) uncomment this when PostgresDriver is implemented.
                .disableEscaping()
                .getSql();

            if (connection.driver instanceof SqlServerDriver) {
                expect(sql).to.equal("DELETE FROM user OUTPUT deleted.* WHERE name = @0");
            } else if (false/*connection.driver instanceof PostgresDriver*/) { // TODO(uki00a) uncomment this when PostgresDriver is implemented.
                expect(sql).to.equal("DELETE FROM user WHERE name = $1 RETURNING *");
            }
        } catch (err) {
            expect(err.message).to.eql(new ReturningStatementNotSupportedError().message);
        }
    })));

    it("should perform delete with RETURNING or OUTPUT clause (PostgreSQL and MSSQL only)", () => Promise.all(connections.map(async connection => {

        const user = new User();
        user.name = "Tim Merrison";

        await connection.manager.save(user);

        if (connection.driver instanceof SqlServerDriver || false/*connection.driver instanceof PostgresDriver*/) { // TODO(uki00a) uncomment this when PostgresDriver is implemented.
            const returning = await connection.createQueryBuilder()
                .delete()
                .from(User)
                .where("name = :name", { name: user.name })
                .returning(false/*connection.driver instanceof PostgresDriver*/ ? "*" : "deleted.*") // TODO(uki00a) uncomment this when PostgresDriver is implemented.
                .execute();

            returning.raw.should.be.eql([
                { id: 1, name: user.name }
            ]);
        }
    })));

});

runIfMain(import.meta);
