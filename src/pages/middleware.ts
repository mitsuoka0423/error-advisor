import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const requestJson = await request.json();
  console.log(JSON.stringify(requestJson, null, 2));

  const response = NextResponse.next();

  const responseJson = await response.json();
  console.log(JSON.stringify(responseJson, null, 2));

  return response;
}

export const config = {
  matcher: '/api/:path*',
}
