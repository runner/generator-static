Tasks generator for static server
=================================

[![build status](https://img.shields.io/travis/runner/generator-static.svg?style=flat-square)](https://travis-ci.org/runner/generator-static)
[![npm version](https://img.shields.io/npm/v/@runner/generator-static.svg?style=flat-square)](https://www.npmjs.com/package/@runner/generator-static)
[![dependencies status](https://img.shields.io/david/runner/generator-static.svg?style=flat-square)](https://david-dm.org/runner/generator-static)
[![devDependencies status](https://img.shields.io/david/dev/runner/generator-static.svg?style=flat-square)](https://david-dm.org/runner/generator-static?type=dev)
[![Gitter](https://img.shields.io/badge/gitter-join%20chat-blue.svg?style=flat-square)](https://gitter.im/DarkPark/runner)
[![RunKit](https://img.shields.io/badge/RunKit-try-yellow.svg?style=flat-square)](https://npm.runkit.com/@runner/generator-static)


## Installation ##

```bash
npm install @runner/generator-static
```


## Usage ##

Add to the scope:

```js
var generator = require('@runner/generator-static');
```

Generate tasks according to the given config:

```js
var tasks = generator({
    open: 'build/develop/index.html'
});
```

Add generated tasks to the `runner` instance:

```js
var runner = require('@runner/core');

Object.assign(runner.tasks, tasks);
```

The following tasks will become available:

 Task name       | Description
-----------------|-------------
 `static:config` | prints the current configuration used for generated tasks
 `static:start`  | starts static server
 `static:stop`   | stops static server
 `static:open`   | open entry page in the default browser

Generator accepts two arguments: base configuration and additional options.


### Base configuration ###

It's an object with the following properties:

 Name          | Description
---------------|-------------
 path          | root directory to serve (default: `.`)
 open          | entry page to open in the default browser
 port          | HTTP server listening port (default: `8080`)
 staticOptions | static server [options](https://github.com/cloudhead/node-static#options-when-creating-an-instance-of-server) 


### Additional options ###

It's an object with the following properties:

 Name   | Description
--------|-------------
 prefix | an affix placed before a task name (default is `static:`)  
 suffix | a string added at the end of a task name (empty by default)
 
So it's possible to change generated tasks names: 

```js
Object.assign(runner.tasks,
    generator(config, {
        prefix: 'http:',
        suffix: ':develop'
    })
);
```

It will add the following tasks:

* `http:config:develop` 
* `http:start:develop`  
* `http:stop:develop`  
* `http:open:develop`  
 

## Contribution ##

If you have any problems or suggestions please open an [issue](https://github.com/runner/generator-static/issues)
according to the contribution [rules](.github/contributing.md).


## License ##

`@runner/generator-static` is released under the [GPL-3.0 License](http://opensource.org/licenses/GPL-3.0).
