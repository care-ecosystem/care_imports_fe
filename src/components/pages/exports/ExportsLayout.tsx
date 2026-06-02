import React, { useState } from "react";

import FacilitySelector from "@/components/shared/FacilitySelector";
import { NavTabs } from "@/components/ui/nav-tabs";

export type ExportTabId =
  | "users"
  | "departments"
  | "locations"
  | "charge-item-definition"
  | "product-knowledge"
  | "product"
  | "observation-definition"
  | "activity-definition"
  | "specimen-definitions"
  | "valuesets";

interface ExportsLayoutProps {
  activeTab: ExportTabId;
  children: React.ReactNode;
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
  {
    id: "valuesets" as const,
    label: "Value Sets",
    path: "/admin/export/valuesets",
  },
];

export default function ExportsLayout({
  activeTab,
  children,
}: ExportsLayoutProps) {
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
