import { Redirect } from "raviger";
import type { ReactNode } from "react";

import ChargeItemDefinitionImport from "@/components/pages/ChargeItemDefinitionImport";
import DepartmentImport from "@/components/pages/DepartmentImport";
import ImportsLayout, { ImportTabId } from "@/components/pages/ImportsLayout";
import LinkUsersImport from "@/components/pages/LinkUsersImport";
import LocationImport from "@/components/pages/LocationImport";
import ProductKnowledgeImport from "@/components/pages/ProductKnowledgeImport";
import SpecimenDefinitionImport from "@/components/pages/SpecimenDefinitionImport";
import UsersImportPage from "@/components/pages/UsersImport";

const renderImportsPage = (activeTab: ImportTabId, content: ReactNode) => (
  <ImportsLayout activeTab={activeTab}>{content}</ImportsLayout>
);

const routes = {
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
  "/admin/import/specimen-definitions": () =>
    renderImportsPage("specimen-definitions", <SpecimenDefinitionImport />),
};

export default routes;
