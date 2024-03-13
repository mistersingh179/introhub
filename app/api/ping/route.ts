export const dynamic = 'force-dynamic' // defaults to auto

export async function GET(request: Request) {
  const response = new Response("OK", {
    status: 200
  })
  return response;
}