# Care Import

A plug-in for [Care](https://github.com/ohcnetwork/care_fe) that helps hospital administrators set up their facility by importing data from spreadsheets (CSV files). You can import users, departments, locations, medications, lab tests, and more — all through a simple upload-and-review workflow.

No engineering skills are required. Prepare your CSV in Excel or Google Sheets, save it as `.csv`, upload it, review the preview, and click Import.

---

## Table of Contents

- [Scripts](#scripts)
- [How It Works](#how-it-works)
- [Recommended Import Order](#recommended-import-order)
- [What Is a Slug?](#what-is-a-slug)
- [Import Guides](#import-guides)
  - [1. Users](#1-users)
  - [2. Departments](#2-departments)
  - [3. Link Users to Departments](#3-link-users-to-departments)
  - [4. Charge Item Definitions](#4-charge-item-definitions)
  - [5. Locations](#5-locations)
  - [6. Product Knowledge](#6-product-knowledge)
  - [7. Products](#7-products)
  - [8. Specimen Definitions](#8-specimen-definitions)
  - [9. Observation Definitions](#9-observation-definitions)
  - [10. Activity Definitions](#10-activity-definitions)
- [CSV Upload vs Dataset Import](#csv-upload-vs-dataset-import)
- [Exports](#exports)

---

## Scripts

```bash
npm run start   # builds and serves preview on port 5273
npm run build   # production build
npm run preview # preview the build
```

---

## How It Works

Every import follows the same three-step flow:

1. **Upload** — Pick a CSV file from your computer and upload it.
2. **Review** — The system validates every row and shows you a preview. Valid rows are marked green, invalid rows are marked red with a clear reason (e.g. "Missing name", "Invalid type").
3. **Import** — Click the import button. Only valid rows are sent. You get a final summary: how many were created, skipped, or failed.

Each import screen also has a **Download Sample CSV** button so you can see the exact format expected.

---

## Recommended Import Order

Some imports depend on data from earlier imports. You can import in any order, but if something is missing, the system will tell you. The safest sequence is:

1. **Users** — Create staff accounts first.
2. **Departments** — Set up your department structure.
3. **Link Users to Departments** — Assign staff to departments with roles. _(Needs users and departments to exist.)_
4. **Charge Item Definitions** — Define billable items and their prices.
5. **Locations** — Set up buildings, wards, rooms, and beds.
6. **Product Knowledge** — Define your medication and consumable catalogue.
7. **Products** — Add inventory items to your facility. _(Needs product knowledge to exist; optionally links to charge items.)_
8. **Specimen Definitions** — Define specimen/sample types (e.g. whole blood, urine).
9. **Observation Definitions** — Define lab observations with reference ranges (e.g. Hemoglobin, Blood Sugar).
10. **Activity Definitions** — Define orderable activities like lab tests and imaging. _(Needs specimen definitions, observation definitions, charge items, and locations to exist.)_

> If a required dependency is missing, the import will **fail with a clear error message** rather than silently creating broken data.

---

## What Is a Slug?

Several imports ask for a `slug_value` column. A slug is simply a **short, unique ID** you assign to an item. Think of it like a code name.

**Why do you need it?** The system uses slugs to identify records. If you import the same CSV again, the slug tells the system "this is the same item" so it can update it instead of creating a duplicate.

**Rules for slugs:**

- Use only **lowercase letters** (`a` through `z`), **digits** (`0` through `9`), **hyphens** (`-`), and **underscores** (`_`)
- **No spaces** — use hyphens or underscores instead
- **No uppercase letters** — write `consultation-fee`, not `Consultation-Fee`
- **No special characters** — no periods, commas, slashes, question marks, `@`, `#`, etc.
- Each slug must be **unique** within the same CSV file

**Good examples:**

- `consultation-fee` ✅
- `bed_charges` ✅
- `cbc-panel` ✅
- `paracetamol-500mg` ✅

**Bad examples:**

- `Consultation Fee` ❌ (uppercase + spaces)
- `bed.charges` ❌ (period not allowed)
- `cbc panel` ❌ (space not allowed)
- `price@100` ❌ (`@` not allowed)

> **Tip:** A simple approach is to take the item name, make it lowercase, and replace spaces with hyphens. "Complete Blood Count" becomes `complete-blood-count`.

---

## Import Guides

### 1. Users

Upload a CSV to create staff accounts. If a user with the same username already exists, that row is **skipped** (never overwritten).

**Required columns:**

- `userType` — One of: `doctor`, `staff`, `nurse`, `volunteer`, `administrator`
- `prefix` — e.g. `Mr.`, `Ms.`, `Dr.`
- `firstName` — First name
- `lastName` — Last name
- `email` — Email address
- `phoneNumber` — Phone number (`+91` is added automatically)
- `gender` — One of: `male`, `female`, `transgender`, `non_binary`
- `username` — Login username (will be lowercased automatically; special characters are replaced with underscores)
- `password` — Initial password

**Optional columns:**

- `geoOrganization` — Geographic organization to associate the user with

**What happens during import:**

- If a username already exists in the system, that row is skipped
- Usernames are cleaned up: lowercased, and characters like spaces or `@` are replaced with `_`
- After import, you can download a failure report listing any rows that couldn't be created

> **Note:** Make sure there are no spaces in username. If there is a space ex: `abhilash thtn`, the username will be created as `abhilash_thtn`

**Sample CSV:**

```csv
userType,prefix,firstName,lastName,email,phoneNumber,gender,username,password
doctor,Dr.,Priya,Sharma,priya.sharma@hospital.com,9876543210,female,priya_sharma,Welcome@123
nurse,Ms.,Anita,Rao,anita.rao@hospital.com,9876501234,female,anita_rao,Welcome@123
```

---

### 2. Departments

Upload a CSV to create your department hierarchy. Parents and children are resolved automatically — you don't need to worry about row order.

**Required columns:**

- `name` — Department name (also accepts `department` as column name)
- `parent` — Name of the parent department (also accepts `parentDepartment`). Leave **blank** for top-level departments.

**What happens during import:**

- Parent departments are created before their children, even if the parent row appears later in the file
- If a top-level department with that name already exists, it is reused (not duplicated)
- Duplicate rows (same name under same parent) are flagged and skipped
- Circular references (a department that is its own ancestor) are caught and reported

**Sample CSV:**

```csv
name,parent
Medicine,
Cardiology,Medicine
Cardiac ICU,Cardiology
Surgery,
Orthopaedics,Surgery
```

This creates:

```
Medicine
├── Cardiology
│   └── Cardiac ICU
Surgery
└── Orthopaedics
```

---

### 3. Link Users to Departments

Upload a CSV to assign existing users to existing departments with specific roles. A single row can link one user to **multiple departments**.

**Required columns:**

- `username` — The username of an existing user
- `role` — Role name. For multiple roles in one row, use comma-separated values inside quotes: `"Doctor-KA, Technician-KA"`
- `department` — Department name. For multiple departments in one row, use comma-separated values inside quotes: `"Surgery, Dental"`

**Important:** When listing multiple roles and departments, the counts must match. The first role is paired with the first department, the second role with the second department, and so on.

**What happens during import:**

- Each username is checked against existing users. If not found, the row is marked as "user not found"
- Each role and department name is matched (case-insensitive) against what exists in the system
- If a user is already linked to a department with that role, the row is marked "already exists" (not an error)
- If the same username appears twice in the CSV, the second row is flagged as a duplicate

**Sample CSV:**

```csv
username,role,department
priya_sharma,Doctor-KA,Cardiology
anita_rao,"Technician-KA, Nurse-KA","Cardiology, Cardiac ICU"
```

**Note:** Users can have multiple roles and departments associated with them. In that case, please "comma seperate" the roles and departments within that cell as shown above.

## Additionally there is an extensive review to verify all details before importing.

### 4. Charge Item Definitions

Upload a CSV to define billable items (consultation fees, bed charges, procedure costs, etc.) under a **category**.

Before uploading, you must type a **Category Title** into the text field on the screen (e.g. "Consultation Charges", "Lab Fees"). If this category doesn't exist yet, it is created automatically.

**Required columns:**

- `title` — Display name of the charge item (e.g. "Doctor Consultation")
- `slug_value` — A unique short ID for this item (see [What Is a Slug?](#what-is-a-slug))
- `description` — Brief description
- `purpose` — What the charge is for
- `price` — Base price as a number (e.g. `250`, `1500.50`)

**What happens during import:**

- If a charge item with the same slug already exists, it is **updated** with the new data
- If it doesn't exist, it is **created**
- The category you entered is created automatically if it's new
- Duplicate slugs within the same CSV are flagged as errors

**Sample CSV:**

```csv
title,slug_value,description,purpose,price
Doctor Consultation,doctor-consultation,OPD consultation fee,Outpatient consultation,500
ICU Bed (per day),icu-bed-daily,Daily ICU bed charge,ICU admission,3500
Dressing,dressing-basic,Basic wound dressing,Minor procedures,150
```

---

### 5. Locations

Upload a CSV to create your facility's physical layout: buildings, wings, wards, rooms, and beds. The hierarchy is defined by the column structure of the CSV itself.

**How the CSV works:**

Every **3 columns** represent one level of the hierarchy:

1. Location name
2. Location type (e.g. `building`, `ward`, `room`, `bed`)
3. Description

You repeat this pattern for each level of nesting. The **last column** can optionally be `department` — the name(s) of departments to associate with that location (comma or semicolon separated).

**Valid location types:** `bed`, `building`, `cabinet`, `corridor`, `house`, `jurisdiction`, `level`, `road`, `room`, `site`, `vehicle`, `virtual`, `ward`, `wing`

**What happens during import:**

- Rows that start with the same location names are merged — you won't get duplicate buildings
- Beds are created as physical instances; everything else is created as a category/kind
- Departments are linked to locations (except buildings, wings, and levels which don't get department links)
- All locations start as "active" and "unoccupied"

**Sample CSV:**

```csv
Building,type,description,Ward,type,description,Bed,type,description,department
Main Block,building,Main hospital building,ICU,ward,Intensive Care Unit,Bed 1,bed,ICU Bed 1,Critical Care
Main Block,building,Main hospital building,ICU,ward,Intensive Care Unit,Bed 2,bed,ICU Bed 2,Critical Care
Main Block,building,Main hospital building,General Ward,ward,General admission ward,Bed A1,bed,General bed,Medicine
```

---

### 6. Product Knowledge

Import your medication and consumable catalogue — the "knowledge base" of products your facility can stock.

This can be done via CSV upload or by loading a pre-built dataset (if one is configured for your deployment).

**Required columns (in this exact order):**

1. `resourceCategory` — Category name (e.g. `Medication`, `Consumable`)
2. `slug` — Unique short ID (see [What Is a Slug?](#what-is-a-slug))
3. `name` — Product name (e.g. "Paracetamol 500mg Tablet")
4. `productType` — One of: `medication`, `consumable`, `nutritional_product`
5. `codeDisplay` — SNOMED description (optional, leave blank if unknown)
6. `codeValue` — SNOMED code (optional, leave blank if unknown)
7. `baseUnitDisplay` — Unit of measure. Must be one of: `tablets`, `capsules`, `milliliter`, `milligram`, `gram`, `microgram`, `liter`, `international unit`, `count`, `drop`, `milligram per milliliter`

**Optional columns (continuing in order):**

8. `dosageFormDisplay` — Dosage form name (e.g. "tablet", "solution for injection")
9. `dosageFormCode` — SNOMED code for the dosage form
10. `routeCode` — Route of administration code(s), comma-separated for multiple
11. `routeDisplay` — Route name(s), comma-separated for multiple (e.g. "Oral route, Respiratory tract route")
12. `alternateIdentifier` — An alternate ID if needed
13. `alternateNameType` — One of: `trade_name`, `alias`, `original_name`, `preferred`
14. `alternateNameValue` — The alternate name

**What happens during import:**

- Each slug must be unique in the CSV
- If importing from a pre-built dataset, you can **select individual items** you need (you don't have to import everything)
- Products that already exist (by slug) are identified so you know what's new vs. already in the system

**Sample CSV:**

```csv
resourceCategory,slug,name,productType,codeDisplay,codeValue,baseUnitDisplay,dosageFormDisplay,dosageFormCode,routeCode,routeDisplay,alternateIdentifier,alternateNameType,alternateNameValue
Medication,paracetamol-500mg,Paracetamol 500mg Tablet,medication,,,,tablet,385055001,26643006,Oral route,,,
Consumable,surgical-gloves-m,Surgical Gloves (Medium),consumable,,,count,,,,,,,,
```

---

### 7. Products

This is the **inventory import** — it adds actual stocked items to your facility. This is the most powerful import because it can **automatically create** supporting records (product knowledge and charge items) if they don't already exist.

**Required columns:**

- `name` — Product display name (e.g. "Paracetamol 500mg")
- `type` — Either `medication` or `consumable`

**Optional columns:**

- `basePrice` — The price to charge for this item. If provided, a charge item definition will be created or linked automatically.
- `inventoryQuantity` — How many units you have in stock (defaults to 0)
- `dosageForm` — Dosage form (e.g. "tablet", "capsule"). Used if the system needs to create a new product knowledge entry.
- `lot_number` — Batch/lot number for this stock
- `expiration_date` — Expiration date (e.g. `2027-12-31`)
- `product_knowledge_name` — Name of an existing product knowledge entry to link to. If omitted, the system looks for one matching the `name` column.
- `charge_item_definition_name` — Name of an existing charge item to link to. If omitted, the system looks for one matching the `name` column.
- `product_knowledge_slug` — Slug of an existing product knowledge entry. Use this for an exact match instead of name-based search. **Also required if you want the system to create a new product knowledge entry.**
- `charge_item_definition_slug` — Slug of an existing charge item definition. Use this for an exact match. **Also required if you want the system to create a new charge item definition.**

#### How Names and Slugs Work Together

The product import tries to find existing product knowledge and charge item definitions to link to. Here's how it decides:

**Finding product knowledge:**

- If you provide `product_knowledge_slug`, the system looks for an exact match by that slug. If found, it uses it. If not found, **the row fails** — a slug-based lookup must match.
- If you provide `product_knowledge_name` (but no slug), the system searches by name. If found, it uses it. If **not** found, the system **automatically creates a new product knowledge entry** for you. The slug is generated automatically from the name — you don't need to worry about it.
- If you provide neither name nor slug, the system searches using the `name` column instead. Same rules apply — if nothing is found, a new entry is created automatically.

**Finding or creating charge item definitions:**

- If you provide `charge_item_definition_slug`, the system looks for an exact match. If found, it uses it. If not found, **the row fails**.
- If you provide `charge_item_definition_name` (but no slug), the system searches by name. If found, it uses it. If not found and you've provided a `basePrice`, the system **automatically creates a new charge item definition** with an auto-generated slug.
- If you only provide `basePrice` without any name or slug, a new charge item is created using the product `name` as its title. The slug is generated automatically.
- If you provide no charge item name, no slug, and no price, that's fine — the product just won't have a billing item linked to it.

**In short:**

- **Slug columns** are for exact lookups. If you provide a slug and it doesn't match anything, the row fails. Use these when you know the exact slug of an existing record.
- **Name columns** are more forgiving. The system searches by name, and if nothing is found, it creates the record for you automatically.
- If you don't provide a name or slug at all, the product's own `name` is used to search.
- You need a **basePrice** if you want a charge item to be created.

**What gets auto-created:**

- **Product knowledge** — Created automatically if no existing match is found by name. The slug is generated for you. (Only fails if you provided a specific `product_knowledge_slug` that doesn't exist.)
- **Charge item definitions** — Created automatically if no existing match is found and a `basePrice` is given. The slug is generated for you. (Only fails if you provided a specific `charge_item_definition_slug` that doesn't exist.)
- **Resource categories** — Categories like "Medicines" and "Consumables" are created automatically based on the product type

**Review step:** Before the actual import starts, the system checks all your references and shows you warnings like "Product knowledge not found — will be created during import" or errors like "Product knowledge slug not found" so you know exactly what will happen.

**Sample CSV:**

```csv
name,type,basePrice,inventoryQuantity,dosageForm,lot_number,expiration_date,product_knowledge_name,charge_item_definition_name,product_knowledge_slug,charge_item_definition_slug
Paracetamol 500mg,medication,12.50,500,tablet,LOT-2026-A,2027-12-31,,,paracetamol-500mg,paracetamol-charge
Surgical Gloves (M),consumable,,200,,,,,,surgical-gloves-m,
IV Normal Saline 500ml,medication,45,100,solution,LOT-NS-001,2027-06-30,,,iv-ns-500ml,iv-ns-charge
```

In this example:

- **Paracetamol 500mg** — Will look for product knowledge with slug `paracetamol-500mg`. If not found, creates it. Will also create a charge item with slug `paracetamol-charge` at price ₹12.50.
- **Surgical Gloves (M)** — Will look for product knowledge with slug `surgical-gloves-m`. No charge item (no price given).
- **IV Normal Saline** — Same pattern as Paracetamol.

---

### 8. Specimen Definitions

Import definitions for specimen/sample types used in lab workflows (e.g. whole blood, serum, urine).

This can be done via CSV upload or by loading a pre-built dataset.

**Required columns:**

- `title` — Specimen name (e.g. "Whole Blood")
- `slug_value` — Unique short ID (see [What Is a Slug?](#what-is-a-slug))
- `description` — Brief description
- `type_collected_system` — Coding system for the specimen type (e.g. `http://snomed.info/sct`)
- `type_collected_code` — Code for the specimen type
- `type_collected_display` — Display name for the specimen type

**Optional columns:**

- `derived_from_uri` — A URL this definition is derived from (must be a valid web address)
- `collection_system`, `collection_code`, `collection_display` — How the specimen is collected (if you fill in any one of these three, you must fill in all three)
- `is_derived` — Is this a derived specimen? (`true` or `false`)
- `preference` — `preferred` or `alternate`
- `single_use` — Single-use container? (`true` or `false`)
- `requirement` — Special requirements text
- `retention_value`, `retention_unit_system`, `retention_unit_code`, `retention_unit_display` — How long the specimen is retained (all four required together)
- `container_description` — Description of the container
- `container_capacity_value`, `container_capacity_unit_system`, `container_capacity_unit_code`, `container_capacity_unit_display` — Container capacity (all four required together)
- `container_minimum_volume_quantity_value`, `..._unit_system`, `..._unit_code`, `..._unit_display` — Minimum volume as a quantity
- `container_minimum_volume_string` — Minimum volume as free text (use either this or the quantity fields, not both)
- `container_cap_system`, `container_cap_code`, `container_cap_display` — Container cap type
- `container_preparation` — Preparation instructions

**What happens during import:**

- Code fields always come in groups of three (system, code, display). If you fill in one, you must fill in all three.
- Quantity fields come in groups of four (value, unit system, unit code, unit display). Same rule applies.
- You cannot provide both a minimum volume quantity and a minimum volume string — pick one.
- When importing from a pre-built dataset, you can select individual items.

---

### 9. Observation Definitions

Import lab observation definitions (e.g. Hemoglobin, Fasting Blood Sugar) complete with reference ranges, normal values, and gender/age-specific interpretations.

This import uses **two CSV files** instead of one:

1. **Definitions file** — One row per observation (e.g. "Complete Blood Count", "Fasting Blood Sugar")
2. **Components file** — Multiple rows per observation, defining individual measurements and their reference ranges (e.g. Hemoglobin ranges for males, females, children)

The system automatically figures out which file is which — the components file has an `observation_slug` column, the definitions file does not.

#### Definitions CSV — Required columns:

- `title` — Observation name (e.g. "Complete Blood Count")
- `slug_value` — Unique short ID
- `description` — Brief description
- `category` — One of: `social_history`, `vital_signs`, `imaging`, `laboratory`, `procedure`, `survey`, `exam`, `therapy`, `activity`
- `permitted_data_type` — One of: `boolean`, `decimal`, `integer`, `dateTime`, `time`, `string`, `quantity`
- `code_system` — Coding system (e.g. `http://loinc.org`)
- `code_value` — Code (e.g. `58410-2`)
- `code_display` — Display name

#### Definitions CSV — Optional columns:

- `status` — `draft`, `active`, `retired`, or `unknown` (defaults to `active`)
- `body_site_system`, `body_site_code`, `body_site_display` — Body site (all three required together)
- `method_system`, `method_code`, `method_display` — Method (all three required together)
- `permitted_unit_system`, `permitted_unit_code`, `permitted_unit_display` — Unit of measure (all three required together)
- `derived_from_uri` — Source URL

#### Components CSV — Required columns:

- `observation_slug` — Links this row to a definition by matching its `slug_value`
- `code_value` — Component code (e.g. `LP32067-8` for Hemoglobin)
- `code_display` — Component display name (e.g. "Hemoglobin")

#### Components CSV — Optional columns:

- `code_system` — Component coding system
- `permitted_data_type` — Data type for this component
- `unit_system`, `unit_code`, `unit_display` — Unit of measure
- `age_min`, `age_max` — Age range for this reference range (e.g. `12`, `18`)
- `age_op` — Age unit: `years`, `months`, or `days`
- `gender` — `male` or `female` (leave blank for ranges that apply to everyone)
- `range_display` — Interpretation label (e.g. `Low`, `Normal`, `High`)
- `range_min`, `range_max` — Numeric bounds for this interpretation

#### How the two files work together

The components file contains multiple rows per observation. They are grouped like this:

- All rows with the same `observation_slug` + `code_value` form one **component** (e.g. all the Hemoglobin rows for "Complete Blood Count")
- Within a component, rows with the same age/gender conditions form one **reference range set** (e.g. "males aged 12-18")
- Each row within that set is one **interpretation band** (Low, Normal, High)

This means you can have something like:

- Hemoglobin → Males 12-18 → Low (below 12), Normal (12-16), High (above 16)
- Hemoglobin → Females 12-18 → Low (below 14), Normal (14-18), High (above 18)

All defined clearly in a flat CSV without any JSON.

**What happens during import:**

- If an observation with the same slug already exists, it is **updated**
- When importing from a pre-built dataset, you can select individual observations

---

### 10. Activity Definitions

Import orderable clinical activities — lab tests, imaging orders, surgical procedures, counselling sessions, etc.

This is the most **dependency-heavy** import. Activity definitions reference many other types of records, so those records must exist first.

This can be done via CSV upload or by loading a pre-built dataset.

**Required columns:**

- `title` — Activity name (e.g. "Complete Blood Count")
- `slug_value` — Unique short ID
- `description` — Brief description
- `usage` — Usage instructions (e.g. "Order CBC for baseline evaluation")
- `classification` — One of: `laboratory`, `imaging`, `surgical_procedure`, `counselling`
- `category_name` — Category name (e.g. "Hematology", "Radiology")
- `code_system` — Coding system (defaults to `http://snomed.info/sct` if you leave it blank)
- `code_value` — Code value
- `code_display` — Display name

**Optional columns:**

- `status` — `draft`, `active`, `retired`, or `unknown` (defaults to `active`)
- `kind` — Defaults to `service_request`
- `specimen_slugs` — Comma-separated slugs of specimen definitions this activity requires (e.g. `whole-blood, urine`)
- `observation_slugs` — Comma-separated slugs of observation definitions this activity produces (e.g. `hemoglobin, platelet-count`)
- `charge_item_slugs` — Comma-separated slugs of charge item definitions for billing
- `charge_item_price` — Price (used in the dataset import flow to auto-create charge items)
- `location_names` — Comma-separated names of locations where this activity can be performed (e.g. `Main Lab, Satellite Lab`)
- `healthcare_service_name` — Name of the healthcare service this activity belongs to
- `diagnostic_report_system`, `diagnostic_report_code`, `diagnostic_report_display` — Diagnostic report codes (comma-separated if multiple)
- `derived_from_uri` — Source URL
- `body_site_system`, `body_site_code`, `body_site_display` — Body site (all three required together)

**What gets validated before import:**

- Every slug in `specimen_slugs` is checked — if a specimen definition with that slug doesn't exist, you get an error
- Every slug in `observation_slugs` is checked against existing observation definitions
- Every slug in `charge_item_slugs` is checked against existing charge item definitions
- Every name in `location_names` is checked against existing facility locations
- The `healthcare_service_name` is checked against existing healthcare services

**Importing from a pre-built dataset adds extra steps:**

- You can **select individual activities** to import (not everything in the dataset)
- Each `category_name` in the CSV must be mapped to an existing **healthcare service** in your facility
- Charge item definitions are matched by the activity title. If no match is found and `charge_item_price` is provided, a new charge item is **created automatically**

**Sample CSV:**

```csv
title,slug_value,description,usage,classification,category_name,code_system,code_value,code_display,specimen_slugs,observation_slugs,charge_item_slugs,location_names,healthcare_service_name
Complete Blood Count,complete-blood-count,CBC with differential,Order CBC for baseline evaluation,laboratory,Hematology,http://snomed.info/sct,26604007,Complete blood count,whole-blood,"hemoglobin,platelet-count",cbc-charge,Main Lab,General Medicine
Chest X-Ray PA,chest-xray-pa,PA view chest radiograph,Chest X-ray for screening,imaging,Radiology,http://snomed.info/sct,399208008,Chest X-ray PA,,,chest-xray-charge,Radiology Suite,Radiology
```

---

## CSV Upload vs Dataset Import

Four import types support **two ways** to get data in:

- **Product Knowledge**
- **Specimen Definitions**
- **Observation Definitions**
- **Activity Definitions**

For these, the import screen shows two options:

- **Upload CSV** — Prepare your own file and upload it
- **Import from Dataset** — Load a pre-built, curated dataset and pick the items your facility needs

When importing from a dataset:

- You see a list of all available items with checkboxes
- You can select only the ones relevant to your facility
- The data comes from an external curated repository, not from your local files

> In some deployments, CSV upload may be disabled for these models when a curated dataset is provided. This is a build-time setting controlled by administrators.
