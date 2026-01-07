import { useState, useEffect, useCallback } from 'react';
import { Group, Expense, Member, Balance } from '@/types/expense';

const STORAGE_KEY = 'expense-splitter-groups';

const generateId = () => Math.random().toString(36).substr(2, 9);

const loadGroups = (): Group[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveGroups = (groups: Group[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
};

export const useExpenseManager = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [currentGroupId, setCurrentGroupId] = useState<string | null>(null);

  useEffect(() => {
    setGroups(loadGroups());
  }, []);

  useEffect(() => {
    if (groups.length > 0) {
      saveGroups(groups);
    }
  }, [groups]);

  const currentGroup = groups.find(g => g.id === currentGroupId) || null;

  const createGroup = useCallback((name: string, currency: string): Group => {
    const newGroup: Group = {
      id: generateId(),
      name,
      currency,
      members: [],
      expenses: [],
      createdAt: new Date().toISOString(),
    };
    setGroups(prev => {
      const updated = [...prev, newGroup];
      saveGroups(updated);
      return updated;
    });
    return newGroup;
  }, []);

  const deleteGroup = useCallback((groupId: string) => {
    setGroups(prev => {
      const updated = prev.filter(g => g.id !== groupId);
      saveGroups(updated);
      return updated;
    });
    if (currentGroupId === groupId) {
      setCurrentGroupId(null);
    }
  }, [currentGroupId]);

  const addMember = useCallback((groupId: string, name: string) => {
    const member: Member = { id: generateId(), name };
    setGroups(prev => {
      const updated = prev.map(g =>
        g.id === groupId ? { ...g, members: [...g.members, member] } : g
      );
      saveGroups(updated);
      return updated;
    });
  }, []);

  const removeMember = useCallback((groupId: string, memberId: string) => {
    setGroups(prev => {
      const updated = prev.map(g =>
        g.id === groupId
          ? {
              ...g,
              members: g.members.filter(m => m.id !== memberId),
              expenses: g.expenses.filter(
                e => e.paidBy !== memberId && !e.splitBetween.includes(memberId)
              ),
            }
          : g
      );
      saveGroups(updated);
      return updated;
    });
  }, []);

  const addExpense = useCallback((groupId: string, expense: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expense,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setGroups(prev => {
      const updated = prev.map(g =>
        g.id === groupId ? { ...g, expenses: [...g.expenses, newExpense] } : g
      );
      saveGroups(updated);
      return updated;
    });
  }, []);

  const deleteExpense = useCallback((groupId: string, expenseId: string) => {
    setGroups(prev => {
      const updated = prev.map(g =>
        g.id === groupId
          ? { ...g, expenses: g.expenses.filter(e => e.id !== expenseId) }
          : g
      );
      saveGroups(updated);
      return updated;
    });
  }, []);

  const calculateBalances = useCallback((group: Group): Balance[] => {
    const netBalances: Record<string, number> = {};

    // Initialize balances for all members
    group.members.forEach(m => {
      netBalances[m.id] = 0;
    });

    // Calculate net balance for each member
    group.expenses.forEach(expense => {
      const { amount, paidBy, splitBetween, splitType, splitAmounts } = expense;

      // Add amount to payer
      netBalances[paidBy] = (netBalances[paidBy] || 0) + amount;

      // Subtract split amounts from each member
      if (splitType === 'equal') {
        const splitAmount = amount / splitBetween.length;
        splitBetween.forEach(memberId => {
          netBalances[memberId] = (netBalances[memberId] || 0) - splitAmount;
        });
      } else if (splitAmounts) {
        Object.entries(splitAmounts).forEach(([memberId, splitAmount]) => {
          netBalances[memberId] = (netBalances[memberId] || 0) - splitAmount;
        });
      }
    });

    // Simplify debts
    const creditors: { id: string; amount: number }[] = [];
    const debtors: { id: string; amount: number }[] = [];

    Object.entries(netBalances).forEach(([id, amount]) => {
      if (amount > 0.01) {
        creditors.push({ id, amount });
      } else if (amount < -0.01) {
        debtors.push({ id, amount: Math.abs(amount) });
      }
    });

    // Sort by amount
    creditors.sort((a, b) => b.amount - a.amount);
    debtors.sort((a, b) => b.amount - a.amount);

    const settlements: Balance[] = [];

    let i = 0, j = 0;
    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];
      const settleAmount = Math.min(debtor.amount, creditor.amount);

      if (settleAmount > 0.01) {
        settlements.push({
          from: debtor.id,
          to: creditor.id,
          amount: Math.round(settleAmount * 100) / 100,
        });
      }

      debtor.amount -= settleAmount;
      creditor.amount -= settleAmount;

      if (debtor.amount < 0.01) i++;
      if (creditor.amount < 0.01) j++;
    }

    return settlements;
  }, []);

  return {
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
  };
};
