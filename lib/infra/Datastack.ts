import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';

export class Datastack extends cdk.Stack {
  public readonly usersTable: Table;
  public readonly flightsTable: Table;
  public readonly seatsTable: Table;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    // Initialize the usersTable
    this.usersTable = new Table(this, "UsersTable", {
      partitionKey: {
        name: "UserID",
        type: AttributeType.STRING,
      },
      tableName: "Users",
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    this.usersTable.addGlobalSecondaryIndex({
      indexName: "usernameIndex",
      partitionKey: {
        name: "username",
        type: AttributeType.STRING,
      },
    });


    this.flightsTable = new Table(this, "FlightsTable", {
      tableName: "Flights",
      partitionKey: {
        name: "FlightID",
        type: AttributeType.STRING,
      },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    this.seatsTable = new Table(this, "SeatsTable", {
      tableName: "SeatBooking",
      partitionKey: {
        name: "FlightID",
        type: AttributeType.STRING,
      },
      sortKey: {
        name: "SeatID",
        type: AttributeType.STRING,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    this.seatsTable.addGlobalSecondaryIndex({
      indexName: "IsBookedIndex",
      partitionKey: {
        name: "IsBooked",
        type: AttributeType.STRING,
      },
    });
  }
}