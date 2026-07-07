// Small helper to keep authController readable.
// For this codebase, we enforce TOTP for Staff accounts created via Staff model.
// Login for those users currently uses the `User` model; we therefore return requirements
// only when `twoFactorEnabled`/`forcePasswordReset` are available on Staff model.

module.exports = {};

