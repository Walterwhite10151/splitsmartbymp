import { useState } from 'react';
import { useExpenseManager } from '@/hooks/useExpenseManager';
import { Button } from '@/components/ui/button';
import { CreateGroupModal } from '@/components/CreateGroupModal';
import { GroupCard } from '@/components/GroupCard';
import { GroupPage } from '@/pages/GroupPage';
import { EmptyState } from '@/components/EmptyState';
import { Plus, Wallet, Users, Sparkles, UserPlus } from 'lucide-react';

const Logo = () => (
  <h1 className="font-display font-bold text-3xl md:text-4xl tracking-tight">
    <span className="text-owes inline-block animate-glow hover:scale-110 transition-transform duration-300">Smart</span>
    <span className="text-owed inline-block animate-bounce-subtle hover:scale-110 transition-transform duration-300">Split</span>
  </h1>
);

const Index = () => {
  const {
    groups,
    currentGroup,
    currentGroupId,
    setCurrentGroupId,
    createGroup,
    deleteGroup,
    addMember,
    removeMember,
    addExpense,
    deleteExpense,
    calculateBalances,
  } = useExpenseManager();

  const [showCreateGroup, setShowCreateGroup] = useState(false);

  // Show group page if a group is selected
  if (currentGroup) {
    const balances = calculateBalances(currentGroup);
    return (
      <GroupPage
        group={currentGroup}
        balances={balances}
        onBack={() => setCurrentGroupId(null)}
        onAddMember={(name) => addMember(currentGroup.id, name)}
        onRemoveMember={(memberId) => removeMember(currentGroup.id, memberId)}
        onAddExpense={(expense) => addExpense(currentGroup.id, expense)}
        onDeleteExpense={(expenseId) => deleteExpense(currentGroup.id, expenseId)}
      />
    );
  }

  // Landing page
  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation with Logo */}
      <nav className="sticky top-0 z-20 bg-background/80 backdrop-blur-lg border-b">
        <div className="container max-w-4xl py-4 flex items-center justify-center">
          <Logo />
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-owes/5 via-owed/5 to-background" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-owed/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-owes/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />
        
        <div className="container max-w-4xl relative py-12 md:py-20">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-owed/10 text-owed text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              Simple & Smart Expense Splitting
            </div>
            
            <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight">
              Split Expenses
              <span className="block text-owed">Without the Drama</span>
            </h2>
            
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Track shared expenses with friends, roommates, or travel buddies. 
              No sign-up required. Just create a group and start splitting.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button size="lg" onClick={() => setShowCreateGroup(true)} className="gap-2 h-12 px-8 text-base">
                <Plus className="h-5 w-5" />
                Create New Group
              </Button>
            </div>
            
            <div className="flex items-center justify-center gap-8 pt-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-owed" />
                <span>No Sign-up</span>
              </div>
              <div className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-owed" />
                <span>Add Members Easily</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-owed" />
                <span>Free Forever</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Groups Section */}
      <main className="container max-w-4xl py-12">
        {groups.length === 0 ? (
          <EmptyState
            icon={<Users className="h-12 w-12 text-muted-foreground" />}
            title="No Groups Yet"
            description="Create your first group to start tracking shared expenses with friends, family, or roommates. You can add members after creating a group."
            action={
              <Button onClick={() => setShowCreateGroup(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Your First Group
              </Button>
            }
          />
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold text-2xl">Your Groups</h2>
              <Button onClick={() => setShowCreateGroup(true)} variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                New Group
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {groups.map(group => (
                <GroupCard
                  key={group.id}
                  group={group}
                  onSelect={() => setCurrentGroupId(group.id)}
                  onDelete={() => deleteGroup(group.id)}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container max-w-4xl text-center text-sm text-muted-foreground">
          <p>Your data is stored locally in your browser. No servers, no accounts, 100% private.</p>
        </div>
      </footer>

      <CreateGroupModal
        open={showCreateGroup}
        onClose={() => setShowCreateGroup(false)}
        onCreate={createGroup}
      />
    </div>
  );
};

export default Index;
