export default function Loading() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50/50">
            <div className="flex flex-col items-center gap-4">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-600 border-t-transparent"></div>
                <p className="text-sm font-medium text-gray-600 animate-pulse">Loading BloodConnect...</p>
            </div>
        </div>
    )
}
