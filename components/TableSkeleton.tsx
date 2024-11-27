import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

const TableSkeleton: React.FC = () => {
  const skeletonRows = Array.from({ length: 5 });

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Task</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {skeletonRows.map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <div style={{ width: 20, height: 20, backgroundColor: "#e0e0e0", borderRadius: "50%" }}></div>
              </TableCell>
              <TableCell>
                <div style={{ height: 20, backgroundColor: "#e0e0e0", width: "80%" }}></div>
              </TableCell>
              <TableCell>
                <div style={{ height: 20, backgroundColor: "#e0e0e0", width: "50%" }}></div>
              </TableCell>
              <TableCell>
                <div style={{ height: 20, backgroundColor: "#e0e0e0", width: "60%" }}></div>
              </TableCell>
              <TableCell>
                <div style={{ height: 20, backgroundColor: "#e0e0e0", width: "30%" }}></div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableSkeleton;
