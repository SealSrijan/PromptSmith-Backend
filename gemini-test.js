const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

async function test() {
  try {

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const result = await model.generateContent(
      "Say only: Gemini API Working"
    );

    console.log(result.response.text());

  } catch (err) {

    console.error("ERROR:");
    console.error(err);

  }
}

test();