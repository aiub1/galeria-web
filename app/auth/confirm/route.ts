import { type NextRequest, NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

const DESTINATION_BY_TYPE: Partial<Record<EmailOtpType, string>> = {
  invite: "/convite",
  recovery: "/nova-senha",
};

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  const destination = type ? DESTINATION_BY_TYPE[type] : undefined;

  if (tokenHash && type && destination) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });

    if (!error) {
      return NextResponse.redirect(new URL(destination, origin));
    }

    console.error("auth confirm failed", error.code ?? error.status);
  }

  const url = new URL("/login", origin);
  url.searchParams.set("erro", "link-invalido");
  return NextResponse.redirect(url);
}
