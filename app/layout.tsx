import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";

const inter = Inter({
	subsets: ["latin", "cyrillic"],
	variable: "--font-inter",
});
const merriweather = Merriweather({
	subsets: ["latin", "cyrillic"],
	weight: ["300", "400", "700", "900"],
	variable: "--font-merriweather",
});

export const metadata: Metadata = {
	title: "Министерство Решения Проблем",
	description:
		"Официальный портал Министерства Решения Проблем. Найдите выход из любой ситуации.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ru">
			<body
				className={`${inter.variable} ${merriweather.variable} font-sans antialiased bg-stone-50 text-stone-900`}
			>
				{children}
			</body>
		</html>
	);
}
