import next from 'eslint-config-next';

const config = [{ ignores: ['.next/**', 'next-env.d.ts', 'test-results/**'] }, ...next];

export default config;
