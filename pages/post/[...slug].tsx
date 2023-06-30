// other import statements for styling etc.

import { useMDXComponents } from '@mdx-js/react';
import { Components, MDXProvider } from '@mdx-js/react/lib';
import CodBlock from '@/components/CodeBlock';
import { getAllPosts, getMdxPostPath, getPost } from '@/utils/mdxUtils';
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next"
import dynamic from 'next/dynamic'
import Hello from '@/components/hello';
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
  // h1:() => <>66666</>,
  wrapper: props => {
    console.log('wrapper',props)
    return (
      <div style={{padding: '20px', backgroundColor: 'tomato'}}>
        <main {...props} />
      </div>
    )
  }
  // wrapper: ({ children }) => <>{children}</>,
  // code: CodBlock
}
export default function Home({path}:{path:string}) {
  console.log('mdx-->',path)
  const DynamicComponent = dynamic(() => import('@/_posts/'+path))
  const comp = useMDXComponents(mdxComp)
  
  
  // console.log('mdx-->',path&& await import(path))
  return (
    <>
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
  // console.log('context.post',getPost(slug))
  // const { slug } = context.params as Iparams;
  const postRelativePath = getMdxPostPath(slug)
  const { path } = getPost(slug);
  // const {path} = context.params?.slug ?  getPost(context.params.slug.join('/')) : {path:''} 
  console.log('getStaticProps')
  return {
    props:{
      path:postRelativePath
    }
  }
}
export const getStaticPaths: GetStaticPaths = () => {
  //only get the slug from posts 
  const posts = getAllPosts(['slug']);
  
  // map through to return post paths
  const paths = posts.map((post) => ({
      params: {
          slug: post.slug
      }
  }));
  console.log('getStaticPaths-->',posts,paths,paths.length)
  return {
      paths,
      fallback: false
  }
}