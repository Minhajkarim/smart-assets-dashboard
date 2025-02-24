// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { FaDownload } from "react-icons/fa";
import { useTable, usePagination, useGlobalFilter } from "react-table";
import DashboardNavbar from "../components/DashboardNavbar";

const Reports = () => {
  // Sample Data
  const data = React.useMemo(
    () => [
      { objectType: "60 km/h 1", count: "Speed Limit", latitude: "25.796892°", longitude: "55.967595°", image: "images/60kmh1" },
      { objectType: "60 km/h 10", count: "Speed Limit", latitude: "25.804091°", longitude: "55.960909°", image: "images/60kmh10" },
      { objectType: "60 km/h 2", count: "Speed Limit", latitude: "25.796767°", longitude: "55.967717°", image: "images/60kmh2" },
      { objectType: "60 km/h 3", count: "Speed Limit", latitude: "25.800238°", longitude: "55.968271°", image: "images/60kmh3" },
      { objectType: "60 km/h 4", count: "Speed Limit", latitude: "25.800211°", longitude: "55.968335°", image: "images/60kmh4" },
      { objectType: "60 km/h 5", count: "Speed Limit", latitude: "25.803418°", longitude: "55.968049°", image: "images/60kmh5" },
      { objectType: "60 km/h 6", count: "Speed Limit", latitude: "25.805323°", longitude: "55.968076°", image: "images/60kmh6" },
      { objectType: "60 km/h 7", count: "Speed Limit", latitude: "25.804505°", longitude: "55.964157°", image: "images/60kmh7" },
      { objectType: "60 km/h 8", count: "Speed Limit", latitude: "25.804608°", longitude: "55.964181°", image: "images/60kmh8" },
      { objectType: "60 km/h 9", count: "Speed Limit", latitude: "25.804074°", longitude: "55.961087°", image: "images/60kmh9" },
    ],
    []
  );

  // Table Columns
  const columns = React.useMemo(
    () => [
      { Header: "Object Type", accessor: "objectType" },
      { Header: "Count of Object Type", accessor: "count" },
      { Header: "Latitude", accessor: "latitude" },
      { Header: "Longitude", accessor: "longitude" },
      { Header: "Images", accessor: "image" },
    ],
    []
  );

  // React Table Hooks
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state,
    setPageSize,
    setGlobalFilter,
  } = useTable(
    { columns, data, initialState: { pageIndex: 0, pageSize: 10 } },
    useGlobalFilter,
    usePagination
  );

  const { pageIndex, pageSize, globalFilter } = state;

  return (
    <div className="p-6">
        <DashboardNavbar />
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Report Section</h2>
          <button className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2">
            <FaDownload />
            Download
          </button>
        </div>

        {/* Dropdown & Search Bar */}
        <div className="flex justify-between mb-4">
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="border p-2 rounded"
          >
            {[10, 25, 50].map((size) => (
              <option key={size} value={size}>
                {size} entries per page
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search..."
            value={globalFilter || ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="border p-2 rounded"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table {...getTableProps()} className="min-w-full border border-gray-200">
            <thead className="bg-gray-100">
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()} className="border-b">
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()} className="p-3 text-left font-semibold">
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} className="border-b hover:bg-gray-50">
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()} className="p-3">
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <span>
            Showing {pageIndex * pageSize + 1} to{" "}
            {Math.min((pageIndex + 1) * pageSize, data.length)} of {data.length} entries
          </span>
          <div className="flex space-x-2">
            <button
              onClick={previousPage}
              disabled={!canPreviousPage}
              className={`px-3 py-1 border rounded ${!canPreviousPage ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {"<"}
            </button>
            <span>
              Page {pageIndex + 1} of {pageOptions.length}
            </span>
            <button
              onClick={nextPage}
              disabled={!canNextPage}
              className={`px-3 py-1 border rounded ${!canNextPage ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {">"}
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-gray-500 mt-6">
        © 2025 by SMART ASSETS
      </footer>
    </div>
  );
};

export default Reports;
