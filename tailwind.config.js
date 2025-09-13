/** @type {import('tailwindcss').Config} */
module.exports = {
  // This 'content' array tells Tailwind where to scan for class names.
  // Add the paths to all of your HTML, JavaScript, and other template files.
  // The patterns below are common defaults for simple projects.
  content: [
    "./*.html", // Scans all HTML files in the root directory
    "./js/**/*.js", // Scans JS files in the 'js' folder and its subfolders
  ],
  theme: {
    // This is where you add your custom colors from style.css.
    extend: {
      colors: {
        'brand-gold': 'var(--color-brand-gold)',
        'brand-gold-hover': 'var(--color-brand-gold-hover)',
        'background': 'var(--color-background)',
        'surface': 'var(--color-surface)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'border': 'var(--color-border)',
      }
    },
  },
  plugins: [],
}