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
      const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout
      
      const response = await fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      const responseText = await response.text();
      let resData;
      try {
        resData = JSON.parse(responseText);
      } catch (parseErr) {
        console.error(`Non-JSON response for ${action}:`, responseText);
        // If they received HTML (like Vercel serverless error pages)
        if (response.status === 504) {
          return {
            ok: false,
            error: "انتهت مهلة خادم فيرسيل (504 Gateway Timeout). يرجى التحقق من سرعة استجابة سكريبت جوجل شيت."
          };
        }
        if (response.status === 502 || response.status === 500) {
          return {
            ok: false,
            error: `فشل خادم فيرسيل (كود ${response.status}). يرجى التأكد من كتابة متغير GOOGLE_SCRIPT_URL بشكل صحيح وإجراء Redeploy للموقع.`
          };
        }
        return {
          ok: false,
          error: `خطأ اتصال من فيرسيل (${response.status}): يرجى تفعيل وإدخال متغير GOOGLE_SCRIPT_URL في إعدادات فيرسيل`
        };
      }
      return resData;
    } catch (error: any) {
      if (i === retries) {
        console.error(`API Call failed for action ${action}:`, error);
        const isTimeout = error?.name === "AbortError";
        return {
          ok: false,
          error: isTimeout 
            ? "انتهت مهلة الاتصال بالخادم (20 ثانية) دون رد من جوجل شيت. يرجى إعادة المحاولة."
            : `تعذر الاتصال بالخادم الرئيسي: ${error?.message || "يرجى التحقق من اتصال الإنترنت"}`
        };
      }
      await new Promise((res) => setTimeout(res, 1200)); // wait and retry
    }
  }
}
