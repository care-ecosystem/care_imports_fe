import React, { useState } from "react";

import FacilitySelector from "@/components/shared/FacilitySelector";
import { NavTabs } from "@/components/ui/nav-tabs";

export type ImportTabId =
  | "users"
  | "departments"
  | "link-users"
  | "locations"
  | "charge-item-definition"
  | "product-knowledge"
  | "product"
  | "observation-definition"
  | "activity-definition"
  | "valuesets"
  | "specimen-definitions";

interface ImportsLayoutProps {
  activeTab: ImportTabId;
  children: React.ReactNode;
}

const getTabConfig = () => [
  {
    id: "users" as const,
    label: "Users",
    path: "/admin/import/users",
  },
  {
    id: "departments" as const,
    label: "Departments",
    path: "/admin/import/departments",
  },
  {
    id: "link-users" as const,
    label: "Link Users",
    path: "/admin/import/link-users",
  },
  {
    id: "locations" as const,
    label: "Locations",
    path: "/admin/import/locations",
  },
  {
    id: "charge-item-definition" as const,
    label: "Charge Item Definitions",
    path: "/admin/import/charge-item-definition",
  },
  {
    id: "product-knowledge" as const,
    label: "Product Knowledge",
    path: "/admin/import/product-knowledge",
  },
  {
    id: "product" as const,
    label: "Product",
    path: "/admin/import/product",
  },
  {
    id: "specimen-definitions" as const,
    label: "Specimen Definitions",
    path: "/admin/import/specimen-definitions",
  },
  {
    id: "observation-definition" as const,
    label: "Observation Definitions",
    path: "/admin/import/observation-definition",
  },
  {
    id: "activity-definition" as const,
    label: "Activity Definitions",
    path: "/admin/import/activity-definition",
  },
  {
    id: "valuesets" as const,
    label: "Value Sets",
    path: "/admin/import/valuesets",
  },
];

export default function ImportsLayout({
  activeTab,
  children,
}: ImportsLayoutProps) {
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>("");

  const tabs = getTabConfig();
  const requiresFacility =
    activeTab !== "users" &&
    activeTab !== "valuesets" &&
    activeTab !== "product-knowledge";
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
          <FacilitySelector
            value={selectedFacilityId}
            onSelect={setSelectedFacilityId}
          />
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
              Select a facility to start importing data.
            </div>
          ) : (
            content
          )}
        </div>
      </div>
    </div>
  );
}
