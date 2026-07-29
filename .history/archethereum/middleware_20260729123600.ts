/**
 * Next.js Middleware — re-exports logic from proxy.ts
 * The function MUST be exported as `middleware` (not `proxy`) for Next.js to recognise it.
 */
export { proxy as middleware, config } from './proxy'
