import Link from "next/link";

type UserRef = { created_at: string } | { created_at: string }[] | null;

interface Salon {
  id: string;
  nom_commerce: string;
  adresse: string | null;
  users: UserRef;
}

interface Props {
  salons: Salon[];
  totalPending: number;
}

function getCreatedAt(users: UserRef): string | null {
  if (!users) return null;
  if (Array.isArray(users)) return users[0]?.created_at ?? null;
  return users.created_at;
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function PendingSalonsPanel({ salons, totalPending }: Props) {
  return (
    <div className="rounded-[5px] bg-[#FDFDFD] px-6 py-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-kumbh text-base font-semibold text-[#04082E]">
          Activité des salons
        </h2>
        <span className="rounded-full bg-yellow-100 px-2 py-0.5 font-montserrat text-xs font-medium text-yellow-700">
          {totalPending}
        </span>
      </div>

      <ul className="flex flex-col gap-3">
        {salons.map((salon) => {
          const createdAt = getCreatedAt(salon.users);
          return (
            <li
              key={salon.id}
              className="flex items-center gap-3 rounded-lg border border-gray-100 px-4 py-3"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0738DC]/10">
                <svg width="14" height="14" viewBox="0 0 20 20" fill="#0738DC">
                  <path d="M10 10a4 4 0 100-8 4 4 0 000 8zm0 2c-4 0-7 2-7 3v1h14v-1c0-1-3-3-7-3z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-montserrat text-sm font-medium text-[#04082E]">
                  {salon.nom_commerce}
                </p>
                <p className="font-montserrat text-xs text-gray-400">
                  {salon.adresse ?? "—"} · {formatDate(createdAt)}
                </p>
              </div>
              <Link
                href="/admin/moderation"
                className="shrink-0 rounded border border-[#0738DC] px-3 py-1 font-montserrat text-xs text-[#0738DC] transition-colors hover:bg-[#0738DC] hover:text-white"
              >
                Voir
              </Link>
            </li>
          );
        })}
        {salons.length === 0 && (
          <li className="py-8 text-center font-montserrat text-sm text-gray-400">
            Aucun dossier en attente
          </li>
        )}
      </ul>
    </div>
  );
}
