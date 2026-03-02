import {
  Check,
  ChevronDown,
  ChevronRight,
  Home,
  Search,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface FacilityOrganizationParent {
  id: string;
  name: string;
  parent?: FacilityOrganizationParent;
}

export interface FacilityOrganizationRead {
  id: string;
  name: string;
  description?: string;
  parent?: FacilityOrganizationParent;
  has_children?: boolean;
}

interface DepartmentSelectProps {
  organizations: FacilityOrganizationRead[];
  value: FacilityOrganizationRead | null;
  onChange: (org: FacilityOrganizationRead | null) => void;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

const ROOT_PARENT = "__root__";

const buildOrganizationIndex = (organizations: FacilityOrganizationRead[]) => {
  const byParentId = new Map<string, FacilityOrganizationRead[]>();

  organizations.forEach((org) => {
    const parentId = org.parent?.id ?? ROOT_PARENT;
    const bucket = byParentId.get(parentId) ?? [];
    bucket.push(org);
    byParentId.set(parentId, bucket);
  });

  byParentId.forEach((bucket) => {
    bucket.sort((a, b) => a.name.localeCompare(b.name));
  });

  return { byParentId };
};

export default function DepartmentSelect({
  organizations,
  value,
  onChange,
  isLoading = false,
  disabled = false,
  placeholder = "Select department",
}: DepartmentSelectProps) {
  const [open, setOpen] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState<FacilityOrganizationRead[]>(
    [],
  );
  const [currentParentId, setCurrentParentId] = useState<string | undefined>(
    undefined,
  );
  const [searchQuery, setSearchQuery] = useState("");

  const { byParentId } = useMemo(
    () => buildOrganizationIndex(organizations),
    [organizations],
  );

  const currentLevel = byParentId.get(currentParentId ?? ROOT_PARENT) ?? [];
  const filteredDepartments = useMemo(() => {
    if (!searchQuery.trim()) return currentLevel;

    return currentLevel.filter((org) =>
      org.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [currentLevel, searchQuery]);

  const resetSearch = () => setSearchQuery("");

  useEffect(() => {
    if (open && value?.parent) {
      const breadcrumbChain: FacilityOrganizationRead[] = [];
      let current: FacilityOrganizationRead | null = value.parent;

      while (current?.id) {
        breadcrumbChain.unshift({ ...current });
        current = current.parent as FacilityOrganizationRead | null;
      }

      setBreadcrumbs(breadcrumbChain);
      setCurrentParentId(value.parent?.id || undefined);
    } else {
      setBreadcrumbs([]);
      setCurrentParentId(undefined);
    }
  }, [open, value]);

  const handleSelect = (org: FacilityOrganizationRead) => {
    if (org.has_children) {
      setBreadcrumbs((prev) => [...prev, org]);
      setCurrentParentId(org.id);
      onChange(org);
      resetSearch();
    } else {
      onChange(org);
      setOpen(false);
      resetSearch();
    }
  };

  const handleBreadcrumbClick = (index: number) => {
    const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
    setBreadcrumbs(newBreadcrumbs);
    setCurrentParentId(newBreadcrumbs[index].id);
    resetSearch();
  };

  const handleBackToRoot = () => {
    setBreadcrumbs([]);
    setCurrentParentId(undefined);
    resetSearch();
  };

  const handleClearSelection = () => {
    onChange(null);
    setBreadcrumbs([]);
    setCurrentParentId(undefined);
    resetSearch();
  };

  const getDisplayValue = () => {
    if (!value) {
      return <span className="text-gray-500">{placeholder}</span>;
    }

    return (
      <div className="flex items-center gap-2">
        <span className="truncate">{value.name}</span>
      </div>
    );
  };

  const getCurrentLevelTitle = () => {
    if (breadcrumbs.length === 0) return "Root";
    return breadcrumbs[breadcrumbs.length - 1]?.name || "Root";
  };

  return (
    <Popover
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) {
          resetSearch();
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "justify-between h-10 min-h-10 px-3 py-2",
            "hover:bg-gray-50 hover:text-gray-900",
            "focus:ring-2 focus:ring-gray-300 focus:ring-offset-2",
            "transition-all duration-200",
            disabled && "opacity-50 cursor-not-allowed",
          )}
          disabled={disabled}
        >
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {getDisplayValue()}
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 opacity-50 transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] min-w-[300px] max-w-[420px] p-0 shadow-lg border-0"
        align="start"
        sideOffset={4}
        onWheel={(event) => event.stopPropagation()}
      >
        <div className="flex flex-col">
          <div className="px-4 py-3 border-b bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-600">
                  {getCurrentLevelTitle()}
                </span>
                {breadcrumbs.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    Level {breadcrumbs.length + 1}
                  </Badge>
                )}
              </div>
              {value && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearSelection}
                  className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {breadcrumbs.length > 0 && (
            <div className="px-4 py-2 border-b bg-gray-100">
              <div className="flex items-center gap-1 text-xs">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBackToRoot}
                  className="h-6 px-2 text-xs hover:bg-white"
                >
                  <Home className="h-3 w-3 mr-1" />
                  Root
                </Button>
                {breadcrumbs.map((breadcrumb, index) => (
                  <div key={breadcrumb.id} className="flex items-center">
                    <ChevronRight className="h-3 w-3 mx-1 text-gray-500" />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBreadcrumbClick(index)}
                      className="h-6 px-2 text-xs hover:bg-white"
                    >
                      {breadcrumb.name}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Command className="border-0">
            <div className="px-3 py-2 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <CommandInput
                  placeholder="Search departments"
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                  className="pl-9 h-9 border-0 focus:ring-0"
                />
              </div>
            </div>

            <CommandList className="max-h-[300px]">
              <CommandEmpty>
                {isLoading ? (
                  <div className="p-6 space-y-3">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Skeleton className="h-4 w-4 rounded" />
                        <div className="space-y-1 flex-1">
                          <Skeleton className="h-4 w-3/4" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : searchQuery ? (
                  <div className="p-6 text-center text-gray-500">
                    <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <div className="text-sm">No department found</div>
                  </div>
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    <div className="text-sm">No departments found</div>
                  </div>
                )}
              </CommandEmpty>

              <CommandGroup>
                {filteredDepartments.map((org) => (
                  <CommandItem
                    key={org.id}
                    value={org.name}
                    onSelect={() => handleSelect(org)}
                    className="flex items-center justify-between px-3 py-3 cursor-pointer hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150 border-b border-gray-200 last:border-b-0"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-sm truncate">
                          {org.name}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {value?.id === org.id && (
                        <Check className="h-4 w-4 text-gray-700" />
                      )}
                      {org.has_children && (
                        <ChevronRight className="h-4 w-4 text-gray-500" />
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </PopoverContent>
    </Popover>
  );
}
