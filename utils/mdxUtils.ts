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

const mdxSuffixReg = RegExp(`\\.[${suffixList.join('|')}]?$`)
// get the file paths of all available list of posts
function getPostsFilePaths(): string[]{
    return (
        
        // return the mdx file post path
        fs.readdirSync(POSTS_PATH)
        // load the post content from the mdx files
        .filter((path) => mdxSuffixReg.test(path))
    )
}

// getting a single post
export function getPost(slug:string):Post {
    // add path/location to a single post
    // console.log('POSTS_PATH',POSTS_PATH)
    
    const fullPath = suffixList.reduce((prev,fileType) => {
        if(prev) {
            return prev
        }
        const path = join(POSTS_PATH,`${slug}.${fileType}`);
        console.log('psth',path)
        const isExist = fs.existsSync(path)
        return isExist ? path : '';
    },'')
    console.log('POSTS_PATH',POSTS_PATH,resolve(POSTS_PATH),fullPath,slug)
    // const mdxPath = join(POSTS_PATH,`${slug}.mdx`),
    //     mdPath = join(POSTS_PATH,`${slug}.md`);
    // // const fullPath = fs.existsSync(mdxPath) ? mdxPath : mdPath;
    // const isExist = fs.existsSync(fullPath) 
    if(fullPath) {
        // post's content
        const fileContents = fs.readFileSync(fullPath,'utf-8');
        
        // get the front matter data and content
        const {data,content} = matter(fileContents);
        // return the front matter data and content
        return { data,content,status:200,path:fullPath};
    } else {
        return {
            data:{},
            content:'',
            status:404,
            path:''
        }
    }
}

// load the post items
export function getPostItems(filePath:string,fields:string[] = []): Items{
    // create a slug from the mdx file location
    const slug = filePath.replace(mdxSuffixReg,"");
    // get the front matter data and content
    const {data,content} = getPost(slug);

    const items: Items = {};

    // just load and include the content needed
    fields.forEach((field) => {
        // load the slug
        if(field === 'slug'){
            items[field] = slug;
        }
        // load the post content
        if(field === 'content'){
            items[field] = content;
        }
        // check if the above specified field exists on data
        if(data[field]){
            // verify the fileds has data
            items[field] = data[field];
        }
    });
    // return the post items
    return items;
}

// getting all posts
export function getAllPosts(fields: string[]): Items []{
    // add paths for getting all posts 
    const filePaths = getPostsFilePaths();
    // get the posts from the filepaths with the needed fields sorted by date
    const posts = filePaths.map((filePath) => getPostItems(filePath,fields)).sort((post1,post2) => post1.date > post2.date ? 1 : -1);
    // return the available post
    return posts;
}

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