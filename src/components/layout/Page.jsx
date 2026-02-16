import React from "react";
import View from "./View";

export default function Page({ bg, children }) {
  const style = {
    page: {
      // height: "100dvh",
      position: "relative",
      top: "72px",
      background: bg || "#f5f5f5",
      flex: 1,
    },
  };

  return (
    <>
      <View tag="Page" style={style.page}>
        {children}
      </View>
    </>
  );
}
