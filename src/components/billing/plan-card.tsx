import type { BillingPlan } from "@/lib/billing-data";
import { Check } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription, Badge } from "@/components/ui";
import { cn } from "@/lib/utils";

type PlanCardProps = {
  plan: BillingPlan;
  current?: boolean;
  onSelect?: (planId: string) => void;
};

export function PlanCard({ plan, current, onSelect }: PlanCardProps) {
  return (
    <Card
      className={cn(
        "relative flex flex-col",
        plan.popular && "border-primary shadow-md shadow-primary/10"
      )}
    >
      {/* {plan.popular && (
        <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2">
          Most Popular
        </Badge>
      )} */}
      <CardHeader>
        <CardTitle>{plan.name}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
        <div className="pt-2">
          <span className="text-3xl font-extrabold">${plan.price}</span>
          <span className="text-muted-foreground">/{plan.interval}</span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <ul className="mb-6 flex-1 space-y-2.5">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-sm">
              <Check size={16} className="mt-0.5 shrink-0 text-primary" />
              {feature}
            </li>
          ))}
        </ul>
        <Button
          className="w-full"
          variant={current ? "outline" : plan.popular ? "default" : "outline"}
          disabled={current}
          onClick={() => onSelect?.(plan.id)}
        >
          {current ? "Current Plan" : "Upgrade"}
        </Button>
      </CardContent>
    </Card>
  );
}
