export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/missions/:path*",
    "/withdraw/:path*",
    "/profile/:path*",
  ],
};
