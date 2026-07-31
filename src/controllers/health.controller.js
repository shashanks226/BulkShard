export function healthCheck(req, res) {
  return res.status(200).json({
    success: true,
    message: "Server is running.",
    timestamp: new Date().toISOString(),
  });
}