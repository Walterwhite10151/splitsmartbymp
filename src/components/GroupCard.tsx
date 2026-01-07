import { Group, getCurrencySymbol } from '@/types/expense';
import { Button } from '@/components/ui/button';
import { Users, Receipt, Trash2, ArrowRight } from 'lucide-react';

interface GroupCardProps {
  group: Group;
  onSelect: () => void;
  onDelete: () => void;
}

export const GroupCard = ({ group, onSelect, onDelete }: GroupCardProps) => {
  const currencySymbol = getCurrencySymbol(group.currency);
  const totalExpenses = group.expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="group p-5 rounded-xl border bg-card shadow-card hover:shadow-elevated transition-all duration-300 animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-lg truncate">{group.name}</h3>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              {group.members.length} {group.members.length === 1 ? 'member' : 'members'}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Receipt className="h-4 w-4" />
              {group.expenses.length} {group.expenses.length === 1 ? 'expense' : 'expenses'}
            </span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="mt-4 pt-4 border-t flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Spent</p>
          <p className="font-display font-bold text-xl text-primary">
            {currencySymbol}{totalExpenses.toFixed(2)}
          </p>
        </div>
        <Button onClick={onSelect} className="gap-2">
          Open
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
