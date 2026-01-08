import { Balance, Member, getCurrencySymbol } from '@/types/expense';
import { CheckCircle2 } from 'lucide-react';
interface BalanceSummaryProps {
  balances: Balance[];
  members: Member[];
  currency: string;
}

export const BalanceSummary = ({ balances, members, currency }: BalanceSummaryProps) => {
  const currencySymbol = getCurrencySymbol(currency);
  const getMemberName = (id: string) => members.find(m => m.id === id)?.name || 'Unknown';

  if (balances.length === 0) {
    return (
      <div className="p-6 rounded-xl border bg-card text-center">
        <div className="inline-flex p-3 rounded-full bg-success/10 mb-3">
          <CheckCircle2 className="h-8 w-8 text-success" />
        </div>
        <h3 className="font-display font-semibold text-lg">All Settled Up!</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Everyone is even. No payments needed.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-display font-semibold text-lg">Settlements</h3>
      <div className="space-y-3">
        {balances.map((balance, index) => (
          <div
            key={`${balance.from}-${balance.to}-${index}`}
            className="p-4 rounded-xl border bg-card shadow-card animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <p className="text-base">
              <span className="font-semibold text-owes">{getMemberName(balance.from)}</span>
              <span className="text-muted-foreground"> owes </span>
              <span className="font-semibold text-owed">{getMemberName(balance.to)}</span>
              <span className="text-muted-foreground"> → </span>
              <span className="font-bold text-primary text-lg">
                {currencySymbol}{balance.amount.toFixed(2)}
              </span>
            </p>
          </div>
        ))}
      </div>
      <div className="pt-2 border-t border-border">
        <p className="text-sm text-muted-foreground">
          Total settlements: <span className="font-semibold text-foreground">{balances.length}</span>
        </p>
      </div>
    </div>
  );
};
