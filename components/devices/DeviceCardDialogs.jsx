import React from "react";
import DialogCreation from "../UI/DialogCreation";
import ReductDeviceCard from "./ReductDeviceCard";
import DeleteDeviceDialog from "./DeleteDeviceDialog";

const DeviceCardDialogs = ({
  reductOpen,
  deleteOpen,
  handleReductDialog,
  handleDeleteDialog,
  handleUpdateDevice,
  handleDeleteDevice,
  deviceData,
  setDeviceData,
}) => {
  return (
    <>
      {reductOpen && (
        <DialogCreation
          visible={reductOpen}
          hideDialog={handleReductDialog}
          title="Редагувати прилад"
          saveChanges={handleUpdateDevice}
        >
          <ReductDeviceCard
            deviceData={deviceData}
            setDeviceData={setDeviceData}
          />
        </DialogCreation>
      )}
      {deleteOpen && (
        <DeleteDeviceDialog
          visible={deleteOpen}
          hideDialog={handleDeleteDialog}
          deleteDevice={handleDeleteDevice}
          deviceData={deviceData}
        />
      )}
    </>
  );
};

export default DeviceCardDialogs;
