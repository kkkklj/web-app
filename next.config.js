/** @type {import('next').NextConfig} */
const nextConfig = {
}
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})
// module.exports = nextConfig
module.exports = withMDX({
  ...nextConfig,
  pageExtensions: ['js', 'jsx','tsx', 'md', 'mdx'],
})
