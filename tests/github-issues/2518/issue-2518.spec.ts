import "reflect-metadata";
import {createTestingConnections, closeTestingConnections, reloadTestingDatabases} from "../../../test/utils/test-utils";
import {Connection} from "../../../src";
import {File} from "./entity/file.entity";
import {TreeRepository} from "../../../src";

describe("github issues > #2518 TreeRepository.findDescendantsTree does not load descendants when relationship id property exist", () => {
    let connections: Connection[];
    beforeAll(
        async () =>
        (connections = await createTestingConnections({
            entities: [__dirname + "/entity/*{.js,.ts}"]
        }))
    );

    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should load descendants when findDescendantsTree is called for a tree entity", () =>
        Promise.all(
            connections.map(async connection => {
                const repo: TreeRepository<File> = connection.getTreeRepository(File);
                const root: File = await repo.save({ id: 1, name: "root" } as File);
                const child = await repo.save({ id: 2, name: "child", parent: root } as File);
                expect(child.parentId).toEqual(1);
                const file: File | any = await repo.createQueryBuilder("file")
                    .where("file.id = :id", { id: 1 })
                    .getOne();
                await repo.findDescendantsTree(file);
                expect(file.children.length).toBeGreaterThan(0);
            })
        )
    );

    test("should load descendants when findTrees are called", () =>
        Promise.all(
            connections.map(async connection => {
                const repo = connection.getTreeRepository(File);
                const root: File = await repo.save({ id: 1, name: "root" } as File);
                const child = await repo.save({ id: 2, name: "child", parent: root } as File);
                expect(child.parentId).toEqual(1);
                const trees: File[] = await repo.findTrees();
                expect(trees).toContain("array");
                expect(trees[0].children.length).toBeGreaterThan(0);
            })
        )
    );
});
