import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/index.ts";
import {Provider} from "./entity/Provider.ts";
import {Personalization} from "./entity/Personalization.ts";

describe("github issues > #1788 One to One does not load relationships.", () => {
    let connections: Connection[];
    before(
        async () =>
            (connections = await createTestingConnections({
                entities: [Personalization, Provider],
                enabledDrivers: ["mysql"]
            }))
    );
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should work as expected when using find* methods with relations explicitly provided", () => Promise.all(connections.map(async connection => {
            const personalizationRepository = connection.getRepository(
                Personalization
            );
            const providerRepository = connection.getRepository(Provider);
            const personalization = personalizationRepository.create({
                logo: "https://typeorm.io/logo.png"
            });
            await personalizationRepository.save(personalization);

            const provider = providerRepository.create({
                name: "Provider",
                description: "Desc",
                personalization
            });

            await providerRepository.save(provider);

            const dbProvider = await providerRepository.find({
                relations: ["personalization"]
            });

            expect(dbProvider[0].personalization).to.not.eql(undefined);
        })
    ));
});

runIfMain(import.meta);
