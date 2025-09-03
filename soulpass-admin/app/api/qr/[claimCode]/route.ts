import { NextResponse } from "next/server";
import QRCode from "qrcode";

export async function GET(
  req: Request,
  { params }: { params: { claimCode: string } }
) {
  try {
    const { claimCode } = params;

    if (!claimCode) {
      return NextResponse.json(
        { error: "Claim code missing" },
        { status: 400 }
      );
    }

    // You can encode a claim link or just the code
    const qrData = `${process.env.NEXT_PUBLIC_APP_URL}/claim/${claimCode}`;

    // Generate QR as PNG buffer
    const qrPng = await QRCode.toBuffer(qrData, {
      type: "png",
      margin: 2,
      width: 300,
      color: { dark: "#000000", light: "#ffffff" },
    });

    return new NextResponse(qrPng, {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `attachment; filename="qr-${claimCode}.png"`,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to generate QR: " + err.message },
      { status: 500 }
    );
  }
}
