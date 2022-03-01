import { FC, useState } from "react";
import { Button } from "styling/components/Button/Button";
// import classes from "../../EliLabPage.module.scss";
import { useElilabStore } from "../../../stores/eliLabStore";
import { ICreateLabFeature } from "pages/elilab/interface/ICreateLabFeature";
import EliLabFileUploader from "../EliLabFileUploader";
import classes from "./EliLabAddFeature.module.scss";

interface ILabAddFeature {
  handleClose: (boolean) => void;
}

const EliLabAddFeature: FC<ILabAddFeature> = ({ handleClose }) => {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [tags, setTags] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState();
  const [, setAttachedFile] = useState<string>("");
  const [state, actions] = useElilabStore();

  const createExperiment = () => {
    let tagDetails = tags.split(",");

    let createLabFeature: ICreateLabFeature = {
      name: title,
      description: description,
      file: state.file,
      experimentPageLink: link,
      imagePath: "",
      imageAltText: "",
      experimentTags: tagDetails //tags.split(",")
    };

    actions.createLabFeature(createLabFeature, file);

    setTitle("");
    setLink("");
    setDescription("");
    setAttachedFile("");
    setTags("");

    handleClose(true);
  };

  const onLinkChange = (event) => {
    setLink(event.target.value);
  };

  const onTagsChange = (event) => {
    setTags(event.target.value);
  };

  const onTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const onDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  return (
    <div className={classes.addWrapper}>
      <div className={classes.formWrapper}>
        <h2>Create a New Experiment</h2>
        <div>
          <input
            className={classes.textInput}
            id="title"
            type="text"
            value={title}
            onChange={onTitleChange}
            placeholder="Experiment Title"
          />
          {/* <label>Experiment Title</label> */}
        </div>
        <div>
          <input
            className={classes.textInput}
            id="link"
            type="text"
            value={link}
            onChange={onLinkChange}
            placeholder="Enter link to Experiment page"
          />
          {/* <label>Enter link to Experiment page</label> */}
        </div>
        <div>
          <input
            className={classes.textInput}
            id="tags"
            type="text"
            value={tags}
            onChange={onTagsChange}
            placeholder='Enter Experiment Tags separated by \",\"'
          />
          {/* <label>Enter Experiment Tags separated by ","</label> */}
        </div>
        <div>
          <textarea
            className={classes.textArea}
            id="description"
            value={description}
            onChange={onDescriptionChange}
            placeholder="Experiment description (Max 250 words)"
          />
          {/* <label>Experiment description (Max 250 words)</label> */}
        </div>
        <div>
          <EliLabFileUploader setFile={setFile} setAttachedFile={setAttachedFile}></EliLabFileUploader>
        </div>
      </div>
      <div className={classes.button}>
        <Button id="create" classType="primary" onClick={createExperiment}>
          create
        </Button>
      </div>
    </div>
  );
};

export default EliLabAddFeature;
