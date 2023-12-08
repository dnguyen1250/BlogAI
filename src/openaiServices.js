import OpanAI from "openai";

const openai = new OpanAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const generateBlogs = async (prompt) => {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a blog generator that generate SEO Optimized blogs. based on this description generate a 1 paragraph blog: ",
        },
        { role: "user", content: prompt },
      ],
      model: "gpt-3.5-turbo",
    });
    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error generating blogs:", error);
    return error;
  }
};

export default generateBlogs;
