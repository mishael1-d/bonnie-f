function Buttons({ name, type, variant, size }: any) {
  return (
    <button
      type={type}
      className={`${
        variant === "primary" ? "bg-[#051D4C]" : "bg-green-500"
      } w-full text-white p-3 text-[1.2rem] uppercase font-medium`}
    >
      {name}
    </button>
  );
}

export default Buttons;
