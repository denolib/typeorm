import {runIfMain} from "../../../deps/mocha.ts";
import {expect} from "../../../deps/chai.ts";
// TODO(uki00a) uncomment this when CockroachDriver is implemented.
//import {CockroachDriver} from "../../../../src/driver/cockroachdb/CockroachDriver.ts";
import {Album} from "./entity/Album.ts";
import {Category} from "./entity/Category.ts";
import {Connection} from "../../../../src/index.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils.ts";
import {Photo} from "./entity/Photo.ts";
import {PhotoAlbumCategory} from "./entity/PhotoAlbumCategory.ts";
import {Post} from "./entity/Post.ts";
import {PostCategory} from "./entity/PostCategory.ts";

describe("view entity > general", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Album, Category, Photo, PhotoAlbumCategory, Post, PostCategory]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should create entity view from query builder definition", () => Promise.all(connections.map(async connection => {
        const queryRunner = connection.createQueryRunner();

        const postCategory = await queryRunner.getView("post_category");
        const photoAlbumCategory = await queryRunner.getView("photo_album_category");

        expect(postCategory).to.be.exist;
        expect(photoAlbumCategory).to.be.exist;

        await queryRunner.release();

    })));

    it("should correctly return data from View", () => Promise.all(connections.map(async connection => {
        const category1 = new Category();
        category1.name = "Cars";
        await connection.manager.save(category1);

        const category2 = new Category();
        category2.name = "Airplanes";
        await connection.manager.save(category2);

        const post1 = new Post();
        post1.name = "About BMW";
        post1.categoryId = category1.id;
        await connection.manager.save(post1);

        const post2 = new Post();
        post2.name = "About Boeing";
        post2.categoryId = category2.id;
        await connection.manager.save(post2);

        const album1 = new Album();
        album1.name = "BMW photos";
        album1.categoryId = category1.id;
        await connection.manager.save(album1);

        const album2 = new Album();
        album2.name = "Boeing photos";
        album2.categoryId = category2.id;
        await connection.manager.save(album2);

        const photo1 = new Photo();
        photo1.name = "BMW E39";
        photo1.albumId = album1.id;
        await connection.manager.save(photo1);

        const photo2 = new Photo();
        photo2.name = "BMW E60";
        photo2.albumId = album1.id;
        await connection.manager.save(photo2);

        const photo3 = new Photo();
        photo3.name = "Boeing 737";
        photo3.albumId = album2.id;
        await connection.manager.save(photo3);

        const postCategories = await connection.manager.find(PostCategory);
        postCategories.length.should.be.equal(2);

        const postId1 = false/*connection.driver instanceof CockroachDriver*/ ? "1" : 1; // TODO(uki00a) uncomment this when CockroachDriver is implemented.
        postCategories[0].id.should.be.equal(postId1);
        postCategories[0].name.should.be.equal("About BMW");
        postCategories[0].categoryName.should.be.equal("Cars");

        const postId2 = false/*connection.driver instanceof CockroachDriver*/ ? "2" : 2; // TODO(uki00a) uncomment this when CockroachDriver is implemented.
        postCategories[1].id.should.be.equal(postId2);
        postCategories[1].name.should.be.equal("About Boeing");
        postCategories[1].categoryName.should.be.equal("Airplanes");

        const photoAlbumCategories = await connection.manager.find(PhotoAlbumCategory);
        photoAlbumCategories.length.should.be.equal(2);

        const photoId1 = false/*connection.driver instanceof CockroachDriver*/ ? "1" : 1; // TODO(uki00a) uncomment this when CockroachDriver is implemented.
        photoAlbumCategories[0].id.should.be.equal(photoId1);
        photoAlbumCategories[0].name.should.be.equal("BMW E39");
        photoAlbumCategories[0].albumName.should.be.equal("BMW photos");
        photoAlbumCategories[0].categoryName.should.be.equal("Cars");

        const photoId2 = false/*connection.driver instanceof CockroachDriver*/ ? "2" : 2; // TODO(uki00a) uncomment this when CockroachDriver is implemented.
        photoAlbumCategories[1].id.should.be.equal(photoId2);
        photoAlbumCategories[1].name.should.be.equal("BMW E60");
        photoAlbumCategories[1].albumName.should.be.equal("BMW photos");
        photoAlbumCategories[1].categoryName.should.be.equal("Cars");

        const photoAlbumCategory = await connection.manager.findOne(PhotoAlbumCategory, { id: 1 });
        photoAlbumCategory!.id.should.be.equal(photoId1);
        photoAlbumCategory!.name.should.be.equal("BMW E39");
        photoAlbumCategory!.albumName.should.be.equal("BMW photos");
        photoAlbumCategory!.categoryName.should.be.equal("Cars");

    })));
});

runIfMain(import.meta);
