/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin from "../admin.js";
import type * as auth from "../auth.js";
import type * as backblazeUpload from "../backblazeUpload.js";
import type * as chat from "../chat.js";
import type * as checkUserData from "../checkUserData.js";
import type * as clearData from "../clearData.js";
import type * as database from "../database.js";
import type * as donations from "../donations.js";
import type * as donationsAdmin from "../donationsAdmin.js";
import type * as lib_backblazeB2 from "../lib/backblazeB2.js";
import type * as listUsers from "../listUsers.js";
import type * as muzakkis from "../muzakkis.js";
import type * as notifications from "../notifications.js";
import type * as programs from "../programs.js";
import type * as regus from "../regus.js";
import type * as seed from "../seed.js";
import type * as seedMuzakki from "../seedMuzakki.js";
import type * as statistics from "../statistics.js";
import type * as storage_BackblazeClient from "../storage/BackblazeClient.js";
import type * as storage_BackblazeStorageProvider from "../storage/BackblazeStorageProvider.js";
import type * as storage_ConvexStorageProvider from "../storage/ConvexStorageProvider.js";
import type * as storage_StorageManager from "../storage/StorageManager.js";
import type * as storage_StorageProvider from "../storage/StorageProvider.js";
import type * as templates from "../templates.js";
import type * as testData from "../testData.js";
import type * as testMuzakki from "../testMuzakki.js";
import type * as testQueries from "../testQueries.js";
import type * as uploads from "../uploads.js";
import type * as verifyAllData from "../verifyAllData.js";
import type * as verifySeed from "../verifySeed.js";
import type * as verify_user_data from "../verify_user_data.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  auth: typeof auth;
  backblazeUpload: typeof backblazeUpload;
  chat: typeof chat;
  checkUserData: typeof checkUserData;
  clearData: typeof clearData;
  database: typeof database;
  donations: typeof donations;
  donationsAdmin: typeof donationsAdmin;
  "lib/backblazeB2": typeof lib_backblazeB2;
  listUsers: typeof listUsers;
  muzakkis: typeof muzakkis;
  notifications: typeof notifications;
  programs: typeof programs;
  regus: typeof regus;
  seed: typeof seed;
  seedMuzakki: typeof seedMuzakki;
  statistics: typeof statistics;
  "storage/BackblazeClient": typeof storage_BackblazeClient;
  "storage/BackblazeStorageProvider": typeof storage_BackblazeStorageProvider;
  "storage/ConvexStorageProvider": typeof storage_ConvexStorageProvider;
  "storage/StorageManager": typeof storage_StorageManager;
  "storage/StorageProvider": typeof storage_StorageProvider;
  templates: typeof templates;
  testData: typeof testData;
  testMuzakki: typeof testMuzakki;
  testQueries: typeof testQueries;
  uploads: typeof uploads;
  verifyAllData: typeof verifyAllData;
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
