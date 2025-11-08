import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupaBaseService {
  public client: SupabaseClient;

  constructor() {
    this.client = createClient(
      process.env.SUPABASE_URL || 'https://wqketgoplrnlgafpcpqg.supabase.co',
      process.env.SUPABASE_ANON_KEY ||
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indxa2V0Z29wbHJubGdhZnBjcHFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5NTA5NzgsImV4cCI6MjA3NzUyNjk3OH0.Xyp8V5H6iNO84WQQZ6RSa5Qkq0lS0PkGUpFAq84mVdQ',
      {
        auth: { autoRefreshToken: false, persistSession: false },
      },
    );
  }
}
