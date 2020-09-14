import React from "react";
import Avatar from "./avatar";
import styles from "./listItem.module.scss";
import moment from "moment";

export default function ListItem({
  name,
  text,
  time,
  avatar,
  unreadMessageCount,
  selected = false,
  onSelect,
}) {
  // const count = unreadMessageCount !== 0;
  return (
    <div
      className={
        styles["list-item"] + " " + (selected ? styles["selected"] : "")
      }
      onClick={onSelect}
    >
      <div className={styles["avatar"]}>
        <Avatar name={name} url={avatar} />
      </div>
      <div className={styles["name"]}>{name}</div>
      <div className={styles["message"]}>{text}</div>
      <div className={styles["time"]}>
        {time && moment(time).format("hh:mm")}
      </div>
      {!!unreadMessageCount && (
        <div className={styles["info"]}>
          <div>{unreadMessageCount}</div>
        </div>
      )}
    </div>
  );
}
