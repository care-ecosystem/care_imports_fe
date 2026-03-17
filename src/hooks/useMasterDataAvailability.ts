import { useEffect, useState } from "react";

export type DatasetId =
  | "product-knowledge"
  | "specimen-definition"
  | "observation-definition"
  | "activity-definition";

export const DATASET_ORDER: DatasetId[] = [
  "product-knowledge",
  "specimen-definition",
  "observation-definition",
  "activity-definition",
];

const normalizeDatasetKey = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]/g, "");

const resolveManifestFile = (
  manifest: unknown,
  datasetId: DatasetId,
): string | undefined => {
  if (!manifest || typeof manifest !== "object") return undefined;
  const record = manifest as Record<string, unknown>;

  const candidates = [
    datasetId,
    datasetId.replace(/-/g, "_"),
    datasetId.replace(/-/g, ""),
    datasetId
      .split("-")
      .map((segment, index) =>
        index === 0 ? segment : segment[0]?.toUpperCase() + segment.slice(1),
      )
      .join(""),
  ].map((key) => normalizeDatasetKey(key));

  const matchFromRecord = (value: unknown) =>
    typeof value === "string" ? value : undefined;

  const direct = Object.entries(record).find(([key]) =>
    candidates.includes(normalizeDatasetKey(key)),
  );
  if (direct) {
    return matchFromRecord(direct[1]);
  }

  const datasetsValue = record.datasets;
  if (Array.isArray(datasetsValue)) {
    const match = datasetsValue.find((entry) => {
      if (!entry || typeof entry !== "object") return false;
      const entryRecord = entry as Record<string, unknown>;
      const key =
        entryRecord.id ??
        entryRecord.key ??
        entryRecord.name ??
        entryRecord.type;
      if (typeof key !== "string") return false;
      return candidates.includes(normalizeDatasetKey(key));
    }) as Record<string, unknown> | undefined;

    if (match) {
      return (
        matchFromRecord(match.file) ||
        matchFromRecord(match.path) ||
        matchFromRecord(match.url)
      );
    }
  }

  const datasetsRecord = record.datasets;
  if (datasetsRecord && typeof datasetsRecord === "object") {
    const datasetEntry = Object.entries(
      datasetsRecord as Record<string, unknown>,
    ).find(([key]) => candidates.includes(normalizeDatasetKey(key)));
    if (datasetEntry) {
      return matchFromRecord(datasetEntry[1]);
    }
  }

  const filesRecord = record.files;
  if (filesRecord && typeof filesRecord === "object") {
    const fileEntry = Object.entries(
      filesRecord as Record<string, unknown>,
    ).find(([key]) => candidates.includes(normalizeDatasetKey(key)));
    if (fileEntry) {
      return matchFromRecord(fileEntry[1]);
    }
  }

  return undefined;
};

const resolveManifestBase = (manifest: unknown) => {
  if (!manifest || typeof manifest !== "object") return "/master-data/";
  const record = manifest as Record<string, unknown>;
  const base =
    (typeof record.basePath === "string" && record.basePath) ||
    (typeof record.base_path === "string" && record.base_path) ||
    (typeof record.baseUrl === "string" && record.baseUrl) ||
    (typeof record.base_url === "string" && record.base_url) ||
    "/master-data/";
  return base.endsWith("/") ? base : `${base}/`;
};

type ManifestStatus = "idle" | "loading" | "ready" | "error";

const buildEmptyFiles = () =>
  DATASET_ORDER.reduce<Record<DatasetId, string>>((acc, datasetId) => {
    acc[datasetId] = "";
    return acc;
  }, {} as Record<DatasetId, string>);

const buildEmptyAvailability = () =>
  DATASET_ORDER.reduce<Record<DatasetId, boolean>>((acc, datasetId) => {
    acc[datasetId] = false;
    return acc;
  }, {} as Record<DatasetId, boolean>);

export const useMasterDataAvailability = () => {
  const [status, setStatus] = useState<ManifestStatus>("idle");
  const [error, setError] = useState("");
  const [files, setFiles] = useState<Record<DatasetId, string>>(
    buildEmptyFiles(),
  );
  const [availability, setAvailability] = useState<Record<DatasetId, boolean>>(
    buildEmptyAvailability(),
  );

  useEffect(() => {
    let active = true;

    const loadManifest = async () => {
      setStatus("loading");
      setError("");

      try {
        const manifestUrl = new URL(
          "/master-data/manifest.json",
          import.meta.url,
        );
        const response = await fetch(manifestUrl.toString(), {
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error("Manifest not found");
        }

        const manifest = (await response.json()) as unknown;
        const basePath = resolveManifestBase(manifest);
        const baseUrl = new URL(basePath, manifestUrl);
        const resolvedFiles = buildEmptyFiles();

        DATASET_ORDER.forEach((datasetId) => {
          const file = resolveManifestFile(manifest, datasetId);
          if (!file) return;
          resolvedFiles[datasetId] = file.startsWith("http")
            ? file
            : new URL(file.replace(/^\//, ""), baseUrl).toString();
        });

        const availabilityEntries = await Promise.all(
          DATASET_ORDER.map(async (datasetId) => {
            const url = resolvedFiles[datasetId];
            if (!url) return [datasetId, false] as const;
            try {
              const check = await fetch(url, { method: "HEAD" });
              return [datasetId, check.ok] as const;
            } catch {
              return [datasetId, false] as const;
            }
          }),
        );

        if (!active) return;

        const resolvedAvailability = availabilityEntries.reduce<
          Record<DatasetId, boolean>
        >((acc, [datasetId, ok]) => {
          acc[datasetId] = ok;
          return acc;
        }, buildEmptyAvailability());

        setFiles(resolvedFiles);
        setAvailability(resolvedAvailability);
        setStatus("ready");
      } catch (err) {
        if (!active) return;
        setStatus("error");
        setFiles(buildEmptyFiles());
        setAvailability(buildEmptyAvailability());
        setError(err instanceof Error ? err.message : "Manifest unavailable");
      }
    };

    loadManifest();

    return () => {
      active = false;
    };
  }, []);

  return { status, error, files, availability };
};
