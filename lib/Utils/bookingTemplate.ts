export const bookingReceiptHtmlTemplate = `<html>
  <head>
    <style>
      /* Ensure styles are as compatible as possible */
      @media only screen and (max-width: 600px) {
        .container {
          width: 100% !important;
        }
        .title h1 {
          font-size: 24px !important;
        }
        .message p {
          font-size: 14px !important;
        }
        .footer {
          font-size: 12px !important;
        }
      }
    </style>
  </head>
  <body style="font-family: Arial, sans-serif; text-align: center; background-color: #f0f0f0; padding: 20px; margin: 0;">
    <div class="container" style="border: 2px solid #17bb90; border-radius: 10px; margin: 0 auto; max-width: 500px; overflow: hidden; background-color: #ffffff;">
      <div class="title" style="color: #fff; background-color: #17bb90; padding: 1em;">
        <h1 style="font-size: 28px; font-weight: bold;">Your flight {{flightId}} was booked!</h1>
      </div>
      <div class="message" style="padding: 1em; line-height: 1.5em; color: #033c49;">
        <p>Your flight <strong>{{flightId}}</strong> was booked and your seats are <strong>{{seats}}</strong>.</p>
      </div>
    </div>
    <p class="footer" style="font-size: 0.8em; color: #888; margin-top: 20px;">
      This is an automated message, please do not reply.
    </p>
  </body>
</html>`;
