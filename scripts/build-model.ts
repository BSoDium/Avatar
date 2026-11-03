import * as fs from 'fs';
import * as path from 'path';
import colors from '../src/assets/colors.json';

const directory = './src/assets';
const svg = path.join(directory, 'model.svg');
const template = path.join(directory, 'Model.template.tsx');
const output = path.join(directory, 'Model.tsx');

type Color = keyof typeof colors;

/**
 * Which attribute of which element (by id) each editable color drives.
 * The current value in model.svg must be the default in colors.json.
 */
const bindings: Record<Color, [id: string, attribute: 'fill' | 'stroke'][]> = {
  primary: [['exposed-shirt', 'fill']],
  secondary: [['jacket', 'fill']],
  tonal: [['exposed-skin', 'fill']],
  background: [['background', 'fill']],
  hair: [['hair', 'fill']],
};

/**
 * Elements shown only when the condition (over the `glasses` prop) holds.
 */
const visibility: Record<string, string> = {
  glasses: 'glasses',
};

function openingTag(content: string, id: string) {
  const match = new RegExp(`<[a-z]+\\s[^>]*\\bid="${id}"[^>]*>`).exec(content);
  if (!match) throw new Error(`No element with id "${id}" in model.svg`);
  return match[0];
}

function insertProps(content: string) {
  Object.entries(bindings).forEach(([key, targets]) => {
    targets.forEach(([id, attribute]) => {
      const tag = openingTag(content, id);
      const expected = `${attribute}="${colors[key as Color]}"`;
      if (!tag.includes(expected)) {
        throw new Error(`#${id} should have ${expected} (default of "${key}" in colors.json)`);
      }
      content = content.replace(tag, tag.replace(expected, `${attribute}={${key}}`));
    });
  });

  Object.entries(visibility).forEach(([id, condition]) => {
    const tag = openingTag(content, id);
    content = content.replace(tag, tag.replace(`id="${id}"`, `id="${id}" display={${condition} ? undefined : "none"}`));
  });

  // Forward the remaining props to the root element
  return content.replace('<svg', '<svg {...svgProps}');
}

/**
 * Convert hyphenated SVG attributes to their JSX names (stroke-width -> strokeWidth)
 */
function sanitize(content: string) {
  return content.replace(/(\s)([a-z]+(?:-[a-z]+)+)=/g, (_, space: string, name: string) =>
    space + name.replace(/-([a-z])/g, (_m, letter: string) => letter.toUpperCase()) + '=');
}

function buildModel() {
  const svgContent = fs.readFileSync(svg, 'utf-8').trim();
  const templateContent = fs.readFileSync(template, 'utf-8');
  const modelContent = templateContent
    .replace('const { ...svgProps }', `const { ${Object.keys(colors).join(', ')}, ...svgProps }`)
    .replace('<slot />', `(${sanitize(insertProps(svgContent))})`);

  fs.writeFileSync(output, modelContent);
}

buildModel();
