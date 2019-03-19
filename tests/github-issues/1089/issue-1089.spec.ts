import "reflect-metadata";
import {closeTestingConnections, createTestingConnections} from "../../utils/test-utils";
import {Connection} from "../../../src";
import {Group} from "./entity/Group";

describe("github issues > #1089 UUID in ClosureEntity", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        schemaCreate: false,
        dropSchema: true
    }));
    afterAll(() => closeTestingConnections(connections));

    test("should correctly work with primary UUID column", () => Promise.all(connections.map(async connection => {
        await connection.synchronize();

        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("group");
        await queryRunner.release();

        expect(table)!.toBeDefined();

        const groupRepository = connection.getTreeRepository(Group);

        const a1 = new Group();
        a1.name = "a1";
        await groupRepository.save(a1);

        const a11 = new Group();
        a11.name = "a11";
        a11.parent = a1;
        await groupRepository.save(a11);

        const a12 = new Group();
        a12.name = "a12";
        a12.parent = a1;
        await groupRepository.save(a12);

        const rootGroups = await groupRepository.findRoots();
        expect(rootGroups.length).toEqual(1);

        const a11Parent = await groupRepository.findAncestors(a11);
        expect(a11Parent.length).toEqual(2);

        const a1Children = await groupRepository.findDescendants(a1);
        expect(a1Children.length).toEqual(3);

    })));

});
