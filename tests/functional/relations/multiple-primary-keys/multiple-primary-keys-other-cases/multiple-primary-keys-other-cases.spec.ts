import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../../utils/test-utils";
import {Connection} from "../../../../../src";
import {User} from "./entity/User";
import {EventMember} from "./entity/EventMember";
import {Event} from "./entity/Event";
import {Person} from "./entity/Person";

describe("relations > multiple-primary-keys > other-cases", () => {
    
    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should load related entity when entity uses relation ids as primary id", () => Promise.all(connections.map(async connection => {

        const user1 = new User();
        user1.name = "Alice";
        await connection.manager.save(user1);

        const user2 = new User();
        user2.name = "Bob";
        await connection.manager.save(user2);

        const user3 = new User();
        user3.name = "Clara";
        await connection.manager.save(user3);

        const person1 = new Person();
        person1.fullName = "Alice A";
        person1.user = user1;
        await connection.manager.save(person1);

        const person2 = new Person();
        person2.fullName = "Bob B";
        person2.user = user2;
        await connection.manager.save(person2);

        const event1 = new Event();
        event1.name = "Event #1";
        event1.author = person1;
        await connection.manager.save(event1);

        const event2 = new Event();
        event2.name = "Event #2";
        event2.author = person2;
        await connection.manager.save(event2);

        const eventMember1 = new EventMember();
        eventMember1.user = user1;
        eventMember1.event = event1;
        await connection.manager.save(eventMember1);

        const eventMember2 = new EventMember();
        eventMember2.user = user2;
        eventMember2.event = event1;
        await connection.manager.save(eventMember2);

        const eventMember3 = new EventMember();
        eventMember3.user = user1;
        eventMember3.event = event2;
        await connection.manager.save(eventMember3);

        const eventMember4 = new EventMember();
        eventMember4.user = user3;
        eventMember4.event = event2;
        await connection.manager.save(eventMember4);

        const loadedEvents = await connection.manager
            .createQueryBuilder(Event, "event")
            .leftJoinAndSelect("event.author", "author")
            .leftJoinAndSelect("author.user", "authorUser")
            .leftJoinAndSelect("event.members", "members")
            .leftJoinAndSelect("members.user", "user")
            .orderBy("event.id, user.id")
            .getMany();

        expect(loadedEvents[0].author).not.toBeUndefined();
        expect(loadedEvents[0].author.fullName).toEqual("Alice A");
        expect(loadedEvents[0].author.user).not.toBeUndefined();
        expect(loadedEvents[0].author.user.id).toEqual(1);
        expect(loadedEvents[0].members).not.toEqual([]);
        expect(loadedEvents[0].members[0].user.id).toEqual(1);
        expect(loadedEvents[0].members[0].user.name).toEqual("Alice");
        expect(loadedEvents[0].members[1].user.id).toEqual(2);
        expect(loadedEvents[0].members[1].user.name).toEqual("Bob");
        expect(loadedEvents[1].author).not.toBeUndefined();
        expect(loadedEvents[1].author.fullName).toEqual("Bob B");
        expect(loadedEvents[1].author.user).not.toBeUndefined();
        expect(loadedEvents[1].author.user.id).toEqual(2);
        expect(loadedEvents[1].members).not.toEqual([]);
        expect(loadedEvents[1].members[0].user.id).toEqual(1);
        expect(loadedEvents[1].members[0].user.name).toEqual("Alice");
        expect(loadedEvents[1].members[1].user.id).toEqual(3);
        expect(loadedEvents[1].members[1].user.name).toEqual("Clara");

        const loadedUsers = await connection.manager
            .createQueryBuilder(User, "user")
            .leftJoinAndSelect("user.members", "members")
            .leftJoinAndSelect("members.event", "event")
            .orderBy("user.id, event.id")
            .getMany();

        expect(loadedUsers[0].members).not.toEqual([]);
        expect(loadedUsers[0].members[0].event.id).toEqual(1);
        expect(loadedUsers[0].members[0].event.name).toEqual("Event #1");
        expect(loadedUsers[0].members[1].event.id).toEqual(2);
        expect(loadedUsers[0].members[1].event.name).toEqual("Event #2");
        expect(loadedUsers[1].members).not.toEqual([]);
        expect(loadedUsers[1].members[0].event.id).toEqual(1);
        expect(loadedUsers[1].members[0].event.name).toEqual("Event #1");
        expect(loadedUsers[2].members).not.toEqual([]);
        expect(loadedUsers[2].members[0].event.id).toEqual(2);
        expect(loadedUsers[2].members[0].event.name).toEqual("Event #2");

    })));

});
