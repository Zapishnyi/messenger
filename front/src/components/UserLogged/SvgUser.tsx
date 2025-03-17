import { useAppSelector } from "../../redux/store";

const SvgOnline = () => {
  const { me_online } = useAppSelector((state) => state.online);
  return (
    <svg className={"h-7 w-7 "} viewBox="0 0 24 24">
      <g fill={me_online ? "#49b585" : "#b54949"} fillRule="evenodd">
        <path d="M12 7a15.16 15.16 0 0 0-10.561 4.263L.05 9.823A17.16 17.16 0 0 1 12 5a17.16 17.16 0 0 1 11.95 4.823l-1.389 1.44A15.16 15.16 0 0 0 12 7"></path>
        <path d="M12 12.026a10.15 10.15 0 0 0-7.052 2.836l-1.385-1.444A12.15 12.15 0 0 1 12 10.027a12.15 12.15 0 0 1 8.437 3.393l-1.385 1.443A10.15 10.15 0 0 0 12 12.026m.02 4.996a5.17 5.17 0 0 0-3.606 1.457l-1.39-1.439a7.17 7.17 0 0 1 4.996-2.018c1.917 0 3.66.752 4.949 1.973l-1.376 1.452a5.17 5.17 0 0 0-3.573-1.425"></path>
      </g>
    </svg>
  );
};

export default SvgOnline;
