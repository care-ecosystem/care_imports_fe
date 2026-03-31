import React, { useEffect, useState } from "react";

import { request } from "@/apis/request";
import { NavTabs } from "@/components/ui/nav-tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type ExportTabId =
  | "users"
  | "departments"
  | "locations"
  | "charge-item-definition"
  | "product-knowledge"
  | "product"
  | "observation-definition"
  | "activity-definition"
  | "specimen-definitions";

interface ExportsLayoutProps {
  activeTab: ExportTabId;
  children: React.ReactNode;
}

interface FacilityOption {
  id: string;
  name: string;
}

interface CurrentUserResponse {
  facilities?: FacilityOption[];
}

const getTabConfig = () => [
  {
    id: "users" as const,
    label: "Users",
    path: "/admin/export/users",
  },
  {
    id: "departments" as const,
    label: "Departments",
    path: "/admin/export/departments",
  },
  {
    id: "locations" as const,
    label: "Locations",
    path: "/admin/export/locations",
  },
  {
    id: "charge-item-definition" as const,
    label: "Charge Item Definitions",
    path: "/admin/export/charge-item-definition",
  },
  {
    id: "product-knowledge" as const,
    label: "Product Knowledge",
    path: "/admin/export/product-knowledge",
  },
  {
    id: "product" as const,
    label: "Products",
    path: "/admin/export/product",
  },
  {
    id: "specimen-definitions" as const,
    label: "Specimen Definitions",
    path: "/admin/export/specimen-definitions",
  },
  {
    id: "observation-definition" as const,
    label: "Observation Definitions",
    path: "/admin/export/observation-definition",
  },
  {
    id: "activity-definition" as const,
    label: "Activity Definitions",
    path: "/admin/export/activity-definition",
  },
];

export default function ExportsLayout({
  activeTab,
  children,
}: ExportsLayoutProps) {
  const [facilities, setFacilities] = useState<FacilityOption[]>([]);
  const [loadingFacilities, setLoadingFacilities] = useState(true);
  const [facilityError, setFacilityError] = useState<string | null>(null);
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>("");

  useEffect(() => {
    let active = true;

    const loadFacilities = async () => {
      try {
        const response = await request<CurrentUserResponse>(
          "/api/v1/users/getcurrentuser/",
          { method: "GET" },
        );
        if (!active) return;
        setFacilities(response.facilities ?? []);
        setFacilityError(null);
      } catch {
        if (!active) return;
        setFacilityError("Unable to load facilities");
      } finally {
        if (active) setLoadingFacilities(false);
      }
    };

    loadFacilities();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedFacilityId && facilities.length > 0) {
      setSelectedFacilityId(facilities[0].id);
    }
  }, [facilities, selectedFacilityId]);

  const tabs = getTabConfig();
  const requiresFacility = activeTab !== "users";
  const canRenderContent = !requiresFacility || Boolean(selectedFacilityId);
  const content = React.isValidElement(children)
    ? React.cloneElement(
        children as React.ReactElement<{ facilityId?: string }>,
        { facilityId: selectedFacilityId || undefined },
      )
    : children;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div>
        <div className="px-6 pt-4 space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Select Facility
            </label>
            <Select
              value={selectedFacilityId || ""}
              onValueChange={setSelectedFacilityId}
              disabled={loadingFacilities}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    loadingFacilities
                      ? "Loading facilities..."
                      : "Select a facility"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {facilities.map((facility) => (
                  <SelectItem key={facility.id} value={facility.id}>
                    {facility.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {facilityError && (
              <p className="text-sm text-red-600">{facilityError}</p>
            )}
          </div>
          <NavTabs
            tabs={tabs.map((tab) => ({
              key: tab.id,
              label: tab.label,
              href: tab.path,
            }))}
            currentTab={activeTab}
          />
        </div>

        <div className="px-6 py-6">
          {!canRenderContent ? (
            <div className="rounded-md border border-dashed border-gray-200 bg-white p-6 text-sm text-gray-600">
              Select a facility to start exporting data.
            </div>
          ) : (
            content
          )}
        </div>
      </div>
    </div>
  );
}
