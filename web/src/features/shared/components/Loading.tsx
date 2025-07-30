export function Loading() {
    return (
        <div className="w-full h-full flex justify-center items-center">
            <div className="relative w-48 h-4 bg-black/30 rounded-xs overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-emerald-400 z-1 animate-snake-fill" />
                <div className="absolute right-0 top-0 h-full w-4 bg-red-500" />
            </div>
        </div>
    );
}
