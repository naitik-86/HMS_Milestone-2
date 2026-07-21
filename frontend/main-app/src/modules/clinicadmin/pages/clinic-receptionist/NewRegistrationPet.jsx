import { useEffect, useMemo, useState } from "react";
import { City, State } from "country-state-city";
import { useNavigate } from "react-router-dom";
import {
  UserCheck,
  PawPrint,
  FileText,
  Stethoscope,
  Check,
  AlertCircle,
  Loader2,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Plus,
  Trash2,
  CheckSquare,
  Square,
  BadgeCheck,
  Copy,
} from "lucide-react";
import { showToast } from "../../../../shared/components/toast";
import {
  registerOwnerAndPet,
  searchCustomer,
  sendRegistrationOtp,
  addPet,
  addVisit,
  updateOwner,
} from "../../api/receptionApi";
import { getDoctors } from "../../api/doctorApi";
import { getDoctorStaff } from "../../api/staffApi";

const initialFormData = {
  mobileNumber: "",
  otp: "",
  visitType: "New",
  ownerName: "",
  ownerIdType: "Aadhaar Card",
  email: "",
  address: "",
  state: "",
  city: "",
  district: "",
  pincode: "",
};

const defaultHistory = {
  vaccineName: "",
  vaccinationDate: "",
  batchNumber: "",
  clinicName: "",
  dewormingProduct: "",
  dewormingDate: "",
  dose: "",
  surgicalProcedure: "",
  surgeryDate: "",
  hospital: "",
  condition: "",
  treatment: "",
  treatmentDate: "",
  allergies: "",
  medications: "",
};

const getTodayDateStr = () => new Date().toISOString().split("T")[0];
const getCurrentTimeStr = () => new Date().toTimeString().split(" ")[0].substring(0, 5);

const defaultVisitReason = {
  primaryReason: "",
  complaint: "",
  appointmentDate: getTodayDateStr(),
  appointmentTime: getCurrentTimeStr(),
  assignedDoctor: "",
};

const steps = [
  {
    id: 1,
    title: "Owner Verification",
    shortTitle: "Owner Verification",
    subtitle: "Mobile & Address",
    icon: UserCheck,
    key: "owner",
  },
  {
    id: 2,
    title: "Pet Registration",
    shortTitle: "Pet Registration",
    subtitle: "Select / Add Pets",
    icon: PawPrint,
    key: "pet",
  },
  {
    id: 3,
    title: "Pet History",
    shortTitle: "Pet History",
    subtitle: "Medical & Vaccines",
    icon: FileText,
    key: "history",
  },
  {
    id: 4,
    title: "Reason For Visit",
    shortTitle: "Reason For Visit",
    subtitle: "Doctor & Visit",
    icon: Stethoscope,
    key: "visit",
  },
];

const reasonOptions = ["Treatment", "Vaccination", "Checkup", "Certificate"];
const inputClass =
  "w-full border border-slate-200 rounded-xl p-3 bg-white text-slate-700 font-medium focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition outline-none";
const today = getTodayDateStr();

const calculateAge = (dob) => {
  if (!dob) return "";
  const birthDate = new Date(dob);
  const currentDate = new Date();
  let age = currentDate.getFullYear() - birthDate.getFullYear();
  const monthDifference = currentDate.getMonth() - birthDate.getMonth();
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && currentDate.getDate() < birthDate.getDate())
  ) {
    age -= 1;
  }
  return age >= 0 ? String(age) : "";
};

const normalizeDoctorList = (response) => {
  const doctors =
    response?.doctors || response?.data?.doctors || response?.data || response || [];
  return Array.isArray(doctors) ? doctors : [];
};

const getDoctorName = (doctor) =>
  doctor.name ||
  doctor.fullName ||
  doctor.personalInfo?.fullName ||
  doctor.staff?.personalInfo?.fullName ||
  doctor.email ||
  "";

const getDoctorOptionValue = (doctor) =>
  doctor._id || doctor.id || doctor.doctorId || getDoctorName(doctor);

function ErrorText({ errors, name }) {
  return errors[name] ? (
    <p className="mt-1 text-sm text-red-500 font-medium">{errors[name]}</p>
  ) : null;
}

const cleanStr = (s) =>
  String(s || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]/g, "");

const matchStateFromList = (postalStateName, statesList) => {
  if (!postalStateName) return null;
  const target = cleanStr(postalStateName);
  let found = statesList.find((s) => cleanStr(s.name) === target);
  if (found) return found;
  found = statesList.find(
    (s) => cleanStr(s.name).includes(target) || target.includes(cleanStr(s.name))
  );
  if (found) return found;
  const aliases = {
    orissa: "odisha",
    pondicherry: "puducherry",
    uttaranchal: "uttarakhand",
    "nct of delhi": "delhi",
    "delhi nct": "delhi",
  };
  const aliasTarget = aliases[target] || target;
  return statesList.find((s) => cleanStr(s.name) === aliasTarget);
};

