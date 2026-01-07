import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Member, getCurrencySymbol } from '@/types/expense';
import { Receipt, AlertCircle } from 'lucide-react';

interface AddExpenseModalProps {
  open: boolean;
  onClose: () => void;
  members: Member[];
  currency: string;
  onAdd: (expense: {
    description: string;
    amount: number;
    paidBy: string;
    splitBetween: string[];
    splitType: 'equal' | 'custom';
    splitAmounts?: Record<string, number>;
  }) => void;
}

export const AddExpenseModal = ({ open, onClose, members, currency, onAdd }: AddExpenseModalProps) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [splitType, setSplitType] = useState<'equal' | 'custom'>('equal');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [customAmounts, setCustomAmounts] = useState<Record<string, string>>({});

  const currencySymbol = getCurrencySymbol(currency);

  useEffect(() => {
    if (members.length > 0 && !paidBy) {
      setPaidBy(members[0].id);
      setSelectedMembers(members.map(m => m.id));
    }
  }, [members, paidBy]);

  const handleMemberToggle = (memberId: string) => {
    setSelectedMembers(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleCustomAmountChange = (memberId: string, value: string) => {
    setCustomAmounts(prev => ({ ...prev, [memberId]: value }));
  };

  const totalCustomAmount = selectedMembers.reduce((sum, id) => {
    return sum + (parseFloat(customAmounts[id] || '0') || 0);
  }, 0);

  const amountNum = parseFloat(amount) || 0;
  const isCustomValid = splitType === 'equal' || Math.abs(totalCustomAmount - amountNum) < 0.01;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !amount || !paidBy || selectedMembers.length === 0) return;
    if (!isCustomValid) return;

    const expense = {
      description: description.trim(),
      amount: parseFloat(amount),
      paidBy,
      splitBetween: selectedMembers,
      splitType,
      ...(splitType === 'custom' && {
        splitAmounts: selectedMembers.reduce((acc, id) => {
          acc[id] = parseFloat(customAmounts[id] || '0') || 0;
          return acc;
        }, {} as Record<string, number>),
      }),
    };

    onAdd(expense);
    handleClose();
  };

  const handleClose = () => {
    setDescription('');
    setAmount('');
    setPaidBy(members[0]?.id || '');
    setSplitType('equal');
    setSelectedMembers(members.map(m => m.id));
    setCustomAmounts({});
    onClose();
  };

  const equalSplitAmount = selectedMembers.length > 0 ? amountNum / selectedMembers.length : 0;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display text-xl">
            <div className="p-2 rounded-lg bg-primary/10">
              <Receipt className="w-5 h-5 text-primary" />
            </div>
            Add Expense
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="e.g., Dinner, Uber, Groceries"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-11"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {currencySymbol}
                </span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="h-11 pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paid-by">Paid By</Label>
              <Select value={paidBy} onValueChange={setPaidBy}>
                <SelectTrigger id="paid-by" className="h-11">
                  <SelectValue placeholder="Select member" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Split Type</Label>
            <Tabs value={splitType} onValueChange={(v) => setSplitType(v as 'equal' | 'custom')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="equal">Equal Split</TabsTrigger>
                <TabsTrigger value="custom">Custom Split</TabsTrigger>
              </TabsList>

              <TabsContent value="equal" className="space-y-3 pt-3">
                <p className="text-sm text-muted-foreground">
                  Split {currencySymbol}{amountNum.toFixed(2)} equally among selected members
                </p>
                <div className="space-y-2">
                  {members.map((member) => (
                    <label
                      key={member.id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={selectedMembers.includes(member.id)}
                          onCheckedChange={() => handleMemberToggle(member.id)}
                        />
                        <span className="font-medium">{member.name}</span>
                      </div>
                      {selectedMembers.includes(member.id) && (
                        <span className="text-sm text-muted-foreground">
                          {currencySymbol}{equalSplitAmount.toFixed(2)}
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="custom" className="space-y-3 pt-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Enter custom amounts for each member
                  </p>
                  {!isCustomValid && amountNum > 0 && (
                    <div className="flex items-center gap-1 text-xs text-destructive">
                      <AlertCircle className="w-3 h-3" />
                      <span>
                        {totalCustomAmount > amountNum ? 'Exceeds' : 'Short by'} {currencySymbol}
                        {Math.abs(totalCustomAmount - amountNum).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 p-3 rounded-lg border bg-card"
                    >
                      <Checkbox
                        checked={selectedMembers.includes(member.id)}
                        onCheckedChange={() => handleMemberToggle(member.id)}
                      />
                      <span className="font-medium flex-1">{member.name}</span>
                      {selectedMembers.includes(member.id) && (
                        <div className="relative w-28">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                            {currencySymbol}
                          </span>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            value={customAmounts[member.id] || ''}
                            onChange={(e) => handleCustomAmountChange(member.id, e.target.value)}
                            className="h-9 pl-7 text-sm"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!description.trim() || !amount || !paidBy || selectedMembers.length === 0 || !isCustomValid}
              className="flex-1"
            >
              Add Expense
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
