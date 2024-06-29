import {
    DynamoDBClient,
    PutItemCommand,
    ConditionalCheckFailedException,
  } from "@aws-sdk/client-dynamodb";
  import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
  const ddbClient = new DynamoDBClient({
    region: "eu-central-1",
  });

  
  export const handler = async (event: {
    detail: {
      flightId: string;
      seats: string[];
      username: string;
    };
  }): Promise<APIGatewayProxyResult> => {
    if (!event.detail) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "No data provided" }),
      };
    }
  
    try {
      const { flightId, seats } = event.detail;
      console.log("FLIGHT ID IS", flightId);
      console.log("SEATS ARE", seats);
      if (!flightId || !seats || !Array.isArray(seats)) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: "Invalid data format" }),
        };
      }
  
      for (const seatId of seats) {
        const params = {
          TableName: "SeatBooking",
          Item: {
            SeatID: { S: seatId },
            IsBooked: { S: "True" },
            FlightID: { S: flightId },
          },
        };
  
        try {
          await ddbClient.send(new PutItemCommand(params));
        } catch (error) {
          if (error instanceof ConditionalCheckFailedException) {
            console.error(
              `Seat ${seatId} is already booked for flight ${flightId}`
            );
            return {
              statusCode: 500,
              body: JSON.stringify({
                message: `Seat ${seatId} is already booked for flight ${flightId}`,
              }),
            };
          }
          throw error;
        }
      }
  
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Seats booking Initiated" }),
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
        },
      };
    } catch (error) {
      console.error("Error booking seats:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Internal server error" }),
      };
    }
  };