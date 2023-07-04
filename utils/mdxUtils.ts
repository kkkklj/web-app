import matter from 'gray-matter';
import {join,normalize,resolve} from 'path';
import fs from 'fs';
import { verify } from 'crypto';
import { TypeMdxConfig, TypeMdxSuffix } from '@/types/post';

// structure of items
type Items =  {
    // each post has a parameter key that takes the value of a string
    [key: string] : string
}

// structure of a post
type Post = {
    data:{
        // each post has a parameter key that takes the value of a string
        [key: string] : string
    };
    // each post will include the post content associated with its parameter key
    content: string
    status:number
    path:string
}

// path to our list of available posts

const CONFIG_PATH = join(process.cwd(),'mdxConfig.json'),
mdxConfig:TypeMdxConfig = fs.existsSync(CONFIG_PATH) ? JSON.parse(fs.readFileSync(CONFIG_PATH,'utf-8')) : null,
POSTS_PATH = mdxConfig?.path || join(process.cwd(),'_posts'),
//限制文件类型
suffixLimit:TypeMdxSuffix[] = ['md','mdx'],

suffixList:string[] = mdxConfig?.type?.length 
? mdxConfig.type.filter(i => suffixLimit.includes(i)) 
: ['mdx'];


export function getMdxPostPath(slug:string):string {
    const relativePath = suffixList.reduce((prev,fileType) => {
        if(prev) {
            return prev
        }
        const path = join(POSTS_PATH,`${slug}.${fileType}`);
        const isExist = fs.existsSync(path)
        return isExist ? `${slug}.${fileType}` : '';
    },'')
    return relativePath
}

// export function getPostPath