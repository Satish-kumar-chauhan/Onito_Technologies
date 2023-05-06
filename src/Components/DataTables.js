import React, { useEffect, useRef, useState } from "react";
import $ from "jquery";
import "datatables.net";
import "datatables.net-buttons";

import { getFirestore, collection, query, getDocs } from "firebase/firestore";
import { app } from "../firebase";

const fireStore = getFirestore(app);
const DataTables = () => {
  const tableEL = useRef(null);
  const [datatable, setDatatable] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);
  const getData = async () => {
    const q = query(collection(fireStore, "patientData"));
    const data = await getDocs(q);
    let dataRow = [];
    data.forEach((doc) => {
      let d = doc.data();
      dataRow = [
        ...dataRow,
        {
          Name: d.username,
          Age: d.age,
          Sex: d.gender,
          Address: d.address,
          GovtID: d.IdType,
          guardianLabel: d.guardianLabel,
          guardianName: d.guardianName,
          Nationality: d.nationality,
        },
      ];
    });
    setDatatable({
      columns: [
        {
          label: "Name",
          field: "Name",
          width: 150,
        },
        {
          label: "Age",
          field: "Age",
          width: 150,
        },
        {
          label: "Sex",
          field: "Sex",
          width: 150,
        },
        {
          label: "Address",
          field: "Address",
          width: 150,
        },
        {
          label: "GovtID",
          field: "GovtID",
          width: 150,
        },
        {
          label: "Guardian",
          field: "guardianLabel",
          width: 150,
        },
        {
          label: "Guardian Details",
          field: "guardianName",
          width: 150,
        },
        {
          label: "Nationality",
          field: "Nationality",
          width: 150,
        },
      ],
      rows: dataRow,
    });
    setDataLoaded(true);
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (datatable.rows !== undefined) {
      const table = $(tableEL.current).DataTable({});
      return () => {
        table.destroy(true);
      };
    }
  }, [datatable]);

  return (
    <div className="min-h-[500px]">
      {!dataLoaded && <h1 className="text-center">Loading...</h1>}
      {dataLoaded && (
        <table ref={tableEL}>
          <thead>
            <tr>
              {datatable.columns.map((c, index) => {
                return <th key={index}>{c.label}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {datatable.rows.map((rd, index) => {
              return (
                <tr key={index}>
                  <td>{rd.Name}</td>
                  <td>{rd.Age}</td>
                  <td>{rd.Sex}</td>
                  <td>{rd.Address}</td>
                  <td>{rd.GovtID}</td>
                  <td>{rd.guardianLabel}</td>
                  <td>{rd.guardianName}</td>
                  <td>{rd.Nationality}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DataTables;
