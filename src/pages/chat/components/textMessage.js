import React, { forwardRef } from "react";
import styles from "./textMessage.module.scss";
import moment from "moment";

export default forwardRef(({ me, text, time }, ref) => {
  return (
    <li ref={ref} className={styles[me ? "me" : ""]}>
      {text}
      <div>
        <br />
        {moment(time).format("hh:mm")}
      </div>
    </li>
  );
});
