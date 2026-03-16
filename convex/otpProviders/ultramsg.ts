export async function sendUltramsg(toPhone: string, body: string) {
  const ultramsgToken = process.env.ULTRAMSG_TOKEN || "f41pafsedsvmh3n8";
  const instanceId = process.env.ULTRAMSG_INSTANCE_ID || "instance165768";
  
  const params = new URLSearchParams({
    token: ultramsgToken,
    to: toPhone,
    body: body
  });

  const url = `https://api.ultramsg.com/${instanceId}/messages/chat`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: params.toString()
    });
    
    const result = await response.text();
    console.log(`[ultramsg] response for`, toPhone, ":", result);
  } catch (error) {
    console.error(`[ultramsg] Failed to send OTP to`, toPhone, ":", error);
  }
}
