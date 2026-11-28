# DILUX GROUP Firestore Security Specification (Phase 0 & Phase 5)

## 1. Data Invariants
1. **Default-Deny Baseline**: Any collection or path not explicitly declared is denied for both reads and writes (`match /{document=**} { allow read, write: if false; }`).
2. **Admin Privilege Integrity**:
   - Only verified Google-authenticated admins (`request.auth != null && request.auth.token.email_verified == true`) whose email matches the bootstrapped runtime admin (`ramdanitomi6@gmail.com`) OR whose `request.auth.uid` exists in `/admins/{uid}` may create, update, or delete CMS documents (`/siteSettings`, `/divisions`, `/services`, `/products`, `/projects`, `/articles`) or manage `/admins/{adminId}`.
   - Non-admin users cannot read `/admins/{adminId}` (PII/email isolation) and cannot self-register as admins.
3. **Public Content Safety**:
   - Corporate showcase collections (`/siteSettings`, `/divisions`, `/services`, `/products`, `/projects`, `/articles`) contain zero PII and are publicly readable (`allow get, list: if true`) so visitors can browse the website without logging in.
4. **Schema, Type, Size & Temporal Integrity**:
   - Every document ID on single-doc operations (`get`, `create`, `update`, `delete`) must satisfy `isValidId(id)` (`^[a-zA-Z0-9_\-]+$`, max 128 chars).
   - Every write validates exact required and allowed keys (`keys().hasAll(...) && keys().hasOnly(...)`), string lengths, numeric ranges, enum allowlists, bounded array sizes (`<= 12`), `createdAt == request.time` on create, immutable `createdAt == existing().createdAt` and `updatedAt == request.time` on update, and `affectedKeys().hasOnly(...)` on update.
   - Image fields (`brandLogoUrl`, `heroImageUrl`, and `image` on projects/products/articles) enforce `isValidImageRef` (`https?://`, `/...` non-protocol-relative paths, or raster `data:image/(jpeg|jpg|png|webp|gif);base64,...` up to 450,000 chars), blocking `javascript:`, `data:text/html`, and `data:image/svg+xml`.
5. **Contact Inbox PII Isolation**:
   - Visitors may `create` documents in `/contactMessages/{messageId}` without authentication, provided all required fields match strict type, format, length bounds (`fullName` 2..120, `email` 5..200 matching email regex, `subject` 3..200, `message` 10..4000), `status == 'new'`, and `createdAt == request.time && updatedAt == request.time`.
   - `get`, `list`, `update`, and `delete` on `/contactMessages/{messageId}` are strictly restricted to `isAdmin()`. Visitors can never read, enumerate, alter, or delete submitted messages.
   - Admin updates on `/contactMessages/{messageId}` may only mutate `['status', 'updatedAt']`, leaving sender identity and message body immutable.

## 2. The "Dirty Dozen" Payloads (Expected: PERMISSION_DENIED)
1. **Unauthenticated Project Create**: Anonymous user attempts `create /projects/hack-1`.
2. **Unverified Email Admin Spoof**: Signed-in user with `email: "ramdanitomi6@gmail.com"` and `email_verified: false` attempts `update /siteSettings/home`.
3. **Self-Assigned Admin Escalation**: Non-admin signed-in user attempts `create /admins/<their-uid>`.
4. **Admin PII Scrape**: Non-admin signed-in user attempts `get` or `list` on `/admins`.
5. **Shadow Field Injection on Project**: Admin attempts `create /projects/proj-1` with extra ghost field `isVerified: true`.
6. **Shadow Field Injection on Product Update**: Admin attempts `update /products/prod-1` modifying `createdAt` or adding `secretPrice: 999`.
7. **ID Poisoning**: Admin attempts `create /projects/bad..id/../../x` or 200-char document ID.
8. **Oversized String DoS**: Admin attempts `create /articles/art-1` with `titleId` > 240 chars or `sectionBodyId` > 6000 chars.
9. **Unbounded Array Injection**: Admin attempts `update /projects/proj-1` with `technologies` array of 25 elements (> 12 max).
10. **Invalid Enum Category**: Admin attempts `create /products/prod-x` with `category: "Crypto"` (outside allowlist).
11. **Client-Forged Timestamp**: Admin attempts `create /services/svc-1` with `createdAt` set to a past client timestamp instead of `request.time`.
12. **Type Poisoning**: Admin attempts `update /projects/proj-1` setting `featured: "yes"` (string instead of bool) or `sortOrder: "first"` (string instead of number).
13. **Contact Inbox PII Scrape**: Visitor or non-admin user attempts `get` or `list` on `/contactMessages`.
14. **Contact Message Initial Status Tampering**: Visitor attempts `create /contactMessages/msg-1` with `status: "replied"` or extra shadow field `isSpam: false`.
15. **Contact Message Oversized Payload / Invalid Email**: Visitor attempts `create /contactMessages/msg-2` with `email: "not-an-email"` or `message` > 4000 chars.
16. **Contact Message Immutable Content Alter**: Admin attempts `update /contactMessages/msg-1` changing sender `email` or `message` body.
17. **Unsafe Image Payload / SVG XSS Injection**: Admin attempts `update /siteSettings/home` or `/projects/proj-1` with `javascript:alert(1)` or `data:image/svg+xml;base64,...`.

## 3. Red Team Conflict Report
- **Identity Spoofing**: Blocked — `updatedBy` / `createdBy` must equal `request.auth.uid`, and `isAdmin()` verifies `email_verified == true`.
- **State Shortcutting / Enum Poisoning**: Blocked — `category`, `icon`, `language`, and `status` fields validate against explicit allowlists; public message creation forces `status == 'new'`.
- **Resource Poisoning**: Blocked — `isValidId()` restricts document IDs; every string, image ref, and array enforces explicit `.size()` bounds.
- **Shadow Updates**: Blocked — `hasOnly` on `keys()` and `affectedKeys()` rejects any undeclared or immutable fields.
- **PII Leak**: Blocked — `/admins` and `/contactMessages` contain personal email/contact data and are restricted strictly to `isAdmin()` for all reads.
- **Stored Image XSS**: Blocked — `isValidImageRef()` allows only `https?://`, non-protocol-relative `/` paths, and raster `data:image/(jpeg|jpg|png|webp|gif);base64,...`.
