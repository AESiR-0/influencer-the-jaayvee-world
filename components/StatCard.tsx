import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Info } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  tooltip?: string;
}

export default function StatCard({
  title,
  value,
  description,
  icon,
  tooltip,
}: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted flex items-center gap-2">
          {title}
          {tooltip && (
            <span title={tooltip} className="inline-flex items-center text-muted hover:text-fg transition-colors">
              <Info className="h-4 w-4" />
            </span>
          )}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-fg">{value}</div>
        {description && (
          <p className="text-xs text-muted mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
