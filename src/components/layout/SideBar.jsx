import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineTaskAlt } from "react-icons/md";
import { CiFolderOn } from "react-icons/ci";
import { BsPeople } from "react-icons/bs";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { TbLayoutSidebarLeftCollapse } from "react-icons/tb";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import { supabase } from "../../lib/supabase";
import { clearAuth } from "../../store/slices/authSlice";
import toast from "react-hot-toast";

import UserMenuModal from "../shared/UserMenuModal";

const SideBar = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const userMenuRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        toast.error(error.message);
        return;
      }

      dispatch(clearAuth());

      toast.success("Logged out successfully!");

      navigate("/login");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <aside
      className={`fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-gray-200 bg-white p-4 transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-60"
      }`}
    >
      {/* Logo */}
      <div
        className={`mb-8 text-xl font-bold text-gray-900 ${
          isCollapsed ? "text-center" : ""
        }`}
      >
        {isCollapsed ? "P" : "ProjectFlow"}
      </div>

      {/* Main Navigation */}
      <nav>
        <ul className="space-y-1">
          {/* Dashboard */}
          <li
            className={`flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 ${
              isCollapsed ? "justify-center" : "gap-2"
            }`}
          >
            <IoHomeOutline className="shrink-0" />

            {!isCollapsed && <span>Dashboard</span>}
          </li>

          {/* My Tasks */}
          <li
            className={`flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 ${
              isCollapsed ? "justify-center" : "gap-2"
            }`}
          >
            <MdOutlineTaskAlt className="shrink-0" />

            {!isCollapsed && <span>My Tasks</span>}
          </li>

          {/* Projects */}
          <li
            className={`flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 ${
              isCollapsed ? "justify-center" : "gap-2"
            }`}
          >
            <CiFolderOn className="shrink-0" />

            {!isCollapsed && <span>Projects</span>}
          </li>

          {/* Members */}
          <li
            className={`flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 ${
              isCollapsed ? "justify-center" : "gap-2"
            }`}
          >
            <BsPeople className="shrink-0" />

            {!isCollapsed && <span>Members</span>}
          </li>

          {/* Notifications */}
          <li
            className={`flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 ${
              isCollapsed ? "justify-center" : "gap-2"
            }`}
          >
            <IoMdNotificationsOutline className="shrink-0" />

            {!isCollapsed && <span>Notifications</span>}
          </li>
        </ul>
      </nav>

      {/* Settings */}
      <div
        className={`mt-5 cursor-pointer rounded-lg border-t border-gray-200 px-3 py-2 pt-4 text-sm text-gray-600 hover:bg-gray-100 ${
          isCollapsed ? "flex justify-center" : ""
        }`}
      >
        <div
          className={`flex items-center ${
            isCollapsed ? "justify-center" : "gap-2"
          }`}
        >
          <IoSettingsOutline className="shrink-0" />

          {!isCollapsed && <span>Settings</span>}
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-auto pt-4">
        {/* Collapse Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-100"
        >
          <TbLayoutSidebarLeftCollapse
            className={`transition-transform duration-300 ${
              isCollapsed ? "rotate-180" : ""
            }`}
          />

          {!isCollapsed && <span>Collapse</span>}
        </button>

        {/* User */}
        <button
          onClick={() => setIsUserMenuOpen(true)}
          className={`mt-4 flex w-full items-center gap-3 rounded-xl p-3 text-left hover:bg-gray-100 ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          {/* Avatar */}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
            {user?.user_metadata?.name?.charAt(0).toUpperCase() || "U"}
          </div>

          {/* User Info */}
          {!isCollapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-800">
                {user?.user_metadata?.name || "User"}
              </p>

              <p className="truncate text-xs text-gray-500">
                {user?.email || "No email"}
              </p>
            </div>
          )}
        </button>

        {/* User Menu */}
        {isUserMenuOpen && (
          <div ref={userMenuRef}>
            <UserMenuModal
              onClose={() => setIsUserMenuOpen(false)}
              onLogout={handleLogout}
            />
          </div>
        )}
      </div>
    </aside>
  );
};

export default SideBar;
