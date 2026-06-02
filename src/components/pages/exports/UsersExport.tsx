import ExportCard from "@/components/shared/ExportCard";
import type { UserRead } from "@/types/user/user";
import userApi from "@/types/user/userApi";

const CSV_HEADERS = [
  "userType",
  "prefix",
  "firstName",
  "lastName",
  "email",
  "phoneNumber",
  "gender",
  "geoOrganization",
  "username",
];

export default function UsersExport() {
  return (
    <ExportCard<UserRead>
      title="Export Users"
      description="Export all users as a CSV file matching the import format."
      queryKey={["users"]}
      route={userApi.list}
      csvHeaders={CSV_HEADERS}
      mapRow={(user) => [
        user.user_type ?? "",
        user.prefix ?? "",
        user.first_name ?? "",
        user.last_name ?? "",
        user.email ?? "",
        user.phone_number ?? "",
        user.gender ?? "",
        "", // geo_organization not available on list endpoint
        user.username ?? "",
      ]}
      filename="users_export.csv"
    />
  );
}
