import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Topic } from "aws-cdk-lib/aws-sns";
import { EmailSubscription, SmsSubscription } from "aws-cdk-lib/aws-sns-subscriptions";

export class SNSStack extends cdk.Stack {
  public readonly myTopic: Topic;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create an SNS topic
    this.myTopic = new Topic(this, "MyTopic", {
      displayName: "My Notification Topic",
      topicName: "MyNotificationTopic",
    });

    const emailSubscription = new EmailSubscription("example@example.com");
    this.myTopic.addSubscription(emailSubscription);
    
    // Subscribe a phone number to the topic
    const smsSubscription = new SmsSubscription("+1234567890");
    this.myTopic.addSubscription(smsSubscription);



  }
}