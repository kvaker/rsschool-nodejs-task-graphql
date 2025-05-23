export const userTypeDefs = `
  scalar UUID

  type User {
    id: UUID!
    name: String!
    balance: Float!
    followers: [User!]!
  }

  type Query {
    users: [User!]!
    user(id: UUID!): User
  }

  type Mutation {
    createUser(name: String!, balance: Float!): User!
  }
`;
