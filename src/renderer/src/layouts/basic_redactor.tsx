import { Outlet } from "react-router-dom";

export default function BasicRedactorLayout() {
  return (
    <div>
      <p>{BasicRedactorLayout.toString()}</p>
      <Outlet />
    </div>
  );
}
