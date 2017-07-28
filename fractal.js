// this is in the pattern library that gets imported as a node package

'use strict';

/* Require the Fractal module */
const fractal = module.exports = require('@frctl/fractal').create();

/* Require Nunjucks helpers */
// const helpers = require('@frctl/nunjucks-helpers');

/* Initialise the helpers with the fractal instance */
// helpers.use(fractal); 


/* Project info */
fractal.set('project.title', 'Fannie Mae Fractal Component Demo');
fractal.set('project.version', 'v1.0');
fractal.set('project.author', 'CDX');


// -----------------------------------------------------------------------------
// CONFIGURE COMPONENTS
// -----------------------------------------------------------------------------

/* Tell Fractal where to look for components. */
fractal.components.set('path',  __dirname + '/components');

fractal.components.set('default.preview', '@preview');

/* use Nunjucks for components; register the Nunjucks adapter for your components */
// fractal.components.engine('@frctl/nunjucks'); 

// look for files with a .nunj file extension
// fractal.components.set('ext', '.nunj'); 
 

// -----------------------------------------------------------------------------
// CONFIGURE DOCS
// -----------------------------------------------------------------------------

/* Tell Fractal where to look for documentation pages. */
fractal.docs.set('path', __dirname + '/docs');

// fractal.docs.set('ext', '.html');

// -----------------------------------------------------------------------------
// CONFIGURE WEB
// -----------------------------------------------------------------------------

/* Tell the Fractal web preview plugin where to look for static assets. */
fractal.web.set('static.path',  __dirname + '/public');

/* Set the static HTML build destination */
fractal.web.set('builder.dest', __dirname + '/build');

/* Use the integrated BrowserSync option by default by seting sync option to true. 
NOTE: Only core web configuration options can be set using the fractal.web.set() method. Theme-specific configuration options must be set on the theme instance itself.*/
fractal.web.set('server.sync', true);

/* Autoload all helpers into the template engine instance via this adapter */
// fractal.engine('nunjucks', '@frctl/nunjucks-adapter', {
//     loadHelpers: true
// });

