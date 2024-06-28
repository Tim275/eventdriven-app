import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import path = require("path");
import * as iam from "aws-cdk-lib/aws-iam";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";

interface ILambdastackProps extends cdk.StackProps {
  usersTable: Table;
}

export class Lambdastack extends cdk.Stack {
  readonly addUserToTableFunc: NodejsFunction;
  readonly bookingLambdaIntegration: LambdaIntegration;
  readonly registerBookingFunc: NodejsFunction;
  readonly sendEmailFunc: NodejsFunction;
  readonly syncFlightRuleFunc: NodejsFunction;

  constructor(scope: Construct, id: string, props: ILambdastackProps) {
    super(scope, id, props);
    this.addUserToTableFunc = this.addUserToUsersTable(props);
  }

  addUserToUsersTable(props: ILambdastackProps) {
    const func = new NodejsFunction(this, "addUserFunc", {
      functionName: "addUserFunc",
      runtime: Runtime.NODEJS_20_X,
      handler: "handler",
      entry: path.join(__dirname, "../../AddUserPostConfirmation/index.ts"),
    });
    func.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["dynamodb:PutItem"],
        resources: [props.usersTable.tableArn as string],
      })
    );
    return func;
  }
}