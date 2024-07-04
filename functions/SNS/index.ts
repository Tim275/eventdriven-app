import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

// Initialisieren Sie den SNS-Client mit Ihrer bevorzugten Region
const snsClient = new SNSClient({
  region: "eu-central-1", // Ersetzen Sie dies durch Ihre Region
});

export const handler = async (event: { detail: { email: string } }): Promise<void> => {
  const { email } = event.detail;
  const message = `Hallo, dies ist eine Nachricht an ${email}`; // Ihre Nachricht
  const topicArn = "arn:aws:sns:eu-central-1:123456789012:MeinTopic"; // Ersetzen Sie dies durch Ihren Topic ARN

  try {
    const response = await snsClient.send(
      new PublishCommand({
        Message: message,
        TopicArn: topicArn, // Für direkte SMS-Nachrichten, verwenden Sie 'PhoneNumber' statt 'TopicArn'
      })
    );
    console.log("SNS message ID:", response.MessageId);
  } catch (error) {
    console.error("Error sending SNS message:", error);
    throw error;
  }
};