/**
 * Utility for persisting feedback to Google Sheets.
 * Requires Google Cloud Service Account credentials.
 */
export async function logFeedbackToSheets(data: {
  projectId: string;
  clientId: string;
  clientName: string;
  projectTitle: string;
  content: string;
  type: "comment" | "correction" | "system";
  status: string;
}) {
  if (!process.env.GOOGLE_SHEETS_PRIVATE_KEY) {
    console.warn("Google Sheets keys not configured. Skipping sync.");
    return { success: false, error: "Missing Keys" };
  }

  try {
    // 1. Authenticate with googleapis using JWT
    // const auth = new google.auth.JWT(
    //   process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    //   null,
    //   process.env.GOOGLE_SHEETS_PRIVATE_KEY,
    //   ['https://www.googleapis.com/auth/spreadsheets']
    // );
    
    // 2. Initialize sheets API
    // const sheets = google.sheets({ version: 'v4', auth });

    // 3. Append Row
    // await sheets.spreadsheets.values.append({
    //   spreadsheetId: process.env.GOOGLE_SHEET_ID,
    //   range: 'FeedbackLog!A:H',
    //   valueInputOption: 'USER_ENTERED',
    //   requestBody: {
    //     values: [[
    //       new Date().toISOString(),
    //       data.projectId,
    //       data.clientId,
    //       data.clientName,
    //       data.projectTitle,
    //       data.content,
    //       data.type,
    //       data.status
    //     ]]
    //   }
    // });

    console.log("Successfully logged to Sheets (Mock):", data);
    return { success: true };
  } catch (error) {
    console.error("Sheets sync failed:", error);
    return { success: false, error };
  }
}
