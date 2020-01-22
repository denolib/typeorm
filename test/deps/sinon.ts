import "./global.ts";
// @deno-types="https://unpkg.com/@types/sinon@7.5.1/index.d.ts"
import "https://unpkg.com/sinon@8.1.0/pkg/sinon.js";
// FIXME(uki00a) this should be avoided.
import { SinonStatic } from 'https://unpkg.com/@types/sinon@7.5.1/index.d.ts';

const _sinon = window.sinon as SinonStatic;
export default _sinon;
