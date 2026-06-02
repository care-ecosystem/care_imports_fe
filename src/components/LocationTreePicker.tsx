import {
  Building2,
  Check,
  ChevronDown,
  ChevronRight,
  Home,
  MapPin,
  Search,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { request } from "@/apis/request";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
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
import locationApi from "@/types/location/locationApi";

interface LocationNode {
  id: string;
  name: string;
  form: string;
  has_children: boolean;
}

interface LocationBreadcrumb {
  id: string;
  name: string;
}

interface LocationTreePickerProps {
  facilityId: string;
  value: string;
  valueName?: string;
  onValueChange: (id: string, name: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const FORM_ICONS: Record<string, typeof Building2> = {
  bd: MapPin,
  wa: Building2,
  lvl: Building2,
  bu: Building2,
  si: MapPin,
  wi: Building2,
  co: Building2,
  ro: Home,
  ve: MapPin,
  ho: Home,
  ca: MapPin,
  rd: MapPin,
  area: MapPin,
  jdn: MapPin,
  vi: MapPin,
};

function getLocationIcon(form: string) {
  return FORM_ICONS[form] ?? MapPin;
}

export function LocationTreePicker({
  facilityId,
  value,
  valueName,
  onValueChange,
  placeholder = "Select location",
  disabled = false,
  className,
}: LocationTreePickerProps) {
  const [open, setOpen] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState<LocationBreadcrumb[]>([]);
  const [currentParent, setCurrentParent] = useState<string | undefined>(
    undefined,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [locations, setLocations] = useState<LocationNode[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLocations = useCallback(
    async (parent?: string, search?: string) => {
      setLoading(true);
      try {
        const response = await request(locationApi.list, {
          pathParams: { facility_id: facilityId },
          queryParams: {
            parent: parent ?? undefined,
            name: search || undefined,
            mode: "kind",
            ordering: "sort_index",
            status: "active",
            limit: 100,
            ...(parent ? {} : { mine: true }),
          },
        });
        setLocations(
          response.results.map((l) => ({
            id: l.id,
            name: l.name,
            form: l.form,
            has_children: l.has_children,
          })),
        );
      } catch {
        setLocations([]);
      } finally {
        setLoading(false);
      }
    },
    [facilityId],
  );

  // Fetch locations when popover opens or navigation changes
  useEffect(() => {
    if (!open) return;
    fetchLocations(currentParent, searchQuery);
  }, [open, currentParent, searchQuery, fetchLocations]);

  const filteredLocations = useMemo(() => {
    if (!searchQuery.trim()) return locations;
    return locations.filter((l) =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [locations, searchQuery]);

  const resetNavigation = () => {
    setBreadcrumbs([]);
    setCurrentParent(undefined);
    setSearchQuery("");
  };

  const handleLocationSelect = (location: LocationNode) => {
    if (location.has_children) {
      setBreadcrumbs((prev) => [
        ...prev,
        { id: location.id, name: location.name },
      ]);
      setCurrentParent(location.id);
      setSearchQuery("");
      // Also select this location as the current value
      onValueChange(location.id, location.name);
    } else {
      onValueChange(location.id, location.name);
      setOpen(false);
      setSearchQuery("");
    }
  };

  const handleBreadcrumbClick = (index: number) => {
    const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
    setBreadcrumbs(newBreadcrumbs);
    setCurrentParent(newBreadcrumbs[index].id);
    setSearchQuery("");
  };

  const handleBackToRoot = () => {
    resetNavigation();
  };

  const handleClear = () => {
    onValueChange("", "");
    resetNavigation();
  };

  const currentLevelTitle =
    breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1].name : "Root";

  const displayValue = valueName || undefined;

  return (
    <Popover
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) {
          setSearchQuery("");
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
            "transition-all duration-200",
            disabled && "opacity-50 cursor-not-allowed",
            className,
          )}
          disabled={disabled}
        >
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {displayValue ? (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <span className="truncate">{displayValue}</span>
              </div>
            ) : (
              <span className="text-gray-500">{placeholder}</span>
            )}
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
        onWheel={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col">
          {/* Header */}
          <div className="px-4 py-3 border-b bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-600">
                  {currentLevelTitle}
                </span>
                {breadcrumbs.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    Level {breadcrumbs.length + 1}
                  </Badge>
                )}
              </div>
              {value && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700 inline-flex items-center rounded hover:bg-gray-200 transition-colors"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <div className="px-4 py-2 border-b bg-gray-100">
              <div className="flex items-center gap-1 text-xs flex-wrap">
                <button
                  type="button"
                  onClick={handleBackToRoot}
                  className="h-6 px-2 text-xs inline-flex items-center rounded hover:bg-white transition-colors"
                >
                  <Home className="h-3 w-3 mr-1" />
                  Root
                </button>
                {breadcrumbs.map((breadcrumb, index) => (
                  <div key={breadcrumb.id} className="flex items-center">
                    <ChevronRight className="h-3 w-3 mx-1 text-gray-500" />
                    <button
                      type="button"
                      onClick={() => handleBreadcrumbClick(index)}
                      className="h-6 px-2 text-xs inline-flex items-center rounded hover:bg-white transition-colors"
                    >
                      {breadcrumb.name}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Command className="border-0" shouldFilter={false}>
            <div className="px-3 py-2 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search locations…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 h-9 text-sm bg-transparent outline-none placeholder:text-gray-500"
                />
              </div>
            </div>

            <CommandList className="max-h-[300px]">
              <CommandEmpty>
                {loading ? (
                  <div className="p-6 space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Skeleton className="h-4 w-4 rounded" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    ))}
                  </div>
                ) : searchQuery ? (
                  <div className="p-6 text-center text-gray-500">
                    <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <div className="text-sm">No locations found</div>
                  </div>
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <div className="text-sm">No locations available</div>
                  </div>
                )}
              </CommandEmpty>

              <CommandGroup>
                {filteredLocations.map((location) => {
                  const Icon = getLocationIcon(location.form);

                  return (
                    <CommandItem
                      key={location.id}
                      value={location.id}
                      onSelect={() => handleLocationSelect(location)}
                      className="flex items-center justify-between px-3 py-3 cursor-pointer hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150 border-b border-gray-200 last:border-b-0"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="flex-shrink-0">
                          <Icon className="h-5 w-5 text-gray-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm truncate">
                            {location.name}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {value === location.id && (
                          <Check className="h-4 w-4 text-gray-700" />
                        )}
                        {location.has_children && (
                          <ChevronRight className="h-4 w-4 text-gray-500" />
                        )}
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </PopoverContent>
    </Popover>
  );
}
