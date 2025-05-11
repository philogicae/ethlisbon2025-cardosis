import React from "react";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "./ui/card";
import { LinkIcon, TrendingUpIcon } from "lucide-react";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

const NumberBlock = ({
	description,
	value,
	className,
	isLoading,
	address,
}: {
	description: string;
	value: number;
	className?: string;
	isLoading?: boolean;
	address?: string;
}) => {
	return (
		<Card className={cn(className, "gap-2")}>
			<CardHeader className="relative">
				<CardDescription>{description}</CardDescription>
				<CardTitle
					className={cn(
						"text-3xl font-black",
						isLoading && "animate-pulse blur-md select-none",
					)}
				>
					€{value}
				</CardTitle>
				<div className="absolute top-4 right-4">
					<Badge
						variant="outline"
						className={cn(
							isLoading && "animate-pulse blur-md select-none",
							"flex gap-1 rounded-lg text-xs",
						)}
					>
						<TrendingUpIcon className="size-3" />
						+12.5%
					</Badge>
				</div>
			</CardHeader>
			<CardFooter
				className={cn(
					"flex-col items-start gap-1 text-sm",
					isLoading && "animate-pulse blur-md select-none",
				)}
			>
				<div className="flex gap-2 font-medium line-clamp-1">
					Safe contract address
					<LinkIcon className="pt-1 size-4" />
				</div>
				<div
					className={cn(
						"text-muted-foreground truncate max-w-full text-xs",
						isLoading && "animate-pulse blur-md select-none",
					)}
				>
					{address}
				</div>
			</CardFooter>
		</Card>
	);
};

export default NumberBlock;
