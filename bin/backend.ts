#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {Datastack} from '../lib/infra/Datastack';
import {Lambdastack} from '../lib/infra/Lambdastack'; 
import { AuthStack } from "../lib/infra/auth-stack";
import { ApiStack } from "./../lib/infra/api-stack";
import { EventBridgeStack } from "./../lib/infra/event-bus";

const app = new cdk.App();
const datastack =new Datastack(app, 'Datastack');

const lambdastack = new Lambdastack(app, "ComputeStack", {
  usersTable: datastack.usersTable,
  flightTable: datastack.flightsTable,
  seatsTable: datastack.seatsTable,
});

  const authStack = new AuthStack(app, "AuthStack", {
    addUserPostConfirmation: lambdastack.addUserToTableFunc,
});



const apiStack = new ApiStack(app, "APIStack", {
  bookingLambdaIntegration: lambdastack.bookingLambdaIntegration,
  userPool: authStack.userPool,
});

const eventStack = new EventBridgeStack(app, "EventBridgeStack", {
  registerBooking: lambdastack.registerBookingFunc,
  emailReceipt: lambdastack.sendEmailFunc,
  syncFlights: lambdastack.syncFlightRuleFunc,
});