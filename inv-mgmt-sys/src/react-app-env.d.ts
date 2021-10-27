/// <reference types="react-scripts" />

// Less module
declare module '*.module.less' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
