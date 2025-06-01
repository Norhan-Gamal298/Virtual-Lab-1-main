// tailwind.config.js
export default {
    darkMode: 'class', // Enables class-based dark mode
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                poppins: ['Poppins', 'sans-serif'],
            },
        },
        colors: {
            gray: {
                900: '#111827', // Add if missing
            }
        }
    },
    plugins: [require('@tailwindcss/typography')],
};
