import { MigrationInterface } from "../../../../src/migration/MigrationInterface.ts";
import { QueryRunner } from "../../../../src/query-runner/QueryRunner.ts";
import { Table } from "../../../../src/schema-builder/table/Table.ts";

export class CreateUsers0000000000002 implements MigrationInterface {
    public up(queryRunner: QueryRunner): Promise<any> {
        return queryRunner.createTable(
            new Table({
                name: "users",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        default: "uuid_generate_v4()"
                    }
                ]
            })
        );
    }

    public down(queryRunner: QueryRunner): Promise<any> {
        return queryRunner.dropTable("users");
    }
}
