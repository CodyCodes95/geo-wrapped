import { InfoIcon, type LucideIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { useFlip } from "./_hooks/useFlip";
import { getCountryFlagEmoji } from "~/utils";
import { SkeletonCell } from "./SummaryCards";

type StatCardProps = {
  icon: LucideIcon | string;
  iconColor?: string;
  title: string;
  value: string | number | React.ReactNode;
  detailedContent?: React.ReactNode;
  loading?: boolean;
};

export const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  iconColor,
  title,
  value,
  detailedContent,
  loading,
}) => {
  const { isFlipped, flip } = useFlip();

  if (loading) {
    return (
      <div className="rounded-lg border p-4">
        <div className="flex items-center gap-2">
          {typeof Icon === "string" ? (
            <span className="text-2xl">{Icon}</span>
          ) : (
            <Icon className={`h-8 w-8 ${iconColor}`} />
          )}
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <div className="mt-2">
          <SkeletonCell className="h-8 w-24" />
        </div>
        {detailedContent && (
          <div className="mt-4 space-y-2">
            <SkeletonCell className="w-full" />
            <SkeletonCell className="w-full" />
            <SkeletonCell className="w-full" />
          </div>
        )}
      </div>
    );
  }

  return (
    <Card className="relative h-[200px] w-full [perspective:1000px]">
      <div
        className={`relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] ${
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* Front of the card */}
        <div className="absolute flex h-full w-full flex-col justify-between p-6 [backface-visibility:hidden]">
          <div className="flex w-full items-center justify-between">
            {typeof Icon === "string" ? (
              <span className="text-2xl">{Icon}</span>
            ) : (
              <Icon className={`h-8 w-8 ${iconColor}`} />
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={flip}
              className="h-8 w-8 rounded-full"
            >
              <InfoIcon className="h-8 w-8" />
            </Button>
          </div>
          <div className="flex flex-grow flex-col items-center justify-center text-center">
            <p className="font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
          </div>
        </div>

        {/* Back of the card */}
        <div className="absolute h-full w-full overflow-y-auto p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <Button
            variant="ghost"
            size="icon"
            onClick={flip}
            className="absolute right-2 top-2 h-8 w-8 rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Button>
          {detailedContent}
        </div>
      </div>
    </Card>
  );
};