export default function NewRegistrationPet() {
  const [showModal] = useState(true);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [otpSent, setOtpSent] = useState(false);

  // Existing customer tracking
  const [mobileExists, setMobileExists] = useState(false);
  const [existingOwnerId, setExistingOwnerId] = useState(null);
  const [existingPets, setExistingPets] = useState([]);
  const [selectedExistingPetIds, setSelectedExistingPetIds] = useState([]);
  const [addNewPetForExisting, setAddNewPetForExisting] = useState(false);
  const [newPetsForExisting, setNewPetsForExisting] = useState([]);

  // New Owner Pets List (Multiple pets support)
  const [newOwnerPets, setNewOwnerPets] = useState([
    {
      petName: "",
      species: "Dog",
      breed: "",
      gender: "Male",
      dob: "",
      age: "",
      color: "",
      rfid: "",
      identificationArea: "",
      sterilized: "No",
    },
  ]);

  // Per-Pet History & Visit Reason maps (keyed by pet.id)
  const [petHistoriesMap, setPetHistoriesMap] = useState({});
  const [petVisitsMap, setPetVisitsMap] = useState({});

  // Active pet tab indices for Step 3 & Step 4
  const [activeHistoryPetIndex, setActiveHistoryPetIndex] = useState(0);
  const [activeVisitPetIndex, setActiveVisitPetIndex] = useState(0);

  const [doctors, setDoctors] = useState([]);
  const [searchingMobile, setSearchingMobile] = useState(false);

  // Pincode validation states
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeValid, setPincodeValid] = useState(null);
  const [pincodeDetails, setPincodeDetails] = useState("");

  const navigate = useNavigate();
  const states = useMemo(() => State.getStatesOfCountry("IN"), []);

  const cities = useMemo(() => {
    if (!formData.state) return [];
    const list = City.getCitiesOfState("IN", formData.state) || [];
    if (formData.city && !list.some((c) => c.name === formData.city)) {
      return [{ name: formData.city, latitude: "0", longitude: "0" }, ...list];
    }
    return list;
  }, [formData.state, formData.city]);

  const selectedState = states.find((item) => item.isoCode === formData.state);

  // Compute normalized active pets participating in the visit
  const activePets = useMemo(() => {
    if (mobileExists) {
      const selectedExisting = existingPets
        .filter((p) => selectedExistingPetIds.includes(p._id))
        .map((p) => ({
          id: p._id,
          petName: p.petName || p.name || "Pet",
          species: p.species || "Dog",
          breed: p.breed || "N/A",
          gender: p.gender || "N/A",
          uniquePetId: p.uniquePetId || "Existing",
          isExisting: true,
          raw: p,
        }));

      const newlyAdded = (addNewPetForExisting ? newPetsForExisting : []).map((p, idx) => ({
        id: `new_ext_${idx}`,
        petName: p.petName || `New Pet ${idx + 1}`,
        species: p.species || "Dog",
        breed: p.breed || "N/A",
        gender: p.gender || "Male",
        uniquePetId: "New Registration",
        isExisting: false,
        raw: p,
      }));

      return [...selectedExisting, ...newlyAdded];
    } else {
      return newOwnerPets.map((p, idx) => ({
        id: `new_owner_${idx}`,
        petName: p.petName || `Pet ${idx + 1}`,
        species: p.species || "Dog",
        breed: p.breed || "N/A",
        gender: p.gender || "Male",
        uniquePetId: "New Registration",
        isExisting: false,
        raw: p,
      }));
    }
  }, [mobileExists, existingPets, selectedExistingPetIds, addNewPetForExisting, newPetsForExisting, newOwnerPets]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const [doctorDetailsResponse, doctorStaffResponse] = await Promise.allSettled([
          getDoctors(),
          getDoctorStaff(),
        ]);
        const doctorDetails =
          doctorDetailsResponse.status === "fulfilled"
            ? normalizeDoctorList(doctorDetailsResponse.value)
            : [];
        const doctorStaff =
          doctorStaffResponse.status === "fulfilled"
            ? normalizeDoctorList(doctorStaffResponse.value)
            : [];
        const doctorMap = new Map();
        [...doctorDetails, ...doctorStaff].forEach((doctor) => {
          const optionValue = getDoctorOptionValue(doctor);
          if (optionValue) doctorMap.set(optionValue, doctor);
        });
        setDoctors(Array.from(doctorMap.values()));
      } catch (error) {
        console.error("Doctors fetch failed:", error);
      }
    };
    fetchDoctors();
  }, []);

  const setField = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const checkMobileNumber = async (digits) => {
    if (!digits || digits.length !== 10 || !/^[6-9]\d{9}$/.test(digits)) {
      setMobileExists(false);
      setExistingOwnerId(null);
      setExistingPets([]);
      setSelectedExistingPetIds([]);
      return;
    }

    setSearchingMobile(true);
    try {
      const res = await searchCustomer(digits);
      const owner = res?.data;

      if (owner && owner._id) {
        setMobileExists(true);
        setExistingOwnerId(owner._id);
        const petsList = owner.pets || [];
        setExistingPets(petsList);
        setSelectedExistingPetIds(petsList.map((p) => p._id));

        setFormData((prev) => ({
          ...prev,
          ownerName: owner.ownerName || "",
          ownerIdType: owner.ownerIdType || "Aadhaar Card",
          email: owner.email || "",
          address: owner.address || "",
          state: owner.state || "",
          city: owner.city || "",
          district: owner.district || "",
          pincode: owner.pincode || "",
          visitType: "Follow-up",
        }));

        if (owner.pincode && owner.pincode.length === 6) {
          validatePincode(owner.pincode);
        }

        // Auto trigger OTP for existing customer
        try {
          const otpRes = await sendRegistrationOtp(digits);
          setOtpSent(true);
          if (otpRes?.data?.otp) {
            setField("otp", otpRes.data.otp);
          }
          showToast({
            type: "success",
            title: "Existing Owner Found",
            description: "Owner details loaded. OTP sent automatically.",
          });
        } catch (otpErr) {
          console.error("Auto OTP error:", otpErr);
        }
      } else {
        setMobileExists(false);
        setExistingOwnerId(null);
        setExistingPets([]);
        setSelectedExistingPetIds([]);
        showToast({
          type: "info",
          title: "New Customer",
          description: "Mobile number not found. Proceeding with new registration.",
        });
      }
    } catch (err) {
      console.error("Mobile search failed:", err);
    } finally {
      setSearchingMobile(false);
    }
  };

  const validatePincode = async (pin) => {
    if (!pin || pin.length !== 6 || !/^\d{6}$/.test(pin)) {
      setPincodeValid(null);
      setPincodeLoading(false);
      setPincodeDetails("");
      return;
    }

    setPincodeLoading(true);
    setPincodeValid(null);
    setPincodeDetails("Verifying PIN code...");

    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = await res.json();

      if (Array.isArray(data) && data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
        const poList = data[0].PostOffice;
        const po = poList[0];
        const districtName = po.District || po.Block || po.Circle || po.Division || "";
        const stateName = po.State || "";
        const postOfficeName = po.Name || "";
        const matchedState = matchStateFromList(stateName, states);

        if (matchedState) {
          const stateIso = matchedState.isoCode;
          const stateCities = City.getCitiesOfState("IN", stateIso) || [];
          let selectedCityName = "";
          const candidates = [po.District, po.Block, po.Circle, po.Division, po.Name].filter(Boolean);

          for (const cand of candidates) {
            const candClean = cleanStr(cand);
            const foundCity = stateCities.find((c) => cleanStr(c.name) === candClean);
            if (foundCity) {
              selectedCityName = foundCity.name;
              break;
            }
          }

          if (!selectedCityName) {
            selectedCityName = districtName || (stateCities[0] ? stateCities[0].name : "");
          }

          setFormData((prev) => ({
            ...prev,
            pincode: pin,
            state: stateIso,
            city: selectedCityName,
            district: districtName || selectedCityName,
          }));

          setErrors((prev) => ({
            ...prev,
            pincode: "",
            state: "",
            city: "",
            district: "",
          }));

          setPincodeValid(true);
          setPincodeLoading(false);
          setPincodeDetails(
            `${postOfficeName ? postOfficeName + ", " : ""}${districtName ? districtName + ", " : ""}${matchedState.name}`
          );
          return;
        }
      }

      setPincodeValid(false);
      setPincodeLoading(false);
      setPincodeDetails("Invalid Indian PIN code.");
      setErrors((prev) => ({
        ...prev,
        pincode: "Invalid PIN code. Please enter a valid 6-digit Indian PIN code.",
      }));
    } catch (err) {
      console.error("PIN code lookup failed:", err);
      setPincodeLoading(false);
      setPincodeValid(null);
      setPincodeDetails("");
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "mobileNumber") {
      const digits = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, mobileNumber: digits }));
      setOtpSent(false);

      if (!digits) {
        setErrors((prev) => ({ ...prev, mobileNumber: "" }));
        setMobileExists(false);
        setExistingOwnerId(null);
        setExistingPets([]);
      } else if (!/^[6-9]/.test(digits)) {
        setErrors((prev) => ({
          ...prev,
          mobileNumber: "Mobile number must start with 6, 7, 8, or 9.",
        }));
      } else if (digits.length < 10) {
        setErrors((prev) => ({
          ...prev,
          mobileNumber: `Mobile number must be 10 digits (${digits.length}/10).`,
        }));
      } else {
        setErrors((prev) => ({ ...prev, mobileNumber: "" }));
        checkMobileNumber(digits);
      }
      return;
    }

    if (name === "pincode") {
      const digits = value.replace(/\D/g, "").slice(0, 6);
      setFormData((prev) => ({ ...prev, pincode: digits }));
      setErrors((prev) => ({ ...prev, pincode: "" }));

      if (digits.length === 6) {
        validatePincode(digits);
      } else {
        setPincodeValid(null);
        setPincodeLoading(false);
        setPincodeDetails("");
      }
      return;
    }

    if (name === "state") {
      setFormData((prev) => ({
        ...prev,
        state: value,
        city: "",
        district: "",
      }));
      setErrors((prev) => ({ ...prev, state: "", city: "", district: "" }));
      return;
    }

    if (name === "city") {
      setFormData((prev) => ({ ...prev, city: value, district: value }));
      setErrors((prev) => ({ ...prev, city: "", district: "" }));
      return;
    }

    setField(name, value);
  };

  const handleSendOtp = async () => {
    const cleanMobile = (formData.mobileNumber || "").trim();

    if (!cleanMobile || cleanMobile.length !== 10 || !/^[6-9]\d{9}$/.test(cleanMobile)) {
      setErrors((prev) => ({
        ...prev,
        mobileNumber: "Valid 10-digit mobile number starting with 6-9 is required.",
      }));
      showToast({
        type: "error",
        title: "Invalid Mobile",
        description: "Please enter a valid 10-digit Indian mobile number.",
      });
      return;
    }

    try {
      const otpResponse = await sendRegistrationOtp(formData.mobileNumber);
      setOtpSent(true);
      if (otpResponse?.data?.otp) {
        setField("otp", otpResponse.data.otp);
      }
      showToast({
        type: "success",
        title: "OTP Sent",
        description: "OTP generated successfully.",
      });
    } catch (error) {
      console.error("Send OTP failed:", error);
      showToast({
        type: "error",
        title: "OTP Failed",
        description: error?.response?.data?.message || "Unable to send OTP.",
      });
    }
  };

  // Helper methods for multi-pet management
  const toggleExistingPetSelection = (petId) => {
    setSelectedExistingPetIds((prev) =>
      prev.includes(petId) ? prev.filter((id) => id !== petId) : [...prev, petId]
    );
  };

  const handleAddNewPetForExisting = () => {
    setAddNewPetForExisting(true);
    setNewPetsForExisting((prev) => [
      ...prev,
      {
        petName: "",
        species: "Dog",
        breed: "",
        gender: "Male",
        dob: "",
        age: "",
        color: "",
        rfid: "",
        sterilized: "No",
      },
    ]);
  };

  const handleRemoveNewPetForExisting = (index) => {
    setNewPetsForExisting((prev) => prev.filter((_, i) => i !== index));
    if (newPetsForExisting.length <= 1) {
      setAddNewPetForExisting(false);
    }
  };

  const handleNewPetForExistingChange = (index, field, value) => {
    setNewPetsForExisting((prev) => {
      const list = [...prev];
      if (field === "dob") {
        list[index].dob = value;
        list[index].age = calculateAge(value);
      } else {
        list[index][field] = value;
      }
      return list;
    });
  };

  const handleAddPetForNewOwner = () => {
    setNewOwnerPets((prev) => [
      ...prev,
      {
        petName: "",
        species: "Dog",
        breed: "",
        gender: "Male",
        dob: "",
        age: "",
        color: "",
        rfid: "",
        identificationArea: "",
        sterilized: "No",
      },
    ]);
  };

  const handleRemovePetForNewOwner = (index) => {
    if (newOwnerPets.length <= 1) return;
    setNewOwnerPets((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNewOwnerPetChange = (index, field, value) => {
    setNewOwnerPets((prev) => {
      const list = [...prev];
      if (field === "dob") {
        list[index].dob = value;
        list[index].age = calculateAge(value);
      } else {
        list[index][field] = value;
      }
      return list;
    });
  };

  // Per-pet History & Visit handlers
  const handlePetHistoryChange = (petId, field, value) => {
    setPetHistoriesMap((prev) => ({
      ...prev,
      [petId]: {
        ...(prev[petId] || defaultHistory),
        [field]: value,
      },
    }));
  };

  const handlePetVisitChange = (petId, field, value) => {
    setPetVisitsMap((prev) => ({
      ...prev,
      [petId]: {
        ...(prev[petId] || defaultVisitReason),
        [field]: value,
      },
    }));
  };

  const copyHistoryToAllPets = (sourcePetId) => {
    const sourceData = petHistoriesMap[sourcePetId] || defaultHistory;
    const updatedMap = {};
    activePets.forEach((p) => {
      updatedMap[p.id] = { ...sourceData };
    });
    setPetHistoriesMap(updatedMap);
    showToast({
      type: "success",
      title: "History Copied",
      description: "Medical history details copied to all selected pets.",
    });
  };

  const applyVisitReasonToAllPets = (sourcePetId) => {
    const sourceData = petVisitsMap[sourcePetId] || defaultVisitReason;
    const updatedMap = {};
    activePets.forEach((p) => {
      updatedMap[p.id] = { ...sourceData };
    });
    setPetVisitsMap(updatedMap);
    showToast({
      type: "success",
      title: "Reason & Doctor Applied",
      description: "Visit reason and doctor assignment applied to all selected pets.",
    });
  };

  const validateFields = (fields) => {
    const nextErrors = {};
    const required = (name, message) => {
      if (!String(formData[name] || "").trim()) nextErrors[name] = message;
    };

    if (fields.includes("owner")) {
      if (!/^[6-9]\d{9}$/.test(formData.mobileNumber)) {
        nextErrors.mobileNumber = "Enter a valid 10 digit mobile number.";
      }
      if (!otpSent) nextErrors.otp = "Verify OTP before continuing.";
      if (!/^\d{6}$/.test(formData.otp)) nextErrors.otp = "Enter 6 digit OTP.";
      required("ownerName", "Owner name is required.");
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        nextErrors.email = "Enter a valid email address.";
      }
      required("address", "Full address is required.");
      required("state", "State is required.");
      required("city", "City is required.");
      required("district", "District is required.");
      if (!/^\d{6}$/.test(formData.pincode)) {
        nextErrors.pincode = "Enter a valid 6 digit pincode.";
      }
    }

    if (fields.includes("pet")) {
      if (activePets.length === 0) {
        nextErrors.petSelection = "Please select at least one pet or add a pet to continue.";
      }
      if (!mobileExists) {
        newOwnerPets.forEach((p, i) => {
          if (!p.petName.trim()) nextErrors[`petName_${i}`] = `Pet #${i + 1} name is required.`;
          if (!p.breed.trim()) nextErrors[`breed_${i}`] = `Pet #${i + 1} breed is required.`;
        });
      }
    }

    if (fields.includes("visit")) {
      let missingPetName = null;
      let missingPetIndex = -1;
      activePets.forEach((p, idx) => {
        const v = petVisitsMap[p.id] || defaultVisitReason;
        if (!v.primaryReason || !v.complaint || !v.assignedDoctor) {
          if (!missingPetName) {
            missingPetName = p.petName;
            missingPetIndex = idx;
          }
        }
      });
      if (missingPetName) {
        if (missingPetIndex !== -1) {
          setActiveVisitPetIndex(missingPetIndex);
        }
        nextErrors.visitDetails = `Please select Primary Reason, Complaint and Assigned Doctor for ${missingPetName}.`;
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = () => {
    const isValid =
      step === 1 ? validateFields(["owner"]) : step === 2 ? validateFields(["pet"]) : true;
    if (isValid) setStep((prev) => prev + 1);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateFields(["owner", "pet", "visit"])) return;

    try {
      if (mobileExists && existingOwnerId) {
        // Update owner details if edited
        await updateOwner(existingOwnerId, {
          ownerName: formData.ownerName,
          ownerIdType: formData.ownerIdType,
          email: formData.email,
          address: formData.address,
          state: selectedState?.name || formData.state,
          city: formData.city,
          district: formData.district,
          pincode: formData.pincode,
        });

        // Process each active pet
        for (const pet of activePets) {
          const visitData = petVisitsMap[pet.id] || defaultVisitReason;
          const historyData = petHistoriesMap[pet.id] || defaultHistory;

          if (pet.isExisting) {
            // Existing pet visit
            await addVisit(existingOwnerId, pet.id, visitData);
          } else {
            // Newly added pet for existing owner
            const res = await addPet(existingOwnerId, {
              ...pet.raw,
              name: pet.raw.petName,
              history: historyData,
            });
            const updatedOwner = res?.data;
            const addedPet = updatedOwner?.pets?.[updatedOwner.pets.length - 1];
            if (addedPet?._id) {
              await addVisit(existingOwnerId, addedPet._id, visitData);
            }
          }
        }

        showToast({
          type: "success",
          title: "Visit Intake Created",
          description: `Visits created successfully for ${activePets.length} pet(s).`,
        });
        navigate("/clinic/reception");
      } else {
        // New Owner Registration with Multi-Pet & Per-Pet History / Visit support
        const petsToRegister = activePets.map((p) => {
          const hist = petHistoriesMap[p.id] || defaultHistory;
          const vis = petVisitsMap[p.id] || defaultVisitReason;
          const petNameVal = p.petName || p.raw?.petName || p.raw?.name || "Pet";

          return {
            name: petNameVal,
            petName: petNameVal,
            species: p.raw?.species || p.species || "Dog",
            breed: p.raw?.breed || p.breed || "N/A",
            gender: p.raw?.gender || p.gender || "Male",
            dob: p.raw?.dob || "",
            age: p.raw?.age || "",
            color: p.raw?.color || "",
            rfid: p.raw?.rfid || "",
            identificationArea: p.raw?.identificationArea || "",
            sterilized: p.raw?.sterilized || "No",
            history: {
              vaccinations: hist.vaccineName ? [{ name: hist.vaccineName, date: hist.vaccinationDate }] : [],
              dewormings: hist.dewormingProduct ? [{ product: hist.dewormingProduct, date: hist.dewormingDate }] : [],
              surgeries: hist.surgicalProcedure ? [{ procedure: hist.surgicalProcedure, date: hist.surgeryDate }] : [],
              treatments: hist.treatment ? [{ details: hist.treatment, date: hist.treatmentDate }] : [],
              allergies: hist.allergies || "",
              currentMedications: hist.medications || "",
            },
            visit: {
              primaryReason: vis.primaryReason,
              complaint: vis.complaint,
              appointmentDate: vis.appointmentDate,
              appointmentTime: vis.appointmentTime,
              assignedDoctor: vis.assignedDoctor,
              status: "Pending",
            },
          };
        });

        await registerOwnerAndPet({
          ...formData,
          state: selectedState?.name || formData.state,
          pets: petsToRegister,
        });

        showToast({
          type: "success",
          title: "Registration Success",
          description: `Registered owner & ${petsToRegister.length} pet(s) with visits successfully.`,
        });

        navigate("/clinic/reception");
      }
    } catch (error) {
      console.error("Registration Failed:", error);
      showToast({
        type: "error",
        title: "Operation Failed",
        description: error?.response?.data?.message || "Unable to complete registration.",
      });
    }
  };

  const progressPercentage = Math.round((step / steps.length) * 100);

  // Active pet objects for Step 3 & Step 4 views
  const currentHistoryPet = activePets[activeHistoryPetIndex] || activePets[0] || null;
  const currentVisitPet = activePets[activeVisitPetIndex] || activePets[0] || null;

  return (
    <>
      {showModal && (
        <div className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
          <div className="bg-white w-full max-w-5xl h-[calc(100vh-4rem)] rounded-3xl shadow-2xl shadow-slate-200/80 border border-slate-200/70 flex flex-col overflow-hidden">
            {/* Top Modal Header */}
            <div className="flex justify-between items-center px-6 sm:px-8 py-5 border-b border-slate-100 bg-white rounded-t-3xl">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
                  <span>Patient Intake & Registration</span>
                  <Sparkles className="w-5 h-5 text-orange-500" />
                </h1>
                <p className="text-slate-500 text-xs sm:text-sm mt-0.5 font-medium">
                  {mobileExists ? "Existing Owner Intake & Multi-Pet Visit Setup" : "Veterinary Patient Intake & Case Creation"}
                </p>
              </div>

              <div className="bg-orange-50 border border-orange-200/80 rounded-2xl px-3.5 py-1.5 flex items-center gap-2 shrink-0">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                <span className="text-xs font-bold text-orange-700">
                  Step {step} of {steps.length} ({progressPercentage}%)
                </span>
              </div>
            </div>

            {/* Stepper Header */}
            <div className="bg-slate-50/90 border-b border-slate-200/70 px-4 sm:px-8 py-5">
              <div className="max-w-3xl mx-auto">
                <div className="relative pt-1 pb-1">
                  <div className="absolute top-[20px] left-6 right-6 h-1 bg-slate-200 rounded-full z-0" />
                  <div
                    className="absolute top-[20px] left-6 h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500 rounded-full z-0 transition-all duration-500 ease-out"
                    style={{
                      width: `calc(${((step - 1) / (steps.length - 1)) * 100}% - ${
                        step === 1 ? 0 : 12
                      }px)`,
                    }}
                  />

                  <div className="relative z-10 flex justify-between items-start">
                    {steps.map((item, index) => {
                      const isCompleted = step > index + 1;
                      const isActive = step === index + 1;
                      const IconComponent = item.icon;

                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            if (index + 1 < step) setStep(index + 1);
                          }}
                          className={`flex flex-col items-center group select-none transition-all duration-200 ${
                            index + 1 <= step ? "cursor-pointer" : "cursor-not-allowed opacity-75"
                          }`}
                        >
                          <div
                            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                              isCompleted
                                ? "bg-emerald-500 text-white shadow-md shadow-emerald-200 ring-4 ring-emerald-50 hover:bg-emerald-600 scale-105"
                                : isActive
                                ? "bg-gradient-to-tr from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-200 ring-4 ring-orange-100 scale-110"
                                : "bg-white text-slate-400 border border-slate-200 shadow-xs"
                            }`}
                          >
                            {isCompleted ? (
                              <Check className="w-5 h-5 stroke-[2.5]" />
                            ) : (
                              <IconComponent className="w-5 h-5" />
                            )}
                          </div>

                          <div className="mt-2 text-center">
                            <p
                              className={`text-xs font-bold transition-colors ${
                                isCompleted
                                  ? "text-emerald-700"
                                  : isActive
                                  ? "text-orange-600 font-extrabold"
                                  : "text-slate-400"
                              }`}
                            >
                              {item.title}
                            </p>
                            <p className="hidden sm:block text-[11px] text-slate-400 font-medium mt-0.5">
                              {item.subtitle}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden p-6 sm:p-8">
              {/* STEP 1: OWNER VERIFICATION */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
                      <UserCheck className="w-6 h-6 text-orange-500" />
                      <span>Owner Verification</span>
                    </h2>

                    {mobileExists && (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5">
                        <BadgeCheck className="w-4 h-4 text-emerald-600" />
                        Existing Owner Found
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        Mobile Number <span className="text-red-500 font-bold ml-1">*</span>
                      </label>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            name="mobileNumber"
                            value={formData.mobileNumber}
                            onChange={handleChange}
                            maxLength="10"
                            placeholder="Enter 10 Digit Mobile Number"
                            className="w-full border border-slate-200 rounded-xl p-3 bg-white text-slate-700 font-medium focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition outline-none pr-10"
                          />
                          {searchingMobile && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-500">
                              <Loader2 className="w-4 h-4 animate-spin" />
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-2.5 rounded-xl font-semibold transition cursor-pointer border-none shrink-0 flex items-center justify-center gap-2"
                        >
                          <span>{otpSent ? "Resend OTP" : "Send OTP"}</span>
                        </button>
                      </div>
                      <ErrorText errors={errors} name="mobileNumber" />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        OTP Verification <span className="text-red-500 font-bold ml-1">*</span>
                      </label>
                      <input
                        type="text"
                        name="otp"
                        value={formData.otp}
                        onChange={handleChange}
                        maxLength="6"
                        placeholder="Enter 6 Digit OTP"
                        className={inputClass}
                      />
                      <ErrorText errors={errors} name="otp" />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        Visit Type <span className="text-red-500 font-bold ml-1">*</span>
                      </label>
                      <select
                        name="visitType"
                        value={formData.visitType}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="New">New</option>
                        <option value="Follow-up">Follow-up</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        Owner Name <span className="text-red-500 font-bold ml-1">*</span>
                      </label>
                      <input
                        type="text"
                        name="ownerName"
                        value={formData.ownerName}
                        onChange={handleChange}
                        placeholder="Owner Name"
                        className={inputClass}
                      />
                      <ErrorText errors={errors} name="ownerName" />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        Owner ID <span className="text-red-500 font-bold ml-1">*</span>
                      </label>
                      <select
                        name="ownerIdType"
                        value={formData.ownerIdType}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option>Aadhaar Card</option>
                        <option>PAN Card</option>
                        <option>Other Govt ID</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        Email Address
                      </label>
                      <input
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        type="email"
                        placeholder="Email Address"
                        className={inputClass}
                      />
                      <ErrorText errors={errors} name="email" />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        Full Address <span className="text-red-500 font-bold ml-1">*</span>
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="2"
                        placeholder="Enter Full Address"
                        className={inputClass}
                      />
                      <ErrorText errors={errors} name="address" />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                        <span>Pincode <span className="text-red-500 font-bold ml-1">*</span></span>
                        {pincodeLoading && (
                          <span className="text-[11px] text-orange-500 font-semibold flex items-center gap-1">
                            <Loader2 className="w-3 h-3 animate-spin" /> Verifying...
                          </span>
                        )}
                        {pincodeValid === true && (
                          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                            <BadgeCheck className="w-3.5 h-3.5 text-emerald-500" /> Valid Pincode
                          </span>
                        )}
                      </label>
                      <div className="relative">
                        <input
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleChange}
                          type="text"
                          maxLength="6"
                          placeholder="6 Digit PIN Code"
                          className={inputClass}
                        />
                      </div>
                      {pincodeDetails && pincodeValid === true && (
                        <p className="mt-1.5 text-xs text-emerald-700 font-medium flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-emerald-500 shrink-0" /> {pincodeDetails}
                        </p>
                      )}
                      <ErrorText errors={errors} name="pincode" />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        State <span className="text-red-500 font-bold ml-1">*</span>
                      </label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="">Select State</option>
                        {states.map((item) => (
                          <option key={item.isoCode} value={item.isoCode}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                      <ErrorText errors={errors} name="state" />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        City <span className="text-red-500 font-bold ml-1">*</span>
                      </label>
                      <select
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        disabled={!formData.state}
                        className={inputClass}
                      >
                        <option value="">Select City</option>
                        {cities.map((item) => (
                          <option
                            key={`${item.name}-${item.latitude || "0"}`}
                            value={item.name}
                          >
                            {item.name}
                          </option>
                        ))}
                      </select>
                      <ErrorText errors={errors} name="city" />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        District <span className="text-red-500 font-bold ml-1">*</span>
                      </label>
                      <select
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        disabled={!formData.state && !formData.city}
                        className={inputClass}
                      >
                        <option value="">Select District</option>
                        {formData.district && <option value={formData.district}>{formData.district}</option>}
                        {formData.city && formData.city !== formData.district && (
                          <option value={formData.city}>{formData.city}</option>
                        )}
                      </select>
                      <ErrorText errors={errors} name="district" />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: PET REGISTRATION & SELECTION */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
                      <PawPrint className="w-6 h-6 text-orange-500" />
                      <span>Pet Registration & Selection</span>
                    </h2>
                    <span className="text-xs text-slate-500 font-medium">
                      Select or Add Multiple Pets for Visit
                    </span>
                  </div>

                  {errors.petSelection && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {errors.petSelection}
                    </div>
                  )}

                  {/* EXISTING OWNER: PET SELECTION GRID */}
                  {mobileExists ? (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">
                          Select Existing Registered Pet(s) for Visit:
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {existingPets.map((p) => {
                            const isSelected = selectedExistingPetIds.includes(p._id);
                            return (
                              <div
                                key={p._id}
                                onClick={() => toggleExistingPetSelection(p._id)}
                                className={`p-4 rounded-2xl border-2 transition cursor-pointer flex items-start justify-between gap-3 ${
                                  isSelected
                                    ? "bg-orange-50/50 border-orange-500 shadow-md shadow-orange-100"
                                    : "bg-white border-slate-200 hover:border-slate-300"
                                }`}
                              >
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-extrabold text-slate-800 text-base">
                                      {p.petName || p.name}
                                    </span>
                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-md uppercase">
                                      {p.species}
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-500 font-medium mt-1">
                                    Breed: <span className="text-slate-700 font-semibold">{p.breed || "N/A"}</span> • Gender: <span className="text-slate-700 font-semibold">{p.gender || "N/A"}</span>
                                  </p>
                                  {p.uniquePetId && (
                                    <p className="text-[11px] font-mono text-orange-600 mt-1 font-semibold">
                                      ID: {p.uniquePetId}
                                    </p>
                                  )}
                                </div>
                                <div className="mt-0.5 text-orange-500">
                                  {isSelected ? (
                                    <CheckSquare className="w-6 h-6 fill-orange-500 text-white" />
                                  ) : (
                                    <Square className="w-6 h-6 text-slate-300" />
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* ADD NEW PET FOR EXISTING OWNER TOGGLE */}
                      <div className="border-t border-slate-100 pt-5">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-bold text-slate-800">
                              Register a New Pet for this Owner?
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Add an additional pet to this owner's account
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={handleAddNewPetForExisting}
                            className="bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                          >
                            <Plus className="w-4 h-4" />
                            Add New Pet
                          </button>
                        </div>

                        {addNewPetForExisting && newPetsForExisting.length > 0 && (
                          <div className="mt-4 space-y-4">
                            {newPetsForExisting.map((pet, idx) => (
                              <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 relative">
                                <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                                  <span className="text-xs font-extrabold text-orange-600 uppercase">
                                    New Pet #{idx + 1} Details
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveNewPetForExisting(idx)}
                                    className="text-red-500 hover:text-red-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" /> Remove
                                  </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                                      Pet Name *
                                    </label>
                                    <input
                                      type="text"
                                      value={pet.petName}
                                      onChange={(e) => handleNewPetForExistingChange(idx, "petName", e.target.value)}
                                      placeholder="Pet Name"
                                      className={inputClass}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                                      Species *
                                    </label>
                                    <select
                                      value={pet.species}
                                      onChange={(e) => handleNewPetForExistingChange(idx, "species", e.target.value)}
                                      className={inputClass}
                                    >
                                      <option>Dog</option>
                                      <option>Cat</option>
                                      <option>Rabbit</option>
                                      <option>Bird</option>
                                      <option>Other</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                                      Breed *
                                    </label>
                                    <input
                                      type="text"
                                      value={pet.breed}
                                      onChange={(e) => handleNewPetForExistingChange(idx, "breed", e.target.value)}
                                      placeholder="Breed"
                                      className={inputClass}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                                      Gender *
                                    </label>
                                    <select
                                      value={pet.gender}
                                      onChange={(e) => handleNewPetForExistingChange(idx, "gender", e.target.value)}
                                      className={inputClass}
                                    >
                                      <option>Male</option>
                                      <option>Female</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* NEW OWNER: MULTI-PET REGISTRATION FORM */
                    <div className="space-y-6">
                      {newOwnerPets.map((petItem, idx) => (
                        <div key={idx} className="p-5 bg-slate-50/70 rounded-3xl border border-slate-200/80 space-y-4">
                          <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                            <span className="text-xs font-extrabold text-orange-600 uppercase tracking-wider">
                              Pet #{idx + 1} Details
                            </span>
                            {newOwnerPets.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemovePetForNewOwner(idx)}
                                className="text-red-500 hover:text-red-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" /> Remove Pet
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                Pet Name <span className="text-red-500 font-bold ml-1">*</span>
                              </label>
                              <input
                                type="text"
                                value={petItem.petName}
                                onChange={(e) => handleNewOwnerPetChange(idx, "petName", e.target.value)}
                                placeholder="Enter Pet Name"
                                className={inputClass}
                              />
                              <ErrorText errors={errors} name={`petName_${idx}`} />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                Species <span className="text-red-500 font-bold ml-1">*</span>
                              </label>
                              <select
                                value={petItem.species}
                                onChange={(e) => handleNewOwnerPetChange(idx, "species", e.target.value)}
                                className={inputClass}
                              >
                                <option>Dog</option>
                                <option>Cat</option>
                                <option>Rabbit</option>
                                <option>Bird</option>
                                <option>Other</option>
                              </select>
                            </div>

                             <div>
                               <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                 Breed <span className="text-red-500 font-bold ml-1">*</span>
                               </label>
                               <input
                                 type="text"
                                 value={petItem.breed}
                                 onChange={(e) => handleNewOwnerPetChange(idx, "breed", e.target.value)}
                                 placeholder="Enter Breed"
                                 className={inputClass}
                               />
                               <ErrorText errors={errors} name={`breed_${idx}`} />
                             </div>

                             <div>
                               <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                 Gender <span className="text-red-500 font-bold ml-1">*</span>
                               </label>
                               <select
                                 value={petItem.gender}
                                 onChange={(e) => handleNewOwnerPetChange(idx, "gender", e.target.value)}
                                 className={inputClass}
                               >
                                 <option value="Male">1. Male</option>
                                 <option value="Female">2. Female</option>
                               </select>
                             </div>

                             <div>
                               <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                 Date of birth (date)
                               </label>
                               <input
                                 type="date"
                                 value={petItem.dob}
                                 max={today}
                                 onChange={(e) => handleNewOwnerPetChange(idx, "dob", e.target.value)}
                                 className={inputClass}
                               />
                             </div>

                             <div>
                               <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                 Age (number)
                               </label>
                               <input
                                 type="text"
                                 value={petItem.age}
                                 readOnly
                                 placeholder="Calculated from DOB"
                                 className={`${inputClass} bg-slate-100 text-slate-500`}
                               />
                             </div>

                             <div>
                               <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                 Color (text)
                               </label>
                               <input
                                 type="text"
                                 value={petItem.color}
                                 onChange={(e) => handleNewOwnerPetChange(idx, "color", e.target.value)}
                                 placeholder="Color / Coat pattern"
                                 className={inputClass}
                               />
                             </div>

                             <div>
                               <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                 RFID / Microchip tag no (text)
                               </label>
                               <input
                                 type="text"
                                 value={petItem.rfid}
                                 onChange={(e) => handleNewOwnerPetChange(idx, "rfid", e.target.value)}
                                 placeholder="RFID Tag Number"
                                 className={inputClass}
                               />
                             </div>

                             <div>
                               <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                 Is sterilized (toggle yes or no)
                               </label>
                               <select
                                 value={petItem.sterilized}
                                 onChange={(e) => handleNewOwnerPetChange(idx, "sterilized", e.target.value)}
                                 className={inputClass}
                               >
                                 <option value="No">No</option>
                                 <option value="Yes">Yes</option>
                               </select>
                             </div>

                             <div>
                               <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                 Unique Pet ID (auto generated)
                               </label>
                               <input
                                 type="text"
                                 value={petItem.uniquePetId || "PET-AUTO"}
                                 readOnly
                                 className={`${inputClass} bg-slate-100 text-orange-600 font-mono font-bold`}
                               />
                             </div>

                             <div className="md:col-span-2">
                               <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                 Identification Area (textarea)
                               </label>
                               <textarea
                                 rows="2"
                                 value={petItem.identificationArea || ""}
                                 onChange={(e) => handleNewOwnerPetChange(idx, "identificationArea", e.target.value)}
                                 placeholder="Physical identification marks, scars, ear notches..."
                                 className={inputClass}
                               />
                             </div>

                             <div className="md:col-span-2">
                               <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                 Pet photo (img upload)
                               </label>
                               <div className="flex items-center gap-4 p-4 border border-dashed border-slate-300 rounded-2xl bg-slate-50/50">
                                 <input
                                   type="file"
                                   accept="image/*"
                                   onChange={(e) => {
                                     const file = e.target.files[0];
                                     if (file) {
                                       const reader = new FileReader();
                                       reader.onloadend = () => {
                                         handleNewOwnerPetChange(idx, "photo", reader.result);
                                       };
                                       reader.readAsDataURL(file);
                                     }
                                   }}
                                   className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer"
                                 />
                                 {petItem.photo && (
                                   <img
                                     src={petItem.photo}
                                     alt="Pet Preview"
                                     className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-xs"
                                   />
                                 )}
                               </div>
                             </div>
                          </div>
                        </div>
                      ))}

                      {/* ADD ANOTHER PET BUTTON FOR NEW OWNER */}
                      <button
                        type="button"
                        onClick={handleAddPetForNewOwner}
                        className="w-full py-3 bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200 border-dashed rounded-2xl font-bold transition cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Plus className="w-5 h-5" />
                        <span>+ Add Another Pet for this Owner</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: PET HISTORY (MULTI-PET TABBED VIEW) */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
                      <FileText className="w-6 h-6 text-orange-500" />
                      <span>Pet Medical History</span>
                    </h2>
                    {activePets.length > 1 && (
                      <button
                        type="button"
                        onClick={() => currentHistoryPet && copyHistoryToAllPets(currentHistoryPet.id)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border-none flex items-center gap-1.5 self-start sm:self-auto"
                      >
                        <Copy className="w-3.5 h-3.5 text-orange-500" />
                        Copy History to All Pets
                      </button>
                    )}
                  </div>

                  {/* Multi-Pet Sub Tabs */}
                  {activePets.length > 0 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-100">
                      {activePets.map((pet, idx) => {
                        const isActive = idx === activeHistoryPetIndex;
                        return (
                          <button
                            key={pet.id}
                            type="button"
                            onClick={() => setActiveHistoryPetIndex(idx)}
                            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-2 shrink-0 border ${
                              isActive
                                ? "bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-100"
                                : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            <PawPrint className="w-3.5 h-3.5" />
                            <span>{pet.petName}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-extrabold ${isActive ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"}`}>
                              {pet.species}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {currentHistoryPet && (
                    <div className="space-y-5">
                      <div className="p-3 bg-orange-50/60 border border-orange-100 rounded-2xl flex items-center justify-between">
                        <span className="text-xs font-bold text-orange-800 flex items-center gap-1.5">
                          <PawPrint className="w-4 h-4 text-orange-500" />
                          Entering Medical History for: <strong className="text-orange-950 font-extrabold">{currentHistoryPet.petName}</strong> ({currentHistoryPet.breed})
                        </span>
                        <span className="text-[11px] font-mono font-bold text-orange-600">
                          {currentHistoryPet.uniquePetId}
                        </span>
                      </div>

                      <div className="space-y-6">
                        {/* SECTION 1: Previous Vaccination (multi fields) */}
                        <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200 space-y-4">
                          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                              <span>💉 Previous Vaccination (multi fields)</span>
                            </h3>
                            <button
                              type="button"
                              onClick={() => {
                                const currentHistory = petHistoriesMap[currentHistoryPet.id] || defaultHistory;
                                const currentList = currentHistory.vaccinations && currentHistory.vaccinations.length > 0
                                  ? currentHistory.vaccinations
                                  : [{ vaccineName: currentHistory.vaccineName || "", vaccinationDate: currentHistory.vaccinationDate || "", batchNumber: currentHistory.batchNumber || "", clinicName: currentHistory.clinicName || "" }];
                                const newList = [...currentList, { vaccineName: "", vaccinationDate: "", batchNumber: "", clinicName: "" }];
                                handlePetHistoryChange(currentHistoryPet.id, "vaccinations", newList);
                                handlePetHistoryChange(currentHistoryPet.id, "vaccineName", newList[0].vaccineName);
                              }}
                              className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer border-none"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>+ Add Vaccination Record</span>
                            </button>
                          </div>

                          {(() => {
                            const currentHistory = petHistoriesMap[currentHistoryPet.id] || defaultHistory;
                            const vacList = (currentHistory.vaccinations && currentHistory.vaccinations.length > 0)
                              ? currentHistory.vaccinations
                              : [{ vaccineName: currentHistory.vaccineName || "", vaccinationDate: currentHistory.vaccinationDate || "", batchNumber: currentHistory.batchNumber || "", clinicName: currentHistory.clinicName || "" }];

                            return vacList.map((row, rIdx) => (
                              <div key={rIdx} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-3 bg-white rounded-xl border border-slate-100 relative">
                                <div>
                                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                    1. vaccine {vacList.length > 1 ? `#${rIdx + 1}` : ""}
                                  </label>
                                  <input
                                    type="text"
                                    value={row.vaccineName || ""}
                                    onChange={(e) => {
                                      const newList = [...vacList];
                                      newList[rIdx] = { ...newList[rIdx], vaccineName: e.target.value };
                                      handlePetHistoryChange(currentHistoryPet.id, "vaccinations", newList);
                                      if (rIdx === 0) handlePetHistoryChange(currentHistoryPet.id, "vaccineName", e.target.value);
                                    }}
                                    placeholder="Vaccine Name"
                                    className={inputClass}
                                  />
                                </div>

                                <div>
                                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                    2. date
                                  </label>
                                  <input
                                    type="date"
                                    value={row.vaccinationDate || ""}
                                    onChange={(e) => {
                                      const newList = [...vacList];
                                      newList[rIdx] = { ...newList[rIdx], vaccinationDate: e.target.value };
                                      handlePetHistoryChange(currentHistoryPet.id, "vaccinations", newList);
                                      if (rIdx === 0) handlePetHistoryChange(currentHistoryPet.id, "vaccinationDate", e.target.value);
                                    }}
                                    className={inputClass}
                                  />
                                </div>

                                <div>
                                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                    3. Batch.no
                                  </label>
                                  <input
                                    type="text"
                                    value={row.batchNumber || ""}
                                    onChange={(e) => {
                                      const newList = [...vacList];
                                      newList[rIdx] = { ...newList[rIdx], batchNumber: e.target.value };
                                      handlePetHistoryChange(currentHistoryPet.id, "vaccinations", newList);
                                      if (rIdx === 0) handlePetHistoryChange(currentHistoryPet.id, "batchNumber", e.target.value);
                                    }}
                                    placeholder="Batch Number"
                                    className={inputClass}
                                  />
                                </div>

                                <div className="flex items-end gap-2">
                                  <div className="flex-1">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                      4. Clinic
                                    </label>
                                    <input
                                      type="text"
                                      value={row.clinicName || ""}
                                      onChange={(e) => {
                                        const newList = [...vacList];
                                        newList[rIdx] = { ...newList[rIdx], clinicName: e.target.value };
                                        handlePetHistoryChange(currentHistoryPet.id, "vaccinations", newList);
                                        if (rIdx === 0) handlePetHistoryChange(currentHistoryPet.id, "clinicName", e.target.value);
                                      }}
                                      placeholder="Clinic Name"
                                      className={inputClass}
                                    />
                                  </div>

                                  {vacList.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newList = vacList.filter((_, i) => i !== rIdx);
                                        handlePetHistoryChange(currentHistoryPet.id, "vaccinations", newList);
                                      }}
                                      className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition cursor-pointer border border-rose-200"
                                      title="Remove record"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            ));
                          })()}
                        </div>

                        {/* SECTION 2: Deworming History (multi fields) */}
                        <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200 space-y-4">
                          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                              <span>🪱 Deworming History (multi fields)</span>
                            </h3>
                            <button
                              type="button"
                              onClick={() => {
                                const currentHistory = petHistoriesMap[currentHistoryPet.id] || defaultHistory;
                                const currentList = currentHistory.dewormings && currentHistory.dewormings.length > 0
                                  ? currentHistory.dewormings
                                  : [{ dewormingProduct: currentHistory.dewormingProduct || "", dewormingDate: currentHistory.dewormingDate || "", dose: currentHistory.dose || "" }];
                                const newList = [...currentList, { dewormingProduct: "", dewormingDate: "", dose: "" }];
                                handlePetHistoryChange(currentHistoryPet.id, "dewormings", newList);
                              }}
                              className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer border-none"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>+ Add Deworming Record</span>
                            </button>
                          </div>

                          {(() => {
                            const currentHistory = petHistoriesMap[currentHistoryPet.id] || defaultHistory;
                            const dewList = (currentHistory.dewormings && currentHistory.dewormings.length > 0)
                              ? currentHistory.dewormings
                              : [{ dewormingProduct: currentHistory.dewormingProduct || "", dewormingDate: currentHistory.dewormingDate || "", dose: currentHistory.dose || "" }];

                            return dewList.map((row, rIdx) => (
                              <div key={rIdx} className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-3 bg-white rounded-xl border border-slate-100">
                                <div>
                                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                    1. product {dewList.length > 1 ? `#${rIdx + 1}` : ""}
                                  </label>
                                  <input
                                    type="text"
                                    value={row.dewormingProduct || ""}
                                    onChange={(e) => {
                                      const newList = [...dewList];
                                      newList[rIdx] = { ...newList[rIdx], dewormingProduct: e.target.value };
                                      handlePetHistoryChange(currentHistoryPet.id, "dewormings", newList);
                                      if (rIdx === 0) handlePetHistoryChange(currentHistoryPet.id, "dewormingProduct", e.target.value);
                                    }}
                                    placeholder="Product Name"
                                    className={inputClass}
                                  />
                                </div>

                                <div>
                                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                    2. date
                                  </label>
                                  <input
                                    type="date"
                                    value={row.dewormingDate || ""}
                                    onChange={(e) => {
                                      const newList = [...dewList];
                                      newList[rIdx] = { ...newList[rIdx], dewormingDate: e.target.value };
                                      handlePetHistoryChange(currentHistoryPet.id, "dewormings", newList);
                                      if (rIdx === 0) handlePetHistoryChange(currentHistoryPet.id, "dewormingDate", e.target.value);
                                    }}
                                    className={inputClass}
                                  />
                                </div>

                                <div className="flex items-end gap-2">
                                  <div className="flex-1">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                      3. dose
                                    </label>
                                    <input
                                      type="text"
                                      value={row.dose || ""}
                                      onChange={(e) => {
                                        const newList = [...dewList];
                                        newList[rIdx] = { ...newList[rIdx], dose: e.target.value };
                                        handlePetHistoryChange(currentHistoryPet.id, "dewormings", newList);
                                        if (rIdx === 0) handlePetHistoryChange(currentHistoryPet.id, "dose", e.target.value);
                                      }}
                                      placeholder="Dose (e.g. 1 Tab / 2 ml)"
                                      className={inputClass}
                                    />
                                  </div>

                                  {dewList.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newList = dewList.filter((_, i) => i !== rIdx);
                                        handlePetHistoryChange(currentHistoryPet.id, "dewormings", newList);
                                      }}
                                      className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition cursor-pointer border border-rose-200"
                                      title="Remove record"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            ));
                          })()}
                        </div>

                        {/* SECTION 3: Surgical Procedure (multi fields) */}
                        <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200 space-y-4">
                          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                              <span>🏥 Surgical Procedure (multi fields)</span>
                            </h3>
                            <button
                              type="button"
                              onClick={() => {
                                const currentHistory = petHistoriesMap[currentHistoryPet.id] || defaultHistory;
                                const currentList = currentHistory.surgeries && currentHistory.surgeries.length > 0
                                  ? currentHistory.surgeries
                                  : [{ surgicalProcedure: currentHistory.surgicalProcedure || "", surgeryDate: currentHistory.surgeryDate || "", hospital: currentHistory.hospital || "" }];
                                const newList = [...currentList, { surgicalProcedure: "", surgeryDate: "", hospital: "" }];
                                handlePetHistoryChange(currentHistoryPet.id, "surgeries", newList);
                              }}
                              className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer border-none"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>+ Add Surgery Record</span>
                            </button>
                          </div>

                          {(() => {
                            const currentHistory = petHistoriesMap[currentHistoryPet.id] || defaultHistory;
                            const surgList = (currentHistory.surgeries && currentHistory.surgeries.length > 0)
                              ? currentHistory.surgeries
                              : [{ surgicalProcedure: currentHistory.surgicalProcedure || "", surgeryDate: currentHistory.surgeryDate || "", hospital: currentHistory.hospital || "" }];

                            return surgList.map((row, rIdx) => (
                              <div key={rIdx} className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-3 bg-white rounded-xl border border-slate-100">
                                <div>
                                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                    1. procedure {surgList.length > 1 ? `#${rIdx + 1}` : ""}
                                  </label>
                                  <input
                                    type="text"
                                    value={row.surgicalProcedure || ""}
                                    onChange={(e) => {
                                      const newList = [...surgList];
                                      newList[rIdx] = { ...newList[rIdx], surgicalProcedure: e.target.value };
                                      handlePetHistoryChange(currentHistoryPet.id, "surgeries", newList);
                                      if (rIdx === 0) handlePetHistoryChange(currentHistoryPet.id, "surgicalProcedure", e.target.value);
                                    }}
                                    placeholder="Surgical Procedure Name"
                                    className={inputClass}
                                  />
                                </div>

                                <div>
                                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                    2. date
                                  </label>
                                  <input
                                    type="date"
                                    value={row.surgeryDate || ""}
                                    onChange={(e) => {
                                      const newList = [...surgList];
                                      newList[rIdx] = { ...newList[rIdx], surgeryDate: e.target.value };
                                      handlePetHistoryChange(currentHistoryPet.id, "surgeries", newList);
                                      if (rIdx === 0) handlePetHistoryChange(currentHistoryPet.id, "surgeryDate", e.target.value);
                                    }}
                                    className={inputClass}
                                  />
                                </div>

                                <div className="flex items-end gap-2">
                                  <div className="flex-1">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                      3. hospital
                                    </label>
                                    <input
                                      type="text"
                                      value={row.hospital || ""}
                                      onChange={(e) => {
                                        const newList = [...surgList];
                                        newList[rIdx] = { ...newList[rIdx], hospital: e.target.value };
                                        handlePetHistoryChange(currentHistoryPet.id, "surgeries", newList);
                                        if (rIdx === 0) handlePetHistoryChange(currentHistoryPet.id, "hospital", e.target.value);
                                      }}
                                      placeholder="Hospital / Clinic Name"
                                      className={inputClass}
                                    />
                                  </div>

                                  {surgList.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newList = surgList.filter((_, i) => i !== rIdx);
                                        handlePetHistoryChange(currentHistoryPet.id, "surgeries", newList);
                                      }}
                                      className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition cursor-pointer border border-rose-200"
                                      title="Remove record"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            ));
                          })()}
                        </div>

                        {/* SECTION 4: Past Treatments (Multi fields) */}
                        <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200 space-y-4">
                          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                              <span>💊 Past Treatments (Multi fields)</span>
                            </h3>
                            <button
                              type="button"
                              onClick={() => {
                                const currentHistory = petHistoriesMap[currentHistoryPet.id] || defaultHistory;
                                const currentList = currentHistory.pastTreatments && currentHistory.pastTreatments.length > 0
                                  ? currentHistory.pastTreatments
                                  : [{ condition: currentHistory.condition || "", treatment: currentHistory.treatment || "", treatmentDate: currentHistory.treatmentDate || "" }];
                                const newList = [...currentList, { condition: "", treatment: "", treatmentDate: "" }];
                                handlePetHistoryChange(currentHistoryPet.id, "pastTreatments", newList);
                              }}
                              className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer border-none"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>+ Add Treatment Record</span>
                            </button>
                          </div>

                          {(() => {
                            const currentHistory = petHistoriesMap[currentHistoryPet.id] || defaultHistory;
                            const treatList = (currentHistory.pastTreatments && currentHistory.pastTreatments.length > 0)
                              ? currentHistory.pastTreatments
                              : [{ condition: currentHistory.condition || "", treatment: currentHistory.treatment || "", treatmentDate: currentHistory.treatmentDate || "" }];

                            return treatList.map((row, rIdx) => (
                              <div key={rIdx} className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-3 bg-white rounded-xl border border-slate-100">
                                <div>
                                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                    1. Condition {treatList.length > 1 ? `#${rIdx + 1}` : ""}
                                  </label>
                                  <input
                                    type="text"
                                    value={row.condition || ""}
                                    onChange={(e) => {
                                      const newList = [...treatList];
                                      newList[rIdx] = { ...newList[rIdx], condition: e.target.value };
                                      handlePetHistoryChange(currentHistoryPet.id, "pastTreatments", newList);
                                      if (rIdx === 0) handlePetHistoryChange(currentHistoryPet.id, "condition", e.target.value);
                                    }}
                                    placeholder="Condition Name"
                                    className={inputClass}
                                  />
                                </div>

                                <div>
                                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                    2. Treatment
                                  </label>
                                  <input
                                    type="text"
                                    value={row.treatment || ""}
                                    onChange={(e) => {
                                      const newList = [...treatList];
                                      newList[rIdx] = { ...newList[rIdx], treatment: e.target.value };
                                      handlePetHistoryChange(currentHistoryPet.id, "pastTreatments", newList);
                                      if (rIdx === 0) handlePetHistoryChange(currentHistoryPet.id, "treatment", e.target.value);
                                    }}
                                    placeholder="Treatment details"
                                    className={inputClass}
                                  />
                                </div>

                                <div className="flex items-end gap-2">
                                  <div className="flex-1">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                      3. Date
                                    </label>
                                    <input
                                      type="date"
                                      value={row.treatmentDate || ""}
                                      onChange={(e) => {
                                        const newList = [...treatList];
                                        newList[rIdx] = { ...newList[rIdx], treatmentDate: e.target.value };
                                        handlePetHistoryChange(currentHistoryPet.id, "pastTreatments", newList);
                                        if (rIdx === 0) handlePetHistoryChange(currentHistoryPet.id, "treatmentDate", e.target.value);
                                      }}
                                      className={inputClass}
                                    />
                                  </div>

                                  {treatList.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newList = treatList.filter((_, i) => i !== rIdx);
                                        handlePetHistoryChange(currentHistoryPet.id, "pastTreatments", newList);
                                      }}
                                      className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition cursor-pointer border border-rose-200"
                                      title="Remove record"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            ));
                          })()}
                        </div>

                        {/* SECTION 5 & 6: Known Allergies & Current Medications */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200">
                            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                              Known Allergies (Text)
                            </label>
                            <textarea
                              name="allergies"
                              value={(petHistoriesMap[currentHistoryPet.id] || defaultHistory).allergies || ""}
                              onChange={(e) => handlePetHistoryChange(currentHistoryPet.id, "allergies", e.target.value)}
                              rows="3"
                              placeholder="Describe known allergies..."
                              className={inputClass}
                            />
                          </div>

                          <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200">
                            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                              Current medications (text areas)
                            </label>
                            <textarea
                              name="medications"
                              value={(petHistoriesMap[currentHistoryPet.id] || defaultHistory).medications || ""}
                              onChange={(e) => handlePetHistoryChange(currentHistoryPet.id, "medications", e.target.value)}
                              rows="3"
                              placeholder="Describe current medications..."
                              className={inputClass}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 4: REASON FOR VISIT (MULTI-PET TABBED VIEW) */}
              {step === 4 && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
                      <Stethoscope className="w-6 h-6 text-orange-500" />
                      <span>Reason For Visit & Doctor Assignment</span>
                    </h2>
                    {activePets.length > 1 && (
                      <button
                        type="button"
                        onClick={() => currentVisitPet && applyVisitReasonToAllPets(currentVisitPet.id)}
                        className="bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border-none flex items-center gap-1.5 self-start sm:self-auto"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        Apply Reason & Doctor to All Pets
                      </button>
                    )}
                  </div>

                  {errors.visitDetails && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {errors.visitDetails}
                    </div>
                  )}

                  {/* Multi-Pet Sub Tabs */}
                  {activePets.length > 0 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-100">
                      {activePets.map((pet, idx) => {
                        const isActive = idx === activeVisitPetIndex;
                        const v = petVisitsMap[pet.id] || defaultVisitReason;
                        const isComplete = Boolean(v.primaryReason && v.complaint && v.assignedDoctor);
                        return (
                          <button
                            key={pet.id}
                            type="button"
                            onClick={() => setActiveVisitPetIndex(idx)}
                            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-2 shrink-0 border ${
                              isActive
                                ? "bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-100"
                                : isComplete
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                                : "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
                            }`}
                          >
                            <Stethoscope className="w-3.5 h-3.5" />
                            <span>{pet.petName}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-extrabold ${
                              isActive
                                ? "bg-white/20 text-white"
                                : isComplete
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-900"
                            }`}>
                              {isComplete ? "✓ Ready" : "⚠️ Incomplete"}
                            </span>
                          </button>
                        );
                      })}

                      {activePets.length > 1 && currentVisitPet && (
                        <button
                          type="button"
                          onClick={() => applyVisitReasonToAllPets(currentVisitPet.id)}
                          className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition ml-auto shrink-0 flex items-center gap-1.5 cursor-pointer shadow-xs"
                          title="Copy current visit reason and assigned doctor to all pets"
                        >
                          <span>⚡ Apply to All Pets</span>
                        </button>
                      )}
                    </div>
                  )}

                  {currentVisitPet && (() => {
                    const currentVisit = petVisitsMap[currentVisitPet.id] || defaultVisitReason;
                    const isPrimaryReasonMissing = !currentVisit.primaryReason;
                    const isComplaintMissing = !currentVisit.complaint;
                    const isAssignedDoctorMissing = !currentVisit.assignedDoctor;

                    return (
                      <div className="space-y-5">
                        <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-2xl flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                            <Stethoscope className="w-4 h-4 text-emerald-600" />
                            Visit Setup for: <strong className="text-emerald-950 font-extrabold">{currentVisitPet.petName}</strong> ({currentVisitPet.breed})
                          </span>
                          <span className="text-[11px] font-mono font-bold text-emerald-700">
                            {currentVisitPet.uniquePetId}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                              Primary Reason *
                            </label>
                            <select
                              name="primaryReason"
                              value={currentVisit.primaryReason || ""}
                              onChange={(e) => {
                                handlePetVisitChange(currentVisitPet.id, "primaryReason", e.target.value);
                                if (errors.visitDetails) setErrors((prev) => ({ ...prev, visitDetails: "" }));
                              }}
                              className={`${inputClass} ${errors.visitDetails && isPrimaryReasonMissing ? "border-red-500 ring-2 ring-red-100 bg-red-50/20" : ""}`}
                            >
                              <option value="">Select Reason</option>
                              {reasonOptions.map((item) => (
                                <option key={item} value={item}>
                                  {item}
                                </option>
                              ))}
                            </select>
                            {errors.visitDetails && isPrimaryReasonMissing && (
                              <p className="text-xs text-red-500 font-semibold mt-1">Please select a primary reason.</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                              Token / Queue Number
                            </label>
                            <input
                              value="Auto generated by backend"
                              readOnly
                              className="w-full border rounded-xl p-3 bg-slate-100 text-slate-500 font-medium text-sm"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                              Specific Complaint In Brief *
                            </label>
                            <textarea
                              name="complaint"
                              value={currentVisit.complaint || ""}
                              onChange={(e) => {
                                handlePetVisitChange(currentVisitPet.id, "complaint", e.target.value);
                                if (errors.visitDetails) setErrors((prev) => ({ ...prev, visitDetails: "" }));
                              }}
                              rows="3"
                              placeholder={`Enter complaint details for ${currentVisitPet.petName}`}
                              className={`${inputClass} ${errors.visitDetails && isComplaintMissing ? "border-red-500 ring-2 ring-red-100 bg-red-50/20" : ""}`}
                            />
                            {errors.visitDetails && isComplaintMissing && (
                              <p className="text-xs text-red-500 font-semibold mt-1">Please enter specific complaint details.</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                              Appointment Date *
                            </label>
                            <input
                              name="appointmentDate"
                              value={currentVisit.appointmentDate || today}
                              onChange={(e) => handlePetVisitChange(currentVisitPet.id, "appointmentDate", e.target.value)}
                              type="date"
                              className={inputClass}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                              Appointment Time *
                            </label>
                            <input
                              name="appointmentTime"
                              value={currentVisit.appointmentTime || ""}
                              onChange={(e) => handlePetVisitChange(currentVisitPet.id, "appointmentTime", e.target.value)}
                              type="time"
                              className={inputClass}
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                              Assigned Doctor *
                            </label>
                            <select
                              name="assignedDoctor"
                              value={currentVisit.assignedDoctor || ""}
                              onChange={(e) => {
                                handlePetVisitChange(currentVisitPet.id, "assignedDoctor", e.target.value);
                                if (errors.visitDetails) setErrors((prev) => ({ ...prev, visitDetails: "" }));
                              }}
                              className={`${inputClass} ${errors.visitDetails && isAssignedDoctorMissing ? "border-red-500 ring-2 ring-red-100 bg-red-50/20" : ""}`}
                            >
                              <option value="">Select Doctor</option>
                              {doctors.map((doctor) => (
                                <option key={getDoctorOptionValue(doctor)} value={getDoctorName(doctor)}>
                                  {getDoctorName(doctor) || "Doctor"}
                                </option>
                              ))}
                            </select>
                            {errors.visitDetails && isAssignedDoctorMissing && (
                              <p className="text-xs text-red-500 font-semibold mt-1">Please select an assigned doctor.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* Modal Bottom Footer Navigation */}
            <div className="border-t border-slate-100 p-4 sm:p-5 flex justify-between items-center gap-3 bg-white">
              <button
                disabled={step === 1}
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-2xl font-semibold transition cursor-pointer border-none disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              {step < steps.length ? (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-8 py-3 rounded-2xl font-semibold shadow-md shadow-orange-100 transition cursor-pointer border-none"
                >
                  Next Step
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-3 rounded-2xl font-semibold shadow-md shadow-emerald-100 transition cursor-pointer border-none"
                >
                  Complete Registration & Visit
                  <CheckCircle2 className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
