const PetOwnerUploadForm = () => {
  return (
    <div className="card mt-4">
      <div className="card-body">

        <div className="mb-3">
          <label className="form-label">Lab Report</label>
          <input type="file" className="form-control" />
        </div>

        <div className="mb-3">
          <label className="form-label">Lab Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter Lab Name"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Report Date</label>
          <input type="date" className="form-control" />
        </div>

        <div className="mb-3">
          <label className="form-label">Notes</label>
          <textarea
            className="form-control"
            rows="4"
            placeholder="Notes for Doctor"
          />
        </div>

        <button className="btn btn-primary">
          Upload Report
        </button>

      </div>
    </div>
  );
};

export default PetOwnerUploadForm;