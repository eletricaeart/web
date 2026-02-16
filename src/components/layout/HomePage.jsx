import React from "react";
import Page from "../../components/layout/Page";
import View from "./View";

export default function HomePage({ children, ...props }) {
  const bgFinal = props.bg || "#f5f5f5";

  return (
    <>
      <View tag="home-page" {...props} bg={bgFinal}>
        {children}
      </View>
    </>
  );
}
