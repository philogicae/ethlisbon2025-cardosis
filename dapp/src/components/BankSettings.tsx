"use client";

// import { useState } from "react";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

export function BankSettings({ className }: { className?: string }) {
	// const [strict, setStrict] = useState(true);
	// const [functional, setFunctional] = useState(false);
	// const [performance, setPerformance] = useState(false);

	return (
		<Card className={cn("flex flex-col items-center bg-card", className)}>
			<CardHeader className="pb-2 w-full text-left">
				<CardTitle>Saving settings</CardTitle>
				<CardDescription>Invest in crypto seamlessly.</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col gap-6 w-full">
				<div className="flex justify-between items-start">
					<Label
						className="flex flex-col items-start gap-[0.5rem] cursor-pointer select-none"
						htmlFor="byTransaction"
					>
						<span className="font-medium text-white">DCA on spending</span>
						<div className="text-muted-foreground text-sm font-light leading-[1.2rem]">
							Round up every card expense.
						</div>
					</Label>
					<Switch id="byTransaction" defaultChecked />
				</div>
				<div className="flex justify-between items-start">
					<Label
						className="flex flex-col items-start gap-[0.5rem] cursor-pointer select-none"
						htmlFor="byTime"
					>
						<span className="font-medium text-white">Scheduled DCA</span>
						<div className="text-muted-foreground text-sm font-light leading-[1.2rem]">
							Buy X of Y every Z day/week/month.
						</div>
					</Label>
					<Switch id="byTime" defaultChecked />
				</div>
				<Button
				// className="py-3 mt-2 w-full text-lg font-medium text-white rounded-lg border transition border-white/10 bg-black/30 hover:bg-black/40"
				>
					Save preferences
				</Button>
			</CardContent>
		</Card>
	);
}
