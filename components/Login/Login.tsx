import { useState, useEffect } from "react";
import InputFields from "../UI components/InputFields";
import { State, City, IState, ICity } from "country-state-city";
import { loginInputData } from "./loginData";

const Login = () => {
  interface UserFormState {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    state: string;
    city: string;
  }
  interface propsType {
    name: string;
    type: string;
    id: string;
    placeholder?: string;
  }
  const [inputValues, setInputValues] = useState<UserFormState>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    state: "",
    city: "",
  });
  const [cities, setCities] = useState<ICity[]>([]);
  const NgStates = State.getAllStates().filter((i) => i.countryCode == "NG");
  NgStates.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });

  const getCity = () => {
    const StateDetails: IState | undefined = NgStates.find(
      (state) => state.name === inputValues?.state
    );
    const StateCities: ICity[] | undefined = City.getCitiesOfState(
      "NG",
      StateDetails?.isoCode!
    );
    StateCities.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
    setCities(StateCities);
  };

  const handleChange = (e: any) => {
    setInputValues({ ...inputValues, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    getCity();
  }, [inputValues]);

  return (
    <form className="bg-white grid grid-cols-2 gap-y-[1.2rem] gap-x-[1.2rem] p-[9rem]">
      {loginInputData.map(({ name, type, id, placeholder }: propsType) => {
        return (
          <InputFields
            key={id}
            name={name}
            type={type}
            id={id}
            placeholder={placeholder}
            value={inputValues}
            onChange={handleChange}
          />
        );
      })}
      <select
        name="state"
        id="state"
        className="w-full border h-[3.2rem] px-3 border-[#051D4C] outline-none focus:outline-none text-[1.2rem]"
        value={inputValues.state}
        onChange={handleChange}
      >
        <option value="" disabled selected hidden>
          Select State
        </option>
        {NgStates?.map((i) => (
          <option value={i.name} key={i.name}>
            {i.name}
          </option>
        ))}
      </select>
      <select
        name="city"
        id="city"
        className="w-full border h-[3.2rem] px-3 border-[#051D4C] outline-none focus:outline-none text-[1.2rem]"
        value={inputValues.city}
        onChange={handleChange}
      >
        <option value="" disabled selected hidden>
          Select City
        </option>
        {cities?.map((i) => (
          <option value={i?.name} key={i?.name}>
            {i?.name}
          </option>
        ))}
      </select>
    </form>
  );
};

export default Login;
