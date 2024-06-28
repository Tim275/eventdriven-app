#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {Datastack} from '../lib/infra/Datastack';
import {Lambdastack} from '../lib/infra/Lambdastack'; 
import { AuthStack } from "../lib/infra/auth-stack";

const app = new cdk.App();
const datastack =new Datastack(app, 'Datastack');

const lambdastack = new Lambdastack(app, "ComputeStack", {
    usersTable: datastack.usersTable,
 
  });

  const authStack = new AuthStack(app, "AuthStack", {
    addUserPostConfirmation: lambdastack.addUserToTableFunc,
});