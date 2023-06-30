export interface IPost {
  slug:string;
  date:string;
  thumbnail:string;
  title:string;
  description:string;
  prerequisites:string[];
  stacks:string[];
}
export type TypeMdxSuffix = 'mdx' | 'md' 
export type TypeMdxConfig = {
  type:TypeMdxSuffix[],
  path:string
  [key:string]:any
}