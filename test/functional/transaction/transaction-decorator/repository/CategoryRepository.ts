import { Repository } from "../../../../../src/repository/Repository.ts";
import { EntityRepository } from "../../../../../src/decorator/EntityRepository.ts";
import {Category} from "../entity/Category.ts";

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {

    findByName(name: string) {
        return this.findOne({ name });
    }

}
