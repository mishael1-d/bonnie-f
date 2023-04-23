import { RiErrorWarningLine } from "react-icons/ri";

interface propsType {
  name: string;
  type: string;
  id: string;
  placeholder?: string;
  value: any;
  onChange: (e: any) => void;
}
function InputFields({
  name,
  type,
  id,
  placeholder,
  value,
  onChange,
}: propsType) {
  return (
    <div>
      <label htmlFor={id} className="block text-[1.4rem]">
        {name}
      </label>
      <input
        type={type}
        name={id}
        id={id}
        placeholder={placeholder}
        value={value[name]}
        autoComplete="no"
        onChange={onChange}
        className="w-full border h-[3.2rem] px-3 border-[#051D4C] outline-none focus:outline-none text-[1.2rem] peer"
        required
        minLength={type === "password" ? 8 : id === "phoneNumber" ? 11 : 3}
        pattern={id === "confirmPassword" ? value.password : undefined}
      />
      <RiErrorWarningLine
        className="peer-invalid:text-red-500 peer-valid:text-green-500 mt-2 ml-auto"
        size={20}
        title={
          id === "firstName" || id === "lastName"
            ? "Min length 3 characters"
            : id === "password"
            ? "Password length must be greater than 7 characters"
            : id === "email"
            ? "Email should be a valid email address"
            : id === "confirmPassword"
            ? "Password should match"
            : "This field is required"
        }
      />
    </div>
  );
}

export default InputFields;
