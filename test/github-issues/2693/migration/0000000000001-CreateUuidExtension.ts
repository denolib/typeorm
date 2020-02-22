import { MigrationInterface } from "../../../../src/migration/MigrationInterface.ts";
import { QueryRunner } from "../../../../src/query-runner/QueryRunner.ts";

export class CreateUuidExtension0000000000001 implements MigrationInterface {
    public up(queryRunner: QueryRunner): Promise<any> {
        return queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
    }

    public down(queryRunner: QueryRunner): Promise<any> {
        return queryRunner.query("DROP EXTENSION \"uuid-ossp\"");
    }
}
