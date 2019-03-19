import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils";
import {Connection} from "../../../src";
import {Device} from "./entity/Device";
import {DeviceInstance} from "./entity/DeviceInstance";

describe("github issues > #695 Join columns are not using correct length", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        enabledDrivers: ["mysql"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should set correct length on to join columns", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("device_instances");
        await queryRunner.release();

        const device = new Device();
        device.id = "ABCDEFGHIJKL";
        device.registrationToken = "123456";
        await connection.manager.save(device);

        const deviceInstance = new DeviceInstance();
        deviceInstance.id = "new post";
        deviceInstance.device = device;
        deviceInstance.instance = 10;
        deviceInstance.type = "type";
        await connection.manager.save(deviceInstance);

        expect(table!.findColumnByName("device_id")!.type).toEqual("char");
        expect(table!.findColumnByName("device_id")!.length)!.toEqual("12");

    })));

});
