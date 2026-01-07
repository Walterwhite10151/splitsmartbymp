import { Member } from '@/types/expense';
import { Button } from '@/components/ui/button';
import { X, User } from 'lucide-react';

interface MembersListProps {
  members: Member[];
  onRemove: (memberId: string) => void;
}

export const MembersList = ({ members, onRemove }: MembersListProps) => {
  if (members.length === 0) {
    return (
      <div className="p-6 rounded-xl border border-dashed bg-muted/30 text-center">
        <User className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">
          No members yet. Add someone to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {members.map((member, index) => (
        <div
          key={member.id}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-secondary text-secondary-foreground animate-scale-in"
          style={{ animationDelay: `${index * 30}ms` }}
        >
          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-xs font-semibold text-primary">
              {member.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="font-medium text-sm">{member.name}</span>
          <button
            onClick={() => onRemove(member.id)}
            className="p-0.5 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
