import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import React from "react";

// Mocks contrôlables
const logPageView = vi.fn();
let isInitialized = false;

vi.mock("../hooks/useAnalytics", () => ({
	useAnalytics: () => ({ logPageView }),
}));

vi.mock("./FirebaseProvider", () => ({
	useFirebaseContext: () => ({ isInitialized }),
}));

import AnalyticsListener from "./AnalyticsListener";

describe("AnalyticsListener", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		logPageView.mockReset();
		isInitialized = false;
	});

	afterEach(() => {
		vi.runOnlyPendingTimers();
		vi.useRealTimers();
		cleanup();
	});

	it("ne log rien quand Firebase n'est pas initialisé", () => {
		isInitialized = false;
		render(<AnalyticsListener url="/" />);
		vi.runAllTimers();
		expect(logPageView).not.toHaveBeenCalled();
	});

	it("log un page_view quand initialisé et url fournie", () => {
		isInitialized = true;
		render(<AnalyticsListener url="/home" />);
		vi.runAllTimers();
		expect(logPageView).toHaveBeenCalledTimes(1);
		expect(logPageView).toHaveBeenCalledWith("/home", {});
	});

	it("passe les paramètres additionnels retournés par mapParams", () => {
		isInitialized = true;
		const mapParams = (u: string) => ({ route: u, test: 1 });
		render(<AnalyticsListener url="/home" mapParams={mapParams} />);
		vi.runAllTimers();
		expect(logPageView).toHaveBeenCalledWith("/home", { route: "/home", test: 1 });
	});

	it("dé-duplique les logs pour la même URL", () => {
		isInitialized = true;
		const { rerender } = render(<AnalyticsListener url="/same" />);
		vi.runAllTimers();
		expect(logPageView).toHaveBeenCalledTimes(1);

		// Même URL -> pas de nouvel envoi
		rerender(<AnalyticsListener url="/same" />);
		vi.runAllTimers();
		expect(logPageView).toHaveBeenCalledTimes(1);
	});

	it("log à nouveau quand l'URL change", () => {
		isInitialized = true;
		const { rerender } = render(<AnalyticsListener url="/page-1" />);
		vi.runAllTimers();
		expect(logPageView).toHaveBeenCalledTimes(1);
		expect(logPageView).toHaveBeenLastCalledWith("/page-1", {});

		rerender(<AnalyticsListener url="/page-2" />);
		vi.runAllTimers();
		expect(logPageView).toHaveBeenCalledTimes(2);
		expect(logPageView).toHaveBeenLastCalledWith("/page-2", {});
	});

	it("ne log pas si disabled", () => {
		isInitialized = true;
		render(<AnalyticsListener url="/" enabled={false} />);
		vi.runAllTimers();
		expect(logPageView).not.toHaveBeenCalled();
	});
});

