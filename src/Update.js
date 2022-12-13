import * as R from 'ramda';
import axios from 'axios';
const apiAdress = "8c9918519174bfe2b7a5831a3a4535ff";

const MSGS = {
  SHOW_FORM: 'SHOW_FORM',
  weather_INPUT: 'weather_INPUT',
  DATA_GET: 'DATA_GET',
  SAVE_weather: 'SAVE_weather',
  DELETE_weather: 'DELETE_weather',
};

export function showFormMsg(showForm) {
  return {
    type: MSGS.SHOW_FORM,
    showForm,
  };
}

export const saveweatherMsg = { type: MSGS.SAVE_weather };

export function deleteweatherMsg(id) {
  return {
    type: MSGS.DELETE_weather,
    id,
  };
}

export function weatherInputMsg(name) {
  return {
    type: MSGS.weather_INPUT,
    name,
  };
}

function update(msg, model) {
  switch (msg.type) {
    case MSGS.SHOW_FORM: {
      const { showForm } = msg;
      return { ...model, showForm, name: '',};
    }
    case MSGS.weather_INPUT: {
      const { name } = msg;
      return { ...model, name };
    }
    case MSGS.DATA_GET: {
    }
    case MSGS.SAVE_weather: {
        const updatedModel = add(msg, model);
        return updatedModel;
    }
    case MSGS.DELETE_weather: {
      const { id } = msg;
      const weathers = R.filter(
        weather => weather.id !== id
      , model.weathers);
      return { ...model, weathers };
    }
  }
  return model;
}

async function getData (url) {
  const response = await axios.get(url)
      .then((resp) => {
          return resp.data
      });
  console.log(response.main);
  return response.main;
}

function add(msg, model) {
    const { nextId, name, temp, low, high } = model;
    const url = getUrl(name);
    const weather = { id: nextId, name, temp: getData(url), low, high};
    const weathers = [...model.weathers, weather]
    return {...model, weathers, nextId: nextId + 1, name: '', showForm: false};
}

function getUrl (townName) {
    return "https://api.openweathermap.org/data/2.5/weather?q=" + townName + "&units=metric&appid=" + apiAdress;
}

export default update;