import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/config";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { sessionId, ...rest } = body;

		if (!sessionId) {
			return NextResponse.json(
				{ error: "Session ID is required" },
				{ status: 400 },
			);
		}

		const response = await fetch(
			`${API_BASE_URL}/sessions/${sessionId}/interview`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(rest),
			},
		);

		if (!response.ok) {
			const errorText = await response.text();
			console.error("Backend error:", response.status, errorText);
			return NextResponse.json(
				{ error: "Failed to process interview", backendError: errorText },
				{ status: response.status },
			);
		}

		const data = await response.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("API error:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
