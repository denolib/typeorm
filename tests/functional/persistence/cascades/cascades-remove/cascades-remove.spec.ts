import "reflect-metadata";
import {Connection} from "../../../../../src";
import {Photo} from "./entity/Photo";
import {User} from "./entity/User";
import {
    closeTestingConnections,
    createTestingConnections,
    reloadTestingDatabases
} from "../../../../../test/utils/test-utils";

// todo: fix later
describe.skip("persistence > cascades > remove", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({ __dirname, enabledDrivers: ["mysql"] }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should remove everything by cascades properly", () => Promise.all(connections.map(async connection => {

        await connection.manager.save(new Photo("Photo #1"));

        const user = new User();
        user.id = 1;
        user.name = "Mr. Cascade Danger";
        user.manyPhotos = [new Photo("one-to-many #1"), new Photo("one-to-many #2")];
        user.manyToManyPhotos = [new Photo("many-to-many #1"), new Photo("many-to-many #2"), new Photo("many-to-many #3")];
        await connection.manager.save(user);

        const loadedUser = await connection.manager
            .createQueryBuilder(User, "user")
            .leftJoinAndSelect("user.manyPhotos", "manyPhotos")
            .leftJoinAndSelect("user.manyToManyPhotos", "manyToManyPhotos")
            .getOne();

        expect(loadedUser!.id).toEqual(1);
        expect(loadedUser!.name).toEqual("Mr. Cascade Danger");

        const manyPhotoNames = loadedUser!.manyPhotos.map(photo => photo.name);
        expect(manyPhotoNames.length).toEqual(2);
        expect(manyPhotoNames).toContain("one-to-many #1");
        expect(manyPhotoNames).toContain("one-to-many #2");

        const manyToManyPhotoNames = loadedUser!.manyToManyPhotos.map(photo => photo.name);
        expect(manyToManyPhotoNames.length).toEqual(3);
        expect(manyToManyPhotoNames).toContain("many-to-many #1");
        expect(manyToManyPhotoNames).toContain("many-to-many #2");
        expect(manyToManyPhotoNames).toContain("many-to-many #3");

        await connection.manager.remove(user);

        const allPhotos = await connection.manager.find(Photo);
        expect(allPhotos.length).toEqual(1);
        expect(allPhotos[0].name).toEqual("Photo #1");
    })));

});
