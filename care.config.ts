import {
  ENCOUNTER_CLASS,
  EncounterClass,
} from "@/types/emr/encounter/encounter";
import { NonEmptyArray } from "@/Utils/types";
import Decimal from "decimal.js";

const env = import.meta.env;

/**
 * Resolve API URL based on current origin.
 * Priority: mapped URL for current origin > REACT_CARE_API_URL fallback
 */
const resolveApiUrl = (): string => {
  const coreEnv = (window as Window & { __CORE_ENV__?: { apiUrl?: string } })
    .__CORE_ENV__;
  return coreEnv?.apiUrl ?? env.REACT_CARE_API_URL ?? "";
};

const resolveSnomedUrl = (): string => {
  const coreEnv = (
    window as Window & { __CORE_ENV__?: { valueSetSnomedVersion?: string } }
  ).__CORE_ENV__;
  return (
    coreEnv?.valueSetSnomedVersion ?? env.REACT_VALUESET_SNOMED_VERSION ?? ""
  );
};

const careConfig = {
  apiUrl: resolveApiUrl(),
  encounterClasses: (env.REACT_ALLOWED_ENCOUNTER_CLASSES?.split(",") ??
    ENCOUNTER_CLASS) as NonEmptyArray<EncounterClass>,
  /**
   * Decimal calculation configuration
   */
  decimal: {
    /**
     * Maximum precision for decimal calculations (max_digits in backend)
     */
    precision: env.REACT_DECIMAL_PRECISION
      ? parseInt(env.REACT_DECIMAL_PRECISION, 10)
      : 20,

    /**
     * Accounting display precision
     * Matches backend `ACCOUNTING_PRECISION` config
     */
    accountingPrecision: env.REACT_ACCOUNTING_PRECISION
      ? parseInt(env.REACT_ACCOUNTING_PRECISION, 10)
      : 2,

    /**
     * Rounding method for decimal calculations
     * Matches backend `DECIMAL_ROUNDING_METHOD` config
     */
    rounding: (() => {
      const method = (env.REACT_DECIMAL_ROUNDING_METHOD || "ROUND_HALF_UP") as
        | "ROUND_UP"
        | "ROUND_DOWN"
        | "ROUND_CEIL"
        | "ROUND_FLOOR"
        | "ROUND_HALF_UP"
        | "ROUND_HALF_DOWN"
        | "ROUND_HALF_EVEN"
        | "ROUND_HALF_CEIL"
        | "ROUND_HALF_FLOOR";
      return Decimal[method] as Decimal.Rounding;
    })(),
  },
  snomedUrl: resolveSnomedUrl(),
} as const;

export default careConfig;
