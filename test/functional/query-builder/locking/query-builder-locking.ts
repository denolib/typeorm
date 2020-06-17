// TODO(uki00a) uncomment this when CockroachDriver is implemented.
// import {CockroachDriver} from "../../../../src/driver/cockroachdb/CockroachDriver.ts";
import {SapDriver} from "../../../../src/driver/sap/SapDriver.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases, allSettled} from "../../../utils/test-utils.ts";
import {Connection} from "../../../../src/connection/Connection.ts";
import {PostWithVersion} from "./entity/PostWithVersion.ts";
import {runIfMain} from "../../../deps/mocha.ts";
import {expect} from "../../../deps/chai.ts";
import {PostWithoutVersionAndUpdateDate} from "./entity/PostWithoutVersionAndUpdateDate.ts";
import {PostWithUpdateDate} from "./entity/PostWithUpdateDate.ts";
import {PostWithVersionAndUpdatedDate} from "./entity/PostWithVersionAndUpdatedDate.ts";
import {OptimisticLockVersionMismatchError} from "../../../../src/error/OptimisticLockVersionMismatchError.ts";
import {OptimisticLockCanNotBeUsedError} from "../../../../src/error/OptimisticLockCanNotBeUsedError.ts";
import {NoVersionOrUpdateDateColumnError} from "../../../../src/error/NoVersionOrUpdateDateColumnError.ts";
import {PessimisticLockTransactionRequiredError} from "../../../../src/error/PessimisticLockTransactionRequiredError.ts";
import {MysqlDriver} from "../../../../src/driver/mysql/MysqlDriver.ts";
import {PostgresDriver} from "../../../../src/driver/postgres/PostgresDriver.ts";
import {SqlServerDriver} from "../../../../src/driver/sqlserver/SqlServerDriver.ts";
import {AbstractSqliteDriver} from "../../../../src/driver/sqlite-abstract/AbstractSqliteDriver.ts";
import {OracleDriver} from "../../../../src/driver/oracle/OracleDriver.ts";
import {LockNotSupportedOnGivenDriverError} from "../../../../src/error/LockNotSupportedOnGivenDriverError.ts";

