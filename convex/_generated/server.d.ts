/* eslint-disable @typescript-eslint/no-explicit-any */
type PlaceholderHandler = (ctx: any, args: any) => any
type PlaceholderRegistration = {
  args?: Record<string, unknown>
  returns?: unknown
  handler: PlaceholderHandler
}
export declare function query(config: PlaceholderRegistration): unknown
export declare function mutation(config: PlaceholderRegistration): unknown
export declare function action(config: PlaceholderRegistration): unknown
export declare function internalQuery(config: PlaceholderRegistration): unknown
export declare function internalMutation(config: PlaceholderRegistration): unknown
export declare function internalAction(config: PlaceholderRegistration): unknown
export declare function httpAction(handler: PlaceholderHandler): unknown
