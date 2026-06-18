import { StatCard, type StatCardProps } from "./stat-card";
import { PageGrid } from "@/components/common/page-layout";

type StatsGridProps = {
  stats: StatCardProps[];
  cols?: 2 | 3 | 4;
};

export function StatsGrid({ stats, cols = 4 }: StatsGridProps) {
  return (
    <PageGrid cols={cols}>
      {stats.map((stat, i) => (
        <StatCard key={i} {...stat} />
      ))}
    </PageGrid>
  );
}
