import { type User } from "../custom";

// to make the file a module and avoid the TypeScript error
export {}

declare global {
  namespace Express {
    export interface Request {
      user?: Record<string,any>
      userId?: string;
      role?: string;
      [key: string]: any;
    }
  }
}
// Type definitions for method-override
// Project: https://github.com/expressjs/method-override
// Definitions by: Santi Albo <https://github.com/santialbo>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

declare namespace Express {
    export interface Request {
        originalMethod?: string | undefined;
    }
}

import express = require('express');

declare namespace e {
    export interface MethodOverrideOptions {
        methods: string[];
    }
}

declare function e(getter?: string | ((req: express.Request, res: express.Response) => string), options?: e.MethodOverrideOptions): express.RequestHandler;

export = e;