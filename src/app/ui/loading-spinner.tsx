export const LoadingSpiner = ({ size }: { size: number }) => {
  return (
    <div
      style={{
        width: size,
        height: size,
      }}
      className="rounded-full border-b border-blue-400 animate-spin"
    />
  );
};
