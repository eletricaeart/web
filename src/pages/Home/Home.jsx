import React from "react";
import View from "../../components/layout/View";

export default function Home({ children }) {
  return (
    <>
      <View tag="home">{children}</View>
    </>
  );
}
