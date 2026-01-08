import { useState } from 'react';
import { Group, Expense, Balance } from '@/types/expense';
import { getCurrencySymbol } from '@/types/expense';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AddMemberModal } from '@/components/AddMemberModal';
import { AddExpenseModal } from '@/components/AddExpenseModal';
import { ExpenseCard } from '@/components/ExpenseCard';
import { BalanceSummary } from '@/components/BalanceSummary';
import { MembersList } from '@/components/MembersList';
import { EmptyState } from '@/components/EmptyState';
import { ArrowLeft, UserPlus, Receipt, Users, Calculator, Wallet } from 'lucide-react';

interface GroupPageProps {
  group: Group;
  balances: Balance[];
  onBack: () => void;
  onAddMember: (name: string) => void;
  onRemoveMember: (memberId: string) => void;
  onAddExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  onDeleteExpense: (expenseId: string) => void;
}

export const GroupPage = ({
  group,
  balances,
  onBack,
  onAddMember,
  onRemoveMember,
  onAddExpense,
  onDeleteExpense,
}: GroupPageProps) => {
  const [showAddMember, setShowAddMember] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);

  const currencySymbol = getCurrencySymbol(group.currency);
  const totalExpenses = group.expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b">
        <div className="container max-w-4xl py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1 min-w-0 text-center">
              <h1 className="font-display font-bold text-2xl">
                <span className="text-owes animate-pulse inline-block hover:scale-110 transition-transform duration-300">Smart</span>
                <span className="text-owed animate-pulse inline-block hover:scale-110 transition-transform duration-300" style={{ animationDelay: '0.5s' }}>Split</span>
              </h1>
            </div>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>
          <div className="mt-3 text-center">
            <p className="font-display font-semibold text-lg">{group.name}</p>
            <p className="text-sm text-muted-foreground">
              {group.members.length} members · {group.currency}
            </p>
          </div>
        </div>
      </header>

      <main className="container max-w-4xl py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border bg-card shadow-card">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-primary/10">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Spent</p>
                <p className="font-display font-bold text-xl">
                  {currencySymbol}{totalExpenses.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-xl border bg-card shadow-card">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-accent">
                <Calculator className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Settlements</p>
                <p className="font-display font-bold text-xl">
                  {balances.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Members Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Members
            </h2>
            <Button variant="outline" size="sm" onClick={() => setShowAddMember(true)} className="gap-2">
              <UserPlus className="h-4 w-4" />
              Add
            </Button>
          </div>
          <MembersList members={group.members} onRemove={onRemoveMember} />
        </section>

        {/* Tabs for Expenses and Balances */}
        <Tabs defaultValue="expenses" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="expenses" className="gap-2">
              <Receipt className="h-4 w-4" />
              Expenses
            </TabsTrigger>
            <TabsTrigger value="balances" className="gap-2">
              <Calculator className="h-4 w-4" />
              Balances
            </TabsTrigger>
          </TabsList>

          <TabsContent value="expenses" className="space-y-4">
            <div className="flex justify-end">
              <Button
                onClick={() => setShowAddExpense(true)}
                disabled={group.members.length < 2}
                className="gap-2"
              >
                <Receipt className="h-4 w-4" />
                Add Expense
              </Button>
            </div>

            {group.members.length < 2 && (
              <div className="p-4 rounded-lg bg-warning/10 border border-warning/20 text-center">
                <p className="text-sm text-warning font-medium">
                  Add at least 2 members to start tracking expenses
                </p>
              </div>
            )}

            {group.expenses.length === 0 ? (
              <EmptyState
                icon={<Receipt className="h-10 w-10 text-muted-foreground" />}
                title="No Expenses Yet"
                description="Start adding expenses to track who owes whom"
              />
            ) : (
              <div className="space-y-3">
                {[...group.expenses].reverse().map(expense => (
                  <ExpenseCard
                    key={expense.id}
                    expense={expense}
                    members={group.members}
                    currency={group.currency}
                    onDelete={() => onDeleteExpense(expense.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="balances">
            <BalanceSummary
              balances={balances}
              members={group.members}
              currency={group.currency}
            />
          </TabsContent>
        </Tabs>
      </main>

      <AddMemberModal
        open={showAddMember}
        onClose={() => setShowAddMember(false)}
        onAdd={onAddMember}
      />

      <AddExpenseModal
        open={showAddExpense}
        onClose={() => setShowAddExpense(false)}
        members={group.members}
        currency={group.currency}
        onAdd={onAddExpense}
      />
    </div>
  );
};
