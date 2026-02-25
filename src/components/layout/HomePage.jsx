import React from "react";
import Page from "../../components/layout/Page";
import View from "./View";

export default function HomePage({ children, ...props }) {
  const bgFinal = props.bg || "#f5f5f5";

  return (
    <>
      <View tag="home-page" bg={bgFinal} className="flex flex-1">
        <View
          tag="content"
          style={{
            display: "flex",
            flexDirection: "column",
            flex: "1",
            // height: "100%",
            padding: props?.pd || "1rem",
          }}
          className="h-full flex flex-1 flex-col"
          {...props}
        >
          {children}
        </View>
      </View>
    </>
  );
}
