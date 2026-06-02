import { HttpError, request } from "@/apis/request";
import { ImportFlow } from "@/components/imports";
import {
  parseUserRow,
  toUserCreatePayload,
  USER_HEADER_MAP,
  USER_REQUIRED_HEADERS,
  USER_SAMPLE_CSV,
  UserRow,
  UserRowSchema,
} from "@/components/pages/Users/utils";
import type { ImportConfig, ImportParams } from "@/internalTypes/importConfig";
import userApi from "@/types/user/userApi";
import { mutate } from "@/Utils/request/mutate";

/**
 * Check if a user already exists by username.
 */
async function checkUserExists(row: UserRow): Promise<string | undefined> {
  try {
    const user = await request(userApi.get, {
      pathParams: { username: row.username },
    });
    return user.id;
  } catch (error) {
    if (error instanceof HttpError && error.status === 404) {
      return undefined;
    }
    throw error;
  }
}

/**
 * Create a new user from a validated row.
 */
async function createUser(row: UserRow, _params: ImportParams): Promise<void> {
  const payload = toUserCreatePayload(row);
  await mutate(userApi.create)(payload);
}

/**
 * Configuration for the Users import flow.
 */
const usersImportConfig: ImportConfig<UserRow> = {
  resourceName: "User",
  resourceNamePlural: "Users",

  // Parsing
  requiredHeaders: USER_REQUIRED_HEADERS,
  headerMap: USER_HEADER_MAP,
  schema: UserRowSchema,
  parseRow: parseUserRow,

  // API operations
  checkExists: checkUserExists,
  createResource: createUser,
  // No updateResource - existing users are skipped

  // Execution
  batchSize: 1, // Sequential to avoid race conditions
  invalidateKeys: [["users"]],

  // UI
  description:
    "Upload a CSV file to create new users. Existing users will be skipped.",
  uploadHints: [
    "Expected columns: userType, prefix, firstName, lastName, email, phoneNumber, gender, username, password",
    "User types: doctor, staff, nurse, volunteer, administrator",
  ],
  sampleCsv: USER_SAMPLE_CSV,

  reviewColumns: [
    { header: "Username", accessor: "username" },
    {
      header: "Name",
      accessor: (row) => `${row.firstName} ${row.lastName}`,
    },
    { header: "User Type", accessor: "userType" },
    { header: "Email", accessor: "email" },
  ],

  getRowIdentifier: (row) => row.username,
};

/**
 * Users import page using the generic ImportFlow component.
 */
export default function UsersImportPage() {
  return <ImportFlow config={usersImportConfig} />;
}
