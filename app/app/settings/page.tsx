"use client";

import SignoutButton from "../shared/components/SignoutButton";
import { useAuthContext } from "../providers/AuthProvider";

export default function SettingsPage() {
	const { user } = useAuthContext();

	return (
		<div className="space-y-6">
			<header className="space-y-1">
				<h1 className="text-2xl font-semibold">Paramètres</h1>
				<p className="text-sm text-base-content/70">
					{user ? `Connecté: ${user.email ?? user.uid}` : "Non connecté"}
				</p>
			</header>

			<section className="card border border-base-300 bg-base-100">
				<div className="card-body gap-4">
					<h2 className="card-title text-base">Sécurité</h2>
					<p className="text-sm text-base-content/70">
						Vous pouvez vous déconnecter de cette session.
					</p>
					<div>
						<SignoutButton />
					</div>
				</div>
			</section>
		</div>
	);
}

