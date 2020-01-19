/**
 * Thrown when user tries to call unimplemented method.
 */
export class NotImplementedError extends Error {
    name = "NotImplementedError";

    constructor(functionName: string) {
        super();
        this.message = `\`${functionName}\` is not supported`;
    }

}
