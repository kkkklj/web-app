/** @type {import('next').NextConfig} */
const webpack = require('webpack');
const nextConfig = {
  webpack: (config) => {
    // console.log(config.target);
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /.awebp$/,
      })
    );
    return config;
  },
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
