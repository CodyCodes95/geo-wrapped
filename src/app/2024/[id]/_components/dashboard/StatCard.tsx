import { type LucideIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { useFlip } from "./_hooks/useFlip";

interface StatCardProps {
  icon: LucideIcon;
  iconColor: string;
  title: string;
  value: string | number;
  detailedContent: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  iconColor,
  title,
  value,
  detailedContent,
}) => {
  const { isFlipped, flip } = useFlip();

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
            <Icon className={`h-8 w-8 ${iconColor}`} />
            <Button
              variant="ghost"
              size="icon"
              onClick={flip}
              className="h-8 w-8 rounded-full"
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
                  d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                />
              </svg>
            </Button>
          </div>
          <div className="flex flex-grow flex-col items-center justify-center text-center">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
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
