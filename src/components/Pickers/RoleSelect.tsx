import { Search } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface RoleRead {
  id: string;
  name: string;
  description?: string;
}

interface RoleSelectProps {
  roles: RoleRead[];
  value: string;
  onChange: (roleId: string) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

export default function RoleSelect({
  roles,
  value,
  onChange,
  searchQuery,
  onSearchChange,
  isLoading = false,
  placeholder = "Select a role",
  disabled = false,
}: RoleSelectProps) {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="w-full">
        <SelectValue
          placeholder={isLoading ? "Loading roles..." : placeholder}
        />
      </SelectTrigger>
      <SelectContent>
        <div className="border-b px-3 py-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search roles"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              className="w-full rounded-md border border-gray-200 py-2 pl-10 pr-3 text-sm"
            />
          </div>
        </div>
        {isLoading ? (
          <div className="p-3 text-sm text-gray-500">Loading roles...</div>
        ) : roles.length === 0 ? (
          <div className="p-3 text-sm text-gray-500">No roles found.</div>
        ) : (
          roles.map((role) => (
            <SelectItem key={role.id} value={role.id}>
              {role.name}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}
