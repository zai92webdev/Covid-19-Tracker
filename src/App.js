import { Select, Card, CardContent } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import './App.css';
import InfoBox from './InfoBox'
import Map from './Map'
import Table from './Table';
import { sortData } from './utils';
import LineGraph from './LineGraph'


function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 })
  const [mapZoom, setMapZoom] = useState(4);
  const [mapCountries, setMapCountries] = useState([])
  const [casesType, setCasesType] = useState('cases')

  const onCountryChange = async (event) => {
    const countryCode = (event.target.value);

    const url = countryCode === "worldwide"
      ? "https://disease.sh/v3/covid-19/all"
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`

    await fetch(url)
      .then(res => res.json())
      .then(data => {
        setCountryInfo(data);
        setCountry(countryCode);

        (countryCode === "worldwide") ? setMapCenter({ lat: 34.80746, lng: -40.4796 }) : setMapCenter([data.countryInfo.lat, data.countryInfo.long])
        setMapZoom(4);
      }).catch(err => console.log(err))
  }

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then(res => res.json())
      .then((data) => {
        setCountryInfo(data);
      })
  }, [])



  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then(res => res.json())
        .then((data) => {
          const countries = data.map(country => ({
            name: country.country,
            value: country.countryInfo.iso2 //UK,USA,JPN
          }))

          const sortedData = sortData(data);
          // console.log(sortedData)
          setCountries(countries);
          setTableData(sortedData);
          setMapCountries(data);
        })
    }
    getCountriesData();
  }, [])


  return (
    <div className="app" >
      <div className="app__map">
        <div className="app__mapChart">
          <Map casesType={casesType} countries={mapCountries} center={mapCenter} zoom={mapZoom} />
        </div>
      </div>

      <div className="app__header">
        <div className="app__headerLeft">
          <Select
            className="app__mapdropdown" variant="filled" native value={country} onChange={onCountryChange} >
            <option aria-label="None" value="worldwide">Worldwide </option>
            {countries.map((country, index) => (
              <option key={index} value={country.value}>{country.name}</option>
            ))}
          </Select>
          <h1>COVID-19 TRACKER</h1>
        </div>

        <div className="app__headerRight">
          <InfoBox
            isRed
            active={casesType === 'cases'}
            onClick={e => setCasesType('cases')}
            title="Coronavirus Cases"
            cases={countryInfo.todayCases}
            total={countryInfo.cases} />
          <InfoBox
            active={casesType === 'recovered'}
            onClick={e => setCasesType('recovered')}
            title="Recovered"
            cases={countryInfo.todayRecovered}
            total={countryInfo.recovered} />
          <InfoBox
            isRed
            active={casesType === 'deaths'}
            onClick={e => setCasesType('deaths')}
            title="Deaths"
            cases={countryInfo.todayDeaths}
            total={countryInfo.deaths} />
        </div>
      </div>

      <div className="app__chart">
        <div className="app__chartLeft">
          <Card>
            <CardContent>
              <h3>Live cases by Country</h3>
              <Table countries={tableData} />

            </CardContent>
          </Card>

        </div>
        <div className="app__chartRight">
          <LineGraph casesType={casesType} />
        </div>
      </div>

    </div >
  );
}

export default App;
