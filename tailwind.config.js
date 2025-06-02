export default {
    darkMode: 'class',
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                poppins: ['Poppins', 'sans-serif'],
            },
            colors: {
                // Neutral colors
                neutral: {
                    background: 'var(--color-neutral-background)',
                    surface: 'var(--color-neutral-surface)',
                    border: 'var(--color-neutral-border)',
                    'text-primary': 'var(--color-neutral-text-primary)',
                    'text-secondary': 'var(--color-neutral-text-secondary)',
                },
                // Primary colors
                primary: {
                    DEFAULT: 'var(--color-primary-base)',
                    base: 'var(--color-primary-base)', // Added for compatibility
                    hover: 'var(--color-primary-hover)',
                    pressed: 'var(--color-primary-pressed)',
                    surface: 'var(--color-primary-surface-tint)',
                    on: 'var(--color-primary-text-on-primary)',
                    'text-on-primary': 'var(--color-primary-text-on-primary)', // Added for compatibility
                },
                // Secondary colors
                secondary: {
                    DEFAULT: 'var(--color-secondary-base)',
                    base: 'var(--color-secondary-base)', // Added for compatibility
                    hover: 'var(--color-secondary-hover)',
                    pressed: 'var(--color-secondary-pressed)',
                    surface: 'var(--color-secondary-surface-tint)',
                },
                // Success colors
                success: {
                    DEFAULT: 'var(--color-success-base)',
                    base: 'var(--color-success-base)', // Added for compatibility
                    hover: 'var(--color-success-hover)',
                    pressed: 'var(--color-success-pressed)',
                    surface: 'var(--color-success-surface-tint)',
                },
                // Warning colors
                warning: {
                    DEFAULT: 'var(--color-warning-base)',
                    base: 'var(--color-warning-base)', // Added for compatibility
                    hover: 'var(--color-warning-hover)',
                    pressed: 'var(--color-warning-pressed)',
                    surface: 'var(--color-warning-surface-tint)',
                },
                // Error colors
                error: {
                    DEFAULT: 'var(--color-error-base)',
                    base: 'var(--color-error-base)', // Added for compatibility
                    hover: 'var(--color-error-hover)',
                    pressed: 'var(--color-error-pressed)',
                    surface: 'var(--color-error-surface-tint)',
                },
                // Shades
                shades: {
                    light: 'var(--color-shades-light)',
                    mid: 'var(--color-shades-mid)',
                    dark: 'var(--color-shades-dark)',
                },
            },
        },
    },
    plugins: [require('@tailwindcss/typography')],
};