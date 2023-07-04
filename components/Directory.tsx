// import { GetStaticProps } from 'next';
// import { FilesPaths } from '@/server/utils';

// const Directory = ({ files }: { files: string[] }) => {
//   return (
//     <div>
//       <h1>文件目录</h1>
//       <ul>
//         {files.map((file) => (
//           <li key={file}>{file}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Directory;
// export const getStaticProps: GetStaticProps = async () => {
//   // const directoryPath = path.join(process.cwd(), '_post');
//   // const files = fs.readdirSync(directoryPath);
//   const files = FilesPaths('_post')
//   return {
//     props: {
//       files,
//     },
//   };
// };