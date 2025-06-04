export default {
    darkMode: 'class',
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                // Brand Colors
                brand: {
                    primary: 'var(--color-brand-primary)',
                    secondary: 'var(--color-brand-secondary)',
                    tertiary: 'var(--color-brand-tertiary)',
                    error: 'var(--color-brand-error)',
                    warning: 'var(--color-brand-warning)',
                    info: 'var(--color-brand-info)',
                    background: 'var(--color-brand-background)',
                    surface: 'var(--color-brand-surface)',
                },

                // Text Colors
                text: {
                    primary: 'var(--color-text-primary)',
                    secondary: 'var(--color-text-secondary)',
                    tertiary: 'var(--color-text-tertiary)',
                    disabled: 'var(--color-text-disabled)',
                    inverse: 'var(--color-text-inverse)',
                    error: 'var(--color-text-error)',
                    success: 'var(--color-text-success)',
                    warning: 'var(--color-text-warning)',
                    info: 'var(--color-text-info)',
                },

                // Border Colors
                border: {
                    default: 'var(--color-border-default)',
                    strong: 'var(--color-border-strong)',
                    focus: 'var(--color-border-focus)',
                    error: 'var(--color-border-error)',
                    success: 'var(--color-border-success)',
                },

                // Background Colors
                bg: {
                    default: 'var(--color-bg-default)',
                    subtle: 'var(--color-bg-subtle)',
                    muted: 'var(--color-bg-muted)',
                    emphasized: 'var(--color-bg-emphasized)',
                    disabled: 'var(--color-bg-disabled)',
                    inverse: 'var(--color-bg-inverse)',
                },

                // State Colors
                state: {
                    hover: 'var(--color-state-hover)',
                    pressed: 'var(--color-state-pressed)',
                    selected: 'var(--color-state-selected)',
                    focus: 'var(--color-state-focus)',
                },

                // Gray Scale
                gray: {
                    50: 'var(--color-gray-50)',
                    100: 'var(--color-gray-100)',
                    200: 'var(--color-gray-200)',
                    300: 'var(--color-gray-300)',
                    400: 'var(--color-gray-400)',
                    500: 'var(--color-gray-500)',
                    600: 'var(--color-gray-600)',
                    700: 'var(--color-gray-700)',
                    800: 'var(--color-gray-800)',
                    850: 'var(--color-gray-850)',
                    900: 'var(--color-gray-900)',
                    950: 'var(--color-gray-950)',
                },

                // Blue Scale
                blue: {
                    50: 'var(--color-blue-50)',
                    100: 'var(--color-blue-100)',
                    200: 'var(--color-blue-200)',
                    300: 'var(--color-blue-300)',
                    400: 'var(--color-blue-400)',
                    500: 'var(--color-blue-500)',
                    600: 'var(--color-blue-600)',
                    700: 'var(--color-blue-700)',
                    800: 'var(--color-blue-800)',
                    900: 'var(--color-blue-900)',
                    950: 'var(--color-blue-950)',
                },

                // Purple Scale
                purple: {
                    50: 'var(--color-purple-50)',
                    100: 'var(--color-purple-100)',
                    200: 'var(--color-purple-200)',
                    300: 'var(--color-purple-300)',
                    400: 'var(--color-purple-400)',
                    500: 'var(--color-purple-500)',
                    600: 'var(--color-purple-600)',
                    700: 'var(--color-purple-700)',
                    800: 'var(--color-purple-800)',
                    900: 'var(--color-purple-900)',
                    950: 'var(--color-purple-950)',
                },
            },
        },
    },
    plugins: [require('@tailwindcss/typography')],
};