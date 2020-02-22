import { MigrationInterface } from "../../../../src/migration/MigrationInterface.ts";
import { QueryRunner } from "../../../../src/query-runner/QueryRunner.ts";
import { User } from "../entity/user.ts";

export class InsertUser0000000000003 implements MigrationInterface {
    public up(queryRunner: QueryRunner): Promise<any> {
        const userRepo = queryRunner.connection.getRepository<User>(User);
        return userRepo.save(new User());
    }

    public down(queryRunner: QueryRunner): Promise<any> {
        return Promise.resolve();
    }
}
