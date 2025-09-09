const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Reddit API',
      version: '1.0.0',
      description: 'API for managing Reddit entries with user authentication',
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Local' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            username: { type: 'string' }
          }
        },
        Reddit: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            title: { type: 'string' },
            url: { type: 'string' },
            description: { type: 'string' }
          }
        },
        AuthLoginResponse: {
          type: 'object',
          properties: {
            user: { $ref: '#/components/schemas/User' },
            token: { type: 'string' }
          }
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: [
    'src/routes/*.js'
  ]
};

module.exports = swaggerJSDoc(options);