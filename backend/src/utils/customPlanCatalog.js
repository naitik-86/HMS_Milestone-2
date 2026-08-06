const SubscriptionPlan = require("../models/SubscriptionPlan");

// Custom plans are configured per-clinic directly on the Clinic document
// (billingCycle / customPlanPrice / licenseLimits / planStartDate /
// planEndDate - see Super Admin > Add/Edit Clinic > Plan & Features), not
// as a shared catalog SubscriptionPlan entry the way Basic/Standard/... are.
// Every place that needs a real SubscriptionPlan document (tracker
// creation, PayU payment amount, the /payment page's plan summary, the
// tracker resync on plan/billing edits) used to resolve one by
// `findOne({subscriptionPlan: clinic.plan})`, which never matches "Custom",
// then silently fell back to `findOne({billingCycle})` - picking whatever
// catalog plan happened to share that billing cycle, with its own
// unrelated price/name, and returning 404 (blank Payment page) if nothing
// matched at all.
//
// This finds-or-creates ONE dedicated SubscriptionPlan document per clinic
// that mirrors its own custom terms exactly, tagged via customPlanNotes so
// it's found (not duplicated) on every subsequent call, and kept in sync
// with whatever Super Admin currently has set on the Clinic (a Custom
// plan's price/cycle/dates can be edited after the clinic was created).
const CUSTOM_PLAN_TAG_PREFIX = "AUTO_CUSTOM_PLAN_FOR_CLINIC:";

const addMonths = (date, months) => {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
};

const getRenewalDate = (startDate, billingCycle) => {
  const date = new Date(startDate);
  if (Number.isNaN(date.getTime())) return addMonths(new Date(), 1);

  if (billingCycle === "Quarterly") return addMonths(date, 3);
  if (billingCycle === "Half-Yearly") return addMonths(date, 6);
  if (billingCycle === "Annual") return addMonths(date, 12);
  return addMonths(date, 1); // Monthly / anything else
};

const isCustomPlanClinic = (clinic) => clinic?.plan === "Custom";

const getOrCreateCustomPlanForClinic = async (clinic) => {
  const tag = `${CUSTOM_PLAN_TAG_PREFIX}${clinic._id}`;

  const billingCycle = clinic.billingCycle || "Monthly";
  const price = Number(clinic.customPlanPrice || 0);
  const planStartDate = clinic.planStartDate || new Date();
  const planEndRenewalDate = clinic.planEndDate || getRenewalDate(planStartDate, billingCycle);

  const limits = clinic.licenseLimits || {};

  const fields = {
    planType: "Clinic",
    subscriptionPlan: "Custom",
    billingCycle,
    price,
    planStartDate,
    planEndRenewalDate,
    trialPeriodDays: Number(clinic.trialDays || 0),
    customPlanNotes: tag,
    featureLimits: {
      maxStaffAccounts: Number(limits.maxStaff || 0),
      maxDoctors: Number(limits.maxDoctors || 0),
      maxPetRecords: limits.maxPetsUnlimited ? undefined : Number(limits.maxPets || 0),
      maxPetRecordsUnlimited: Boolean(limits.maxPetsUnlimited),
      storageLimitGb: Number(limits.storageLimit || 0),
    },
    status: "Active",
  };

  const existing = await SubscriptionPlan.findOne({ customPlanNotes: tag });

  if (existing) {
    existing.set(fields);
    await existing.save();
    return existing;
  }

  const lastPlan = await SubscriptionPlan.findOne({ planCode: /^PL\d+$/ }).sort({ planCode: -1 });
  const lastNumber = lastPlan ? parseInt(lastPlan.planCode.slice(2), 10) || 0 : 0;

  return SubscriptionPlan.create({
    ...fields,
    planCode: `PL${String(lastNumber + 1).padStart(4, "0")}`,
  });
};

module.exports = { getOrCreateCustomPlanForClinic, isCustomPlanClinic };
