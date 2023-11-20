// other import statements for styling etc.

import { useMDXComponents } from '@mdx-js/react';
import { Components, MDXProvider } from '@mdx-js/react/lib';
import CodBlock from '@/components/CodeBlock';
import {  getMdxPostPath } from '@/utils/mdxUtils';
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next"
import dynamic from 'next/dynamic'
import Hello from '@/components/hello';
import Wrapper from '@/components/post/Wrapper';
import { FilesPaths, readMdxFileToString } from '@/server/files';
import { getDirTreeInit } from '@/server/posts/getTree';
import React, { createElement } from 'react'
import {compile,compileSync,evaluateSync,run, runSync } from '@mdx-js/mdx'
import remarkMdx from 'remark-mdx';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import { useEffect, useState,Fragment } from 'react';
import * as provider from '@mdx-js/react'
import * as runtime from 'react/jsx-runtime'
import * as devRuntime from "react/jsx-dev-runtime";
import {codeblocks} from "remark-code-blocks"
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import rehypeParse from 'rehype-parse'
import rehypeReact from 'rehype-react'
import remarkRehype from 'remark-rehype'
import remarkStringify from 'remark-stringify';

// import remarkToReact from 'remark-react';
import vm from "vm"
const mdxText = `
# Hello, world!

This is an MDX document.

`;
// import { mdxHastToJsx } from '@mdx-js/mdx/mdx-hast-to-jsx'
// import Directory from "@/components/Directory"
//a function that chose one
function choseOne() {}
const transformJsxToText = () => (tree:any) => {
  tree.children.forEach((child:any) => {
    console.log('child-->',child)
    if (child.type === 'jsx') {
      child.type = 'text';
      child.value = `<${child.value}>`;
    }
  });
};
const mdxComp:Components = {
  pre: (props:any) => {
      console.log('props',props)
      return <div {...props} />
  },
  code: CodBlock,
  title:() => <>33333</>,
  wrapper: Wrapper
}
export default function Home(props:{path:string,fileString:string}) {
  const {path,fileString} = props
  console.log('mdx-->',props)
  console.log('codeBlock',codeblocks)
  const MDXContent  = compileSync(fileString,{
    jsx:true,
    jsxRuntime:"automatic"
  })
  
  const comp = useMDXComponents(mdxComp)
  const options:any = {
    // ...provider,
    ...devRuntime,
    ...runtime,
    
    // Fragment:Symbol(React.fragment),
    
    development:true
  }
  const func = options.jsxDEV
  // options.jsxDEV = (prop,val,s) => {
  //   func(prop,val,s)
  // }
  const MdxComponent = evaluateSync(fileString,{
    ...options,
    
  }).default
  
  console.log('MdxComponent',MdxComponent({}),Hello(),MDXContent,options.Fragment,devRuntime.Fragment)
  
  // const runContent = runSync(MDXContent,runtime)
  console.log('runContent',MDXContent,MDXContent.result)
  const Cp = unified()
  .use(remarkParse)
  .use(remarkStringify)
  .use(remarkRehype)
  
  // .use(rehypeParse, {fragment: true})
  .use(rehypeReact, {createElement, Fragment})
  .processSync(MDXContent).result
  console.log('Cp',Cp)
  return (
    <>
    {/* <Directory></Directory> */}
    <Hello></Hello>
    
    {/* <MDXContent></MDXContent> */}
      <MDXProvider components={comp} >
        {/* <MdxComponent/> */}
        {/* {Cp} */}
        {/* <Cp></Cp> */}
      </MDXProvider>
    </>
  )
  
  ;
}

/**
 * 
 * @remark 需要注意的是，在开发时也就是 next dev 时，getStaticProps 会在每次页面访问时被请求，
 * @remark 也就是和 getServerSideProps 行为基本一致，刚上手时很容易对这里感到困惑。 
 */
export const getStaticProps:GetStaticProps = async (context) => {
 
  if(!context.params?.slug || !(context.params.slug instanceof Array)) {
    return {
      props:{
        status:404
      }
    }
  }
  const slug = context.params.slug.join('/')
  const postRelativePath = getMdxPostPath(slug)
  const treeObj = getDirTreeInit()?.treeObj;
  // console.log('getStaticProps',slug)
  // console.log('file-->',)
  const fileString = readMdxFileToString('/_posts/'+postRelativePath)
  return {
    props:{
      path:postRelativePath,
      fileString,
      files:treeObj,
      // MdxComponent
    }
  }
}

export const getStaticPaths: GetStaticPaths = (params) => {
  //only get the slug from posts 
  const {staticPaths} = getDirTreeInit()
  const paths = [
    {
      params: {
        slug:['typescript','README']
      }
    },
  ]
  // const paths = []
  // console.log('getStaticPaths-->',staticPaths.map(item => item.params.slug),paths.length)
  return {
      paths:staticPaths,
      fallback: false,
      // files
  }
}
//1850/867
//2.1337946943483277