// hotelSchema.js
const { buildSchema } = require('graphql');

// Créer un schéma GraphQL
const hotelSchema = buildSchema(`
  type Query {
    hotel(id: Int!): Hotel
    hotels: [Hotel]
  }

  type Mutation {
    addHotel(name: String!, category: String!): Hotel
    deleteHotel(id: Int!): Int
  }

  type Hotel {
    id: Int
    name: String
    category: String
  }

  type DeleteHotelResponse {
    message: String
  }
`);

module.exports = hotelSchema;