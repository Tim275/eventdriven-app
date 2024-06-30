// Import necessary classes and interfaces from AWS CDK libraries
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import { EventBus, Rule, Schedule } from "aws-cdk-lib/aws-events";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";

// Define an interface extending the base StackProps with specific properties for Lambda functions
interface EventBridgeStackProps extends cdk.StackProps {
  registerBooking: NodejsFunction; // Lambda function for registering a booking
  emailReceipt: NodejsFunction;    // Lambda function for sending an email receipt
  syncFlights: NodejsFunction;     // Lambda function for synchronizing flights
}

// Define a new class for the EventBridge stack, extending the base CDK Stack class
export class EventBridgeStack extends cdk.Stack {
  public readonly eventBus: EventBus; // Declare a public property for the EventBus

  // Constructor for the stack
  constructor(scope: Construct, id: string, props: EventBridgeStackProps) {
    super(scope, id, props); // Call the base class constructor

    // Create a new EventBus
    this.eventBus = new EventBus(this, "EventBus", {
      eventBusName: "FlightBookingEventus", // Name of the EventBus
    });

    // Rule for booking flights
    const bookFlightRule = new Rule(this, "BookFlightRule", {
      eventBus: this.eventBus, // Associate the rule with the previously created EventBus
      eventPattern: { // Define the pattern to match for triggering this rule
        source: ["bookFlight"], // Source of the event
        detailType: ["flightBooked"], // Type of the event
      },
    });

 // Rule for synchronizing flights
 const syncFlightRule = new Rule(this, "SyncFlightRule", {
  schedule: Schedule.rate(cdk.Duration.hours(24)), // Trigger the rule once every hour
});



    // Add targets (Lambda functions) to the booking rule
    bookFlightRule.addTarget(new LambdaFunction(props.registerBooking)); // Register booking function
    bookFlightRule.addTarget(new LambdaFunction(props.emailReceipt)); // Email receipt function
    syncFlightRule.addTarget(new LambdaFunction(props.syncFlights)); // Add the sync flights function as a target
  }
}

// lambda trigger einstellen z.b jede 1.h lambda ausführen oder datenbank aktualisieren