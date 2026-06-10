// normalization of digits and formatting
export function fixPhoneJS(p: string | number): string {
  if (!p) return "";
  let pStr = p.toString().replace(/[^0-9]/g, "");
  if (!pStr) return "";
  if (pStr.startsWith("002")) pStr = pStr.substring(3);
  if (pStr.startsWith("20") && pStr.length === 12) pStr = "0" + pStr.substring(2);
  if (!pStr.startsWith("0") && pStr.length === 10) pStr = "0" + pStr;
  return pStr;
}

export function toWA(phone: string): string {
  const p = fixPhoneJS(phone);
  if (!p) return "";
  return "20" + p.substring(1);
}

export function validatePhone(ph: string): { valid: boolean; msg: string } {
  const p = fixPhoneJS(ph);
  if (!p) return { valid: false, msg: "رقم الهاتف فارغ" };
  if (p.length !== 11) return { valid: false, msg: "رقم الهاتف يجب أن يتكون من 11 رقماً" };
  if (!/^01[0125][0-9]{8}$/.test(p)) return { valid: false, msg: "رقم الهاتف غير صحيح (يجب أن يبدأ بـ 010 أو 011 أو 012 أو 015)" };
  return { valid: true, msg: "" };
}

// Unified API caller for the react fullstack container environment
export async function apiCall(action: string, token: string, extraParams: any = {}, retries = 2): Promise<any> {
  const payload = { action, token, ...extraParams };
  
  for (let i = 0; i <= retries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      
      const response = await fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      const resData = await response.json();
      return resData;
    } catch (error) {
      if (i === retries) {
        console.error(`API Call failed for action ${action}:`, error);
        return { ok: false, error: "فشل الاتصال بالخادم الرئيسي — يرجى التأكد من اتصال الإنترنت" };
      }
      await new Promise((res) => setTimeout(res, 1200)); // wait and retry
    }
  }
}
