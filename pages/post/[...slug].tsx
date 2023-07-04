// other import statements for styling etc.

import { useMDXComponents } from '@mdx-js/react';
import { Components, MDXProvider } from '@mdx-js/react/lib';
import CodBlock from '@/components/CodeBlock';
import {  getMdxPostPath } from '@/utils/mdxUtils';
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next"
import dynamic from 'next/dynamic'
import Hello from '@/components/hello';
import Wrapper from '@/components/post/Wrapper';
import { FilesPaths } from '@/server/files';
import { getDirTreeInit } from '@/server/posts/getTree';
// import Directory from "@/components/Directory"
//a function that chose one
function choseOne() {}
const mdxComp:Components = {
  pre: (props:any) => {
      console.log('props',props)
      return <div {...props} />
  },
  code: CodBlock,
  prerequisites:(prop:any) => {
    console.log('prerequisites',prop)
    return <>1111</>
  },
  title:() => <>33333</>,
  wrapper: Wrapper
}
export default function Home(props:{path:string}) {
  const {path} = props
  console.log('mdx-->',props)
  const DynamicComponent = dynamic(() => import('@/_posts/'+path))
  const comp = useMDXComponents(mdxComp)
  
  
  // console.log('mdx-->',path&& await import(path))
  return (
    <>
    {/* <Directory></Directory> */}
    <Hello></Hello>
      <MDXProvider components={comp}>
        {/* <ButtonMdx/> */}
        <DynamicComponent></DynamicComponent>
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
  console.log('getStaticProps',slug)

  return {
    props:{
      path:postRelativePath,
      files:treeObj
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
  console.log('getStaticPaths-->',staticPaths.map(item => item.params.slug),paths.length)
  return {
      paths:staticPaths,
      fallback: false,
      // files
  }
}
//1850/867
//2.1337946943483277