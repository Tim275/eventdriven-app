import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import path = require("path");
import * as iam from "aws-cdk-lib/aws-iam";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";

interface LambdastackProps extends cdk.StackProps {
  usersTable: Table;
  seatsTable: Table;
  flightTable: Table;
}

export class Lambdastack extends cdk.Stack {
  readonly addUserToTableFunc: NodejsFunction;
  readonly bookingLambdaIntegration: LambdaIntegration;
  readonly registerBookingFunc: NodejsFunction;
  readonly sendEmailFunc: NodejsFunction;
  readonly syncFlightRuleFunc: NodejsFunction;
  readonly diceRollFunc: NodejsFunction; // Added diceRollFunc property

  constructor(scope: Construct, id: string, props: LambdastackProps) {
    super(scope, id, props);
    this.addUserToTableFunc = this.addUserToUsersTable(props);
    this.bookingLambdaIntegration = this.bookSeats(props);
    this.diceRollFunc = this.createDiceRollFunc(); // Initialize diceRollFunc
    this.registerBookingFunc = this.registerBooking(props); // Initialize registerBookingFunc
  }

  addUserToUsersTable(props: LambdastackProps) {
    const func = new NodejsFunction(this, "addUserFunc", {
      functionName: "addUserFunc",
      runtime: Runtime.NODEJS_20_X,
      handler: "handler",
      entry: path.join(__dirname, "../../AddUserPostConfirmation/index.ts"),
      timeout: cdk.Duration.seconds(30),
    });
    func.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["dynamodb:PutItem"],
        resources: [props.usersTable.tableArn as string],
      })
    );
    return func;
  }

  bookSeats(props: LambdastackProps): LambdaIntegration {
    const func = new NodejsFunction(this, "booking", {
      functionName: "Booking",
      runtime: Runtime.NODEJS_20_X,
      handler: "createBooking",
      entry: path.join(__dirname, `../../functions/Booking/index.ts`),
      timeout: cdk.Duration.seconds(30),
    });
    func.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["dynamodb:*", "events:PutEvents"],
        resources: [
          props.seatsTable.tableArn,
          "arn:aws:events:eu-central-1:506820257931:event-bus/FlightBookingEventus",
        ],
      })
    );
    return new LambdaIntegration(func);
  }

  // Adjust the method signature to accept LambdastackProps or a similar type
registerBooking(props: LambdastackProps): NodejsFunction {
  const func = new NodejsFunction(this, "registerBooking", {
    functionName: "registerBooking",
    runtime: Runtime.NODEJS_18_X,
    handler: "handler",
    entry: path.join(__dirname, `../../functions/RegisterBooking/index.ts`),
    timeout: cdk.Duration.seconds(30),
  });
  func.addToRolePolicy(
    new iam.PolicyStatement({
      actions: ["dynamodb:*"],
      resources: [props.seatsTable.tableArn], // Now accessing seatsTable from the correct type
    })
  );
  return func;
}




  createDiceRollFunc(): NodejsFunction {
    const func = new NodejsFunction(this, "DiceRollFunc", {
      functionName: "DiceRollFunc",
      runtime: Runtime.NODEJS_20_X,
      handler: "handler",
      entry: path.join(__dirname, "../../functions/DiceRoll/index.ts"),
      timeout: cdk.Duration.seconds(30),
    });
    // Example policy, adjust according to actual needs
    func.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"],
        resources: ["*"],
      })
    );
    return func;
  }
}