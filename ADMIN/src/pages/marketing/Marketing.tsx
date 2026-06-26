import { NavLink, Outlet, useNavigate } from "react-router-dom";

export const Marketing = () => {
    const navigate = useNavigate();

    return (
        <>
            <div>
                <div className="w-full shadow-sm border-b border-gray-300 px-6 py-4 bg-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-bold text-gray-800">
                                Marketing
                            </h1>
                            <div className="flex items-center gap-1 mt-2">
                                <span
                                    onClick={() => navigate("/admin")}
                                    className="text-sm text-gray-600 hover:text-green-600 cursor-pointer"
                                >
                                    Home
                                </span>
                                <span className="text-sm text-gray-400">/</span>
                                <span className="text-sm text-gray-400">Marketing</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-6 mt-6">
                    <nav className="flex space-x-2 border-b border-gray-200">
                        <NavLink
                            to="/admin/marketing"
                            className={({ isActive }) =>
                                `px-4 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                                    ? "bg-green-50 text-green-700"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                }`
                            }
                        >
                            Campaigns
                        </NavLink>
                        <NavLink
                            to="/admin/marketing/flash-sales"
                            className={({ isActive }) =>
                                `px-4 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                                    ? "bg-green-50 text-green-700"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                }`
                            }
                        >
                            Flash Sales
                        </NavLink>
                        <NavLink
                            to="/admin/marketing/banner"
                            className={({ isActive }) =>
                                `px-4 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                                    ? "bg-green-50 text-green-700"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                }`
                            }
                        >
                            Banner
                        </NavLink>
                    </nav>
                </div>

                <div className="px-6 mt-6">
                    <Outlet />
                </div>
            </div>
        </>
    );
};