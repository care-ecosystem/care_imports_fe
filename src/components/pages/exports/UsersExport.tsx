import ExportCard from "@/components/shared/ExportCard";

interface UserRead {
  username: string;
  user_type: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  gender: string;
  geo_organization?: string;
}

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
      apiPath="/api/v1/users/"
      csvHeaders={CSV_HEADERS}
      mapRow={(user) => [
        user.user_type ?? "",
        "", // prefix is not stored in the API
        user.first_name ?? "",
        user.last_name ?? "",
        user.email ?? "",
        user.phone_number ?? "",
        user.gender ?? "",
        user.geo_organization ?? "",
        user.username ?? "",
      ]}
      filename="users_export.csv"
    />
  );
}
