const fs = require('fs');
const path = require('path');
const mustache = require('mustache');
const yaml = require('yaml');

const tmplDir = path.join(__dirname, '..', 'templates');
const srcDir = path.join(__dirname, '..', 'src');

const indexExports = [];

const modelsDir = path.join(srcDir, 'esb', 'models');
if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir);
}

function toExportName(file) {
  const name = path.basename(file);
  return './' + name.slice(0, name.lastIndexOf('.'));
}

function generateBasicModels() {
  const tmpl = fs.readFileSync(
    path.join(tmplDir, 'basic-model.mustache'),
    { encoding: 'utf8' },
  );
  const modelsFile = fs.readFileSync(
    path.join(tmplDir, 'basic-models.yaml'),
    { encoding: 'utf8' },
  );
  const models = yaml.parse(modelsFile);

  for (const model of models) {
    const file = path.join(modelsDir, model['file']);
    console.log(`generating ${file}`);

    const values = {};
    let highestField = 0;
    for (const prop of model.properties) {
      if (prop.field > highestField) {
        highestField = prop.field;
      }
      values[prop.field] = `this.${prop.name}`;
    }
    model.fields = [];
    for (let i = 1; i <= highestField; i++) {
      const v = values[i];
      if (v) {
        model.fields.push(v);
      } else {
        model.fields.push("''");
      }
    }

    const output = mustache.render(tmpl, model);
    fs.writeFileSync(file, output);
    indexExports.push(toExportName(model['file']));
  }
}

function generateObservationModels() {
  const tmpl = fs.readFileSync(
    path.join(tmplDir, 'observation-model.mustache'),
    { encoding: 'utf8' },
  );
  const modelsFile = fs.readFileSync(
    path.join(tmplDir, 'observation-models.yaml'),
    { encoding: 'utf8' },
  );
  const models = yaml.parse(modelsFile);

  for (const model of models) {
    const file = path.join(modelsDir, model['file']);
    console.log(`generating ${file}`);

    let curSetID = 2;
    for (const prop of model.properties) {
      prop.setId = curSetID.toString();
      curSetID++;
    }

    const output = mustache.render(tmpl, model);
    fs.writeFileSync(file, output);
    indexExports.push(toExportName(model['file']));
  }
}

function generateModelIndex() {
  const file = path.join(modelsDir, 'index.ts');
  console.log(`generating ${file}`);

  const tmpl = fs.readFileSync(
    path.join(tmplDir, 'model-index.mustache'),
    { encoding: 'utf8' },
  );
  const output = mustache.render(tmpl, indexExports);
  fs.writeFileSync(file, output);
}

generateBasicModels();
generateObservationModels();
generateModelIndex();
console.log('successfully generated esb models');
