import {
    DynamoDBClient,
    ScanCommand,
    UpdateItemCommand,
  } from "@aws-sdk/client-dynamodb";
  
  const client = new DynamoDBClient({
    region: "eu-central-1",
  });
  

  
  export const handler = async () => {
    try {
      const scanResult = await client.send(
        new ScanCommand({
          TableName: "SeatBooking",
        })
      );
  
      for (const item of scanResult.Items || []) {
        await client.send(
          new UpdateItemCommand({
            TableName: "SeatBooking",
            Key: {
              FlightID: item.FlightID,
              SeatID: item.SeatID,
            },
            UpdateExpression: "set IsBooked = :val",
            ExpressionAttributeValues: {
              ":val": { S: "false" },
            },
          })
        );
      }
      return "Updated!";
    } catch (error) {
      throw error;
    }
  };