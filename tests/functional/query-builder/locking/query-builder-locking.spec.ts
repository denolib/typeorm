import "reflect-metadata";
import {CockroachDriver} from "../../../../src/driver/cockroachdb/CockroachDriver";
import {Connection} from "../../../../src";
import {
    closeTestingConnections,
    createTestingConnections,
    reloadTestingDatabases
} from "../../../../test/utils/test-utils";
import {PostWithVersion} from "./entity/PostWithVersion";
import {PostWithoutVersionAndUpdateDate} from "./entity/PostWithoutVersionAndUpdateDate";
import {PostWithUpdateDate} from "./entity/PostWithUpdateDate";
import {PostWithVersionAndUpdatedDate} from "./entity/PostWithVersionAndUpdatedDate";
import {OptimisticLockVersionMismatchError} from "../../../../src/error/OptimisticLockVersionMismatchError";
import {OptimisticLockCanNotBeUsedError} from "../../../../src/error/OptimisticLockCanNotBeUsedError";
import {NoVersionOrUpdateDateColumnError} from "../../../../src/error/NoVersionOrUpdateDateColumnError";
import {PessimisticLockTransactionRequiredError} from "../../../../src/error/PessimisticLockTransactionRequiredError";
import {MysqlDriver} from "../../../../src/driver/mysql/MysqlDriver";
import {PostgresDriver} from "../../../../src/driver/postgres/PostgresDriver";
import {SqlServerDriver} from "../../../../src/driver/sqlserver/SqlServerDriver";
import {AbstractSqliteDriver} from "../../../../src/driver/sqlite-abstract/AbstractSqliteDriver";
import {OracleDriver} from "../../../../src/driver/oracle/OracleDriver";
import {LockNotSupportedOnGivenDriverError} from "../../../../src/error/LockNotSupportedOnGivenDriverError";

