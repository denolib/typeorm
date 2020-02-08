import {runTests} from "./test/deps/mocha.ts";
import "./test/integration/sample1-simple-entity.ts";
import "./test/functional/cascades/cascade-insert-from-both-sides/cascade-insert-from-both-sides.ts";
import "./test/functional/columns/embedded-columns/columns-embedded-columns.ts";
import "./test/functional/columns/getters-setters/columns-getters-setters.ts";
import "./test/functional/columns/no-select/columns-no-select.ts";

runTests();
