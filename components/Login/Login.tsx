import { useState, useEffect } from "react";
import InputFields from "../UI components/InputFields";
import { State, City, IState, ICity } from "country-state-city";
import { loginInputData } from "./loginData";
import Buttons from "../UI components/Buttons";
import { register } from "@/utils/register";

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

  const handleChange = (e: any) => {
    setInputValues({ ...inputValues, [e.target.name]: e.target.value });
  };

  const handleRegister = async (inputValues: any, e: any) => {
    e.preventDefault();
    await register(inputValues);
  };

  useEffect(() => {
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
    getCity();
  }, [inputValues]);

  return (
    <form
      className="bg-white grid md:grid-cols-2 grid-cols-1 gap-y-[1.2rem] md:gap-x-[1.2rem] p-[9rem]"
      onSubmit={(e) => handleRegister(inputValues, e)}
    >
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
      <div>
        <label htmlFor="state" className="block text-[1.4rem]">
          State
        </label>
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
      </div>
      <div>
        <label htmlFor="city" className="block text-[1.4rem]">
          City
        </label>
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
      </div>
      <div>
        <Buttons name="Submit" type="submit" variant="primary" />
      </div>
    </form>
  );
};

export default Login;
