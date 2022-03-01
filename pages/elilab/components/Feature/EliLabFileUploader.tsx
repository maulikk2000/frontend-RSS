import { FC, useState } from "react";
import classes from "../../EliLabPage.module.scss";
import { ReactComponent as DownloadIcon } from "styling/assets/icons/downloadIcon.svg";
interface IEliLabUploader {
  setFile: any;
  setAttachedFile: any;
}

const EliLabFileUploader: FC<IEliLabUploader> = ({ setFile, setAttachedFile }) => {
  const [attachedFile, setattachedFile] = useState<string>("");

  const onFileLoad = async (e) => {
    e.preventDefault();

    let attachedFile;

    // con

    if (e.target.files === undefined) {
      attachedFile = e.dataTransfer.files[0];
    } else {
      attachedFile = e.target.files[0];
    }

    let form = new FormData();
    form.append("fileName", "fileName");
    form.append("image", attachedFile);

    setFile(form);
    setAttachedFile(attachedFile.name);

    setattachedFile(attachedFile.name);
  };

  const onDragEnter = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const onDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const onDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();

    event.dataTransfer.dropEffect = "move";
  };

  return (
    <div>
      {/* <div className="sub-header">Drag an Image</div> */}
      <div
        className={classes.boxadvancedupload}
        onDrop={onFileLoad}
        onDragOver={onDragOver}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
      >
        {/*        
        <input
          type="file"
          id="file-browser-input"
          name="file-browser-input"
          onChange={onFileLoad}
          style={{ display: "none" }}
        /> */}

        <div className={classes.boxuploadinput}>
          <div>
            <DownloadIcon className={classes.boxIcon} />
          </div>
          <input
            type="file"
            name="files[]"
            id="file"
            onChange={onFileLoad}
            style={{ display: "none" }}
            onDrop={onFileLoad}
          />
          <label htmlFor="file" className={classes.boxLabel}>
            <strong>Choose a file</strong>
            {/* <span className={classes.dragndrop}> or drag it here</span>. */}
            <span> or drag it here</span>.
          </label>

          <label className={classes.boxLabel}>
            <strong>{attachedFile}</strong>
          </label>
        </div>
        <div className={classes.boxuploading}>Uploading&hellip;</div>
        <div className={classes.boxsuccess}>Done!</div>
        <div className={classes.boxerror}>
          Error! <span></span>.
        </div>
      </div>
    </div>
  );
};

export default EliLabFileUploader;
