/** @type {import('tailwindcss').Config} */
module.exports = {
    //...
    content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    plugins: [require("daisyui")],
    daisyui: {
      themes: [
        "synthwave",
        {'synthtrans': {
          "primary": "#e779c1",
          "secondary": "#58c7f3",
          "accent": "#f3cc30",
          "neutral": "#20134e",
          "info": "#53c0f3",
          "success": "#71ead2",
          "warning": "#f3cc30",
          "error": "#e24056"
        }}
      ]
    }
  }