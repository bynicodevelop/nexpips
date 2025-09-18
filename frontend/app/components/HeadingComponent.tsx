import { EmailingType } from "@/types/emailing";
import FormComponent from "./FormComponent";
export default function HeadingComponent({
  subscribeEmailing,
}: {
  subscribeEmailing: (emailingForm: EmailingType) => void;
}) {
  return (
    <header aria-label="En-tête">
      <section id="hero" className="py-20">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-sm tracking-wider text-base-content/70 uppercase">
            Journal de trading moderne
          </p>
          <h1 className="mt-3 text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
            Le premier journal de trading qui transforme tes notes en
            performance.
          </h1>
          <p className="mt-5 max-w-3xl text-lg text-base-content/80">
            Documente tes idées, transforme-les en trades et suis enfin ton vrai
            Risk/Reward, ton Winrate et ton Drawdown.{" "}
            <span className="inline-block">
              👉 Bientôt disponible. Rejoins la liste d’attente pour accéder en
              avant-première.
            </span>
          </p>

          {/* CTA form */}
          <div className="mt-8">
            <FormComponent
              handleSubmit={subscribeEmailing}
              id="email"
              placeholder="Votre email"
              label="Votre email"
              buttonText="→ Rejoindre la liste d’attente"
              wrapperClassName="flex w-full max-w-xl items-center gap-3"
              inputClassName="input input-bordered flex-1"
              buttonClassName="btn btn-primary font-semibold"
            />
          </div>
        </div>
      </section>
    </header>
  );
}
