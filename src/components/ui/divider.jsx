import React from "react";
import View from "../layout/View";

export default function Divider({ width, height, padding, color, type }) {
  const style = {
    divider: {
      width: "100%",
      height: padding || "1px",
      display: "grid",
      placeItems: "center",
    },
    dividerBar: {
      width: width || "90%",
      height: "1px",
      // background: "#00559c30",
      borderBottom: `${color || "#ccc"} ${height || "1px"} ${type || "dashed"}`,
    },
  };

  return (
    <>
      <View tag="divider" style={{ ...style.divider }}>
        <View tag="divider-bar" style={{ ...style.dividerBar }}></View>
      </View>
    </>
  );
}
