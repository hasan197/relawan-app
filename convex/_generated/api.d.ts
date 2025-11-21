/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as chat from "../chat.js";
import type * as checkUserData from "../checkUserData.js";
import type * as clearData from "../clearData.js";
import type * as database from "../database.js";
import type * as listUsers from "../listUsers.js";
import type * as muzakkis from "../muzakkis.js";
import type * as seed from "../seed.js";
import type * as seedMuzakki from "../seedMuzakki.js";
import type * as statistics from "../statistics.js";
import type * as testData from "../testData.js";
import type * as testMuzakki from "../testMuzakki.js";
import type * as testQueries from "../testQueries.js";
import type * as verifySeed from "../verifySeed.js";
import type * as verify_user_data from "../verify_user_data.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  chat: typeof chat;
  checkUserData: typeof checkUserData;
  clearData: typeof clearData;
  database: typeof database;
  listUsers: typeof listUsers;
  muzakkis: typeof muzakkis;
  seed: typeof seed;
  seedMuzakki: typeof seedMuzakki;
  statistics: typeof statistics;
  testData: typeof testData;
  testMuzakki: typeof testMuzakki;
  testQueries: typeof testQueries;
  verifySeed: typeof verifySeed;
  verify_user_data: typeof verify_user_data;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
