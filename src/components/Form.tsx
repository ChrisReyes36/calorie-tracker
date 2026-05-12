import {
  useMemo,
  useState,
  type ChangeEvent,
  type Dispatch,
  type SubmitEvent,
} from "react";
import { v4 as uuidV4 } from "uuid";
import { categories } from "../data/categories";
import type { Activity } from "../types";
import type {
  ActivityActions,
  ActivityState,
} from "../reducers/activity-reducer";

type FormProps = {
  dispatch: Dispatch<ActivityActions>;
  state: ActivityState;
};

const initialState: Activity = {
  id: uuidV4(),
  category: 1,
  name: "",
  calories: 0,
};

const Form = ({ dispatch, state }: FormProps) => {
  const [activity, setActivity] = useState<Activity>(initialState);

  const selectedActivity = useMemo(
    () => state.activities.find((a) => a.id === state.activeId),
    [state.activeId, state.activities],
  );

  const currentActivity = selectedActivity ?? activity;

  const handleChange = (
    e: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>,
  ) => {
    const isNumberField = ["category", "calories"].includes(e.target.id);

    setActivity({
      ...currentActivity,
      [e.target.name]: isNumberField ? +e.target.value : e.target.value,
    });
  };

  const isValidActivity = () => {
    const { name, calories } = currentActivity;
    return name.trim() !== "" && calories > 0;
  };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch({
      type: "save-activity",
      payload: { newActivity: currentActivity },
    });
    setActivity({ ...initialState, id: uuidV4() });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 bg-white shadow p-10 rounded-lg"
    >
      <div className="grid grid-cols-1 gap-3">
        <label htmlFor="category" className="font-bold">
          Categoría:
        </label>
        <select
          name="category"
          id="category"
          className="border border-slate-300 p-2 rounded-lg w-full bg-white"
          value={currentActivity.category}
          onChange={handleChange}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <label htmlFor="name" className="font-bold">
          Actividad:
        </label>
        <input
          type="text"
          name="name"
          id="name"
          className="border border-slate-300 p-2 rounded-lg w-full"
          placeholder="Ej. Comida, Jugo de Naranja, Ensalada, Ejercicio, Pesas, Bicicleta"
          value={currentActivity.name}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-1 gap-3">
        <label htmlFor="calories" className="font-bold">
          Calorías:
        </label>
        <input
          type="number"
          name="calories"
          id="calories"
          className="border border-slate-300 p-2 rounded-lg w-full"
          placeholder="Ej. 300, 500"
          value={currentActivity.calories}
          onChange={handleChange}
        />
      </div>

      <input
        type="submit"
        value={
          currentActivity.category === 1
            ? "Guardar Comida"
            : "Guardar Ejercicio"
        }
        className="bg-gray-800 hover:bg-gray-900 w-full p-2 font-bold uppercase text-white cursor-pointer disabled:opacity-10"
        disabled={!isValidActivity()}
      />
    </form>
  );
};

export default Form;
