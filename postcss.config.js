export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {
      // Add specific browsers for better compatibility
      overrideBrowserslist: [
        '> 1%',
        'last 2 versions',
        'Firefox ESR',
        'not dead'
      ]
    },
  },
}