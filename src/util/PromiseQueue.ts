import {deferred, Deferred} from "../../vendor/https/deno.land/std/util/async.ts";

export class PromiseQueue<T> {
    private queue = [] as Array<{ fn: () => Promise<T>, promise: Deferred<T> }>;
    private onEmptyPromise = deferred<void>();

    add(fn: () => Promise<T>): Promise<T> {
        const promise = deferred<T>();
        this.queue.push({ fn, promise });
        if (this.queue.length === 1) {
            this.dequeueLoop();
        }
        return promise;
    }

    onEmpty(): Promise<void> {
        return this.onEmptyPromise;
    }

    private async dequeueLoop(): Promise<void> {
        const [{ fn, promise }] = this.queue;
        try {
            const result = await fn();
            promise.resolve(result);
        } catch (error) {
            promise.reject(error);
        }
        this.queue.shift();

        if (this.queue.length > 0) {
            return this.dequeueLoop();
        } else {
            this.onEmptyPromise.resolve();
            this.onEmptyPromise = deferred<void>();
        }
    }
}
