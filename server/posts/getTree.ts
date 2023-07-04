import { log } from "console";
import { filesFilter, getDirName, isFile, readDir } from "../files";
import { join } from "path";

//components/file.2.js:
const fs = require('fs');
// 获取获取目录的类型，过滤i: ignore/包含c: contain
const type = process.env.getDirTreeType;
// 正则表达式 ["/node_modules|.git/i"]
let reg = process.env.getDirTreeReg;
type TypeStaticPath = {
  params: {
    slug:string[]
  }
}

let firstRun = true; // getDirTree首次执行
let output = ''; // 生成目录结构字符串
/**
 * 获取目录下的文件树
 * @param {读取的路径} dir 
 * @returns 返回 dir目录下的文件树
 */
function getDirTree(dir:string,staticPaths:TypeStaticPath[]) {
  let obj:{
    dir:string,
    childFiles:{short:string,full:string}[],
    childDir:{[key:string]:any}
    output?:string
  } = {
    dir: dir.replace(join(process.cwd(),'_posts'),''),
    childFiles: [],
    childDir: {}
  };
  let objStr = JSON.stringify(obj);
  if (firstRun && isFile(dir)) return console.log(`${dir}: 不是文件夹`);

  let files = readDir(dir);
  
  if (firstRun) {
    output=`${dir}\n`;
    // 根据正则过滤文件、文件夹
    files = filesFilter(files);
    // 过滤之后的文件、文件夹列表
    // log('files: ', files);
  }

  firstRun = false;

  // 遍历文件
  files.forEach((file, index) => {
    let tempdir = `${dir}/${file}`;
    let dirname = getDirName(tempdir);
    // dir深度
    let dirDeep = new Array(tempdir.split('/').length - 2).fill(0);
    
    dirDeep = dirDeep.reduce((acc,cur) => 
      acc = (dirDeep.length > 1 ? '  ' : '') + acc, 
      index === files.length - 1 ? '└─ ' : '├─ '
    );
    
    output += `${dirDeep}${dirname}\n`;
    // obj.output = output;

    // log('output: \n', output);
    
    


    if (isFile(tempdir)) {
      const full = tempdir.replace(join(process.cwd(),'_posts'),'')
      obj.childFiles.push({
        short: file, // 文件名
        full // 完整路径
      });
      if(full.length) {
        const slug = full.split('/').filter(i => i)
        const lastIndex = slug.length - 1
        const fileName = slug[lastIndex]
        slug.splice(lastIndex, 1, fileName.substring(0, fileName.lastIndexOf(".")))
        staticPaths.push({
          params: {
            slug
          }
        })
      }
    } else {
      // console.log('tempdir: ',tempdir);
      
      // 在当前文件夹的对象下 childDir 属性(1)，以文件夹名作为key(2)，
      // (2)的值是该目录下 路径dir、childFiles子文件、childDir子文件夹组成的对象或null
      obj.childDir[dirname] = getDirTree(tempdir,staticPaths);
    }
  });
  const logOutput = join(process.cwd(),'logs/posts/generate.txt')
  fs.writeFile(logOutput, output, 'utf8', (err:any) => {
    if (err) throw err;
  });
  return JSON.stringify(obj) === objStr ? null : obj;
}
export const getDirTreeInit = () => {
   const path = join(process.cwd(),'_posts')
  const staticPaths:TypeStaticPath[] = [] 
  let treeObj = getDirTree(path,staticPaths);
  
  if (treeObj) {
    return {treeObj,staticPaths}

  }
  return {staticPaths}
}
