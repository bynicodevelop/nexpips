"use client";
import CardComponent from "./components/CardComponent";
import HeadingComponent from "./components/HeadingComponent";
import FormComponent from "./components/FormComponent";
import { useEmailing } from "./hooks/emailing";

export default function Home() {
  const { subscribeEmailing } = useEmailing();

  return (
    <main className="min-h-screen bg-base-100 text-base-content">
      {/* Hero */}
      <HeadingComponent subscribeEmailing={subscribeEmailing} />

      {/* Section 1 – Pourquoi s’inscrire ? */}
      <section id="pourquoi" aria-label="Pourquoi s’inscrire" className="py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-2xl sm:text-3xl font-bold">
            Pourquoi s’inscrire ?
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            <CardComponent
              title="Accès gratuit à vie"
              description="L’inscription est gratuite et le restera."
            />
            <CardComponent
              title="Découverte en avant-première"
              description="Recevez les nouvelles fonctionnalités avant tout le monde."
            />
            <CardComponent
              title="Structure ton trading"
              description="Un journal moderne pour passer au niveau supérieur."
            />
          </div>
        </div>
      </section>

      {/* Section 2 – Comment ça marche ? */}
      <section id="comment" aria-label="Comment ça marche" className="py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-2xl sm:text-3xl font-bold">
            Comment ça marche ?
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <CardComponent
              label="Étape 1"
              title="Journalise tes observations"
              description="Note setups, contextes, plans et captures."
            />
            <CardComponent
              label="Étape 2"
              title="Transforme-les en trades"
              description="Relie idée → exécution avec discipline."
            />
            <CardComponent
              label="Étape 3"
              title="Analyse tes résultats"
              description="RR, Winrate, Drawdown, expectancy, et plus."
            />
          </div>
        </div>
      </section>

      {/* Section 3 – Pour qui ? */}
      <section id="pour-qui" aria-label="Pour qui" className="py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-2xl sm:text-3xl font-bold">Pour qui ?</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <CardComponent
              title="Traders particuliers"
              description="Pour arrêter de trader au hasard et bâtir des habitudes."
            />
            <CardComponent
              title="Traders intermédiaires"
              description="Pour mesurer et itérer sur leurs setups avec des métriques."
            />
            <CardComponent
              title="Prop firms"
              description="Pour suivre la discipline et les résultats de leurs traders."
            />
          </div>
        </div>
      </section>

      {/* Section 4 – CTA final */}
      <section id="cta-final" aria-label="Rejoindre la bêta" className="py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold">
            Rejoins la liste d’attente dès maintenant
          </h2>
          <p className="mt-4 text-base-content/80">
            Ne manque pas le lancement : les premiers inscrits auront un accès
            prioritaire et des avantages exclusifs.
          </p>
          <FormComponent
                handleSubmit={subscribeEmailing}
                id="email-final"
                placeholder="Entrer mon e-mail"
                label="Votre email"
                buttonText="Entrer mon e-mail et rejoindre la bêta"
                wrapperClassName="mt-8 mx-auto flex w-full max-w-xl items-center gap-3"
                inputClassName="input input-bordered flex-1"
                buttonClassName="btn btn-primary font-semibold"
              />
        </div>
      </section>
    </main>
  );
}
