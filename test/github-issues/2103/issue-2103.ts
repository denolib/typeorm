import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {createTestingConnections, closeTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/index.ts";
import {Simple} from "./entity/Simple.ts";
import {Complex} from "./entity/Complex.ts";

describe("github issues > #2103 query builder regression", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Complex, Simple],
        schemaCreate: true,
        dropSchema: true,
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("whereInIds should respect logical operator precedence > single simple primary key (in is used)", () => Promise.all(connections.map(async connection => {
        const repository = connection.getRepository(Simple);

        const savedEntities = await repository.save([
            repository.create({ x: 1 }),
            repository.create({ x: 2 }),
            repository.create({ x: 1 }),
            repository.create({ x: 3 })
        ]);

        savedEntities.length.should.be.equal(4); // check if they all are saved

        const ids = savedEntities.map(entity => entity.id);

        const entities = await repository.createQueryBuilder("s")
            .whereInIds(ids)
            .andWhere("s.x = 1")
            .getMany();

        entities.map(entity => entity.id).should.be.eql(
            savedEntities
                .filter(entity => entity.x === 1)
                .map(entity => entity.id)
        );
    })));

    it("whereInIds should respect logical operator precedence > multiple primary keys", () => Promise.all(connections.map(async connection => {
        const repository = connection.getRepository(Complex);

        // sqlite does not support autoincrement for composite primary key, so we pass ids by ourselves here
        const savedEntities = await repository.save([
            repository.create({ id: 1, code: 1, x: 1 }),
            repository.create({ id: 2, code: 1, x: 2 }),
            repository.create({ id: 3, code: 1, x: 1 }),
            repository.create({ id: 4, code: 1, x: 3 })
        ]);

        savedEntities.length.should.be.equal(4); // check if they all are saved

        const ids = savedEntities.map(entity => entity.id);

        const entities = await repository.createQueryBuilder("s")
            .whereInIds(ids.map(id => {
                return { id, code: 1 };
            }))
            .andWhere("s.x = 1")
            .getMany();

        entities.map(entity => entity.id).should.be.eql(
            savedEntities
                .filter(entity => entity.x === 1)
                .map(entity => entity.id)
        );
    })));

});

runIfMain(import.meta);
