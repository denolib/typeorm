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

runTests();
