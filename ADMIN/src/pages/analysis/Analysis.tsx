import { Link, Outlet } from "react-router"
import { useConversionRate } from "../../Hooks/analysis"
import { FiShoppingCart, FiEye, FiTrendingUp } from "react-icons/fi";

export const Analysis = () => {

    const { data: conversionRate } = useConversionRate();

    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-10 mt-4">
                <Link to={"product-analysis"} className="no-underline text-gray-600 hover:text-gray-900 transition-all duration-300">Product Analysis</Link>
                <Link to={"traffic-analysis"} className="no-underline text-gray-600 hover:text-gray-900 transition-all duration-300">Traffic Analysis</Link>
            </div>
            <div className="relative">

                <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                        <div className="flex justify-between items-center">
                            <span className="text-green-700 font-medium">
                                Total Orders
                            </span>
                            <FiShoppingCart size={22} />
                        </div>
                        <h2 className="mt-3 text-3xl font-bold">
                            {conversionRate?.totalOrders || 0}
                        </h2>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                        <div className="flex justify-between items-center">
                            <span className="text-blue-700 font-medium">
                                Total Views
                            </span>
                            <FiEye size={22} />
                        </div>
                        <h2 className="mt-3 text-3xl font-bold">
                            {conversionRate?.totalViews || 0}
                        </h2>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
                        <div className="flex justify-between items-center">
                            <span className="text-purple-700 font-medium">
                                Conversion Rate
                            </span>
                            <FiTrendingUp size={22} />
                        </div>
                        <h2 className="mt-3 text-3xl font-bold">
                            {conversionRate?.conversionRate || 0}%
                        </h2>
                    </div>
                </div>
            </div>
            <Outlet />
        </div>
    )
}