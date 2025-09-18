"use client";

export default function FormComponent({
	handleSubmit,
	id = "email",
	placeholder = "Votre email",
	label = "Votre email",
	buttonText = "→ Rejoindre la liste d’attente",
	wrapperClassName = "flex w-full max-w-xl items-center gap-3",
	inputClassName = "input input-bordered flex-1",
	buttonClassName = "btn btn-primary font-semibold",
}: {
	handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
	id?: string;
	placeholder?: string;
	label?: string;
	buttonText?: string;
	wrapperClassName?: string;
	inputClassName?: string;
	buttonClassName?: string;
}) {
	return (
		<form className={wrapperClassName} onSubmit={handleSubmit}>
			<label htmlFor={id} className="sr-only">
				{label}
			</label>
			<input
				id={id}
				type="email"
				required
				placeholder={placeholder}
				className={inputClassName}
			/>
			<button type="submit" className={buttonClassName}>
				{buttonText}
			</button>
		</form>
	);
}