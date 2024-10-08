import { NextResponse, NextRequest } from "next/server";

export async function GET(request: Request) {
  return NextResponse.json({ message: "Funcionando OK" });
}

export async function POST(request: Request) {
  return NextResponse.json({ message: "Funcionando OK POST" });
}
