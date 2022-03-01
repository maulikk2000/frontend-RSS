import React, { useRef } from "react";
import { Button } from "../Button/Button";
import { ReactComponent as ExportCsvIcon } from "../../assets/icons/export_csv_icon.svg";
import { CSVLink } from "react-csv";

export type Props = {
  data: string[][];
  filename: string;
  isDisabled?: boolean;
};

const CsvButton: React.FC<Props> = ({ isDisabled, data, filename }) => {
  const csvLinkRef = useRef<CSVLink>(null);

  const handleExportClick = (): void => {
    if (csvLinkRef?.current) {
      csvLinkRef.current.link.click();
    }
  };

  return (
    <Button classType="primary" onClick={handleExportClick} disabled={isDisabled}>
      <CSVLink ref={csvLinkRef} disabled={true} data={data} filename={filename} />
      Export CSV &nbsp;
      <ExportCsvIcon />
    </Button>
  );
};

export default CsvButton;
