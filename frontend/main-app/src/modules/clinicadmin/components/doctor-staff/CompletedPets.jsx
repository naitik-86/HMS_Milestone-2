export default function CompletedPets({
  setActiveStep,
}) {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">
        Completed Pets
      </h1>

      <p className="mt-2 text-slate-500">
        Completed Pet Cases
      </p>

      <div className="mt-10 flex gap-4">

        <button
          onClick={() =>
            setActiveStep("history")
          }
          className="bg-orange-500 text-white px-6 py-3 rounded-xl"
        >
          View History
        </button>

      </div>
    </div>
  );
}