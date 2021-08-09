const path = require('path');
const fs = require('fs');

module.exports = class WriteConfigToFilePlugin {
    constructor(opts) {
        this.filename = opts.filename || 'env-vars-dump.js';
        this.config = opts.config || '';
    }

    apply(compiler) {
        // store as JSON, if passed config is object
        const fileContent = `const Config = '${JSON.stringify(this.config)}'`;
        const outputDir = compiler.options.output.path;
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }
        const fullOutputPath = path.join(outputDir, this.filename);
        console.debug(
            `[WriteConfigToFilePlugin] dumping firebase config to file=${fullOutputPath}`,
        );
        fs.writeFileSync(fullOutputPath, fileContent);
    }
};
