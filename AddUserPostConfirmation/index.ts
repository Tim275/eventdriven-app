import { PostConfirmationConfirmSignUpTriggerEvent } from "aws-lambda";

import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { ulid } from "ulid";


const client = new DynamoDBClient({
  region: "eu-central-1",
});

exports.handler = async (event: PostConfirmationConfirmSignUpTriggerEvent) => {
  
  const id = ulid();
  const date = new Date();
  const isoDate = date.toISOString();
  
  console.log("Event    ", JSON.stringify(event, null, 2));
 
  const Item = {
    UserID: id,
    createdAt: isoDate,
    email: event.request.userAttributes.email,
    name: event.request.userAttributes.name,
    username: event.userName,
  };

  const command = new PutItemCommand({
    TableName: "Users",
    Item: marshall(Item),
    ConditionExpression:
      "attribute_not_exists(UserID) AND attribute_not_exists(email)",
  });

  try {
    await client.send(command);
    return event;
  } catch (error) {
    throw error;
  }
};