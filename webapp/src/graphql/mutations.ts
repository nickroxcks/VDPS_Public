/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createIoThing = /* GraphQL */ `
  mutation CreateIoThing(
    $input: CreateIoThingInput!
    $condition: ModelIoThingConditionInput
  ) {
    createIoThing(input: $input, condition: $condition) {
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
export const updateIoThing = /* GraphQL */ `
  mutation UpdateIoThing(
    $input: UpdateIoThingInput!
    $condition: ModelIoThingConditionInput
  ) {
    updateIoThing(input: $input, condition: $condition) {
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
export const deleteIoThing = /* GraphQL */ `
  mutation DeleteIoThing(
    $input: DeleteIoThingInput!
    $condition: ModelIoThingConditionInput
  ) {
    deleteIoThing(input: $input, condition: $condition) {
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
