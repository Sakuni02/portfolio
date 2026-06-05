export default function ProjectDetailLoading() {
  return (
    <div className="animate-pulse">
      <div className="aspect-video w-full bg-warmgray/50 dark:bg-offwhite/10" />
      <div className="mx-auto max-w-4xl px-6 py-16 md:px-10">
        <div className="mb-4 h-4 w-32 bg-warmgray/50 dark:bg-offwhite/10" />
        <div className="mb-8 h-16 w-3/4 bg-warmgray/50 dark:bg-offwhite/10" />
        <div className="space-y-3">
          <div className="h-4 w-full bg-warmgray/50 dark:bg-offwhite/10" />
          <div className="h-4 w-full bg-warmgray/50 dark:bg-offwhite/10" />
          <div className="h-4 w-2/3 bg-warmgray/50 dark:bg-offwhite/10" />
        </div>
      </div>
    </div>
  );
}
