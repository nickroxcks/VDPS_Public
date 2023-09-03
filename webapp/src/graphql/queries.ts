/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getIoThing = /* GraphQL */ `
  query GetIoThing($id: ID!) {
    getIoThing(id: $id) {
      id
      name
      recordingState
      macAddress
      description
      createdAt
      updatedAt
    }
  }
`;
export const listIoThings = /* GraphQL */ `
  query ListIoThings(
    $filter: ModelIoThingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listIoThings(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        recordingState
        macAddress
        description
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
