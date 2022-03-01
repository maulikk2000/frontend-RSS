import React, { FC } from "react";

interface IEliLabIframe {
  src?: string;
}

/*
const useStyles = makeStyles(() => ({
  fullheight: {
    height: "800"
  }
}));
*/

const EliLabFrame: FC<IEliLabIframe> = ({ src }) => {
  return (
    <div>
      <iframe src={src} width="100%" height="800" frameBorder="0" scrolling="false" title="Lab">
        {" "}
      </iframe>
    </div>
  );
};

export default EliLabFrame;
