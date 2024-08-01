
type CookieOptions = {
  httpOnly: boolean;
  maxAge: number;
  sameSite: boolean | "none" | "strict" | "lax" | undefined;
  secure: boolean;
}
export const cookieOptions: CookieOptions = {
  httpOnly: true,
  maxAge: 24 * 60 * 60 * 1000, // 1 day
  sameSite: "none",
  secure: true
}