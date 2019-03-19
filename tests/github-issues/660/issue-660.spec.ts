import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../test/utils/test-utils";
import {Connection} from "../../../src";
import {User} from "./entity/User";
import {SqlServerDriver} from "../../../src/driver/sqlserver/SqlServerDriver";
import {PostgresDriver} from "../../../src/driver/postgres/PostgresDriver";
import {ReturningStatementNotSupportedError} from "../../../src/error/ReturningStatementNotSupportedError";

describe("github issues > #660 Specifying a RETURNING or OUTPUT clause with QueryBuilder", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should create an INSERT statement, including RETURNING or OUTPUT clause (PostgreSQL and MSSQL only)", () => Promise.all(connections.map(async connection => {

        const user = new User();
        user.name = "Tim Merrison";

        let sql: string = "";
        try {
            sql = connection.createQueryBuilder()
                .insert()
                .into(User)
                .values(user)
                .returning(connection.driver instanceof PostgresDriver ? "*" : "inserted.*")
                .disableEscaping()
                .getSql();

        } catch (err) {
            expect(err.message).toEqual(new ReturningStatementNotSupportedError().message);
        }

        if (connection.driver instanceof SqlServerDriver) {
            expect(sql).toEqual("INSERT INTO user(name) OUTPUT inserted.* VALUES (@0)");

        } else if (connection.driver instanceof PostgresDriver) {
            expect(sql).toEqual("INSERT INTO user(name) VALUES ($1) RETURNING *");
        }
    })));

    test("should perform insert with RETURNING or OUTPUT clause (PostgreSQL and MSSQL only)", () => Promise.all(connections.map(async connection => {

        const user = new User();
        user.name = "Tim Merrison";
    
        if (connection.driver instanceof SqlServerDriver || connection.driver instanceof PostgresDriver) {
            const returning = await connection.createQueryBuilder()
                .insert()
                .into(User)
                .values(user)
                .returning(connection.driver instanceof PostgresDriver ? "*" : "inserted.*")
                .execute();
    
            expect(returning.raw).toEqual([
                { id: 1, name: user.name }
            ]);
        }
    })));

    test("should create an UPDATE statement, including RETURNING or OUTPUT clause (PostgreSQL and MSSQL only)", () => Promise.all(connections.map(async connection => {

        const user = new User();
        user.name = "Tim Merrison";

        try {
            const sql = connection.createQueryBuilder()
                .update(User)
                .set({ name: "Joe Bloggs" })
                .where("name = :name", { name: user.name })
                .returning(connection.driver instanceof PostgresDriver ? "*" : "inserted.*")
                .disableEscaping()
                .getSql();
    
            if (connection.driver instanceof SqlServerDriver) {
                expect(sql).toEqual("UPDATE user SET name = @0 OUTPUT inserted.* WHERE name = @1");
            } else if (connection.driver instanceof PostgresDriver) {
                expect(sql).toEqual("UPDATE user SET name = $1 WHERE name = $2 RETURNING *");
            }
        } catch (err) {
            expect(err.message).toEqual(new ReturningStatementNotSupportedError().message);
        }
    })));

    test("should perform update with RETURNING or OUTPUT clause (PostgreSQL and MSSQL only)", () => Promise.all(connections.map(async connection => {

        const user = new User();
        user.name = "Tim Merrison";

        await connection.manager.save(user);

        if (connection.driver instanceof SqlServerDriver || connection.driver instanceof PostgresDriver) {
            const returning = await connection.createQueryBuilder()
                .update(User)
                .set({ name: "Joe Bloggs" })
                .where("name = :name", { name: user.name })
                .returning(connection.driver instanceof PostgresDriver ? "*" : "inserted.*")
                .execute();
    
            expect(returning.raw).toEqual([
                { id: 1, name: "Joe Bloggs" }
            ]);
        }
    })));

    test("should create a DELETE statement, including RETURNING or OUTPUT clause (PostgreSQL and MSSQL only)", () => Promise.all(connections.map(async connection => {

        try {
            const user = new User();
            user.name = "Tim Merrison";
    
            const sql = connection.createQueryBuilder()
                .delete()
                .from(User)
                .where("name = :name", { name: user.name })
                .returning(connection.driver instanceof PostgresDriver ? "*" : "deleted.*")
                .disableEscaping()
                .getSql();
    
            if (connection.driver instanceof SqlServerDriver) {
                expect(sql).toEqual("DELETE FROM user OUTPUT deleted.* WHERE name = @0");
            } else if (connection.driver instanceof PostgresDriver) {
                expect(sql).toEqual("DELETE FROM user WHERE name = $1 RETURNING *");
            }
        } catch (err) {
            expect(err.message).toEqual(new ReturningStatementNotSupportedError().message);
        }
    })));

    test("should perform delete with RETURNING or OUTPUT clause (PostgreSQL and MSSQL only)", () => Promise.all(connections.map(async connection => {

        const user = new User();
        user.name = "Tim Merrison";

        await connection.manager.save(user);

        if (connection.driver instanceof SqlServerDriver || connection.driver instanceof PostgresDriver) {
            const returning = await connection.createQueryBuilder()
                .delete()
                .from(User)
                .where("name = :name", { name: user.name })
                .returning(connection.driver instanceof PostgresDriver ? "*" : "deleted.*")
                .execute();
    
            expect(returning.raw).toEqual([
                { id: 1, name: user.name }
            ]);
        }
    })));

});
