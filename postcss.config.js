import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default {
  plugins: [
    tailwindcss,
    autoprefixer({
      // Add specific browsers for better compatibility
      overrideBrowserslist: [
        '>0.2%',
        'not dead',
        'not op_mini all',
        'not IE 11'
      ]
    })
  ]
};