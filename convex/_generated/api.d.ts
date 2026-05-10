/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as activityLog from "../activityLog.js";
import type * as activityLogMutations from "../activityLogMutations.js";
import type * as bookings from "../bookings.js";
import type * as clients from "../clients.js";
import type * as crons from "../crons.js";
import type * as dashboard from "../dashboard.js";
import type * as inquiries from "../inquiries.js";
import type * as lib_adminAuth from "../lib/adminAuth.js";
import type * as lib_bookings_archivePolicy from "../lib/bookings/archivePolicy.js";
import type * as lib_bookings_mutations from "../lib/bookings/mutations.js";
import type * as lib_bookings_queries from "../lib/bookings/queries.js";
import type * as lib_inquiries_admin from "../lib/inquiries/admin.js";
import type * as lib_inquiries_publicCreate from "../lib/inquiries/publicCreate.js";
import type * as lib_validate from "../lib/validate.js";
import type * as mail_account from "../mail/account.js";
import type * as mail_config from "../mail/config.js";
import type * as mail_customerMailPolicy from "../mail/customerMailPolicy.js";
import type * as mail_mutations from "../mail/mutations.js";
import type * as mail_queries from "../mail/queries.js";
import type * as mail_sendAftercare from "../mail/sendAftercare.js";
import type * as mail_sendCustomerMessage from "../mail/sendCustomerMessage.js";
import type * as mail_sendInquiryConfirmation from "../mail/sendInquiryConfirmation.js";
import type * as mail_sendPush from "../mail/sendPush.js";
import type * as mail_sendReply from "../mail/sendReply.js";
import type * as mail_sendReviewRequest from "../mail/sendReviewRequest.js";
import type * as mail_sync from "../mail/sync.js";
import type * as notificationTriggers from "../notificationTriggers.js";
import type * as notifications from "../notifications.js";
import type * as projects from "../projects.js";
import type * as pushSubscriptions from "../pushSubscriptions.js";
import type * as storage from "../storage.js";
import type * as templates from "../templates.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  activityLog: typeof activityLog;
  activityLogMutations: typeof activityLogMutations;
  bookings: typeof bookings;
  clients: typeof clients;
  crons: typeof crons;
  dashboard: typeof dashboard;
  inquiries: typeof inquiries;
  "lib/adminAuth": typeof lib_adminAuth;
  "lib/bookings/archivePolicy": typeof lib_bookings_archivePolicy;
  "lib/bookings/mutations": typeof lib_bookings_mutations;
  "lib/bookings/queries": typeof lib_bookings_queries;
  "lib/inquiries/admin": typeof lib_inquiries_admin;
  "lib/inquiries/publicCreate": typeof lib_inquiries_publicCreate;
  "lib/validate": typeof lib_validate;
  "mail/account": typeof mail_account;
  "mail/config": typeof mail_config;
  "mail/customerMailPolicy": typeof mail_customerMailPolicy;
  "mail/mutations": typeof mail_mutations;
  "mail/queries": typeof mail_queries;
  "mail/sendAftercare": typeof mail_sendAftercare;
  "mail/sendCustomerMessage": typeof mail_sendCustomerMessage;
  "mail/sendInquiryConfirmation": typeof mail_sendInquiryConfirmation;
  "mail/sendPush": typeof mail_sendPush;
  "mail/sendReply": typeof mail_sendReply;
  "mail/sendReviewRequest": typeof mail_sendReviewRequest;
  "mail/sync": typeof mail_sync;
  notificationTriggers: typeof notificationTriggers;
  notifications: typeof notifications;
  projects: typeof projects;
  pushSubscriptions: typeof pushSubscriptions;
  storage: typeof storage;
  templates: typeof templates;
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
