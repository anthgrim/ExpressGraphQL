const { graphqlHTTP } = require("express-graphql");
const { buildSchema, assertInputType } = require("graphql");
const express = require("express");

// Construct a schema, using GraphQL schema language
let restaurants = [
  {
    id: 1,
    name: "WoodsHill ",
    description:
      "American cuisine, farm to table, with fresh produce every day",
    dishes: [
      {
        name: "Swordfish grill",
        price: 27,
      },
      {
        name: "Roasted Broccily ",
        price: 11,
      },
    ],
  },
  {
    id: 2,
    name: "Fiorellas",
    description:
      "Italian-American home cooked food with fresh pasta and sauces",
    dishes: [
      {
        name: "Flatbread",
        price: 14,
      },
      {
        name: "Carbonara",
        price: 18,
      },
      {
        name: "Spaghetti",
        price: 19,
      },
    ],
  },
  {
    id: 3,
    name: "Karma",
    description:
      "Malaysian-Chinese-Japanese fusion, with great bar and bartenders",
    dishes: [
      {
        name: "Dragon Roll",
        price: 12,
      },
      {
        name: "Pancake roll ",
        price: 11,
      },
      {
        name: "Cod cakes",
        price: 13,
      },
    ],
  },
];
const schema = buildSchema(`
type Query{
  restaurant(id: Int!): restaurant
  restaurants: [restaurant]
},
type restaurant {
  id: Int
  name: String
  description: String
  dishes:[Dish]
}
type Dish{
  name: String
  price: Int
}
input restaurantInput{
  name: String
  description: String
}
type DeleteResponse{
  ok: Boolean!
}
type Mutation{
  setrestaurant(input: restaurantInput): restaurant
  deleterestaurant(id: Int!): DeleteResponse
  editrestaurant(id: Int!, name: String!): restaurant
}
`);
// The root provides a resolver function for each API endpoint

const root = {
  restaurant: ({ id }) => {
    // Your code goes here
    const target = restaurants.find((res) => res.id === id);
    return target;
  },
  restaurants: () => restaurants,
  setrestaurant: ({ input }) => {
    // Your code goes here
    const { name, description } = input;
    const newRestaurant = { id: restaurants.length + 1, name, description };
    restaurants.push(newRestaurant);
    return newRestaurant;
  },
  deleterestaurant: ({ id }) => {
    // Your code goes here
    const ok = Boolean(restaurants[id - 1]);
    restaurants = restaurants.filter((res) => res.id !== id);
    return { ok };
  },
  editrestaurant: ({ id, name }) => {
    // Your code goes here
    let target;
    restaurants = restaurants.map((res) => {
      if (res.id === id) {
        res.name = name;
        target = res;
      }
      return res;
    });
    return target;
  },
};
const app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);
const port = 5500;
app.listen(5500, () => console.log("Running Graphql on Port:" + port));
