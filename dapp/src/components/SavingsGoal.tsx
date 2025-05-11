"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export function SavingsGoal({ className }: { className?: string }) {
	const [goal, setGoal] = useState(30);
	const min = 5;
	const max = 500;
	const step = 5;
	const bars = [50, 25, 40, 32, 50, 45, 30, 25, 40, 35, 50, 45]; // Example data

	return (
		<Card className={cn("flex flex-col items-center p-6 bg-card", className)}>
			<CardHeader className="pb-2 w-full text-center">
				<CardTitle className="text-lg text-white">Saving Goal</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-4 items-center w-full">
				<div className="flex gap-8 justify-center items-center my-2">
					<button
						className="flex justify-center items-center w-10 h-10 text-2xl rounded-full transition bg-muted/20 hover:bg-muted/30"
						onClick={() => setGoal((g) => Math.max(g - step, min))}
						aria-label="Decrease goal"
					>
						–
					</button>
					<div className="flex flex-col items-center">
						<span className="text-5xl font-bold text-white">{goal}</span>
						<span className="text-xs tracking-widest uppercase text-muted-foreground">
							€ / week
						</span>
					</div>
					<button
						className="flex justify-center items-center w-10 h-10 text-2xl rounded-full transition bg-muted/20 hover:bg-muted/30"
						onClick={() => setGoal((g) => Math.min(g + step, max))}
						aria-label="Increase goal"
					>
						+
					</button>
				</div>
				<div className="flex gap-1 justify-center items-end mx-auto w-full max-w-xs h-16">
					{bars.map((v, i) => (
						<div
							key={i}
							className="rounded bg-white/90"
							style={{ width: 12, height: v }}
						/>
					))}
				</div>
				<Button className="py-3 mt-4 w-full text-lg rounded-lg transition bg-foreground text-background hover:bg-gray-100">
					Set Goal
				</Button>
			</CardContent>
		</Card>
	);
}
