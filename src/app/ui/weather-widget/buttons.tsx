import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";

export const BackButton = ({
  onClick,
  disabled = false,
}: {
  onClick: () => void;
  disabled?: boolean;
}) => {
  return (
    <button
      aria-label="Vorheriger Tag"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      disabled={disabled}
      className="p-3 outline-offset-2 rounded-full disabled:hover:bg-transparent hover:bg-stone-200 transition-colors  disabled:cursor-not-allowed group"
    >
      <ArrowLeftIcon className="w-6 h-6 stroke-stone-800 stroke-2 group-disabled:stroke-stone-300" />
    </button>
  );
};

export const NextButton = ({
  onClick,
  disabled = false,
}: {
  onClick: () => void;
  disabled?: boolean;
}) => {
  return (
    <button
      aria-label="Nächster Tag"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      disabled={disabled}
      className="p-3 outline-offset-2 rounded-full disabled:hover:bg-transparent hover:bg-stone-200 transition-colors  disabled:cursor-not-allowed group"
    >
      <ArrowRightIcon className="w-6 h-6 stroke-stone-800 stroke-2 group-disabled:stroke-stone-300" />
    </button>
  );
};
