import { Redirect } from "raviger";
import type { ReactNode } from "react";

import ActivityDefinitionImport from "@/components/pages/ActivityDefinition/ActivityDefinitionImport";
import ChargeItemDefinitionImport from "@/components/pages/ChargeItemDefinition/ChargeItemDefinitionImport";
import DepartmentImport from "@/components/pages/Departments/DepartmentImport";
import ActivityDefinitionExport from "@/components/pages/exports/ActivityDefinitionExport";
import ChargeItemDefinitionExport from "@/components/pages/exports/ChargeItemDefinitionExport";
import DepartmentExport from "@/components/pages/exports/DepartmentExport";
import ExportsLayout, {
  ExportTabId,
} from "@/components/pages/exports/ExportsLayout";
import LocationExport from "@/components/pages/exports/LocationExport";
import ObservationDefinitionExport from "@/components/pages/exports/ObservationDefinitionExport";
import ProductExport from "@/components/pages/exports/ProductExport";
import ProductKnowledgeExport from "@/components/pages/exports/ProductKnowledgeExport";
import SpecimenDefinitionExport from "@/components/pages/exports/SpecimenDefinitionExport";
import UsersExport from "@/components/pages/exports/UsersExport";
import ValueSetExport from "@/components/pages/exports/ValueSetExport";
import ImportsLayout, { ImportTabId } from "@/components/pages/ImportsLayout";
import LinkUsersImport from "@/components/pages/LinkUsersImport";
import LocationImport from "@/components/pages/Location/LocationImport";
import ObservationDefinitionImport from "@/components/pages/ObservationDefinition/ObservationDefinitionImport";
import ProductImport from "@/components/pages/Product/ProductImport";
import ProductKnowledgeImport from "@/components/pages/ProductKnowledge/ProductKnowledgeImport";
import SpecimenDefinitionImport from "@/components/pages/SpecimenDefinition/SpecimenDefinitionImport";
import UsersImportPage from "@/components/pages/Users/UsersImport";
import ValueSetImport from "@/components/pages/ValueSet/ValueSetImport";

const renderImportsPage = (activeTab: ImportTabId, content: ReactNode) => (
  <ImportsLayout activeTab={activeTab}>{content}</ImportsLayout>
);

const renderExportsPage = (activeTab: ExportTabId, content: ReactNode) => (
  <ExportsLayout activeTab={activeTab}>{content}</ExportsLayout>
);

const routes = {
  // Import routes
  "/admin/import": () => <Redirect to="/admin/import/users" />,
  "/admin/import/users": () => renderImportsPage("users", <UsersImportPage />),
  "/admin/import/departments": () =>
    renderImportsPage("departments", <DepartmentImport />),
  "/admin/import/link-users": () =>
    renderImportsPage("link-users", <LinkUsersImport />),
  "/admin/import/locations": () =>
    renderImportsPage("locations", <LocationImport />),
  "/admin/import/charge-item-definition": () =>
    renderImportsPage("charge-item-definition", <ChargeItemDefinitionImport />),
  "/admin/import/product-knowledge": () =>
    renderImportsPage("product-knowledge", <ProductKnowledgeImport />),
  "/admin/import/product": () =>
    renderImportsPage("product", <ProductImport />),
  "/admin/import/observation-definition": () =>
    renderImportsPage(
      "observation-definition",
      <ObservationDefinitionImport />,
    ),
  "/admin/import/activity-definition": () =>
    renderImportsPage("activity-definition", <ActivityDefinitionImport />),
  "/admin/import/valuesets": () =>
    renderImportsPage("valuesets", <ValueSetImport />),
  "/admin/import/specimen-definitions": () =>
    renderImportsPage("specimen-definitions", <SpecimenDefinitionImport />),

  // Export routes
  "/admin/export": () => <Redirect to="/admin/export/users" />,
  "/admin/export/users": () => renderExportsPage("users", <UsersExport />),
  "/admin/export/departments": () =>
    renderExportsPage("departments", <DepartmentExport />),
  "/admin/export/locations": () =>
    renderExportsPage("locations", <LocationExport />),
  "/admin/export/charge-item-definition": () =>
    renderExportsPage("charge-item-definition", <ChargeItemDefinitionExport />),
  "/admin/export/product-knowledge": () =>
    renderExportsPage("product-knowledge", <ProductKnowledgeExport />),
  "/admin/export/product": () =>
    renderExportsPage("product", <ProductExport />),
  "/admin/export/observation-definition": () =>
    renderExportsPage(
      "observation-definition",
      <ObservationDefinitionExport />,
    ),
  "/admin/export/activity-definition": () =>
    renderExportsPage("activity-definition", <ActivityDefinitionExport />),
  "/admin/export/specimen-definitions": () =>
    renderExportsPage("specimen-definitions", <SpecimenDefinitionExport />),
  "/admin/export/valuesets": () =>
    renderExportsPage("valuesets", <ValueSetExport />),
};

export default routes;