describe("query builder > locking", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [PostWithoutVersionAndUpdateDate, PostWithUpdateDate, PostWithVersion, PostWithVersionAndUpdatedDate],
        enabledDrivers: ["postgres", "mysql", "mariadb", "cockroachdb", "mssql", "oracle", "sap"] // TODO(uki00a) Remove `enabledDrivers when deno-sqlite supports `datetime('now')`.
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should not attach pessimistic read lock statement on query if locking is not used", () => Promise.all(connections.map(async connection => {
        if (connection.driver instanceof AbstractSqliteDriver || connection.driver instanceof SapDriver)
            return;

        const sql = connection.createQueryBuilder(PostWithVersion, "post")
            .where("post.id = :id", { id: 1 })
            .getSql();

        expect(sql.indexOf("LOCK IN SHARE MODE") === -1).to.be.true;
        expect(sql.indexOf("FOR SHARE") === -1).to.be.true;
        expect(sql.indexOf("WITH (HOLDLOCK, ROWLOCK)") === -1).to.be.true;
    })));

    it("should throw error if pessimistic lock used without transaction", () => Promise.all(connections.map(async connection => {
        if (connection.driver instanceof AbstractSqliteDriver || connection.driver instanceof SapDriver)
            return;

        const results = await allSettled([
            connection.createQueryBuilder(PostWithVersion, "post")
                .setLock("pessimistic_read")
                .where("post.id = :id", { id: 1 })
                .getOne(),

            connection.createQueryBuilder(PostWithVersion, "post")
                .setLock("pessimistic_write")
                .where("post.id = :id", { id: 1 })
                .getOne()
        ]);
        expect(results[0].status).to.equal('rejected');
        expect(results[0].reason).to.be.instanceOf(PessimisticLockTransactionRequiredError);
        expect(results[1].status).to.equal('rejected');
        expect(results[1].reason).to.be.instanceOf(PessimisticLockTransactionRequiredError);
    })));

    it("should not throw error if pessimistic lock used with transaction", () => Promise.all(connections.map(async connection => {
        // TODO(uki00a) uncomment this when CockroachDriver is implemented.
        if (connection.driver instanceof AbstractSqliteDriver/* || connection.driver instanceof CockroachDriver*/ || connection.driver instanceof SapDriver)
            return;

        return connection.manager.transaction(entityManager => {
            return Promise.all([
                entityManager.createQueryBuilder(PostWithVersion, "post")
                    .setLock("pessimistic_read")
                    .where("post.id = :id", { id: 1 })
                    .getOne(),

                entityManager.createQueryBuilder(PostWithVersion, "post")
                    .setLock("pessimistic_write")
                    .where("post.id = :id", { id: 1 })
                    .getOne()
            ]);
        });
    })));

    it("should attach pessimistic read lock statement on query if locking enabled", () => Promise.all(connections.map(async connection => {
        // TODO(uki00a) uncomment this when CockroachDriver is implemented.
        if (connection.driver instanceof AbstractSqliteDriver /*|| connection.driver instanceof CockroachDriver*/ || connection.driver instanceof SapDriver)
            return;

        const sql = connection.createQueryBuilder(PostWithVersion, "post")
            .setLock("pessimistic_read")
            .where("post.id = :id", { id: 1 })
            .getSql();

        if (connection.driver instanceof MysqlDriver) {
            expect(sql.indexOf("LOCK IN SHARE MODE") !== -1).to.be.true;

        } else if (connection.driver instanceof PostgresDriver) {
            expect(sql.indexOf("FOR SHARE") !== -1).to.be.true;

        } else if (connection.driver instanceof OracleDriver) {
            expect(sql.indexOf("FOR UPDATE") !== -1).to.be.true;

        } else if (connection.driver instanceof SqlServerDriver) {
            expect(sql.indexOf("WITH (HOLDLOCK, ROWLOCK)") !== -1).to.be.true;
        }
    })));

    it("should attach dirty read lock statement on query if locking enabled", () => Promise.all(connections.map(async connection => {
        if (!(connection.driver instanceof SqlServerDriver)) return;

        const sql = connection.createQueryBuilder(PostWithVersion, "post")
            .setLock("dirty_read")
            .where("post.id = :id", { id: 1 })
            .getSql();

        expect(sql.indexOf("WITH (NOLOCK)") !== -1).to.be.true;
    })));

    it("should not attach pessimistic write lock statement on query if locking is not used", () => Promise.all(connections.map(async connection => {
        if (connection.driver instanceof AbstractSqliteDriver || connection.driver instanceof SapDriver)
            return;

        const sql = connection.createQueryBuilder(PostWithVersion, "post")
            .where("post.id = :id", { id: 1 })
            .getSql();

            expect(sql.indexOf("FOR UPDATE") === -1).to.be.true;
            expect(sql.indexOf("WITH (UPDLOCK, ROWLOCK)") === -1).to.be.true;
    })));

    it("should attach pessimistic write lock statement on query if locking enabled", () => Promise.all(connections.map(async connection => {
        // TODO(uki00a) uncomment this when CockroachDriver is implemented.
        if (connection.driver instanceof AbstractSqliteDriver /*|| connection.driver instanceof CockroachDriver*/ || connection.driver instanceof SapDriver)
            return;

        const sql = connection.createQueryBuilder(PostWithVersion, "post")
            .setLock("pessimistic_write")
            .where("post.id = :id", { id: 1 })
            .getSql();

        if (connection.driver instanceof MysqlDriver || connection.driver instanceof PostgresDriver || connection.driver instanceof OracleDriver) {
            expect(sql.indexOf("FOR UPDATE") !== -1).to.be.true;

        } else if (connection.driver instanceof SqlServerDriver) {
            expect(sql.indexOf("WITH (UPDLOCK, ROWLOCK)") !== -1).to.be.true;
        }

    })));

    it("should throw error if optimistic lock used with getMany method", () => Promise.all(connections.map(async connection => {
        try {
           await connection.createQueryBuilder(PostWithVersion, "post")
               .setLock("optimistic", 1)
               .getMany();
            expect.fail('an error not to be thrown');
        } catch (err) {{
            expect(err).to.be.instanceOf(OptimisticLockCanNotBeUsedError);
        }}
    })));

    it("should throw error if optimistic lock used with getCount method", () => Promise.all(connections.map(async connection => {
        try {
            await connection.createQueryBuilder(PostWithVersion, "post")
               .setLock("optimistic", 1)
               .getCount();
            expect.fail("an error not to be thrown");
        } catch (err) {
            expect(err).to.be.instanceOf(OptimisticLockCanNotBeUsedError);
        }
    })));

    it("should throw error if optimistic lock used with getManyAndCount method", () => Promise.all(connections.map(async connection => {
        try {
            await connection.createQueryBuilder(PostWithVersion, "post")
                .setLock("optimistic", 1)
                .getManyAndCount();
            expect.fail("an error not to be thrown");
        } catch (err) {
            expect(err).to.be.instanceOf(OptimisticLockCanNotBeUsedError);
        }
    })));

    it("should throw error if optimistic lock used with getRawMany method", () => Promise.all(connections.map(async connection => {
        try {
            await connection.createQueryBuilder(PostWithVersion, "post")
                .setLock("optimistic", 1)
                .getRawMany();
            expect.fail("an error not to be thrown");
        } catch (err) {
            expect(err).to.be.instanceOf(OptimisticLockCanNotBeUsedError);
        }
    })));

    it("should throw error if optimistic lock used with getRawOne method", () => Promise.all(connections.map(async connection => {
        try {
            await connection.createQueryBuilder(PostWithVersion, "post")
                .setLock("optimistic", 1)
                .where("post.id = :id", { id: 1 })
                .getRawOne();
            expect.fail("an error not to be thrown");
        } catch (err) {
            expect(err).to.be.instanceOf(OptimisticLockCanNotBeUsedError);
        }
    })));

    it("should not throw error if optimistic lock used with getOne method", () => Promise.all(connections.map(async connection => {
        await connection.createQueryBuilder(PostWithVersion, "post")
            .setLock("optimistic", 1)
            .where("post.id = :id", { id: 1 })
            .getOne();
    })));

    it.skip("should throw error if entity does not have version and update date columns", () => Promise.all(connections.map(async connection => {

        const post = new PostWithoutVersionAndUpdateDate();
        post.title = "New post";
        await connection.manager.save(post);

        try {
            await connection.createQueryBuilder(PostWithoutVersionAndUpdateDate, "post")
               .setLock("optimistic", 1)
               .where("post.id = :id", { id: 1 })
               .getOne();
            expect.fail("an error not to be thrown");
        } catch (err) {
            expect(err).to.be.instanceOf(NoVersionOrUpdateDateColumnError);
        }
    })));

    // skipped because inserted milliseconds are not always equal to what we say it to insert, unskip when needed
    it.skip("should throw error if actual version does not equal expected version", () => Promise.all(connections.map(async connection => {

        const post = new PostWithVersion();
        post.title = "New post";
        await connection.manager.save(post);

        try {
            await connection.createQueryBuilder(PostWithVersion, "post")
                .setLock("optimistic", 2)
                .where("post.id = :id", { id: 1 })
                .getOne();
            expect.fail("an error not to be thrown");
        } catch (err) {
            expect(err).to.be.instanceOf(OptimisticLockVersionMismatchError);
        }
    })));

    // skipped because inserted milliseconds are not always equal to what we say it to insert, unskip when needed
    it.skip("should not throw error if actual version and expected versions are equal", () => Promise.all(connections.map(async connection => {

        const post = new PostWithVersion();
        post.title = "New post";
        await connection.manager.save(post);

        await connection.createQueryBuilder(PostWithVersion, "post")
            .setLock("optimistic", 1)
            .where("post.id = :id", { id: 1 })
            .getOne();
    })));

    // skipped because inserted milliseconds are not always equal to what we say it to insert, unskip when needed
    it.skip("should throw error if actual updated date does not equal expected updated date", () => Promise.all(connections.map(async connection => {

        const post = new PostWithUpdateDate();
        post.title = "New post";
        await connection.manager.save(post);

        try {
            await connection.createQueryBuilder(PostWithUpdateDate, "post")
                .setLock("optimistic", new Date(2017, 1, 1))
                .where("post.id = :id", { id: 1 })
                .getOne();
            expect.fail("an error not to be thrown");
        } catch (err) {
            expect(err).to.be.instanceOf(OptimisticLockVersionMismatchError);
        }
    })));

    // skipped because inserted milliseconds are not always equal to what we say it to insert, unskip when needed
    it.skip("should not throw error if actual updated date and expected updated date are equal", () => Promise.all(connections.map(async connection => {

        if (connection.driver instanceof SqlServerDriver)
            return;

        const post = new PostWithUpdateDate();
        post.title = "New post";
        await connection.manager.save(post);

        return connection.createQueryBuilder(PostWithUpdateDate, "post")
            .setLock("optimistic", post.updateDate)
            .where("post.id = :id", {id: 1})
            .getOne();
    })));

    // skipped because inserted milliseconds are not always equal to what we say it to insert, unskip when needed
    it.skip("should work if both version and update date columns applied", () => Promise.all(connections.map(async connection => {

        const post = new PostWithVersionAndUpdatedDate();
        post.title = "New post";
        await connection.manager.save(post);

        return Promise.all([
            connection.createQueryBuilder(PostWithVersionAndUpdatedDate, "post")
                .setLock("optimistic", post.updateDate)
                .where("post.id = :id", { id: 1 })
                .getOne(),

            connection.createQueryBuilder(PostWithVersionAndUpdatedDate, "post")
                .setLock("optimistic", 1)
                .where("post.id = :id", { id: 1 })
                .getOne()
        ]);
    })));

    it("should throw error if pessimistic locking not supported by given driver", () => Promise.all(connections.map(async connection => {
        // TODO(uki00a) uncomment if CockroachDriver is implemented.
        if (connection.driver instanceof AbstractSqliteDriver /*|| connection.driver instanceof CockroachDriver*/ || connection.driver instanceof SapDriver)
            return connection.manager.transaction(async entityManager => {
                const results = await allSettled([
                    entityManager.createQueryBuilder(PostWithVersion, "post")
                        .setLock("pessimistic_read")
                        .where("post.id = :id", { id: 1 })
                        .getOne(),

                    entityManager.createQueryBuilder(PostWithVersion, "post")
                        .setLock("pessimistic_write")
                        .where("post.id = :id", { id: 1 })
                        .getOne()
                ]);

                expect(results[0].status).to.equal('rejected');
                expect(results[1].reason).to.be.instanceOf(LockNotSupportedOnGivenDriverError);
                expect(results[1].status).to.equal('rejected');
                expect(results[1].reason).to.be.instanceOf(LockNotSupportedOnGivenDriverError);
            });

        return;
    })));

});

runIfMain(import.meta);
