import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import { unmarshall } from "@aws-sdk/util-dynamodb";


const sesClient = new SESv2Client({
  region: "eu-central-1",
});

export const handler = async (event: { detail: { email: string } }): Promise<void> => {
  const { email } = event.detail;
  const senderEmail = "timourmiagol@outlook.de";
  const templateName = "standardtemplate";

  try {
    const response = await sesClient.send(
      new SendEmailCommand({
        FromEmailAddress: senderEmail,
        Content: {
          Template: {
            TemplateName: templateName,
            TemplateData: JSON.stringify({
              // You can add dynamic data here if needed
            }),
          },
        },
        Destination: {
          ToAddresses: [email],
        },
      })
    );
    console.log({ response });
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }

  console.log("Received event:", JSON.stringify(event, null, 2));
};
