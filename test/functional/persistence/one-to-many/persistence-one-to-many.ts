import {expect} from "../../../deps/chai.ts";
import {runIfMain} from "../../../deps/mocha.ts";
import {Connection} from "../../../../src/connection/Connection.ts";
import {Post} from "./entity/Post.ts";
import {Category} from "./entity/Category.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils.ts";

describe("persistence > one-to-many", function() {

    // -------------------------------------------------------------------------
    // Setup
    // -------------------------------------------------------------------------

    let connections: Connection[];
    before(() => {
        return createTestingConnections({
            entities: [Post, Category],
        }).then(all => connections = all);
    });
    after(() => closeTestingConnections(connections));
    beforeEach(() => reloadTestingDatabases(connections));

    // -------------------------------------------------------------------------
    // Specifications
    // -------------------------------------------------------------------------

    it("should add exist element to exist object with empty one-to-many relation and save it", () => Promise.all(connections.map(async connection => {

        const postRepository = connection.getRepository(Post);
        const categoryRepository = connection.getRepository(Category);

        const newCategory = categoryRepository.create();
        newCategory.name = "Animals";
        await categoryRepository.save(newCategory);

        const newPost = postRepository.create();
        newPost.title = "All about animals";
        await postRepository.save(newPost);

        newPost.categories = [newCategory];
        await postRepository.save(newPost);

        const loadedPost = await postRepository.findOne(newPost.id, { relations: ["categories"] });
        expect(loadedPost!).not.to.be.undefined;
        expect(loadedPost!.categories).not.to.be.undefined;
        expect(loadedPost!.categories![0]).not.to.be.undefined;

    })));

    it("should add exist element to new object with empty one-to-many relation and save it", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(Post);
        const categoryRepository = connection.getRepository(Category);

        const newCategory = categoryRepository.create();
        newCategory.name = "Animals";
        await categoryRepository.save(newCategory);

        const newPost = postRepository.create();
        newPost.title = "All about animals";
        newPost.categories = [newCategory];
        await postRepository.save(newPost);

        const loadedPost = await postRepository.findOne(newPost.id, { relations: ["categories"] });
        expect(loadedPost).not.to.be.undefined;
        expect(loadedPost!.categories).not.to.be.undefined;
        expect(loadedPost!.categories![0]).not.to.be.undefined;
    })));

    it("should remove exist element from one-to-many relation and save it", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(Post);
        const categoryRepository = connection.getRepository(Category);

        const firstNewCategory = categoryRepository.create();
        firstNewCategory.name = "Animals";
        await categoryRepository.save(firstNewCategory);

        const secondNewCategory = categoryRepository.create();
        secondNewCategory.name = "Insects";
        await categoryRepository.save(secondNewCategory);

        const newPost = postRepository.create();
        newPost.title = "All about animals";
        await postRepository.save(newPost);

        newPost.categories = [firstNewCategory, secondNewCategory];
        await postRepository.save(newPost);

        newPost.categories = [firstNewCategory];
        await postRepository.save(newPost);

        const loadedPost = await postRepository.findOne(newPost.id, {
            join: {
                alias: "post",
                innerJoinAndSelect: {
                    categories: "post.categories"
                }
            }
        });
        expect(loadedPost).not.to.be.undefined;
        expect(loadedPost!.categories).not.to.be.undefined;
        expect(loadedPost!.categories![0]).not.to.be.undefined;
        expect(loadedPost!.categories![1]).to.be.undefined;
    })));

    it("should remove all elements from one-to-many relation and save it", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(Post);
        const categoryRepository = connection.getRepository(Category);

        let firstNewCategory = categoryRepository.create();
        firstNewCategory.name = "Animals";
        await categoryRepository.save(firstNewCategory);

        let secondNewCategory = categoryRepository.create();
        secondNewCategory.name = "Insects";
        await categoryRepository.save(secondNewCategory);

        let newPost = postRepository.create();
        newPost.title = "All about animals";
        await postRepository.save(newPost);

        newPost.categories = [firstNewCategory, secondNewCategory];
        await postRepository.save(newPost);

        newPost.categories = [];
        await postRepository.save(newPost);

        const loadedPost = await postRepository.findOne(newPost.id, {
            join: {
                alias: "post",
                leftJoinAndSelect: {
                    categories: "post.categories"
                }
            }
        });
        expect(loadedPost).not.to.be.undefined;
        expect(loadedPost!.categories).to.be.eql([]);
    })));

    it("set relation to null (elements exist there) from one-to-many relation and save it", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(Post);
        const categoryRepository = connection.getRepository(Category);

        let firstNewCategory = categoryRepository.create();
        firstNewCategory.name = "Animals";
        await categoryRepository.save(firstNewCategory);

        let secondNewCategory = categoryRepository.create();
        secondNewCategory.name = "Insects";
        await categoryRepository.save(secondNewCategory);

        let newPost = postRepository.create();
        newPost.title = "All about animals";
        await postRepository.save(newPost);

        newPost.categories = [firstNewCategory, secondNewCategory];
        await postRepository.save(newPost);

        newPost.categories = null;
        await postRepository.save(newPost);

        const loadedPost = (await postRepository.findOne(newPost.id, {
            join: {
                alias: "post",
                leftJoinAndSelect: {
                    categories: "post.categories"
                }
            }
        }))!;
        expect(loadedPost).not.to.be.undefined;
        expect(loadedPost.categories).to.be.eql([]);
    })));

});

runIfMain(import.meta);
