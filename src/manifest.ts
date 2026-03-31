import { Download, Upload } from "lucide-react";
import React from "react";

import routes from "./routes";

const manifest = {
  plugin: "care_plugtest",
  routes,
  extends: [],
  components: {},
  navItems: [],
  adminNavItems: [
    {
      name: "Imports",
      url: "/admin/import",
      icon: React.createElement(Upload, { className: "size-4" }),
    },
    {
      name: "Exports",
      url: "/admin/export",
      icon: React.createElement(Download, { className: "size-4" }),
    },
  ],
  encounterTabs: {},
};

export default manifest;
