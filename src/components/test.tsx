import React from "react";

type Props = {
  onClick: (event: React.MouseEvent) => void;
};

const Test: React.FC<Props> = ({ onClick }) => {
  return <button onClick={onClick}>test btn</button>;
};

export default Test;
