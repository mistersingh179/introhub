import React from "react";

type ShowChildrenProps = {
  showIt: boolean;
  children: React.ReactNode;
};
const ShowChildren = (props: ShowChildrenProps) => {
  const { showIt, children } = props;
  if (showIt) {
    return children;
  }
  return <></>;
};

export default ShowChildren;