import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Path to GitHub workflows directory
const workflowsDir = path.join(projectRoot, '.github', 'workflows');

console.log('⚙️ Pre-build cleanup script running...');

// Check if the GitHub workflows directory exists
if (fs.existsSync(workflowsDir)) {
  console.log('🗑️ Removing GitHub Actions workflows directory...');
  
  try {
    // Get all files in the workflows directory
    const files = fs.readdirSync(workflowsDir);
    
    // Delete each file
    files.forEach(file => {
      const filePath = path.join(workflowsDir, file);
      fs.unlinkSync(filePath);
      console.log(`✅ Deleted: ${filePath}`);
    });
    
    // Remove the workflows directory
    fs.rmdirSync(workflowsDir);
    console.log('✅ Deleted workflows directory');
    
    // Remove the .github directory if it's empty
    const githubDir = path.join(projectRoot, '.github');
    if (fs.existsSync(githubDir)) {
      const remainingFiles = fs.readdirSync(githubDir);
      if (remainingFiles.length === 0) {
        fs.rmdirSync(githubDir);
        console.log('✅ Deleted empty .github directory');
      }
    }
    
  } catch (err) {
    console.error('❌ Error during cleanup:', err);
    // Don't fail the build
  }
} else {
  console.log('ℹ️ No GitHub workflows directory found. Skipping cleanup.');
}

console.log('✅ Cleanup completed successfully!');