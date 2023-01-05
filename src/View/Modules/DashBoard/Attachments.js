import React from "react";
import { Button } from "react-bootstrap";

const Attachments = ({ name, attachments }) => {
  return (
    <div
      className="d-flex flex-column justify-content-start align-items-start"
      style={{
        gap: "3px",
      }}
    >
      <div>
        <b>{name ? name : Attachments}:</b>
      </div>
      <div
        className="d-flex justify-content-start align-items-start"
        style={{
          gap: "3px",
          flexWrap: "wrap",
        }}
      >
        {attachments?.map((item, idx) => {
          const MaxLength = 7;
          let fileNameArr = item.split("/");
          let fileName = fileNameArr[fileNameArr.length - 1];
          let trimedFileName = fileName.split(".");
          let fileExtension = trimedFileName[trimedFileName.length - 1];
          trimedFileName.pop();
          let trimFile = trimedFileName.join(".");
          let newName;
          if (trimFile.length <= MaxLength) {
            newName = trimFile.concat(".").concat(fileExtension);
          } else {
            newName = trimFile
              .substring(0, MaxLength)
              .concat("...")
              .concat(fileExtension);
          }
          let fileUrl =
            process.env.REACT_APP_AUTH_SERVER + "/files/" + fileName;
          return (
            <Button
              onClick={() => {}}
              href={fileUrl}
              variant="outline-dark"
              target="_blank"
              className="mx-1"
              style={{
                fontSize: "10px",
              }}
              size="sm"
              key={idx}
            >
              {newName}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default Attachments;
