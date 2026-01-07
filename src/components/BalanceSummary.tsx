import { Balance, Member, getCurrencySymbol } from '@/types/expense';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

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
    <div className="space-y-3">
      <h3 className="font-display font-semibold text-lg">Who Owes Whom</h3>
      <div className="space-y-2">
        {balances.map((balance, index) => (
          <div
            key={`${balance.from}-${balance.to}-${index}`}
            className="p-4 rounded-xl border bg-card shadow-card animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="font-medium text-owes truncate">
                    {getMemberName(balance.from)}
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="font-medium text-owed truncate">
                    {getMemberName(balance.to)}
                  </span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gradient-to-r from-owes/10 to-owed/10 font-display font-bold text-lg">
                  <span className="text-owes">{currencySymbol}</span>
                  <span className="text-foreground">{balance.amount.toFixed(2)}</span>
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {getMemberName(balance.from)} owes {getMemberName(balance.to)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
