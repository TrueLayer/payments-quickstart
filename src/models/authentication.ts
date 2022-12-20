import z from 'zod';

const AuthenticationResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
  expires_in: z.number()
});

export type AuthenticationResponse = z.infer<typeof AuthenticationResponseSchema>;
