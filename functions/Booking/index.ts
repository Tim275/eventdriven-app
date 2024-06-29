import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import {
  EventBridgeClient,
  PutEventsCommand,
} from "@aws-sdk/client-eventbridge";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

const eventBridgeClient = new EventBridgeClient({
  region: "eu-central-1",
});

export const createBooking = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log(event);

  const ddbClient = new DynamoDBClient({ region: "eu-central-1" });

  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "No Data Provided",
      }),
    };
  }
  try {
    const body = JSON.parse(event.body);
    const { flightId, seats, username } = body;
    if (!flightId || !seats || !Array.isArray(seats)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Invalid Data Format",
        }),
      };
    }

    const bookings = await Promise.all(
      seats.map((seatId) => getBooking(flightId, seatId, ddbClient))
    );
    if (bookings.some((booking) => booking === "True")) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "One or more Seats are Booked",
        }),
      };
    }
    await eventBridgeClient.send(
      new PutEventsCommand({
        Entries: [
          {
            Source: "bookFlight",
            DetailType: "flightBooked",
            EventBusName: "FlightBookingEventus",
            Detail: JSON.stringify({
              flightId,
              seats,
              username,
            }),
          },
        ],
      })
    ).then(data => {
      console.log('EventBridge response:', data);
    }).catch(err => {
      console.error('EventBridge error:', err);
    });
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Seats Booking Initiated" }),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
    };
  } catch (error) {
    console.log({ error });
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Internal Server Error occurred",
      }),
    };
  }
};

const getBooking = async (
  FlightID: string,
  SeatID: string,
  ddbClient: DynamoDBClient
): Promise<string> => {
  try {
    const params = {
      TableName: "SeatBooking",
      Key: {
        FlightID: { S: FlightID },
        SeatID: { S: SeatID },
      },
    };
    const response = await ddbClient.send(new GetItemCommand(params));
    return response.Item?.IsBooked?.S || "";
  } catch (error) {
    throw error;
  }
};
