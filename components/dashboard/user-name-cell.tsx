import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserNameCellProps {
  name: string;
  avatar?: string;
}

const getInitials = (value: string) =>
  value
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((chunk) => chunk[0]?.toUpperCase())
    .join("") || "NA";

export function UserNameCell({ name, avatar }: UserNameCellProps) {
  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-10 w-10 border border-[#c8d4e2]">
        <AvatarImage src={avatar} alt={name} />
        <AvatarFallback>{getInitials(name)}</AvatarFallback>
      </Avatar>
      <span className="font-medium text-[#334155]">{name || "-"}</span>
    </div>
  );
}
