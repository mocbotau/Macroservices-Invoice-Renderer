export const IronOptions = {
    cookieName: "session",
    password: process.env.NEXT_PUBLIC_COOKIE_KEY as string,
    cookieOptions: {
        secure: process.env.NODE_ENV === "production"
    }
}