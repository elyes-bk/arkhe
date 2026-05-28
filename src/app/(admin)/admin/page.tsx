import { createSupabaseServerClient } from '@/lib/supabase-server'
import { logout } from '@/actions/auth'

export default async function DashboardAdmin() {
  const supabase = createSupabaseServerClient()

  const { data: salons } = await supabase
    .from('salons')
    .select('id, nom_commerce, siret, statut_validation, url_justificatif_local')
    .order('statut_validation', { ascending: true })

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Dashboard Admin</h1>
          <form action={logout}>
            <button className="text-sm text-gray-500 hover:text-black underline">
              Déconnexion
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="font-semibold">Salons en attente de validation</h2>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-6 py-3 text-left">Nom</th>
                <th className="px-6 py-3 text-left">SIRET</th>
                <th className="px-6 py-3 text-left">Statut</th>
                <th className="px-6 py-3 text-left">Justificatif</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {salons?.map((salon) => (
                <tr key={salon.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{salon.nom_commerce}</td>
                  <td className="px-6 py-4 text-gray-500">{salon.siret}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      salon.statut_validation === 'approved'
                        ? 'bg-green-100 text-green-700'
                        : salon.statut_validation === 'rejected'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {salon.statut_validation}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {salon.url_justificatif_local ? (
                      <a
                        href={salon.url_justificatif_local}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        Voir
                      </a>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {!salons?.length && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                    Aucun salon enregistré.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
