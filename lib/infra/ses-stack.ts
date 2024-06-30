import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import { CfnTemplate } from "aws-cdk-lib/aws-ses";
import { bookingReceiptHtmlTemplate } from "../Utils/bookingTemplate";

export class SESStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    
    const bookingReceiptTemplate = new CfnTemplate(
      this,
      "BookingReceiptTemplate",
      {
        template: {
          htmlPart: bookingReceiptHtmlTemplate,
          subjectPart: "Your Flight was Booked",
          templateName: "BookingReceiptTemplate",
        },
      }
    );
  }
}