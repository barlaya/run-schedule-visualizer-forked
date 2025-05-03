import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		".index.html",
		".src/pages/*.{ts,tsx}",
		".src/components/**/*.{ts,tsx}",
		".src/components/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
		"./src/App.tsx",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Custom brand colors - these match the CSS variables in index.css
				brand: {
					background: 'hsl(var(--background))',
					text: 'hsl(var(--foreground))',
					primary: '#0B367A',
					'primary-light': '#3A5A99',
					secondary: '#208A8B',
					'secondary-dark': '#186C6D',
					accent: '#E5C370',
					divider: '#CCCCCC',
				},
				// Custom colors for our app
				"priority-high": "#ea384c",
				"priority-medium": "#f97316",
				"priority-low": "#10b981",
				"topsis-high": "#10b981",
				"topsis-medium": "#f59e0b",
				"topsis-low": "#ef4444",
				"chart-purple": "#8b5cf6",
				"chart-blue": "#0ea5e9",
				"chart-pink": "#d946ef",
				"chart-orange": "#f97316",
				// New color palette
				"brand-primary": "#0B367A",
				"brand-primary-light": "#3A5A99",
				"brand-secondary": "#208A8B",
				"brand-secondary-dark": "#186C6D",
				"brand-accent": "#E5C370",
				"brand-background": "#F8F8F8",
				"brand-text": "#333333",
				"brand-divider": "#CCCCCC",
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'pulse-gentle': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.8' },
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-gentle': 'pulse-gentle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
