'use strict';

const Hapi = require('hapi');
const Yar = require('../');

const server = new Hapi.Server();
server.connection({ port: process.env.PORT || 8080 });

const options = {
    cookieOptions: {
        password: 'passwordmustbesomewhatlongerthanitis',   // Required
        isSecure: false // Required if using http
    }
};

server.register({
    register: Yar,
    options
}, (err) => {

    if (err) {
        console.log(err);
        throw err;
    }
});

server.route({
    method: 'GET',
    path: '/',
    config: {
        handler: (request, reply) => reply(request.yar._store)
    }
});

server.route({
    method: 'GET',
    path: '/set',
    config: {
        handler: (request, reply) => {

            request.yar.set('test', 1);
            return reply.redirect('/');
        }
    }
});

server.route({
    method: 'GET',
    path: '/set/{key}/{value}',
    config: {
        handler: (request, reply) => {

            request.yar.set(request.params.key, request.params.value);
            return reply.redirect('/');
        }
    }
});

server.route({
    method: 'GET',
    path: '/clear',
    config: {
        handler: (request, reply) => {

            request.yar.reset();
            return reply.redirect('/');
        }
    }
});

server.route({
    method: 'GET',
    path: '/control',
    config: {
        handler: (request, reply) => reply('ohai')
    }
});

server.start(() => console.log('server started on port: ', server.info.port));
