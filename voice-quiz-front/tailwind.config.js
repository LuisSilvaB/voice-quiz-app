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
      }
    },
  },
  plugins: [],
})

