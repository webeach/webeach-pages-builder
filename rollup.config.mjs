import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { glob } from 'glob';
import { dts } from 'rollup-plugin-dts';
import nodeExternals from 'rollup-plugin-node-externals';

const config = [
  {
    input: ['./src/index.ts', ...glob.sync('./src/bin/run.ts')],
    output: [
      {
        dir: './lib/esm',
        format: 'es',
        preserveModules: true,
        preserveModulesRoot: 'src',
        sourcemap: true,
      },
    ],
    plugins: [resolve(), typescript(), nodeExternals()],
  },
  {
    input: './src/index.ts',
    output: [
      {
        file: './lib/types.d.ts',
        format: 'es',
      },
    ],
    plugins: [dts()],
  },
];

export default config;
