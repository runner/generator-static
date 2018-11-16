/**
 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var name = 'static',
    log  = require('runner-logger').wrap(name);


function start ( config, done ) {
    var files = new (require('node-static').Server)(config.path, config.staticOptions),
        server;

    server = require('http').createServer(function ( request, response ) {
        request.addListener('end', function () {
            // static files
            files.serve(request, response, function ( error ) {
                var address = request.connection.remoteAddress || log.colors.red('[0.0.0.0]'),
                    status  = response.statusCode === 200 ? log.colors.green(response.statusCode) : log.colors.yellow(response.statusCode);

                if ( error ) {
                    response.end();
                }

                log[error ? 'fail' : 'info'](
                    '%s\t%s\t%s\t%s',
                    address.replace('::ffff:', ''),
                    request.method,
                    error ? log.colors.red(error.status) : status,
                    request.url.replace(/\//g, log.colors.grey('/'))
                );
            });
        }).resume();
    });

    server.on('listening', function () {
        // port can be 0 from the start
        config.port = server.address().port;

        config.uri = 'http://' + require('ip').address() + ':' + config.port + '/' + config.open;

        log.info('serving directory: ' + log.colors.bold(config.path));
        log.info('web address: ' + log.colors.green.bold(config.uri));

        if ( typeof config.onReady === 'function' ) {
            config.onReady(config);
        }
    });

    server.on('close', done);

    server.on('error', function ( error ) {
        log.fail(error.toString());

        done();
    });

    server.listen(config.port);

    return server;
}


function stop ( server ) {
    if ( server ) {
        server.close();
    }
}


function generator ( config, options ) {
    var tasks = {},
        path  = require('path'),
        open  = require('opn'),
        server;

    // sanitize and extend defaults
    config = config || {};
    config = Object.assign({
        path: path.resolve(config.path || '.'),
        open: '',
        port: 8080,
        onReady: null,
        staticOptions: {
            cache: false
        }
    }, config || {});
    options = Object.assign(generator.options, options || {});

    tasks[options.prefix + 'config' + options.suffix] = function () {
        log.inspect(config, log);
    };

    tasks[options.prefix + 'start' + options.suffix] = function ( done ) {
        server = start(config, done);
    };

    tasks[options.prefix + 'open' + options.suffix] = function () {
        open(config.uri);
    };

    tasks[options.prefix + 'stop' + options.suffix] = function () {
        stop(server);
        server = null;
    };

    return tasks;
}


// defaults
generator.options = {
    prefix: name + ':',
    suffix: ''
};


// export main actions
generator.methods = {
    start: start,
    stop: stop
};


// public
module.exports = generator;
