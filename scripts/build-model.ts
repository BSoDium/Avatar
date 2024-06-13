import * as fs from 'fs';
import * as path from 'path';
import colors from '../src/assets/colors.json';

const directory = './src/assets';
const svg = path.join(directory, 'model.svg');
const template = path.join(directory, 'Model.template.tsx');
const output = path.join(directory, 'Model.tsx');

function sanitize(content: string) {
  return content.replace(/stroke-width/g, 'strokeWidth').replace(/stroke-linecap/g, 'strokeLinecap').replace(/clip-path/g, 'clipPath');
}

function insertProps(content: string) {
  // Replace color strings with props
  Object.entries(colors).forEach(([key, value]) => {
    content = content.replace(new RegExp(`"${value}"`, 'g'), `{props.${key}}`);
  });
  
  // Add spread operator to props
  content = content.replace('<svg', '<svg {...props}');
  
  return content;
}

function buildModel() {
  const svgContent = fs.readFileSync(svg, 'utf-8');
  const templateContent = fs.readFileSync(template, 'utf-8');
  const modelContent = sanitize(insertProps(templateContent.replace('<slot />', `(${svgContent})`)));

  fs.writeFileSync(output, modelContent);
}

buildModel();