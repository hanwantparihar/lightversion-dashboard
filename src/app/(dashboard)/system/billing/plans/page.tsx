"use client";

import { useState } from "react";
import { PlanCard } from "@/components/billing/plan-card";
import { PageStack } from "@/components";
import { billingPlans, currentSubscription } from "@/lib/billing-data";

export default function PlansPage() {
  const [selected, setSelected] = useState(currentSubscription.planId);

  return (
    <PageStack>
      <div className="mb-2 text-center">
        <h2 className="text-xl font-bold">Choose Your Plan</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Flexible pricing for teams of all sizes. Upgrade or downgrade anytime.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {billingPlans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            current={plan.id === currentSubscription.planId}
            onSelect={setSelected}
          />
        ))}
      </div>

      {selected !== currentSubscription.planId && (
        <p className="text-center text-sm text-muted-foreground">
          Selected plan:{" "}
          <span className="font-semibold text-foreground">
            {billingPlans.find((p) => p.id === selected)?.name}
          </span>
          . Wire checkout to Stripe or Razorpay in your backend.
        </p>
      )}
    </PageStack>
  );
}
