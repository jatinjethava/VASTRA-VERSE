import { toast } from 'sonner'
import { getAllQuestions, deleteQuestion, answerQuestion } from '../Api/qaApi'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export const useQAList = () => {
    return useQuery({
        queryKey: ['qa-list'],
        queryFn: getAllQuestions,
        retry: true,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
    })
}

export const useAnswerQuestion = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ questionId, answer }: { questionId: string, answer: string }) => answerQuestion({ questionId, answer }),
        onSuccess: (data: any) => {
            toast.success(data.message, { duration: 1500 })
            queryClient.invalidateQueries({ queryKey: ["qa-list"] });
        },
        onError: (error: any) => {
            toast.error(error.response.data.message, { duration: 1500 })
        },
    })
}

export const useDeleteQuestion = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteQuestion(id),
        onSuccess: (data: any) => {
            toast.success(data.message, { duration: 1500 })
            queryClient.invalidateQueries({ queryKey: ["qa-list"] });
        },
        onError: (error: any) => {
            toast.error(error.response.data.message, { duration: 1500 })
        },
    });
}