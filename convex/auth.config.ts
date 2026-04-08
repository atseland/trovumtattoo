const authConfig = {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN ?? 'https://united-piranha-14.clerk.accounts.dev',
      applicationID: 'convex',
    },
  ],
}

export default authConfig
