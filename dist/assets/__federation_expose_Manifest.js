import { importShared } from './__federation_fn_import.js';
import { j as jsxRuntimeExports } from './jsx-runtime.js';

/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const toCamelCase = (string) => string.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase()
);
const toPascalCase = (string) => {
  const camelCase = toCamelCase(string);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
const mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();

/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};

/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const {forwardRef: forwardRef$1,createElement: createElement$1} = await importShared('react');

const Icon$1 = forwardRef$1(
  ({
    color = "currentColor",
    size = 24,
    strokeWidth = 2,
    absoluteStrokeWidth,
    className = "",
    children,
    iconNode,
    ...rest
  }, ref) => {
    return createElement$1(
      "svg",
      {
        ref,
        ...defaultAttributes,
        width: size,
        height: size,
        stroke: color,
        strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
        className: mergeClasses("lucide", className),
        ...rest
      },
      [
        ...iconNode.map(([tag, attrs]) => createElement$1(tag, attrs)),
        ...Array.isArray(children) ? children : [children]
      ]
    );
  }
);

/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const {forwardRef,createElement} = await importShared('react');

const createLucideIcon = (iconName, iconNode) => {
  const Component = forwardRef(
    ({ className, ...props }, ref) => createElement(Icon$1, {
      ref,
      iconNode,
      className: mergeClasses(
        `lucide-${toKebabCase(toPascalCase(iconName))}`,
        `lucide-${iconName}`,
        className
      ),
      ...props
    })
  );
  Component.displayName = toPascalCase(iconName);
  return Component;
};

/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$f = [
  ["path", { d: "M2 4v16", key: "vw9hq8" }],
  ["path", { d: "M2 8h18a2 2 0 0 1 2 2v10", key: "1dgv2r" }],
  ["path", { d: "M2 17h20", key: "18nfp3" }],
  ["path", { d: "M6 8v9", key: "1yriud" }]
];
const Bed = createLucideIcon("bed", __iconNode$f);

/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$e = [
  ["path", { d: "M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z", key: "1b4qmf" }],
  ["path", { d: "M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2", key: "i71pzd" }],
  ["path", { d: "M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2", key: "10jefs" }],
  ["path", { d: "M10 6h4", key: "1itunk" }],
  ["path", { d: "M10 10h4", key: "tcdvrf" }],
  ["path", { d: "M10 14h4", key: "kelpxr" }],
  ["path", { d: "M10 18h4", key: "1ulq68" }]
];
const Building2 = createLucideIcon("building-2", __iconNode$e);

/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$d = [
  ["rect", { width: "16", height: "20", x: "4", y: "2", rx: "2", ry: "2", key: "76otgf" }],
  ["path", { d: "M9 22v-4h6v4", key: "r93iot" }],
  ["path", { d: "M8 6h.01", key: "1dz90k" }],
  ["path", { d: "M16 6h.01", key: "1x0f13" }],
  ["path", { d: "M12 6h.01", key: "1vi96p" }],
  ["path", { d: "M12 10h.01", key: "1nrarc" }],
  ["path", { d: "M12 14h.01", key: "1etili" }],
  ["path", { d: "M16 10h.01", key: "1m94wz" }],
  ["path", { d: "M16 14h.01", key: "1gbofw" }],
  ["path", { d: "M8 10h.01", key: "19clt8" }],
  ["path", { d: "M8 14h.01", key: "6423bh" }]
];
const Building = createLucideIcon("building", __iconNode$d);

/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$c = [
  [
    "path",
    {
      d: "M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2",
      key: "5owen"
    }
  ],
  ["circle", { cx: "7", cy: "17", r: "2", key: "u2ysq9" }],
  ["path", { d: "M9 17h6", key: "r8uit2" }],
  ["circle", { cx: "17", cy: "17", r: "2", key: "axvx0g" }]
];
const Car = createLucideIcon("car", __iconNode$c);

/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$b = [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]];
const Check = createLucideIcon("check", __iconNode$b);

/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$a = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]];
const ChevronDown = createLucideIcon("chevron-down", __iconNode$a);

/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$9 = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]];
const ChevronRight = createLucideIcon("chevron-right", __iconNode$9);

/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$8 = [["path", { d: "m18 15-6-6-6 6", key: "153udz" }]];
const ChevronUp = createLucideIcon("chevron-up", __iconNode$8);

/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$7 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
];
const CircleAlert = createLucideIcon("circle-alert", __iconNode$7);

/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$6 = [
  [
    "path",
    {
      d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
      key: "1nclc0"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Eye = createLucideIcon("eye", __iconNode$6);

/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$5 = [
  ["path", { d: "M12 6v4", key: "16clxf" }],
  ["path", { d: "M14 14h-4", key: "esezmu" }],
  ["path", { d: "M14 18h-4", key: "16mqa2" }],
  ["path", { d: "M14 8h-4", key: "z8ypaz" }],
  [
    "path",
    {
      d: "M18 12h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h2",
      key: "b1k337"
    }
  ],
  ["path", { d: "M18 22V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v18", key: "16g51d" }]
];
const Hospital = createLucideIcon("hospital", __iconNode$5);

/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$4 = [
  ["path", { d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8", key: "5wwlr5" }],
  [
    "path",
    {
      d: "M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
      key: "1d0kgt"
    }
  ]
];
const House = createLucideIcon("house", __iconNode$4);

/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$3 = [
  [
    "path",
    {
      d: "M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z",
      key: "169xi5"
    }
  ],
  ["path", { d: "M15 5.764v15", key: "1pn4in" }],
  ["path", { d: "M9 3.236v15", key: "1uimfh" }]
];
const Map$1 = createLucideIcon("map", __iconNode$3);

/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$2 = [
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
  ["path", { d: "m21 21-4.3-4.3", key: "1qie3q" }]
];
const Search = createLucideIcon("search", __iconNode$2);

/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$1 = [
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["polyline", { points: "17 8 12 3 7 8", key: "t8dd8p" }],
  ["line", { x1: "12", x2: "12", y1: "3", y2: "15", key: "widbto" }]
];
const Upload = createLucideIcon("upload", __iconNode$1);

/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
];
const X$1 = createLucideIcon("x", __iconNode);

const __vite_import_meta_env__ = {};
const CARE_ACCESS_TOKEN_LOCAL_STORAGE_KEY = "care_access_token";
class APIError extends Error {
  message;
  data;
  status;
  constructor(message, data, status) {
    super(message);
    this.name = "AbortError";
    this.message = message;
    this.data = data;
    this.status = status;
  }
}
function resolveApiUrl(path) {
  const coreEnv = window.__CORE_ENV__;
  const envUrl = __vite_import_meta_env__?.VITE_API_BASE_URL || "";
  const apiUrl = coreEnv?.apiUrl || envUrl;
  if (!apiUrl) {
    throw new Error(
      "API base URL is not configured. Set window.__CORE_ENV__.apiUrl or VITE_API_BASE_URL."
    );
  }
  return `${apiUrl}${path}`;
}
async function request(path, options) {
  const url = path.startsWith("http") ? path : resolveApiUrl(path);
  const defaultHeaders = {
    Authorization: `Bearer ${localStorage.getItem(
      CARE_ACCESS_TOKEN_LOCAL_STORAGE_KEY
    )}`,
    "Content-Type": "application/json"
  };
  const requestInit = {
    ...options ?? {},
    headers: {
      ...defaultHeaders,
      ...options?.headers ?? {}
    }
  };
  const response = await fetch(url, requestInit);
  let data = null;
  const contentType = response.headers.get("Content-Type") || "";
  if (contentType.includes("application/json")) {
    data = await response.json();
  } else if (contentType.includes("image/png")) {
    data = await response.blob();
  } else if (contentType.includes("application/pdf")) {
    data = await response.blob();
  } else if (contentType.includes("image")) {
    data = await response.blob();
  } else {
    data = await response.text();
  }
  if (!response.ok) {
    throw new APIError(
      typeof data?.detail === "string" ? data.detail : JSON.stringify(data),
      data,
      response.status
    );
  }
  return data;
}
const queryString = (params) => {
  if (!params) {
    return "";
  }
  const paramString = Object.keys(params).map((key) => `${key}=${params[key]}`).join("&");
  return paramString ? `?${paramString}` : "";
};

function Alert({
  variant = "default",
  className = "",
  ...props
}) {
  const variantClasses = variant === "destructive" ? "border-red-200 bg-red-50 text-red-700" : "border-gray-200 bg-white text-gray-700";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      role: "alert",
      className: `flex items-start gap-2 rounded-lg border p-3 text-sm ${variantClasses} ${className}`,
      ...props
    }
  );
}
function AlertDescription({
  className = "",
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-sm ${className}`, ...props });
}

function Button({
  variant = "default",
  size = "default",
  className = "",
  ...props
}) {
  const base = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none";
  const variantClasses = variant === "outline" ? "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50" : "bg-blue-600 text-white hover:bg-blue-700";
  const sizeClasses = size === "sm" ? "h-8 px-3" : "h-9 px-4";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      className: `${base} ${variantClasses} ${sizeClasses} ${className}`,
      ...props
    }
  );
}

function Card({ className = "", ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: `rounded-lg border border-gray-200 bg-white shadow-sm ${className}`,
      ...props
    }
  );
}
function CardHeader({ className = "", ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `p-6 ${className}`, ...props });
}
function CardTitle({ className = "", ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: `text-lg font-semibold text-gray-900 ${className}`, ...props });
}
function CardDescription({ className = "", ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-sm text-gray-600 ${className}`, ...props });
}
function CardContent({ className = "", ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `p-6 pt-0 ${className}`, ...props });
}

function Progress({ value, className = "", ...props }) {
  const clampedValue = Math.min(100, Math.max(0, value));
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: `h-2 w-full overflow-hidden rounded-full bg-gray-100 ${className}`,
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "h-full bg-blue-600 transition-all",
          style: { width: `${clampedValue}%` }
        }
      )
    }
  );
}

var ResourceCategoryResourceType = /* @__PURE__ */ ((ResourceCategoryResourceType2) => {
  ResourceCategoryResourceType2["product_knowledge"] = "product_knowledge";
  ResourceCategoryResourceType2["activity_definition"] = "activity_definition";
  ResourceCategoryResourceType2["charge_item_definition"] = "charge_item_definition";
  return ResourceCategoryResourceType2;
})(ResourceCategoryResourceType || {});
var ResourceCategorySubType = /* @__PURE__ */ ((ResourceCategorySubType2) => {
  ResourceCategorySubType2["charge_item_definition_location_bed_charges"] = "charge_item_definition:location:bed_charges";
  ResourceCategorySubType2["charge_item_definition_schedule_practitioner"] = "charge_item_definition:schedule:practitioner";
  ResourceCategorySubType2["charge_item_definition_schedule_location"] = "charge_item_definition:schedule:location";
  ResourceCategorySubType2["charge_item_definition_schedule_healthcare_service"] = "charge_item_definition:schedule:healthcare_service";
  ResourceCategorySubType2["other"] = "all:other";
  return ResourceCategorySubType2;
})(ResourceCategorySubType || {});

var ChargeItemDefinitionStatus = /* @__PURE__ */ ((ChargeItemDefinitionStatus2) => {
  ChargeItemDefinitionStatus2["draft"] = "draft";
  ChargeItemDefinitionStatus2["active"] = "active";
  ChargeItemDefinitionStatus2["retired"] = "retired";
  return ChargeItemDefinitionStatus2;
})(ChargeItemDefinitionStatus || {});

function parseCsvText(csvText) {
  const lines = csvText.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }
  const headers = splitCsvLine(lines[0]);
  const rows = lines.slice(1).map(splitCsvLine);
  return { headers, rows };
}
function splitCsvLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim().replace(/^"(.*)"$/, "$1"));
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim().replace(/^"(.*)"$/, "$1"));
  return result;
}

async function createSlug(name, maxLength = 25, disablePadding = false) {
  if (!name) {
    return "";
  }
  const baseLength = Math.min(maxLength, 18);
  let slug = name.toLowerCase();
  slug = slug.replace(/[^a-z0-9\s_-]/g, "");
  slug = slug.replace(/\s+/g, "-");
  slug = slug.replace(/-+/g, "-");
  slug = slug.trim();
  slug = slug.slice(0, baseLength);
  if (disablePadding) {
    return slug;
  }
  const encoder = new TextEncoder();
  const data = encoder.encode(name);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${slug}-${hashHex.slice(0, 7)}`;
}

const {useMemo: useMemo$5,useState: useState$9} = await importShared('react');
const REQUIRED_HEADERS$4 = ["title", "description", "purpose", "price"];
const normalizeHeader$4 = (header) => header.toLowerCase().replace(/[^a-z0-9]/g, "");
function ChargeItemDefinitionImport({
  facilityId
}) {
  const [categoryTitle, setCategoryTitle] = useState$9("");
  const [currentStep, setCurrentStep] = useState$9("upload");
  const [uploadError, setUploadError] = useState$9("");
  const [processedRows, setProcessedRows] = useState$9([]);
  const [results, setResults] = useState$9(null);
  const summary = useMemo$5(() => {
    const valid = processedRows.filter((row) => row.errors.length === 0).length;
    const invalid = processedRows.length - valid;
    return { total: processedRows.length, valid, invalid };
  }, [processedRows]);
  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      setUploadError("Please upload a valid CSV file");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvText = e.target?.result;
        const { headers, rows } = parseCsvText(csvText);
        if (headers.length === 0) {
          setUploadError("CSV is empty or missing headers");
          return;
        }
        const headerMap = headers.reduce(
          (acc, header, index) => {
            const key = normalizeHeader$4(header);
            acc[key] = index;
            return acc;
          },
          {}
        );
        const missingHeaders = REQUIRED_HEADERS$4.filter(
          (header) => headerMap[header] === void 0
        );
        if (missingHeaders.length > 0) {
          setUploadError(
            `Missing required headers: ${missingHeaders.join(", ")}`
          );
          return;
        }
        const processed = rows.map((row, index) => {
          const data = {
            title: row[headerMap.title] ?? "",
            description: row[headerMap.description] ?? "",
            purpose: row[headerMap.purpose] ?? "",
            price: row[headerMap.price] ?? ""
          };
          const errors = [];
          if (!data.title.trim()) errors.push("Missing title");
          if (!data.price.trim()) errors.push("Missing price");
          return {
            rowIndex: index + 2,
            data,
            errors
          };
        });
        setUploadError("");
        setProcessedRows(processed);
        setCurrentStep("review");
      } catch (error) {
        setUploadError("Error processing CSV file");
      }
    };
    reader.readAsText(file);
  };
  const downloadSample = () => {
    const sampleCSV = `title,description,purpose,price
Consultation Fee,Doctor consultation fee,Consultation charge,250
Bed Charges,Per day bed charge,Bed usage,1500`;
    const blob = new Blob([sampleCSV], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample_charge_item_definition.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };
  const runImport = async () => {
    if (!categoryTitle.trim()) {
      setUploadError("Category title is required");
      setCurrentStep("upload");
      return;
    }
    const validRows = processedRows.filter((row) => row.errors.length === 0);
    if (validRows.length === 0) {
      setResults({
        processed: 0,
        created: 0,
        updated: 0,
        failed: 0,
        failures: []
      });
      setCurrentStep("done");
      return;
    }
    setCurrentStep("importing");
    setResults({
      processed: 0,
      created: 0,
      updated: 0,
      failed: 0,
      failures: []
    });
    if (!facilityId) return;
    const existingCategories = await request(
      `/api/v1/facility/${facilityId}/resource_category/?limit=100&resource_type=${ResourceCategoryResourceType.charge_item_definition}&resource_sub_type=${ResourceCategorySubType.other}`,
      { method: "GET" }
    );
    const normalizedTitle = categoryTitle.trim().toLowerCase();
    const existingCategory = existingCategories.results.find(
      (category) => category.title.trim().toLowerCase() === normalizedTitle
    );
    let categorySlug = existingCategory?.slug_config.slug_value;
    if (!categorySlug) {
      categorySlug = await createSlug(categoryTitle);
      await request(`/api/v1/facility/${facilityId}/resource_category/`, {
        method: "POST",
        body: JSON.stringify({
          title: categoryTitle,
          slug_value: categorySlug,
          resource_type: ResourceCategoryResourceType.charge_item_definition,
          resource_sub_type: ResourceCategorySubType.other
        })
      });
    }
    const resourceCategorySlug = `f-${facilityId}-${categorySlug}`;
    for (const row of validRows) {
      try {
        const slug = await createSlug(row.data.title);
        const payload = {
          title: row.data.title,
          slug_value: slug,
          status: ChargeItemDefinitionStatus.active,
          category: resourceCategorySlug,
          description: row.data.description,
          purpose: row.data.purpose,
          can_edit_charge_item: true,
          price_components: [
            {
              monetary_component_type: "base",
              amount: row.data.price
            }
          ]
        };
        const url = `/api/v1/facility/${facilityId}/charge_item_definition/f-${facilityId}-${slug}/`;
        try {
          await request(url, { method: "GET" });
          await request(url, {
            method: "PUT",
            body: JSON.stringify(payload)
          });
          setResults(
            (prev) => prev ? {
              ...prev,
              processed: prev.processed + 1,
              updated: prev.updated + 1
            } : prev
          );
        } catch (error) {
          if (error instanceof Error && "status" in error) {
            const status = error.status;
            if (status !== 404) {
              throw error;
            }
          }
          await request(
            `/api/v1/facility/${facilityId}/charge_item_definition/`,
            {
              method: "POST",
              body: JSON.stringify(payload)
            }
          );
          setResults(
            (prev) => prev ? {
              ...prev,
              processed: prev.processed + 1,
              created: prev.created + 1
            } : prev
          );
        }
      } catch (error) {
        const reason = error instanceof Error ? error.message : "Unknown error";
        setResults(
          (prev) => prev ? {
            ...prev,
            processed: prev.processed + 1,
            failed: prev.failed + 1,
            failures: [
              ...prev.failures,
              { rowIndex: row.rowIndex, title: row.data.title, reason }
            ]
          } : prev
        );
      }
    }
    setCurrentStep("done");
  };
  if (currentStep === "upload") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-4xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-5 w-5" }),
          "Import Charge Item Definitions from CSV"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Upload a CSV file to import charge item definitions under a category." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-gray-700", children: "Category Title" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              value: categoryTitle,
              onChange: (event) => setCategoryTitle(event.target.value),
              className: "mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm",
              placeholder: "e.g. Consultation Charges"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-2 border-dashed border-gray-300 rounded-lg p-8 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "file",
              accept: ".csv",
              onChange: handleFileUpload,
              className: "hidden",
              id: "charge-item-upload"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "charge-item-upload", className: "cursor-pointer", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-12 w-12 text-gray-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-medium", children: "Click to upload CSV file" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", children: "or drag and drop" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: "Expected columns: title, description, purpose, price" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: downloadSample, children: "Download Sample CSV" })
          ] }) })
        ] }),
        uploadError && /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { className: "mt-4", variant: "destructive", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { children: uploadError })
        ] })
      ] })
    ] }) });
  }
  if (currentStep === "review") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Charge Item Import Wizard" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Review and validate charge items before importing" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: 100, className: "h-2" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold mb-4", children: "Review All Charge Items" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-gray-200 rounded-lg overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-80 overflow-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "min-w-full text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-gray-50 text-gray-600", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2 text-left", children: "Row" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2 text-left", children: "Title" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2 text-left", children: "Price" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2 text-left", children: "Status" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: processedRows.map((row) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "tr",
              {
                className: "border-t border-gray-100",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-gray-500", children: row.rowIndex }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2", children: row.data.title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2", children: row.data.price }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2", children: row.errors.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-600", children: "Valid" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-600", children: row.errors.join("; ") }) })
                ]
              },
              row.rowIndex
            )) })
          ] }) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            className: "mt-4",
            onClick: runImport,
            disabled: summary.valid === 0,
            children: "Start Import"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            onClick: () => setCurrentStep("upload"),
            children: "Back"
          }
        ) })
      ] })
    ] }) });
  }
  if (currentStep === "importing") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-4xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Importing Charge Items" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { children: [
        results?.processed ?? 0,
        "/",
        summary.valid,
        " processed"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Progress,
        {
          value: summary.valid ? (results?.processed ?? 0) / summary.valid * 100 : 0,
          className: "h-2"
        }
      ) })
    ] }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-4xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Charge Item Import Complete" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { children: [
        "Created: ",
        results?.created ?? 0,
        " · Updated: ",
        results?.updated ?? 0,
        " ",
        "· Failed: ",
        results?.failed ?? 0
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
      results && results.failures.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { className: "mb-4", variant: "destructive", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { children: results.failures.slice(0, 5).map((failure) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          "Row ",
          failure.rowIndex,
          ": ",
          failure.reason
        ] }, `${failure.rowIndex}-${failure.title}`)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setCurrentStep("upload"), children: "Import Another File" }) })
    ] })
  ] }) });
}

function Badge({
  variant = "default",
  className = "",
  ...props
}) {
  const variantClasses = {
    default: "bg-gray-100 text-gray-800",
    outline: "border border-gray-300 text-gray-700",
    primary: "bg-blue-600 text-white",
    secondary: "bg-gray-200 text-gray-800"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${variantClasses[variant]} ${className}`,
      ...props
    }
  );
}

const {useState: useState$8} = await importShared('react');
const REQUIRED_HEADERS$3 = ["department", "subdepartment"];
const normalizeHeader$3 = (value) => value.toLowerCase().replace(/[^a-z0-9]/g, "");
const buildHeaderMap$2 = (headers) => {
  const headerMap = {};
  headers.forEach((header, index) => {
    const normalized = normalizeHeader$3(header);
    if (normalized === "department") headerMap.department = index;
    if (normalized === "subdepartment") headerMap.subDepartment = index;
  });
  return headerMap;
};
const buildDepartmentTree = (rows) => {
  const roots = [];
  const findOrCreate = (name, nodes) => {
    let node = nodes.find((entry) => entry.name === name);
    if (!node) {
      node = { name, children: [] };
      nodes.push(node);
    }
    return node;
  };
  for (const row of rows) {
    const rootName = row.department.trim();
    if (!rootName) continue;
    const root = findOrCreate(rootName, roots);
    if (row.subDepartment && row.subDepartment.trim()) {
      findOrCreate(row.subDepartment.trim(), root.children);
    }
  }
  return roots;
};
function DepartmentImport({
  facilityId
}) {
  const [currentStep, setCurrentStep] = useState$8("upload");
  const [uploadError, setUploadError] = useState$8("");
  const [departments, setDepartments] = useState$8([]);
  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      setUploadError("Please upload a valid CSV file");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvText = e.target?.result;
        const rows = csvText.split("\n").map((row) => row.trim()).filter(Boolean);
        if (rows.length === 0) {
          setUploadError("CSV is empty or missing headers");
          return;
        }
        const headers = rows[0].split(",").map((h) => h.trim().replace(/"/g, ""));
        const headerMap = buildHeaderMap$2(headers);
        const missingHeaders = REQUIRED_HEADERS$3.filter(
          (header) => headerMap[header] === void 0
        );
        if (missingHeaders.length > 0) {
          setUploadError(
            `Missing required headers: ${missingHeaders.join(", ")}`
          );
          return;
        }
        const dataRows = [];
        for (let i = 1; i < rows.length; i++) {
          if (!rows[i]) continue;
          const values = rows[i].split(",").map((value) => value.trim().replace(/"/g, ""));
          const department = values[headerMap.department] ?? "";
          const subDepartment = headerMap.subDepartment !== void 0 ? values[headerMap.subDepartment] : void 0;
          if (department.trim()) {
            dataRows.push({ department, subDepartment });
          }
        }
        setUploadError("");
        setDepartments(buildDepartmentTree(dataRows));
        setCurrentStep("review");
      } catch (error) {
        setUploadError("Error processing CSV file");
      }
    };
    reader.readAsText(file);
  };
  const saveDepartments = async () => {
    if (!facilityId) return;
    for (const department of departments) {
      await createDepartmentTree(facilityId, department);
    }
  };
  if (currentStep === "upload") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-4xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-5 w-5" }),
          "Import Departments from CSV"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Upload a CSV file to import departments and sub-departments with their hierarchy preserved." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-2 border-dashed border-gray-300 rounded-lg p-8 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "file",
              accept: ".csv",
              onChange: handleFileUpload,
              className: "hidden",
              id: "dept-csv-upload"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "dept-csv-upload", className: "cursor-pointer", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-12 w-12 text-gray-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-medium", children: "Click to upload CSV file" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", children: "or drag and drop" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: "Expected columns: department, subDepartment" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 mt-2", children: "Sub-department is optional. If omitted, the department will be created at the top level." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => {
                  const sampleCSV = `Department,Sub Department
Varghese,Varghese Sub
Radiology,`;
                  const blob = new Blob([sampleCSV], { type: "text/csv" });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "sample_departments.csv";
                  a.click();
                  window.URL.revokeObjectURL(url);
                },
                children: "Download Sample CSV"
              }
            )
          ] }) })
        ] }),
        uploadError && /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { className: "mt-4", variant: "destructive", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { children: uploadError })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 p-4 bg-gray-50 rounded-lg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-medium text-sm mb-2", children: "Valid Department Levels:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: ["Department", "Sub Department"].map((label) => /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: label }, label)) })
        ] })
      ] })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Department Import Wizard" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Review and validate departments before importing" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: 100, className: "h-2" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold mb-4", children: "Review All Departments" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border rounded-lg bg-white", children: departments.map((department) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "border-b border-gray-100 p-3",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-gray-900", children: department.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: "Department" })
              ] }),
              department.children.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-4 mt-2 space-y-1", children: department.children.map((child) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center gap-2 text-sm text-gray-600",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: child.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: "Sub Department" })
                  ]
                },
                child.name
              )) })
            ]
          },
          department.name
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "mt-4", onClick: saveDepartments, children: "Save" }) })
    ] })
  ] }) });
}
async function createDepartmentTree(facilityId, node, parentId) {
  const payload = {
    name: node.name,
    description: "",
    org_type: "dept",
    parent: parentId ?? void 0,
    facility: facilityId
  };
  const created = await request(
    `/api/v1/facility/${facilityId}/organizations/`,
    {
      method: "POST",
      body: JSON.stringify(payload)
    }
  );
  if (!created?.id) {
    return;
  }
  for (const child of node.children) {
    await createDepartmentTree(facilityId, child, created.id);
  }
}

const {Link} = await importShared('raviger');

function NavTabs({
  tabs,
  currentTab,
  className = "",
  tabTriggerClassName = ""
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full justify-evenly sm:justify-start border-b rounded-none bg-transparent p-0 h-auto overflow-x-auto flex gap-2", children: tabs.map((tab) => {
    const isActive = tab.key === currentTab;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        href: tab.href,
        className: `border-b-3 px-1.5 sm:px-2.5 py-2 text-gray-600 font-semibold hover:text-gray-900 rounded-none ${isActive ? "border-b-primary-700 text-primary-800 bg-transparent shadow-none" : "border-transparent"} ${tabTriggerClassName}`,
        children: tab.label
      },
      tab.key
    );
  }) }) });
}

// packages/core/number/src/number.ts
function clamp$1(value, [min, max]) {
  return Math.min(max, Math.max(min, value));
}

// src/primitive.tsx
function composeEventHandlers(originalEventHandler, ourEventHandler, { checkForDefaultPrevented = true } = {}) {
  return function handleEvent(event) {
    originalEventHandler?.(event);
    if (checkForDefaultPrevented === false || !event.defaultPrevented) {
      return ourEventHandler?.(event);
    }
  };
}

// packages/react/context/src/create-context.tsx
const React$y = await importShared('react');
function createContext2(rootComponentName, defaultContext) {
  const Context = React$y.createContext(defaultContext);
  const Provider = (props) => {
    const { children, ...context } = props;
    const value = React$y.useMemo(() => context, Object.values(context));
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Context.Provider, { value, children });
  };
  Provider.displayName = rootComponentName + "Provider";
  function useContext2(consumerName) {
    const context = React$y.useContext(Context);
    if (context) return context;
    if (defaultContext !== void 0) return defaultContext;
    throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
  }
  return [Provider, useContext2];
}
function createContextScope(scopeName, createContextScopeDeps = []) {
  let defaultContexts = [];
  function createContext3(rootComponentName, defaultContext) {
    const BaseContext = React$y.createContext(defaultContext);
    const index = defaultContexts.length;
    defaultContexts = [...defaultContexts, defaultContext];
    const Provider = (props) => {
      const { scope, children, ...context } = props;
      const Context = scope?.[scopeName]?.[index] || BaseContext;
      const value = React$y.useMemo(() => context, Object.values(context));
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Context.Provider, { value, children });
    };
    Provider.displayName = rootComponentName + "Provider";
    function useContext2(consumerName, scope) {
      const Context = scope?.[scopeName]?.[index] || BaseContext;
      const context = React$y.useContext(Context);
      if (context) return context;
      if (defaultContext !== void 0) return defaultContext;
      throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
    }
    return [Provider, useContext2];
  }
  const createScope = () => {
    const scopeContexts = defaultContexts.map((defaultContext) => {
      return React$y.createContext(defaultContext);
    });
    return function useScope(scope) {
      const contexts = scope?.[scopeName] || scopeContexts;
      return React$y.useMemo(
        () => ({ [`__scope${scopeName}`]: { ...scope, [scopeName]: contexts } }),
        [scope, contexts]
      );
    };
  };
  createScope.scopeName = scopeName;
  return [createContext3, composeContextScopes(createScope, ...createContextScopeDeps)];
}
function composeContextScopes(...scopes) {
  const baseScope = scopes[0];
  if (scopes.length === 1) return baseScope;
  const createScope = () => {
    const scopeHooks = scopes.map((createScope2) => ({
      useScope: createScope2(),
      scopeName: createScope2.scopeName
    }));
    return function useComposedScopes(overrideScopes) {
      const nextScopes = scopeHooks.reduce((nextScopes2, { useScope, scopeName }) => {
        const scopeProps = useScope(overrideScopes);
        const currentScope = scopeProps[`__scope${scopeName}`];
        return { ...nextScopes2, ...currentScope };
      }, {});
      return React$y.useMemo(() => ({ [`__scope${baseScope.scopeName}`]: nextScopes }), [nextScopes]);
    };
  };
  createScope.scopeName = baseScope.scopeName;
  return createScope;
}

// packages/react/compose-refs/src/compose-refs.tsx
const React$x = await importShared('react');

function setRef(ref, value) {
  if (typeof ref === "function") {
    return ref(value);
  } else if (ref !== null && ref !== void 0) {
    ref.current = value;
  }
}
function composeRefs(...refs) {
  return (node) => {
    let hasCleanup = false;
    const cleanups = refs.map((ref) => {
      const cleanup = setRef(ref, node);
      if (!hasCleanup && typeof cleanup == "function") {
        hasCleanup = true;
      }
      return cleanup;
    });
    if (hasCleanup) {
      return () => {
        for (let i = 0; i < cleanups.length; i++) {
          const cleanup = cleanups[i];
          if (typeof cleanup == "function") {
            cleanup();
          } else {
            setRef(refs[i], null);
          }
        }
      };
    }
  };
}
function useComposedRefs(...refs) {
  return React$x.useCallback(composeRefs(...refs), refs);
}

// src/slot.tsx
const React$w = await importShared('react');
// @__NO_SIDE_EFFECTS__
function createSlot(ownerName) {
  const SlotClone = /* @__PURE__ */ createSlotClone(ownerName);
  const Slot2 = React$w.forwardRef((props, forwardedRef) => {
    const { children, ...slotProps } = props;
    const childrenArray = React$w.Children.toArray(children);
    const slottable = childrenArray.find(isSlottable);
    if (slottable) {
      const newElement = slottable.props.children;
      const newChildren = childrenArray.map((child) => {
        if (child === slottable) {
          if (React$w.Children.count(newElement) > 1) return React$w.Children.only(null);
          return React$w.isValidElement(newElement) ? newElement.props.children : null;
        } else {
          return child;
        }
      });
      return /* @__PURE__ */ jsxRuntimeExports.jsx(SlotClone, { ...slotProps, ref: forwardedRef, children: React$w.isValidElement(newElement) ? React$w.cloneElement(newElement, void 0, newChildren) : null });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SlotClone, { ...slotProps, ref: forwardedRef, children });
  });
  Slot2.displayName = `${ownerName}.Slot`;
  return Slot2;
}
// @__NO_SIDE_EFFECTS__
function createSlotClone(ownerName) {
  const SlotClone = React$w.forwardRef((props, forwardedRef) => {
    const { children, ...slotProps } = props;
    if (React$w.isValidElement(children)) {
      const childrenRef = getElementRef$1(children);
      const props2 = mergeProps(slotProps, children.props);
      if (children.type !== React$w.Fragment) {
        props2.ref = forwardedRef ? composeRefs(forwardedRef, childrenRef) : childrenRef;
      }
      return React$w.cloneElement(children, props2);
    }
    return React$w.Children.count(children) > 1 ? React$w.Children.only(null) : null;
  });
  SlotClone.displayName = `${ownerName}.SlotClone`;
  return SlotClone;
}
var SLOTTABLE_IDENTIFIER = Symbol("radix.slottable");
function isSlottable(child) {
  return React$w.isValidElement(child) && typeof child.type === "function" && "__radixId" in child.type && child.type.__radixId === SLOTTABLE_IDENTIFIER;
}
function mergeProps(slotProps, childProps) {
  const overrideProps = { ...childProps };
  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];
    const isHandler = /^on[A-Z]/.test(propName);
    if (isHandler) {
      if (slotPropValue && childPropValue) {
        overrideProps[propName] = (...args) => {
          const result = childPropValue(...args);
          slotPropValue(...args);
          return result;
        };
      } else if (slotPropValue) {
        overrideProps[propName] = slotPropValue;
      }
    } else if (propName === "style") {
      overrideProps[propName] = { ...slotPropValue, ...childPropValue };
    } else if (propName === "className") {
      overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(" ");
    }
  }
  return { ...slotProps, ...overrideProps };
}
function getElementRef$1(element) {
  let getter = Object.getOwnPropertyDescriptor(element.props, "ref")?.get;
  let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.ref;
  }
  getter = Object.getOwnPropertyDescriptor(element, "ref")?.get;
  mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.props.ref;
  }
  return element.props.ref || element.ref;
}

// src/collection-legacy.tsx
const React$v = await importShared('react');
function createCollection(name) {
  const PROVIDER_NAME = name + "CollectionProvider";
  const [createCollectionContext, createCollectionScope] = createContextScope(PROVIDER_NAME);
  const [CollectionProviderImpl, useCollectionContext] = createCollectionContext(
    PROVIDER_NAME,
    { collectionRef: { current: null }, itemMap: /* @__PURE__ */ new Map() }
  );
  const CollectionProvider = (props) => {
    const { scope, children } = props;
    const ref = React$v.useRef(null);
    const itemMap = React$v.useRef(/* @__PURE__ */ new Map()).current;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(CollectionProviderImpl, { scope, itemMap, collectionRef: ref, children });
  };
  CollectionProvider.displayName = PROVIDER_NAME;
  const COLLECTION_SLOT_NAME = name + "CollectionSlot";
  const CollectionSlotImpl = createSlot(COLLECTION_SLOT_NAME);
  const CollectionSlot = React$v.forwardRef(
    (props, forwardedRef) => {
      const { scope, children } = props;
      const context = useCollectionContext(COLLECTION_SLOT_NAME, scope);
      const composedRefs = useComposedRefs(forwardedRef, context.collectionRef);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(CollectionSlotImpl, { ref: composedRefs, children });
    }
  );
  CollectionSlot.displayName = COLLECTION_SLOT_NAME;
  const ITEM_SLOT_NAME = name + "CollectionItemSlot";
  const ITEM_DATA_ATTR = "data-radix-collection-item";
  const CollectionItemSlotImpl = createSlot(ITEM_SLOT_NAME);
  const CollectionItemSlot = React$v.forwardRef(
    (props, forwardedRef) => {
      const { scope, children, ...itemData } = props;
      const ref = React$v.useRef(null);
      const composedRefs = useComposedRefs(forwardedRef, ref);
      const context = useCollectionContext(ITEM_SLOT_NAME, scope);
      React$v.useEffect(() => {
        context.itemMap.set(ref, { ref, ...itemData });
        return () => void context.itemMap.delete(ref);
      });
      return /* @__PURE__ */ jsxRuntimeExports.jsx(CollectionItemSlotImpl, { ...{ [ITEM_DATA_ATTR]: "" }, ref: composedRefs, children });
    }
  );
  CollectionItemSlot.displayName = ITEM_SLOT_NAME;
  function useCollection(scope) {
    const context = useCollectionContext(name + "CollectionConsumer", scope);
    const getItems = React$v.useCallback(() => {
      const collectionNode = context.collectionRef.current;
      if (!collectionNode) return [];
      const orderedNodes = Array.from(collectionNode.querySelectorAll(`[${ITEM_DATA_ATTR}]`));
      const items = Array.from(context.itemMap.values());
      const orderedItems = items.sort(
        (a, b) => orderedNodes.indexOf(a.ref.current) - orderedNodes.indexOf(b.ref.current)
      );
      return orderedItems;
    }, [context.collectionRef, context.itemMap]);
    return getItems;
  }
  return [
    { Provider: CollectionProvider, Slot: CollectionSlot, ItemSlot: CollectionItemSlot },
    useCollection,
    createCollectionScope
  ];
}

// src/collection.tsx
await importShared('react');

// packages/react/direction/src/direction.tsx
const React$u = await importShared('react');
var DirectionContext = React$u.createContext(void 0);
function useDirection(localDir) {
  const globalDir = React$u.useContext(DirectionContext);
  return localDir || globalDir || "ltr";
}

// src/primitive.tsx
const React$t = await importShared('react');

const ReactDOM$3 = await importShared('react-dom');
var NODES = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "select",
  "span",
  "svg",
  "ul"
];
var Primitive = NODES.reduce((primitive, node) => {
  const Slot = createSlot(`Primitive.${node}`);
  const Node = React$t.forwardRef((props, forwardedRef) => {
    const { asChild, ...primitiveProps } = props;
    const Comp = asChild ? Slot : node;
    if (typeof window !== "undefined") {
      window[Symbol.for("radix-ui")] = true;
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, { ...primitiveProps, ref: forwardedRef });
  });
  Node.displayName = `Primitive.${node}`;
  return { ...primitive, [node]: Node };
}, {});
function dispatchDiscreteCustomEvent(target, event) {
  if (target) ReactDOM$3.flushSync(() => target.dispatchEvent(event));
}

// packages/react/use-callback-ref/src/use-callback-ref.tsx
const React$s = await importShared('react');

function useCallbackRef$1(callback) {
  const callbackRef = React$s.useRef(callback);
  React$s.useEffect(() => {
    callbackRef.current = callback;
  });
  return React$s.useMemo(() => (...args) => callbackRef.current?.(...args), []);
}

// packages/react/use-escape-keydown/src/use-escape-keydown.tsx
const React$r = await importShared('react');
function useEscapeKeydown(onEscapeKeyDownProp, ownerDocument = globalThis?.document) {
  const onEscapeKeyDown = useCallbackRef$1(onEscapeKeyDownProp);
  React$r.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onEscapeKeyDown(event);
      }
    };
    ownerDocument.addEventListener("keydown", handleKeyDown, { capture: true });
    return () => ownerDocument.removeEventListener("keydown", handleKeyDown, { capture: true });
  }, [onEscapeKeyDown, ownerDocument]);
}

// src/dismissable-layer.tsx
const React$q = await importShared('react');
var DISMISSABLE_LAYER_NAME = "DismissableLayer";
var CONTEXT_UPDATE = "dismissableLayer.update";
var POINTER_DOWN_OUTSIDE = "dismissableLayer.pointerDownOutside";
var FOCUS_OUTSIDE = "dismissableLayer.focusOutside";
var originalBodyPointerEvents;
var DismissableLayerContext = React$q.createContext({
  layers: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  branches: /* @__PURE__ */ new Set()
});
var DismissableLayer = React$q.forwardRef(
  (props, forwardedRef) => {
    const {
      disableOutsidePointerEvents = false,
      onEscapeKeyDown,
      onPointerDownOutside,
      onFocusOutside,
      onInteractOutside,
      onDismiss,
      ...layerProps
    } = props;
    const context = React$q.useContext(DismissableLayerContext);
    const [node, setNode] = React$q.useState(null);
    const ownerDocument = node?.ownerDocument ?? globalThis?.document;
    const [, force] = React$q.useState({});
    const composedRefs = useComposedRefs(forwardedRef, (node2) => setNode(node2));
    const layers = Array.from(context.layers);
    const [highestLayerWithOutsidePointerEventsDisabled] = [...context.layersWithOutsidePointerEventsDisabled].slice(-1);
    const highestLayerWithOutsidePointerEventsDisabledIndex = layers.indexOf(highestLayerWithOutsidePointerEventsDisabled);
    const index = node ? layers.indexOf(node) : -1;
    const isBodyPointerEventsDisabled = context.layersWithOutsidePointerEventsDisabled.size > 0;
    const isPointerEventsEnabled = index >= highestLayerWithOutsidePointerEventsDisabledIndex;
    const pointerDownOutside = usePointerDownOutside((event) => {
      const target = event.target;
      const isPointerDownOnBranch = [...context.branches].some((branch) => branch.contains(target));
      if (!isPointerEventsEnabled || isPointerDownOnBranch) return;
      onPointerDownOutside?.(event);
      onInteractOutside?.(event);
      if (!event.defaultPrevented) onDismiss?.();
    }, ownerDocument);
    const focusOutside = useFocusOutside((event) => {
      const target = event.target;
      const isFocusInBranch = [...context.branches].some((branch) => branch.contains(target));
      if (isFocusInBranch) return;
      onFocusOutside?.(event);
      onInteractOutside?.(event);
      if (!event.defaultPrevented) onDismiss?.();
    }, ownerDocument);
    useEscapeKeydown((event) => {
      const isHighestLayer = index === context.layers.size - 1;
      if (!isHighestLayer) return;
      onEscapeKeyDown?.(event);
      if (!event.defaultPrevented && onDismiss) {
        event.preventDefault();
        onDismiss();
      }
    }, ownerDocument);
    React$q.useEffect(() => {
      if (!node) return;
      if (disableOutsidePointerEvents) {
        if (context.layersWithOutsidePointerEventsDisabled.size === 0) {
          originalBodyPointerEvents = ownerDocument.body.style.pointerEvents;
          ownerDocument.body.style.pointerEvents = "none";
        }
        context.layersWithOutsidePointerEventsDisabled.add(node);
      }
      context.layers.add(node);
      dispatchUpdate();
      return () => {
        if (disableOutsidePointerEvents && context.layersWithOutsidePointerEventsDisabled.size === 1) {
          ownerDocument.body.style.pointerEvents = originalBodyPointerEvents;
        }
      };
    }, [node, ownerDocument, disableOutsidePointerEvents, context]);
    React$q.useEffect(() => {
      return () => {
        if (!node) return;
        context.layers.delete(node);
        context.layersWithOutsidePointerEventsDisabled.delete(node);
        dispatchUpdate();
      };
    }, [node, context]);
    React$q.useEffect(() => {
      const handleUpdate = () => force({});
      document.addEventListener(CONTEXT_UPDATE, handleUpdate);
      return () => document.removeEventListener(CONTEXT_UPDATE, handleUpdate);
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        ...layerProps,
        ref: composedRefs,
        style: {
          pointerEvents: isBodyPointerEventsDisabled ? isPointerEventsEnabled ? "auto" : "none" : void 0,
          ...props.style
        },
        onFocusCapture: composeEventHandlers(props.onFocusCapture, focusOutside.onFocusCapture),
        onBlurCapture: composeEventHandlers(props.onBlurCapture, focusOutside.onBlurCapture),
        onPointerDownCapture: composeEventHandlers(
          props.onPointerDownCapture,
          pointerDownOutside.onPointerDownCapture
        )
      }
    );
  }
);
DismissableLayer.displayName = DISMISSABLE_LAYER_NAME;
var BRANCH_NAME = "DismissableLayerBranch";
var DismissableLayerBranch = React$q.forwardRef((props, forwardedRef) => {
  const context = React$q.useContext(DismissableLayerContext);
  const ref = React$q.useRef(null);
  const composedRefs = useComposedRefs(forwardedRef, ref);
  React$q.useEffect(() => {
    const node = ref.current;
    if (node) {
      context.branches.add(node);
      return () => {
        context.branches.delete(node);
      };
    }
  }, [context.branches]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.div, { ...props, ref: composedRefs });
});
DismissableLayerBranch.displayName = BRANCH_NAME;
function usePointerDownOutside(onPointerDownOutside, ownerDocument = globalThis?.document) {
  const handlePointerDownOutside = useCallbackRef$1(onPointerDownOutside);
  const isPointerInsideReactTreeRef = React$q.useRef(false);
  const handleClickRef = React$q.useRef(() => {
  });
  React$q.useEffect(() => {
    const handlePointerDown = (event) => {
      if (event.target && !isPointerInsideReactTreeRef.current) {
        let handleAndDispatchPointerDownOutsideEvent2 = function() {
          handleAndDispatchCustomEvent(
            POINTER_DOWN_OUTSIDE,
            handlePointerDownOutside,
            eventDetail,
            { discrete: true }
          );
        };
        const eventDetail = { originalEvent: event };
        if (event.pointerType === "touch") {
          ownerDocument.removeEventListener("click", handleClickRef.current);
          handleClickRef.current = handleAndDispatchPointerDownOutsideEvent2;
          ownerDocument.addEventListener("click", handleClickRef.current, { once: true });
        } else {
          handleAndDispatchPointerDownOutsideEvent2();
        }
      } else {
        ownerDocument.removeEventListener("click", handleClickRef.current);
      }
      isPointerInsideReactTreeRef.current = false;
    };
    const timerId = window.setTimeout(() => {
      ownerDocument.addEventListener("pointerdown", handlePointerDown);
    }, 0);
    return () => {
      window.clearTimeout(timerId);
      ownerDocument.removeEventListener("pointerdown", handlePointerDown);
      ownerDocument.removeEventListener("click", handleClickRef.current);
    };
  }, [ownerDocument, handlePointerDownOutside]);
  return {
    // ensures we check React component tree (not just DOM tree)
    onPointerDownCapture: () => isPointerInsideReactTreeRef.current = true
  };
}
function useFocusOutside(onFocusOutside, ownerDocument = globalThis?.document) {
  const handleFocusOutside = useCallbackRef$1(onFocusOutside);
  const isFocusInsideReactTreeRef = React$q.useRef(false);
  React$q.useEffect(() => {
    const handleFocus = (event) => {
      if (event.target && !isFocusInsideReactTreeRef.current) {
        const eventDetail = { originalEvent: event };
        handleAndDispatchCustomEvent(FOCUS_OUTSIDE, handleFocusOutside, eventDetail, {
          discrete: false
        });
      }
    };
    ownerDocument.addEventListener("focusin", handleFocus);
    return () => ownerDocument.removeEventListener("focusin", handleFocus);
  }, [ownerDocument, handleFocusOutside]);
  return {
    onFocusCapture: () => isFocusInsideReactTreeRef.current = true,
    onBlurCapture: () => isFocusInsideReactTreeRef.current = false
  };
}
function dispatchUpdate() {
  const event = new CustomEvent(CONTEXT_UPDATE);
  document.dispatchEvent(event);
}
function handleAndDispatchCustomEvent(name, handler, detail, { discrete }) {
  const target = detail.originalEvent.target;
  const event = new CustomEvent(name, { bubbles: false, cancelable: true, detail });
  if (handler) target.addEventListener(name, handler, { once: true });
  if (discrete) {
    dispatchDiscreteCustomEvent(target, event);
  } else {
    target.dispatchEvent(event);
  }
}

// src/focus-guards.tsx
const React$p = await importShared('react');

var count$1 = 0;
function useFocusGuards() {
  React$p.useEffect(() => {
    const edgeGuards = document.querySelectorAll("[data-radix-focus-guard]");
    document.body.insertAdjacentElement("afterbegin", edgeGuards[0] ?? createFocusGuard());
    document.body.insertAdjacentElement("beforeend", edgeGuards[1] ?? createFocusGuard());
    count$1++;
    return () => {
      if (count$1 === 1) {
        document.querySelectorAll("[data-radix-focus-guard]").forEach((node) => node.remove());
      }
      count$1--;
    };
  }, []);
}
function createFocusGuard() {
  const element = document.createElement("span");
  element.setAttribute("data-radix-focus-guard", "");
  element.tabIndex = 0;
  element.style.outline = "none";
  element.style.opacity = "0";
  element.style.position = "fixed";
  element.style.pointerEvents = "none";
  return element;
}

// src/focus-scope.tsx
const React$o = await importShared('react');
var AUTOFOCUS_ON_MOUNT = "focusScope.autoFocusOnMount";
var AUTOFOCUS_ON_UNMOUNT = "focusScope.autoFocusOnUnmount";
var EVENT_OPTIONS = { bubbles: false, cancelable: true };
var FOCUS_SCOPE_NAME = "FocusScope";
var FocusScope = React$o.forwardRef((props, forwardedRef) => {
  const {
    loop = false,
    trapped = false,
    onMountAutoFocus: onMountAutoFocusProp,
    onUnmountAutoFocus: onUnmountAutoFocusProp,
    ...scopeProps
  } = props;
  const [container, setContainer] = React$o.useState(null);
  const onMountAutoFocus = useCallbackRef$1(onMountAutoFocusProp);
  const onUnmountAutoFocus = useCallbackRef$1(onUnmountAutoFocusProp);
  const lastFocusedElementRef = React$o.useRef(null);
  const composedRefs = useComposedRefs(forwardedRef, (node) => setContainer(node));
  const focusScope = React$o.useRef({
    paused: false,
    pause() {
      this.paused = true;
    },
    resume() {
      this.paused = false;
    }
  }).current;
  React$o.useEffect(() => {
    if (trapped) {
      let handleFocusIn2 = function(event) {
        if (focusScope.paused || !container) return;
        const target = event.target;
        if (container.contains(target)) {
          lastFocusedElementRef.current = target;
        } else {
          focus(lastFocusedElementRef.current, { select: true });
        }
      }, handleFocusOut2 = function(event) {
        if (focusScope.paused || !container) return;
        const relatedTarget = event.relatedTarget;
        if (relatedTarget === null) return;
        if (!container.contains(relatedTarget)) {
          focus(lastFocusedElementRef.current, { select: true });
        }
      }, handleMutations2 = function(mutations) {
        const focusedElement = document.activeElement;
        if (focusedElement !== document.body) return;
        for (const mutation of mutations) {
          if (mutation.removedNodes.length > 0) focus(container);
        }
      };
      document.addEventListener("focusin", handleFocusIn2);
      document.addEventListener("focusout", handleFocusOut2);
      const mutationObserver = new MutationObserver(handleMutations2);
      if (container) mutationObserver.observe(container, { childList: true, subtree: true });
      return () => {
        document.removeEventListener("focusin", handleFocusIn2);
        document.removeEventListener("focusout", handleFocusOut2);
        mutationObserver.disconnect();
      };
    }
  }, [trapped, container, focusScope.paused]);
  React$o.useEffect(() => {
    if (container) {
      focusScopesStack.add(focusScope);
      const previouslyFocusedElement = document.activeElement;
      const hasFocusedCandidate = container.contains(previouslyFocusedElement);
      if (!hasFocusedCandidate) {
        const mountEvent = new CustomEvent(AUTOFOCUS_ON_MOUNT, EVENT_OPTIONS);
        container.addEventListener(AUTOFOCUS_ON_MOUNT, onMountAutoFocus);
        container.dispatchEvent(mountEvent);
        if (!mountEvent.defaultPrevented) {
          focusFirst(removeLinks(getTabbableCandidates(container)), { select: true });
          if (document.activeElement === previouslyFocusedElement) {
            focus(container);
          }
        }
      }
      return () => {
        container.removeEventListener(AUTOFOCUS_ON_MOUNT, onMountAutoFocus);
        setTimeout(() => {
          const unmountEvent = new CustomEvent(AUTOFOCUS_ON_UNMOUNT, EVENT_OPTIONS);
          container.addEventListener(AUTOFOCUS_ON_UNMOUNT, onUnmountAutoFocus);
          container.dispatchEvent(unmountEvent);
          if (!unmountEvent.defaultPrevented) {
            focus(previouslyFocusedElement ?? document.body, { select: true });
          }
          container.removeEventListener(AUTOFOCUS_ON_UNMOUNT, onUnmountAutoFocus);
          focusScopesStack.remove(focusScope);
        }, 0);
      };
    }
  }, [container, onMountAutoFocus, onUnmountAutoFocus, focusScope]);
  const handleKeyDown = React$o.useCallback(
    (event) => {
      if (!loop && !trapped) return;
      if (focusScope.paused) return;
      const isTabKey = event.key === "Tab" && !event.altKey && !event.ctrlKey && !event.metaKey;
      const focusedElement = document.activeElement;
      if (isTabKey && focusedElement) {
        const container2 = event.currentTarget;
        const [first, last] = getTabbableEdges(container2);
        const hasTabbableElementsInside = first && last;
        if (!hasTabbableElementsInside) {
          if (focusedElement === container2) event.preventDefault();
        } else {
          if (!event.shiftKey && focusedElement === last) {
            event.preventDefault();
            if (loop) focus(first, { select: true });
          } else if (event.shiftKey && focusedElement === first) {
            event.preventDefault();
            if (loop) focus(last, { select: true });
          }
        }
      }
    },
    [loop, trapped, focusScope.paused]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.div, { tabIndex: -1, ...scopeProps, ref: composedRefs, onKeyDown: handleKeyDown });
});
FocusScope.displayName = FOCUS_SCOPE_NAME;
function focusFirst(candidates, { select = false } = {}) {
  const previouslyFocusedElement = document.activeElement;
  for (const candidate of candidates) {
    focus(candidate, { select });
    if (document.activeElement !== previouslyFocusedElement) return;
  }
}
function getTabbableEdges(container) {
  const candidates = getTabbableCandidates(container);
  const first = findVisible(candidates, container);
  const last = findVisible(candidates.reverse(), container);
  return [first, last];
}
function getTabbableCandidates(container) {
  const nodes = [];
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (node) => {
      const isHiddenInput = node.tagName === "INPUT" && node.type === "hidden";
      if (node.disabled || node.hidden || isHiddenInput) return NodeFilter.FILTER_SKIP;
      return node.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  });
  while (walker.nextNode()) nodes.push(walker.currentNode);
  return nodes;
}
function findVisible(elements, container) {
  for (const element of elements) {
    if (!isHidden(element, { upTo: container })) return element;
  }
}
function isHidden(node, { upTo }) {
  if (getComputedStyle(node).visibility === "hidden") return true;
  while (node) {
    if (upTo !== void 0 && node === upTo) return false;
    if (getComputedStyle(node).display === "none") return true;
    node = node.parentElement;
  }
  return false;
}
function isSelectableInput(element) {
  return element instanceof HTMLInputElement && "select" in element;
}
function focus(element, { select = false } = {}) {
  if (element && element.focus) {
    const previouslyFocusedElement = document.activeElement;
    element.focus({ preventScroll: true });
    if (element !== previouslyFocusedElement && isSelectableInput(element) && select)
      element.select();
  }
}
var focusScopesStack = createFocusScopesStack();
function createFocusScopesStack() {
  let stack = [];
  return {
    add(focusScope) {
      const activeFocusScope = stack[0];
      if (focusScope !== activeFocusScope) {
        activeFocusScope?.pause();
      }
      stack = arrayRemove(stack, focusScope);
      stack.unshift(focusScope);
    },
    remove(focusScope) {
      stack = arrayRemove(stack, focusScope);
      stack[0]?.resume();
    }
  };
}
function arrayRemove(array, item) {
  const updatedArray = [...array];
  const index = updatedArray.indexOf(item);
  if (index !== -1) {
    updatedArray.splice(index, 1);
  }
  return updatedArray;
}
function removeLinks(items) {
  return items.filter((item) => item.tagName !== "A");
}

// packages/react/use-layout-effect/src/use-layout-effect.tsx
const React$n = await importShared('react');

var useLayoutEffect2 = globalThis?.document ? React$n.useLayoutEffect : () => {
};

// packages/react/id/src/id.tsx
const React$m = await importShared('react');
var useReactId = React$m[" useId ".trim().toString()] || (() => void 0);
var count = 0;
function useId(deterministicId) {
  const [id, setId] = React$m.useState(useReactId());
  useLayoutEffect2(() => {
    setId((reactId) => reactId ?? String(count++));
  }, [deterministicId]);
  return deterministicId || (id ? `radix-${id}` : "");
}

/**
 * Custom positioning reference element.
 * @see https://floating-ui.com/docs/virtual-elements
 */

const sides = ['top', 'right', 'bottom', 'left'];
const min = Math.min;
const max = Math.max;
const round = Math.round;
const floor = Math.floor;
const createCoords = v => ({
  x: v,
  y: v
});
const oppositeSideMap = {
  left: 'right',
  right: 'left',
  bottom: 'top',
  top: 'bottom'
};
const oppositeAlignmentMap = {
  start: 'end',
  end: 'start'
};
function clamp(start, value, end) {
  return max(start, min(value, end));
}
function evaluate(value, param) {
  return typeof value === 'function' ? value(param) : value;
}
function getSide(placement) {
  return placement.split('-')[0];
}
function getAlignment(placement) {
  return placement.split('-')[1];
}
function getOppositeAxis(axis) {
  return axis === 'x' ? 'y' : 'x';
}
function getAxisLength(axis) {
  return axis === 'y' ? 'height' : 'width';
}
const yAxisSides = /*#__PURE__*/new Set(['top', 'bottom']);
function getSideAxis(placement) {
  return yAxisSides.has(getSide(placement)) ? 'y' : 'x';
}
function getAlignmentAxis(placement) {
  return getOppositeAxis(getSideAxis(placement));
}
function getAlignmentSides(placement, rects, rtl) {
  if (rtl === void 0) {
    rtl = false;
  }
  const alignment = getAlignment(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const length = getAxisLength(alignmentAxis);
  let mainAlignmentSide = alignmentAxis === 'x' ? alignment === (rtl ? 'end' : 'start') ? 'right' : 'left' : alignment === 'start' ? 'bottom' : 'top';
  if (rects.reference[length] > rects.floating[length]) {
    mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
  }
  return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
}
function getExpandedPlacements(placement) {
  const oppositePlacement = getOppositePlacement(placement);
  return [getOppositeAlignmentPlacement(placement), oppositePlacement, getOppositeAlignmentPlacement(oppositePlacement)];
}
function getOppositeAlignmentPlacement(placement) {
  return placement.replace(/start|end/g, alignment => oppositeAlignmentMap[alignment]);
}
const lrPlacement = ['left', 'right'];
const rlPlacement = ['right', 'left'];
const tbPlacement = ['top', 'bottom'];
const btPlacement = ['bottom', 'top'];
function getSideList(side, isStart, rtl) {
  switch (side) {
    case 'top':
    case 'bottom':
      if (rtl) return isStart ? rlPlacement : lrPlacement;
      return isStart ? lrPlacement : rlPlacement;
    case 'left':
    case 'right':
      return isStart ? tbPlacement : btPlacement;
    default:
      return [];
  }
}
function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
  const alignment = getAlignment(placement);
  let list = getSideList(getSide(placement), direction === 'start', rtl);
  if (alignment) {
    list = list.map(side => side + "-" + alignment);
    if (flipAlignment) {
      list = list.concat(list.map(getOppositeAlignmentPlacement));
    }
  }
  return list;
}
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, side => oppositeSideMap[side]);
}
function expandPaddingObject(padding) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...padding
  };
}
function getPaddingObject(padding) {
  return typeof padding !== 'number' ? expandPaddingObject(padding) : {
    top: padding,
    right: padding,
    bottom: padding,
    left: padding
  };
}
function rectToClientRect(rect) {
  const {
    x,
    y,
    width,
    height
  } = rect;
  return {
    width,
    height,
    top: y,
    left: x,
    right: x + width,
    bottom: y + height,
    x,
    y
  };
}

function computeCoordsFromPlacement(_ref, placement, rtl) {
  let {
    reference,
    floating
  } = _ref;
  const sideAxis = getSideAxis(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const alignLength = getAxisLength(alignmentAxis);
  const side = getSide(placement);
  const isVertical = sideAxis === 'y';
  const commonX = reference.x + reference.width / 2 - floating.width / 2;
  const commonY = reference.y + reference.height / 2 - floating.height / 2;
  const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
  let coords;
  switch (side) {
    case 'top':
      coords = {
        x: commonX,
        y: reference.y - floating.height
      };
      break;
    case 'bottom':
      coords = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;
    case 'right':
      coords = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;
    case 'left':
      coords = {
        x: reference.x - floating.width,
        y: commonY
      };
      break;
    default:
      coords = {
        x: reference.x,
        y: reference.y
      };
  }
  switch (getAlignment(placement)) {
    case 'start':
      coords[alignmentAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
      break;
    case 'end':
      coords[alignmentAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
      break;
  }
  return coords;
}

/**
 * Resolves with an object of overflow side offsets that determine how much the
 * element is overflowing a given clipping boundary on each side.
 * - positive = overflowing the boundary by that number of pixels
 * - negative = how many pixels left before it will overflow
 * - 0 = lies flush with the boundary
 * @see https://floating-ui.com/docs/detectOverflow
 */
async function detectOverflow(state, options) {
  var _await$platform$isEle;
  if (options === void 0) {
    options = {};
  }
  const {
    x,
    y,
    platform,
    rects,
    elements,
    strategy
  } = state;
  const {
    boundary = 'clippingAncestors',
    rootBoundary = 'viewport',
    elementContext = 'floating',
    altBoundary = false,
    padding = 0
  } = evaluate(options, state);
  const paddingObject = getPaddingObject(padding);
  const altContext = elementContext === 'floating' ? 'reference' : 'floating';
  const element = elements[altBoundary ? altContext : elementContext];
  const clippingClientRect = rectToClientRect(await platform.getClippingRect({
    element: ((_await$platform$isEle = await (platform.isElement == null ? void 0 : platform.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || (await (platform.getDocumentElement == null ? void 0 : platform.getDocumentElement(elements.floating))),
    boundary,
    rootBoundary,
    strategy
  }));
  const rect = elementContext === 'floating' ? {
    x,
    y,
    width: rects.floating.width,
    height: rects.floating.height
  } : rects.reference;
  const offsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(elements.floating));
  const offsetScale = (await (platform.isElement == null ? void 0 : platform.isElement(offsetParent))) ? (await (platform.getScale == null ? void 0 : platform.getScale(offsetParent))) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  };
  const elementClientRect = rectToClientRect(platform.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements,
    rect,
    offsetParent,
    strategy
  }) : rect);
  return {
    top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
    bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
    left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
    right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
  };
}

/**
 * Computes the `x` and `y` coordinates that will place the floating element
 * next to a given reference element.
 *
 * This export does not have any `platform` interface logic. You will need to
 * write one for the platform you are using Floating UI with.
 */
const computePosition$1 = async (reference, floating, config) => {
  const {
    placement = 'bottom',
    strategy = 'absolute',
    middleware = [],
    platform
  } = config;
  const validMiddleware = middleware.filter(Boolean);
  const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(floating));
  let rects = await platform.getElementRects({
    reference,
    floating,
    strategy
  });
  let {
    x,
    y
  } = computeCoordsFromPlacement(rects, placement, rtl);
  let statefulPlacement = placement;
  let middlewareData = {};
  let resetCount = 0;
  for (let i = 0; i < validMiddleware.length; i++) {
    var _platform$detectOverf;
    const {
      name,
      fn
    } = validMiddleware[i];
    const {
      x: nextX,
      y: nextY,
      data,
      reset
    } = await fn({
      x,
      y,
      initialPlacement: placement,
      placement: statefulPlacement,
      strategy,
      middlewareData,
      rects,
      platform: {
        ...platform,
        detectOverflow: (_platform$detectOverf = platform.detectOverflow) != null ? _platform$detectOverf : detectOverflow
      },
      elements: {
        reference,
        floating
      }
    });
    x = nextX != null ? nextX : x;
    y = nextY != null ? nextY : y;
    middlewareData = {
      ...middlewareData,
      [name]: {
        ...middlewareData[name],
        ...data
      }
    };
    if (reset && resetCount <= 50) {
      resetCount++;
      if (typeof reset === 'object') {
        if (reset.placement) {
          statefulPlacement = reset.placement;
        }
        if (reset.rects) {
          rects = reset.rects === true ? await platform.getElementRects({
            reference,
            floating,
            strategy
          }) : reset.rects;
        }
        ({
          x,
          y
        } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
      }
      i = -1;
    }
  }
  return {
    x,
    y,
    placement: statefulPlacement,
    strategy,
    middlewareData
  };
};

/**
 * Provides data to position an inner element of the floating element so that it
 * appears centered to the reference element.
 * @see https://floating-ui.com/docs/arrow
 */
const arrow$3 = options => ({
  name: 'arrow',
  options,
  async fn(state) {
    const {
      x,
      y,
      placement,
      rects,
      platform,
      elements,
      middlewareData
    } = state;
    // Since `element` is required, we don't Partial<> the type.
    const {
      element,
      padding = 0
    } = evaluate(options, state) || {};
    if (element == null) {
      return {};
    }
    const paddingObject = getPaddingObject(padding);
    const coords = {
      x,
      y
    };
    const axis = getAlignmentAxis(placement);
    const length = getAxisLength(axis);
    const arrowDimensions = await platform.getDimensions(element);
    const isYAxis = axis === 'y';
    const minProp = isYAxis ? 'top' : 'left';
    const maxProp = isYAxis ? 'bottom' : 'right';
    const clientProp = isYAxis ? 'clientHeight' : 'clientWidth';
    const endDiff = rects.reference[length] + rects.reference[axis] - coords[axis] - rects.floating[length];
    const startDiff = coords[axis] - rects.reference[axis];
    const arrowOffsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(element));
    let clientSize = arrowOffsetParent ? arrowOffsetParent[clientProp] : 0;

    // DOM platform can return `window` as the `offsetParent`.
    if (!clientSize || !(await (platform.isElement == null ? void 0 : platform.isElement(arrowOffsetParent)))) {
      clientSize = elements.floating[clientProp] || rects.floating[length];
    }
    const centerToReference = endDiff / 2 - startDiff / 2;

    // If the padding is large enough that it causes the arrow to no longer be
    // centered, modify the padding so that it is centered.
    const largestPossiblePadding = clientSize / 2 - arrowDimensions[length] / 2 - 1;
    const minPadding = min(paddingObject[minProp], largestPossiblePadding);
    const maxPadding = min(paddingObject[maxProp], largestPossiblePadding);

    // Make sure the arrow doesn't overflow the floating element if the center
    // point is outside the floating element's bounds.
    const min$1 = minPadding;
    const max = clientSize - arrowDimensions[length] - maxPadding;
    const center = clientSize / 2 - arrowDimensions[length] / 2 + centerToReference;
    const offset = clamp(min$1, center, max);

    // If the reference is small enough that the arrow's padding causes it to
    // to point to nothing for an aligned placement, adjust the offset of the
    // floating element itself. To ensure `shift()` continues to take action,
    // a single reset is performed when this is true.
    const shouldAddOffset = !middlewareData.arrow && getAlignment(placement) != null && center !== offset && rects.reference[length] / 2 - (center < min$1 ? minPadding : maxPadding) - arrowDimensions[length] / 2 < 0;
    const alignmentOffset = shouldAddOffset ? center < min$1 ? center - min$1 : center - max : 0;
    return {
      [axis]: coords[axis] + alignmentOffset,
      data: {
        [axis]: offset,
        centerOffset: center - offset - alignmentOffset,
        ...(shouldAddOffset && {
          alignmentOffset
        })
      },
      reset: shouldAddOffset
    };
  }
});

/**
 * Optimizes the visibility of the floating element by flipping the `placement`
 * in order to keep it in view when the preferred placement(s) will overflow the
 * clipping boundary. Alternative to `autoPlacement`.
 * @see https://floating-ui.com/docs/flip
 */
const flip$2 = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'flip',
    options,
    async fn(state) {
      var _middlewareData$arrow, _middlewareData$flip;
      const {
        placement,
        middlewareData,
        rects,
        initialPlacement,
        platform,
        elements
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true,
        fallbackPlacements: specifiedFallbackPlacements,
        fallbackStrategy = 'bestFit',
        fallbackAxisSideDirection = 'none',
        flipAlignment = true,
        ...detectOverflowOptions
      } = evaluate(options, state);

      // If a reset by the arrow was caused due to an alignment offset being
      // added, we should skip any logic now since `flip()` has already done its
      // work.
      // https://github.com/floating-ui/floating-ui/issues/2549#issuecomment-1719601643
      if ((_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
        return {};
      }
      const side = getSide(placement);
      const initialSideAxis = getSideAxis(initialPlacement);
      const isBasePlacement = getSide(initialPlacement) === initialPlacement;
      const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
      const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [getOppositePlacement(initialPlacement)] : getExpandedPlacements(initialPlacement));
      const hasFallbackAxisSideDirection = fallbackAxisSideDirection !== 'none';
      if (!specifiedFallbackPlacements && hasFallbackAxisSideDirection) {
        fallbackPlacements.push(...getOppositeAxisPlacements(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
      }
      const placements = [initialPlacement, ...fallbackPlacements];
      const overflow = await platform.detectOverflow(state, detectOverflowOptions);
      const overflows = [];
      let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
      if (checkMainAxis) {
        overflows.push(overflow[side]);
      }
      if (checkCrossAxis) {
        const sides = getAlignmentSides(placement, rects, rtl);
        overflows.push(overflow[sides[0]], overflow[sides[1]]);
      }
      overflowsData = [...overflowsData, {
        placement,
        overflows
      }];

      // One or more sides is overflowing.
      if (!overflows.every(side => side <= 0)) {
        var _middlewareData$flip2, _overflowsData$filter;
        const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
        const nextPlacement = placements[nextIndex];
        if (nextPlacement) {
          const ignoreCrossAxisOverflow = checkCrossAxis === 'alignment' ? initialSideAxis !== getSideAxis(nextPlacement) : false;
          if (!ignoreCrossAxisOverflow ||
          // We leave the current main axis only if every placement on that axis
          // overflows the main axis.
          overflowsData.every(d => getSideAxis(d.placement) === initialSideAxis ? d.overflows[0] > 0 : true)) {
            // Try next placement and re-run the lifecycle.
            return {
              data: {
                index: nextIndex,
                overflows: overflowsData
              },
              reset: {
                placement: nextPlacement
              }
            };
          }
        }

        // First, find the candidates that fit on the mainAxis side of overflow,
        // then find the placement that fits the best on the main crossAxis side.
        let resetPlacement = (_overflowsData$filter = overflowsData.filter(d => d.overflows[0] <= 0).sort((a, b) => a.overflows[1] - b.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;

        // Otherwise fallback.
        if (!resetPlacement) {
          switch (fallbackStrategy) {
            case 'bestFit':
              {
                var _overflowsData$filter2;
                const placement = (_overflowsData$filter2 = overflowsData.filter(d => {
                  if (hasFallbackAxisSideDirection) {
                    const currentSideAxis = getSideAxis(d.placement);
                    return currentSideAxis === initialSideAxis ||
                    // Create a bias to the `y` side axis due to horizontal
                    // reading directions favoring greater width.
                    currentSideAxis === 'y';
                  }
                  return true;
                }).map(d => [d.placement, d.overflows.filter(overflow => overflow > 0).reduce((acc, overflow) => acc + overflow, 0)]).sort((a, b) => a[1] - b[1])[0]) == null ? void 0 : _overflowsData$filter2[0];
                if (placement) {
                  resetPlacement = placement;
                }
                break;
              }
            case 'initialPlacement':
              resetPlacement = initialPlacement;
              break;
          }
        }
        if (placement !== resetPlacement) {
          return {
            reset: {
              placement: resetPlacement
            }
          };
        }
      }
      return {};
    }
  };
};

function getSideOffsets(overflow, rect) {
  return {
    top: overflow.top - rect.height,
    right: overflow.right - rect.width,
    bottom: overflow.bottom - rect.height,
    left: overflow.left - rect.width
  };
}
function isAnySideFullyClipped(overflow) {
  return sides.some(side => overflow[side] >= 0);
}
/**
 * Provides data to hide the floating element in applicable situations, such as
 * when it is not in the same clipping context as the reference element.
 * @see https://floating-ui.com/docs/hide
 */
const hide$2 = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'hide',
    options,
    async fn(state) {
      const {
        rects,
        platform
      } = state;
      const {
        strategy = 'referenceHidden',
        ...detectOverflowOptions
      } = evaluate(options, state);
      switch (strategy) {
        case 'referenceHidden':
          {
            const overflow = await platform.detectOverflow(state, {
              ...detectOverflowOptions,
              elementContext: 'reference'
            });
            const offsets = getSideOffsets(overflow, rects.reference);
            return {
              data: {
                referenceHiddenOffsets: offsets,
                referenceHidden: isAnySideFullyClipped(offsets)
              }
            };
          }
        case 'escaped':
          {
            const overflow = await platform.detectOverflow(state, {
              ...detectOverflowOptions,
              altBoundary: true
            });
            const offsets = getSideOffsets(overflow, rects.floating);
            return {
              data: {
                escapedOffsets: offsets,
                escaped: isAnySideFullyClipped(offsets)
              }
            };
          }
        default:
          {
            return {};
          }
      }
    }
  };
};

const originSides = /*#__PURE__*/new Set(['left', 'top']);

// For type backwards-compatibility, the `OffsetOptions` type was also
// Derivable.

async function convertValueToCoords(state, options) {
  const {
    placement,
    platform,
    elements
  } = state;
  const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
  const side = getSide(placement);
  const alignment = getAlignment(placement);
  const isVertical = getSideAxis(placement) === 'y';
  const mainAxisMulti = originSides.has(side) ? -1 : 1;
  const crossAxisMulti = rtl && isVertical ? -1 : 1;
  const rawValue = evaluate(options, state);

  // eslint-disable-next-line prefer-const
  let {
    mainAxis,
    crossAxis,
    alignmentAxis
  } = typeof rawValue === 'number' ? {
    mainAxis: rawValue,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: rawValue.mainAxis || 0,
    crossAxis: rawValue.crossAxis || 0,
    alignmentAxis: rawValue.alignmentAxis
  };
  if (alignment && typeof alignmentAxis === 'number') {
    crossAxis = alignment === 'end' ? alignmentAxis * -1 : alignmentAxis;
  }
  return isVertical ? {
    x: crossAxis * crossAxisMulti,
    y: mainAxis * mainAxisMulti
  } : {
    x: mainAxis * mainAxisMulti,
    y: crossAxis * crossAxisMulti
  };
}

/**
 * Modifies the placement by translating the floating element along the
 * specified axes.
 * A number (shorthand for `mainAxis` or distance), or an axes configuration
 * object may be passed.
 * @see https://floating-ui.com/docs/offset
 */
const offset$2 = function (options) {
  if (options === void 0) {
    options = 0;
  }
  return {
    name: 'offset',
    options,
    async fn(state) {
      var _middlewareData$offse, _middlewareData$arrow;
      const {
        x,
        y,
        placement,
        middlewareData
      } = state;
      const diffCoords = await convertValueToCoords(state, options);

      // If the placement is the same and the arrow caused an alignment offset
      // then we don't need to change the positioning coordinates.
      if (placement === ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse.placement) && (_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
        return {};
      }
      return {
        x: x + diffCoords.x,
        y: y + diffCoords.y,
        data: {
          ...diffCoords,
          placement
        }
      };
    }
  };
};

/**
 * Optimizes the visibility of the floating element by shifting it in order to
 * keep it in view when it will overflow the clipping boundary.
 * @see https://floating-ui.com/docs/shift
 */
const shift$2 = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'shift',
    options,
    async fn(state) {
      const {
        x,
        y,
        placement,
        platform
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = false,
        limiter = {
          fn: _ref => {
            let {
              x,
              y
            } = _ref;
            return {
              x,
              y
            };
          }
        },
        ...detectOverflowOptions
      } = evaluate(options, state);
      const coords = {
        x,
        y
      };
      const overflow = await platform.detectOverflow(state, detectOverflowOptions);
      const crossAxis = getSideAxis(getSide(placement));
      const mainAxis = getOppositeAxis(crossAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      if (checkMainAxis) {
        const minSide = mainAxis === 'y' ? 'top' : 'left';
        const maxSide = mainAxis === 'y' ? 'bottom' : 'right';
        const min = mainAxisCoord + overflow[minSide];
        const max = mainAxisCoord - overflow[maxSide];
        mainAxisCoord = clamp(min, mainAxisCoord, max);
      }
      if (checkCrossAxis) {
        const minSide = crossAxis === 'y' ? 'top' : 'left';
        const maxSide = crossAxis === 'y' ? 'bottom' : 'right';
        const min = crossAxisCoord + overflow[minSide];
        const max = crossAxisCoord - overflow[maxSide];
        crossAxisCoord = clamp(min, crossAxisCoord, max);
      }
      const limitedCoords = limiter.fn({
        ...state,
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      });
      return {
        ...limitedCoords,
        data: {
          x: limitedCoords.x - x,
          y: limitedCoords.y - y,
          enabled: {
            [mainAxis]: checkMainAxis,
            [crossAxis]: checkCrossAxis
          }
        }
      };
    }
  };
};
/**
 * Built-in `limiter` that will stop `shift()` at a certain point.
 */
const limitShift$2 = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    options,
    fn(state) {
      const {
        x,
        y,
        placement,
        rects,
        middlewareData
      } = state;
      const {
        offset = 0,
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true
      } = evaluate(options, state);
      const coords = {
        x,
        y
      };
      const crossAxis = getSideAxis(placement);
      const mainAxis = getOppositeAxis(crossAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      const rawOffset = evaluate(offset, state);
      const computedOffset = typeof rawOffset === 'number' ? {
        mainAxis: rawOffset,
        crossAxis: 0
      } : {
        mainAxis: 0,
        crossAxis: 0,
        ...rawOffset
      };
      if (checkMainAxis) {
        const len = mainAxis === 'y' ? 'height' : 'width';
        const limitMin = rects.reference[mainAxis] - rects.floating[len] + computedOffset.mainAxis;
        const limitMax = rects.reference[mainAxis] + rects.reference[len] - computedOffset.mainAxis;
        if (mainAxisCoord < limitMin) {
          mainAxisCoord = limitMin;
        } else if (mainAxisCoord > limitMax) {
          mainAxisCoord = limitMax;
        }
      }
      if (checkCrossAxis) {
        var _middlewareData$offse, _middlewareData$offse2;
        const len = mainAxis === 'y' ? 'width' : 'height';
        const isOriginSide = originSides.has(getSide(placement));
        const limitMin = rects.reference[crossAxis] - rects.floating[len] + (isOriginSide ? ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse[crossAxis]) || 0 : 0) + (isOriginSide ? 0 : computedOffset.crossAxis);
        const limitMax = rects.reference[crossAxis] + rects.reference[len] + (isOriginSide ? 0 : ((_middlewareData$offse2 = middlewareData.offset) == null ? void 0 : _middlewareData$offse2[crossAxis]) || 0) - (isOriginSide ? computedOffset.crossAxis : 0);
        if (crossAxisCoord < limitMin) {
          crossAxisCoord = limitMin;
        } else if (crossAxisCoord > limitMax) {
          crossAxisCoord = limitMax;
        }
      }
      return {
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      };
    }
  };
};

/**
 * Provides data that allows you to change the size of the floating element —
 * for instance, prevent it from overflowing the clipping boundary or match the
 * width of the reference element.
 * @see https://floating-ui.com/docs/size
 */
const size$2 = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: 'size',
    options,
    async fn(state) {
      var _state$middlewareData, _state$middlewareData2;
      const {
        placement,
        rects,
        platform,
        elements
      } = state;
      const {
        apply = () => {},
        ...detectOverflowOptions
      } = evaluate(options, state);
      const overflow = await platform.detectOverflow(state, detectOverflowOptions);
      const side = getSide(placement);
      const alignment = getAlignment(placement);
      const isYAxis = getSideAxis(placement) === 'y';
      const {
        width,
        height
      } = rects.floating;
      let heightSide;
      let widthSide;
      if (side === 'top' || side === 'bottom') {
        heightSide = side;
        widthSide = alignment === ((await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating))) ? 'start' : 'end') ? 'left' : 'right';
      } else {
        widthSide = side;
        heightSide = alignment === 'end' ? 'top' : 'bottom';
      }
      const maximumClippingHeight = height - overflow.top - overflow.bottom;
      const maximumClippingWidth = width - overflow.left - overflow.right;
      const overflowAvailableHeight = min(height - overflow[heightSide], maximumClippingHeight);
      const overflowAvailableWidth = min(width - overflow[widthSide], maximumClippingWidth);
      const noShift = !state.middlewareData.shift;
      let availableHeight = overflowAvailableHeight;
      let availableWidth = overflowAvailableWidth;
      if ((_state$middlewareData = state.middlewareData.shift) != null && _state$middlewareData.enabled.x) {
        availableWidth = maximumClippingWidth;
      }
      if ((_state$middlewareData2 = state.middlewareData.shift) != null && _state$middlewareData2.enabled.y) {
        availableHeight = maximumClippingHeight;
      }
      if (noShift && !alignment) {
        const xMin = max(overflow.left, 0);
        const xMax = max(overflow.right, 0);
        const yMin = max(overflow.top, 0);
        const yMax = max(overflow.bottom, 0);
        if (isYAxis) {
          availableWidth = width - 2 * (xMin !== 0 || xMax !== 0 ? xMin + xMax : max(overflow.left, overflow.right));
        } else {
          availableHeight = height - 2 * (yMin !== 0 || yMax !== 0 ? yMin + yMax : max(overflow.top, overflow.bottom));
        }
      }
      await apply({
        ...state,
        availableWidth,
        availableHeight
      });
      const nextDimensions = await platform.getDimensions(elements.floating);
      if (width !== nextDimensions.width || height !== nextDimensions.height) {
        return {
          reset: {
            rects: true
          }
        };
      }
      return {};
    }
  };
};

function hasWindow() {
  return typeof window !== 'undefined';
}
function getNodeName(node) {
  if (isNode(node)) {
    return (node.nodeName || '').toLowerCase();
  }
  // Mocked nodes in testing environments may not be instances of Node. By
  // returning `#document` an infinite loop won't occur.
  // https://github.com/floating-ui/floating-ui/issues/2317
  return '#document';
}
function getWindow(node) {
  var _node$ownerDocument;
  return (node == null || (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
}
function getDocumentElement(node) {
  var _ref;
  return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
}
function isNode(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof Node || value instanceof getWindow(value).Node;
}
function isElement(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof Element || value instanceof getWindow(value).Element;
}
function isHTMLElement(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
}
function isShadowRoot(value) {
  if (!hasWindow() || typeof ShadowRoot === 'undefined') {
    return false;
  }
  return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
}
const invalidOverflowDisplayValues = /*#__PURE__*/new Set(['inline', 'contents']);
function isOverflowElement(element) {
  const {
    overflow,
    overflowX,
    overflowY,
    display
  } = getComputedStyle$1(element);
  return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && !invalidOverflowDisplayValues.has(display);
}
const tableElements = /*#__PURE__*/new Set(['table', 'td', 'th']);
function isTableElement(element) {
  return tableElements.has(getNodeName(element));
}
const topLayerSelectors = [':popover-open', ':modal'];
function isTopLayer(element) {
  return topLayerSelectors.some(selector => {
    try {
      return element.matches(selector);
    } catch (_e) {
      return false;
    }
  });
}
const transformProperties = ['transform', 'translate', 'scale', 'rotate', 'perspective'];
const willChangeValues = ['transform', 'translate', 'scale', 'rotate', 'perspective', 'filter'];
const containValues = ['paint', 'layout', 'strict', 'content'];
function isContainingBlock(elementOrCss) {
  const webkit = isWebKit();
  const css = isElement(elementOrCss) ? getComputedStyle$1(elementOrCss) : elementOrCss;

  // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
  // https://drafts.csswg.org/css-transforms-2/#individual-transforms
  return transformProperties.some(value => css[value] ? css[value] !== 'none' : false) || (css.containerType ? css.containerType !== 'normal' : false) || !webkit && (css.backdropFilter ? css.backdropFilter !== 'none' : false) || !webkit && (css.filter ? css.filter !== 'none' : false) || willChangeValues.some(value => (css.willChange || '').includes(value)) || containValues.some(value => (css.contain || '').includes(value));
}
function getContainingBlock(element) {
  let currentNode = getParentNode(element);
  while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
    if (isContainingBlock(currentNode)) {
      return currentNode;
    } else if (isTopLayer(currentNode)) {
      return null;
    }
    currentNode = getParentNode(currentNode);
  }
  return null;
}
function isWebKit() {
  if (typeof CSS === 'undefined' || !CSS.supports) return false;
  return CSS.supports('-webkit-backdrop-filter', 'none');
}
const lastTraversableNodeNames = /*#__PURE__*/new Set(['html', 'body', '#document']);
function isLastTraversableNode(node) {
  return lastTraversableNodeNames.has(getNodeName(node));
}
function getComputedStyle$1(element) {
  return getWindow(element).getComputedStyle(element);
}
function getNodeScroll(element) {
  if (isElement(element)) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop
    };
  }
  return {
    scrollLeft: element.scrollX,
    scrollTop: element.scrollY
  };
}
function getParentNode(node) {
  if (getNodeName(node) === 'html') {
    return node;
  }
  const result =
  // Step into the shadow DOM of the parent of a slotted node.
  node.assignedSlot ||
  // DOM Element detected.
  node.parentNode ||
  // ShadowRoot detected.
  isShadowRoot(node) && node.host ||
  // Fallback.
  getDocumentElement(node);
  return isShadowRoot(result) ? result.host : result;
}
function getNearestOverflowAncestor(node) {
  const parentNode = getParentNode(node);
  if (isLastTraversableNode(parentNode)) {
    return node.ownerDocument ? node.ownerDocument.body : node.body;
  }
  if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
    return parentNode;
  }
  return getNearestOverflowAncestor(parentNode);
}
function getOverflowAncestors(node, list, traverseIframes) {
  var _node$ownerDocument2;
  if (list === void 0) {
    list = [];
  }
  if (traverseIframes === void 0) {
    traverseIframes = true;
  }
  const scrollableAncestor = getNearestOverflowAncestor(node);
  const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
  const win = getWindow(scrollableAncestor);
  if (isBody) {
    const frameElement = getFrameElement(win);
    return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], frameElement && traverseIframes ? getOverflowAncestors(frameElement) : []);
  }
  return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
}
function getFrameElement(win) {
  return win.parent && Object.getPrototypeOf(win.parent) ? win.frameElement : null;
}

function getCssDimensions(element) {
  const css = getComputedStyle$1(element);
  // In testing environments, the `width` and `height` properties are empty
  // strings for SVG elements, returning NaN. Fallback to `0` in this case.
  let width = parseFloat(css.width) || 0;
  let height = parseFloat(css.height) || 0;
  const hasOffset = isHTMLElement(element);
  const offsetWidth = hasOffset ? element.offsetWidth : width;
  const offsetHeight = hasOffset ? element.offsetHeight : height;
  const shouldFallback = round(width) !== offsetWidth || round(height) !== offsetHeight;
  if (shouldFallback) {
    width = offsetWidth;
    height = offsetHeight;
  }
  return {
    width,
    height,
    $: shouldFallback
  };
}

function unwrapElement(element) {
  return !isElement(element) ? element.contextElement : element;
}

function getScale(element) {
  const domElement = unwrapElement(element);
  if (!isHTMLElement(domElement)) {
    return createCoords(1);
  }
  const rect = domElement.getBoundingClientRect();
  const {
    width,
    height,
    $
  } = getCssDimensions(domElement);
  let x = ($ ? round(rect.width) : rect.width) / width;
  let y = ($ ? round(rect.height) : rect.height) / height;

  // 0, NaN, or Infinity should always fallback to 1.

  if (!x || !Number.isFinite(x)) {
    x = 1;
  }
  if (!y || !Number.isFinite(y)) {
    y = 1;
  }
  return {
    x,
    y
  };
}

const noOffsets = /*#__PURE__*/createCoords(0);
function getVisualOffsets(element) {
  const win = getWindow(element);
  if (!isWebKit() || !win.visualViewport) {
    return noOffsets;
  }
  return {
    x: win.visualViewport.offsetLeft,
    y: win.visualViewport.offsetTop
  };
}
function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
  if (isFixed === void 0) {
    isFixed = false;
  }
  if (!floatingOffsetParent || isFixed && floatingOffsetParent !== getWindow(element)) {
    return false;
  }
  return isFixed;
}

function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
  if (includeScale === void 0) {
    includeScale = false;
  }
  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }
  const clientRect = element.getBoundingClientRect();
  const domElement = unwrapElement(element);
  let scale = createCoords(1);
  if (includeScale) {
    if (offsetParent) {
      if (isElement(offsetParent)) {
        scale = getScale(offsetParent);
      }
    } else {
      scale = getScale(element);
    }
  }
  const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : createCoords(0);
  let x = (clientRect.left + visualOffsets.x) / scale.x;
  let y = (clientRect.top + visualOffsets.y) / scale.y;
  let width = clientRect.width / scale.x;
  let height = clientRect.height / scale.y;
  if (domElement) {
    const win = getWindow(domElement);
    const offsetWin = offsetParent && isElement(offsetParent) ? getWindow(offsetParent) : offsetParent;
    let currentWin = win;
    let currentIFrame = getFrameElement(currentWin);
    while (currentIFrame && offsetParent && offsetWin !== currentWin) {
      const iframeScale = getScale(currentIFrame);
      const iframeRect = currentIFrame.getBoundingClientRect();
      const css = getComputedStyle$1(currentIFrame);
      const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
      const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
      x *= iframeScale.x;
      y *= iframeScale.y;
      width *= iframeScale.x;
      height *= iframeScale.y;
      x += left;
      y += top;
      currentWin = getWindow(currentIFrame);
      currentIFrame = getFrameElement(currentWin);
    }
  }
  return rectToClientRect({
    width,
    height,
    x,
    y
  });
}

// If <html> has a CSS width greater than the viewport, then this will be
// incorrect for RTL.
function getWindowScrollBarX(element, rect) {
  const leftScroll = getNodeScroll(element).scrollLeft;
  if (!rect) {
    return getBoundingClientRect(getDocumentElement(element)).left + leftScroll;
  }
  return rect.left + leftScroll;
}

function getHTMLOffset(documentElement, scroll) {
  const htmlRect = documentElement.getBoundingClientRect();
  const x = htmlRect.left + scroll.scrollLeft - getWindowScrollBarX(documentElement, htmlRect);
  const y = htmlRect.top + scroll.scrollTop;
  return {
    x,
    y
  };
}

function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
  let {
    elements,
    rect,
    offsetParent,
    strategy
  } = _ref;
  const isFixed = strategy === 'fixed';
  const documentElement = getDocumentElement(offsetParent);
  const topLayer = elements ? isTopLayer(elements.floating) : false;
  if (offsetParent === documentElement || topLayer && isFixed) {
    return rect;
  }
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  let scale = createCoords(1);
  const offsets = createCoords(0);
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== 'body' || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isHTMLElement(offsetParent)) {
      const offsetRect = getBoundingClientRect(offsetParent);
      scale = getScale(offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    }
  }
  const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
  return {
    width: rect.width * scale.x,
    height: rect.height * scale.y,
    x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x + htmlOffset.x,
    y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y + htmlOffset.y
  };
}

function getClientRects(element) {
  return Array.from(element.getClientRects());
}

// Gets the entire size of the scrollable document area, even extending outside
// of the `<html>` and `<body>` rect bounds if horizontally scrollable.
function getDocumentRect(element) {
  const html = getDocumentElement(element);
  const scroll = getNodeScroll(element);
  const body = element.ownerDocument.body;
  const width = max(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
  const height = max(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
  let x = -scroll.scrollLeft + getWindowScrollBarX(element);
  const y = -scroll.scrollTop;
  if (getComputedStyle$1(body).direction === 'rtl') {
    x += max(html.clientWidth, body.clientWidth) - width;
  }
  return {
    width,
    height,
    x,
    y
  };
}

// Safety check: ensure the scrollbar space is reasonable in case this
// calculation is affected by unusual styles.
// Most scrollbars leave 15-18px of space.
const SCROLLBAR_MAX = 25;
function getViewportRect(element, strategy) {
  const win = getWindow(element);
  const html = getDocumentElement(element);
  const visualViewport = win.visualViewport;
  let width = html.clientWidth;
  let height = html.clientHeight;
  let x = 0;
  let y = 0;
  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    const visualViewportBased = isWebKit();
    if (!visualViewportBased || visualViewportBased && strategy === 'fixed') {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }
  const windowScrollbarX = getWindowScrollBarX(html);
  // <html> `overflow: hidden` + `scrollbar-gutter: stable` reduces the
  // visual width of the <html> but this is not considered in the size
  // of `html.clientWidth`.
  if (windowScrollbarX <= 0) {
    const doc = html.ownerDocument;
    const body = doc.body;
    const bodyStyles = getComputedStyle(body);
    const bodyMarginInline = doc.compatMode === 'CSS1Compat' ? parseFloat(bodyStyles.marginLeft) + parseFloat(bodyStyles.marginRight) || 0 : 0;
    const clippingStableScrollbarWidth = Math.abs(html.clientWidth - body.clientWidth - bodyMarginInline);
    if (clippingStableScrollbarWidth <= SCROLLBAR_MAX) {
      width -= clippingStableScrollbarWidth;
    }
  } else if (windowScrollbarX <= SCROLLBAR_MAX) {
    // If the <body> scrollbar is on the left, the width needs to be extended
    // by the scrollbar amount so there isn't extra space on the right.
    width += windowScrollbarX;
  }
  return {
    width,
    height,
    x,
    y
  };
}

const absoluteOrFixed = /*#__PURE__*/new Set(['absolute', 'fixed']);
// Returns the inner client rect, subtracting scrollbars if present.
function getInnerBoundingClientRect(element, strategy) {
  const clientRect = getBoundingClientRect(element, true, strategy === 'fixed');
  const top = clientRect.top + element.clientTop;
  const left = clientRect.left + element.clientLeft;
  const scale = isHTMLElement(element) ? getScale(element) : createCoords(1);
  const width = element.clientWidth * scale.x;
  const height = element.clientHeight * scale.y;
  const x = left * scale.x;
  const y = top * scale.y;
  return {
    width,
    height,
    x,
    y
  };
}
function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
  let rect;
  if (clippingAncestor === 'viewport') {
    rect = getViewportRect(element, strategy);
  } else if (clippingAncestor === 'document') {
    rect = getDocumentRect(getDocumentElement(element));
  } else if (isElement(clippingAncestor)) {
    rect = getInnerBoundingClientRect(clippingAncestor, strategy);
  } else {
    const visualOffsets = getVisualOffsets(element);
    rect = {
      x: clippingAncestor.x - visualOffsets.x,
      y: clippingAncestor.y - visualOffsets.y,
      width: clippingAncestor.width,
      height: clippingAncestor.height
    };
  }
  return rectToClientRect(rect);
}
function hasFixedPositionAncestor(element, stopNode) {
  const parentNode = getParentNode(element);
  if (parentNode === stopNode || !isElement(parentNode) || isLastTraversableNode(parentNode)) {
    return false;
  }
  return getComputedStyle$1(parentNode).position === 'fixed' || hasFixedPositionAncestor(parentNode, stopNode);
}

// A "clipping ancestor" is an `overflow` element with the characteristic of
// clipping (or hiding) child elements. This returns all clipping ancestors
// of the given element up the tree.
function getClippingElementAncestors(element, cache) {
  const cachedResult = cache.get(element);
  if (cachedResult) {
    return cachedResult;
  }
  let result = getOverflowAncestors(element, [], false).filter(el => isElement(el) && getNodeName(el) !== 'body');
  let currentContainingBlockComputedStyle = null;
  const elementIsFixed = getComputedStyle$1(element).position === 'fixed';
  let currentNode = elementIsFixed ? getParentNode(element) : element;

  // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
  while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
    const computedStyle = getComputedStyle$1(currentNode);
    const currentNodeIsContaining = isContainingBlock(currentNode);
    if (!currentNodeIsContaining && computedStyle.position === 'fixed') {
      currentContainingBlockComputedStyle = null;
    }
    const shouldDropCurrentNode = elementIsFixed ? !currentNodeIsContaining && !currentContainingBlockComputedStyle : !currentNodeIsContaining && computedStyle.position === 'static' && !!currentContainingBlockComputedStyle && absoluteOrFixed.has(currentContainingBlockComputedStyle.position) || isOverflowElement(currentNode) && !currentNodeIsContaining && hasFixedPositionAncestor(element, currentNode);
    if (shouldDropCurrentNode) {
      // Drop non-containing blocks.
      result = result.filter(ancestor => ancestor !== currentNode);
    } else {
      // Record last containing block for next iteration.
      currentContainingBlockComputedStyle = computedStyle;
    }
    currentNode = getParentNode(currentNode);
  }
  cache.set(element, result);
  return result;
}

// Gets the maximum area that the element is visible in due to any number of
// clipping ancestors.
function getClippingRect(_ref) {
  let {
    element,
    boundary,
    rootBoundary,
    strategy
  } = _ref;
  const elementClippingAncestors = boundary === 'clippingAncestors' ? isTopLayer(element) ? [] : getClippingElementAncestors(element, this._c) : [].concat(boundary);
  const clippingAncestors = [...elementClippingAncestors, rootBoundary];
  const firstClippingAncestor = clippingAncestors[0];
  const clippingRect = clippingAncestors.reduce((accRect, clippingAncestor) => {
    const rect = getClientRectFromClippingAncestor(element, clippingAncestor, strategy);
    accRect.top = max(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromClippingAncestor(element, firstClippingAncestor, strategy));
  return {
    width: clippingRect.right - clippingRect.left,
    height: clippingRect.bottom - clippingRect.top,
    x: clippingRect.left,
    y: clippingRect.top
  };
}

function getDimensions(element) {
  const {
    width,
    height
  } = getCssDimensions(element);
  return {
    width,
    height
  };
}

function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  const documentElement = getDocumentElement(offsetParent);
  const isFixed = strategy === 'fixed';
  const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const offsets = createCoords(0);

  // If the <body> scrollbar appears on the left (e.g. RTL systems). Use
  // Firefox with layout.scrollbar.side = 3 in about:config to test this.
  function setLeftRTLScrollbarOffset() {
    offsets.x = getWindowScrollBarX(documentElement);
  }
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== 'body' || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isOffsetParentAnElement) {
      const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    } else if (documentElement) {
      setLeftRTLScrollbarOffset();
    }
  }
  if (isFixed && !isOffsetParentAnElement && documentElement) {
    setLeftRTLScrollbarOffset();
  }
  const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
  const x = rect.left + scroll.scrollLeft - offsets.x - htmlOffset.x;
  const y = rect.top + scroll.scrollTop - offsets.y - htmlOffset.y;
  return {
    x,
    y,
    width: rect.width,
    height: rect.height
  };
}

function isStaticPositioned(element) {
  return getComputedStyle$1(element).position === 'static';
}

function getTrueOffsetParent(element, polyfill) {
  if (!isHTMLElement(element) || getComputedStyle$1(element).position === 'fixed') {
    return null;
  }
  if (polyfill) {
    return polyfill(element);
  }
  let rawOffsetParent = element.offsetParent;

  // Firefox returns the <html> element as the offsetParent if it's non-static,
  // while Chrome and Safari return the <body> element. The <body> element must
  // be used to perform the correct calculations even if the <html> element is
  // non-static.
  if (getDocumentElement(element) === rawOffsetParent) {
    rawOffsetParent = rawOffsetParent.ownerDocument.body;
  }
  return rawOffsetParent;
}

// Gets the closest ancestor positioned element. Handles some edge cases,
// such as table ancestors and cross browser bugs.
function getOffsetParent(element, polyfill) {
  const win = getWindow(element);
  if (isTopLayer(element)) {
    return win;
  }
  if (!isHTMLElement(element)) {
    let svgOffsetParent = getParentNode(element);
    while (svgOffsetParent && !isLastTraversableNode(svgOffsetParent)) {
      if (isElement(svgOffsetParent) && !isStaticPositioned(svgOffsetParent)) {
        return svgOffsetParent;
      }
      svgOffsetParent = getParentNode(svgOffsetParent);
    }
    return win;
  }
  let offsetParent = getTrueOffsetParent(element, polyfill);
  while (offsetParent && isTableElement(offsetParent) && isStaticPositioned(offsetParent)) {
    offsetParent = getTrueOffsetParent(offsetParent, polyfill);
  }
  if (offsetParent && isLastTraversableNode(offsetParent) && isStaticPositioned(offsetParent) && !isContainingBlock(offsetParent)) {
    return win;
  }
  return offsetParent || getContainingBlock(element) || win;
}

const getElementRects = async function (data) {
  const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
  const getDimensionsFn = this.getDimensions;
  const floatingDimensions = await getDimensionsFn(data.floating);
  return {
    reference: getRectRelativeToOffsetParent(data.reference, await getOffsetParentFn(data.floating), data.strategy),
    floating: {
      x: 0,
      y: 0,
      width: floatingDimensions.width,
      height: floatingDimensions.height
    }
  };
};

function isRTL(element) {
  return getComputedStyle$1(element).direction === 'rtl';
}

const platform = {
  convertOffsetParentRelativeRectToViewportRelativeRect,
  getDocumentElement,
  getClippingRect,
  getOffsetParent,
  getElementRects,
  getClientRects,
  getDimensions,
  getScale,
  isElement,
  isRTL
};

function rectsAreEqual(a, b) {
  return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
}

// https://samthor.au/2021/observing-dom/
function observeMove(element, onMove) {
  let io = null;
  let timeoutId;
  const root = getDocumentElement(element);
  function cleanup() {
    var _io;
    clearTimeout(timeoutId);
    (_io = io) == null || _io.disconnect();
    io = null;
  }
  function refresh(skip, threshold) {
    if (skip === void 0) {
      skip = false;
    }
    if (threshold === void 0) {
      threshold = 1;
    }
    cleanup();
    const elementRectForRootMargin = element.getBoundingClientRect();
    const {
      left,
      top,
      width,
      height
    } = elementRectForRootMargin;
    if (!skip) {
      onMove();
    }
    if (!width || !height) {
      return;
    }
    const insetTop = floor(top);
    const insetRight = floor(root.clientWidth - (left + width));
    const insetBottom = floor(root.clientHeight - (top + height));
    const insetLeft = floor(left);
    const rootMargin = -insetTop + "px " + -insetRight + "px " + -insetBottom + "px " + -insetLeft + "px";
    const options = {
      rootMargin,
      threshold: max(0, min(1, threshold)) || 1
    };
    let isFirstUpdate = true;
    function handleObserve(entries) {
      const ratio = entries[0].intersectionRatio;
      if (ratio !== threshold) {
        if (!isFirstUpdate) {
          return refresh();
        }
        if (!ratio) {
          // If the reference is clipped, the ratio is 0. Throttle the refresh
          // to prevent an infinite loop of updates.
          timeoutId = setTimeout(() => {
            refresh(false, 1e-7);
          }, 1000);
        } else {
          refresh(false, ratio);
        }
      }
      if (ratio === 1 && !rectsAreEqual(elementRectForRootMargin, element.getBoundingClientRect())) {
        // It's possible that even though the ratio is reported as 1, the
        // element is not actually fully within the IntersectionObserver's root
        // area anymore. This can happen under performance constraints. This may
        // be a bug in the browser's IntersectionObserver implementation. To
        // work around this, we compare the element's bounding rect now with
        // what it was at the time we created the IntersectionObserver. If they
        // are not equal then the element moved, so we refresh.
        refresh();
      }
      isFirstUpdate = false;
    }

    // Older browsers don't support a `document` as the root and will throw an
    // error.
    try {
      io = new IntersectionObserver(handleObserve, {
        ...options,
        // Handle <iframe>s
        root: root.ownerDocument
      });
    } catch (_e) {
      io = new IntersectionObserver(handleObserve, options);
    }
    io.observe(element);
  }
  refresh(true);
  return cleanup;
}

/**
 * Automatically updates the position of the floating element when necessary.
 * Should only be called when the floating element is mounted on the DOM or
 * visible on the screen.
 * @returns cleanup function that should be invoked when the floating element is
 * removed from the DOM or hidden from the screen.
 * @see https://floating-ui.com/docs/autoUpdate
 */
function autoUpdate(reference, floating, update, options) {
  if (options === void 0) {
    options = {};
  }
  const {
    ancestorScroll = true,
    ancestorResize = true,
    elementResize = typeof ResizeObserver === 'function',
    layoutShift = typeof IntersectionObserver === 'function',
    animationFrame = false
  } = options;
  const referenceEl = unwrapElement(reference);
  const ancestors = ancestorScroll || ancestorResize ? [...(referenceEl ? getOverflowAncestors(referenceEl) : []), ...getOverflowAncestors(floating)] : [];
  ancestors.forEach(ancestor => {
    ancestorScroll && ancestor.addEventListener('scroll', update, {
      passive: true
    });
    ancestorResize && ancestor.addEventListener('resize', update);
  });
  const cleanupIo = referenceEl && layoutShift ? observeMove(referenceEl, update) : null;
  let reobserveFrame = -1;
  let resizeObserver = null;
  if (elementResize) {
    resizeObserver = new ResizeObserver(_ref => {
      let [firstEntry] = _ref;
      if (firstEntry && firstEntry.target === referenceEl && resizeObserver) {
        // Prevent update loops when using the `size` middleware.
        // https://github.com/floating-ui/floating-ui/issues/1740
        resizeObserver.unobserve(floating);
        cancelAnimationFrame(reobserveFrame);
        reobserveFrame = requestAnimationFrame(() => {
          var _resizeObserver;
          (_resizeObserver = resizeObserver) == null || _resizeObserver.observe(floating);
        });
      }
      update();
    });
    if (referenceEl && !animationFrame) {
      resizeObserver.observe(referenceEl);
    }
    resizeObserver.observe(floating);
  }
  let frameId;
  let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
  if (animationFrame) {
    frameLoop();
  }
  function frameLoop() {
    const nextRefRect = getBoundingClientRect(reference);
    if (prevRefRect && !rectsAreEqual(prevRefRect, nextRefRect)) {
      update();
    }
    prevRefRect = nextRefRect;
    frameId = requestAnimationFrame(frameLoop);
  }
  update();
  return () => {
    var _resizeObserver2;
    ancestors.forEach(ancestor => {
      ancestorScroll && ancestor.removeEventListener('scroll', update);
      ancestorResize && ancestor.removeEventListener('resize', update);
    });
    cleanupIo == null || cleanupIo();
    (_resizeObserver2 = resizeObserver) == null || _resizeObserver2.disconnect();
    resizeObserver = null;
    if (animationFrame) {
      cancelAnimationFrame(frameId);
    }
  };
}

/**
 * Modifies the placement by translating the floating element along the
 * specified axes.
 * A number (shorthand for `mainAxis` or distance), or an axes configuration
 * object may be passed.
 * @see https://floating-ui.com/docs/offset
 */
const offset$1 = offset$2;

/**
 * Optimizes the visibility of the floating element by shifting it in order to
 * keep it in view when it will overflow the clipping boundary.
 * @see https://floating-ui.com/docs/shift
 */
const shift$1 = shift$2;

/**
 * Optimizes the visibility of the floating element by flipping the `placement`
 * in order to keep it in view when the preferred placement(s) will overflow the
 * clipping boundary. Alternative to `autoPlacement`.
 * @see https://floating-ui.com/docs/flip
 */
const flip$1 = flip$2;

/**
 * Provides data that allows you to change the size of the floating element —
 * for instance, prevent it from overflowing the clipping boundary or match the
 * width of the reference element.
 * @see https://floating-ui.com/docs/size
 */
const size$1 = size$2;

/**
 * Provides data to hide the floating element in applicable situations, such as
 * when it is not in the same clipping context as the reference element.
 * @see https://floating-ui.com/docs/hide
 */
const hide$1 = hide$2;

/**
 * Provides data to position an inner element of the floating element so that it
 * appears centered to the reference element.
 * @see https://floating-ui.com/docs/arrow
 */
const arrow$2 = arrow$3;

/**
 * Built-in `limiter` that will stop `shift()` at a certain point.
 */
const limitShift$1 = limitShift$2;

/**
 * Computes the `x` and `y` coordinates that will place the floating element
 * next to a given reference element.
 */
const computePosition = (reference, floating, options) => {
  // This caches the expensive `getClippingElementAncestors` function so that
  // multiple lifecycle resets re-use the same result. It only lives for a
  // single call. If other functions become expensive, we can add them as well.
  const cache = new Map();
  const mergedOptions = {
    platform,
    ...options
  };
  const platformWithCache = {
    ...mergedOptions.platform,
    _c: cache
  };
  return computePosition$1(reference, floating, {
    ...mergedOptions,
    platform: platformWithCache
  });
};

const React$l = await importShared('react');

const {useLayoutEffect} = await importShared('react');

const ReactDOM$2 = await importShared('react-dom');


var isClient = typeof document !== 'undefined';

var noop = function noop() {};
var index = isClient ? useLayoutEffect : noop;

// Fork of `fast-deep-equal` that only does the comparisons we need and compares
// functions
function deepEqual(a, b) {
  if (a === b) {
    return true;
  }
  if (typeof a !== typeof b) {
    return false;
  }
  if (typeof a === 'function' && a.toString() === b.toString()) {
    return true;
  }
  let length;
  let i;
  let keys;
  if (a && b && typeof a === 'object') {
    if (Array.isArray(a)) {
      length = a.length;
      if (length !== b.length) return false;
      for (i = length; i-- !== 0;) {
        if (!deepEqual(a[i], b[i])) {
          return false;
        }
      }
      return true;
    }
    keys = Object.keys(a);
    length = keys.length;
    if (length !== Object.keys(b).length) {
      return false;
    }
    for (i = length; i-- !== 0;) {
      if (!{}.hasOwnProperty.call(b, keys[i])) {
        return false;
      }
    }
    for (i = length; i-- !== 0;) {
      const key = keys[i];
      if (key === '_owner' && a.$$typeof) {
        continue;
      }
      if (!deepEqual(a[key], b[key])) {
        return false;
      }
    }
    return true;
  }
  return a !== a && b !== b;
}

function getDPR(element) {
  if (typeof window === 'undefined') {
    return 1;
  }
  const win = element.ownerDocument.defaultView || window;
  return win.devicePixelRatio || 1;
}

function roundByDPR(element, value) {
  const dpr = getDPR(element);
  return Math.round(value * dpr) / dpr;
}

function useLatestRef(value) {
  const ref = React$l.useRef(value);
  index(() => {
    ref.current = value;
  });
  return ref;
}

/**
 * Provides data to position a floating element.
 * @see https://floating-ui.com/docs/useFloating
 */
function useFloating(options) {
  if (options === void 0) {
    options = {};
  }
  const {
    placement = 'bottom',
    strategy = 'absolute',
    middleware = [],
    platform,
    elements: {
      reference: externalReference,
      floating: externalFloating
    } = {},
    transform = true,
    whileElementsMounted,
    open
  } = options;
  const [data, setData] = React$l.useState({
    x: 0,
    y: 0,
    strategy,
    placement,
    middlewareData: {},
    isPositioned: false
  });
  const [latestMiddleware, setLatestMiddleware] = React$l.useState(middleware);
  if (!deepEqual(latestMiddleware, middleware)) {
    setLatestMiddleware(middleware);
  }
  const [_reference, _setReference] = React$l.useState(null);
  const [_floating, _setFloating] = React$l.useState(null);
  const setReference = React$l.useCallback(node => {
    if (node !== referenceRef.current) {
      referenceRef.current = node;
      _setReference(node);
    }
  }, []);
  const setFloating = React$l.useCallback(node => {
    if (node !== floatingRef.current) {
      floatingRef.current = node;
      _setFloating(node);
    }
  }, []);
  const referenceEl = externalReference || _reference;
  const floatingEl = externalFloating || _floating;
  const referenceRef = React$l.useRef(null);
  const floatingRef = React$l.useRef(null);
  const dataRef = React$l.useRef(data);
  const hasWhileElementsMounted = whileElementsMounted != null;
  const whileElementsMountedRef = useLatestRef(whileElementsMounted);
  const platformRef = useLatestRef(platform);
  const openRef = useLatestRef(open);
  const update = React$l.useCallback(() => {
    if (!referenceRef.current || !floatingRef.current) {
      return;
    }
    const config = {
      placement,
      strategy,
      middleware: latestMiddleware
    };
    if (platformRef.current) {
      config.platform = platformRef.current;
    }
    computePosition(referenceRef.current, floatingRef.current, config).then(data => {
      const fullData = {
        ...data,
        // The floating element's position may be recomputed while it's closed
        // but still mounted (such as when transitioning out). To ensure
        // `isPositioned` will be `false` initially on the next open, avoid
        // setting it to `true` when `open === false` (must be specified).
        isPositioned: openRef.current !== false
      };
      if (isMountedRef.current && !deepEqual(dataRef.current, fullData)) {
        dataRef.current = fullData;
        ReactDOM$2.flushSync(() => {
          setData(fullData);
        });
      }
    });
  }, [latestMiddleware, placement, strategy, platformRef, openRef]);
  index(() => {
    if (open === false && dataRef.current.isPositioned) {
      dataRef.current.isPositioned = false;
      setData(data => ({
        ...data,
        isPositioned: false
      }));
    }
  }, [open]);
  const isMountedRef = React$l.useRef(false);
  index(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  index(() => {
    if (referenceEl) referenceRef.current = referenceEl;
    if (floatingEl) floatingRef.current = floatingEl;
    if (referenceEl && floatingEl) {
      if (whileElementsMountedRef.current) {
        return whileElementsMountedRef.current(referenceEl, floatingEl, update);
      }
      update();
    }
  }, [referenceEl, floatingEl, update, whileElementsMountedRef, hasWhileElementsMounted]);
  const refs = React$l.useMemo(() => ({
    reference: referenceRef,
    floating: floatingRef,
    setReference,
    setFloating
  }), [setReference, setFloating]);
  const elements = React$l.useMemo(() => ({
    reference: referenceEl,
    floating: floatingEl
  }), [referenceEl, floatingEl]);
  const floatingStyles = React$l.useMemo(() => {
    const initialStyles = {
      position: strategy,
      left: 0,
      top: 0
    };
    if (!elements.floating) {
      return initialStyles;
    }
    const x = roundByDPR(elements.floating, data.x);
    const y = roundByDPR(elements.floating, data.y);
    if (transform) {
      return {
        ...initialStyles,
        transform: "translate(" + x + "px, " + y + "px)",
        ...(getDPR(elements.floating) >= 1.5 && {
          willChange: 'transform'
        })
      };
    }
    return {
      position: strategy,
      left: x,
      top: y
    };
  }, [strategy, transform, elements.floating, data.x, data.y]);
  return React$l.useMemo(() => ({
    ...data,
    update,
    refs,
    elements,
    floatingStyles
  }), [data, update, refs, elements, floatingStyles]);
}

/**
 * Provides data to position an inner element of the floating element so that it
 * appears centered to the reference element.
 * This wraps the core `arrow` middleware to allow React refs as the element.
 * @see https://floating-ui.com/docs/arrow
 */
const arrow$1 = options => {
  function isRef(value) {
    return {}.hasOwnProperty.call(value, 'current');
  }
  return {
    name: 'arrow',
    options,
    fn(state) {
      const {
        element,
        padding
      } = typeof options === 'function' ? options(state) : options;
      if (element && isRef(element)) {
        if (element.current != null) {
          return arrow$2({
            element: element.current,
            padding
          }).fn(state);
        }
        return {};
      }
      if (element) {
        return arrow$2({
          element,
          padding
        }).fn(state);
      }
      return {};
    }
  };
};

/**
 * Modifies the placement by translating the floating element along the
 * specified axes.
 * A number (shorthand for `mainAxis` or distance), or an axes configuration
 * object may be passed.
 * @see https://floating-ui.com/docs/offset
 */
const offset = (options, deps) => ({
  ...offset$1(options),
  options: [options, deps]
});

/**
 * Optimizes the visibility of the floating element by shifting it in order to
 * keep it in view when it will overflow the clipping boundary.
 * @see https://floating-ui.com/docs/shift
 */
const shift = (options, deps) => ({
  ...shift$1(options),
  options: [options, deps]
});

/**
 * Built-in `limiter` that will stop `shift()` at a certain point.
 */
const limitShift = (options, deps) => ({
  ...limitShift$1(options),
  options: [options, deps]
});

/**
 * Optimizes the visibility of the floating element by flipping the `placement`
 * in order to keep it in view when the preferred placement(s) will overflow the
 * clipping boundary. Alternative to `autoPlacement`.
 * @see https://floating-ui.com/docs/flip
 */
const flip = (options, deps) => ({
  ...flip$1(options),
  options: [options, deps]
});

/**
 * Provides data that allows you to change the size of the floating element —
 * for instance, prevent it from overflowing the clipping boundary or match the
 * width of the reference element.
 * @see https://floating-ui.com/docs/size
 */
const size = (options, deps) => ({
  ...size$1(options),
  options: [options, deps]
});

/**
 * Provides data to hide the floating element in applicable situations, such as
 * when it is not in the same clipping context as the reference element.
 * @see https://floating-ui.com/docs/hide
 */
const hide = (options, deps) => ({
  ...hide$1(options),
  options: [options, deps]
});

/**
 * Provides data to position an inner element of the floating element so that it
 * appears centered to the reference element.
 * This wraps the core `arrow` middleware to allow React refs as the element.
 * @see https://floating-ui.com/docs/arrow
 */
const arrow = (options, deps) => ({
  ...arrow$1(options),
  options: [options, deps]
});

// src/arrow.tsx
const React$k = await importShared('react');
var NAME$1 = "Arrow";
var Arrow$1 = React$k.forwardRef((props, forwardedRef) => {
  const { children, width = 10, height = 5, ...arrowProps } = props;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Primitive.svg,
    {
      ...arrowProps,
      ref: forwardedRef,
      width,
      height,
      viewBox: "0 0 30 10",
      preserveAspectRatio: "none",
      children: props.asChild ? children : /* @__PURE__ */ jsxRuntimeExports.jsx("polygon", { points: "0,0 30,0 15,10" })
    }
  );
});
Arrow$1.displayName = NAME$1;
var Root$1 = Arrow$1;

// packages/react/use-size/src/use-size.tsx
const React$j = await importShared('react');
function useSize(element) {
  const [size, setSize] = React$j.useState(void 0);
  useLayoutEffect2(() => {
    if (element) {
      setSize({ width: element.offsetWidth, height: element.offsetHeight });
      const resizeObserver = new ResizeObserver((entries) => {
        if (!Array.isArray(entries)) {
          return;
        }
        if (!entries.length) {
          return;
        }
        const entry = entries[0];
        let width;
        let height;
        if ("borderBoxSize" in entry) {
          const borderSizeEntry = entry["borderBoxSize"];
          const borderSize = Array.isArray(borderSizeEntry) ? borderSizeEntry[0] : borderSizeEntry;
          width = borderSize["inlineSize"];
          height = borderSize["blockSize"];
        } else {
          width = element.offsetWidth;
          height = element.offsetHeight;
        }
        setSize({ width, height });
      });
      resizeObserver.observe(element, { box: "border-box" });
      return () => resizeObserver.unobserve(element);
    } else {
      setSize(void 0);
    }
  }, [element]);
  return size;
}

// src/popper.tsx
const React$i = await importShared('react');
var POPPER_NAME = "Popper";
var [createPopperContext, createPopperScope] = createContextScope(POPPER_NAME);
var [PopperProvider, usePopperContext] = createPopperContext(POPPER_NAME);
var Popper = (props) => {
  const { __scopePopper, children } = props;
  const [anchor, setAnchor] = React$i.useState(null);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PopperProvider, { scope: __scopePopper, anchor, onAnchorChange: setAnchor, children });
};
Popper.displayName = POPPER_NAME;
var ANCHOR_NAME$1 = "PopperAnchor";
var PopperAnchor = React$i.forwardRef(
  (props, forwardedRef) => {
    const { __scopePopper, virtualRef, ...anchorProps } = props;
    const context = usePopperContext(ANCHOR_NAME$1, __scopePopper);
    const ref = React$i.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    const anchorRef = React$i.useRef(null);
    React$i.useEffect(() => {
      const previousAnchor = anchorRef.current;
      anchorRef.current = virtualRef?.current || ref.current;
      if (previousAnchor !== anchorRef.current) {
        context.onAnchorChange(anchorRef.current);
      }
    });
    return virtualRef ? null : /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.div, { ...anchorProps, ref: composedRefs });
  }
);
PopperAnchor.displayName = ANCHOR_NAME$1;
var CONTENT_NAME$3 = "PopperContent";
var [PopperContentProvider, useContentContext] = createPopperContext(CONTENT_NAME$3);
var PopperContent = React$i.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopePopper,
      side = "bottom",
      sideOffset = 0,
      align = "center",
      alignOffset = 0,
      arrowPadding = 0,
      avoidCollisions = true,
      collisionBoundary = [],
      collisionPadding: collisionPaddingProp = 0,
      sticky = "partial",
      hideWhenDetached = false,
      updatePositionStrategy = "optimized",
      onPlaced,
      ...contentProps
    } = props;
    const context = usePopperContext(CONTENT_NAME$3, __scopePopper);
    const [content, setContent] = React$i.useState(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setContent(node));
    const [arrow$1, setArrow] = React$i.useState(null);
    const arrowSize = useSize(arrow$1);
    const arrowWidth = arrowSize?.width ?? 0;
    const arrowHeight = arrowSize?.height ?? 0;
    const desiredPlacement = side + (align !== "center" ? "-" + align : "");
    const collisionPadding = typeof collisionPaddingProp === "number" ? collisionPaddingProp : { top: 0, right: 0, bottom: 0, left: 0, ...collisionPaddingProp };
    const boundary = Array.isArray(collisionBoundary) ? collisionBoundary : [collisionBoundary];
    const hasExplicitBoundaries = boundary.length > 0;
    const detectOverflowOptions = {
      padding: collisionPadding,
      boundary: boundary.filter(isNotNull),
      // with `strategy: 'fixed'`, this is the only way to get it to respect boundaries
      altBoundary: hasExplicitBoundaries
    };
    const { refs, floatingStyles, placement, isPositioned, middlewareData } = useFloating({
      // default to `fixed` strategy so users don't have to pick and we also avoid focus scroll issues
      strategy: "fixed",
      placement: desiredPlacement,
      whileElementsMounted: (...args) => {
        const cleanup = autoUpdate(...args, {
          animationFrame: updatePositionStrategy === "always"
        });
        return cleanup;
      },
      elements: {
        reference: context.anchor
      },
      middleware: [
        offset({ mainAxis: sideOffset + arrowHeight, alignmentAxis: alignOffset }),
        avoidCollisions && shift({
          mainAxis: true,
          crossAxis: false,
          limiter: sticky === "partial" ? limitShift() : void 0,
          ...detectOverflowOptions
        }),
        avoidCollisions && flip({ ...detectOverflowOptions }),
        size({
          ...detectOverflowOptions,
          apply: ({ elements, rects, availableWidth, availableHeight }) => {
            const { width: anchorWidth, height: anchorHeight } = rects.reference;
            const contentStyle = elements.floating.style;
            contentStyle.setProperty("--radix-popper-available-width", `${availableWidth}px`);
            contentStyle.setProperty("--radix-popper-available-height", `${availableHeight}px`);
            contentStyle.setProperty("--radix-popper-anchor-width", `${anchorWidth}px`);
            contentStyle.setProperty("--radix-popper-anchor-height", `${anchorHeight}px`);
          }
        }),
        arrow$1 && arrow({ element: arrow$1, padding: arrowPadding }),
        transformOrigin({ arrowWidth, arrowHeight }),
        hideWhenDetached && hide({ strategy: "referenceHidden", ...detectOverflowOptions })
      ]
    });
    const [placedSide, placedAlign] = getSideAndAlignFromPlacement(placement);
    const handlePlaced = useCallbackRef$1(onPlaced);
    useLayoutEffect2(() => {
      if (isPositioned) {
        handlePlaced?.();
      }
    }, [isPositioned, handlePlaced]);
    const arrowX = middlewareData.arrow?.x;
    const arrowY = middlewareData.arrow?.y;
    const cannotCenterArrow = middlewareData.arrow?.centerOffset !== 0;
    const [contentZIndex, setContentZIndex] = React$i.useState();
    useLayoutEffect2(() => {
      if (content) setContentZIndex(window.getComputedStyle(content).zIndex);
    }, [content]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        ref: refs.setFloating,
        "data-radix-popper-content-wrapper": "",
        style: {
          ...floatingStyles,
          transform: isPositioned ? floatingStyles.transform : "translate(0, -200%)",
          // keep off the page when measuring
          minWidth: "max-content",
          zIndex: contentZIndex,
          ["--radix-popper-transform-origin"]: [
            middlewareData.transformOrigin?.x,
            middlewareData.transformOrigin?.y
          ].join(" "),
          // hide the content if using the hide middleware and should be hidden
          // set visibility to hidden and disable pointer events so the UI behaves
          // as if the PopperContent isn't there at all
          ...middlewareData.hide?.referenceHidden && {
            visibility: "hidden",
            pointerEvents: "none"
          }
        },
        dir: props.dir,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          PopperContentProvider,
          {
            scope: __scopePopper,
            placedSide,
            onArrowChange: setArrow,
            arrowX,
            arrowY,
            shouldHideArrow: cannotCenterArrow,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Primitive.div,
              {
                "data-side": placedSide,
                "data-align": placedAlign,
                ...contentProps,
                ref: composedRefs,
                style: {
                  ...contentProps.style,
                  // if the PopperContent hasn't been placed yet (not all measurements done)
                  // we prevent animations so that users's animation don't kick in too early referring wrong sides
                  animation: !isPositioned ? "none" : void 0
                }
              }
            )
          }
        )
      }
    );
  }
);
PopperContent.displayName = CONTENT_NAME$3;
var ARROW_NAME$2 = "PopperArrow";
var OPPOSITE_SIDE = {
  top: "bottom",
  right: "left",
  bottom: "top",
  left: "right"
};
var PopperArrow = React$i.forwardRef(function PopperArrow2(props, forwardedRef) {
  const { __scopePopper, ...arrowProps } = props;
  const contentContext = useContentContext(ARROW_NAME$2, __scopePopper);
  const baseSide = OPPOSITE_SIDE[contentContext.placedSide];
  return (
    // we have to use an extra wrapper because `ResizeObserver` (used by `useSize`)
    // doesn't report size as we'd expect on SVG elements.
    // it reports their bounding box which is effectively the largest path inside the SVG.
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        ref: contentContext.onArrowChange,
        style: {
          position: "absolute",
          left: contentContext.arrowX,
          top: contentContext.arrowY,
          [baseSide]: 0,
          transformOrigin: {
            top: "",
            right: "0 0",
            bottom: "center 0",
            left: "100% 0"
          }[contentContext.placedSide],
          transform: {
            top: "translateY(100%)",
            right: "translateY(50%) rotate(90deg) translateX(-50%)",
            bottom: `rotate(180deg)`,
            left: "translateY(50%) rotate(-90deg) translateX(50%)"
          }[contentContext.placedSide],
          visibility: contentContext.shouldHideArrow ? "hidden" : void 0
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Root$1,
          {
            ...arrowProps,
            ref: forwardedRef,
            style: {
              ...arrowProps.style,
              // ensures the element can be measured correctly (mostly for if SVG)
              display: "block"
            }
          }
        )
      }
    )
  );
});
PopperArrow.displayName = ARROW_NAME$2;
function isNotNull(value) {
  return value !== null;
}
var transformOrigin = (options) => ({
  name: "transformOrigin",
  options,
  fn(data) {
    const { placement, rects, middlewareData } = data;
    const cannotCenterArrow = middlewareData.arrow?.centerOffset !== 0;
    const isArrowHidden = cannotCenterArrow;
    const arrowWidth = isArrowHidden ? 0 : options.arrowWidth;
    const arrowHeight = isArrowHidden ? 0 : options.arrowHeight;
    const [placedSide, placedAlign] = getSideAndAlignFromPlacement(placement);
    const noArrowAlign = { start: "0%", center: "50%", end: "100%" }[placedAlign];
    const arrowXCenter = (middlewareData.arrow?.x ?? 0) + arrowWidth / 2;
    const arrowYCenter = (middlewareData.arrow?.y ?? 0) + arrowHeight / 2;
    let x = "";
    let y = "";
    if (placedSide === "bottom") {
      x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
      y = `${-arrowHeight}px`;
    } else if (placedSide === "top") {
      x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
      y = `${rects.floating.height + arrowHeight}px`;
    } else if (placedSide === "right") {
      x = `${-arrowHeight}px`;
      y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
    } else if (placedSide === "left") {
      x = `${rects.floating.width + arrowHeight}px`;
      y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
    }
    return { data: { x, y } };
  }
});
function getSideAndAlignFromPlacement(placement) {
  const [side, align = "center"] = placement.split("-");
  return [side, align];
}
var Root2$2 = Popper;
var Anchor = PopperAnchor;
var Content$1 = PopperContent;
var Arrow = PopperArrow;

// src/portal.tsx
const React$h = await importShared('react');

const ReactDOM$1 = await importShared('react-dom');
var PORTAL_NAME$3 = "Portal";
var Portal$3 = React$h.forwardRef((props, forwardedRef) => {
  const { container: containerProp, ...portalProps } = props;
  const [mounted, setMounted] = React$h.useState(false);
  useLayoutEffect2(() => setMounted(true), []);
  const container = containerProp || mounted && globalThis?.document?.body;
  return container ? ReactDOM$1.createPortal(/* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.div, { ...portalProps, ref: forwardedRef }), container) : null;
});
Portal$3.displayName = PORTAL_NAME$3;

// src/use-controllable-state.tsx
const React$g = await importShared('react');
var useInsertionEffect = React$g[" useInsertionEffect ".trim().toString()] || useLayoutEffect2;
function useControllableState({
  prop,
  defaultProp,
  onChange = () => {
  },
  caller
}) {
  const [uncontrolledProp, setUncontrolledProp, onChangeRef] = useUncontrolledState({
    defaultProp,
    onChange
  });
  const isControlled = prop !== void 0;
  const value = isControlled ? prop : uncontrolledProp;
  {
    const isControlledRef = React$g.useRef(prop !== void 0);
    React$g.useEffect(() => {
      const wasControlled = isControlledRef.current;
      if (wasControlled !== isControlled) {
        const from = wasControlled ? "controlled" : "uncontrolled";
        const to = isControlled ? "controlled" : "uncontrolled";
        console.warn(
          `${caller} is changing from ${from} to ${to}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`
        );
      }
      isControlledRef.current = isControlled;
    }, [isControlled, caller]);
  }
  const setValue = React$g.useCallback(
    (nextValue) => {
      if (isControlled) {
        const value2 = isFunction(nextValue) ? nextValue(prop) : nextValue;
        if (value2 !== prop) {
          onChangeRef.current?.(value2);
        }
      } else {
        setUncontrolledProp(nextValue);
      }
    },
    [isControlled, prop, setUncontrolledProp, onChangeRef]
  );
  return [value, setValue];
}
function useUncontrolledState({
  defaultProp,
  onChange
}) {
  const [value, setValue] = React$g.useState(defaultProp);
  const prevValueRef = React$g.useRef(value);
  const onChangeRef = React$g.useRef(onChange);
  useInsertionEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  React$g.useEffect(() => {
    if (prevValueRef.current !== value) {
      onChangeRef.current?.(value);
      prevValueRef.current = value;
    }
  }, [value, prevValueRef]);
  return [value, setValue, onChangeRef];
}
function isFunction(value) {
  return typeof value === "function";
}

// src/use-controllable-state-reducer.tsx
await importShared('react');

// packages/react/use-previous/src/use-previous.tsx
const React$f = await importShared('react');

function usePrevious(value) {
  const ref = React$f.useRef({ value, previous: value });
  return React$f.useMemo(() => {
    if (ref.current.value !== value) {
      ref.current.previous = ref.current.value;
      ref.current.value = value;
    }
    return ref.current.previous;
  }, [value]);
}

// src/visually-hidden.tsx
const React$e = await importShared('react');
var VISUALLY_HIDDEN_STYLES = Object.freeze({
  // See: https://github.com/twbs/bootstrap/blob/main/scss/mixins/_visually-hidden.scss
  position: "absolute",
  border: 0,
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  wordWrap: "normal"
});
var NAME = "VisuallyHidden";
var VisuallyHidden = React$e.forwardRef(
  (props, forwardedRef) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.span,
      {
        ...props,
        ref: forwardedRef,
        style: { ...VISUALLY_HIDDEN_STYLES, ...props.style }
      }
    );
  }
);
VisuallyHidden.displayName = NAME;

var getDefaultParent = function (originalTarget) {
    if (typeof document === 'undefined') {
        return null;
    }
    var sampleTarget = Array.isArray(originalTarget) ? originalTarget[0] : originalTarget;
    return sampleTarget.ownerDocument.body;
};
var counterMap = new WeakMap();
var uncontrolledNodes = new WeakMap();
var markerMap = {};
var lockCount = 0;
var unwrapHost = function (node) {
    return node && (node.host || unwrapHost(node.parentNode));
};
var correctTargets = function (parent, targets) {
    return targets
        .map(function (target) {
        if (parent.contains(target)) {
            return target;
        }
        var correctedTarget = unwrapHost(target);
        if (correctedTarget && parent.contains(correctedTarget)) {
            return correctedTarget;
        }
        console.error('aria-hidden', target, 'in not contained inside', parent, '. Doing nothing');
        return null;
    })
        .filter(function (x) { return Boolean(x); });
};
/**
 * Marks everything except given node(or nodes) as aria-hidden
 * @param {Element | Element[]} originalTarget - elements to keep on the page
 * @param [parentNode] - top element, defaults to document.body
 * @param {String} [markerName] - a special attribute to mark every node
 * @param {String} [controlAttribute] - html Attribute to control
 * @return {Undo} undo command
 */
var applyAttributeToOthers = function (originalTarget, parentNode, markerName, controlAttribute) {
    var targets = correctTargets(parentNode, Array.isArray(originalTarget) ? originalTarget : [originalTarget]);
    if (!markerMap[markerName]) {
        markerMap[markerName] = new WeakMap();
    }
    var markerCounter = markerMap[markerName];
    var hiddenNodes = [];
    var elementsToKeep = new Set();
    var elementsToStop = new Set(targets);
    var keep = function (el) {
        if (!el || elementsToKeep.has(el)) {
            return;
        }
        elementsToKeep.add(el);
        keep(el.parentNode);
    };
    targets.forEach(keep);
    var deep = function (parent) {
        if (!parent || elementsToStop.has(parent)) {
            return;
        }
        Array.prototype.forEach.call(parent.children, function (node) {
            if (elementsToKeep.has(node)) {
                deep(node);
            }
            else {
                try {
                    var attr = node.getAttribute(controlAttribute);
                    var alreadyHidden = attr !== null && attr !== 'false';
                    var counterValue = (counterMap.get(node) || 0) + 1;
                    var markerValue = (markerCounter.get(node) || 0) + 1;
                    counterMap.set(node, counterValue);
                    markerCounter.set(node, markerValue);
                    hiddenNodes.push(node);
                    if (counterValue === 1 && alreadyHidden) {
                        uncontrolledNodes.set(node, true);
                    }
                    if (markerValue === 1) {
                        node.setAttribute(markerName, 'true');
                    }
                    if (!alreadyHidden) {
                        node.setAttribute(controlAttribute, 'true');
                    }
                }
                catch (e) {
                    console.error('aria-hidden: cannot operate on ', node, e);
                }
            }
        });
    };
    deep(parentNode);
    elementsToKeep.clear();
    lockCount++;
    return function () {
        hiddenNodes.forEach(function (node) {
            var counterValue = counterMap.get(node) - 1;
            var markerValue = markerCounter.get(node) - 1;
            counterMap.set(node, counterValue);
            markerCounter.set(node, markerValue);
            if (!counterValue) {
                if (!uncontrolledNodes.has(node)) {
                    node.removeAttribute(controlAttribute);
                }
                uncontrolledNodes.delete(node);
            }
            if (!markerValue) {
                node.removeAttribute(markerName);
            }
        });
        lockCount--;
        if (!lockCount) {
            // clear
            counterMap = new WeakMap();
            counterMap = new WeakMap();
            uncontrolledNodes = new WeakMap();
            markerMap = {};
        }
    };
};
/**
 * Marks everything except given node(or nodes) as aria-hidden
 * @param {Element | Element[]} originalTarget - elements to keep on the page
 * @param [parentNode] - top element, defaults to document.body
 * @param {String} [markerName] - a special attribute to mark every node
 * @return {Undo} undo command
 */
var hideOthers = function (originalTarget, parentNode, markerName) {
    if (markerName === void 0) { markerName = 'data-aria-hidden'; }
    var targets = Array.from(Array.isArray(originalTarget) ? originalTarget : [originalTarget]);
    var activeParentNode = getDefaultParent(originalTarget);
    if (!activeParentNode) {
        return function () { return null; };
    }
    // we should not hide aria-live elements - https://github.com/theKashey/aria-hidden/issues/10
    // and script elements, as they have no impact on accessibility.
    targets.push.apply(targets, Array.from(activeParentNode.querySelectorAll('[aria-live], script')));
    return applyAttributeToOthers(targets, activeParentNode, markerName, 'aria-hidden');
};

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


var __assign = function() {
  __assign = Object.assign || function __assign(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
      return t;
  };
  return __assign.apply(this, arguments);
};

function __rest(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
          if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
              t[p[i]] = s[p[i]];
      }
  return t;
}

function __spreadArray(to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
      }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var zeroRightClassName = 'right-scroll-bar-position';
var fullWidthClassName = 'width-before-scroll-bar';
var noScrollbarsClassName = 'with-scroll-bars-hidden';
/**
 * Name of a CSS variable containing the amount of "hidden" scrollbar
 * ! might be undefined ! use will fallback!
 */
var removedBarSizeVariable = '--removed-body-scroll-bar-size';

/**
 * Assigns a value for a given ref, no matter of the ref format
 * @param {RefObject} ref - a callback function or ref object
 * @param value - a new value
 *
 * @see https://github.com/theKashey/use-callback-ref#assignref
 * @example
 * const refObject = useRef();
 * const refFn = (ref) => {....}
 *
 * assignRef(refObject, "refValue");
 * assignRef(refFn, "refValue");
 */
function assignRef(ref, value) {
    if (typeof ref === 'function') {
        ref(value);
    }
    else if (ref) {
        ref.current = value;
    }
    return ref;
}

const {useState: useState$7} = await importShared('react');

/**
 * creates a MutableRef with ref change callback
 * @param initialValue - initial ref value
 * @param {Function} callback - a callback to run when value changes
 *
 * @example
 * const ref = useCallbackRef(0, (newValue, oldValue) => console.log(oldValue, '->', newValue);
 * ref.current = 1;
 * // prints 0 -> 1
 *
 * @see https://reactjs.org/docs/hooks-reference.html#useref
 * @see https://github.com/theKashey/use-callback-ref#usecallbackref---to-replace-reactuseref
 * @returns {MutableRefObject}
 */
function useCallbackRef(initialValue, callback) {
    var ref = useState$7(function () { return ({
        // value
        value: initialValue,
        // last callback
        callback: callback,
        // "memoized" public interface
        facade: {
            get current() {
                return ref.value;
            },
            set current(value) {
                var last = ref.value;
                if (last !== value) {
                    ref.value = value;
                    ref.callback(value, last);
                }
            },
        },
    }); })[0];
    // update callback
    ref.callback = callback;
    return ref.facade;
}

const React$d = await importShared('react');
var useIsomorphicLayoutEffect = typeof window !== 'undefined' ? React$d.useLayoutEffect : React$d.useEffect;
var currentValues = new WeakMap();
/**
 * Merges two or more refs together providing a single interface to set their value
 * @param {RefObject|Ref} refs
 * @returns {MutableRefObject} - a new ref, which translates all changes to {refs}
 *
 * @see {@link mergeRefs} a version without buit-in memoization
 * @see https://github.com/theKashey/use-callback-ref#usemergerefs
 * @example
 * const Component = React.forwardRef((props, ref) => {
 *   const ownRef = useRef();
 *   const domRef = useMergeRefs([ref, ownRef]); // 👈 merge together
 *   return <div ref={domRef}>...</div>
 * }
 */
function useMergeRefs(refs, defaultValue) {
    var callbackRef = useCallbackRef(null, function (newValue) {
        return refs.forEach(function (ref) { return assignRef(ref, newValue); });
    });
    // handle refs changes - added or removed
    useIsomorphicLayoutEffect(function () {
        var oldValue = currentValues.get(callbackRef);
        if (oldValue) {
            var prevRefs_1 = new Set(oldValue);
            var nextRefs_1 = new Set(refs);
            var current_1 = callbackRef.current;
            prevRefs_1.forEach(function (ref) {
                if (!nextRefs_1.has(ref)) {
                    assignRef(ref, null);
                }
            });
            nextRefs_1.forEach(function (ref) {
                if (!prevRefs_1.has(ref)) {
                    assignRef(ref, current_1);
                }
            });
        }
        currentValues.set(callbackRef, refs);
    }, [refs]);
    return callbackRef;
}

function ItoI(a) {
    return a;
}
function innerCreateMedium(defaults, middleware) {
    if (middleware === void 0) { middleware = ItoI; }
    var buffer = [];
    var assigned = false;
    var medium = {
        read: function () {
            if (assigned) {
                throw new Error('Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.');
            }
            if (buffer.length) {
                return buffer[buffer.length - 1];
            }
            return defaults;
        },
        useMedium: function (data) {
            var item = middleware(data, assigned);
            buffer.push(item);
            return function () {
                buffer = buffer.filter(function (x) { return x !== item; });
            };
        },
        assignSyncMedium: function (cb) {
            assigned = true;
            while (buffer.length) {
                var cbs = buffer;
                buffer = [];
                cbs.forEach(cb);
            }
            buffer = {
                push: function (x) { return cb(x); },
                filter: function () { return buffer; },
            };
        },
        assignMedium: function (cb) {
            assigned = true;
            var pendingQueue = [];
            if (buffer.length) {
                var cbs = buffer;
                buffer = [];
                cbs.forEach(cb);
                pendingQueue = buffer;
            }
            var executeQueue = function () {
                var cbs = pendingQueue;
                pendingQueue = [];
                cbs.forEach(cb);
            };
            var cycle = function () { return Promise.resolve().then(executeQueue); };
            cycle();
            buffer = {
                push: function (x) {
                    pendingQueue.push(x);
                    cycle();
                },
                filter: function (filter) {
                    pendingQueue = pendingQueue.filter(filter);
                    return buffer;
                },
            };
        },
    };
    return medium;
}
// eslint-disable-next-line @typescript-eslint/ban-types
function createSidecarMedium(options) {
    if (options === void 0) { options = {}; }
    var medium = innerCreateMedium(null);
    medium.options = __assign({ async: true, ssr: false }, options);
    return medium;
}

const React$c = await importShared('react');

var SideCar$1 = function (_a) {
    var sideCar = _a.sideCar, rest = __rest(_a, ["sideCar"]);
    if (!sideCar) {
        throw new Error('Sidecar: please provide `sideCar` property to import the right car');
    }
    var Target = sideCar.read();
    if (!Target) {
        throw new Error('Sidecar medium not found');
    }
    return React$c.createElement(Target, __assign({}, rest));
};
SideCar$1.isSideCarExport = true;
function exportSidecar(medium, exported) {
    medium.useMedium(exported);
    return SideCar$1;
}

var effectCar = createSidecarMedium();

const React$b = await importShared('react');
var nothing = function () {
    return;
};
/**
 * Removes scrollbar from the page and contain the scroll within the Lock
 */
var RemoveScroll = React$b.forwardRef(function (props, parentRef) {
    var ref = React$b.useRef(null);
    var _a = React$b.useState({
        onScrollCapture: nothing,
        onWheelCapture: nothing,
        onTouchMoveCapture: nothing,
    }), callbacks = _a[0], setCallbacks = _a[1];
    var forwardProps = props.forwardProps, children = props.children, className = props.className, removeScrollBar = props.removeScrollBar, enabled = props.enabled, shards = props.shards, sideCar = props.sideCar, noRelative = props.noRelative, noIsolation = props.noIsolation, inert = props.inert, allowPinchZoom = props.allowPinchZoom, _b = props.as, Container = _b === void 0 ? 'div' : _b, gapMode = props.gapMode, rest = __rest(props, ["forwardProps", "children", "className", "removeScrollBar", "enabled", "shards", "sideCar", "noRelative", "noIsolation", "inert", "allowPinchZoom", "as", "gapMode"]);
    var SideCar = sideCar;
    var containerRef = useMergeRefs([ref, parentRef]);
    var containerProps = __assign(__assign({}, rest), callbacks);
    return (React$b.createElement(React$b.Fragment, null,
        enabled && (React$b.createElement(SideCar, { sideCar: effectCar, removeScrollBar: removeScrollBar, shards: shards, noRelative: noRelative, noIsolation: noIsolation, inert: inert, setCallbacks: setCallbacks, allowPinchZoom: !!allowPinchZoom, lockRef: ref, gapMode: gapMode })),
        forwardProps ? (React$b.cloneElement(React$b.Children.only(children), __assign(__assign({}, containerProps), { ref: containerRef }))) : (React$b.createElement(Container, __assign({}, containerProps, { className: className, ref: containerRef }), children))));
});
RemoveScroll.defaultProps = {
    enabled: true,
    removeScrollBar: true,
    inert: false,
};
RemoveScroll.classNames = {
    fullWidth: fullWidthClassName,
    zeroRight: zeroRightClassName,
};

var getNonce = function () {
    if (typeof __webpack_nonce__ !== 'undefined') {
        return __webpack_nonce__;
    }
    return undefined;
};

function makeStyleTag() {
    if (!document)
        return null;
    var tag = document.createElement('style');
    tag.type = 'text/css';
    var nonce = getNonce();
    if (nonce) {
        tag.setAttribute('nonce', nonce);
    }
    return tag;
}
function injectStyles(tag, css) {
    // @ts-ignore
    if (tag.styleSheet) {
        // @ts-ignore
        tag.styleSheet.cssText = css;
    }
    else {
        tag.appendChild(document.createTextNode(css));
    }
}
function insertStyleTag(tag) {
    var head = document.head || document.getElementsByTagName('head')[0];
    head.appendChild(tag);
}
var stylesheetSingleton = function () {
    var counter = 0;
    var stylesheet = null;
    return {
        add: function (style) {
            if (counter == 0) {
                if ((stylesheet = makeStyleTag())) {
                    injectStyles(stylesheet, style);
                    insertStyleTag(stylesheet);
                }
            }
            counter++;
        },
        remove: function () {
            counter--;
            if (!counter && stylesheet) {
                stylesheet.parentNode && stylesheet.parentNode.removeChild(stylesheet);
                stylesheet = null;
            }
        },
    };
};

const React$a = await importShared('react');
/**
 * creates a hook to control style singleton
 * @see {@link styleSingleton} for a safer component version
 * @example
 * ```tsx
 * const useStyle = styleHookSingleton();
 * ///
 * useStyle('body { overflow: hidden}');
 */
var styleHookSingleton = function () {
    var sheet = stylesheetSingleton();
    return function (styles, isDynamic) {
        React$a.useEffect(function () {
            sheet.add(styles);
            return function () {
                sheet.remove();
            };
        }, [styles && isDynamic]);
    };
};

/**
 * create a Component to add styles on demand
 * - styles are added when first instance is mounted
 * - styles are removed when the last instance is unmounted
 * - changing styles in runtime does nothing unless dynamic is set. But with multiple components that can lead to the undefined behavior
 */
var styleSingleton = function () {
    var useStyle = styleHookSingleton();
    var Sheet = function (_a) {
        var styles = _a.styles, dynamic = _a.dynamic;
        useStyle(styles, dynamic);
        return null;
    };
    return Sheet;
};

var zeroGap = {
    left: 0,
    top: 0,
    right: 0,
    gap: 0,
};
var parse = function (x) { return parseInt(x || '', 10) || 0; };
var getOffset = function (gapMode) {
    var cs = window.getComputedStyle(document.body);
    var left = cs[gapMode === 'padding' ? 'paddingLeft' : 'marginLeft'];
    var top = cs[gapMode === 'padding' ? 'paddingTop' : 'marginTop'];
    var right = cs[gapMode === 'padding' ? 'paddingRight' : 'marginRight'];
    return [parse(left), parse(top), parse(right)];
};
var getGapWidth = function (gapMode) {
    if (gapMode === void 0) { gapMode = 'margin'; }
    if (typeof window === 'undefined') {
        return zeroGap;
    }
    var offsets = getOffset(gapMode);
    var documentWidth = document.documentElement.clientWidth;
    var windowWidth = window.innerWidth;
    return {
        left: offsets[0],
        top: offsets[1],
        right: offsets[2],
        gap: Math.max(0, windowWidth - documentWidth + offsets[2] - offsets[0]),
    };
};

const React$9 = await importShared('react');
var Style = styleSingleton();
var lockAttribute = 'data-scroll-locked';
// important tip - once we measure scrollBar width and remove them
// we could not repeat this operation
// thus we are using style-singleton - only the first "yet correct" style will be applied.
var getStyles = function (_a, allowRelative, gapMode, important) {
    var left = _a.left, top = _a.top, right = _a.right, gap = _a.gap;
    if (gapMode === void 0) { gapMode = 'margin'; }
    return "\n  .".concat(noScrollbarsClassName, " {\n   overflow: hidden ").concat(important, ";\n   padding-right: ").concat(gap, "px ").concat(important, ";\n  }\n  body[").concat(lockAttribute, "] {\n    overflow: hidden ").concat(important, ";\n    overscroll-behavior: contain;\n    ").concat([
        allowRelative && "position: relative ".concat(important, ";"),
        gapMode === 'margin' &&
            "\n    padding-left: ".concat(left, "px;\n    padding-top: ").concat(top, "px;\n    padding-right: ").concat(right, "px;\n    margin-left:0;\n    margin-top:0;\n    margin-right: ").concat(gap, "px ").concat(important, ";\n    "),
        gapMode === 'padding' && "padding-right: ".concat(gap, "px ").concat(important, ";"),
    ]
        .filter(Boolean)
        .join(''), "\n  }\n  \n  .").concat(zeroRightClassName, " {\n    right: ").concat(gap, "px ").concat(important, ";\n  }\n  \n  .").concat(fullWidthClassName, " {\n    margin-right: ").concat(gap, "px ").concat(important, ";\n  }\n  \n  .").concat(zeroRightClassName, " .").concat(zeroRightClassName, " {\n    right: 0 ").concat(important, ";\n  }\n  \n  .").concat(fullWidthClassName, " .").concat(fullWidthClassName, " {\n    margin-right: 0 ").concat(important, ";\n  }\n  \n  body[").concat(lockAttribute, "] {\n    ").concat(removedBarSizeVariable, ": ").concat(gap, "px;\n  }\n");
};
var getCurrentUseCounter = function () {
    var counter = parseInt(document.body.getAttribute(lockAttribute) || '0', 10);
    return isFinite(counter) ? counter : 0;
};
var useLockAttribute = function () {
    React$9.useEffect(function () {
        document.body.setAttribute(lockAttribute, (getCurrentUseCounter() + 1).toString());
        return function () {
            var newCounter = getCurrentUseCounter() - 1;
            if (newCounter <= 0) {
                document.body.removeAttribute(lockAttribute);
            }
            else {
                document.body.setAttribute(lockAttribute, newCounter.toString());
            }
        };
    }, []);
};
/**
 * Removes page scrollbar and blocks page scroll when mounted
 */
var RemoveScrollBar = function (_a) {
    var noRelative = _a.noRelative, noImportant = _a.noImportant, _b = _a.gapMode, gapMode = _b === void 0 ? 'margin' : _b;
    useLockAttribute();
    /*
     gap will be measured on every component mount
     however it will be used only by the "first" invocation
     due to singleton nature of <Style
     */
    var gap = React$9.useMemo(function () { return getGapWidth(gapMode); }, [gapMode]);
    return React$9.createElement(Style, { styles: getStyles(gap, !noRelative, gapMode, !noImportant ? '!important' : '') });
};

var passiveSupported = false;
if (typeof window !== 'undefined') {
    try {
        var options = Object.defineProperty({}, 'passive', {
            get: function () {
                passiveSupported = true;
                return true;
            },
        });
        // @ts-ignore
        window.addEventListener('test', options, options);
        // @ts-ignore
        window.removeEventListener('test', options, options);
    }
    catch (err) {
        passiveSupported = false;
    }
}
var nonPassive = passiveSupported ? { passive: false } : false;

var alwaysContainsScroll = function (node) {
    // textarea will always _contain_ scroll inside self. It only can be hidden
    return node.tagName === 'TEXTAREA';
};
var elementCanBeScrolled = function (node, overflow) {
    if (!(node instanceof Element)) {
        return false;
    }
    var styles = window.getComputedStyle(node);
    return (
    // not-not-scrollable
    styles[overflow] !== 'hidden' &&
        // contains scroll inside self
        !(styles.overflowY === styles.overflowX && !alwaysContainsScroll(node) && styles[overflow] === 'visible'));
};
var elementCouldBeVScrolled = function (node) { return elementCanBeScrolled(node, 'overflowY'); };
var elementCouldBeHScrolled = function (node) { return elementCanBeScrolled(node, 'overflowX'); };
var locationCouldBeScrolled = function (axis, node) {
    var ownerDocument = node.ownerDocument;
    var current = node;
    do {
        // Skip over shadow root
        if (typeof ShadowRoot !== 'undefined' && current instanceof ShadowRoot) {
            current = current.host;
        }
        var isScrollable = elementCouldBeScrolled(axis, current);
        if (isScrollable) {
            var _a = getScrollVariables(axis, current), scrollHeight = _a[1], clientHeight = _a[2];
            if (scrollHeight > clientHeight) {
                return true;
            }
        }
        current = current.parentNode;
    } while (current && current !== ownerDocument.body);
    return false;
};
var getVScrollVariables = function (_a) {
    var scrollTop = _a.scrollTop, scrollHeight = _a.scrollHeight, clientHeight = _a.clientHeight;
    return [
        scrollTop,
        scrollHeight,
        clientHeight,
    ];
};
var getHScrollVariables = function (_a) {
    var scrollLeft = _a.scrollLeft, scrollWidth = _a.scrollWidth, clientWidth = _a.clientWidth;
    return [
        scrollLeft,
        scrollWidth,
        clientWidth,
    ];
};
var elementCouldBeScrolled = function (axis, node) {
    return axis === 'v' ? elementCouldBeVScrolled(node) : elementCouldBeHScrolled(node);
};
var getScrollVariables = function (axis, node) {
    return axis === 'v' ? getVScrollVariables(node) : getHScrollVariables(node);
};
var getDirectionFactor = function (axis, direction) {
    /**
     * If the element's direction is rtl (right-to-left), then scrollLeft is 0 when the scrollbar is at its rightmost position,
     * and then increasingly negative as you scroll towards the end of the content.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollLeft
     */
    return axis === 'h' && direction === 'rtl' ? -1 : 1;
};
var handleScroll = function (axis, endTarget, event, sourceDelta, noOverscroll) {
    var directionFactor = getDirectionFactor(axis, window.getComputedStyle(endTarget).direction);
    var delta = directionFactor * sourceDelta;
    // find scrollable target
    var target = event.target;
    var targetInLock = endTarget.contains(target);
    var shouldCancelScroll = false;
    var isDeltaPositive = delta > 0;
    var availableScroll = 0;
    var availableScrollTop = 0;
    do {
        if (!target) {
            break;
        }
        var _a = getScrollVariables(axis, target), position = _a[0], scroll_1 = _a[1], capacity = _a[2];
        var elementScroll = scroll_1 - capacity - directionFactor * position;
        if (position || elementScroll) {
            if (elementCouldBeScrolled(axis, target)) {
                availableScroll += elementScroll;
                availableScrollTop += position;
            }
        }
        var parent_1 = target.parentNode;
        // we will "bubble" from ShadowDom in case we are, or just to the parent in normal case
        // this is the same logic used in focus-lock
        target = (parent_1 && parent_1.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? parent_1.host : parent_1);
    } while (
    // portaled content
    (!targetInLock && target !== document.body) ||
        // self content
        (targetInLock && (endTarget.contains(target) || endTarget === target)));
    // handle epsilon around 0 (non standard zoom levels)
    if (isDeltaPositive &&
        ((Math.abs(availableScroll) < 1) || (false))) {
        shouldCancelScroll = true;
    }
    else if (!isDeltaPositive &&
        ((Math.abs(availableScrollTop) < 1) || (false))) {
        shouldCancelScroll = true;
    }
    return shouldCancelScroll;
};

const React$8 = await importShared('react');
var getTouchXY = function (event) {
    return 'changedTouches' in event ? [event.changedTouches[0].clientX, event.changedTouches[0].clientY] : [0, 0];
};
var getDeltaXY = function (event) { return [event.deltaX, event.deltaY]; };
var extractRef = function (ref) {
    return ref && 'current' in ref ? ref.current : ref;
};
var deltaCompare = function (x, y) { return x[0] === y[0] && x[1] === y[1]; };
var generateStyle = function (id) { return "\n  .block-interactivity-".concat(id, " {pointer-events: none;}\n  .allow-interactivity-").concat(id, " {pointer-events: all;}\n"); };
var idCounter = 0;
var lockStack = [];
function RemoveScrollSideCar(props) {
    var shouldPreventQueue = React$8.useRef([]);
    var touchStartRef = React$8.useRef([0, 0]);
    var activeAxis = React$8.useRef();
    var id = React$8.useState(idCounter++)[0];
    var Style = React$8.useState(styleSingleton)[0];
    var lastProps = React$8.useRef(props);
    React$8.useEffect(function () {
        lastProps.current = props;
    }, [props]);
    React$8.useEffect(function () {
        if (props.inert) {
            document.body.classList.add("block-interactivity-".concat(id));
            var allow_1 = __spreadArray([props.lockRef.current], (props.shards || []).map(extractRef), true).filter(Boolean);
            allow_1.forEach(function (el) { return el.classList.add("allow-interactivity-".concat(id)); });
            return function () {
                document.body.classList.remove("block-interactivity-".concat(id));
                allow_1.forEach(function (el) { return el.classList.remove("allow-interactivity-".concat(id)); });
            };
        }
        return;
    }, [props.inert, props.lockRef.current, props.shards]);
    var shouldCancelEvent = React$8.useCallback(function (event, parent) {
        if (('touches' in event && event.touches.length === 2) || (event.type === 'wheel' && event.ctrlKey)) {
            return !lastProps.current.allowPinchZoom;
        }
        var touch = getTouchXY(event);
        var touchStart = touchStartRef.current;
        var deltaX = 'deltaX' in event ? event.deltaX : touchStart[0] - touch[0];
        var deltaY = 'deltaY' in event ? event.deltaY : touchStart[1] - touch[1];
        var currentAxis;
        var target = event.target;
        var moveDirection = Math.abs(deltaX) > Math.abs(deltaY) ? 'h' : 'v';
        // allow horizontal touch move on Range inputs. They will not cause any scroll
        if ('touches' in event && moveDirection === 'h' && target.type === 'range') {
            return false;
        }
        // allow drag selection (iOS); check if selection's anchorNode is the same as target or contains target
        var selection = window.getSelection();
        var anchorNode = selection && selection.anchorNode;
        var isTouchingSelection = anchorNode ? anchorNode === target || anchorNode.contains(target) : false;
        if (isTouchingSelection) {
            return false;
        }
        var canBeScrolledInMainDirection = locationCouldBeScrolled(moveDirection, target);
        if (!canBeScrolledInMainDirection) {
            return true;
        }
        if (canBeScrolledInMainDirection) {
            currentAxis = moveDirection;
        }
        else {
            currentAxis = moveDirection === 'v' ? 'h' : 'v';
            canBeScrolledInMainDirection = locationCouldBeScrolled(moveDirection, target);
            // other axis might be not scrollable
        }
        if (!canBeScrolledInMainDirection) {
            return false;
        }
        if (!activeAxis.current && 'changedTouches' in event && (deltaX || deltaY)) {
            activeAxis.current = currentAxis;
        }
        if (!currentAxis) {
            return true;
        }
        var cancelingAxis = activeAxis.current || currentAxis;
        return handleScroll(cancelingAxis, parent, event, cancelingAxis === 'h' ? deltaX : deltaY);
    }, []);
    var shouldPrevent = React$8.useCallback(function (_event) {
        var event = _event;
        if (!lockStack.length || lockStack[lockStack.length - 1] !== Style) {
            // not the last active
            return;
        }
        var delta = 'deltaY' in event ? getDeltaXY(event) : getTouchXY(event);
        var sourceEvent = shouldPreventQueue.current.filter(function (e) { return e.name === event.type && (e.target === event.target || event.target === e.shadowParent) && deltaCompare(e.delta, delta); })[0];
        // self event, and should be canceled
        if (sourceEvent && sourceEvent.should) {
            if (event.cancelable) {
                event.preventDefault();
            }
            return;
        }
        // outside or shard event
        if (!sourceEvent) {
            var shardNodes = (lastProps.current.shards || [])
                .map(extractRef)
                .filter(Boolean)
                .filter(function (node) { return node.contains(event.target); });
            var shouldStop = shardNodes.length > 0 ? shouldCancelEvent(event, shardNodes[0]) : !lastProps.current.noIsolation;
            if (shouldStop) {
                if (event.cancelable) {
                    event.preventDefault();
                }
            }
        }
    }, []);
    var shouldCancel = React$8.useCallback(function (name, delta, target, should) {
        var event = { name: name, delta: delta, target: target, should: should, shadowParent: getOutermostShadowParent(target) };
        shouldPreventQueue.current.push(event);
        setTimeout(function () {
            shouldPreventQueue.current = shouldPreventQueue.current.filter(function (e) { return e !== event; });
        }, 1);
    }, []);
    var scrollTouchStart = React$8.useCallback(function (event) {
        touchStartRef.current = getTouchXY(event);
        activeAxis.current = undefined;
    }, []);
    var scrollWheel = React$8.useCallback(function (event) {
        shouldCancel(event.type, getDeltaXY(event), event.target, shouldCancelEvent(event, props.lockRef.current));
    }, []);
    var scrollTouchMove = React$8.useCallback(function (event) {
        shouldCancel(event.type, getTouchXY(event), event.target, shouldCancelEvent(event, props.lockRef.current));
    }, []);
    React$8.useEffect(function () {
        lockStack.push(Style);
        props.setCallbacks({
            onScrollCapture: scrollWheel,
            onWheelCapture: scrollWheel,
            onTouchMoveCapture: scrollTouchMove,
        });
        document.addEventListener('wheel', shouldPrevent, nonPassive);
        document.addEventListener('touchmove', shouldPrevent, nonPassive);
        document.addEventListener('touchstart', scrollTouchStart, nonPassive);
        return function () {
            lockStack = lockStack.filter(function (inst) { return inst !== Style; });
            document.removeEventListener('wheel', shouldPrevent, nonPassive);
            document.removeEventListener('touchmove', shouldPrevent, nonPassive);
            document.removeEventListener('touchstart', scrollTouchStart, nonPassive);
        };
    }, []);
    var removeScrollBar = props.removeScrollBar, inert = props.inert;
    return (React$8.createElement(React$8.Fragment, null,
        inert ? React$8.createElement(Style, { styles: generateStyle(id) }) : null,
        removeScrollBar ? React$8.createElement(RemoveScrollBar, { noRelative: props.noRelative, gapMode: props.gapMode }) : null));
}
function getOutermostShadowParent(node) {
    var shadowParent = null;
    while (node !== null) {
        if (node instanceof ShadowRoot) {
            shadowParent = node.host;
            node = node.host;
        }
        node = node.parentNode;
    }
    return shadowParent;
}

const SideCar = exportSidecar(effectCar, RemoveScrollSideCar);

const React$7 = await importShared('react');
var ReactRemoveScroll = React$7.forwardRef(function (props, ref) { return (React$7.createElement(RemoveScroll, __assign({}, props, { ref: ref, sideCar: SideCar }))); });
ReactRemoveScroll.classNames = RemoveScroll.classNames;

// src/select.tsx
const React$6 = await importShared('react');

const ReactDOM = await importShared('react-dom');
var OPEN_KEYS = [" ", "Enter", "ArrowUp", "ArrowDown"];
var SELECTION_KEYS = [" ", "Enter"];
var SELECT_NAME = "Select";
var [Collection, useCollection, createCollectionScope] = createCollection(SELECT_NAME);
var [createSelectContext] = createContextScope(SELECT_NAME, [
  createCollectionScope,
  createPopperScope
]);
var usePopperScope$1 = createPopperScope();
var [SelectProvider, useSelectContext] = createSelectContext(SELECT_NAME);
var [SelectNativeOptionsProvider, useSelectNativeOptionsContext] = createSelectContext(SELECT_NAME);
var Select$1 = (props) => {
  const {
    __scopeSelect,
    children,
    open: openProp,
    defaultOpen,
    onOpenChange,
    value: valueProp,
    defaultValue,
    onValueChange,
    dir,
    name,
    autoComplete,
    disabled,
    required,
    form
  } = props;
  const popperScope = usePopperScope$1(__scopeSelect);
  const [trigger, setTrigger] = React$6.useState(null);
  const [valueNode, setValueNode] = React$6.useState(null);
  const [valueNodeHasChildren, setValueNodeHasChildren] = React$6.useState(false);
  const direction = useDirection(dir);
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
    caller: SELECT_NAME
  });
  const [value, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChange,
    caller: SELECT_NAME
  });
  const triggerPointerDownPosRef = React$6.useRef(null);
  const isFormControl = trigger ? form || !!trigger.closest("form") : true;
  const [nativeOptionsSet, setNativeOptionsSet] = React$6.useState(/* @__PURE__ */ new Set());
  const nativeSelectKey = Array.from(nativeOptionsSet).map((option) => option.props.value).join(";");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root2$2, { ...popperScope, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    SelectProvider,
    {
      required,
      scope: __scopeSelect,
      trigger,
      onTriggerChange: setTrigger,
      valueNode,
      onValueNodeChange: setValueNode,
      valueNodeHasChildren,
      onValueNodeHasChildrenChange: setValueNodeHasChildren,
      contentId: useId(),
      value,
      onValueChange: setValue,
      open,
      onOpenChange: setOpen,
      dir: direction,
      triggerPointerDownPosRef,
      disabled,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Provider, { scope: __scopeSelect, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          SelectNativeOptionsProvider,
          {
            scope: props.__scopeSelect,
            onNativeOptionAdd: React$6.useCallback((option) => {
              setNativeOptionsSet((prev) => new Set(prev).add(option));
            }, []),
            onNativeOptionRemove: React$6.useCallback((option) => {
              setNativeOptionsSet((prev) => {
                const optionsSet = new Set(prev);
                optionsSet.delete(option);
                return optionsSet;
              });
            }, []),
            children
          }
        ) }),
        isFormControl ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          SelectBubbleInput,
          {
            "aria-hidden": true,
            required,
            tabIndex: -1,
            name,
            autoComplete,
            value,
            onChange: (event) => setValue(event.target.value),
            disabled,
            form,
            children: [
              value === void 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "" }) : null,
              Array.from(nativeOptionsSet)
            ]
          },
          nativeSelectKey
        ) : null
      ]
    }
  ) });
};
Select$1.displayName = SELECT_NAME;
var TRIGGER_NAME$2 = "SelectTrigger";
var SelectTrigger$1 = React$6.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSelect, disabled = false, ...triggerProps } = props;
    const popperScope = usePopperScope$1(__scopeSelect);
    const context = useSelectContext(TRIGGER_NAME$2, __scopeSelect);
    const isDisabled = context.disabled || disabled;
    const composedRefs = useComposedRefs(forwardedRef, context.onTriggerChange);
    const getItems = useCollection(__scopeSelect);
    const pointerTypeRef = React$6.useRef("touch");
    const [searchRef, handleTypeaheadSearch, resetTypeahead] = useTypeaheadSearch((search) => {
      const enabledItems = getItems().filter((item) => !item.disabled);
      const currentItem = enabledItems.find((item) => item.value === context.value);
      const nextItem = findNextItem(enabledItems, search, currentItem);
      if (nextItem !== void 0) {
        context.onValueChange(nextItem.value);
      }
    });
    const handleOpen = (pointerEvent) => {
      if (!isDisabled) {
        context.onOpenChange(true);
        resetTypeahead();
      }
      if (pointerEvent) {
        context.triggerPointerDownPosRef.current = {
          x: Math.round(pointerEvent.pageX),
          y: Math.round(pointerEvent.pageY)
        };
      }
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Anchor, { asChild: true, ...popperScope, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.button,
      {
        type: "button",
        role: "combobox",
        "aria-controls": context.contentId,
        "aria-expanded": context.open,
        "aria-required": context.required,
        "aria-autocomplete": "none",
        dir: context.dir,
        "data-state": context.open ? "open" : "closed",
        disabled: isDisabled,
        "data-disabled": isDisabled ? "" : void 0,
        "data-placeholder": shouldShowPlaceholder(context.value) ? "" : void 0,
        ...triggerProps,
        ref: composedRefs,
        onClick: composeEventHandlers(triggerProps.onClick, (event) => {
          event.currentTarget.focus();
          if (pointerTypeRef.current !== "mouse") {
            handleOpen(event);
          }
        }),
        onPointerDown: composeEventHandlers(triggerProps.onPointerDown, (event) => {
          pointerTypeRef.current = event.pointerType;
          const target = event.target;
          if (target.hasPointerCapture(event.pointerId)) {
            target.releasePointerCapture(event.pointerId);
          }
          if (event.button === 0 && event.ctrlKey === false && event.pointerType === "mouse") {
            handleOpen(event);
            event.preventDefault();
          }
        }),
        onKeyDown: composeEventHandlers(triggerProps.onKeyDown, (event) => {
          const isTypingAhead = searchRef.current !== "";
          const isModifierKey = event.ctrlKey || event.altKey || event.metaKey;
          if (!isModifierKey && event.key.length === 1) handleTypeaheadSearch(event.key);
          if (isTypingAhead && event.key === " ") return;
          if (OPEN_KEYS.includes(event.key)) {
            handleOpen();
            event.preventDefault();
          }
        })
      }
    ) });
  }
);
SelectTrigger$1.displayName = TRIGGER_NAME$2;
var VALUE_NAME = "SelectValue";
var SelectValue$1 = React$6.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSelect, className, style, children, placeholder = "", ...valueProps } = props;
    const context = useSelectContext(VALUE_NAME, __scopeSelect);
    const { onValueNodeHasChildrenChange } = context;
    const hasChildren = children !== void 0;
    const composedRefs = useComposedRefs(forwardedRef, context.onValueNodeChange);
    useLayoutEffect2(() => {
      onValueNodeHasChildrenChange(hasChildren);
    }, [onValueNodeHasChildrenChange, hasChildren]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.span,
      {
        ...valueProps,
        ref: composedRefs,
        style: { pointerEvents: "none" },
        children: shouldShowPlaceholder(context.value) ? /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: placeholder }) : children
      }
    );
  }
);
SelectValue$1.displayName = VALUE_NAME;
var ICON_NAME = "SelectIcon";
var SelectIcon = React$6.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSelect, children, ...iconProps } = props;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.span, { "aria-hidden": true, ...iconProps, ref: forwardedRef, children: children || "\u25BC" });
  }
);
SelectIcon.displayName = ICON_NAME;
var PORTAL_NAME$2 = "SelectPortal";
var SelectPortal = (props) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal$3, { asChild: true, ...props });
};
SelectPortal.displayName = PORTAL_NAME$2;
var CONTENT_NAME$2 = "SelectContent";
var SelectContent$1 = React$6.forwardRef(
  (props, forwardedRef) => {
    const context = useSelectContext(CONTENT_NAME$2, props.__scopeSelect);
    const [fragment, setFragment] = React$6.useState();
    useLayoutEffect2(() => {
      setFragment(new DocumentFragment());
    }, []);
    if (!context.open) {
      const frag = fragment;
      return frag ? ReactDOM.createPortal(
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContentProvider, { scope: props.__scopeSelect, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Slot, { scope: props.__scopeSelect, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: props.children }) }) }),
        frag
      ) : null;
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContentImpl, { ...props, ref: forwardedRef });
  }
);
SelectContent$1.displayName = CONTENT_NAME$2;
var CONTENT_MARGIN = 10;
var [SelectContentProvider, useSelectContentContext] = createSelectContext(CONTENT_NAME$2);
var CONTENT_IMPL_NAME = "SelectContentImpl";
var Slot$2 = createSlot("SelectContent.RemoveScroll");
var SelectContentImpl = React$6.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeSelect,
      position = "item-aligned",
      onCloseAutoFocus,
      onEscapeKeyDown,
      onPointerDownOutside,
      //
      // PopperContent props
      side,
      sideOffset,
      align,
      alignOffset,
      arrowPadding,
      collisionBoundary,
      collisionPadding,
      sticky,
      hideWhenDetached,
      avoidCollisions,
      //
      ...contentProps
    } = props;
    const context = useSelectContext(CONTENT_NAME$2, __scopeSelect);
    const [content, setContent] = React$6.useState(null);
    const [viewport, setViewport] = React$6.useState(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setContent(node));
    const [selectedItem, setSelectedItem] = React$6.useState(null);
    const [selectedItemText, setSelectedItemText] = React$6.useState(
      null
    );
    const getItems = useCollection(__scopeSelect);
    const [isPositioned, setIsPositioned] = React$6.useState(false);
    const firstValidItemFoundRef = React$6.useRef(false);
    React$6.useEffect(() => {
      if (content) return hideOthers(content);
    }, [content]);
    useFocusGuards();
    const focusFirst = React$6.useCallback(
      (candidates) => {
        const [firstItem, ...restItems] = getItems().map((item) => item.ref.current);
        const [lastItem] = restItems.slice(-1);
        const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement;
        for (const candidate of candidates) {
          if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return;
          candidate?.scrollIntoView({ block: "nearest" });
          if (candidate === firstItem && viewport) viewport.scrollTop = 0;
          if (candidate === lastItem && viewport) viewport.scrollTop = viewport.scrollHeight;
          candidate?.focus();
          if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) return;
        }
      },
      [getItems, viewport]
    );
    const focusSelectedItem = React$6.useCallback(
      () => focusFirst([selectedItem, content]),
      [focusFirst, selectedItem, content]
    );
    React$6.useEffect(() => {
      if (isPositioned) {
        focusSelectedItem();
      }
    }, [isPositioned, focusSelectedItem]);
    const { onOpenChange, triggerPointerDownPosRef } = context;
    React$6.useEffect(() => {
      if (content) {
        let pointerMoveDelta = { x: 0, y: 0 };
        const handlePointerMove = (event) => {
          pointerMoveDelta = {
            x: Math.abs(Math.round(event.pageX) - (triggerPointerDownPosRef.current?.x ?? 0)),
            y: Math.abs(Math.round(event.pageY) - (triggerPointerDownPosRef.current?.y ?? 0))
          };
        };
        const handlePointerUp = (event) => {
          if (pointerMoveDelta.x <= 10 && pointerMoveDelta.y <= 10) {
            event.preventDefault();
          } else {
            if (!content.contains(event.target)) {
              onOpenChange(false);
            }
          }
          document.removeEventListener("pointermove", handlePointerMove);
          triggerPointerDownPosRef.current = null;
        };
        if (triggerPointerDownPosRef.current !== null) {
          document.addEventListener("pointermove", handlePointerMove);
          document.addEventListener("pointerup", handlePointerUp, { capture: true, once: true });
        }
        return () => {
          document.removeEventListener("pointermove", handlePointerMove);
          document.removeEventListener("pointerup", handlePointerUp, { capture: true });
        };
      }
    }, [content, onOpenChange, triggerPointerDownPosRef]);
    React$6.useEffect(() => {
      const close = () => onOpenChange(false);
      window.addEventListener("blur", close);
      window.addEventListener("resize", close);
      return () => {
        window.removeEventListener("blur", close);
        window.removeEventListener("resize", close);
      };
    }, [onOpenChange]);
    const [searchRef, handleTypeaheadSearch] = useTypeaheadSearch((search) => {
      const enabledItems = getItems().filter((item) => !item.disabled);
      const currentItem = enabledItems.find((item) => item.ref.current === document.activeElement);
      const nextItem = findNextItem(enabledItems, search, currentItem);
      if (nextItem) {
        setTimeout(() => nextItem.ref.current.focus());
      }
    });
    const itemRefCallback = React$6.useCallback(
      (node, value, disabled) => {
        const isFirstValidItem = !firstValidItemFoundRef.current && !disabled;
        const isSelectedItem = context.value !== void 0 && context.value === value;
        if (isSelectedItem || isFirstValidItem) {
          setSelectedItem(node);
          if (isFirstValidItem) firstValidItemFoundRef.current = true;
        }
      },
      [context.value]
    );
    const handleItemLeave = React$6.useCallback(() => content?.focus(), [content]);
    const itemTextRefCallback = React$6.useCallback(
      (node, value, disabled) => {
        const isFirstValidItem = !firstValidItemFoundRef.current && !disabled;
        const isSelectedItem = context.value !== void 0 && context.value === value;
        if (isSelectedItem || isFirstValidItem) {
          setSelectedItemText(node);
        }
      },
      [context.value]
    );
    const SelectPosition = position === "popper" ? SelectPopperPosition : SelectItemAlignedPosition;
    const popperContentProps = SelectPosition === SelectPopperPosition ? {
      side,
      sideOffset,
      align,
      alignOffset,
      arrowPadding,
      collisionBoundary,
      collisionPadding,
      sticky,
      hideWhenDetached,
      avoidCollisions
    } : {};
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      SelectContentProvider,
      {
        scope: __scopeSelect,
        content,
        viewport,
        onViewportChange: setViewport,
        itemRefCallback,
        selectedItem,
        onItemLeave: handleItemLeave,
        itemTextRefCallback,
        focusSelectedItem,
        selectedItemText,
        position,
        isPositioned,
        searchRef,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(ReactRemoveScroll, { as: Slot$2, allowPinchZoom: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          FocusScope,
          {
            asChild: true,
            trapped: context.open,
            onMountAutoFocus: (event) => {
              event.preventDefault();
            },
            onUnmountAutoFocus: composeEventHandlers(onCloseAutoFocus, (event) => {
              context.trigger?.focus({ preventScroll: true });
              event.preventDefault();
            }),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              DismissableLayer,
              {
                asChild: true,
                disableOutsidePointerEvents: true,
                onEscapeKeyDown,
                onPointerDownOutside,
                onFocusOutside: (event) => event.preventDefault(),
                onDismiss: () => context.onOpenChange(false),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectPosition,
                  {
                    role: "listbox",
                    id: context.contentId,
                    "data-state": context.open ? "open" : "closed",
                    dir: context.dir,
                    onContextMenu: (event) => event.preventDefault(),
                    ...contentProps,
                    ...popperContentProps,
                    onPlaced: () => setIsPositioned(true),
                    ref: composedRefs,
                    style: {
                      // flex layout so we can place the scroll buttons properly
                      display: "flex",
                      flexDirection: "column",
                      // reset the outline by default as the content MAY get focused
                      outline: "none",
                      ...contentProps.style
                    },
                    onKeyDown: composeEventHandlers(contentProps.onKeyDown, (event) => {
                      const isModifierKey = event.ctrlKey || event.altKey || event.metaKey;
                      if (event.key === "Tab") event.preventDefault();
                      if (!isModifierKey && event.key.length === 1) handleTypeaheadSearch(event.key);
                      if (["ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) {
                        const items = getItems().filter((item) => !item.disabled);
                        let candidateNodes = items.map((item) => item.ref.current);
                        if (["ArrowUp", "End"].includes(event.key)) {
                          candidateNodes = candidateNodes.slice().reverse();
                        }
                        if (["ArrowUp", "ArrowDown"].includes(event.key)) {
                          const currentElement = event.target;
                          const currentIndex = candidateNodes.indexOf(currentElement);
                          candidateNodes = candidateNodes.slice(currentIndex + 1);
                        }
                        setTimeout(() => focusFirst(candidateNodes));
                        event.preventDefault();
                      }
                    })
                  }
                )
              }
            )
          }
        ) })
      }
    );
  }
);
SelectContentImpl.displayName = CONTENT_IMPL_NAME;
var ITEM_ALIGNED_POSITION_NAME = "SelectItemAlignedPosition";
var SelectItemAlignedPosition = React$6.forwardRef((props, forwardedRef) => {
  const { __scopeSelect, onPlaced, ...popperProps } = props;
  const context = useSelectContext(CONTENT_NAME$2, __scopeSelect);
  const contentContext = useSelectContentContext(CONTENT_NAME$2, __scopeSelect);
  const [contentWrapper, setContentWrapper] = React$6.useState(null);
  const [content, setContent] = React$6.useState(null);
  const composedRefs = useComposedRefs(forwardedRef, (node) => setContent(node));
  const getItems = useCollection(__scopeSelect);
  const shouldExpandOnScrollRef = React$6.useRef(false);
  const shouldRepositionRef = React$6.useRef(true);
  const { viewport, selectedItem, selectedItemText, focusSelectedItem } = contentContext;
  const position = React$6.useCallback(() => {
    if (context.trigger && context.valueNode && contentWrapper && content && viewport && selectedItem && selectedItemText) {
      const triggerRect = context.trigger.getBoundingClientRect();
      const contentRect = content.getBoundingClientRect();
      const valueNodeRect = context.valueNode.getBoundingClientRect();
      const itemTextRect = selectedItemText.getBoundingClientRect();
      if (context.dir !== "rtl") {
        const itemTextOffset = itemTextRect.left - contentRect.left;
        const left = valueNodeRect.left - itemTextOffset;
        const leftDelta = triggerRect.left - left;
        const minContentWidth = triggerRect.width + leftDelta;
        const contentWidth = Math.max(minContentWidth, contentRect.width);
        const rightEdge = window.innerWidth - CONTENT_MARGIN;
        const clampedLeft = clamp$1(left, [
          CONTENT_MARGIN,
          // Prevents the content from going off the starting edge of the
          // viewport. It may still go off the ending edge, but this can be
          // controlled by the user since they may want to manage overflow in a
          // specific way.
          // https://github.com/radix-ui/primitives/issues/2049
          Math.max(CONTENT_MARGIN, rightEdge - contentWidth)
        ]);
        contentWrapper.style.minWidth = minContentWidth + "px";
        contentWrapper.style.left = clampedLeft + "px";
      } else {
        const itemTextOffset = contentRect.right - itemTextRect.right;
        const right = window.innerWidth - valueNodeRect.right - itemTextOffset;
        const rightDelta = window.innerWidth - triggerRect.right - right;
        const minContentWidth = triggerRect.width + rightDelta;
        const contentWidth = Math.max(minContentWidth, contentRect.width);
        const leftEdge = window.innerWidth - CONTENT_MARGIN;
        const clampedRight = clamp$1(right, [
          CONTENT_MARGIN,
          Math.max(CONTENT_MARGIN, leftEdge - contentWidth)
        ]);
        contentWrapper.style.minWidth = minContentWidth + "px";
        contentWrapper.style.right = clampedRight + "px";
      }
      const items = getItems();
      const availableHeight = window.innerHeight - CONTENT_MARGIN * 2;
      const itemsHeight = viewport.scrollHeight;
      const contentStyles = window.getComputedStyle(content);
      const contentBorderTopWidth = parseInt(contentStyles.borderTopWidth, 10);
      const contentPaddingTop = parseInt(contentStyles.paddingTop, 10);
      const contentBorderBottomWidth = parseInt(contentStyles.borderBottomWidth, 10);
      const contentPaddingBottom = parseInt(contentStyles.paddingBottom, 10);
      const fullContentHeight = contentBorderTopWidth + contentPaddingTop + itemsHeight + contentPaddingBottom + contentBorderBottomWidth;
      const minContentHeight = Math.min(selectedItem.offsetHeight * 5, fullContentHeight);
      const viewportStyles = window.getComputedStyle(viewport);
      const viewportPaddingTop = parseInt(viewportStyles.paddingTop, 10);
      const viewportPaddingBottom = parseInt(viewportStyles.paddingBottom, 10);
      const topEdgeToTriggerMiddle = triggerRect.top + triggerRect.height / 2 - CONTENT_MARGIN;
      const triggerMiddleToBottomEdge = availableHeight - topEdgeToTriggerMiddle;
      const selectedItemHalfHeight = selectedItem.offsetHeight / 2;
      const itemOffsetMiddle = selectedItem.offsetTop + selectedItemHalfHeight;
      const contentTopToItemMiddle = contentBorderTopWidth + contentPaddingTop + itemOffsetMiddle;
      const itemMiddleToContentBottom = fullContentHeight - contentTopToItemMiddle;
      const willAlignWithoutTopOverflow = contentTopToItemMiddle <= topEdgeToTriggerMiddle;
      if (willAlignWithoutTopOverflow) {
        const isLastItem = items.length > 0 && selectedItem === items[items.length - 1].ref.current;
        contentWrapper.style.bottom = "0px";
        const viewportOffsetBottom = content.clientHeight - viewport.offsetTop - viewport.offsetHeight;
        const clampedTriggerMiddleToBottomEdge = Math.max(
          triggerMiddleToBottomEdge,
          selectedItemHalfHeight + // viewport might have padding bottom, include it to avoid a scrollable viewport
          (isLastItem ? viewportPaddingBottom : 0) + viewportOffsetBottom + contentBorderBottomWidth
        );
        const height = contentTopToItemMiddle + clampedTriggerMiddleToBottomEdge;
        contentWrapper.style.height = height + "px";
      } else {
        const isFirstItem = items.length > 0 && selectedItem === items[0].ref.current;
        contentWrapper.style.top = "0px";
        const clampedTopEdgeToTriggerMiddle = Math.max(
          topEdgeToTriggerMiddle,
          contentBorderTopWidth + viewport.offsetTop + // viewport might have padding top, include it to avoid a scrollable viewport
          (isFirstItem ? viewportPaddingTop : 0) + selectedItemHalfHeight
        );
        const height = clampedTopEdgeToTriggerMiddle + itemMiddleToContentBottom;
        contentWrapper.style.height = height + "px";
        viewport.scrollTop = contentTopToItemMiddle - topEdgeToTriggerMiddle + viewport.offsetTop;
      }
      contentWrapper.style.margin = `${CONTENT_MARGIN}px 0`;
      contentWrapper.style.minHeight = minContentHeight + "px";
      contentWrapper.style.maxHeight = availableHeight + "px";
      onPlaced?.();
      requestAnimationFrame(() => shouldExpandOnScrollRef.current = true);
    }
  }, [
    getItems,
    context.trigger,
    context.valueNode,
    contentWrapper,
    content,
    viewport,
    selectedItem,
    selectedItemText,
    context.dir,
    onPlaced
  ]);
  useLayoutEffect2(() => position(), [position]);
  const [contentZIndex, setContentZIndex] = React$6.useState();
  useLayoutEffect2(() => {
    if (content) setContentZIndex(window.getComputedStyle(content).zIndex);
  }, [content]);
  const handleScrollButtonChange = React$6.useCallback(
    (node) => {
      if (node && shouldRepositionRef.current === true) {
        position();
        focusSelectedItem?.();
        shouldRepositionRef.current = false;
      }
    },
    [position, focusSelectedItem]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    SelectViewportProvider,
    {
      scope: __scopeSelect,
      contentWrapper,
      shouldExpandOnScrollRef,
      onScrollButtonChange: handleScrollButtonChange,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          ref: setContentWrapper,
          style: {
            display: "flex",
            flexDirection: "column",
            position: "fixed",
            zIndex: contentZIndex
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Primitive.div,
            {
              ...popperProps,
              ref: composedRefs,
              style: {
                // When we get the height of the content, it includes borders. If we were to set
                // the height without having `boxSizing: 'border-box'` it would be too big.
                boxSizing: "border-box",
                // We need to ensure the content doesn't get taller than the wrapper
                maxHeight: "100%",
                ...popperProps.style
              }
            }
          )
        }
      )
    }
  );
});
SelectItemAlignedPosition.displayName = ITEM_ALIGNED_POSITION_NAME;
var POPPER_POSITION_NAME = "SelectPopperPosition";
var SelectPopperPosition = React$6.forwardRef((props, forwardedRef) => {
  const {
    __scopeSelect,
    align = "start",
    collisionPadding = CONTENT_MARGIN,
    ...popperProps
  } = props;
  const popperScope = usePopperScope$1(__scopeSelect);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Content$1,
    {
      ...popperScope,
      ...popperProps,
      ref: forwardedRef,
      align,
      collisionPadding,
      style: {
        // Ensure border-box for floating-ui calculations
        boxSizing: "border-box",
        ...popperProps.style,
        // re-namespace exposed content custom properties
        ...{
          "--radix-select-content-transform-origin": "var(--radix-popper-transform-origin)",
          "--radix-select-content-available-width": "var(--radix-popper-available-width)",
          "--radix-select-content-available-height": "var(--radix-popper-available-height)",
          "--radix-select-trigger-width": "var(--radix-popper-anchor-width)",
          "--radix-select-trigger-height": "var(--radix-popper-anchor-height)"
        }
      }
    }
  );
});
SelectPopperPosition.displayName = POPPER_POSITION_NAME;
var [SelectViewportProvider, useSelectViewportContext] = createSelectContext(CONTENT_NAME$2, {});
var VIEWPORT_NAME = "SelectViewport";
var SelectViewport = React$6.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSelect, nonce, ...viewportProps } = props;
    const contentContext = useSelectContentContext(VIEWPORT_NAME, __scopeSelect);
    const viewportContext = useSelectViewportContext(VIEWPORT_NAME, __scopeSelect);
    const composedRefs = useComposedRefs(forwardedRef, contentContext.onViewportChange);
    const prevScrollTopRef = React$6.useRef(0);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "style",
        {
          dangerouslySetInnerHTML: {
            __html: `[data-radix-select-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-select-viewport]::-webkit-scrollbar{display:none}`
          },
          nonce
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Slot, { scope: __scopeSelect, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.div,
        {
          "data-radix-select-viewport": "",
          role: "presentation",
          ...viewportProps,
          ref: composedRefs,
          style: {
            // we use position: 'relative' here on the `viewport` so that when we call
            // `selectedItem.offsetTop` in calculations, the offset is relative to the viewport
            // (independent of the scrollUpButton).
            position: "relative",
            flex: 1,
            // Viewport should only be scrollable in the vertical direction.
            // This won't work in vertical writing modes, so we'll need to
            // revisit this if/when that is supported
            // https://developer.chrome.com/blog/vertical-form-controls
            overflow: "hidden auto",
            ...viewportProps.style
          },
          onScroll: composeEventHandlers(viewportProps.onScroll, (event) => {
            const viewport = event.currentTarget;
            const { contentWrapper, shouldExpandOnScrollRef } = viewportContext;
            if (shouldExpandOnScrollRef?.current && contentWrapper) {
              const scrolledBy = Math.abs(prevScrollTopRef.current - viewport.scrollTop);
              if (scrolledBy > 0) {
                const availableHeight = window.innerHeight - CONTENT_MARGIN * 2;
                const cssMinHeight = parseFloat(contentWrapper.style.minHeight);
                const cssHeight = parseFloat(contentWrapper.style.height);
                const prevHeight = Math.max(cssMinHeight, cssHeight);
                if (prevHeight < availableHeight) {
                  const nextHeight = prevHeight + scrolledBy;
                  const clampedNextHeight = Math.min(availableHeight, nextHeight);
                  const heightDiff = nextHeight - clampedNextHeight;
                  contentWrapper.style.height = clampedNextHeight + "px";
                  if (contentWrapper.style.bottom === "0px") {
                    viewport.scrollTop = heightDiff > 0 ? heightDiff : 0;
                    contentWrapper.style.justifyContent = "flex-end";
                  }
                }
              }
            }
            prevScrollTopRef.current = viewport.scrollTop;
          })
        }
      ) })
    ] });
  }
);
SelectViewport.displayName = VIEWPORT_NAME;
var GROUP_NAME = "SelectGroup";
var [SelectGroupContextProvider, useSelectGroupContext] = createSelectContext(GROUP_NAME);
var SelectGroup = React$6.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSelect, ...groupProps } = props;
    const groupId = useId();
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SelectGroupContextProvider, { scope: __scopeSelect, id: groupId, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.div, { role: "group", "aria-labelledby": groupId, ...groupProps, ref: forwardedRef }) });
  }
);
SelectGroup.displayName = GROUP_NAME;
var LABEL_NAME = "SelectLabel";
var SelectLabel = React$6.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSelect, ...labelProps } = props;
    const groupContext = useSelectGroupContext(LABEL_NAME, __scopeSelect);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.div, { id: groupContext.id, ...labelProps, ref: forwardedRef });
  }
);
SelectLabel.displayName = LABEL_NAME;
var ITEM_NAME = "SelectItem";
var [SelectItemContextProvider, useSelectItemContext] = createSelectContext(ITEM_NAME);
var SelectItem$1 = React$6.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeSelect,
      value,
      disabled = false,
      textValue: textValueProp,
      ...itemProps
    } = props;
    const context = useSelectContext(ITEM_NAME, __scopeSelect);
    const contentContext = useSelectContentContext(ITEM_NAME, __scopeSelect);
    const isSelected = context.value === value;
    const [textValue, setTextValue] = React$6.useState(textValueProp ?? "");
    const [isFocused, setIsFocused] = React$6.useState(false);
    const composedRefs = useComposedRefs(
      forwardedRef,
      (node) => contentContext.itemRefCallback?.(node, value, disabled)
    );
    const textId = useId();
    const pointerTypeRef = React$6.useRef("touch");
    const handleSelect = () => {
      if (!disabled) {
        context.onValueChange(value);
        context.onOpenChange(false);
      }
    };
    if (value === "") {
      throw new Error(
        "A <Select.Item /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder."
      );
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      SelectItemContextProvider,
      {
        scope: __scopeSelect,
        value,
        disabled,
        textId,
        isSelected,
        onItemTextChange: React$6.useCallback((node) => {
          setTextValue((prevTextValue) => prevTextValue || (node?.textContent ?? "").trim());
        }, []),
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Collection.ItemSlot,
          {
            scope: __scopeSelect,
            value,
            disabled,
            textValue,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Primitive.div,
              {
                role: "option",
                "aria-labelledby": textId,
                "data-highlighted": isFocused ? "" : void 0,
                "aria-selected": isSelected && isFocused,
                "data-state": isSelected ? "checked" : "unchecked",
                "aria-disabled": disabled || void 0,
                "data-disabled": disabled ? "" : void 0,
                tabIndex: disabled ? void 0 : -1,
                ...itemProps,
                ref: composedRefs,
                onFocus: composeEventHandlers(itemProps.onFocus, () => setIsFocused(true)),
                onBlur: composeEventHandlers(itemProps.onBlur, () => setIsFocused(false)),
                onClick: composeEventHandlers(itemProps.onClick, () => {
                  if (pointerTypeRef.current !== "mouse") handleSelect();
                }),
                onPointerUp: composeEventHandlers(itemProps.onPointerUp, () => {
                  if (pointerTypeRef.current === "mouse") handleSelect();
                }),
                onPointerDown: composeEventHandlers(itemProps.onPointerDown, (event) => {
                  pointerTypeRef.current = event.pointerType;
                }),
                onPointerMove: composeEventHandlers(itemProps.onPointerMove, (event) => {
                  pointerTypeRef.current = event.pointerType;
                  if (disabled) {
                    contentContext.onItemLeave?.();
                  } else if (pointerTypeRef.current === "mouse") {
                    event.currentTarget.focus({ preventScroll: true });
                  }
                }),
                onPointerLeave: composeEventHandlers(itemProps.onPointerLeave, (event) => {
                  if (event.currentTarget === document.activeElement) {
                    contentContext.onItemLeave?.();
                  }
                }),
                onKeyDown: composeEventHandlers(itemProps.onKeyDown, (event) => {
                  const isTypingAhead = contentContext.searchRef?.current !== "";
                  if (isTypingAhead && event.key === " ") return;
                  if (SELECTION_KEYS.includes(event.key)) handleSelect();
                  if (event.key === " ") event.preventDefault();
                })
              }
            )
          }
        )
      }
    );
  }
);
SelectItem$1.displayName = ITEM_NAME;
var ITEM_TEXT_NAME = "SelectItemText";
var SelectItemText = React$6.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSelect, className, style, ...itemTextProps } = props;
    const context = useSelectContext(ITEM_TEXT_NAME, __scopeSelect);
    const contentContext = useSelectContentContext(ITEM_TEXT_NAME, __scopeSelect);
    const itemContext = useSelectItemContext(ITEM_TEXT_NAME, __scopeSelect);
    const nativeOptionsContext = useSelectNativeOptionsContext(ITEM_TEXT_NAME, __scopeSelect);
    const [itemTextNode, setItemTextNode] = React$6.useState(null);
    const composedRefs = useComposedRefs(
      forwardedRef,
      (node) => setItemTextNode(node),
      itemContext.onItemTextChange,
      (node) => contentContext.itemTextRefCallback?.(node, itemContext.value, itemContext.disabled)
    );
    const textContent = itemTextNode?.textContent;
    const nativeOption = React$6.useMemo(
      () => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: itemContext.value, disabled: itemContext.disabled, children: textContent }, itemContext.value),
      [itemContext.disabled, itemContext.value, textContent]
    );
    const { onNativeOptionAdd, onNativeOptionRemove } = nativeOptionsContext;
    useLayoutEffect2(() => {
      onNativeOptionAdd(nativeOption);
      return () => onNativeOptionRemove(nativeOption);
    }, [onNativeOptionAdd, onNativeOptionRemove, nativeOption]);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.span, { id: itemContext.textId, ...itemTextProps, ref: composedRefs }),
      itemContext.isSelected && context.valueNode && !context.valueNodeHasChildren ? ReactDOM.createPortal(itemTextProps.children, context.valueNode) : null
    ] });
  }
);
SelectItemText.displayName = ITEM_TEXT_NAME;
var ITEM_INDICATOR_NAME = "SelectItemIndicator";
var SelectItemIndicator = React$6.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSelect, ...itemIndicatorProps } = props;
    const itemContext = useSelectItemContext(ITEM_INDICATOR_NAME, __scopeSelect);
    return itemContext.isSelected ? /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.span, { "aria-hidden": true, ...itemIndicatorProps, ref: forwardedRef }) : null;
  }
);
SelectItemIndicator.displayName = ITEM_INDICATOR_NAME;
var SCROLL_UP_BUTTON_NAME = "SelectScrollUpButton";
var SelectScrollUpButton$1 = React$6.forwardRef((props, forwardedRef) => {
  const contentContext = useSelectContentContext(SCROLL_UP_BUTTON_NAME, props.__scopeSelect);
  const viewportContext = useSelectViewportContext(SCROLL_UP_BUTTON_NAME, props.__scopeSelect);
  const [canScrollUp, setCanScrollUp] = React$6.useState(false);
  const composedRefs = useComposedRefs(forwardedRef, viewportContext.onScrollButtonChange);
  useLayoutEffect2(() => {
    if (contentContext.viewport && contentContext.isPositioned) {
      let handleScroll2 = function() {
        const canScrollUp2 = viewport.scrollTop > 0;
        setCanScrollUp(canScrollUp2);
      };
      const viewport = contentContext.viewport;
      handleScroll2();
      viewport.addEventListener("scroll", handleScroll2);
      return () => viewport.removeEventListener("scroll", handleScroll2);
    }
  }, [contentContext.viewport, contentContext.isPositioned]);
  return canScrollUp ? /* @__PURE__ */ jsxRuntimeExports.jsx(
    SelectScrollButtonImpl,
    {
      ...props,
      ref: composedRefs,
      onAutoScroll: () => {
        const { viewport, selectedItem } = contentContext;
        if (viewport && selectedItem) {
          viewport.scrollTop = viewport.scrollTop - selectedItem.offsetHeight;
        }
      }
    }
  ) : null;
});
SelectScrollUpButton$1.displayName = SCROLL_UP_BUTTON_NAME;
var SCROLL_DOWN_BUTTON_NAME = "SelectScrollDownButton";
var SelectScrollDownButton$1 = React$6.forwardRef((props, forwardedRef) => {
  const contentContext = useSelectContentContext(SCROLL_DOWN_BUTTON_NAME, props.__scopeSelect);
  const viewportContext = useSelectViewportContext(SCROLL_DOWN_BUTTON_NAME, props.__scopeSelect);
  const [canScrollDown, setCanScrollDown] = React$6.useState(false);
  const composedRefs = useComposedRefs(forwardedRef, viewportContext.onScrollButtonChange);
  useLayoutEffect2(() => {
    if (contentContext.viewport && contentContext.isPositioned) {
      let handleScroll2 = function() {
        const maxScroll = viewport.scrollHeight - viewport.clientHeight;
        const canScrollDown2 = Math.ceil(viewport.scrollTop) < maxScroll;
        setCanScrollDown(canScrollDown2);
      };
      const viewport = contentContext.viewport;
      handleScroll2();
      viewport.addEventListener("scroll", handleScroll2);
      return () => viewport.removeEventListener("scroll", handleScroll2);
    }
  }, [contentContext.viewport, contentContext.isPositioned]);
  return canScrollDown ? /* @__PURE__ */ jsxRuntimeExports.jsx(
    SelectScrollButtonImpl,
    {
      ...props,
      ref: composedRefs,
      onAutoScroll: () => {
        const { viewport, selectedItem } = contentContext;
        if (viewport && selectedItem) {
          viewport.scrollTop = viewport.scrollTop + selectedItem.offsetHeight;
        }
      }
    }
  ) : null;
});
SelectScrollDownButton$1.displayName = SCROLL_DOWN_BUTTON_NAME;
var SelectScrollButtonImpl = React$6.forwardRef((props, forwardedRef) => {
  const { __scopeSelect, onAutoScroll, ...scrollIndicatorProps } = props;
  const contentContext = useSelectContentContext("SelectScrollButton", __scopeSelect);
  const autoScrollTimerRef = React$6.useRef(null);
  const getItems = useCollection(__scopeSelect);
  const clearAutoScrollTimer = React$6.useCallback(() => {
    if (autoScrollTimerRef.current !== null) {
      window.clearInterval(autoScrollTimerRef.current);
      autoScrollTimerRef.current = null;
    }
  }, []);
  React$6.useEffect(() => {
    return () => clearAutoScrollTimer();
  }, [clearAutoScrollTimer]);
  useLayoutEffect2(() => {
    const activeItem = getItems().find((item) => item.ref.current === document.activeElement);
    activeItem?.ref.current?.scrollIntoView({ block: "nearest" });
  }, [getItems]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Primitive.div,
    {
      "aria-hidden": true,
      ...scrollIndicatorProps,
      ref: forwardedRef,
      style: { flexShrink: 0, ...scrollIndicatorProps.style },
      onPointerDown: composeEventHandlers(scrollIndicatorProps.onPointerDown, () => {
        if (autoScrollTimerRef.current === null) {
          autoScrollTimerRef.current = window.setInterval(onAutoScroll, 50);
        }
      }),
      onPointerMove: composeEventHandlers(scrollIndicatorProps.onPointerMove, () => {
        contentContext.onItemLeave?.();
        if (autoScrollTimerRef.current === null) {
          autoScrollTimerRef.current = window.setInterval(onAutoScroll, 50);
        }
      }),
      onPointerLeave: composeEventHandlers(scrollIndicatorProps.onPointerLeave, () => {
        clearAutoScrollTimer();
      })
    }
  );
});
var SEPARATOR_NAME = "SelectSeparator";
var SelectSeparator = React$6.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSelect, ...separatorProps } = props;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.div, { "aria-hidden": true, ...separatorProps, ref: forwardedRef });
  }
);
SelectSeparator.displayName = SEPARATOR_NAME;
var ARROW_NAME$1 = "SelectArrow";
var SelectArrow = React$6.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSelect, ...arrowProps } = props;
    const popperScope = usePopperScope$1(__scopeSelect);
    const context = useSelectContext(ARROW_NAME$1, __scopeSelect);
    const contentContext = useSelectContentContext(ARROW_NAME$1, __scopeSelect);
    return context.open && contentContext.position === "popper" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Arrow, { ...popperScope, ...arrowProps, ref: forwardedRef }) : null;
  }
);
SelectArrow.displayName = ARROW_NAME$1;
var BUBBLE_INPUT_NAME = "SelectBubbleInput";
var SelectBubbleInput = React$6.forwardRef(
  ({ __scopeSelect, value, ...props }, forwardedRef) => {
    const ref = React$6.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    const prevValue = usePrevious(value);
    React$6.useEffect(() => {
      const select = ref.current;
      if (!select) return;
      const selectProto = window.HTMLSelectElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(
        selectProto,
        "value"
      );
      const setValue = descriptor.set;
      if (prevValue !== value && setValue) {
        const event = new Event("change", { bubbles: true });
        setValue.call(select, value);
        select.dispatchEvent(event);
      }
    }, [prevValue, value]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.select,
      {
        ...props,
        style: { ...VISUALLY_HIDDEN_STYLES, ...props.style },
        ref: composedRefs,
        defaultValue: value
      }
    );
  }
);
SelectBubbleInput.displayName = BUBBLE_INPUT_NAME;
function shouldShowPlaceholder(value) {
  return value === "" || value === void 0;
}
function useTypeaheadSearch(onSearchChange) {
  const handleSearchChange = useCallbackRef$1(onSearchChange);
  const searchRef = React$6.useRef("");
  const timerRef = React$6.useRef(0);
  const handleTypeaheadSearch = React$6.useCallback(
    (key) => {
      const search = searchRef.current + key;
      handleSearchChange(search);
      (function updateSearch(value) {
        searchRef.current = value;
        window.clearTimeout(timerRef.current);
        if (value !== "") timerRef.current = window.setTimeout(() => updateSearch(""), 1e3);
      })(search);
    },
    [handleSearchChange]
  );
  const resetTypeahead = React$6.useCallback(() => {
    searchRef.current = "";
    window.clearTimeout(timerRef.current);
  }, []);
  React$6.useEffect(() => {
    return () => window.clearTimeout(timerRef.current);
  }, []);
  return [searchRef, handleTypeaheadSearch, resetTypeahead];
}
function findNextItem(items, search, currentItem) {
  const isRepeated = search.length > 1 && Array.from(search).every((char) => char === search[0]);
  const normalizedSearch = isRepeated ? search[0] : search;
  const currentItemIndex = currentItem ? items.indexOf(currentItem) : -1;
  let wrappedItems = wrapArray(items, Math.max(currentItemIndex, 0));
  const excludeCurrentItem = normalizedSearch.length === 1;
  if (excludeCurrentItem) wrappedItems = wrappedItems.filter((v) => v !== currentItem);
  const nextItem = wrappedItems.find(
    (item) => item.textValue.toLowerCase().startsWith(normalizedSearch.toLowerCase())
  );
  return nextItem !== currentItem ? nextItem : void 0;
}
function wrapArray(array, startIndex) {
  return array.map((_, index) => array[(startIndex + index) % array.length]);
}
var Root2$1 = Select$1;
var Trigger$1 = SelectTrigger$1;
var Value = SelectValue$1;
var Icon = SelectIcon;
var Portal$2 = SelectPortal;
var Content2$1 = SelectContent$1;
var Viewport = SelectViewport;
var Item = SelectItem$1;
var ItemText = SelectItemText;
var ItemIndicator = SelectItemIndicator;
var ScrollUpButton = SelectScrollUpButton$1;
var ScrollDownButton = SelectScrollDownButton$1;

function r(e){var t,f,n="";if("string"==typeof e||"number"==typeof e)n+=e;else if("object"==typeof e)if(Array.isArray(e)){var o=e.length;for(t=0;t<o;t++)e[t]&&(f=r(e[t]))&&(n&&(n+=" "),n+=f);}else for(f in e)e[f]&&(n&&(n+=" "),n+=f);return n}function clsx(){for(var e,t,f=0,n="",o=arguments.length;f<o;f++)(e=arguments[f])&&(t=r(e))&&(n&&(n+=" "),n+=t);return n}

const CLASS_PART_SEPARATOR = '-';
const createClassGroupUtils = config => {
  const classMap = createClassMap(config);
  const {
    conflictingClassGroups,
    conflictingClassGroupModifiers
  } = config;
  const getClassGroupId = className => {
    const classParts = className.split(CLASS_PART_SEPARATOR);
    // Classes like `-inset-1` produce an empty string as first classPart. We assume that classes for negative values are used correctly and remove it from classParts.
    if (classParts[0] === '' && classParts.length !== 1) {
      classParts.shift();
    }
    return getGroupRecursive(classParts, classMap) || getGroupIdForArbitraryProperty(className);
  };
  const getConflictingClassGroupIds = (classGroupId, hasPostfixModifier) => {
    const conflicts = conflictingClassGroups[classGroupId] || [];
    if (hasPostfixModifier && conflictingClassGroupModifiers[classGroupId]) {
      return [...conflicts, ...conflictingClassGroupModifiers[classGroupId]];
    }
    return conflicts;
  };
  return {
    getClassGroupId,
    getConflictingClassGroupIds
  };
};
const getGroupRecursive = (classParts, classPartObject) => {
  if (classParts.length === 0) {
    return classPartObject.classGroupId;
  }
  const currentClassPart = classParts[0];
  const nextClassPartObject = classPartObject.nextPart.get(currentClassPart);
  const classGroupFromNextClassPart = nextClassPartObject ? getGroupRecursive(classParts.slice(1), nextClassPartObject) : undefined;
  if (classGroupFromNextClassPart) {
    return classGroupFromNextClassPart;
  }
  if (classPartObject.validators.length === 0) {
    return undefined;
  }
  const classRest = classParts.join(CLASS_PART_SEPARATOR);
  return classPartObject.validators.find(({
    validator
  }) => validator(classRest))?.classGroupId;
};
const arbitraryPropertyRegex = /^\[(.+)\]$/;
const getGroupIdForArbitraryProperty = className => {
  if (arbitraryPropertyRegex.test(className)) {
    const arbitraryPropertyClassName = arbitraryPropertyRegex.exec(className)[1];
    const property = arbitraryPropertyClassName?.substring(0, arbitraryPropertyClassName.indexOf(':'));
    if (property) {
      // I use two dots here because one dot is used as prefix for class groups in plugins
      return 'arbitrary..' + property;
    }
  }
};
/**
 * Exported for testing only
 */
const createClassMap = config => {
  const {
    theme,
    classGroups
  } = config;
  const classMap = {
    nextPart: new Map(),
    validators: []
  };
  for (const classGroupId in classGroups) {
    processClassesRecursively(classGroups[classGroupId], classMap, classGroupId, theme);
  }
  return classMap;
};
const processClassesRecursively = (classGroup, classPartObject, classGroupId, theme) => {
  classGroup.forEach(classDefinition => {
    if (typeof classDefinition === 'string') {
      const classPartObjectToEdit = classDefinition === '' ? classPartObject : getPart(classPartObject, classDefinition);
      classPartObjectToEdit.classGroupId = classGroupId;
      return;
    }
    if (typeof classDefinition === 'function') {
      if (isThemeGetter(classDefinition)) {
        processClassesRecursively(classDefinition(theme), classPartObject, classGroupId, theme);
        return;
      }
      classPartObject.validators.push({
        validator: classDefinition,
        classGroupId
      });
      return;
    }
    Object.entries(classDefinition).forEach(([key, classGroup]) => {
      processClassesRecursively(classGroup, getPart(classPartObject, key), classGroupId, theme);
    });
  });
};
const getPart = (classPartObject, path) => {
  let currentClassPartObject = classPartObject;
  path.split(CLASS_PART_SEPARATOR).forEach(pathPart => {
    if (!currentClassPartObject.nextPart.has(pathPart)) {
      currentClassPartObject.nextPart.set(pathPart, {
        nextPart: new Map(),
        validators: []
      });
    }
    currentClassPartObject = currentClassPartObject.nextPart.get(pathPart);
  });
  return currentClassPartObject;
};
const isThemeGetter = func => func.isThemeGetter;

// LRU cache inspired from hashlru (https://github.com/dominictarr/hashlru/blob/v1.0.4/index.js) but object replaced with Map to improve performance
const createLruCache = maxCacheSize => {
  if (maxCacheSize < 1) {
    return {
      get: () => undefined,
      set: () => {}
    };
  }
  let cacheSize = 0;
  let cache = new Map();
  let previousCache = new Map();
  const update = (key, value) => {
    cache.set(key, value);
    cacheSize++;
    if (cacheSize > maxCacheSize) {
      cacheSize = 0;
      previousCache = cache;
      cache = new Map();
    }
  };
  return {
    get(key) {
      let value = cache.get(key);
      if (value !== undefined) {
        return value;
      }
      if ((value = previousCache.get(key)) !== undefined) {
        update(key, value);
        return value;
      }
    },
    set(key, value) {
      if (cache.has(key)) {
        cache.set(key, value);
      } else {
        update(key, value);
      }
    }
  };
};
const IMPORTANT_MODIFIER = '!';
const MODIFIER_SEPARATOR = ':';
const MODIFIER_SEPARATOR_LENGTH = MODIFIER_SEPARATOR.length;
const createParseClassName = config => {
  const {
    prefix,
    experimentalParseClassName
  } = config;
  /**
   * Parse class name into parts.
   *
   * Inspired by `splitAtTopLevelOnly` used in Tailwind CSS
   * @see https://github.com/tailwindlabs/tailwindcss/blob/v3.2.2/src/util/splitAtTopLevelOnly.js
   */
  let parseClassName = className => {
    const modifiers = [];
    let bracketDepth = 0;
    let parenDepth = 0;
    let modifierStart = 0;
    let postfixModifierPosition;
    for (let index = 0; index < className.length; index++) {
      let currentCharacter = className[index];
      if (bracketDepth === 0 && parenDepth === 0) {
        if (currentCharacter === MODIFIER_SEPARATOR) {
          modifiers.push(className.slice(modifierStart, index));
          modifierStart = index + MODIFIER_SEPARATOR_LENGTH;
          continue;
        }
        if (currentCharacter === '/') {
          postfixModifierPosition = index;
          continue;
        }
      }
      if (currentCharacter === '[') {
        bracketDepth++;
      } else if (currentCharacter === ']') {
        bracketDepth--;
      } else if (currentCharacter === '(') {
        parenDepth++;
      } else if (currentCharacter === ')') {
        parenDepth--;
      }
    }
    const baseClassNameWithImportantModifier = modifiers.length === 0 ? className : className.substring(modifierStart);
    const baseClassName = stripImportantModifier(baseClassNameWithImportantModifier);
    const hasImportantModifier = baseClassName !== baseClassNameWithImportantModifier;
    const maybePostfixModifierPosition = postfixModifierPosition && postfixModifierPosition > modifierStart ? postfixModifierPosition - modifierStart : undefined;
    return {
      modifiers,
      hasImportantModifier,
      baseClassName,
      maybePostfixModifierPosition
    };
  };
  if (prefix) {
    const fullPrefix = prefix + MODIFIER_SEPARATOR;
    const parseClassNameOriginal = parseClassName;
    parseClassName = className => className.startsWith(fullPrefix) ? parseClassNameOriginal(className.substring(fullPrefix.length)) : {
      isExternal: true,
      modifiers: [],
      hasImportantModifier: false,
      baseClassName: className,
      maybePostfixModifierPosition: undefined
    };
  }
  if (experimentalParseClassName) {
    const parseClassNameOriginal = parseClassName;
    parseClassName = className => experimentalParseClassName({
      className,
      parseClassName: parseClassNameOriginal
    });
  }
  return parseClassName;
};
const stripImportantModifier = baseClassName => {
  if (baseClassName.endsWith(IMPORTANT_MODIFIER)) {
    return baseClassName.substring(0, baseClassName.length - 1);
  }
  /**
   * In Tailwind CSS v3 the important modifier was at the start of the base class name. This is still supported for legacy reasons.
   * @see https://github.com/dcastil/tailwind-merge/issues/513#issuecomment-2614029864
   */
  if (baseClassName.startsWith(IMPORTANT_MODIFIER)) {
    return baseClassName.substring(1);
  }
  return baseClassName;
};

/**
 * Sorts modifiers according to following schema:
 * - Predefined modifiers are sorted alphabetically
 * - When an arbitrary variant appears, it must be preserved which modifiers are before and after it
 */
const createSortModifiers = config => {
  const orderSensitiveModifiers = Object.fromEntries(config.orderSensitiveModifiers.map(modifier => [modifier, true]));
  const sortModifiers = modifiers => {
    if (modifiers.length <= 1) {
      return modifiers;
    }
    const sortedModifiers = [];
    let unsortedModifiers = [];
    modifiers.forEach(modifier => {
      const isPositionSensitive = modifier[0] === '[' || orderSensitiveModifiers[modifier];
      if (isPositionSensitive) {
        sortedModifiers.push(...unsortedModifiers.sort(), modifier);
        unsortedModifiers = [];
      } else {
        unsortedModifiers.push(modifier);
      }
    });
    sortedModifiers.push(...unsortedModifiers.sort());
    return sortedModifiers;
  };
  return sortModifiers;
};
const createConfigUtils = config => ({
  cache: createLruCache(config.cacheSize),
  parseClassName: createParseClassName(config),
  sortModifiers: createSortModifiers(config),
  ...createClassGroupUtils(config)
});
const SPLIT_CLASSES_REGEX = /\s+/;
const mergeClassList = (classList, configUtils) => {
  const {
    parseClassName,
    getClassGroupId,
    getConflictingClassGroupIds,
    sortModifiers
  } = configUtils;
  /**
   * Set of classGroupIds in following format:
   * `{importantModifier}{variantModifiers}{classGroupId}`
   * @example 'float'
   * @example 'hover:focus:bg-color'
   * @example 'md:!pr'
   */
  const classGroupsInConflict = [];
  const classNames = classList.trim().split(SPLIT_CLASSES_REGEX);
  let result = '';
  for (let index = classNames.length - 1; index >= 0; index -= 1) {
    const originalClassName = classNames[index];
    const {
      isExternal,
      modifiers,
      hasImportantModifier,
      baseClassName,
      maybePostfixModifierPosition
    } = parseClassName(originalClassName);
    if (isExternal) {
      result = originalClassName + (result.length > 0 ? ' ' + result : result);
      continue;
    }
    let hasPostfixModifier = !!maybePostfixModifierPosition;
    let classGroupId = getClassGroupId(hasPostfixModifier ? baseClassName.substring(0, maybePostfixModifierPosition) : baseClassName);
    if (!classGroupId) {
      if (!hasPostfixModifier) {
        // Not a Tailwind class
        result = originalClassName + (result.length > 0 ? ' ' + result : result);
        continue;
      }
      classGroupId = getClassGroupId(baseClassName);
      if (!classGroupId) {
        // Not a Tailwind class
        result = originalClassName + (result.length > 0 ? ' ' + result : result);
        continue;
      }
      hasPostfixModifier = false;
    }
    const variantModifier = sortModifiers(modifiers).join(':');
    const modifierId = hasImportantModifier ? variantModifier + IMPORTANT_MODIFIER : variantModifier;
    const classId = modifierId + classGroupId;
    if (classGroupsInConflict.includes(classId)) {
      // Tailwind class omitted due to conflict
      continue;
    }
    classGroupsInConflict.push(classId);
    const conflictGroups = getConflictingClassGroupIds(classGroupId, hasPostfixModifier);
    for (let i = 0; i < conflictGroups.length; ++i) {
      const group = conflictGroups[i];
      classGroupsInConflict.push(modifierId + group);
    }
    // Tailwind class not in conflict
    result = originalClassName + (result.length > 0 ? ' ' + result : result);
  }
  return result;
};

/**
 * The code in this file is copied from https://github.com/lukeed/clsx and modified to suit the needs of tailwind-merge better.
 *
 * Specifically:
 * - Runtime code from https://github.com/lukeed/clsx/blob/v1.2.1/src/index.js
 * - TypeScript types from https://github.com/lukeed/clsx/blob/v1.2.1/clsx.d.ts
 *
 * Original code has MIT license: Copyright (c) Luke Edwards <luke.edwards05@gmail.com> (lukeed.com)
 */
function twJoin() {
  let index = 0;
  let argument;
  let resolvedValue;
  let string = '';
  while (index < arguments.length) {
    if (argument = arguments[index++]) {
      if (resolvedValue = toValue(argument)) {
        string && (string += ' ');
        string += resolvedValue;
      }
    }
  }
  return string;
}
const toValue = mix => {
  if (typeof mix === 'string') {
    return mix;
  }
  let resolvedValue;
  let string = '';
  for (let k = 0; k < mix.length; k++) {
    if (mix[k]) {
      if (resolvedValue = toValue(mix[k])) {
        string && (string += ' ');
        string += resolvedValue;
      }
    }
  }
  return string;
};
function createTailwindMerge(createConfigFirst, ...createConfigRest) {
  let configUtils;
  let cacheGet;
  let cacheSet;
  let functionToCall = initTailwindMerge;
  function initTailwindMerge(classList) {
    const config = createConfigRest.reduce((previousConfig, createConfigCurrent) => createConfigCurrent(previousConfig), createConfigFirst());
    configUtils = createConfigUtils(config);
    cacheGet = configUtils.cache.get;
    cacheSet = configUtils.cache.set;
    functionToCall = tailwindMerge;
    return tailwindMerge(classList);
  }
  function tailwindMerge(classList) {
    const cachedResult = cacheGet(classList);
    if (cachedResult) {
      return cachedResult;
    }
    const result = mergeClassList(classList, configUtils);
    cacheSet(classList, result);
    return result;
  }
  return function callTailwindMerge() {
    return functionToCall(twJoin.apply(null, arguments));
  };
}
const fromTheme = key => {
  const themeGetter = theme => theme[key] || [];
  themeGetter.isThemeGetter = true;
  return themeGetter;
};
const arbitraryValueRegex = /^\[(?:(\w[\w-]*):)?(.+)\]$/i;
const arbitraryVariableRegex = /^\((?:(\w[\w-]*):)?(.+)\)$/i;
const fractionRegex = /^\d+\/\d+$/;
const tshirtUnitRegex = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/;
const lengthUnitRegex = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/;
const colorFunctionRegex = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/;
// Shadow always begins with x and y offset separated by underscore optionally prepended by inset
const shadowRegex = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/;
const imageRegex = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/;
const isFraction = value => fractionRegex.test(value);
const isNumber = value => !!value && !Number.isNaN(Number(value));
const isInteger = value => !!value && Number.isInteger(Number(value));
const isPercent = value => value.endsWith('%') && isNumber(value.slice(0, -1));
const isTshirtSize = value => tshirtUnitRegex.test(value);
const isAny = () => true;
const isLengthOnly = value =>
// `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
// For example, `hsl(0 0% 0%)` would be classified as a length without this check.
// I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
lengthUnitRegex.test(value) && !colorFunctionRegex.test(value);
const isNever = () => false;
const isShadow = value => shadowRegex.test(value);
const isImage = value => imageRegex.test(value);
const isAnyNonArbitrary = value => !isArbitraryValue(value) && !isArbitraryVariable(value);
const isArbitrarySize = value => getIsArbitraryValue(value, isLabelSize, isNever);
const isArbitraryValue = value => arbitraryValueRegex.test(value);
const isArbitraryLength = value => getIsArbitraryValue(value, isLabelLength, isLengthOnly);
const isArbitraryNumber = value => getIsArbitraryValue(value, isLabelNumber, isNumber);
const isArbitraryPosition = value => getIsArbitraryValue(value, isLabelPosition, isNever);
const isArbitraryImage = value => getIsArbitraryValue(value, isLabelImage, isImage);
const isArbitraryShadow = value => getIsArbitraryValue(value, isLabelShadow, isShadow);
const isArbitraryVariable = value => arbitraryVariableRegex.test(value);
const isArbitraryVariableLength = value => getIsArbitraryVariable(value, isLabelLength);
const isArbitraryVariableFamilyName = value => getIsArbitraryVariable(value, isLabelFamilyName);
const isArbitraryVariablePosition = value => getIsArbitraryVariable(value, isLabelPosition);
const isArbitraryVariableSize = value => getIsArbitraryVariable(value, isLabelSize);
const isArbitraryVariableImage = value => getIsArbitraryVariable(value, isLabelImage);
const isArbitraryVariableShadow = value => getIsArbitraryVariable(value, isLabelShadow, true);
// Helpers
const getIsArbitraryValue = (value, testLabel, testValue) => {
  const result = arbitraryValueRegex.exec(value);
  if (result) {
    if (result[1]) {
      return testLabel(result[1]);
    }
    return testValue(result[2]);
  }
  return false;
};
const getIsArbitraryVariable = (value, testLabel, shouldMatchNoLabel = false) => {
  const result = arbitraryVariableRegex.exec(value);
  if (result) {
    if (result[1]) {
      return testLabel(result[1]);
    }
    return shouldMatchNoLabel;
  }
  return false;
};
// Labels
const isLabelPosition = label => label === 'position' || label === 'percentage';
const isLabelImage = label => label === 'image' || label === 'url';
const isLabelSize = label => label === 'length' || label === 'size' || label === 'bg-size';
const isLabelLength = label => label === 'length';
const isLabelNumber = label => label === 'number';
const isLabelFamilyName = label => label === 'family-name';
const isLabelShadow = label => label === 'shadow';
const getDefaultConfig = () => {
  /**
   * Theme getters for theme variable namespaces
   * @see https://tailwindcss.com/docs/theme#theme-variable-namespaces
   */
  /***/
  const themeColor = fromTheme('color');
  const themeFont = fromTheme('font');
  const themeText = fromTheme('text');
  const themeFontWeight = fromTheme('font-weight');
  const themeTracking = fromTheme('tracking');
  const themeLeading = fromTheme('leading');
  const themeBreakpoint = fromTheme('breakpoint');
  const themeContainer = fromTheme('container');
  const themeSpacing = fromTheme('spacing');
  const themeRadius = fromTheme('radius');
  const themeShadow = fromTheme('shadow');
  const themeInsetShadow = fromTheme('inset-shadow');
  const themeTextShadow = fromTheme('text-shadow');
  const themeDropShadow = fromTheme('drop-shadow');
  const themeBlur = fromTheme('blur');
  const themePerspective = fromTheme('perspective');
  const themeAspect = fromTheme('aspect');
  const themeEase = fromTheme('ease');
  const themeAnimate = fromTheme('animate');
  /**
   * Helpers to avoid repeating the same scales
   *
   * We use functions that create a new array every time they're called instead of static arrays.
   * This ensures that users who modify any scale by mutating the array (e.g. with `array.push(element)`) don't accidentally mutate arrays in other parts of the config.
   */
  /***/
  const scaleBreak = () => ['auto', 'avoid', 'all', 'avoid-page', 'page', 'left', 'right', 'column'];
  const scalePosition = () => ['center', 'top', 'bottom', 'left', 'right', 'top-left',
  // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
  'left-top', 'top-right',
  // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
  'right-top', 'bottom-right',
  // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
  'right-bottom', 'bottom-left',
  // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
  'left-bottom'];
  const scalePositionWithArbitrary = () => [...scalePosition(), isArbitraryVariable, isArbitraryValue];
  const scaleOverflow = () => ['auto', 'hidden', 'clip', 'visible', 'scroll'];
  const scaleOverscroll = () => ['auto', 'contain', 'none'];
  const scaleUnambiguousSpacing = () => [isArbitraryVariable, isArbitraryValue, themeSpacing];
  const scaleInset = () => [isFraction, 'full', 'auto', ...scaleUnambiguousSpacing()];
  const scaleGridTemplateColsRows = () => [isInteger, 'none', 'subgrid', isArbitraryVariable, isArbitraryValue];
  const scaleGridColRowStartAndEnd = () => ['auto', {
    span: ['full', isInteger, isArbitraryVariable, isArbitraryValue]
  }, isInteger, isArbitraryVariable, isArbitraryValue];
  const scaleGridColRowStartOrEnd = () => [isInteger, 'auto', isArbitraryVariable, isArbitraryValue];
  const scaleGridAutoColsRows = () => ['auto', 'min', 'max', 'fr', isArbitraryVariable, isArbitraryValue];
  const scaleAlignPrimaryAxis = () => ['start', 'end', 'center', 'between', 'around', 'evenly', 'stretch', 'baseline', 'center-safe', 'end-safe'];
  const scaleAlignSecondaryAxis = () => ['start', 'end', 'center', 'stretch', 'center-safe', 'end-safe'];
  const scaleMargin = () => ['auto', ...scaleUnambiguousSpacing()];
  const scaleSizing = () => [isFraction, 'auto', 'full', 'dvw', 'dvh', 'lvw', 'lvh', 'svw', 'svh', 'min', 'max', 'fit', ...scaleUnambiguousSpacing()];
  const scaleColor = () => [themeColor, isArbitraryVariable, isArbitraryValue];
  const scaleBgPosition = () => [...scalePosition(), isArbitraryVariablePosition, isArbitraryPosition, {
    position: [isArbitraryVariable, isArbitraryValue]
  }];
  const scaleBgRepeat = () => ['no-repeat', {
    repeat: ['', 'x', 'y', 'space', 'round']
  }];
  const scaleBgSize = () => ['auto', 'cover', 'contain', isArbitraryVariableSize, isArbitrarySize, {
    size: [isArbitraryVariable, isArbitraryValue]
  }];
  const scaleGradientStopPosition = () => [isPercent, isArbitraryVariableLength, isArbitraryLength];
  const scaleRadius = () => [
  // Deprecated since Tailwind CSS v4.0.0
  '', 'none', 'full', themeRadius, isArbitraryVariable, isArbitraryValue];
  const scaleBorderWidth = () => ['', isNumber, isArbitraryVariableLength, isArbitraryLength];
  const scaleLineStyle = () => ['solid', 'dashed', 'dotted', 'double'];
  const scaleBlendMode = () => ['normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity'];
  const scaleMaskImagePosition = () => [isNumber, isPercent, isArbitraryVariablePosition, isArbitraryPosition];
  const scaleBlur = () => [
  // Deprecated since Tailwind CSS v4.0.0
  '', 'none', themeBlur, isArbitraryVariable, isArbitraryValue];
  const scaleRotate = () => ['none', isNumber, isArbitraryVariable, isArbitraryValue];
  const scaleScale = () => ['none', isNumber, isArbitraryVariable, isArbitraryValue];
  const scaleSkew = () => [isNumber, isArbitraryVariable, isArbitraryValue];
  const scaleTranslate = () => [isFraction, 'full', ...scaleUnambiguousSpacing()];
  return {
    cacheSize: 500,
    theme: {
      animate: ['spin', 'ping', 'pulse', 'bounce'],
      aspect: ['video'],
      blur: [isTshirtSize],
      breakpoint: [isTshirtSize],
      color: [isAny],
      container: [isTshirtSize],
      'drop-shadow': [isTshirtSize],
      ease: ['in', 'out', 'in-out'],
      font: [isAnyNonArbitrary],
      'font-weight': ['thin', 'extralight', 'light', 'normal', 'medium', 'semibold', 'bold', 'extrabold', 'black'],
      'inset-shadow': [isTshirtSize],
      leading: ['none', 'tight', 'snug', 'normal', 'relaxed', 'loose'],
      perspective: ['dramatic', 'near', 'normal', 'midrange', 'distant', 'none'],
      radius: [isTshirtSize],
      shadow: [isTshirtSize],
      spacing: ['px', isNumber],
      text: [isTshirtSize],
      'text-shadow': [isTshirtSize],
      tracking: ['tighter', 'tight', 'normal', 'wide', 'wider', 'widest']
    },
    classGroups: {
      // --------------
      // --- Layout ---
      // --------------
      /**
       * Aspect Ratio
       * @see https://tailwindcss.com/docs/aspect-ratio
       */
      aspect: [{
        aspect: ['auto', 'square', isFraction, isArbitraryValue, isArbitraryVariable, themeAspect]
      }],
      /**
       * Container
       * @see https://tailwindcss.com/docs/container
       * @deprecated since Tailwind CSS v4.0.0
       */
      container: ['container'],
      /**
       * Columns
       * @see https://tailwindcss.com/docs/columns
       */
      columns: [{
        columns: [isNumber, isArbitraryValue, isArbitraryVariable, themeContainer]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      'break-after': [{
        'break-after': scaleBreak()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      'break-before': [{
        'break-before': scaleBreak()
      }],
      /**
       * Break Inside
       * @see https://tailwindcss.com/docs/break-inside
       */
      'break-inside': [{
        'break-inside': ['auto', 'avoid', 'avoid-page', 'avoid-column']
      }],
      /**
       * Box Decoration Break
       * @see https://tailwindcss.com/docs/box-decoration-break
       */
      'box-decoration': [{
        'box-decoration': ['slice', 'clone']
      }],
      /**
       * Box Sizing
       * @see https://tailwindcss.com/docs/box-sizing
       */
      box: [{
        box: ['border', 'content']
      }],
      /**
       * Display
       * @see https://tailwindcss.com/docs/display
       */
      display: ['block', 'inline-block', 'inline', 'flex', 'inline-flex', 'table', 'inline-table', 'table-caption', 'table-cell', 'table-column', 'table-column-group', 'table-footer-group', 'table-header-group', 'table-row-group', 'table-row', 'flow-root', 'grid', 'inline-grid', 'contents', 'list-item', 'hidden'],
      /**
       * Screen Reader Only
       * @see https://tailwindcss.com/docs/display#screen-reader-only
       */
      sr: ['sr-only', 'not-sr-only'],
      /**
       * Floats
       * @see https://tailwindcss.com/docs/float
       */
      float: [{
        float: ['right', 'left', 'none', 'start', 'end']
      }],
      /**
       * Clear
       * @see https://tailwindcss.com/docs/clear
       */
      clear: [{
        clear: ['left', 'right', 'both', 'none', 'start', 'end']
      }],
      /**
       * Isolation
       * @see https://tailwindcss.com/docs/isolation
       */
      isolation: ['isolate', 'isolation-auto'],
      /**
       * Object Fit
       * @see https://tailwindcss.com/docs/object-fit
       */
      'object-fit': [{
        object: ['contain', 'cover', 'fill', 'none', 'scale-down']
      }],
      /**
       * Object Position
       * @see https://tailwindcss.com/docs/object-position
       */
      'object-position': [{
        object: scalePositionWithArbitrary()
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: scaleOverflow()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      'overflow-x': [{
        'overflow-x': scaleOverflow()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      'overflow-y': [{
        'overflow-y': scaleOverflow()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: scaleOverscroll()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      'overscroll-x': [{
        'overscroll-x': scaleOverscroll()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      'overscroll-y': [{
        'overscroll-y': scaleOverscroll()
      }],
      /**
       * Position
       * @see https://tailwindcss.com/docs/position
       */
      position: ['static', 'fixed', 'absolute', 'relative', 'sticky'],
      /**
       * Top / Right / Bottom / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      inset: [{
        inset: scaleInset()
      }],
      /**
       * Right / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      'inset-x': [{
        'inset-x': scaleInset()
      }],
      /**
       * Top / Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      'inset-y': [{
        'inset-y': scaleInset()
      }],
      /**
       * Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      start: [{
        start: scaleInset()
      }],
      /**
       * End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      end: [{
        end: scaleInset()
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: scaleInset()
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: scaleInset()
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: scaleInset()
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: scaleInset()
      }],
      /**
       * Visibility
       * @see https://tailwindcss.com/docs/visibility
       */
      visibility: ['visible', 'invisible', 'collapse'],
      /**
       * Z-Index
       * @see https://tailwindcss.com/docs/z-index
       */
      z: [{
        z: [isInteger, 'auto', isArbitraryVariable, isArbitraryValue]
      }],
      // ------------------------
      // --- Flexbox and Grid ---
      // ------------------------
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: [isFraction, 'full', 'auto', themeContainer, ...scaleUnambiguousSpacing()]
      }],
      /**
       * Flex Direction
       * @see https://tailwindcss.com/docs/flex-direction
       */
      'flex-direction': [{
        flex: ['row', 'row-reverse', 'col', 'col-reverse']
      }],
      /**
       * Flex Wrap
       * @see https://tailwindcss.com/docs/flex-wrap
       */
      'flex-wrap': [{
        flex: ['nowrap', 'wrap', 'wrap-reverse']
      }],
      /**
       * Flex
       * @see https://tailwindcss.com/docs/flex
       */
      flex: [{
        flex: [isNumber, isFraction, 'auto', 'initial', 'none', isArbitraryValue]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: ['', isNumber, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: ['', isNumber, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: [isInteger, 'first', 'last', 'none', isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      'grid-cols': [{
        'grid-cols': scaleGridTemplateColsRows()
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      'col-start-end': [{
        col: scaleGridColRowStartAndEnd()
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      'col-start': [{
        'col-start': scaleGridColRowStartOrEnd()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      'col-end': [{
        'col-end': scaleGridColRowStartOrEnd()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      'grid-rows': [{
        'grid-rows': scaleGridTemplateColsRows()
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      'row-start-end': [{
        row: scaleGridColRowStartAndEnd()
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      'row-start': [{
        'row-start': scaleGridColRowStartOrEnd()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      'row-end': [{
        'row-end': scaleGridColRowStartOrEnd()
      }],
      /**
       * Grid Auto Flow
       * @see https://tailwindcss.com/docs/grid-auto-flow
       */
      'grid-flow': [{
        'grid-flow': ['row', 'col', 'dense', 'row-dense', 'col-dense']
      }],
      /**
       * Grid Auto Columns
       * @see https://tailwindcss.com/docs/grid-auto-columns
       */
      'auto-cols': [{
        'auto-cols': scaleGridAutoColsRows()
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      'auto-rows': [{
        'auto-rows': scaleGridAutoColsRows()
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: scaleUnambiguousSpacing()
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      'gap-x': [{
        'gap-x': scaleUnambiguousSpacing()
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      'gap-y': [{
        'gap-y': scaleUnambiguousSpacing()
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      'justify-content': [{
        justify: [...scaleAlignPrimaryAxis(), 'normal']
      }],
      /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */
      'justify-items': [{
        'justify-items': [...scaleAlignSecondaryAxis(), 'normal']
      }],
      /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */
      'justify-self': [{
        'justify-self': ['auto', ...scaleAlignSecondaryAxis()]
      }],
      /**
       * Align Content
       * @see https://tailwindcss.com/docs/align-content
       */
      'align-content': [{
        content: ['normal', ...scaleAlignPrimaryAxis()]
      }],
      /**
       * Align Items
       * @see https://tailwindcss.com/docs/align-items
       */
      'align-items': [{
        items: [...scaleAlignSecondaryAxis(), {
          baseline: ['', 'last']
        }]
      }],
      /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */
      'align-self': [{
        self: ['auto', ...scaleAlignSecondaryAxis(), {
          baseline: ['', 'last']
        }]
      }],
      /**
       * Place Content
       * @see https://tailwindcss.com/docs/place-content
       */
      'place-content': [{
        'place-content': scaleAlignPrimaryAxis()
      }],
      /**
       * Place Items
       * @see https://tailwindcss.com/docs/place-items
       */
      'place-items': [{
        'place-items': [...scaleAlignSecondaryAxis(), 'baseline']
      }],
      /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */
      'place-self': [{
        'place-self': ['auto', ...scaleAlignSecondaryAxis()]
      }],
      // Spacing
      /**
       * Padding
       * @see https://tailwindcss.com/docs/padding
       */
      p: [{
        p: scaleUnambiguousSpacing()
      }],
      /**
       * Padding X
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: scaleUnambiguousSpacing()
      }],
      /**
       * Padding Y
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: scaleUnambiguousSpacing()
      }],
      /**
       * Padding Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: scaleUnambiguousSpacing()
      }],
      /**
       * Padding End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: scaleUnambiguousSpacing()
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: scaleUnambiguousSpacing()
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: scaleUnambiguousSpacing()
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: scaleUnambiguousSpacing()
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: scaleUnambiguousSpacing()
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: scaleMargin()
      }],
      /**
       * Margin X
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: scaleMargin()
      }],
      /**
       * Margin Y
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: scaleMargin()
      }],
      /**
       * Margin Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: scaleMargin()
      }],
      /**
       * Margin End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: scaleMargin()
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: scaleMargin()
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: scaleMargin()
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: scaleMargin()
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: scaleMargin()
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      'space-x': [{
        'space-x': scaleUnambiguousSpacing()
      }],
      /**
       * Space Between X Reverse
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      'space-x-reverse': ['space-x-reverse'],
      /**
       * Space Between Y
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      'space-y': [{
        'space-y': scaleUnambiguousSpacing()
      }],
      /**
       * Space Between Y Reverse
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      'space-y-reverse': ['space-y-reverse'],
      // --------------
      // --- Sizing ---
      // --------------
      /**
       * Size
       * @see https://tailwindcss.com/docs/width#setting-both-width-and-height
       */
      size: [{
        size: scaleSizing()
      }],
      /**
       * Width
       * @see https://tailwindcss.com/docs/width
       */
      w: [{
        w: [themeContainer, 'screen', ...scaleSizing()]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      'min-w': [{
        'min-w': [themeContainer, 'screen', /** Deprecated. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
        'none', ...scaleSizing()]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      'max-w': [{
        'max-w': [themeContainer, 'screen', 'none', /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
        'prose', /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
        {
          screen: [themeBreakpoint]
        }, ...scaleSizing()]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: ['screen', 'lh', ...scaleSizing()]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      'min-h': [{
        'min-h': ['screen', 'lh', 'none', ...scaleSizing()]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      'max-h': [{
        'max-h': ['screen', 'lh', ...scaleSizing()]
      }],
      // ------------------
      // --- Typography ---
      // ------------------
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      'font-size': [{
        text: ['base', themeText, isArbitraryVariableLength, isArbitraryLength]
      }],
      /**
       * Font Smoothing
       * @see https://tailwindcss.com/docs/font-smoothing
       */
      'font-smoothing': ['antialiased', 'subpixel-antialiased'],
      /**
       * Font Style
       * @see https://tailwindcss.com/docs/font-style
       */
      'font-style': ['italic', 'not-italic'],
      /**
       * Font Weight
       * @see https://tailwindcss.com/docs/font-weight
       */
      'font-weight': [{
        font: [themeFontWeight, isArbitraryVariable, isArbitraryNumber]
      }],
      /**
       * Font Stretch
       * @see https://tailwindcss.com/docs/font-stretch
       */
      'font-stretch': [{
        'font-stretch': ['ultra-condensed', 'extra-condensed', 'condensed', 'semi-condensed', 'normal', 'semi-expanded', 'expanded', 'extra-expanded', 'ultra-expanded', isPercent, isArbitraryValue]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      'font-family': [{
        font: [isArbitraryVariableFamilyName, isArbitraryValue, themeFont]
      }],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      'fvn-normal': ['normal-nums'],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      'fvn-ordinal': ['ordinal'],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      'fvn-slashed-zero': ['slashed-zero'],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      'fvn-figure': ['lining-nums', 'oldstyle-nums'],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      'fvn-spacing': ['proportional-nums', 'tabular-nums'],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      'fvn-fraction': ['diagonal-fractions', 'stacked-fractions'],
      /**
       * Letter Spacing
       * @see https://tailwindcss.com/docs/letter-spacing
       */
      tracking: [{
        tracking: [themeTracking, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      'line-clamp': [{
        'line-clamp': [isNumber, 'none', isArbitraryVariable, isArbitraryNumber]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: [/** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
        themeLeading, ...scaleUnambiguousSpacing()]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      'list-image': [{
        'list-image': ['none', isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * List Style Position
       * @see https://tailwindcss.com/docs/list-style-position
       */
      'list-style-position': [{
        list: ['inside', 'outside']
      }],
      /**
       * List Style Type
       * @see https://tailwindcss.com/docs/list-style-type
       */
      'list-style-type': [{
        list: ['disc', 'decimal', 'none', isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Text Alignment
       * @see https://tailwindcss.com/docs/text-align
       */
      'text-alignment': [{
        text: ['left', 'center', 'right', 'justify', 'start', 'end']
      }],
      /**
       * Placeholder Color
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://v3.tailwindcss.com/docs/placeholder-color
       */
      'placeholder-color': [{
        placeholder: scaleColor()
      }],
      /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */
      'text-color': [{
        text: scaleColor()
      }],
      /**
       * Text Decoration
       * @see https://tailwindcss.com/docs/text-decoration
       */
      'text-decoration': ['underline', 'overline', 'line-through', 'no-underline'],
      /**
       * Text Decoration Style
       * @see https://tailwindcss.com/docs/text-decoration-style
       */
      'text-decoration-style': [{
        decoration: [...scaleLineStyle(), 'wavy']
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      'text-decoration-thickness': [{
        decoration: [isNumber, 'from-font', 'auto', isArbitraryVariable, isArbitraryLength]
      }],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      'text-decoration-color': [{
        decoration: scaleColor()
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      'underline-offset': [{
        'underline-offset': [isNumber, 'auto', isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Text Transform
       * @see https://tailwindcss.com/docs/text-transform
       */
      'text-transform': ['uppercase', 'lowercase', 'capitalize', 'normal-case'],
      /**
       * Text Overflow
       * @see https://tailwindcss.com/docs/text-overflow
       */
      'text-overflow': ['truncate', 'text-ellipsis', 'text-clip'],
      /**
       * Text Wrap
       * @see https://tailwindcss.com/docs/text-wrap
       */
      'text-wrap': [{
        text: ['wrap', 'nowrap', 'balance', 'pretty']
      }],
      /**
       * Text Indent
       * @see https://tailwindcss.com/docs/text-indent
       */
      indent: [{
        indent: scaleUnambiguousSpacing()
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      'vertical-align': [{
        align: ['baseline', 'top', 'middle', 'bottom', 'text-top', 'text-bottom', 'sub', 'super', isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Whitespace
       * @see https://tailwindcss.com/docs/whitespace
       */
      whitespace: [{
        whitespace: ['normal', 'nowrap', 'pre', 'pre-line', 'pre-wrap', 'break-spaces']
      }],
      /**
       * Word Break
       * @see https://tailwindcss.com/docs/word-break
       */
      break: [{
        break: ['normal', 'words', 'all', 'keep']
      }],
      /**
       * Overflow Wrap
       * @see https://tailwindcss.com/docs/overflow-wrap
       */
      wrap: [{
        wrap: ['break-word', 'anywhere', 'normal']
      }],
      /**
       * Hyphens
       * @see https://tailwindcss.com/docs/hyphens
       */
      hyphens: [{
        hyphens: ['none', 'manual', 'auto']
      }],
      /**
       * Content
       * @see https://tailwindcss.com/docs/content
       */
      content: [{
        content: ['none', isArbitraryVariable, isArbitraryValue]
      }],
      // -------------------
      // --- Backgrounds ---
      // -------------------
      /**
       * Background Attachment
       * @see https://tailwindcss.com/docs/background-attachment
       */
      'bg-attachment': [{
        bg: ['fixed', 'local', 'scroll']
      }],
      /**
       * Background Clip
       * @see https://tailwindcss.com/docs/background-clip
       */
      'bg-clip': [{
        'bg-clip': ['border', 'padding', 'content', 'text']
      }],
      /**
       * Background Origin
       * @see https://tailwindcss.com/docs/background-origin
       */
      'bg-origin': [{
        'bg-origin': ['border', 'padding', 'content']
      }],
      /**
       * Background Position
       * @see https://tailwindcss.com/docs/background-position
       */
      'bg-position': [{
        bg: scaleBgPosition()
      }],
      /**
       * Background Repeat
       * @see https://tailwindcss.com/docs/background-repeat
       */
      'bg-repeat': [{
        bg: scaleBgRepeat()
      }],
      /**
       * Background Size
       * @see https://tailwindcss.com/docs/background-size
       */
      'bg-size': [{
        bg: scaleBgSize()
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      'bg-image': [{
        bg: ['none', {
          linear: [{
            to: ['t', 'tr', 'r', 'br', 'b', 'bl', 'l', 'tl']
          }, isInteger, isArbitraryVariable, isArbitraryValue],
          radial: ['', isArbitraryVariable, isArbitraryValue],
          conic: [isInteger, isArbitraryVariable, isArbitraryValue]
        }, isArbitraryVariableImage, isArbitraryImage]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      'bg-color': [{
        bg: scaleColor()
      }],
      /**
       * Gradient Color Stops From Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      'gradient-from-pos': [{
        from: scaleGradientStopPosition()
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      'gradient-via-pos': [{
        via: scaleGradientStopPosition()
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      'gradient-to-pos': [{
        to: scaleGradientStopPosition()
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      'gradient-from': [{
        from: scaleColor()
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      'gradient-via': [{
        via: scaleColor()
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      'gradient-to': [{
        to: scaleColor()
      }],
      // ---------------
      // --- Borders ---
      // ---------------
      /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */
      rounded: [{
        rounded: scaleRadius()
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-s': [{
        'rounded-s': scaleRadius()
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-e': [{
        'rounded-e': scaleRadius()
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-t': [{
        'rounded-t': scaleRadius()
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-r': [{
        'rounded-r': scaleRadius()
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-b': [{
        'rounded-b': scaleRadius()
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-l': [{
        'rounded-l': scaleRadius()
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-ss': [{
        'rounded-ss': scaleRadius()
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-se': [{
        'rounded-se': scaleRadius()
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-ee': [{
        'rounded-ee': scaleRadius()
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-es': [{
        'rounded-es': scaleRadius()
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-tl': [{
        'rounded-tl': scaleRadius()
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-tr': [{
        'rounded-tr': scaleRadius()
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-br': [{
        'rounded-br': scaleRadius()
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      'rounded-bl': [{
        'rounded-bl': scaleRadius()
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      'border-w': [{
        border: scaleBorderWidth()
      }],
      /**
       * Border Width X
       * @see https://tailwindcss.com/docs/border-width
       */
      'border-w-x': [{
        'border-x': scaleBorderWidth()
      }],
      /**
       * Border Width Y
       * @see https://tailwindcss.com/docs/border-width
       */
      'border-w-y': [{
        'border-y': scaleBorderWidth()
      }],
      /**
       * Border Width Start
       * @see https://tailwindcss.com/docs/border-width
       */
      'border-w-s': [{
        'border-s': scaleBorderWidth()
      }],
      /**
       * Border Width End
       * @see https://tailwindcss.com/docs/border-width
       */
      'border-w-e': [{
        'border-e': scaleBorderWidth()
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      'border-w-t': [{
        'border-t': scaleBorderWidth()
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      'border-w-r': [{
        'border-r': scaleBorderWidth()
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      'border-w-b': [{
        'border-b': scaleBorderWidth()
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      'border-w-l': [{
        'border-l': scaleBorderWidth()
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      'divide-x': [{
        'divide-x': scaleBorderWidth()
      }],
      /**
       * Divide Width X Reverse
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      'divide-x-reverse': ['divide-x-reverse'],
      /**
       * Divide Width Y
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      'divide-y': [{
        'divide-y': scaleBorderWidth()
      }],
      /**
       * Divide Width Y Reverse
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      'divide-y-reverse': ['divide-y-reverse'],
      /**
       * Border Style
       * @see https://tailwindcss.com/docs/border-style
       */
      'border-style': [{
        border: [...scaleLineStyle(), 'hidden', 'none']
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/border-style#setting-the-divider-style
       */
      'divide-style': [{
        divide: [...scaleLineStyle(), 'hidden', 'none']
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      'border-color': [{
        border: scaleColor()
      }],
      /**
       * Border Color X
       * @see https://tailwindcss.com/docs/border-color
       */
      'border-color-x': [{
        'border-x': scaleColor()
      }],
      /**
       * Border Color Y
       * @see https://tailwindcss.com/docs/border-color
       */
      'border-color-y': [{
        'border-y': scaleColor()
      }],
      /**
       * Border Color S
       * @see https://tailwindcss.com/docs/border-color
       */
      'border-color-s': [{
        'border-s': scaleColor()
      }],
      /**
       * Border Color E
       * @see https://tailwindcss.com/docs/border-color
       */
      'border-color-e': [{
        'border-e': scaleColor()
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      'border-color-t': [{
        'border-t': scaleColor()
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      'border-color-r': [{
        'border-r': scaleColor()
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      'border-color-b': [{
        'border-b': scaleColor()
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      'border-color-l': [{
        'border-l': scaleColor()
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      'divide-color': [{
        divide: scaleColor()
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      'outline-style': [{
        outline: [...scaleLineStyle(), 'none', 'hidden']
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      'outline-offset': [{
        'outline-offset': [isNumber, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      'outline-w': [{
        outline: ['', isNumber, isArbitraryVariableLength, isArbitraryLength]
      }],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      'outline-color': [{
        outline: scaleColor()
      }],
      // ---------------
      // --- Effects ---
      // ---------------
      /**
       * Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow
       */
      shadow: [{
        shadow: [
        // Deprecated since Tailwind CSS v4.0.0
        '', 'none', themeShadow, isArbitraryVariableShadow, isArbitraryShadow]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-shadow-color
       */
      'shadow-color': [{
        shadow: scaleColor()
      }],
      /**
       * Inset Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-shadow
       */
      'inset-shadow': [{
        'inset-shadow': ['none', themeInsetShadow, isArbitraryVariableShadow, isArbitraryShadow]
      }],
      /**
       * Inset Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-shadow-color
       */
      'inset-shadow-color': [{
        'inset-shadow': scaleColor()
      }],
      /**
       * Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-a-ring
       */
      'ring-w': [{
        ring: scaleBorderWidth()
      }],
      /**
       * Ring Width Inset
       * @see https://v3.tailwindcss.com/docs/ring-width#inset-rings
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      'ring-w-inset': ['ring-inset'],
      /**
       * Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-ring-color
       */
      'ring-color': [{
        ring: scaleColor()
      }],
      /**
       * Ring Offset Width
       * @see https://v3.tailwindcss.com/docs/ring-offset-width
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      'ring-offset-w': [{
        'ring-offset': [isNumber, isArbitraryLength]
      }],
      /**
       * Ring Offset Color
       * @see https://v3.tailwindcss.com/docs/ring-offset-color
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      'ring-offset-color': [{
        'ring-offset': scaleColor()
      }],
      /**
       * Inset Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-ring
       */
      'inset-ring-w': [{
        'inset-ring': scaleBorderWidth()
      }],
      /**
       * Inset Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-ring-color
       */
      'inset-ring-color': [{
        'inset-ring': scaleColor()
      }],
      /**
       * Text Shadow
       * @see https://tailwindcss.com/docs/text-shadow
       */
      'text-shadow': [{
        'text-shadow': ['none', themeTextShadow, isArbitraryVariableShadow, isArbitraryShadow]
      }],
      /**
       * Text Shadow Color
       * @see https://tailwindcss.com/docs/text-shadow#setting-the-shadow-color
       */
      'text-shadow-color': [{
        'text-shadow': scaleColor()
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [isNumber, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      'mix-blend': [{
        'mix-blend': [...scaleBlendMode(), 'plus-darker', 'plus-lighter']
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      'bg-blend': [{
        'bg-blend': scaleBlendMode()
      }],
      /**
       * Mask Clip
       * @see https://tailwindcss.com/docs/mask-clip
       */
      'mask-clip': [{
        'mask-clip': ['border', 'padding', 'content', 'fill', 'stroke', 'view']
      }, 'mask-no-clip'],
      /**
       * Mask Composite
       * @see https://tailwindcss.com/docs/mask-composite
       */
      'mask-composite': [{
        mask: ['add', 'subtract', 'intersect', 'exclude']
      }],
      /**
       * Mask Image
       * @see https://tailwindcss.com/docs/mask-image
       */
      'mask-image-linear-pos': [{
        'mask-linear': [isNumber]
      }],
      'mask-image-linear-from-pos': [{
        'mask-linear-from': scaleMaskImagePosition()
      }],
      'mask-image-linear-to-pos': [{
        'mask-linear-to': scaleMaskImagePosition()
      }],
      'mask-image-linear-from-color': [{
        'mask-linear-from': scaleColor()
      }],
      'mask-image-linear-to-color': [{
        'mask-linear-to': scaleColor()
      }],
      'mask-image-t-from-pos': [{
        'mask-t-from': scaleMaskImagePosition()
      }],
      'mask-image-t-to-pos': [{
        'mask-t-to': scaleMaskImagePosition()
      }],
      'mask-image-t-from-color': [{
        'mask-t-from': scaleColor()
      }],
      'mask-image-t-to-color': [{
        'mask-t-to': scaleColor()
      }],
      'mask-image-r-from-pos': [{
        'mask-r-from': scaleMaskImagePosition()
      }],
      'mask-image-r-to-pos': [{
        'mask-r-to': scaleMaskImagePosition()
      }],
      'mask-image-r-from-color': [{
        'mask-r-from': scaleColor()
      }],
      'mask-image-r-to-color': [{
        'mask-r-to': scaleColor()
      }],
      'mask-image-b-from-pos': [{
        'mask-b-from': scaleMaskImagePosition()
      }],
      'mask-image-b-to-pos': [{
        'mask-b-to': scaleMaskImagePosition()
      }],
      'mask-image-b-from-color': [{
        'mask-b-from': scaleColor()
      }],
      'mask-image-b-to-color': [{
        'mask-b-to': scaleColor()
      }],
      'mask-image-l-from-pos': [{
        'mask-l-from': scaleMaskImagePosition()
      }],
      'mask-image-l-to-pos': [{
        'mask-l-to': scaleMaskImagePosition()
      }],
      'mask-image-l-from-color': [{
        'mask-l-from': scaleColor()
      }],
      'mask-image-l-to-color': [{
        'mask-l-to': scaleColor()
      }],
      'mask-image-x-from-pos': [{
        'mask-x-from': scaleMaskImagePosition()
      }],
      'mask-image-x-to-pos': [{
        'mask-x-to': scaleMaskImagePosition()
      }],
      'mask-image-x-from-color': [{
        'mask-x-from': scaleColor()
      }],
      'mask-image-x-to-color': [{
        'mask-x-to': scaleColor()
      }],
      'mask-image-y-from-pos': [{
        'mask-y-from': scaleMaskImagePosition()
      }],
      'mask-image-y-to-pos': [{
        'mask-y-to': scaleMaskImagePosition()
      }],
      'mask-image-y-from-color': [{
        'mask-y-from': scaleColor()
      }],
      'mask-image-y-to-color': [{
        'mask-y-to': scaleColor()
      }],
      'mask-image-radial': [{
        'mask-radial': [isArbitraryVariable, isArbitraryValue]
      }],
      'mask-image-radial-from-pos': [{
        'mask-radial-from': scaleMaskImagePosition()
      }],
      'mask-image-radial-to-pos': [{
        'mask-radial-to': scaleMaskImagePosition()
      }],
      'mask-image-radial-from-color': [{
        'mask-radial-from': scaleColor()
      }],
      'mask-image-radial-to-color': [{
        'mask-radial-to': scaleColor()
      }],
      'mask-image-radial-shape': [{
        'mask-radial': ['circle', 'ellipse']
      }],
      'mask-image-radial-size': [{
        'mask-radial': [{
          closest: ['side', 'corner'],
          farthest: ['side', 'corner']
        }]
      }],
      'mask-image-radial-pos': [{
        'mask-radial-at': scalePosition()
      }],
      'mask-image-conic-pos': [{
        'mask-conic': [isNumber]
      }],
      'mask-image-conic-from-pos': [{
        'mask-conic-from': scaleMaskImagePosition()
      }],
      'mask-image-conic-to-pos': [{
        'mask-conic-to': scaleMaskImagePosition()
      }],
      'mask-image-conic-from-color': [{
        'mask-conic-from': scaleColor()
      }],
      'mask-image-conic-to-color': [{
        'mask-conic-to': scaleColor()
      }],
      /**
       * Mask Mode
       * @see https://tailwindcss.com/docs/mask-mode
       */
      'mask-mode': [{
        mask: ['alpha', 'luminance', 'match']
      }],
      /**
       * Mask Origin
       * @see https://tailwindcss.com/docs/mask-origin
       */
      'mask-origin': [{
        'mask-origin': ['border', 'padding', 'content', 'fill', 'stroke', 'view']
      }],
      /**
       * Mask Position
       * @see https://tailwindcss.com/docs/mask-position
       */
      'mask-position': [{
        mask: scaleBgPosition()
      }],
      /**
       * Mask Repeat
       * @see https://tailwindcss.com/docs/mask-repeat
       */
      'mask-repeat': [{
        mask: scaleBgRepeat()
      }],
      /**
       * Mask Size
       * @see https://tailwindcss.com/docs/mask-size
       */
      'mask-size': [{
        mask: scaleBgSize()
      }],
      /**
       * Mask Type
       * @see https://tailwindcss.com/docs/mask-type
       */
      'mask-type': [{
        'mask-type': ['alpha', 'luminance']
      }],
      /**
       * Mask Image
       * @see https://tailwindcss.com/docs/mask-image
       */
      'mask-image': [{
        mask: ['none', isArbitraryVariable, isArbitraryValue]
      }],
      // ---------------
      // --- Filters ---
      // ---------------
      /**
       * Filter
       * @see https://tailwindcss.com/docs/filter
       */
      filter: [{
        filter: [
        // Deprecated since Tailwind CSS v3.0.0
        '', 'none', isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */
      blur: [{
        blur: scaleBlur()
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [isNumber, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [isNumber, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Drop Shadow
       * @see https://tailwindcss.com/docs/drop-shadow
       */
      'drop-shadow': [{
        'drop-shadow': [
        // Deprecated since Tailwind CSS v4.0.0
        '', 'none', themeDropShadow, isArbitraryVariableShadow, isArbitraryShadow]
      }],
      /**
       * Drop Shadow Color
       * @see https://tailwindcss.com/docs/filter-drop-shadow#setting-the-shadow-color
       */
      'drop-shadow-color': [{
        'drop-shadow': scaleColor()
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: ['', isNumber, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      'hue-rotate': [{
        'hue-rotate': [isNumber, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: ['', isNumber, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [isNumber, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: ['', isNumber, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Backdrop Filter
       * @see https://tailwindcss.com/docs/backdrop-filter
       */
      'backdrop-filter': [{
        'backdrop-filter': [
        // Deprecated since Tailwind CSS v3.0.0
        '', 'none', isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */
      'backdrop-blur': [{
        'backdrop-blur': scaleBlur()
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      'backdrop-brightness': [{
        'backdrop-brightness': [isNumber, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      'backdrop-contrast': [{
        'backdrop-contrast': [isNumber, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      'backdrop-grayscale': [{
        'backdrop-grayscale': ['', isNumber, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      'backdrop-hue-rotate': [{
        'backdrop-hue-rotate': [isNumber, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      'backdrop-invert': [{
        'backdrop-invert': ['', isNumber, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      'backdrop-opacity': [{
        'backdrop-opacity': [isNumber, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      'backdrop-saturate': [{
        'backdrop-saturate': [isNumber, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      'backdrop-sepia': [{
        'backdrop-sepia': ['', isNumber, isArbitraryVariable, isArbitraryValue]
      }],
      // --------------
      // --- Tables ---
      // --------------
      /**
       * Border Collapse
       * @see https://tailwindcss.com/docs/border-collapse
       */
      'border-collapse': [{
        border: ['collapse', 'separate']
      }],
      /**
       * Border Spacing
       * @see https://tailwindcss.com/docs/border-spacing
       */
      'border-spacing': [{
        'border-spacing': scaleUnambiguousSpacing()
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      'border-spacing-x': [{
        'border-spacing-x': scaleUnambiguousSpacing()
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      'border-spacing-y': [{
        'border-spacing-y': scaleUnambiguousSpacing()
      }],
      /**
       * Table Layout
       * @see https://tailwindcss.com/docs/table-layout
       */
      'table-layout': [{
        table: ['auto', 'fixed']
      }],
      /**
       * Caption Side
       * @see https://tailwindcss.com/docs/caption-side
       */
      caption: [{
        caption: ['top', 'bottom']
      }],
      // ---------------------------------
      // --- Transitions and Animation ---
      // ---------------------------------
      /**
       * Transition Property
       * @see https://tailwindcss.com/docs/transition-property
       */
      transition: [{
        transition: ['', 'all', 'colors', 'opacity', 'shadow', 'transform', 'none', isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Transition Behavior
       * @see https://tailwindcss.com/docs/transition-behavior
       */
      'transition-behavior': [{
        transition: ['normal', 'discrete']
      }],
      /**
       * Transition Duration
       * @see https://tailwindcss.com/docs/transition-duration
       */
      duration: [{
        duration: [isNumber, 'initial', isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ['linear', 'initial', themeEase, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: [isNumber, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ['none', themeAnimate, isArbitraryVariable, isArbitraryValue]
      }],
      // ------------------
      // --- Transforms ---
      // ------------------
      /**
       * Backface Visibility
       * @see https://tailwindcss.com/docs/backface-visibility
       */
      backface: [{
        backface: ['hidden', 'visible']
      }],
      /**
       * Perspective
       * @see https://tailwindcss.com/docs/perspective
       */
      perspective: [{
        perspective: [themePerspective, isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Perspective Origin
       * @see https://tailwindcss.com/docs/perspective-origin
       */
      'perspective-origin': [{
        'perspective-origin': scalePositionWithArbitrary()
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: scaleRotate()
      }],
      /**
       * Rotate X
       * @see https://tailwindcss.com/docs/rotate
       */
      'rotate-x': [{
        'rotate-x': scaleRotate()
      }],
      /**
       * Rotate Y
       * @see https://tailwindcss.com/docs/rotate
       */
      'rotate-y': [{
        'rotate-y': scaleRotate()
      }],
      /**
       * Rotate Z
       * @see https://tailwindcss.com/docs/rotate
       */
      'rotate-z': [{
        'rotate-z': scaleRotate()
      }],
      /**
       * Scale
       * @see https://tailwindcss.com/docs/scale
       */
      scale: [{
        scale: scaleScale()
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      'scale-x': [{
        'scale-x': scaleScale()
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      'scale-y': [{
        'scale-y': scaleScale()
      }],
      /**
       * Scale Z
       * @see https://tailwindcss.com/docs/scale
       */
      'scale-z': [{
        'scale-z': scaleScale()
      }],
      /**
       * Scale 3D
       * @see https://tailwindcss.com/docs/scale
       */
      'scale-3d': ['scale-3d'],
      /**
       * Skew
       * @see https://tailwindcss.com/docs/skew
       */
      skew: [{
        skew: scaleSkew()
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      'skew-x': [{
        'skew-x': scaleSkew()
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      'skew-y': [{
        'skew-y': scaleSkew()
      }],
      /**
       * Transform
       * @see https://tailwindcss.com/docs/transform
       */
      transform: [{
        transform: [isArbitraryVariable, isArbitraryValue, '', 'none', 'gpu', 'cpu']
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      'transform-origin': [{
        origin: scalePositionWithArbitrary()
      }],
      /**
       * Transform Style
       * @see https://tailwindcss.com/docs/transform-style
       */
      'transform-style': [{
        transform: ['3d', 'flat']
      }],
      /**
       * Translate
       * @see https://tailwindcss.com/docs/translate
       */
      translate: [{
        translate: scaleTranslate()
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      'translate-x': [{
        'translate-x': scaleTranslate()
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      'translate-y': [{
        'translate-y': scaleTranslate()
      }],
      /**
       * Translate Z
       * @see https://tailwindcss.com/docs/translate
       */
      'translate-z': [{
        'translate-z': scaleTranslate()
      }],
      /**
       * Translate None
       * @see https://tailwindcss.com/docs/translate
       */
      'translate-none': ['translate-none'],
      // ---------------------
      // --- Interactivity ---
      // ---------------------
      /**
       * Accent Color
       * @see https://tailwindcss.com/docs/accent-color
       */
      accent: [{
        accent: scaleColor()
      }],
      /**
       * Appearance
       * @see https://tailwindcss.com/docs/appearance
       */
      appearance: [{
        appearance: ['none', 'auto']
      }],
      /**
       * Caret Color
       * @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
       */
      'caret-color': [{
        caret: scaleColor()
      }],
      /**
       * Color Scheme
       * @see https://tailwindcss.com/docs/color-scheme
       */
      'color-scheme': [{
        scheme: ['normal', 'dark', 'light', 'light-dark', 'only-dark', 'only-light']
      }],
      /**
       * Cursor
       * @see https://tailwindcss.com/docs/cursor
       */
      cursor: [{
        cursor: ['auto', 'default', 'pointer', 'wait', 'text', 'move', 'help', 'not-allowed', 'none', 'context-menu', 'progress', 'cell', 'crosshair', 'vertical-text', 'alias', 'copy', 'no-drop', 'grab', 'grabbing', 'all-scroll', 'col-resize', 'row-resize', 'n-resize', 'e-resize', 's-resize', 'w-resize', 'ne-resize', 'nw-resize', 'se-resize', 'sw-resize', 'ew-resize', 'ns-resize', 'nesw-resize', 'nwse-resize', 'zoom-in', 'zoom-out', isArbitraryVariable, isArbitraryValue]
      }],
      /**
       * Field Sizing
       * @see https://tailwindcss.com/docs/field-sizing
       */
      'field-sizing': [{
        'field-sizing': ['fixed', 'content']
      }],
      /**
       * Pointer Events
       * @see https://tailwindcss.com/docs/pointer-events
       */
      'pointer-events': [{
        'pointer-events': ['auto', 'none']
      }],
      /**
       * Resize
       * @see https://tailwindcss.com/docs/resize
       */
      resize: [{
        resize: ['none', '', 'y', 'x']
      }],
      /**
       * Scroll Behavior
       * @see https://tailwindcss.com/docs/scroll-behavior
       */
      'scroll-behavior': [{
        scroll: ['auto', 'smooth']
      }],
      /**
       * Scroll Margin
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      'scroll-m': [{
        'scroll-m': scaleUnambiguousSpacing()
      }],
      /**
       * Scroll Margin X
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      'scroll-mx': [{
        'scroll-mx': scaleUnambiguousSpacing()
      }],
      /**
       * Scroll Margin Y
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      'scroll-my': [{
        'scroll-my': scaleUnambiguousSpacing()
      }],
      /**
       * Scroll Margin Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      'scroll-ms': [{
        'scroll-ms': scaleUnambiguousSpacing()
      }],
      /**
       * Scroll Margin End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      'scroll-me': [{
        'scroll-me': scaleUnambiguousSpacing()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      'scroll-mt': [{
        'scroll-mt': scaleUnambiguousSpacing()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      'scroll-mr': [{
        'scroll-mr': scaleUnambiguousSpacing()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      'scroll-mb': [{
        'scroll-mb': scaleUnambiguousSpacing()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      'scroll-ml': [{
        'scroll-ml': scaleUnambiguousSpacing()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      'scroll-p': [{
        'scroll-p': scaleUnambiguousSpacing()
      }],
      /**
       * Scroll Padding X
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      'scroll-px': [{
        'scroll-px': scaleUnambiguousSpacing()
      }],
      /**
       * Scroll Padding Y
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      'scroll-py': [{
        'scroll-py': scaleUnambiguousSpacing()
      }],
      /**
       * Scroll Padding Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      'scroll-ps': [{
        'scroll-ps': scaleUnambiguousSpacing()
      }],
      /**
       * Scroll Padding End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      'scroll-pe': [{
        'scroll-pe': scaleUnambiguousSpacing()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      'scroll-pt': [{
        'scroll-pt': scaleUnambiguousSpacing()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      'scroll-pr': [{
        'scroll-pr': scaleUnambiguousSpacing()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      'scroll-pb': [{
        'scroll-pb': scaleUnambiguousSpacing()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      'scroll-pl': [{
        'scroll-pl': scaleUnambiguousSpacing()
      }],
      /**
       * Scroll Snap Align
       * @see https://tailwindcss.com/docs/scroll-snap-align
       */
      'snap-align': [{
        snap: ['start', 'end', 'center', 'align-none']
      }],
      /**
       * Scroll Snap Stop
       * @see https://tailwindcss.com/docs/scroll-snap-stop
       */
      'snap-stop': [{
        snap: ['normal', 'always']
      }],
      /**
       * Scroll Snap Type
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      'snap-type': [{
        snap: ['none', 'x', 'y', 'both']
      }],
      /**
       * Scroll Snap Type Strictness
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      'snap-strictness': [{
        snap: ['mandatory', 'proximity']
      }],
      /**
       * Touch Action
       * @see https://tailwindcss.com/docs/touch-action
       */
      touch: [{
        touch: ['auto', 'none', 'manipulation']
      }],
      /**
       * Touch Action X
       * @see https://tailwindcss.com/docs/touch-action
       */
      'touch-x': [{
        'touch-pan': ['x', 'left', 'right']
      }],
      /**
       * Touch Action Y
       * @see https://tailwindcss.com/docs/touch-action
       */
      'touch-y': [{
        'touch-pan': ['y', 'up', 'down']
      }],
      /**
       * Touch Action Pinch Zoom
       * @see https://tailwindcss.com/docs/touch-action
       */
      'touch-pz': ['touch-pinch-zoom'],
      /**
       * User Select
       * @see https://tailwindcss.com/docs/user-select
       */
      select: [{
        select: ['none', 'text', 'all', 'auto']
      }],
      /**
       * Will Change
       * @see https://tailwindcss.com/docs/will-change
       */
      'will-change': [{
        'will-change': ['auto', 'scroll', 'contents', 'transform', isArbitraryVariable, isArbitraryValue]
      }],
      // -----------
      // --- SVG ---
      // -----------
      /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */
      fill: [{
        fill: ['none', ...scaleColor()]
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      'stroke-w': [{
        stroke: [isNumber, isArbitraryVariableLength, isArbitraryLength, isArbitraryNumber]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: ['none', ...scaleColor()]
      }],
      // ---------------------
      // --- Accessibility ---
      // ---------------------
      /**
       * Forced Color Adjust
       * @see https://tailwindcss.com/docs/forced-color-adjust
       */
      'forced-color-adjust': [{
        'forced-color-adjust': ['auto', 'none']
      }]
    },
    conflictingClassGroups: {
      overflow: ['overflow-x', 'overflow-y'],
      overscroll: ['overscroll-x', 'overscroll-y'],
      inset: ['inset-x', 'inset-y', 'start', 'end', 'top', 'right', 'bottom', 'left'],
      'inset-x': ['right', 'left'],
      'inset-y': ['top', 'bottom'],
      flex: ['basis', 'grow', 'shrink'],
      gap: ['gap-x', 'gap-y'],
      p: ['px', 'py', 'ps', 'pe', 'pt', 'pr', 'pb', 'pl'],
      px: ['pr', 'pl'],
      py: ['pt', 'pb'],
      m: ['mx', 'my', 'ms', 'me', 'mt', 'mr', 'mb', 'ml'],
      mx: ['mr', 'ml'],
      my: ['mt', 'mb'],
      size: ['w', 'h'],
      'font-size': ['leading'],
      'fvn-normal': ['fvn-ordinal', 'fvn-slashed-zero', 'fvn-figure', 'fvn-spacing', 'fvn-fraction'],
      'fvn-ordinal': ['fvn-normal'],
      'fvn-slashed-zero': ['fvn-normal'],
      'fvn-figure': ['fvn-normal'],
      'fvn-spacing': ['fvn-normal'],
      'fvn-fraction': ['fvn-normal'],
      'line-clamp': ['display', 'overflow'],
      rounded: ['rounded-s', 'rounded-e', 'rounded-t', 'rounded-r', 'rounded-b', 'rounded-l', 'rounded-ss', 'rounded-se', 'rounded-ee', 'rounded-es', 'rounded-tl', 'rounded-tr', 'rounded-br', 'rounded-bl'],
      'rounded-s': ['rounded-ss', 'rounded-es'],
      'rounded-e': ['rounded-se', 'rounded-ee'],
      'rounded-t': ['rounded-tl', 'rounded-tr'],
      'rounded-r': ['rounded-tr', 'rounded-br'],
      'rounded-b': ['rounded-br', 'rounded-bl'],
      'rounded-l': ['rounded-tl', 'rounded-bl'],
      'border-spacing': ['border-spacing-x', 'border-spacing-y'],
      'border-w': ['border-w-x', 'border-w-y', 'border-w-s', 'border-w-e', 'border-w-t', 'border-w-r', 'border-w-b', 'border-w-l'],
      'border-w-x': ['border-w-r', 'border-w-l'],
      'border-w-y': ['border-w-t', 'border-w-b'],
      'border-color': ['border-color-x', 'border-color-y', 'border-color-s', 'border-color-e', 'border-color-t', 'border-color-r', 'border-color-b', 'border-color-l'],
      'border-color-x': ['border-color-r', 'border-color-l'],
      'border-color-y': ['border-color-t', 'border-color-b'],
      translate: ['translate-x', 'translate-y', 'translate-none'],
      'translate-none': ['translate', 'translate-x', 'translate-y', 'translate-z'],
      'scroll-m': ['scroll-mx', 'scroll-my', 'scroll-ms', 'scroll-me', 'scroll-mt', 'scroll-mr', 'scroll-mb', 'scroll-ml'],
      'scroll-mx': ['scroll-mr', 'scroll-ml'],
      'scroll-my': ['scroll-mt', 'scroll-mb'],
      'scroll-p': ['scroll-px', 'scroll-py', 'scroll-ps', 'scroll-pe', 'scroll-pt', 'scroll-pr', 'scroll-pb', 'scroll-pl'],
      'scroll-px': ['scroll-pr', 'scroll-pl'],
      'scroll-py': ['scroll-pt', 'scroll-pb'],
      touch: ['touch-x', 'touch-y', 'touch-pz'],
      'touch-x': ['touch'],
      'touch-y': ['touch'],
      'touch-pz': ['touch']
    },
    conflictingClassGroupModifiers: {
      'font-size': ['leading']
    },
    orderSensitiveModifiers: ['*', '**', 'after', 'backdrop', 'before', 'details-content', 'file', 'first-letter', 'first-line', 'marker', 'placeholder', 'selection']
  };
};
const twMerge = /*#__PURE__*/createTailwindMerge(getDefaultConfig);

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

function Select({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root2$1,
    {
      "data-slot": "select",
      ...props,
      onValueChange: (value) => {
        if (value) {
          props.onValueChange?.(value);
        }
      }
    }
  );
}
function SelectValue({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Value, { "data-slot": "select-value", ...props });
}
function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Trigger$1,
    {
      "data-slot": "select-trigger",
      "data-size": size,
      className: cn(
        "border-gray-300 data-[placeholder]:text-gray-500 [&_svg:not([class*='text-'])]:text-gray-500 focus-visible:border-gray-950 focus-visible:ring-gray-950/50 aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40 aria-invalid:border-red-500 dark:bg-gray-200/30 dark:hover:bg-gray-200/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-white px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 dark:border-gray-800 dark:data-[placeholder]:text-gray-400 dark:[&_svg:not([class*='text-'])]:text-gray-400 dark:focus-visible:border-gray-300 dark:focus-visible:ring-gray-300/50 dark:aria-invalid:ring-red-900/20 dark:dark:aria-invalid:ring-red-900/40 dark:aria-invalid:border-red-900 dark:dark:bg-gray-800/30 dark:dark:hover:bg-gray-800/50",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-4 opacity-50" }) })
      ]
    }
  );
}
function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal$2, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Content2$1,
    {
      "data-slot": "select-content",
      className: cn(
        "bg-white text-gray-950 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border border-gray-200 shadow-md dark:bg-gray-950 dark:text-gray-50 dark:border-gray-800",
        position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      ),
      position,
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectScrollUpButton, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Viewport,
          {
            className: cn(
              "p-1",
              position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
            ),
            children
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectScrollDownButton, {})
      ]
    }
  ) });
}
function SelectItem({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Item,
    {
      "data-slot": "select-item",
      className: cn(
        "focus:bg-gray-100 focus:text-gray-900 [&_svg:not([class*='text-'])]:text-gray-500 relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:[&_svg:not([class*='text-'])]:text-gray-400",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-2 flex size-3.5 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ItemIndicator, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-4" }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ItemText, { children })
      ]
    }
  );
}
function SelectScrollUpButton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollUpButton,
    {
      "data-slot": "select-scroll-up-button",
      className: cn(
        "flex cursor-default items-center justify-center py-1",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "size-4" })
    }
  );
}
function SelectScrollDownButton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ScrollDownButton,
    {
      "data-slot": "select-scroll-down-button",
      className: cn(
        "flex cursor-default items-center justify-center py-1",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-4" })
    }
  );
}

const React$5 = await importShared('react');
const {useEffect: useEffect$2,useState: useState$6} = React$5;
const getTabConfig = () => [
  {
    id: "users",
    label: "Users",
    path: "/admin/import/users"
  },
  {
    id: "departments",
    label: "Departments",
    path: "/admin/import/departments"
  },
  {
    id: "link-users",
    label: "Link Users",
    path: "/admin/import/link-users"
  },
  {
    id: "locations",
    label: "Locations",
    path: "/admin/import/locations"
  },
  {
    id: "charge-item-definition",
    label: "Charge Item Definitions",
    path: "/admin/import/charge-item-definition"
  },
  {
    id: "product-knowledge",
    label: "Product Knowledge",
    path: "/admin/import/product-knowledge"
  },
  {
    id: "specimen-definitions",
    label: "Specimen Definitions",
    path: "/admin/import/specimen-definitions"
  }
];
function ImportsLayout({
  activeTab,
  children
}) {
  const [facilities, setFacilities] = useState$6([]);
  const [loadingFacilities, setLoadingFacilities] = useState$6(true);
  const [facilityError, setFacilityError] = useState$6(null);
  const [selectedFacilityId, setSelectedFacilityId] = useState$6("");
  useEffect$2(() => {
    let active = true;
    const loadFacilities = async () => {
      try {
        const response = await request(
          "/api/v1/users/getcurrentuser/",
          {
            method: "GET"
          }
        );
        if (!active) return;
        setFacilities(response.facilities ?? []);
        setFacilityError(null);
      } catch (error) {
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
  useEffect$2(() => {
    if (!selectedFacilityId && facilities.length > 0) {
      setSelectedFacilityId(facilities[0].id);
    }
  }, [facilities, selectedFacilityId]);
  const tabs = getTabConfig();
  const requiresFacility = activeTab !== "users";
  const canRenderContent = !requiresFacility || Boolean(selectedFacilityId);
  const content = React$5.isValidElement(children) ? React$5.cloneElement(
    children,
    { facilityId: selectedFacilityId || void 0 }
  ) : children;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-5xl mx-auto px-4 py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 pt-4 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-gray-700", children: "Select Facility" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: selectedFacilityId || "",
            onValueChange: setSelectedFacilityId,
            disabled: loadingFacilities,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectValue,
                {
                  placeholder: loadingFacilities ? "Loading facilities..." : "Select a facility"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: facilities.map((facility) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: facility.id, children: facility.name }, facility.id)) })
            ]
          }
        ),
        facilityError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-red-600", children: facilityError })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        NavTabs,
        {
          tabs: tabs.map((tab) => ({
            key: tab.id,
            label: tab.label,
            href: tab.path
          })),
          currentTab: activeTab
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 py-6", children: !canRenderContent ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md border border-dashed border-gray-200 bg-white p-6 text-sm text-gray-600", children: "Select a facility to start importing data." }) : content })
  ] }) });
}

var U=1,Y$1=.9,H=.8,J=.17,p=.1,u=.999,$=.9999;var k$1=.99,m=/[\\\/_+.#"@\[\(\{&]/,B$1=/[\\\/_+.#"@\[\(\{&]/g,K$1=/[\s-]/,X=/[\s-]/g;function G(_,C,h,P,A,f,O){if(f===C.length)return A===_.length?U:k$1;var T=`${A},${f}`;if(O[T]!==void 0)return O[T];for(var L=P.charAt(f),c=h.indexOf(L,A),S=0,E,N,R,M;c>=0;)E=G(_,C,h,P,c+1,f+1,O),E>S&&(c===A?E*=U:m.test(_.charAt(c-1))?(E*=H,R=_.slice(A,c-1).match(B$1),R&&A>0&&(E*=Math.pow(u,R.length))):K$1.test(_.charAt(c-1))?(E*=Y$1,M=_.slice(A,c-1).match(X),M&&A>0&&(E*=Math.pow(u,M.length))):(E*=J,A>0&&(E*=Math.pow(u,c-A))),_.charAt(c)!==C.charAt(f)&&(E*=$)),(E<p&&h.charAt(c-1)===P.charAt(f+1)||P.charAt(f+1)===P.charAt(f)&&h.charAt(c-1)!==P.charAt(f))&&(N=G(_,C,h,P,c+1,f+2,O),N*p>E&&(E=N*p)),E>S&&(S=E),c=h.indexOf(L,c+1);return O[T]=S,S}function D(_){return _.toLowerCase().replace(X," ")}function W(_,C,h){return _=h&&h.length>0?`${_+" "+h.join(" ")}`:_,G(_,C,D(_),D(C),0,0,{})}

// src/presence.tsx
const React2 = await importShared('react');

// src/use-state-machine.tsx
const React$4 = await importShared('react');

function useStateMachine(initialState, machine) {
  return React$4.useReducer((state, event) => {
    const nextState = machine[state][event];
    return nextState ?? state;
  }, initialState);
}

// src/presence.tsx
var Presence = (props) => {
  const { present, children } = props;
  const presence = usePresence(present);
  const child = typeof children === "function" ? children({ present: presence.isPresent }) : React2.Children.only(children);
  const ref = useComposedRefs(presence.ref, getElementRef(child));
  const forceMount = typeof children === "function";
  return forceMount || presence.isPresent ? React2.cloneElement(child, { ref }) : null;
};
Presence.displayName = "Presence";
function usePresence(present) {
  const [node, setNode] = React2.useState();
  const stylesRef = React2.useRef(null);
  const prevPresentRef = React2.useRef(present);
  const prevAnimationNameRef = React2.useRef("none");
  const initialState = present ? "mounted" : "unmounted";
  const [state, send] = useStateMachine(initialState, {
    mounted: {
      UNMOUNT: "unmounted",
      ANIMATION_OUT: "unmountSuspended"
    },
    unmountSuspended: {
      MOUNT: "mounted",
      ANIMATION_END: "unmounted"
    },
    unmounted: {
      MOUNT: "mounted"
    }
  });
  React2.useEffect(() => {
    const currentAnimationName = getAnimationName(stylesRef.current);
    prevAnimationNameRef.current = state === "mounted" ? currentAnimationName : "none";
  }, [state]);
  useLayoutEffect2(() => {
    const styles = stylesRef.current;
    const wasPresent = prevPresentRef.current;
    const hasPresentChanged = wasPresent !== present;
    if (hasPresentChanged) {
      const prevAnimationName = prevAnimationNameRef.current;
      const currentAnimationName = getAnimationName(styles);
      if (present) {
        send("MOUNT");
      } else if (currentAnimationName === "none" || styles?.display === "none") {
        send("UNMOUNT");
      } else {
        const isAnimating = prevAnimationName !== currentAnimationName;
        if (wasPresent && isAnimating) {
          send("ANIMATION_OUT");
        } else {
          send("UNMOUNT");
        }
      }
      prevPresentRef.current = present;
    }
  }, [present, send]);
  useLayoutEffect2(() => {
    if (node) {
      let timeoutId;
      const ownerWindow = node.ownerDocument.defaultView ?? window;
      const handleAnimationEnd = (event) => {
        const currentAnimationName = getAnimationName(stylesRef.current);
        const isCurrentAnimation = currentAnimationName.includes(CSS.escape(event.animationName));
        if (event.target === node && isCurrentAnimation) {
          send("ANIMATION_END");
          if (!prevPresentRef.current) {
            const currentFillMode = node.style.animationFillMode;
            node.style.animationFillMode = "forwards";
            timeoutId = ownerWindow.setTimeout(() => {
              if (node.style.animationFillMode === "forwards") {
                node.style.animationFillMode = currentFillMode;
              }
            });
          }
        }
      };
      const handleAnimationStart = (event) => {
        if (event.target === node) {
          prevAnimationNameRef.current = getAnimationName(stylesRef.current);
        }
      };
      node.addEventListener("animationstart", handleAnimationStart);
      node.addEventListener("animationcancel", handleAnimationEnd);
      node.addEventListener("animationend", handleAnimationEnd);
      return () => {
        ownerWindow.clearTimeout(timeoutId);
        node.removeEventListener("animationstart", handleAnimationStart);
        node.removeEventListener("animationcancel", handleAnimationEnd);
        node.removeEventListener("animationend", handleAnimationEnd);
      };
    } else {
      send("ANIMATION_END");
    }
  }, [node, send]);
  return {
    isPresent: ["mounted", "unmountSuspended"].includes(state),
    ref: React2.useCallback((node2) => {
      stylesRef.current = node2 ? getComputedStyle(node2) : null;
      setNode(node2);
    }, [])
  };
}
function getAnimationName(styles) {
  return styles?.animationName || "none";
}
function getElementRef(element) {
  let getter = Object.getOwnPropertyDescriptor(element.props, "ref")?.get;
  let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.ref;
  }
  getter = Object.getOwnPropertyDescriptor(element, "ref")?.get;
  mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.props.ref;
  }
  return element.props.ref || element.ref;
}

// src/dialog.tsx
const React$3 = await importShared('react');
var DIALOG_NAME = "Dialog";
var [createDialogContext] = createContextScope(DIALOG_NAME);
var [DialogProvider, useDialogContext] = createDialogContext(DIALOG_NAME);
var Dialog = (props) => {
  const {
    __scopeDialog,
    children,
    open: openProp,
    defaultOpen,
    onOpenChange,
    modal = true
  } = props;
  const triggerRef = React$3.useRef(null);
  const contentRef = React$3.useRef(null);
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
    caller: DIALOG_NAME
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    DialogProvider,
    {
      scope: __scopeDialog,
      triggerRef,
      contentRef,
      contentId: useId(),
      titleId: useId(),
      descriptionId: useId(),
      open,
      onOpenChange: setOpen,
      onOpenToggle: React$3.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen]),
      modal,
      children
    }
  );
};
Dialog.displayName = DIALOG_NAME;
var TRIGGER_NAME$1 = "DialogTrigger";
var DialogTrigger = React$3.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDialog, ...triggerProps } = props;
    const context = useDialogContext(TRIGGER_NAME$1, __scopeDialog);
    const composedTriggerRef = useComposedRefs(forwardedRef, context.triggerRef);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.button,
      {
        type: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": context.open,
        "aria-controls": context.contentId,
        "data-state": getState$1(context.open),
        ...triggerProps,
        ref: composedTriggerRef,
        onClick: composeEventHandlers(props.onClick, context.onOpenToggle)
      }
    );
  }
);
DialogTrigger.displayName = TRIGGER_NAME$1;
var PORTAL_NAME$1 = "DialogPortal";
var [PortalProvider$1, usePortalContext$1] = createDialogContext(PORTAL_NAME$1, {
  forceMount: void 0
});
var DialogPortal = (props) => {
  const { __scopeDialog, forceMount, children, container } = props;
  const context = useDialogContext(PORTAL_NAME$1, __scopeDialog);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PortalProvider$1, { scope: __scopeDialog, forceMount, children: React$3.Children.map(children, (child) => /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Portal$3, { asChild: true, container, children: child }) })) });
};
DialogPortal.displayName = PORTAL_NAME$1;
var OVERLAY_NAME = "DialogOverlay";
var DialogOverlay = React$3.forwardRef(
  (props, forwardedRef) => {
    const portalContext = usePortalContext$1(OVERLAY_NAME, props.__scopeDialog);
    const { forceMount = portalContext.forceMount, ...overlayProps } = props;
    const context = useDialogContext(OVERLAY_NAME, props.__scopeDialog);
    return context.modal ? /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogOverlayImpl, { ...overlayProps, ref: forwardedRef }) }) : null;
  }
);
DialogOverlay.displayName = OVERLAY_NAME;
var Slot$1 = createSlot("DialogOverlay.RemoveScroll");
var DialogOverlayImpl = React$3.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDialog, ...overlayProps } = props;
    const context = useDialogContext(OVERLAY_NAME, __scopeDialog);
    return (
      // Make sure `Content` is scrollable even when it doesn't live inside `RemoveScroll`
      // ie. when `Overlay` and `Content` are siblings
      /* @__PURE__ */ jsxRuntimeExports.jsx(ReactRemoveScroll, { as: Slot$1, allowPinchZoom: true, shards: [context.contentRef], children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.div,
        {
          "data-state": getState$1(context.open),
          ...overlayProps,
          ref: forwardedRef,
          style: { pointerEvents: "auto", ...overlayProps.style }
        }
      ) })
    );
  }
);
var CONTENT_NAME$1 = "DialogContent";
var DialogContent = React$3.forwardRef(
  (props, forwardedRef) => {
    const portalContext = usePortalContext$1(CONTENT_NAME$1, props.__scopeDialog);
    const { forceMount = portalContext.forceMount, ...contentProps } = props;
    const context = useDialogContext(CONTENT_NAME$1, props.__scopeDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: context.modal ? /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContentModal, { ...contentProps, ref: forwardedRef }) : /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContentNonModal, { ...contentProps, ref: forwardedRef }) });
  }
);
DialogContent.displayName = CONTENT_NAME$1;
var DialogContentModal = React$3.forwardRef(
  (props, forwardedRef) => {
    const context = useDialogContext(CONTENT_NAME$1, props.__scopeDialog);
    const contentRef = React$3.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, context.contentRef, contentRef);
    React$3.useEffect(() => {
      const content = contentRef.current;
      if (content) return hideOthers(content);
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      DialogContentImpl,
      {
        ...props,
        ref: composedRefs,
        trapFocus: context.open,
        disableOutsidePointerEvents: true,
        onCloseAutoFocus: composeEventHandlers(props.onCloseAutoFocus, (event) => {
          event.preventDefault();
          context.triggerRef.current?.focus();
        }),
        onPointerDownOutside: composeEventHandlers(props.onPointerDownOutside, (event) => {
          const originalEvent = event.detail.originalEvent;
          const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true;
          const isRightClick = originalEvent.button === 2 || ctrlLeftClick;
          if (isRightClick) event.preventDefault();
        }),
        onFocusOutside: composeEventHandlers(
          props.onFocusOutside,
          (event) => event.preventDefault()
        )
      }
    );
  }
);
var DialogContentNonModal = React$3.forwardRef(
  (props, forwardedRef) => {
    const context = useDialogContext(CONTENT_NAME$1, props.__scopeDialog);
    const hasInteractedOutsideRef = React$3.useRef(false);
    const hasPointerDownOutsideRef = React$3.useRef(false);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      DialogContentImpl,
      {
        ...props,
        ref: forwardedRef,
        trapFocus: false,
        disableOutsidePointerEvents: false,
        onCloseAutoFocus: (event) => {
          props.onCloseAutoFocus?.(event);
          if (!event.defaultPrevented) {
            if (!hasInteractedOutsideRef.current) context.triggerRef.current?.focus();
            event.preventDefault();
          }
          hasInteractedOutsideRef.current = false;
          hasPointerDownOutsideRef.current = false;
        },
        onInteractOutside: (event) => {
          props.onInteractOutside?.(event);
          if (!event.defaultPrevented) {
            hasInteractedOutsideRef.current = true;
            if (event.detail.originalEvent.type === "pointerdown") {
              hasPointerDownOutsideRef.current = true;
            }
          }
          const target = event.target;
          const targetIsTrigger = context.triggerRef.current?.contains(target);
          if (targetIsTrigger) event.preventDefault();
          if (event.detail.originalEvent.type === "focusin" && hasPointerDownOutsideRef.current) {
            event.preventDefault();
          }
        }
      }
    );
  }
);
var DialogContentImpl = React$3.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDialog, trapFocus, onOpenAutoFocus, onCloseAutoFocus, ...contentProps } = props;
    const context = useDialogContext(CONTENT_NAME$1, __scopeDialog);
    const contentRef = React$3.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, contentRef);
    useFocusGuards();
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        FocusScope,
        {
          asChild: true,
          loop: true,
          trapped: trapFocus,
          onMountAutoFocus: onOpenAutoFocus,
          onUnmountAutoFocus: onCloseAutoFocus,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            DismissableLayer,
            {
              role: "dialog",
              id: context.contentId,
              "aria-describedby": context.descriptionId,
              "aria-labelledby": context.titleId,
              "data-state": getState$1(context.open),
              ...contentProps,
              ref: composedRefs,
              onDismiss: () => context.onOpenChange(false)
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TitleWarning, { titleId: context.titleId }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DescriptionWarning, { contentRef, descriptionId: context.descriptionId })
      ] })
    ] });
  }
);
var TITLE_NAME = "DialogTitle";
var DialogTitle = React$3.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDialog, ...titleProps } = props;
    const context = useDialogContext(TITLE_NAME, __scopeDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.h2, { id: context.titleId, ...titleProps, ref: forwardedRef });
  }
);
DialogTitle.displayName = TITLE_NAME;
var DESCRIPTION_NAME = "DialogDescription";
var DialogDescription = React$3.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDialog, ...descriptionProps } = props;
    const context = useDialogContext(DESCRIPTION_NAME, __scopeDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.p, { id: context.descriptionId, ...descriptionProps, ref: forwardedRef });
  }
);
DialogDescription.displayName = DESCRIPTION_NAME;
var CLOSE_NAME$1 = "DialogClose";
var DialogClose = React$3.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDialog, ...closeProps } = props;
    const context = useDialogContext(CLOSE_NAME$1, __scopeDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.button,
      {
        type: "button",
        ...closeProps,
        ref: forwardedRef,
        onClick: composeEventHandlers(props.onClick, () => context.onOpenChange(false))
      }
    );
  }
);
DialogClose.displayName = CLOSE_NAME$1;
function getState$1(open) {
  return open ? "open" : "closed";
}
var TITLE_WARNING_NAME = "DialogTitleWarning";
var [WarningProvider, useWarningContext] = createContext2(TITLE_WARNING_NAME, {
  contentName: CONTENT_NAME$1,
  titleName: TITLE_NAME,
  docsSlug: "dialog"
});
var TitleWarning = ({ titleId }) => {
  const titleWarningContext = useWarningContext(TITLE_WARNING_NAME);
  const MESSAGE = `\`${titleWarningContext.contentName}\` requires a \`${titleWarningContext.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${titleWarningContext.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${titleWarningContext.docsSlug}`;
  React$3.useEffect(() => {
    if (titleId) {
      const hasTitle = document.getElementById(titleId);
      if (!hasTitle) console.error(MESSAGE);
    }
  }, [MESSAGE, titleId]);
  return null;
};
var DESCRIPTION_WARNING_NAME = "DialogDescriptionWarning";
var DescriptionWarning = ({ contentRef, descriptionId }) => {
  const descriptionWarningContext = useWarningContext(DESCRIPTION_WARNING_NAME);
  const MESSAGE = `Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${descriptionWarningContext.contentName}}.`;
  React$3.useEffect(() => {
    const describedById = contentRef.current?.getAttribute("aria-describedby");
    if (descriptionId && describedById) {
      const hasDescription = document.getElementById(descriptionId);
      if (!hasDescription) console.warn(MESSAGE);
    }
  }, [MESSAGE, contentRef, descriptionId]);
  return null;
};
var Root = Dialog;
var Portal$1 = DialogPortal;
var Overlay = DialogOverlay;
var Content = DialogContent;

const t = await importShared('react');
var N='[cmdk-group=""]',Y='[cmdk-group-items=""]',be='[cmdk-group-heading=""]',le='[cmdk-item=""]',ce=`${le}:not([aria-disabled="true"])`,Z="cmdk-item-select",T="data-value",Re=(r,o,n)=>W(r,o,n),ue=t.createContext(void 0),K=()=>t.useContext(ue),de=t.createContext(void 0),ee=()=>t.useContext(de),fe=t.createContext(void 0),me=t.forwardRef((r,o)=>{let n=L(()=>{var e,a;return {search:"",value:(a=(e=r.value)!=null?e:r.defaultValue)!=null?a:"",selectedItemId:void 0,filtered:{count:0,items:new Map,groups:new Set}}}),u=L(()=>new Set),c=L(()=>new Map),d=L(()=>new Map),f=L(()=>new Set),p=pe(r),{label:b,children:m,value:R,onValueChange:x,filter:C,shouldFilter:S,loop:A,disablePointerSelection:ge=false,vimBindings:j=true,...O}=r,$=useId(),q=useId(),_=useId(),I=t.useRef(null),v=ke();k(()=>{if(R!==void 0){let e=R.trim();n.current.value=e,E.emit();}},[R]),k(()=>{v(6,ne);},[]);let E=t.useMemo(()=>({subscribe:e=>(f.current.add(e),()=>f.current.delete(e)),snapshot:()=>n.current,setState:(e,a,s)=>{var i,l,g,y;if(!Object.is(n.current[e],a)){if(n.current[e]=a,e==="search")J(),z(),v(1,W);else if(e==="value"){if(document.activeElement.hasAttribute("cmdk-input")||document.activeElement.hasAttribute("cmdk-root")){let h=document.getElementById(_);h?h.focus():(i=document.getElementById($))==null||i.focus();}if(v(7,()=>{var h;n.current.selectedItemId=(h=M())==null?void 0:h.id,E.emit();}),s||v(5,ne),((l=p.current)==null?void 0:l.value)!==void 0){let h=a!=null?a:"";(y=(g=p.current).onValueChange)==null||y.call(g,h);return}}E.emit();}},emit:()=>{f.current.forEach(e=>e());}}),[]),U=t.useMemo(()=>({value:(e,a,s)=>{var i;a!==((i=d.current.get(e))==null?void 0:i.value)&&(d.current.set(e,{value:a,keywords:s}),n.current.filtered.items.set(e,te(a,s)),v(2,()=>{z(),E.emit();}));},item:(e,a)=>(u.current.add(e),a&&(c.current.has(a)?c.current.get(a).add(e):c.current.set(a,new Set([e]))),v(3,()=>{J(),z(),n.current.value||W(),E.emit();}),()=>{d.current.delete(e),u.current.delete(e),n.current.filtered.items.delete(e);let s=M();v(4,()=>{J(),(s==null?void 0:s.getAttribute("id"))===e&&W(),E.emit();});}),group:e=>(c.current.has(e)||c.current.set(e,new Set),()=>{d.current.delete(e),c.current.delete(e);}),filter:()=>p.current.shouldFilter,label:b||r["aria-label"],getDisablePointerSelection:()=>p.current.disablePointerSelection,listId:$,inputId:_,labelId:q,listInnerRef:I}),[]);function te(e,a){var i,l;let s=(l=(i=p.current)==null?void 0:i.filter)!=null?l:Re;return e?s(e,n.current.search,a):0}function z(){if(!n.current.search||p.current.shouldFilter===false)return;let e=n.current.filtered.items,a=[];n.current.filtered.groups.forEach(i=>{let l=c.current.get(i),g=0;l.forEach(y=>{let h=e.get(y);g=Math.max(h,g);}),a.push([i,g]);});let s=I.current;V().sort((i,l)=>{var h,F;let g=i.getAttribute("id"),y=l.getAttribute("id");return ((h=e.get(y))!=null?h:0)-((F=e.get(g))!=null?F:0)}).forEach(i=>{let l=i.closest(Y);l?l.appendChild(i.parentElement===l?i:i.closest(`${Y} > *`)):s.appendChild(i.parentElement===s?i:i.closest(`${Y} > *`));}),a.sort((i,l)=>l[1]-i[1]).forEach(i=>{var g;let l=(g=I.current)==null?void 0:g.querySelector(`${N}[${T}="${encodeURIComponent(i[0])}"]`);l==null||l.parentElement.appendChild(l);});}function W(){let e=V().find(s=>s.getAttribute("aria-disabled")!=="true"),a=e==null?void 0:e.getAttribute(T);E.setState("value",a||void 0);}function J(){var a,s,i,l;if(!n.current.search||p.current.shouldFilter===false){n.current.filtered.count=u.current.size;return}n.current.filtered.groups=new Set;let e=0;for(let g of u.current){let y=(s=(a=d.current.get(g))==null?void 0:a.value)!=null?s:"",h=(l=(i=d.current.get(g))==null?void 0:i.keywords)!=null?l:[],F=te(y,h);n.current.filtered.items.set(g,F),F>0&&e++;}for(let[g,y]of c.current)for(let h of y)if(n.current.filtered.items.get(h)>0){n.current.filtered.groups.add(g);break}n.current.filtered.count=e;}function ne(){var a,s,i;let e=M();e&&(((a=e.parentElement)==null?void 0:a.firstChild)===e&&((i=(s=e.closest(N))==null?void 0:s.querySelector(be))==null||i.scrollIntoView({block:"nearest"})),e.scrollIntoView({block:"nearest"}));}function M(){var e;return (e=I.current)==null?void 0:e.querySelector(`${le}[aria-selected="true"]`)}function V(){var e;return Array.from(((e=I.current)==null?void 0:e.querySelectorAll(ce))||[])}function X(e){let s=V()[e];s&&E.setState("value",s.getAttribute(T));}function Q(e){var g;let a=M(),s=V(),i=s.findIndex(y=>y===a),l=s[i+e];(g=p.current)!=null&&g.loop&&(l=i+e<0?s[s.length-1]:i+e===s.length?s[0]:s[i+e]),l&&E.setState("value",l.getAttribute(T));}function re(e){let a=M(),s=a==null?void 0:a.closest(N),i;for(;s&&!i;)s=e>0?we(s,N):De(s,N),i=s==null?void 0:s.querySelector(ce);i?E.setState("value",i.getAttribute(T)):Q(e);}let oe=()=>X(V().length-1),ie=e=>{e.preventDefault(),e.metaKey?oe():e.altKey?re(1):Q(1);},se=e=>{e.preventDefault(),e.metaKey?X(0):e.altKey?re(-1):Q(-1);};return t.createElement(Primitive.div,{ref:o,tabIndex:-1,...O,"cmdk-root":"",onKeyDown:e=>{var s;(s=O.onKeyDown)==null||s.call(O,e);let a=e.nativeEvent.isComposing||e.keyCode===229;if(!(e.defaultPrevented||a))switch(e.key){case "n":case "j":{j&&e.ctrlKey&&ie(e);break}case "ArrowDown":{ie(e);break}case "p":case "k":{j&&e.ctrlKey&&se(e);break}case "ArrowUp":{se(e);break}case "Home":{e.preventDefault(),X(0);break}case "End":{e.preventDefault(),oe();break}case "Enter":{e.preventDefault();let i=M();if(i){let l=new Event(Z);i.dispatchEvent(l);}}}}},t.createElement("label",{"cmdk-label":"",htmlFor:U.inputId,id:U.labelId,style:Te},b),B(r,e=>t.createElement(de.Provider,{value:E},t.createElement(ue.Provider,{value:U},e))))}),he=t.forwardRef((r,o)=>{var _,I;let n=useId(),u=t.useRef(null),c=t.useContext(fe),d=K(),f=pe(r),p=(I=(_=f.current)==null?void 0:_.forceMount)!=null?I:c==null?void 0:c.forceMount;k(()=>{if(!p)return d.item(n,c==null?void 0:c.id)},[p]);let b=ve(n,u,[r.value,r.children,u],r.keywords),m=ee(),R=P(v=>v.value&&v.value===b.current),x=P(v=>p||d.filter()===false?true:v.search?v.filtered.items.get(n)>0:true);t.useEffect(()=>{let v=u.current;if(!(!v||r.disabled))return v.addEventListener(Z,C),()=>v.removeEventListener(Z,C)},[x,r.onSelect,r.disabled]);function C(){var v,E;S(),(E=(v=f.current).onSelect)==null||E.call(v,b.current);}function S(){m.setState("value",b.current,true);}if(!x)return null;let{disabled:A,value:ge,onSelect:j,forceMount:O,keywords:$,...q}=r;return t.createElement(Primitive.div,{ref:composeRefs(u,o),...q,id:n,"cmdk-item":"",role:"option","aria-disabled":!!A,"aria-selected":!!R,"data-disabled":!!A,"data-selected":!!R,onPointerMove:A||d.getDisablePointerSelection()?void 0:S,onClick:A?void 0:C},r.children)}),Ee=t.forwardRef((r,o)=>{let{heading:n,children:u,forceMount:c,...d}=r,f=useId(),p=t.useRef(null),b=t.useRef(null),m=useId(),R=K(),x=P(S=>c||R.filter()===false?true:S.search?S.filtered.groups.has(f):true);k(()=>R.group(f),[]),ve(f,p,[r.value,r.heading,b]);let C=t.useMemo(()=>({id:f,forceMount:c}),[c]);return t.createElement(Primitive.div,{ref:composeRefs(p,o),...d,"cmdk-group":"",role:"presentation",hidden:x?void 0:true},n&&t.createElement("div",{ref:b,"cmdk-group-heading":"","aria-hidden":true,id:m},n),B(r,S=>t.createElement("div",{"cmdk-group-items":"",role:"group","aria-labelledby":n?m:void 0},t.createElement(fe.Provider,{value:C},S))))}),ye=t.forwardRef((r,o)=>{let{alwaysRender:n,...u}=r,c=t.useRef(null),d=P(f=>!f.search);return !n&&!d?null:t.createElement(Primitive.div,{ref:composeRefs(c,o),...u,"cmdk-separator":"",role:"separator"})}),Se=t.forwardRef((r,o)=>{let{onValueChange:n,...u}=r,c=r.value!=null,d=ee(),f=P(m=>m.search),p=P(m=>m.selectedItemId),b=K();return t.useEffect(()=>{r.value!=null&&d.setState("search",r.value);},[r.value]),t.createElement(Primitive.input,{ref:o,...u,"cmdk-input":"",autoComplete:"off",autoCorrect:"off",spellCheck:false,"aria-autocomplete":"list",role:"combobox","aria-expanded":true,"aria-controls":b.listId,"aria-labelledby":b.labelId,"aria-activedescendant":p,id:b.inputId,type:"text",value:c?r.value:f,onChange:m=>{c||d.setState("search",m.target.value),n==null||n(m.target.value);}})}),Ce=t.forwardRef((r,o)=>{let{children:n,label:u="Suggestions",...c}=r,d=t.useRef(null),f=t.useRef(null),p=P(m=>m.selectedItemId),b=K();return t.useEffect(()=>{if(f.current&&d.current){let m=f.current,R=d.current,x,C=new ResizeObserver(()=>{x=requestAnimationFrame(()=>{let S=m.offsetHeight;R.style.setProperty("--cmdk-list-height",S.toFixed(1)+"px");});});return C.observe(m),()=>{cancelAnimationFrame(x),C.unobserve(m);}}},[]),t.createElement(Primitive.div,{ref:composeRefs(d,o),...c,"cmdk-list":"",role:"listbox",tabIndex:-1,"aria-activedescendant":p,"aria-label":u,id:b.listId},B(r,m=>t.createElement("div",{ref:composeRefs(f,b.listInnerRef),"cmdk-list-sizer":""},m)))}),xe=t.forwardRef((r,o)=>{let{open:n,onOpenChange:u,overlayClassName:c,contentClassName:d,container:f,...p}=r;return t.createElement(Root,{open:n,onOpenChange:u},t.createElement(Portal$1,{container:f},t.createElement(Overlay,{"cmdk-overlay":"",className:c}),t.createElement(Content,{"aria-label":r.label,"cmdk-dialog":"",className:d},t.createElement(me,{ref:o,...p}))))}),Ie=t.forwardRef((r,o)=>P(u=>u.filtered.count===0)?t.createElement(Primitive.div,{ref:o,...r,"cmdk-empty":"",role:"presentation"}):null),Pe=t.forwardRef((r,o)=>{let{progress:n,children:u,label:c="Loading...",...d}=r;return t.createElement(Primitive.div,{ref:o,...d,"cmdk-loading":"",role:"progressbar","aria-valuenow":n,"aria-valuemin":0,"aria-valuemax":100,"aria-label":c},B(r,f=>t.createElement("div",{"aria-hidden":true},f)))}),_e=Object.assign(me,{List:Ce,Item:he,Input:Se,Group:Ee,Separator:ye,Dialog:xe,Empty:Ie,Loading:Pe});function we(r,o){let n=r.nextElementSibling;for(;n;){if(n.matches(o))return n;n=n.nextElementSibling;}}function De(r,o){let n=r.previousElementSibling;for(;n;){if(n.matches(o))return n;n=n.previousElementSibling;}}function pe(r){let o=t.useRef(r);return k(()=>{o.current=r;}),o}var k=typeof window=="undefined"?t.useEffect:t.useLayoutEffect;function L(r){let o=t.useRef();return o.current===void 0&&(o.current=r()),o}function P(r){let o=ee(),n=()=>r(o.snapshot());return t.useSyncExternalStore(o.subscribe,n,n)}function ve(r,o,n,u=[]){let c=t.useRef(),d=K();return k(()=>{var b;let f=(()=>{var m;for(let R of n){if(typeof R=="string")return R.trim();if(typeof R=="object"&&"current"in R)return R.current?(m=R.current.textContent)==null?void 0:m.trim():c.current}})(),p=u.map(m=>m.trim());d.value(r,f,p),(b=o.current)==null||b.setAttribute(T,f),c.current=f;}),c}var ke=()=>{let[r,o]=t.useState(),n=L(()=>new Map);return k(()=>{n.current.forEach(u=>u()),n.current=new Map;},[r]),(u,c)=>{n.current.set(u,c),o({});}};function Me(r){let o=r.type;return typeof o=="function"?o(r.props):"render"in o?o.render(r.props):r}function B({asChild:r,children:o},n){return r&&t.isValidElement(o)?t.cloneElement(Me(o),{ref:o.ref},n(o.props.children)):n(o)}var Te={position:"absolute",width:"1px",height:"1px",padding:"0",margin:"-1px",overflow:"hidden",clip:"rect(0, 0, 0, 0)",whiteSpace:"nowrap",borderWidth:"0"};

function Command({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    _e,
    {
      "data-slot": "command",
      className: cn(
        "bg-white text-gray-950 flex h-full w-full flex-col overflow-hidden rounded-md",
        className
      ),
      ...props
    }
  );
}
function CommandInput({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-slot": "command-input-wrapper",
      className: "flex h-9 items-center gap-2 border-b px-3",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-4 shrink-0 opacity-50" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          _e.Input,
          {
            "data-slot": "command-input",
            className: cn(
              "placeholder:text-gray-500 flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
              className
            ),
            ...props
          }
        )
      ]
    }
  );
}
function CommandList({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    _e.List,
    {
      "data-slot": "command-list",
      className: cn(
        "max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto",
        className
      ),
      ...props
    }
  );
}
function CommandEmpty({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    _e.Empty,
    {
      "data-slot": "command-empty",
      className: "py-6 text-center text-sm",
      ...props
    }
  );
}
function CommandGroup({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    _e.Group,
    {
      "data-slot": "command-group",
      className: cn(
        "text-gray-950 [&_[cmdk-group-heading]]:text-gray-500 overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium",
        className
      ),
      ...props
    }
  );
}
function CommandItem({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    _e.Item,
    {
      "data-slot": "command-item",
      className: cn(
        "data-[selected=true]:bg-gray-100 data-[selected=true]:text-gray-900 [&_svg:not([class*='text-'])]:text-gray-500 relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}

// src/popover.tsx
const React$2 = await importShared('react');
var POPOVER_NAME = "Popover";
var [createPopoverContext] = createContextScope(POPOVER_NAME, [
  createPopperScope
]);
var usePopperScope = createPopperScope();
var [PopoverProvider, usePopoverContext] = createPopoverContext(POPOVER_NAME);
var Popover$1 = (props) => {
  const {
    __scopePopover,
    children,
    open: openProp,
    defaultOpen,
    onOpenChange,
    modal = false
  } = props;
  const popperScope = usePopperScope(__scopePopover);
  const triggerRef = React$2.useRef(null);
  const [hasCustomAnchor, setHasCustomAnchor] = React$2.useState(false);
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
    caller: POPOVER_NAME
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root2$2, { ...popperScope, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    PopoverProvider,
    {
      scope: __scopePopover,
      contentId: useId(),
      triggerRef,
      open,
      onOpenChange: setOpen,
      onOpenToggle: React$2.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen]),
      hasCustomAnchor,
      onCustomAnchorAdd: React$2.useCallback(() => setHasCustomAnchor(true), []),
      onCustomAnchorRemove: React$2.useCallback(() => setHasCustomAnchor(false), []),
      modal,
      children
    }
  ) });
};
Popover$1.displayName = POPOVER_NAME;
var ANCHOR_NAME = "PopoverAnchor";
var PopoverAnchor = React$2.forwardRef(
  (props, forwardedRef) => {
    const { __scopePopover, ...anchorProps } = props;
    const context = usePopoverContext(ANCHOR_NAME, __scopePopover);
    const popperScope = usePopperScope(__scopePopover);
    const { onCustomAnchorAdd, onCustomAnchorRemove } = context;
    React$2.useEffect(() => {
      onCustomAnchorAdd();
      return () => onCustomAnchorRemove();
    }, [onCustomAnchorAdd, onCustomAnchorRemove]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Anchor, { ...popperScope, ...anchorProps, ref: forwardedRef });
  }
);
PopoverAnchor.displayName = ANCHOR_NAME;
var TRIGGER_NAME = "PopoverTrigger";
var PopoverTrigger$1 = React$2.forwardRef(
  (props, forwardedRef) => {
    const { __scopePopover, ...triggerProps } = props;
    const context = usePopoverContext(TRIGGER_NAME, __scopePopover);
    const popperScope = usePopperScope(__scopePopover);
    const composedTriggerRef = useComposedRefs(forwardedRef, context.triggerRef);
    const trigger = /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.button,
      {
        type: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": context.open,
        "aria-controls": context.contentId,
        "data-state": getState(context.open),
        ...triggerProps,
        ref: composedTriggerRef,
        onClick: composeEventHandlers(props.onClick, context.onOpenToggle)
      }
    );
    return context.hasCustomAnchor ? trigger : /* @__PURE__ */ jsxRuntimeExports.jsx(Anchor, { asChild: true, ...popperScope, children: trigger });
  }
);
PopoverTrigger$1.displayName = TRIGGER_NAME;
var PORTAL_NAME = "PopoverPortal";
var [PortalProvider, usePortalContext] = createPopoverContext(PORTAL_NAME, {
  forceMount: void 0
});
var PopoverPortal = (props) => {
  const { __scopePopover, forceMount, children, container } = props;
  const context = usePopoverContext(PORTAL_NAME, __scopePopover);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PortalProvider, { scope: __scopePopover, forceMount, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Portal$3, { asChild: true, container, children }) }) });
};
PopoverPortal.displayName = PORTAL_NAME;
var CONTENT_NAME = "PopoverContent";
var PopoverContent$1 = React$2.forwardRef(
  (props, forwardedRef) => {
    const portalContext = usePortalContext(CONTENT_NAME, props.__scopePopover);
    const { forceMount = portalContext.forceMount, ...contentProps } = props;
    const context = usePopoverContext(CONTENT_NAME, props.__scopePopover);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: context.modal ? /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverContentModal, { ...contentProps, ref: forwardedRef }) : /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverContentNonModal, { ...contentProps, ref: forwardedRef }) });
  }
);
PopoverContent$1.displayName = CONTENT_NAME;
var Slot = createSlot("PopoverContent.RemoveScroll");
var PopoverContentModal = React$2.forwardRef(
  (props, forwardedRef) => {
    const context = usePopoverContext(CONTENT_NAME, props.__scopePopover);
    const contentRef = React$2.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, contentRef);
    const isRightClickOutsideRef = React$2.useRef(false);
    React$2.useEffect(() => {
      const content = contentRef.current;
      if (content) return hideOthers(content);
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ReactRemoveScroll, { as: Slot, allowPinchZoom: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      PopoverContentImpl,
      {
        ...props,
        ref: composedRefs,
        trapFocus: context.open,
        disableOutsidePointerEvents: true,
        onCloseAutoFocus: composeEventHandlers(props.onCloseAutoFocus, (event) => {
          event.preventDefault();
          if (!isRightClickOutsideRef.current) context.triggerRef.current?.focus();
        }),
        onPointerDownOutside: composeEventHandlers(
          props.onPointerDownOutside,
          (event) => {
            const originalEvent = event.detail.originalEvent;
            const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true;
            const isRightClick = originalEvent.button === 2 || ctrlLeftClick;
            isRightClickOutsideRef.current = isRightClick;
          },
          { checkForDefaultPrevented: false }
        ),
        onFocusOutside: composeEventHandlers(
          props.onFocusOutside,
          (event) => event.preventDefault(),
          { checkForDefaultPrevented: false }
        )
      }
    ) });
  }
);
var PopoverContentNonModal = React$2.forwardRef(
  (props, forwardedRef) => {
    const context = usePopoverContext(CONTENT_NAME, props.__scopePopover);
    const hasInteractedOutsideRef = React$2.useRef(false);
    const hasPointerDownOutsideRef = React$2.useRef(false);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      PopoverContentImpl,
      {
        ...props,
        ref: forwardedRef,
        trapFocus: false,
        disableOutsidePointerEvents: false,
        onCloseAutoFocus: (event) => {
          props.onCloseAutoFocus?.(event);
          if (!event.defaultPrevented) {
            if (!hasInteractedOutsideRef.current) context.triggerRef.current?.focus();
            event.preventDefault();
          }
          hasInteractedOutsideRef.current = false;
          hasPointerDownOutsideRef.current = false;
        },
        onInteractOutside: (event) => {
          props.onInteractOutside?.(event);
          if (!event.defaultPrevented) {
            hasInteractedOutsideRef.current = true;
            if (event.detail.originalEvent.type === "pointerdown") {
              hasPointerDownOutsideRef.current = true;
            }
          }
          const target = event.target;
          const targetIsTrigger = context.triggerRef.current?.contains(target);
          if (targetIsTrigger) event.preventDefault();
          if (event.detail.originalEvent.type === "focusin" && hasPointerDownOutsideRef.current) {
            event.preventDefault();
          }
        }
      }
    );
  }
);
var PopoverContentImpl = React$2.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopePopover,
      trapFocus,
      onOpenAutoFocus,
      onCloseAutoFocus,
      disableOutsidePointerEvents,
      onEscapeKeyDown,
      onPointerDownOutside,
      onFocusOutside,
      onInteractOutside,
      ...contentProps
    } = props;
    const context = usePopoverContext(CONTENT_NAME, __scopePopover);
    const popperScope = usePopperScope(__scopePopover);
    useFocusGuards();
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      FocusScope,
      {
        asChild: true,
        loop: true,
        trapped: trapFocus,
        onMountAutoFocus: onOpenAutoFocus,
        onUnmountAutoFocus: onCloseAutoFocus,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          DismissableLayer,
          {
            asChild: true,
            disableOutsidePointerEvents,
            onInteractOutside,
            onEscapeKeyDown,
            onPointerDownOutside,
            onFocusOutside,
            onDismiss: () => context.onOpenChange(false),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Content$1,
              {
                "data-state": getState(context.open),
                role: "dialog",
                id: context.contentId,
                ...popperScope,
                ...contentProps,
                ref: forwardedRef,
                style: {
                  ...contentProps.style,
                  // re-namespace exposed content custom properties
                  ...{
                    "--radix-popover-content-transform-origin": "var(--radix-popper-transform-origin)",
                    "--radix-popover-content-available-width": "var(--radix-popper-available-width)",
                    "--radix-popover-content-available-height": "var(--radix-popper-available-height)",
                    "--radix-popover-trigger-width": "var(--radix-popper-anchor-width)",
                    "--radix-popover-trigger-height": "var(--radix-popper-anchor-height)"
                  }
                }
              }
            )
          }
        )
      }
    );
  }
);
var CLOSE_NAME = "PopoverClose";
var PopoverClose = React$2.forwardRef(
  (props, forwardedRef) => {
    const { __scopePopover, ...closeProps } = props;
    const context = usePopoverContext(CLOSE_NAME, __scopePopover);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.button,
      {
        type: "button",
        ...closeProps,
        ref: forwardedRef,
        onClick: composeEventHandlers(props.onClick, () => context.onOpenChange(false))
      }
    );
  }
);
PopoverClose.displayName = CLOSE_NAME;
var ARROW_NAME = "PopoverArrow";
var PopoverArrow = React$2.forwardRef(
  (props, forwardedRef) => {
    const { __scopePopover, ...arrowProps } = props;
    const popperScope = usePopperScope(__scopePopover);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Arrow, { ...popperScope, ...arrowProps, ref: forwardedRef });
  }
);
PopoverArrow.displayName = ARROW_NAME;
function getState(open) {
  return open ? "open" : "closed";
}
var Root2 = Popover$1;
var Trigger = PopoverTrigger$1;
var Portal = PopoverPortal;
var Content2 = PopoverContent$1;

function Popover({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root2, { "data-slot": "popover", ...props });
}
function PopoverTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Trigger, { "data-slot": "popover-trigger", ...props });
}
function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    Content2,
    {
      "data-slot": "popover-content",
      align,
      sideOffset,
      className: cn(
        "bg-white text-gray-950 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border border-gray-200 p-4 shadow-md outline-hidden",
        className
      ),
      ...props
    }
  ) });
}

function Skeleton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: cn("animate-pulse rounded-md bg-gray-900/10", className),
      ...props
    }
  );
}

const {useEffect: useEffect$1,useMemo: useMemo$4,useState: useState$5} = await importShared('react');
const ROOT_PARENT = "__root__";
const buildOrganizationIndex = (organizations) => {
  const byParentId = /* @__PURE__ */ new Map();
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
function DepartmentSelect({
  organizations,
  value,
  onChange,
  isLoading = false,
  disabled = false,
  placeholder = "Select department"
}) {
  const [open, setOpen] = useState$5(false);
  const [breadcrumbs, setBreadcrumbs] = useState$5(
    []
  );
  const [currentParentId, setCurrentParentId] = useState$5(
    void 0
  );
  const [searchQuery, setSearchQuery] = useState$5("");
  const { byParentId } = useMemo$4(
    () => buildOrganizationIndex(organizations),
    [organizations]
  );
  const currentLevel = byParentId.get(currentParentId ?? ROOT_PARENT) ?? [];
  const filteredDepartments = useMemo$4(() => {
    if (!searchQuery.trim()) return currentLevel;
    return currentLevel.filter(
      (org) => org.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [currentLevel, searchQuery]);
  const resetSearch = () => setSearchQuery("");
  useEffect$1(() => {
    if (open && value?.parent) {
      const breadcrumbChain = [];
      let current = value.parent;
      while (current?.id) {
        breadcrumbChain.unshift({ ...current });
        current = current.parent;
      }
      setBreadcrumbs(breadcrumbChain);
      setCurrentParentId(value.parent?.id || void 0);
    } else {
      setBreadcrumbs([]);
      setCurrentParentId(void 0);
    }
  }, [open, value]);
  const handleSelect = (org) => {
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
  const handleBreadcrumbClick = (index) => {
    const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
    setBreadcrumbs(newBreadcrumbs);
    setCurrentParentId(newBreadcrumbs[index].id);
    resetSearch();
  };
  const handleBackToRoot = () => {
    setBreadcrumbs([]);
    setCurrentParentId(void 0);
    resetSearch();
  };
  const handleClearSelection = () => {
    onChange(null);
    setBreadcrumbs([]);
    setCurrentParentId(void 0);
    resetSearch();
  };
  const getDisplayValue = () => {
    if (!value) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500", children: placeholder });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: value.name }) });
  };
  const getCurrentLevelTitle = () => {
    if (breadcrumbs.length === 0) return "Root";
    return breadcrumbs[breadcrumbs.length - 1]?.name || "Root";
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Popover,
    {
      open,
      onOpenChange: (newOpen) => {
        setOpen(newOpen);
        if (!newOpen) {
          resetSearch();
        }
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            role: "combobox",
            "aria-expanded": open,
            className: cn(
              "justify-between h-10 min-h-10 px-3 py-2",
              "hover:bg-gray-50 hover:text-gray-900",
              "focus:ring-2 focus:ring-gray-300 focus:ring-offset-2",
              "transition-all duration-200",
              disabled && "opacity-50 cursor-not-allowed"
            ),
            disabled,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 min-w-0 flex-1", children: getDisplayValue() }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ChevronDown,
                {
                  className: cn(
                    "h-4 w-4 shrink-0 opacity-50 transition-transform duration-200",
                    open && "rotate-180"
                  )
                }
              )
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          PopoverContent,
          {
            className: "w-[var(--radix-popover-trigger-width)] min-w-[300px] max-w-[420px] p-0 shadow-lg border-0",
            align: "start",
            sideOffset: 4,
            onWheel: (event) => event.stopPropagation(),
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3 border-b bg-gray-50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(House, { className: "h-4 w-4 text-gray-500" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-gray-600", children: getCurrentLevelTitle() }),
                  breadcrumbs.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "text-xs", children: [
                    "Level ",
                    breadcrumbs.length + 1
                  ] })
                ] }),
                value && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    onClick: handleClearSelection,
                    className: "h-6 px-2 text-xs text-gray-500 hover:text-gray-700",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(X$1, { className: "h-3 w-3 mr-1" }),
                      "Clear"
                    ]
                  }
                )
              ] }) }),
              breadcrumbs.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-2 border-b bg-gray-100", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    onClick: handleBackToRoot,
                    className: "h-6 px-2 text-xs hover:bg-white",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(House, { className: "h-3 w-3 mr-1" }),
                      "Root"
                    ]
                  }
                ),
                breadcrumbs.map((breadcrumb, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3 w-3 mx-1 text-gray-500" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "outline",
                      size: "sm",
                      onClick: () => handleBreadcrumbClick(index),
                      className: "h-6 px-2 text-xs hover:bg-white",
                      children: breadcrumb.name
                    }
                  )
                ] }, breadcrumb.id))
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Command, { className: "border-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-2 border-b", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    CommandInput,
                    {
                      placeholder: "Search departments",
                      value: searchQuery,
                      onValueChange: setSearchQuery,
                      className: "pl-9 h-9 border-0 focus:ring-0"
                    }
                  )
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(CommandList, { className: "max-h-[300px]", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CommandEmpty, { children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 space-y-3", children: Array.from({ length: 3 }).map((_, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-4 rounded" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1 flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4" }) })
                  ] }, index)) }) : searchQuery ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 text-center text-gray-500", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-8 w-8 mx-auto mb-2 opacity-50" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm", children: "No department found" })
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 text-center text-gray-500", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm", children: "No departments found" }) }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CommandGroup, { children: filteredDepartments.map((org) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    CommandItem,
                    {
                      value: org.name,
                      onSelect: () => handleSelect(org),
                      className: "flex items-center justify-between px-3 py-3 cursor-pointer hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150 border-b border-gray-200 last:border-b-0",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3 min-w-0 flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-w-0 flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-sm truncate", children: org.name }) }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-shrink-0", children: [
                          value?.id === org.id && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 text-gray-700" }),
                          org.has_children && /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 text-gray-500" })
                        ] })
                      ]
                    },
                    org.id
                  )) })
                ] })
              ] })
            ] })
          }
        )
      ]
    }
  );
}

function RoleSelect({
  roles,
  value,
  onChange,
  searchQuery,
  onSearchChange,
  isLoading = false,
  placeholder = "Select a role",
  disabled = false
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value, onValueChange: onChange, disabled, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      SelectValue,
      {
        placeholder: isLoading ? "Loading roles..." : placeholder
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            placeholder: "Search roles",
            value: searchQuery,
            onChange: (event) => onSearchChange(event.target.value),
            className: "w-full rounded-md border border-gray-200 py-2 pl-10 pr-3 text-sm"
          }
        )
      ] }) }),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 text-sm text-gray-500", children: "Loading roles..." }) : roles.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 text-sm text-gray-500", children: "No roles found." }) : roles.map((role) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: role.id, children: role.name }, role.id))
    ] })
  ] });
}

const {useMutation,useQuery} = await importShared('@tanstack/react-query');
const {useCallback: useCallback$1,useEffect,useMemo: useMemo$3,useState: useState$4} = await importShared('react');
const normalizeHeader$2 = (value) => value.toLowerCase().replace(/[^a-z0-9]/g, "");
const buildHeaderMap$1 = (headers) => {
  const headerMap = {
    username: void 0
  };
  headers.forEach((header, index) => {
    const normalized = normalizeHeader$2(header);
    if (normalized === "username" || normalized === "user_name") {
      headerMap.username = index;
    }
  });
  return headerMap;
};
function LinkUsersImport({ facilityId }) {
  const [currentStep, setCurrentStep] = useState$4("upload");
  const [uploadError, setUploadError] = useState$4("");
  const [rows, setRows] = useState$4([]);
  const [resolveProgress, setResolveProgress] = useState$4(0);
  const [roles, setRoles] = useState$4([]);
  const [roleQuery, setRoleQuery] = useState$4("");
  const [selectedRoleId, setSelectedRoleId] = useState$4("");
  const [organizations, setOrganizations] = useState$4([]);
  const [selectedOrg, setSelectedOrg] = useState$4(null);
  const [importProgress, setImportProgress] = useState$4(0);
  const [importTotal, setImportTotal] = useState$4(0);
  const [importProcessed, setImportProcessed] = useState$4(0);
  const readyCount = useMemo$3(
    () => rows.filter((row) => row.status === "ready").length,
    [rows]
  );
  const resultSummary = useMemo$3(
    () => ({
      linked: rows.filter((row) => row.status === "linked").length,
      alreadyExists: rows.filter((row) => row.status === "already_exists").length,
      failed: rows.filter((row) => row.status === "failed").length
    }),
    [rows]
  );
  const organizationsQuery = useQuery({
    queryKey: ["facility-organizations", facilityId],
    queryFn: () => request(
      `/api/v1/facility/${facilityId}/organizations/${queryString({ limit: 500 })}`,
      { method: "GET" }
    ),
    enabled: Boolean(facilityId)
  });
  const rolesQuery = useQuery({
    queryKey: ["roles", roleQuery],
    queryFn: () => request(
      `/api/v1/role/${queryString({ limit: 10, offset: 0, name: roleQuery })}`,
      { method: "GET" }
    )
  });
  useEffect(() => {
    setOrganizations(organizationsQuery.data?.results ?? []);
  }, [organizationsQuery.data]);
  useEffect(() => {
    setRoles(rolesQuery.data?.results ?? []);
  }, [rolesQuery.data]);
  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      setUploadError("Please upload a valid CSV file");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvText = e.target?.result;
        const { headers, rows: rows2 } = parseCsvText(csvText);
        if (headers.length === 0) {
          setUploadError("CSV is empty or missing headers");
          return;
        }
        const headerMap = buildHeaderMap$1(headers);
        if (headerMap.username === void 0) {
          setUploadError("CSV must include: username");
          return;
        }
        const parsedRows = rows2.map((row, index) => {
          const username = headerMap.username !== void 0 ? row[headerMap.username]?.trim() : "";
          return {
            rowIndex: index + 2,
            username: username || void 0,
            status: "pending"
          };
        });
        setUploadError("");
        setRows(parsedRows);
        setCurrentStep("review");
      } catch (error) {
        setUploadError("Error processing CSV file");
      }
    };
    reader.readAsText(file);
  };
  const resolveUsersMutation = useMutation({
    mutationFn: async (inputRows) => {
      setResolveProgress(0);
      const resolvedRows = [];
      const seenUserIds = /* @__PURE__ */ new Set();
      for (let index = 0; index < inputRows.length; index++) {
        const row = inputRows[index];
        let updatedRow = { ...row };
        const hasUsername = Boolean(row.username);
        if (!hasUsername) {
          updatedRow = {
            ...updatedRow,
            status: "invalid",
            message: "Missing username"
          };
        } else if (row.username) {
          try {
            const user = await request(
              `/api/v1/users/${row.username}/`,
              { method: "GET" }
            );
            updatedRow = {
              ...updatedRow,
              resolvedUserId: user.id,
              status: "ready"
            };
          } catch (error) {
            updatedRow = {
              ...updatedRow,
              status: "user_not_found",
              message: "User not found"
            };
          }
        }
        if (updatedRow.resolvedUserId) {
          if (seenUserIds.has(updatedRow.resolvedUserId)) {
            updatedRow = {
              ...updatedRow,
              status: "duplicate",
              message: "Duplicate user in CSV"
            };
          } else {
            seenUserIds.add(updatedRow.resolvedUserId);
          }
        }
        resolvedRows.push(updatedRow);
        setResolveProgress(Math.round((index + 1) / inputRows.length * 100));
      }
      return resolvedRows;
    },
    onSuccess: (resolvedRows) => {
      setRows(resolvedRows);
    }
  });
  const resolveUsers = useCallback$1(() => {
    if (rows.length === 0) return;
    resolveUsersMutation.mutate(rows);
  }, [rows, resolveUsersMutation]);
  useEffect(() => {
    if (currentStep !== "review") return;
    if (resolveUsersMutation.isPending) return;
    if (rows.length === 0) return;
    if (!rows.some((row) => row.status === "pending")) return;
    resolveUsers();
  }, [currentStep, resolveUsers, resolveUsersMutation.isPending, rows]);
  const linkUsersMutation = useMutation({
    mutationFn: async (inputRows) => {
      if (!facilityId || !selectedOrg || !selectedRoleId) {
        return inputRows;
      }
      setImportProgress(0);
      const updatedRows = [];
      const rowsToImport = inputRows.filter((row) => row.status === "ready");
      let processedCount = 0;
      setImportTotal(rowsToImport.length);
      setImportProcessed(0);
      for (let index = 0; index < inputRows.length; index++) {
        const row = inputRows[index];
        if (row.status !== "ready" || !row.resolvedUserId) {
          updatedRows.push(row);
          continue;
        }
        try {
          await request(
            `/api/v1/facility/${facilityId}/organizations/${selectedOrg.id}/users/`,
            {
              method: "POST",
              body: JSON.stringify({
                user: row.resolvedUserId,
                role: selectedRoleId
              })
            }
          );
          updatedRows.push({
            ...row,
            status: "linked",
            message: "Linked"
          });
        } catch (error) {
          const errorMessage = typeof error?.message === "string" ? error.message : "Unknown error";
          if (errorMessage.includes("User association already exists")) {
            updatedRows.push({
              ...row,
              status: "already_exists",
              message: "User association already exists"
            });
          } else {
            updatedRows.push({
              ...row,
              status: "failed",
              message: errorMessage
            });
          }
        }
        processedCount += 1;
        setImportProcessed(processedCount);
        setImportProgress(
          Math.round(processedCount / rowsToImport.length * 100)
        );
      }
      return updatedRows;
    },
    onSuccess: (updatedRows) => {
      setRows(updatedRows);
      setCurrentStep("done");
    }
  });
  const runImport = useCallback$1(() => {
    if (!facilityId || !selectedOrg || !selectedRoleId) return;
    setCurrentStep("importing");
    linkUsersMutation.mutate(rows);
  }, [facilityId, selectedOrg, selectedRoleId, linkUsersMutation, rows]);
  const downloadSample = () => {
    const sampleCSV = `username
johndon_dhm
bob_ssmm`;
    const blob = new Blob([sampleCSV], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample_link_users.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };
  const canImport = Boolean(facilityId) && Boolean(selectedOrg) && Boolean(selectedRoleId) && readyCount > 0 && !resolveUsersMutation.isPending && !linkUsersMutation.isPending;
  if (currentStep === "upload") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-4xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-5 w-5" }),
          "Link Users to Department"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Select a department and role, then upload a CSV with username." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-gray-700", children: "Department / Sub-Department" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              DepartmentSelect,
              {
                organizations,
                value: selectedOrg,
                onChange: setSelectedOrg,
                isLoading: organizationsQuery.isLoading
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium text-gray-700", children: "Role" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              RoleSelect,
              {
                roles,
                value: selectedRoleId,
                onChange: setSelectedRoleId,
                searchQuery: roleQuery,
                onSearchChange: setRoleQuery,
                isLoading: rolesQuery.isLoading
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-gray-500", children: "Roles are global and reused across facilities." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-2 border-dashed border-gray-300 rounded-lg p-8 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "file",
              accept: ".csv",
              onChange: handleFileUpload,
              className: "hidden",
              id: "link-users-csv-upload"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "link-users-csv-upload", className: "cursor-pointer", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-12 w-12 text-gray-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-medium", children: "Click to upload CSV" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", children: "or drag and drop" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: "Expected columns: username" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: downloadSample, children: "Download Sample CSV" })
          ] }) })
        ] }),
        uploadError && /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { className: "mt-4", variant: "destructive", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { children: uploadError })
        ] })
      ] })
    ] }) });
  }
  if (currentStep === "review") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-6xl mx-auto space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Review Users" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { children: [
          selectedOrg?.name || "No department selected",
          " ·",
          " ",
          roles.find((role) => role.id === selectedRoleId)?.name || "No role selected"
        ] }),
        resolveUsersMutation.isPending && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: resolveProgress, className: "h-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs text-gray-500", children: "Validating users..." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-gray-200 rounded-lg overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-80 overflow-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "min-w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-gray-50 text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2", children: "Row" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2", children: "Username" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2", children: "Resolved User ID" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2", children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2", children: "Message" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: rows.map((row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: row.rowIndex }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: row.username ?? "-" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: row.resolvedUserId ?? "-" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 capitalize", children: row.status }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: row.message ?? "" })
          ] }, row.rowIndex)) })
        ] }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex justify-end gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: () => setCurrentStep("upload"),
              children: "Back"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: runImport, disabled: !canImport, children: "Start Import" })
        ] })
      ] })
    ] }) });
  }
  if (currentStep === "importing") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-4xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Importing Users" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { children: [
        importProcessed,
        "/",
        importTotal,
        " processed"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: importProgress, className: "h-2" }) })
    ] }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-4xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Link Users Complete" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { children: [
        "Linked: ",
        resultSummary.linked,
        " · Already linked:",
        " ",
        resultSummary.alreadyExists,
        " · Failed: ",
        resultSummary.failed
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setCurrentStep("upload"), children: "Import Another File" }) }) })
  ] }) });
}

const React$1 = await importShared('react');
const {createContext,useContext} = React$1;

const CollapsibleContext = createContext(null);
function Collapsible({
  open = false,
  onOpenChange,
  children
}) {
  const handleToggle = () => {
    onOpenChange?.(!open);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(CollapsibleContext.Provider, { value: { open, onToggle: handleToggle }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-state": open ? "open" : "closed", children }) });
}
function CollapsibleTrigger({
  asChild = false,
  children
}) {
  const context = useContext(CollapsibleContext);
  if (!context) return children;
  const triggerProps = {
    onClick: (event) => {
      children.props?.onClick?.(event);
      context.onToggle();
    }
  };
  if (asChild) {
    return React$1.cloneElement(children, triggerProps);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", ...triggerProps, children });
}
function CollapsibleContent({
  children,
  className = ""
}) {
  const context = useContext(CollapsibleContext);
  if (!context || !context.open) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className, "data-state": context.open ? "open" : "closed", children });
}

const LocationTypeIcons = {
  bd: Bed,
  wa: Hospital,
  lvl: Building2,
  bu: Building,
  si: Map$1,
  wi: Building2,
  co: Building2,
  ro: House,
  ve: Car,
  ho: House,
  ca: Car,
  rd: Car,
  area: Map$1,
  jdn: Map$1,
  vi: Eye
};

const locationApi = {
  create: {
    path: "/api/v1/facility/{facility_id}/location/"}
};

const {useCallback,useState: useState$3} = await importShared('react');
const LocationFormLabels = {
  bed: "bd",
  building: "bu",
  cabinet: "ca",
  corridor: "co",
  house: "ho",
  jurisdiction: "jdn",
  level: "lvl",
  road: "rd",
  room: "ro",
  site: "si",
  vehicle: "ve",
  virtual: "vi",
  ward: "wa",
  wing: "wi"
};
const mapLabelToForm = (label) => {
  const formKey = LocationFormLabels[label];
  return formKey;
};
const processRowLocations = (data) => {
  let locations = [];
  const processAtLocation = (locationData, locations2) => {
    const [location, location_type, description] = locationData.slice(0, 3);
    const tail = locationData.slice(3);
    const existingLocation = locations2.find((l) => l.name === location);
    if (existingLocation && tail.length > 0 && tail[0] !== "") {
      return [
        ...locations2.filter((l) => l.name !== location),
        {
          ...existingLocation,
          children: processAtLocation(tail, existingLocation.children)
        }
      ];
    } else {
      const locationForm = mapLabelToForm(location_type?.toLowerCase()) || "ro";
      const newLocation = {
        name: location,
        form: locationForm,
        mode: locationForm === "bd" ? "instance" : "kind",
        status: "active",
        operational_status: "U",
        description,
        children: []
      };
      let children = [];
      if (tail.length > 0 && tail[0] != "") {
        children = processAtLocation(tail, newLocation.children);
      }
      return [
        ...locations2,
        {
          ...newLocation,
          children
        }
      ];
    }
  };
  for (const locationRow of data) {
    locations = processAtLocation(locationRow, locations);
  }
  return locations;
};
function LocationImport({ facilityId }) {
  const [processedLocations, setProcessedLocations] = useState$3([]);
  const [currentStep, setCurrentStep] = useState$3("upload");
  const [uploadError, setUploadError] = useState$3("");
  const { saveLocations } = useSaveLocations(facilityId ?? "");
  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      setUploadError("Please upload a valid CSV file");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        console.log("Here?");
        const csvText = e.target?.result;
        const rows = csvText.split("\n");
        const headers = rows[0].split(",").map((h) => h.trim().replace(/"/g, ""));
        console.log("Parsed headers:", headers);
        if (headers.length < 3 || headers.length % 3 !== 0) {
          setUploadError(
            "CSV format is invalid. Expected groups of 3 columns: location, type, description"
          );
          return;
        }
        const data = [];
        for (let i = 1; i < rows.length; i++) {
          if (rows[i].trim()) {
            const values = rows[i].split(",").map((v) => v.trim().replace(/"/g, ""));
            if (values.length >= headers.length) {
              data.push(values);
            }
          }
        }
        setUploadError("");
        setProcessedLocations(processRowLocations(data));
        setCurrentStep("review");
      } catch (error) {
        setUploadError("Error processing CSV file");
      }
    };
    reader.readAsText(file);
  };
  if (currentStep === "upload") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-4xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-5 w-5" }),
          "Import Locations from CSV"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Upload a CSV file to import floor, room, and sub-room locations with their hierarchy preserved." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-2 border-dashed border-gray-300 rounded-lg p-8 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "file",
              accept: ".csv",
              onChange: handleFileUpload,
              className: "hidden",
              id: "csv-upload"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "csv-upload", className: "cursor-pointer", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-12 w-12 text-gray-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-medium", children: "Click to upload CSV file" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", children: "or drag and drop" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: "Expected columns: location, type, description (repeated for each hierarchy level)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 mt-2", children: 'Location types can use labels like "bed", "room", "ward", etc. The last description column is optional.' }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => {
                  const sampleCSV = `Building,type,description,Room,type,description,Bed,type,description
Main Building,building,Main hospital building,ICU,ward,Intensive Care Unit,Bed 1,bed,ICU Bed 1
Main Building,building,Main hospital building,ICU,ward,Intensive Care Unit,Bed 2,bed,ICU Bed 2
Main Building,building,Main hospital building,Reception,room,Main reception area,Waiting Area,area,Patient waiting space`;
                  const blob = new Blob([sampleCSV], { type: "text/csv" });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "sample_locations.csv";
                  a.click();
                  window.URL.revokeObjectURL(url);
                },
                children: "Download Sample CSV"
              }
            )
          ] }) })
        ] }),
        uploadError && /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { className: "mt-4", variant: "destructive", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { children: uploadError })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 p-4 bg-gray-50 rounded-lg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-medium text-sm mb-2", children: "Valid Location Types:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: Object.entries(LocationFormLabels).map(([key, label]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-xs", children: [
            label,
            " (",
            key,
            ")"
          ] }, key)) })
        ] })
      ] })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Location Import Wizard" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Review and validate locations before importing" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: 100, className: "h-2" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold mb-4", children: "Review All Locations" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(HierarchicalLocationPreview, { locations: processedLocations })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          className: "mt-4",
          onClick: () => facilityId && saveLocations(processedLocations),
          children: "Save"
        }
      ) })
    ] })
  ] }) });
}
const HierarchicalLocationPreview = ({
  locations
}) => {
  const [expandedItems, setExpandedItems] = useState$3(/* @__PURE__ */ new Set());
  const toggleExpanded = (locationId) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(locationId)) {
      newExpanded.delete(locationId);
    } else {
      newExpanded.add(locationId);
    }
    setExpandedItems(newExpanded);
  };
  const renderLocationItem = (location, depth = 0) => {
    const IconComponent = LocationTypeIcons[location.form];
    const hasChildren = location.children && location.children.length > 0;
    const isExpanded = expandedItems.has(location.name);
    const locationId = `${location.name}-${depth}`;
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Collapsible,
      {
        open: isExpanded,
        onOpenChange: () => toggleExpanded(location.name),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CollapsibleTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-gray-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center",
                style: { marginLeft: `${depth * 24}px` },
                children: [
                  hasChildren && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center w-4 h-4 mr-2", children: isExpanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3 w-3 text-gray-500" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3 w-3 text-gray-500" }) }),
                  !hasChildren && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-4 mr-2" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx(IconComponent, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-medium text-gray-900 truncate", children: location.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: location.form }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: location.mode === "instance" ? "primary" : "secondary",
                    className: "text-xs",
                    children: location.mode
                  }
                )
              ] }),
              location.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 truncate mt-1", children: location.description })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 ml-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: location.status === "active" ? "primary" : "secondary",
                  className: "text-xs",
                  children: location.status
                }
              ),
              hasChildren && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-xs", children: [
                location.children.length,
                " child",
                location.children.length !== 1 ? "ren" : ""
              ] })
            ] })
          ] }) }) }),
          hasChildren && /* @__PURE__ */ jsxRuntimeExports.jsx(CollapsibleContent, { className: "data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-6 border-l-2 border-gray-200", children: location.children.map(
            (child) => renderLocationItem(child, depth + 1)
          ) }) })
        ]
      }
    ) }, locationId);
  };
  if (locations.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8 text-gray-500", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "No locations to preview" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-lg font-medium", children: "Location Hierarchy Preview" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => setExpandedItems(/* @__PURE__ */ new Set()),
            children: "Collapse All"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => {
              const allNames = /* @__PURE__ */ new Set();
              const collectNames = (locs) => {
                locs.forEach((loc) => {
                  allNames.add(loc.name);
                  if (loc.children.length > 0) {
                    collectNames(loc.children);
                  }
                });
              };
              collectNames(locations);
              setExpandedItems(allNames);
            },
            children: "Expand All"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border rounded-lg bg-white", children: locations.map((location) => renderLocationItem(location)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-gray-500", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
      "Total locations: ",
      countTotalLocations(locations)
    ] }) })
  ] });
};
const countTotalLocations = (locations) => {
  let count = 0;
  const countRecursive = (locs) => {
    locs.forEach((loc) => {
      count++;
      if (loc.children.length > 0) {
        countRecursive(loc.children);
      }
    });
  };
  countRecursive(locations);
  return count;
};
function useSaveLocations(facilityId) {
  const saveLocations = useCallback(
    async (roots) => {
      await saveLocationTree(facilityId, void 0, roots);
    },
    [facilityId]
  );
  return { saveLocations };
}
async function saveLocationTree(facilityId, parentId, nodes) {
  for (const node of nodes) {
    const { path } = locationApi.create;
    const url = path.replace("{facility_id}", facilityId);
    const payload = {
      parent: parentId ?? void 0,
      organizations: [],
      status: node.status,
      operational_status: node.operational_status,
      name: node.name,
      description: node.description,
      location_type: node.location_type,
      form: node.form,
      mode: node.mode
    };
    const created = await request(url, {
      method: "POST",
      body: JSON.stringify(payload)
    });
    if (node.children.length > 0) {
      await saveLocationTree(facilityId, created.id, node.children);
    }
  }
}

var ProductKnowledgeStatus = /* @__PURE__ */ ((ProductKnowledgeStatus2) => {
  ProductKnowledgeStatus2["active"] = "active";
  return ProductKnowledgeStatus2;
})(ProductKnowledgeStatus || {});
var ProductKnowledgeType = /* @__PURE__ */ ((ProductKnowledgeType2) => {
  ProductKnowledgeType2["consumable"] = "consumable";
  ProductKnowledgeType2["medication"] = "medication";
  ProductKnowledgeType2["nutritional_product"] = "nutritional_product";
  return ProductKnowledgeType2;
})(ProductKnowledgeType || {});
var ProductNameTypes = /* @__PURE__ */ ((ProductNameTypes2) => {
  ProductNameTypes2["trade_name"] = "trade_name";
  ProductNameTypes2["alias"] = "alias";
  ProductNameTypes2["original_name"] = "original_name";
  ProductNameTypes2["preferred"] = "preferred";
  return ProductNameTypes2;
})(ProductNameTypes || {});

const {useMemo: useMemo$2,useState: useState$2} = await importShared('react');
const HEADER_MAP = {
  resourceCategory: 0,
  slug: 1,
  name: 2,
  productType: 3,
  codeDisplay: 4,
  codeValue: 5,
  baseUnitDisplay: 6,
  dosageFormDisplay: 7,
  dosageFormCode: 8,
  routeCode: 9,
  routeDisplay: 10,
  alternateIdentifier: 11,
  alternateNameType: 12,
  alternateNameValue: 13
};
const REQUIRED_HEADERS$2 = [
  "resourceCategory",
  "name",
  "productType",
  "baseUnitDisplay"
];
const SNOMED_SYSTEM = "http://snomed.info/sct";
const DOSAGE_UNITS_CODES = [
  { system: "http://unitsofmeasure.org", code: "{tbl}", display: "tablets" },
  {
    system: "http://unitsofmeasure.org",
    code: "{Capsule}",
    display: "capsules"
  },
  { system: "http://unitsofmeasure.org", code: "mL", display: "milliliter" },
  { system: "http://unitsofmeasure.org", code: "mg", display: "milligram" },
  { system: "http://unitsofmeasure.org", code: "g", display: "gram" },
  { system: "http://unitsofmeasure.org", code: "ug", display: "microgram" },
  { system: "http://unitsofmeasure.org", code: "L", display: "liter" },
  {
    system: "http://unitsofmeasure.org",
    code: "[iU]",
    display: "international unit"
  },
  { system: "http://unitsofmeasure.org", code: "{count}", display: "count" },
  { system: "http://unitsofmeasure.org", code: "[drp]", display: "drop" },
  {
    system: "http://unitsofmeasure.org",
    code: "mg/mL",
    display: "milligram per milliliter"
  }
];
const parseCsvList = (value) => value ? value.split(",").map((entry) => entry.trim()).filter(Boolean) : [];
function ProductKnowledgeImport({
  facilityId
}) {
  const [currentStep, setCurrentStep] = useState$2("upload");
  const [uploadError, setUploadError] = useState$2("");
  const [processedRows, setProcessedRows] = useState$2([]);
  const [results, setResults] = useState$2(null);
  const summary = useMemo$2(() => {
    const valid = processedRows.filter((row) => row.errors.length === 0).length;
    const invalid = processedRows.length - valid;
    return { total: processedRows.length, valid, invalid };
  }, [processedRows]);
  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      setUploadError("Please upload a valid CSV file");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvText = e.target?.result;
        const { rows } = parseCsvText(csvText);
        const processed = rows.map((row, index) => {
          const datapoint = Object.keys(HEADER_MAP).reduce(
            (acc, key) => {
              const idx = HEADER_MAP[key];
              acc[key] = row[idx] ?? "";
              return acc;
            },
            {}
          );
          try {
            const normalized = getValidatedDatapoint(datapoint);
            return {
              rowIndex: index + 2,
              raw: datapoint,
              errors: [],
              normalized
            };
          } catch (error) {
            return {
              rowIndex: index + 2,
              raw: datapoint,
              errors: [
                error instanceof Error ? error.message : "Validation failed"
              ],
              normalized: null
            };
          }
        });
        setUploadError("");
        setProcessedRows(processed);
        setCurrentStep("review");
      } catch (error) {
        setUploadError("Error processing CSV file");
      }
    };
    reader.readAsText(file);
  };
  const downloadSample = () => {
    const sampleCSV = `resourceCategory,slug,name,productType,codeDisplay,codeValue,baseUnitDisplay,dosageFormDisplay,dosageFormCode,routeCode,routeDisplay,alternateIdentifier,alternateNameType,alternateNameValue
Medicines,,Paracetamol,medication,Paracetamol,12345,tablet,Tablet,123456,123456,Oral,,,`;
    const blob = new Blob([sampleCSV], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample_product_knowledge.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };
  const runImport = async () => {
    const validRows = processedRows.filter((row) => row.errors.length === 0);
    if (validRows.length === 0) {
      setResults({
        processed: 0,
        created: 0,
        skipped: 0,
        failed: 0,
        failures: []
      });
      setCurrentStep("done");
      return;
    }
    setCurrentStep("importing");
    setResults({
      processed: 0,
      created: 0,
      skipped: 0,
      failed: 0,
      failures: []
    });
    if (!facilityId) return;
    const resourceCategories = [
      ...new Set(validRows.map((row) => row.normalized.resourceCategory))
    ];
    await upsertResourceCategories(facilityId, resourceCategories);
    const existingSlugs = await getExistingProductKnowledgeSlugs(facilityId);
    for (const row of validRows) {
      const datapoint = await resolveDatapoint(row.normalized);
      if (existingSlugs.has(datapoint.slug)) {
        setResults(
          (prev) => prev ? {
            ...prev,
            processed: prev.processed + 1,
            skipped: prev.skipped + 1
          } : prev
        );
        continue;
      }
      const productKnowledge = {
        slug_value: datapoint.slug,
        name: datapoint.name,
        facility: facilityId,
        product_type: datapoint.productType,
        status: ProductKnowledgeStatus.active,
        base_unit: datapoint.baseUnit,
        category: `f-${facilityId}-pk-${await createSlug(datapoint.resourceCategory)}`,
        names: [],
        storage_guidelines: [],
        is_instance_level: false
      };
      if (datapoint.code) {
        productKnowledge.code = datapoint.code;
      }
      if (datapoint.dosageForm) {
        productKnowledge.definitional = {
          dosage_form: datapoint.dosageForm,
          intended_routes: datapoint.intendedRoutes,
          ingredients: [],
          nutrients: [],
          drug_characteristic: []
        };
      }
      if (datapoint.alternateIdentifier) {
        productKnowledge.alternate_identifier = datapoint.alternateIdentifier;
      }
      if (datapoint.alternateNameType && datapoint.alternateNameValue) {
        productKnowledge.names = [
          {
            name_type: datapoint.alternateNameType,
            name: datapoint.alternateNameValue
          }
        ];
      }
      try {
        await request("/api/v1/product_knowledge/", {
          method: "POST",
          body: JSON.stringify(productKnowledge)
        });
        setResults(
          (prev) => prev ? {
            ...prev,
            processed: prev.processed + 1,
            created: prev.created + 1
          } : prev
        );
      } catch (error) {
        const reason = error instanceof Error ? error.message : "Unknown error";
        setResults(
          (prev) => prev ? {
            ...prev,
            processed: prev.processed + 1,
            failed: prev.failed + 1,
            failures: [
              ...prev.failures,
              {
                rowIndex: row.rowIndex,
                name: datapoint.name,
                reason
              }
            ]
          } : prev
        );
      }
    }
    setCurrentStep("done");
  };
  if (currentStep === "upload") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-4xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-5 w-5" }),
          "Import Product Knowledge from CSV"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Upload a CSV file to import product knowledge entries." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-2 border-dashed border-gray-300 rounded-lg p-8 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "file",
              accept: ".csv",
              onChange: handleFileUpload,
              className: "hidden",
              id: "product-knowledge-upload"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "product-knowledge-upload",
              className: "cursor-pointer",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-12 w-12 text-gray-400" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-medium", children: "Click to upload CSV file" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", children: "or drag and drop" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: "Expected columns: resourceCategory, slug, name, productType, codeDisplay, codeValue, baseUnitDisplay, dosageFormDisplay, dosageFormCode, routeCode, routeDisplay, alternateIdentifier, alternateNameType, alternateNameValue" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: downloadSample, children: "Download Sample CSV" })
              ] })
            }
          )
        ] }),
        uploadError && /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { className: "mt-4", variant: "destructive", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { children: uploadError })
        ] })
      ] })
    ] }) });
  }
  if (currentStep === "review") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Product Knowledge Import Wizard" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Review and validate product knowledge before importing" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: 100, className: "h-2" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold mb-4", children: "Review All Product Knowledge" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-gray-200 rounded-lg overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-80 overflow-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "min-w-full text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-gray-50 text-gray-600", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2 text-left", children: "Row" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2 text-left", children: "Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2 text-left", children: "Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2 text-left", children: "Status" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: processedRows.map((row) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "tr",
              {
                className: "border-t border-gray-100",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-gray-500", children: row.rowIndex }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2", children: row.normalized?.name || "—" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2", children: row.normalized?.productType || "—" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2", children: row.errors.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-600", children: "Valid" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-600", children: row.errors.join("; ") }) })
                ]
              },
              row.rowIndex
            )) })
          ] }) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            className: "mt-4",
            onClick: runImport,
            disabled: summary.valid === 0,
            children: "Start Import"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            onClick: () => setCurrentStep("upload"),
            children: "Back"
          }
        ) })
      ] })
    ] }) });
  }
  if (currentStep === "importing") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-4xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Importing Product Knowledge" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { children: [
        results?.processed ?? 0,
        "/",
        summary.valid,
        " processed"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Progress,
        {
          value: summary.valid ? (results?.processed ?? 0) / summary.valid * 100 : 0,
          className: "h-2"
        }
      ) })
    ] }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-4xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Product Knowledge Import Complete" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { children: [
        "Created: ",
        results?.created ?? 0,
        " · Skipped: ",
        results?.skipped ?? 0,
        " ",
        "· Failed: ",
        results?.failed ?? 0
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
      results && results.failures.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { className: "mb-4", variant: "destructive", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { children: results.failures.map((failure) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          "Row ",
          failure.rowIndex,
          ": ",
          failure.reason
        ] }, `${failure.rowIndex}-${failure.name}`)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setCurrentStep("upload"), children: "Import Another File" }) })
    ] })
  ] }) });
}
function getValidatedDatapoint(datapoint) {
  if (REQUIRED_HEADERS$2.some((key) => !datapoint[key].trim())) {
    throw new Error("Missing required fields");
  }
  const baseUnit = DOSAGE_UNITS_CODES.find(
    (unit) => unit.display === datapoint.baseUnitDisplay.toLowerCase()
  );
  if (!baseUnit) {
    throw new Error(
      `Could not resolve base unit for '${datapoint.baseUnitDisplay}'`
    );
  }
  const slugPromise = datapoint.slug ? Promise.resolve(datapoint.slug) : createProductKnowledgeSlug(datapoint.name);
  const productType = [
    ProductKnowledgeType.consumable,
    ProductKnowledgeType.medication,
    ProductKnowledgeType.nutritional_product
  ].find((type) => type === datapoint.productType.toLowerCase());
  if (!productType) {
    throw new Error(`Product type '${datapoint.productType}' is not valid`);
  }
  let alternateNameType;
  if (datapoint?.alternateNameType) {
    alternateNameType = [
      ProductNameTypes.trade_name,
      ProductNameTypes.alias,
      ProductNameTypes.original_name,
      ProductNameTypes.preferred
    ].find(
      (type) => type === datapoint?.alternateNameType.toLowerCase().replace(/\s+/g, "_")
    );
    if (!alternateNameType) {
      throw new Error(
        `Alternate name type '${datapoint.alternateNameType}' is not valid`
      );
    }
  }
  const dosageFormCode = datapoint.dosageFormCode?.trim();
  const dosageFormDisplay = datapoint.dosageFormDisplay?.trim();
  const routeCodes = parseCsvList(datapoint.routeCode);
  const routeDisplays = parseCsvList(datapoint.routeDisplay);
  const intendedRoutes = routeCodes.map((code2, index) => ({
    system: SNOMED_SYSTEM,
    code: code2,
    display: routeDisplays[index] || routeDisplays[0] || code2
  }));
  const dosageForm = dosageFormCode ? {
    system: SNOMED_SYSTEM,
    code: dosageFormCode,
    display: dosageFormDisplay || dosageFormCode
  } : void 0;
  const codeValue = datapoint.codeValue?.trim();
  const codeDisplay = datapoint.codeDisplay?.trim();
  const code = codeValue ? {
    system: SNOMED_SYSTEM,
    code: codeValue,
    display: codeDisplay || codeValue
  } : void 0;
  return {
    ...datapoint,
    baseUnit,
    slugPromise,
    productType,
    alternateNameType,
    dosageForm,
    intendedRoutes,
    code
  };
}
async function createProductKnowledgeSlug(name) {
  return await createSlug(name);
}
async function resolveDatapoint(datapoint) {
  const slug = await datapoint.slugPromise;
  return { ...datapoint, slug };
}
async function upsertResourceCategories(facilityId, resourceCategories) {
  const existingCategories = await request(
    `/api/v1/facility/${facilityId}/resource_category/?limit=100&resource_type=${ResourceCategoryResourceType.product_knowledge}&resource_sub_type=${ResourceCategorySubType.other}`,
    { method: "GET" }
  );
  const existingSlugs = new Set(
    existingCategories.results.map((cat) => cat.slug_config.slug_value)
  );
  const categoryEntries = await Promise.all(
    resourceCategories.map(async (category) => ({
      category,
      slug: await createSlug(category)
    }))
  );
  const categorySlugMap = new Map(
    categoryEntries.map(({ category, slug }) => [category, slug])
  );
  const newDatapoints = categoryEntries.filter(({ slug }) => !existingSlugs.has(`pk-${slug}`)).map(({ category }) => category);
  if (newDatapoints.length === 0) {
    return;
  }
  await request(`/api/v1/facility/${facilityId}/resource_category/upsert/`, {
    method: "POST",
    body: JSON.stringify({
      datapoints: newDatapoints.map((data) => {
        const slug = categorySlugMap.get(data);
        if (!slug) {
          throw new Error(`Missing slug for category: ${data}`);
        }
        return {
          title: data,
          slug_value: `pk-${slug}`,
          resource_type: ResourceCategoryResourceType.product_knowledge,
          resource_sub_type: ResourceCategorySubType.other
        };
      })
    })
  });
}
async function getExistingProductKnowledgeSlugs(facilityId) {
  const results = [];
  let hasNextPage = true;
  let page = 0;
  while (hasNextPage) {
    const response = await request(
      `/api/v1/product_knowledge/?facility=${facilityId}&limit=100&offset=${page * 100}`,
      { method: "GET" }
    );
    results.push(...response.results);
    if (response.results.length < 100) {
      hasNextPage = false;
    }
    page++;
  }
  return new Set(results.map((pk) => pk.slug_config.slug_value));
}

var SpecimenDefinitionStatus = /* @__PURE__ */ ((SpecimenDefinitionStatus2) => {
  SpecimenDefinitionStatus2["draft"] = "draft";
  SpecimenDefinitionStatus2["active"] = "active";
  SpecimenDefinitionStatus2["retired"] = "retired";
  return SpecimenDefinitionStatus2;
})(SpecimenDefinitionStatus || {});
var Preference = /* @__PURE__ */ ((Preference2) => {
  Preference2["preferred"] = "preferred";
  Preference2["alternate"] = "alternate";
  return Preference2;
})(Preference || {});

const {useMemo: useMemo$1,useState: useState$1} = await importShared('react');
const REQUIRED_HEADERS$1 = [
  "title",
  "description",
  "type_collected_code",
  "type_collected_system",
  "type_collected_display"
];
const OPTIONAL_HEADERS$1 = [
  "patient_preparation_code",
  "patient_preparation_system",
  "patient_preparation_display",
  "collection_code",
  "collection_system",
  "collection_display",
  "preference",
  "requirement",
  "single_use",
  "container_description",
  "container_capacity_value",
  "container_capacity_unit_code",
  "container_capacity_unit_system",
  "container_capacity_unit_display",
  "container_minimumvolume_string",
  "container_cap_code",
  "container_cap_system",
  "container_cap_display",
  "container_minimumvolume",
  "container_minimumvolume_unit_code",
  "container_minimumvolume_unit_system",
  "container_minimumvolume_unit_display",
  "container_preparation",
  "retention_time_value",
  "retention_time_unit_code",
  "retention_time_unit_system",
  "retention_time_unit_display"
];
const createCode = (code, system, display) => {
  if (code && system && display) {
    return { code, system, display };
  }
  return void 0;
};
function SpecimenDefinitionImport({
  facilityId
}) {
  const [currentStep, setCurrentStep] = useState$1("upload");
  const [uploadError, setUploadError] = useState$1("");
  const [processedRows, setProcessedRows] = useState$1([]);
  const [results, setResults] = useState$1(null);
  const summary = useMemo$1(() => {
    const valid = processedRows.filter((row) => row.errors.length === 0).length;
    const invalid = processedRows.length - valid;
    return { total: processedRows.length, valid, invalid };
  }, [processedRows]);
  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      setUploadError("Please upload a valid CSV file");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvText = e.target?.result;
        const { headers, rows } = parseCsvText(csvText);
        if (headers.length === 0) {
          setUploadError("CSV is empty or missing headers");
          return;
        }
        const headerMap = headers.reduce(
          (acc, header, index) => {
            const key = header.trim();
            acc[key] = index;
            return acc;
          },
          {}
        );
        const missingHeaders = REQUIRED_HEADERS$1.filter(
          (header) => headerMap[header] === void 0
        );
        if (missingHeaders.length > 0) {
          setUploadError(
            `Missing required headers: ${missingHeaders.join(", ")}`
          );
          return;
        }
        const processed = rows.map((row, index) => {
          const data = {
            title: row[headerMap.title] ?? "",
            description: headerMap.description !== void 0 ? row[headerMap.description] : void 0,
            status: "active",
            patient_preparation_code: headerMap.patient_preparation_code !== void 0 ? row[headerMap.patient_preparation_code] : void 0,
            patient_preparation_system: headerMap.patient_preparation_system !== void 0 ? row[headerMap.patient_preparation_system] : void 0,
            patient_preparation_display: headerMap.patient_preparation_display !== void 0 ? row[headerMap.patient_preparation_display] : void 0,
            collection_code: headerMap.collection_code !== void 0 ? row[headerMap.collection_code] : void 0,
            collection_system: headerMap.collection_system !== void 0 ? row[headerMap.collection_system] : void 0,
            collection_display: headerMap.collection_display !== void 0 ? row[headerMap.collection_display] : void 0,
            type_collected_code: row[headerMap.type_collected_code] ?? "",
            type_collected_system: row[headerMap.type_collected_system] ?? "",
            type_collected_display: row[headerMap.type_collected_display] ?? "",
            preference: headerMap.preference !== void 0 ? row[headerMap.preference] : void 0,
            requirement: headerMap.requirement !== void 0 ? row[headerMap.requirement] : void 0,
            single_use: headerMap.single_use !== void 0 ? row[headerMap.single_use] : void 0,
            container_description: headerMap.container_description !== void 0 ? row[headerMap.container_description] : void 0,
            container_capacity_value: headerMap.container_capacity_value !== void 0 ? row[headerMap.container_capacity_value] : void 0,
            container_capacity_unit_code: headerMap.container_capacity_unit_code !== void 0 ? row[headerMap.container_capacity_unit_code] : void 0,
            container_capacity_unit_system: headerMap.container_capacity_unit_system !== void 0 ? row[headerMap.container_capacity_unit_system] : void 0,
            container_capacity_unit_display: headerMap.container_capacity_unit_display !== void 0 ? row[headerMap.container_capacity_unit_display] : void 0,
            container_minimumvolume_string: headerMap.container_minimumvolume_string !== void 0 ? row[headerMap.container_minimumvolume_string] : void 0,
            container_cap_code: headerMap.container_cap_code !== void 0 ? row[headerMap.container_cap_code] : void 0,
            container_cap_system: headerMap.container_cap_system !== void 0 ? row[headerMap.container_cap_system] : void 0,
            container_cap_display: headerMap.container_cap_display !== void 0 ? row[headerMap.container_cap_display] : void 0,
            container_minimumvolume: headerMap.container_minimumvolume !== void 0 ? row[headerMap.container_minimumvolume] : void 0,
            container_minimumvolume_unit_code: headerMap.container_minimumvolume_unit_code !== void 0 ? row[headerMap.container_minimumvolume_unit_code] : void 0,
            container_minimumvolume_unit_system: headerMap.container_minimumvolume_unit_system !== void 0 ? row[headerMap.container_minimumvolume_unit_system] : void 0,
            container_minimumvolume_unit_display: headerMap.container_minimumvolume_unit_display !== void 0 ? row[headerMap.container_minimumvolume_unit_display] : void 0,
            container_preparation: headerMap.container_preparation !== void 0 ? row[headerMap.container_preparation] : void 0,
            retention_time_value: headerMap.retention_time_value !== void 0 ? row[headerMap.retention_time_value] : void 0,
            retention_time_unit_code: headerMap.retention_time_unit_code !== void 0 ? row[headerMap.retention_time_unit_code] : void 0,
            retention_time_unit_system: headerMap.retention_time_unit_system !== void 0 ? row[headerMap.retention_time_unit_system] : void 0,
            retention_time_unit_display: headerMap.retention_time_unit_display !== void 0 ? row[headerMap.retention_time_unit_display] : void 0
          };
          const errors = [];
          if (!data.title.trim()) errors.push("Missing title");
          if (!data.type_collected_code.trim())
            errors.push("Missing type_collected_code");
          if (!data.type_collected_system.trim())
            errors.push("Missing type_collected_system");
          if (!data.type_collected_display.trim())
            errors.push("Missing type_collected_display");
          return {
            rowIndex: index + 2,
            data,
            errors
          };
        });
        setUploadError("");
        setProcessedRows(processed);
        setCurrentStep("review");
      } catch (error) {
        setUploadError("Error processing CSV file");
      }
    };
    reader.readAsText(file);
  };
  const downloadSample = () => {
    const sampleCSV = `title,description,patient_preparation_code,patient_preparation_system,patient_preparation_display,collection_code,collection_system,collection_display,type_collected_code,type_collected_system,type_collected_display,preference,requirement,single_use,container_description,container_capacity_value,container_capacity_unit_code,container_capacity_unit_system,container_capacity_unit_display,container_minimumvolume_string,container_cap_code,container_cap_system,container_cap_display,container_minimumvolume,container_minimumvolume_unit_code,container_minimumvolume_unit_system,container_minimumvolume_unit_display,container_preparation,retention_time_value,retention_time_unit_code,retention_time_unit_system,retention_time_unit_display
Blood collection,Description,,,,129300006,http://snomed.info/sct,Puncture - action,WB,http://terminology.hl7.org/CodeSystem/v2-0487,"Blood, Whole",preferred,Requirement,true,Container Description,5.00,mL,http://unitsofmeasure.org,milliliter,12,black,http://terminology.hl7.org/CodeSystem/container-cap,black cap,,,,,Preparation,24.00,h,http://unitsofmeasure.org,hours`;
    const blob = new Blob([sampleCSV], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample_specimen_definition.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };
  const runImport = async () => {
    const validRows = processedRows.filter((row) => row.errors.length === 0);
    if (validRows.length === 0) {
      setResults({
        processed: 0,
        created: 0,
        failed: 0,
        failures: []
      });
      setCurrentStep("done");
      return;
    }
    setCurrentStep("importing");
    setResults({
      processed: 0,
      created: 0,
      failed: 0,
      failures: []
    });
    if (!facilityId) return;
    for (const row of validRows) {
      try {
        const slug = await createSlug(row.data.title);
        const typeCollected = createCode(
          row.data.type_collected_code,
          row.data.type_collected_system,
          row.data.type_collected_display
        );
        if (!typeCollected) {
          throw new Error("Missing type_collected information");
        }
        const containerCap = createCode(
          row.data.container_cap_code,
          row.data.container_cap_system,
          row.data.container_cap_display
        );
        const patientPreparation = createCode(
          row.data.patient_preparation_code,
          row.data.patient_preparation_system,
          row.data.patient_preparation_display
        );
        const collection = createCode(
          row.data.collection_code,
          row.data.collection_system,
          row.data.collection_display
        );
        const containerCapacityUnit = createCode(
          row.data.container_capacity_unit_code,
          row.data.container_capacity_unit_system,
          row.data.container_capacity_unit_display
        );
        const containerCapacityValue = row.data.container_capacity_value ? parseFloat(row.data.container_capacity_value) : 0;
        const minimumVolumeUnit = createCode(
          row.data.container_minimumvolume_unit_code,
          row.data.container_minimumvolume_unit_system,
          row.data.container_minimumvolume_unit_display
        );
        const minimumVolumeValue = row.data.container_minimumvolume ? parseFloat(row.data.container_minimumvolume) : 0;
        const containerMinimumVolume = row.data.container_minimumvolume_string ? { string: row.data.container_minimumvolume_string } : minimumVolumeUnit && minimumVolumeValue > 0 ? {
          quantity: {
            value: minimumVolumeValue.toString(),
            unit: minimumVolumeUnit
          }
        } : void 0;
        const container = containerCap || containerMinimumVolume || row.data.container_description || row.data.container_preparation || containerCapacityUnit && containerCapacityValue > 0 ? {
          ...row.data.container_description && {
            description: row.data.container_description
          },
          ...containerCapacityUnit && containerCapacityValue > 0 ? {
            capacity: {
              value: containerCapacityValue.toString(),
              unit: containerCapacityUnit
            }
          } : {},
          ...containerMinimumVolume && {
            minimum_volume: containerMinimumVolume
          },
          ...containerCap && { cap: containerCap },
          ...row.data.container_preparation && {
            preparation: row.data.container_preparation
          }
        } : void 0;
        const retentionTimeUnit = createCode(
          row.data.retention_time_unit_code,
          row.data.retention_time_unit_system,
          row.data.retention_time_unit_display
        );
        const typeTested = {
          is_derived: false,
          preference: row.data.preference || Preference.preferred,
          ...container && { container },
          ...row.data.requirement && { requirement: row.data.requirement },
          retention_time: {
            value: row.data.retention_time_value || "24",
            unit: retentionTimeUnit || createCode("h", "http://unitsofmeasure.org", "hours")
          },
          single_use: row.data.single_use !== void 0 ? row.data.single_use.toLowerCase() === "true" : true
        };
        const payload = {
          title: row.data.title,
          slug_value: slug,
          status: row.data.status || SpecimenDefinitionStatus.active,
          description: row.data.description ?? "",
          type_collected: typeCollected,
          patient_preparation: patientPreparation ? [patientPreparation] : [],
          ...collection && { collection },
          type_tested: typeTested
        };
        await request(`/api/v1/facility/${facilityId}/specimen_definition/`, {
          method: "POST",
          body: JSON.stringify(payload)
        });
        setResults(
          (prev) => prev ? {
            ...prev,
            processed: prev.processed + 1,
            created: prev.created + 1
          } : prev
        );
      } catch (error) {
        const reason = error instanceof Error ? error.message : "Unknown error";
        setResults(
          (prev) => prev ? {
            ...prev,
            processed: prev.processed + 1,
            failed: prev.failed + 1,
            failures: [
              ...prev.failures,
              { rowIndex: row.rowIndex, title: row.data.title, reason }
            ]
          } : prev
        );
      }
    }
    setCurrentStep("done");
  };
  if (currentStep === "upload") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-4xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-5 w-5" }),
          "Import Specimen Definitions from CSV"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Upload a CSV file to import specimen definitions." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-2 border-dashed border-gray-300 rounded-lg p-8 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "file",
              accept: ".csv",
              onChange: handleFileUpload,
              className: "hidden",
              id: "specimen-definition-upload"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "specimen-definition-upload",
              className: "cursor-pointer",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-12 w-12 text-gray-400" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-medium", children: "Click to upload CSV file" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", children: "or drag and drop" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-400", children: [
                  "Expected columns: ",
                  REQUIRED_HEADERS$1.join(", "),
                  "."
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-400", children: [
                  "Optional columns: ",
                  OPTIONAL_HEADERS$1.join(", "),
                  "."
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: downloadSample, children: "Download Sample CSV" })
              ] })
            }
          )
        ] }),
        uploadError && /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { className: "mt-4", variant: "destructive", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { children: uploadError })
        ] })
      ] })
    ] }) });
  }
  if (currentStep === "review") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Specimen Definition Import Wizard" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Review and validate specimen definitions before importing." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: 100, className: "h-2" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold mb-4", children: "Review All Specimen Definitions" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-gray-200 rounded-lg overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-80 overflow-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "min-w-full text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-gray-50 text-gray-600", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2 text-left", children: "Row" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2 text-left", children: "Title" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2 text-left", children: "Type Collected" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2 text-left", children: "Status" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: processedRows.map((row) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "tr",
              {
                className: "border-t border-gray-100",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-gray-500", children: row.rowIndex }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2", children: row.data.title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2", children: row.data.type_collected_display || "-" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2", children: row.errors.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-600", children: "Valid" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-600", children: row.errors.join("; ") }) })
                ]
              },
              row.rowIndex
            )) })
          ] }) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            className: "mt-4",
            onClick: runImport,
            disabled: summary.valid === 0,
            children: "Start Import"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            onClick: () => setCurrentStep("upload"),
            children: "Back"
          }
        ) })
      ] })
    ] }) });
  }
  if (currentStep === "importing") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-4xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Importing Specimen Definitions" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { children: [
        results?.processed ?? 0,
        "/",
        summary.valid,
        " processed"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Progress,
        {
          value: summary.valid ? (results?.processed ?? 0) / summary.valid * 100 : 0,
          className: "h-2"
        }
      ) })
    ] }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-4xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Specimen Definition Import Complete" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { children: [
        "Created: ",
        results?.created ?? 0,
        " · Failed: ",
        results?.failed ?? 0
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
      results && results.failures.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { className: "mb-4", variant: "destructive", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { children: results.failures.slice(0, 5).map((failure) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          "Row ",
          failure.rowIndex,
          ": ",
          failure.reason
        ] }, `${failure.rowIndex}-${failure.title}`)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setCurrentStep("upload"), children: "Import Another File" }) })
    ] })
  ] }) });
}

const REQUIRED_HEADERS = [
  "userType",
  "prefix",
  "firstName",
  "lastName",
  "email",
  "phoneNumber",
  "gender",
  "password",
  "username"
];
const OPTIONAL_HEADERS = ["geoOrganization"];
const NORMALIZED_HEADER_MAP = [
  ...REQUIRED_HEADERS,
  ...OPTIONAL_HEADERS
].reduce(
  (acc, header) => {
    acc[normalizeHeader$1(header)] = header;
    return acc;
  },
  {}
);
const GENDERS = ["male", "female", "transgender", "non_binary"];
function normalizeHeader$1(header) {
  return header.toLowerCase().replace(/[^a-z0-9]/g, "");
}

const {useMemo,useState} = await importShared('react');

function UsersImportPage() {
  const [currentStep, setCurrentStep] = useState("upload");
  const [uploadError, setUploadError] = useState("");
  const [processedRows, setProcessedRows] = useState([]);
  const [results, setResults] = useState(null);
  const summary = useMemo(() => {
    const valid = processedRows.filter((row) => row.errors.length === 0).length;
    const invalid = processedRows.length - valid;
    return { total: processedRows.length, valid, invalid };
  }, [processedRows]);
  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      setUploadError("Please upload a valid CSV file");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvText = e.target?.result;
        const { headers, rows } = parseCsvText(csvText);
        if (headers.length === 0) {
          setUploadError("CSV is empty or missing headers");
          return;
        }
        const headerMap = buildHeaderMap(headers);
        const missingHeaders = REQUIRED_HEADERS.filter(
          (header) => headerMap[header] === void 0
        );
        if (missingHeaders.length > 0) {
          setUploadError(
            `Missing required headers: ${missingHeaders.join(", ")}`
          );
          return;
        }
        const processed = rows.map(
          (row, index) => processRow(row, index + 2, headerMap)
        );
        setUploadError("");
        setProcessedRows(processed);
        setCurrentStep("review");
      } catch (error) {
        setUploadError("Error processing CSV file");
      }
    };
    reader.readAsText(file);
  };
  const runImport = async () => {
    const rowsToImport = processedRows.filter((row) => row.errors.length === 0);
    if (rowsToImport.length === 0) {
      setResults({
        processed: 0,
        created: 0,
        skipped: 0,
        failed: 0,
        failures: []
      });
      setCurrentStep("done");
      return;
    }
    setCurrentStep("importing");
    setResults({
      processed: 0,
      created: 0,
      skipped: 0,
      failed: 0,
      failures: []
    });
    for (const row of rowsToImport) {
      const normalized = row.normalized;
      if (!normalized) continue;
      try {
        const existingUser = await fetchUser(normalized.username);
        if (existingUser) {
          setResults(
            (prev) => prev ? {
              ...prev,
              processed: prev.processed + 1,
              skipped: prev.skipped + 1
            } : prev
          );
          continue;
        }
        await createUser(normalized);
        setResults(
          (prev) => prev ? {
            ...prev,
            processed: prev.processed + 1,
            created: prev.created + 1
          } : prev
        );
      } catch (error) {
        const reason = error instanceof Error ? error.message : "Unknown error";
        setResults(
          (prev) => prev ? {
            ...prev,
            processed: prev.processed + 1,
            failed: prev.failed + 1,
            failures: [
              ...prev.failures,
              {
                rowIndex: row.rowIndex,
                username: normalized.username,
                reason
              }
            ]
          } : prev
        );
      }
    }
    setCurrentStep("done");
  };
  const downloadSample = () => {
    const sampleCSV = `userType,prefix,firstName,lastName,email,phoneNumber,gender,geoOrganization,username,password
staff,Mr.,John,Doe,john.doe@example.com,9876543210,male,,john_doe,P@ssw0rd
nurse,Ms.,Jane,Smith,jane.smith@example.com,9876501234,female,,jane_smith,P@ssw0rd`;
    const blob = new Blob([sampleCSV], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample_users_import.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };
  const downloadFailures = () => {
    if (!results || results.failures.length === 0) return;
    const failureCsv = [
      "rowIndex,username,reason",
      ...results.failures.map(
        (failure) => [failure.rowIndex, failure.username ?? "", failure.reason].map((value) => `"${String(value).replace(/"/g, '"')}"`).join(",")
      )
    ].join("\n");
    const blob = new Blob([failureCsv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users_import_failures.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };
  if (currentStep === "upload") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-4xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-5 w-5" }),
          "Import Users from CSV"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Upload a CSV file to create new users. Existing users will be skipped." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-2 border-dashed border-gray-300 rounded-lg p-8 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "file",
              accept: ".csv",
              onChange: handleFileUpload,
              className: "hidden",
              id: "users-csv-upload"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "users-csv-upload", className: "cursor-pointer", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-12 w-12 text-gray-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-medium", children: "Click to upload CSV file" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", children: "or drag and drop" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: "Expected columns: userType, prefix, firstName, lastName, email, phoneNumber, gender, username, password" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 mt-2", children: "User types can be doctor, staff, nurse, volunteer, administrator." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: downloadSample, children: "Download Sample CSV" })
          ] }) })
        ] }),
        uploadError && /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { className: "mt-4", variant: "destructive", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { children: uploadError })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 p-4 bg-gray-50 rounded-lg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-medium text-sm mb-2", children: "Valid User Types:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: ["doctor", "staff", "nurse", "volunteer", "administrator"].map(
            (type) => /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: type }, type)
          ) })
        ] })
      ] })
    ] }) });
  }
  if (currentStep === "review") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Users Import Wizard" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Review and validate users before importing" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: 100, className: "h-2" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold mb-4", children: "Review All Users" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-gray-200 rounded-lg overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-80 overflow-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "min-w-full text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-gray-50 text-gray-600", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2 text-left", children: "Row" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2 text-left", children: "Username" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2 text-left", children: "Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2 text-left", children: "User Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2 text-left", children: "Status" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: processedRows.map((row) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "tr",
              {
                className: "border-t border-gray-100",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-gray-500", children: row.rowIndex }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2", children: row.normalized?.username || "—" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2", children: row.normalized ? `${row.normalized.firstName} ${row.normalized.lastName}` : "—" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2", children: row.normalized?.userType ?? "—" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2", children: row.errors.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-600", children: "Valid" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-600", children: row.errors.join("; ") }) })
                ]
              },
              row.rowIndex
            )) })
          ] }) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            className: "mt-4",
            onClick: runImport,
            disabled: summary.valid === 0,
            children: "Start Import"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            onClick: () => setCurrentStep("upload"),
            children: "Back"
          }
        ) })
      ] })
    ] }) });
  }
  if (currentStep === "importing") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-4xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Importing Users" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { children: [
        results?.processed ?? 0,
        "/",
        summary.valid,
        " processed"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Progress,
        {
          value: summary.valid ? (results?.processed ?? 0) / summary.valid * 100 : 0,
          className: "h-2"
        }
      ) })
    ] }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-4xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Users Import Complete" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { children: [
        "Created: ",
        results?.created ?? 0,
        " · Skipped: ",
        results?.skipped ?? 0,
        " ",
        "· Failed: ",
        results?.failed ?? 0
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
      results && results.failures.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { className: "mb-4", variant: "destructive", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { children: results.failures.slice(0, 5).map((failure) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          "Row ",
          failure.rowIndex,
          ": ",
          failure.reason
        ] }, `${failure.rowIndex}-${failure.username}`)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
        results && results.failures.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: downloadFailures, children: "Download Failure Report" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setCurrentStep("upload"), children: "Import Another File" })
      ] })
    ] })
  ] }) });
}
function normalizeHeader(header) {
  return header.toLowerCase().replace(/[^a-z0-9]/g, "");
}
function buildHeaderMap(headers) {
  const headerMap = {};
  headers.forEach((header, index) => {
    const normalized = normalizeHeader(header);
    const mapped = NORMALIZED_HEADER_MAP[normalized];
    if (mapped) {
      headerMap[mapped] = index;
    }
  });
  return headerMap;
}
function processRow(row, rowIndex, headerMap) {
  const raw = Object.entries(headerMap).reduce((acc, [header, index]) => {
    acc[header] = row[index] ?? "";
    return acc;
  }, {});
  const errors = [];
  REQUIRED_HEADERS.forEach((header) => {
    if (!raw[header]?.trim()) {
      errors.push(`Missing ${header}`);
    }
  });
  const gender = raw.gender?.trim().toLowerCase();
  if (gender && !GENDERS.includes(gender)) {
    errors.push(`Invalid gender: ${raw.gender}`);
  }
  const userType = raw.userType?.trim().toLowerCase();
  const username = raw.username?.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "_");
  if (!username) {
    errors.push("Invalid username");
  }
  return {
    rowIndex,
    raw,
    errors,
    normalized: errors.length > 0 ? null : {
      userType: userType ?? "",
      prefix: raw.prefix?.trim() ?? "",
      firstName: raw.firstName?.trim() ?? "",
      lastName: raw.lastName?.trim() ?? "",
      email: raw.email?.trim() ?? "",
      phoneNumber: raw.phoneNumber?.trim() ?? "",
      gender,
      geoOrganization: raw.geoOrganization?.trim() || void 0,
      username: username ?? "",
      password: raw.password?.trim() ?? ""
    }
  };
}
async function fetchUser(username) {
  try {
    return await request(`/api/v1/users/${username}/`, {
      method: "GET"
    });
  } catch (error) {
    if (error instanceof Error && "status" in error) {
      const status = error.status;
      if (status === 404) {
        return null;
      }
    }
    throw error;
  }
}
async function createUser(user) {
  const phoneNumber = user.phoneNumber.startsWith("+") ? user.phoneNumber : `+91${user.phoneNumber}`;
  const payload = {
    user_type: user.userType,
    username: user.username,
    email: user.email,
    first_name: user.firstName,
    last_name: user.lastName,
    gender: user.gender,
    password: user.password,
    phone_number: phoneNumber,
    geo_organization: user.geoOrganization
  };
  return await request("/api/v1/users/", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

const {Redirect} = await importShared('raviger');
const renderImportsPage = (activeTab, content) => /* @__PURE__ */ jsxRuntimeExports.jsx(ImportsLayout, { activeTab, children: content });
const routes = {
  "/admin/import": () => /* @__PURE__ */ jsxRuntimeExports.jsx(Redirect, { to: "/admin/import/users" }),
  "/admin/import/users": () => renderImportsPage("users", /* @__PURE__ */ jsxRuntimeExports.jsx(UsersImportPage, {})),
  "/admin/import/departments": () => renderImportsPage("departments", /* @__PURE__ */ jsxRuntimeExports.jsx(DepartmentImport, {})),
  "/admin/import/link-users": () => renderImportsPage("link-users", /* @__PURE__ */ jsxRuntimeExports.jsx(LinkUsersImport, {})),
  "/admin/import/locations": () => renderImportsPage("locations", /* @__PURE__ */ jsxRuntimeExports.jsx(LocationImport, {})),
  "/admin/import/charge-item-definition": () => renderImportsPage("charge-item-definition", /* @__PURE__ */ jsxRuntimeExports.jsx(ChargeItemDefinitionImport, {})),
  "/admin/import/product-knowledge": () => renderImportsPage("product-knowledge", /* @__PURE__ */ jsxRuntimeExports.jsx(ProductKnowledgeImport, {})),
  "/admin/import/specimen-definitions": () => renderImportsPage("specimen-definitions", /* @__PURE__ */ jsxRuntimeExports.jsx(SpecimenDefinitionImport, {}))
};

const React = await importShared('react');
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
      icon: React.createElement(Upload, { className: "size-4" })
    }
  ],
  encounterTabs: {}
};

export { manifest as default };
