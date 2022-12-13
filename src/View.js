import hh from "hyperscript-helpers";
import { h } from "virtual-dom";
import * as R from "ramda";
import { showFormMsg, weatherInputMsg, saveweatherMsg, deleteweatherMsg } from "./Update";

const { div, button, form, label, input, table, thead, tbody, tr, th, td } = hh(h);

const btnStyle = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded";
const cellStyle = "px-1 py-2 min-w-[100px]";

const tableHeader = thead([tr([cell(th, "text-left", "Weather"), cell(th, "text-left", "Temp °C"), cell(th, "text-left", "Low °C"), cell(th, "text-left", "High °C"), cell(th, "", "")])]);

function cell(tag, className, value, id = 0) {
    return tag({ className, id}, value);
  }

function weatherRow(dispatch, className, weathers) {
    let data = 0;
    const tim = weathers.temp.then(function(value){ data = value});
    setTimeout(function() {    
        document.getElementById("temp"+weathers.id).innerText = data.temp;
        document.getElementById("temp_max"+weathers.id).innerText = data.temp_max;
        document.getElementById("temp_min"+weathers.id).innerText = data.temp_min;
    }, 100);
        return tr({ className }, [
        cell(td, cellStyle, weathers.name),
        cell(td, cellStyle, data, "temp"+weathers.id),
        cell(td, cellStyle, data, "temp_max"+weathers.id),
        cell(td, cellStyle, data, "temp_min"+weathers.id),
        cell(td, cellStyle + "text-right", [
        button(
            {
              className: `${btnStyle} bg-gray-500 hover:bg-gray-700`,
              onclick: () => dispatch(deleteweatherMsg(weathers.id)),
            },
            "DELETE"
        ),
        ]),
    ]);
}

function tableView(dispatch, weathers,) {
    if (weathers.length === 0) {
      return div({ className: "pt-8 text-center" }, "no data at the moment...");
    }
    return table({ className: "mt-4" }, [tableHeader, body(dispatch, "", weathers)]);
  }

function row(weathers) {
  const row = R.pipe(
    R.map((weather) => weather),
  )
  (weathers);
}

function body(dispatch, className, weathers) {
  const rows = R.map(R.partial(weatherRow, [dispatch, "odd:bg-white even:bg-gray-100"]), weathers);

  const rowsWithTotal = [...rows, row(weathers)];

  return tbody({ className }, rowsWithTotal);
}

function fieldSet(labelText, inputValue, placeholder, oninput) {
  return div({ className: "grow flex flex-col" }, [
    label({ className: "text-gray-700 text-sm font-bold mb-2" }, labelText),
    input({
      className: "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700",
      placeholder,
      type: "text",
      value: inputValue,
      oninput,
    }),
  ]);
}

function buttonSet(dispatch) {
  return div({ className: "flex gap-4 justify-center" }, [
    button({className: `${btnStyle} bg-green-500 hover:bg-green-700`, type: "submit", onclick: () => dispatch(saveweatherMsg)}, "SAVE"),
    button({className: `${btnStyle} bg-red-500 hover:bg-red-700`, type: "button", onclick: () => dispatch(showFormMsg(false))},  "CANCEL")
  ]);
}

function formView(dispatch, model) {
  const { name, showForm,} = model;
  if (showForm) {
    return form({className: "flex flex-col gap-4", onsubmit: (e) => e.preventDefault()}, [ 
        div({ className: "flex gap-4" }, [
          fieldSet("Get the weather from:", name, "Enter the city...", (e) => dispatch(weatherInputMsg(e.target.value))),
        ]),
        buttonSet(dispatch),
    ]);
  }
  return button(
    {
      className: `${btnStyle} max-w-xs`,
      onclick: () => dispatch(showFormMsg(true)),
    },
    "ADD THE WEATHER"
  );
}

function view(dispatch, model) {
  return div({ className: "flex flex-col" }, [formView(dispatch, model), tableView(dispatch, model.weathers)]);
}

export default view;