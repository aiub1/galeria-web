"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { authErrorMessage } from "@/lib/auth/errors";
import { safeNext } from "@/lib/auth/safe-next";
import { publicEnv } from "@/lib/env";

export type FormState = { error: string } | null;

export async function login(_prevState: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = safeNext(String(formData.get("next") ?? ""));

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error("login failed", error.code ?? error.status);
    return { error: authErrorMessage(error) };
  }

  redirect(next);
}

export async function logout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

// Resposta sempre igual, exista ou não a conta — nunca revela se o e-mail
// existe (docs/adr/0002).
export async function requestPasswordReset(_prevState: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "");
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${publicEnv.NEXT_PUBLIC_SITE_URL}/auth/confirm?type=recovery`,
  });

  if (error) {
    console.error("password reset request failed", error.code ?? error.status);
  }

  return null;
}

export async function setNewPassword(_prevState: FormState, formData: FormData): Promise<FormState> {
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (password.length < 8) {
    return { error: "A senha precisa ter pelo menos 8 caracteres." };
  }
  if (password !== confirmPassword) {
    return { error: "As senhas não coincidem." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    console.error("set new password failed", error.code ?? error.status);
    return { error: authErrorMessage(error) };
  }

  redirect("/eventos");
}

export async function acceptInvite(_prevState: FormState, formData: FormData): Promise<FormState> {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  const termsAccepted = formData.get("termsAccepted") === "on";

  if (!fullName) {
    return { error: "Informe seu nome completo." };
  }
  if (password.length < 8) {
    return { error: "A senha precisa ter pelo menos 8 caracteres." };
  }
  if (password !== confirmPassword) {
    return { error: "As senhas não coincidem." };
  }
  if (!termsAccepted) {
    return { error: "É preciso aceitar a política de privacidade para continuar." };
  }

  const supabase = await createClient();
  const { data, error: updateUserError } = await supabase.auth.updateUser({ password });

  if (updateUserError) {
    console.error("accept invite: set password failed", updateUserError.code ?? updateUserError.status);
    return { error: authErrorMessage(updateUserError) };
  }

  // TODO(core): não existe tabela para registrar o aceite dos termos gerais
  // do convite — o checkbox acima só bloqueia o envio na UI. Registrar o
  // aceite de verdade exige uma migration no core (ver PR).
  const { error: profileError } = await supabase
    .from("profiles")
    .update({ full_name: fullName })
    .eq("id", data.user?.id ?? "");

  if (profileError) {
    console.error("accept invite: update profile failed", profileError.code);
    return { error: authErrorMessage(profileError) };
  }

  redirect("/eventos");
}
