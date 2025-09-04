/** @type {import('tailwindcss').Config} */
module.exports = {
  // This 'content' array tells Tailwind where to scan for class names.
  // Add the paths to all of your HTML, JavaScript, and other template files.
  // The patterns below are common defaults for simple projects.
  content: [
    "./*.html", // Scans all HTML files in the root directory
    "./src/**/*.{html,js}", // Scans all HTML and JS files in the 'src' folder and its subfolders
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}