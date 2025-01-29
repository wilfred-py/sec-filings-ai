import { NextResponse } from "next/server";
import { User } from "@/app/models";

export async function GET(request: Request) {
  try {
    // Get user from request (added by middleware)
    const userData = JSON.parse(request.headers.get("user") || "{}");

    const user = await User.findOne(
      { email: userData.email },
      { password: 0 }, // Exclude password from response
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const userData = JSON.parse(request.headers.get("user") || "{}");
    const updates = await request.json();

    // Prevent updating sensitive fields
    delete updates.password;
    delete updates.roles;
    delete updates.email;

    const user = await User.findOneAndUpdate(
      { email: userData.email },
      { $set: updates },
      { new: true, select: "-password" },
    );

    return NextResponse.json(user);
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 },
    );
  }
}
