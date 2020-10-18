let source = `
header
body
   p Hello #{key1}
`;
let options = { key1: 'World' };
let html = pug.renderFile(source, options);
export {};
