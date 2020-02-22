import { MigrationInterface } from "../../../../src/migration/MigrationInterface.ts";
import { QueryRunner } from "../../../../src/query-runner/QueryRunner.ts";

export class ExampleMigrationThree1571426391120 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {}
    public async down(queryRunner: QueryRunner): Promise<any> {}
}
