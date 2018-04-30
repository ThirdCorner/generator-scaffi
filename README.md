# generator-scaffi [![NPM version][npm-image]][npm-url]
> Full stack javascript scaffold generator for Third Corner. Main features are:
- Same codebase builds a web and ios/android version for you so you don't have duplicated codebases.
- Provides a Nodejs server that hooks up to the Angular servers so that there's very little manual REST hookups between server and app, as long as you 
use the Epilogue option in yo scaffi:route generators. Makes for bootstrapping basic REST apis really easy.
- Provides a prototype mode setup so that you can code without needing to worry about the server. Angular Service hooks are setup in such a way
that will serve up fixtures as if you're hitting basic REST apis. Getting started walkthrough goes into more detail on this.

# Depreciated in lu of Angular 4
> After having not touched this for a year because of being on another project, the version gremlins got to this. 
Be aware that getting started docs are out-of-date in various places. To bootstrap a new project, see below on installation. 

## Installation

First, install [Yeoman](http://yeoman.io) and [generator-scaffi](https://github.com/ThirdCorner/generator-scaffi) using 
[npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/) v4.4.2 and NPM).

```bash
npm install -g yo@1.8.4
npm install -g generator-scaffi
```

Then generate your new project:

```bash
yo scaffi
```

After the command installs all the npm packages, you'll need to run the following commands before starting the app: 
```bash
cd ${productName}
yo scaffi:route
Then these options:
index
ui
no
basic
no
```

```bash
yo scaffi:theme
```

After that, you should be able to follow the walkthrough starting with this line:
> "After all that installation and setup, you should be back at the CMD prompt. Type the following:"

See [Getting Started](http://scaffi-docs.azurewebsites.net/overview/getting-started/project-setup) for a full walkthrough on project bootstrapping.

## Documentation
Docs are located at [scaffi-docs](http://scaffi-docs.azurewebsites.net).
 
## Known Issues
> Running yo scaffi:theme throws errors about a bunch of extraneous packages. This is npm-shrinkwrap erroring so you can ignore. 

> Examples in the Getting Started are out-of-date when talking about server examples because server got switched to es6

## Developing and Testing
If you make changes to this generator and need to test, run the following while in generator-scaffi:
```bash
npm link
```
This will make it so you can run yo scaffi:* without having to push changes to test


## Getting To Know Yeoman

Yeoman has a heart of gold. He&#39;s a person with feelings and opinions, but he&#39;s very easy to work with. If you think he&#39;s too opinionated, he can be easily convinced. Feel free to [learn more about him](http://yeoman.io/).

## License

 © [MIT]()


[npm-image]: https://badge.fury.io/js/generator-scaffi.svg
[npm-url]: https://npmjs.org/package/generator-scaffi
