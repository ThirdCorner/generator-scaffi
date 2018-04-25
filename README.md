# generator-scaffi [![NPM version][npm-image]][npm-url]
> Overall scaffold generator for Third Corner. 

> Depreciated in lu of Angular 4

## Documentation
Docs are located at [scaffi-docs](http://scaffi-docs.azurewebsites.net).

## Installation

First, install [Yeoman](http://yeoman.io) and [generator-scaffi](https://github.com/ThirdCorner/generator-scaffi) using 
[npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/) v4.4.2 and NPM).

```bash
npm install -g yo
npm install -g generator-scaffi
```

Then generate your new project:

```bash
yo scaffi
```
See [Getting Started](http://scaffi-docs.azurewebsites.net/overview/getting-started/) for a full walkthrough on project bootstrapping.
 
## Known Issues
> Example code in the Getting Started is out-of-date with the es6 syntax changes for server
> After Bootstrapping a project, you'll have to run this to get an index page made:
```bash
yo scaffi:route
Then these options:
index
ui
no
basic
no
```
> If you get an error on going to the site, you'll have to refresh once or twice because there's an outstanding warm-up error with the docs site.
> If you get a "TypeError: Cannot read property 'dependencies' of undefined", "Error: File to import not found or unreadable: ./theme/styles/theme" error, run:
```bash
yo scaffi:theme
```
and reselect the theme engine you want to you.

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
