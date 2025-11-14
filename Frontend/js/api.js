export const skillsAPI = {
  async analyze(user_skills, desired_job) {
    const response = await fetch("http://127.0.0.1:5000/api/analyze-skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_skills, desired_job }),
    });

    if (!response.ok) throw new Error("API request failed");
    return await response.json();
  },
};
