import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import { CfnTemplate } from "aws-cdk-lib/aws-ses";
import { standardtemplate } from "../Utils/standarttemplate";

export class SESStack2 extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    
    const Template = new CfnTemplate(
      this,
      "standardtemplate",
      {
        template: {
          htmlPart: standardtemplate,
          subjectPart: "🦄 Mail von AWS - Grüße Timour 🦄",
          templateName: "standardtemplate",
        },
      }
    );
  }
}