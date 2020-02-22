import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {createTestingConnections, closeTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {User} from "./entity/User.ts";
import {MysqlDriver} from "../../../src/driver/mysql/MysqlDriver.ts";
//import {PostgresDriver} from "../../../src/driver/postgres/PostgresDriver.ts";

describe("github issues > #1780 Support for insertion ignore on duplicate error", () => {
     let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [User],
        schemaCreate: true,
        dropSchema: true,
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));
     let user1 = new User();
    user1.first_name = "John";
    user1.last_name = "Lenon";
    user1.is_updated = "no";
     let user2 = new User();
    user2.first_name = "John";
    user2.last_name = "Lenon";
    user2.is_updated = "yes";
     // let data = [user1, user2];
    // Bulk insertion with duplicated data through same query with duplicate error exception is not supported in PostgreSQL
    // https://doxygen.postgresql.org/nodeModifyTable_8c_source.html : Line 1356
     it("should save one row without duplicate error in MySQL/MariaDB", () => Promise.all(connections.map(async connection => {
      try {
         if (connection.driver instanceof MysqlDriver) {
             const UserRepository = connection.manager.getRepository(User);
             // ignore while insertion duplicated row
            await UserRepository
                .createQueryBuilder()
                .insert()
                .orIgnore()
                .into(User)
                .values(user1)
                .execute();
             await UserRepository
                .createQueryBuilder()
                .insert()
                .orIgnore()
                .into(User)
                .values(user2)
                .execute();
             let loadedUser_1 = await UserRepository.find();
            expect(loadedUser_1).not.to.be.eql([]);
            loadedUser_1.length.should.be.equal(1);
             // remove all rows
            await UserRepository.remove(loadedUser_1);
             let loadedUser_2 = await UserRepository.find();
            expect(loadedUser_2).to.be.eql([]);
             // update while insertion duplicated row
            await UserRepository
                .createQueryBuilder()
                .insert()
                .orUpdate({ columns: [ "is_updated" ] })
                .setParameter("is_updated", user1.is_updated)
                .into(User)
                .values(user1)
                .execute();
             await UserRepository
                .createQueryBuilder()
                .insert()
                .orUpdate({ columns: [ "is_updated" ] })
                .setParameter("is_updated", user2.is_updated)
                .into(User)
                .values(user2)
                .execute();
             let loadedUser_3 = await UserRepository.find();
            expect(loadedUser_3).not.to.be.eql([]);
            loadedUser_3.length.should.be.equal(1);
            expect(loadedUser_3[0]).to.deep.include({ first_name: "John", last_name: "Lenon", is_updated: "yes" });
        }
       } catch (err) {
           throw new Error(err);
      }
     })));
     it("should save one row without duplicate error in PostgreSQL", () => Promise.all(connections.map(async connection => {
         try {
            if (false/*connection.driver instanceof PostgresDriver*/) { // TODO(uki00a) uncomment this when PostgresDriver is implemented.

                const UserRepository = connection.manager.getRepository(User);
                 // ignore while insertion duplicated row
                await UserRepository
                    .createQueryBuilder()
                    .insert()
                    .orIgnore()
                    .into(User)
                    .values(user1)
                    .execute();
                 await UserRepository
                    .createQueryBuilder()
                    .insert()
                    .orIgnore()
                    .into(User)
                    .values(user2)
                    .execute();
                 let loadedUser_1 = await UserRepository.find();
                expect(loadedUser_1).not.to.be.eql([]);
                loadedUser_1.length.should.be.equal(1);
                 // remove all rows
                await UserRepository.remove(loadedUser_1);
                 let loadedUser_2 = await UserRepository.find();
                expect(loadedUser_2).to.be.eql([]);
                 // update while insertion duplicated row via unique columns
                await UserRepository
                    .createQueryBuilder()
                    .insert()
                    .orUpdate({ columns: [ "is_updated" ], conflict_target: [ "first_name", "last_name" ] })
                    .setParameter("is_updated", user1.is_updated)
                    .into(User)
                    .values(user1)
                    .execute();
                 await UserRepository
                    .createQueryBuilder()
                    .insert()
                    .orUpdate({ columns: [ "is_updated" ], conflict_target: [ "first_name", "last_name" ] })
                    .setParameter("is_updated", user2.is_updated)
                    .into(User)
                    .values(user2)
                    .execute();
                 let loadedUser_3 = await UserRepository.find();
                expect(loadedUser_3).not.to.be.eql([]);
                loadedUser_3.length.should.be.equal(1);
                expect(loadedUser_3[0]).to.deep.include({ first_name: "John", last_name: "Lenon", is_updated: "yes" });
                 // create unique constraint
                await connection.manager.query("ALTER TABLE \"user\" ADD CONSTRAINT constraint_unique_idx UNIQUE USING INDEX unique_idx;");
                 await UserRepository.remove(loadedUser_3);
                 let loadedUser_4 = await UserRepository.find();
                expect(loadedUser_4).to.be.eql([]);
                 // update while insertion duplicated row via unique's constraint name
                await UserRepository
                    .createQueryBuilder()
                    .insert()
                    .orUpdate({ columns: [ "is_updated" ], conflict_target: "constraint_unique_idx" })
                    .setParameter("is_updated", user1.is_updated)
                    .into(User)
                    .values(user1)
                    .execute();
                 await UserRepository
                    .createQueryBuilder()
                    .insert()
                    .orUpdate({ columns: [ "is_updated" ], conflict_target: "constraint_unique_idx" })
                    .setParameter("is_updated", user2.is_updated)
                    .into(User)
                    .values(user2)
                    .execute();
                 let loadedUser_5 = await UserRepository.find();
                expect(loadedUser_5).not.to.be.eql([]);
                loadedUser_5.length.should.be.equal(1);
                expect(loadedUser_3[0]).to.deep.include({ first_name: "John", last_name: "Lenon", is_updated: "yes" });
            }
        }
        catch (err) {
           throw new Error(err);
        }
    })));
 });

runIfMain(import.meta);
