const { execSync } = require("child_process");

async function debugFrontend() {
  try {
    console.log("🔍 Testing frontend at http://localhost:3000...");

    // Simple fetch test
    const response = await fetch("http://localhost:3000");
    console.log("✅ Frontend response status:", response.status);

    const html = await response.text();

    // Check for key indicators
    const hasTitle = html.includes("NexBid - Freelance Marketplace");
    const hasTailwind = html.includes("card-neu");
    const hasError =
      html.includes("404") || html.includes("This page could not be found");
    const hasLoading = html.includes("Loading projects");

    console.log("📊 Frontend Analysis:");
    console.log("  - Title present:", hasTitle);
    console.log("  - Tailwind classes:", hasTailwind);
    console.log("  - 404 Error:", hasError);
    console.log("  - Loading state:", hasLoading);

    // Test API endpoint
    try {
      const apiResponse = await fetch("http://localhost:8080/api/health");
      const apiData = await apiResponse.json();
      console.log("✅ API Health:", apiData.status);
    } catch (apiError) {
      console.log("❌ API Error:", apiError.message);
    }

    // Test projects endpoint
    try {
      const projectsResponse = await fetch(
        "http://localhost:8080/api/projects"
      );
      console.log("📝 Projects API status:", projectsResponse.status);

      if (projectsResponse.status === 500) {
        const errorText = await projectsResponse.text();
        console.log("❌ Projects API error:", errorText.substring(0, 200));
      }
    } catch (projectsError) {
      console.log("❌ Projects API Error:", projectsError.message);
    }
  } catch (error) {
    console.error("❌ Debug error:", error.message);
  }
}

debugFrontend();
