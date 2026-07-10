import { useEffect, useState } from "react";
import {
    getLabPendingPets,
    getRequiredLabTests,
    uploadLabReports
} from "../../api/labApi";

export default function LabPendingCases() {
    const [cases, setCases] = useState([]);
    const [search, setSearch] = useState("");

    const [selectedCase, setSelectedCase] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const [files, setFiles] = useState({});
    const [showUploadModal, setShowUploadModal] = useState(false);

    useEffect(() => {
        fetchCases();
    }, []);

    const handleFileChange = (field, file) => {
        if (file && file.type !== "application/pdf") {
            alert("Only PDF files allowed");
            return;
        }

        setFiles(prev => ({
            ...prev,
            [field]: file
        }));
    };

    const handleOpenModal = async (item) => {
        try {
            console.log(item);


            const res = await getRequiredLabTests(
                item.pet._id,
                item._id
            );

            console.log(res);
            console.log(res.data);

            setSelectedCase({
                ...item,
                tests: res?.data || []
            });

            setShowModal(true);

        } catch (error) {
            console.error("Error fetching tests:", error);
        }
    };


    const handleFetchTests = async (item) => {
        try {
            const res = await getRequiredLabTests(
                item.pet._id,
                item._id
            );
            console.log(res);
            console.log(res.data);

            return res?.data || [];

        } catch (error) {
            console.error("Error fetching tests:", error);
            return [];
        }
    };
    const handleUpload = async () => {
        const formData = new FormData();

        // append files
        Object.entries(files).forEach(([testName, file]) => {
            if (file) {
                formData.append(testName, file);
            }
        });
        // append extra data
        console.log("selectedCase:", selectedCase);
        console.log("visitId:", selectedCase?._id);
        formData.append("petId", selectedCase.pet._id);
        formData.append("visitId", selectedCase._id);

        try {
            await uploadLabReports(formData);
            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }

            alert("Reports uploaded successfully");
            setShowUploadModal(false);

        } catch (err) {
            console.error(err);
            alert("Upload failed");
        }
    };
    const fetchCases = async () => {
        try {
            const res = await getLabPendingPets();
            setCases(res?.data || []);
        } catch (error) {
            console.error("Error fetching lab cases:", error);
        }
    };

    const filtered = cases.filter((item) =>
        `${item?.pet?.petName} ${item?.owner?.ownerName} ${item?.owner?.phone}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (
        <div className="p-6 bg-gray-100 min-h-screen space-y-6">

            {/* HEADER */}
            <div className="bg-white p-5 rounded-xl shadow">
                <h1 className="text-xl font-bold">Pending Pets</h1>
                <p className="text-gray-500 text-sm">
                    Manage pending pet assessments
                </p>
            </div>

            {/* SEARCH */}
            <div className="bg-white p-4 rounded-xl shadow">
                <input
                    type="text"
                    placeholder="🔍 Search by Token, Owner Name, Phone or Pet Name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full border border-gray-300 p-3 rounded-lg"
                />
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-xl shadow overflow-hidden">

                {/* TOP BAR */}
                <div className="flex justify-between items-center p-5 border-b bg-gray-50">
                    <div>
                        <h2 className="text-lg font-semibold">
                            Pending Pets Queue
                        </h2>
                        <p className="text-sm text-gray-500">
                            Pets waiting for pre consultation assessment
                        </p>
                    </div>

                    <div className="bg-orange-100 text-orange-600 px-4 py-1 rounded-full text-sm font-medium">
                        {filtered.length} Active Cases
                    </div>
                </div>

                {/* TABLE */}
                <table className="w-full text-sm">
                    <thead className="bg-gray-100 text-gray-600">
                        <tr>
                            <th className="text-left p-3">TOKEN</th>
                            <th className="text-left p-3">OWNER DETAILS</th>
                            <th className="text-left p-3">PET DETAILS</th>
                            <th className="text-left p-3">STATUS</th>
                            <th className="text-left p-3">REQUIRED TEST</th>
                            <th className="text-left p-3">ACTION</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filtered.length > 0 ? (
                            filtered.map((item) => (
                                <tr key={item._id} className="border-t hover:bg-gray-50">

                                    <td className="p-3 font-medium">
                                        {item.tokenNumber}
                                    </td>

                                    <td className="p-3">
                                        <p className="font-medium">
                                            {item.owner?.ownerName}
                                        </p>
                                        <p className="text-gray-500 text-xs">
                                            {item.owner?.phone}
                                        </p>
                                    </td>

                                    <td className="p-3">
                                        <p className="font-medium">
                                            {item.pet?.petName}
                                        </p>
                                        <p className="text-gray-500 text-xs">
                                            {item.pet?.breed}
                                        </p>
                                    </td>

                                    <td className="p-3">
                                        <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">
                                            PENDING
                                        </span>
                                    </td>

                                    <td className="p-3">
                                        <button
                                            onClick={() => handleOpenModal(item)}
                                            className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600"
                                        >
                                            Required Tests
                                        </button>
                                    </td>

                                    <td className="p-3">
                                        <button
                                            onClick={async () => {
                                                const tests = await handleFetchTests(item);
                                                console.log("Fetched tests:", tests);
                                                setSelectedCase({
                                                    ...item,
                                                    tests
                                                });

                                                setShowUploadModal(true);
                                            }}
                                            className="bg-blue-500 text-white px-3 py-1 rounded text-sm">
                                            Upload Report
                                        </button>
                                    </td>

                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6">
                                    <div className="text-center py-16 text-gray-500">
                                        🐾
                                        <p className="font-medium mt-2">
                                            No Pending Pets Found
                                        </p>
                                        <p className="text-sm">
                                            Try another search keyword.
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>






            {showUploadModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

                    <div className="bg-white w-[950px] max-w-[95%] rounded-2xl shadow-2xl overflow-hidden">

                        {/* HEADER */}
                        <div className="bg-orange-500 text-white px-6 py-4 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-semibold">
                                    Upload Lab Reports (PDF)
                                </h2>
                                <p className="text-sm opacity-90">
                                    {selectedCase?.pet?.petName} • {selectedCase?.owner?.ownerName}
                                </p>
                            </div>

                            <button
                                onClick={() => setShowUploadModal(false)}
                                className="text-xl font-bold hover:opacity-80"
                            >
                                ✕
                            </button>
                        </div>

                        {/* BODY */}
                        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">

                            <div className="grid grid-cols-2 gap-5">

                                {selectedCase?.tests?.map((field, index) => (

                                    <div
                                        key={index}
                                        className="border rounded-xl p-4 bg-orange-50 hover:shadow-md transition"
                                    >

                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            {field}
                                        </label>

                                        <input
                                            type="file"
                                            accept="application/pdf"
                                            onChange={(e) =>
                                                handleFileChange(field, e.target.files[0])
                                            }
                                            className="w-full text-sm file:bg-orange-500 file:text-white file:px-3 file:py-1 file:border-0 file:rounded-md file:cursor-pointer"
                                        />

                                        {/* FILE NAME PREVIEW */}
                                        {files[field] && (
                                            <p className="text-xs text-green-600 mt-2 truncate">
                                                ✔ {files[field].name}
                                            </p>
                                        )}

                                    </div>

                                ))}

                            </div>

                            {/* REMARKS */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Remarks
                                </label>

                                <textarea
                                    placeholder="Enter report remarks..."
                                    className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                                />
                            </div>

                        </div>

                        {/* FOOTER */}
                        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">

                            <button
                                onClick={() => setShowUploadModal(false)}
                                className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleUpload}
                                className="px-6 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600"
                            >
                                Upload Reports
                            </button>

                        </div>

                    </div>
                </div>
            )}





            {/* ✅ MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

                    <div className="bg-white w-[700px] max-w-[90%] rounded-2xl shadow-2xl overflow-hidden">

                        {/* HEADER */}
                        <div className="bg-orange-500 text-white px-6 py-4 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-semibold">
                                    Required Lab Tests
                                </h2>
                                <p className="text-sm opacity-90">
                                    {selectedCase?.pet?.petName} • {selectedCase?.owner?.ownerName}
                                </p>
                            </div>

                            <button
                                onClick={() => setShowModal(false)}
                                className="text-white text-xl font-bold hover:opacity-80"
                            >
                                ✕
                            </button>
                        </div>

                        {/* BODY */}
                        <div className="p-6 space-y-4">

                            {/* INFO CARD */}
                            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                                <p className="text-sm text-gray-600">
                                    Token: <span className="font-medium">{selectedCase?.tokenNumber}</span>
                                </p>
                                <p className="text-sm text-gray-600">
                                    Pet: <span className="font-medium">{selectedCase?.pet?.petName}</span>
                                </p>
                            </div>

                            {/* TEST LIST */}
                            <div>
                                <h3 className="font-semibold mb-3 text-gray-700">
                                    Tests Required
                                </h3>

                                <div className="space-y-2">

                                    {(selectedCase?.tests?.length > 0
                                        ? selectedCase.tests
                                        : ["Blood Test", "X-Ray", "Urine Test"]
                                    ).map((test, index) => (

                                        <div
                                            key={index}
                                            className="flex items-center justify-between bg-gray-50 border rounded-lg px-4 py-3 hover:bg-orange-50 transition"
                                        >
                                            <span className="text-sm font-medium text-gray-700">
                                                {test}
                                            </span>

                                            <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                                                Pending
                                            </span>
                                        </div>

                                    ))}

                                </div>
                            </div>

                        </div>

                        {/* FOOTER */}
                        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">

                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
                            >
                                Close
                            </button>



                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}