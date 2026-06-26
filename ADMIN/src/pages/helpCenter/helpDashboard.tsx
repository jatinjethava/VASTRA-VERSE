import { NavLink, Outlet } from "react-router-dom"

export const HelpDashboard = () => {
    return (
        <div className="px-6 space-y-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold text-gray-900">
                    Help Center
                </h1>
                <p className="text-gray-500">
                    Manage customer support interactions and resources
                </p>
            </div>
            <nav className="">
                <ul className="flex gap-4 items-center">
                    <li className="cursor-pointer">
                        <NavLink to={"/admin/helpcenter"} className="text-sm font-medium text-gray-700 hover:text-blue-600">
                            FAQs
                        </NavLink>
                    </li>
                    <li className="cursor-pointer">
                        <NavLink to={"/admin/helpcenter/contact"} className="text-sm font-medium text-gray-700 hover:text-blue-600">
                            Contact
                        </NavLink>
                    </li>
                </ul>
            </nav>
            <Outlet />
        </div>
    )
}