import { FaRedo } from "react-icons/fa";

const RefreshButton = ({ onClick }) => {
  return (
    <button onClick={onClick}>
      <FaRedo /> 새로고침
    </button>
  );
};

export default RefreshButton;
