import { cn } from "@/lib/utils";

const STYLES: Record<string, string> = {
  Available: "bg-success text-success-foreground",
  Free: "bg-success text-success-foreground",
  Approved: "bg-success text-success-foreground",
  Accepted: "bg-success text-success-foreground",
  Issued: "bg-warning text-warning-foreground",
  Busy: "bg-warning text-warning-foreground",
  Pending: "bg-info text-info-foreground",
  Rejected: "bg-destructive/10 text-destructive",
  Declined: "bg-destructive/10 text-destructive",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
        STYLES[status] ?? "bg-muted text-muted-foreground",
        className,
      )}
    >
      {status}
    </span>
  );
}
