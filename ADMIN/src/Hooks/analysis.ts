import { useQuery } from "@tanstack/react-query"
import { productAnalysis, viewProductAnalysis, wishlistedAnalysis, conversionRate, categoryAnalysis } from "../Api/analysisApi"

export const useProductAnalysis = () => useQuery({ queryKey: ["productAnalysis"], queryFn: productAnalysis })

export const useViewProductAnalysis = () => useQuery({ queryKey: ["viewProductAnalysis"], queryFn: viewProductAnalysis })

export const useWishlistedAnalysis = () => useQuery({ queryKey: ["wishlistedAnalysis"], queryFn: wishlistedAnalysis })

export const useConversionRate = () => useQuery({ queryKey: ["conversionRate"], queryFn: conversionRate })

export const useCategoryAnalysis = () => useQuery({ queryKey: ["categoryAnalysis"], queryFn: categoryAnalysis })