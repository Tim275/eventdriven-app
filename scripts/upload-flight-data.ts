import * as dotenv from "dotenv";
dotenv.config();
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

const region_name = "eu-central-1";

// Initialize DynamoDB client
const dynamodb = new DynamoDB({
  region: region_name,
});

const table_name = "Flights";

// Sample data
const data = [
  {
    FlightID: "FL123",
    Origin: "Berlin",
    Destination: "Hamburg",
    DepartureTime: "2023-07-01T08:00:00",
    ArrivalTime: "2023-07-01T11:00:00",
  },
  {
    FlightID: "FL456",
    Origin: "München",
    Destination: "Wien",
    DepartureTime: "2023-07-02T09:30:00",
    ArrivalTime: "2023-07-02T12:30:00",
  },
];

// Insert data into DynamoDB table
const putItems = async () => {
  for (const item of data) {
    const params = {
      TableName: table_name,
      Item: marshall(item),
    };

    try {
      await dynamodb.putItem(params);
      console.log(`Successfully added item: ${JSON.stringify(item)}`);
    } catch (error: any) {
      console.error(
        `Error adding item: ${JSON.stringify(item)} - ${error.message}`
      );
    }
  }
};

putItems();