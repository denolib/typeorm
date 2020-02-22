//let _Shim: any;
//try {
//    // We're in /test
//    _Shim = require("../../../../extra/typeorm-class-transformer-shim");
//} catch (e) {
//    // We're in /build/compiled/test
//    _Shim =  require("../../../../../extra/typeorm-class-transformer-shim");
//}

//export const Shim = _Shim;
export const Shim = {
    Column() {},
    OneToOne() {},
    OneToMany() {},
    ManyToOne() {},
    ManyToMany() {},
    JoinColumn() {},
    PrimaryGeneratedColumn() {},
    Entity() {},
    TreeParent() {}
} as any;
