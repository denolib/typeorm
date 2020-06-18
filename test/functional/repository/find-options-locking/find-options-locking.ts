import {runIfMain} from "../../../deps/mocha.ts";
import {expect} from "../../../deps/chai.ts";
// TODO(uki00a) uncomment this when CockroachDriver is implemented.
// import {CockroachDriver} from "../../../../src/driver/cockroachdb/CockroachDriver.ts";
import {SapDriver} from "../../../../src/driver/sap/SapDriver.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases, allSettled} from "../../../utils/test-utils.ts";
import {Connection} from "../../../../src/index.ts";
import {PostWithVersion} from "./entity/PostWithVersion.ts";
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

describe("repository > find options > locking", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [
            PostWithoutVersionAndUpdateDate,
            PostWithUpdateDate,
            PostWithVersion,
            PostWithVersionAndUpdatedDate
        ],
        enabledDrivers: ["postgres", "mysql", "mariadb", "mssql", "oracle", "mongodb"] // TODO(uki00a) Remove `enabledDrivers` when deno-sqlite supports `datetime('now')`.
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should throw error if pessimistic lock used without transaction", () => Promise.all(connections.map(async connection => {
        // TODO(uki00a) uncomment this when CockroachDriver is implemented.
        if (connection.driver instanceof AbstractSqliteDriver || /*connection.driver instanceof CockroachDriver ||*/ connection.driver instanceof SapDriver)
            return;

        const results = await allSettled([
            connection
                .getRepository(PostWithVersion)
                .findOne(1, { lock: { mode: "pessimistic_read" } }),

            connection
                .getRepository(PostWithVersion)
                .findOne(1, { lock: { mode: "pessimistic_write" } })
        ]);

        expect(results[0].status).to.equal('rejected');
        expect(results[0].reason).to.be.instanceOf(PessimisticLockTransactionRequiredError);
        expect(results[1].status).to.equal('rejected');
        expect(results[1].reason).to.be.instanceOf(PessimisticLockTransactionRequiredError);
    })));

    it("should not throw error if pessimistic lock used with transaction", () => Promise.all(connections.map(async connection => {
        // TODO(uki00a) uncomment this when CockroachDriver is implemented.
        if (connection.driver instanceof AbstractSqliteDriver || /*connection.driver instanceof CockroachDriver ||*/ connection.driver instanceof SapDriver)
            return;

        return connection.manager.transaction(async entityManager => {
            await Promise.all([
                entityManager
                    .getRepository(PostWithVersion)
                    .findOne(1, { lock: { mode: "pessimistic_read" } }),

                entityManager
                    .getRepository(PostWithVersion)
                    .findOne(1, { lock: { mode: "pessimistic_write" } })
            ]);
        });
    })));

    it("should attach pessimistic read lock statement on query if locking enabled", () => Promise.all(connections.map(async connection => {
        // TODO(uki00a) uncomment this when CockroachDriver is implemented.
        if (connection.driver instanceof AbstractSqliteDriver || /*connection.driver instanceof CockroachDriver ||*/ connection.driver instanceof SapDriver)
            return;

        const executedSql: string[] = [];

        await connection.manager.transaction(entityManager => {
            const originalQuery = entityManager.queryRunner!.query.bind(entityManager.queryRunner);
            entityManager.queryRunner!.query = (...args) => {
                executedSql.push(args[0]);
                return originalQuery(...args);
            };

            return entityManager
                .getRepository(PostWithVersion)
                .findOne(1, {lock: {mode: "pessimistic_read"}});
        });

        if (connection.driver instanceof MysqlDriver) {
            expect(executedSql[0].indexOf("LOCK IN SHARE MODE") !== -1).to.be.true;

        } else if (connection.driver instanceof PostgresDriver) {
            expect(executedSql[0].indexOf("FOR SHARE") !== -1).to.be.true;

        } else if (connection.driver instanceof OracleDriver) {
            expect(executedSql[0].indexOf("FOR UPDATE") !== -1).to.be.true;

        } else if (connection.driver instanceof SqlServerDriver) {
            expect(executedSql[0].indexOf("WITH (HOLDLOCK, ROWLOCK)") !== -1).to.be.true;
        }

    })));

    it("should attach pessimistic write lock statement on query if locking enabled", () => Promise.all(connections.map(async connection => {
        // TODO(uki00a) uncomment this when CockroachDriver is implemented.
        if (connection.driver instanceof AbstractSqliteDriver || /*connection.driver instanceof CockroachDriver ||*/ connection.driver instanceof SapDriver)
            return;

        const executedSql: string[] = [];

        await connection.manager.transaction(entityManager => {
            const originalQuery = entityManager.queryRunner!.query.bind(entityManager.queryRunner);
            entityManager.queryRunner!.query = (...args) => {
                executedSql.push(args[0]);
                return originalQuery(...args);
            };

            return entityManager
                .getRepository(PostWithVersion)
                .findOne(1, {lock: {mode: "pessimistic_write"}});
        });

        if (connection.driver instanceof MysqlDriver || connection.driver instanceof PostgresDriver || connection.driver instanceof OracleDriver) {
            expect(executedSql[0].indexOf("FOR UPDATE") !== -1).to.be.true;

        } else if (connection.driver instanceof SqlServerDriver) {
            expect(executedSql[0].indexOf("WITH (UPDLOCK, ROWLOCK)") !== -1).to.be.true;
        }

    })));

    it("should attach dirty read lock statement on query if locking enabled", () => Promise.all(connections.map(async connection => {
        if (!(connection.driver instanceof SqlServerDriver)) return;

        const executedSql: string[] = [];

        await connection.manager.transaction(entityManager => {
            const originalQuery = entityManager.queryRunner!.query.bind(entityManager.queryRunner);
            entityManager.queryRunner!.query = (...args) => {
                executedSql.push(args[0]);
                return originalQuery(...args);
            };

            return entityManager
                .getRepository(PostWithVersion)
                .findOne(1, {lock: {mode: "dirty_read"}});
        });

        expect(executedSql[0].indexOf("WITH (NOLOCK)") !== -1).to.be.true;

    })));

    it("should throw error if optimistic lock used with `find` method", () => Promise.all(connections.map(async connection => {
        let error;
        try {
            await connection
                .getRepository(PostWithVersion)
                .find({lock: {mode: "optimistic", version: 1}});
        } catch (err) {
            error = err;
        }
        expect(error).to.be.instanceOf(OptimisticLockCanNotBeUsedError);
    })));

    it("should not throw error if optimistic lock used with `findOne` method", () => Promise.all(connections.map(async connection => {
        await connection
            .getRepository(PostWithVersion)
            .findOne(1, {lock: {mode: "optimistic", version: 1}});
    })));

    it("should throw error if entity does not have version and update date columns", () => Promise.all(connections.map(async connection => {

        const post = new PostWithoutVersionAndUpdateDate();
        post.title = "New post";
        await connection.manager.save(post);

        let error;
        try {
            await connection
                .getRepository(PostWithoutVersionAndUpdateDate)
                .findOne(1, {lock: {mode: "optimistic", version: 1}});
        } catch (err) {
            error = err;
        }
        expect(error).to.be.instanceOf(NoVersionOrUpdateDateColumnError);
    })));

    it("should throw error if actual version does not equal expected version", () => Promise.all(connections.map(async connection => {

        const post = new PostWithVersion();
        post.title = "New post";
        await connection.manager.save(post);

        let error;
        try {
            await connection
                .getRepository(PostWithVersion)
                .findOne(1, {lock: {mode: "optimistic", version: 2}});
        } catch (err) {
            error = err;
        }
        expect(error).to.be.instanceOf(OptimisticLockVersionMismatchError);
    })));

    it("should not throw error if actual version and expected versions are equal", () => Promise.all(connections.map(async connection => {

        const post = new PostWithVersion();
        post.title = "New post";
        await connection.manager.save(post);

        await connection
            .getRepository(PostWithVersion)
            .findOne(1, {lock: {mode: "optimistic", version: 1}});
    })));

    it("should throw error if actual updated date does not equal expected updated date", () => Promise.all(connections.map(async connection => {

        // skipped because inserted milliseconds are not always equal to what we say it to insert, unskip when needed
        if (connection.driver instanceof SqlServerDriver)
            return;

        const post = new PostWithUpdateDate();
        post.title = "New post";
        await connection.manager.save(post);

        let error;
        try {
            await connection
                .getRepository(PostWithUpdateDate)
                .findOne(1, {lock: {mode: "optimistic", version: new Date(2017, 1, 1)}});
        } catch (err) {
            error = err;
        }
        expect(error).to.be.instanceOf(OptimisticLockVersionMismatchError);
    })));

    it("should not throw error if actual updated date and expected updated date are equal", () => Promise.all(connections.map(async connection => {

        // skipped because inserted milliseconds are not always equal to what we say it to insert, unskip when needed
        if (connection.driver instanceof SqlServerDriver)
            return;

        const post = new PostWithUpdateDate();
        post.title = "New post";
        await connection.manager.save(post);

        await connection
            .getRepository(PostWithUpdateDate)
            .findOne(1, {lock: {mode: "optimistic", version: post.updateDate}});
    })));

    it("should work if both version and update date columns applied", () => Promise.all(connections.map(async connection => {

        // skipped because inserted milliseconds are not always equal to what we say it to insert, unskip when needed
        if (connection.driver instanceof SqlServerDriver)
            return;

        const post = new PostWithVersionAndUpdatedDate();
        post.title = "New post";
        await connection.manager.save(post);

        return Promise.all([
            connection
                .getRepository(PostWithVersionAndUpdatedDate)
                .findOne(1, {lock: {mode: "optimistic", version: post.updateDate}}),
            connection
                .getRepository(PostWithVersionAndUpdatedDate)
                .findOne(1, {lock: {mode: "optimistic", version: 1}}),
        ]);
    })));

    it("should throw error if pessimistic locking not supported by given driver", () => Promise.all(connections.map(async connection => {
        if (connection.driver instanceof AbstractSqliteDriver || /*connection.driver instanceof CockroachDriver ||*/ connection.driver instanceof SapDriver) // TODO(uki00a) uncomment this when CockroachDriver is implemented.
            return connection.manager.transaction(async entityManager => {
                const results = await allSettled([
                    entityManager
                        .getRepository(PostWithVersion)
                        .findOne(1, { lock: { mode: "pessimistic_read" } }),

                    entityManager
                        .getRepository(PostWithVersion)
                        .findOne(1, { lock: { mode: "pessimistic_write" } }),
                ]);
                expect(results[0].status).to.equal('rejected');
                expect(results[0].reason).to.be.instanceOf(LockNotSupportedOnGivenDriverError);
                expect(results[1].status).to.equal('rejected');
                expect(results[1].reason).to.be.instanceOf(LockNotSupportedOnGivenDriverError);
            });

        return;
    })));

});

runIfMain(import.meta);
