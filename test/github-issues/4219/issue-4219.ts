import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
//import {plainToClass} from "class-transformer";

import {Photo} from "./entity/Photo.ts";
import {User} from "./entity/User.ts";

// TODO(uki00a) This suite is skipped because it depends on `class-transformer` module.
describe.skip("github issues > #4219 class-transformer-shim: support metadata reflection", () => {
    let plainToClass: Function = () => {};

    it("should create instances with the correct property types", () => {

        const photoLiteral = {
            url: "typeorm.io"
        };

        const user = plainToClass(User, {
            someDate: "Sat Jun 01 2019",
            oneToOnePhoto: photoLiteral,
            oneToManyPhotos: [photoLiteral],
            manyToOnePhoto: photoLiteral,
            manyToManyPhotos: [photoLiteral],
            treeChildrenPhotos: [photoLiteral],
            treeParentPhoto: photoLiteral
        });

        user.someDate.should.be.instanceof(Date);
        user.oneToOnePhoto.should.be.instanceof(Photo);
        user.oneToManyPhotos[0].should.be.instanceof(Photo);
        user.manyToOnePhoto.should.be.instanceof(Photo);
        user.manyToManyPhotos[0].should.be.instanceof(Photo);
        user.treeParentPhoto.should.be.instanceof(Photo);

    });

});

runIfMain(import.meta);
