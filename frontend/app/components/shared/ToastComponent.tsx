"use client";

import { NOTIFICATION_TYPES, NotificationType } from "@/types/notifications";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CiCircleCheck } from "react-icons/ci";
import { IoClose } from "react-icons/io5";
import { MdErrorOutline } from "react-icons/md";

interface ToastProps {
	id: string;
	message: string;
	type?: NotificationType;
	duration?: number;
	visible: boolean;
	onClose: (id: string) => void;
}

interface ToastTransitionProps {
	show: boolean;
	children: React.ReactNode;
}

const ToastTransition: React.FC<ToastTransitionProps> = ({ show, children }) => {
	const nodeRef = useRef<HTMLDivElement | null>(null);

	return (
		<div
			ref={nodeRef}
			className={`transition-all duration-300 ${show ? "opacity-100 transform translate-y-0" : "opacity-0 transform -translate-y-5"}`}
		>
			{children}
		</div>
	);
};

const Toast: React.FC<ToastProps> = ({ id, message, type = NOTIFICATION_TYPES.success, duration = 5000, visible, onClose }) => {
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

		const getToastClasses = () => {
			const base = "alert shadow-lg relative max-w-xs w-[320px] items-center gap-3 pr-10";
			const kind =
				type === NOTIFICATION_TYPES.success
					? "toast-success"
					: type === NOTIFICATION_TYPES.error
					? "toast-error"
					: type === NOTIFICATION_TYPES.info
					? "toast-info"
					: "toast-warning";
			return `${base} ${kind}`;
		};

	useEffect(() => {
		if (visible && duration > 0) {
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
			timeoutRef.current = setTimeout(() => onClose(id), duration);
		}
		return () => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
		};
	}, [visible, id, duration, onClose]);

	if (!visible) return null;

		return (
			<ToastTransition show={visible}>
				<div className="pointer-events-auto">
					<div className={getToastClasses()}>
						<div className="flex-shrink-0">
							{type === NOTIFICATION_TYPES.success && <CiCircleCheck className="h-5 w-5" />}
							{type === NOTIFICATION_TYPES.error && <MdErrorOutline className="h-5 w-5" />}
							{type === NOTIFICATION_TYPES.info && <MdErrorOutline className="h-5 w-5" />}
							{type === NOTIFICATION_TYPES.warning && <MdErrorOutline className="h-5 w-5" />}
						</div>
						<span className="text-sm">{message}</span>
						<button
							onClick={() => onClose(id)}
							className="absolute top-2 right-2 p-1 rounded-full hover:bg-base-content/10 text-current transition-all flex items-center justify-center"
							aria-label="Fermer"
						>
							<IoClose size={18} />
						</button>
					</div>
				</div>
			</ToastTransition>
		);
};

type ToastItem = {
	id: string;
	message: string;
	type?: NotificationType;
	duration?: number;
	show: boolean;
};

// Événement global pour déclencher un toast sans dépendre d'un hook externe
export type ToastEventDetail = Omit<ToastItem, "show"> & { id?: string };

export const ToastComponent: React.FC = () => {
	const [toasts, setToasts] = useState<ToastItem[]>([]);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const hideToast = (id: string) => {
		setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, show: false } : t)));
		// Retire après la transition
		setTimeout(() => {
			setToasts((prev) => prev.filter((t) => t.id !== id));
		}, 300);
	};

	useEffect(() => {
		const handler = (e: Event) => {
			const detail = (e as CustomEvent<ToastEventDetail>).detail;
			if (!detail) return;
			const id = detail.id ?? Math.random().toString(36).slice(2);
			setToasts((prev) => [
				...prev,
				{
					id,
					message: detail.message,
					type: detail.type ?? "success",
					duration: detail.duration ?? 5000,
					show: true,
				},
			]);
		};
		window.addEventListener("app:toast", handler as EventListener);
		return () => window.removeEventListener("app:toast", handler as EventListener);
	}, []);

	if (!mounted) return null;

		return createPortal(
			<div className="toast toast-end toast-top z-[9999]">
			{toasts.map((toast) => (
				<Toast
					key={toast.id}
					id={toast.id}
					message={toast.message}
					type={toast.type}
					duration={toast.duration}
					visible={toast.show}
					onClose={hideToast}
				/>
			))}
		</div>,
		document.body
	);
};

export default ToastComponent;
