import { User } from 'src/modules/core/user/schema/user-schema';

export type AccessTokenPayload = SupabaseAuthTokenPayload;

export type ReqUser = SupabaseAuthTokenPayload;

export type ReqOrg = User;

export type SupabaseAuthTokenPayload = {
  iss: string;
  sub: string;
  aud: string;
  exp: number;
  iat: number;
  email: string;
  phone: string;
  app_metadata: {
    provider: string;
    providers: string[];
  };
  user_metadata: {
    display_name: string;
    email: string;
    email_verified: boolean;
    first_name: string;
    full_name: string;
    last_name: string;
    phone: string;
    phone_verified: boolean;
    sub: string;
  };
  role: string;
  aal: string;
  amr: { method: string; timestamp: number }[];
  session_id: string;
  is_anonymous: boolean;
};
