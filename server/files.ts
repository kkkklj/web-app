import { excludeFileReg } from '@/config/posts';
import fs, { PathLike } from 'fs';
import path from 'path';
export const FilesPaths = (dirName:string) => {
  const directoryPath = path.join(process.cwd(), dirName);
  const files = fs.readdirSync(directoryPath);
  return files
}

export const isFile = (dir:PathLike) => {
  return fs.statSync(dir).isFile();
}

export const readDir = (dir:PathLike) => fs.readdirSync(dir)

export const getDirName = (dir:string) => dir.slice(dir.lastIndexOf('/')+1, dir.length)

export const readMdxFileToString = (_path:string) => {
  try {
    _path = path.join(process.cwd(), _path)
    console.log('ff-->',fs.readFileSync(_path).toString())
    return fs.readFileSync(_path).toString()
  } catch (error) {
    console.log('eee-->',error)
    return ''
  }
};

export const filesFilter = (files:string[]) => {
  const type:string = 'exclude';
  switch (type) {
    case 'exclude': // 过滤掉忽略的文件、文件夹
      files = files.filter(item => !excludeFileReg.test(item));
      break;
    default:
      break;
  }
  return files;
}