import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const categorizeTicket = async (req, res) => {
  try {
    const { description } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are classifying internal company support tickets.

Departments:

IT_Dept:
- Laptop issues
- VPN issues
- Network issues
- Software issues
- Email issues

HR_Dept:
- Leave requests
- Attendance issues
- Recruitment
- Employee records

Finance_Dept:
- Salary issues
- Reimbursements
- Payments
- Invoices

admin_Dept:
- Meeting room issues
- Projector issues
- Air conditioner issues
- Furniture issues
- Building maintenance

Examples:

Ticket: VPN is not connecting.
Response:
{"department":"IT_Dept","urgency":"Medium"}

Ticket: My salary has not been credited.
Response:
{"department":"Finance_Dept","urgency":"High"}

Ticket: Leave request is pending.
Response:
{"department":"HR_Dept","urgency":"Low"}

Ticket: Meeting room projector is not working.
Response:
{"department":"admin_Dept","urgency":"Medium"}

Urgency Rules:
- High = Cannot work, salary missing, system down, critical business impact.
- Medium = Work affected but alternatives exist.
- Low = General request, information, minor issue.

Return ONLY valid JSON.
Do not use markdown.
Do not use \`\`\`.

Ticket:
${description}
`;

    const result = await model.generateContent(prompt);

    const text = result.response
      .text()
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const aiResponse = JSON.parse(text);

    res.json(aiResponse);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: err.message,
    });
  }
};

export const generateSuggestedResponse = async (
  req,
  res
) => {
  try {
    const { description } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
Generate a short professional first response
for this support ticket.

Ticket:
${description}

Return only plain text.
`;

    const result =
      await model.generateContent(prompt);

    const response =
      result.response.text();

    res.json({
      success: true,
      suggested_response:
        response.trim(),
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

