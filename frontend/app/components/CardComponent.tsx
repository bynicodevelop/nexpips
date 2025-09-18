"use client";

type Props = {
  label?: string;
  title: string;
  description: string;
};

export default function CardComponent({ title, description, label }: Props) {
  return (
    <div className="rounded-lg bg-base-200 p-5">
      {label && <div className="text-primary text-sm font-semibold">{label}</div>}
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-base-content/80">
        {description}
      </p>
    </div>
  );
}
