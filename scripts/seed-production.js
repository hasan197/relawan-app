const { execSync } = require('child_process');

console.log('🚀 Seeding Production Database...');
console.log('📋 Environment Check:');

// Check current deployment
try {
  const deploymentOutput = execSync('npx convex deployments list', { encoding: 'utf8' });
  console.log('Current deployments:');
  console.log(deploymentOutput);
} catch (e) {
  console.warn('⚠️ Could not list deployments (might need login)');
}

// Run seeding using the standard flag
console.log('\n🌱 Running seeding on production...');
try {
  // Using --prod flag is the safest way to target production
  const result = execSync('npx convex run seed:seedDatabase --prod', { 
    encoding: 'utf8',
    stdio: 'inherit' // Pipe output directly to console
  });
  console.log('✅ Seeding completed successfully!');
} catch (error) {
  console.error('❌ Seeding failed!');
  // Error is already printed due to stdio: 'inherit'
}