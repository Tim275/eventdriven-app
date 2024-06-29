import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  AuthorizationType,
  CognitoUserPoolsAuthorizer,
  LambdaIntegration,
  MethodOptions,
  RestApi,
}from "aws-cdk-lib/aws-apigateway";
import { IUserPool } from "aws-cdk-lib/aws-cognito";

interface ApiStackProps extends cdk.StackProps {
  bookingLambdaIntegration: LambdaIntegration;
  userPool: IUserPool;
}

export class ApiStack extends cdk.Stack {
  public readonly api: RestApi;
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);
    this.api = this.createApi(props);
    this.output();
  }
  createApi(props: ApiStackProps) {
    const api = new RestApi(this, "FBSAPI", {
      restApiName: "FBS-API",
      defaultCorsPreflightOptions: {
        allowOrigins: ["*"],
        allowMethods: ["*"],
        allowHeaders: ["*"],
      },
    });

    const bookingResource = api.root.addResource("booking");
    
    const authorizer = new CognitoUserPoolsAuthorizer(
      this,
      "BookingAuthorizer",
      {
        cognitoUserPools: [props.userPool],
        identitySource: "method.request.header.Authorization",
      }
    );
    
    const optionsWithAuth: MethodOptions = {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: {
        authorizerId: authorizer.authorizerId,
      },
    };
    authorizer._attachToApi(api);
    bookingResource.addMethod(
      "GET",
      props.bookingLambdaIntegration,
      optionsWithAuth
    );
    bookingResource.addMethod(
      "POST",
      props.bookingLambdaIntegration,
      optionsWithAuth
    );
    return api;
  }

  output() {
    new cdk.CfnOutput(this, "ApiEndPoint", {
      value: this.api.url,
    });
  }
}