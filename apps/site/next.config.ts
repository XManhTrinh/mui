import createMDX from '@next/mdx';
import type { NextConfig } from 'next';
import rehypeCodeBlock from './lib/rehype-code-block';

const nextConfig: NextConfig = {
  output: 'export',
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  // No next/image is used in this phase; a later phase that adds one must set
  // images.unoptimized = true, which output: 'export' requires.
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [rehypeCodeBlock],
  },
});

export default withMDX(nextConfig);
