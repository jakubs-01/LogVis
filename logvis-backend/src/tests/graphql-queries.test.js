const QUERIES = require("../graphql/queries");
const { parse } = require("graphql"); // Make sure you have the 'graphql' package installed

describe("GraphQL Query Validation", () => {
  Object.values(QUERIES).forEach((query, index) => {
    it(`validates query ${index + 1}`, () => {
      expect(() => {
        parse(query);
      }).not.toThrow();
    });
  });
});
