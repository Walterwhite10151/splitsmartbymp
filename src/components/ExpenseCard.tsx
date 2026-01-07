import { Expense, Member, getCurrencySymbol } from '@/types/expense';
import { Button } from '@/components/ui/button';
import { Trash2, Users } from 'lucide-react';

interface ExpenseCardProps {
  expense: Expense;
  members: Member[];
  currency: string;
  onDelete: () => void;
}

export const ExpenseCard = ({ expense, members, currency, onDelete }: ExpenseCardProps) => {
  const currencySymbol = getCurrencySymbol(currency);
  const payer = members.find(m => m.id === expense.paidBy);
  const splitMembers = expense.splitBetween.map(id => members.find(m => m.id === id)?.name).filter(Boolean);
  
  const getSplitAmount = (memberId: string) => {
    if (expense.splitType === 'equal') {
      return expense.amount / expense.splitBetween.length;
    }
    return expense.splitAmounts?.[memberId] || 0;
  };

  return (
    <div className="p-4 rounded-xl border bg-card shadow-card hover:shadow-soft transition-all duration-200 animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground truncate">{expense.description}</h4>
          <p className="text-sm text-muted-foreground mt-1">
            <span className="font-medium text-foreground">{payer?.name}</span> paid{' '}
            <span className="font-semibold text-primary">
              {currencySymbol}{expense.amount.toFixed(2)}
            </span>
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="mt-3 pt-3 border-t">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>
            Split {expense.splitType === 'equal' ? 'equally' : 'custom'} between{' '}
            {splitMembers.length} {splitMembers.length === 1 ? 'person' : 'people'}
          </span>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {expense.splitBetween.map(memberId => {
            const member = members.find(m => m.id === memberId);
            const amount = getSplitAmount(memberId);
            return (
              <span
                key={memberId}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground"
              >
                {member?.name}: {currencySymbol}{amount.toFixed(2)}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};
