import { APIGatewayProxyHandler } from 'aws-lambda';

export const handler: APIGatewayProxyHandler = async (event) => {
  const randomNumber = Math.floor(Math.random() * 6) + 1; // Generates a random number between 1 and 6
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Random dice roll',
      roll: randomNumber,
    }),
  };
};