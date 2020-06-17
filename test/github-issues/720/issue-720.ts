import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Participant} from "./entity/Participant.ts";
import {Message} from "./entity/Message.ts";
import {Translation} from "./entity/Translation.ts";
import {Locale} from "./entity/Locale.ts";

describe("github issues > #720 `.save()` not updating composite key with Postgres", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Locale, Message, Participant, Translation],
        enabledDrivers: ["postgres"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should not insert new entity when entity already exist with same primary keys", () => Promise.all(connections.map(async connection => {

        const participants = [];

        participants[0] = new Participant();
        participants[0].order_id = 1;
        participants[0].distance = "one";
        participants[0].price = "100$";

        participants[1] = new Participant();
        participants[1].order_id = 1;
        participants[1].distance = "two";
        participants[1].price = "200$";

        participants[2] = new Participant();
        participants[2].order_id = 1;
        participants[2].distance = "three";
        participants[2].price = "300$";

        await connection.manager.save(participants);

        const count1 = await connection.manager.count(Participant);
        expect(count1).to.be.equal(3);

        const updatedParticipants = [];
        updatedParticipants[0] = new Participant();
        updatedParticipants[0].order_id = 1;
        updatedParticipants[0].distance = "one";
        updatedParticipants[0].price = "150$";

        updatedParticipants[1] = new Participant();
        updatedParticipants[1].order_id = 1;
        updatedParticipants[1].distance = "two";
        updatedParticipants[1].price = "250$";

        await connection.manager.save(updatedParticipants);

        const count2 = await connection.manager.count(Participant);
        expect(count2).to.be.equal(3);

        const loadedParticipant1 = await connection.manager.findOne(Participant, { order_id: 1, distance: "one" });
        expect(loadedParticipant1!.order_id).to.be.equal(1);
        expect(loadedParticipant1!.distance).to.be.equal("one");
        expect(loadedParticipant1!.price).to.be.equal("150$");

        const loadedParticipant2 = await connection.manager.findOne(Participant, { order_id: 1, distance: "two" });
        expect(loadedParticipant2!.order_id).to.be.equal(1);
        expect(loadedParticipant2!.distance).to.be.equal("two");
        expect(loadedParticipant2!.price).to.be.equal("250$");

    })));

    it("reproducing second comment issue", () => Promise.all(connections.map(async connection => {

        const message = new Message();
        await connection.manager.save(message);

        const locale = new Locale();
        locale.code = "US";
        locale.englishName = "USA";
        locale.name = message;
        await connection.manager.save(locale);

        const translation = new Translation();
        translation.message = message;
        translation.locale = locale;
        translation.text = "Some Text";
        await connection.manager.save(translation);

        // change its text and save again
        translation.text = "Changed Text";
        await connection.manager.save(translation);

        const foundTranslation = await connection.manager.getRepository(Translation).findOne({
            locale: {
                code: "US"
            },
            message: {
                id: "1"
            }
        });
        expect(foundTranslation).to.be.eql({
            text: "Changed Text"
        });
    })));

});

runIfMain(import.meta);
