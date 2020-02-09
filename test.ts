import {runTests} from "./test/deps/mocha.ts";

import "./test/integration/sample1-simple-entity.ts";
import "./test/functional/cascades/cascade-insert-from-both-sides/cascade-insert-from-both-sides.ts";
import "./test/functional/columns/embedded-columns/columns-embedded-columns.ts";
import "./test/functional/columns/getters-setters/columns-getters-setters.ts";
import "./test/functional/columns/no-select/columns-no-select.ts";
import "./test/functional/columns/readonly/columns-readonly.ts";
import "./test/functional/columns/update-insert/columns-update-insert.ts";
import "./test/functional/columns/value-transformer/value-transformer.ts";
import "./test/functional/connection/connection.ts";
import "./test/functional/connection-manager/connection-manager.ts";
import "./test/functional/connection-options-reader/connection-options-reader.ts";
import "./test/functional/cube/postgres/cube-postgres.ts";
import "./test/functional/database-schema/column-collation/cockroach/column-collation-cockroach.ts";
import "./test/functional/database-schema/column-collation/mssql/column-collation-mssql.ts";
import "./test/functional/database-schema/column-collation/mysql/column-collation-mysql.ts";
import "./test/functional/database-schema/column-collation/postgres/column-collation-postgres.ts";
import "./test/functional/database-schema/column-collation/sqlite/column-collation-sqlite.ts";
import "./test/functional/database-schema/column-length/mssql/column-length-mssql.ts";
import "./test/functional/database-schema/column-length/mysql/column-length-mysql.ts";
import "./test/functional/database-schema/column-length/postgres/column-length-postgres.ts";
import "./test/functional/database-schema/column-length/sap/column-length-sap.ts";
import "./test/functional/database-schema/column-length/sqlite/column-length-sqlite.ts";
import "./test/functional/database-schema/column-types/cockroachdb/column-types-cockroach.ts";
import "./test/functional/database-schema/column-types/mssql/column-types-mssql.ts";
import "./test/functional/database-schema/column-types/mysql/column-types-mysql.ts";
import "./test/functional/database-schema/column-types/oracle/column-types-oracle.ts";
import "./test/functional/database-schema/column-types/postgres/column-types-postgres.ts";
import "./test/functional/database-schema/column-types/postgres-enum/postgres-enum.ts";
import "./test/functional/database-schema/column-types/sap/column-types-sap.ts";
import "./test/functional/database-schema/column-types/sqlite/column-types-sqlite.ts";
import "./test/functional/database-schema/column-width/mysql/column-width.ts";
import "./test/functional/database-schema/enums/enums.ts";
import "./test/functional/database-schema/enums-array/enums-array.ts";
import "./test/functional/database-schema/indices/indices-create-modify.ts";
import "./test/functional/database-schema/mssql-parameters/mssql-parameters.ts";
import "./test/functional/database-schema/rowid-column/rowid-column.ts";
import "./test/functional/database-schema/sequences/sequence-create-test.ts";
import "./test/functional/database-schema/simple-enums/enums.ts";
import "./test/functional/database-schema/simple-enums-array/enums-array.ts";
import "./test/functional/decorators/embedded/query-builder-embedded.ts";
import "./test/functional/decorators/relation-count/relation-count-many-to-many/relation-count-decorator-many-to-many.ts";
import "./test/functional/decorators/relation-count/relation-count-one-to-many/relation-count-decorator-one-to-many.ts";
import "./test/functional/decorators/relation-id/relation-id-many-to-many/relation-id-decorator-many-to-many.ts";
import "./test/functional/decorators/relation-id/relation-id-many-to-one/relation-id-decorator-many-to-one.ts";
import "./test/functional/decorators/relation-id/relation-id-one-to-many/relation-id-decorator-one-to-many.ts";
import "./test/functional/decorators/relation-id/relation-id-one-to-one/relation-id-decorator-one-to-one.ts";
import "./test/functional/deferrable/deferrable.ts";
import "./test/functional/driver/convert-to-entity/convert-to-entity.ts";
import "./test/functional/embedded/basic-functionality/basic-functionality.ts";
import "./test/functional/embedded/embedded-listeners/embedded-listeners.ts";
import "./test/functional/embedded/embedded-many-to-many-case1/embedded-many-to-many-case1.ts";
import "./test/functional/embedded/embedded-many-to-many-case2/embedded-many-to-many-case2.ts";
import "./test/functional/embedded/embedded-many-to-many-case3/embedded-many-to-many-case3.ts";
import "./test/functional/embedded/embedded-many-to-many-case4/embedded-many-to-many-case4.ts";

runTests();
