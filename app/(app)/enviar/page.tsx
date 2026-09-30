import { requireActiveProfile } from "@/lib/auth/require-active-profile";
import { canUpload, isAdmin } from "@/lib/auth/roles";
import { listEventOptions, listMinorOptions } from "@/lib/upload/options";
import { SemAcesso } from "../_components/SemAcesso";
import { UploadScreen } from "./UploadScreen";

export const metadata = { title: "Enviar fotos — Galeria Poiema CWB" };

export default async function EnviarPage() {
  const { profile } = await requireActiveProfile();

  // Só UX: quem decide é a policy `insert photos` (can_upload()) e as actions
  // repetem a checagem de papel.
  if (!canUpload(profile.role)) return <SemAcesso />;

  const admin = isAdmin(profile.role);
  const [events, minors] = await Promise.all([listEventOptions(), admin ? listMinorOptions() : Promise.resolve([])]);

  return (
    <main className="mx-auto max-w-[920px] px-[20px] pb-[80px] pt-[clamp(28px,4vw,56px)]">
      <h1 className="m-0 mb-[8px] font-display text-display-3 uppercase text-text-strong">Enviar fotos</h1>
      <p className="m-0 mb-[32px] max-w-[64ch] text-body-md text-text-body">
        Cada foto precisa de uma resposta sobre a presença de crianças e adolescentes. Sem essa resposta a foto não é
        publicada e não aparece para ninguém.
      </p>
      <UploadScreen events={events} minors={minors} canTagMinors={admin} />
    </main>
  );
}
