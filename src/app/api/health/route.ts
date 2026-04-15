// Health check endpoint for the Application Load Balancer target group.
//
// The ALB periodically hits this path and marks the EC2 instance healthy
// when it returns a 2xx response. Keep the handler trivially fast so that
// slow upstream dependencies never cause a healthy instance to be flagged
// as unhealthy.
//
// Ensure the ALB target group is configured with:
//   - Protocol: HTTP
//   - Port:     3000
//   - Path:     /api/health
//   - Success:  200
export const dynamic = "force-dynamic";

export function GET() {
  return Response.json(
    {
      status: "ok",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    },
  );
}