describe.skip("query builder > locking", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should not attach pessimistic read lock statement on query if locking is not used", () => Promise.all(connections.map(async connection => {
        if (connection.driver instanceof AbstractSqliteDriver)
            return;

        const sql = connection.createQueryBuilder(PostWithVersion, "post")
            .where("post.id = :id", { id: 1 })
            .getSql();

        expect(sql.indexOf("LOCK IN SHARE MODE") === -1).toBeTruthy();
        expect(sql.indexOf("FOR SHARE") === -1).toBeTruthy();
        expect(sql.indexOf("WITH (HOLDLOCK, ROWLOCK)") === -1).toBeTruthy();
    })));

    test("should throw error if pessimistic lock used without transaction", () => Promise.all(connections.map(async connection => {
        if (connection.driver instanceof AbstractSqliteDriver)
            return;

        return Promise.all([
            expect(connection.createQueryBuilder(PostWithVersion, "post")
                .setLock("pessimistic_read")
                .where("post.id = :id", { id: 1 })
                .getOne()).toThrow(PessimisticLockTransactionRequiredError),

            expect(connection.createQueryBuilder(PostWithVersion, "post")
                .setLock("pessimistic_write")
                .where("post.id = :id", { id: 1 })
                .getOne()).toThrow(PessimisticLockTransactionRequiredError)
        ]);
    })));

    test("should not throw error if pessimistic lock used with transaction", () => Promise.all(connections.map(async connection => {
        if (connection.driver instanceof AbstractSqliteDriver || connection.driver instanceof CockroachDriver)
            return;

        return connection.manager.transaction(entityManager => {
            return Promise.all([
                expect(entityManager.createQueryBuilder(PostWithVersion, "post")
                    .setLock("pessimistic_read")
                    .where("post.id = :id", { id: 1 })
                    .getOne()).not.toThrow(),

                expect(entityManager.createQueryBuilder(PostWithVersion, "post")
                    .setLock("pessimistic_write")
                    .where("post.id = :id", { id: 1 })
                    .getOne()).not.toThrow(),
            ]);
        });
    })));

    test("should attach pessimistic read lock statement on query if locking enabled", () => Promise.all(connections.map(async connection => {
        if (connection.driver instanceof AbstractSqliteDriver || connection.driver instanceof CockroachDriver)
            return;

        const sql = connection.createQueryBuilder(PostWithVersion, "post")
            .setLock("pessimistic_read")
            .where("post.id = :id", { id: 1 })
            .getSql();

        if (connection.driver instanceof MysqlDriver) {
            expect(sql.indexOf("LOCK IN SHARE MODE") !== -1).toBeTruthy();

        } else if (connection.driver instanceof PostgresDriver) {
            expect(sql.indexOf("FOR SHARE") !== -1).toBeTruthy();

        } else if (connection.driver instanceof OracleDriver) {
            expect(sql.indexOf("FOR UPDATE") !== -1).toBeTruthy();

        } else if (connection.driver instanceof SqlServerDriver) {
            expect(sql.indexOf("WITH (HOLDLOCK, ROWLOCK)") !== -1).toBeTruthy();
        }
    })));

    test("should not attach pessimistic write lock statement on query if locking is not used", () => Promise.all(connections.map(async connection => {
        if (connection.driver instanceof AbstractSqliteDriver)
            return;

        const sql = connection.createQueryBuilder(PostWithVersion, "post")
            .where("post.id = :id", { id: 1 })
            .getSql();

            expect(sql.indexOf("FOR UPDATE") === -1).toBeTruthy();
            expect(sql.indexOf("WITH (UPDLOCK, ROWLOCK)") === -1).toBeTruthy();
    })));

    test("should attach pessimistic write lock statement on query if locking enabled", () => Promise.all(connections.map(async connection => {
        if (connection.driver instanceof AbstractSqliteDriver || connection.driver instanceof CockroachDriver)
            return;

        const sql = connection.createQueryBuilder(PostWithVersion, "post")
            .setLock("pessimistic_write")
            .where("post.id = :id", { id: 1 })
            .getSql();

        if (connection.driver instanceof MysqlDriver || connection.driver instanceof PostgresDriver || connection.driver instanceof OracleDriver) {
            expect(sql.indexOf("FOR UPDATE") !== -1).toBeTruthy();

        } else if (connection.driver instanceof SqlServerDriver) {
            expect(sql.indexOf("WITH (UPDLOCK, ROWLOCK)") !== -1).toBeTruthy();
        }

    })));

    test("should throw error if optimistic lock used with getMany method", () => Promise.all(connections.map(async connection => {
       return expect(connection.createQueryBuilder(PostWithVersion, "post")
           .setLock("optimistic", 1)
           .getMany()).toThrow(OptimisticLockCanNotBeUsedError);
    })));

    test("should throw error if optimistic lock used with getCount method", () => Promise.all(connections.map(async connection => {

        return expect(connection.createQueryBuilder(PostWithVersion, "post")
           .setLock("optimistic", 1)
           .getCount()).toThrow(OptimisticLockCanNotBeUsedError);
    })));

    test("should throw error if optimistic lock used with getManyAndCount method", () => Promise.all(connections.map(async connection => {

       return expect(connection.createQueryBuilder(PostWithVersion, "post")
           .setLock("optimistic", 1)
           .getManyAndCount()).toThrow(OptimisticLockCanNotBeUsedError);
    })));

    test("should throw error if optimistic lock used with getRawMany method", () => Promise.all(connections.map(async connection => {

       return expect(connection.createQueryBuilder(PostWithVersion, "post")
           .setLock("optimistic", 1)
           .getRawMany()).toThrow(OptimisticLockCanNotBeUsedError);
    })));

    test("should throw error if optimistic lock used with getRawOne method", () => Promise.all(connections.map(async connection => {

       return expect(connection.createQueryBuilder(PostWithVersion, "post")
           .setLock("optimistic", 1)
           .where("post.id = :id", { id: 1 })
           .getRawOne()).toThrow(OptimisticLockCanNotBeUsedError);
    })));

    test("should not throw error if optimistic lock used with getOne method", () => Promise.all(connections.map(async connection => {

       return expect(connection.createQueryBuilder(PostWithVersion, "post")
           .setLock("optimistic", 1)
           .where("post.id = :id", { id: 1 })
           .getOne()).not.toThrow();
    })));

    test.skip("should throw error if entity does not have version and update date columns", () => Promise.all(connections.map(async connection => {

        const post = new PostWithoutVersionAndUpdateDate();
        post.title = "New post";
        await connection.manager.save(post);

        return expect(connection.createQueryBuilder(PostWithoutVersionAndUpdateDate, "post")
           .setLock("optimistic", 1)
           .where("post.id = :id", { id: 1 })
           .getOne()).toThrow(NoVersionOrUpdateDateColumnError);
    })));

    // skipped because inserted milliseconds are not always equal to what we say it to insert, unskip when needed
    test.skip("should throw error if actual version does not equal expected version", () => Promise.all(connections.map(async connection => {

        const post = new PostWithVersion();
        post.title = "New post";
        await connection.manager.save(post);

       return expect(connection.createQueryBuilder(PostWithVersion, "post")
           .setLock("optimistic", 2)
           .where("post.id = :id", { id: 1 })
           .getOne()).toThrow(OptimisticLockVersionMismatchError);
    })));

    // skipped because inserted milliseconds are not always equal to what we say it to insert, unskip when needed
    test.skip("should not throw error if actual version and expected versions are equal", () => Promise.all(connections.map(async connection => {

        const post = new PostWithVersion();
        post.title = "New post";
        await connection.manager.save(post);

       return expect(connection.createQueryBuilder(PostWithVersion, "post")
           .setLock("optimistic", 1)
           .where("post.id = :id", { id: 1 })
           .getOne()).not.toThrow();
    })));

    // skipped because inserted milliseconds are not always equal to what we say it to insert, unskip when needed
    test.skip("should throw error if actual updated date does not equal expected updated date", () => Promise.all(connections.map(async connection => {

        const post = new PostWithUpdateDate();
        post.title = "New post";
        await connection.manager.save(post);

       return expect(connection.createQueryBuilder(PostWithUpdateDate, "post")
           .setLock("optimistic", new Date(2017, 1, 1))
           .where("post.id = :id", { id: 1 })
           .getOne()).toThrow(OptimisticLockVersionMismatchError);
    })));

    // skipped because inserted milliseconds are not always equal to what we say it to insert, unskip when needed
    test.skip("should not throw error if actual updated date and expected updated date are equal", () => Promise.all(connections.map(async connection => {

        if (connection.driver instanceof SqlServerDriver)
            return;

        const post = new PostWithUpdateDate();
        post.title = "New post";
        await connection.manager.save(post);

        return expect(connection.createQueryBuilder(PostWithUpdateDate, "post")
            .setLock("optimistic", post.updateDate)
            .where("post.id = :id", {id: 1})
            .getOne()).not.toThrow();
    })));

    // skipped because inserted milliseconds are not always equal to what we say it to insert, unskip when needed
    test.skip("should work if both version and update date columns applied", () => Promise.all(connections.map(async connection => {

        const post = new PostWithVersionAndUpdatedDate();
        post.title = "New post";
        await connection.manager.save(post);

        return Promise.all([
            expect(connection.createQueryBuilder(PostWithVersionAndUpdatedDate, "post")
                .setLock("optimistic", post.updateDate)
                .where("post.id = :id", { id: 1 })
                .getOne()).not.toThrow(),

            expect(connection.createQueryBuilder(PostWithVersionAndUpdatedDate, "post")
                .setLock("optimistic", 1)
                .where("post.id = :id", { id: 1 })
                .getOne()).not.toThrow()
        ]);
    })));

    test("should throw error if pessimistic locking not supported by given driver", () => Promise.all(connections.map(async connection => {
        if (connection.driver instanceof AbstractSqliteDriver || connection.driver instanceof CockroachDriver)
            return connection.manager.transaction(entityManager => {
                return Promise.all([
                    expect(entityManager.createQueryBuilder(PostWithVersion, "post")
                        .setLock("pessimistic_read")
                        .where("post.id = :id", { id: 1 })
                        .getOne()).toThrow(LockNotSupportedOnGivenDriverError),

                    expect(entityManager.createQueryBuilder(PostWithVersion, "post")
                        .setLock("pessimistic_write")
                        .where("post.id = :id", { id: 1 })
                        .getOne()).toThrow(LockNotSupportedOnGivenDriverError)
                ]);
            });

        return;
    })));

});
