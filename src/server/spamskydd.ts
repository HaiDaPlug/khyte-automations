import "server-only";

/**
 * A simple per-IP limit for the site's own forms: at most MAX_PER_TIMME
 * requests per IP and hour. Kept in memory, so it is best effort: each warm
 * server instance counts on its own and the count resets on a cold start.
 * That is enough next to the honeypot and the minimum fill time; a booking
 * form doesn't need the compass's database-backed limit.
 */

export const MAX_PER_TIMME = 5;
const TIMME = 60 * 60 * 1000;

const inskick = new Map<string, number[]>();

/** The client's IP from the proxy headers. */
export function lasIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "okand";
}

/** Records a request and returns false once the IP is over the limit. */
export function slappIgenom(ip: string, nu = Date.now()): boolean {
  const senaste = (inskick.get(ip) ?? []).filter((t) => nu - t < TIMME);
  if (senaste.length >= MAX_PER_TIMME) {
    inskick.set(ip, senaste);
    return false;
  }
  senaste.push(nu);
  inskick.set(ip, senaste);
  return true;
}
