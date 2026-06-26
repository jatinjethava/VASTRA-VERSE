import { Card } from "./card"
import type { Product } from "../Api/productApi";
import { useGetProductByCategory } from "../Hooks/product";

interface Props {
    recommendedProducts: Product[];
}

export const RecommendProduct = ({ recommendedProducts }: Props) => {

    const category = recommendedProducts[0]?.category;
    const { data: products } = useGetProductByCategory(category);

    return (
        <div className="w-full h-fit mx-auto my-4 sm:my-7">
            <div className="text-center mt-12 sm:mt-20 md:mt-30 mb-8 sm:mb-15 max-w-3xl mx-auto px-4">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-500 tracking-tight">
                    Recommended <span className="text-gray-700"> Products</span>
                </h2>
                <p className="text-sm sm:text-base text-gray-500 mt-2">Check out other products that you might like</p>
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 md:gap-10 lg:grid-cols-4 gap-6 sm:gap-6 lg:gap-10 place-content-center place-items-center'>
                {
                    products?.map((product: Product) => {
                        if (product._id !== recommendedProducts[0]._id) {
                            return <Card key={product._id} product={product} />
                        }
                    })
                }
            </div>
        </div>
    )
}