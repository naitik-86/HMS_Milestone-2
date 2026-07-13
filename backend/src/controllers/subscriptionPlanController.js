const SubscriptionPlan = require('../models/SubscriptionPlan');
const Clinic = require("../models/Clinic");

const addMonths = (date, months) => {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
};


exports.getSubscriptionDetails = async (req, res) => {
  try {
    const { clinicId } = req.params;

    // 1. Get Clinic
    const clinic = await Clinic.findById(clinicId).select(
      "name subscriptionType subscriptionStatus expiryDate"
    );

    if (!clinic) {
      return res.status(404).json({
        success: false,
        message: "Clinic not found",
      });
    }

    // 2. Find matching subscription plan
    const plan = await SubscriptionPlan.findOne({
      billingCycle: clinic.subscriptionType,
      status: "Active",
    }).select(
      "subscriptionPlan billingCycle price featureLimits modules"
    );

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Subscription plan not found",
      });
    }

    // 3. Return combined response
    return res.status(200).json({
      success: true,
      data: {
        clinicId: clinic._id,
        clinicName: clinic.name,

        subscriptionStatus: clinic.subscriptionStatus,
        expiryDate: clinic.expiryDate,

        planName: plan.subscriptionPlan,
        billingCycle: plan.billingCycle,
        price: plan.price,

        featureLimits: plan.featureLimits,
        modules: plan.modules,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch subscription details",
      error: error.message,
    });
  }
};



const getRenewalDate = (startDate, billingCycle) => {
  const date = new Date(startDate);
  if (Number.isNaN(date.getTime())) return null;

  if (billingCycle === 'Monthly') return addMonths(date, 1);
  if (billingCycle === 'Quarterly') return addMonths(date, 3);
  if (billingCycle === 'Annual') return addMonths(date, 12);

  return null;
};

const buildPlanPayload = (body) => {
  const renewalDate = body.planEndRenewalDate || getRenewalDate(body.planStartDate, body.billingCycle);

  return {
    subscriptionPlan: body.subscriptionPlan,
    billingCycle: body.billingCycle,
    planStartDate: body.planStartDate,
    planEndRenewalDate: renewalDate,
    trialPeriodDays: Number(body.trialPeriodDays || 0),
    discountPromoCode: body.discountPromoCode || '',
    customPlanNotes: body.customPlanNotes || '',
    featureLimits: {
      maxStaffAccounts: Number(body.maxStaffAccounts || 0),
      maxDoctors: Number(body.maxDoctors || 0),
      maxPetRecords: body.maxPetRecordsUnlimited ? undefined : Number(body.maxPetRecords || 0),
      maxPetRecordsUnlimited: Boolean(body.maxPetRecordsUnlimited),
      storageLimitGb: Number(body.storageLimitGb || 0)
    },
    modules: {
      lab: Boolean(body.labModuleEnabled),
      grooming: Boolean(body.groomingModuleEnabled),
      kennel: Boolean(body.kennelModuleEnabled),
      onlinePharmacy: Boolean(body.onlinePharmacyModuleEnabled),
      apiAccess: Boolean(body.apiAccessEnabled),
      whiteLabelBranding: Boolean(body.whiteLabelCustomBranding)
    },
    subscriptionInvoice: 'Auto-generated PDF',
    status: body.status || 'Active'
  };
};

exports.createPlan = async (req, res) => {
  try {
    const count = await SubscriptionPlan.countDocuments();
    const plan = await SubscriptionPlan.create({
      ...buildPlanPayload(req.body),
      planCode: `PL${String(count + 1).padStart(4, '0')}`
    });

    res.status(201).json({ success: true, data: plan });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getPlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: plans.length, data: plans });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updatePlan = async (req, res) => {
  try {
    const plan = await SubscriptionPlan.findByIdAndUpdate(
      req.params.id,
      buildPlanPayload(req.body),
      { new: true, runValidators: true }
    );

    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    res.status(200).json({ success: true, data: plan });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deletePlan = async (req, res) => {
  try {
    const plan = await SubscriptionPlan.findByIdAndDelete(req.params.id);

    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    res.status(200).json({ success: true, message: 'Plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
