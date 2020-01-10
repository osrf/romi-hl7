const fs = require('fs');
const path = require('path');
const mustache = require('mustache');
const yaml = require('yaml');

const tmplDir = path.join(__dirname, '..', 'templates');
const srcDir = path.join(__dirname, '..', 'src');

const indexExports = [];

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
    const output = mustache.render(tmpl, model);
    fs.writeFileSync(
      path.join(srcDir, 'esb', 'models', model['file']),
      output,
    );
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
    const output = mustache.render(tmpl, model);
    fs.writeFileSync(
      path.join(srcDir, 'esb', 'models', model['file']),
      output,
    );
    indexExports.push(toExportName(model['file']));
  }
}

function generateModelIndex() {
  const tmpl = fs.readFileSync(
    path.join(tmplDir, 'model-index.mustache'),
    { encoding: 'utf8' },
  );
  const output = mustache.render(tmpl, indexExports);
  fs.writeFileSync(
    path.join(srcDir, 'esb', 'models', 'index.ts'),
    output,
  );
}

generateBasicModels();
generateObservationModels();
generateModelIndex();
