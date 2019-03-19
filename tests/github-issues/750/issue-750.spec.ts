import "reflect-metadata";
import {Connection} from "../../../src";
import {closeTestingConnections, createTestingConnections} from "../../utils/test-utils";
import {Post} from "./entity/Post";
import {IndexMetadata} from "../../../src/metadata/IndexMetadata";

describe("github issues > #750 Need option for Mysql's full text search", () => {

    let connections: Connection[];
    beforeAll(async () => {
        connections = await createTestingConnections({
            entities: [__dirname + "/entity/*{.js,.ts}"],
            enabledDrivers: ["mysql"],
            schemaCreate: true,
            dropSchema: true,
        });
    });
    afterAll(() => closeTestingConnections(connections));

    test("should correctly create SPATIAL and FULLTEXT indices", () => Promise.all(connections.map(async connection => {
        const queryRunner = connection.createQueryRunner();
        let table = await queryRunner.getTable("post");
        expect(table!.indices.length).toEqual(2);
        const spatialIndex = table!.indices.find(index => !!index.isSpatial);
        expect(spatialIndex)!.toBeDefined();
        const fulltextIndex = table!.indices.find(index => !!index.isFulltext);
        expect(fulltextIndex)!.toBeDefined();

        const metadata = connection.getMetadata(Post);
        const polygonColumn = metadata.findColumnWithPropertyName("polygon");
        const indexMetadata = new IndexMetadata({
            entityMetadata: metadata,
            columns: [polygonColumn!],
            args: {
                target: Post,
                spatial: true
            }
        });
        indexMetadata.build(connection.namingStrategy);
        metadata.indices.push(indexMetadata);

        const fulltextIndexMetadata = metadata.indices.find(index => index.isFulltext);
        fulltextIndexMetadata!.isFulltext = false;

        await connection.synchronize();
        table = await queryRunner.getTable("post");
        expect(table!.indices.length).toEqual(3);
        const spatialIndices = table!.indices.filter(index => !!index.isSpatial);
        expect(spatialIndices.length).toEqual(2);
        const fulltextIndex2 = table!.indices.find(index => !!index.isFulltext);
        expect(fulltextIndex2).toBeUndefined();

        await queryRunner.release();
    })));

});
