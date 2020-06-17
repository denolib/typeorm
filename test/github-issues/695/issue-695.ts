import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Device} from "./entity/Device.ts";
import {DeviceInstance} from "./entity/DeviceInstance.ts";

describe("github issues > #695 Join columns are not using correct length", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Device, DeviceInstance],
        enabledDrivers: ["mysql"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should set correct length on to join columns", () => Promise.all(connections.map(async connection => {

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

        table!.findColumnByName("device_id")!.type.should.be.equal("char");
        table!.findColumnByName("device_id")!.length!.should.be.equal("12");

    })));

});

runIfMain(import.meta);
