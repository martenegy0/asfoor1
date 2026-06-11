import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }
  
  let scriptUrl = process.env.GOOGLE_SCRIPT_URL || '';
  
  // Defensive URL sanitization
  scriptUrl = scriptUrl.trim();
  if (scriptUrl.startsWith('"') && scriptUrl.endsWith('"')) {
    scriptUrl = scriptUrl.substring(1, scriptUrl.length - 1).trim();
  } else if (scriptUrl.startsWith("'") && scriptUrl.endsWith("'")) {
    scriptUrl = scriptUrl.substring(1, scriptUrl.length - 1).trim();
  }
  
  if (!scriptUrl) {
    return res.status(500).json({ 
      ok: false, 
      error: 'GOOGLE_SCRIPT_URL variable is empty or not configured on Vercel.' 
    });
  }
  
  if (!scriptUrl.startsWith('http://') && !scriptUrl.startsWith('https://')) {
    return res.status(500).json({ 
      ok: false, 
      error: `Configured GOOGLE_SCRIPT_URL is not a valid HTTP/HTTPS address: "${scriptUrl}"` 
    });
  }
  
  try {
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    
    const responseText = await response.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      return res.status(502).json({
        ok: false,
        error: `جوجل شيت لم يرجع استجابة JSON صالحة. الرد المستلم: ${responseText.substring(0, 300)}`
      });
    }
    
    return res.status(200).json(data);
  } catch (e: any) {
    return res.status(500).json({ 
      ok: false, 
      error: `Failed to proxy request to Google Apps Script. Error: ${e.message}` 
    });
  }
}

