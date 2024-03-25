import withMT from "@material-tailwind/react/utils/withMT";
/** @type {import('tailwindcss').Config} */
export default withMT({
  content: ["./src/**/*.{html,js,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily:{
        montserrat: ['Montserrat'], 
        lobster: ['Lobster'], 
        concert: ['Concert One'],  
        inter:["Inter"]
      },
      colors: {
        tangaroa: {
          '50': '#eef6ff',
          '100': '#d9eaff',
          '200': '#bcdbff',
          '300': '#8dc6ff',
          '400': '#58a5ff',
          '500': '#3181ff',
          '600': '#1b60f5',
          '700': '#134ae2',
          '800': '#163db7',
          '900': '#183890',
          '950': '#0f1b42',
        },
      },
    },
  },
  plugins: [],
})

