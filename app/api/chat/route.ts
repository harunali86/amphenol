import { NextRequest, NextResponse } from "next/server";
import { CATALOG_PRODUCTS, Product } from "@/data/catalog";

export const runtime = "nodejs";

const SYSTEM_INSTRUCTION = `You are the Amphenol AI Interconnect Specialist for Amphenol India (Pune R&D & Logistics Hub).
You represent Amphenol, the world leader in military, aerospace, EV high-voltage, and industrial interconnect systems.

Your goal is to assist defense contractors (DRDO, HAL, BEL, ISRO, Indian Navy), EV engineers (Tata Motors, Mahindra, Ather, Ola Electric), and industrial clients.
Always be technically accurate, concise, and professional. Mention IP ratings, voltage/current ratings, operating temperatures, plating (e.g. Olive Drab Cadmium, Electroless Nickel), and mating cycles when relevant.

AVAILABLE AMPHENOL CATALOG PRODUCTS:
1. [amp-38999-01] D38999/26WF35PN - MIL-DTL-38999 Series III Tri-Start Plug, 66-pin Size 22D, IP68, 600 Vrms, 5.0A, Olive Drab Cadmium. Cross-ref: TE DTS26W19-35PN.
2. [amp-38999-02] D38999/24WF35SN - MIL-DTL-38999 Series III Jam Nut Receptacle, 66-socket, IP68, Olive Drab Cadmium. Cross-ref: TE DTS24W19-35SN.
3. [amp-62in-01] 62IN-16F-14-19PN - Bayonet Coupling Miniature Circular, 19 pins, IP67, 1000 VAC, 7.5A.
4. [amp-26482-02] MS3470W14-19P - MIL-DTL-26482 Series II Bayonet Receptacle, 19 pins, IP67.
5. [amp-83723-01] M83723/75R1831N - MIL-DTL-83723 Series III High-Temperature Matrix, 31 pins, -65°C to +200°C, Fire-resistant.
6. [amp-ev-01] HVSL-1000-02-250A - e-Power High Voltage EV Battery & Powertrain Connector with RadSok, 250A continuous, 1000V DC, IP67/IP6K9K, HVIL interlock.
7. [amp-microd-01] M83513/04-A09N - Micro-D MIL-DTL-83513 Subminiature Rectangular, 9 contacts, 3A, 600 VAC, for avionics/missiles.
8. [amp-hermetic-01] 348-36E10-6P - Hermetic Glass-to-Metal Seal Connector, 6 pins, Leak rate <1x10^-7 cm3/s He, 5000 PSI differential.
9. [amp-m28840-01] M28840/10AA1P1 - MIL-PRF-28840 High-Shock Naval Shipboard Combat Connector, 20 Size 16 pins, IP68 48hr immersion.
10. [amp-pushpull-01] JBX-FD-1G-08-MSS - Push-Pull Quick-Disconnect Subminiature, 8 pins, 5A, 5000 mating cycles.
11. [amp-ranger-01] PR-700-4P - Power Ranger Heavy-Duty Industrial Mining & Automation, 4 poles, 700A, 1000V, IP68.
12. [amp-aqwld-01] AQW-SUB-04-12P - AquaWeld Subsea Deep-Immersion Wet-Mateable, 12 pins, 3000m depth / 300 bar, IP68/IP69K.
13. [amp-rjfield-01] RJFTV-21G - RJ Field Ruggedized Cat6 Ethernet in D38999 Series III metal shell, 1 Gbps / 250 MHz, IP68, 65 dB EMI.
14. [amp-fiber-01] TFOCA-II-04-SM - TFOCA-II Tactical Deployable 4-Channel Single-Mode Fiber Optic, <0.75 dB loss, IP68, battlefield tested.

CRITICAL INSTRUCTIONS:
- Whenever you recommend or discuss any of the above products, tag them clearly with their bracketed ID like [amp-38999-01] or [amp-ev-01]. The frontend will automatically extract these tags and display interactive 3D/RFQ cards to the user!
- If the user asks in Hindi or Hinglish, answer in polite, clear Hinglish/English with technical precision.
- If asked who you are or what AI model powers you, state that you are the Amphenol Interconnect Intelligence Engine developed for Amphenol India Defense, Aerospace, and EV systems. Do not mention third-party foundation model names.
- If asked about Pune dispatch/stock, state that stock is held at Amphenol's Pune Logistics Facility with 24-48 hour dispatch.`;

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // If API key is present, call Gemini API
    if (apiKey) {
      try {
        const contents: any[] = [];

        // Add conversation history if available (limit to last 6 turns for speed)
        if (Array.isArray(history) && history.length > 0) {
          const recent = history.slice(-6);
          for (const item of recent) {
            contents.push({
              role: item.sender === "user" ? "user" : "model",
              parts: [{ text: item.text }],
            });
          }
        }

        // Add current user message
        contents.push({
          role: "user",
          parts: [{ text: message }],
        });

        const geminiRes = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-goog-api-key": apiKey,
            },
            body: JSON.stringify({
              systemInstruction: {
                parts: [{ text: SYSTEM_INSTRUCTION }],
              },
              contents,
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1000,
              },
            }),
          }
        );

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const rawReply =
            data.candidates?.[0]?.content?.parts?.[0]?.text ||
            "I have analyzed your interconnect requirements. Please see the recommended Amphenol solutions below.";

          // Extract recommended product IDs like [amp-...]
          const extractedIds: string[] = [];
          const regex = /\[(amp-[a-zA-Z0-9_-]+)\]/g;
          let match;
          while ((match = regex.exec(rawReply)) !== null) {
            if (!extractedIds.includes(match[1])) {
              extractedIds.push(match[1]);
            }
          }

          // Clean up product tags from displayed text if desired, or keep them
          const cleanedText = rawReply.replace(/\[amp-[a-zA-Z0-9_-]+\]/g, "").trim();

          const recommendedProducts = CATALOG_PRODUCTS.filter((p) =>
            extractedIds.includes(p.id)
          );

          return NextResponse.json({
            reply: cleanedText || rawReply,
            recommendedProducts,
            source: "gemini-ai",
          });
        } else {
          console.warn("Gemini API non-200 response:", await geminiRes.text());
        }
      } catch (geminiErr) {
        console.error("Gemini API error, falling back to catalog intelligence:", geminiErr);
      }
    }

    // Fallback: Intelligent catalog search if API key fails or is offline
    const q = message.toLowerCase();
    let matches: Product[] = [];
    let replyText = "";

    if (q.includes("ev") || q.includes("250a") || q.includes("1000v") || q.includes("battery") || q.includes("powertrain")) {
      matches = [CATALOG_PRODUCTS[5]]; // amp-ev-01
      replyText = "For high-voltage EV battery & powertrain architectures, Amphenol recommends the **e-Power HVSL series** with hyperbolic **RadSok** contacts. It delivers 250A continuous at 1000V DC with IP67/IP6K9K touch-proof sealing and an integrated High Voltage Interlock Loop (HVIL).";
    } else if (q.includes("te") || q.includes("dts26") || q.includes("cross") || q.includes("equivalent")) {
      matches = [CATALOG_PRODUCTS[0], CATALOG_PRODUCTS[1]]; // amp-38999-01, amp-38999-02
      replyText = "The direct 100% form-fit-function Amphenol replacement for TE Connectivity **DTS26W19-35PN** is **D38999/26WF35PN**. It adheres strictly to MIL-DTL-38999 Series III, featuring 66 Size 22D contacts, Olive Drab Cadmium plating, and 500-hour salt spray resistance.";
    } else if (q.includes("rj45") || q.includes("ethernet") || q.includes("cat6") || q.includes("data")) {
      matches = [CATALOG_PRODUCTS[12]]; // amp-rjfield-01
      replyText = "For tactical field communications and harsh Ethernet environments, **RJ Field (RJFTV)** is the gold standard. It encapsulates standard RJ45 cordsets inside a MIL-DTL-38999 Series III metal shell with IP68 immersion sealing and 65dB EMI shielding.";
    } else if (q.includes("fiber") || q.includes("optics") || q.includes("tfoca")) {
      matches = [CATALOG_PRODUCTS[13]]; // amp-fiber-01
      replyText = "For high-bandwidth tactical communications, Amphenol's **TFOCA-II** 4-channel single-mode fiber optic connector provides less than 0.75 dB insertion loss and survives extreme battlefield handling with IP68 sealing.";
    } else if (q.includes("subsea") || q.includes("underwater") || q.includes("deep") || q.includes("water")) {
      matches = [CATALOG_PRODUCTS[11]]; // amp-aqwld-01
      replyText = "For subsea and marine immersion down to 3000 meters (300 bar), Amphenol **AquaWeld** provides wet-mateable IP68/IP69K sealing with 316L stainless steel shells.";
    } else {
      matches = [CATALOG_PRODUCTS[0], CATALOG_PRODUCTS[2]];
      replyText = "I have cross-referenced Amphenol's defense and industrial product matrix for your query. Here are qualified solutions with immediate stock availability at our Pune logistics facility.";
    }

    return NextResponse.json({
      reply: replyText,
      recommendedProducts: matches,
      source: "fallback-intelligence",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal Server Error", details: error?.message },
      { status: 500 }
    );
  }
}
