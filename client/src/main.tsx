import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ColorConstants } from './constants/color.constants.ts';


async function LoadCustomCss() {
    const tailwindConfig = await fetch("../tailwind.config.ts");
    const textConfig = await tailwindConfig.text();
    const match = textConfig.match(/theme\s*: \s*({[\s\S]*?})(?=,\s*plugins)/);

    if (match) {
        const themeObjectString = match[1];
        const formattedRaw = themeObjectString
            .replace(/\/\/[^\n]*/g, '')
            .replace(/\/\*[\s\S]*?\*\//g, '')
            .replace(/(\w+):/g, '"$1":')
            .replace(/'([^']+)'/g, '"$1"')
            .replace(/"([^"]+)"/g, '"$1"');

        const theme = JSON.parse(formattedRaw);

        const dynamicColors = Object.getOwnPropertyNames(ColorConstants)
            .filter((key) =>
                key !== 'length' && key !== 'name' && key !== 'prototype' && typeof ColorConstants[key] !== 'function').
            map((key) => ColorConstants[key]);

        return generateTailwindCss(dynamicColors, theme)
    } else {
        console.log("Theme block not found");
    }
}

function generateTailwindCss(classes: string[], tailwindConfig: object) {
    let generatedCss = '';

    classes.forEach((className: string) => {
        let cssType = '';
        let cssContent = '';

        if (className.startsWith('bg-')) {
            cssType = 'background-color';
            cssContent = className.substring('bg-'.length, className.length);
        } else if (className.startsWith('text-')) {
            cssType = 'color';
            cssContent = className.substring('text-'.length, className.length);
        } else if (className.startsWith('border-')) {
            cssType = 'border-color';
            cssContent = className.substring('border-'.length, className.length);
        }

        const [colorName, opacity] = cssContent.split('/');
        let color = extractColor(colorName, tailwindConfig['extend']['colors']);

        if (color !== undefined) {
            generatedCss += `.${className.replace('/', '\\/')} { ${cssType}: ${color}${opacity ? `${parseInt(opacity, 10)}` : ''}; }\n`;
        }
    });

    return generatedCss;
}

function extractColor(fullName: string, tailwind: object): string | undefined {
    let name = fullName;
    let color = tailwind[name];

    if (color === undefined) {
        const index = name.indexOf("-");

        const firstPart = name.slice(0, index);
        const secondPart = name.slice(index + 1);

        if (tailwind[firstPart] !== undefined) {
            return extractColor(secondPart, tailwind[firstPart]);
        }

        return undefined;
    } else if (typeof color === 'object') {
        if (color['DEFAULT'] !== undefined) {
            return color['DEFAULT'];
        }

        return undefined;
    }

    else if (typeof color === 'string') {
        return color;
    }

    return undefined;
}

LoadCustomCss().then((css) => {
    const styleTag = document.createElement('style');
    styleTag.textContent = css;
    document.head.appendChild(styleTag);

    createRoot(document.getElementById("root")!).render(<App />);
});
