import Link from "next/link";
import { isBookingSystemConfigured } from "@/lib/bookingStatus";
import AppointmentsList from "@/components/admin/AppointmentsList";
import LogoutButton from "@/components/admin/LogoutButton";
import Logo from "@/components/Logo";

export const dynamic = "force-dynamic";

export default function AdminAppointmentsPage() {
  const configured = isBookingSystemConfigured();

  return (
    <div className="min-h-screen bg-ivory-dim">
      <header className="flex items-center justify-between border-b border-navy/10 bg-navy px-6 py-5 sm:px-10">
        <Logo variant="light" />
        <LogoutButton />
      </header>

      <div className="container-xl py-12">
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-3xl text-navy">Rendez-vous</h1>
          <Link
            href="/admin"
            className="text-sm font-semibold uppercase tracking-wide text-gold-dark hover:text-gold"
          >
            ← Réalisations
          </Link>
        </div>

        {!configured ? (
          <div className="mt-8 rounded-sm border border-amber-300 bg-amber-50 px-6 py-5 text-sm text-amber-900">
            <strong>Prise de rendez-vous non configurée.</strong> Ajoutez les variables
            d&apos;environnement <code>POSTGRES_URL</code> et <code>GOOGLE_MAPS_API_KEY</code>,
            ainsi que l&apos;adresse de départ dans la configuration du site (voir le
            <code> README.md</code>).
          </div>
        ) : (
          <div className="mt-10">
            <AppointmentsList />
          </div>
        )}
      </div>
    </div>
  );
}
