import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import { createTestingConnections, closeTestingConnections, reloadTestingDatabases } from "../../utils/test-utils.ts";
import { Connection } from "../../../src/connection/Connection.ts";
import { Category } from "./entity/Category.ts";
import { In } from "../../../src/index.ts";

describe("github issues > #3349 Multiple where conditions with parameters", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Category],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should work with query builder", () => Promise.all(connections.map(async connection => {

        const repository = connection.getRepository(Category);
        const category = new Category();
        category.id = 1;
        category.myField = 2;
        await repository.save(category);

        const result = await connection.createQueryBuilder()
            .select("category")
            .from(Category, "category")
            .where("category.id = :ida", { ida: 1 })
            .orWhereInIds([2])
            .orWhereInIds([3])
            .execute();

        expect(result).lengthOf(1);
    })));

    it("should work with findOne", () => Promise.all(connections.map(async connection => {

        const repository = connection.getRepository(Category);
        const category = new Category();
        category.id = 1;
        category.myField = 2;
        await repository.save(category);

        const result = await repository.findOne(1, {
            where: {
                myField: In([2, 3]),
            },
        });

        expect(result).to.not.be.null;
    })));

});

runIfMain(import.meta);
