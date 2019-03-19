import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils";
import {Connection} from "../../../../src";
import {Post} from "./entity/Post";
import {Category} from "./entity/Category";
import {Counters} from "./entity/Counters";

describe("persistence > partial persist", () => {

    // -------------------------------------------------------------------------
    // Configuration
    // -------------------------------------------------------------------------

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    // -------------------------------------------------------------------------
    // Specifications
    // -------------------------------------------------------------------------

    test("should persist partial entities without data loss", () => Promise.all(connections.map(async connection => {

        const postRepository = connection.getRepository(Post);
        const categoryRepository = connection.getRepository(Category);

        // save a new category
        const newCategory = new Category();
        newCategory.id = 1;
        newCategory.name = "Animals";
        newCategory.position = 999;
        await categoryRepository.save(newCategory);

        // save a new post
        const newPost = new Post();
        newPost.id = 1;
        newPost.title = "All about animals";
        newPost.description = "Description of the post about animals";
        newPost.categories = [newCategory];
        newPost.counters = new Counters();
        newPost.counters.stars = 5;
        newPost.counters.commentCount = 2;
        newPost.counters.metadata = "Animals Metadata";
        await postRepository.save(newPost);

        // load a post
        const loadedPost = await postRepository.findOne(newPost.id, {
            join: {
                alias: "post",
                leftJoinAndSelect: {
                    categories: "post.categories"
                }
            }
        });

        expect(loadedPost!).not.toBeUndefined();
        expect(loadedPost!.categories).not.toBeUndefined();
        expect(loadedPost!.title).toEqual("All about animals");
        expect(loadedPost!.description).toEqual("Description of the post about animals");
        expect(loadedPost!.categories[0].name).toEqual("Animals");
        expect(loadedPost!.categories[0].position).toEqual(999);
        expect(loadedPost!.counters.metadata).toEqual("Animals Metadata");
        expect(loadedPost!.counters.stars).toEqual(5);
        expect(loadedPost!.counters.commentCount).toEqual(2);

        // now update partially
        await postRepository.update({ title: "All about animals" }, { title: "All about bears" });

        // now check if update worked as expected, title is updated and all other columns are not touched
        const loadedPostAfterTitleUpdate = await postRepository.findOne(1, {
            join: {
                alias: "post",
                leftJoinAndSelect: {
                    categories: "post.categories"
                }
            }
        });

        expect(loadedPostAfterTitleUpdate!).not.toBeUndefined();
        expect(loadedPostAfterTitleUpdate!.categories).not.toBeUndefined();
        expect(loadedPostAfterTitleUpdate!.title).toEqual("All about bears");
        expect(loadedPostAfterTitleUpdate!.description).toEqual("Description of the post about animals");
        expect(loadedPostAfterTitleUpdate!.categories[0].name).toEqual("Animals");
        expect(loadedPostAfterTitleUpdate!.categories[0].position).toEqual(999);
        expect(loadedPostAfterTitleUpdate!.counters.metadata).toEqual("Animals Metadata");
        expect(loadedPostAfterTitleUpdate!.counters.stars).toEqual(5);
        expect(loadedPostAfterTitleUpdate!.counters.commentCount).toEqual(2);

        // now update in partial embeddable column
        await postRepository.update({ id: 1 }, { counters: { stars: 10 } });

        // now check if update worked as expected, stars counter is updated and all other columns are not touched
        const loadedPostAfterStarsUpdate = await postRepository.findOne(1, {
            join: {
                alias: "post",
                leftJoinAndSelect: {
                    categories: "post.categories"
                }
            }
        });

        expect(loadedPostAfterStarsUpdate!).not.toBeUndefined();
        expect(loadedPostAfterStarsUpdate!.categories).not.toBeUndefined();
        expect(loadedPostAfterStarsUpdate!.title).toEqual("All about bears");
        expect(loadedPostAfterStarsUpdate!.description).toEqual("Description of the post about animals");
        expect(loadedPostAfterStarsUpdate!.categories[0].name).toEqual("Animals");
        expect(loadedPostAfterStarsUpdate!.categories[0].position).toEqual(999);
        expect(loadedPostAfterStarsUpdate!.counters.metadata).toEqual("Animals Metadata");
        expect(loadedPostAfterStarsUpdate!.counters.stars).toEqual(10);
        expect(loadedPostAfterStarsUpdate!.counters.commentCount).toEqual(2);

        // now update in relational column
        await postRepository.save({ id: 1, categories: [{ id: 1, name: "Bears" }] });

        // now check if update worked as expected, name of category is updated and all other columns are not touched
        const loadedPostAfterCategoryUpdate = await postRepository.findOne(1, {
            join: {
                alias: "post",
                leftJoinAndSelect: {
                    categories: "post.categories"
                }
            }
        });

        expect(loadedPostAfterCategoryUpdate!).not.toBeUndefined();
        expect(loadedPostAfterCategoryUpdate!.categories).not.toBeUndefined();
        expect(loadedPostAfterCategoryUpdate!.title).toEqual("All about bears");
        expect(loadedPostAfterCategoryUpdate!.description).toEqual("Description of the post about animals");
        expect(loadedPostAfterCategoryUpdate!.categories[0].name).toEqual("Bears");
        expect(loadedPostAfterCategoryUpdate!.categories[0].position).toEqual(999);
        expect(loadedPostAfterCategoryUpdate!.counters.metadata).toEqual("Animals Metadata");
        expect(loadedPostAfterCategoryUpdate!.counters.stars).toEqual(10);
        expect(loadedPostAfterCategoryUpdate!.counters.commentCount).toEqual(2);

    })));

});
