export type AppErrorArgs = {
  message?: string;
};

export type RenderArgs = {
  language: string;
  style: number;
  ubl: string;
};

export type JSONValue =
  | string
  | number
  | boolean
  | { [x: string]: JSONValue }
  | Array<JSONValue>;
