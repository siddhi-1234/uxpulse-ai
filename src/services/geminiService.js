const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || '';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function analyzeUIScreenshot(imageFile) {
  if (!GEMINI_API_KEY) {
    throw new Error('No API key found. Add REACT_APP_GEMINI_API_KEY to your .env file.');
  }

  const base64Image = await fileToBase64(imageFile);

  const prompt = `You are a senior UX expert. Analyze this UI screenshot and identify confusion zones where users are likely to hesitate, misclick, or misunderstand.

Return ONLY a valid JSON array. No markdown, no explanation, no code fences — just the raw JSON array.

Each item must follow this exact structure:
{
  "id": "unique_string",
  "title": "short issue title (max 5 words)",
  "severity": "high" or "medium",
  "explanation": "why this confuses users (1-2 sentences)",
  "suggestion": "specific fix recommendation (1-2 sentences)",
  "zone": {
    "xPercent": number between 0-100,
    "yPercent": number between 0-100,
    "widthPercent": number between 5-40,
    "heightPercent": number between 3-20
  }
}

Rules:
- Return 4 to 6 issues maximum
- xPercent + widthPercent must be less than 98
- yPercent + heightPercent must be less than 98
- severity must be exactly "high" or "medium"
- Return ONLY the JSON array, nothing else, no markdown`;

  const body = {
    contents: [{
      parts: [
        { inline_data: { mime_type: imageFile.type, data: base64Image } },
        { text: prompt },
      ],
    }],
    generationConfig: { temperature: 0.4, maxOutputTokens: 8192, responseMimeType: "application/json" },
  };

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API error ${response.status}`);
  }

  const data = await response.json();
  // Check if the API returned an internal error
  if (data.error) {
    throw new Error(data.error.message);
  }
  const candidate = data.candidates?.[0];
  if (!candidate) {
    throw new Error("No candidates returned. Response: " + JSON.stringify(data));
  }
  const raw = candidate.content?.parts?.[0]?.text || '';
  if (!raw) {
    throw new Error(`AI generated no text. Finish reason: ${candidate.finishReason || 'Unknown'}`);
  }
  let parsedJson;
  try {
    parsedJson = JSON.parse(raw);
  } catch (e) {
    console.error("Malformed AI Response (Raw):", raw);
    throw new Error(`Failed to parse AI JSON. FinishReason: ${candidate.finishReason}. Check browser console for raw output.`);
  }

  // Gemini sometimes returns an object wrapping the array (e.g. { "issues": [...] })
  if (parsedJson && typeof parsedJson === 'object' && !Array.isArray(parsedJson)) {
    const arrays = Object.values(parsedJson).filter(val => Array.isArray(val));
    if (arrays.length > 0) {
      return arrays[0]; // Return the first array it finds inside the object
    }
    return [parsedJson]; // Fallback to wrapping the object in an array
  }

  if (!Array.isArray(parsedJson)) {
    throw new Error("AI did not return an array. Data type: " + typeof parsedJson);
  }

  return parsedJson;
}

export function getMockAnnotations() {
  return [
    {
      id: 'zone-1',
      title: 'Unclear CTA label',
      severity: 'high',
      explanation: 'The button label "Proceed" is ambiguous — users are unsure what action will happen next.',
      suggestion: 'Rename to "Continue to Checkout" to set clear expectations about the next step.',
      zone: { xPercent: 58, yPercent: 38, widthPercent: 22, heightPercent: 8 },
    },
    {
      id: 'zone-2',
      title: 'Low contrast text',
      severity: 'high',
      explanation: 'Gray text on the dark background fails WCAG AA contrast ratio, causing readability issues especially for users with visual impairments.',
      suggestion: 'Increase text color lightness to at least #D1D5DB on dark backgrounds to meet WCAG AA standards.',
      zone: { xPercent: 8, yPercent: 18, widthPercent: 38, heightPercent: 6 },
    },
    {
      id: 'zone-3',
      title: 'Too many nav choices',
      severity: 'medium',
      explanation: 'Navigation presents 6 options at once, causing decision paralysis for new users who cannot identify the primary action.',
      suggestion: 'Group secondary options under a "More" dropdown to reduce cognitive load and highlight the primary path.',
      zone: { xPercent: 4, yPercent: 3, widthPercent: 58, heightPercent: 7 },
    },
    {
      id: 'zone-4',
      title: 'Missing visual hierarchy',
      severity: 'medium',
      explanation: 'Primary and secondary actions appear identical in size and visual weight — users cannot tell which to click first.',
      suggestion: 'Make the primary action larger with a filled background; use ghost/outline style for secondary actions.',
      zone: { xPercent: 22, yPercent: 58, widthPercent: 48, heightPercent: 10 },
    },
  ];
}
