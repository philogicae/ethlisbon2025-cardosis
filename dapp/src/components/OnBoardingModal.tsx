import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { ContainerTextFlip } from "@/components/ui/animations/TextFlip";
import { useState } from "react";
import { Button } from "./ui/button";
import { BadgeCheck } from "lucide-react";

const statuses = [
  { text: "Preparing, please wait a few sec...", progress: 10, duration: 7500 },
  { text: "Creating safe account...", progress: 40, duration: 5000 },
  { text: "Setting roles...", progress: 65, duration: 7500 },
  { text: "Creating AAVE...", progress: 80, duration: 7500 },
  { text: "We’re all set!", progress: 100, duration: 2000 },
];

const OnBoardingModal = ({
  open,
  isDone,
}: {
  open: boolean;
  isDone: boolean;
}) => {
  const [statusIndex, setStatusIndex] = useState(0);
  const status = statuses[statusIndex];

  useEffect(() => {
    if (statusIndex >= statuses.length - 2) return;
    if (isDone) {
      setStatusIndex(statuses.length - 1);
      return;
    }
    const timeout = setTimeout(() => {
      setStatusIndex((i) => i + 1);
    }, status.duration);
    return () => clearTimeout(timeout);
  }, [status.duration, statusIndex, isDone]);

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hold on, we are preparing everything</DialogTitle>
          <DialogDescription>This action cannot be skipped.</DialogDescription>
        </DialogHeader>
        <div className="flex">
          <ContainerTextFlip
            words={[status.text]}
            className="text-card-foreground"
            interval={status.duration}
          />
          {isDone && <BadgeCheck size={42} />}
        </div>
        <Progress value={status.progress} />
        <Button
          className="mt-4 bg-foreground text-background hover:bg-accent"
          disabled={!isDone}
        >
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default OnBoardingModal;
