import { useQuery } from "@tanstack/react-query";
import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import userApi from "@/types/user/userApi";
import query from "@/Utils/request/query";

interface FacilityOption {
  id: string;
  name: string;
}

interface FacilitySelectorProps {
  value: string;
  onSelect: (facilityId: string) => void;
}

export default function FacilitySelector({
  value,
  onSelect,
}: FacilitySelectorProps) {
  const [open, setOpen] = useState(false);

  const {
    data: facilities = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["currentUser", "facilities"],
    queryFn: query(userApi.currentUser),
    select: (data: { facilities?: FacilityOption[] }) => data.facilities ?? [],
  });

  const selectedName = facilities.find((f) => f.id === value)?.name;

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">
        Select Facility
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={isLoading}
            className="flex h-9 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-xs disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className={value ? "text-gray-950" : "text-gray-500"}>
              {isLoading
                ? "Loading facilities..."
                : (selectedName ?? "Select a facility")}
            </span>
            <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Search facilities..."
              className="outline-hidden border-none ring-0 shadow-none"
              autoFocus
            />
            <CommandList>
              <CommandEmpty>No facilities found.</CommandEmpty>
              <CommandGroup>
                {facilities.map((facility) => (
                  <CommandItem
                    key={facility.id}
                    value={facility.name}
                    onSelect={() => {
                      onSelect(facility.id);
                      setOpen(false);
                    }}
                    className="cursor-pointer"
                  >
                    {facility.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {isError && (
        <p className="text-sm text-red-600">Unable to load facilities</p>
      )}
    </div>
  );
}
