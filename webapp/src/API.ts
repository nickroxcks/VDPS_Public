/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateIoThingInput = {
  id?: string | null,
  name: string,
  recordingState: string,
  macAddress: string,
  description?: string | null,
};

export type ModelIoThingConditionInput = {
  name?: ModelStringInput | null,
  recordingState?: ModelStringInput | null,
  macAddress?: ModelStringInput | null,
  description?: ModelStringInput | null,
  and?: Array< ModelIoThingConditionInput | null > | null,
  or?: Array< ModelIoThingConditionInput | null > | null,
  not?: ModelIoThingConditionInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type IoThing = {
  __typename: "IoThing",
  id?: string,
  name?: string,
  recordingState?: string,
  macAddress?: string,
  description?: string | null,
  createdAt?: string,
  updatedAt?: string,
};

export type UpdateIoThingInput = {
  id: string,
  name?: string | null,
  recordingState?: string | null,
  macAddress?: string | null,
  description?: string | null,
};

export type DeleteIoThingInput = {
  id?: string | null,
};

export type ModelIoThingFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  recordingState?: ModelStringInput | null,
  macAddress?: ModelStringInput | null,
  description?: ModelStringInput | null,
  and?: Array< ModelIoThingFilterInput | null > | null,
  or?: Array< ModelIoThingFilterInput | null > | null,
  not?: ModelIoThingFilterInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type ModelIoThingConnection = {
  __typename: "ModelIoThingConnection",
  items?:  Array<IoThing | null > | null,
  nextToken?: string | null,
};

export type CreateIoThingMutationVariables = {
  input?: CreateIoThingInput,
  condition?: ModelIoThingConditionInput | null,
};

export type CreateIoThingMutation = {
  createIoThing?:  {
    __typename: "IoThing",
    id: string,
    name: string,
    recordingState: string,
    macAddress: string,
    description?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateIoThingMutationVariables = {
  input?: UpdateIoThingInput,
  condition?: ModelIoThingConditionInput | null,
};

export type UpdateIoThingMutation = {
  updateIoThing?:  {
    __typename: "IoThing",
    id: string,
    name: string,
    recordingState: string,
    macAddress: string,
    description?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteIoThingMutationVariables = {
  input?: DeleteIoThingInput,
  condition?: ModelIoThingConditionInput | null,
};

export type DeleteIoThingMutation = {
  deleteIoThing?:  {
    __typename: "IoThing",
    id: string,
    name: string,
    recordingState: string,
    macAddress: string,
    description?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type GetIoThingQueryVariables = {
  id?: string,
};

export type GetIoThingQuery = {
  getIoThing?:  {
    __typename: "IoThing",
    id: string,
    name: string,
    recordingState: string,
    macAddress: string,
    description?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListIoThingsQueryVariables = {
  filter?: ModelIoThingFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListIoThingsQuery = {
  listIoThings?:  {
    __typename: "ModelIoThingConnection",
    items?:  Array< {
      __typename: "IoThing",
      id: string,
      name: string,
      recordingState: string,
      macAddress: string,
      description?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type OnCreateIoThingSubscription = {
  onCreateIoThing?:  {
    __typename: "IoThing",
    id: string,
    name: string,
    recordingState: string,
    macAddress: string,
    description?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateIoThingSubscription = {
  onUpdateIoThing?:  {
    __typename: "IoThing",
    id: string,
    name: string,
    recordingState: string,
    macAddress: string,
    description?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteIoThingSubscription = {
  onDeleteIoThing?:  {
    __typename: "IoThing",
    id: string,
    name: string,
    recordingState: string,
    macAddress: string,
    description?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};
