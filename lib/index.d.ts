import { Express, Router } from 'express-serve-static-core';

interface IInitializeOptions {
    document?: { [key: string]: any };
    title?: string;
    description?: string;
    termsOfService?: string;
    contact?: {
        name?: string;
        url?: string;
        email?: string;
    };
    licence?: {
        name?: string;
        url?: string;
    };
    version?: string;
    host?: string;
    basePath?: string;
    schemes?: string[];
    consumes?: string[];
    produces?: string[];
    paths?: { [key: string]: any };
    definitions?: { [key: string]: any };
    parameters?: { [key: string]: any };
    responses?: { [key: string]: any };
    securityDefinitions?: { [key: string]: any };
    security?: { [key: string]: any };
    defaultSecurity?: string | string[];
    tags?: {
        name?: string;
        description?: string;
        externalDocs?: {
            description?: string;
            url: string;
        }
    };
    externalDocs?: {
        description?: string
        url: string;
    }
}

interface IValid {
    valid: boolean;
    errors: object[];
    message: string;
}

interface JsonObject { [key: string]: any; }

export interface ISwaggerizedExpress extends Express {
    describe: any;
}

export interface ISwaggerizedRouter extends Router {
    describe: any;
}

export namespace common {
  function addModel(model: any, inputOptions?: any): void;
  function addResponse(response: any, options?: any): void;
  function addResponseHeader(responseHeader: any, options?: any): void;
  function addTag(tag: any, options?: any): void;
  namespace parameters {
    function addBody(body: any, options?: any): void;
    function addFormData(formData: any, options?: any): void;
    function addHeader(header: any, options?: any): void;
    function addPath(path: any, options?: any): void;
    function addQuery(query: any, options?: any): void;
  }
}
export function compile(): void;

export function initialise(app: Express, options: IInitializeOptions): void;
export function initialize(app: Express, options: IInitializeOptions): void;

export function json(): JsonObject;
export function reset(): void;
export function swaggerise(item: Express | Router): void;
export function swaggerize(item: Express | Router): void;
export function validate(): IValid;
export function ensureValid(data: any): void;
