import React from "react";

import classes from "./ProductMixTable.module.scss";

export const ProductMixTable = (props) => {
  return <table className={classes.product_mix}>{props.children}</table>;
};
