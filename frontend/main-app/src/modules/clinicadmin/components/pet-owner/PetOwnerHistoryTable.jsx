const PetOwnerHistoryTable = () => {
  return (
    <div className="card mt-4">
      <div className="card-body">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Doctor</th>
              <th>Diagnosis</th>
              <th>Prescription</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>10-06-2025</td>
              <td>Dr. Sharma</td>
              <td>Fever</td>
              <td>Download PDF</td>
            </tr>

            <tr>
              <td>22-05-2025</td>
              <td>Dr. Kumar</td>
              <td>Vaccination</td>
              <td>Download PDF</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PetOwnerHistoryTable;