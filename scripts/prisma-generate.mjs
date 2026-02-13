import { execSync } from 'child_process';

try {
  console.log('Running prisma generate...');
  const output = execSync('npx prisma generate', { 
    encoding: 'utf-8',
    cwd: process.cwd()
  });
  console.log(output);
  console.log('Prisma client generated successfully!');
} catch (error) {
  console.error('Error generating Prisma client:', error.message);
  if (error.stdout) console.log(error.stdout);
  if (error.stderr) console.error(error.stderr);
}
