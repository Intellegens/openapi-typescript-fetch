export type Method = 'get' | 'post' | 'put' | 'patch' | 'delete' | 'head' | 'options';
export type OpenapiPaths<Paths> = {
    [P in keyof Paths]: {
        [M in Method]?: unknown;
    };
};
type ContentTypes<C> = {
    'application/json': C;
} | {
    'text/csv': C;
} | {
    'text/plain': C;
};
export type OpArgType<OP> = OP extends {
    parameters?: {
        path?: infer P;
        query?: infer Q;
        body?: infer B;
    };
    requestBody?: {
        content: ContentTypes<infer RB>;
    };
} ? P & Q & (B extends Record<string, unknown> ? B[keyof B] : unknown) & RB : Record<string, never>;
type OpResponseTypes<OP> = OP extends {
    responses: infer R;
} ? {
    [S in keyof R]: R[S] extends {
        schema?: infer S;
    } ? S : R[S] extends {
        content: ContentTypes<infer C>;
    } ? C : R[S];
} : never;
type _OpReturnType<T> = 200 extends keyof T ? T[200] : 201 extends keyof T ? T[201] : 204 extends keyof T ? T[204] : 'default' extends keyof T ? T['default'] : unknown;
export type OpReturnType<OP> = _OpReturnType<OpResponseTypes<OP>>;
type _OpDefaultReturnType<T> = 'default' extends keyof T ? T['default'] : unknown;
export type OpDefaultReturnType<OP> = _OpDefaultReturnType<OpResponseTypes<OP>>;
declare const never: unique symbol;
type _OpErrorType<T> = {
    [S in Exclude<keyof T, 200 | 201 | 204>]: {
        status: S extends 'default' ? typeof never : S;
        data: T[S];
    };
}[Exclude<keyof T, 200 | 201 | 204>];
type Coalesce<T, D> = [T] extends [never] ? D : T;
export type OpErrorType<OP> = Coalesce<_OpErrorType<OpResponseTypes<OP>>, {
    status: number;
    data: any;
}>;
export type CustomRequestInit = Omit<RequestInit, 'headers'> & {
    readonly headers: Headers;
};
export type Fetch = (url: string, init: CustomRequestInit) => Promise<ApiResponse>;
export type _TypedFetch<OP> = (arg: OpArgType<OP>, init?: RequestInit) => Promise<ApiResponse<OpReturnType<OP>>>;
export type TypedFetch<OP> = _TypedFetch<OP> & {
    Error: new (error: ApiError) => ApiError & {
        getActualType: () => OpErrorType<OP>;
    };
};
export type FetchArgType<F> = F extends TypedFetch<infer OP> ? OpArgType<OP> : never;
export type FetchReturnType<F> = F extends TypedFetch<infer OP> ? OpReturnType<OP> : never;
export type FetchErrorType<F> = F extends TypedFetch<infer OP> ? OpErrorType<OP> : never;
type _CreateFetch<OP, Q = never> = [Q] extends [never] ? () => TypedFetch<OP> : (query: Q) => TypedFetch<OP>;
export type CreateFetch<M, OP> = M extends 'post' | 'put' | 'patch' | 'delete' ? OP extends {
    parameters: {
        query: infer Q;
    };
} ? _CreateFetch<OP, {
    [K in keyof Q]: true | 1;
}> : _CreateFetch<OP> : _CreateFetch<OP>;
export type Middleware = (url: string, init: CustomRequestInit, next: Fetch) => Promise<ApiResponse>;
export type FetchConfig = {
    baseUrl?: string;
    init?: RequestInit;
    use?: Middleware[];
};
export type Request = {
    baseUrl: string;
    method: Method;
    path: string;
    queryParams: string[];
    payload: Record<string, unknown>;
    init?: RequestInit;
    fetch: Fetch;
};
export type ApiResponse<R = any> = {
    readonly headers: Headers;
    readonly url: string;
    readonly ok: boolean;
    readonly status: number;
    readonly statusText: string;
    readonly data: R;
};
export declare class ApiError extends Error {
    readonly headers: Headers;
    readonly url: string;
    readonly status: number;
    readonly statusText: string;
    readonly data: any;
    constructor(response: Omit<ApiResponse, 'ok'>);
}
export {};
