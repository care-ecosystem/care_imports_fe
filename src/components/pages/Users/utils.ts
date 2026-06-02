import { buildHeaderMapping } from "@/internalTypes/common";
import { UserCreate } from "@/types/user/user";
import { z } from "zod";

// ─── Required & Optional Headers ───────────────────────────────────
export const USER_REQUIRED_HEADERS = [
  "userType",
  "prefix",
  "firstName",
  "lastName",
  "email",
  "phoneNumber",
  "gender",
  "password",
  "username",
] as const;

export const USER_OPTIONAL_HEADERS = ["geoOrganization"] as const;

// ─── Header Mapping (normalized → canonical) ─────────────────────
export const USER_HEADER_MAP: Record<string, string> = buildHeaderMapping([
  ...USER_REQUIRED_HEADERS,
  ...USER_OPTIONAL_HEADERS,
]);

// ─── Gender Enum ───────────────────────────────────────────────────
export const GenderSchema = z.enum([
  "male",
  "female",
  "transgender",
  "non_binary",
]);

export type Gender = z.infer<typeof GenderSchema>;

// ─── Zod Schema ────────────────────────────────────────────────────
export const UserRowSchema = z.object({
  userType: z.string().min(1, "User type is required"),
  prefix: z.string().optional(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  gender: GenderSchema,
  password: z.string().min(8, "Password must be at least 8 characters"),
  username: z.string().min(1, "Username is required"),
  geoOrganization: z.string().optional(),
  role_orgs: z.array(z.string()).optional(),
});

export type UserRow = z.infer<typeof UserRowSchema>;

// ─── API Payload Transformer ───────────────────────────────────────
export function toUserCreatePayload(row: UserRow): UserCreate {
  // Normalize phone number to include country code
  const phoneNumber = row.phoneNumber.startsWith("+")
    ? row.phoneNumber
    : `+91${row.phoneNumber}`;

  // Normalize username
  const username = row.username
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "_");

  return {
    username,
    email: row.email.trim(),
    first_name: row.firstName.trim(),
    last_name: row.lastName.trim(),
    gender: row.gender,
    password: row.password.trim(),
    phone_number: phoneNumber,
    geo_organization: row.geoOrganization?.trim() || undefined,
    role_orgs: [],
  };
}

// ─── Sample CSV ────────────────────────────────────────────────────
export const USER_SAMPLE_CSV = {
  headers: [
    "User Type",
    "Prefix",
    "First Name",
    "Last Name",
    "Email",
    "Phone Number",
    "Gender",
    "Password",
    "Username",
    "Geo Organization",
  ],
  rows: [
    [
      "doctor",
      "Dr.",
      "John",
      "Doe",
      "john.doe@example.com",
      "+919876543210",
      "male",
      "SecurePass123!",
      "johndoe",
      "",
    ],
  ],
};

// ─── Parse Row ─────────────────────────────────────────────────────
export function parseUserRow(
  row: string[],
  headerIndices: Record<string, number>,
): Record<string, unknown> {
  return {
    userType: row[headerIndices.userType]?.trim() ?? "",
    prefix: row[headerIndices.prefix]?.trim() ?? "",
    firstName: row[headerIndices.firstName]?.trim() ?? "",
    lastName: row[headerIndices.lastName]?.trim() ?? "",
    email: row[headerIndices.email]?.trim() ?? "",
    phoneNumber: row[headerIndices.phoneNumber]?.trim() ?? "",
    gender: row[headerIndices.gender]?.trim().toLowerCase() ?? "",
    password: row[headerIndices.password]?.trim() ?? "",
    username: row[headerIndices.username]?.trim() ?? "",
    geoOrganization: row[headerIndices.geoOrganization]?.trim() || undefined,
  };
}
