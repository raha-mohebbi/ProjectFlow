import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineTaskAlt } from "react-icons/md";
import { CiFolderOn } from "react-icons/ci";
import { BsPeople } from "react-icons/bs";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { TbLayoutSidebarLeftCollapse } from "react-icons/tb";

const SideBar = () => {
  return (
    <aside className="flex min-h-screen w-60 flex-col border-r border-gray-200 bg-white p-4">
      {/* Logo */}
      <div className="mb-8 text-xl font-bold text-gray-900">
        ProjectFlow
      </div>

      {/* Main Navigation */}
      <nav>
        <ul className="space-y-1 ">
        <li className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100">
  <IoHomeOutline />
  Dashboard
</li>

          <li className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100">
          <MdOutlineTaskAlt />  My Tasks
          </li>

          <li className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100">
           <CiFolderOn /> Projects
          </li>

          <li className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100">
          <BsPeople />  Members
          </li>

          <li className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100">
           <IoMdNotificationsOutline /> Notifications
          </li>
        </ul>
      </nav>
<div className="mt-5 flex gap-2 cursor-pointer rounded-lg border-t border-gray-200 px-3 py-2 pt-4 text-sm text-gray-600 hover:bg-gray-100">
 <IoSettingsOutline /> Settings
</div>
 {/* Bottom */}
<div className="mt-auto pt-4">
  <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100">
    <TbLayoutSidebarLeftCollapse />
    Collapse
  </button>
</div>
    
    </aside>
  );
};

export default SideBar;